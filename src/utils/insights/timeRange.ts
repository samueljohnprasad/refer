import type { TimeRange } from "@/src/constants/insights";

export function getTimeRangeCutoff(range: TimeRange): Date | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : 30;
  return new Date(Date.now() - days * 86_400_000);
}

export function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNum = Math.ceil(
    ((d.getTime() - startOfYear.getTime()) / 86_400_000 +
      startOfYear.getDay() +
      1) /
      7,
  );
  return `${year}-W${String(weekNum).padStart(2, "0")}`;
}

export function getTimeRangeDays(range: TimeRange): number {
  return range === "7d" ? 7 : range === "30d" ? 30 : 90;
}
