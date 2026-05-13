import React, { useRef, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import BeginButton from "@/src/components/BeginButton";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import MovingGradientBackground from "@/src/components/MovingGradientBackground";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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
import JourneyStepPreviewScreen from "./tabs/screens/journey-step-preview";
import CbtStepPreviewScreen from "./tabs/screens/cbt-step-preview";
import Loading from "@/src/components/Loading";

export default function Home(): React.JSX.Element {
  const { session, loading, ensureAnonymousSession } = useAuth();
  const sheetRef = useRef<BottomSheetModal>(null);
  const { width, height } = Dimensions.get("window");

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
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
    titleTranslateY.value = withDelay(
      200,
      withSpring(0, { damping: 20, stiffness: 90 }),
    );

    // Subtitle "happy" animates second
    subtitleOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
    subtitleTranslateY.value = withDelay(
      400,
      withSpring(0, { damping: 20, stiffness: 90 }),
    );

    // Button animates last
    buttonOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
    );
    buttonTranslateY.value = withDelay(
      700,
      withSpring(0, { damping: 18, stiffness: 80 }),
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

  const handleGetStartedPress = async (): Promise<void> => {
    // Light haptic for button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const nextSession = session ?? (await ensureAnonymousSession());
    if (nextSession) {
      router.replace("/tabs/screens/onboard-container");
      return;
    }

    sheetRef.current?.present();
  };

  const handleBrowseJourneysPress = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate into the app as a guest — Journeys tab
    router.push("/tabs/(tabs)/journeys" as never);
  };

  const handlePressIn = (): void => {
    buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = (): void => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  if (loading) {
    return (
      <View className="flex-1 w-full h-full bg-white items-center justify-center">
        <Loading />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/tabs/screens/onboard-container" />;
  }

  // if (true) {
  //   return (
  //     <CbtStepPreviewScreen />
  //   )
  // }
  return (
    <View className="flex-1">
      {/* <MovingGradientBackground /> */}

      <View
        className="flex-1 px-8 justify-between"
        // style={{
        //   paddingTop: insets.top + 40,
        //   paddingBottom: insets.bottom + 40,
        // }}
      >
        {/* Main Content - Centered */}
        <View className="flex-1 justify-center items-center">
          <Animated.View style={titleAnimatedStyle}>
            <Image
              source={require("@/assets/journey/welcome.png")}
              style={{
                width,
                height,
              }}
              resizeMode="contain"
            />
          </Animated.View>
          {/* <Animated.Text
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
          </Animated.Text> */}
          {/* <Animated.Text
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
          </Animated.Text> */}
        </View>

        {/* Bottom Buttons */}
        <View
          pointerEvents="box-none"
          className="absolute bottom-16 left-1/2 -translate-x-1/3"
        >
          <Animated.View className="w-full gap-2" style={buttonAnimatedStyle}>
            <BeginButton
              onPress={handleGetStartedPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            />

            {/* <TouchableOpacity
              onPress={handleBrowseJourneysPress}
              activeOpacity={0.7}
              className="w-full h-12 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Browse journeys without signing in"
            >
              <Text className="text-gray-600 font-medium text-base">
                Browse Journeys
              </Text>
            </TouchableOpacity> */}
          </Animated.View>
        </View>

        <SignInBottomSheet ref={sheetRef} />
      </View>
    </View>
  );
}
