import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft02Icon,
  Medal01Icon,
  StarsIcon,
  Fire02Icon,
  NoteIcon,
  TaskDone01Icon,
  Yoga01Icon,
  BarChartIcon,
} from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { router } from "expo-router";
import { useAchievements } from "@/hooks/data/useAchievements";
import { AchievementBadge } from "@/src/components/Achievements";
import {
  AchievementCategory,
  ACHIEVEMENTS,
  BADGE_COLORS,
} from "@/src/types/achievements";

const CATEGORY_CONFIG: Record<
  AchievementCategory,
  { label: string; icon: any; color: string }
> = {
  journaling: {
    label: "Journaling",
    icon: NoteIcon,
    color: BADGE_COLORS.journaling,
  },
  streaks: { label: "Streaks", icon: Fire02Icon, color: BADGE_COLORS.streaks },
  habits: { label: "Habits", icon: TaskDone01Icon, color: BADGE_COLORS.habits },
  wellness: {
    label: "Wellness",
    icon: StarsIcon,
    color: BADGE_COLORS.wellness,
  },
  tracking: {
    label: "Tracking",
    icon: BarChartIcon,
    color: BADGE_COLORS.tracking,
  },
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtext,
  color,
  progress,
}) => (
  <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
    <View className="flex-row items-center justify-between mb-2">
      <View className="flex-row items-center">
        {icon}
        <Text className="text-gray-700 font-medium ml-2">{label}</Text>
      </View>
      <Text className="text-xl font-bold" style={{ color }}>
        {value}
      </Text>
    </View>
    <Text className="text-gray-400 text-xs mb-2">{subtext}</Text>
    {progress !== undefined && (
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: color,
          }}
        />
      </View>
    )}
  </View>
);

export const AchievementsScreen: React.FC = () => {
  const { achievements, isLoading, unlockedAchievements } = useAchievements();

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const totalXPEarned = unlockedAchievements.reduce(
    (sum, a) => sum + a.xpAwarded,
    0,
  );

  const getAchievementsByCategory = (category: AchievementCategory) => {
    return achievements.filter((a) => a.achievement.category === category);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-gray-500 mt-4">Loading achievements...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Your Stats Section */}
        <View className="px-4 pt-4">
          <View className="flex-row items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Your Stats</Text>
            <View className="ml-auto w-12 h-12 rounded-full bg-white border border-gray-100 items-center justify-center">
              <HugeiconsIcon icon={Medal01Icon} size={24} color="#F59E0B" />
            </View>
          </View>

          {/* Stats Cards */}
          <StatCard
            icon={
              <View className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-50 items-center justify-center">
                <HugeiconsIcon
                  icon={Medal01Icon}
                  size={18}
                  color="#7B61FF"
                  strokeWidth={1.8}
                />
              </View>
            }
            label="Badges Unlocked"
            value={String(unlockedCount)}
            subtext={`${unlockedCount}/${totalCount}`}
            color="#7B61FF"
            progress={(unlockedCount / totalCount) * 100}
          />

          <StatCard
            icon={
              <View className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-50 items-center justify-center">
                <HugeiconsIcon icon={StarsIcon} size={18} color="#F59E0B" />
              </View>
            }
            label="XP Earned from Badges"
            value={`${totalXPEarned}pts`}
            subtext="Keep earning more!"
            color="#F59E0B"
          />

          <StatCard
            icon={
              <View className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-50 items-center justify-center">
                <HugeiconsIcon icon={Fire02Icon} size={18} color="#6366F1" />
              </View>
            }
            label="Categories Mastered"
            value={`${
              Object.keys(CATEGORY_CONFIG).filter((cat) =>
                getAchievementsByCategory(cat as AchievementCategory).every(
                  (a) => a.isUnlocked,
                ),
              ).length
            }/5`}
            subtext="Complete all badges in a category"
            color="#6366F1"
          />
        </View>

        {/* Achievements Title */}
        <View className="px-4 mt-6 mb-3">
          <Text className="text-xl font-bold text-gray-900">Achievements</Text>
        </View>

        {/* Achievement Categories */}
        {(Object.keys(CATEGORY_CONFIG) as AchievementCategory[]).map(
          (category) => {
            const categoryAchievements = getAchievementsByCategory(category);
            if (categoryAchievements.length === 0) return null;

            const {
              label,
              icon: categoryIcon,
              color,
            } = CATEGORY_CONFIG[category];
            const categoryUnlocked = categoryAchievements.filter(
              (a) => a.isUnlocked,
            ).length;

            return (
              <View key={category} className="mb-6 px-4">
                {/* Category Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                      style={{ backgroundColor: color + "20" }}
                    >
                      <HugeiconsIcon
                        icon={categoryIcon}
                        size={16}
                        color={color}
                        strokeWidth={1.8}
                      />
                    </View>
                    <Text className="text-lg font-semibold text-gray-900">
                      {label}
                    </Text>
                  </View>
                  <View className="bg-gray-100 px-2 py-1 rounded-full">
                    <Text className="text-xs font-medium text-gray-600">
                      {categoryUnlocked}/{categoryAchievements.length}
                    </Text>
                  </View>
                </View>

                {/* Badges Grid */}
                <View className="bg-white rounded-2xl p-4 border border-gray-100">
                  <View className="flex-row flex-wrap justify-start">
                    {categoryAchievements.map((item) => (
                      <View key={item.achievement.id} style={{ width: "33%" }}>
                        <AchievementBadge
                          achievement={item.achievement}
                          isUnlocked={item.isUnlocked}
                          currentProgress={item.currentProgress}
                          size="md"
                          showProgress={!item.isUnlocked}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          },
        )}

        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default AchievementsScreen;
