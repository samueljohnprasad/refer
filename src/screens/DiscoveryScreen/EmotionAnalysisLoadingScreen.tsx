import React, { useEffect } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import useEmotionsAnalysis, {
  AnalysisCompletedType,
} from "@/hooks/useEmotionsAnalysis";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { selectedDateDiscoveryAtom } from "./helpers";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { Feather } from "@expo/vector-icons";
import { ProcessingPhase } from "./types";
import { useTranslation } from "react-i18next";

interface EmotionAnalysisLoadingScreenProps {
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
  recordingUri?: string;
  journalText?: string;
  onCancel?: () => void;
}

// ponytail: 4-step progress mapping for visual reassurance
const PHASE_CONFIG: Record<
  ProcessingPhase,
  { step: number; labelKey: string; progress: number }
> = {
  [ProcessingPhase.TRANSCRIBING]: {
    step: 1,
    labelKey: "phaseTranscribing",
    progress: 0.25,
  },
  [ProcessingPhase.ANALYZING_EMOTIONS]: {
    step: 2,
    labelKey: "phaseUnderstanding",
    progress: 0.5,
  },
  [ProcessingPhase.GENERATING_INSIGHTS]: {
    step: 3,
    labelKey: "phaseInsights",
    progress: 0.75,
  },
  [ProcessingPhase.FINALIZING]: {
    step: 4,
    labelKey: "phasePreparing",
    progress: 1.0,
  },
};

// ponytail: 4-second therapeutic breath halo (inhale 2s, exhale 2s) with gentle panda pulse
const BreathingAura = () => {
  const { t } = useTranslation("journal");
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0.45);
  const pandaScale = useSharedValue(0.97);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    pandaScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.97, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [scale, opacity, pandaScale]);

  const auraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const pandaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pandaScale.value }],
  }));

  return (
    <View className="items-center justify-center">
      {/* Outer soft breath circle */}
      <Animated.View
        className="absolute w-56 h-56 rounded-full bg-emerald-500/[0.12]"
        style={auraStyle}
      />
      {/* Inner subtle glow */}
      <View className="w-44 h-44 rounded-full bg-emerald-500/[0.08] items-center justify-center">
        <Animated.View style={pandaStyle}>
          <Image
            source={require("@/assets/images/panda/panda-notes.png")}
            className="w-28 h-28"
            resizeMode="contain"
            accessibilityLabel={t("capture.analysis.mascot")}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export const EmotionAnalysisLoadingScreen: React.FC<
  EmotionAnalysisLoadingScreenProps
> = ({ onAnalysisCompleted, recordingUri, journalText, onCancel }) => {
  const { t } = useTranslation("journal");
  const { processingPhase } = useEmotionsAnalysis({
    uri: recordingUri,
    journalText,
    onAnalysisCompleted,
    onAnalysisError: () => {
      onCancel?.();
    },
  });

  const currentPhase =
    PHASE_CONFIG[processingPhase] || PHASE_CONFIG[ProcessingPhase.TRANSCRIBING];

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor:
          SEMANTIC_COLORS.surface.canvas === "#0f1a0f"
            ? "#0f1a0f"
            : "#FAF8F5",
      }}
    >
      {/* Top Header: Clean [✕] with Dynamic Island clearance */}
      <SafeAreaView edges={["top"]}>
        <View className="flex-row items-center justify-between h-14 px-6 pt-2">
          {onCancel ? (
            <TouchableOpacity
              onPress={onCancel}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/[0.04] active:opacity-60"
              accessibilityLabel={t("capture.analysis.cancel")}
              accessibilityRole="button"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Feather
                name="x"
                size={20}
                color={SEMANTIC_COLORS.text.secondary as string}
              />
            </TouchableOpacity>
          ) : (
            <View className="w-10 h-10" />
          )}

          {/* Right Spacer for balance */}
          <View className="w-10 h-10" />
        </View>
      </SafeAreaView>

      {/* Main Content: Therapeutic Breathing Aura + Progress */}
      <View className="flex-1 items-center justify-center px-8 -mt-10">
        {/* Breathing Mascot Aura */}
        <View className="mb-7">
          <BreathingAura />
        </View>

        {/* Phase Heading */}
        <Text
          className="text-[26px] leading-[32px] tracking-tight happy-font-body-bold text-center"
          style={{ color: SEMANTIC_COLORS.text.primary }}
        >
          {t(`capture.analysis.${currentPhase.labelKey}`, { defaultValue: currentPhase.labelKey })}
        </Text>

        {/* ponytail: 4-segment tactile progress bar (Duolingo style) */}
        <View className="w-72 flex-row gap-2 mt-6">
          {[1, 2, 3, 4].map((stepNum) => {
            const isFilled = currentPhase.step >= stepNum;

            return (
              <View
                key={stepNum}
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{
                  backgroundColor: isFilled
                    ? (SEMANTIC_COLORS.brand.primary as string)
                    : "rgba(0, 0, 0, 0.08)",
                }}
              />
            );
          })}
        </View>

        {/* Step Indicator */}
        <Text
          className="text-xs happy-font-body-semibold mt-3 tracking-wide"
          style={{ color: SEMANTIC_COLORS.text.secondary }}
        >
          {t("capture.analysis.step", { step: currentPhase.step, label: t(`capture.analysis.${currentPhase.labelKey}`, { defaultValue: currentPhase.labelKey }) })}
        </Text>

        {/* Calming reassurance copy */}
        <Text
          className="text-[14px] leading-5 text-center mt-7 max-w-[280px] happy-font-body-medium"
          style={{ color: "#4B5563" }}
        >
          {t("capture.analysis.reassurance")}
        </Text>
      </View>
    </View>
  );
};

export default EmotionAnalysisLoadingScreen;
