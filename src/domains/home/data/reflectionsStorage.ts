// ponytail: local-only reflection history; add Supabase sync if cross-device durability becomes a real ask.
// Extends onboarding's existing local-first pattern (onboardingStorage.ts's single-slot key) with an
// append-only array, matching .agents/home.html's lifetime count + weekly ring (refills Monday) + "mine" card.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReflectionData } from '@/src/domains/onboarding/domain/types';

const REFLECTIONS_KEY = 'happy.reflections';
export const WEEKLY_GOAL = 3;

async function readAll(): Promise<ReflectionData[]> {
  try {
    const raw = await AsyncStorage.getItem(REFLECTIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// AD-22: the one cache writer. Same id replaces in place; records without an id append.
export async function upsertReflection(reflection: ReflectionData): Promise<void> {
  try {
    const all = await readAll();
    const record = { ...reflection, at: reflection.at ?? Date.now() };
    const i = reflection.id ? all.findIndex((r) => r.id === reflection.id) : -1;
    if (i >= 0) all[i] = { ...record, at: all[i].at ?? record.at };
    else all.push(record);
    await AsyncStorage.setItem(REFLECTIONS_KEY, JSON.stringify(all));
  } catch {
    // ponytail: safe in guest mode if storage fails
  }
}

export async function getReflectionCount(): Promise<number> {
  return (await readAll()).length;
}

function startOfWeek(d: Date): number {
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffToMonday = (day + 6) % 7;
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - diffToMonday);
  return start.getTime();
}

export async function getWeeklyCount(): Promise<number> {
  const since = startOfWeek(new Date());
  const all = await readAll();
  const count = all.filter((r) => (r.at ?? 0) >= since).length;
  return Math.min(count, WEEKLY_GOAL);
}

export async function getMostRecent(): Promise<ReflectionData | null> {
  const all = await readAll();
  return all.length ? all[all.length - 1] : null;
}

/** Newest-first thought texts, de-duplicated, for the recent-thought chips. */
export async function getRecentThoughts(n: number): Promise<string[]> {
  const all = await readAll();
  const seen = new Set<string>();
  for (let i = all.length - 1; i >= 0 && seen.size < n; i--) {
    const t = all[i].source === 'personal' ? all[i].thought?.trim() : '';
    if (t) seen.add(t);
  }
  return [...seen];
}
