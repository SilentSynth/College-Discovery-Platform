import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}>{children}</div>;
}