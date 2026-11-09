import React from "react";
import { COLOR, FONTS } from "./config";

interface LabelProps {
  label: string; // "// 01 · catch"
  stat?: { prefix: string; value: string };
}

/** Top header row: mono label left, stat (red number) right. */
export const Label: React.FC<LabelProps> = ({ label, stat }) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      top: 132,
      width: 840,
      display: "flex",
      justifyContent: "space-between",
      fontFamily: FONTS.mono,
      fontSize: 25,
      color: COLOR.grey,
    }}
  >
    <span>{label}</span>
    {stat?.value ? (
      <span>
        {stat.prefix}{" "}
        <span style={{ color: COLOR.red, fontWeight: 700 }}>{stat.value}</span>
      </span>
    ) : null}
  </div>
);
