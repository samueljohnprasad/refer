import React from "react";
import { View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { getJourneyUnitIcon } from "@/src/data/journey/unitIconRegistry";

interface JourneyUnitIconProps {
  iconKey?: string | null;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function JourneyUnitIcon({
  iconKey,
  size = 22,
  color = "#FFFFFF",
  backgroundColor = "transparent",
}: JourneyUnitIconProps): React.JSX.Element {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: size,
        backgroundColor,
        width: size + 14,
        height: size + 14,
      }}
    >
      <HugeiconsIcon
        icon={getJourneyUnitIcon(iconKey)}
        size={size}
        color={color}
        strokeWidth={1.8}
      />
    </View>
  );
}

export default React.memo(JourneyUnitIcon);
