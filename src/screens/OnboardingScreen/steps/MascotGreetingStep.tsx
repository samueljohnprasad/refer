import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import SpeechBubble from "../components/SpeechBubble";
import { useTranslation } from "react-i18next";

const MASCOT_ENTER_DELAY_MS = 0;
const SPEECH_BUBBLE_DELAY_MS = 80;
const QUOTE_ENTER_DELAY_MS = 160;

const MascotGreetingStep: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("onboarding");
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1, paddingTop: headerHeight - insets.top }}
      className="flex-1 px-6"
    >
      <View className="flex-1 justify-between py-6">
        <View className="items-center justify-center pt-4">
          <MochiMascot
            expression="waving"
            size={160}
            delay={MASCOT_ENTER_DELAY_MS}
          />

          <View className="mt-6 w-full">
            <SpeechBubble delay={SPEECH_BUBBLE_DELAY_MS}>
              <Text className="happy-font-heading-bold text-[18px] text-ink">
                {t("mascot_greeting.hi")}
              </Text>
              {"\n"}
              {t("mascot_greeting.intro")}{" "}
              <Text className="happy-font-heading-bold text-ink">
                {t("mascot_greeting.questions_count")}
              </Text>{" "}
              {t("mascot_greeting.before_lesson")}
            </SpeechBubble>
          </View>
        </View>

        <Animated.View
          entering={FadeIn.duration(200).delay(QUOTE_ENTER_DELAY_MS)}
          className="mt-8 w-full rounded-2xl border border-sage-200/70 bg-sage-50/40 px-5 py-4"
        >
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-center text-[15px] italic leading-6 text-ink"
          >
            {t("mascot_greeting.quote")}
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(MascotGreetingStep);
