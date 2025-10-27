import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Dot } from "./dot";
import { Emotion } from "@/assets/emojis";

type DotsProps = {
  count: number;
  activeIndex: SharedValue<number>;
  dotSize: number;
};

export const Dots: React.FC<DotsProps> = React.memo(
  ({ count, activeIndex, dotSize }) => {
    const dotSpacing = 10;
    const externalSpacing = dotSpacing;
    const height = dotSize + 20;

    const rBarStyle = useAnimatedStyle(() => {
      // Calculate the width of the bar based on the active index
      const activeWidth =
        (activeIndex.value + 1) * dotSize +
        activeIndex.value * dotSpacing +
        externalSpacing;

      return {
        // Premium spring animation with custom config
        width: withSpring(activeWidth, {
          damping: 18,
          stiffness: 120,
          mass: 1,
        }),
        // Subtle opacity animation for smoothness
        opacity: withSpring(0.95, {
          damping: 20,
          stiffness: 100,
        }),
      };
    }, []);

    const emotionOrder = useMemo<Emotion[]>(
      () => [
        Emotion.Terrible,
        Emotion.Bad,
        Emotion.Fine,
        Emotion.Good,
        Emotion.Great,
      ],
      []
    );

    return (
      <View
        style={[
          {
            paddingHorizontal: externalSpacing / 2,
            gap: dotSpacing,
          },
          styles.container,
        ]}
      >
        <Animated.View
          style={[
            {
              height,
            },
            styles.bar,
            rBarStyle,
          ]}
        />
        {new Array(count).fill(null).map((_, index) => {
          return (
            <Dot
              key={index}
              emotionOrder={emotionOrder}
              index={index}
              activeIndex={activeIndex}
              dotSize={dotSize}
            />
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  bar: {
    position: "absolute",
    backgroundColor: "#8B5CF6",
    borderRadius: 100,
    borderCurve: "continuous",
    // Premium shadow for depth
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
