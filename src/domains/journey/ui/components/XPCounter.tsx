import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import {
  useAnimatedNumberViewModel,
  useGainFlyoverViewModel,
  useXPCounterViewModel,
  type XPGain,
  type XPCounterProps,
} from "../hooks/useXPCounterViewModel";

export interface AnimatedNumberViewProps
  extends ReturnType<typeof useAnimatedNumberViewModel> {}

/**
 * Presentational View component for AnimatedNumber.
 * Consists strictly of JSX code without internal hooks.
 */
export const AnimatedNumberView = React.memo(function AnimatedNumberView({
  displayValue,
  scaleStyle,
  compact,
}: AnimatedNumberViewProps): React.JSX.Element {
  return (
    <Animated.View style={scaleStyle}>
      <Text
        className={`font-bold text-amber-700 ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {displayValue.toLocaleString()}
      </Text>
    </Animated.View>
  );
});

function AnimatedNumber({
  value,
  compact,
}: {
  value: number;
  compact: boolean;
}): React.JSX.Element {
  const viewModel = useAnimatedNumberViewModel(value, compact);
  return <AnimatedNumberView {...viewModel} />;
}

export interface GainFlyoverViewProps
  extends ReturnType<typeof useGainFlyoverViewModel> {}

/**
 * Presentational View component for GainFlyover.
 * Consists strictly of JSX code without internal hooks.
 */
export const GainFlyoverView = React.memo(function GainFlyoverView({
  style,
  gain,
}: GainFlyoverViewProps): React.JSX.Element {
  return (
    <Animated.View
      style={[style, { position: "absolute", top: -8, right: 0 }]}
      pointerEvents="none"
    >
      <View className="bg-green-500 px-2 py-0.5 rounded-full">
        <Text className="text-xs font-bold text-white">+{gain.amount}</Text>
      </View>
    </Animated.View>
  );
});

function GainFlyover({
  gain,
  onComplete,
}: {
  gain: XPGain;
  onComplete: (id: string) => void;
}): React.JSX.Element {
  const viewModel = useGainFlyoverViewModel(gain, onComplete);
  return <GainFlyoverView {...viewModel} />;
}

export interface XPCounterViewProps
  extends ReturnType<typeof useXPCounterViewModel> {}

/**
 * Presentational View component for XPCounter.
 * Strictly contains JSX code without internal hooks.
 */
export const XPCounterView = React.memo(function XPCounterView({
  handleFlyoverComplete,
  totalIP,
  recentGains,
  onPress,
  compact,
}: XPCounterViewProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1 relative ${
        compact
          ? ""
          : "bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl"
      }`}
      accessibilityLabel={`${totalIP} insight points. Tap for details.`}
      accessibilityRole="button"
    >
      <Text style={{ fontSize: compact ? 14 : 16 }}>⚡</Text>

      <AnimatedNumber value={totalIP} compact={compact} />

      {!compact ? (
        <Text className="text-xs text-ink-muted ml-0.5">IP</Text>
      ) : null}

      {recentGains.slice(0, 3).map((gain: XPGain) => (
        <GainFlyover
          key={gain.id}
          gain={gain}
          onComplete={handleFlyoverComplete}
        />
      ))}
    </Pressable>
  );
});

function XPCounterInner(props: XPCounterProps): React.JSX.Element {
  const viewModel = useXPCounterViewModel(props);
  return <XPCounterView {...viewModel} />;
}

export const XPCounter = React.memo(XPCounterInner);
export default XPCounter;
export type { XPCounterProps, XPGain };
