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
} from "@expo/ui/swift-ui/modifiers";
import { GOLD, SAGE } from "@/lib/tokens";
import { SvgAppButton } from "@/src/domains/journey/ui/components/svg-app-button";
import type { PathNodeData } from "@/src/types/journey/node";

export interface ChestRewardModalProps {
  node: PathNodeData | null;
  isClaiming: boolean;
  onClaim: () => Promise<void>;
  onDismiss: () => void;
}

function ChestRewardContent({
  isClaiming,
  onClaim,
}: Omit<ChestRewardModalProps, "node" | "onDismiss">): React.JSX.Element {
  return (
    <VStack
      alignment="center"
      spacing={18}
      modifiers={[padding({ horizontal: 24, vertical: 20 })]}
    >
      <Image systemName="gift.fill" size={30} color={GOLD} />
      <VStack alignment="center" spacing={4}>
        <Text modifiers={[font({ size: 24, weight: "semibold" })]}>
          Treasure Chest!
        </Text>
        <Text modifiers={[font({ size: 15 }), foregroundStyle("secondary")]}>
          You&apos;ve found a chest!
        </Text>
      </VStack>
      <RNHostView matchContents>
        <View style={{ width: 280 }}>
          <SvgAppButton
            width={280}
            height={54}
            color={isClaiming ? SAGE[300] : SAGE[500]}
            backgroundColor={SAGE[700]}
            leftRadius={14}
            rightRadius={14}
            disabled={isClaiming}
            onPress={() => {
              void onClaim();
            }}
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RNText
              style={{
                color: "#FFFFFF",
                fontFamily: "GeistSemiBold",
                fontSize: 16,
              }}
            >
              {isClaiming ? "Claiming…" : "Claim Rewards"}
            </RNText>
          </SvgAppButton>
        </View>
      </RNHostView>
    </VStack>
  );
}

export function ChestRewardModal({
  node,
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
            presentationDetents([{ fraction: 0.42 }]),
            presentationDragIndicator("visible"),
            presentationBackground("#FFFFFF"),
          ]}
        >
          <ChestRewardContent isClaiming={isClaiming} onClaim={onClaim} />
        </Group>
      </BottomSheet>
    </Host>
  );
}

export default ChestRewardModal;
