import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-700">404</p>
      <h2 className="text-3xl font-semibold text-slate-900">Page not found</h2>
      <p className="text-sm text-slate-600">The requested route does not exist in this MVP scaffold.</p>
      <Link to="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}