import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

export function JournalCardSkeleton() {
  return (
    <View className="bg-sage-50 rounded-[20px] p-4 mb-3">
      {/* Header & Metadata */}
      <View className="mb-2">
        <Skeleton width="50%" height={18} radius={4} className="mb-2" />
        <Skeleton width="40%" height={12} radius={4} />
      </View>

      {/* Excerpt */}
      <VStack space="xs" className="mt-2">
        <Skeleton width="100%" height={14} radius={4} />
        <Skeleton width="85%" height={14} radius={4} />
      </VStack>
    </View>
  );
}

export function JournalTabSkeleton() {
  return (
    <View className="flex-1 mt-4">
      <JournalCardSkeleton />
      <JournalCardSkeleton />
      <JournalCardSkeleton />
    </View>
  );
}
