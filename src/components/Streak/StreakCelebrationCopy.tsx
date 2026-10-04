import React, { useEffect } from "react";
import Animated, {
  Easing,
  withDelay,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/ui/Button";
import { MOTION, styles } from "./streakCelebrationStyles";

interface AnimatedCopyProps {
  startAnim: boolean;
  reducedMotion: boolean | null;
}

export function StreakSupportingMessage({
  startAnim,
  reducedMotion,
}: AnimatedCopyProps) {
  const { t } = useTranslation("home");
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(reducedMotion ? 0 : 8);

  useEffect(() => {
    if (!startAnim) return;
    const duration = reducedMotion ? 250 : 260;
    opacity.value = withDelay(
      MOTION.messageStart,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
    if (!reducedMotion) {
      translateY.value = withDelay(
        MOTION.messageStart,
        withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, [startAnim, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  return (
    <Animated.Text style={[styles.supportingMessage, style]}>
      {t("streak.newStreakMessage")}
    </Animated.Text>
  );
}

export function StreakPrimaryCTA({
  onPress,
  startAnim,
  reducedMotion,
}: AnimatedCopyProps & { onPress: () => void }) {
  const { t } = useTranslation("home");
  const translateY = useSharedValue(reducedMotion ? 0 : 20);
  const opacity = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (!startAnim) return;
    if (reducedMotion) {
      opacity.value = withTiming(1, { duration: 200 });
      return;
    }
    translateY.value = withDelay(
      MOTION.ctaStart,
      withSpring(0, { mass: 0.6, stiffness: 280, damping: 20 }),
    );
    opacity.value = withDelay(
      MOTION.ctaStart,
      withTiming(1, { duration: 250 }),
    );
  }, [startAnim, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    width: "100%",
  }));
  return (
    <Animated.View style={style}>
      <Button
        label={t("streak.continue")}
        variant="primary"
        size="lg"
        onPress={onPress}
      />
    </Animated.View>
  );
}
