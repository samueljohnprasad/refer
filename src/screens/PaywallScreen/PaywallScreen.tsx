import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
// import { singingContract } from "@/assets/lottie";
import { router } from "expo-router";
import AnimatedLinearGradient from "@/src/components/AnimatedLinearGradient";
import FeatureRow from "./FeatureRow";
import BuyCards from "./BuyCards";
import { COLORS } from "./helpers";
import { singingContract } from "@/assets/lottie";

const PaywallScreen = () => {
  return (
    <Box
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: "#8B8DF4", position: "relative" }}
    >
      {/* <Box className="flex items-center justify-center flex-1"> */}
      <AnimatedLinearGradient
        colors={["#C4B5FD", "#8B8DF4"]}
        style={{ width: "100%" }}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerRow}>
            {/* Illustration approximation: notebook + pencil */}
            <LottieView
              autoPlay
              style={{
                width: 200,
                height: 200,
              }}
              source={singingContract}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                Go Premium{"\n"}& Unlock all features
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </AnimatedLinearGradient>
      <TouchableOpacity
        style={styles.backBtn}
        activeOpacity={0.7}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={20} color="grey" />
      </TouchableOpacity>
      <Box
        className="flex p-5 justify-start  flex-1 w-full"
        style={{
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        <ScrollView
          style={{ width: "100%" }}
          className="flex-1"
          //   backgroundColor: "red"
          showsVerticalScrollIndicator={false}
        >
          <Box className="flex flex-col gap-4 ">
            <FeatureRow
              icon={<Ionicons name="star" size={18} color="#f6c73b" />}
              tint="#fff7df"
              label="Unlimited Journal Entries"
            />
            <FeatureRow
              icon={
                <Ionicons name="sparkles-outline" size={18} color="#6b8bff" />
              }
              tint="#e9efff"
              label="Smart AI Writing Suggestions"
            />
            <FeatureRow
              icon={<Ionicons name="bar-chart" size={18} color="#35b276" />}
              tint="#e9f9f0"
              label="Mood & Progress Tracking"
            />
            <FeatureRow
              icon={<Ionicons name="cloud-outline" size={18} color="#7fb7ff" />}
              tint="#eef6ff"
              label="Secure Cloud Backup"
            />
            <FeatureRow
              icon={
                <Ionicons
                  name="color-palette-outline"
                  size={18}
                  color="#f4a261"
                />
              }
              tint="#fff2e8"
              label="Themes & Customization"
            />
          </Box>
        </ScrollView>
        <BuyCards />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
  },
  illustration: {
    width: 88,
    height: 88,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.text,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: COLORS.white,
  },
  pencil: {
    position: "absolute",
    right: 4,
    bottom: 8,
  },
  aiBadge: {
    position: "absolute",
    left: -10,
    top: -10,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.text,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  aiText: {
    color: COLORS.text,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 12,
    color: "rgba(15,23,42,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },
  headerRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#EDEDED",
    marginTop: 4,
  },
  backBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(PaywallScreen);
