import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CollegeTrendPoint } from '../../types/college';
import { Card } from '../ui/Card';

interface CollegeTrendsChartProps {
  points: CollegeTrendPoint[];
}

export function CollegeTrendsChart({ points }: CollegeTrendsChartProps) {
  const chartData = useMemo(
    () =>
      points.map((point) => ({
        academicYear: point.academicYear,
        'Average Package (LPA)': point.averagePackageLpa,
        'Tuition Fee (INR)': point.tuitionFeeInr,
        'Placement Rate (%)': point.placementRate,
      })),
    [points],
  );

  if (chartData.length === 0) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Historical trend data is not available yet.</div>;
  }

  return (
    <Card className="p-4 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink-700">Trend analysis</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">10-year package and fee evolution</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Interactive line chart</p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="academicYear" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ borderRadius: '16px', borderColor: '#e2e8f0', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)' }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="Average Package (LPA)" stroke="#3240ad" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="Tuition Fee (INR)" stroke="#c2410c" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
            <Line yAxisId="left" type="monotone" dataKey="Placement Rate (%)" stroke="#047857" strokeWidth={2} strokeDasharray="6 6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}