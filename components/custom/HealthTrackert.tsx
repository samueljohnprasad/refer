import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const XIcon = () => (
  <View style={styles.iconContainer}>
    <View style={[styles.iconLine, { transform: [{ rotate: "45deg" }] }]} />
    <View style={[styles.iconLine, { transform: [{ rotate: "-45deg" }] }]} />
  </View>
);

const PlayIcon = () => <View style={styles.playTriangle} />;

interface HealthTrackerProps {
  transcripts: string[];
  onClose: () => void;
}

export default function HealthTracker({
  transcripts,
  onClose,
}: HealthTrackerProps) {
  return (
    <LinearGradient
      colors={["#f0f9ff", "#faf5ff", "#fed7aa"]}
      style={styles.gradient}
    >
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView style={styles.container}>
          <StatusBar barStyle="dark-content" />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={onClose}>
              <XIcon />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Today</Text>
              <Text style={styles.headerSubtitle}>02:35 PM</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.8)", "rgba(240, 249, 255, 0.6)"]}
            style={styles.avatarGradient}
          >
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>😌</Text>
              </View>
              <Text style={styles.mainTitle}>Stomach Ache</Text>
              <Text style={styles.mainSubtitle}>
                Tracking your wellness journey
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.flowingSection}>
            <Text style={styles.sectionLabel}>FEELINGS</Text>
            <View style={styles.feelingsFlow}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.9)",
                  "rgba(240, 249, 255, 0.7)",
                ]}
                style={styles.feelingTagGradient}
              >
                <View style={styles.feelingTag}>
                  <Text style={styles.feelingEmoji}>😰</Text>
                  <Text style={styles.feelingText}>Unwell</Text>
                </View>
              </LinearGradient>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.9)",
                  "rgba(250, 245, 255, 0.7)",
                ]}
                style={styles.feelingTagGradient}
              >
                <View style={styles.feelingTag}>
                  <Text style={styles.feelingEmoji}>😨</Text>
                  <Text style={styles.feelingText}>Pain</Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.flowingSection}>
            <Text style={styles.sectionLabel}>TRANSCRIPT (9 words)</Text>
            <View style={styles.transcriptFlow}>
              {transcripts.map((transcript, index) => (
                <Text key={index} style={styles.transcriptLine}>
                  {transcript}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.audioSection}>
            <LinearGradient
              colors={["#8b5cf6", "#6366f1"]}
              style={styles.playButtonGradient}
            >
              <TouchableOpacity style={styles.playButton}>
                <PlayIcon />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.audioFlow}>
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={["#8b5cf6", "#6366f1"]}
                    style={styles.progressFill}
                  />
                </View>
              </View>
              <View style={styles.audioActions}>
                <LinearGradient
                  colors={["#374151", "#1f2937"]}
                  style={styles.continueButtonGradient}
                >
                  <TouchableOpacity style={styles.continueButton}>
                    <Text style={styles.continueText}>Continue</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <Text style={styles.timeText}>00:05</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f0f9ff",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 20,
    marginBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    letterSpacing: -0.8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginTop: 2,
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6366f1",
  },
  avatarSection: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  avatarEmoji: {
    fontSize: 36,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    letterSpacing: -1.0,
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
  flowingSection: {
    paddingHorizontal: 32,
    marginBottom: 48,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 2.0,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  feelingsFlow: {
    flexDirection: "row",
    gap: 16,
  },
  feelingTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  feelingEmoji: {
    fontSize: 18,
  },
  feelingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: -0.2,
  },
  transcriptFlow: {
    gap: 16,
  },
  transcriptLine: {
    fontSize: 18,
    color: "#1f2937",
    lineHeight: 28,
    fontWeight: "500",
    letterSpacing: -0.3,
  },
  audioSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    backgroundColor: "transparent",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  audioFlow: {
    flex: 1,
    gap: 16,
  },
  progressContainer: {
    width: "100%",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
  },
  progressFill: {
    width: "15%",
    height: "100%",
    borderRadius: 3,
  },
  audioActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  continueButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  continueText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  timeText: {
    fontSize: 13,
    color: "#9ca3af",
    fontFamily: "monospace",
    fontWeight: "500",
  },
  homeIndicatorContainer: {
    alignItems: "center",
    paddingBottom: 16,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: "#d1d5db",
    borderRadius: 3,
  },
  iconContainer: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  iconLine: {
    position: "absolute",
    width: 12,
    height: 2,
    backgroundColor: "#374151",
    borderRadius: 1,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 0,
    borderBottomWidth: 9,
    borderTopWidth: 9,
    borderLeftColor: "#ffffff",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    marginLeft: 3,
  },
  avatarGradient: {
    marginBottom: 60,
    borderRadius: 32,
    marginHorizontal: 16,
  },
  feelingTagGradient: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  playButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonGradient: {
    borderRadius: 24,
  },
});
