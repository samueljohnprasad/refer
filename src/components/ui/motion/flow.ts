export type FlowKey = readonly [number, number];

// Monotone Hermite interpolation preserves speed through intermediate poses.
export function flow(time: number, keys: readonly FlowKey[]): number {
  "worklet";
  const last = keys.length - 1;
  if (time <= keys[0][0]) return keys[0][1];
  if (time >= keys[last][0]) return keys[last][1];
  let index = 0;
  while (keys[index + 1][0] < time) index += 1;
  const slope = (at: number): number =>
    (keys[at + 1][1] - keys[at][1]) / (keys[at + 1][0] - keys[at][0]);
  const tangent = (at: number): number => {
    if (at === 0 || at === last) return 0;
    const before = slope(at - 1);
    const after = slope(at);
    if (before * after <= 0) return 0;
    const previousSpan = keys[at][0] - keys[at - 1][0];
    const nextSpan = keys[at + 1][0] - keys[at][0];
    const firstWeight = 2 * nextSpan + previousSpan;
    const secondWeight = nextSpan + 2 * previousSpan;
    return (firstWeight + secondWeight) / (firstWeight / before + secondWeight / after);
  };
  const span = keys[index + 1][0] - keys[index][0];
  const progress = (time - keys[index][0]) / span;
  const squared = progress * progress;
  const cubed = squared * progress;
  return (2 * cubed - 3 * squared + 1) * keys[index][1]
    + (cubed - 2 * squared + progress) * span * tangent(index)
    + (-2 * cubed + 3 * squared) * keys[index + 1][1]
    + (cubed - squared) * span * tangent(index + 1);
}
