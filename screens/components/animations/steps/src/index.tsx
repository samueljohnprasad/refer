import { AntDesign } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  Keyframe,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Dots } from "./steps/dots";
import { SplitButton } from "./steps/split-button";
import {
  MOOD_COLORS_ARR,
  MOOD_PALE_COLORS_ARR,
  MOOD_PALE_COLORS_ARR_200,
} from "@/constants/moodColors";
import { Text } from "@/components/Themed";

const ScaleOpacityKeyframe = {
  from: {
    opacity: 0,
    transform: [{ scale: 0 }],
  },
  to: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
};

// Instead of using Entering and Exiting Layout Animations, we can use Keyframes!
// I created a detailed tutorial about it at https://www.reanimate.dev
const ScaleIconEnteringKeyframe = new Keyframe(ScaleOpacityKeyframe).duration(
  250
);

const ScaleIconExitingKeyframe = new Keyframe({
  from: ScaleOpacityKeyframe.to,
  to: ScaleOpacityKeyframe.from,
}).duration(200);

const App = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const activeIndex = useSharedValue(0);
  const backgroundProgress = useSharedValue(0);

  const [splitted, setSplitted] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);

  const rightLabel = isLastStep ? "Finish" : "Continue";

  const increaseActiveIndex = useCallback(() => {
    activeIndex.value = (activeIndex.value + 1) % 5;
    setCurrentStep((prev) => (prev + 1) % 5);
  }, [activeIndex]);

  useAnimatedReaction(
    () => activeIndex.value,
    (index) => {
      runOnJS(setIsLastStep)(index === 4);
    }
  );

  useEffect(() => {
    backgroundProgress.value = withTiming(activeIndex.value, { duration: 300 });
  }, [activeIndex.value]);

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        backgroundProgress.value,
        [0, 1, 2, 3, 4],
        MOOD_PALE_COLORS_ARR_200
      ),
    };
  });

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]}>
      <Dots activeIndex={activeIndex} count={5} dotSize={24} />
      <View style={{ marginTop: 48 }}>
        {/*
         * I explained in detail in one of my tutorials how to recreate (almost) this exact component:
         * Split Button: https://youtu.be/GxkzFYI6eqI
         * Side note: the code can be cleaner 😅
         */}
        <SplitButton
          splitted={splitted}
          mainAction={{
            label: "Continue",
            labelColor: "white",
            onPress: () => {
              increaseActiveIndex();
              setSplitted(true);
            },
            backgroundColor: "#0c86f7",
          }}
          leftAction={{
            label: "Back",
            labelColor: "black",
            onPress: () => {
              if (activeIndex.value === 1) {
                setSplitted(false);
              }
              activeIndex.value = Math.max(0, activeIndex.value - 1);
              setCurrentStep((prev) => (prev - 1) % 5);
            },
            backgroundColor: "rgba(0,0,0,0.08)",
          }}
          rightAction={{
            label: rightLabel,
            labelColor: "white",
            icon: (
              <Animated.View
                entering={ScaleIconEnteringKeyframe}
                exiting={ScaleIconExitingKeyframe}
                style={styles.icon}
              >
                <AntDesign name="check-circle" size={18} color="white" />
              </Animated.View>
            ),
            iconVisible: isLastStep,
            onPress: () => {
              if (activeIndex.value === 4) {
                setSplitted(false);
              }
              increaseActiveIndex();
              setCurrentStep((prev) => (prev + 1) % 5);
            },
            backgroundColor: "#0c86f7",
          }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 64,
  },
  icon: {
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 18,
    height: 18,
    marginBottom: -1.5,
  },
});

export { App };
