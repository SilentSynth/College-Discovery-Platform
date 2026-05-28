import { cn } from '../../lib/cn';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn('rounded-full px-4 py-2 text-sm font-medium transition', activeId === tab.id ? 'bg-ink-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}