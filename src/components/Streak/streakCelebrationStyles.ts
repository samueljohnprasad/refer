import { StyleSheet } from "react-native";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

const COLORS = {
  canvas: "#FFFFFF",
  ink: "#142414",
  inkSoft: "#6B6B6B",
  inkMuted: "#AFAFAF",
  beeYellow: "#FFD900",
};

export const SIZES = {
  screenPadding: 24,
  contentMaxWidth: 340,
  flameWidth: 220,
  flameHeight: 260,
  flameContainerWidth: 240,
  flameContainerHeight: 280,
  dayMarker: 28,
};

export const SPACING = {
  numberToLabel: 2,
  labelToWeek: 28,
  weekToMessage: 28,
  messageToCTA: 28,
};

export const MOTION = {
  ignitionStart: 180,
  ignitionDuration: 130,
  peakDuration: 100,
  recoilStart: 410,
  recoilDuration: 130,
  labelStart: 420,
  dayActivationStart: 600,
  messageStart: 700,
  ctaStart: 820,
};

export const SPRINGS = {
  flame: { mass: 0.7, stiffness: 280, damping: 18 },
  dayIndicator: { mass: 0.5, stiffness: 360, damping: 18 },
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.canvas,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SIZES.screenPadding,
  },
  content: {
    width: "100%",
    maxWidth: SIZES.contentMaxWidth,
    alignItems: "center",
  },
  flameWrapper: {
    width: SIZES.flameContainerWidth,
    height: SIZES.flameContainerHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.beeYellow,
  },
  dayStreakLabel: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 17,
    lineHeight: 22,
    color: COLORS.ink,
    textAlign: "center",
  },
  spacerLabel: { marginTop: SPACING.numberToLabel },
  spacerWeek: { marginTop: SPACING.labelToWeek, width: "100%" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
  },
  dayCol: { alignItems: "center", width: 36 },
  dayLabel: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.inkSoft,
    marginBottom: 6,
  },
  dayMarker: {
    width: SIZES.dayMarker,
    height: SIZES.dayMarker,
    borderRadius: SIZES.dayMarker / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  spacerMessage: { marginTop: SPACING.weekToMessage, width: "100%" },
  supportingMessage: {
    fontFamily: APP_FONT_FAMILIES.regular,
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.inkSoft,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 320,
  },
  spacerCTA: { marginTop: SPACING.messageToCTA, width: "100%" },
});
