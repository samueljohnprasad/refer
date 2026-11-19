// AD-26: device outbox for failed thought_catcher writes, keyed by entry id. Never cleared by time.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExerciseSavePayload } from '@/src/types/exerciseFlow';

const KEY = '@happy/thought_catcher_outbox_v1';

export interface OutboxItem { id: string; payload: ExerciseSavePayload }

export async function readOutbox(): Promise<OutboxItem[]> {
  try {
    const parsed = JSON.parse((await AsyncStorage.getItem(KEY)) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

const write = (items: OutboxItem[]) => AsyncStorage.setItem(KEY, JSON.stringify(items));

// read-modify-write runs one at a time so a replay's drop can't erase a payload queued meanwhile
let chain: Promise<void> = Promise.resolve();
const serial = (fn: () => Promise<void>): Promise<void> => (chain = chain.then(fn, fn));

/** A later payload for the same id replaces the earlier one in place. */
export const queueSave = (id: string, payload: ExerciseSavePayload): Promise<void> => serial(async () => {
  try {
    const items = await readOutbox();
    const i = items.findIndex((x) => x.id === id);
    if (i >= 0) items[i] = { id, payload }; else items.push({ id, payload });
    await write(items);
  } catch { /* ponytail: storage failed, the local reflection cache still holds the entry */ }
});

/** With `payload`, drops only if the stored payload is still that one (a newer write may have replaced it). */
export const dropQueued = (id: string, payload?: ExerciseSavePayload): Promise<void> => serial(async () => {
  try {
    const items = await readOutbox();
    const rest = items.filter((x) => x.id !== id || (payload !== undefined && JSON.stringify(x.payload) !== JSON.stringify(payload)));
    if (rest.length !== items.length) await write(rest);
  } catch { /* ponytail: a stale item replays as an idempotent upsert */ }
});
