import React from "react";
import { Text, View, ScrollView } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import MochiMascot from "../components/MochiMascot";
import SpeechBubble from "../components/SpeechBubble";

const MascotGreetingStep: React.FC = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      className="flex-1 px-6"
    >
      <View className="flex-1 items-center justify-center pt-8">
        <MochiMascot expression="waving" size={160} delay={0} />

        <View className="mt-6 w-full">
          <SpeechBubble
            text="Hi there! I'm Mochi. I'll be your companion on this journey. Just 7 quick questions to personalize your experience."
            delay={300}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
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
