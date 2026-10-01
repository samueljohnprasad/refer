import React, { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ZapIcon, FireIcon, Clapping01Icon } from "@hugeicons/core-free-icons";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

export const SHARE_CARD_WIDTH = 360;
export const SHARE_CARD_HEIGHT = 450;

const PANDA_CELEBRATE = require("../../../assets/images/panda/panda-super-excite.png");
const PANDA_PERFECT = require("../../../assets/images/panda/panda-happy.png");

export interface ShareWinCardProps {
  lessonTitle?: string;
  totalXP: number;
  streakDays: number;
  isPerfect: boolean;
}

/**
 * Static, brand-colored "lesson complete" card rendered off-screen and captured
 * with react-native-view-shot for sharing. Colors are intentionally fixed so the
 * exported image looks identical regardless of the device theme.
 */
export const ShareWinCard = forwardRef<View, ShareWinCardProps>(function ShareWinCard(
  { lessonTitle, totalXP, streakDays, isPerfect },
  ref,
) {
  return (
    <View ref={ref} collapsable={false} style={styles.card}>
      <LinearGradient
        colors={isPerfect ? ["#FFF4D6", "#FFE2A3"] : ["#F3FBEF", "#DFF3D8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View style={styles.brandDot} />
        <Text style={styles.brand}>Happy</Text>
      </View>

      <Image
        source={isPerfect ? PANDA_PERFECT : PANDA_CELEBRATE}
        style={styles.mascot}
        contentFit="contain"
      />

      {isPerfect ? (
        <View style={styles.perfectPill}>
          <HugeiconsIcon icon={Clapping01Icon} size={14} color="#8A5A12" strokeWidth={2.4} />
          <Text style={styles.perfectText}>PERFECT LESSON</Text>
        </View>
      ) : null}

      <Text style={styles.title}>{isPerfect ? "Flawless lesson!" : "Lesson complete!"}</Text>
      {lessonTitle ? (
        <Text style={styles.subtitle} numberOfLines={2}>
          {lessonTitle}
        </Text>
      ) : null}

      <View style={styles.statsRow}>
        <View style={[styles.stat, { borderColor: "#F6D97A", backgroundColor: "#FFF7E0" }]}>
          <HugeiconsIcon icon={ZapIcon} size={18} color="#B4791B" strokeWidth={2.4} />
          <Text style={[styles.statValue, { color: "#8A5A12" }]}>+{totalXP} XP</Text>
        </View>
        <View style={[styles.stat, { borderColor: "#FFC9A3", backgroundColor: "#FFF0E6" }]}>
          <HugeiconsIcon icon={FireIcon} size={18} color="#D9571E" strokeWidth={2.4} />
          <Text style={[styles.statValue, { color: "#A63E10" }]}>
            {streakDays} day{streakDays === 1 ? "" : "s"}
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>Join me on Happy — small steps, calmer mind.</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: SHARE_CARD_WIDTH,
    height: SHARE_CARD_HEIGHT,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#5E9C62",
  },
  brand: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 16,
    color: "#2F4A31",
    letterSpacing: 0.6,
  },
  mascot: {
    width: 170,
    height: 170,
    marginTop: 8,
  },
  perfectPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFE89C",
    marginTop: 4,
  },
  perfectText: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: "#8A5A12",
  },
  title: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 26,
    color: "#1F2D20",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 15,
    color: "#5B6B5C",
    marginTop: 4,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
  },
  statValue: {
    fontFamily: APP_FONT_FAMILIES.extraBold,
    fontSize: 16,
  },
  footer: {
    marginTop: "auto",
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 12,
    color: "#5B6B5C",
    textAlign: "center",
  },
});

export default ShareWinCard;
