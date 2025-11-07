import type React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import useEmotionsAnalysis, {
  AnalysisCompletedType,
} from "@/hooks/useEmotionsAnalysis";
import { View } from "@/components/Themed";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { selectedDateDiscoveryAtom } from "./helpers";

interface EmotionAnalysisLoadingScreenProps {
  onAnalysisCompleted: (data: AnalysisCompletedType) => void;
  recordingUri?: string;
  journalText?: string;
}

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
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
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
          {dayjs(selectedDate).format("dddd, MMMM D, YYYY h:mm A")}
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
      </View>
    </SafeAreaView>
  );
};

export default EmotionAnalysisLoadingScreen;
