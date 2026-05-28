import type { CollegeListFilters } from '../../types/college';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface CollegeFiltersProps {
  filters: CollegeListFilters;
  onChange: (next: Partial<CollegeListFilters>) => void;
  onReset: () => void;
}

const locationOptions = ['All', 'Bengaluru', 'Pune', 'Mumbai', 'Pilani', 'Tiruchirappalli'];

export function CollegeFilters({ filters, onChange, onReset }: CollegeFiltersProps) {
  return (
    <aside className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Filters</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Refine the discovery results by location, fees, and rating.</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Search colleges</label>
        <Input value={filters.search} placeholder="Search by college name or tag" onChange={(event) => onChange({ search: event.target.value, page: 1 })} />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
        <Select value={filters.location || 'All'} onChange={(event) => onChange({ location: event.target.value === 'All' ? '' : event.target.value, page: 1 })}>
          {locationOptions.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-slate-700">Max fees</label>
          <span className="text-sm text-slate-600 dark:text-slate-400">{formatCurrency(filters.maxFees)}</span>
        </div>
        <input
          type="range"
          min={50000}
          max={500000}
          step={5000}
          value={filters.maxFees}
          onChange={(event) => onChange({ maxFees: Number(event.target.value), page: 1 })}
          className="w-full accent-ink-700"
        />
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>50k</span>
          <span>5L</span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Minimum rating</label>
        <Select value={filters.minRating} onChange={(event) => onChange({ minRating: Number(event.target.value), page: 1 })}>
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <option key={rating} value={rating}>
              {rating === 0 ? 'Any' : `${rating}+`}
            </option>
          ))}
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={onReset}>
        Reset filters
      </Button>
    </aside>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}