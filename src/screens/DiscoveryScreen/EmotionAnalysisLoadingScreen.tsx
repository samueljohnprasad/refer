import React, { useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
} from "react-native-reanimated";
import {
  BRAND_SURFACE,
  INK,
  INK_SOFT,
  SAGE,
  SAGE_LOADING_GRADIENT,
} from "@/lib/tokens";
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
> = ({ onAnalysisCompleted, recordingUri, journalText, onCancel }) => {
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

      {/* Cancel Button */}
      <SafeAreaView edges={["top"]} style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 24 }}>
          {onCancel && (
            <TouchableOpacity 
              onPress={onCancel}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              accessibilityLabel="Cancel analysis"
            >
              <Feather name="x" size={20} color={INK_SOFT} />
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
            fontFamily: "GeistMedium",
            color: SAGE[600],
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {dayjs(selectedDate).format("MMMM D, YYYY")}
        </Text>

        {/* Processing phase text */}
        <Text
          style={{
            fontFamily: "CormorantBold",
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
          Taking a moment to reflect on your entry...
        </Text>
      </View>
    </View>
  );
};

export default EmotionAnalysisLoadingScreen;
