import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

export function HabitCardSkeleton() {
  return (
    <View className="py-3 flex-row items-center justify-between">
      <HStack space="md" className="items-center flex-1">
        {/* Icon Circle */}
        <Skeleton width={48} height={48} radius={24} />
        {/* Title */}
        <VStack space="xs" className="flex-1">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </VStack>
      </HStack>
      {/* Check button circle */}
      <Skeleton width={40} height={40} radius={20} />
    </View>
  );
}

export function HabitCategorySkeleton() {
  return (
    <View className="mt-4">
      {/* Category Header */}
      <View className="px-5 mb-2 mt-2">
        <Skeleton width={80} height={14} radius={4} />
      </View>
      {/* Cards */}
      <HabitCardSkeleton />
      <HabitCardSkeleton />
    </View>
  );
}
