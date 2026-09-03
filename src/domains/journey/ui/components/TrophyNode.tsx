import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import AnimatedNodeButton from "./AnimatedNodeButton";
import { darkenHex } from "@/src/utils/colorUtils";
import { NODE_SIZE } from "@/src/data/journey/constants";
import type { NodePosition, PathNodeData } from "@/src/types/journey/node";

export interface TrophyNodeProps {
  node: PathNodeData;
  position: NodePosition;
  onPress: (node: PathNodeData, e?: any, color?: string) => void;
}

const TROPHY_BODY_COLOR = "#FEF3C7"; // Amber 100
const TROPHY_SHADOW_COLOR = darkenHex(TROPHY_BODY_COLOR, 0.25);

export const TrophyNodeView = React.memo(function TrophyNodeView({
  node,
  position,
  onPress,
}: TrophyNodeProps): React.JSX.Element {
  const size = NODE_SIZE.chest;
  const halfSize = size / 2;

  const handlePress = (e?: any) => {
    onPress(node, e, TROPHY_BODY_COLOR);
  };

  return (
    <View
      className="absolute items-center justify-center"
      style={{
        left: position.x - halfSize,
        top: position.y - halfSize,
        width: size,
        height: size,
      }}
    >
      <AnimatedNodeButton
        size={size}
        backgroundColor={TROPHY_BODY_COLOR}
        shadowColor={TROPHY_SHADOW_COLOR}
        onPress={handlePress}
        disabled={false}
        hapticStyle="medium"
        shadowDepth={6}
        borderRadius={20}
        accessibilityLabel={`Unit Trophy`}
      >
        <Text className="text-3xl">🏆</Text>
      </AnimatedNodeButton>
    </View>
  );
});

function TrophyNode(props: TrophyNodeProps): React.JSX.Element {
  return <TrophyNodeView {...props} />;
}

export default React.memo(TrophyNode);
