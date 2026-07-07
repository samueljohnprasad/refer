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

// Extended prompts list with more options with gorgeous, premium pastel tones
export const ALL_PROMPTS: QuickJournalPrompt[] = [
  {
    id: "1",
    title: "Pause & reflect",
    emoji: "🌿",
    description: "What are you grateful for today?",
    category: "Personal",
    bgColor: "#F1F7F0", // Soft Sage Green
    categoryColor: "#5F7F58",
  },
  {
    id: "2",
    title: "Set Intentions",
    emoji: "😊",
    description: "How do you want to feel?",
    category: "Family",
    bgColor: "#FAF5EE", // Soft Honey/Cream
    categoryColor: "#B38F4D",
  },
  {
    id: "3",
    title: "Emotional Check-in",
    emoji: "💚",
    description: "Let go of stress and anxiety",
    category: "Health",
    bgColor: "#EDF7F6", // Soft Mint
    categoryColor: "#3D8076",
  },
  {
    id: "4",
    title: "Daily Wins",
    emoji: "🏆",
    description: "What went well today?",
    category: "Work",
    bgColor: "#FAF2EE", // Soft Terracotta
    categoryColor: "#C77A58",
  },
  {
    id: "5",
    title: "Morning Reflection",
    emoji: "☀️",
    description: "What are you looking forward to today?",
    category: "Personal",
    bgColor: "#FAF7E8", // Soft Buttercream
    categoryColor: "#8E753E",
  },
  {
    id: "6",
    title: "Evening Wind Down",
    emoji: "🌙",
    description: "What made you smile today?",
    category: "Gratitude",
    bgColor: "#F6F2FC", // Dusty Lavender
    categoryColor: "#7E63A8",
  },
  {
    id: "7",
    title: "Work Progress",
    emoji: "💼",
    description: "What challenges did you overcome?",
    category: "Work",
    bgColor: "#F2F6FC", // Ice Blue
    categoryColor: "#4A729D",
  },
  {
    id: "8",
    title: "Self Care",
    emoji: "🧘",
    description: "How are you taking care of yourself?",
    category: "Health",
    bgColor: "#FCF2F2", // Soft Dusty Rose
    categoryColor: "#9C5B5B",
  },
  {
    id: "9",
    title: "Relationships",
    emoji: "❤️",
    description: "Who made your day better?",
    category: "Family",
    bgColor: "#FCF2F7", // Soft Blossom
    categoryColor: "#A05A7B",
  },
  {
    id: "10",
    title: "Learning Moment",
    emoji: "📚",
    description: "What did you learn today?",
    category: "Personal",
    bgColor: "#F2FAF6", // Soft Tea Green
    categoryColor: "#4D8F70",
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
        className="flex-1 rounded-2xl p-4 m-1.5 min-h-[128px] justify-between"
        style={{
          backgroundColor: prompt.bgColor,
          borderWidth: 1,
          borderColor: prompt.categoryColor
            ? prompt.categoryColor + "24"
            : "#E5EDE1",
          shadowColor: "#2B3A22",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 6,
          elevation: 1,
        }}
      >
        <View className="flex-1">
          <Text
            style={{ fontFamily: "CormorantSemiBold" }}
            className="text-[16px] text-ink mb-1.5"
            numberOfLines={1}
          >
            {prompt.title} <Text className="text-[15px]">{prompt.emoji}</Text>
          </Text>
          <Text
            style={{ fontFamily: "GeistMedium" }}
            className="text-[13px] leading-[1.45] text-ink-soft mb-3"
            numberOfLines={2}
          >
            {prompt.description}
          </Text>
        </View>

        <View className="flex-row items-center gap-2 mt-auto">
          <View className="bg-white/90 px-2.5 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Text
              style={{ fontFamily: "GeistMedium" }}
              className="text-[10px] text-ink-soft uppercase tracking-wider"
            >
              Today
            </Text>
          </View>
          <View
            className="px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: prompt.categoryColor
                ? prompt.categoryColor + "3B"
                : "#E5EDE1",
            }}
          >
            <Text
              style={{ fontFamily: "GeistBold", color: prompt.categoryColor }}
              className="text-[10px] uppercase tracking-wider"
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
    <View className="flex-1 bg-[#F8FAF7]">
      {/* Prompts Grid */}
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 32,
        }}
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
