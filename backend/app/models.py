from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Location(Base):
    __tablename__ = 'locations'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    state: Mapped[str] = mapped_column(String(120), nullable=False)
    country: Mapped[str] = mapped_column(String(120), nullable=False, default='India')

    colleges: Mapped[list[College]] = relationship(back_populates='location')

    __table_args__ = (UniqueConstraint('city', 'state', 'country', name='uq_location_city_state_country'),)


class AcademicYear(Base):
    __tablename__ = 'academic_years'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    label: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    start_year: Mapped[int] = mapped_column(Integer, nullable=False)
    end_year: Mapped[int] = mapped_column(Integer, nullable=False)

    snapshots: Mapped[list[CollegeMetricSnapshot]] = relationship(back_populates='academic_year')
    reviews: Mapped[list[Review]] = relationship(back_populates='academic_year')
    admission_profiles: Mapped[list[AdmissionProfile]] = relationship(back_populates='academic_year')


class College(Base):
    __tablename__ = 'colleges'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(140), nullable=False, unique=True, index=True)
    name: Mapped[str] = mapped_column(String(240), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    established_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    location_id: Mapped[int] = mapped_column(ForeignKey('locations.id'), nullable=False)

    location: Mapped[Location] = relationship(back_populates='colleges')
    courses: Mapped[list[Course]] = relationship(back_populates='college', cascade='all, delete-orphan')
    reviews: Mapped[list[Review]] = relationship(back_populates='college', cascade='all, delete-orphan')
    snapshots: Mapped[list[CollegeMetricSnapshot]] = relationship(back_populates='college', cascade='all, delete-orphan')
    admission_profiles: Mapped[list[AdmissionProfile]] = relationship(back_populates='college', cascade='all, delete-orphan')


class Course(Base):
    __tablename__ = 'courses'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    college_id: Mapped[int] = mapped_column(ForeignKey('colleges.id'), nullable=False)
    degree: Mapped[str] = mapped_column(String(80), nullable=False)
    specialization: Mapped[str] = mapped_column(String(160), nullable=False)
    duration_years: Mapped[int] = mapped_column(Integer, nullable=False)
    annual_tuition_inr: Mapped[int] = mapped_column(Integer, nullable=False)

    college: Mapped[College] = relationship(back_populates='courses')

    __table_args__ = (UniqueConstraint('college_id', 'degree', 'specialization', name='uq_course_per_college'),)


class Review(Base):
    __tablename__ = 'reviews'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    college_id: Mapped[int] = mapped_column(ForeignKey('colleges.id'), nullable=False)
    academic_year_id: Mapped[Optional[int]] = mapped_column(ForeignKey('academic_years.id'), nullable=True)
    reviewer_name: Mapped[str] = mapped_column(String(140), nullable=False)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    review_text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    source: Mapped[Optional[str]] = mapped_column(String(140), nullable=True)

    college: Mapped[College] = relationship(back_populates='reviews')
    academic_year: Mapped[Optional[AcademicYear]] = relationship(back_populates='reviews')


class CollegeMetricSnapshot(Base):
    __tablename__ = 'college_metric_snapshots'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    college_id: Mapped[int] = mapped_column(ForeignKey('colleges.id'), nullable=False)
    academic_year_id: Mapped[int] = mapped_column(ForeignKey('academic_years.id'), nullable=False)
    average_placement_package_lpa: Mapped[float] = mapped_column(Float, nullable=False)
    highest_package_lpa: Mapped[float] = mapped_column(Float, nullable=False)
    annual_tuition_inr: Mapped[int] = mapped_column(Integer, nullable=False)
    placement_rate: Mapped[float] = mapped_column(Float, nullable=False)

    college: Mapped[College] = relationship(back_populates='snapshots')
    academic_year: Mapped[AcademicYear] = relationship(back_populates='snapshots')

    __table_args__ = (UniqueConstraint('college_id', 'academic_year_id', name='uq_snapshot_college_year'),)


class AdmissionProfile(Base):
    __tablename__ = 'admission_profiles'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    college_id: Mapped[int] = mapped_column(ForeignKey('colleges.id'), nullable=False)
    academic_year_id: Mapped[int] = mapped_column(ForeignKey('academic_years.id'), nullable=False)
    exam_name: Mapped[str] = mapped_column(String(80), nullable=False)
    closing_rank: Mapped[int] = mapped_column(Integer, nullable=False)
    min_budget_inr: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    college: Mapped[College] = relationship(back_populates='admission_profiles')
    academic_year: Mapped[AcademicYear] = relationship(back_populates='admission_profiles')

    __table_args__ = (UniqueConstraint('college_id', 'academic_year_id', 'exam_name', name='uq_profile_per_exam_year'),)


College.__annotations__ = {  # type: ignore[attr-defined]
    'location': Location,
    'courses': list[Course],
    'reviews': list[Review],
    'snapshots': list[CollegeMetricSnapshot],
    'admission_profiles': list[AdmissionProfile],
}