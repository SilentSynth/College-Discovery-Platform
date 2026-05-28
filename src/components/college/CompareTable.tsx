import type { College } from '../../types/college';

interface CompareTableProps {
  colleges: College[];
}

type CompareMetric = 'fees' | 'placements' | 'ratings';

export function CompareTable({ colleges }: CompareTableProps) {
  const feesWinner = getWinnerIndex(colleges, 'fees');
  const placementsWinner = getWinnerIndex(colleges, 'placements');
  const ratingsWinner = getWinnerIndex(colleges, 'ratings');
  const locationWinner = getLocationWinnerIndex(colleges);

  const rows = [
    {
      label: 'Fees',
      cells: colleges.map((college) => ({ value: formatCurrency(college.feesPerYear), winner: feesWinner === college.id })),
    },
    {
      label: 'Placements (Average Package)',
      cells: colleges.map((college) => ({ value: `${college.placements.averagePackageLpa} LPA`, winner: placementsWinner === college.id })),
    },
    {
      label: 'Ratings',
      cells: colleges.map((college) => ({ value: college.rating.toFixed(1), winner: ratingsWinner === college.id })),
    },
    {
      label: 'Location',
      cells: colleges.map((college) => ({ value: college.location, winner: locationWinner === college.id })),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-[720px] w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 text-left text-sm text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            <th className="border-b border-slate-200 px-4 py-4 font-medium">Metric</th>
            {colleges.map((college) => (
              <th key={college.id} className="border-b border-slate-200 px-4 py-4 font-medium">
                {college.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="text-sm">
              <td className="border-b border-slate-100 bg-slate-50 px-4 py-4 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300">{row.label}</td>
              {row.cells.map((cell, index) => (
                <td key={`${row.label}-${index}`} className={`border-b border-slate-100 px-4 py-4 dark:border-slate-800 ${cell.winner ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getWinnerIndex(colleges: College[], metric: CompareMetric) {
  if (colleges.length === 0) {
    return '';
  }

  const sorted = [...colleges].sort((left, right) => {
    if (metric === 'fees') return left.feesPerYear - right.feesPerYear;
    if (metric === 'placements') return right.placements.averagePackageLpa - left.placements.averagePackageLpa;
    return right.rating - left.rating;
  });

  return sorted[0]?.id ?? '';
}

function getLocationWinnerIndex(colleges: College[]) {
  const exactMatches = new Map<string, number>();
  for (const college of colleges) {
    exactMatches.set(college.location, (exactMatches.get(college.location) ?? 0) + 1);
  }

  const topLocation = [...exactMatches.entries()].sort((left, right) => right[1] - left[1])[0]?.[0];
  return colleges.find((college) => college.location === topLocation)?.id ?? '';
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}