// ponytail: every exercise step opens the way the prototypes do (.agents/thought-reframing.html `head()`):
// Happi, and the one question in her speech bubble with a plain line under it. One shared piece so the
// shared step layout and reframing's own steps don't each carry a copy.
import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HappiStage } from "@/src/domains/onboarding/ui/presentation/components/HappiStage";
import { useHappiGuideMotion } from "@/src/domains/onboarding/ui/containers/useHappiGuideMotion";
import type { ActingPose } from "@/src/domains/onboarding/ui/containers/happiPoses";
import { useExercisePose } from "./exercisePose";

interface StepHappiTitleProps {
  title: string;
  subtitle?: string;
  pose?: ActingPose;
}

export const StepHappiTitle: React.FC<StepHappiTitleProps> = React.memo(
  ({ title, subtitle, pose: poseOverride }) => {
    const exercisePose = useExercisePose();
    const pose = poseOverride ?? exercisePose;
    const motion = useHappiGuideMotion();
    const { setPose } = motion;
    useEffect(() => setPose(pose), [setPose, pose]);

    return (
      <View className="mb-5 flex-row items-end gap-2">
        <View style={{ width: 84, aspectRatio: 220 / 246, marginBottom: -4 }}>
          <HappiStage motion={motion} size="scene" width={84} />
        </View>
        <View className="flex-1 self-center rounded-2xl bg-happy-tint px-4 py-3">
          <View
            className="absolute"
            style={{ left: -8, bottom: 18, borderWidth: 8, borderColor: "transparent", borderRightColor: "#f2f8ef", borderLeftWidth: 0 }}
          />
          <Text variant="h1" accessibilityRole="header" className="text-t-h leading-[28px]">
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-1 text-t-sub font-semibold leading-[21px] text-happy-label-2">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    );
  },
);

StepHappiTitle.displayName = "StepHappiTitle";
