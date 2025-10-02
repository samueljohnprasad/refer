import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Dot } from "./dot";
import { Emotion } from "@/assets/emojis";
import { Text } from "@/components/Themed";

type DotsProps = {
  count: number;
  activeIndex: SharedValue<number>;
  dotSize: number;
};

export const Dots: React.FC<DotsProps> = React.memo(
  ({ count, activeIndex, dotSize }) => {
    const dotSpacing = 15;
    const externalSpacing = dotSpacing;
    const height = dotSize + 20;

    const rBarStyle = useAnimatedStyle(() => {
      // Here we calculate the width of the bar based on the active index
      // The maxWidth = (count) * dotSize + (count - 1) * dotSpacing + externalSpacing
      // So by knowing the maxWidth, we can easily replace the count with (activeIndex + 1)
      // and get the general formula for the activeWidth
      const activeWidth =
        (activeIndex.value + 1) * dotSize +
        activeIndex.value * dotSpacing +
        externalSpacing;

      return {
        // Spring animations, spring animations everywhere!
        width: withSpring(activeWidth),
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
  },
});
