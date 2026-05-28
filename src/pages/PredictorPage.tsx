import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { collegeService } from '../services/collegeService';
import type { ExamName } from '../types/college';
import { PredictorForm } from '../components/predictor/PredictorForm';
import { CollegeGrid } from '../components/college/CollegeGrid';
import { Skeleton } from '../components/ui/Skeleton';
import { parsePredictorStateFromSearchParams, serializePredictorStateToSearchParams } from '../lib/routeState';

export function PredictorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialState = parsePredictorStateFromSearchParams(searchParams);
  const [exam, setExam] = useState<ExamName>(initialState.exam);
  const [rank, setRank] = useState(initialState.rank);
  const [submitted, setSubmitted] = useState<{ exam: ExamName; rank: number } | null>(null);

  const query = useQuery({
    queryKey: ['predictor', submitted?.exam, submitted?.rank],
    queryFn: () => collegeService.getMatchedColleges(submitted!),
    enabled: Boolean(submitted),
  });

  useEffect(() => {
    const nextSearchParams = serializePredictorStateToSearchParams(exam, rank);
    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [exam, rank, searchParams, setSearchParams]);

  useEffect(() => {
    const nextState = parsePredictorStateFromSearchParams(searchParams);
    setExam(nextState.exam);
    setRank(nextState.rank);
  }, [searchParams]);

  const content = useMemo(() => {
    if (!submitted) {
      return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Run the predictor to see colleges that fit your rank band.</div>;
    }

    if (query.isLoading) {
      return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      );
    }

    if (query.isError) {
      return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-950/50 dark:bg-rose-950/20 dark:text-rose-300">Unable to run the predictor.</div>;
    }

    if (!query.data?.length) {
      return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">No colleges matched this rank. Try a different score band or exam.</div>;
    }

    return <CollegeGrid colleges={query.data} />;
  }, [query.data, query.isError, query.isLoading, submitted]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-700">Rank predictor</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">College predictor</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">Use your exam rank to get a data-driven shortlist from the same mock API layer powering the listing and detail views.</p>
      </div>

      <PredictorForm
        exam={exam}
        rank={rank}
        onExamChange={setExam}
        onRankChange={setRank}
        onSubmit={() => {
          const parsedRank = Number(rank);
          if (Number.isFinite(parsedRank) && parsedRank > 0) {
            setSubmitted({ exam, rank: parsedRank });
          }
        }}
      />

      {submitted ? <div className="text-sm text-slate-600 dark:text-slate-400">Showing matches for {submitted.exam} rank {submitted.rank}.</div> : null}

      {content}
    </div>
  );
}