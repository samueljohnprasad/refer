// ponytail: labels, today callout arrow, progressive segments, and xp floats matching remotion
import React from "react";
import { Text } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import {
  NODES,
  TODAY_INDEX,
  NODE_SIZE,
  TODAY_SIZE,
  TODAY,
  NODE_STATE,
  CANVAS_WIDTH,
  ProgressSegmentDef,
  nodeAt,
  completeAt,
  T,
  JourneyNodeDef,
} from "./constants";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useTranslation } from "react-i18next";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface LabelProps {
  index: number;
  frame: SharedValue<number>;
  scale: number;
}

export function WelcomeLabel({ index, frame, scale }: LabelProps): React.JSX.Element | null {
  const { t } = useTranslation("onboarding");
  if (index === TODAY_INDEX) return null;
  const node: JourneyNodeDef = NODES[index];
  const startAt: number = nodeAt(index) + 4;
  const nodeCompleteAt: number = completeAt(index);
  const gap: number = (NODE_SIZE / 2 + 22) * scale;
  const width: number = 300 * scale;

  const animatedStyle = useAnimatedStyle(() => {
    const f: number = frame.value;
    const isLocked: boolean = index > TODAY_INDEX;
    const isCompleted: boolean = index < TODAY_INDEX && f >= nodeCompleteAt;
    const restOpacity: number = isLocked ? 0.45 : isCompleted ? 0.72 : 1;

    const appear: number = interpolate(f, [startAt, startAt + 18], [0, 1], Extrapolation.CLAMP);
    const shift: number = (1 - appear) * (node.side === "left" ? 14 * scale : -14 * scale);

    return {
      opacity: appear * restOpacity,
      transform: [{ translateX: shift }],
    };
  });

  const nodeX: number = node.x * scale;
  const nodeY: number = node.y * scale;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: nodeY - 46 * scale,
          width,
          ...(node.side === "left"
            ? { right: CANVAS_WIDTH * scale - (nodeX - gap), alignItems: "flex-end" }
            : { left: nodeX + gap, alignItems: "flex-start" }),
        },
        animatedStyle,
      ]}
    >
      {node.label.map((line: string, i: number) => (
        <Text
          key={i}
          style={{
            fontFamily: APP_FONT_FAMILIES.caveatSemiBold,
            fontSize: 42 * scale,
            lineHeight: 46 * scale,
            color: "#6C7A85",
            textAlign: node.side === "left" ? "right" : "left",
          }}
        >
          {t(`welcome_nodes.${index}_${i}`, { defaultValue: line })}
        </Text>
      ))}
    </Animated.View>
  );
}

export function TodayCallout({ frame, scale }: { frame: SharedValue<number>; scale: number }): React.JSX.Element {
  const { t } = useTranslation("onboarding");
  const startAt: number = nodeAt(TODAY_INDEX) + 4;
  const gap: number = (TODAY_SIZE / 2 + 30) * scale;
  const nodeX: number = TODAY.x * scale;
  const nodeY: number = TODAY.y * scale;

  const textStyle = useAnimatedStyle(() => {
    const appear: number = interpolate(frame.value, [startAt, startAt + 18], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: appear,
      transform: [{ translateX: (1 - appear) * (14 * scale) }],
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    const appear: number = interpolate(frame.value, [T.arrowAt, T.arrowAt + 16], [0, 1], Extrapolation.CLAMP);
    return { opacity: appear };
  });

  return (
    <>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: nodeY - 74 * scale,
            right: CANVAS_WIDTH * scale - (nodeX - gap),
            width: 260 * scale,
            alignItems: "flex-end",
          },
          textStyle,
        ]}
      >
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.caveatBold,
            fontSize: 58 * scale,
            lineHeight: 60 * scale,
            color: "#2F7FE0",
            textAlign: "right",
          }}
        >
          {t("welcome_nodes.today", { defaultValue: "Today" })}
        </Text>
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.caveatSemiBold,
            fontSize: 38 * scale,
            lineHeight: 40 * scale,
            color: "#6C7A85",
            marginTop: 2 * scale,
            textAlign: "right",
          }}
        >
          {t("welcome_nodes.start_here", { defaultValue: "Start here" })}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          {
            position: "absolute",
            left: nodeX - gap - 78 * scale,
            top: nodeY + 52 * scale,
            width: 90 * scale,
            height: 60 * scale,
          },
          arrowStyle,
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 90 60">
          <Path d="M 4 4 C 30 4 40 30 82 40" fill="none" stroke="#6C7A85" strokeWidth={4} strokeLinecap="round" />
          <Path d="M 68 32 L 84 41 L 70 50" fill="none" stroke="#6C7A85" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Animated.View>
    </>
  );
}

export function ProgressSegment({
  segment,
  frame,
}: {
  segment: ProgressSegmentDef;
  frame: SharedValue<number>;
}): React.JSX.Element {
  const animatedProps = useAnimatedProps(() => {
    const f: number = frame.value;
    if (f < segment.startFrame) {
      return { strokeDashoffset: segment.length, opacity: 0 };
    }
    const progress: number = interpolate(
      f,
      [segment.startFrame, segment.endFrame],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      strokeDashoffset: (1 - progress) * segment.length,
      opacity: 1,
    };
  });

  return (
    <AnimatedPath
      d={segment.d}
      fill="none"
      stroke={NODE_STATE.completed}
      strokeWidth={9}
      strokeLinecap="round"
      strokeDasharray={segment.length}
      animatedProps={animatedProps}
    />
  );
}

export function XpFloat({ frame, index, scale }: LabelProps): React.JSX.Element | null {
  const at: number = completeAt(index);
  const node: JourneyNodeDef = NODES[index];
  const nodeX: number = node.x * scale;
  const nodeY: number = node.y * scale;

  const animatedStyle = useAnimatedStyle(() => {
    const f: number = frame.value;
    const duration: number = 40;
    if (f < at || f > at + duration) return { opacity: 0 };
    const t: number = (f - at) / duration;
    const rise: number = interpolate(t, [0, 1], [0, -90 * scale], Extrapolation.CLAMP);
    const opacity: number = interpolate(t, [0, 0.12, 0.72, 1], [0, 1, 1, 0], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY: rise }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: nodeX - 90 * scale,
          top: nodeY - 130 * scale,
          width: 180 * scale,
          alignItems: "center",
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <Text style={{ fontFamily: APP_FONT_FAMILIES.caveatBold, fontSize: 50 * scale, color: "#C79A00" }}>
        +15 XP
      </Text>
    </Animated.View>
  );
}

export default React.memo(TodayCallout);
