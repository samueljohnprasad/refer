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

import CourseCatalogSheet from "@/src/components/journey/CourseCatalogSheet";
import {
  DuolingoHeader,
  DuolingoHeaderStats,
} from "@/src/components/journey/DuolingoHeader";
import {
  useGetEnrolledCoursesQuery,
} from "@/src/features/journey/journeyApi";
import {
  selectCourseHeaderSummaryForCourse,
  selectActiveNodeModalIdForCourse,
} from "@/src/features/journey/journeySelectors";
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import { useAppSelector } from "@/src/store/hooks";
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
  const [isCourseCatalogPresented, setIsCourseCatalogPresented] = useState(false);

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

  const animatedStyle = useFocusTunneling(isModalOpen);

  if (!courseId || (isLoading && !isLoaded)) {
    return <JourneyLoadingSkeleton />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-black">
        <AmbientTapDust>
          <Animated.View 
            className="flex-1 bg-brand-canvas" 
            style={[{ paddingTop: insets.top }, animatedStyle]}
          >
            <DuolingoHeader
              stats={STUB_STATS}
            enrolledCourses={enrolledCourses}
            activeCourseId={courseId}
            activeCourseSummary={activeCourseSummary}
            onAddCoursePress={() => setIsCourseCatalogPresented(true)}
            onCourseSelect={setActiveCourseId}
          />
          <View style={{ flex: 1 }}>
            <JourneyMapFlashList courseId={courseId} />
          </View>
        </Animated.View>
        </AmbientTapDust>
        <CourseCatalogSheet
          isPresented={isCourseCatalogPresented}
          activeCourseId={courseId}
          enrolledCourses={enrolledCourses}
          onClose={() => setIsCourseCatalogPresented(false)}
          onCourseSelect={setActiveCourseId}
        />
      </View>
    </>
  );
}
