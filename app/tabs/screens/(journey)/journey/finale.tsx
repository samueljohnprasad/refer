import React, { useCallback, useEffect } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useAppSelector } from "@/src/store/hooks";
import {
  selectCourse,
  selectCourseProgressForCourse,
  selectIsCourseCompleteForCourse,
} from "@/src/domains/journey/state/journeySelectors";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import { CourseFinaleScreen } from "@/src/domains/journey/ui/screens/CourseFinaleScreen";

export default function FinaleRoute() {
  const { courseId = "" } = useLocalSearchParams<{ courseId: string }>();
  const course = useAppSelector((state) => selectCourse(state, courseId));
  const progress = useAppSelector((state) =>
    selectCourseProgressForCourse(state, courseId),
  );
  const isCourseComplete = useAppSelector((state) =>
    selectIsCourseCompleteForCourse(state, courseId),
  );
  const [markFinaleSeen, mutation] =
    journeyApi.useMarkCourseFinaleSeenMutation();

  useEffect(() => {
    if (progress?.finaleSeenAt || !isCourseComplete) router.back();
  }, [isCourseComplete, progress?.finaleSeenAt]);

  const dismiss = useCallback(async () => {
    if (!courseId || mutation.isLoading) return;
    try {
      await markFinaleSeen(courseId).unwrap();
      router.back();
    } catch {
      // Keep finale open. Learner can retry without losing the once-only state.
    }
  }, [courseId, markFinaleSeen, mutation.isLoading]);

  if (
    !course ||
    !course.rewardContent ||
    progress?.finaleSeenAt ||
    !isCourseComplete
  ) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "fade",
        }}
      />
      <CourseFinaleScreen
        courseTitle={course.title}
        content={course.rewardContent}
        isDismissing={mutation.isLoading}
        onReview={dismiss}
        onDismiss={dismiss}
      />
    </>
  );
}
