import { useQuery } from '@tanstack/react-query';
import { collegeService } from '../services/collegeService';

export function useCollegeTrends(id?: string) {
  return useQuery({
    queryKey: ['college-trends', id],
    queryFn: () => collegeService.getCollegeTrends(id ?? ''),
    enabled: Boolean(id),
  });
}