import React from "react";
import { useCurrentFrame } from "remotion";

const OUTLINE = "#3A2F28"; // dark brown
const SKIN = "#E8B98A";
const HOODIE = "#5F7F58"; // reuses the app's real primary green (journey.ts BUTTON.face)
const GLASS = "#2B2420";

/**
 * Static cartoon presenter — head, glasses, hoodie, idle sway only.
 * ponytail: mouth shapes are audio-reactive in the spec (loudness → viseme
 * per frame); there is no narration audio yet, so the mouth stays a closed
 * neutral line here. Swap in loudness-driven viseme selection once
 * narration.wav exists — see remotion/thought-catcher/script.ts header.
 */
export const Presenter: React.FC = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 45) * 2; // slow, slight head sway, always-on

  return (
    <svg
      width={650}
      height={770}
      viewBox="0 0 650 770"
      style={{ position: "absolute", left: 430, top: 1170 }}
    >
      {/* hoodie / shoulders */}
      <rect x={120} y={420} width={410} height={350} rx={60} fill={HOODIE} stroke={OUTLINE} strokeWidth={6} />
      <g transform={`rotate(${sway} 325 320)`}>
        {/* head */}
        <circle cx={325} cy={300} r={170} fill={SKIN} stroke={OUTLINE} strokeWidth={6} />
        {/* hair */}
        <path d="M165 260 Q 325 100 485 260 L 485 230 Q 325 150 165 230 Z" fill={OUTLINE} />
        {/* glasses */}
        <rect x={210} y={280} width={100} height={70} rx={14} fill="none" stroke={GLASS} strokeWidth={6} />
        <rect x={340} y={280} width={100} height={70} rx={14} fill="none" stroke={GLASS} strokeWidth={6} />
        <line x1={310} y1={312} x2={340} y2={312} stroke={GLASS} strokeWidth={6} />
        {/* mouth — neutral closed line, upgrade path above */}
        <line x1={295} y1={400} x2={355} y2={400} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      </g>
    </svg>
  );
};
