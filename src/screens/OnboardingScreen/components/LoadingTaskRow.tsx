import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect } from "react";
import { Text, View, ActivityIndicator, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { Card } from "@/src/components/ui/Card";
import { SAGE } from "@/src/theme/palette";

interface LoadingTaskRowProps {
  label: string;
  completed: boolean;
  inProgress: boolean;
  index: number;
}

// ponytail: reuse shared Card with sage palette and responsive states
const LoadingTaskRow: React.FC<LoadingTaskRowProps> = ({
  label,
  completed,
  inProgress,
  index,
}) => {
  const rowOpacity = useSharedValue(0.55);

  useEffect(() => {
    if (completed) {
      Haptics.selectionAsync();
    }
  }, [completed]);

  useEffect(() => {
    rowOpacity.value = withTiming(completed || inProgress ? 1 : 0.55, {
      duration: 180,
    });
  }, [completed, inProgress]);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: rowOpacity.value,
  }));

  const faceStyle = inProgress
    ? { backgroundColor: SAGE[50], borderColor: SAGE[300] }
    : completed
      ? { backgroundColor: "#FFFFFF", borderColor: SAGE[200] }
      : { backgroundColor: "#FAFAFA", borderColor: "#E5E5E5" };

  const rimStyle = inProgress
    ? { backgroundColor: SAGE[200] }
    : completed
      ? { backgroundColor: SAGE[100] }
      : { backgroundColor: "#E5E5E5" };

  return (
    <Animated.View
      entering={FadeIn.delay(80 + index * 50).duration(180)}
      style={rowStyle}
    >
      <Card
        variant="tile"
        radius="lg"
        showDepth={true}
        faceStyle={faceStyle}
        rimStyle={rimStyle}
        contentClassName="flex-row items-center gap-3 p-3.5"
      >
        <View className="w-5 h-5 items-center justify-center">
          {completed ? (
            <Animated.View
              entering={FadeIn.duration(160)}
              style={{ backgroundColor: SAGE[500] }}
              className="w-5 h-5 rounded-full items-center justify-center"
            >
              {Platform.OS === "ios" ? (
                <SymbolView
                  name={"checkmark" as any}
                  size={11}
                  tintColor="#FFFFFF"
                  weight="bold"
                />
              ) : (
                <Feather name="check" size={11} color="#FFFFFF" />
              )}
            </Animated.View>
          ) : inProgress ? (
            <ActivityIndicator size="small" color={SAGE[500]} />
          ) : (
            <View className="w-5 h-5 rounded-full border-2 border-zinc-300" />
          )}
        </View>
        <Text
          style={{
            fontFamily: completed
              ? APP_FONT_FAMILIES.bold
              : inProgress
                ? APP_FONT_FAMILIES.extraBold
                : APP_FONT_FAMILIES.semiBold,
            fontSize: 14,
            lineHeight: 18,
            color: completed
              ? SAGE[600]
              : inProgress
                ? SAGE[800]
                : "#71717A",
            flex: 1,
          }}
        >
          {label}
        </Text>
      </Card>
    </Animated.View>
  );
};

export default React.memo(LoadingTaskRow);
