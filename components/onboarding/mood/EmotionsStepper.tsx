import React from "react";
import { Image, Pressable, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { Emotion, emotions } from "@/assets/emojis";

export interface EmotionsStepperProps {
  order: ReadonlyArray<Emotion>;
  activeIndex: number;
  celebrate?: boolean;
  variant?: "light" | "dark";
  animateActive?: boolean; // kept for API compat (no bounce used)
  onSelect?: (emotion: Emotion) => void;
}

const EMOJI_SIZE = 22;
const RING_EXTRA = 4; // ring diameter = EMOJI_SIZE + RING_EXTRA
const ITEM_SPACING = 8; // horizontal space between items
// Slightly taller container than the ring to create a soft capsule background
const CONTAINER_HEIGHT = EMOJI_SIZE + RING_EXTRA + 6;

const EmotionsStepper: React.FC<EmotionsStepperProps> = ({
  order,
  activeIndex,
  celebrate = false,
  variant,
  animateActive = true, // not used for bounce; retained for compatibility
  onSelect,
}) => {
  const active = useDerivedValue(() =>
    withTiming(activeIndex, { duration: 300, easing: Easing.out(Easing.cubic) })
  );

  // Measure available width to animate the progress fill width
  const containerW = useSharedValue<number>(0);

  const themeVariant =
    variant ?? (activeIndex === 2 || activeIndex === 3 ? "dark" : "light");
  const ringColor =
    themeVariant === "light" ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.15)";

  // Animated style for the progressive fill (from left up to current step)
  const fillStyle = useAnimatedStyle(() => {
    const total = order.length;
    const clampedRatio = Math.max(0, Math.min(1, (active.value + 1) / total));
    const targetWidth = containerW.value * clampedRatio;
    return {
      width: withTiming(targetWidth, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  const EmotionItem: React.FC<{
    idx: number;
    emotionKey: Emotion;
    active: SharedValue<number>;
    ringColor: string;
    celebrate: boolean;
    onSelect?: (emotion: Emotion) => void;
  }> = ({ idx, emotionKey, active, ringColor, celebrate, onSelect }) => {
    const nearest = useDerivedValue(() => Math.round(active.value));
    const targetOpacity = useDerivedValue(() => {
      if (celebrate) return 1;
      if (nearest.value === idx) return 1;
      return active.value > idx ? 0.7 : 0.4;
    }, [celebrate]);

    const animatedOpacity = useDerivedValue(() =>
      withTiming(targetOpacity.value, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      })
    );

    const style = useAnimatedStyle(() => ({ opacity: animatedOpacity.value }));

    const targetRingOpacity = useDerivedValue(() =>
      nearest.value === idx ? 1 : 0
    );
    const animatedRingOpacity = useDerivedValue(() =>
      withTiming(targetRingOpacity.value, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      })
    );
    const ringStyle = useAnimatedStyle(() => ({
      opacity: animatedRingOpacity.value,
    }));

    const content = (
      <View
        style={{
          width: EMOJI_SIZE + RING_EXTRA,
          height: EMOJI_SIZE + RING_EXTRA,
          alignItems: "center",
          justifyContent: "center",
          // marginHorizontal: ITEM_SPACING / 2,
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              width: EMOJI_SIZE + RING_EXTRA,
              height: EMOJI_SIZE + RING_EXTRA,
              borderRadius: (EMOJI_SIZE + RING_EXTRA) / 2,
              backgroundColor: ringColor,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            },
            ringStyle,
          ]}
        />
        <Animated.View style={[style]}>
          <Image
            source={emotions[emotionKey]}
            style={{ width: EMOJI_SIZE, height: EMOJI_SIZE }}
          />
        </Animated.View>
      </View>
    );

    return onSelect ? (
      <Pressable onPress={() => onSelect(emotionKey)}>{content}</Pressable>
    ) : (
      <View>{content}</View>
    );
  };

  return (
    <View
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        containerW.value = w;
      }}
      style={{
        // width: "100%",
        // paddingHorizontal: 5,
        height: CONTAINER_HEIGHT,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderRadius: CONTAINER_HEIGHT / 2,
        overflow: "hidden",
        gap: 30,
        paddingHorizontal: 10,

        // paddingVertical: 2,
        // paddingHorizontal: 2,
      }}
    >
      {/* Progressive fill background */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            height: CONTAINER_HEIGHT,
            borderRadius: CONTAINER_HEIGHT / 2,
            overflow: "hidden",
          },
          fillStyle,
        ]}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={
            themeVariant === "light"
              ? ["#8B5CF6", "#6366F1", "#60A5FA"]
              : ["#6B7280", "#4B5563", "#374151"]
          }
          style={{ flex: 1, opacity: celebrate ? 1 : 0.9 }}
        />
      </Animated.View>
      {order.map((key, idx) => (
        <EmotionItem
          key={`${key}-${idx}`}
          idx={idx}
          emotionKey={key}
          active={active}
          ringColor={ringColor}
          celebrate={celebrate}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
};

const propsAreEqual = (
  prev: EmotionsStepperProps,
  next: EmotionsStepperProps
): boolean => {
  if (
    prev.activeIndex !== next.activeIndex ||
    prev.celebrate !== next.celebrate ||
    prev.variant !== next.variant ||
    prev.onSelect !== next.onSelect ||
    prev.order.length !== next.order.length
  ) {
    return false;
  }
  for (let i = 0; i < prev.order.length; i += 1) {
    if (prev.order[i] !== next.order[i]) return false;
  }
  return true;
};

export default React.memo(EmotionsStepper, propsAreEqual);
