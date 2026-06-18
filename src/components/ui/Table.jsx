import { cn } from '../../app/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Table({ columns, data, loading, empty = 'No data' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-table-header">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-2', c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-2">Loading…</td>
            </tr>
          )}
          {!loading && data?.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-2">{empty}</td>
            </tr>
          )}
          {!loading && data?.map((row, i) => (
            <tr key={row._id || i} className="border-t border-border hover:bg-row-hover transition">
              {columns.map((c) => (
                <td key={c.key} className={cn('px-4 py-3 text-ink align-middle', c.cellClassName)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, pages, total, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
      <span className="text-ink-2">
        Page {page} of {pages} · {total} records
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 w-8 rounded-md border border-border bg-surface text-ink hover:bg-surface-2 disabled:opacity-50 flex items-center justify-center"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 w-8 rounded-md border border-border bg-surface text-ink hover:bg-surface-2 disabled:opacity-50 flex items-center justify-center"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
