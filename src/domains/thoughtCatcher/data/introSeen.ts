// AD-22: device-local intro-seen flag.
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@happy/thought_catcher_intro_v1';

/** A read failure counts as seen: no intro is shown rather than a repeat. */
export async function hasSeenIntro(): Promise<boolean> {
  try { return (await AsyncStorage.getItem(KEY)) !== null; } catch { return true; }
}

export async function markIntroSeen(): Promise<void> {
  try { await AsyncStorage.setItem(KEY, '1'); } catch { /* ponytail: shows again next time */ }
}
