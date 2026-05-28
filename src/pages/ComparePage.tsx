import { useMemo } from 'react';
import { useCompareStore } from '../state/compareStore';
import { useCompareColleges } from '../hooks/useCompareColleges';
import { CompareTable } from '../components/college/CompareTable';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export function ComparePage() {
  const selectedCollegeIds = useCompareStore((state) => state.selectedCollegeIds);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const query = useCompareColleges(selectedCollegeIds);

  const content = useMemo(() => {
    if (selectedCollegeIds.length < 2) {
      return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600">Select at least two colleges from the listing page to compare them side by side.</div>;
    }

    if (query.isLoading) {
      return <Skeleton className="h-80 w-full rounded-3xl" />;
    }

    if (query.isError || !query.data) {
      return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">Unable to load comparison data.</div>;
    }

    return <CompareTable colleges={query.data.colleges} />;
  }, [query.data, query.isError, query.isLoading, selectedCollegeIds.length]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-700">Side-by-side comparison</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Compare colleges</h2>
          </div>
          <Button variant="outline" onClick={clearCompare}>
            Clear compare tray
          </Button>
        </div>
      </div>

      {content}
    </div>
  );
}