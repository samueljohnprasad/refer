import React from "react";
import { View, Text as RNText } from "react-native";
import { Host, VStack, BottomSheet, Group, RNHostView, Text } from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  padding,
  presentationBackground,
  presentationDetents,
  presentationDragIndicator,
  multilineTextAlignment,
} from "@expo/ui/swift-ui/modifiers";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import type { CheckpointActionSheetData } from "../hooks/useCheckpointSheet";

export interface CheckpointActionSheetProps {
  isPresented: boolean;
  onIsPresentedChange: (v: boolean) => void;
  data: CheckpointActionSheetData | null;
  onStart: () => void;
  onReview: () => void;
}

function CheckpointActionSheetContent({
  data,
  onStart,
  onReview,
}: {
  data: CheckpointActionSheetData;
  onStart: () => void;
  onReview: () => void;
}) {
  return (
    <VStack
      alignment="center"
      spacing={24}
      modifiers={[padding({ horizontal: 24, vertical: 20 })]}
    >
      <VStack alignment="center" spacing={8}>
        <Text modifiers={[font({ size: 22, weight: "bold" }), multilineTextAlignment("center")]}>
          {data.node.label || "Checkpoint"}
        </Text>
        <Text modifiers={[font({ size: 16 }), foregroundStyle("secondary"), multilineTextAlignment("center")]}>
          Checkpoint · {data.questionCount} questions · ~{data.durationMin} min
        </Text>
      </VStack>

      <RNHostView matchContents>
        <View style={{ width: 280 }}>
          <CourseExercisePrimaryButton
            label={data.isCompleted ? "Review" : "Start"}
            onPress={data.isCompleted ? onReview : onStart}
          />
        </View>
      </RNHostView>
    </VStack>
  );
}

export function CheckpointActionSheet({
  isPresented,
  onIsPresentedChange,
  data,
  onStart,
  onReview,
}: CheckpointActionSheetProps): React.JSX.Element {
  return (
    <Host>
      <BottomSheet
        isPresented={isPresented && data !== null}
        onIsPresentedChange={onIsPresentedChange}
      >
        <Group
          modifiers={[
            presentationDetents([{ fraction: 0.35 }]),
            presentationDragIndicator("visible"),
            presentationBackground("#FFFFFF"),
          ]}
        >
          {data ? (
            <CheckpointActionSheetContent
              data={data}
              onStart={onStart}
              onReview={onReview}
            />
          ) : null}
        </Group>
      </BottomSheet>
    </Host>
  );
}
