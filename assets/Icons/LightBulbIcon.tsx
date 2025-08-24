import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface LightBulbIconProps {
  size?: number;
  color?: string;
}

export function LightBulbIcon({ size = 24, color = "#000000" }: LightBulbIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1C8.13401 1 5 4.13401 5 8C5 10.5 6.5 12.5 8 13.5V16C8 17.1046 8.89543 18 10 18H14C15.1046 18 16 17.1046 16 16V13.5C17.5 12.5 19 10.5 19 8C19 4.13401 15.866 1 12 1Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 18V22C10 23.1046 10.8954 24 12 24C13.1046 24 14 23.1046 14 22V18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 15H15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
