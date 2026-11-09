import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONTS } from "./config";

interface StampProps {
  text: string;
  x: number;
  y: number;
  startFrame: number;
}

const STAMP_FRAMES = 6; // 0.2s @ 30fps

export const Stamp: React.FC<StampProps> = ({ text, x, y, startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0) return null;

  const scale = interpolate(local, [0, STAMP_FRAMES], [1.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const rotate = interpolate(local, [0, STAMP_FRAMES], [-18, -6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        border: `5px solid ${COLOR.red}`,
        padding: "6px 18px",
        fontFamily: FONTS.display,
        fontSize: 52,
        color: COLOR.red,
      }}
    >
      {text}
    </div>
  );
};
