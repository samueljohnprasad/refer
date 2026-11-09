import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONTS } from "./config";

interface TitleProps {
  words: [string, string];
  startFrame: number; // frame the slam-in begins
  x: number;
  y: number;
  fontSize?: number;
}

const SLAM_FRAMES = 7; // 0.24s @ 30fps
const UNDERLINE_DELAY_FRAMES = 4; // 0.12s
const UNDERLINE_DRAW_FRAMES = 9; // 0.3s

/** Anton title: word1 ink, word2 red, hand-drawn swash underline under word2. */
export const Title: React.FC<TitleProps> = ({ words, startFrame, x, y, fontSize = 176 }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0) return null;

  const scale = interpolate(local, [0, SLAM_FRAMES], [1.22, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const underlineProgress = interpolate(
    local,
    [UNDERLINE_DELAY_FRAMES, UNDERLINE_DELAY_FRAMES + UNDERLINE_DRAW_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale})`,
        transformOrigin: "left top",
        fontFamily: FONTS.display,
      }}
    >
      <div style={{ display: "flex", gap: 24, lineHeight: 0.9 }}>
        <span style={{ color: COLOR.ink, fontSize }}>{words[0]}</span>
        <span style={{ color: COLOR.red, fontSize, position: "relative" }}>
          {words[1]}
          <svg
            width="100%"
            height="24"
            viewBox="0 0 200 24"
            preserveAspectRatio="none"
            style={{ position: "absolute", left: 0, bottom: -18, width: "100%" }}
          >
            <path
              d="M2 14 Q 40 2, 80 14 T 160 12 T 198 16"
              fill="none"
              stroke={COLOR.red}
              strokeWidth={10}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - underlineProgress}
            />
          </svg>
        </span>
      </div>
    </div>
  );
};
