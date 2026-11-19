import React, { useEffect } from "react";
import { AccessibilityInfo, View } from "react-native";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import Animated, { cancelAnimation, Easing, useAnimatedProps, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";
import { HelpRowWithSheet } from "@/src/domains/home/ui/containers/HelpRowWithSheet";
import { HappiStage } from "@/src/domains/onboarding/ui/presentation/components/HappiStage";
import { useHappiGuideMotion } from "@/src/domains/onboarding/ui/containers/useHappiGuideMotion";
import { ActingPose } from "@/src/domains/onboarding/ui/containers/happiPoses";

const AnimatedG = Animated.createAnimatedComponent(G);

const GOAL = 3;
const POT_X = [50, 140, 230];
const LEAF = "M0 0C-10-2-14-10-12-14-4-14 2-8 0 0Z";
const PETALS = [0, 1, 2, 3, 4, 5].map((k) => ({
  dx: 9 * Math.cos((k * Math.PI) / 3),
  dy: 9 * Math.sin((k * Math.PI) / 3),
}));

function Pot({ x, waiting }: { x: number; waiting?: boolean }) {
  const dash = waiting ? { fill: "none", stroke: "#a9bfa0", strokeWidth: 2, strokeDasharray: "3 4" } : null;
  return (
    <>
      <Rect x={x - 19} y={66} width={38} height={8} rx={3} {...(dash ?? { fill: "#e89a73" })} />
      <Path d={`M${x - 15} 74h30l-4 22h-22z`} {...(dash ?? { fill: "#d9825b" })} />
    </>
  );
}

function Grown({ x }: { x: number }) {
  return (
    <>
      <Path d={`M${x} 68C${x - 6} 54 ${x + 6} 44 ${x} 30`} stroke="#5f7f58" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path transform={`translate(${x - 1} 56)`} d={LEAF} fill="#7fa876" />
      <Path transform={`translate(${x + 1} 48) scale(-1 1)`} d={LEAF} fill="#7fa876" />
      {PETALS.map((p, i) => <Circle key={i} cx={x + p.dx} cy={30 + p.dy} r={6.5} fill="#f5b942" />)}
      <Circle cx={x} cy={30} r={5} fill="#fff7d6" />
    </>
  );
}

function Sprout({ x }: { x: number }) {
  return (
    <>
      <Path d={`M${x} 68V58`} stroke="#5f7f58" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Path transform={`translate(${x} 59) scale(.6)`} d={LEAF} fill="#7fa876" />
      <Path transform={`translate(${x} 59) scale(-.6 .6)`} d={LEAF} fill="#7fa876" />
    </>
  );
}

// ponytail: .grow/.sway from .agents/exercises.html — scale up out of the pot (staggered), then a slow
// lean. Reduced motion renders the plant settled.
function Plant({ x, index, fresh, children }: { x: number; index: number; fresh: boolean; children: React.ReactNode }) {
  // settled by default; only new growth animates, and only once Reduce Motion is known to be off
  const grow = useSharedValue(1);
  const sway = useSharedValue(0.5);
  useEffect(() => {
    if (!fresh) return;
    let live = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!live || reduced) return;
      grow.value = 0;
      sway.value = 0;
      grow.value = withDelay(index * 160, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.4)) }));
      sway.value = withDelay(index * 160 + 600, withSequence(
        withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.ease) }), 2, true),
        withTiming(0.5, { duration: 800 }),
      ));
    });
    return () => { live = false; cancelAnimation(grow); cancelAnimation(sway); grow.value = 1; sway.value = 0.5; };
  }, [fresh, index, grow, sway]);
  const props = useAnimatedProps(() => ({
    scale: 0.2 + grow.value * 0.8,
    rotation: (sway.value * 2 - 1) * 3,
    originX: x,
    originY: 68,
  }));
  return <AnimatedG animatedProps={props}>{children}</AnimatedG>;
}

function Garden({ done, seenDone }: { done: number; seenDone?: number }) {
  return (
    <Svg width="100%" viewBox="0 0 280 104" accessibilityLabel={`${done} of ${GOAL} exercises done`}>
      <Path d="M12 97H268" stroke="#e4eee0" strokeWidth={6} strokeLinecap="round" />
      {POT_X.map((x, i) => (
        <G key={x}>
          {i <= done ? <Plant x={x} index={i} fresh={seenDone !== undefined && done > seenDone && i >= seenDone}>{i < done ? <Grown x={x} /> : <Sprout x={x} />}</Plant> : null}
          <Pot x={x} waiting={i > done} />
        </G>
      ))}
    </Svg>
  );
}

type PracticeEmptyStateProps = {
  completedCount: number;
  /** pots the last visit showed; undefined on a first visit */
  seenCount?: number;
  onChooseExercise: () => void;
};

export function PracticeEmptyState({ completedCount, seenCount, onChooseExercise }: PracticeEmptyStateProps) {
  const { t } = useTranslation("common");
  const done = Math.min(completedCount, GOAL - 1);
  const left = GOAL - done;
  const more = ["", "One more", "Two more", "Three"][left];
  const chooseLabel = t("timelineAnalytics.practice.chooseNext", {
    defaultValue: `Choose your ${done ? "next" : "first"} exercise`,
  });
  const motion = useHappiGuideMotion();
  const { setPose } = motion;
  useEffect(() => {
    setPose(ActingPose.Act);
  }, [setPose]);

  return (
    <View className="flex-1 bg-brand-surface px-5 pb-28 pt-4">
      <View className="items-center">
        <HappiStage motion={motion} size="scene" width={112} />
        <Text variant="display" className="mt-3 text-center max-w-[320px]">
          {t("timelineAnalytics.practice.bloomHeadline", {
            defaultValue: `${more} ${left === 1 ? "exercise" : "exercises"} and your patterns bloom`,
          })}
        </Text>
      </View>

      <View className="mt-4 rounded-3xl bg-happy-tint px-4 pb-4 pt-3">
        <View className="flex-row items-baseline gap-1.5">
          <Text className="font-display text-t-num leading-none tracking-tight text-happy-label">{done}</Text>
          <Text className="text-t-sub font-bold text-happy-label-2">of {GOAL} done</Text>
        </View>
        <Garden done={done} seenDone={seenCount === undefined ? undefined : Math.min(seenCount, GOAL - 1)} />
      </View>

      <Button
        size="md"
        fullWidth
        label={chooseLabel}
        onPress={onChooseExercise}
        accessibilityLabel={chooseLabel}
        className="mt-4"
      />
      <HelpRowWithSheet className="mt-auto" />
    </View>
  );
}
