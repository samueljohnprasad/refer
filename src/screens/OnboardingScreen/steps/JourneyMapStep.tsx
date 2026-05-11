import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import JourneyNode from "../components/JourneyNode";
import { JOURNEY_MAP_NODES } from "../constants";

interface JourneyMapStepProps {
  planName: string;
}

const JourneyMapStep: React.FC<JourneyMapStepProps> = ({ planName }) => {
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
              style={{ fontFamily: "CormorantSemiBold" }}
              className="text-[22px] text-ink"
            >
              Your journey
            </Text>
            <Text className="mt-0.5 text-[13px] text-ink-muted">
              {planName}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-full bg-terracotta px-3 py-1.5">
            <Text className="text-sm font-bold text-white">🔥 1</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-6"
      >
        <Text className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-sage-500">
          {planName}
        </Text>
        {JOURNEY_MAP_NODES.map((node, index) => (
          <JourneyNode
            key={node.id}
            node={node}
            isLast={index === JOURNEY_MAP_NODES.length - 1}
            index={index}
          />
        ))}
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(JourneyMapStep);
