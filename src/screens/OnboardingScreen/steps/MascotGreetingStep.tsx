import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import SpeechBubble from "../components/SpeechBubble";

const MASCOT_ENTER_DELAY_MS = 40;
const SPEECH_BUBBLE_DELAY_MS = 180;
const QUOTE_ENTER_DELAY_MS = 420;

const MascotGreetingStep: React.FC = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center pt-8">
        <MochiMascot
          expression="waving"
          size={160}
          delay={MASCOT_ENTER_DELAY_MS}
        />

        <View className="mt-6 w-full">
          <SpeechBubble
            text="Hi there! I'm Mochi. I'll be your companion on this journey. Just 7 quick questions to personalize your experience."
            delay={SPEECH_BUBBLE_DELAY_MS}
          />
        </View>

        <Animated.View
          entering={FadeIn.duration(180).delay(QUOTE_ENTER_DELAY_MS)}
          className="mt-8 items-center px-4"
        >
          <Text
            style={{ fontFamily: "CormorantMedium" }}
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
