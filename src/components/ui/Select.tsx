import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-ink-500 focus:ring-2 focus:ring-ink-100', className)} {...props}>
      {children}
    </select>
  );
}