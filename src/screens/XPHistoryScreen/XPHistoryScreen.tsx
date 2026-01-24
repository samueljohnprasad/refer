import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  StarsIcon,
  ArrowLeft02Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useXP } from "@/src/context/XPContext";
import { XPHistoryEntry, XP_ACTION_LABELS, XPActionType } from "@/src/types/xp";
import { LevelProgressBar } from "@/src/components/Level";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { router } from "expo-router";

dayjs.extend(relativeTime);

interface XPHistoryItemProps {
  entry: XPHistoryEntry;
}

const getActionEmoji = (action: XPActionType): string => {
  const emojis: Record<XPActionType, string> = {
    [XPActionType.MOOD_LOG]: "😊",
    [XPActionType.JOURNAL_ENTRY]: "📝",
    [XPActionType.VOICE_JOURNAL]: "🎤",
    [XPActionType.IMAGE_JOURNAL]: "📸",
    [XPActionType.WELLNESS_PROMPT]: "💭",
    [XPActionType.WEEKLY_REFLECTION]: "📊",
    [XPActionType.HABIT_COMPLETION]: "✅",
    [XPActionType.CALORIE_LOG]: "🍽️",
  };
  return emojis[action] || "⭐";
};

const XPHistoryItem: React.FC<XPHistoryItemProps> = ({ entry }) => {
  const timeAgo = dayjs(entry.timestamp).fromNow();

  return (
    <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-100">
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center mr-3">
          <Text className="text-lg">{getActionEmoji(entry.action)}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-medium">
            {entry.description || XP_ACTION_LABELS[entry.action]}
          </Text>
          <Text className="text-gray-500 text-xs mt-0.5">{timeAgo}</Text>
        </View>
      </View>
      <View className="bg-yellow-400 rounded-full px-3 py-1">
        <Text className="text-yellow-900 font-bold text-sm">
          +{entry.amount}
        </Text>
      </View>
    </View>
  );
};

export const XPHistoryScreen: React.FC = () => {
  const { totalXP, todayXP, getXPHistory, history, isLoading } = useXP();
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    // Load history on mount
    getXPHistory(100);
  }, []);

  const handleLoadMore = async (): Promise<void> => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    await getXPHistory(history.length + 50);
    setIsLoadingMore(false);
  };

  const renderHeader = (): React.ReactElement => (
    <View className="bg-gradient-to-b from-yellow-50 to-white px-4 pb-6">
      {/* Level Progress */}
      <View className="mt-4">
        <LevelProgressBar showBadge={true} compact={false} />
      </View>

      {/* XP Stats */}
      <View className="flex-row justify-center gap-8 mt-4">
        <View className="items-center">
          <View className="flex-row items-center">
            <HugeiconsIcon icon={StarsIcon} size={28} color="#EAB308" />
            <Text className="text-3xl font-bold text-gray-900 ml-2">
              {totalXP.toLocaleString()}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mt-1">Total XP</Text>
        </View>

        <View className="w-px bg-gray-200" />

        <View className="items-center">
          <View className="flex-row items-center">
            <HugeiconsIcon icon={Calendar03Icon} size={24} color="#22C55E" />
            <Text className="text-2xl font-bold text-green-600 ml-2">
              +{todayXP}
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mt-1">Today</Text>
        </View>
      </View>

      {/* Section Title */}
      <Text className="text-lg font-semibold text-gray-900 mt-6">
        XP History
      </Text>
    </View>
  );

  const renderEmpty = (): React.ReactElement => (
    <View className="items-center justify-center py-16">
      <HugeiconsIcon icon={StarsIcon} size={48} color="#D1D5DB" />
      <Text className="text-gray-500 text-base mt-4">No XP earned yet</Text>
      <Text className="text-gray-400 text-sm mt-1">
        Start journaling to earn XP!
      </Text>
    </View>
  );

  const renderFooter = (): React.ReactElement | null => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#EAB308" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#EAB308" />
        <Text className="text-gray-500 mt-4">Loading XP...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">XP Progress</Text>
        <View className="w-10" />
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <XPHistoryItem entry={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
};

export default XPHistoryScreen;
