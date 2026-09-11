import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Book01Icon, LockIcon, FireIcon } from "@hugeicons/core-free-icons";
import MochiMascot from "../components/MochiMascot";
import { DailyGoalMinutes } from "../types";

interface WelcomeToHappyStepProps {
  planName: string;
  dailyGoal: DailyGoalMinutes;
  onLoginPress?: () => void;
}

const WelcomeToHappyStep: React.FC<WelcomeToHappyStepProps> = ({
  planName,
  dailyGoal,
  onLoginPress,
}) => {
  const insets = useSafeAreaInsets();
  const displayPlanName = planName.replace(/\.$/, "");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 20,
        paddingBottom: 160,
      }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <View className="items-center">
        <MochiMascot expression="peaceful" size={110} delay={40} />
      </View>

      <Animated.View entering={FadeIn.duration(180).delay(100)} className="mt-5">
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
          className="text-[26px] leading-[1.15] text-ink"
        >
          Keep your progress with you
        </Text>
        <Text className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Save your course, reflections, and streak across devices.
        </Text>
      </Animated.View>

      {/* Utility card */}
      <Animated.View
        entering={FadeIn.duration(180).delay(180)}
        style={{ borderCurve: "continuous" }}
        className="mt-6 gap-3.5 rounded-2xl border border-sage-200/80 bg-warm-white p-5 shadow-sm"
      >
        <View className="flex-row items-center gap-3.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-sage-100/70">
            <HugeiconsIcon icon={Book01Icon} size={17} color="#4F6E49" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[14px] text-ink"
            >
              {displayPlanName}
            </Text>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.regular }}
              className="text-[12px] text-ink-soft"
            >
              Tailored 7-day course ready to begin
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-sage-200/40" />

        <View className="flex-row items-center gap-3.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-sage-100/70">
            <HugeiconsIcon icon={LockIcon} size={17} color="#4F6E49" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[14px] text-ink"
            >
              Private reflections
            </Text>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.regular }}
              className="text-[12px] text-ink-soft"
            >
              Synced securely to your personal profile
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-sage-200/40" />

        <View className="flex-row items-center gap-3.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-sage-100/70">
            <HugeiconsIcon icon={FireIcon} size={17} color="#4F6E49" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[14px] text-ink"
            >
              Streak & momentum
            </Text>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.regular }}
              className="text-[12px] text-ink-soft"
            >
              Keep your streak and habit history
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Existing account escape */}
      {onLoginPress && (
        <Animated.View
          entering={FadeIn.duration(180).delay(260)}
          className="mt-6 items-center"
        >
          <Pressable
            onPress={onLoginPress}
            hitSlop={12}
            className="py-1"
            accessibilityRole="button"
            accessibilityLabel="Already have an account? Log in"
          >
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[14px] text-sage-700 underline"
            >
              Already have an account? Log in
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </ScrollView>
  );
};

export default React.memo(WelcomeToHappyStep);
