import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface CloudIconProps {
  size?: number;
  color?: string;
}

export function CloudIcon({ size = 24, color = "#000000" }: CloudIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.92896 19C3.78929 19 2 17.2107 2 15.0711C2 13.2109 3.35149 11.5912 5.21111 11.1997C5.07632 10.713 5 10.1999 5 9.67039C5 6.53969 7.53969 4 10.6704 4C13.4387 4 15.7338 5.94342 16.2001 8.53469C16.4443 8.50581 16.6941 8.49094 16.9479 8.49094C19.7365 8.49094 22 10.7544 22 13.543C22 16.2131 19.9453 18.4089 17.3328 18.5785M7.5 21L12 17M12 17L16.5 21M12 17V12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
