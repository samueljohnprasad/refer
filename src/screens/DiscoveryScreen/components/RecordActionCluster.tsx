import React, { useCallback } from "react";
import { View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import { SPRING_SNAPPY } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

type SymbolName = React.ComponentProps<typeof SymbolView>["name"];

interface SecondaryActionButtonProps {
  symbolName: SymbolName;
  onPress: () => void;
  accessibilityLabel: string;
}

// ponytail: normalized secondary circular button (52px) with subtle 0.97 press state and softened shadow
const SecondaryActionButton = React.memo<SecondaryActionButtonProps>(
  ({ symbolName, onPress, accessibilityLabel }) => {
    const reducedMotion = useReducedMotion();
    const pressScale = useSharedValue(1);
    const pressOpacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
      opacity: pressOpacity.value,
    }));

    const handlePressIn = useCallback((): void => {
      void Haptics.selectionAsync();
      if (!reducedMotion) {
        pressScale.value = withSpring(0.97, SPRING_SNAPPY);
        pressOpacity.value = withSpring(0.92, SPRING_SNAPPY);
      }
    }, [reducedMotion, pressScale, pressOpacity]);

    const handlePressOut = useCallback((): void => {
      if (!reducedMotion) {
        pressScale.value = withSpring(1, SPRING_SNAPPY);
        pressOpacity.value = withSpring(1, SPRING_SNAPPY);
      }
    }, [reducedMotion, pressScale, pressOpacity]);

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Animated.View
          style={animatedStyle}
          className="h-[52px] w-[52px] items-center justify-center rounded-full border border-ink/[0.06] bg-white shadow-xs shadow-ink/5"
        >
          <SymbolView
            name={symbolName}
            size={22}
            weight="medium"
            tintColor="#142414"
          />
        </Animated.View>
      </Pressable>
    );
  },
);

SecondaryActionButton.displayName = "SecondaryActionButton";

interface RecordActionClusterProps {
  onScanJournal: () => void;
  onOpenRecorder: () => void;
  onOpenKeyboard: () => void;
}

export const RecordActionCluster = React.memo<RecordActionClusterProps>(
  ({ onScanJournal, onOpenRecorder, onOpenKeyboard }) => {
    const reducedMotion = useReducedMotion();
    const micScale = useSharedValue(1);
    const micOpacity = useSharedValue(1);

    const micAnimStyle = useAnimatedStyle(() => ({
      transform: [{ scale: micScale.value }],
      opacity: micOpacity.value,
    }));

    const handleMicPressIn = useCallback((): void => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (!reducedMotion) {
        micScale.value = withSpring(0.97, SPRING_SNAPPY);
        micOpacity.value = withSpring(0.94, SPRING_SNAPPY);
      }
    }, [reducedMotion, micScale, micOpacity]);

    const handleMicPressOut = useCallback((): void => {
      if (!reducedMotion) {
        micScale.value = withSpring(1, SPRING_SNAPPY);
        micOpacity.value = withSpring(1, SPRING_SNAPPY);
      }
    }, [reducedMotion, micScale, micOpacity]);

    return (
      // ponytail: unified input cluster with 70px green surface mic and 52px secondary white buttons using Tailwind
      <View className="flex-row items-center justify-center gap-7 py-2">
        {/* Camera / Scan Secondary Button */}
        <SecondaryActionButton
          onPress={onScanJournal}
          accessibilityLabel="Scan or add image"
          symbolName="camera"
        />

        {/* Primary Mic Button (70px green circular surface with white mic, softened shadow) */}
        <Pressable
          onPress={onOpenRecorder}
          onPressIn={handleMicPressIn}
          onPressOut={handleMicPressOut}
          accessibilityRole="button"
          accessibilityLabel="Record voice"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Animated.View
            style={micAnimStyle}
            className="h-[70px] w-[70px] items-center justify-center rounded-full bg-sage-500 shadow-sm shadow-sage-700/15"
          >
            <SymbolView
              name="mic.fill"
              size={32}
              weight="medium"
              tintColor="#ffffff"
            />
          </Animated.View>
        </Pressable>

        {/* Text Compose Secondary Button */}
        <SecondaryActionButton
          onPress={onOpenKeyboard}
          accessibilityLabel="Write text"
          symbolName="square.and.pencil"
        />
      </View>
    );
  },
);

RecordActionCluster.displayName = "RecordActionCluster";
