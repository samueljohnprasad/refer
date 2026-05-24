import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import BeginButton from "@/src/components/BeginButton";
import SignInBottomSheet from "@/src/components/SignInBottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import Loading from "@/src/components/Loading";
import WelcomeHeroVisual from "@/src/screens/OnboardingScreen/components/WelcomeHeroVisual";

export default function Home(): React.JSX.Element {
  const { session, loading, ensureAnonymousSession } = useAuth();
  const sheetRef = useRef<BottomSheetModal>(null);

  // Animation values
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(40);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Haptic on mount
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    buttonOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }),
    );
    buttonTranslateY.value = withDelay(
      700,
      withSpring(0, { damping: 18, stiffness: 80 }),
    );
  }, [buttonOpacity, buttonTranslateY]);

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

  return (
    <View className="flex-1">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center items-center">
          <WelcomeHeroVisual />
        </View>

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
          </Animated.View>
        </View>

        <SignInBottomSheet ref={sheetRef} />
      </View>
    </View>
  );
}
