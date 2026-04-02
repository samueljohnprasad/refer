/**
 * Journey Map Jotai Store
 * Central state management for the journey map feature.
 * Uses Jotai atoms with AsyncStorage persistence.
 *
 * Atoms:
 * - journeyStateAtom: full JourneyState (persisted)
 * - currentUnitAtom: derived — the active UnitData
 * - activeNodeAtom: derived — the currently active PathNodeData
 * - journeyStatsAtom: derived — user stats for the header
 */

import { atom } from "jotai";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  JourneyState,
  UnitData,
  PathNodeData,
  JourneyStats,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import { MOCK_JOURNEY_STATE } from "@/src/data/journey";

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const JOURNEY_STORAGE_KEY = "@journey_state_v1";

// ---------------------------------------------------------------------------
// Base atom (writable)
// ---------------------------------------------------------------------------

/** Primary journey state atom — initialized with mock data */
export const journeyStateAtom = atom<JourneyState>(MOCK_JOURNEY_STATE);

// ---------------------------------------------------------------------------
// Derived atoms (read-only)
// ---------------------------------------------------------------------------

/** Current unit based on journeyState.currentUnit index */
export const currentUnitAtom = atom<UnitData>((get) => {
  const state: JourneyState = get(journeyStateAtom);
  return state.units[state.currentUnit];
});

/** The currently active node (first node with ACTIVE status in current unit) */
export const activeNodeAtom = atom<PathNodeData | null>((get) => {
  const unit: UnitData = get(currentUnitAtom);
  return (
    unit.nodes.find((n: PathNodeData) => n.status === NodeStatus.ACTIVE) ?? null
  );
});

/** Journey stats for the header */
export const journeyStatsAtom = atom<JourneyStats>((get) => {
  const state: JourneyState = get(journeyStateAtom);
  return state.stats;
});

/** Count of completed nodes in current unit */
export const completedCountAtom = atom<number>((get) => {
  const unit: UnitData = get(currentUnitAtom);
  return unit.nodes.filter(
    (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
  ).length;
});

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

/**
 * Validate that a parsed object has the required JourneyState shape.
 * Returns true only if all critical fields exist with correct types.
 */
function isValidJourneyState(obj: unknown): obj is JourneyState {
  if (!obj || typeof obj !== "object") return false;
  const s = obj as Record<string, unknown>;
  if (typeof s.currentUnit !== "number") return false;
  if (!Array.isArray(s.units) || s.units.length === 0) return false;
  if (!s.stats || typeof s.stats !== "object") return false;
  // Validate first unit has nodes array
  const firstUnit = s.units[0] as Record<string, unknown> | undefined;
  if (!firstUnit || !Array.isArray(firstUnit.nodes)) return false;
  return true;
}

/** Load persisted journey state from AsyncStorage with corruption recovery */
export async function loadJourneyState(): Promise<JourneyState | null> {
  try {
    const raw: string | null = await AsyncStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!isValidJourneyState(parsed)) {
      console.warn(
        "[JourneyStore] Corrupted state detected, resetting to defaults",
      );
      await AsyncStorage.removeItem(JOURNEY_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("[JourneyStore] Failed to load state:", error);
    // Remove corrupted data so next load starts fresh
    await AsyncStorage.removeItem(JOURNEY_STORAGE_KEY).catch(() => {});
    return null;
  }
}

/** Persist journey state to AsyncStorage */
export async function saveJourneyState(state: JourneyState): Promise<void> {
  try {
    await AsyncStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("[JourneyStore] Failed to save state:", error);
  }
}

/** Clear persisted journey state */
export async function clearJourneyState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(JOURNEY_STORAGE_KEY);
  } catch (error) {
    console.error("[JourneyStore] Failed to clear state:", error);
  }
}
