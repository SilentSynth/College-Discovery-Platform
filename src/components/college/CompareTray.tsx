import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCompareStore } from '../../state/compareStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function CompareTray() {
  const selectedCollegeIds = useCompareStore((state) => state.selectedCollegeIds);
  const removeCollege = useCompareStore((state) => state.removeCollege);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const previousCountRef = useRef(selectedCollegeIds.length);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (selectedCollegeIds.length > previousCountRef.current) {
      setPulse((value) => value + 1);
    }
    previousCountRef.current = selectedCollegeIds.length;
  }, [selectedCollegeIds.length]);

  if (selectedCollegeIds.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="compare-tray"
        initial={{ y: 56, opacity: 0 }}
        animate={{ y: pulse > 0 ? -6 : 0, opacity: 1, scale: pulse > 0 ? 1.01 : 1 }}
        exit={{ y: 56, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-[0_-12px_40px_rgba(2,6,23,0.45)]"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">Compare tray</Badge>
            <span className="text-sm text-slate-600 dark:text-slate-400">{selectedCollegeIds.length} college(s) selected</span>
            {selectedCollegeIds.map((collegeId) => (
              <motion.button
                key={collegeId}
                type="button"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => removeCollege(collegeId)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {collegeId}
              </motion.button>
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
      </motion.div>
    </AnimatePresence>
  );
}