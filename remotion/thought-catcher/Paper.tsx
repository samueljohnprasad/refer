import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR } from "./config";

/** Cream paper with fine noise grain — SVG feTurbulence, no image asset. */
export const Paper: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.05, mixBlendMode: "multiply" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);
