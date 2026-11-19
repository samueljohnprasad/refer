// ponytail: Happi asks one question (.agents/behavioral-activation.html's `head`): mascot + speech bubble,
// the instruction under it as plain text. Happi steps aside once help was opened.
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { HappiStage } from "@/src/domains/onboarding/ui/presentation/components/HappiStage";
import { useHappiGuideMotion } from "@/src/domains/onboarding/ui/containers/useHappiGuideMotion";
import type { ActingPose } from "@/src/domains/onboarding/ui/containers/happiPoses";
import { useExercisePose } from "@/src/components/exercise/steps/exercisePose";
import { useBaCrisis } from "./baHelp";

export function BaAsk({ question, sub, pose }: { question: string; sub?: string; pose?: ActingPose }): React.JSX.Element {
  const solo = useBaCrisis();
  const motion = useHappiGuideMotion();
  const { setPose } = motion;
  const fromFlow = useExercisePose();
  const wanted = pose ?? fromFlow;
  useEffect(() => setPose(wanted), [setPose, wanted]);
  return (
    <View>
      <View className="mb-5 mt-4 flex-row items-end gap-2">
        {!solo && (
          <View style={{ width: 84, aspectRatio: 220 / 246, marginBottom: -4 }}>
            <HappiStage motion={motion} size="scene" width={84} />
          </View>
        )}
        <View className="flex-1 self-center rounded-2xl bg-happy-tint px-4 py-3">
          {!solo && (
            <View className="absolute" style={{ left: -8, bottom: 18, borderWidth: 8, borderColor: "transparent", borderRightColor: "#f2f8ef", borderLeftWidth: 0 }} />
          )}
          <Text accessibilityRole="header" className="font-display text-t-h font-semibold leading-[28px] text-happy-label">
            {question}
          </Text>
        </View>
      </View>
      {sub ? <Text className="-mt-3 mb-4 text-t-sub font-medium leading-[22px] text-happy-label-2">{sub}</Text> : null}
    </View>
  );
}
