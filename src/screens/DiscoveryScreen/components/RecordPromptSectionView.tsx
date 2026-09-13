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
      <View className="pt-0">
        <View className="-ml-1 flex-row items-center">
          <ConfigurableGlassMenu config={menuConfig} />
        </View>

        {/* ponytail: 30px display token with 36px leading gives breathing room while keeping 3-line hero dominance */}
        <Animated.Text
          style={promptAnimStyle}
          className="mt-1 text-[30px] leading-[36px] tracking-tight text-ink happy-font-heading-bold"
        >
          {displayedPrompt}
        </Animated.Text>
      </View>
    );
  });

RecordPromptSectionView.displayName = "RecordPromptSectionView";
export default RecordPromptSectionView;
