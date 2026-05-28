from __future__ import annotations

from dataclasses import dataclass
from math import exp

from app.models import AdmissionProfile, College


@dataclass(frozen=True)
class MatchComponents:
    rank_score: float
    location_score: float
    fee_score: float
    rank_weight: float
    location_weight: float
    fee_weight: float

    @property
    def weighted_score(self) -> float:
        return (
            self.rank_score * self.rank_weight
            + self.location_score * self.location_weight
            + self.fee_score * self.fee_weight
        )


def clamp(value: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
    return max(minimum, min(maximum, value))


def compute_rank_score(user_rank: int, profile: AdmissionProfile | None) -> float:
    if profile is None:
        return 48.0

    closing_rank = max(profile.closing_rank, 1)
    distance = abs(user_rank - closing_rank)
    scale = max(closing_rank * 0.65, 500)
    return clamp(100.0 * exp(-distance / scale))


def compute_location_score(preferred_location: str | None, college: College) -> float:
    if not preferred_location:
        return 62.0

    target = preferred_location.strip().lower()
    city = college.location.city.lower()
    state = college.location.state.lower()

    if target == city or target == state:
        return 100.0
    if target in f'{city} {state}' or target in f'{state} {city}':
        return 92.0
    if target in city or target in state:
        return 78.0
    return 35.0


def compute_fee_score(max_fees_inr: int | None, tuition_inr: int) -> float:
    if max_fees_inr is None:
      return 68.0

    if tuition_inr <= max_fees_inr:
        return 100.0

    overrun_ratio = (tuition_inr - max_fees_inr) / max(max_fees_inr, 1)
    return clamp(100.0 - overrun_ratio * 140.0)


def compute_weights(preferred_location: str | None, max_fees_inr: int | None, tuition_inr: int, user_rank: int, profile: AdmissionProfile | None) -> MatchComponents:
    rank_weight = 0.52
    location_weight = 0.24
    fee_weight = 0.24

    if preferred_location:
        location_weight *= 1.15
        rank_weight *= 0.95

    if max_fees_inr is not None:
        fee_pressure = tuition_inr / max(max_fees_inr, 1)
        fee_weight *= 1.1 if fee_pressure > 1 else 0.92

    if profile is not None:
        competitiveness = user_rank / max(profile.closing_rank, 1)
        if competitiveness > 1:
            rank_weight *= 1.18
        else:
            rank_weight *= 0.95

    total = rank_weight + location_weight + fee_weight
    return MatchComponents(
        rank_score=0.0,
        location_score=0.0,
        fee_score=0.0,
        rank_weight=rank_weight / total,
        location_weight=location_weight / total,
        fee_weight=fee_weight / total,
    )


def score_match(user_rank: int, preferred_location: str | None, max_fees_inr: int | None, college: College, profile: AdmissionProfile | None) -> MatchComponents:
    rank_score = compute_rank_score(user_rank, profile)
    location_score = compute_location_score(preferred_location, college)
    fee_score = compute_fee_score(max_fees_inr, _current_tuition(college, profile))
    weights = compute_weights(preferred_location, max_fees_inr, _current_tuition(college, profile), user_rank, profile)

    return MatchComponents(
        rank_score=rank_score,
        location_score=location_score,
        fee_score=fee_score,
        rank_weight=weights.rank_weight,
        location_weight=weights.location_weight,
        fee_weight=weights.fee_weight,
    )


def _current_tuition(college: College, profile: AdmissionProfile | None) -> int:
    if profile and profile.min_budget_inr:
        return profile.min_budget_inr

    latest_snapshot = sorted(college.snapshots, key=lambda snapshot: snapshot.academic_year.start_year)[-1] if college.snapshots else None
    if latest_snapshot is not None:
        return latest_snapshot.annual_tuition_inr

    return min((course.annual_tuition_inr for course in college.courses), default=0)