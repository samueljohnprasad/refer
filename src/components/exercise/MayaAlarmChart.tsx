import React from "react";
import Svg, { Line, Polyline, Text as SvgText } from "react-native-svg";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

interface MayaAlarmInputs {
  load: number;
  walk: boolean;
  replay: boolean;
  coffee: boolean;
}

interface MayaAlarmChartProps extends MayaAlarmInputs {
  showThreshold: boolean;
}

export interface MayaAlarmVerdict {
  body: string;
  positive: boolean;
  title: string;
}

const WIDTH = 300;
const BASELINE_Y = 128;

export function MayaAlarmChart({
  load,
  walk,
  replay,
  coffee,
  showThreshold,
}: MayaAlarmChartProps) {
  const inputs = { load, walk, replay, coffee };
  const points: string[] = [];
  for (let time = 7; time <= 25.01; time += 0.25) {
    points.push(
      `${toX(time).toFixed(1)},${toY(getAlarmLevel(time, inputs)).toFixed(1)}`,
    );
  }
  const bedtimeX = toX(23);
  const thresholdY = toY(35);

  return (
    <Svg
      accessibilityLabel="Maya’s alarm level across one day"
      height={150}
      viewBox={`0 0 ${WIDTH} 150`}
      width="100%"
    >
      <Line
        x1={12}
        y1={BASELINE_Y}
        x2={292}
        y2={BASELINE_Y}
        stroke={COURSE_EXERCISE_COLORS.border}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Line
        x1={bedtimeX}
        y1={16}
        x2={bedtimeX}
        y2={132}
        stroke={COURSE_EXERCISE_COLORS.orangeLight}
        strokeWidth={2}
        strokeDasharray="4 4"
      />
      <SvgText
        x={bedtimeX}
        y={11}
        fill={COURSE_EXERCISE_COLORS.orangeRim}
        fontFamily={COURSE_EXERCISE_FONTS.bodyBold}
        fontSize={9}
        textAnchor="middle"
      >
        11pm
      </SvgText>
      {showThreshold ? (
        <>
          <Line
            x1={12}
            y1={thresholdY}
            x2={292}
            y2={thresholdY}
            stroke={COURSE_EXERCISE_COLORS.olive}
            strokeWidth={2}
            strokeDasharray="3 5"
            strokeLinecap="round"
          />
          <SvgText
            x={290}
            y={thresholdY - 5}
            fill={COURSE_EXERCISE_COLORS.oliveDark}
            fontFamily={COURSE_EXERCISE_FONTS.bodyBold}
            fontSize={9}
            textAnchor="end"
          >
            switch-off line
          </SvgText>
        </>
      ) : null}
      <Polyline
        points={points.join(" ")}
        fill="none"
        stroke={COURSE_EXERCISE_COLORS.orange}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <AxisLabel x={12} anchor="start">
        7am
      </AxisLabel>
      <AxisLabel x={152} anchor="middle">
        4pm
      </AxisLabel>
      <AxisLabel x={292} anchor="end">
        1am
      </AxisLabel>
    </Svg>
  );
}

function AxisLabel({
  x,
  anchor,
  children,
}: {
  x: number;
  anchor: "start" | "middle" | "end";
  children: string;
}) {
  return (
    <SvgText
      x={x}
      y={144}
      fill={COURSE_EXERCISE_COLORS.inkSoft}
      fontFamily={COURSE_EXERCISE_FONTS.bodyBold}
      fontSize={9}
      textAnchor={anchor}
    >
      {children}
    </SvgText>
  );
}

export function getMayaAlarmVerdict(
  stage: number,
  inputs: MayaAlarmInputs,
): MayaAlarmVerdict {
  if (stage < 2) {
    const alarmAtEleven = Math.round(getAlarmLevel(23, inputs));
    return {
      positive: alarmAtEleven <= 40,
      title: `Alarm still running at 11pm: ${alarmAtEleven}%`,
      body:
        stage === 0
          ? "Every demand adds to the tank; quiet hours drain it slowly. Like hunger, but for recovery."
          : "Watch the lunch dip. A real break spends alarm mid-day instead of banking it for tonight.",
    };
  }

  const switchOff = findSwitchOffTime(inputs);
  if (switchOff != null && switchOff <= 23.5) {
    return {
      positive: true,
      title: `Her mind lets go around ${formatTime(switchOff)}`,
      body: "The alarm falls below the line while the evening is still young. The switch-off happens on its own.",
    };
  }
  if (switchOff != null) {
    return {
      positive: false,
      title: `Staring at the ceiling until ${formatTime(switchOff)}`,
      body: "The tank is still too full at bedtime. Her mind waits for the alarm to settle.",
    };
  }
  return {
    positive: false,
    title: "Still wired past 1am",
    body: "High load plus the replay. Nothing tells the alarm to stand down. The rough night makes sense.",
  };
}

function getAlarmLevel(time: number, inputs: MayaAlarmInputs): number {
  let alarm = 14;
  for (let point = 7.25; point <= time + 0.0001; point += 0.25) {
    alarm =
      point > 9 && point <= 18 ? alarm + inputs.load * 0.028 : alarm * 0.9685;
    if (inputs.walk && point > 13 && point <= 14) alarm -= 5;
    if (inputs.replay && point > 22 && point <= 22.5) alarm += 15;
    alarm = Math.max(4, Math.min(100, alarm));
  }
  if (inputs.coffee && time >= 16) {
    alarm += 16 * Math.pow(0.5, (time - 16) / 4);
  }
  return Math.max(0, Math.min(100, alarm));
}

function findSwitchOffTime(inputs: MayaAlarmInputs): number | null {
  for (let time = 21.5; time <= 25.01; time += 0.25) {
    if (getAlarmLevel(time, inputs) <= 35) return time;
  }
  return null;
}

function toX(time: number): number {
  return 12 + (time - 7) * (280 / 18);
}

function toY(value: number): number {
  return BASELINE_Y - value * 1.12;
}

function formatTime(time: number): string {
  const normalized = time % 24;
  const hour24 = Math.floor(normalized);
  const minutes = Math.round((normalized - hour24) * 60);
  const suffix = hour24 >= 12 ? "pm" : "am";
  const hour = hour24 % 12 || 12;
  return `${hour}:${minutes.toString().padStart(2, "0")}${suffix}`;
}
