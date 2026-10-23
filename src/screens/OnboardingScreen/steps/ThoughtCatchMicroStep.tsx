// ponytail: Duolingo-grade thought-catch micro-win with flat clean speech bubble & pinned thumb-zone CTA
import React, { useState, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SymbolView } from "expo-symbols";
import { Card } from "@/src/components/ui/Card";
import HappiMascot from "../components/HappiMascot";
import TactileButton from "../components/TactileButton";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SAGE } from "@/src/theme/palette";
import { useXP } from "@/src/context/XPContext";
import { XPActionType } from "@/src/types/xp";
import type { MotivationAnswer } from "../types";
import { DISTORTION_OPTIONS, THOUGHT_SCENARIOS } from "./thoughtCatchData";
import { SpeechBubbleCard } from "./SpeechBubbleCard";
import { useOnboardingAnalytics } from "../hooks/useOnboardingAnalytics";

interface ThoughtCatchMicroStepProps {
  onComplete: () => void;
  motivation?: MotivationAnswer;
}

export const ThoughtCatchMicroStep: React.FC<ThoughtCatchMicroStepProps> = ({
  onComplete,
  motivation,
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [selectedDistortion, setSelectedDistortion] = useState<string | null>(
    null,
  );
  const xp = useXP();
  const analytics = useOnboardingAnalytics();

  const scenario =
    (motivation && THOUGHT_SCENARIOS[motivation]) ?? THOUGHT_SCENARIOS.default;

  const handleSelect = useCallback(
    (id: string): void => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setSelectedDistortion(id);
      analytics.trackThoughtSelected(scenario.thought, id, scenario.thought);
      analytics.trackThoughtReframeViewed(id);

      // ponytail: award +10 XP immediately on reframing and persist locally per AD-8
      void xp?.awardXP(XPActionType.EXERCISE_COMPLETE, {
        customAmount: 10,
        customDescription: "First Thought Reframed",
      });

      void AsyncStorage.setItem(
        "@happy/onboarding_thought_catch",
        JSON.stringify({
          raw_thought: scenario.thought,
          reframed_thought: scenario.reframe,
          distortion_id: id,
          completed_at: new Date().toISOString(),
        }),
      );
    },
    [xp, scenario, analytics],
  );

  const handleContinue = useCallback((): void => {
    Haptics.selectionAsync();
    onComplete();
  }, [onComplete]);

  const hasSelected = selectedDistortion !== null;
  const activeOption = DISTORTION_OPTIONS.find((o) => o.id === selectedDistortion);

  return (
    <View className="flex-1">
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        contentContainerStyle={{
          paddingTop: (headerHeight > 0 ? headerHeight : insets.top + 44) + 8,
          paddingBottom: 20,
        }}
        className="flex-1 px-5"
      >
        {/* 1. Header Block */}
        <Animated.View entering={FadeIn.duration(200)} className="mb-4">
          <View className="flex-row items-center mb-1.5">
            <View className="rounded-full bg-sage-100 px-3 py-1 border border-sage-200">
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.bold, color: SAGE[800] }}
                className="text-[11px] uppercase tracking-wider"
              >
                {hasSelected ? "Thought caught" : "Lesson 1 · 30s micro-win"}
              </Text>
            </View>
          </View>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
            className="text-[26px] text-ink leading-tight"
          >
            {hasSelected ? "Reframed reality" : "Catch a racing thought"}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-1 text-[15px] text-ink-soft leading-snug"
          >
            {hasSelected
              ? "When you name the trap, the thought loses its grip."
              : "Thoughts aren't facts. Let's test one together."}
          </Text>
        </Animated.View>

        {/* 2. Duolingo Mascot + Speech Bubble Row */}
        <Animated.View
          entering={FadeInDown.duration(250).delay(80)}
          className="flex-row items-center gap-3.5 mb-5"
        >
          <View className="shrink-0">
            <HappiMascot
              expression={hasSelected ? "cheer" : "pondering"}
              size={92}
              animate={false}
              delay={0}
            />
          </View>

          <SpeechBubbleCard
            hasSelected={hasSelected}
            thought={scenario.thought}
            reframe={scenario.reframe}
          />
        </Animated.View>

        {/* 3. Cognitive Trap Choices using existing Design System Card */}
        {!hasSelected ? (
          <Animated.View
            entering={FadeInDown.duration(250).delay(150)}
            className="mt-1"
          >
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
              className="mb-3 text-[16px] text-ink"
            >
              Which cognitive trap is this?
            </Text>

            <View className="gap-3.5">
              {DISTORTION_OPTIONS.map((option, index) => (
                <Animated.View
                  key={option.id}
                  entering={FadeInDown.duration(200).delay(120 + index * 40)}
                >
                  <Card
                    variant="answer"
                    radius="lg"
                    onPress={() => handleSelect(option.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${option.label}, ${option.distortion}`}
                    className="w-full"
                    contentClassName="min-h-[72px] flex-row items-center gap-4 px-4 py-3.5"
                    showDepth
                    depth="default"
                    haptic="medium"
                  >
                    <View className="w-8 items-center justify-center">
                      <SymbolView
                        name={option.symbol}
                        size={24}
                        tintColor={SAGE[600]}
                        type="hierarchical"
                      />
                    </View>
                    <View className="min-w-0 flex-1">
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                        className="text-[16px] leading-tight text-ink"
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                        className="mt-1 text-[13px] leading-snug text-ink-soft"
                      >
                        {option.distortion}
                      </Text>
                    </View>
                  </Card>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeInDown.duration(250).delay(80)}
            className="mt-1 gap-3.5"
          >
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
              className="mb-1 text-[16px] text-ink"
            >
              Trap identified
            </Text>

            <Card
              variant="answer-selected"
              radius="lg"
              className="w-full"
              contentClassName="min-h-[72px] flex-row items-center gap-4 px-4 py-3.5"
              showDepth
              depth="default"
            >
              <View className="w-8 items-center justify-center">
                <SymbolView
                  name={activeOption?.symbol ?? "checkmark"}
                  size={24}
                  tintColor="#44633F"
                  type="hierarchical"
                />
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                  className="text-[16px] leading-tight text-sage-800"
                >
                  {activeOption?.label ?? "Trap Identified"}
                </Text>
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                  className="mt-1 text-[13px] leading-snug text-sage-700"
                >
                  Trap identified · Thought reframed
                </Text>
              </View>
              <SymbolView
                name="checkmark.circle.fill"
                size={22}
                tintColor="#587C51"
                type="hierarchical"
              />
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      {/* 4. Fixed Thumb-Zone CTA (Safe from clipping & eliminates scroll snap) */}
      {hasSelected && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="px-5 pt-3 bg-transparent"
        >
          <TactileButton
            label="CONTINUE (+10 XP)"
            onPress={handleContinue}
            variant="primary"
          />
        </Animated.View>
      )}
    </View>
  );
};

export default React.memo(ThoughtCatchMicroStep);
