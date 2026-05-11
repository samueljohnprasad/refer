import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
const STAT_CARDS = [
  { value: "🔥 1", label: "Day streak", accentClassName: "text-terracotta" },
  { value: "7%", label: "Journey", accentClassName: "text-sage-600" },
  { value: "1/14", label: "Lessons", accentClassName: "text-sage-600" },
] as const;

const LessonCompleteStep: React.FC = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center">
        <MochiMascot expression="celebrating" size={140} delay={40} />

        <Animated.View
          entering={FadeIn.duration(180).delay(120)}
          className="mt-4 items-center"
        >
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="text-[28px] text-ink"
          >
            Lesson complete!
          </Text>
          <Text className="mt-2 text-center text-sm text-ink-soft">
            You showed up. That's the whole thing.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(180).delay(200)}
          className="mt-6"
        >
          <View className="rounded-full bg-gold px-5 py-2.5">
            <Text className="text-lg font-bold text-sage-700">+20 XP</Text>
          </View>
        </Animated.View>

        <View className="mt-8 w-full flex-row justify-center gap-4">
          {STAT_CARDS.map((card, index) => (
            <Animated.View
              key={card.label}
              entering={FadeIn.duration(180).delay(280 + index * 60)}
              className="items-center rounded-2xl border border-sage-100 bg-warm-white px-5 py-3"
            >
              <Text className={`text-lg font-bold ${card.accentClassName}`}>
                {card.value}
              </Text>
              <Text className="text-[10px] uppercase text-ink-muted">
                {card.label}
              </Text>
            </Animated.View>
          ))}
        </View>

        <Animated.Text
          entering={FadeIn.duration(180).delay(500)}
          className="mt-6 text-center text-xs italic text-ink-muted"
        >
          Five minutes. Just like you said.
        </Animated.Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(LessonCompleteStep);
