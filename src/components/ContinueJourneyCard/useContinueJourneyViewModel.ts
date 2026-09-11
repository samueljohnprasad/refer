// src/components/ContinueJourneyCard/useContinueJourneyViewModel.ts
// ponytail: hook for state derivation, haptics, navigation, analytics

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { usePostHog } from "posthog-react-native";
import { useAppSelector } from "@/src/store/hooks";
import { useActiveCourse } from "@/hooks/journey/useActiveCourse";
import { useJourneyMap } from "@/hooks/journey/useJourneyMap";
import {
  selectCourse,
  selectCurrentNodeForCourse,
} from "@/src/domains/journey/state/journeySelectors";
import { selectNodeProgressMap } from "@/src/domains/journey/state/journeySelectorBase";
import type {
  ContinueJourneyCardState,
  UseContinueJourneyViewModelResult,
} from "./types";

export function useContinueJourneyViewModel(): UseContinueJourneyViewModelResult {
  const router = useRouter();
  const posthog = usePostHog();

  const {
    courseId,
    isLoading: isLoadingActiveCourse,
    error: activeCourseError,
    retry: retryActiveCourse,
  } = useActiveCourse();

  const {
    isLoading: isLoadingMap,
    isLoaded: isMapLoaded,
    error: mapError,
    retry: retryMap,
  } = useJourneyMap(courseId);

  const course = useAppSelector((state) =>
    courseId ? selectCourse(state, courseId) : undefined,
  );

  const currentNode = useAppSelector((state) =>
    courseId ? selectCurrentNodeForCourse(state, courseId) : null,
  );

  const nodeProgressMap = useAppSelector(selectNodeProgressMap);

  const state: ContinueJourneyCardState = useMemo(() => {
    // 1. Loading state (State D) - ensure no flash of empty state
    const isPreparing =
      isLoadingActiveCourse ||
      (Boolean(courseId) && isLoadingMap && !isMapLoaded);

    if (isPreparing) {
      return { type: "loading" };
    }

    // 2. Error state (State E)
    const hasError = Boolean(activeCourseError || (courseId && mapError));
    if (hasError && !course) {
      return { type: "error_fallback", actionLabel: "Open journeys" };
    }

    // 3. No active course state (State B)
    if (!courseId || !course) {
      return {
        type: "no_active_course",
        title: "Find your next step",
        description: "Choose a journey to start learning.",
        actionLabel: "Explore journeys",
      };
    }

    // 4. Active course with next activity (State A)
    if (currentNode) {
      const nodeProgress = nodeProgressMap[currentNode.id];
      const isInProgress =
        nodeProgress?.status === "in_progress" ||
        nodeProgress?.status === "attempted";

      return {
        type: "active_next_activity",
        courseId,
        courseTitle: course.title,
        courseArtworkKey: course.iconUrl,
        courseColorHex: course.colorHex,
        activityId: currentNode.id,
        activityTitle: currentNode.title,
        activityType: currentNode.type,
        estimatedMins:
          currentNode.estimatedMins && currentNode.estimatedMins > 0
            ? currentNode.estimatedMins
            : null,
        actionLabel: "Continue learning",
        isInProgress,
      };
    }

    // 5. Course completed (State C)
    return {
      type: "course_completed",
      courseId,
      courseTitle: course.title,
      title: "Journey complete",
      description: "You can revisit the skills you’ve learned.",
      actionLabel: "Review your skills",
    };
  }, [
    activeCourseError,
    course,
    courseId,
    currentNode,
    isLoadingActiveCourse,
    isLoadingMap,
    isMapLoaded,
    mapError,
    nodeProgressMap,
  ]);

  // Track state view analytics
  const lastTrackedStateRef = useRef<string | null>(null);
  useEffect(() => {
    if (state.type === "loading") return;
    const trackingKey = `${state.type}:${"courseId" in state ? state.courseId : ""}`;
    if (lastTrackedStateRef.current === trackingKey) return;
    lastTrackedStateRef.current = trackingKey;

    const eventPayload: Record<string, string> = { state: state.type };
    if ("courseId" in state && state.courseId) {
      eventPayload.course_id = state.courseId;
    }
    posthog?.capture("home_journey_card_viewed", eventPayload);
  }, [posthog, state]);

  const handleCardPress = useCallback((): void => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (state.type) {
      case "active_next_activity":
        posthog?.capture("home_journey_card_tapped", {
          action: "continue_learning",
          course_id: state.courseId,
          activity_id: state.activityId,
        });
        router.push({
          pathname: "/tabs/screens/journey-flow",
          params: { courseId: state.courseId, nodeId: state.activityId },
        });
        break;

      case "no_active_course":
        posthog?.capture("home_journey_card_tapped", {
          action: "explore_journeys",
        });
        router.push("/tabs/(tabs)/journeys");
        break;

      case "course_completed":
        posthog?.capture("home_journey_card_tapped", {
          action: "review_skills",
          course_id: state.courseId,
        });
        router.push("/tabs/(tabs)/journeys");
        break;

      case "error_fallback":
        posthog?.capture("home_journey_card_tapped", {
          action: "open_journeys",
        });
        router.push("/tabs/(tabs)/journeys");
        break;

      case "loading":
        break;
    }
  }, [posthog, router, state]);

  const handleRetry = useCallback((): void => {
    retryActiveCourse();
    if (courseId) retryMap();
  }, [courseId, retryActiveCourse, retryMap]);

  return {
    state,
    actions: {
      handleCardPress,
      handleRetry,
    },
  };
}
