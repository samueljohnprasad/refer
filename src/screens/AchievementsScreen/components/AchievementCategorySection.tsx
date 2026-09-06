import React, { memo } from "react";
import { View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  NoteIcon,
  Fire02Icon,
  TaskDone01Icon,
  StarsIcon,
  BarChartIcon,
  Medal01Icon,
} from "@hugeicons/core-free-icons";
import { AchievementBadge } from "@/src/components/Achievements";
import type { AchievementCategory } from "@/src/types/achievements";
import type { AchievementProgressItem } from "./AchievementBadgeDetailSheet";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

const CATEGORY_META: Record<AchievementCategory, { label: string; icon: any }> = {
  journaling: { label: "Journaling", icon: NoteIcon },
  streaks: { label: "Streaks", icon: Fire02Icon },
  habits: { label: "Habits", icon: TaskDone01Icon },
  wellness: { label: "Wellness", icon: StarsIcon },
  tracking: { label: "Tracking", icon: BarChartIcon },
};

interface AchievementCategorySectionProps {
  category: AchievementCategory;
  items: AchievementProgressItem[];
  onBadgePress: (item: AchievementProgressItem) => void;
}

// ponytail: unified brand-green category header & clean 3-col grid
export const AchievementCategorySection = memo(function AchievementCategorySection({
  category,
  items,
  onBadgePress,
}: AchievementCategorySectionProps) {
  if (items.length === 0) return null;
  const meta = CATEGORY_META[category] ?? { label: category, icon: Medal01Icon };

  return (
    <View className="mb-3.5 px-4">
      <View className="mb-1.5 flex-row items-center gap-2">
        <View className="h-7 w-7 items-center justify-center rounded-md bg-sage-100">
          <HugeiconsIcon
            icon={meta.icon}
            size={15}
            color={SEMANTIC_COLORS.brand.pressed}
            strokeWidth={2}
          />
        </View>
        <Text className="happy-font-body-bold text-[16px] text-ink">
          {meta.label}
        </Text>
      </View>

      <View className="flex-row flex-wrap">
        {items.map((item) => (
          <View
            key={item.achievement.id}
            className="items-center px-1"
            style={{ width: "33.333%" }}
          >
            <AchievementBadge
              achievement={item.achievement}
              currentProgress={item.currentProgress}
              isUnlocked={item.isUnlocked}
              onPress={() => onBadgePress(item)}
              showDescription={false}
              showProgressBar={false}
              showProgressText={true}
              showUnlockedProgress={false}
              size="md"
            />
          </View>
        ))}
      </View>
    </View>
  );
});
