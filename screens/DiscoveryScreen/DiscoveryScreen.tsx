// DiscoveryScreen.tsx
// Updated per request: removed bottom tabs, bigger mic, slimmer progress, fire for streak.

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";
import { favicon, thinking } from "@/assets/images";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import LottieView from "lottie-react-native";
import { girlMeditation, singingContract, thinkingMan } from "@/assets/lottie";
import { useAtom } from "jotai";
import VoiceRecorderModalWrapper from "../voiceRecorder/VoiceRecorderModalWrapper";
import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { recorderOpenAtom } from "../voiceRecorder/helpers";

const COLORS = {
  ink: "#2E285A", // deep purple
  accent: "#F6C24B", // yellow (mic, progress)
  lavender: "#E7E5FB", // chip background
  skyA: "#E7F4F5", // gradient start
  skyB: "#E6ECFA", // gradient end
  white: "#FFFFFF",
  streak: "#FF7A2F", // fire/number
};

export default function DiscoveryScreen() {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={styles.pillDot} />
              <Text style={styles.title}>1st discovery</Text>
            </View>
            {/* <CHANGE> fire icon for streak; kept orange count and flame icon */}
            <View style={styles.counters}>
              <Text style={styles.streakText}>4</Text>
              <MaterialCommunityIcons
                name="fire"
                size={22}
                color={COLORS.streak}
                style={{ marginLeft: 6 }}
              />
            </View>
          </View>

          <View
            style={styles.progressWrap}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="Experience progress"
          >
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "74%" }]} />
              <Text style={styles.progressText}>0/100 XP</Text>
            </View>
          </View>
        </View>

        {/* Prompt card */}
        <View
          style={[styles.cardShadow, { marginBottom: tabBarHeight - 32 }]}
          className="  flex-1"
        >
          <LinearGradient
            colors={[COLORS.skyA, COLORS.skyB]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promptCard}
          >
            <Box>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardCaption}>Journal · September 4</Text>
                <Feather name="rotate-cw" size={20} color={COLORS.ink} />
              </View>
              <Text style={styles.question}>
                What do you wish{"\n"}you had done{"\n"}differently today?
              </Text>
            </Box>

            {/* illustration layer */}
            <View style={styles.illustrationLayer} pointerEvents="none">
              {/* <Image alt="image" size="2xl" source={thinking} /> */}
              <LottieView
                autoPlay
                style={{
                  width: 200,
                  height: 200,
                }}
                source={girlMeditation}
              />
            </View>

            <View style={[styles.actionsRow]}>
              <CircleAction
                key="menu"
                size={72}
                bg={COLORS.lavender}
                icon={<Feather name="menu" size={26} color={COLORS.ink} />}
              />

              <CircleAction
                key="mic"
                onPress={() => {
                  setRecorderOpen(true);
                }}
                size={108}
                bg={COLORS.accent}
                elevation
                icon={<Feather name="mic" size={34} color={COLORS.ink} />}
              />

              <CircleAction
                key="keyboard"
                onPress={() => {
                  router.push("/tabs/journal-keyboard-entry");
                }}
                size={72}
                bg={COLORS.lavender}
                icon={
                  <MaterialCommunityIcons
                    name="keyboard-outline"
                    size={26}
                    color={COLORS.ink}
                  />
                }
              />
            </View>
          </LinearGradient>
        </View>

        {/* Actions */}

        <VoiceRecorderModalWrapper />
      </ScrollView>
    </SafeAreaView>
  );
}

function CircleAction({
  size,
  bg,
  icon,
  elevation,
  onPress,
}: {
  size: number;
  bg: string;
  icon: React.ReactNode;
  elevation?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          zIndex: elevation ? 2 : 1,
        },
        elevation ? styles.actionCircleElevated : null,
      ]}
    >
      {icon}
    </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 28,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  pillDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#8D7BF7",
    marginRight: 10,
  },
  title: {
    color: COLORS.ink,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  counters: { flexDirection: "row", alignItems: "center" },
  streakText: { color: COLORS.streak, fontSize: 18, fontWeight: "800" },

  // slimmer progress
  progressWrap: { marginTop: 8, marginBottom: 14 },
  progressTrack: {
    height: 12,
    backgroundColor: "#F3EFE6",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.accent,
    borderRadius: 10,
  },
  progressText: {
    position: "absolute",
    alignSelf: "center",
    color: COLORS.ink,
    fontSize: 11,
    fontWeight: "800",
  },

  cardShadow: { ...shadowCard, borderRadius: 26 },
  promptCard: {
    borderRadius: 26,
    paddingTop: 18,
    paddingBlock: 18,
    paddingHorizontal: 18,
    overflow: "hidden",
    minHeight: 260,
    justifyContent: "space-between",
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCaption: { color: COLORS.ink, opacity: 0.75, fontWeight: "700" },
  question: {
    marginTop: 10,
    color: COLORS.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    letterSpacing: 0.2,
  },
  illustrationLayer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },

  actionsRow: {
    // marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  actionCircleElevated: { ...shadowCard },
});
