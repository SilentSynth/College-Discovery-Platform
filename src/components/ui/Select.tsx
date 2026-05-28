import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-ink-500 focus:ring-2 focus:ring-ink-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-ink-400 dark:focus:ring-ink-950/40', className)} {...props}>
      {children}
    </select>
  );
}