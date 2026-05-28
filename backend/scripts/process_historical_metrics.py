from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import Base
from app.models import AcademicYear, College, CollegeMetricSnapshot, Location


RAW_COLUMN_ALIASES = {
    'college': 'college_name',
    'college_name': 'college_name',
    'college_slug': 'college_slug',
    'academic_year': 'academic_year',
    'year': 'academic_year',
    'average_placement_package_lpa': 'average_package_lpa',
    'average_package_lpa': 'average_package_lpa',
    'tuition_fee_inr': 'tuition_fee_inr',
    'fees_inr': 'tuition_fee_inr',
    'placement_rate': 'placement_rate',
    'location_city': 'city',
    'city': 'city',
    'state': 'state',
    'highest_package_lpa': 'highest_package_lpa',
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Process historical college metrics and seed the normalized database.')
    parser.add_argument('--input', required=True, help='Path to the raw CSV/TSV dataset.')
    parser.add_argument('--database-url', default=settings.database_url, help='SQLAlchemy database URL.')
    return parser.parse_args()


def normalize_columns(frame: pd.DataFrame) -> pd.DataFrame:
    normalized = frame.copy()
    normalized.columns = [column.strip().lower().replace(' ', '_') for column in normalized.columns]
    normalized = normalized.rename(columns={column: alias for column, alias in RAW_COLUMN_ALIASES.items() if column in normalized.columns})
    required = ['college_name', 'college_slug', 'academic_year', 'average_package_lpa', 'tuition_fee_inr', 'highest_package_lpa', 'placement_rate', 'city', 'state']

    missing = [column for column in required if column not in normalized.columns]
    if missing:
        raise ValueError(f'Missing required columns: {", ".join(missing)}')

    normalized['academic_year'] = normalized['academic_year'].astype(str).str.strip()
    normalized['college_slug'] = normalized['college_slug'].astype(str).str.strip().str.lower().str.replace(r'[^a-z0-9]+', '-', regex=True).str.strip('-')
    normalized['average_package_lpa'] = pd.to_numeric(normalized['average_package_lpa'], errors='coerce').fillna(0.0)
    normalized['highest_package_lpa'] = pd.to_numeric(normalized['highest_package_lpa'], errors='coerce').fillna(normalized['average_package_lpa'])
    normalized['tuition_fee_inr'] = pd.to_numeric(normalized['tuition_fee_inr'], errors='coerce').fillna(0).astype(int)
    normalized['placement_rate'] = pd.to_numeric(normalized['placement_rate'], errors='coerce').fillna(0.0)
    normalized['city'] = normalized['city'].astype(str).str.strip()
    normalized['state'] = normalized['state'].astype(str).str.strip()

    return normalized.drop_duplicates(subset=['college_slug', 'academic_year']).reset_index(drop=True)


def build_longitudinal_trends(frame: pd.DataFrame) -> pd.DataFrame:
    trends = (
        frame.groupby(['college_slug', 'college_name', 'city', 'state', 'academic_year'], as_index=False)
        .agg(
            average_package_lpa=('average_package_lpa', 'mean'),
            highest_package_lpa=('highest_package_lpa', 'mean'),
            tuition_fee_inr=('tuition_fee_inr', 'mean'),
            placement_rate=('placement_rate', 'mean'),
        )
        .sort_values(['college_slug', 'academic_year'])
    )
    trends['package_growth_yoy'] = trends.groupby('college_slug')['average_package_lpa'].pct_change().fillna(0.0)
    trends['tuition_growth_yoy'] = trends.groupby('college_slug')['tuition_fee_inr'].pct_change().fillna(0.0)
    return trends


def seed_database(frame: pd.DataFrame, database_url: str) -> None:
    from app.db import Base, engine
    import app.models  # noqa: F401

    engine.dispose()
    engine = create_engine(database_url, future=True)
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        for _, row in frame.iterrows():
            location = session.execute(
                select(Location).where(Location.city == row['city'], Location.state == row['state'])
            ).scalar_one_or_none()
            if location is None:
                location = Location(city=row['city'], state=row['state'], country='India')
                session.add(location)
                session.flush()

            college = session.execute(select(College).where(College.slug == row['college_slug'])).scalar_one_or_none()
            if college is None:
                college = College(
                    slug=row['college_slug'],
                    name=row['college_name'],
                    description=f"Historical profile for {row['college_name']}",
                    website=None,
                    established_year=None,
                    location_id=location.id,
                )
                session.add(college)
                session.flush()

            label = str(row['academic_year'])
            start_year = int(label[:4]) if len(label) >= 4 and label[:4].isdigit() else 0
            end_year = start_year + 1 if start_year else start_year

            academic_year = session.execute(select(AcademicYear).where(AcademicYear.label == label)).scalar_one_or_none()
            if academic_year is None:
                academic_year = AcademicYear(label=label, start_year=start_year, end_year=end_year)
                session.add(academic_year)
                session.flush()

            snapshot = session.execute(
                select(CollegeMetricSnapshot).where(
                    CollegeMetricSnapshot.college_id == college.id,
                    CollegeMetricSnapshot.academic_year_id == academic_year.id,
                )
            ).scalar_one_or_none()
            if snapshot is None:
                snapshot = CollegeMetricSnapshot(
                    college_id=college.id,
                    academic_year_id=academic_year.id,
                    average_placement_package_lpa=float(row['average_package_lpa']),
                    highest_package_lpa=float(row['highest_package_lpa']),
                    annual_tuition_inr=int(row['tuition_fee_inr']),
                    placement_rate=float(row['placement_rate']),
                )
                session.add(snapshot)
        session.commit()


def main() -> None:
    args = parse_args()
    raw_frame = pd.read_csv(Path(args.input))
    cleaned = normalize_columns(raw_frame)
    trends = build_longitudinal_trends(cleaned)
    seed_database(trends, args.database_url)


if __name__ == '__main__':
    main()