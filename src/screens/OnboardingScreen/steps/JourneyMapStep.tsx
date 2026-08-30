import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text, View, ScrollView } from "react-native";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import JourneyNode from "../components/JourneyNode";
import { MOTIVATION_COURSE_MAP } from "../constants";
import type { MotivationAnswer } from "../types";

interface JourneyMapStepProps {
  motivation?: MotivationAnswer;
}

const JourneyMapStep: React.FC<JourneyMapStepProps> = ({
  motivation = "anxiety",
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const course = MOTIVATION_COURSE_MAP[motivation];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 160,
        paddingTop: headerHeight - insets.top,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-6"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[28px] leading-[1.1] text-ink"
            >
              Your first course
            </Text>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="mt-1 text-[15px] text-sage-700"
            >
              {course.title}
            </Text>
          </View>
          <View className="rounded-full bg-sage-100 px-3 py-1.5">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-xs text-sage-700"
            >
              {course.durationLessons} lessons
            </Text>
          </View>
        </View>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-3 text-[15px] leading-[22px] text-ink-soft"
        >
          {course.tagline} Each lesson pairs a short concept with a guided CBT
          practice.
          {/* ponytail: courses structure displays lessons instead of days */}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-7"
      >
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="mb-4 text-[13px] text-ink-soft"
        >
          Start here. Later lessons unlock as you progress.
        </Text>
        {course.nodes.map((node, index) => (
          <JourneyNode
            key={node.id}
            node={node}
            isLast={index === course.nodes.length - 1}
            index={index}
          />
        ))}
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(JourneyMapStep);
