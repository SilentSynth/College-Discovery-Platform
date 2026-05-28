import type { College } from '../../types/college';
import { CollegeCard } from './CollegeCard';

interface CollegeGridProps {
  colleges: College[];
}

export function CollegeGrid({ colleges }: CollegeGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {colleges.map((college) => (
        <CollegeCard key={college.id} college={college} />
      ))}
    </div>
  );
}