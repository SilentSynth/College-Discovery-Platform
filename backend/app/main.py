from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import init_db
from app.routers.analytics import router as analytics_router
from app.routers.colleges import router as colleges_router
from app.routers.predict import router as predict_router


app = FastAPI(title=settings.app_name, version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('startup')
def startup_event() -> None:
    if settings.auto_create_tables:
        init_db()


@app.get('/health')
def health_check() -> dict[str, str]:
    return {'status': 'ok'}


app.include_router(colleges_router)
app.include_router(predict_router)
app.include_router(analytics_router)