import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR, FONTS } from "./config";
import type { Line } from "./script";

const GREY = "#B5AFA7";
const REVEAL_FRAMES = 6; // 0.2s @ 30fps

interface CaptionsProps {
  lines: Line[]; // flattened, ordered
}

export const Captions: React.FC<CaptionsProps> = ({ lines }) => {
  const frame = useCurrentFrame();
  const activeIndex = lines.reduce(
    (acc, line, i) => (line.startFrame <= frame ? i : acc),
    -1,
  );
  if (activeIndex === -1) return null;
  const line = lines[activeIndex];
  const holdUntil = lines[activeIndex + 1]?.startFrame ?? line.endFrame + 20;
  if (frame >= holdUntil) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 196,
        width: 850,
        fontFamily: FONTS.caption,
        fontWeight: 500,
        fontSize: 62,
        lineHeight: 1.1,
      }}
    >
      {line.words.map((word, i) => {
        if (frame < word.startFrame) return null;
        const isKeyword = word.text.toLowerCase().replace(/[^a-z]/g, "") === line.keyword.toLowerCase();
        const colorProgress = interpolate(frame, [word.startFrame, word.startFrame + REVEAL_FRAMES], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const color = isKeyword ? COLOR.red : mixColor(GREY, COLOR.ink, colorProgress);
        return (
          <span
            key={i}
            style={{
              color,
              fontFamily: isKeyword ? FONTS.captionSerif : FONTS.caption,
              fontStyle: isKeyword ? "italic" : "normal",
              fontSize: isKeyword ? 62 * 1.16 : 62,
              marginRight: 16,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};

function mixColor(fromHex: string, toHex: string, t: number): string {
  const f = parseInt(fromHex.slice(1), 16);
  const to = parseInt(toHex.slice(1), 16);
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const r = lerp((f >> 16) & 255, (to >> 16) & 255);
  const g = lerp((f >> 8) & 255, (to >> 8) & 255);
  const b = lerp(f & 255, to & 255);
  return `rgb(${r}, ${g}, ${b})`;
}
