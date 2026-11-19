// AD-16: what the garden showed on the last Practice visit, so only new growth animates. Device-local.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TopicCounts } from '../domain/practice';

const KEY = '@happy/garden_seen_v1';

export interface GardenSeen { topics: TopicCounts; lifetime: number }

export async function readGardenSeen(): Promise<GardenSeen | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GardenSeen) : null;
  } catch { return null; }
}

export async function writeGardenSeen(seen: GardenSeen): Promise<void> {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(seen)); } catch { /* ponytail: growth may animate again */ }
}
