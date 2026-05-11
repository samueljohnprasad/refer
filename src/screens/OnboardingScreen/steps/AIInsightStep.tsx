import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import { FeelingEmoji, StressTiming } from "../types";
import { FEELINGS } from "../constants";

interface AIInsightStepProps {
  feeling?: FeelingEmoji;
  timing?: StressTiming;
}

const TIMING_LABELS: Record<StressTiming, string> = {
  morning: "mornings",
  afternoon: "afternoons",
  evening: "evenings",
  night: "late nights",
};

const AIInsightStep: React.FC<AIInsightStepProps> = ({ feeling, timing }) => {
  const feelingLabel =
    FEELINGS.find((f) => f.id === feeling)?.label ?? "that way";
  const timingLabel = timing ? TIMING_LABELS[timing] : "evenings";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
      className="flex-1 px-6 pt-6"
    >
      <Animated.View entering={FadeInUp.delay(100).duration(500)}>
        <Text
          style={{ fontFamily: "CormorantSemiBold" }}
          className="text-2xl text-ink"
        >
          Mochi's first insight
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(600)}
        className="mt-5 rounded-[20px] border-2 border-gold bg-cream p-5"
      >
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
            ✨ AI Insight
          </Text>
        </View>
        <Text
          style={{ fontFamily: "CormorantMedium" }}
          className="mt-3 text-base italic leading-[1.5] text-ink"
        >
          You named feeling {feelingLabel.toLowerCase()} — and just by doing
          that, you've already begun to quiet the intensity. The {timingLabel},
          the heaviest stretch of your day, is when this practice matters most.
        </Text>
        <View className="mt-3 flex-row items-center gap-2.5">
          <MochiMascot expression="notes" size={40} animate={false} />
          <Text className="flex-1 text-xs text-ink-soft">
            — Mochi, based on your answers
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(500).duration(500)}
        className="mt-5 rounded-[20px] border-2 border-sage-100 bg-warm-white p-5"
      >
        <Text className="text-xs font-bold uppercase tracking-wider text-sage-500">
          🧠 CBT Exercise: 5-4-3-2-1 Grounding
        </Text>
        <Text className="mt-3 text-sm leading-[1.5] text-ink-soft">
          When stress hits, name:
        </Text>
        <View className="mt-2 gap-1.5">
          <Text className="text-sm text-ink">5 things you can see</Text>
          <Text className="text-sm text-ink">4 things you can touch</Text>
          <Text className="text-sm text-ink">3 things you can hear</Text>
          <Text className="text-sm text-ink">2 things you can smell</Text>
          <Text className="text-sm text-ink">1 thing you can taste</Text>
        </View>
        <Text className="mt-3 text-xs italic text-ink-muted">
          This pulls your attention from thoughts back to your body —
          interrupting the stress spiral.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(700).duration(400)}
        className="mt-4 flex-row items-start gap-2 rounded-xl bg-sage-300/15 p-3"
      >
        <Text className="text-[13px] font-bold text-sage-600">📚</Text>
        <Text className="flex-1 text-[11px] leading-[1.4] text-ink-soft">
          <Text className="font-semibold text-sage-700">
            Lieberman et al., UCLA (2007):
          </Text>{" "}
          "Putting Feelings Into Words" — naming an emotion activates the
          prefrontal cortex while quieting the amygdala.
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default React.memo(AIInsightStep);
