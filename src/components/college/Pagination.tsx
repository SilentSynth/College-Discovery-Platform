import { Button } from '../ui/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pages.map((item) => (
        <Button key={item} variant={item === page ? 'primary' : 'outline'} size="sm" onClick={() => onPageChange(item)}>
          {item}
        </Button>
      ))}
    </div>
  );
}