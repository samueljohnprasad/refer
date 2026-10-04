import { useAnimatedStyle, interpolate, Extrapolation } from "react-native-reanimated";

interface CelebrationAnimationValues {
  overlayOpacity: { value: number };
  pandaProgress: { value: number };
  reducedMotion: boolean;
  glowOpacity: { value: number };
  titleOpacity: { value: number };
  messageOpacity: { value: number };
  badgeOpacity: { value: number };
  badgeScale: { value: number };
  xpOpacity: { value: number };
  xpScale: { value: number };
  streakOpacity: { value: number };
  streakScale: { value: number };
  ringOpacity: { value: number };
  ringScale: { value: number };
  milestoneOpacity: { value: number };
  milestoneScale: { value: number };
  chestOpacity: { value: number };
  chestScale: { value: number };
  pandaSwap: { value: number };
  buttonOpacity: { value: number };
}

export function useCelebrationAnimatedStyles(values: CelebrationAnimationValues) {
  const { reducedMotion } = values;
  const overlayStyle = useAnimatedStyle(() => ({ opacity: values.overlayOpacity.value }));
  const pandaStyle = useAnimatedStyle(() => {
    if (reducedMotion) return { opacity: interpolate(values.pandaProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP) };
    return {
      opacity: interpolate(values.pandaProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(values.pandaProgress.value, [0, 1], [16, 0], Extrapolation.CLAMP) },
        { scale: interpolate(values.pandaProgress.value, [0, 1], [0.92, 1], Extrapolation.CLAMP) },
      ],
    };
  });
  const glowStyle = useAnimatedStyle(() => ({ opacity: values.glowOpacity.value * 0.6, transform: [{ scale: 1 }] }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: values.titleOpacity.value, transform: [{ translateY: 8 * (1 - values.titleOpacity.value) }] }));
  const messageStyle = useAnimatedStyle(() => ({ opacity: values.messageOpacity.value, transform: [{ translateY: 8 * (1 - values.messageOpacity.value) }] }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: values.badgeOpacity.value,
    transform: [
      { translateY: 6 * (1 - values.badgeOpacity.value) },
      { scale: interpolate(values.badgeScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const xpStyle = useAnimatedStyle(() => ({
    opacity: values.xpOpacity.value,
    transform: [
      { translateY: 8 * (1 - values.xpOpacity.value) },
      { scale: interpolate(values.xpScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const streakStyle = useAnimatedStyle(() => ({
    opacity: values.streakOpacity.value,
    transform: [
      { translateY: 8 * (1 - values.streakOpacity.value) },
      { scale: interpolate(values.streakScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const ringCardStyle = useAnimatedStyle(() => ({
    opacity: values.ringOpacity.value,
    transform: [
      { translateY: 8 * (1 - values.ringOpacity.value) },
      { scale: interpolate(values.ringScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const milestoneStyle = useAnimatedStyle(() => ({
    opacity: values.milestoneOpacity.value,
    transform: [
      { translateY: 6 * (1 - values.milestoneOpacity.value) },
      { scale: interpolate(values.milestoneScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  const chestCardStyle = useAnimatedStyle(() => ({
    opacity: values.chestOpacity.value,
    transform: [
      { translateY: 8 * (1 - values.chestOpacity.value) },
      { scale: interpolate(values.chestScale.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) },
    ],
  }));
  return {
    overlayStyle, pandaStyle, glowStyle, titleStyle, messageStyle, badgeStyle, xpStyle,
    streakStyle, ringCardStyle, milestoneStyle, chestCardStyle,
    flameIconStyle: useAnimatedStyle(() => ({ transform: [{ scale: 1 }] })),
    chestIconStyle: useAnimatedStyle(() => ({ transform: [{ scale: 1 }] })),
    pandaSwapStyle: useAnimatedStyle(() => ({ transform: [{ scale: values.pandaSwap.value }] })),
    buttonStyle: useAnimatedStyle(() => ({ opacity: values.buttonOpacity.value })),
  };
}
