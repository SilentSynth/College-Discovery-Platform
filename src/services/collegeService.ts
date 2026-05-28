import { mockColleges } from '../data/mockColleges';
import type { College, CollegeListFilters, ExamName, PaginatedCollegesResponse } from '../types/college';

const apiDelay = async (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const paginate = (items: College[], page: number, limit: number): PaginatedCollegesResponse => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    totalPages,
  };
};

export interface MatchCriteria {
  exam: ExamName;
  rank: number;
}

export interface CompareResponse {
  colleges: College[];
}

export const collegeService = {
  async getColleges(filters: CollegeListFilters): Promise<PaginatedCollegesResponse> {
    await apiDelay();

    const searchTerm = filters.search.trim().toLowerCase();
    const normalizedLocation = filters.location.trim().toLowerCase();

    const filtered = mockColleges.filter((college) => {
      const matchesSearch =
        !searchTerm ||
        college.name.toLowerCase().includes(searchTerm) ||
        college.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

      const matchesLocation = !normalizedLocation || college.city.toLowerCase() === normalizedLocation;
      const matchesFees = college.feesPerYear <= filters.maxFees;
      const matchesRating = college.rating >= filters.minRating;

      return matchesSearch && matchesLocation && matchesFees && matchesRating;
    });

    const sorted = filtered.sort((left, right) => right.rating - left.rating || left.feesPerYear - right.feesPerYear);
    return paginate(clone(sorted), filters.page, filters.limit);
  },

  async getCollegeById(id: string): Promise<College> {
    await apiDelay();
    const college = mockColleges.find((entry) => entry.id === id);

    if (!college) {
      throw new Error('College not found');
    }

    return clone(college);
  },

  async compareColleges(ids: string[]): Promise<CompareResponse> {
    await apiDelay();
    return { colleges: clone(mockColleges.filter((college) => ids.includes(college.id))).slice(0, 3) };
  },

  async getMatchedColleges(criteria: MatchCriteria): Promise<College[]> {
    await apiDelay();
    return clone(
      mockColleges.filter((college) => {
        const cutoff = college.examCutoffs[criteria.exam];
        return criteria.rank >= cutoff.minRank && criteria.rank <= cutoff.maxRank;
      }),
    ).sort((left, right) => right.rating - left.rating);
  },
};