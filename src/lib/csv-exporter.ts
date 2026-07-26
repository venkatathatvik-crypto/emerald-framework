/**
 * csv-exporter.ts — Reusable, client-side CSV generator.
 *
 * Usage:
 *   exportToCsv("Audit_Logs", ["Timestamp", "Category", "Action"], [
 *     ["2024-01-01", "AUTH", "Admin Login"],
 *   ]);
 */

/** Escapes a cell value for CSV: wraps in quotes if it contains commas, quotes, or newlines. */
function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Returns the current date as YYYY-MM-DD for filename stamping. */
function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Generates a UTF-8 BOM–prefixed CSV string and triggers a browser download.
 *
 * @param baseName   — File stem, e.g. "Audit_Logs" → downloads as "Audit_Logs_2024-07-26.csv"
 * @param headers    — Column header labels
 * @param rows       — 2-D array of cell values (same order as headers)
 */
export function exportToCsv(
  baseName: string,
  headers: string[],
  rows: unknown[][],
): void {
  const headerRow = headers.map(escapeCell).join(",");
  const dataRows = rows.map((row) => row.map(escapeCell).join(","));

  // \uFEFF = UTF-8 BOM so Excel opens it without garbled characters
  const csvContent = "\uFEFF" + [headerRow, ...dataRows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${baseName}_${todayStamp()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
