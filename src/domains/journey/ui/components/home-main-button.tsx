import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import Animated from "react-native-reanimated";
import { JourneyUnitIcon } from "./JourneyUnitIcon";
import {
  useHomeMainButtonViewModel,
  type HomeMainButtonProps,
} from "../hooks/useHomeMainButtonViewModel";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface HomeMainButtonViewProps
  extends ReturnType<typeof useHomeMainButtonViewModel>,
    HomeMainButtonProps {}

/**
 * Presentational View component for HomeMainButton.
 * Strictly contains JSX code without internal hooks.
 */
export const HomeMainButtonView = React.memo(function HomeMainButtonView({
  animatedStyle,
  handlePressIn,
  handlePressOut,
  handlePress,
  unitLabel,
  unitTitle,
  unitIconKey,
}: HomeMainButtonViewProps): React.JSX.Element {
  return (
    <View className="px-5 w-full max-w-[420px] self-center my-2">
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[
          {
            borderRadius: 20,
            borderBottomWidth: 3,
          },
          animatedStyle,
        ]}
        className="flex-row items-center justify-between px-5 py-4"
      >
        <View className="flex-1 mr-4">
          <Text variant="eyebrow" className="mb-1 opacity-90 !text-white">
            {unitLabel}
          </Text>
          <Text variant="h3" className="!text-white" numberOfLines={2}>
            {unitTitle}
          </Text>
        </View>
        <View
          className="w-12 h-12 items-center justify-center rounded-full mr-2"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        >
          <JourneyUnitIcon iconKey={unitIconKey} size={24} color="#FFFFFF" />
        </View>
      </AnimatedPressable>
    </View>
  );
});

/**
 * Container component for HomeMainButton.
 */
export const HomeMainButton = (props: HomeMainButtonProps) => {
  const viewModel = useHomeMainButtonViewModel(props);
  return <HomeMainButtonView {...viewModel} {...props} />;
};

export type { HomeMainButtonProps };
