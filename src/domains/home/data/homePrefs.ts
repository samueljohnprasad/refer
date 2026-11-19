// AD-22: device-local Home preferences behind one adapter, one key. Clearing storage leaves valid defaults.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@happy/home_prefs_v1';

export interface HomePrefs {
  firstOpenDate: string | null; // local YYYY-MM-DD, set once
  askShownDate: string | null;
  toneCardSeen: boolean;
}

const DEFAULTS: HomePrefs = { firstOpenDate: null, askShownDate: null, toneCardSeen: false };

async function load(): Promise<HomePrefs> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
}

export async function readHomePrefs(): Promise<HomePrefs> {
  try { return await load(); } catch { return DEFAULTS; }
}

// read-modify-write one at a time; a failed read writes nothing, so stored values are never overwritten by defaults
let chain: Promise<void> = Promise.resolve();
const patch = (change: Partial<HomePrefs>): Promise<void> => (chain = chain.then(async () => {
  try { await AsyncStorage.setItem(KEY, JSON.stringify({ ...(await load()), ...change })); } catch { /* ponytail: defaults apply next read */ }
}));

/** The first-open date is written once and returned; a later call returns the stored one. */
export async function ensureFirstOpen(today: string): Promise<string> {
  const { firstOpenDate } = await readHomePrefs();
  if (firstOpenDate) return firstOpenDate;
  await patch({ firstOpenDate: today });
  return (await readHomePrefs()).firstOpenDate ?? today;
}

export const markAskShown = (day: string): Promise<void> => patch({ askShownDate: day });
export const markToneCardSeen = (): Promise<void> => patch({ toneCardSeen: true });

/** Whole local days from first open to today; 0 when the date is missing. */
export function installDayOf(firstOpenDate: string | null, today: string): number {
  if (!firstOpenDate) return 0;
  const [fy, fm, fd] = firstOpenDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  const days = Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000);
  return Number.isFinite(days) ? Math.max(0, days) : 0; // a malformed stored date counts as day 0
}
