// ponytail: the prototype's activity list and plan vocabulary (.agents/behavioral-activation.html) —
// pure data and word helpers, no JSX. Day 0 = Monday, time 0 = morning, as the prototype stores them.
import type { BehavioralActivationResponse } from "@/src/types/exerciseFlow";

export const ACTIVITIES = [
  { value: "walk", label: "Walk outside" },
  { value: "call", label: "Call a friend" },
  { value: "cook", label: "Cook a meal" },
  { value: "tidy", label: "Tidy one corner" },
  { value: "dress", label: "Shower and dress" },
  { value: "music", label: "Play a song you love" },
  { value: "plants", label: "Water the plants" },
  { value: "draw", label: "Draw or write" },
  { value: "stretch", label: "Stretch" },
  { value: "read", label: "Read a few pages" },
] as const;

export const MAX_ACTIVITIES = 3;
export const SIZES = [10, 20, 30] as const;
export const DAYS = [
  ["M", "Monday"], ["T", "Tuesday"], ["W", "Wednesday"], ["T", "Thursday"],
  ["F", "Friday"], ["S", "Saturday"], ["S", "Sunday"],
] as const;
export const TIMES = ["Morning", "Afternoon", "Evening"] as const;

export const activityLabel = (key: string): string =>
  ACTIVITIES.find((a) => a.value === key)?.label ?? key;

export const sizeOf = (r: BehavioralActivationResponse, key: string): number => r.sizes[key] ?? SIZES[0];

export const isPlanned = (r: BehavioralActivationResponse, key: string): boolean => {
  const p = r.plans[key];
  return !!p && p.day != null && p.time != null;
};

export const whenText = (r: BehavioralActivationResponse, key: string): string => {
  const p = r.plans[key];
  return p && p.day != null && p.time != null ? `${DAYS[p.day][1]} ${TIMES[p.time].toLowerCase()}` : "";
};

export const MOOD_WORD = (v: number): string =>
  v <= 1 ? "Very low" : v <= 3 ? "Low" : v <= 6 ? "Okay" : v <= 8 ? "Good" : "Great";

export const FEEL_WORD = (v: number): string =>
  v === 0 ? "Not at all" : v <= 3 ? "A little" : v <= 6 ? "Somewhat" : v <= 9 ? "Quite a lot" : "Completely";
