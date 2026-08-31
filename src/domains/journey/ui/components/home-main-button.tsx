import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { JourneyUnitIcon } from "./JourneyUnitIcon";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import {
  useHomeMainButtonViewModel,
  type HomeMainButtonProps,
} from "../hooks/useHomeMainButtonViewModel";

export interface HomeMainButtonViewProps
  extends ReturnType<typeof useHomeMainButtonViewModel>,
    HomeMainButtonProps {}

/**
 * Presentational View component for HomeMainButton.
 * Strictly contains JSX code without internal hooks.
 */
export const HomeMainButtonView = React.memo(function HomeMainButtonView({
  faceStyle,
  rimStyle,
  handlePress,
  unitLabel,
  unitTitle,
  unitIconKey,
}: HomeMainButtonViewProps): React.JSX.Element {
  return (
    <View className="px-5 w-full max-w-[420px] self-center my-2">
      <Card
        onPress={handlePress}
        faceStyle={faceStyle}
        rimStyle={rimStyle}
        variant="solid"
        radius="lg"
        className="w-full"
        contentClassName="flex-row items-center justify-between px-5 py-4"
      >
        <View className="flex-1 mr-4">
          <Text variant="eyebrow" className="mb-1" style={{ color: SEMANTIC_COLORS.text.primary }}>
            {unitLabel}
          </Text>
          <Text variant="h3" style={{ color: SEMANTIC_COLORS.text.primary }} numberOfLines={2}>
            {unitTitle}
          </Text>
        </View>
        <View
          className="w-12 h-12 items-center justify-center rounded-full mr-2"
          style={{ backgroundColor: "rgba(20, 36, 20, 0.10)" }}
        >
          <JourneyUnitIcon iconKey={unitIconKey} size={24} color={SEMANTIC_COLORS.text.primary} />
        </View>
      </Card>
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
