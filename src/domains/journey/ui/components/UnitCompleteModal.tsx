import React from "react";
import { View } from "react-native";
import { BottomSheet, Group, Host, Image, RNHostView, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, multilineTextAlignment, padding, presentationBackground, presentationDetents, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import { SAGE, NEUTRAL } from "@/src/theme/palette";
import type { UnitCompleteModalProps } from "../hooks/useUnitCompleteModalViewModel";

function UnitCompleteContent({ unitTitle, content, onContinue }: UnitCompleteModalProps): React.JSX.Element {
  return (
    <VStack alignment="center" spacing={18} modifiers={[padding({ horizontal: 24, vertical: 22 })]}>
      <Image systemName="rosette" size={52} color={SAGE[500]} />
      <VStack alignment="center" spacing={4}>
        <Text modifiers={[font({ size: 28, weight: "bold" }), multilineTextAlignment("center")]}>{content.title}</Text>
        <Text modifiers={[font({ size: 18, weight: "semibold" }), foregroundStyle(SAGE[700]), multilineTextAlignment("center")]}>{unitTitle}</Text>
      </VStack>
      <VStack alignment="center" spacing={8} modifiers={[padding({ horizontal: 18, vertical: 16 })]}>
        <Text modifiers={[font({ size: 16, weight: "semibold" }), foregroundStyle(NEUTRAL.ink), multilineTextAlignment("center")]}>{content.capabilityLabel}</Text>
        <Text modifiers={[font({ size: 18, weight: "bold" }), foregroundStyle(SAGE[700]), multilineTextAlignment("center")]}>{content.capabilityStatement}</Text>
      </VStack>
      <RNHostView matchContents>
        <View style={{ width: 280 }}>
          <CourseExercisePrimaryButton label={content.primaryActionLabel} onPress={onContinue} />
        </View>
      </RNHostView>
    </VStack>
  );
}

export type { UnitCompleteModalProps };

export default function UnitCompleteModal({ unitTitle, content, onContinue }: UnitCompleteModalProps): React.JSX.Element {
  return (
    <Host>
      <BottomSheet isPresented onIsPresentedChange={(presented) => { if (!presented) onContinue(); }}>
        <Group modifiers={[presentationDetents([{ fraction: 0.55 }]), presentationDragIndicator("visible"), presentationBackground(NEUTRAL.white)]}>
          <UnitCompleteContent unitTitle={unitTitle} content={content} onContinue={onContinue} />
        </Group>
      </BottomSheet>
    </Host>
  );
}
