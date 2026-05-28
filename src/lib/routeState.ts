import type { CollegeListFilters, ExamName } from '../types/college';

const defaultListingFilters: CollegeListFilters = {
  search: '',
  location: '',
  maxFees: 500000,
  minRating: 0,
  page: 1,
  limit: 6,
};

const allowedExamNames: ExamName[] = ['JEE Main', 'BITSAT', 'State CET'];

export function getDefaultListingFilters(): CollegeListFilters {
  return { ...defaultListingFilters };
}

export function parseListingFiltersFromSearchParams(searchParams: URLSearchParams): CollegeListFilters {
  const page = Number(searchParams.get('page') ?? defaultListingFilters.page);
  const limit = Number(searchParams.get('limit') ?? defaultListingFilters.limit);
  const maxFees = Number(searchParams.get('maxFees') ?? defaultListingFilters.maxFees);
  const minRating = Number(searchParams.get('minRating') ?? defaultListingFilters.minRating);

  return {
    search: searchParams.get('search') ?? defaultListingFilters.search,
    location: searchParams.get('location') ?? defaultListingFilters.location,
    maxFees: Number.isFinite(maxFees) ? maxFees : defaultListingFilters.maxFees,
    minRating: Number.isFinite(minRating) ? minRating : defaultListingFilters.minRating,
    page: Number.isFinite(page) && page > 0 ? page : defaultListingFilters.page,
    limit: Number.isFinite(limit) && limit > 0 ? limit : defaultListingFilters.limit,
  };
}

export function serializeListingFiltersToSearchParams(filters: CollegeListFilters): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (filters.search.trim()) searchParams.set('search', filters.search.trim());
  if (filters.location.trim()) searchParams.set('location', filters.location.trim());
  if (filters.maxFees !== defaultListingFilters.maxFees) searchParams.set('maxFees', String(filters.maxFees));
  if (filters.minRating !== defaultListingFilters.minRating) searchParams.set('minRating', String(filters.minRating));
  if (filters.page !== defaultListingFilters.page) searchParams.set('page', String(filters.page));
  if (filters.limit !== defaultListingFilters.limit) searchParams.set('limit', String(filters.limit));

  return searchParams;
}

export function parsePredictorStateFromSearchParams(searchParams: URLSearchParams) {
  const examParam = searchParams.get('exam');
  const rankParam = Number(searchParams.get('rank'));
  const exam = allowedExamNames.includes(examParam as ExamName) ? (examParam as ExamName) : 'JEE Main';
  const rank = Number.isFinite(rankParam) && rankParam > 0 ? String(rankParam) : '';

  return { exam, rank };
}

export function serializePredictorStateToSearchParams(exam: ExamName, rank: string): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (exam !== 'JEE Main') searchParams.set('exam', exam);
  if (rank.trim()) searchParams.set('rank', rank.trim());

  return searchParams;
}