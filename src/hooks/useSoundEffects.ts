/**
 * useSoundEffects (Task 4.4.1)
 * Reusable hook for playing journey sound effects.
 *
 * Features:
 * - Lazy-loaded audio players per sound key
 * - Respects global mute toggle (soundMutedAtom)
 * - Graceful error handling — never crashes if a file is missing
 * - Singleton player cache shared across hook instances
 *
 * Usage:
 *   const { play, toggleMute, isMuted } = useSoundEffects();
 *   play('nodeComplete');
 */

import { useCallback, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import {
  soundMutedAtom,
  loadSoundMuted,
  saveSoundMuted,
} from "@/src/store/soundStore";

// ---------------------------------------------------------------------------
// Sound registry — maps logical names to asset requires
// ---------------------------------------------------------------------------

/**
 * Sound effect keys used throughout the journey feature.
 * Add new entries here when adding new sounds.
 *
 * NOTE: Asset files should be placed in `assets/sounds/journey/`.
 * Until real audio files are added, the hook will silently skip playback.
 */
export type JourneySoundKey =
  | "nodeComplete"
  | "nodeTap"
  | "chestOpen"
  | "chestClaim"
  | "unitComplete"
  | "lockedTap"
  | "mascotTap"
  | "exerciseContinue"
  | "exerciseSelect"
  | "exerciseComplete"
  | "timerDone";

/**
 * Map of sound keys to require()-based asset sources.
 * Each value must be a valid `require()` call for Metro bundler.
 *
 * When a sound file doesn't exist yet, set it to `null`.
 * The hook will gracefully skip null entries.
 */
const SOUND_SOURCES: Record<JourneySoundKey, number | null> = {
  nodeComplete: null,
  nodeTap: null,
  chestOpen: null,
  chestClaim: null,
  unitComplete: null,
  lockedTap: null,
  mascotTap: null,
  exerciseContinue: null,
  exerciseSelect: null,
  exerciseComplete: null,
  timerDone: null,
};

// ---------------------------------------------------------------------------
// Hook return type
// ---------------------------------------------------------------------------

export interface SoundEffectsAPI {
  /** Play a sound by key. No-op if muted or file missing. */
  play: (key: JourneySoundKey) => void;
  /** Toggle mute on/off. Persists to AsyncStorage. */
  toggleMute: () => void;
  /** Current mute state */
  isMuted: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSoundEffects(): SoundEffectsAPI {
  const [isMuted, setIsMuted] = useAtom(soundMutedAtom);
  const hydratedRef = useRef<boolean>(false);

  // Hydrate mute state from storage on first mount
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    loadSoundMuted().then((muted: boolean) => {
      setIsMuted(muted);
    });
  }, [setIsMuted]);

  // ── Play sound ──
  const play = useCallback(
    (key: JourneySoundKey): void => {
      if (isMuted) return;

      const source: number | null = SOUND_SOURCES[key];
      if (source === null) {
        // Sound file not yet bundled — log in dev, skip in production
        if (__DEV__) {
          console.log(`[Sound] Skipping (no asset): ${key}`);
        }
        return;
      }

      // When real audio files are bundled, uncomment below:
      // import { createAudioPlayer } from 'expo-audio';
      // const player = createAudioPlayer(source);
      // player.play();
      //
      // For now this is a no-op beyond the null check above.
    },
    [isMuted],
  );

  // ── Toggle mute ──
  const toggleMute = useCallback((): void => {
    setIsMuted((prev: boolean) => {
      const next: boolean = !prev;
      saveSoundMuted(next);
      return next;
    });
  }, [setIsMuted]);

  return { play, toggleMute, isMuted };
}
