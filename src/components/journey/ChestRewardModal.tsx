/**
 * ChestRewardModal
 * Bottom sheet modal shown when a treasure chest is opened.
 * Displays chest rewards and a "Claim" button.
 *
 * Uses @gorhom/bottom-sheet following the existing modal pattern.
 */

import React, { forwardRef, useCallback, useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { PathNodeData } from "@/src/types/journey/node";
import { NodeStatus, JourneyRewardType } from "@/src/types/journey/enums";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChestRewardModalProps {
  node: PathNodeData;
  onClaim: (nodeId: string) => void;
}

// ---------------------------------------------------------------------------
// Backdrop
// ---------------------------------------------------------------------------

const Backdrop = useCallback(
  (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  ),
  [],
);

// ---------------------------------------------------------------------------
// ChestRewardModal
// ---------------------------------------------------------------------------

const ChestRewardModal = forwardRef<BottomSheetModal, ChestRewardModalProps>(
  ({ node, onClaim }, ref) => {
    const snapPoints = useMemo(() => ["40%"], []);

    const handleClaim = useCallback(() => {
      onClaim(node.id);
    }, [node.id, onClaim]);

    const isLocked = node.status === NodeStatus.LOCKED;

    return (
      <BottomSheetModal
        ref={ref}
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
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-yellow-100 rounded-2xl items-center justify-center mb-3">
              <Text className="text-3xl">{isLocked ? "🔒" : "🎁"}</Text>
            </View>
            <Text className="text-xl font-semibold text-gray-900 text-center">
              {isLocked ? "Locked Chest" : "Treasure Chest!"}
            </Text>
            <Text className="text-sm text-gray-600 text-center mt-1">
              {isLocked
                ? "Complete more nodes to unlock this chest"
                : `You've found chest ${node.index + 1}!`}
            </Text>
          </View>

          {/* Rewards Section */}
          {!isLocked && node.rewards && node.rewards.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
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
                    <Text className="text-sm font-medium text-gray-900">
                      {reward.amount} {reward.type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Claim Button */}
          <PressableScale
            onPress={handleClaim}
            disabled={isLocked}
            scale={0.95}
            className={`w-full py-4 rounded-2xl items-center ${
              isLocked ? "bg-gray-200" : "bg-violet-600"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                isLocked ? "text-gray-400" : "text-white"
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

ChestRewardModal.displayName = "ChestRewardModal";

export default ChestRewardModal;
