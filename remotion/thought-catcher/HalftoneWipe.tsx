import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLOR, COMP } from "./config";

interface HalftoneWipeProps {
  startFrame: number;
}

const COLS = 13;
const ROWS = 23;
const MAX_DOT = 62;
const TOTAL_FRAMES = 27; // 0.9s @ 30fps — grow from centre, then shrink away
const MAX_DELAY_FRAMES = 10;
const GROW_FRAMES = 8;
const SHRINK_FRAMES = 9;

/** Ink-dot grid growing outward from centre, then shrinking away — a scene-break wipe. */
export const HalftoneWipe: React.FC<HalftoneWipeProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > TOTAL_FRAMES) return null;

  const cellW = COMP.width / COLS;
  const cellH = COMP.height / ROWS;
  const cx = COMP.width / 2;
  const cy = COMP.height / 2;
  const maxDist = Math.hypot(cx, cy);

  const dots = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = cellW * (col + 0.5);
      const y = cellH * (row + 0.5);
      const dist = Math.hypot(x - cx, y - cy) / maxDist;
      const delay = dist * MAX_DELAY_FRAMES;
      const cellLocal = local - delay;
      const diameter =
        cellLocal < 0
          ? 0
          : cellLocal <= GROW_FRAMES
            ? interpolate(cellLocal, [0, GROW_FRAMES], [0, MAX_DOT])
            : interpolate(cellLocal, [GROW_FRAMES, GROW_FRAMES + SHRINK_FRAMES], [MAX_DOT, 0], {
                extrapolateRight: "clamp",
              });
      if (diameter <= 0) continue;
      dots.push({ x, y, diameter, key: `${row}-${col}` });
    }
  }

  return (
    <AbsoluteFill>
      {dots.map((d) => (
        <div
          key={d.key}
          style={{
            position: "absolute",
            left: d.x - d.diameter / 2,
            top: d.y - d.diameter / 2,
            width: d.diameter,
            height: d.diameter,
            borderRadius: "50%",
            background: COLOR.ink,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
