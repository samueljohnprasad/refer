import React, { useState, useEffect } from "react";
import { Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import Animated, { FadeIn } from "react-native-reanimated";
import { SAGE, TERRACOTTA } from "@/lib/tokens";
import { StreakProgressGraphic } from "@/src/components/Streak/StreakCelebration";
import { useStreak } from "@/src/hooks/useStreak";

const LessonCompleteStep: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const [startAnim, setStartAnim] = useState(false);
  const { currentStreak } = useStreak();

  useEffect(() => {
    const t = setTimeout(() => {
      setStartAnim(true);
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const currentDayIndex = new Date().getDay();
  const overrideDays = Array(7).fill(false);
  overrideDays[currentDayIndex] = true;
  
  const displayStreak = Math.max(1, currentStreak);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 160,
        paddingTop: headerHeight - insets.top + 32,
        flexGrow: 1,
        justifyContent: "center",
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <View className="items-center gap-6 py-2">
        {/* 1. Hero Mascot & Milestone Badge */}
        <View className="items-center">
          <StreakProgressGraphic streak={displayStreak} startAnim={startAnim} hideMessage={true} overrideDays={overrideDays} />
        </View>

        {/* 2. Affirmation Narrative */}
        <Animated.View
          entering={FadeIn.duration(180).delay(180)}
          className="items-center px-2"
        >
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="text-center text-[34px] leading-[1.05] tracking-[-0.01em] text-ink"
          >
            You did it.{" "}
            <Text
              style={{
                fontFamily: "Cormorant",
                fontStyle: "italic",
                color: SAGE[500],
              }}
            >
              Truly.
            </Text>
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(LessonCompleteStep);
