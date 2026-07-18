import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import EmojiSelector from "../components/EmojiSelector";
import { FeelingEmoji } from "../types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { WorryIcon, Notebook01Icon, Leaf01Icon } from "@hugeicons/core-free-icons";
import { SAGE } from "@/lib/tokens";

interface MoodCheckLessonStepProps {
  selected?: FeelingEmoji;
  onSelect: (feeling: FeelingEmoji) => void;
}

const MoodCheckLessonStep: React.FC<MoodCheckLessonStepProps> = ({
  selected,
  onSelect,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 140, paddingTop: headerHeight - insets.top }}
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
          Day 1 · Lesson 1
        </Text>
        <Text
          style={{ fontFamily: "CormorantRegular" }}
          className="mt-3 text-center text-[28px] leading-[1.08] text-ink"
        >
          Naming the{" "}
          <Text
            style={{
              fontFamily: "CormorantRegularItalic",
              color: "#5F7F58",
            }}
          >
            feeling.
          </Text>
        </Text>
        <Text
          style={{ fontFamily: "GeistRegular" }}
          className="mt-2 text-center text-[15px] leading-[1.45] text-ink-soft"
        >
          Learn one skill, then practice it in under two minutes.
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
          style={{ fontFamily: "CormorantRegular" }}
          className="mt-3 text-[15px] leading-[1.55] text-ink"
        >
          When you put a feeling into{" "}
          <Text
            style={{
              fontFamily: "CormorantSemiBoldItalic",
              color: "#29452A",
            }}
          >
            specific words
          </Text>
          , it can become easier to pause and choose what to do next.
          {"\n\n"}This skill is called{" "}
          <Text
            style={{
              fontFamily: "CormorantSemiBoldItalic",
              color: "#29452A",
            }}
          >
            affect labeling
          </Text>{" "}
          . It helps create a little distance between you and the emotion.
        </Text>

        <View
          style={{
            marginTop: 14,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#D3E0CD",
            borderStyle: "dashed",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <View className="flex-1 items-center">
            <View className="h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-sage-200 bg-white">
              <HugeiconsIcon icon={WorryIcon} size={18} color={SAGE[600]} />
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
              <HugeiconsIcon icon={Notebook01Icon} size={18} color={SAGE[600]} />
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
              <HugeiconsIcon icon={Leaf01Icon} size={18} color={SAGE[600]} />
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
          style={{ fontFamily: "CormorantRegular" }}
          className="mt-2 text-[22px] leading-[1.3] text-ink"
        >
          How are you,{" "}
          <Text
            style={{
              fontFamily: "CormorantRegularItalic",
              color: "#5F7F58",
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
