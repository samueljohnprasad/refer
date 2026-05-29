import React, { useEffect } from "react";
import { Text, View, Dimensions } from "react-native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import useEmotionsAnalysis, {
  AnalysisCompletedType,
} from "@/hooks/useEmotionsAnalysis";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { selectedDateDiscoveryAtom } from "./helpers";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import {
  BRAND_SURFACE,
  INK,
  INK_SOFT,
  SAGE,
  SAGE_LOADING_GRADIENT,
  SAGE_OVERLAY,
} from "@/lib/tokens";

const { width } = Dimensions.get("window");

interface EmotionAnalysisLoadingScreenProps {
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
  recordingUri?: string;
  journalText?: string;
}

// Floating orb component
const FloatingOrb: React.FC<{
  delay: number;
  size: number;
  color: string;
  initialX: number;
  initialY: number;
}> = ({ delay, size, color, initialX, initialY }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.6, { duration: 800 }));
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(20, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value + initialX },
      { translateY: translateY.value + initialY },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

// Animated Sparkles component
const AnimatedSparkles = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` }
    ]
  }));

  return (
    <Animated.View style={[animatedStyle, { marginBottom: 28 }]}>
      <Text style={{ fontSize: 52 }}>✨</Text>
    </Animated.View>
  );
};

// Progress dots with pulse & scale animations
const ProgressDots = () => {
  const dots = [0, 1, 2];
  
  return (
    <View style={{ flexDirection: "row", marginTop: 32, gap: 10 }}>
      {dots.map((index) => {
        const opacity = useSharedValue(0.3);
        const scale = useSharedValue(1);
        
        useEffect(() => {
          opacity.value = withDelay(
            index * 250,
            withRepeat(
              withSequence(
                withTiming(1, { duration: 600 }),
                withTiming(0.3, { duration: 600 })
              ),
              -1,
              true
            )
          );
          scale.value = withDelay(
            index * 250,
            withRepeat(
              withSequence(
                withTiming(1.3, { duration: 600 }),
                withTiming(1, { duration: 600 })
              ),
              -1,
              true
            )
          );
        }, []);
        
        const animatedStyle = useAnimatedStyle(() => ({
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        }));
        
        return (
          <Animated.View
            key={index}
            style={[
              {
                width: 9,
                height: 9,
                borderRadius: 4.5,
                backgroundColor: SAGE[500],
              },
              animatedStyle,
            ]}
          />
        );
      })}
    </View>
  );
};

const EmotionAnalysisLoadingScreen: React.FC<
  EmotionAnalysisLoadingScreenProps
> = ({ onAnalysisCompleted, recordingUri, journalText }) => {
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);

  const { processingPhase } = useEmotionsAnalysis({
    uri: recordingUri,
    journalText,
    onAnalysisCompleted,
  });

  return (
    <View style={{ flex: 1, backgroundColor: BRAND_SURFACE }}>
      {/* Subtle gradient background */}
      <ExpoLinearGradient
        colors={SAGE_LOADING_GRADIENT}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Floating orbs in background */}
      <FloatingOrb
        delay={0}
        size={150}
        color={SAGE_OVERLAY.faint}
        initialX={-50}
        initialY={-100}
      />
      <FloatingOrb
        delay={500}
        size={100}
        color={SAGE_OVERLAY.soft}
        initialX={width - 80}
        initialY={100}
      />
      <FloatingOrb
        delay={1000}
        size={80}
        color={SAGE_OVERLAY.mist}
        initialX={20}
        initialY={200}
      />
      <FloatingOrb
        delay={1500}
        size={120}
        color={SAGE_OVERLAY.whisper}
        initialX={width - 100}
        initialY={-150}
      />

      {/* Main content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        {/* Animated Sparkles */}
        <AnimatedSparkles />

        {/* Date */}
        <Text
          style={{
            fontFamily: "GeistBold",
            color: SAGE[400],
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            textAlign: "center",
          }}
        >
          {dayjs(selectedDate).format("MMMM D, YYYY")}
        </Text>

        {/* Processing phase text */}
        <Text
          style={{
            fontFamily: "FrauncesBold",
            color: INK,
            fontSize: 28,
            textAlign: "center",
            marginTop: 18,
            lineHeight: 36,
          }}
        >
          {processingPhase}
        </Text>

        {/* Progress dots */}
        <ProgressDots />

        {/* Subtle hint text */}
        <Text
          style={{
            fontFamily: "GeistMedium",
            color: INK_SOFT,
            fontSize: 15,
            textAlign: "center",
            marginTop: 28,
            lineHeight: 22,
            maxWidth: 300,
          }}
        >
          Analyzing your thoughts and emotions to provide personalized insights
        </Text>
      </View>
    </View>
  );
};

export default EmotionAnalysisLoadingScreen;
