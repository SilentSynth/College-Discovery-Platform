import type { ExamName } from '../../types/college';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface PredictorFormProps {
  exam: ExamName;
  rank: string;
  onExamChange: (exam: ExamName) => void;
  onRankChange: (rank: string) => void;
  onSubmit: () => void;
}

export function PredictorForm({ exam, rank, onExamChange, onRankChange, onSubmit }: PredictorFormProps) {
  return (
    <form
      className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1.3fr_1fr_auto] md:items-end dark:border-slate-800 dark:bg-slate-900"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Exam Name</label>
        <Select value={exam} onChange={(event) => onExamChange(event.target.value as ExamName)}>
          <option value="JEE Main">JEE Main</option>
          <option value="BITSAT">BITSAT</option>
          <option value="State CET">State CET</option>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rank</label>
        <Input type="number" min={1} placeholder="Enter rank" value={rank} onChange={(event) => onRankChange(event.target.value)} />
      </div>

      <Button type="submit" size="lg">
        Find colleges
      </Button>
    </form>
  );
}