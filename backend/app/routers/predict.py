from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import MatchBreakdown, PredictRequest, PredictResponse, PredictResult, CollegeListItem
from app.services.college_service import predict_match_index

router = APIRouter(prefix='/predict', tags=['predict'])


@router.post('', response_model=PredictResponse)
def predict_colleges(request: PredictRequest, session: Session = Depends(get_db)) -> PredictResponse:
    matches = predict_match_index(session, request.exam_name, request.rank, request.preferred_location, request.max_fees_inr, request.top_k)

    results = []
    for match in matches:
        college = match['college']
        components = match['components']
        latest_snapshot = sorted(college.snapshots, key=lambda snapshot: snapshot.academic_year.start_year)[-1] if college.snapshots else None

        results.append(
            PredictResult(
                college=CollegeListItem(
                    id=college.id,
                    slug=college.slug,
                    name=college.name,
                    city=college.location.city,
                    state=college.location.state,
                    average_rating=sum(review.rating for review in college.reviews) / len(college.reviews) if college.reviews else 0.0,
                    current_average_package_lpa=latest_snapshot.average_placement_package_lpa if latest_snapshot else 0.0,
                    current_annual_tuition_inr=latest_snapshot.annual_tuition_inr if latest_snapshot else 0,
                ),
                match_index=match['match_index'],
                breakdown=MatchBreakdown(
                    rank_score=round(components.rank_score, 2),
                    location_score=round(components.location_score, 2),
                    fee_score=round(components.fee_score, 2),
                    weighted_score=round(components.weighted_score, 2),
                    rank_weight=round(components.rank_weight, 3),
                    location_weight=round(components.location_weight, 3),
                    fee_weight=round(components.fee_weight, 3),
                ),
            )
        )

    return PredictResponse(query=request, results=results)