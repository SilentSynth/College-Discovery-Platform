from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import CollegeDetailRead, CollegeListItem, CollegeSearchParams
from app.services.college_service import get_college_detail, get_college_history, list_colleges

router = APIRouter(prefix='/colleges', tags=['colleges'])


@router.get('', response_model=list[CollegeListItem])
def read_colleges(
    search: str | None = Query(default=None),
    location: str | None = Query(default=None),
    min_rating: float = Query(default=0, ge=0, le=5),
    max_fees_inr: int | None = Query(default=None, gt=0),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    session: Session = Depends(get_db),
) -> list[CollegeListItem]:
    items, _ = list_colleges(session, search, location, min_rating, max_fees_inr, page, limit)
    return items


@router.get('/search', response_model=dict)
def search_colleges(params: CollegeSearchParams = Depends(), session: Session = Depends(get_db)) -> dict:
    items, total = list_colleges(session, params.search, params.location, params.min_rating, params.max_fees_inr, params.page, params.limit)
    total_pages = max(1, (total + params.limit - 1) // params.limit)
    return {'items': items, 'total': total, 'page': params.page, 'limit': params.limit, 'total_pages': total_pages}


@router.get('/{college_id}', response_model=CollegeDetailRead)
def read_college(college_id: int, session: Session = Depends(get_db)) -> CollegeDetailRead:
    college = get_college_detail(session, college_id)
    if college is None:
        raise HTTPException(status_code=404, detail='College not found')

    average_rating = sum(review.rating for review in college.reviews) / len(college.reviews) if college.reviews else 0.0
    return CollegeDetailRead.model_validate({**college.__dict__, 'average_rating': average_rating})


@router.get('/{college_id}/history', response_model=list[dict])
def read_college_history(college_id: int, session: Session = Depends(get_db)) -> list[dict]:
    return [point.model_dump() for point in get_college_history(session, college_id)]