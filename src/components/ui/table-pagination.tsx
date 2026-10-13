import { Button } from "@/components/ui/button";

/** Rows per page, everywhere. Server queries ask for this many. */
export const PAGE_SIZE = 10;

interface TablePaginationProps {
  /** Zero-based, matching the API's own page numbering. */
  page: number;
  totalPages: number;
  totalItems: number;
  /** True on the final page; the API reports this directly. */
  isLast?: boolean;
  onPageChange: (next: number) => void;
  className?: string;
}

/**
 * The pagination footer used under every table, so they all behave the same.
 *
 * Renders nothing when everything fits on one page — which is why it is safe to
 * put under short tables too. Sits bottom-right, under the table body.
 */
export function TablePagination({
  page,
  totalPages,
  totalItems,
  isLast,
  onPageChange,
  className = "",
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const onLastPage = isLast ?? page >= totalPages - 1;

  return (
    <div
      className={`flex flex-wrap items-center justify-end gap-x-4 gap-y-2 pt-4 text-sm text-muted-foreground ${className}`}
    >
      <span>
        Page {page + 1} of {totalPages} · {totalItems} total
      </span>
      <div className="flex gap-2">
        <Button
          variant="pillOutline"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(Math.max(0, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="pillOutline"
          size="sm"
          disabled={onLastPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

/**
 * Slices already-loaded rows into a page — a partner's branches, a branch's
 * agents, filtered audit logs — where there is no paged endpoint to call.
 *
 * A plain function, not a hook, on purpose: these screens return early while
 * their data loads, and a hook called after that early return would break the
 * rules of hooks. The caller keeps the page number in its own useState,
 * declared with the rest of its state.
 *
 * The returned `page` is clamped to the last page, so filtering down to three
 * results while on page 4 shows the remaining rows rather than an empty table.
 */
export function paginate<T>(rows: T[], page: number, pageSize: number = PAGE_SIZE) {
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(0, page), totalPages - 1);
  return {
    pageRows: rows.slice(safePage * pageSize, safePage * pageSize + pageSize),
    page: safePage,
    totalPages,
    totalItems,
  };
}
