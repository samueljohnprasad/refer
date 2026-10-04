import { useCallback, useEffect, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useToast } from "heroui-native";
import type { PathNodeData } from "@/src/types/journey";
import { NodeStatus, NodeType } from "@/src/types/journey";
import {
  CelebrationLevel,
  type InsightRewardContent,
  type UnitRewardContent,
} from "@/src/types/journeyV5";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import {
  setCourseProgress,
  setPendingCelebration,
} from "@/src/domains/journey/state/journeySlice";
import {
  selectCourse,
  selectCourseProgressForCourse,
  selectIsCourseCompleteForCourse,
  selectNode,
  selectPendingCelebration,
  selectUnit,
} from "@/src/domains/journey/state/journeySelectors";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { requestReviewForMilestone } from "@/src/hooks/useReviewPrompt";
import { useTranslation } from "react-i18next";

export function useJourneyRewardsController(courseId: string) {
  const { t } = useTranslation("journeys");
  const [rewardNode, setRewardNode] = useState<PathNodeData | null>(null);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const pushedFinaleCourseRef = useRef<string | null>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [completeNode] = journeyApi.useCompleteNodeMutation();
  const pendingCelebration = useAppSelector((state) =>
    selectPendingCelebration(state, courseId),
  );
  const course = useAppSelector((state) => selectCourse(state, courseId));
  const courseProgress = useAppSelector((state) =>
    selectCourseProgressForCourse(state, courseId),
  );
  const isCourseComplete = useAppSelector((state) =>
    selectIsCourseCompleteForCourse(state, courseId),
  );
  const rewardNodeEntity = useAppSelector((state) =>
    selectNode(state, rewardNode?.id ?? ""),
  );
  const rewardUnit = useAppSelector((state) =>
    selectUnit(state, rewardNodeEntity?.unitId ?? ""),
  );

  const [markFinaleSeen] = journeyApi.useMarkCourseFinaleSeenMutation();

  useFocusEffect(
    useCallback(() => {
      if (
        courseProgress?.status !== "completed" ||
        !isCourseComplete ||
        courseProgress.finaleSeenAt ||
        !course?.rewardContent
      )
        return;

      dispatch(
        setPendingCelebration({
          courseId,
          celebration: {
            level: CelebrationLevel.COURSE,
            courseId,
            courseTitle: course.title,
            content: course.rewardContent,
          },
        }),
      );
    }, [course, courseId, courseProgress, dispatch, isCourseComplete]),
  );

  useEffect(() => {
    if (
      rewardNode?.type !== NodeType.TROPHY &&
      rewardNode?.type !== NodeType.MILESTONE
    )
      return;

    const unitReward: UnitRewardContent =
      rewardUnit?.rewardContent ??
      (rewardNodeEntity?.rewardContent as UnitRewardContent | null) ??
      (rewardNode.rewardContent as UnitRewardContent | null) ?? {
        title: rewardUnit?.title ?? rewardNode.label ?? t("rewardFallback.unitComplete"),
        capabilityLabel: t("rewardFallback.achievement"),
        capabilityStatement: t("rewardFallback.unitCompletedMessage"),
        primaryActionLabel: t("rewardFallback.continue"),
      };

    dispatch(
      setPendingCelebration({
        courseId,
        celebration: {
          level: CelebrationLevel.UNIT,
          unitId: rewardUnit?.id ?? rewardNodeEntity?.unitId ?? "",
          unitTitle:
            rewardUnit?.title ??
            rewardNodeEntity?.title ??
            rewardNode.label ??
            t("rewardFallback.unitComplete"),
          content: unitReward,
        },
      }),
    );
    // ponytail: trigger App Store review prompt 2.0s after user completes a course unit
    setTimeout(() => {
      void requestReviewForMilestone("course_unit_completed");
    }, 2000);
    setRewardNode(null);
  }, [courseId, dispatch, rewardNode, rewardNodeEntity, rewardUnit]);

  const handleClaimReward = useCallback(async () => {
    if (!rewardNode || isClaimingReward) return;
    setIsClaimingReward(true);
    setRewardNode((current) =>
      current ? { ...current, status: NodeStatus.OPENING } : null,
    );

    try {
      await completeNode({ nodeId: rewardNode.id, courseId }).unwrap();
      const progress = await dispatch(
        journeyApi.endpoints.getCourseProgress.initiate(courseId, {
          forceRefetch: true,
        }),
      );
      if ("data" in progress && progress.data) {
        dispatch(setCourseProgress(progress.data));
      }
      setRewardNode((current) =>
        current ? { ...current, status: NodeStatus.CLAIMED } : null,
      );
    } catch {
      setRewardNode((current) =>
        current ? { ...current, status: NodeStatus.AVAILABLE } : null,
      );
      toast.show({
        placement: "top",
        variant: "danger",
        label: t("rewardFallback.claimError"),
      });
    } finally {
      setIsClaimingReward(false);
    }
  }, [completeNode, courseId, dispatch, isClaimingReward, rewardNode, toast]);

  const dismissReward = useCallback(() => {
    if (!isClaimingReward) setRewardNode(null);
  }, [isClaimingReward]);

  const dismissCelebration = useCallback(() => {
    // ponytail: mark course finale as seen inline without the separate screen
    if (pendingCelebration?.level === CelebrationLevel.COURSE) {
      markFinaleSeen(courseId).catch(() => {});
    }
    dispatch(setPendingCelebration({ courseId, celebration: null }));
  }, [courseId, dispatch, pendingCelebration, markFinaleSeen]);

  const insightCard =
    rewardNode?.type === NodeType.CHEST
      ? (rewardNode.rewardContent as InsightRewardContent | null)
      : null;

  return {
    rewardNode,
    insightCard,
    isClaimingReward,
    pendingCelebration,
    openRewardNode: setRewardNode,
    handleClaimReward,
    dismissReward,
    dismissCelebration,
  };
}
