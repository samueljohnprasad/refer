import React from "react";
import { COLOR } from "./config";

interface CardProps {
  width: number;
  height: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Card with ink border + halftone-dot shadow (no soft drop shadows per spec). */
export const Card: React.FC<CardProps> = ({ width, height, style, children }) => (
  <div style={{ position: "relative", width, height, ...style }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 20,
        transform: "translate(-13px, 12px)",
        backgroundImage: `radial-gradient(circle, ${COLOR.ink} 1.7px, transparent 1.8px)`,
        backgroundSize: "8px 8px",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 20,
        background: COLOR.card,
        border: `3px solid ${COLOR.ink}`,
      }}
    >
      {children}
    </div>
  </div>
);
