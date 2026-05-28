import { NavLink, Outlet } from 'react-router-dom';
import { useCompareStore } from '../../state/compareStore';
import { cn } from '../../lib/cn';

const navItems = [
  { to: '/', label: 'Colleges' },
  { to: '/compare', label: 'Compare' },
  { to: '/predictor', label: 'Predictor' },
];

export function AppShell() {
  const compareCount = useCompareStore((state) => state.selectedCollegeIds.length);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(91,114,242,0.12),_transparent_36%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-700">College Discovery Platform</p>
            <h1 className="text-lg font-semibold text-slate-900 md:text-xl">Find, compare, and shortlist colleges faster</h1>
          </div>
          <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive ? 'bg-ink-700 text-white' : 'text-slate-600 hover:bg-slate-100',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 md:inline-flex">{compareCount}/3 selected</span>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
}