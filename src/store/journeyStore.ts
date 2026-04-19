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
import type {
  SectionMapResponse,
  SectionListItem,
  NodeContentResponse,
  SectionViewMode,
} from "@/src/types/journey/sectionMap";
import { createLogger } from "@/src/lib/logger";

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const JOURNEY_STATE_KEY = "@journey_state_v2";
const JOURNEY_TEMPLATE_CACHE_KEY = "@journey_template_cache_v1";
const ACTIVE_SLUG_KEY = "@journey_active_slug_v1";
const MULTI_JOURNEY_STATE_KEY = "@multi_journey_state_v1";
const SECTION_MAP_CACHE_KEY = "@section_map_cache_v2";
const NODE_CONTENT_CACHE_KEY = "@node_content_cache_v1";
const log = createLogger("JourneyStore");

/** Cache TTL: 24 hours in milliseconds */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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

/** Full merged JourneyState — the single source of truth for the UI.
 * Initial value is empty — real data loaded by useSectionData hook
 * (via sectionMapBridge). Previously populated by useJourneyData (deprecated). */
export const journeyStateAtom = atom<JourneyState>({
  units: [],
  currentUnit: 0,
  lastActiveNodeId: "",
  stats: {
    streakDays: 0,
    wallet: {
      coins: 0,
      gems: 0,
    },
    hearts: 5,
    totalXP: 0,
  },
});

// ---------------------------------------------------------------------------
// Derived atoms (read-only)
// ---------------------------------------------------------------------------

/** Current unit based on journeyState.currentUnit index */
export const currentUnitAtom = atom<UnitData | undefined>((get) => {
  const state: JourneyState = get(journeyStateAtom);
  return state.units[state.currentUnit];
});

/** The currently active node (first node with ACTIVE status in current unit) */
export const activeNodeAtom = atom<PathNodeData | null>((get) => {
  const unit: UnitData | undefined = get(currentUnitAtom);
  if (!unit) return null;
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
  const unit: UnitData | undefined = get(currentUnitAtom);
  if (!unit) return 0;
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
  const activeIndex = items.findIndex(
    (item: JourneyFlashListItem) =>
      item.itemType === "node" &&
      (item as JourneyNode).status === NodeStatus.ACTIVE,
  );
  if (activeIndex >= 0) return activeIndex;

  const fallbackNodeId: string = get(journeyStateAtom).lastActiveNodeId;
  if (!fallbackNodeId) return -1;

  return items.findIndex(
    (item: JourneyFlashListItem) =>
      item.itemType === "node" && item.id === fallbackNodeId,
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
// Section Map: Atoms (lazy-loaded architecture)
// ---------------------------------------------------------------------------

/** Current section map response — the active section being viewed */
export const currentSectionMapAtom = atom<SectionMapResponse | null>(null);

/** Section list for sticky header tabs — derived from section map */
export const sectionListAtom = atom<SectionListItem[]>(
  (get): SectionListItem[] => {
    const sectionMap: SectionMapResponse | null = get(currentSectionMapAtom);
    return sectionMap?.sectionList ?? [];
  },
);

/** Active node ID within the current section — derived from progress */
export const activeSectionNodeIdAtom = atom<string | null>(
  (get): string | null => {
    const sectionMap: SectionMapResponse | null = get(currentSectionMapAtom);
    if (!sectionMap) return null;

    const activeProgress = sectionMap.progress.find(
      (p) => p.status === "active",
    );
    return activeProgress?.nodeId ?? null;
  },
);






