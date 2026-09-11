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

export function useJourneyRewardsController(courseId: string) {
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
    if (pendingCelebration?.level !== CelebrationLevel.COURSE) return;
    if (pushedFinaleCourseRef.current === courseId) return;
    pushedFinaleCourseRef.current = courseId;
    router.push({
      pathname: "/tabs/screens/(journey)/journey/finale",
      params: { courseId },
    });
    dispatch(setPendingCelebration({ courseId, celebration: null }));
  }, [courseId, dispatch, pendingCelebration]);

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
        title: rewardUnit?.title ?? rewardNode.label ?? "Unit Complete",
        capabilityLabel: "Achievement",
        capabilityStatement: "You've completed this unit!",
        primaryActionLabel: "Continue",
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
            "Unit Complete",
          content: unitReward,
        },
      }),
    );
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
        label: "We could not claim that reward. Try again.",
      });
    } finally {
      setIsClaimingReward(false);
    }
  }, [completeNode, courseId, dispatch, isClaimingReward, rewardNode, toast]);

  const dismissReward = useCallback(() => {
    if (!isClaimingReward) setRewardNode(null);
  }, [isClaimingReward]);

  const dismissCelebration = useCallback(() => {
    dispatch(setPendingCelebration({ courseId, celebration: null }));
  }, [courseId, dispatch]);

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
