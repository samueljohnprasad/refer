/**
 * Sound Store
 * Jotai atom for mute/unmute state with AsyncStorage persistence.
 */

import { atom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const SOUND_MUTE_KEY = "@journey_sound_muted_v1";

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------

/** Whether all journey sound effects are muted */
export const soundMutedAtom = atom<boolean>(false);

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

/** Load mute preference from AsyncStorage */
export async function loadSoundMuted(): Promise<boolean> {
  try {
    const raw: string | null = await AsyncStorage.getItem(SOUND_MUTE_KEY);
    return raw === "true";
  } catch (error) {
    console.error("[SoundStore] Failed to load mute state:", error);
    return false;
  }
}

/** Persist mute preference to AsyncStorage */
export async function saveSoundMuted(muted: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(SOUND_MUTE_KEY, String(muted));
  } catch (error) {
    console.error("[SoundStore] Failed to save mute state:", error);
  }
}
