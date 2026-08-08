import React, { useMemo } from "react";
import { View, Share, Modal, Text as RNText, StyleSheet } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Share01Icon } from "@hugeicons/core-free-icons";
import { useStreak } from "@/src/hooks/useStreak";
import { useReviewPrompt } from "@/src/hooks/useReviewPrompt";

import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
  presentationBackground,
} from "@expo/ui/swift-ui/modifiers";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { PARROT_ORANGE, INK, INK_MUTED } from "@/lib/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedEmberIcon } from "@/src/components/ui/AnimatedStatIcon";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StreakDisplayProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Called when the user dismisses or taps Continue */
  onClose: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DAYS_OF_WEEK: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ─── Sub-components ───────────────────────────────────────────────────────────

const WeekDayLabels: React.FC<{ weeklyProgress: boolean[] }> = React.memo(
  ({ weeklyProgress }) => (
    <View className="flex-row justify-between mb-4">
      {DAYS_OF_WEEK.map((day, index) => (
        <Text
          key={day}
          variant="label-bold"
          className={`w-9 text-center ${
            weeklyProgress[index] ? "text-ink" : "text-ink-muted"
          }`}
        >
          {day}
        </Text>
      ))}
    </View>
  ),
);
WeekDayLabels.displayName = "WeekDayLabels";

const WeekProgressCircles: React.FC<{ weeklyProgress: boolean[] }> = React.memo(
  ({ weeklyProgress }) => {
    // Find the last completed day to set as "today" for the breathing effect
    const lastCompletedIndex = weeklyProgress.lastIndexOf(true);
    
    return (
      <View className="flex-row justify-between items-center">
        {weeklyProgress.map((completed, index) => (
          <View
            key={index}
            className="items-center justify-center"
            style={{ width: 36, height: 36 }}
          >
            <AnimatedEmberIcon
              width={completed ? 28 : 24}
              height={completed ? 28 : 24}
              delayMs={150 + index * 120} // Staggered entry
              isToday={completed && index === lastCompletedIndex}
              isGray={!completed}
            />
          </View>
        ))}
      </View>
    );
  }
);
WeekProgressCircles.displayName = "WeekProgressCircles";

// ─── Main component ───────────────────────────────────────────────────────────

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  visible,
  onClose,
}) => {
  const { currentStreak, weeklyProgress, isLoading } = useStreak();
  const streakData = useMemo(
    () => ({ currentStreak, weeklyProgress }),
    [currentStreak, weeklyProgress]
  );

  // Trigger review prompt at 1-day streak milestone
  useReviewPrompt({
    currentStreak: streakData.currentStreak,
    enabled: true,
  });

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: `🔥 I'm on a ${streakData.currentStreak} day streak! Keep journaling with me!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const completedDays = streakData.weeklyProgress.activeDays;
  const isHalfwayToWeek = completedDays >= 3 && completedDays < 7;
  const isPerfectWeek = completedDays === 7;

  if (isLoading) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Host colorScheme="light" style={StyleSheet.absoluteFill}>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(val: boolean) => {
            if (!val) onClose();
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ fraction: 0.55 }]),
              presentationDragIndicator("visible"),
              presentationBackground("#FFFFFF"),
            ]}
          >
            <RNHostView>
              <View className="flex-1 happy-brand-screen items-center px-6 pt-4 pb-8 overflow-hidden">
                <LinearGradient
                  colors={["rgba(255,150,0,0.12)", "transparent"]}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 250 }}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
                
                {/* ── Typographic Streak Hero ───────────────────────────── */}
                <View className="items-center mb-10 mt-6 px-4">
                  <RNText
                    className="happy-font-heading-bold text-[36px] leading-[44px] text-center"
                    style={{ color: INK, fontVariant: ["lining-nums"] }}
                  >
                    You're on a{" "}
                    <RNText
                      style={{
                        color: PARROT_ORANGE,
                        fontFamily: "GeistBold",
                        fontVariant: ["lining-nums"],
                        textShadowColor: "rgba(255,150,0,0.3)",
                        textShadowOffset: { width: 0, height: 4 },
                        textShadowRadius: 12,
                      }}
                    >
                      {streakData.currentStreak}-day
                    </RNText>{" "}
                    streak
                  </RNText>
                  <RNText
                    className="happy-font-body-medium text-[16px] leading-[24px] text-center mt-2"
                    style={{ color: INK_MUTED }}
                  >
                    Keep showing up. You're building a habit that matters.
                  </RNText>
                </View>

                {/* ── Weekly calendar ───────────────────────────── */}
                <View className="w-full px-2 mb-10">
                  <WeekDayLabels weeklyProgress={streakData.weeklyProgress.days} />
                  <View className="mt-2">
                    <WeekProgressCircles
                      weeklyProgress={streakData.weeklyProgress.days}
                    />
                  </View>

                  {/* Progress message */}
                  {isHalfwayToWeek && !isPerfectWeek && (
                    <Text
                      variant="body"
                      color="soft"
                      className="text-center mt-6"
                    >
                      You're halfway to your{" "}
                      <RNText
                        className="happy-font-body-bold text-[17px] leading-[22px]"
                        style={{ color: PARROT_ORANGE }}
                      >
                        perfect week!
                      </RNText>
                    </Text>
                  )}
                  {isPerfectWeek && (
                    <RNText
                      className="happy-font-body-bold text-[17px] leading-[22px] text-center mt-6"
                      style={{ color: PARROT_ORANGE }}
                    >
                      🎉 Perfect week achieved!
                    </RNText>
                  )}
                </View>

                {/* ── Action buttons ─────────────────────────────────── */}
                <View className="w-full gap-3 mt-auto">
                  {/* Share — ghost with sage icon */}
                  <Button
                    variant="ghost"
                    label="Share"
                    onPress={handleShare}
                    leftIcon={
                      <HugeiconsIcon
                        icon={Share01Icon}
                        size={20}
                        color={INK}
                      />
                    }
                  />
                </View>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
};
