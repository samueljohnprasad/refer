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
import { createAudioPlayer, type AudioPlayer } from "expo-audio";
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
  | "timerDone"
  | "celebrationChime"
  | "pageTurn";

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
  celebrationChime: require("../../assets/sounds/celebration-chime.wav"),
  pageTurn: require("../../assets/sounds/page-turn.wav"),
};

// Singleton player cache shared across hook instances (lazy-created).
const playerCache = new Map<JourneySoundKey, AudioPlayer>();

function getPlayer(key: JourneySoundKey, source: number): AudioPlayer {
  let player = playerCache.get(key);
  if (!player) {
    player = createAudioPlayer(source);
    playerCache.set(key, player);
  }
  return player;
}

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

      try {
        const player = getPlayer(key, source);
        void player.seekTo(0).catch(() => {});
        player.play();
      } catch (error) {
        if (__DEV__) {
          console.warn(`[Sound] Failed to play ${key}:`, error);
        }
      }
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
