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
export const RecordPromptSectionView: React.FC<RecordPromptSectionViewProps> = React.memo(
  ({ menuConfig, displayedPrompt, promptAnimStyle }) => {
    return (
      <View className="pt-2">
        <View className="flex-row items-center -ml-2 mb-2.5">
          <ConfigurableGlassMenu config={menuConfig} />
        </View>

        {/* ponytail: tightened prompt typography (34px / 37px) so question reads as one cohesive thought */}
        <Animated.Text
          style={promptAnimStyle}
          className="text-ink text-[34px] leading-[37px] tracking-tight happy-font-heading-bold"
        >
          {displayedPrompt}
        </Animated.Text>
      </View>
    );
  }
);

RecordPromptSectionView.displayName = "RecordPromptSectionView";
export default RecordPromptSectionView;
