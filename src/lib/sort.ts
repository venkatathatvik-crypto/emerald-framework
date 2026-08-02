/**
 * Reads a column chosen at runtime (from a table's sort header) off a row.
 *
 * Our DTOs are exact interfaces with no index signature, so TypeScript rejects
 * a direct `as Record<string, unknown>` conversion. Widening through `unknown`
 * is the standard escape hatch, and is preferable to putting an index signature
 * on the DTOs themselves — that would silently permit typos on every other
 * property access across the app, which is exactly the class of bug that
 * `tenureMonths`, `partnerName` and `isActive` turned out to be.
 *
 * The return is deliberately `unknown`: callers must narrow before comparing.
 */
export function readSortValue<T>(row: T, field: string): unknown {
  return (row as unknown as Record<string, unknown>)[field];
}
