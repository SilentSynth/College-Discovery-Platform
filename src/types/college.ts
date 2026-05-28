export type ExamName = 'JEE Main' | 'BITSAT' | 'State CET';

export interface CollegeCourse {
  degree: string;
  specialization: string;
  duration: string;
  tuition: string;
}

export interface CollegeReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface PlacementInfo {
  averagePackageLpa: number;
  highestPackageLpa: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface CollegeCutoff {
  minRank: number;
  maxRank: number;
}

export interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  feesPerYear: number;
  rating: number;
  description: string;
  highlights: string[];
  tags: string[];
  image?: string;
  imageColor: string;
  courses: CollegeCourse[];
  placements: PlacementInfo;
  reviews: CollegeReview[];
  examCutoffs: Record<ExamName, CollegeCutoff>;
}

export interface CollegeListFilters {
  search: string;
  location: string;
  maxFees: number;
  minRating: number;
  page: number;
  limit: number;
}

export interface CollegeTrendPoint {
  academicYear: string;
  averagePackageLpa: number;
  tuitionFeeInr: number;
  placementRate: number;
}

export interface PaginatedCollegesResponse {
  items: College[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}