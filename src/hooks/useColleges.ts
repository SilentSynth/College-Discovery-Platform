import { useQuery } from '@tanstack/react-query';
import { collegeService } from '../services/collegeService';
import type { CollegeListFilters } from '../types/college';

export function useColleges(filters: CollegeListFilters) {
  return useQuery({
    queryKey: ['colleges', filters],
    queryFn: () => collegeService.getColleges(filters),
    placeholderData: (previousData) => previousData,
  });
}