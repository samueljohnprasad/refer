import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HealthTracker from "@/components/custom/HealthTrackert";

const XIcon = () => (
  <View style={styles.iconContainer}>
    <View style={[styles.iconLine, { transform: [{ rotate: "45deg" }] }]} />
    <View style={[styles.iconLine, { transform: [{ rotate: "-45deg" }] }]} />
  </View>
);

const PlusIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.plusHorizontal} />
    <View style={styles.plusVertical} />
  </View>
);

const PlayIcon = () => <View style={styles.playTriangle} />;

export default function HealthTrackerr() {
  return <HealthTracker />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffbeb",
  },
  gradient: {
    flex: 1,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  signalBars: {
    flexDirection: "row",
    gap: 2,
  },
  signalBar: {
    width: 4,
    height: 12,
    borderRadius: 2,
  },
  signalBarActive: {
    backgroundColor: "#000",
  },
  signalBarInactive: {
    backgroundColor: "#9ca3af",
  },
  wifiIcon: {
    marginLeft: 4,
  },
  wifiText: {
    fontSize: 16,
  },
  batteryIndicator: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  batteryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  editButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#fed7aa",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarIndicator: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarDiamond: {
    width: 8,
    height: 8,
    backgroundColor: "#9ca3af",
    transform: [{ rotate: "45deg" }],
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  titleEmojis: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    letterSpacing: 1,
    marginBottom: 16,
  },
  feelingsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  feelingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feelingEmoji: {
    fontSize: 18,
  },
  feelingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  photoButton: {
    width: "100%",
    height: 96,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  transcriptContainer: {
    gap: 12,
  },
  transcriptText: {
    fontSize: 18,
    color: "#000",
    lineHeight: 24,
  },
  audioPlayer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
  },
  playButton: {
    width: 48,
    height: 48,
    backgroundColor: "#000",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  audioControls: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
  },
  progressFill: {
    width: "8%",
    height: "100%",
    backgroundColor: "#4b5563",
    borderRadius: 2,
  },
  continueButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  timeStamp: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "monospace",
  },
  homeIndicatorContainer: {
    alignItems: "center",
    paddingBottom: 8,
  },
  homeIndicator: {
    width: 128,
    height: 4,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  iconContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconLine: {
    position: "absolute",
    width: 12,
    height: 2,
    backgroundColor: "#000",
    borderRadius: 1,
  },
  plusHorizontal: {
    position: "absolute",
    width: 16,
    height: 2,
    backgroundColor: "#9ca3af",
    borderRadius: 1,
  },
  plusVertical: {
    position: "absolute",
    width: 2,
    height: 16,
    backgroundColor: "#9ca3af",
    borderRadius: 1,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderBottomWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "#fff",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginLeft: 2,
  },
});
