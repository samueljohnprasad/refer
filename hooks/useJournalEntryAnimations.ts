import { useEffect, useMemo, useRef, useCallback } from "react";
import { Animated, Easing } from "react-native";

export interface AnimatedSectionStyle {
  opacity: Animated.Value;
  transform: Array<{ translateY: Animated.Value }>;
}

export interface UseJournalEntryAnimationsReturn {
  heroOpacity: Animated.Value;
  heroTranslateY: Animated.Value;
  sectionStyle: (index: number) => AnimatedSectionStyle;
}

/**
 * Staggered mount animations for Journal Entry screen.
 * - Fades and slides in the hero card.
 * - Then staggers each section with a gentle fade + 6px translateY.
 */
export const useJournalEntryAnimations = (
  sectionCount: number = 5
): UseJournalEntryAnimationsReturn => {
  const easing = useMemo(() => Easing.bezier(0.25, 0.46, 0.45, 0.94), []);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(8)).current;

  const sectionAnims = useRef(
    Array.from({ length: sectionCount }).map(() => ({
      o: new Animated.Value(0),
      y: new Animated.Value(6),
    }))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 1000,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 1000,
        easing,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const seq = sectionAnims.map(({ o, y }) =>
        Animated.parallel([
          Animated.timing(o, {
            toValue: 1,
            duration: 900,
            easing,
            useNativeDriver: true,
          }),
          Animated.timing(y, {
            toValue: 0,
            duration: 900,
            easing,
            useNativeDriver: true,
          }),
        ])
      );
      Animated.stagger(250, seq).start();
    });
  }, [easing, heroOpacity, heroTranslateY, sectionAnims]);

  const sectionStyle = useCallback(
    (index: number): AnimatedSectionStyle => ({
      opacity: sectionAnims[index]?.o ?? new Animated.Value(1),
      transform: [{ translateY: sectionAnims[index]?.y ?? new Animated.Value(0) }],
    }),
    [sectionAnims]
  );

  return { heroOpacity, heroTranslateY, sectionStyle };
};

export default useJournalEntryAnimations;
