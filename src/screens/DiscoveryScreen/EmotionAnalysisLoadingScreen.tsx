import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { GrainyGradient } from "@/src/components/grainy-gradient";
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
} from "react-native-reanimated";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { Feather } from "@expo/vector-icons";

interface EmotionAnalysisLoadingScreenProps {
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
  recordingUri?: string;
  journalText?: string;
  onCancel?: () => void;
}

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
                withTiming(0.3, { duration: 600 }),
              ),
              -1,
              true,
            ),
          );
          scale.value = withDelay(
            index * 250,
            withRepeat(
              withSequence(
                withTiming(1.3, { duration: 600 }),
                withTiming(1, { duration: 600 }),
              ),
              -1,
              true,
            ),
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
                backgroundColor: "#FFFFFF",
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
> = ({ onAnalysisCompleted, recordingUri, journalText, onCancel }) => {
  const selectedDate = useAtomValue(selectedDateDiscoveryAtom);

  const { processingPhase } = useEmotionsAnalysis({
    uri: recordingUri,
    journalText,
    onAnalysisCompleted,
    onAnalysisError: () => {
      onCancel?.();
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: SEMANTIC_COLORS.surface.primary }}>
      {/* Vibrant Grainy Gradient Background */}
      <GrainyGradient
        colors={["#E11D48", "#7C3AED", "#4F46E5", "#F97316", "#EC4899"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Cancel Button */}
      <SafeAreaView
        edges={["top"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 24,
          }}
        >
          {onCancel && (
            <TouchableOpacity
              onPress={onCancel}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
              accessibilityLabel="Cancel analysis"
            >
              <Feather name="x" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* Main content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        {/* Date */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.semiBold,
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {dayjs(selectedDate).format("MMMM D, YYYY")}
        </Text>

        {/* Processing phase text */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.extraBold,
            color: "#FFFFFF",
            fontSize: 32,
            textAlign: "center",
            marginTop: 18,
            lineHeight: 40,
          }}
        >
          {processingPhase}
        </Text>

        {/* Progress dots */}
        <ProgressDots />

        {/* Subtle hint text */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.semiBold,
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: 15,
            textAlign: "center",
            marginTop: 28,
            lineHeight: 22,
            maxWidth: 300,
          }}
        >
          Taking a moment to reflect on your entry...
        </Text>
      </View>
    </View>
  );
};

export default EmotionAnalysisLoadingScreen;
