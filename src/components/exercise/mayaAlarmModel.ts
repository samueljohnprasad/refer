import type { ExplorableValues } from "@/src/components/exercise/explorableModelContent";

export function getMayaAlarmLevel(
  time: number,
  inputs: ExplorableValues,
): number {
  let alarm = 14;
  for (let point = 7.25; point <= time + 0.0001; point += 0.25) {
    alarm = point > 9 && point <= 18
      ? alarm + inputs.load * 0.028
      : alarm * 0.9685;
    if (inputs.walk && point > 13 && point <= 14) alarm -= 5;
    if (inputs.replay && point > 22 && point <= 22.5) alarm += 15;
    alarm = Math.max(4, Math.min(100, alarm));
  }
  if (inputs.coffee && time >= 16) {
    alarm += 16 * Math.pow(0.5, (time - 16) / 4);
  }
  return Math.max(0, Math.min(100, alarm));
}

export function getMayaAlarmAtEleven(inputs: ExplorableValues): number {
  return Math.round(getMayaAlarmLevel(23, inputs));
}

export function getMayaAlarmDeltaText(
  baseline: ExplorableValues,
  current: ExplorableValues,
): string {
  const before = getMayaAlarmAtEleven(baseline);
  const after = getMayaAlarmAtEleven(current);
  const difference = after - before;
  if (difference === 0) return `At 11pm: ${before}% -> ${after}%, no change`;
  return `At 11pm: ${before}% -> ${after}%, ${Math.abs(difference)} points ${difference < 0 ? "lower" : "higher"}`;
}
