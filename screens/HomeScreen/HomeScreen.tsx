import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/Themed";

/**
 * Brand design tokens centralised for quick reuse.
 * These colours are derived from the existing DiscoveryScreen palette to maintain consistency.
 */
const COLORS = {
  ink: "#2E285A", // deep purple (primary text)
  accent: "#F6C24B", // yellow accent (CTA backgrounds)
  lavender: "#E7E5FB", // soft purple background
  skyA: "#E7F4F5", // gradient start
  skyB: "#E6ECFA", // gradient end
  white: "#FFFFFF",
  purple: "#8D7BF7",
  grayText: "#64748B",
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* GREETING */}
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hi, Samuel</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.bellBtn}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={COLORS.ink}
            />
          </TouchableOpacity>
        </View>

        {/* HERO CARD */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.cardShadow, { marginBottom: 24 }]}
          accessibilityRole="button"
          accessibilityLabel="Continue Reflection"
        >
          <LinearGradient
            colors={[COLORS.skyA, COLORS.skyB]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View>
              <Text style={styles.heroTitle}>Mindful Moments</Text>
              <Text style={styles.heroSubtitle}>3 remaining prompts today</Text>

              {/* progress bar */}
              <View
                style={styles.progressBar}
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel="Prompt completion"
              >
                <View style={[styles.progressFill, { width: "60%" }]} />
              </View>

              <TouchableOpacity activeOpacity={0.9} style={styles.ctaBtn}>
                <Text style={styles.ctaText}>Let's go!</Text>
              </TouchableOpacity>
            </View>

            {/* illustration */}
            <Ionicons
              name="leaf"
              size={92}
              color={COLORS.purple}
              style={styles.heroIcon}
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* FRIENDS */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>My Friends</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12 }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i.toString()} style={styles.avatarWrap}>
              <Ionicons name="person" size={24} color={COLORS.ink} />
            </View>
          ))}
        </ScrollView>

        {/* CATEGORIES */}
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
          Category
        </Text>
        <View style={styles.chipRow}>
          {["All", "Reflection", "Breathing", "Sleep", "Gratitude"].map(
            (c, idx) => (
              <TouchableOpacity
                key={c}
                activeOpacity={0.85}
                style={[styles.chip, idx === 0 && styles.chipPrimary]}
              >
                <Text
                  style={[styles.chipText, idx === 0 && styles.chipTextPrimary]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* LATEST */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Latest</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {[1, 2].map((n) => (
          <TouchableOpacity
            key={`latest-${n}`}
            style={styles.latestCard}
            activeOpacity={0.9}
          >
            <View style={styles.latestLeftIcon}>
              <Feather name="book-open" size={26} color={COLORS.ink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.latestTitle}>Reflection {n}</Text>
              <Text style={styles.latestSubtitle}>
                Review your day mindfully
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.ink}
              style={{ opacity: 0.6 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const shadowCard = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  android: { elevation: 6 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 28,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.ink,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lavender,
    alignItems: "center",
    justifyContent: "center",
  },
  // Hero card
  cardShadow: {
    ...shadowCard,
  },
  heroCard: {
    borderRadius: 26,
    padding: 20,
    minHeight: 200,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroTitle: { color: COLORS.ink, fontSize: 22, fontWeight: "800" },
  heroSubtitle: { color: COLORS.grayText, marginTop: 6, fontWeight: "600" },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 14,
    marginBottom: 20,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.accent,
  },
  ctaBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  ctaText: { fontWeight: "800", color: COLORS.ink },
  heroIcon: { position: "absolute", right: -16, bottom: -12, opacity: 0.4 },
  // Sections
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.ink,
  },
  seeAll: { color: COLORS.grayText, fontWeight: "600" },
  // Avatars
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.lavender,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  // Chips
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.grayText,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
  },
  chipPrimary: {
    backgroundColor: COLORS.accent,
    borderColor: "transparent",
  },
  chipText: {
    fontWeight: "700",
    color: COLORS.grayText,
  },
  chipTextPrimary: { color: COLORS.ink },
  // Latest card
  latestCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    ...shadowCard,
  },
  latestLeftIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.lavender,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  latestTitle: { fontWeight: "800", fontSize: 16, color: COLORS.ink },
  latestSubtitle: { color: COLORS.grayText, marginTop: 4 },
});
