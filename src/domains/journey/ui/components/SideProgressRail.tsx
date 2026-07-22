import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/src/components/ui/Text";
import {
  useRailIconViewModel,
  useSideProgressRailViewModel,
  type SideProgressRailProps,
  type RailIconProps,
} from "../hooks/useSideProgressRailViewModel";

export interface RailIconViewProps
  extends ReturnType<typeof useRailIconViewModel>,
    RailIconProps {}

/**
 * Presentational View component for RailIcon.
 * Strictly contains JSX code without internal hooks.
 */
export const RailIconView = React.memo(function RailIconView({
  icon,
  value,
  backgroundColor,
  borderColor,
  handlePress,
  accessibilityLabel,
}: RailIconViewProps): React.JSX.Element {
  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="items-center mb-3"
    >
      <View
        className="w-14 h-14 rounded-2xl items-center justify-center"
        style={{
          backgroundColor,
          borderWidth: 2,
          borderColor,
          borderBottomWidth: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className="text-xs font-bold mt-1" style={{ color: "#4A5568" }}>
        {value}
      </Text>
    </Pressable>
  );
});

function RailIcon(props: RailIconProps): React.JSX.Element {
  const viewModel = useRailIconViewModel({ onPress: props.onPress });
  return <RailIconView {...viewModel} {...props} />;
}

export interface SideProgressRailViewProps
  extends ReturnType<typeof useSideProgressRailViewModel> {}

/**
 * Presentational View component for SideProgressRail.
 * Strictly contains JSX code without internal hooks.
 */
export const SideProgressRailView = React.memo(function SideProgressRailView({
  stats,
  onXPPress,
  onHeartsPress,
  onStreakPress,
}: SideProgressRailViewProps): React.JSX.Element {
  return (
    <View
      className="absolute left-2 z-20 items-center"
      style={{ top: 120 }}
      pointerEvents="box-none"
      accessibilityRole="summary"
      accessibilityLabel="Progress stats"
    >
      <RailIcon
        icon="🏋️"
        value={`${stats.totalXP}`}
        backgroundColor="#E0F2FE"
        borderColor="#7DD3FC"
        onPress={onXPPress}
        accessibilityLabel={`Total XP: ${stats.totalXP}`}
      />

      <RailIcon
        icon="❤️"
        value={`${stats.hearts}`}
        backgroundColor="#FEE2E2"
        borderColor="#FCA5A5"
        onPress={onHeartsPress}
        accessibilityLabel={`Hearts: ${stats.hearts}`}
      />

      <RailIcon
        icon="⏳"
        value={`${stats.streakDays}`}
        backgroundColor="#E0E7FF"
        borderColor="#A5B4FC"
        onPress={onStreakPress}
        accessibilityLabel={`Streak: ${stats.streakDays} days`}
      />
    </View>
  );
});

/**
 * Container component for SideProgressRail.
 */
function SideProgressRail(props: SideProgressRailProps): React.JSX.Element {
  const viewModel = useSideProgressRailViewModel(props);
  return <SideProgressRailView {...viewModel} />;
}

export default React.memo(SideProgressRail);
export type { SideProgressRailProps };
