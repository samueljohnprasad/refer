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

// Progress dots
const ProgressDots = () => {
  const dots = [0, 1, 2];
  
  return (
    <View style={{ flexDirection: "row", marginTop: 32, gap: 8 }}>
      {dots.map((index) => {
        const opacity = useSharedValue(0.3);
        
        useEffect(() => {
          opacity.value = withDelay(
            index * 300,
            withRepeat(
              withSequence(
                withTiming(1, { duration: 500 }),
                withTiming(0.3, { duration: 500 })
              ),
              -1,
              true
            )
          );
        }, []);
        
        const animatedStyle = useAnimatedStyle(() => ({
          opacity: opacity.value,
        }));
        
        return (
          <Animated.View
            key={index}
            style={[
              {
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#7B61FF",
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
    <View style={{ flex: 1, backgroundColor: "#FAFAFF" }}>
      {/* Subtle gradient background */}
      <ExpoLinearGradient
        colors={["#F8F7FF", "#F0EEFF", "#E8E4FF"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Floating orbs in background */}
      <FloatingOrb delay={0} size={150} color="rgba(123, 97, 255, 0.08)" initialX={-50} initialY={-100} />
      <FloatingOrb delay={500} size={100} color="rgba(167, 139, 250, 0.1)" initialX={width - 80} initialY={100} />
      <FloatingOrb delay={1000} size={80} color="rgba(196, 181, 253, 0.12)" initialX={20} initialY={200} />
      <FloatingOrb delay={1500} size={120} color="rgba(123, 97, 255, 0.06)" initialX={width - 100} initialY={-150} />

      {/* Main content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        {/* Sparkle emoji */}
        <Text style={{ fontSize: 48, marginBottom: 24 }}>✨</Text>

        {/* Date */}
        <Text
          style={{
            color: "#64748B",
            fontSize: 14,
            fontWeight: "500",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          {dayjs(selectedDate).format("MMMM D, YYYY")}
        </Text>

        {/* Processing phase text */}
        <Text
          style={{
            color: "#1E1B4B",
            fontSize: 22,
            fontWeight: "600",
            textAlign: "center",
            marginTop: 16,
            lineHeight: 30,
          }}
          className="font-cormorantBold"
        >
          {processingPhase}
        </Text>

        {/* Progress dots */}
        <ProgressDots />

        {/* Subtle hint text */}
        <Text
          style={{
            color: "#94A3B8",
            fontSize: 13,
            fontWeight: "400",
            textAlign: "center",
            marginTop: 24,
            lineHeight: 20,
            maxWidth: 280,
          }}
        >
          Analyzing your thoughts and emotions to provide personalized insights
        </Text>
      </View>
    </View>
  );
};

export default EmotionAnalysisLoadingScreen;
