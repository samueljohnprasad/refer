import React, { useEffect } from "react";
import { Image, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const HERO_ENTER_DELAY_MS = 200;
const HERO_FADE_DURATION_MS = 600;
const HERO_ENTER_OFFSET = 30;
const HERO_SPRING_CONFIG = { damping: 20, stiffness: 90 } as const;

const WelcomeHeroVisual: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(HERO_ENTER_OFFSET);

  useEffect(() => {
    heroOpacity.value = withDelay(
      HERO_ENTER_DELAY_MS,
      withTiming(1, {
        duration: HERO_FADE_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      }),
    );
    heroTranslateY.value = withDelay(
      HERO_ENTER_DELAY_MS,
      withSpring(0, HERO_SPRING_CONFIG),
    );
  }, [heroOpacity, heroTranslateY]);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  return (
    <Animated.View style={heroAnimatedStyle}>
      <Image
        source={require("@/assets/journey/welcome.png")}
        style={{ width, height }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export default React.memo(WelcomeHeroVisual);
