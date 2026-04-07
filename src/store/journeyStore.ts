/**
 * Journey Map Jotai Store
 * Central state management for the multi-journey system.
 * Uses Jotai atoms with AsyncStorage persistence.
 *
 * Architecture:
 * - journeyTemplateAtom: cached template for the active journey
 * - journeyProgressAtom: user's progress for the active journey
 * - journeyStateAtom: merged view model (template + progress → UI state)
 * - Derived atoms: currentUnitAtom, activeNodeAtom, journeyStatsAtom
 *
 * Data flow:
 * 1. Container sets the active journey slug
 * 2. Template + progress are fetched from Supabase
 * 3. mergeJourneyState() produces JourneyState
 * 4. All derived atoms re-derive from the merged state
 */

import { atom } from "jotai";
import { selectAtom } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  JourneyState,
  UnitData,
  PathNodeData,
  JourneyStats,
  JourneyTemplate,
  UserJourneyProgress,
  JourneyFlashListItem,
  JourneyNode,
  JourneyEnrollment,
  MultiJourneyState,
  JourneySwitcherItem,
} from "@/src/types/journey";
import { NodeStatus } from "@/src/types/journey";
import { MOCK_JOURNEY_STATE } from "@/src/data/journey";

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const JOURNEY_STATE_KEY = "@journey_state_v2";
const JOURNEY_TEMPLATE_CACHE_KEY = "@journey_template_cache_v1";
const ACTIVE_SLUG_KEY = "@journey_active_slug_v1";
const MULTI_JOURNEY_STATE_KEY = "@multi_journey_state_v1";

// ---------------------------------------------------------------------------
// Active journey slug
// ---------------------------------------------------------------------------

/** Which journey is currently being viewed */
export const activeJourneySlugAtom = atom<string | null>(null);

// ---------------------------------------------------------------------------
// Multi-Journey Enrollment State
// ---------------------------------------------------------------------------

/** All user enrollments — the source of truth for the journey switcher */
export const journeyEnrollmentsAtom = atom<JourneyEnrollment[]>([]);

/** Whether the user has any active enrollments (drives empty state vs map) */
export const hasActiveEnrollmentAtom = atom<boolean>((get) => {
  const enrollments: JourneyEnrollment[] = get(journeyEnrollmentsAtom);
  return enrollments.some(
    (e: JourneyEnrollment) => e.status === "active" && !e.isArchived,
  );
});

/** Active (non-archived) enrollments for the journey switcher */
export const activeEnrollmentsAtom = atom<JourneyEnrollment[]>((get) => {
  const enrollments: JourneyEnrollment[] = get(journeyEnrollmentsAtom);
  return enrollments.filter((e: JourneyEnrollment) => !e.isArchived);
});

/** Items formatted for the journey switcher bottom sheet */
export const journeySwitcherItemsAtom = atom<JourneySwitcherItem[]>((get) => {
  const enrollments: JourneyEnrollment[] = get(activeEnrollmentsAtom);
  const activeSlug: string | null = get(activeJourneySlugAtom);
  return enrollments.map(
    (e: JourneyEnrollment): JourneySwitcherItem => ({
      slug: e.slug,
      title: e.title,
      progressPercent: e.progressPercent,
      currentUnitTitle: e.currentUnitTitle,
      colorScheme: e.colorScheme,
      isActive: e.slug === activeSlug,
      iconUrl: e.iconUrl,
      status: e.status,
    }),
  );
});

// ---------------------------------------------------------------------------
// Template cache atom
// ---------------------------------------------------------------------------

/** Cached template for the active journey (fetched from Supabase, cached locally) */
export const journeyTemplateAtom = atom<JourneyTemplate | null>(null);

// ---------------------------------------------------------------------------
// Progress atom
// ---------------------------------------------------------------------------

/** User's progress for the active journey (fetched from Supabase) */
export const journeyProgressAtom = atom<UserJourneyProgress | null>(null);

// ---------------------------------------------------------------------------
// Merged state atom (primary UI state)
// ---------------------------------------------------------------------------

/** Full merged JourneyState — the single source of truth for the UI */
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

/** Just the currentUnit index — lightweight subscription for components that don't need the full state */
export const currentUnitIndexAtom = selectAtom(
  journeyStateAtom,
  (state: JourneyState) => state.currentUnit,
);

// ---------------------------------------------------------------------------
// Per-unit granular selectors (Fix #9 — break the useMemo cascade)
// ---------------------------------------------------------------------------
// These use selectAtom with shallow equality so that a progress tick on
// unit_3.nodes[2] does NOT cause unit_1 or unit_2 subscribers to re-render.
// The selector returns the same array reference if the unit's node data
// hasn't changed.

/** Cache of per-unit selectAtom instances to avoid re-creating on every render */
const unitNodesAtomCache = new Map<string, ReturnType<typeof selectAtom>>();

/**
 * Returns a selectAtom that derives a specific unit's nodes array from journeyStateAtom.
 * Preserves referential equality — only triggers re-render when that unit's nodes change.
 */
export function unitNodesAtomFamily(
  unitId: string,
): ReturnType<typeof selectAtom> {
  let cached = unitNodesAtomCache.get(unitId);
  if (!cached) {
    cached = selectAtom(
      journeyStateAtom,
      (state: JourneyState): PathNodeData[] => {
        const unit: UnitData | undefined = state.units.find(
          (u: UnitData) => u.id === unitId,
        );
        return unit?.nodes ?? [];
      },
    );
    unitNodesAtomCache.set(unitId, cached);
  }
  return cached;
}

/** Cache of per-unit UnitData selectAtoms */
const unitDataAtomCache = new Map<string, ReturnType<typeof selectAtom>>();

/**
 * Returns a selectAtom that derives a specific UnitData from journeyStateAtom.
 * Only triggers re-render when that specific unit's data changes.
 */
export function unitDataAtomFamily(
  unitId: string,
): ReturnType<typeof selectAtom> {
  let cached = unitDataAtomCache.get(unitId);
  if (!cached) {
    cached = selectAtom(
      journeyStateAtom,
      (state: JourneyState): UnitData | undefined =>
        state.units.find((u: UnitData) => u.id === unitId),
    );
    unitDataAtomCache.set(unitId, cached);
  }
  return cached;
}

/** The full units array — preserves reference when units haven't changed */
export const unitsAtom = selectAtom(
  journeyStateAtom,
  (state: JourneyState): UnitData[] => state.units,
);

/** Active enrollment ID (for API calls) */
export const enrollmentIdAtom = atom<string | null>((get) => {
  const progress: UserJourneyProgress | null = get(journeyProgressAtom);
  return progress?.enrollment.id ?? null;
});

// ---------------------------------------------------------------------------
// FlashList segment-per-cell atoms
// ---------------------------------------------------------------------------

/**
 * Pre-computed flat array for FlashList rendering.
 * Built once by buildJourneyNodes(), stored here, never mutated after init.
 * FlashList cells subscribe to individual items via nodeStatusAtomFamily.
 */
export const journeyFlashListAtom = atom<JourneyFlashListItem[]>([]);

/**
 * Index of the currently active node in the FlashList array.
 * Used for scrollToIndex on mount and scroll-to-active button.
 */
export const activeFlashListIndexAtom = atom<number>((get) => {
  const items: JourneyFlashListItem[] = get(journeyFlashListAtom);
  return items.findIndex(
    (item: JourneyFlashListItem) =>
      item.itemType === "node" &&
      (item as JourneyNode).status === NodeStatus.ACTIVE,
  );
});

/**
 * Per-node status atom family.
 * Each JourneyNodeCell subscribes to exactly its own status via selectAtom.
 * Completing a node writes to two atoms (nodeId + nextNodeId) — nothing else re-renders.
 */
const nodeStatusAtomCache = new Map<string, ReturnType<typeof selectAtom>>();

export function nodeStatusAtomFamily(
  nodeId: string,
): ReturnType<typeof selectAtom> {
  let cached = nodeStatusAtomCache.get(nodeId);
  if (!cached) {
    cached = selectAtom(
      journeyFlashListAtom,
      (items: JourneyFlashListItem[]): NodeStatus => {
        const node: JourneyFlashListItem | undefined = items.find(
          (item: JourneyFlashListItem) =>
            item.itemType === "node" && item.id === nodeId,
        );
        if (!node || node.itemType !== "node") return NodeStatus.LOCKED;
        return (node as JourneyNode).status;
      },
    );
    nodeStatusAtomCache.set(nodeId, cached);
  }
  return cached;
}

/** Count of node items in the FlashList (excludes dividers and mascots) */
export const flashListNodeCountAtom = selectAtom(
  journeyFlashListAtom,
  (items: JourneyFlashListItem[]): number =>
    items.filter((item: JourneyFlashListItem) => item.itemType === "node")
      .length,
);

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
  const firstUnit = s.units[0] as Record<string, unknown> | undefined;
  if (!firstUnit || !Array.isArray(firstUnit.nodes)) return false;
  return true;
}

/** Load persisted merged journey state from AsyncStorage (offline fallback) */
export async function loadJourneyState(): Promise<JourneyState | null> {
  try {
    const raw: string | null = await AsyncStorage.getItem(JOURNEY_STATE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!isValidJourneyState(parsed)) {
      console.warn(
        "[JourneyStore] Corrupted state detected, resetting to defaults",
      );
      await AsyncStorage.removeItem(JOURNEY_STATE_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("[JourneyStore] Failed to load state:", error);
    await AsyncStorage.removeItem(JOURNEY_STATE_KEY).catch(() => { });
    return null;
  }
}

/** Persist merged journey state to AsyncStorage (offline backup) */
export async function saveJourneyState(state: JourneyState): Promise<void> {
  try {
    await AsyncStorage.setItem(JOURNEY_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("[JourneyStore] Failed to save state:", error);
  }
}

/** Clear persisted journey state */
export async function clearJourneyState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(JOURNEY_STATE_KEY);
  } catch (error) {
    console.error("[JourneyStore] Failed to clear state:", error);
  }
}

// ---------------------------------------------------------------------------
// Template cache persistence
// ---------------------------------------------------------------------------

/** Cache a journey template locally for offline access */
export async function cacheTemplate(
  slug: string,
  template: JourneyTemplate,
): Promise<void> {
  try {
    const key = `${JOURNEY_TEMPLATE_CACHE_KEY}_${slug}`;
    await AsyncStorage.setItem(key, JSON.stringify(template));
  } catch (error) {
    console.error("[JourneyStore] Failed to cache template:", error);
  }
}

/** Load a cached journey template */
export async function loadCachedTemplate(
  slug: string,
): Promise<JourneyTemplate | null> {
  try {
    const key = `${JOURNEY_TEMPLATE_CACHE_KEY}_${slug}`;
    const raw: string | null = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as JourneyTemplate;
  } catch (error) {
    console.error("[JourneyStore] Failed to load cached template:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Active slug persistence
// ---------------------------------------------------------------------------

/** Persist the last active journey slug for session restoration */
export async function saveActiveSlug(slug: string): Promise<void> {
  try {
    await AsyncStorage.setItem(ACTIVE_SLUG_KEY, slug);
  } catch (error) {
    console.error("[JourneyStore] Failed to save active slug:", error);
  }
}

/** Load the last active journey slug */
export async function loadActiveSlug(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(ACTIVE_SLUG_KEY);
  } catch (error) {
    console.error("[JourneyStore] Failed to load active slug:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Multi-journey enrollment persistence
// ---------------------------------------------------------------------------

/** Persist the full multi-journey enrollment state */
export async function saveMultiJourneyState(
  state: MultiJourneyState,
): Promise<void> {
  try {
    await AsyncStorage.setItem(MULTI_JOURNEY_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("[JourneyStore] Failed to save multi-journey state:", error);
  }
}

/** Load persisted multi-journey enrollment state */
export async function loadMultiJourneyState(): Promise<MultiJourneyState | null> {
  try {
    const raw: string | null = await AsyncStorage.getItem(
      MULTI_JOURNEY_STATE_KEY,
    );
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray((parsed as Record<string, unknown>).enrollments)
    ) {
      return null;
    }
    return parsed as MultiJourneyState;
  } catch (error) {
    console.error("[JourneyStore] Failed to load multi-journey state:", error);
    return null;
  }
}

/** Clear persisted multi-journey state */
export async function clearMultiJourneyState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MULTI_JOURNEY_STATE_KEY);
  } catch (error) {
    console.error("[JourneyStore] Failed to clear multi-journey state:", error);
  }
}
