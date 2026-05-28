import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCollege } from '../hooks/useCollege';
import { Button } from '../components/ui/Button';
import { CollegeDetailTabs } from '../components/college/CollegeDetailTabs';
import { Tabs } from '../components/ui/Tabs';
import { Skeleton } from '../components/ui/Skeleton';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'courses', label: 'Courses' },
  { id: 'placements', label: 'Placements' },
  { id: 'reviews', label: 'Reviews' },
];

export function CollegeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const query = useCollege(id);

  const content = useMemo(() => {
    if (query.isLoading) {
      return (
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-40" />
        </div>
      );
    }

    if (query.isError || !query.data) {
      return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">Unable to load the selected college.</div>;
    }

    return <CollegeDetailTabs college={query.data} activeTab={activeTab} />;
  }, [activeTab, query.data, query.isError, query.isLoading]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-700">College profile</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">{query.data?.name ?? 'College detail'}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{query.data?.location}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
        <div className="mt-6">{content}</div>
      </div>

      <Button variant="outline" onClick={() => navigate(-1)}>
        Back to listing
      </Button>
    </div>
  );
}