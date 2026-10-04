import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import { useReducedMotion } from "react-native-reanimated";
import { StreakProgressGraphic as StreakProgressGraphicView } from "./StreakCelebrationParts";
import { StreakPrimaryCTA } from "./StreakCelebrationCopy";
import { styles } from "./streakCelebrationStyles";

export function StreakProgressGraphic({
  streak,
  startAnim,
  hideMessage,
  overrideDays,
}: {
  streak: number;
  startAnim: boolean;
  hideMessage?: boolean;
  overrideDays?: boolean[];
}) {
  return (
    <StreakProgressGraphicView
      streak={streak}
      startAnim={startAnim}
      hideMessage={hideMessage}
      overrideDays={overrideDays}
    />
  );
}

export function StreakCelebration({
  streak,
  onClose,
}: {
  previousStreak: number;
  streak: number;
  onClose?: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => setStartAnim(true), 50);
    const hapticTimer = setTimeout(() => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 390);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(hapticTimer);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <StreakProgressGraphicView streak={streak} startAnim={startAnim} />
      <View style={styles.content}>
        <View style={styles.spacerCTA}>
          <StreakPrimaryCTA
            onPress={() => onClose?.()}
            startAnim={startAnim}
            reducedMotion={reducedMotion}
          />
        </View>
      </View>
    </View>
  );
}
