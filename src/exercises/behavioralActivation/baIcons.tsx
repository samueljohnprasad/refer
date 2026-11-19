// ponytail: the ten activity line-icons from .agents/behavioral-activation.html's ACTS (32x32 grid).
import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

type Glyph = { d: string; dots?: readonly (readonly [number, number, number])[] };

const GLYPHS: Record<string, Glyph> = {
  walk: { d: "M17 10v9M17 13l-5 4M17 13l5 3M17 19l-4 9M17 19l5 9", dots: [[17, 6, 3]] },
  call: { d: "M8 5h5l2 6-3 2a14 14 0 0 0 7 7l2-3 6 2v5a2 2 0 0 1-2 2A21 21 0 0 1 6 7a2 2 0 0 1 2-2Z" },
  cook: { d: "M6 14h20v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4ZM4 14h24M12 9c0-2 2-2 2-5M19 9c0-2 2-2 2-5" },
  tidy: { d: "M16 4l2.5 7.5L26 14l-7.5 2.5L16 24l-2.5-7.5L6 14l7.5-2.5ZM25 22v6M22 25h6" },
  dress: { d: "M11 5l-7 5 3 4 4-2v15h10V12l4 2 3-4-7-5a5 5 0 0 1-10 0Z" },
  music: { d: "M12 24V8l14-3v16", dots: [[8.5, 24, 3.5], [22.5, 21, 3.5]] },
  plants: { d: "M16 28V14M16 18C8 18 6 11 6 8c7 0 10 3 10 10M16 14c0-5 3-8 10-8 0 5-3 9-10 9" },
  draw: { d: "M5 27l2-7L21 6l5 5L12 25ZM18 9l5 5" },
  stretch: { d: "M16 9v10M6 6l10 6 10-6M16 19l-5 9M16 19l5 9", dots: [[16, 6, 3]] },
  read: { d: "M4 7h9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H4ZM28 7h-9a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h9Z" },
};

export function BaIcon({ name, size = 40, color = "#44633f" }: { name: string; size?: number; color?: string }): React.JSX.Element {
  const g = GLYPHS[name] ?? GLYPHS.walk;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d={g.d} />
      {g.dots?.map(([cx, cy, r]) => <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
    </Svg>
  );
}
