import React, { forwardRef } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated, { FadeInUp } from "react-native-reanimated";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import {
  useStatCardViewModel,
  useUnitCompleteModalViewModel,
  type UnitCompleteModalProps,
} from "../hooks/useUnitCompleteModalViewModel";

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  bgColor: string;
  index: number;
}

export interface StatCardViewProps extends ReturnType<typeof useStatCardViewModel> {
  icon: string;
  value: string;
  label: string;
  bgColor: string;
}

/**
 * Presentational View component for StatCard.
 * Strictly contains JSX code without internal hooks.
 */
export const StatCardView = React.memo(function StatCardView({
  icon,
  value,
  label,
  bgColor,
  index,
}: StatCardViewProps): React.JSX.Element {
  return (
    <Animated.View
      entering={FadeInUp.delay(400 + index * 120)
        .duration(300)
        .springify()}
      className="items-center flex-1"
    >
      <View
        className="items-center justify-center rounded-2xl mb-2"
        style={{ width: 56, height: 56, backgroundColor: bgColor }}
      >
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text className="text-lg font-extrabold text-ink">{value}</Text>
      <Text className="text-xs font-bold text-ink-muted uppercase tracking-wider">
        {label}
      </Text>
    </Animated.View>
  );
});

function StatCard({
  icon,
  value,
  label,
  bgColor,
  index,
}: StatCardProps): React.JSX.Element {
  const viewModel = useStatCardViewModel(index);
  return (
    <StatCardView
      {...viewModel}
      icon={icon}
      value={value}
      label={label}
      bgColor={bgColor}
    />
  );
}

function ModalBackdrop(props: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="none"
      opacity={0.5}
    />
  );
}

export interface UnitCompleteModalViewProps
  extends ReturnType<typeof useUnitCompleteModalViewModel> {
  bottomSheetRef: React.ForwardedRef<BottomSheetModal>;
}

/**
 * Presentational View component for UnitCompleteModal.
 * Strictly contains JSX code without internal hooks.
 */
export const UnitCompleteModalView = React.memo(
  function UnitCompleteModalView({
    snapPoints,
    showConfetti,
    trophyStyle,
    lessonCount,
    checkpointCount,
    chestCount,
    handleConfettiComplete,
    handleContinue,
    unit,
    xpEarned,
    bottomSheetRef,
  }: UnitCompleteModalViewProps): React.JSX.Element {
    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        backdropComponent={ModalBackdrop}
        backgroundStyle={{
          borderRadius: 28,
          backgroundColor: "white",
        }}
        style={{ marginHorizontal: 8 }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8">
          {unit && (
            <>
              <ConfettiExplosion
                isVisible={showConfetti}
                count={30}
                duration={1200}
                onAnimationComplete={handleConfettiComplete}
              />

              <View className="items-center mb-4">
                <Animated.View
                  style={[
                    trophyStyle,
                    {
                      width: 88,
                      height: 88,
                      borderRadius: 22,
                      backgroundColor: "#FEF3C7",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 3,
                      borderColor: "#F59E0B",
                    },
                  ]}
                >
                  <Text className="text-5xl">🏆</Text>
                </Animated.View>
              </View>

              <Animated.View
                entering={FadeInUp.delay(200).duration(300).springify()}
                className="items-center mb-2"
              >
                <Text className="text-2xl font-extrabold text-ink text-center">
                  Unit Complete!
                </Text>
                <Text className="text-base text-ink-soft text-center mt-1">
                  You finished {unit.title}: {unit.description}
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(350).duration(300)}
                className="flex-row justify-between mt-6 mb-8 px-2"
              >
                <StatCard
                  icon="📖"
                  value={String(lessonCount)}
                  label="Lessons"
                  bgColor="#E0F2FE"
                  index={0}
                />
                <StatCard
                  icon="⚡"
                  value={`+${xpEarned}`}
                  label="XP Earned"
                  bgColor="#FFF3CD"
                  index={1}
                />
                <StatCard
                  icon="✅"
                  value={String(checkpointCount)}
                  label="Checkpoints"
                  bgColor="#D1FAE5"
                  index={2}
                />
                {chestCount > 0 && (
                  <StatCard
                    icon="🎁"
                    value={String(chestCount)}
                    label="Chests"
                    bgColor="#FEE2E2"
                    index={3}
                  />
                )}
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(700).duration(300).springify()}
              >
                <PressableScale
                  onPress={handleContinue}
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
              </Animated.View>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

/**
 * Container component for UnitCompleteModal.
 */
const UnitCompleteModal = forwardRef<BottomSheetModal, UnitCompleteModalProps>(
  (props, ref) => {
    const viewModel = useUnitCompleteModalViewModel(props, ref);
    return <UnitCompleteModalView {...viewModel} bottomSheetRef={ref} />;
  },
);

UnitCompleteModal.displayName = "UnitCompleteModal";

export default UnitCompleteModal;
export type { UnitCompleteModalProps };
