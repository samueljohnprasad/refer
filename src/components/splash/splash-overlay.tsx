import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import Animated, {
  Easing,
  useReducedMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import LIGHT from "@/assets/lottie/splash/light.json";
import DARK from "@/assets/lottie/splash/dark.json";
const BACKDROP = { light: "#000000", dark: "#FFFFFF" } as const;
const FINISH_FALLBACK_MS = 2600;
const FADE_MS = 600;

export type SplashOverlayProps = {
  canFinish: boolean;
  onReady: () => void;
  onDone: () => void;
};

export function SplashOverlay({
  canFinish,
  onReady,
  onDone,
}: SplashOverlayProps) {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const reducedMotion = useReducedMotion();
  const viewRef = useRef<LottieView>(null);
  const readyRef = useRef(false);
  const animationFinishedRef = useRef(false);
  const finishedRef = useRef(false);
  const canFinishRef = useRef(canFinish);
  const opacity = useSharedValue(1);
  const onReadyRef = useRef(onReady);
  const onDoneRef = useRef(onDone);
  canFinishRef.current = canFinish;
  onReadyRef.current = onReady;
  onDoneRef.current = onDone;

  const handleFadeDone = useCallback(() => onDoneRef.current(), []);
  const handleReady = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    onReadyRef.current();
  }, []);
  const complete = useCallback(() => {
    if (
      finishedRef.current ||
      !readyRef.current ||
      !animationFinishedRef.current ||
      !canFinishRef.current
    ) {
      return;
    }
    finishedRef.current = true;
    opacity.value = withTiming(
      0,
      {
        duration: reducedMotion ? 120 : FADE_MS,
        easing: Easing.out(Easing.quad),
      },
      (done) => {
        if (done) scheduleOnRN(handleFadeDone);
      },
    );
  }, [handleFadeDone, opacity, reducedMotion]);

  const markAnimationFinished = useCallback(() => {
    animationFinishedRef.current = true;
    complete();
  }, [complete]);

  useEffect(() => {
    if (reducedMotion) {
      markAnimationFinished();
      return undefined;
    }

    const play = setTimeout(() => viewRef.current?.play(), 32);
    const fallback = setTimeout(markAnimationFinished, FINISH_FALLBACK_MS);
    return () => {
      clearTimeout(play);
      clearTimeout(fallback);
    };
  }, [markAnimationFinished, reducedMotion]);

  useEffect(() => {
    complete();
  }, [canFinish, complete]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      onLayout={handleReady}
      style={[StyleSheet.absoluteFill, { backgroundColor: BACKDROP[scheme] }, fadeStyle]}
    >
      <LottieView
        ref={viewRef}
        key={scheme}
        source={scheme === "dark" ? DARK : LIGHT}
        autoPlay={!reducedMotion}
        loop={false}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) markAnimationFinished();
        }}
        onAnimationFailure={markAnimationFinished}
      />
    </Animated.View>
  );
}
