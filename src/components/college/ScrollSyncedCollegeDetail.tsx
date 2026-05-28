import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCollege } from '../../hooks/useCollege';
import { useCollegeTrends } from '../../hooks/useCollegeTrends';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { CollegeTrendsChart } from './CollegeTrendsChart';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Table } from '../ui/Table';
import { getCollegeImageUrl } from '../../lib/image';

interface ScrollSyncedCollegeDetailProps {
  collegeId: string;
}

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'courses', label: 'Courses' },
  { id: 'placements', label: 'Placements' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reviews', label: 'Reviews' },
];

export function ScrollSyncedCollegeDetail({ collegeId }: ScrollSyncedCollegeDetailProps) {
  const navigate = useNavigate();
  const collegeQuery = useCollege(collegeId);
  const trendsQuery = useCollegeTrends(collegeId);
  const sectionIds = useMemo(() => sections.map((section) => section.id), []);
  const activeSection = useScrollSpy(sectionIds);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (sectionId: string) => {
    sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const overviewHighlights = useMemo(() => collegeQuery.data?.highlights ?? [], [collegeQuery.data?.highlights]);

  if (collegeQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 rounded-[2rem]" />
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-[520px] rounded-[2rem]" />
      </div>
    );
  }

  if (collegeQuery.isError || !collegeQuery.data) {
    return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">Unable to load the selected college.</div>;
  }

  const college = collegeQuery.data;

  return (
    <div className="space-y-6 pb-28 md:pb-32">
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <div className="bg-[radial-gradient(circle_at_top_right,_rgba(91,114,242,0.18),_transparent_36%),linear-gradient(135deg,_#0f172a_0%,_#111827_48%,_#172554_100%)] px-6 py-8 text-white md:px-8 md:py-10 dark:bg-[radial-gradient(circle_at_top_right,_rgba(91,114,242,0.25),_transparent_36%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#1e293b_100%)]">
          <div className="max-w-4xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-ink-100">College profile</p>
            <h1 className="text-3xl font-semibold md:text-5xl">{college.name}</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-200 md:text-base">{college.description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {overviewHighlights.map((highlight) => (
                <Badge key={highlight} tone="accent" className="bg-white/10 text-white">
                  {highlight}
                </Badge>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 shadow-soft">
              <img src={getCollegeImageUrl(college)} alt={college.name} className="h-64 w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-slate-200 bg-white px-6 py-5 md:grid-cols-4 md:px-8 dark:border-slate-800 dark:bg-slate-900">
          <Stat label="Location" value={college.location} />
          <Stat label="Fees" value={formatCurrency(college.feesPerYear)} />
          <Stat label="Reviews" value={`${college.reviews.length} voices`} />
          <Stat label="Rating" value={`${college.rating.toFixed(1)} / 5`} />
        </div>
      </Card>

      <motion.nav
        layout
        className="sticky top-4 z-30 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
      >
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <motion.button
                key={section.id}
                type="button"
                layout
                onClick={() => scrollToSection(section.id)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
              >
                {isActive ? <motion.span layoutId="active-detail-tab" className="absolute inset-0 rounded-full bg-ink-700 dark:bg-ink-500" /> : null}
                <span className="relative z-10">{section.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-5">
          <DetailSection id="overview" label="Overview" activeSection={activeSection} sectionRefs={sectionRefs}>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{college.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {college.highlights.map((highlight) => (
                <Badge key={highlight}>{highlight}</Badge>
              ))}
            </div>
          </DetailSection>

          <DetailSection id="courses" label="Courses" activeSection={activeSection} sectionRefs={sectionRefs}>
            <Table>
              <thead>
                <tr className="bg-slate-50 text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                  <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Degree</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Specialization</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Duration</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium dark:border-slate-700">Tuition</th>
                </tr>
              </thead>
              <tbody>
                {college.courses.map((course) => (
                  <tr key={`${course.degree}-${course.specialization}`} className="text-sm">
                    <td className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">{course.degree}</td>
                    <td className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">{course.specialization}</td>
                    <td className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">{course.duration}</td>
                    <td className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">{course.tuition}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </DetailSection>

          <DetailSection id="placements" label="Placements" activeSection={activeSection} sectionRefs={sectionRefs}>
            <div className="grid gap-4 md:grid-cols-3">
              <Metric label="Average package" value={`${college.placements.averagePackageLpa} LPA`} />
              <Metric label="Highest package" value={`${college.placements.highestPackageLpa} LPA`} />
              <Metric label="Placement rate" value={`${college.placements.placementRate}%`} />
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/70">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Recent recruiter signals</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {college.placements.topRecruiters.map((recruiter) => (
                  <Badge key={recruiter} tone="accent">
                    {recruiter}
                  </Badge>
                ))}
              </div>
            </div>
          </DetailSection>

          <DetailSection id="analytics" label="Analytics" activeSection={activeSection} sectionRefs={sectionRefs}>
            {trendsQuery.isLoading ? <Skeleton className="h-[360px] rounded-[1.5rem]" /> : <CollegeTrendsChart points={trendsQuery.data ?? []} />}
          </DetailSection>

          <DetailSection id="reviews" label="Reviews" activeSection={activeSection} sectionRefs={sectionRefs}>
            <div className="space-y-4">
              {college.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{review.author}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
                    </div>
                    <Badge tone="success">{review.rating.toFixed(1)} / 5</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{review.text}</p>
                </div>
              ))}
            </div>
          </DetailSection>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink-700 dark:text-ink-300">Fast facts</p>
            <div className="mt-4 space-y-3 text-sm">
              <Fact label="Average rating" value={`${college.rating.toFixed(1)} / 5`} />
              <Fact label="Top recruiter" value={college.placements.topRecruiters[0] ?? 'Not listed'} />
              <Fact label="Primary focus" value={college.tags[0] ?? 'NA'} />
            </div>
          </Card>

          <Card className="p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink-700 dark:text-ink-300">Backends in play</p>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              The frontend can now fetch detail data, historical trends, and compare state from the service layer that maps to the FastAPI backend contract.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/compare">
                <Button variant="outline" size="sm">Open compare view</Button>
              </Link>
              <Link to="/predictor">
                <Button size="sm">Run predictor</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-start">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back to listing
        </Button>
      </div>
    </div>
  );
}

function DetailSection({
  id,
  label,
  activeSection,
  sectionRefs,
  children,
}: {
  id: string;
  label: string;
  activeSection: string;
  sectionRefs: import('react').MutableRefObject<Record<string, HTMLDivElement | null>>;
  children: import('react').ReactNode;
}) {
  return (
    <motion.section
      layout
      id={id}
      ref={(element: HTMLDivElement | null) => {
        sectionRefs.current[id] = element;
      }}
      className={`rounded-[1.75rem] border p-5 md:p-6 ${activeSection === id ? 'border-ink-200 bg-white shadow-soft dark:border-ink-500/40 dark:bg-slate-900' : 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60'}`}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-700">{label}</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{label}</h2>
        </div>
        {activeSection === id ? <Badge tone="accent">Reading now</Badge> : null}
      </div>
      {children}
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800">
      <p className="text-slate-500 dark:text-slate-400">{label}</p>
      <p className="max-w-[55%] text-right font-medium text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function latestPackage(snapshots: { average_placement_package_lpa: number }[]) {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1].average_placement_package_lpa.toFixed(1) : '0.0';
}

function latestHighestPackage(snapshots: { highest_package_lpa: number }[]) {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1].highest_package_lpa.toFixed(1) : '0.0';
}

function latestPlacementRate(snapshots: { placement_rate: number }[]) {
  return snapshots.length > 0 ? snapshots[snapshots.length - 1].placement_rate.toFixed(1) : '0.0';
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}