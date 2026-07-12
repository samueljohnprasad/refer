import React, { useEffect } from "react";
import { View, Share, Alert, Modal, Text as RNText } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Share01Icon,
  StarIcon,
  Tick02Icon,
  Fire02Icon,
} from "@hugeicons/core-free-icons";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { useReviewPrompt } from "@/src/hooks/useReviewPrompt";

import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { GOLD, PARROT_ORANGE, SAGE, INK, INK_MUTED } from "@/lib/tokens";
import { triggerIfEnabledSync } from "@/lib/haptics/hapticUtils";
import { HAPTIC_INTENSITIES } from "@/lib/haptics/hapticConfig";

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

/** Day label row — active days rendered in bee-yellow */
const WeekDayLabels: React.FC<{ weeklyProgress: boolean[] }> = React.memo(
  ({ weeklyProgress }) => (
    <View className="flex-row justify-between mb-4">
      {DAYS_OF_WEEK.map((day, index) => (
        <Text
          key={day}
          variant="label-bold"
          className={`w-9 text-center ${
            weeklyProgress[index] ? "text-bee-yellow" : "text-ink-muted"
          }`}
        >
          {day}
        </Text>
      ))}
    </View>
  ),
);
WeekDayLabels.displayName = "WeekDayLabels";

/** Day progress circles — filled for completed, star for last day */
const WeekProgressCircles: React.FC<{ weeklyProgress: boolean[] }> = React.memo(
  ({ weeklyProgress }) => (
    <View className="flex-row justify-between items-center">
      {weeklyProgress.map((completed, index) => (
        <View
          key={index}
          className="items-center justify-center"
          style={{ width: 36, height: 36 }}
        >
          {index === 6 ? (
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: completed ? GOLD : "#E5E5E5" }}
            >
              <HugeiconsIcon icon={StarIcon} size={20} color="white" />
            </View>
          ) : completed ? (
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: GOLD }}
            >
              <HugeiconsIcon icon={Tick02Icon} size={20} color="white" />
            </View>
          ) : (
            <View
              className="w-9 h-9 rounded-full"
              style={{ backgroundColor: "#E5E5E5" }}
            />
          )}
        </View>
      ))}
    </View>
  ),
);
WeekProgressCircles.displayName = "WeekProgressCircles";

// ─── Main component ───────────────────────────────────────────────────────────

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  visible,
  onClose,
}) => {
  const { streakData, isLoading } = useStreakTracker();

  useEffect(() => {
    if (visible && streakData.currentStreak > 0) {
      void triggerIfEnabledSync("heartbeat", HAPTIC_INTENSITIES.HEARTBEAT);
    }
  }, [visible, streakData.currentStreak]);

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

  const completedDays = streakData.weeklyProgress.filter(Boolean).length;
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
      <Host>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(val: boolean) => {
            if (!val) onClose();
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ fraction: 0.88 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1 happy-brand-screen items-center px-6 pt-4 pb-8">
                {/* ── Minimal Streak Hero ───────────────────────────── */}
                <View className="items-center mb-6 mt-4">
                  <View className="mb-2 w-16 h-16 rounded-full items-center justify-center bg-orange-50">
                    <HugeiconsIcon icon={Fire02Icon} size={40} color={PARROT_ORANGE} variant="solid" />
                  </View>
                  <View className="flex-row items-baseline">
                    <RNText
                      className="text-[64px] leading-[72px]"
                      style={{
                        fontFamily: "GeistMedium",
                        color: INK,
                        letterSpacing: -2,
                      }}
                    >
                      {streakData.currentStreak}
                    </RNText>
                  </View>
                  <RNText
                    className="text-[18px] mt-1 text-center"
                    style={{
                      fontFamily: "GeistRegular",
                      color: INK_MUTED,
                    }}
                  >
                    day streak!
                  </RNText>
                </View>

                {/* ── Weekly calendar card ───────────────────────────── */}
                <Card
                  variant="tile"
                  radius="xl"
                  showDepth={false}
                  className="w-full mb-6"
                  contentClassName="p-6"
                >
                  <WeekDayLabels weeklyProgress={streakData.weeklyProgress} />
                  <WeekProgressCircles
                    weeklyProgress={streakData.weeklyProgress}
                  />

                  {/* Progress message */}
                  {isHalfwayToWeek && !isPerfectWeek && (
                    <Text
                      variant="body"
                      color="soft"
                      className="text-center mt-4"
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
                      className="happy-font-body-bold text-[17px] leading-[22px] text-center mt-4"
                      style={{ color: PARROT_ORANGE }}
                    >
                      🎉 Perfect week achieved!
                    </RNText>
                  )}

                  {/* ── Stat row: Longest ─────────────────── */}
                  <View className="items-center mt-4 pt-4 border-t border-brand-border">
                    <Text variant="caption" color="muted">
                      Longest
                    </Text>
                    <View className="flex-row items-center mt-1 gap-1">
                      <HugeiconsIcon
                        icon={Fire02Icon}
                        size={16}
                        color={PARROT_ORANGE}
                      />
                      <RNText
                        className="happy-font-body-bold text-[17px] mt-[1px]"
                        style={{ color: INK }}
                      >
                        {String(streakData.longestStreak)}
                      </RNText>
                    </View>
                  </View>
                </Card>

                {/* ── Action buttons ─────────────────────────────────── */}
                <View className="w-full gap-3">
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

                  {/* Continue — primary brand CTA */}
                  <Button
                    variant="primary"
                    label="Continue"
                    onPress={onClose}
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
