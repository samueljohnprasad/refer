import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

export function CalorieSummarySkeleton() {
  return (
    <View className="items-center py-6">
      {/* Circular Progress Ring Placeholder */}
      <View className="items-center justify-center mb-6">
        <Skeleton width={180} height={180} radius={90} />
        <View className="absolute items-center justify-center">
          <Skeleton width={60} height={30} className="mb-1" />
          <Skeleton width={100} height={16} />
        </View>
      </View>

      {/* Macros Placeholders */}
      <HStack className="justify-between w-full px-4" space="md">
        {[1, 2, 3].map((i) => (
          <VStack key={i} className="flex-1 items-center" space="xs">
            <Skeleton width={40} height={14} />
            <Skeleton width={60} height={18} />
            <Skeleton width="100%" height={6} radius={3} className="mt-1" />
          </VStack>
        ))}
      </HStack>
    </View>
  );
}

export function MealEntrySkeleton() {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
      {/* Header Row */}
      <HStack className="justify-between items-center mb-3">
        <HStack space="sm" className="items-center">
          <Skeleton width={60} height={24} radius={12} />
          <Skeleton width={80} height={24} radius={12} />
        </HStack>
      </HStack>

      {/* Food Items */}
      <VStack space="sm" className="mb-3">
        {[1, 2].map((i) => (
          <HStack key={i} className="justify-between items-center bg-gray-50/50 p-2 rounded-xl">
            <HStack space="sm" className="items-center flex-1">
              <Skeleton width={40} height={40} radius={8} />
              <VStack space="xs" className="flex-1 mr-2">
                <Skeleton width="70%" height={16} />
                <Skeleton width="40%" height={12} />
              </VStack>
            </HStack>
            <VStack space="xs" className="items-end">
              <Skeleton width={40} height={16} />
              <Skeleton width={30} height={12} />
            </VStack>
          </HStack>
        ))}
      </VStack>

      {/* Macros Footer */}
      <HStack className="justify-between items-center pt-2 border-t border-gray-100">
        <Skeleton width={80} height={14} />
        <HStack space="sm">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={30} height={12} radius={6} />
          ))}
        </HStack>
      </HStack>
    </View>
  );
}
