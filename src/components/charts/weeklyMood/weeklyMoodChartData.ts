import { addDays, differenceInCalendarDays, format } from "date-fns";
import type { MoodsMap } from "@/hooks/data/useFetchMoods";
import type { DailyMoodsMap } from "@/hooks/data/useFetchDailyMoods";
import { clampToMoodScore } from "@/constants/moodColors";

export interface ChartPoint {
  x: string;
  y: number | null;
  dateKey: string;
}

export interface DailyChartPoint {
  x: string;
  y: number | null;
  timeKey: string;
  exactTime?: string;
}

export interface NumericPoint {
  x: number;
  y: number;
  label: string;
  exactTime?: string;
}

export type MoodLevel = "Terrible" | "Bad" | "Fine" | "Good" | "Great";
export type MoodTranslationKey = "great" | "good" | "fine" | "bad" | "terrible";

export const moodTranslationKey: Record<MoodLevel, MoodTranslationKey> = {
  Great: "great",
  Good: "good",
  Fine: "fine",
  Bad: "bad",
  Terrible: "terrible",
};

export function moodLevelForScore(score: number): MoodLevel {
  switch (clampToMoodScore(score)) {
    case 5: return "Great";
    case 4: return "Good";
    case 3: return "Fine";
    case 2: return "Bad";
    default: return "Terrible";
  }
}

export function twoLetterDow(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { weekday: "short" })
    .format(date)
    .replace(/[.\s]/g, "")
    .slice(0, 2)
    .toLocaleUpperCase(locale);
}

const DAILY_TIME_SLOTS = Array.from({ length: 48 }, (_, index) => {
  const hour = Math.floor(index / 2).toString().padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

function formatTimeLabel(timeSlot: string, locale: string): string {
  const [hour, minute] = timeSlot.split(":").map(Number);
  const date = new Date(2020, 0, 1, hour, minute);
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(date);
}

export function buildChartData(start: Date, end: Date, moodMap: MoodsMap, locale: string): ChartPoint[] {
  const totalDays = differenceInCalendarDays(end, start) + 1;
  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(start, index);
    const key = format(date, "yyyy-MM-dd");
    return { x: twoLetterDow(date, locale), y: moodMap.get(key) ?? null, dateKey: key };
  });
}

export function buildDailyChartData(moodMap: DailyMoodsMap, locale: string): DailyChartPoint[] {
  return DAILY_TIME_SLOTS.map((timeSlot) => {
    const value = moodMap.get(timeSlot);
    return {
      x: formatTimeLabel(timeSlot, locale),
      y: value ? value.mood_score : null,
      timeKey: timeSlot,
      exactTime: value ? value.selected_date : undefined,
    };
  });
}
