from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class LocationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    city: str
    state: str
    country: str


class AcademicYearRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    label: str
    start_year: int
    end_year: int


class CourseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    degree: str
    specialization: str
    duration_years: int
    annual_tuition_inr: int


class ReviewRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reviewer_name: str
    rating: float
    review_text: str
    created_at: datetime
    source: str | None = None


class CollegeSnapshotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    academic_year: AcademicYearRead
    average_placement_package_lpa: float
    highest_package_lpa: float
    annual_tuition_inr: int
    placement_rate: float


class AdmissionProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    exam_name: str
    closing_rank: int
    min_budget_inr: int | None = None
    academic_year: AcademicYearRead


class CollegeListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    city: str
    state: str
    average_rating: float
    current_average_package_lpa: float
    current_annual_tuition_inr: int


class CollegeDetailRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    description: str
    website: str | None
    established_year: int | None
    location: LocationRead
    courses: list[CourseRead]
    reviews: list[ReviewRead]
    snapshots: list[CollegeSnapshotRead]
    admission_profiles: list[AdmissionProfileRead]
    average_rating: float


class CollegeTrendPoint(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    academic_year: str
    average_package_lpa: float
    tuition_fee_inr: int
    placement_rate: float


class CollegeSearchParams(BaseModel):
    search: str | None = None
    location: str | None = None
    min_rating: float = Field(default=0, ge=0, le=5)
    max_fees_inr: int | None = Field(default=None, gt=0)
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=10, ge=1, le=50)


class PredictRequest(BaseModel):
    exam_name: str = Field(min_length=2)
    rank: int = Field(gt=0)
    preferred_location: str | None = None
    max_fees_inr: int | None = Field(default=None, gt=0)
    top_k: int = Field(default=10, ge=1, le=25)


class MatchBreakdown(BaseModel):
    rank_score: float
    location_score: float
    fee_score: float
    weighted_score: float
    rank_weight: float
    location_weight: float
    fee_weight: float


class PredictResult(BaseModel):
    college: CollegeListItem
    match_index: float
    breakdown: MatchBreakdown


class PredictResponse(BaseModel):
    query: PredictRequest
    results: list[PredictResult]