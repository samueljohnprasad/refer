import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { StepHeader } from "../components/StepHeader";
import { StepNavigation } from "../components/StepNavigation";
import { BulletListInput } from "../components/BulletListInput";

interface EvidenceForStepProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
}

export const EvidenceForStep: React.FC<EvidenceForStepProps> = React.memo(
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
    return (
      <View className="flex-1">
        <StepHeader
          title="Evidence for this thought"
          subtitle="What facts support this thought? Try to stick to evidence, not feelings."
          progress={progress}
          stepNumber={5}
          totalSteps={8}
        />

        <View className="flex-1">
          <BulletListInput
            items={items}
            onAdd={onAdd}
            onRemove={onRemove}
            maxItems={5}
            placeholder="Add a fact that supports the thought..."
          />

          {items.length === 0 && (
            <View
              className="mt-4 rounded-2xl p-3.5 flex-row items-start"
              style={{
                backgroundColor: "#FFF7ED",
                borderWidth: 2,
                borderColor: "#FED7AA",
              }}
            >
              <View className="h-8 w-8 rounded-lg bg-orange-100 items-center justify-center mr-3 mt-0.5">
                <Text className="text-base">🔍</Text>
              </View>
              <Text className="text-sm text-orange-800 flex-1 leading-relaxed font-medium">
                It's okay if you can't find much evidence — that's a clue!
              </Text>
            </View>
          )}
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

EvidenceForStep.displayName = "EvidenceForStep";
