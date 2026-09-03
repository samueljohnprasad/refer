import React, { useMemo } from "react";
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
import LessonCompleteSheet from "./components/LessonCompleteSheet";
import UnitCompleteModal from "./components/UnitCompleteModal";
import { getLessonTakeaway, getUnitRewardContent } from "@/src/data/journey/rewardsConfig";
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

  const {
    courseId,
    isCourseCatalogPresented,
    userStats,
    enrolledCourses,
    activeCourseSummary,
    animatedStyle,
    controller,
  } = model;

  const prevNode = useMemo(() => {
    if (!controller?.flashListData) return null;
    const currentIndex = controller.flashListData.findIndex(item => item.itemType === 'node' && item.status === 'active');
    if (currentIndex <= 0) return null;
    // Find the first node before the current one
    for (let i = currentIndex - 1; i >= 0; i--) {
      const item = controller.flashListData[i];
      if (item && item.itemType === 'node') {
        return item as any; // Cast as JourneyNode to avoid strict type issues on progress property
      }
    }
    return null;
  }, [controller?.flashListData]);

  const prevNodeId = prevNode?.id;
  const takeaway = prevNodeId ? getLessonTakeaway(prevNodeId) : "You've completed this lesson. Keep going to build on what you've learned.";
  
  // For unit completion, we use the header state's title and ID to find the capability statement.
  // Wait, if we just completed a unit, the header state might already reflect the NEXT unit.
  // We can just rely on the previous node's unitId.
  const prevUnitId = prevNode?.unitId;
  const unitReward = prevUnitId ? getUnitRewardContent(prevUnitId) : null;
  const capabilityStatement = unitReward?.capabilityStatement || "You've gained a new capability.";

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
                backgroundColor: isDark ? "#1a2a1a" : "#fbfdf8",
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
          insightCard={controller.insightCard}
          isClaiming={controller.isClaimingReward}
          onClaim={controller.handleClaimReward}
          onDismiss={controller.handleDismissReward}
        />
      ) : null}

      {/* T012: Lesson Celebration */}
      {controller.pendingCelebration === "lesson" && (
        <LessonCompleteSheet
          isVisible={true}
          takeaway={takeaway}
          onContinue={controller.dismissCelebration}
        />
      )}

      {/* T020: Unit Celebration */}
      {controller.pendingCelebration === "unit" && (
        <UnitCompleteModal
          unit={{ id: prevUnitId || "", title: "Unit Complete", description: "", nodes: [] } as any}
          capabilityStatement={capabilityStatement}
          onContinue={controller.dismissCelebration}
        />
      )}
    </>
  );
});

export default JourneyMapView;
