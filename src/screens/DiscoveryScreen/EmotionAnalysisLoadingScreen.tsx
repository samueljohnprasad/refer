"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Text, Animated, type ColorValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import useEmotionsAnalysis, { AnalysisCompletedType } from "@/hooks/useEmotionsAnalysis";

interface EmotionAnalysisLoadingScreenProps {
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
  recordingUri?: string | null;
  journalText?: string | null;
  selectedDate?: Date;
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
> = ({ onAnalysisCompleted, recordingUri, journalText, selectedDate }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const orbitAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const orbit2Anim = useRef(new Animated.Value(0)).current;
  const orbit3Anim = useRef(new Animated.Value(0)).current;

  const { processingPhase } = useEmotionsAnalysis({
    ...(recordingUri && { uri: recordingUri }),
    ...(journalText && { journalText }),
    onAnalysisCompleted,
  } as any);

  useEffect(() => {
    const fadeInAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const orbitAnimation = Animated.loop(
      Animated.timing(orbitAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );

    const orbit2Animation = Animated.loop(
      Animated.timing(orbit2Anim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      })
    );

    const orbit3Animation = Animated.loop(
      Animated.timing(orbit3Anim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      })
    );

    fadeInAnimation.start();
    pulseAnimation.start();
    orbitAnimation.start();
    orbit2Animation.start();
    orbit3Animation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      orbitAnimation.stop();
      orbit2Animation.stop();
      orbit3Animation.stop();
      rotateAnimation.stop();
    };
  }, [pulseAnim, fadeAnim, orbitAnim, orbit2Anim, orbit3Anim, rotateAnim]);

  const formatTimestamp = (): string => {
    const dateToUse = selectedDate || new Date();
    const month = dateToUse.toLocaleDateString("en-US", { month: "long" });
    const day = dateToUse.getDate();
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${month} ${day} • ${time}`;
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const orbitInterpolate = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const orbit2Interpolate = orbit2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-360deg"],
  });

  const orbit3Interpolate = orbit3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={
          gradientColors.blue as [ColorValue, ColorValue, ...ColorValue[]]
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
            color: "#475569",
            fontSize: 15,
            fontWeight: "500",
            marginBottom: 56,
            textAlign: "center",
            letterSpacing: 0.3,
          }}
        >
          {formatTimestamp()}
        </Text>

        <Text
          style={{
            color: "#1e293b",
            fontSize: 26,
            fontWeight: "600",
            marginBottom: 72,
            textAlign: "center",
            letterSpacing: -0.3,
            lineHeight: 32,
          }}
        >
          {processingPhase}
        </Text>

        <Animated.View
          style={{
            position: "relative",
            width: 120,
            height: 120,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              transform: [{ scale: pulseAnim }],
            }}
          />

          <Animated.View
            style={{
              position: "absolute",
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "#3b82f6",
              transform: [{ scale: pulseAnim }],
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          />

          <Animated.View
            style={{
              position: "absolute",
              width: 60,
              height: 60,
              transform: [{ rotate: orbitInterpolate }],
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#60a5fa",
                top: 0,
                left: 26,
                shadowColor: "#60a5fa",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              transform: [{ rotate: orbit2Interpolate }],
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#8b5cf6",
                top: 0,
                left: 37,
                shadowColor: "#8b5cf6",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 3,
                elevation: 2,
              }}
            />
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              width: 100,
              height: 100,
              transform: [{ rotate: orbit3Interpolate }],
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: "#10b981",
                top: 0,
                left: 47.5,
                shadowColor: "#10b981",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 1,
              }}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default EmotionAnalysisLoadingScreen;
