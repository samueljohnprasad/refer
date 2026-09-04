import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "@/src/components/tw";

// ─── Reusable Animated Skeleton Element ───────────────────────────────────────

interface SkeletonElementProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: any;
}

const SkeletonElement: React.FC<SkeletonElementProps> = ({
  width,
  height,
  borderRadius = 8,
  className = "",
  style,
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#E5EBE5", // Light sage tint matching design system
        },
        style,
        animatedStyle,
      ]}
      className={className}
    />
  );
};

// ─── Screen Skeleton ────────────────────────────────────────────────────────

export const AchievementsSkeleton: React.FC = () => {

  return (
    <SafeAreaView
      className="happy-brand-screen"
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      edges={["left", "right"]}
    >
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* ── Hero Stat Section ── */}
        <View className="px-5 pt-4 pb-6 items-center">
          {/* Big Number "12" */}
          <SkeletonElement width={64} height={48} borderRadius={10} className="mb-2" />
          {/* Subtitle "Badges Unlocked" */}
          <SkeletonElement width={120} height={16} borderRadius={6} className="mb-6" />

          {/* Secondary Stat Cards (XP Earned | Mastery) */}
          <View className="flex-row items-center justify-center gap-6 w-full px-2">
            <View className="flex-1 bg-gray-50/80 px-4 py-3 rounded-2xl items-center justify-center gap-2">
              <SkeletonElement width={48} height={20} borderRadius={6} />
              <SkeletonElement width={72} height={12} borderRadius={4} />
            </View>
            <View className="flex-1 bg-gray-50/80 px-4 py-3 rounded-2xl items-center justify-center gap-2">
              <SkeletonElement width={48} height={20} borderRadius={6} />
              <SkeletonElement width={72} height={12} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* ── Category Sections ── */}
        {["Journaling", "Streaks", "Habits"].map((cat, catIdx) => (
          <View key={`cat-skel-${catIdx}`} className="mb-8 px-5">
            {/* Category Header */}
            <View className="flex-row items-center gap-3 mb-4">
              <SkeletonElement width={36} height={36} borderRadius={18} />
              <SkeletonElement width={100} height={18} borderRadius={6} />
            </View>

            {/* 3-Column Grid of Badges */}
            <View className="flex-row flex-wrap">
              {[1, 2, 3, 4, 5, 6].map((badgeIdx) => (
                <View
                  key={`badge-skel-${catIdx}-${badgeIdx}`}
                  className="items-center justify-center mb-6"
                  style={{ width: "33.33%" }}
                >
                  {/* Badge Icon */}
                  <SkeletonElement width={68} height={68} borderRadius={20} className="mb-2" />
                  {/* Badge Title */}
                  <SkeletonElement width={64} height={12} borderRadius={4} className="mb-1" />
                  {/* Badge Subtext */}
                  <SkeletonElement width={36} height={10} borderRadius={3} />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
