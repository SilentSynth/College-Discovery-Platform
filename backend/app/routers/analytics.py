from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas import CollegeTrendPoint
from app.services.college_service import get_college_detail, get_college_history

router = APIRouter(tags=['analytics'])


@router.get('/colleges/{college_id}/history', response_model=list[CollegeTrendPoint])
def read_history(college_id: int, session: Session = Depends(get_db)) -> list[CollegeTrendPoint]:
    college = get_college_detail(session, college_id)
    if college is None:
        raise HTTPException(status_code=404, detail='College not found')

    return get_college_history(session, college_id)