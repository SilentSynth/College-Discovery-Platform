from __future__ import annotations

from collections.abc import Iterable

from sqlalchemy import and_, desc, func, select
from sqlalchemy.orm import Session, selectinload

from app.models import AcademicYear, AdmissionProfile, College, CollegeMetricSnapshot, Course, Location, Review
from app.schemas import CollegeDetailRead, CollegeListItem, CollegeSnapshotRead, CollegeTrendPoint
from app.services.match_index import score_match


def list_colleges(session: Session, search: str | None, location: str | None, min_rating: float, max_fees_inr: int | None, page: int, limit: int) -> tuple[list[CollegeListItem], int]:
    rating_subquery = (
        select(Review.college_id.label('college_id'), func.coalesce(func.avg(Review.rating), 0).label('average_rating'))
        .group_by(Review.college_id)
        .subquery()
    )

    latest_year_subquery = select(func.max(AcademicYear.start_year)).scalar_subquery()

    metric_subquery = (
        select(
            CollegeMetricSnapshot.college_id.label('college_id'),
            CollegeMetricSnapshot.average_placement_package_lpa.label('average_package_lpa'),
            CollegeMetricSnapshot.annual_tuition_inr.label('annual_tuition_inr'),
        )
        .join(CollegeMetricSnapshot.academic_year)
        .where(AcademicYear.start_year == latest_year_subquery)
        .subquery()
    )

    statement = (
        select(
            College.id,
            College.slug,
            College.name,
            Location.city,
            Location.state,
            func.coalesce(rating_subquery.c.average_rating, 0).label('average_rating'),
            func.coalesce(metric_subquery.c.average_package_lpa, 0).label('current_average_package_lpa'),
            func.coalesce(metric_subquery.c.annual_tuition_inr, 0).label('current_annual_tuition_inr'),
        )
        .join(Location, College.location_id == Location.id)
        .outerjoin(rating_subquery, rating_subquery.c.college_id == College.id)
        .outerjoin(metric_subquery, metric_subquery.c.college_id == College.id)
    )

    if search:
        search_term = f'%{search.lower()}%'
        statement = statement.where(func.lower(College.name).ilike(search_term) | func.lower(Location.city).ilike(search_term) | func.lower(Location.state).ilike(search_term))

    if location:
        location_term = f'%{location.lower()}%'
        statement = statement.where(func.lower(Location.city).ilike(location_term) | func.lower(Location.state).ilike(location_term))

    if max_fees_inr is not None:
        statement = statement.where(func.coalesce(metric_subquery.c.annual_tuition_inr, 0) <= max_fees_inr)

    statement = statement.where(func.coalesce(rating_subquery.c.average_rating, 0) >= min_rating)
    statement = statement.order_by(desc('average_rating'), College.name.asc())

    total = session.execute(select(func.count()).select_from(statement.subquery())).scalar_one()
    rows = session.execute(statement.offset((page - 1) * limit).limit(limit)).all()

    return (
        [
            CollegeListItem(
                id=row.id,
                slug=row.slug,
                name=row.name,
                city=row.city,
                state=row.state,
                average_rating=float(row.average_rating),
                current_average_package_lpa=float(row.current_average_package_lpa),
                current_annual_tuition_inr=int(row.current_annual_tuition_inr),
            )
            for row in rows
        ],
        total,
    )


def get_college_detail(session: Session, college_id: int) -> College | None:
    statement = (
        select(College)
        .options(
            selectinload(College.location),
            selectinload(College.courses),
            selectinload(College.reviews),
            selectinload(College.snapshots).selectinload(CollegeMetricSnapshot.academic_year),
            selectinload(College.admission_profiles).selectinload(AdmissionProfile.academic_year),
        )
        .where(College.id == college_id)
    )
    return session.execute(statement).scalar_one_or_none()


def get_college_history(session: Session, college_id: int) -> list[CollegeTrendPoint]:
    statement = (
        select(CollegeMetricSnapshot)
        .join(CollegeMetricSnapshot.academic_year)
        .where(CollegeMetricSnapshot.college_id == college_id)
        .order_by(AcademicYear.start_year.asc())
    )
    rows = session.execute(statement).scalars().all()
    return [
        CollegeTrendPoint(
            academic_year=row.academic_year.label,
            average_package_lpa=row.average_placement_package_lpa,
            tuition_fee_inr=row.annual_tuition_inr,
            placement_rate=row.placement_rate,
        )
        for row in rows
    ]


def predict_match_index(session: Session, exam_name: str, rank: int, preferred_location: str | None, max_fees_inr: int | None, top_k: int) -> list[dict]:
    colleges = session.execute(
        select(College)
        .options(
            selectinload(College.location),
            selectinload(College.courses),
            selectinload(College.snapshots).selectinload(CollegeMetricSnapshot.academic_year),
            selectinload(College.admission_profiles).selectinload(AdmissionProfile.academic_year),
        )
    ).scalars().all()

    scored = []
    for college in colleges:
        current_profile = next((profile for profile in college.admission_profiles if profile.exam_name.lower() == exam_name.lower()), None)
        components = score_match(rank, preferred_location, max_fees_inr, college, current_profile)
        latest_snapshot = sorted(college.snapshots, key=lambda snapshot: snapshot.academic_year.start_year)[-1] if college.snapshots else None
        current_tuition = latest_snapshot.annual_tuition_inr if latest_snapshot else min((course.annual_tuition_inr for course in college.courses), default=0)

        if max_fees_inr is not None and current_tuition > max_fees_inr * 1.6:
            continue

        scored.append(
            {
                'college': college,
                'components': components,
                'match_index': round(components.weighted_score, 2),
            }
        )

    scored.sort(key=lambda item: item['match_index'], reverse=True)
    return scored[:top_k]