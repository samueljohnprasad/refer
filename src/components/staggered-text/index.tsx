import { memo, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

import type { StaggeredCharacterProps, StaggeredTextProps } from "./types";

const DEFAULT_DURATION_MS = 250;
const DEFAULT_CHARACTER_DELAY_MS = 24;
const DEFAULT_EASING = Easing.out(Easing.cubic);
const DEFAULT_TEXT_PROPS = {
  activeIndex: 0,
  fontSize: 24,
  color: "#ffffff",
  fontFamily: APP_FONT_FAMILIES.extraBold,
  letterSpacing: 0,
};
const DEFAULT_ANIMATION_CONFIG = {
  duration: DEFAULT_DURATION_MS,
  characterDelay: DEFAULT_CHARACTER_DELAY_MS,
  easing: DEFAULT_EASING,
};
const INITIAL_OPACITY = 0.65;
const INITIAL_TRANSLATE_Y = 6;
const INITIAL_SCALE = 0.98;

const AnimatedCharacter = memo(function AnimatedCharacter({
  character,
  delay,
  duration,
  easing,
  fontFamily,
  fontSize,
  color,
  letterSpacing,
  reduceMotion,
}: StaggeredCharacterProps) {
  const progress = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }

    progress.value = 0;
    progress.value = withDelay(delay, withTiming(1, { duration, easing }));

    return () => cancelAnimation(progress);
  }, [delay, duration, easing, progress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [INITIAL_OPACITY, 1]),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [INITIAL_TRANSLATE_Y, 0],
        ),
      },
      {
        scale: interpolate(progress.value, [0, 1], [INITIAL_SCALE, 1]),
      },
    ],
  }));

  return (
    <Animated.Text
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          color,
          fontFamily,
          fontSize,
          letterSpacing,
          lineHeight: fontSize * 1.25,
        },
        animatedStyle,
      ]}
    >
      {character === " " ? "\u00A0" : character}
    </Animated.Text>
  );
});

export const StaggeredText = memo(function StaggeredText(
  inputProps: StaggeredTextProps,
) {
  const props = resolveStaggeredTextProps(inputProps);
  const reduceMotion = useReducedMotion();
  const activeText = getActiveText(props.texts, props.activeIndex);

  if (!activeText) return null;

  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={activeText}
      className="w-full flex-row items-center justify-center"
      style={{ height: props.height }}
    >
      {Array.from(activeText).map((character, index) => (
        <AnimatedCharacter
          key={`${props.activeIndex}-${index}`}
          character={character}
          delay={index * props.animationConfig.characterDelay}
          duration={props.animationConfig.duration}
          easing={props.animationConfig.easing}
          fontFamily={props.fontFamily}
          fontSize={props.fontSize}
          color={props.color}
          letterSpacing={props.letterSpacing}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
});

function resolveStaggeredTextProps(inputProps: StaggeredTextProps) {
  const props = { ...DEFAULT_TEXT_PROPS, ...inputProps };

  return {
    ...props,
    height: inputProps.height ?? props.fontSize * 1.5,
    animationConfig: {
      ...DEFAULT_ANIMATION_CONFIG,
      ...inputProps.animationConfig,
    },
  };
}

function getActiveText(texts: readonly string[], activeIndex: number): string {
  return texts[activeIndex] ?? getFirstText(texts);
}

function getFirstText(texts: readonly string[]): string {
  return texts[0] ?? "";
}
