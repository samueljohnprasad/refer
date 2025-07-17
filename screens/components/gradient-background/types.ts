import { ViewStyle } from "react-native";
import { Animated } from "react-native";

export type GradientBackgroundProps = {
  /**
   * Array of colours to be used in the LinearGradient.
   * You can pass as many colours as you like.
   * Defaults to the yellow palette shown in the design.
   */
  colors?: string[];

  /** Optional style override applied *on top* of the gradient wrapper */
  style?: ViewStyle;

  /** Children to render over the gradient */
  children?: React.ReactNode;

  /** Animated scroll value from an Animated.ScrollView for parallax */
  scrollY?: Animated.Value;
  
  /** Parallax strength (0 = disabled, 1 = same speed as scroll) */
  parallaxStrength?: number;
  
  /** Increase blur overlay opacity automatically on very light backgrounds */
  adaptiveBlur?: boolean;

  /**
   * Configuration for the optional matching card.
   * If omitted, no card will be rendered.
   */
  card?: {
    /** Text displayed inside the card */
    label: string;
    /** Optional description text */
    description?: string;
    /** Overrides the automatically-derived card colour */
    cardColour?: string;
  };
};
