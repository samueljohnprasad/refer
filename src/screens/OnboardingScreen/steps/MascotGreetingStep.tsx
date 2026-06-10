import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "expo-router/react-navigation";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import SpeechBubble from "../components/SpeechBubble";

const MASCOT_ENTER_DELAY_MS = 40;
const SPEECH_BUBBLE_DELAY_MS = 180;
const QUOTE_ENTER_DELAY_MS = 420;

const MascotGreetingStep: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1, paddingTop: headerHeight - insets.top }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center pt-8">
        <MochiMascot
          expression="waving"
          size={160}
          delay={MASCOT_ENTER_DELAY_MS}
        />

        <View className="mt-6 w-full">
          <SpeechBubble delay={SPEECH_BUBBLE_DELAY_MS}>
            <Text style={{ fontFamily: "FrauncesSemiBold" }}>
              Hi, I&apos;m Mochi.
            </Text>
            {"\n"}
            I&apos;m a panda. I&apos;m soft. I&apos;m patient. I&apos;ll be your
            companion on this journey — just{" "}
            <Text style={{ fontFamily: "FrauncesSemiBold" }}>
              6 quick questions
            </Text>{" "}
            before your first lesson.
          </SpeechBubble>
        </View>

        <Animated.View
          entering={FadeIn.duration(180).delay(QUOTE_ENTER_DELAY_MS)}
          className="mt-8 items-center px-4"
        >
          <Text
            style={{ fontFamily: "FrauncesMedium" }}
            className="text-center text-[13px] italic leading-5 text-ink-soft"
          >
            "The smallest practice, done daily, is more powerful than the
            biggest one done once."
          </Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default React.memo(MascotGreetingStep);
