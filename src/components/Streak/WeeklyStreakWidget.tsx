import React from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Fire02Icon } from "@hugeicons/core-free-icons";
import { useStreakTracker } from "@/hooks/data/useStreakTracker";
import { Card } from "@/src/components/ui/Card";
import { GOLD, SAGE } from "@/lib/tokens";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

interface WeeklyStreakWidgetProps {
  onPress?: () => void;
  showDepth?: boolean;
}

export const WeeklyStreakWidget: React.FC<WeeklyStreakWidgetProps> = ({
  onPress,
  showDepth = true,
}) => {
  const { streakData, isLoading } = useStreakTracker();

  // Create an infinite heartbeat pulse for the most recent active day
  const heartbeatScale = useSharedValue(1);
  const heartbeatOpacity = useSharedValue(0);

  React.useEffect(() => {
    heartbeatScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(1.6, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
        withDelay(2000, withTiming(1, { duration: 0 }))
      ),
      -1,
      false
    );

    heartbeatOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 0 }),
        withTiming(0, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 0 }),
        withDelay(2000, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartbeatScale.value }],
    opacity: heartbeatOpacity.value,
  }));

  const currentStreak = streakData.currentStreak || 0;
  
  // Find the index of the most recently completed day
  const mostRecentCompletedIndex = [...streakData.weeklyProgress].findLastIndex(Boolean);

  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Card
      variant="tile"
      radius="xl"
      onPress={onPress}
      haptic="light"
      showDepth={showDepth}
      contentClassName="p-0"
      accessibilityLabel={`Current streak: ${currentStreak} days`}
    >
      <View className="w-full flex-row items-center justify-between py-5 px-5">
        {/* Left Streak Number Box */}
        <View className="items-center justify-center pr-6 min-w-[75px]">
          <Text
            className="text-[46px] leading-tight tracking-tighter"
            style={{ fontFamily: "FrauncesBold", color: "#2B3A22" }}
          >
            {isLoading ? "-" : currentStreak}
          </Text>
          <Text
            className="text-[10px] tracking-[1.5px] uppercase mt-1"
            style={{ fontFamily: "GeistBold", color: "#5F7F58" }}
          >
            STREAK
          </Text>
        </View>

        {/* Right Weekly Grid */}
        <View className="flex-1 flex-row items-center justify-between">
          {streakData.weeklyProgress.map((isCompleted, i) => {
            const isPrevCompleted = i > 0 && streakData.weeklyProgress[i - 1];
            const isNextCompleted = i < 6 && streakData.weeklyProgress[i + 1];

            return (
              <View key={i} className="flex-1 items-center relative py-1">
                {/* Center-aligned Connection Pill BGs */}
                {isCompleted && (
                  <View
                    style={{
                      position: "absolute",
                      top: 14, // Center vertically relative to 32px height circle (32/2 - 4/2 = 14px)
                      left: 0,
                      right: 0,
                      height: 4,
                      flexDirection: "row",
                      zIndex: 0,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: isPrevCompleted
                          ? "rgba(255, 217, 0, 0.45)"
                          : "transparent",
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        height: "100%",
                        backgroundColor: isNextCompleted
                          ? "rgba(255, 217, 0, 0.45)"
                          : "transparent",
                      }}
                    />
                  </View>
                )}

                {/* Day Circle */}
                <View
                  className="w-8 h-8 rounded-full items-center justify-center z-10 border"
                  style={{
                    borderColor: isCompleted ? "rgba(255, 217, 0, 0.6)" : "#E5EDE1",
                    backgroundColor: isCompleted
                      ? "rgba(255, 217, 0, 0.15)"
                      : "#FFFFFF",
                  }}
                >
                  {i === mostRecentCompletedIndex && (
                    <Animated.View
                      style={[
                        {
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          borderRadius: 16,
                          backgroundColor: GOLD,
                        },
                        pulseStyle,
                      ]}
                      pointerEvents="none"
                    />
                  )}
                  <HugeiconsIcon
                    icon={Fire02Icon}
                    size={16}
                    color={isCompleted ? GOLD : "#ABC0A2"}
                    fill={isCompleted ? GOLD : "none"}
                  />
                </View>

                <Text
                  className="text-[10px] mt-2"
                  style={{
                    fontFamily: isCompleted ? "GeistBold" : "GeistMedium",
                    color: isCompleted ? "#2B3A22" : "#8A9F82",
                  }}
                >
                  {labels[i]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
};
