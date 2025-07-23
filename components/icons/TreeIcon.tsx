import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export interface TreeIconProps {
  size?: number;
  trunkColor?: string;
  foliageColor?: string;
  opacity?: number;
}

/**
 * Therapeutic tree SVG icon representing growth, grounding, and natural calm.
 * Designed with soft, organic shapes for mental health journaling apps.
 */
export const TreeIcon: React.FC<TreeIconProps> = ({
  size = 24,
  trunkColor = "#D4B899",
  foliageColor = "#A8E6A3",
  opacity = 0.8,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
      {/* Tree trunk */}
      <Path
        d="M10.5 16c0 1 0.5 3 1.5 4 1-1 1.5-3 1.5-4V10h-3v6z"
        fill={trunkColor}
        opacity={0.9}
      />
      
      {/* Main foliage - large cloud shape */}
      <Circle cx="12" cy="9" r="5" fill={foliageColor} opacity={0.7} />
      
      {/* Additional foliage layers for depth */}
      <Circle cx="10" cy="8" r="3.5" fill={foliageColor} opacity={0.6} />
      <Circle cx="14" cy="8" r="3.5" fill={foliageColor} opacity={0.6} />
      <Circle cx="12" cy="6" r="3" fill={foliageColor} opacity={0.8} />
      
      {/* Small accent leaves */}
      <Circle cx="8" cy="10" r="1.5" fill={foliageColor} opacity={0.5} />
      <Circle cx="16" cy="10" r="1.5" fill={foliageColor} opacity={0.5} />
      <Circle cx="11" cy="5" r="1" fill={foliageColor} opacity={0.6} />
      <Circle cx="13" cy="5" r="1" fill={foliageColor} opacity={0.6} />
      
      {/* Ground line */}
      <Path
        d="M6 20c2-0.5 4-0.5 6 0 2-0.5 4-0.5 6 0"
        stroke={trunkColor}
        strokeWidth="1"
        fill="none"
        opacity={0.4}
      />
    </Svg>
  );
};

export default TreeIcon;
