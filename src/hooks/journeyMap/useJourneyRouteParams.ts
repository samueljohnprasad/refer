import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { createLogger } from "@/src/lib/logger";
import type { SectionViewMode } from "@/src/types/journey/sectionMap";

const log = createLogger("useJourneyRouteParams");

export interface UseJourneyRouteParamsProps {
  slugOverride?: string;
  modeOverride?: SectionViewMode;
  isLoading?: boolean;
}

export function useJourneyRouteParams({
  slugOverride,
  modeOverride,
  isLoading = false,
}: UseJourneyRouteParamsProps = {}) {
  const { slug, mode, jumpToSection } = useLocalSearchParams<{
    slug?: string;
    mode?: SectionViewMode;
    jumpToSection?: string;
  }>();

  const journeySlug: string | null = slugOverride ?? slug ?? null;
  const journeyAccessMode: SectionViewMode = modeOverride ?? mode ?? "active";
  const resolvedJourneySlug: string = journeySlug ?? "";

  const prevSlugRef = useRef<string | null>(journeySlug);
  const [isSwitchingJourney, setIsSwitchingJourney] = useState<boolean>(false);

  useEffect(() => {
    log.info("Journey map mounted / slug resolved", {
      routeSlug: slug ?? null,
      slugOverride: slugOverride ?? null,
      journeySlug,
      journeyAccessMode,
      jumpToSection: jumpToSection ?? null,
    });
  }, [journeyAccessMode, journeySlug, jumpToSection, slug, slugOverride]);

  useEffect(() => {
    if (prevSlugRef.current !== journeySlug) {
      prevSlugRef.current = journeySlug;
      log.info("Journey slug changed", { journeySlug });
      // Only show skeleton if data isn't already loaded (e.g., not cached)
      if (isLoading) {
        setIsSwitchingJourney(true);
        // Safety timeout in case loading never clears
        const timer = setTimeout(() => setIsSwitchingJourney(false), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [journeySlug, isLoading]);

  useEffect(() => {
    if (!isLoading && isSwitchingJourney) {
      setIsSwitchingJourney(false);
    }
  }, [isLoading, isSwitchingJourney]);

  return {
    journeySlug,
    journeyAccessMode,
    resolvedJourneySlug,
    isSwitchingJourney,
    jumpToSection,
  };
}
