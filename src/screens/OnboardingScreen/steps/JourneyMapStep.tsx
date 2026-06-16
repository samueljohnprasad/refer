import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import JourneyNode from "../components/JourneyNode";
import { MOTIVATION_COURSE_MAP } from "../constants";
import { MotivationAnswer } from "../types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Fire02Icon } from "@hugeicons/core-free-icons";

interface JourneyMapStepProps {
  motivation?: MotivationAnswer;
}

const JourneyMapStep: React.FC<JourneyMapStepProps> = ({
  motivation = "anxiety",
}) => {
  const course = MOTIVATION_COURSE_MAP[motivation];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-6"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              style={{ fontFamily: "FrauncesSemiBold" }}
              className="text-[22px] text-ink"
            >
              Your journey
            </Text>
            <Text className="mt-0.5 text-[13px] text-ink-muted">
              {course.title}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 bg-terracotta px-3 py-1.5 rounded-full">
            <HugeiconsIcon icon={Fire02Icon} size={14} color="#FFFFFF" />
            <Text className="text-sm font-bold text-white">1</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-6"
      >
        <Text className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-sage-500">
          {course.tagline}
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
