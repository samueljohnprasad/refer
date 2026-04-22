import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

import type {
  SectionMapResponse,
  SectionListItem,
  SectionViewMode,
} from "@/src/types/journey/sectionMap";
import { fetchSectionMap } from "@/src/lib/api/journeyApi";
import {
  setSectionMap,
  setCurrentSectionNumber,
} from "@/src/store/slices/sectionMapSlice";
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

export function useSectionData(slug: string | null): UseSectionDataReturn {
  const dispatch = useAppDispatch();
  const sectionMap = useAppSelector((state) => state.sectionMap.sectionMap);
  const sectionList = useAppSelector((state) => state.sectionMap.sectionList);
  const isLoading = useAppSelector((state) => state.sectionMap.isLoading);
  const dataError = useAppSelector((state) => state.sectionMap.error);

  // ── Derived values ──
  // Find active node directly from section nodes (status is server-resolved)
  const activeNodeId: string | null =
    sectionMap?.section.nodes.find((n) => n.status === "active")?.id ?? null;

  const fetchAndApplySection = useCallback(
    async (journeySlug: string, unitNumber?: number): Promise<void> => {
      try {
        const res = await fetchSectionMap(journeySlug, unitNumber);

        if (!res.success || !res.data) {
          return;
        }

        const data: SectionMapResponse = res.data;
        dispatch(setSectionMap(data));
        dispatch(setCurrentSectionNumber(data.section.unitNumber));
      } catch (err: unknown) {
        console.error("Failed to load section data:", err);
      }
    },
    [dispatch],
  );

  // ── Initial load: fetch user's current section ──
  const loadInitial = useCallback(
    async (journeySlug: string): Promise<void> => {
      await fetchAndApplySection(journeySlug);
    },
    [fetchAndApplySection],
  );

  useEffect(() => {
    if (slug && !sectionMap) {
      loadInitial(slug);
    }
  }, [slug, sectionMap, loadInitial]);

  return {
    isLoading: isLoading && !sectionMap,
    error: dataError,
    sectionMap,
    sectionList,
    activeNodeId,
  };
}
