import type { ColorValue } from "react-native";
import type { EasingFunction } from "react-native-reanimated";

export interface StaggeredTextAnimationConfig {
  duration?: number;
  characterDelay?: number;
  easing?: EasingFunction;
}

export interface StaggeredTextProps {
  texts: readonly string[];
  activeIndex?: number;
  fontSize?: number;
  color?: ColorValue;
  fontFamily?: string;
  height?: number;
  letterSpacing?: number;
  animationConfig?: StaggeredTextAnimationConfig;
}

export interface StaggeredCharacterProps {
  character: string;
  delay: number;
  duration: number;
  easing: EasingFunction;
  fontFamily: string;
  fontSize: number;
  color: ColorValue;
  letterSpacing: number;
  reduceMotion: boolean;
}
