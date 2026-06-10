import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Card } from "@/src/components/ui/Card";
import { SAGE, GOLD } from "@/lib/tokens";

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
  }, []);

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
          backgroundColor: "#E5EBE5", // Light sage gray
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
    >
      {/* ── Header ── */}
      <View className="flex-row items-center px-4 pt-2 pb-4">
        {/* Back Button */}
        <SkeletonElement width={44} height={44} borderRadius={22} className="mr-3" />
        
        {/* Title & Subtitle */}
        <View className="flex-1 min-w-0 justify-center gap-1.5">
          <SkeletonElement width="60%" height={24} borderRadius={6} />
          <SkeletonElement width="40%" height={14} borderRadius={4} />
        </View>

        {/* XP Pill */}
        <SkeletonElement width={64} height={32} borderRadius={16} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
      >
        {/* ── Top Card ── */}
        <View className="px-4 pt-1 pb-4">
          <Card
            variant="tile"
            radius="lg"
            showDepth={false}
            contentClassName="px-4 py-3 flex-row items-center gap-3"
          >
            <SkeletonElement width={56} height={56} borderRadius={16} />
            <View className="flex-1 gap-2 py-1">
              <SkeletonElement width="50%" height={18} borderRadius={6} />
              <SkeletonElement width="85%" height={14} borderRadius={4} />
              <SkeletonElement width="70%" height={14} borderRadius={4} />
            </View>
          </Card>
        </View>

        {/* ── Your Progress ── */}
        <View className="px-4 pt-3 pb-2">
          {/* Eyebrow */}
          <SkeletonElement width={110} height={12} borderRadius={4} className="mb-3" />

          {/* Stat Cards (3) */}
          {[1, 2, 3].map((i) => (
            <Card
              key={`stat-${i}`}
              variant="tile"
              radius="lg"
              showDepth={true}
              className="mb-3"
              contentClassName="p-4"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2.5">
                  <SkeletonElement width={36} height={36} borderRadius={18} />
                  <SkeletonElement width={120} height={16} borderRadius={6} />
                </View>
                <View className="flex-row items-center gap-2">
                  <SkeletonElement width={28} height={28} borderRadius={8} />
                  <SkeletonElement width={14} height={14} borderRadius={7} />
                </View>
              </View>
              <SkeletonElement width="45%" height={12} borderRadius={4} className="mb-3 ml-11" />
              
              {/* Progress Bar Area */}
              <View className="mt-1">
                <SkeletonElement width="100%" height={6} borderRadius={3} />
                <View className="items-end mt-1.5">
                  <SkeletonElement width={24} height={10} borderRadius={3} />
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* ── All Badges ── */}
        <View className="px-4 mt-4 mb-3">
          <SkeletonElement width={80} height={12} borderRadius={4} />
        </View>

        {/* Category Block (2 examples) */}
        {[1, 2].map((catIndex) => (
          <View key={`cat-${catIndex}`} className="mb-6 px-4">
            <View className="mb-2.5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <SkeletonElement width={46} height={46} borderRadius={23} />
                <SkeletonElement width={90} height={20} borderRadius={6} />
              </View>
              <SkeletonElement width={44} height={28} borderRadius={14} />
            </View>

            <Card
              variant="tile"
              radius="lg"
              showDepth={false}
              contentClassName="px-2.5 py-3"
            >
              <View className="flex-row flex-wrap">
                {[1, 2, 3].map((badgeIndex) => (
                  <View
                    key={`badge-${badgeIndex}`}
                    className="items-center"
                    style={{ width: "33.333%", paddingVertical: 6 }}
                  >
                    {/* Badge Icon */}
                    <SkeletonElement width={64} height={64} borderRadius={16} className="mb-2" />
                    {/* Badge Title */}
                    <SkeletonElement width={40} height={12} borderRadius={4} />
                  </View>
                ))}
              </View>
            </Card>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
