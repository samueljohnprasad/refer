import { StyleSheet } from "react-native";
import { BADGE_ROTATION, BADGE_TAIL_ROTATION, CARD_ROTATION, COLORS } from "./constants";

export const progressGraphVictoryStyles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    header: {
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    title: {
        color: COLORS.text,
        fontFamily: "CormorantBold",
        fontSize: 30,
        lineHeight: 36,
        letterSpacing: -0.5,
        textAlign: "center",
    },
    subtitle: {
        color: "#6B7280",
        fontSize: 14,
        fontWeight: "500",
        lineHeight: 20,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    cardStage: {
        alignItems: "center",
    },
    cardShell: {
        alignItems: "center",
        justifyContent: "center",
    },
    absoluteFill: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    cardUnderlay: {
        position: "absolute",
        backgroundColor: "rgba(227, 244, 219, 0.56)",
        transform: CARD_ROTATION as never,
    },
    card: {
        overflow: "hidden",
        backgroundColor: COLORS.white,
        transform: CARD_ROTATION as never,
    },
    primaryLabel: {
        position: "absolute",
        color: COLORS.text,
        fontWeight: "800",
    },
    comparisonLabel: {
        position: "absolute",
        color: COLORS.comparison,
        fontWeight: "800",
    },
    timeLabel: {
        position: "absolute",
        color: COLORS.time,
        fontWeight: "500",
    },
    chartContainer: {
        position: "absolute",
    },
    axisVertical: {
        position: "absolute",
    },
    axisHorizontal: {
        position: "absolute",
    },
    badgeWrapper: {
        position: "absolute",
    },
    badgeAnchor: {
        alignItems: "center",
    },
    badgeTail: {
        position: "absolute",
        backgroundColor: COLORS.happy,
        transform: BADGE_TAIL_ROTATION as never,
    },
    badgeBubble: {
        backgroundColor: COLORS.happy,
        paddingHorizontal: 20,
        paddingVertical: 12,
        transform: BADGE_ROTATION as never,
    },
    badgeText: {
        color: COLORS.white,
        fontWeight: "800",
    },
});
