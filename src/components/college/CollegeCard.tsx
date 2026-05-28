import { Link } from 'react-router-dom';
import type { College } from '../../types/college';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { useCompareStore } from '../../state/compareStore';

interface CollegeCardProps {
  college: College;
}

export function CollegeCard({ college }: CollegeCardProps) {
  const isSelected = useCompareStore((state) => state.isSelected(college.id));
  const toggleCollege = useCompareStore((state) => state.toggleCollege);

  return (
    <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
      <div className={`h-28 bg-gradient-to-br ${college.imageColor}`} />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link to={`/college/${college.id}`} className="text-lg font-semibold text-slate-900 hover:text-ink-700">
              {college.name}
            </Link>
            <p className="mt-1 text-sm text-slate-600">{college.location}</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Checkbox checked={isSelected} onChange={() => toggleCollege(college.id)} />
            Compare
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {college.tags.slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Fees</p>
            <p className="font-semibold text-slate-900">{formatCurrency(college.feesPerYear)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Rating</p>
            <p className="font-semibold text-slate-900">{college.rating.toFixed(1)} / 5</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg. package</p>
            <p className="font-semibold text-slate-900">{college.placements.averagePackageLpa} LPA</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-600">Top recruiter: {college.placements.topRecruiters[0]}</p>
          <Link to={`/college/${college.id}`} className="text-sm font-medium text-ink-700 hover:text-ink-800">
            View details
          </Link>
        </div>
      </div>
    </Card>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}