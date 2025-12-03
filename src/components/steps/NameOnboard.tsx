import React, { useEffect, useMemo } from "react";
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

type NameOnboardProps = {
  name: string;
  setName: (name: string) => void;
};

// Extract static styles outside component to prevent recreation
const LOTTIE_STYLE = { width: 100, height: 100 };
const INPUT_SHADOW_STYLE = {
  shadowColor: "#7C3AED",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 3,
};
const TEXT_LETTER_SPACING = { letterSpacing: 0.2 };

// Memoize input props to prevent recreation
const INPUT_PROPS = { autoFocus: true };

export const NameOnboard: React.FC<NameOnboardProps> = React.memo(
  ({ name, setName }) => {
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
    }, [name, welcomeOpacity]);

    // Memoize first name extraction
    const firstName = useMemo(() => name.split(" ")[0], [name]);

    // Memoize helper text to prevent recreating on every render
    const helperText = useMemo(() => {
      return name.length > 0
        ? `Nice to meet you, ${firstName}!`
        : "You can always change this later.";
    }, [name.length, firstName]);

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
                style={LOTTIE_STYLE}
                source={lendHand}
              />
            </View>
          </Animated.View>

          {/* Premium Input Field with Glass Effect */}
          {/* <Animated.View
            entering={FadeInDown.duration(500).delay(400)}
            className="w-full mt-3"
          >
            <View
              className="bg-white/95 rounded-[20px] p-1 border-[1.5px] border-purple-100"
              style={INPUT_SHADOW_STYLE}
            >
              <NameInput
                label="Your first name"
                placeholder="Enter your name..."
                value={name}
                onChangeText={setName}
                backgroundColor="transparent"
                inputProps={INPUT_PROPS}
              />
            </View>
          </Animated.View> */}

          {/* Dynamic Helper Text with Premium Animation */}
          <Text
            className="mt-3 text-[13px] text-slate-600 font-semibold"
            style={TEXT_LETTER_SPACING}
          >
            {helperText}
          </Text>
        </View>
      </View>
    );
  }
);

NameOnboard.displayName = "NameOnboard";
