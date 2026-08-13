import React from "react";
import Svg, { Line, Polyline, Text as SvgText } from "react-native-svg";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import type { ExplorableValues } from "@/src/components/exercise/explorableModelContent";
import { getMayaAlarmLevel } from "@/src/components/exercise/mayaAlarmModel";

interface MayaAlarmChartProps extends ExplorableValues {
  accessibilityLabel: string;
}

const WIDTH = 300;
const BASELINE_Y = 128;

export function MayaAlarmChart({
  accessibilityLabel,
  load,
  walk,
  replay,
  coffee,
}: MayaAlarmChartProps) {
  const inputs = { load, walk, replay, coffee };
  const points: string[] = [];
  for (let time = 7; time <= 25.01; time += 0.25) {
    points.push(`${toX(time).toFixed(1)},${toY(getMayaAlarmLevel(time, inputs)).toFixed(1)}`);
  }
  const bedtimeX = toX(23);
  const thresholdY = toY(35);

  return (
    <Svg
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      height={150}
      viewBox={`0 0 ${WIDTH} 150`}
      width="100%"
    >
      <Line x1={12} y1={BASELINE_Y} x2={292} y2={BASELINE_Y}
        stroke={COURSE_EXERCISE_COLORS.border} strokeWidth={2} strokeLinecap="round" />
      <Line x1={bedtimeX} y1={16} x2={bedtimeX} y2={132}
        stroke={COURSE_EXERCISE_COLORS.accentLight} strokeWidth={2} strokeDasharray="4 4" />
      <SvgText x={bedtimeX} y={11} fill={COURSE_EXERCISE_COLORS.accentDark}
        fontFamily={COURSE_EXERCISE_FONTS.bodyBold} fontSize={9} textAnchor="middle">
        11pm
      </SvgText>
      <Line x1={12} y1={thresholdY} x2={292} y2={thresholdY}
        stroke={COURSE_EXERCISE_COLORS.accent} strokeWidth={2}
        strokeDasharray="3 5" strokeLinecap="round" />
      <SvgText x={290} y={thresholdY - 5} fill={COURSE_EXERCISE_COLORS.accentDark}
        fontFamily={COURSE_EXERCISE_FONTS.bodyBold} fontSize={9} textAnchor="end">
        switch-off line
      </SvgText>
      <Polyline points={points.join(" ")} fill="none"
        stroke={COURSE_EXERCISE_COLORS.accent} strokeWidth={3.5}
        strokeLinecap="round" strokeLinejoin="round" />
      <AxisLabel x={12} anchor="start">7am</AxisLabel>
      <AxisLabel x={152} anchor="middle">4pm</AxisLabel>
      <AxisLabel x={292} anchor="end">1am</AxisLabel>
    </Svg>
  );
}

function AxisLabel({ x, anchor, children }: {
  x: number;
  anchor: "start" | "middle" | "end";
  children: string;
}) {
  return (
    <SvgText x={x} y={144} fill={COURSE_EXERCISE_COLORS.inkSoft}
      fontFamily={COURSE_EXERCISE_FONTS.bodyBold} fontSize={9} textAnchor={anchor}>
      {children}
    </SvgText>
  );
}

function toX(time: number): number {
  return 12 + (time - 7) * (280 / 18);
}

function toY(value: number): number {
  return BASELINE_Y - value * 1.12;
}
