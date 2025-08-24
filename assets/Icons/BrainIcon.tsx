import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface BrainIconProps {
  size?: number;
  color?: string;
}

export function BrainIcon({ size = 24, color = "#000000" }: BrainIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 12C17.985 12 20 9.985 20 7.5C20 5.015 17.985 3 15.5 3C15.367 3 15.235 3.005 15.105 3.015C15.035 3.02 14.965 3.03 14.895 3.04C14.5 1.84 13.33 1 12 1C10.67 1 9.5 1.84 9.105 3.04C9.035 3.03 8.965 3.02 8.895 3.015C8.765 3.005 8.633 3 8.5 3C6.015 3 4 5.015 4 7.5C4 9.985 6.015 12 8.5 12H15.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 10V18C17 19.105 16.105 20 15 20H9C7.895 20 7 19.105 7 18V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 12V16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 14H14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
