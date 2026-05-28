import { useQuery } from '@tanstack/react-query';
import { collegeService } from '../services/collegeService';

export function useCollege(id?: string) {
  return useQuery({
    queryKey: ['college', id],
    queryFn: () => collegeService.getCollegeById(id ?? ''),
    enabled: Boolean(id),
  });
}