import React from "react";
import { useWindowDimensions, View } from "react-native";
import { Stack, router } from "expo-router";

import type { SectionViewMode } from "@/src/types/journey/sectionMap";
import type { JourneyConfig, UnitConfig } from "@/src/types/journey";
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyMapFlashList from "./JourneyMapFlashList";
import { createLogger } from "@/src/lib/logger";
import { useAppSelector } from "@/src/store/hooks";
import { useJourneyConfig } from "@/src/context/JourneyConfigContext";
import {
  DuolingoHeader,
  DuolingoHeaderStats,
} from "@/src/components/journey/DuolingoHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const USE_FLASH_LIST = true;
const log = createLogger("JourneyMapContainer");

export interface JourneyMapContainerProps {
  slugOverride?: string;
}

export default function JourneyMapContainer({
  slugOverride,
}: JourneyMapContainerProps = {}): React.JSX.Element {
  const { width: viewportWidth, height: viewportHeight } =
    useWindowDimensions();
  const journeyState = useAppSelector((state) => state.journey.journeyState);
  const insets = useSafeAreaInsets();

  // Get config from context
  const config = useJourneyConfig();
  const unitConfigMap: Map<string, UnitConfig> = new Map(
    config.units.length > 0
      ? config.units.map((uc: UnitConfig) => [uc.id, uc])
      : (journeyState?.units || []).map((unit) => [
          unit.id,
          {
            ...unit,
            colorThemeKey: unit.colorScheme as any,
            divider: {
              title: unit.title,
              showJumpHere: true,
            },
            mascotPlacements: unit.mascotPlacements.map((mp) => ({
              afterNodeIndex: mp.afterNodeIndex,
              side: mp.position === "left" ? "left" : "right",
              messageKey: mp.message ?? "",
            })),
          } as UnitConfig,
        ]),
  );

  const stats = journeyState?.stats || {
    streakDays: 0,
    wallet: { coins: 0, gems: 0 },
    hearts: 5,
    totalXP: 0,
  };

  // Map stats to DuolingoHeader format
  const headerStats: DuolingoHeaderStats = {
    streak: stats.streakDays,
    gems: stats.wallet.gems,
    hearts: stats.hearts,
    xp: stats.totalXP,
  };

  if (!slugOverride) {
    return <JourneyLoadingSkeleton />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
        <DuolingoHeader stats={headerStats} />
        <JourneyMapFlashList
          key={slugOverride}
          journeyState={journeyState || undefined}
          config={config}
          unitConfigMap={unitConfigMap}
          slugOverride={slugOverride}
        />
      </View>
    </>
  );
}
