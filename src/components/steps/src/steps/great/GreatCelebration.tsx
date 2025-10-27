import React, { useEffect } from "react";
import { Image, ScrollView, View, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { ArrowDown, ArrowUp, Sparkles, Star } from "lucide-react-native";
import { emotions } from "@/assets/emojis";
import LottieView from "lottie-react-native";

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
    backgroundClass: "bg-gradient-to-br from-pink-100 to-rose-200",
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
    backgroundClass: "bg-gradient-to-br from-amber-100 to-yellow-200",
    iconBackgroundClass: "bg-amber-400",
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
    backgroundClass: "bg-gradient-to-br from-purple-100 to-indigo-200",
    iconBackgroundClass: "bg-indigo-400",
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
          // Premium shadows with depth
          shadowColor: "#7C3AED",
          shadowOffset: { width: 0, height: 8 * scale },
          shadowOpacity: 0.25,
          shadowRadius: 20 * scale,
          elevation: 10,
        },
        animatedStyle,
      ]}
    >
      <Animated.View
        entering={FadeInDown.duration(600)
          .springify()
          .delay(delay ?? 0)}
        style={{
          borderWidth: 2,
          borderColor: "rgba(124,58,237,0.15)",
          borderRadius: 24 * scale,
          width: 210 * scale,
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
        className={[
          "rounded-3xl px-5 py-4 flex-row items-center",
          backgroundClass,
        ].join(" ")}
      >
        {/* Shimmer effect */}
        <View
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            opacity: 0.6,
          }}
        >
          <Sparkles size={20 * scale} color="#FCD34D" />
        </View>

        <View
          className="rounded-full items-center justify-center mr-3"
          style={{
            width: 50 * scale,
            height: 50 * scale,
            backgroundColor: "rgba(255,255,255,0.8)",
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
                color: "#0F172A",
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
                  padding: 2,
                }}
              >
                <ArrowUp
                  size={Math.max(14, 16 * scale)}
                  color="#10B981"
                  strokeWidth={3}
                />
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "rgba(239,68,68,0.15)",
                  borderRadius: 12,
                  padding: 2,
                }}
              >
                <ArrowDown
                  size={Math.max(14, 16 * scale)}
                  color="#EF4444"
                  strokeWidth={3}
                />
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: Math.max(13, 14 * scale),
              color: "#334155",
              marginTop: 2,
              fontWeight: "700",
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
  const confettiOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withDelay(
      100,
      withSpring(1, { damping: 20, stiffness: 80 })
    );
    confettiOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 800, easing: Easing.ease })
    );
    sparkleRotation.value = withSequence(
      withDelay(
        800,
        withTiming(360, { duration: 2000, easing: Easing.linear })
      ),
      withTiming(0, { duration: 0 })
    );
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const confettiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{ alignItems: "center" }}
      className="w-full px-4 pb-6 pt-12"
    >
      {/* Premium Floating Particles */}
      <Animated.View
        style={[
          confettiAnimatedStyle,
          {
            position: "absolute",
            top: -30,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 10,
          },
        ]}
      >
        <View className="flex-row gap-3">
          <Animated.Text style={[{ fontSize: 26 }, sparkleAnimatedStyle]}>
            🌟
          </Animated.Text>
          <Text style={{ fontSize: 30 }}>✨</Text>
          <Animated.Text style={[{ fontSize: 26 }, sparkleAnimatedStyle]}>
            🌟
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Additional Floating Elements */}
      <Animated.View
        entering={FadeIn.duration(800).delay(400)}
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          opacity: 0.7,
        }}
      >
        <Text style={{ fontSize: 20 }}>💫</Text>
      </Animated.View>
      <Animated.View
        entering={FadeIn.duration(800).delay(600)}
        style={{
          position: "absolute",
          top: 100,
          right: 30,
          opacity: 0.6,
        }}
      >
        <Text style={{ fontSize: 18 }}>⭐</Text>
      </Animated.View>

      {/* Premium Title with Glass Effect */}
      <Animated.View
        entering={FadeInUp.duration(500).springify()}
        style={titleAnimatedStyle}
        className="mb-4"
      >
        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.3)",
            shadowColor: "#7C3AED",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#0F172A",
              textAlign: "center",
              letterSpacing: -1,
              lineHeight: 42,
            }}
          >
            {title}
          </Text>
        </View>
      </Animated.View>

      {/* Premium Success Badge with Glow */}
      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        className="mb-6"
      >
        <Text
          style={{
            fontSize: 17,
            color: "#475569",
            textAlign: "center",
            lineHeight: 26,
            paddingHorizontal: 16,
            fontWeight: "500",
          }}
        >
          {subtitle}
        </Text>
      </Animated.View>

      {/* Animated Sparkles */}
      <Animated.View
        style={[
          sparkleAnimatedStyle,
          {
            position: "absolute",
            top: 60,
            right: 20,
            zIndex: 5,
          },
        ]}
      >
        <Star size={24} color="#FCD34D" fill="#FCD34D" />
      </Animated.View>

      {/* Premium Stats Cards */}
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
