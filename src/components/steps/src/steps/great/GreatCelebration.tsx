import React, { useEffect } from "react";
import { Image, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  interpolate,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { emotions } from "@/assets/emojis";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  SparklesIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

export type Trend = "up" | "down";

export interface StatCardConfig {
  emoji: string;
  percentText: string; // e.g., "67%"
  trend: Trend;
  label: string; // e.g., "anxiety"
  backgroundClass: string; // tailwind bg color for card
  iconBackgroundClass: string; // bg for circular emoji container
  rotateDeg?: string; // e.g., '-12deg'
  top?: number;
  left?: number;
  zIndex?: number;
  delay?: number; // ms for stagger animation
}

export interface GreatCelebrationProps {
  title?: string;
  subtitle?: string;
  stats?: readonly StatCardConfig[];
}

const defaultStats: readonly StatCardConfig[] = [
  {
    emoji: "terrible",
    percentText: "78%",
    trend: "down",
    label: "reduced stress",
    backgroundClass: "bg-rose-50",
    iconBackgroundClass: "bg-rose-400",
    rotateDeg: "-8deg",
    top: 0,
    left: 0,
    zIndex: 3,
    delay: 300,
  },
  {
    emoji: "good",
    percentText: "92%",
    trend: "up",
    label: "better mood",
    backgroundClass: "bg-green-50",
    iconBackgroundClass: "bg-green-400",
    rotateDeg: "8deg",
    top: 80,
    left: 50,
    zIndex: 4,
    delay: 500,
  },
  {
    emoji: "great",
    percentText: "95%",
    trend: "up",
    label: "life satisfaction",
    backgroundClass: "bg-blue-50",
    iconBackgroundClass: "bg-blue-400",
    rotateDeg: "-6deg",
    top: 158,
    left: -20,
    zIndex: 1,
    delay: 700,
  },
] as const;

const StatCard: React.FC<{
  cfg: StatCardConfig;
  scale: number;
  index: number;
}> = ({ cfg, scale, index }) => {
  const {
    emoji,
    percentText,
    trend,
    label,
    backgroundClass,
    iconBackgroundClass,
    rotateDeg,
    top,
    left,
    zIndex,
    delay,
  } = cfg;

  const cardRotation = useSharedValue(0);
  const cardScale = useSharedValue(0.8);

  useEffect(() => {
    cardRotation.value = withDelay(
      delay ?? 0,
      withSpring(1, { damping: 12, stiffness: 80 })
    );
    cardScale.value = withDelay(
      delay ?? 0,
      withSpring(1, { damping: 10, stiffness: 60 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            cardRotation.value,
            [0, 1],
            [0, parseInt(rotateDeg || "0")]
          )}deg`,
        },
        { scale: cardScale.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: (top ?? 0) * scale,
          left: (left ?? 0) * scale,
          zIndex: zIndex ?? 1,
        },
        animatedStyle,
      ]}
    >
      <Animated.View
        entering={FadeInDown.duration(600)
          .springify()
          .delay(delay ?? 0)}
        style={{
          borderRadius: 24 * scale,
          width: 210 * scale,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 * scale },
          shadowOpacity: 0.08,
          shadowRadius: 12 * scale,
          elevation: 4,
        }}
        className={[
          "rounded-3xl px-5 py-4 flex-row items-center",
          backgroundClass,
        ].join(" ")}
      >
        <View
          className="rounded-full items-center justify-center mr-3"
          style={{
            width: 50 * scale,
            height: 50 * scale,
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Image
            source={emotions[emoji as keyof typeof emotions]}
            style={{ width: 42 * scale, height: 42 * scale }}
            progressiveRenderingEnabled={true}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center">
            <Text
              style={{
                fontSize: 30 * scale,
                lineHeight: 34 * scale,
                fontWeight: "900",
                color: "#1F2937",
                marginRight: 8,
                letterSpacing: -0.5,
              }}
            >
              {percentText}
            </Text>
            {trend === "up" ? (
              <View
                style={{
                  backgroundColor: "rgba(16,185,129,0.15)",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <HugeiconsIcon
                  icon={ArrowUp01Icon}
                  size={Math.max(14, 16 * scale)}
                  color="#10B981"
                />
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "rgba(239,68,68,0.15)",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={Math.max(14, 16 * scale)}
                  color="#EF4444"
                />
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: Math.max(13, 14 * scale),
              color: "#6B7280",
              marginTop: 2,
              fontWeight: "600",
              letterSpacing: 0.2,
            }}
          >
            {label}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export const GreatCelebration: React.FC<GreatCelebrationProps> = ({
  title = "Welcome to Your Journey 🎆",
  subtitle = "Join 93% of users who transformed their lives through daily journaling",
  stats = defaultStats,
}: GreatCelebrationProps) => {
  const { width } = useWindowDimensions();
  const containerMax = Math.min(width - 48, 340);
  const base = 320;
  const scale = Math.min(1.1, Math.max(0.85, containerMax / base));
  const cardWidth = 260 * scale;
  const baseLeft = (containerMax - cardWidth) / 2;
  const stackHeight = 280 * scale;

  // Celebration animation values
  const titleScale = useSharedValue(0.9);

  useEffect(() => {
    titleScale.value = withDelay(
      100,
      withSpring(1, { damping: 20, stiffness: 80 })
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
      className="w-full px-4 pb-6 pt-4"
    >
      {/* Clean Title */}
      <Animated.View
        entering={FadeInUp.duration(500).springify()}
        style={titleAnimatedStyle}
        className="mb-2 mt-4"
      >
        <Text
          style={{
            fontSize: 36,
            fontFamily: "CormorantSemiBold",
            color: "#1f2937",
            textAlign: "center",
            letterSpacing: -0.5,
            lineHeight: 42,
          }}
        >
          {title}
        </Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        className="mb-8"
      >
        <Text
          style={{
            fontSize: 17,
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 26,
            paddingHorizontal: 16,
            fontWeight: "500",
          }}
        >
          {subtitle}
        </Text>
      </Animated.View>

      {/* Stats Cards */}
      <View className="mt-1 mb-4 w-full items-center justify-center">
        <View
          className="relative ml-8"
          style={{ height: stackHeight, width: containerMax }}
        >
          <StatCard
            cfg={{ ...stats[0], left: baseLeft / scale + (stats[0].left ?? 0) }}
            scale={scale}
            index={0}
          />
          <StatCard
            cfg={{ ...stats[1], left: baseLeft / scale + (stats[1].left ?? 0) }}
            scale={scale}
            index={1}
          />
          <StatCard
            cfg={{ ...stats[2], left: baseLeft / scale + (stats[2].left ?? 0) }}
            scale={scale}
            index={2}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default GreatCelebration;
