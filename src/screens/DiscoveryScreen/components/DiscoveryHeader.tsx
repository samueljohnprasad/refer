import React from "react";
import { View, Text } from "react-native";
import {
  AnimatedFireIcon,
  GrayFireIcon,
} from "@/src/components/ui/AnimatedStatIcon";

interface DiscoveryHeaderProps {
  currentStreak: number;
  isLoading: boolean;
}

type StreakStatus = "active" | "inactive";

const STREAK_PRESENTATION: Record<
  StreakStatus,
  {
    FireIcon: React.ComponentType<{ width?: number; height?: number }>;
    iconClassName?: string;
    textClassName: string;
  }
> = {
  active: {
    FireIcon: AnimatedFireIcon,
    iconClassName: "opacity-80",
    textClassName: "text-[13px] text-bee-dark/80 happy-font-body-bold",
  },
  inactive: {
    FireIcon: GrayFireIcon,
    textClassName: "text-[13px] text-ink-soft happy-font-body-bold",
  },
};

export const DiscoveryHeader = React.memo<DiscoveryHeaderProps>(
  ({ currentStreak, isLoading }) => {
    const status: StreakStatus = currentStreak > 0 ? "active" : "inactive";
    const presentation = STREAK_PRESENTATION[status];
    const FireIcon = presentation.FireIcon;

    return (
      <View className="flex-row items-center justify-end h-9 px-1">
        {/* ponytail: softened quiet streak badge with reduced border contrast and warm tone */}
        <View className="flex-row items-center gap-1.5 rounded-full border border-amber-500/[0.08] bg-amber-500/[0.05] px-2.5 py-1">
          <View className={presentation.iconClassName}>
            <FireIcon width={15} height={15} />
          </View>
          <Text className={presentation.textClassName}>
            {formatStreakValue(currentStreak, isLoading)}
          </Text>
        </View>
      </View>
    );
  },
);

DiscoveryHeader.displayName = "DiscoveryHeader";

function formatStreakValue(currentStreak: number, isLoading: boolean): string {
  return isLoading ? "—" : String(currentStreak);
}
