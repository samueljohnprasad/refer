





/**
 * NodeCompletionModal
 * Bottom sheet modal shown when a node is completed.
 * Displays earned rewards, XP, and a "Continue" button.
 *
 * Uses @gorhom/bottom-sheet (already installed) following
 * the existing ShortBottomModal pattern in the codebase.
 */

import React, { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { JourneyReward, PathNodeData } from '@/src/types/journey/node';
import { JourneyRewardType } from '@/src/types/journey/enums';



// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface NodeCompletionModalProps {
  node: PathNodeData | null;
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Reward display helpers
// ---------------------------------------------------------------------------

const REWARD_ICONS: Record<string, string> = {
  [JourneyRewardType.XP]: '⚡',
  [JourneyRewardType.GEMS]: '💎',
  [JourneyRewardType.HEARTS]: '❤️',
  [JourneyRewardType.ACHIEVEMENT]: '🏆',
};

const REWARD_LABELS: Record<string, string> = {
  [JourneyRewardType.XP]: 'XP',
  [JourneyRewardType.GEMS]: 'Gems',
  [JourneyRewardType.HEARTS]: 'Hearts',
  [JourneyRewardType.ACHIEVEMENT]: 'Achievement',
};

const REWARD_COLORS: Record<string, string> = {
  [JourneyRewardType.XP]: '#FFF3CD',
  [JourneyRewardType.GEMS]: '#E0F2FE',
  [JourneyRewardType.HEARTS]: '#FEE2E2',
  [JourneyRewardType.ACHIEVEMENT]: '#F3E8FF',
};

interface RewardBadgeProps {
  reward: JourneyReward;
}

function RewardBadge({ reward }: RewardBadgeProps): React.JSX.Element {
  const icon: string = REWARD_ICONS[reward.type] ?? '🎁';
  const label: string = REWARD_LABELS[reward.type] ?? 'Reward';
  const bgColor: string = REWARD_COLORS[reward.type] ?? '#F1F5F9';

  return (
    <View
      className="flex-row items-center px-4 py-3 rounded-2xl mr-3 mb-3"
      style={{ backgroundColor: bgColor }}
    >
      <Text className="text-2xl mr-2">{icon}</Text>
      <View>
        <Text className="text-lg font-extrabold text-slate-800">
          +{reward.amount}
        </Text>
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Backdrop
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const NodeCompletionModal = forwardRef<BottomSheetModal, NodeCompletionModalProps>(
  ({ node, onContinue }, ref) => {
    const snapPoints = useMemo(() => ['50%'], []);

    const handleContinue = useCallback((): void => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.dismiss();
      }
      onContinue();
    }, [onContinue, ref]);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={ModalBackdrop}
        backgroundStyle={{
          borderRadius: 28,
          backgroundColor: 'white',
        }}
        style={{ marginHorizontal: 8 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-4 pb-8">
          {node && (
            <>
              {/* Success icon */}
              <View className="items-center mb-5">
                <View
                  className="h-20 w-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: '#D1FAE5' }}
                >
                  <Text className="text-4xl">🎉</Text>
                </View>
                <Text className="text-2xl font-extrabold text-slate-900 text-center">
                  Lesson Complete!
                </Text>
                <Text className="text-base text-slate-500 text-center mt-1">
                  Great job finishing lesson {node.index + 1}
                </Text>
              </View>

              {/* Rewards */}
              {node.rewards.length > 0 && (
                <View className="mb-6">
                  <Text className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                    Rewards Earned
                  </Text>
                  <View className="flex-row flex-wrap">
                    {node.rewards.map((reward: JourneyReward, index: number) => (
                      <RewardBadge key={`reward-${index}`} reward={reward} />
                    ))}
                  </View>
                </View>
              )}

              {/* Continue button */}
              <PressableScale
                onPress={handleContinue}
                scale={0.95}
                hapticStyle="heavy"
                className="w-full"
                style={{
                  backgroundColor: '#58CC02',
                  paddingVertical: 16,
                  borderRadius: 16,
                  borderBottomWidth: 4,
                  borderBottomColor: '#45A802',
                  alignItems: 'center',
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

NodeCompletionModal.displayName = 'NodeCompletionModal';

export default NodeCompletionModal;

















