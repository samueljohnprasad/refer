import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import EmojiSelector from "../components/EmojiSelector";
import { FeelingEmoji } from "../types";

interface MoodCheckLessonStepProps {
  selected?: FeelingEmoji;
  onSelect: (feeling: FeelingEmoji) => void;
}

const MoodCheckLessonStep: React.FC<MoodCheckLessonStepProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-6"
    >
      <Animated.View entering={FadeIn.duration(180).delay(80)}>
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-sage-50 px-2.5 py-1">
            <Text className="text-[11px] font-bold text-sage-600">
              LESSON 1 · +10 XP
            </Text>
          </View>
        </View>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="mt-3 text-[26px] leading-[1.1] text-ink"
        >
          A 30-second lesson, then we'll try it
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-5 rounded-[20px] border-2 border-sage-100 bg-warm-white p-5"
      >
        <Text className="text-xs font-bold uppercase tracking-wider text-sage-500">
          📖 The Concept
        </Text>
        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-3 text-[15px] leading-[1.5] text-ink"
        >
          When you put a feeling into specific words, your thinking brain takes
          over and your fear brain quiets down. Researchers call it affect
          labeling — the intensity drops by roughly 40%, on average.
        </Text>
        <View className="mt-4 flex-row items-center justify-center gap-3">
          <View className="items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-sage-200 bg-white">
              <Text className="text-lg">😨</Text>
            </View>
            <Text className="mt-1 text-[10px] text-ink-muted">Feel it</Text>
          </View>
          <Text className="text-ink-muted">→</Text>
          <View className="items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-sage-200 bg-white">
              <Text className="text-lg">📝</Text>
            </View>
            <Text className="mt-1 text-[10px] text-ink-muted">Name it</Text>
          </View>
          <Text className="text-ink-muted">→</Text>
          <View className="items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-sage-200 bg-white">
              <Text className="text-lg">❄️</Text>
            </View>
            <Text className="mt-1 text-[10px] text-ink-muted">Cools</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(240)}
        className="mt-5 rounded-[20px] border-2 border-sage-100 bg-warm-white p-5"
      >
        <Text className="text-xs font-bold uppercase tracking-wider text-terracotta">
          ✏️ Now: name yours
        </Text>
        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-3 text-[22px] text-ink"
        >
          How are you, <Text className="italic">really?</Text>
        </Text>
        <View className="mt-4">
          <EmojiSelector selected={selected} onSelect={onSelect} />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(MoodCheckLessonStep);
