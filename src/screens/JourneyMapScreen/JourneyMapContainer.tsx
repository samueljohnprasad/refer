// screens/JourneyMapScreen/JourneyMapContainer.tsx
// Top-level container for the Journey Map screen.
// Resolves the active courseId via Redux-backed selection, loads it via useJourneyMap,
// then renders DuolingoHeader + JourneyMapFlashList.

import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DuolingoHeader,
  DuolingoHeaderStats,
} from "@/src/components/journey/DuolingoHeader";
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyMapFlashList from "./JourneyMapFlashList";
import { useActiveCourse } from "@/hooks/journey/useActiveCourse";
import { useJourneyMap } from "@/hooks/journey/useJourneyMap";

// ── Stub stats — replace with real user stats hook when available ─────────────

const STUB_STATS: DuolingoHeaderStats = {
  streak: 0,
  gems: 0,
  hearts: 5,
  xp: 0,
};

/**
 * Journey Map container. Entry point for the journeys tab.
 * - useActiveCourse: resolves and persists the active course in Redux
 * - useJourneyMap: lazy-loads the course tree + progress; auto-enrolls if needed
 * - JourneyMapFlashList: renders the scrollable node path
 */
export default function JourneyMapContainer(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const { courseId } = useActiveCourse();
  const { isLoading, isLoaded } = useJourneyMap(courseId);

  if (!courseId || (isLoading && !isLoaded)) {
    return <JourneyLoadingSkeleton />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
        <DuolingoHeader stats={STUB_STATS} />
        <JourneyMapFlashList courseId={courseId} />
      </View>
    </>
  );
}
