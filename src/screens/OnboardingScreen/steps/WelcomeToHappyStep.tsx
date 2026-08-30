import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import { DailyGoalMinutes } from "../types";

interface WelcomeToHappyStepProps {
  planName: string;
  dailyGoal: DailyGoalMinutes;
}

const WelcomeToHappyStep: React.FC<WelcomeToHappyStepProps> = ({
  planName,
  dailyGoal,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center py-4">
        <MochiMascot expression="peaceful" size={160} delay={40} />

        <Animated.View
          entering={FadeIn.duration(200).delay(120)}
          className="mt-12 px-6"
        >
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular, fontStyle: "italic" }}
            className="text-center text-xl leading-relaxed text-ink-soft"
          >
            &ldquo;Consistency over perfection.&rdquo;
          </Text>
          <Text className="mt-4 text-center text-[11px] font-semibold tracking-widest text-sage-500 uppercase">
            — Mochi
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(WelcomeToHappyStep);
