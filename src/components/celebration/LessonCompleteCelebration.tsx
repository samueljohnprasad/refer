import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Modal, useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  interpolate,
  Extrapolation,
  useReducedMotion,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ZapIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/src/components/ui/Button";
import { ConfettiExplosion } from "@/src/components/animations/ConfettiExplosion";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

// ─── Mascot variants ──────────────────────────────────────────────────────────
const PANDA = {
  celebrate: require("../../../assets/images/panda/panda-super-excite.png"),
  happy: require("../../../assets/images/panda/panda-happy.png"),
  plant: require("../../../assets/images/panda/panda-plant.png"),
} as const;

export type CelebrationPandaVariant = keyof typeof PANDA;

const ENCOURAGEMENTS = [
  "You showed up for yourself today.",
  "Small steps, real change.",
  "That's one more win for your mind.",
  "Progress feels good, doesn't it?",
  "You're building a calmer you.",
];

export function pickEncouragement(seed?: string): string {
  if (!seed) {
    return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return ENCOURAGEMENTS[Math.abs(hash) % ENCOURAGEMENTS.length];
}

export interface LessonCompleteCelebrationProps {
  isVisible: boolean;
  xpEarned: number;
  title?: string;
  message?: string;
  continueLabel?: string;
  pandaVariant?: CelebrationPandaVariant;
  onContinue: () => void;
}

export function LessonCompleteCelebration({
  isVisible,
  xpEarned,
  title = "Lesson complete!",
  message,
  continueLabel = "Continue",
  pandaVariant = "celebrate",
  onContinue,
}: LessonCompleteCelebrationProps) {
  const isDark = useColorScheme() === "dark";
  const reducedMotion = useReducedMotion();

  const [displayXP, setDisplayXP] = useState(0);
  const [canInteract, setCanInteract] = useState(false);
  const countTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const overlayOpacity = useSharedValue(0);
  const pandaProgress = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const resolvedMessage = message ?? pickEncouragement(title);

  const runHaptic = (delay: number, style: Haptics.ImpactFeedbackStyle) => {
    setTimeout(() => {
      Haptics.impactAsync(style).catch(() => {});
    }, delay);
  };

  const startCountUp = () => {
    if (countTimerRef.current) clearInterval(countTimerRef.current);
    const start = Date.now();
    const duration = reducedMotion ? 200 : 700;
    countTimerRef.current = setInterval(() => {
      const fraction = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - fraction, 3);
      setDisplayXP(Math.round(xpEarned * eased));
      if (fraction >= 1 && countTimerRef.current) {
        clearInterval(countTimerRef.current);
        countTimerRef.current = null;
      }
    }, 16);
  };

  useEffect(() => {
    if (!isVisible) {
      overlayOpacity.value = 0;
      pandaProgress.value = 0;
      titleOpacity.value = 0;
      messageOpacity.value = 0;
      cardScale.value = 0;
      cardOpacity.value = 0;
      buttonOpacity.value = 0;
      setDisplayXP(0);
      setCanInteract(false);
      if (countTimerRef.current) clearInterval(countTimerRef.current);
      return;
    }

    const rm = reducedMotion;

    overlayOpacity.value = withTiming(1, { duration: rm ? 150 : 280 });

    // Mascot pop
    pandaProgress.value = withDelay(
      rm ? 0 : 120,
      withTiming(1, { duration: rm ? 250 : 760, easing: Easing.out(Easing.cubic) }),
    );
    runHaptic(rm ? 120 : 420, Haptics.ImpactFeedbackStyle.Medium);

    // Title + message
    titleOpacity.value = withDelay(rm ? 150 : 420, withTiming(1, { duration: rm ? 150 : 320 }));
    messageOpacity.value = withDelay(rm ? 180 : 560, withTiming(1, { duration: rm ? 150 : 320 }));

    // XP card spring in + count up
    const cardDelay = rm ? 220 : 760;
    cardOpacity.value = withDelay(cardDelay, withTiming(1, { duration: rm ? 120 : 220 }));
    cardScale.value = withDelay(
      cardDelay,
      rm
        ? withTiming(1, { duration: 150 })
        : withSequence(
            withSpring(1.12, { damping: 9, stiffness: 150 }),
            withSpring(1, { damping: 12, stiffness: 160 }),
          ),
    );
    setTimeout(() => {
      startCountUp();
      runHaptic(0, Haptics.ImpactFeedbackStyle.Light);
    }, cardDelay);

    // Button
    buttonOpacity.value = withDelay(
      rm ? 260 : 1120,
      withTiming(1, { duration: rm ? 120 : 260 }, (finished) => {
        if (finished) runOnJS(setCanInteract)(true);
      }),
    );

    return () => {
      if (countTimerRef.current) clearInterval(countTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  const pandaStyle = useAnimatedStyle(() => {
    if (reducedMotion) {
      return {
        opacity: interpolate(pandaProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
        transform: [
          { scale: interpolate(pandaProgress.value, [0, 1], [0.96, 1], Extrapolation.CLAMP) },
        ],
      };
    }
    const translateY = interpolate(pandaProgress.value, [0, 0.4, 0.7, 1], [50, -14, 4, 0], Extrapolation.CLAMP);
    const scale = interpolate(pandaProgress.value, [0, 0.4, 0.6, 0.8, 1], [0.5, 1.15, 0.95, 1.03, 1], Extrapolation.CLAMP);
    const rotate = interpolate(pandaProgress.value, [0, 0.4, 0.6, 0.8, 1], [-6, 5, -2, 1, 0], Extrapolation.CLAMP);
    const opacity = interpolate(pandaProgress.value, [0, 0.12, 1], [0, 1, 1], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }, { scale }, { rotate: `${rotate}deg` }] };
  });

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: 12 * (1 - titleOpacity.value) }],
  }));
  const messageStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ translateY: 12 * (1 - messageOpacity.value) }],
  }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));

  const handleContinue = () => {
    if (!canInteract) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onContinue();
  };

  if (!isVisible) return null;

  const bg = isDark ? "#0f1a0f" : "#fbfdf8";
  const cardSurface = isDark ? "#2a2410" : "#FFF7E0";
  const cardBorder = isDark ? "#4a3f18" : "#F6D97A";
  const amber = "#F5A623";

  return (
    <Modal transparent visible={isVisible} animationType="none" statusBarTranslucent>
      <Animated.View
        testID="lesson-complete-celebration"
        style={[StyleSheet.absoluteFill, overlayStyle, { backgroundColor: bg }]}
      >
        <View style={styles.content}>
          {/* Mascot + confetti */}
          <View style={styles.mascotZone}>
            <View pointerEvents="none" style={styles.confettiLayer}>
              <ConfettiExplosion isVisible={!reducedMotion && isVisible} count={28} duration={1000} />
            </View>
            <Animated.View style={[styles.mascotWrap, pandaStyle]}>
              <Image
                source={PANDA[pandaVariant]}
                style={styles.mascot}
                contentFit="contain"
              />
            </Animated.View>
          </View>

          {/* Copy */}
          <Animated.View style={titleStyle}>
            <Text style={[styles.title, { color: SEMANTIC_COLORS.text.primary }]}>{title}</Text>
          </Animated.View>
          <Animated.View style={[messageStyle, styles.messageWrap]}>
            <Text style={[styles.message, { color: SEMANTIC_COLORS.text.secondary }]}>
              {resolvedMessage}
            </Text>
          </Animated.View>

          {/* XP stat card */}
          <Animated.View
            style={[
              styles.xpCard,
              cardStyle,
              { backgroundColor: cardSurface, borderColor: cardBorder },
            ]}
          >
            <View style={[styles.xpIcon, { backgroundColor: amber }]}>
              <HugeiconsIcon icon={ZapIcon} size={22} color="#FFFFFF" strokeWidth={2.4} />
            </View>
            <View style={styles.xpTextWrap}>
              <Text style={[styles.xpLabel, { color: isDark ? "#C9A24A" : "#B4791B" }]}>
                XP EARNED
              </Text>
              <Text testID="celebration-xp-value" style={[styles.xpValue, { color: isDark ? "#F3C969" : "#8A5A12" }]}>
                +{displayXP}
              </Text>
            </View>
          </Animated.View>

          <View style={styles.spacer} />

          {/* CTA */}
          <Animated.View testID="celebration-continue-button" style={[styles.buttonWrap, buttonStyle]}>
            <Button
              label={continueLabel}
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleContinue}
              disabled={!canInteract}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 48,
    alignItems: "center",
  },
  mascotZone: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  confettiLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  mascot: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 28,
    textAlign: "center",
  },
  messageWrap: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  message: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  xpCard: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 200,
  },
  xpIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  xpTextWrap: {
    justifyContent: "center",
  },
  xpLabel: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 12,
    letterSpacing: 1.2,
  },
  xpValue: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 24,
    marginTop: 2,
  },
  spacer: {
    flex: 1,
  },
  buttonWrap: {
    width: "100%",
  },
});

export default LessonCompleteCelebration;
