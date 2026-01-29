import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  QUICK_JOURNAL_PROMPTS,
  QuickJournalPrompt,
} from "../DiscoveryScreen/QuickJournalSection";
import { useAtom, useSetAtom } from "jotai";
import { recorderOpenAtom } from "../DiscoveryScreen/helpers";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useJournalLimit } from "@/hooks/useJournalLimit";

// Extended prompts list with more options
const ALL_PROMPTS: QuickJournalPrompt[] = [
  ...QUICK_JOURNAL_PROMPTS,
  {
    id: "5",
    title: "Morning Reflection",
    emoji: "☀️",
    description: "What are you looking forward to today?",
    category: "Personal",
    bgColor: "#FEFCE8",
    categoryColor: "#CA8A04",
  },
  {
    id: "6",
    title: "Evening Wind Down",
    emoji: "🌙",
    description: "What made you smile today?",
    category: "Gratitude",
    bgColor: "#F3E8FF",
    categoryColor: "#7C3AED",
  },
  {
    id: "7",
    title: "Work Progress",
    emoji: "💼",
    description: "What challenges did you overcome?",
    category: "Work",
    bgColor: "#DBEAFE",
    categoryColor: "#2563EB",
  },
  {
    id: "8",
    title: "Self Care",
    emoji: "🧘",
    description: "How are you taking care of yourself?",
    category: "Health",
    bgColor: "#FEE2E2",
    categoryColor: "#DC2626",
  },
  {
    id: "9",
    title: "Relationships",
    emoji: "❤️",
    description: "Who made your day better?",
    category: "Family",
    bgColor: "#FCE7F3",
    categoryColor: "#DB2777",
  },
  {
    id: "10",
    title: "Learning Moment",
    emoji: "📚",
    description: "What did you learn today?",
    category: "Personal",
    bgColor: "#D1FAE5",
    categoryColor: "#059669",
  },
];

interface PromptCardProps {
  prompt: QuickJournalPrompt;
  onPress: (prompt: QuickJournalPrompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = React.memo(
  ({ prompt, onPress }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(prompt)}
        activeOpacity={0.85}
        className="flex-1 rounded-2xl p-4 m-1.5 min-h-[120px]"
        style={{ backgroundColor: prompt.bgColor }}
      >
        <Text className="text-base font-semibold text-gray-900 mb-1">
          {prompt.title} {prompt.emoji}
        </Text>
        <Text className="text-sm text-gray-600 mb-3 flex-1" numberOfLines={2}>
          {prompt.description}
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="bg-white/80 px-2.5 py-1 rounded-full">
            <Text className="text-xs text-gray-600 font-medium">Today</Text>
          </View>
          <View
            className="px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: prompt.categoryColor,
            }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: prompt.categoryColor }}
            >
              {prompt.category}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

PromptCard.displayName = "PromptCard";

export default function AllPromptsScreen() {
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const setStartRecording = useSetAtom(startRecordingAtom);
  const { setPrompt } = useJournalEntry();
  const { presentPaywall } = useRevenueCat();
  const { shouldShowPaywall } = useJournalLimit(new Date());

  const handlePromptPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      if (shouldShowPaywall) {
        presentPaywall();
        return;
      }
      setPrompt(prompt.description);
      setStartRecording(true);
      setRecorderOpen(true);
      router.back();
      setTimeout(() => {
        router.push("/tabs/(tabs)/record");
      }, 100);
    },
    [
      shouldShowPaywall,
      presentPaywall,
      setPrompt,
      setStartRecording,
      setRecorderOpen,
    ],
  );

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* Prompts Grid */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap">
          {ALL_PROMPTS.map((prompt) => (
            <View key={prompt.id} style={{ width: "50%" }}>
              <PromptCard prompt={prompt} onPress={handlePromptPress} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
