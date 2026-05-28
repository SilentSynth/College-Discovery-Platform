import type { PropsWithChildren } from 'react';

export function Table({ children }: PropsWithChildren) {
  return <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><table className="min-w-full border-collapse text-left text-slate-700 dark:text-slate-300">{children}</table></div>;
}