// Review sheet for the prototype pose set in .agents/happi.js; one frame = every pose at the same time.
import React, { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import "../.agents/happi.js";

type HappiApi = { at: (el: HTMLElement, pose: string, ms: number) => void; POSES: Record<string, { use: string }> };
const happi = (): HappiApi => (window as unknown as { Happi: HappiApi }).Happi;

const TILES: [string, string][] = [
  ["wave", "#f7f7f7"], ["welcome", "#f7f7f7"], ["content", "#f7f7f7"], ["evening", "#f7f7f7"],
  ["catch", "#e6f0e2"], ["reframe", "#fdf0d2"], ["abc", "#e2eef8"], ["act", "#fde5dc"],
  ["ladder", "#ece6f7"], ["cheer", "#f7f7f7"], ["proud", "#f7f7f7"],
];

export function HappiPoses(): React.JSX.Element {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    refs.current.forEach((el, i) => el && happi().at(el, TILES[i][0], (frame / fps) * 1000));
  }, [frame, fps]);

  return (
    <div style={{ background: "#fff", width: "100%", height: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, padding: 16, boxSizing: "border-box", fontFamily: "sans-serif" }}>
      {TILES.map(([pose, bg], i) => (
        <div key={pose} style={{ background: bg, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", padding: 8 }}>
          <div ref={el => { refs.current[i] = el; }} style={{ width: 300, height: 335 }} />
          <div style={{ fontSize: 22, fontWeight: 700, color: "#142414" }}>{pose}</div>
        </div>
      ))}
    </div>
  );
}
