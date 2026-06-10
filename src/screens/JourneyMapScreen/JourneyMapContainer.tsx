// screens/JourneyMapScreen/JourneyMapContainer.tsx
// Top-level container for the Journey Map screen.
// Resolves the active courseId via Redux-backed selection, loads it via useJourneyMap,
// then renders DuolingoHeader + JourneyMapFlashList.

import React, { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { useFocusTunneling } from "@/src/hooks/ui/useFocusTunneling";
import { AmbientTapDust } from "@/src/components/ui/AmbientTapDust";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "@/components/ui/safe-area-view";

import CourseCatalogSheet from "@/src/components/journey/CourseCatalogSheet";
import { HomeMainButton } from "@/src/components/journey/home-main-button";
import {
  DuolingoHeader,
  DuolingoHeaderStats,
} from "@/src/components/journey/DuolingoHeader";
import { useGetEnrolledCoursesQuery } from "@/src/features/journey/journeyApi";
import {
  selectCourseHeaderSummaryForCourse,
  selectActiveNodeModalIdForCourse,
} from "@/src/features/journey/journeySelectors";
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import { useAppSelector } from "@/src/store/hooks";
import JourneyMapFlashList from "./JourneyMapFlashList";
import { useActiveCourse } from "@/hooks/journey/useActiveCourse";
import { useJourneyMap } from "@/hooks/journey/useJourneyMap";
import { useJourneyMapController } from "./useJourneyMapController";

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
  const [isCourseCatalogPresented, setIsCourseCatalogPresented] =
    useState(false);

  const { courseId, setActiveCourseId } = useActiveCourse();
  const { isLoading, isLoaded } = useJourneyMap(courseId);
  const { data: enrolledCourses } = useGetEnrolledCoursesQuery();
  const activeCourseSummary = useAppSelector((state) =>
    courseId ? selectCourseHeaderSummaryForCourse(state, courseId) : null,
  );

  const activeNodeId = useAppSelector((state) =>
    courseId ? selectActiveNodeModalIdForCourse(state, courseId) : null,
  );
  const isModalOpen = activeNodeId !== null;

  const controller = useJourneyMapController(courseId || "");
  const animatedStyle = useFocusTunneling(isModalOpen);

  if (!courseId || (isLoading && !isLoaded)) {
    return <JourneyLoadingSkeleton />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          // headerBackground: () => (
          //   <GlassView
          //     glassEffectStyle="regular"
          //     style={{
          //       flex: 1,
          //       borderBottomWidth: 10,
          //       borderBottomColor: "red",
          //       shadowOpacity: 0,
          //       shadowRadius: 0,
          //       elevation: 0,
          //     }}
          //   />
          // ),
          header: () => (
            <GlassView
              glassEffectStyle="regular"
              style={{
                paddingBottom: 16,
                borderBottomWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowColor: "transparent", // IMPORTANT

                // fixes iOS separator artifacts
                overflow: "hidden",
              }}
            >
              <SafeAreaView edges={["top"]}>
                <View>
                  <DuolingoHeader
                    stats={STUB_STATS}
                    enrolledCourses={enrolledCourses}
                    activeCourseId={courseId}
                    activeCourseSummary={activeCourseSummary}
                    onAddCoursePress={() => setIsCourseCatalogPresented(true)}
                    onCourseSelect={setActiveCourseId}
                  />
                  <HomeMainButton
                    onPress={controller.handleOpenSections}
                    unitLabel={controller.headerState.label}
                    unitTitle={controller.headerState.title}
                    faceColor={controller.headerState.faceColor}
                    rimColor={controller.headerState.rimColor}
                    unitIconKey={controller.headerState.iconKey}
                  />
                </View>
              </SafeAreaView>
            </GlassView>
          ),
        }}
      />
      <AmbientTapDust>
        <Animated.View className="flex-1 bg-brand-canvas" style={animatedStyle}>
          <JourneyMapFlashList courseId={courseId} controller={controller} />
        </Animated.View>
      </AmbientTapDust>
      <CourseCatalogSheet
        isPresented={isCourseCatalogPresented}
        activeCourseId={courseId}
        enrolledCourses={enrolledCourses}
        onClose={() => setIsCourseCatalogPresented(false)}
        onCourseSelect={setActiveCourseId}
      />
    </>
  );
}
