export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function countBy<T>(
  items: T[],
  keyFn: (item: T) => string,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export function topN<T>(
  items: T[],
  valueFn: (item: T) => number,
  n: number,
): T[] {
  return [...items].sort((a, b) => valueFn(b) - valueFn(a)).slice(0, n);
}
