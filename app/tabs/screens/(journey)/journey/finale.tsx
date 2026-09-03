import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { selectCourse, selectCourseFinaleSeen } from "@/src/domains/journey/state/journeySelectors";
import { markCourseFinaleSeen } from "@/src/domains/journey/state/journeySlice";
import { getCourseRewardContent, FALLBACK_ACKNOWLEDGEMENT } from "@/src/data/journey/rewardsConfig";
import { CourseFinaleScreen } from "@/src/domains/journey/ui/screens/CourseFinaleScreen";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

export default function FinaleRoute() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  const course = useAppSelector((state) => selectCourse(state, courseId as string));
  const hasSeenFinale = useAppSelector((state) => selectCourseFinaleSeen(state, courseId as string));

  useEffect(() => {
    if (hasSeenFinale) {
      router.back();
    } else {
      setMounted(true);
    }
  }, [hasSeenFinale]);

  const handleDismiss = () => {
    void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM_STRONG);
    if (courseId) {
      dispatch(markCourseFinaleSeen({ courseId }));
    }
    router.back();
  };

  if (!mounted || !courseId || hasSeenFinale) {
    return null; // Don't render until we know we should show it
  }

  const rewardContent = getCourseRewardContent(courseId);
  const acknowledgement = rewardContent?.acknowledgement || FALLBACK_ACKNOWLEDGEMENT;
  const capabilitySummary = rewardContent?.capabilitySummary || [];

  if (capabilitySummary.length === 0) {
    console.warn(`[rewards] missing capabilitySummary for course ${courseId}`);
  }

  return (
    <CourseFinaleScreen
      courseTitle={course?.title || "Your Journey"}
      acknowledgement={acknowledgement}
      capabilitySummary={capabilitySummary}
      onDismiss={handleDismiss}
    />
  );
}
