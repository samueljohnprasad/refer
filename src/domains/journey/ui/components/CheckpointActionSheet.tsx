import React from "react";
import { View } from "react-native";
import { Host, VStack, Button, Text, BottomSheet, HStack, Image } from "@expo/ui/swift-ui";
import type { CheckpointActionSheetData } from "../hooks/useCheckpointSheet";

export interface CheckpointActionSheetProps {
  isPresented: boolean;
  onIsPresentedChange: (v: boolean) => void;
  data: CheckpointActionSheetData | null;
  onStart: () => void;
  onReview: () => void;
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
        fitToContents={true}
      >
        {data ? (
          <VStack spacing={16} padding={24} alignment="center">
            <Text font="title2" weight="bold">
              {data.node.label || "Checkpoint"}
            </Text>

          <Text color="secondary">
            Checkpoint · {data.questionCount} questions · ~{data.durationMin} min
          </Text>

          {data.isCompleted ? (
            <Button action={onReview} title="Review" />
          ) : (
            <Button action={onStart} title="Start" />
          )}
        </VStack>
        ) : null}
      </BottomSheet>
    </Host>
  );
}
