import React from "react";
import { View } from "react-native";
import {
  BottomSheet,
  Group,
  Host,
  Image,
  RNHostView,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  padding,
  presentationBackground,
  presentationDetents,
  presentationDragIndicator,
  multilineTextAlignment,
} from "@expo/ui/swift-ui/modifiers";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import type { PathNodeData } from "@/src/types/journey/node";
import { NodeType } from "@/src/types/journey";
import type { InsightRewardContent } from "@/src/types/journeyV5";

export interface ChestRewardModalProps {
  node: PathNodeData | null;
  insightCard: InsightRewardContent | null;
  isClaiming: boolean;
  onClaim: () => Promise<void>;
  onDismiss: () => void;
}

function ChestRewardContent({
  node,
  isClaiming,
  insightCard,
  onClaim,
  onDismiss,
}: ChestRewardModalProps): React.JSX.Element {
  const isTrophy = node?.type === NodeType.TROPHY;
  const isClaimed = node?.status === "claimed";
  if (!insightCard) return <></>;

  return (
    <VStack
      alignment="center"
      spacing={24}
      modifiers={[padding({ horizontal: 24, vertical: 20 })]}
    >
      <Image
        systemName={isTrophy ? "star.circle.fill" : "gift.fill"}
        size={48}
        color={SEMANTIC_COLORS.warning.foreground}
      />
      <VStack alignment="center" spacing={8}>
        <Text
          modifiers={[
            font({ size: 24, weight: "bold" }),
            multilineTextAlignment("center"),
          ]}
        >
          {insightCard.title}
        </Text>
        <Text
          modifiers={[
            font({ size: 16 }),
            foregroundStyle("secondary"),
            multilineTextAlignment("center"),
          ]}
        >
          {insightCard.body}
        </Text>
      </VStack>
      <RNHostView matchContents>
        <View style={{ width: 280 }}>
          <CourseExercisePrimaryButton
            label={
              isClaimed
                ? insightCard.primaryActionLabel
                : insightCard.claimActionLabel
            }
            loading={isClaiming}
            disabled={isClaiming}
            onPress={isClaimed ? onDismiss : () => void onClaim()}
          />
        </View>
      </RNHostView>
    </VStack>
  );
}

export function ChestRewardModal({
  node,
  insightCard,
  isClaiming,
  onClaim,
  onDismiss,
}: ChestRewardModalProps): React.JSX.Element {
  const isPresented =
    node !== null && node.type === NodeType.CHEST && insightCard !== null;

  return (
    <Host>
      <BottomSheet
        isPresented={isPresented}
        onIsPresentedChange={(presented) => {
          if (!presented && !isClaiming) onDismiss();
        }}
      >
        <Group
          modifiers={[
            presentationDetents([{ fraction: 0.5 }]),
            presentationDragIndicator("visible"),
            presentationBackground("#FFFFFF"),
          ]}
        >
          <ChestRewardContent
            node={node}
            insightCard={insightCard}
            isClaiming={isClaiming}
            onClaim={onClaim}
            onDismiss={onDismiss}
          />
        </Group>
      </BottomSheet>
    </Host>
  );
}

export default ChestRewardModal;
