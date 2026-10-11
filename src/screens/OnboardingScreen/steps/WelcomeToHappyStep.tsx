// ponytail: one calm handoff rail keeps the save decision singular
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import OnboardingPandaAnimation from "../components/OnboardingPandaAnimation";
import OnboardingHandoffSummary from "../components/OnboardingHandoffSummary";
import { DailyGoalMinutes } from "../types";
import { useTranslation } from "react-i18next";

interface WelcomeToHappyStepProps {
  planName: string;
  dailyGoal: DailyGoalMinutes;
}

const FOOTER_CLEARANCE = 164;

const WelcomeToHappyStep: React.FC<WelcomeToHappyStepProps> = ({
  planName,
  dailyGoal,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("onboarding");
  const displayPlanName = planName.replace(/\.$/, "") || t("welcome_to_happy.personal_plan");

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: FOOTER_CLEARANCE,
      }}
      contentInsetAdjustmentBehavior="never"
      bounces={false}
      className="flex-1 px-6"
    >
      <Animated.View entering={FadeIn.duration(200).delay(40)} className="items-center">
        <OnboardingPandaAnimation size={112} delay={40} />
        <View className="mt-2 items-center">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[11px] font-bold uppercase tracking-[1px] text-sage-700"
          >
            {t("welcome_to_happy.step_label")}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.extraBold }}
            className="mt-2 max-w-[340px] text-center text-[27px] leading-[32px] text-ink"
          >
            {t("welcome_to_happy.title")}
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-2 px-3 text-center text-[15px] leading-relaxed text-ink-soft"
          >
            {t("welcome_to_happy.description")}
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(220).delay(180)}
        className="mt-2"
      >
        <OnboardingHandoffSummary
          planName={displayPlanName}
          dailyGoal={dailyGoal}
        />
      </Animated.View>

    </ScrollView>
  );
};

export default React.memo(WelcomeToHappyStep);
