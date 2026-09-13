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
    iconClassName: "opacity-75",
    textClassName: "text-[12px] text-[#7A6B58] happy-font-body-bold",
  },
  inactive: {
    FireIcon: GrayFireIcon,
    textClassName: "text-[12px] text-[#9E9689] happy-font-body-bold",
  },
};

export const DiscoveryHeader = React.memo<DiscoveryHeaderProps>(
  ({ currentStreak, isLoading }) => {
    const status: StreakStatus = currentStreak > 0 ? "active" : "inactive";
    const presentation = STREAK_PRESENTATION[status];
    const FireIcon = presentation.FireIcon;

    return (
      <View className="flex-row items-center justify-end h-7 px-1">
        {/* ponytail: quiet compact streak pill with pale warm cream surface and subtle border */}
        <View className="flex-row items-center gap-1 rounded-full border border-[#EDE7DD] bg-[#FAF6F0] px-2 py-0.5">
          <View className={presentation.iconClassName}>
            <FireIcon width={13} height={13} />
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
