import React from "react";
import { useColorScheme } from "react-native";
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
import JourneyUnavailableState from "./components/JourneyUnavailableState";
import { ChestRewardModal } from "./components";
import type {
  JourneyMapViewModel,
  JourneyMapActions,
} from "./hooks/useJourneyMapViewModel";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

export interface JourneyMapViewProps {
  model: JourneyMapViewModel;
  actions: JourneyMapActions;
  isOnboarding?: boolean;
}

/**
 * Presentational View component for the Journey Map.
 * Renders the UI based entirely on the provided view model state and actions.
 * Contains no internal state or data fetching logic.
 */
export const JourneyMapView = React.memo(function JourneyMapView({
  model,
  actions,
  isOnboarding,
}: JourneyMapViewProps): React.JSX.Element {
  const isDark = useColorScheme() === "dark";

  if (model.isPreparing) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <JourneyLoadingSkeleton />
      </>
    );
  }

  if (model.loadError || model.hasNoCourses) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <JourneyUnavailableState
          hasError={Boolean(model.loadError)}
          onRetry={actions.retry}
        />
      </>
    );
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

  const { setActiveCourseId, onAddCoursePress, onCloseCatalogSheet } = actions;

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
                {!isOnboarding && (
                  <DuolingoHeader
                    stats={userStats}
                    enrolledCourses={enrolledCourses}
                    activeCourseId={courseId}
                    activeCourseSummary={activeCourseSummary}
                    onAddCoursePress={onAddCoursePress}
                    onCourseSelect={setActiveCourseId}
                  />
                )}
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
            className="flex-1 bg-brand-canvas"
            style={[
              {
                backgroundColor: isDark
                  ? SEMANTIC_COLORS.surface.primary
                  : SEMANTIC_COLORS.surface.canvas,
              },
              animatedStyle,
            ]}
          >
            {courseId && (
              <JourneyMapFlashList
                courseId={courseId}
                controller={controller}
              />
            )}
          </Animated.View>
        </AmbientTapDust>
      </>
      <CourseCatalogSheet
        isPresented={isCourseCatalogPresented}
        enrolledCourses={enrolledCourses}
        onClose={onCloseCatalogSheet}
        onCourseSelect={setActiveCourseId}
      />
      {controller.rewardNode ? (
        <ChestRewardModal
          node={controller.rewardNode}
          isClaiming={controller.isClaimingReward}
          onClaim={controller.handleClaimReward}
          onDismiss={controller.handleDismissReward}
        />
      ) : null}
    </>
  );
});

export default JourneyMapView;
