import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import type {
  SectionMapResponse,
  SectionListItem,
  SectionViewMode,
} from "@/src/types/journey/sectionMap";
import { fetchSectionMap } from "@/src/lib/api/journeyApi";
import {
  currentSectionMapAtom,
  activeJourneySlugAtom,
} from "@/src/store/journeyStore";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("useSectionData");

export interface UseSectionDataReturn {
  /** Whether the initial section data is loading */
  isLoading: boolean;
  /** Non-null only for hard errors */
  error: string | null;

  /** Current section map response (null until first load) */
  sectionMap: SectionMapResponse | null;
  /** All sections for sticky header */
  sectionList: SectionListItem[];
  /** Active node ID in current section (for auto-scroll) */
  activeNodeId: string | null;
  /** Load a specific section (called on sticky header tap) */
}

export function useSectionData(
  slug: string | null,
  viewMode: SectionViewMode = "active",
): UseSectionDataReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sectionMap, setSectionMap] = useAtom(currentSectionMapAtom);
  const setActiveSlug = useSetAtom(activeJourneySlugAtom);

  // ── Derived values ──
  const sectionList: SectionListItem[] = sectionMap?.sectionList ?? [];
  const activeNodeId: string | null =
    sectionMap?.progress.find((p) => p.status === "active")?.nodeId ?? null;

  const fetchAndApplySection = useCallback(
    async (journeySlug: string, unitNumber?: number): Promise<void> => {
      try {
        const res = await fetchSectionMap(journeySlug, unitNumber, viewMode);

        if (!res.success || !res.data) {
          setError(res.error ?? "Failed to load section data");
          return;
        }

        setError(null);

        const data: SectionMapResponse = res.data;
        // Apply
        setSectionMap(data);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load section");
      }
    },
    [setSectionMap, viewMode],
  );

  // ── Initial load: fetch user's current section ──
  const loadInitial = useCallback(
    async (journeySlug: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await fetchAndApplySection(journeySlug);
        setActiveSlug(journeySlug);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAndApplySection, setActiveSlug, viewMode],
  );

  useEffect(() => {
    if (slug) {
      loadInitial(slug);
    }
  }, [slug]);

  return {
    isLoading,
    error,
    sectionMap,
    sectionList,
    activeNodeId,
  };
}
