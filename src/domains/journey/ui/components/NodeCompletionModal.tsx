import React, { forwardRef } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { PressableScale } from "@/src/components/ui/PressableScale";
import type { JourneyReward } from "@/src/types/journey/node";
import {
  useRewardBadgeViewModel,
  useNodeCompletionModalViewModel,
  type NodeCompletionModalProps,
} from "../hooks/useNodeCompletionModalViewModel";

export interface RewardBadgeViewProps
  extends ReturnType<typeof useRewardBadgeViewModel> {}

/**
 * Presentational View component for RewardBadge.
 * Strictly contains JSX code without internal hooks.
 */
export const RewardBadgeView = React.memo(function RewardBadgeView({
  icon,
  label,
  bgColor,
  reward,
}: RewardBadgeViewProps): React.JSX.Element {
  return (
    <View
      className="flex-row items-center px-4 py-3 rounded-2xl mr-3 mb-3"
      style={{ backgroundColor: bgColor }}
    >
      <Text className="text-2xl mr-2">{icon}</Text>
      <View>
        <Text className="text-lg font-extrabold text-ink">
          +{reward.amount}
        </Text>
        <Text className="text-xs font-bold text-ink-soft uppercase tracking-wider">
          {label}
        </Text>
      </View>
    </View>
  );
});

function RewardBadge({ reward }: { reward: JourneyReward }): React.JSX.Element {
  const viewModel = useRewardBadgeViewModel(reward);
  return <RewardBadgeView {...viewModel} />;
}

function ModalBackdrop(props: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
      opacity={0.3}
    />
  );
}

export interface NodeCompletionModalViewProps
  extends ReturnType<typeof useNodeCompletionModalViewModel> {
  bottomSheetRef: React.ForwardedRef<BottomSheetModal>;
}

/**
 * Presentational View component for NodeCompletionModal.
 * Strictly contains JSX code without internal hooks.
 */
export const NodeCompletionModalView = React.memo(
  function NodeCompletionModalView({
    snapPoints,
    handleContinue,
    node,
    bottomSheetRef,
  }: NodeCompletionModalViewProps): React.JSX.Element {
    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={ModalBackdrop}
        backgroundStyle={{
          borderRadius: 28,
          backgroundColor: "white",
        }}
        style={{ marginHorizontal: 8 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-4 pb-8">
          {node && (
            <>
              <View className="items-center mb-5">
                <View
                  className="h-20 w-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: "#D1FAE5" }}
                >
                  <Text className="text-4xl">🎉</Text>
                </View>
                <Text className="text-2xl font-extrabold text-ink text-center">
                  Lesson Complete!
                </Text>
                <Text className="text-base text-ink-soft text-center mt-1">
                  Great job finishing lesson {node.index + 1}
                </Text>
              </View>

              {node.rewards.length > 0 && (
                <View className="mb-6">
                  <Text className="text-sm font-extrabold text-ink-muted uppercase tracking-wider mb-3">
                    Rewards Earned
                  </Text>
                  <View className="flex-row flex-wrap">
                    {node.rewards.map(
                      (reward: JourneyReward, index: number) => (
                        <RewardBadge key={`reward-${index}`} reward={reward} />
                      ),
                    )}
                  </View>
                </View>
              )}

              <PressableScale
                onPress={() => void handleContinue()}
                scale={0.95}
                hapticStyle="heavy"
                className="w-full"
                style={{
                  backgroundColor: "#58CC02",
                  paddingVertical: 16,
                  borderRadius: 16,
                  borderBottomWidth: 4,
                  borderBottomColor: "#45A802",
                  alignItems: "center",
                }}
              >
                <Text className="text-lg font-extrabold text-white">
                  CONTINUE
                </Text>
              </PressableScale>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

/**
 * Container component for NodeCompletionModal.
 */
const NodeCompletionModal = forwardRef<
  BottomSheetModal,
  NodeCompletionModalProps
>((props, ref) => {
  const viewModel = useNodeCompletionModalViewModel(props, ref);
  return <NodeCompletionModalView {...viewModel} bottomSheetRef={ref} />;
});

NodeCompletionModal.displayName = "NodeCompletionModal";

export default NodeCompletionModal;
export type { NodeCompletionModalProps };
