import { useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

interface FocusTunnelingConfig {
  /** The scale of the background when tunneled (default: 0.95) */
  scale?: number;
  /** The opacity of the background when tunneled (default: 0.5) */
  opacity?: number;
  /** The border radius applied when tunneled (default: 32) */
  borderRadius?: number;
  /** Duration in ms for the tunnel entry (default: 250) */
  inDuration?: number;
  /** Duration in ms for the tunnel exit (default: 350 - matching modal slide down) */
  outDuration?: number;
}

/**
 * Reusable hook to create a "Focus Tunneling" effect.
 * When active, it scales down, dims, and rounds the corners of the container,
 * simulating depth and focusing the user's attention on a foreground modal.
 */
export function useFocusTunneling(
  isActive: boolean,
  config?: FocusTunnelingConfig
) {
  const scaleTarget = config?.scale ?? 0.95;
  const opacityTarget = config?.opacity ?? 0.5;
  const radiusTarget = config?.borderRadius ?? 32;
  const inDuration = config?.inDuration ?? 250;
  const outDuration = config?.outDuration ?? 350; // Slower out to match native Modal slide-down

  return useAnimatedStyle(() => {
    const duration = isActive ? inDuration : outDuration;

    return {
      transform: [
        {
          scale: withTiming(isActive ? scaleTarget : 1, {
            duration,
            easing: Easing.out(Easing.cubic),
          }),
        },
      ],
      opacity: withTiming(isActive ? opacityTarget : 1, {
        duration,
      }),
      borderRadius: withTiming(isActive ? radiusTarget : 0, {
        duration,
      }),
      overflow: "hidden",
    };
  }, [isActive, scaleTarget, opacityTarget, radiusTarget, inDuration, outDuration]);
}
