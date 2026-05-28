import { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { Skeleton } from '../components/ui/Skeleton';

const ScrollSyncedCollegeDetail = lazy(() => import('../components/college/ScrollSyncedCollegeDetail').then((module) => ({ default: module.ScrollSyncedCollegeDetail })));

export function CollegeDetailPage() {
  const { id } = useParams();

  if (!id) {
    return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">College identifier missing.</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-44 rounded-[2rem]" />
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-[520px] rounded-[2rem]" />
        </div>
      }
    >
      <ScrollSyncedCollegeDetail collegeId={id} />
    </Suspense>
  );
}