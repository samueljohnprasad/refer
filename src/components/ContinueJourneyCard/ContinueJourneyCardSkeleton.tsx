// src/components/ContinueJourneyCard/ContinueJourneyCardSkeleton.tsx
// ponytail: compact skeleton loader matching final card dimensions

import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/src/components/ui/Skeleton";

export function ContinueJourneyCardSkeleton(): React.JSX.Element {
  return (
    <View
      className="rounded-2xl border border-sand/40 bg-surface-card p-4"
      accessibilityRole="progressbar"
      accessibilityLabel="Loading learning journey"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          {/* Course title skeleton */}
          <Skeleton width="45%" height={14} radius={6} className="mb-2" />
          {/* Next activity title skeleton */}
          <Skeleton width="75%" height={18} radius={6} className="mb-2" />
          {/* Duration skeleton */}
          <Skeleton width="25%" height={12} radius={4} />
        </View>
        {/* Course icon/artwork thumbnail skeleton */}
        <Skeleton width={44} height={44} radius={22} />
      </View>
      {/* Bottom action button skeleton */}
      <View className="mt-3 pt-2 border-t border-sand/20 flex-row justify-between items-center">
        <Skeleton width="35%" height={14} radius={4} />
        <Skeleton width={16} height={16} radius={8} />
      </View>
    </View>
  );
}
