import React from "react";
import { ScrollView, Pressable, Animated, View } from "react-native";
import { Text } from "@/components/ui/text";
import { format } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { InsightsTypeResponse } from "../types";
import BlurModal from "@/screens/components/BlurModal";
import { Emotion, emotions, great } from "@/assets/emojis";
import { Image } from "@/components/ui/image";

interface EntryCardsViewProps {
  entries: InsightsTypeResponse[];
  isLoading: boolean;
  onEntryPress: (entry: InsightsTypeResponse) => void;
  onRefresh?: () => void;
}

export const EntryCardsView: React.FC<EntryCardsViewProps> = ({
  entries,
  isLoading,
  onEntryPress,
  onRefresh,
}) => {
  if (isLoading) {
    return (
      <View>
        <Text className="text-lg font-semibold text-gray-800">
          Journal Entries
        </Text>
        <View className="gap-3">
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              className="bg-white rounded-2xl p-4 shadow-sm animate-pulse"
            >
              <View className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
              <View className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
              <View className="h-3 bg-gray-200 rounded w-full" />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-800">
            Journal Entries
          </Text>
          {onRefresh && (
            <Feather
              name="refresh-cw"
              size={20}
              color="#6b7280"
              onPress={onRefresh}
            />
          )}
        </View>

        <View className="bg-gray-50 rounded-2xl p-8 items-center">
          <Feather name="book-open" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-4 text-base">
            No journal entries for this day yet
          </Text>
          <Text className="text-gray-400 text-center mt-2 text-sm">
            Your thoughts and reflections will appear here
          </Text>
        </View>
      </View>
    );
  }

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: Record<string, string> = {
      anxious: "😟",
      calm: "😌",
      hopeful: "🌟",
      stressed: "😓",
      peaceful: "🕊️",
      grateful: "🙏",
      sad: "😢",
      excited: "🎉",
      neutral: "😐",
      confident: "💪",
      overwhelmed: "🤯",
      confused: "🤔",
    };
    return moodEmojis[mood] || "😐";
  };

  const getEntryTypeIcon = (type: "voice" | "text"): string => {
    return type === "voice" ? "mic" : "edit-3";
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-800">
          Journal Entries ({entries.length})
        </Text>
        {onRefresh && (
          <Feather
            name="refresh-cw"
            size={20}
            color="#6b7280"
            onPress={onRefresh}
          />
        )}
      </View>

      <View className="gap-3">
        {entries.map((entry, index) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onPress={() => onEntryPress(entry)}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};

interface EntryCardProps {
  entry: InsightsTypeResponse;
  onPress: () => void;
  index: number;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onPress, index }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Staggered entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // Stagger by 100ms
      useNativeDriver: true,
    }).start();
  }, [index]);

  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: Record<string, string> = {
      anxious: "😟",
      calm: "😌",
      hopeful: "🌟",
      stressed: "😓",
      peaceful: "🕊️",
      grateful: "🙏",
      sad: "😢",
      excited: "🎉",
      neutral: "😐",
      confident: "💪",
      overwhelmed: "🤯",
      confused: "🤔",
    };
    return moodEmojis[mood] || "😐";
  };

  const getEntryTypeIcon = (type: "voice" | "text"): string => {
    return type === "voice" ? "mic" : "edit-3";
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMoodIntensityColor = (intensity: number): string => {
    if (intensity >= 8) return "bg-green-100 text-green-800";
    if (intensity >= 6) return "bg-yellow-100 text-yellow-800";
    if (intensity >= 4) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        className="bg-white rounded-2xl p-4  shadow-sm"
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-base font-semibold text-gray-800 mb-1">
              {entry.title}
            </Text>
            <View className="flex-row items-center">
              {entry.created_at && (
                <Text className="text-sm text-gray-500">
                  {format(new Date(entry.created_at), "h:mm a")}
                </Text>
              )}
              <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
              {/* <Feather
                name={getEntryTypeIcon(entry.entryType) as any}
                size={12}
                color="#6B7280"
              /> */}
              {/* {entry.entryType === "voice" && entry.duration && (
                <>
                  <Text className="text-sm text-gray-500 ml-1">
                    {formatDuration(entry.duration)}
                  </Text>
                </>
              )} */}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-2xl mb-1">
              <Image
                source={emotions[entry.mainEmoji as Emotion]}
                className="w-10 h-10"
                alt={entry.mainEmoji}
              />
            </Text>
            {/* <View
              className={`px-2 py-1 rounded-full ${getMoodIntensityColor(
                entry.moodScore || 0
              )}`}
            >
              <Text className="text-xs font-medium">
                {entry.moodScore || 0}/5
              </Text>
            </View> */}
          </View>
        </View>

        {/* Excerpt */}
        <Text className="text-gray-700 text-sm leading-5 mb-3">
          {entry.enrichedTranscript?.substring(0, 100) + "..."}
        </Text>

        {/* Emotion Tags */}
        <View className="flex-row flex-wrap mb-3">
          {(entry.feelings || []).map((emotion, idx) => (
            <View
              key={`${emotion}-${idx}`}
              className="bg-blue-50 rounded-full px-2 py-1 mr-2 mb-1"
            >
              <Text className="text-blue-700 text-xs font-medium capitalize">
                {emotion.emoji} {emotion.name}
              </Text>
            </View>
          ))}
          {/* {entry.emotions.length > 3 && (
            <View className="bg-gray-100 rounded-full px-2 py-1">
              <Text className="text-gray-600 text-xs">
                +{entry.emotions.length - 3} more
              </Text>
            </View>
          )} */}
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
          <Text className="text-xs text-gray-500 capitalize">
            {entry.mainEmoji} mood
          </Text>
          <View className="flex-row items-center">
            <Text className="text-xs text-gray-500 mr-1">
              Tap to view full entry
            </Text>
            <Feather name="chevron-right" size={14} color="#9CA3AF" />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};
