import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import {
  ConfigurableGlassMenu,
  type GlassMenuConfig,
} from "@/src/components/ui/ConfigurableGlassMenu";

type AnimatedTextStyle = React.ComponentProps<typeof Animated.Text>["style"];

export interface RecordPromptSectionViewProps {
  menuConfig: GlassMenuConfig;
  displayedPrompt: string;
  promptAnimStyle: AnimatedTextStyle;
}

// ponytail: pure presentational prompt section with 100% Tailwind CSS classes
export const RecordPromptSectionView: React.FC<RecordPromptSectionViewProps> =
  React.memo(({ menuConfig, displayedPrompt, promptAnimStyle }) => {
    return (
      <View className="pt-2">
        <View className="-ml-2 flex-row items-center">
          <ConfigurableGlassMenu config={menuConfig} />
        </View>

        {/* ponytail: 34px prompt keeps hero weight while 36px leading holds the thought together */}
        <Animated.Text
          style={promptAnimStyle}
          className="text-[34px] leading-9 tracking-tight text-ink happy-font-heading-bold"
        >
          {displayedPrompt}
        </Animated.Text>
      </View>
    );
  });

RecordPromptSectionView.displayName = "RecordPromptSectionView";
export default RecordPromptSectionView;
