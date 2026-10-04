import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { useXPOptional } from "@/src/context/XPContext";
import {
  hasShownGoalToastToday,
  markGoalToastShownToday,
  useDailyXPGoal,
} from "@/src/store/dailyGoalStore";
import { DailyGoalRing } from "@/src/components/celebration/DailyGoalRing";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";

const AUTO_HIDE_MS = 4500;

/**
 * Decides when to show the once-a-day "Daily goal done" toast.
 * `suppressed` should be true while a celebration/overlay is on screen so the
 * toast waits until the learner is back on the map.
 */
export function useDailyGoalToast(suppressed: boolean): {
  visible: boolean;
  todayXP: number;
  goal: number;
  dismiss: () => void;
} {
  const xp = useXPOptional();
  const { goal } = useDailyXPGoal();
  const todayXP = xp?.todayXP ?? 0;
  const [visible, setVisible] = useState(false);
  const checkingRef = useRef(false);

  useEffect(() => {
    if (suppressed || visible || checkingRef.current) return;
    if (todayXP < goal || todayXP === 0) return;
    checkingRef.current = true;
    hasShownGoalToastToday().then((shown) => {
      checkingRef.current = false;
      if (shown) return;
      void markGoalToastShownToday();
      setVisible(true);
    });
  }, [suppressed, visible, todayXP, goal]);

  return { visible, todayXP, goal, dismiss: () => setVisible(false) };
}

interface DailyGoalToastProps {
  visible: boolean;
  todayXP: number;
  goal: number;
  onDismiss: () => void;
}

/** Small card that rises above the tab bar, then slips away on its own. */
export function DailyGoalToast({ visible, todayXP, goal, onDismiss }: DailyGoalToastProps) {
  const { t } = useTranslation("common");
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  // Same breathing room above the native tab bar as NextJourneyBridgeDock.
  const bottomOffset = Math.max(insets.bottom + 74, 88);

  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);
  const [mounted, setMounted] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    opacity.value = withTiming(0, { duration: 220 });
    translateY.value = withTiming(30, { duration: 260 }, (finished) => {
      if (finished) {
        runOnJS(setMounted)(false);
        runOnJS(onDismiss)();
      }
    });
  };

  useEffect(() => {
    if (!visible) return;
    setMounted(true);
    translateY.value = 40;
    opacity.value = 0;
    translateY.value = withSpring(0, { damping: 16, stiffness: 180 });
    opacity.value = withTiming(1, { duration: 240 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    hideTimer.current = setTimeout(hide, AUTO_HIDE_MS);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && !mounted) return null;

  const green = isDark ? "#7FCB85" : "#4F9A55";

  return (
    <Animated.View
      testID="daily-goal-toast"
      pointerEvents="box-none"
      style={[styles.host, { bottom: bottomOffset }, style]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("xp.dailyGoal.accessibilityLabel", { todayXP, goal })}
        onPress={hide}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? "#14281a" : "#FFFFFF",
            borderColor: isDark ? "#2c5a34" : "#BFE3C4",
          },
        ]}
      >
        <DailyGoalRing
          size={44}
          strokeWidth={5}
          from={1}
          to={1}
          color={green}
          trackColor={isDark ? "#2a3a2a" : "#E6EDE6"}
          duration={1}
        >
          <HugeiconsIcon icon={Tick02Icon} size={18} color={green} strokeWidth={2.8} />
        </DailyGoalRing>
        <View style={styles.text}>
          <Text style={[styles.title, { color: SEMANTIC_COLORS.text.primary }]}>
            {t("xp.dailyGoal.title")}
          </Text>
          <Text style={[styles.subtitle, { color: SEMANTIC_COLORS.text.secondary }]}>
            {t("xp.dailyGoal.message", { todayXP })}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 30,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: {
    flex: 1,
  },
  title: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 15,
  },
  subtitle: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 1,
  },
});

export default DailyGoalToast;
