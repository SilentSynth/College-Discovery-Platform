import { Link } from 'react-router-dom';
import { useCompareStore } from '../../state/compareStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function CompareTray() {
  const selectedCollegeIds = useCompareStore((state) => state.selectedCollegeIds);
  const removeCollege = useCompareStore((state) => state.removeCollege);
  const clearCompare = useCompareStore((state) => state.clearCompare);

  if (selectedCollegeIds.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Compare tray</Badge>
          <span className="text-sm text-slate-600">{selectedCollegeIds.length} college(s) selected</span>
          {selectedCollegeIds.map((collegeId) => (
            <button key={collegeId} type="button" onClick={() => removeCollege(collegeId)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200">
              {collegeId}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={clearCompare}>
            Clear
          </Button>
          <Link to="/compare">
            <Button size="sm">Compare now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}