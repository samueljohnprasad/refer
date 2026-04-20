import { useState, useCallback } from "react";
import { router } from "expo-router";
// TODO: Re-implement with Redux after jotai removal
// import { useMultiJourney } from "@/src/hooks/useMultiJourney";
import { FlashListRef } from "@shopify/flash-list";
import type { JourneyFlashListItem } from "@/src/types/journey";

interface UseJourneySheetsProps {
  loadSection: (unitNumber: number) => void;
  flashListRef: React.RefObject<FlashListRef<JourneyFlashListItem>>;
  USE_FLASH_LIST?: boolean;
}

export function useJourneySheets({
  loadSection,
  flashListRef,
  USE_FLASH_LIST = true,
}: UseJourneySheetsProps) {
  const [isSectionOverviewOpen, setIsSectionOverviewOpen] =
    useState<boolean>(false);

  // Guide-book press handler (opens section overview sheet)
  const handleGuidePress = useCallback((): void => {
    setIsSectionOverviewOpen(true);
  }, []);

  const handleSectionOverviewClose = useCallback((): void => {
    setIsSectionOverviewOpen(false);
  }, []);

  const handleJumpToSection = useCallback(
    (unitNumber: number): void => {
      loadSection(unitNumber);
      if (USE_FLASH_LIST) {
        flashListRef.current?.scrollToOffset({
          offset: 0,
          animated: true,
        });
      }
    },
    [flashListRef, loadSection, USE_FLASH_LIST],
  );

  // ── Journey Switcher ──
  // TODO: Re-implement with Redux after jotai removal
  // const { switcherItems, switchJourney, archiveJourney } = useMultiJourney();
  const switcherItems: any[] = [];

  const [isSwitcherOpen, setIsSwitcherOpen] = useState<boolean>(false);

  const handleFlagPress = useCallback((): void => {
    setIsSwitcherOpen(true);
  }, []);

  const handleSwitcherClose = useCallback((): void => {
    setIsSwitcherOpen(false);
  }, []);

  const handleSwitchJourney = useCallback((targetSlug: string): void => {
    // switchJourney(targetSlug);
    // Small delay so bottom sheet dismiss animation finishes before skeleton
    setTimeout(() => {
      router.replace("/tabs/(tabs)/journeys" as never);
    }, 250);
  }, []);

  const handleDiscoverPress = useCallback((): void => {
    setIsSwitcherOpen(false);
    router.replace({
      pathname: "/tabs/(tabs)/journeys",
      params: {
        view: "catalog",
      },
    } as never);
  }, []);

  const handleArchiveJourney = useCallback((slug: string): void => {
    // archiveJourney(slug);
  }, []);

  return {
    isSectionOverviewOpen,
    handleGuidePress,
    handleSectionOverviewClose,
    handleJumpToSection,
    isSwitcherOpen,
    handleFlagPress,
    handleSwitcherClose,
    handleSwitchJourney,
    handleDiscoverPress,
    handleArchiveJourney,
    switcherItems,
  };
}
