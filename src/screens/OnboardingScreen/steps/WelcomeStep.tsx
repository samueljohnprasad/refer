import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";

const MASCOT_ENTER_DELAY_MS = 40;
const TITLE_ENTER_DELAY_MS = 140;
const SUBTITLE_ENTER_DELAY_MS = 220;
const BADGE_ENTER_DELAY_MS = 300;
const TAGLINE_ENTER_DELAY_MS = 380;

const WelcomeStep: React.FC = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center pt-12">
        <MochiMascot
          expression="happy"
          size={180}
          delay={MASCOT_ENTER_DELAY_MS}
        />

        <Animated.Text
          entering={FadeIn.duration(180).delay(TITLE_ENTER_DELAY_MS)}
          style={{ fontFamily: "FrauncesBold" }}
          className="mt-6 text-5xl tracking-tight text-sage-700"
        >
          Happy
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.duration(180).delay(SUBTITLE_ENTER_DELAY_MS)}
          style={{ fontFamily: "FrauncesMedium" }}
          className="mt-2 text-lg italic text-sage-500"
        >
          AI Journal & CBT
        </Animated.Text>

        <Animated.View
          entering={FadeIn.duration(180).delay(BADGE_ENTER_DELAY_MS)}
          className="mt-8 flex-row items-center gap-1.5 rounded-full border border-sage-200 bg-sage-50 px-3 py-1.5"
        >
          <Text
            style={{ fontFamily: "GeistSemiBold" }}
            className="text-[11px] font-semibold text-sage-700"
          >
            🛡️ CBT-informed · End-to-end encrypted
          </Text>
        </Animated.View>

        <Animated.Text
          entering={FadeIn.duration(180).delay(TAGLINE_ENTER_DELAY_MS)}
          style={{ fontFamily: "GeistRegular" }}
          className="mt-4 text-center text-xs italic text-ink-muted"
        >
          Built for the days you don't want to open it.
        </Animated.Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(WelcomeStep);
