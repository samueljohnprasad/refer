import React from "react";
import { Stack } from "expo-router";
import Animated from "react-native-reanimated";
import { AmbientTapDust } from "@/src/components/ui/AmbientTapDust";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "@/components/ui/safe-area-view";

import CourseCatalogSheet from "./components/CourseCatalogSheet";
import { HomeMainButton } from "./components/home-main-button";
import { DuolingoHeader } from "./components/DuolingoHeader";
import JourneyMapFlashList from "./components/JourneyMapFlashList";
import JourneyLoadingSkeleton from "./components/JourneyLoadingSkeleton";
import type { JourneyMapViewModel, JourneyMapActions } from "./hooks/useJourneyMapViewModel";

export interface JourneyMapViewProps {
  model: JourneyMapViewModel;
  actions: JourneyMapActions;
}

/**
 * Presentational component for the Journey Map.
 * Strictly stateless regarding business logic and data fetching.
 * Receives all data and actions purely via props from the Container/ViewModel.
 */
export const JourneyMapView = React.memo(function JourneyMapView({
  model,
  actions,
}: JourneyMapViewProps): React.JSX.Element {
  if (model.isPreparing) {
    return <JourneyLoadingSkeleton />;
  }

  const {
    courseId,
    isCourseCatalogPresented,
    userStats,
    enrolledCourses,
    activeCourseSummary,
    animatedStyle,
    controller,
  } = model;

  const {
    setActiveCourseId,
    onAddCoursePress,
    onCloseCatalogSheet,
  } = actions;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          header: () => (
            <GlassView
              glassEffectStyle="regular"
              style={{
                paddingBottom: 16,
                borderBottomWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowColor: "transparent",
                overflow: "hidden",
              }}
            >
              <SafeAreaView edges={["top"]}>
                <DuolingoHeader
                  stats={userStats}
                  enrolledCourses={enrolledCourses}
                  activeCourseId={courseId}
                  activeCourseSummary={activeCourseSummary}
                  onAddCoursePress={onAddCoursePress}
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
              </SafeAreaView>
            </GlassView>
          ),
        }}
      />
      <>
        <AmbientTapDust>
          <Animated.View
            className="flex-1 bg-white"
            style={animatedStyle}
          >
            {courseId && (
              <JourneyMapFlashList courseId={courseId} controller={controller} />
            )}
          </Animated.View>
        </AmbientTapDust>
      </>
      <CourseCatalogSheet
        isPresented={isCourseCatalogPresented}
        activeCourseId={courseId}
        enrolledCourses={enrolledCourses}
        onClose={onCloseCatalogSheet}
        onCourseSelect={setActiveCourseId}
      />
    </>
  );
});

export default JourneyMapView;
