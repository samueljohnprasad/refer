/**
 * UnitCompleteModal (Task 4.3.1)
 * Full celebration modal shown when the user completes every node in a unit.
 *
 * Features:
 * - Confetti explosion (reuses ConfettiExplosion component)
 * - Trophy icon with bounce-in animation
 * - Unit stats summary (lessons completed, XP earned, time)
 * - "Continue" button to dismiss and unlock the next unit
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  FadeInUp,
} from "react-native-reanimated";

import { PressableScale } from "@/src/components/ui/PressableScale";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import type { UnitData, PathNodeData } from "@/src/types/journey";
import { NodeType } from "@/src/types/journey";
import {
  triggerIfEnabledSync,
  triggerStaggeredItems,
  triggerSequence,
} from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES, HAPTIC_TIMING } from "@/lib/haptics/hapticConfig";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface UnitCompleteModalProps {
  /** The completed unit data */
  unit: UnitData | null;
  /** XP earned during this unit */
  xpEarned: number;
  /** Called when user taps "Continue" — triggers next unit unlock */
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Stat card sub-component
// ---------------------------------------------------------------------------

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  bgColor: string;
  index: number;
}

function StatCard({
  icon,
  value,
  label,
  bgColor,
  index,
}: StatCardProps): React.JSX.Element {
  useEffect(() => {
    const delay =
      HAPTIC_TIMING.STAT_BASE_DELAY + index * HAPTIC_TIMING.STAT_DELAY_STEP;
    const timer = setTimeout(() => {
      void triggerIfEnabledSync("pulse", HAPTIC_INTENSITIES.PULSE_LIGHT);
    }, delay);
    return () => clearTimeout(timer);
  }, [index]);

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
      pressBehavior="none"
      opacity={0.5}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const UnitCompleteModal = forwardRef<BottomSheetModal, UnitCompleteModalProps>(
  ({ unit, xpEarned, onContinue }, ref) => {
    const snapPoints = useMemo(() => ["65%"], []);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    // ── Trophy bounce animation ──
    const trophyScale = useSharedValue(0);

    useEffect(() => {
      if (unit) {
        const timer = setTimeout(() => setShowConfetti(true), 200);
        trophyScale.value = withDelay(
          100,
          withSequence(
            withSpring(1.2, {
              damping: 20,
              stiffness: 100,
              overshootClamping: true,
            }),
            withSpring(1, {
              damping: 20,
              stiffness: 100,
              overshootClamping: true,
            }),
          ),
        );
        void triggerIfEnabledSync("swell", HAPTIC_INTENSITIES.SWELL);
        const burstTimer = setTimeout(() => {
          void triggerIfEnabledSync(
            "heartbeat",
            HAPTIC_INTENSITIES.HEARTBEAT_STRONG,
          );
        }, 350);
        return () => {
          clearTimeout(timer);
          clearTimeout(burstTimer);
        };
      } else {
        setShowConfetti(false);
        trophyScale.value = 0;
      }
    }, [unit, trophyScale]);

    const trophyStyle = useAnimatedStyle(() => ({
      transform: [{ scale: trophyScale.value }],
    }));

    // ── Compute stats from unit data ──
    const lessonCount: number = unit
      ? unit.nodes.filter((n: PathNodeData) => n.type === NodeType.LESSON)
          .length
      : 0;

    const checkpointCount: number = unit
      ? unit.nodes.filter((n: PathNodeData) => n.type === NodeType.CHECKPOINT)
          .length
      : 0;

    const chestCount: number = unit
      ? unit.nodes.filter((n: PathNodeData) => n.type === NodeType.CHEST).length
      : 0;

    const handleConfettiComplete = useCallback((): void => {
      setShowConfetti(false);
    }, []);

    const handleContinue = useCallback((): void => {
      void triggerIfEnabledSync("bloom", HAPTIC_INTENSITIES.BLOOM_STRONG);
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss();
      }
      onContinue();
    }, [ref, onContinue]);

    return (
      <BottomSheetModal
        ref={ref}
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
              {/* Confetti overlay */}
              <ConfettiExplosion
                isVisible={showConfetti}
                count={30}
                duration={1200}
                onAnimationComplete={handleConfettiComplete}
              />

              {/* Trophy icon */}
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

              {/* Title */}
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

              {/* Stats row */}
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

              {/* Continue button */}
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

UnitCompleteModal.displayName = "UnitCompleteModal";

export default UnitCompleteModal;
