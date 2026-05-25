import { View } from "react-native";
import React, { useEffect } from "react";
import {
  Blur,
  Canvas,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SAGE_RECORDING_GRADIENT } from "@/lib/tokens";

const { width, height } = Dimensions.get("window");

const VISUAL_CONFIG = {
  blur: 9,
  center: {
    x: width / 2,
    y: height / 1.3,
  },
};

const ANIMATION_CONFIG = {
  durations: {
    MOUNT: 2000,
    SPEAKING_TRANSITION: 600,
    QUIET_TRANSITION: 400,
    PULSE: 1000,
  },
  spring: {
    damping: 10,
    stiffness: 50,
  },
};

const RADIUS_CONFIG = {
  minScale: 0.6,
  maxScale: 1.4,
  speakingScale: 1.0,
  quietScale: 0.6,
  baseRadius: {
    default: width,
    speaking: width / 4,
  },
};

export type GradientPosition = "top" | "center" | "bottom";

interface MindfulGradientProps {
  position: GradientPosition;
  isSpeaking: boolean;
}

const getTargetY = (position: GradientPosition) => {
  switch (position) {
    case "top":
      return 0;
    case "center":
      return VISUAL_CONFIG.center.y;
    case "bottom":
      return height;
    default:
      return VISUAL_CONFIG.center.y;
  }
};

// Helper functions for radius calculations
const calculateRadiusBounds = (baseRadius: number) => {
  "worklet";
  return {
    min: baseRadius * RADIUS_CONFIG.minScale,
    max: baseRadius * RADIUS_CONFIG.maxScale,
  };
};

const calculateTargetRadius = (baseRadius: number, isSpeaking: boolean) => {
  "worklet";
  const { min, max } = calculateRadiusBounds(baseRadius);
  const scale = isSpeaking
    ? RADIUS_CONFIG.speakingScale
    : RADIUS_CONFIG.quietScale;
  return min + (max - min) * scale;
};

const MindfulGradient: React.FC<MindfulGradientProps> = ({
  position,
  isSpeaking,
}) => {
  const animatedY = useSharedValue(0);
  const radiusScale = useSharedValue(1);
  const baseRadiusValue = useSharedValue(RADIUS_CONFIG.baseRadius.default);
  const mountRadius = useSharedValue(0);

  const center = useDerivedValue(() => {
    return vec(VISUAL_CONFIG.center.x, animatedY.value);
  });

  const animatedRadius = useDerivedValue(() => {
    const { min, max } = calculateRadiusBounds(baseRadiusValue.value);
    const calculatedRadius = min + (max - min) * radiusScale.value;
    return mountRadius.value < calculatedRadius
      ? mountRadius.value
      : calculatedRadius;
  });

  useEffect(() => {
    const targetY = getTargetY(position);
    animatedY.value = withSpring(targetY, ANIMATION_CONFIG.spring);
  }, [position, animatedY.value]);

  useEffect(() => {
    animatedY.value = getTargetY(position);
  }, []);

  useEffect(() => {
    const targetRadius = calculateTargetRadius(
      RADIUS_CONFIG.baseRadius.default,
      isSpeaking
    );
    mountRadius.value = withTiming(targetRadius, {
      duration: ANIMATION_CONFIG.durations.MOUNT,
    });
  }, []);

  useEffect(() => {
    const duration = ANIMATION_CONFIG.durations.SPEAKING_TRANSITION;
    if (isSpeaking) {
      animatedY.value = withTiming(getTargetY("center"), { duration });
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.speaking, {
        duration,
      });
    } else {
      animatedY.value = withTiming(getTargetY(position), { duration });
      baseRadiusValue.value = withTiming(RADIUS_CONFIG.baseRadius.default, {
        duration,
      });
    }
  }, [isSpeaking, baseRadiusValue, animatedY, position]);

  useEffect(() => {
    if (isSpeaking) {
      radiusScale.value = withRepeat(
        withTiming(RADIUS_CONFIG.speakingScale, {
          duration: ANIMATION_CONFIG.durations.PULSE,
        }),
        -1,
        true
      );
    } else {
      radiusScale.value = withTiming(RADIUS_CONFIG.quietScale, {
        duration: ANIMATION_CONFIG.durations.QUIET_TRANSITION,
      });
    }
  }, [isSpeaking, radiusScale]);

  return (
    <View className="absolute inset-0">
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={center}
            r={animatedRadius}
            colors={[...SAGE_RECORDING_GRADIENT]}
          />

          <Blur blur={VISUAL_CONFIG.blur} mode={"clamp"} />
        </Rect>
      </Canvas>
    </View>
  );
};

export default React.memo(MindfulGradient);
