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
      contentContainerStyle={{ paddingBottom: 140 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6 pt-3"
    >
      <Animated.View
        entering={FadeIn.duration(180).delay(80)}
        className="items-center"
      >
        <Text
          style={{ fontFamily: "GeistSemiBold" }}
          className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-sage-500"
        >
          Day 1 — Lesson 1 of 2
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="mt-3 text-center text-[28px] leading-[1.08] text-ink"
        >
          Naming the{" "}
          <Text
            style={{
              fontFamily: "FrauncesRegularItalic",
              color: "#5A7A56",
            }}
          >
            feeling.
          </Text>
        </Text>
        <Text
          style={{ fontFamily: "GeistRegular" }}
          className="mt-2 text-center text-[15px] leading-[1.45] text-ink-soft"
        >
          A 30-second lesson, then we&apos;ll try it.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(160)}
        className="mt-5 w-full rounded-[18px] border border-sage-200 bg-sage-50 px-[18px] py-[18px]"
      >
        <Text
          style={{ fontFamily: "GeistBold" }}
          className="text-[11px] uppercase tracking-[0.08em] text-sage-600"
        >
          📖 The Concept
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="mt-3 text-[15px] leading-[1.55] text-ink"
        >
          When you put a feeling into{" "}
          <Text
            style={{
              fontFamily: "FrauncesSemiBoldItalic",
              color: "#2A3F2A",
            }}
          >
            specific words
          </Text>
          , your thinking brain takes over and your fear brain quiets down.
          {"\n\n"}Researchers call it{" "}
          <Text
            style={{
              fontFamily: "FrauncesSemiBoldItalic",
              color: "#2A3F2A",
            }}
          >
            affect labeling
          </Text>{" "}
          — the intensity drops by roughly{" "}
          <Text
            style={{
              fontFamily: "FrauncesSemiBoldItalic",
              color: "#2A3F2A",
            }}
          >
            40%
          </Text>
          , on average.
        </Text>

        <View
          style={{
            marginTop: 14,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#D4CCB5",
            borderStyle: "dashed",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <View className="flex-1 items-center">
            <View className="h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-sage-200 bg-white">
              <Text className="text-[18px]">😨</Text>
            </View>
            <Text
              style={{ fontFamily: "GeistMedium" }}
              className="mt-1 text-[10px] uppercase tracking-[0.05em] text-ink-muted"
            >
              Feel it
            </Text>
          </View>
          <Text
            style={{ fontFamily: "GeistMedium" }}
            className="text-sm text-sage-300"
          >
            →
          </Text>
          <View className="flex-1 items-center">
            <View className="h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-sage-200 bg-white">
              <Text className="text-[18px]">📝</Text>
            </View>
            <Text
              style={{ fontFamily: "GeistMedium" }}
              className="mt-1 text-[10px] uppercase tracking-[0.05em] text-ink-muted"
            >
              Name it
            </Text>
          </View>
          <Text
            style={{ fontFamily: "GeistMedium" }}
            className="text-sm text-sage-300"
          >
            →
          </Text>
          <View className="flex-1 items-center">
            <View className="h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-sage-200 bg-white">
              <Text className="text-[18px]">❄️</Text>
            </View>
            <Text
              style={{ fontFamily: "GeistMedium" }}
              className="mt-1 text-[10px] uppercase tracking-[0.05em] text-ink-muted"
            >
              Cools
            </Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(180).delay(240)}
        className="mt-4 rounded-[24px] border-2 border-sage-100 bg-warm-white px-6 py-7"
      >
        <Text
          style={{ fontFamily: "GeistBold" }}
          className="text-[11px] uppercase tracking-[0.1em] text-terracotta"
        >
          ✏️ Now: name yours
        </Text>
        <Text
          style={{ fontFamily: "FrauncesRegular" }}
          className="mt-2 text-[22px] leading-[1.3] text-ink"
        >
          How are you,{" "}
          <Text
            style={{
              fontFamily: "FrauncesRegularItalic",
              color: "#5A7A56",
            }}
          >
            really?
          </Text>
        </Text>
        <View className="mt-5">
          <EmojiSelector selected={selected} onSelect={onSelect} />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(MoodCheckLessonStep);
