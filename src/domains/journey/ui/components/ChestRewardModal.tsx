import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text as RNText, View } from "react-native";
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
import type { InsightCardContent } from "@/src/data/journey/rewardsConfig";

export interface ChestRewardModalProps {
  node: PathNodeData | null;
  insightCard: InsightCardContent | null;
  isClaiming: boolean;
  onClaim: () => Promise<void>;
  onDismiss: () => void;
}

function ChestRewardContent({
  isClaiming,
  insightCard,
  onClaim,
}: Omit<ChestRewardModalProps, "node" | "onDismiss">): React.JSX.Element {
  const title = insightCard?.title || "Treasure Chest!";
  const body = insightCard?.body || "You've found a chest!";

  return (
    <VStack
      alignment="center"
      spacing={24}
      modifiers={[padding({ horizontal: 24, vertical: 20 })]}
    >
      <Image systemName="gift.fill" size={30} color={SEMANTIC_COLORS.warning.foreground} />
      <VStack alignment="center" spacing={8}>
        <Text modifiers={[font({ size: 24, weight: "bold" }), multilineTextAlignment("center")]}>
          {title}
        </Text>
        <Text modifiers={[font({ size: 16 }), foregroundStyle("secondary"), multilineTextAlignment("center")]}>
          {body}
        </Text>
      </VStack>
      <RNHostView matchContents>
        <View style={{ width: 280 }}>
          <CourseExercisePrimaryButton
            label={isClaiming ? "Claiming…" : "Claim Rewards"}
            loading={isClaiming}
            disabled={isClaiming}
            onPress={() => {
              void onClaim();
            }}
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
  return (
    <Host>
      <BottomSheet
        isPresented={node !== null}
        onIsPresentedChange={(isPresented) => {
          if (!isPresented && !isClaiming) onDismiss();
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
            insightCard={insightCard}
            isClaiming={isClaiming}
            onClaim={onClaim}
          />
        </Group>
      </BottomSheet>
    </Host>
  );
}

export default ChestRewardModal;
