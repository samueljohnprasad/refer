import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { StepHeader } from "../components/StepHeader";
import { StepNavigation } from "../components/StepNavigation";
import { BulletListInput } from "../components/BulletListInput";
import { getRandomSocraticPrompt } from "../data/cognitiveDistortions";

interface EvidenceAgainstStepProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const EvidenceAgainstStep: React.FC<EvidenceAgainstStepProps> =
  React.memo(
    ({
      items,
      onAdd,
      onRemove,
      onNext,
      onBack,
      canGoBack,
      isValid,
      progress,
    }) => {
      // Stable random prompt per mount
      const socraticPrompt: string = useMemo(
        () => getRandomSocraticPrompt(),
        [],
      );

      return (
        <View className="flex-1">
          <StepHeader
            title="Evidence against this thought"
            subtitle="What facts contradict this thought?"
            progress={progress}
            stepNumber={6}
            totalSteps={8}
          />

          {/* Socratic prompt nudge — Duolingo-style tip card */}
          <View
            className="rounded-2xl p-3.5 mb-4 flex-row items-start"
            style={{
              backgroundColor: "#F0FDF4",
              borderWidth: 2,
              borderColor: "#BBF7D0",
            }}
          >
            <View className="h-8 w-8 rounded-lg bg-green-100 items-center justify-center mr-3 mt-0.5">
              <Text className="text-base">🤔</Text>
            </View>
            <Text className="text-sm text-green-800 leading-relaxed flex-1 font-medium">
              Try asking yourself: "{socraticPrompt}"
            </Text>
          </View>

          <View className="flex-1">
            <BulletListInput
              items={items}
              onAdd={onAdd}
              onRemove={onRemove}
              maxItems={5}
              placeholder="Add a fact that contradicts the thought..."
            />
          </View>

          <StepNavigation
            canGoBack={canGoBack}
            canGoNext={isValid}
            onBack={onBack}
            onNext={onNext}
            nextLabel={items.length === 0 ? "Skip" : "Continue"}
          />
        </View>
      );
    },
  );

EvidenceAgainstStep.displayName = "EvidenceAgainstStep";
