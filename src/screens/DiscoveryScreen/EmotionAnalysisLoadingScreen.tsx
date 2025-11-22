import React, { useEffect } from "react";
import { Text, View, Dimensions } from "react-native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import useEmotionsAnalysis, {
  AnalysisCompletedType,
} from "@/hooks/useEmotionsAnalysis";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { selectedDateDiscoveryAtom } from "./helpers";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const PERIMETER = 2 * (width + height);

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface EmotionAnalysisLoadingScreenProps {
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
  recordingUri?: string;
  journalText?: string;
}

const BorderAnimation = () => {
  const LINE_LENGTH = PERIMETER * 0.5; // Increased length for better visibility
  const GAP_LENGTH = PERIMETER;
  const TOTAL_LENGTH = LINE_LENGTH + GAP_LENGTH;

  const strokeDashoffset = useSharedValue(TOTAL_LENGTH);

  useEffect(() => {
    strokeDashoffset.value = withRepeat(
      withTiming(0, {
        duration: 6000, // Adjusted duration for the longer path
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#7B61FF" />
            <Stop offset="50%" stopColor="#FFD24A" />
            <Stop offset="100%" stopColor="#7B61FF" />
          </LinearGradient>
        </Defs>
        <AnimatedRect
          x={4}
          y={4}
          width={width - 8}
          height={height - 8}
          rx={55}
          ry={55}
          stroke="url(#grad)"
          strokeWidth={6}
          strokeDasharray={`${LINE_LENGTH} ${GAP_LENGTH}`}
          strokeLinecap="round"
          fill="transparent"
          animatedProps={animatedProps}
        />
      </Svg>
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
    <View style={{ flex: 1 }}>
      <ExpoLinearGradient
        colors={["#f0f9ff", "#e0f2fe", "#bae6fd"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        <BorderAnimation />

        <Text
          style={{
            color: "#475569",
            fontSize: 15,
            fontWeight: "500",
            marginBottom: 32,
            textAlign: "center",
            letterSpacing: 0.3,
          }}
        >
          {dayjs(selectedDate).format("dddd, MMMM D, YYYY h:mm A")}
        </Text>

        <Text
          style={{
            color: "#1e293b",
            fontSize: 24,
            fontWeight: "600",
            textAlign: "center",
            letterSpacing: -0.3,
            lineHeight: 32,
          }}
        >
          {processingPhase}
        </Text>
      </View>
    </View>
  );
};

export default EmotionAnalysisLoadingScreen;
