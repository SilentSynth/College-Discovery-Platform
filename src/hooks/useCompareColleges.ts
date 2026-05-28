import { useQuery } from '@tanstack/react-query';
import { collegeService } from '../services/collegeService';

export function useCompareColleges(ids: string[]) {
  return useQuery({
    queryKey: ['compare', ids],
    queryFn: () => collegeService.compareColleges(ids),
    enabled: ids.length >= 2,
  });
}