// domains/journey/ui/components/NextJourneyBridgeDock.tsx
// Persistent floating milestone dock displayed on completed journey maps.

import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trophy } from "lucide-react-native";
import { Button } from "@/src/components/ui/Button";
import type { NextJourneyBridgeDockProps } from "@/specs/019-next-journey-bridge/contracts/NextJourneyBridgeContract";

// ponytail: subtle floating shadow on unclipped outer container (preserves iOS shadow)
const DOCK_SHADOW = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 6,
  borderRadius: 28,
} as const;

export const NextJourneyBridgeDock: React.FC<NextJourneyBridgeDockProps> = React.memo(
  function NextJourneyBridgeDock({
    nextCourse,
    isAllCoursesCompleted,
    isLoading = false,
    onStartNextCourse,
    onBrowseCatalog,
    currentCourseTitle = "Course",
    completionMessage,
  }) {
    const insets = useSafeAreaInsets();
    // 24pt+ visual breathing room above native tab bar (~49pt + insets.bottom + 25pt margin)
    const bottomOffset = Math.max(insets.bottom + 74, 88);

    // ponytail: two-beat sequence (Beat 1: accomplishment 0ms, Beat 2: next journey 300ms)
    const iconScale = useSharedValue(0.85);
    const topOpacity = useSharedValue(0);
    const topTranslateY = useSharedValue(6);
    const bottomOpacity = useSharedValue(0);
    const bottomTranslateY = useSharedValue(6);

    useEffect(() => {
      iconScale.value = withTiming(1, {
        duration: 320,
        easing: Easing.out(Easing.back(1.4)),
      });
      topOpacity.value = withTiming(1, { duration: 280 });
      topTranslateY.value = withTiming(0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      });

      bottomOpacity.value = withDelay(300, withTiming(1, { duration: 320 }));
      bottomTranslateY.value = withDelay(
        300,
        withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) }),
      );
    }, [iconScale, topOpacity, topTranslateY, bottomOpacity, bottomTranslateY]);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: iconScale.value }],
    }));

    const topAnimatedStyle = useAnimatedStyle(() => ({
      opacity: topOpacity.value,
      transform: [{ translateY: topTranslateY.value }],
    }));

    const bottomAnimatedStyle = useAnimatedStyle(() => ({
      opacity: bottomOpacity.value,
      transform: [{ translateY: bottomTranslateY.value }],
    }));

    if (isAllCoursesCompleted) {
      return (
        <View
          style={[{ bottom: bottomOffset }, DOCK_SHADOW]}
          className="absolute left-4 right-4 z-40"
        >
          <View className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-[28px] p-6 overflow-hidden">
            <Animated.View style={topAnimatedStyle}>
              <View className="flex-row items-center gap-2 mb-2">
                <Animated.View
                  style={iconAnimatedStyle}
                  className="w-7 h-7 rounded-full bg-emerald-100/70 dark:bg-emerald-950/60 items-center justify-center"
                >
                  <Trophy size={14} color="#059669" strokeWidth={2.2} />
                </Animated.View>
                <Text className="text-[11px] font-nunito-extrabold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
                  ALL COURSES COMPLETE
                </Text>
              </View>
              <Text className="text-[21px] font-nunito-bold text-neutral-900 dark:text-neutral-50 mb-1.5 leading-snug">
                All Caught Up!
              </Text>
              <Text className="text-[15px] font-nunito-medium text-neutral-600 dark:text-neutral-400 leading-relaxed mb-5">
                You've completed all available journeys. Check back soon for new content or explore the catalog.
              </Text>
              <Button
                label="Browse Course Catalog"
                variant="primary"
                size="md"
                height={50}
                fullWidth
                loading={isLoading}
                onPress={onBrowseCatalog}
                accessibilityLabel="Browse course catalog"
              />
            </Animated.View>
          </View>
        </View>
      );
    }

    if (!nextCourse) {
      return null;
    }

    // Authored copy or concise fallback per design specification
    const isSleepCourse = currentCourseTitle.toLowerCase().includes("sleep");
    const courseCompletionText = isSleepCourse
      ? "You built tools you can return to when sleep gets difficult."
      : completionMessage || "You built tools you can return to whenever you need them.";

    const nextCourseDesc =
      nextCourse.title.toLowerCase().includes("anxiety")
        ? "Learn to recognize the alarm, test its predictions, and respond differently."
        : nextCourse.description ||
          "Continue your progress with the next learning journey.";

    return (
      <View
        style={[{ bottom: bottomOffset }, DOCK_SHADOW]}
        className="absolute left-4 right-4 z-40"
      >
        <View className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-[28px] overflow-hidden">
          {/* TOP ZONE: Accomplishment */}
          <Animated.View
            style={topAnimatedStyle}
            className="px-5 pt-6 pb-5 bg-white dark:bg-neutral-900"
          >
            <View className="flex-row items-center gap-2 mb-2">
              <Animated.View
                style={iconAnimatedStyle}
                className="w-7 h-7 rounded-full bg-emerald-100/70 dark:bg-emerald-950/60 items-center justify-center"
              >
                <Trophy size={14} color="#059669" strokeWidth={2.2} />
              </Animated.View>
              <Text className="text-[11px] font-nunito-extrabold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
                COURSE COMPLETE
              </Text>
            </View>
            <Text className="text-[21px] font-nunito-bold text-neutral-900 dark:text-neutral-50 mb-1.5 leading-snug">
              {currentCourseTitle}
            </Text>
            <Text className="text-[15px] font-nunito-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {courseCompletionText}
            </Text>
          </Animated.View>

          {/* BOTTOM ZONE: Natural Continuation (Subtle pale-sage shift, tactile depth) */}
          <Animated.View
            style={bottomAnimatedStyle}
            className="px-5 pt-4 pb-5 bg-[#F2F6F1] dark:bg-neutral-800/60 border-t border-black/[0.04] dark:border-white/[0.05]"
          >
            <Text className="text-[11px] font-nunito-extrabold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 mb-1">
              NEXT JOURNEY
            </Text>
            <Text
              numberOfLines={2}
              className="text-[19px] font-nunito-bold text-neutral-900 dark:text-neutral-50 leading-snug mb-1.5"
            >
              {nextCourse.title}
            </Text>
            <Text
              numberOfLines={2}
              className="text-[15px] font-nunito-medium text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4.5"
            >
              {nextCourseDesc}
            </Text>
            <Button
              label="START NEXT JOURNEY"
              variant="primary"
              size="md"
              height={50}
              fullWidth
              loading={isLoading}
              onPress={() => onStartNextCourse(nextCourse.id)}
              accessibilityLabel="Start next journey"
            />
            <Pressable
              onPress={onBrowseCatalog}
              hitSlop={12}
              className="pt-3.5 pb-0.5 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Browse all courses"
            >
              <Text className="text-sm font-nunito-bold text-neutral-600 dark:text-neutral-300">
                Browse all courses
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  },
);

export default NextJourneyBridgeDock;
