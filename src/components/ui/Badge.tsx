import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps {
  tone?: 'neutral' | 'success' | 'warning' | 'accent';
  className?: string;
}

const toneClasses = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  accent: 'bg-ink-100 text-ink-800',
};

export function Badge({ tone = 'neutral', className, children }: PropsWithChildren<BadgeProps>) {
  return <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-medium', toneClasses[tone], className)}>{children}</span>;
}