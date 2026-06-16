import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { StepHeader } from "../components/StepHeader";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import { VoiceTextInput } from "../components/VoiceTextInput";

interface AutomaticThoughtStepProps {
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isValid: boolean;
  progress: number;
  onClose?: () => void;
}

export const AutomaticThoughtStep: React.FC<AutomaticThoughtStepProps> =
  React.memo(
    ({ value, onChange, onNext, onBack, canGoBack, isValid, progress, onClose }) => {
      return (
        <LessonScreen
          progress={progress}
          trailingLabel="+10 XP"
          onClose={onClose}
          primaryLabel="Continue"
          onPrimaryPress={onNext}
          primaryDisabled={!isValid}
          secondaryLabel={canGoBack ? "Back" : undefined}
          onSecondaryPress={canGoBack ? onBack : undefined}
          backButtonVariant="close-text"
        >
          <StepHeader
            title="What thought popped up?"
            subtitle="Write down the first thought that came to mind."
          />

          {/* Educational tip — Duolingo-style info card */}
          <View
            className="rounded-2xl p-3.5 mb-4 flex-row items-start"
            style={{
              backgroundColor: "#EFF6FF",
              borderWidth: 2,
              borderColor: "#BFDBFE",
            }}
          >
            <View className="h-8 w-8 rounded-lg bg-blue-100 items-center justify-center mr-3 mt-0.5">
              <Text className="text-base">💡</Text>
            </View>
            <Text className="text-sm text-blue-800 leading-relaxed flex-1 font-medium">
              Automatic thoughts pop up instantly — they feel true, but they're
              not always accurate.
            </Text>
          </View>

          <View className="flex-1">
            <VoiceTextInput
              value={value}
              onChangeText={onChange}
              placeholder="e.g., 'They think my work isn't good enough'"
              maxLength={300}
            />
          </View>

        </LessonScreen>
      );
    },
  );

AutomaticThoughtStep.displayName = "AutomaticThoughtStep";
