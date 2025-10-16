import React from "react";
import { Image, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { ArrowDown, ArrowUp } from "lucide-react-native";
import { emotions } from "@/assets/emojis";

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
    percentText: "67%",
    trend: "down",
    label: "anxiety",
    backgroundClass: "bg-rose-200",
    iconBackgroundClass: "bg-rose-400",
    rotateDeg: "-4deg",
    top: 0,
    left: 0,
    zIndex: 3,
    delay: 120,
  },
  {
    emoji: "good",
    percentText: "59%",
    trend: "up",
    label: "feel better",
    backgroundClass: "bg-amber-300",
    iconBackgroundClass: "bg-amber-400",
    rotateDeg: "4deg",
    top: 80,
    left: 50,
    zIndex: 4,
    delay: 200,
  },
  {
    emoji: "great",
    percentText: "61%",
    trend: "up",
    label: "confidence",
    backgroundClass: "bg-amber-200",
    iconBackgroundClass: "bg-amber-300",
    rotateDeg: "-4deg",
    top: 158,
    left: -20,
    zIndex: 1,
    delay: 260,
  },
] as const;

const StatCard: React.FC<{ cfg: StatCardConfig; scale: number }> = ({
  cfg,
  scale,
}) => {
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
  return (
    <View
      style={{
        transform: [{ rotate: rotateDeg ?? "0deg" }],
      }}
    >
      <Animated.View
        entering={FadeInDown.duration(420).delay(delay ?? 0)}
        style={{
          position: "absolute",
          top: (top ?? 0) * scale,
          left: (left ?? 0) * scale,
          zIndex: zIndex ?? 1,
          transform: [{ rotate: "9deg" }],
          // Consistent shadow across platforms
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 * scale },
          shadowOpacity: 0.16,
          shadowRadius: 12 * scale,
          elevation: 5,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.05)",
          borderRadius: 24 * scale,
          width: 190 * scale,
        }}
        className={[
          "rounded-3xl px-5 py-3 flex-row items-center ",
          backgroundClass,
        ].join(" ")}
      >
        <View
          className={[
            "w-12 h-12 rounded-full items-center justify-center mr-3 shadow",
          ].join(" ")}
          style={{ width: 48 * scale, height: 48 * scale }}
        >
          {/* <Text style={{ fontSize: 22 * scale }}>{emoji}</Text> */}
          <Image
            source={emotions[emoji as keyof typeof emotions]}
            style={{ width: 40 * scale, height: 40 * scale }}
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-baseline">
            <Text
              style={{
                fontSize: 26 * scale,
                lineHeight: 30 * scale,
                fontWeight: "800",
                color: "#0f172a",
                marginRight: 4,
              }}
            >
              {percentText}
            </Text>
            {trend === "up" ? (
              <ArrowUp size={Math.max(14, 16 * scale)} color="#16A34A" />
            ) : (
              <ArrowDown size={Math.max(14, 16 * scale)} color="#DC2626" />
            )}
          </View>
          <Text
            style={{
              fontSize: Math.max(12, 13 * scale),
              color: "#1f2937",
              marginTop: 2,
            }}
          >
            {label}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export const GreatCelebration: React.FC<GreatCelebrationProps> = ({
  title = "journaling can help you\nreach your goal!",
  subtitle = "according to studies, journaling helps improve mental health in 68% of people!",
  stats = defaultStats,
}: GreatCelebrationProps) => {
  const { width } = useWindowDimensions();
  const containerMax = Math.min(width - 48, 340); // account for px-6 horizontal padding
  const base = 320;
  const scale = Math.min(1.1, Math.max(0.85, containerMax / base));
  const cardWidth = 260 * scale;
  const baseLeft = (containerMax - cardWidth) / 2; // center cards, then add per-card offsets
  const stackHeight = 260 * scale;

  return (
    <View className="w-full px-6 pt-4 pb-6 items-cente">
      <Animated.View entering={FadeIn.duration(300)} className="mb-4">
        <Text className="text-3xl font-extrabold text-slate-900 text-center leading-9">
          {title}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(350).delay(80)} className="mb-6">
        <Text className="text-base text-slate-500 text-center leading-6">
          {subtitle}
        </Text>
      </Animated.View>

      <View className="mt-1 mb-8 w-full items-center justify-center ">
        <View
          className="relative ml-8"
          style={{ height: stackHeight, width: containerMax }}
        >
          {/* Cards stack overlapping */}
          <StatCard
            cfg={{ ...stats[0], left: baseLeft / scale + (stats[0].left ?? 0) }}
            scale={scale}
          />
          <StatCard
            cfg={{ ...stats[1], left: baseLeft / scale + (stats[1].left ?? 0) }}
            scale={scale}
          />
          <StatCard
            cfg={{ ...stats[2], left: baseLeft / scale + (stats[2].left ?? 0) }}
            scale={scale}
          />
        </View>
      </View>
    </View>
  );
};

export default GreatCelebration;
