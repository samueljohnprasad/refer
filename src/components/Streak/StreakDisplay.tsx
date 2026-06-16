import React, { useEffect } from "react";
import { View, Share, Alert, Modal, Text as RNText } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Share01Icon,
  StarIcon,
  Tick02Icon,
  Fire02Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { useReviewPrompt } from "@/src/hooks/useReviewPrompt";
import LottieView from "lottie-react-native";
import { fireryLove } from "@/assets/lottie";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { GOLD, PARROT_ORANGE, SAGE } from "@/lib/tokens";
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
  const { streakData, isLoading, useStreakFreeze } = useStreakTracker();

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

  const handleUseFreeze = async (): Promise<void> => {
    if (streakData.streakFreezeCount <= 0) {
      Alert.alert(
        "No rest days left",
        "You've used all your rest days this period. Keep showing up and you'll earn more!",
      );
      return;
    }

    Alert.alert(
      "Take a rest day?",
      `You have ${streakData.streakFreezeCount} rest day${streakData.streakFreezeCount === 1 ? "" : "s"} available. Using one keeps your streak safe while you take a break.`,
      [
        { text: "Not now", style: "cancel" },
        {
          text: "Take rest day",
          onPress: async () => {
            const success = await useStreakFreeze();
            if (success) {
              Alert.alert(
                "Rest day saved ✓",
                "Your streak is safe. Rest well — you've earned it.",
              );
            }
          },
        },
      ],
    );
  };

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
                {/* ── Fire Lottie + streak number ────────────────────── */}
                <View className="items-center mb-6">
                  <View
                    style={{
                      width: 180,
                      height: 180,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <LottieView
                      source={fireryLove}
                      autoPlay
                      loop
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                      }}
                    />
                    {/* Streak number overlaid on the lottie flame */}
                    <RNText
                      className="text-[52px] z-10 mt-5 text-center text-brand-surface"
                      style={{
                        fontFamily: "FrauncesBold",
                        textShadowColor: "rgba(0,0,0,0.45)",
                        textShadowOffset: { width: 0, height: 2 },
                        textShadowRadius: 6,
                      }}
                    >
                      {streakData.currentStreak}
                    </RNText>
                  </View>

                  {/* "day streak!" label — parrot-orange matches the flame */}
                  <RNText
                    className="text-[22px] leading-[26px] mt-2 text-center"
                    style={{
                      fontFamily: "FrauncesSemiBold",
                      color: PARROT_ORANGE,
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

                  {/* ── Stat row: Longest | Freezes ─────────────────── */}
                  <View className="flex-row justify-between mt-4 pt-4 border-t border-brand-border">
                    {/* Longest streak */}
                    <View className="items-center flex-1">
                      <Text variant="caption" color="muted">
                        Longest
                      </Text>
                      <View className="flex-row items-center mt-1 gap-1">
                        <HugeiconsIcon
                          icon={Fire02Icon}
                          size={16}
                          color={PARROT_ORANGE}
                        />
                        <Text variant="h3">
                          {String(streakData.longestStreak)}
                        </Text>
                      </View>
                    </View>

                    {/* Vertical divider */}
                    <View className="w-px bg-brand-border" />

                    {/* Streak freezes — tappable */}
                    <Button
                      variant="ghost"
                      label={`❄️  ${streakData.streakFreezeCount}`}
                      size="sm"
                      fullWidth={false}
                      className="flex-1"
                      onPress={handleUseFreeze}
                    />
                  </View>

                  {/* Gentle streak reminder */}
                  {streakData.isStreakAtRisk && (
                    <View className="bg-sage-pill rounded-xl p-3 mt-4 flex-row items-center gap-2">
                      <HugeiconsIcon
                        icon={Alert02Icon}
                        size={20}
                        color={SAGE[500]}
                      />
                      <Text variant="caption" className="flex-1 text-sage-700">
                        A quick check-in today would keep your streak going. No
                        pressure though — rest days exist for a reason.
                      </Text>
                    </View>
                  )}
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
                        color={GOLD}
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
