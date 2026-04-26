import React from "react";
import { useWindowDimensions, View } from "react-native";
import { Stack, router } from "expo-router";

import type { SectionViewMode } from "@/src/types/journey/sectionMap";
import type { JourneyConfig, UnitConfig } from "@/src/types/journey";
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyMapFlashList from "./JourneyMapFlashList";
import { createLogger } from "@/src/lib/logger";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { useJourneyConfig } from "@/src/context/JourneyConfigContext";
import {
  DuolingoHeader,
  DuolingoHeaderStats,
} from "@/src/components/journey/DuolingoHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchEnrolledCourses } from "@/src/store/api/enrolledCoursesApi";
import { setActiveSlug } from "@/src/store/slices/enrolledCoursesSlice";

const USE_FLASH_LIST = true;
const log = createLogger("JourneyMapContainer");

export interface JourneyMapContainerProps {}

export default function JourneyMapContainer({}: JourneyMapContainerProps = {}): React.JSX.Element {
  const dispatch = useAppDispatch();
  const enrolledCoursesData = useAppSelector((state) => state.enrolledCourses.data);
  const isLoadingCourses = useAppSelector(
    (state) => state.enrolledCourses.isLoading,
  );
  const coursesError = useAppSelector((state) => state.enrolledCourses.error);

  React.useEffect(() => {
    void dispatch(fetchEnrolledCourses());
  }, [dispatch]);

  const { width: viewportWidth, height: viewportHeight } =
    useWindowDimensions();
  const insets = useSafeAreaInsets();

  const handleCourseSelect = (slug: string) => {
    dispatch(setActiveSlug(slug));
  };

  const currentActiveSlug =
    enrolledCoursesData?.activeSlug;
  const coursesData = enrolledCoursesData;

  // Get config from context

  const stats = {
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

  if (isLoadingCourses) {
    return <JourneyLoadingSkeleton />;
  }

  if (coursesError && !coursesData) {
    return <JourneyLoadingSkeleton />;
  }

  console.log("enrolledCoursessss", coursesData?.items[0]);

  const enrolledCoursesWithActiveSlug = coursesData
    ? {
        ...coursesData,
        activeSlug: currentActiveSlug || coursesData.activeSlug,
      }
    : undefined;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
        <DuolingoHeader
          stats={headerStats}
          enrolledCourses={enrolledCoursesWithActiveSlug}
          onCourseSelect={handleCourseSelect}
        />
        <JourneyMapFlashList
          key={currentActiveSlug}
          slugOverride={currentActiveSlug || undefined}
        />
      </View>
    </>
  );
}
