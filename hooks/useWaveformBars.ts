import { useRef, useEffect } from "react";
import { Animated } from "react-native";

/**
 * Returns an array of Animated.Value representing waveform bar heights.
 * Values animate randomly while `active` is true, otherwise reset to baseline.
 */
export const useWaveformBars = (
  active: boolean,
  barCount: number = 8,
  refreshMs: number = 200
): Animated.Value[] => {
  const barsRef = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0.2))
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const animate = (): void => {
      const animations = barsRef.current.map((bar, index) => {
        const randomHeight = Math.random() * 0.8 + 0.2;
        const delay = index * 50;
        return Animated.timing(bar, {
          toValue: randomHeight,
          duration: 150 + Math.random() * 100,
          delay,
          useNativeDriver: false,
        });
      });

      Animated.parallel(animations).start();
    };

    if (active) {
      animate();
      interval = setInterval(animate, refreshMs);
    } else {
      Animated.parallel(
        barsRef.current.map((bar) =>
          Animated.timing(bar, {
            toValue: 0.2,
            duration: 300,
            useNativeDriver: false,
          })
        )
      ).start();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, refreshMs]);

  return barsRef.current;
};
