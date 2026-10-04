import React from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { Stack, router } from "expo-router";
import Animated from "react-native-reanimated";
import { AmbientTapDust } from "@/src/components/ui/AmbientTapDust";

import CourseCatalogSheet from "./components/CourseCatalogSheet";
import NextJourneyBridgeDock from "./components/NextJourneyBridgeDock";
import { JourneyMapHeader } from "./components/JourneyMapHeader";
import JourneyMapFlashList from "./components/JourneyMapFlashList";
import JourneyLoadingSkeleton from "./components/JourneyLoadingSkeleton";
import JourneyUnavailableState from "./components/JourneyUnavailableState";
import { ChestRewardModal } from "./components";
import { CelebrationOverlay } from "@/src/components/celebration/CelebrationOverlay";
import { DailyGoalToast, useDailyGoalToast } from "@/src/components/celebration/DailyGoalToast";
import { CheckpointActionSheet } from "./components/CheckpointActionSheet";
import { CelebrationLevel } from "@/src/types/journeyV5";
import { NodeType } from "@/src/types/journey";
import { JourneyLessonCelebration } from "./components/JourneyLessonCelebration";
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
  const { t } = useTranslation("journeys");
  const isDark = useColorScheme() === "dark";

  const {
    courseId,
    isCourseCatalogPresented,
    enrolledCourses,
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

  const handleStartNextCourse = React.useCallback(
    async (nextCourseId: string) => {
      await controller.handleStartNextCourse(nextCourseId);
      setActiveCourseId(nextCourseId);
    },
    [controller, setActiveCourseId],
  );

  const goalToast = useDailyGoalToast(
    !!controller.pendingCelebration ||
      controller.isOverlayOpen ||
      isCourseCatalogPresented ||
      !!controller.rewardNode ||
      model.isPreparing,
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
            <JourneyMapHeader model={model} actions={actions} isOnboarding={isOnboarding} />
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
                completedNodeId={model.completedNodeId}
              />
            )}
          </Animated.View>
        </AmbientTapDust>
      </>
      {controller.recommendation.isCompleted &&
        !isCourseCatalogPresented &&
        !controller.isOverlayOpen && (
        <NextJourneyBridgeDock
          nextCourse={controller.recommendation.nextCourse}
          isAllCoursesCompleted={controller.recommendation.isAllCoursesCompleted}
          isLoading={controller.isStartingNextCourse}
          onStartNextCourse={handleStartNextCourse}
          onBrowseCatalog={onAddCoursePress}
          currentCourseTitle={controller.courseTitle}
          completionMessage={controller.courseCompletionMessage}
        />
      )}
      <CourseCatalogSheet
        isPresented={isCourseCatalogPresented}
        enrolledCourses={enrolledCourses}
        onClose={onCloseCatalogSheet}
        onCourseSelect={setActiveCourseId}
      />
      <DailyGoalToast
        visible={goalToast.visible}
        todayXP={goalToast.todayXP}
        goal={goalToast.goal}
        onDismiss={goalToast.dismiss}
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

      <JourneyLessonCelebration
        celebration={controller.pendingCelebration}
        onContinue={controller.dismissCelebration}
      />

      {/* T020: Unit Celebration */}
      {controller.pendingCelebration?.level === CelebrationLevel.UNIT && (
        <CelebrationOverlay
          isVisible={true}
          context={{
            type: 'unit',
            eyebrowText: t("unitComplete"),
            primaryText: controller.pendingCelebration.content.capabilityStatement,
            secondaryText: controller.pendingCelebration.unitTitle,
            pandaAnimationKey: 'generic_success',
            backgroundColor: isDark ? '#1a2a1a' : '#fbfdf8',
          }}
          onContinue={controller.dismissCelebration}
        />
      )}

      {/* Course Celebration */}
      {controller.pendingCelebration?.level === CelebrationLevel.COURSE && (
        <CelebrationOverlay
          isVisible={true}
          context={{
            type: 'course',
            eyebrowText: t("courseComplete"),
            primaryText: controller.pendingCelebration.content.acknowledgement,
            secondaryText: controller.pendingCelebration.courseTitle,
            pandaAnimationKey: 'generic_success',
            backgroundColor: isDark ? '#1a2a1a' : '#fbfdf8',
          }}
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
