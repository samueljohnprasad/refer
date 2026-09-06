import React from "react";
import { View } from "react-native";
import { BottomSheet, Group, Host, Image, RNHostView, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, multilineTextAlignment, padding, presentationBackground, presentationDetents, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import type { LessonRewardContent } from "@/src/types/journeyV5";
import { SAGE, NEUTRAL } from "@/src/theme/palette";

export interface LessonCompleteSheetProps {
  isVisible: boolean;
  content: LessonRewardContent;
  onContinue: () => void;
}

function LessonCompleteContent({ content, onContinue }: Pick<LessonCompleteSheetProps, "content" | "onContinue">): React.JSX.Element {
  return (
    <VStack alignment="center" spacing={20} modifiers={[padding({ horizontal: 24, vertical: 22 })]}>
      <Image systemName="checkmark.seal.fill" size={52} color={SAGE[500]} />
      <Text modifiers={[font({ size: 28, weight: "bold" }), multilineTextAlignment("center")]}>{content.title}</Text>
      <VStack alignment="center" spacing={8} modifiers={[padding({ horizontal: 18, vertical: 16 })]}>
        <Text modifiers={[font({ size: 17, weight: "semibold" }), foregroundStyle(NEUTRAL.ink), multilineTextAlignment("center")]}>{content.takeaway}</Text>
      </VStack>
      <RNHostView matchContents>
        <View style={{ width: 280 }}>
          <CourseExercisePrimaryButton label={content.primaryActionLabel} onPress={onContinue} />
        </View>
      </RNHostView>
    </VStack>
  );
}

export default function LessonCompleteSheet({ isVisible, content, onContinue }: LessonCompleteSheetProps): React.JSX.Element {
  return (
    <Host>
      <BottomSheet isPresented={isVisible} onIsPresentedChange={(presented) => { if (!presented) onContinue(); }}>
        <Group modifiers={[presentationDetents([{ fraction: 0.5 }]), presentationDragIndicator("visible"), presentationBackground(NEUTRAL.white)]}>
          <LessonCompleteContent content={content} onContinue={onContinue} />
        </Group>
      </BottomSheet>
    </Host>
  );
}

export type { LessonRewardContent };
