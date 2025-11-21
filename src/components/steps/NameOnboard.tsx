import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  FadeIn,
  FadeInDown,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { lendHand } from "@/assets/lottie";
import NameInput from "../animations/name-input/NameInput";

type NameOnboardProps = {
  name: string;
  setName: (name: string) => void;
};

export const NameOnboard: React.FC<NameOnboardProps> = ({ name, setName }) => {
  const welcomeOpacity = useSharedValue(0);

  useEffect(() => {
    if (name.length > 0) {
      welcomeOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.ease,
      });
    } else {
      welcomeOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [name]);

  return (
    <View className="w-full">
      <View className="w-full items-center justify-center px-6 py-3 mb-8">
        {/* Premium Lottie Animation with Glass Container */}
        <Animated.View
          entering={FadeIn.duration(600).delay(200)}
          className="mb-4 items-center"
        >
          <View className="bg-white/20 rounded-[80px] p-4 border border-white/30">
            <LottieView
              autoPlay
              loop
              style={{
                width: 100,
                height: 100,
              }}
              source={lendHand}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          className="w-full mt-3"
        >
          <View
            className="bg-white/95 rounded-[20px] p-1 border-[1.5px] border-purple-100"
            style={{
              shadowColor: "#7C3AED",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <NameInput
              label="Your first name"
              placeholder="Enter your name..."
              value={name}
              onChangeText={setName}
              backgroundColor="transparent"
              inputProps={{
                autoFocus: true,
              }}
            />
          </View>
        </Animated.View>

        {/* Dynamic Helper Text with Premium Animation */}
        {name.length > 0 ? (
          <Text
            className="mt-3 text-[13px] text-slate-600 font-semibold"
            style={{ letterSpacing: 0.2 }}
          >
            Nice to meet you, {name.split(" ")[0]}!
          </Text>
        ) : (
          <Text
            className="mt-3 text-[13px] text-slate-600 font-semibold"
            style={{ letterSpacing: 0.2 }}
          >
            You can always change this later.
          </Text>
        )}
      </View>
    </View>
  );
};
