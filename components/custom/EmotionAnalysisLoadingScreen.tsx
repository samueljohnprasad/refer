"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Text, Animated, ColorValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProcessingPhase } from "./helpers";
import { LinearGradient } from "expo-linear-gradient";

interface EmotionAnalysisLoadingScreenProps {
  timestamp?: string;
  currentPhase?: ProcessingPhase;
}

export const gradientColors = {
  blue: ["#f0f9ff", "#e0f2fe", "#bae6fd"],
  orange: ["#fff7ed", "#fed7aa", "#fdba74"],
  violet: ["#faf5ff", "#e9d5ff", "#c4b5fd"],
  green: ["#f0fdf4", "#dcfce7", "#bbf7d0"],
  pink: ["#fdf2f8", "#fce7f3", "#fbcfe8"],
};

const EmotionAnalysisLoadingScreen: React.FC<
  EmotionAnalysisLoadingScreenProps
> = ({ timestamp, currentPhase = ProcessingPhase.TRANSCRIBING }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeInAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    fadeInAnimation.start();
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulseAnim, fadeAnim]);

  const formatTimestamp = (): string => {
    if (timestamp) return timestamp;

    const now = new Date();
    const month = now.toLocaleDateString("en-US", { month: "long" });
    const day = now.getDate();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${month} ${day} • ${time}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={
          gradientColors.pink as [ColorValue, ColorValue, ...ColorValue[]]
        }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <Animated.View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
          opacity: fadeAnim,
        }}
      >
        <Text
          style={{
            color: "#64748b",
            fontSize: 16,
            fontWeight: "500",
            marginBottom: 48,
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {formatTimestamp()}
        </Text>

        <Text
          style={{
            color: "#0f172a",
            fontSize: 28,
            fontWeight: "600",
            marginBottom: 64,
            textAlign: "center",
            letterSpacing: -0.5,
            lineHeight: 36,
          }}
        >
          {currentPhase}
        </Text>

        <Animated.View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#3b82f6",
            transform: [{ scale: pulseAnim }],
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        />

        <Text
          style={{
            color: "#64748b",
            fontSize: 14,
            fontWeight: "400",
            marginTop: 48,
            textAlign: "center",
            letterSpacing: 0.3,
            lineHeight: 20,
          }}
        >
          Analyzing your emotional patterns...
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default EmotionAnalysisLoadingScreen;
