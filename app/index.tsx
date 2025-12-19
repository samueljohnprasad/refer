import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import MovingGradientBackground from "@/src/components/MovingGradientBackground";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function Home(): React.JSX.Element {
  const { session, loading } = useAuth();
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(40);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Haptic on mount
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Staggered entrance animations
    // Title "Feel" animates first
    titleOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    titleTranslateY.value = withDelay(
      200,
      withSpring(0, { damping: 20, stiffness: 90 })
    );

    // Subtitle "happy" animates second
    subtitleOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
    subtitleTranslateY.value = withDelay(
      400,
      withSpring(0, { damping: 20, stiffness: 90 })
    );

    // Button animates last
    buttonOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    buttonTranslateY.value = withDelay(
      700,
      withSpring(0, { damping: 18, stiffness: 80 })
    );
  }, []);

  // Animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [
      { translateY: buttonTranslateY.value },
      { scale: buttonScale.value },
    ],
  }));

  const handleGetStartedPress = (): void => {
    // Light haptic for button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sheetRef.current?.present();
  };

  const handlePressIn = (): void => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = (): void => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  if (loading) {
    return (
      <View className="flex-1 w-full h-full items-center justify-center">
        <View className="flex-1 w-full h-full items-center justify-center" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/tabs/screens/onboard-container" />;
  }

  return (
    <View className="flex-1">
      <MovingGradientBackground />

      <View
        className="flex-1 px-8 justify-between"
        style={{
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
        }}
      >
        {/* Main Content - Centered */}
        <View className="flex-1 justify-center items-center">
          <Animated.Text
            className="text-center text-gray-900 mt-12"
            style={[
              {
                fontFamily: "Inter-Black",
                fontSize: 72,
                fontWeight: "900",
                lineHeight: 72,
                letterSpacing: -2,
              },
              titleAnimatedStyle,
            ]}
          >
            Feel
          </Animated.Text>
          <Animated.Text
            className="text-center text-gray-900"
            style={[
              {
                fontFamily: "Inter-Black",
                fontSize: 72,
                fontWeight: "900",
                lineHeight: 72,
                letterSpacing: -2,
              },
              subtitleAnimatedStyle,
            ]}
          >
            happy
          </Animated.Text>
        </View>

        {/* Bottom Button */}
        <Animated.View className="w-full" style={buttonAnimatedStyle}>
          <AnimatedTouchableOpacity
            onPress={handleGetStartedPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="w-full bg-gray-900 flex-row rounded-full py-5 items-center justify-center gap-2"
            activeOpacity={1}
          >
            <Text className="text-white font-semibold text-lg">
              Get Started
            </Text>
            <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" />
          </AnimatedTouchableOpacity>
        </Animated.View>

        <SignInBottomSheet ref={sheetRef} />
      </View>
    </View>
  );
}
