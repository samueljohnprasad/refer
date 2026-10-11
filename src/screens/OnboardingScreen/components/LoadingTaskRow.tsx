import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useEffect } from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { SAGE } from "@/src/theme/palette";

interface LoadingTaskRowProps {
  label: string;
  completed: boolean;
  inProgress: boolean;
  index: number;
  isLast?: boolean;
}

// ponytail: reuse shared Card with sage palette and responsive states
const LoadingTaskRow: React.FC<LoadingTaskRowProps> = ({
  label,
  completed,
  inProgress,
  index,
  isLast = false,
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

  return (
    <Animated.View
      entering={FadeIn.delay(80 + index * 50).duration(180)}
      style={[
        rowStyle,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: SAGE[100] },
      ]}
      className="min-h-[64px] flex-row items-center gap-3 py-3"
    >
      <View className="h-6 w-6 items-center justify-center">
        {completed ? (
          <Animated.View
            entering={FadeIn.duration(160)}
            style={{ backgroundColor: SAGE[500] }}
            className="h-6 w-6 items-center justify-center rounded-full"
          >
            <SymbolView name={"checkmark" as any} size={12} tintColor="#FFFFFF" weight="bold" />
          </Animated.View>
        ) : inProgress ? (
          <ActivityIndicator size="small" color={SAGE[600]} />
        ) : (
          <View className="h-5 w-5 rounded-full border-2 border-sage-200" />
        )}
      </View>
      <Text
        style={{
          fontFamily: completed
            ? APP_FONT_FAMILIES.bold
            : inProgress
              ? APP_FONT_FAMILIES.extraBold
              : APP_FONT_FAMILIES.semiBold,
          fontSize: 15,
          lineHeight: 20,
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
    </Animated.View>
  );
};

export default React.memo(LoadingTaskRow);
