// ponytail: .agents/fear-ladder.html's last two beats before the rung: "Get ready" (a slow breathing circle,
// "Breathe in / out" every 4s) then "Stay with it" (a two-minute ring and clock). The footer button is the
// step's own: "I am ready" starts the clock, "I stayed with it" moves on. holdCompleted is set when the clock
// runs out or the person says they stayed, never before.
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Text } from "@/src/components/ui/Text";
import type { FearLadderResponse, StepProps } from "@/src/types/exerciseFlow";
import { FL, FLAsk, FLSaid } from "./flParts";

const HOLD_SECONDS = 120;
const CIRCUMFERENCE = 597;
const clock = (s: number): string => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Breath(): React.JSX.Element {
  const scale = useSharedValue(1);
  useEffect(() => {
    const ease = Easing.inOut(Easing.ease);
    scale.value = withRepeat(withSequence(withTiming(1.3, { duration: 4000, easing: ease }), withTiming(1, { duration: 4000, easing: ease })), -1);
    return () => cancelAnimation(scale);
  }, [scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[{ width: 172, height: 172, borderRadius: 86, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(242,248,239,0.55)" }, style]}>
      <View style={{ width: 132, height: 132, borderRadius: 66, backgroundColor: "#f2f8ef" }} />
    </Animated.View>
  );
}

function Ring({ left }: { left: number }): React.JSX.Element {
  return (
    <View style={{ width: 220, height: 220, alignItems: "center", justifyContent: "center" }}>
      <Svg width={220} height={220} viewBox="0 0 220 220" style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={110} cy={110} r={95} fill="none" stroke={FL.sep} strokeWidth={10} strokeLinecap="round" />
        <Circle cx={110} cy={110} r={95} fill="none" stroke={FL.ink} strokeWidth={10} strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - left / HOLD_SECONDS)} />
      </Svg>
      <Text className="font-display text-[56px] leading-[56px] text-happy-label" style={{ fontVariant: ["tabular-nums"] }}>{clock(left)}</Text>
    </View>
  );
}

export const FLHoldStep: React.FC<StepProps<FearLadderResponse>> = ({ response, onUpdate, onNext, setPrimaryOverride }) => {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(HOLD_SECONDS);
  const [breaths, setBreaths] = useState(0);
  const update = useRef(onUpdate);
  update.current = onUpdate;
  const over = left === 0;

  useEffect(() => {
    if (running) return;
    const id = setInterval(() => setBreaths((n) => n + 1), 4000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running, over]);

  useEffect(() => {
    if (running && over) update.current({ holdCompleted: true });
  }, [running, over]);

  useEffect(() => {
    if (!setPrimaryOverride) return;
    setPrimaryOverride(
      running
        ? { label: "I stayed with it", disabled: false, action: () => { update.current({ holdCompleted: true }); onNext(); } }
        : { label: "I am ready", disabled: false, action: () => setRunning(true) },
    );
    return () => setPrimaryOverride(null);
  }, [running, onNext, setPrimaryOverride]);

  const cue = running ? (over ? "Time. You stayed." : "It will peak, then ease.") : breaths % 2 ? "Breathe out" : "Breathe in";
  return (
    <View>
      <FLSaid label="Your first rung" text={response.pickedRung} />
      <FLAsk title={running ? "Stay with it" : "Get ready"} happi={false} />
      <View className="items-center justify-center gap-6 py-6" style={{ minHeight: 260 }}>
        {running ? <Ring left={left} /> : <Breath />}
        <Text className="max-w-[260px] text-center text-t-lead font-bold leading-[26px] text-happy-label" accessibilityLiveRegion="polite">{cue}</Text>
        {running ? null : (
          <Text className="max-w-[280px] text-center text-t-body font-semibold leading-[23px] text-happy-label-2">
            Three slow breaths. When you are ready, start. Stay until the timer ends, even if it spikes.
          </Text>
        )}
      </View>
    </View>
  );
};
