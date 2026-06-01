import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import Svg, { Path, Defs, Mask, Rect, LinearGradient, Stop, G } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface AnimatedStatIconProps {
  paths: { d: string; fill: string }[];
  width?: number;
  height?: number;
  viewBox?: string;
  delayMs?: number;
}

export function AnimatedStatIcon({
  paths,
  width = 32,
  height = 32,
  viewBox = "0 0 32 32",
  delayMs = 0,
}: AnimatedStatIconProps) {
  // We want the sweep to happen every 15 seconds. 
  // We'll use a shared value from -2 to 2 (relative to width) to sweep across.
  const sweep = useSharedValue(-2);

  useEffect(() => {
    // 15 second cycle: 1s sweep, 14s pause
    sweep.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1, // infinite
        false
      )
    );
  }, [sweep, delayMs]);

  const animatedProps = useAnimatedProps(() => {
    return {
      x: `${sweep.value * 100}%`,
    };
  });

  return (
    <Svg width={width} height={height} viewBox={viewBox} fill="none">
      <Defs>
        <Mask id="icon-mask">
          {paths.map((p, i) => (
            <Path key={i} d={p.d} fill="white" />
          ))}
        </Mask>
        <LinearGradient id="shine-grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="white" stopOpacity="0" />
          <Stop offset="50%" stopColor="white" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="white" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Base Icon */}
      {paths.map((p, i) => (
        <Path key={i} d={p.d} fill={p.fill} />
      ))}

      {/* Shine Overlay masked to the icon shape */}
      <G mask="url(#icon-mask)">
        <AnimatedRect
          y="-50%"
          width="200%"
          height="200%"
          fill="url(#shine-grad)"
          transform="rotate(45, 16, 16)"
          animatedProps={animatedProps}
        />
      </G>
    </Svg>
  );
}

export const AnimatedFireIcon = (props: { width?: number; height?: number }) => (
  <AnimatedStatIcon
    {...props}
    viewBox="0 0 32 34"
    delayMs={0}
    paths={[
      { d: "M12.5 20.0451V10.5451C12.5 8.5451 14 8.54507 15 9.04507L17 10.0451C17.8333 8.87841 19.7 6.34508 20.5 5.54508C21.5 4.54508 22.5 5.04508 23.5 6.04508C24.5 7.04508 27.5 11.0451 29 13.0451C30.5 15.0451 31 17.0451 31 20.0451C31 23.0451 27.5 28.0451 21.5 28.0451C15.5 28.0451 12.5 22.5451 12.5 20.0451Z", fill: "#FF9600" },
      { d: "M18.5 18.5451C19.3 17.3451 20.5 15.7118 21 15.0451C21.1666 14.7118 21.7 14.2451 22.5 15.0451C23.5 16.0451 24.5 18.0451 25 18.5451C25.5 19.0451 26 21.0451 25 22.5451C24 24.0451 22.5 24.5451 21.5 24.5451C20.5 24.5451 19 23.5451 18.5 22.5451C18 21.5451 17.5 20.0451 18.5 18.5451Z", fill: "#FFC800" }
    ]}
  />
);

export const AnimatedGemIcon = (props: { width?: number; height?: number }) => (
  <AnimatedStatIcon
    {...props}
    viewBox="0 0 32 32"
    delayMs={2000} // Staggered delay so they don't shine at the exact same time
    paths={[
      { d: "M14 20.4119V11.1439C14 10.4352 14.3751 9.77936 14.986 9.42002L21.486 5.59649C22.1119 5.22832 22.8881 5.22832 23.514 5.59649L30.014 9.42002C30.6249 9.77936 31 10.4352 31 11.1439V20.4119C31 21.0904 30.6561 21.7225 30.0865 22.0911L23.5865 26.297C22.9253 26.7248 22.0747 26.7248 21.4135 26.297L14.9135 22.0911C14.3439 21.7225 14 21.0904 14 20.4119Z", fill: "#1CB0F6" },
      { d: "M20.9335 7.57699L16.1548 10.8623C15.4745 11.33 15.6219 12.374 16.4051 12.635L18.5758 13.3586C18.8457 13.4486 19.1412 13.4193 19.3882 13.2782L21.9961 11.7879C22.3077 11.6099 22.5 11.2785 22.5 10.9197V8.40103C22.5 7.59585 21.597 7.12083 20.9335 7.57699Z", fill: "#DDF4FF" }
    ]}
  />
);

export const GrayFireIcon = (props: { width?: number; height?: number; color?: string }) => (
  <Svg width={props.width ?? 32} height={props.height ?? 32} viewBox="0 0 32 34" fill="none">
    <Path d="M12.5 20.0451V10.5451C12.5 8.5451 14 8.54507 15 9.04507L17 10.0451C17.8333 8.87841 19.7 6.34508 20.5 5.54508C21.5 4.54508 22.5 5.04508 23.5 6.04508C24.5 7.04508 27.5 11.0451 29 13.0451C30.5 15.0451 31 17.0451 31 20.0451C31 23.0451 27.5 28.0451 21.5 28.0451C15.5 28.0451 12.5 22.5451 12.5 20.0451Z" fill="#E2E8F0" />
    <Path d="M18.5 18.5451C19.3 17.3451 20.5 15.7118 21 15.0451C21.1666 14.7118 21.7 14.2451 22.5 15.0451C23.5 16.0451 24.5 18.0451 25 18.5451C25.5 19.0451 26 21.0451 25 22.5451C24 24.0451 22.5 24.5451 21.5 24.5451C20.5 24.5451 19 23.5451 18.5 22.5451C18 21.5451 17.5 20.0451 18.5 18.5451Z" fill="#CBD5E1" />
  </Svg>
);
