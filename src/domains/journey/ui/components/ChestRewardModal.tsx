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
import { JourneyRewardType } from "@/src/types/journey/enums";
import {
  useChestRewardModalViewModel,
  type ChestRewardModalProps,
} from "../hooks/useChestRewardModalViewModel";

function Backdrop(props: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );
}

export interface ChestRewardModalViewProps
  extends ReturnType<typeof useChestRewardModalViewModel> {
  bottomSheetRef: React.ForwardedRef<BottomSheetModal>;
}

/**
 * Presentational View component for ChestRewardModal.
 * Strictly contains JSX code without internal hooks.
 */
export const ChestRewardModalView = React.memo(
  function ChestRewardModalView({
    snapPoints,
    handleClaim,
    isLocked,
    node,
    bottomSheetRef,
  }: ChestRewardModalViewProps): React.JSX.Element {
    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={Backdrop}
        enablePanDownToClose
        handleIndicatorStyle={{
          backgroundColor: "#94A3B8",
          width: 32,
          height: 4,
        }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-yellow-100 rounded-2xl items-center justify-center mb-3">
              <Text className="text-3xl">{isLocked ? "🔒" : "🎁"}</Text>
            </View>
            <Text className="text-xl font-semibold text-ink text-center">
              {isLocked ? "Locked Chest" : "Treasure Chest!"}
            </Text>
            <Text className="text-sm text-ink-soft text-center mt-1">
              {isLocked
                ? "Complete more nodes to unlock this chest"
                : `You've found chest ${node.index + 1}!`}
            </Text>
          </View>

          {!isLocked && node.rewards && node.rewards.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-ink mb-3">
                Rewards
              </Text>
              <View className="flex-row flex-wrap">
                {node.rewards.map((reward, index) => (
                  <View
                    key={index}
                    className="flex-row items-center px-4 py-3 rounded-2xl mr-3 mb-3 bg-yellow-50"
                  >
                    <Text className="text-xl mr-2">
                      {reward.type === JourneyRewardType.XP
                        ? "⚡"
                        : reward.type === JourneyRewardType.GEMS
                          ? "💎"
                          : reward.type === JourneyRewardType.HEARTS
                            ? "❤️"
                            : "🏆"}
                    </Text>
                    <Text className="text-sm font-medium text-ink">
                      {reward.amount} {reward.type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <PressableScale
            onPress={handleClaim}
            disabled={isLocked}
            scale={0.95}
            className={`w-full py-4 rounded-2xl items-center ${
              isLocked ? "bg-sage-100" : "bg-violet-600"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                isLocked ? "text-ink-muted" : "text-white"
              }`}
            >
              {isLocked ? "Locked" : "Claim Rewards"}
            </Text>
          </PressableScale>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

/**
 * Container component for ChestRewardModal.
 */
const ChestRewardModal = forwardRef<BottomSheetModal, ChestRewardModalProps>(
  (props, ref) => {
    const viewModel = useChestRewardModalViewModel(props);
    return <ChestRewardModalView {...viewModel} bottomSheetRef={ref} />;
  },
);

ChestRewardModal.displayName = "ChestRewardModal";

export default ChestRewardModal;
export type { ChestRewardModalProps };
