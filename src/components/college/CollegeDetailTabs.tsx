import type { College } from '../../types/college';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';

interface CollegeDetailTabsProps {
  college: College;
  activeTab: string;
}

export function CollegeDetailTabs({ college, activeTab }: CollegeDetailTabsProps) {
  if (activeTab === 'overview') {
    return (
      <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm leading-7 text-slate-600">{college.description}</p>
          <div className="flex flex-wrap gap-2">
            {college.highlights.map((highlight) => (
              <Badge key={highlight} tone="accent">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-700">Key facts</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Location</dt>
              <dd className="font-medium text-slate-900">{college.location}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Fees</dt>
              <dd className="font-medium text-slate-900">{formatCurrency(college.feesPerYear)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Rating</dt>
              <dd className="font-medium text-slate-900">{college.rating.toFixed(1)} / 5</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }

  if (activeTab === 'courses') {
    return (
      <Table>
        <thead>
          <tr className="bg-slate-50 text-sm text-slate-600">
            <th className="border-b border-slate-200 px-4 py-3 font-medium">Degree</th>
            <th className="border-b border-slate-200 px-4 py-3 font-medium">Specialization</th>
            <th className="border-b border-slate-200 px-4 py-3 font-medium">Duration</th>
            <th className="border-b border-slate-200 px-4 py-3 font-medium">Tuition</th>
          </tr>
        </thead>
        <tbody>
          {college.courses.map((course) => (
            <tr key={`${course.degree}-${course.specialization}`} className="text-sm">
              <td className="border-b border-slate-100 px-4 py-3">{course.degree}</td>
              <td className="border-b border-slate-100 px-4 py-3">{course.specialization}</td>
              <td className="border-b border-slate-100 px-4 py-3">{course.duration}</td>
              <td className="border-b border-slate-100 px-4 py-3">{course.tuition}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  if (activeTab === 'placements') {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Average package" value={`${college.placements.averagePackageLpa} LPA`} />
        <Metric label="Highest package" value={`${college.placements.highestPackageLpa} LPA`} />
        <Metric label="Placement rate" value={`${college.placements.placementRate}%`} />
        <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-700">Top recruiters</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {college.placements.topRecruiters.map((recruiter) => (
              <Badge key={recruiter}>{recruiter}</Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {college.reviews.map((review) => (
        <div key={review.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-slate-900">{review.author}</p>
              <p className="text-xs text-slate-500">{review.date}</p>
            </div>
            <Badge tone="success">{review.rating.toFixed(1)} / 5</Badge>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{review.text}</p>
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}