import React from "react";
import { View, Text } from "react-native";
import { AnimatedFireIcon, GrayFireIcon } from "@/src/components/ui/AnimatedStatIcon";

interface DiscoveryHeaderProps {
  currentStreak: number;
  isLoading: boolean;
}

export const DiscoveryHeader = React.memo<DiscoveryHeaderProps>(
  ({ currentStreak, isLoading }) => {
    const isStreakActive = currentStreak > 0;
    const FireIcon = isStreakActive ? AnimatedFireIcon : GrayFireIcon;

    return (
      <View className="flex-row items-center justify-end h-9 px-1">
        {/* ponytail: softened quiet streak badge with reduced border contrast and warm tone */}
        <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/[0.06] border border-amber-500/10">
          <FireIcon width={15} height={15} />
          <Text
            className={
              isStreakActive
                ? "text-amber-800/75 text-sm happy-font-body-bold"
                : "text-ink-muted text-sm happy-font-body-bold"
            }
          >
            {isLoading ? "—" : currentStreak}
          </Text>
        </View>
      </View>
    );
  }
);

DiscoveryHeader.displayName = "DiscoveryHeader";
