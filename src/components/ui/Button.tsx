import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink-700 text-white hover:bg-ink-800 shadow-soft',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
};

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export function Button({ className, variant = 'primary', size = 'md', children, ...props }: PropsWithChildren<ButtonProps>) {
  return (
    <button className={cn('inline-flex items-center justify-center rounded-xl font-medium transition', variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  );
}