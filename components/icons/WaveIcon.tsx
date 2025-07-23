import React from "react";
import Svg, { Path } from "react-native-svg";

export interface WaveIconProps {
  size?: number;
  color?: string;
  opacity?: number;
}

/**
 * Therapeutic wave SVG icon representing flow, calm water, and emotional balance.
 * Designed with gentle, flowing curves for mental health journaling apps.
 */
export const WaveIcon: React.FC<WaveIconProps> = ({
  size = 24,
  color = "#B8E6E1",
  opacity = 0.8,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
      {/* Main wave - flowing curve */}
      <Path
        d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 2 2 2 4v6H2V12z"
        fill={color}
        opacity={0.7}
      />
      
      {/* Secondary wave layer */}
      <Path
        d="M2 14c2-1.5 3.5-1.5 5.5 0s3.5 1.5 5.5 0 3.5-1.5 5.5 0 3.5 1.5 5.5 0v8H2v-8z"
        fill={color}
        opacity={0.5}
      />
      
      {/* Top gentle wave */}
      <Path
        d="M2 10c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0 1.5-1 3 0"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity={0.9}
      />
      
      {/* Middle accent wave */}
      <Path
        d="M2 8c2-0.8 3.5-0.8 5 0s3 0.8 5 0 3-0.8 5 0 2 0.8 2 0.8"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity={0.6}
      />
      
      {/* Subtle foam/bubble details */}
      <Path
        d="M6 11c0.5-0.5 1-0.5 1.5 0M10 9c0.5-0.5 1-0.5 1.5 0M14 11c0.5-0.5 1-0.5 1.5 0M18 9c0.5-0.5 1-0.5 1.5 0"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity={0.4}
      />
    </Svg>
  );
};

export default WaveIcon;
