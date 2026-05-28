import type { PropsWithChildren } from 'react';

export function Table({ children }: PropsWithChildren) {
  return <div className="overflow-x-auto"><table className="min-w-full border-collapse text-left">{children}</table></div>;
}