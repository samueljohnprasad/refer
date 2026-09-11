import React from "react";
import { useColorScheme } from "react-native";
import { Stack, router } from "expo-router";
import Animated from "react-native-reanimated";
import { AmbientTapDust } from "@/src/components/ui/AmbientTapDust";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "@/src/components/tw";

import CourseCatalogSheet from "./components/CourseCatalogSheet";
import { HomeMainButton } from "./components/home-main-button";
import { DuolingoHeader } from "./components/DuolingoHeader";
import JourneyMapFlashList from "./components/JourneyMapFlashList";
import JourneyLoadingSkeleton from "./components/JourneyLoadingSkeleton";
import JourneyUnavailableState from "./components/JourneyUnavailableState";
import { ChestRewardModal } from "./components";
import LessonCompleteSheet from "./components/LessonCompleteSheet";
import UnitCompleteModal from "./components/UnitCompleteModal";
import { CheckpointActionSheet } from "./components/CheckpointActionSheet";
import { CelebrationLevel } from "@/src/types/journeyV5";
import { NodeType } from "@/src/types/journey";
import * as Haptics from "expo-haptics";
import type {
  JourneyMapViewModel,
  JourneyMapActions,
} from "./hooks/useJourneyMapViewModel";

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

  const { setActiveCourseId, onAddCoursePress, onCloseCatalogSheet, retry } =
    actions;

  const handleCheckpointAction = React.useCallback(
    (isReview: boolean) => {
      if (!controller.checkpointSheetData?.node) return;
      if (!isReview) {
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      }
      const nodeId = controller.checkpointSheetData.node.id;
      controller.closeCheckpointSheet();
      router.push({
        pathname: "/tabs/screens/journey-flow",
        params: {
          courseId,
          nodeId,
        },
      });
    },
    [controller, courseId],
  );

  if (model.isPreparing) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <JourneyLoadingSkeleton />
      </>
    );
  }

  if (model.loadError) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <JourneyUnavailableState
          hasError={true}
          onRetry={retry}
        />
      </>
    );
  }

  if (model.hasNoCourses) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <JourneyUnavailableState
          hasError={false}
          onRetry={retry}
          onExploreCatalog={onAddCoursePress}
        />
        <CourseCatalogSheet
          isPresented={isCourseCatalogPresented}
          enrolledCourses={enrolledCourses}
          onClose={onCloseCatalogSheet}
          onCourseSelect={setActiveCourseId}
        />
      </>
    );
  }

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
                isOnboarding={isOnboarding}
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
      {controller.rewardNode &&
      controller.rewardNode.type === NodeType.CHEST &&
      controller.insightCard ? (
        <ChestRewardModal
          node={controller.rewardNode}
          insightCard={controller.insightCard}
          isClaiming={controller.isClaimingReward}
          onClaim={controller.handleClaimReward}
          onDismiss={controller.handleDismissReward}
        />
      ) : null}

      {/* T012: Lesson Celebration */}
      {controller.pendingCelebration?.level === CelebrationLevel.LESSON && (
        <LessonCompleteSheet
          isVisible={true}
          content={controller.pendingCelebration.content}
          onContinue={controller.dismissCelebration}
        />
      )}

      {/* T020: Unit Celebration */}
      {controller.pendingCelebration?.level === CelebrationLevel.UNIT && (
        <UnitCompleteModal
          unitTitle={controller.pendingCelebration.unitTitle}
          content={controller.pendingCelebration.content}
          onContinue={controller.dismissCelebration}
        />
      )}

      {/* T019: Checkpoint Sheet */}
      <CheckpointActionSheet
        isPresented={controller.isCheckpointSheetOpen}
        onIsPresentedChange={controller.setIsCheckpointSheetOpen}
        data={controller.checkpointSheetData}
        onStart={() => handleCheckpointAction(false)}
        onReview={() => handleCheckpointAction(true)}
      />
    </>
  );
});

export default JourneyMapView;
