import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Rive, { AutoBind } from "rive-react-native";
import { MOTION, SIZES, SPRINGS, styles } from "./streakCelebrationStyles";

export function StreakCelebrationFlame({
  streak,
  startAnim,
  reducedMotion,
}: {
  streak: number;
  startAnim: boolean;
  reducedMotion: boolean | null;
}) {
  const scale = useSharedValue(reducedMotion ? 0.95 : 0.72);
  const translateY = useSharedValue(reducedMotion ? 0 : 7);
  const rotateZ = useSharedValue(reducedMotion ? 0 : -2);
  const opacity = useSharedValue(reducedMotion ? 0 : 0.68);
  const pulseScale = useSharedValue(0.75);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (!startAnim) return;
    if (reducedMotion) {
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withTiming(1, { duration: 250 });
      return;
    }

    opacity.value = withDelay(
      MOTION.ignitionStart,
      withTiming(1, { duration: MOTION.ignitionDuration }),
    );
    scale.value = withSequence(
      withDelay(
        MOTION.ignitionStart,
        withTiming(1.18, {
          duration: MOTION.ignitionDuration,
          easing: Easing.out(Easing.cubic),
        }),
      ),
      withTiming(1.27, {
        duration: MOTION.peakDuration,
        easing: Easing.linear,
      }),
      withTiming(0.94, {
        duration: MOTION.recoilDuration,
        easing: Easing.linear,
      }),
      withTiming(0.94, {
        duration: MOTION.recoilDuration,
        easing: Easing.linear,
      }),
      withSpring(1, SPRINGS.flame),
    );
    translateY.value = withSequence(
      withDelay(
        MOTION.ignitionStart,
        withTiming(-7, {
          duration: MOTION.ignitionDuration,
          easing: Easing.out(Easing.cubic),
        }),
      ),
      withTiming(-10, { duration: MOTION.peakDuration, easing: Easing.linear }),
      withTiming(3, { duration: MOTION.recoilDuration, easing: Easing.linear }),
      withSpring(0, SPRINGS.flame),
    );
    rotateZ.value = withSequence(
      withDelay(
        MOTION.ignitionStart,
        withTiming(2, {
          duration: MOTION.ignitionDuration,
          easing: Easing.out(Easing.cubic),
        }),
      ),
      withTiming(-1, { duration: MOTION.peakDuration, easing: Easing.linear }),
      withTiming(1, { duration: MOTION.recoilDuration, easing: Easing.linear }),
      withSpring(0, SPRINGS.flame),
    );
    pulseOpacity.value = withSequence(
      withDelay(270, withTiming(0.12, { duration: 50 })),
      withTiming(0, { duration: 300 }),
    );
    pulseScale.value = withSequence(
      withDelay(270, withTiming(0.8, { duration: 50 })),
      withTiming(1.65, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
  }, [startAnim, reducedMotion]);

  const flameStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));
  const riveRef = React.useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    const updateRive = () => {
      if (!isMounted) return;
      try {
        riveRef.current?.setNumber("streak", streak);
      } catch {}
    };
    const timers = riveRef.current
      ? [50, 150, 300].map((delay) => setTimeout(updateRive, delay))
      : [];
    updateRive();
    return () => {
      isMounted = false;
      timers.forEach(clearTimeout);
    };
  }, [streak]);

  return (
    <View style={styles.flameWrapper}>
      <Animated.View style={[styles.pulse, pulseStyle]} />
      <Animated.View
        style={[
          flameStyle,
          { width: SIZES.flameWidth, height: SIZES.flameHeight },
        ]}
      >
        <Rive
          ref={riveRef}
          source={require("../../../assets/lottie/dynamic-streak-fire.riv")}
          style={{ width: "100%", height: "100%" }}
          autoplay
          stateMachineName="State Machine 1"
          dataBinding={AutoBind(true)}
          onError={(error) =>
            console.log("Rive error caught gracefully:", error)
          }
          onPlay={() => {
            try {
              riveRef.current?.setNumber("streak", streak);
            } catch {}
          }}
        />
      </Animated.View>
    </View>
  );
}
