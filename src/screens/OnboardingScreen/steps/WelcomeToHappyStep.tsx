// ponytail: Duolingo-style gamified milestone tiles + top login escape + personalized daily goal
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Book01Icon, LockIcon, FireIcon } from "@hugeicons/core-free-icons";
import { Card } from "@/src/components/ui/Card";
import HappiMascot from "../components/HappiMascot";
import { DailyGoalMinutes } from "../types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("onboarding");
  const displayPlanName = planName.replace(/\.$/, "") || t("welcome_to_happy.personal_plan");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 4,
        paddingBottom: 24,
      }}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
      className="flex-1 px-6"
    >
      {/* Top Bar Escape Hatch */}
      <View className="flex-row items-center justify-end h-7 mb-1">
        {onLoginPress && (
          <Pressable
            onPress={onLoginPress}
            hitSlop={12}
            className="flex-row items-center rounded-full bg-sage-100/80 px-3 py-1 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={t("welcome_to_happy.login_accessibility")}
          >
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="text-[12px] text-sage-800"
            >
              {t("welcome_to_happy.login")}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Mascot Hero */}
      <View className="items-center">
        <HappiMascot expression="peaceful" size={82} delay={40} />
      </View>

      {/* Header Copy */}
      <Animated.View entering={FadeIn.duration(200).delay(100)} className="mt-2.5 items-center">
        <View className="rounded-full bg-sage-100/90 px-2.5 py-0.5 mb-1.5 border border-sage-200/60">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[10px] font-bold uppercase tracking-wider text-sage-700"
          >
            {t("welcome_to_happy.step_label")}
          </Text>
        </View>

        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
          className="text-center text-[26px] leading-[32px] text-ink"
        >
          {t("welcome_to_happy.title")}
        </Text>
        <Text
          style={{ fontFamily: APP_FONT_FAMILIES.regular }}
          className="mt-1 text-center text-[14px] leading-snug text-ink-soft px-3"
        >
          {t("welcome_to_happy.description")}
        </Text>
      </Animated.View>

      {/* Tactile Gamified Milestone Cards */}
      <Animated.View
        entering={FadeIn.duration(220).delay(180)}
        className="mt-4 gap-2.5"
      >
        {/* Course Card */}
        <Card
          variant="tile"
          radius="lg"
          contentClassName="p-3"
          onPress={() => {}}
          haptic="medium"
          accessibilityRole="button"
          accessibilityLabel={`${displayPlanName}, ${t("welcome_to_happy.course_card.ready_badge")}, ${t("welcome_to_happy.course_card.daily_label", { minutes: dailyGoal })}`}
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/70">
              <HugeiconsIcon icon={Book01Icon} size={18} color="#059669" strokeWidth={2.2} />
            </View>
            <View className="flex-1 justify-center">
              <View className="flex-row items-center justify-between">
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                  className="text-[15px] text-ink"
                  numberOfLines={1}
                >
                  {displayPlanName}
                </Text>
                <View className="rounded-full bg-emerald-100/80 px-2 py-0.5">
                  <Text
                    style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                    className="text-[10px] text-emerald-800 uppercase tracking-wide"
                  >
                    {t("welcome_to_happy.course_card.ready_badge")}
                  </Text>
                </View>
              </View>
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                className="mt-0.5 text-[12px] text-ink-soft"
              >
                {t("welcome_to_happy.course_card.daily_label", { minutes: dailyGoal })}
              </Text>
            </View>
          </View>
        </Card>

        {/* Streak Card */}
        <Card
          variant="tile"
          radius="lg"
          contentClassName="p-3"
          onPress={() => {}}
          haptic="medium"
          accessibilityRole="button"
          accessibilityLabel={`${t("welcome_to_happy.streak_card.title")}, ${t("welcome_to_happy.streak_card.day_1_badge")}, ${t("welcome_to_happy.streak_card.subtitle")}`}
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/70">
              <HugeiconsIcon icon={FireIcon} size={18} color="#D97706" strokeWidth={2.2} />
            </View>
            <View className="flex-1 justify-center">
              <View className="flex-row items-center justify-between">
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                  className="text-[15px] text-ink"
                >
                  {t("welcome_to_happy.streak_card.title")}
                </Text>
                <View className="rounded-full bg-amber-100/80 px-2 py-0.5">
                  <Text
                    style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                    className="text-[10px] text-amber-800 uppercase tracking-wide"
                  >
                    {t("welcome_to_happy.streak_card.day_1_badge")}
                  </Text>
                </View>
              </View>
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                className="mt-0.5 text-[12px] text-ink-soft"
              >
                {t("welcome_to_happy.streak_card.subtitle")}
              </Text>
            </View>
          </View>
        </Card>

        {/* Private Reflections Card */}
        <Card
          variant="tile"
          radius="lg"
          contentClassName="p-3"
          onPress={() => {}}
          haptic="medium"
          accessibilityRole="button"
          accessibilityLabel={`${t("welcome_to_happy.reflections_card.title")}, ${t("welcome_to_happy.reflections_card.encrypted_badge")}, ${t("welcome_to_happy.reflections_card.subtitle")}`}
        >
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-sky-50 border border-sky-200/70">
              <HugeiconsIcon icon={LockIcon} size={18} color="#0284C7" strokeWidth={2.2} />
            </View>
            <View className="flex-1 justify-center">
              <View className="flex-row items-center justify-between">
                <Text
                  style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                  className="text-[15px] text-ink"
                >
                  {t("welcome_to_happy.reflections_card.title")}
                </Text>
                <View className="rounded-full bg-sky-100/80 px-2 py-0.5">
                  <Text
                    style={{ fontFamily: APP_FONT_FAMILIES.bold }}
                    className="text-[10px] text-sky-800 uppercase tracking-wide"
                  >
                    {t("welcome_to_happy.reflections_card.encrypted_badge")}
                  </Text>
                </View>
              </View>
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                className="mt-0.5 text-[12px] text-ink-soft"
              >
                {t("welcome_to_happy.reflections_card.subtitle")}
              </Text>
            </View>
          </View>
        </Card>
      </Animated.View>

    </ScrollView>
  );
};

export default React.memo(WelcomeToHappyStep);
