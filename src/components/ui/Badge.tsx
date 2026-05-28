import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'accent';
  className?: string;
}

const toneClasses = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  accent: 'bg-ink-100 text-ink-800 dark:bg-ink-950/50 dark:text-ink-200',
};

export function Badge({ tone = 'neutral', className, children }: PropsWithChildren<BadgeProps>) {
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-medium', toneClasses[tone], className)}>{children}</span>;
}