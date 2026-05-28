import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useColleges } from '../hooks/useColleges';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { CollegeFilters } from '../components/college/CollegeFilters';
import { CollegeGrid } from '../components/college/CollegeGrid';
import { Pagination } from '../components/college/Pagination';
import { CompareTray } from '../components/college/CompareTray';
import { Skeleton } from '../components/ui/Skeleton';
import type { CollegeListFilters } from '../types/college';
import { Button } from '../components/ui/Button';
import { getDefaultListingFilters, parseListingFiltersFromSearchParams, serializeListingFiltersToSearchParams } from '../lib/routeState';

const defaultFilters = getDefaultListingFilters();

export function CollegeListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<CollegeListFilters>(() => parseListingFiltersFromSearchParams(searchParams));
  const debouncedSearch = useDebouncedValue(filters.search);

  const query = useColleges({ ...filters, search: debouncedSearch });

  useEffect(() => {
    const nextSearchParams = serializeListingFiltersToSearchParams({ ...filters, search: debouncedSearch });
    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [debouncedSearch, filters, searchParams, setSearchParams]);

  useEffect(() => {
    setFilters(parseListingFiltersFromSearchParams(searchParams));
  }, [searchParams]);

  const content = useMemo(() => {
    if (query.isLoading) {
      return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
              <Skeleton className="h-28" />
              <Skeleton className="mt-4 h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-6 h-16" />
            </div>
          ))}
        </div>
      );
    }

    if (query.isError) {
      return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">Unable to load colleges right now.</div>;
    }

    if (!query.data?.items.length) {
      return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">No colleges match the current filters.</div>;
    }

    return <CollegeGrid colleges={query.data.items} />;
  }, [query.data?.items, query.isError, query.isLoading]);

  return (
    <div className="space-y-6 pb-28 md:pb-32">
      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <CollegeFilters
          filters={filters}
          onChange={(next) => setFilters((current) => ({ ...current, ...next }))}
          onReset={() => {
            setFilters(defaultFilters);
            setSearchParams(new URLSearchParams(), { replace: true });
          }}
        />

        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">College listing</h2>
                <p className="mt-1 text-sm text-slate-600">Search, filter, and compare colleges from a single responsive grid.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters(defaultFilters);
                  setSearchParams(new URLSearchParams(), { replace: true });
                }}
              >
                Clear all
              </Button>
            </div>
          </div>

          <div>{content}</div>

          {query.data ? <Pagination page={query.data.page} totalPages={query.data.totalPages} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} /> : null}
        </div>
      </section>
      <CompareTray />
    </div>
  );
}