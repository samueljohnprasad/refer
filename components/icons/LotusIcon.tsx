import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

export interface LotusIconProps {
  size?: number;
  color?: string;
  opacity?: number;
}

/**
 * Therapeutic lotus flower SVG icon representing peace, mindfulness, and spiritual growth.
 * Designed with soft, calming curves for mental health journaling apps.
 */
export const LotusIcon: React.FC<LotusIconProps> = ({
  size = 24,
  color = "#E8D5FF",
  opacity = 0.8,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" opacity={opacity}>
      {/* Center circle */}
      <Circle cx="12" cy="12" r="2" fill={color} opacity={0.9} />
      
      {/* Lotus petals - outer layer */}
      <Path
        d="M12 4c-1.5 2-3 4.5-3 7s1.5 5 3 7c1.5-2 3-4.5 3-7s-1.5-5-3-7z"
        fill={color}
        opacity={0.6}
      />
      <Path
        d="M4 12c2-1.5 4.5-3 7-3s5 1.5 7 3c-2 1.5-4.5 3-7 3s-5-1.5-7-3z"
        fill={color}
        opacity={0.6}
      />
      
      {/* Lotus petals - diagonal */}
      <Path
        d="M6.5 6.5c1 2.5 2.5 4.5 5.5 5.5-1-2.5-2.5-4.5-5.5-5.5z"
        fill={color}
        opacity={0.5}
      />
      <Path
        d="M17.5 6.5c-1 2.5-2.5 4.5-5.5 5.5 1-2.5 2.5-4.5 5.5-5.5z"
        fill={color}
        opacity={0.5}
      />
      <Path
        d="M6.5 17.5c1-2.5 2.5-4.5 5.5-5.5-1 2.5-2.5 4.5-5.5 5.5z"
        fill={color}
        opacity={0.5}
      />
      <Path
        d="M17.5 17.5c-1-2.5-2.5-4.5-5.5-5.5 1 2.5 2.5 4.5 5.5 5.5z"
        fill={color}
        opacity={0.5}
      />
      
      {/* Inner petals */}
      <Path
        d="M12 7c-1 1.5-2 3-2 5s1 3.5 2 5c1-1.5 2-3 2-5s-1-3.5-2-5z"
        fill={color}
        opacity={0.7}
      />
      <Path
        d="M7 12c1.5-1 3-2 5-2s3.5 1 5 2c-1.5 1-3 2-5 2s-3.5-1-5-2z"
        fill={color}
        opacity={0.7}
      />
    </Svg>
  );
};

export default LotusIcon;
