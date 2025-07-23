import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export interface CloudIconProps {
  size?: number;
  color?: string;
  opacity?: number;
}

/**
 * Therapeutic cloud SVG icon representing peace, lightness, and mental clarity.
 * Designed with soft, fluffy curves for mental health journaling apps.
 */
export const CloudIcon: React.FC<CloudIconProps> = ({
  size = 24,
  color = "#E8F4FD",
  opacity = 0.8,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
      {/* Main cloud body */}
      <Path
        d="M6 14c-1.1 0-2-.9-2-2s.9-2 2-2c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2 .7-.6 1.6-1 2.5-1 2.2 0 4 1.8 4 4 0 .4-.1.8-.2 1.2.7.6 1.2 1.4 1.2 2.3 0 1.7-1.3 3-3 3H6z"
        fill={color}
        opacity={0.9}
      />
      
      {/* Additional cloud puffs for softness */}
      <Circle cx="8" cy="12" r="2.5" fill={color} opacity={0.6} />
      <Circle cx="12" cy="11" r="3" fill={color} opacity={0.7} />
      <Circle cx="16" cy="12" r="2.8" fill={color} opacity={0.6} />
      <Circle cx="10" cy="9" r="2" fill={color} opacity={0.5} />
      <Circle cx="14" cy="9" r="2.2" fill={color} opacity={0.5} />
      
      {/* Subtle highlight on top */}
      <Path
        d="M8 9c1.5-1 3-1.5 4.5-1.5s3 .5 4.5 1.5c-.5-.8-1.2-1.5-2-2-1-.5-2-.5-3 0s-2 1.2-2 2z"
        fill={color}
        opacity={0.4}
      />
    </Svg>
  );
};

export default CloudIcon;
