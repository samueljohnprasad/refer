// AD-14 / AD-22: the unfinished rung-3 sitting, device-local. Exists only from the rung-2 write onward.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@happy/thought_catcher_draft_v1';

export interface PausedEntry {
  entryId: string;
  selectedDate: string; // local YYYY-MM-DD, fixed at sitting start
  text: string;
}

/** A read failure means no restore. */
export async function readPausedEntry(): Promise<PausedEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const p = raw ? (JSON.parse(raw) as Partial<PausedEntry>) : null;
    return p && p.entryId && p.selectedDate && typeof p.text === 'string' ? (p as PausedEntry) : null;
  } catch { return null; }
}

export async function writePausedEntry(entry: PausedEntry): Promise<void> {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(entry)); } catch { /* ponytail: nothing to restore next time */ }
}

export async function clearPausedEntry(): Promise<void> {
  try { await AsyncStorage.removeItem(KEY); } catch { /* ponytail: restores a stale draft at worst */ }
}
