import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { XPBadge } from "@/src/components/XP";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";

interface QuickJournalPrompt {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: "Personal" | "Family" | "Work" | "Health" | "Gratitude";
  bgColor: string;
  categoryColor: string;
}

const QUICK_JOURNAL_PROMPTS: QuickJournalPrompt[] = [
  {
    id: "1",
    title: "Pause & reflect",
    emoji: "🌿",
    description: "What are you grateful for today?",
    category: "Personal",
    bgColor: "#FEF3C7",
    categoryColor: "#F59E0B",
  },
  {
    id: "2",
    title: "Set Intentions",
    emoji: "😊",
    description: "How do you want to feel?",
    category: "Family",
    bgColor: "#EDE9FE",
    categoryColor: "#8B5CF6",
  },
  {
    id: "3",
    title: "Emotional Check-in",
    emoji: "💚",
    description: "Let go of stress and anxiety",
    category: "Health",
    bgColor: "#D1FAE5",
    categoryColor: "#10B981",
  },
  {
    id: "4",
    title: "Daily Wins",
    emoji: "🏆",
    description: "What went well today?",
    category: "Work",
    bgColor: "#FEE2E2",
    categoryColor: "#EF4444",
  },
];

interface QuickJournalCardProps {
  prompt: QuickJournalPrompt;
  onPress: (prompt: QuickJournalPrompt) => void;
}

const QuickJournalCard: React.FC<QuickJournalCardProps> = React.memo(
  ({ prompt, onPress }) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(prompt)}
        activeOpacity={0.85}
        className="w-[160px] rounded-2xl p-4 mr-3"
        style={{ backgroundColor: prompt.bgColor }}
      >
        {/* Emoji in its own frosted bubble */}
        <View
          className="w-10 h-10 rounded-2xl items-center justify-center mb-3"
          style={{ backgroundColor: "rgba(255,255,255,0.65)" }}
        >
          <Text style={{ fontSize: 20 }}>{prompt.emoji}</Text>
        </View>

        <Text
          className="text-base font-semibold text-gray-900 mb-1"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {prompt.title}
        </Text>
        <Text
          className="text-sm text-gray-600 mb-3"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {prompt.description}
        </Text>
        <View
          className="self-start px-2.5 py-1 rounded-full"
          style={{ borderWidth: 1, borderColor: prompt.categoryColor }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: prompt.categoryColor }}
          >
            {prompt.category}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

QuickJournalCard.displayName = "QuickJournalCard";

interface QuickJournalSectionProps {
  onCardPress: (prompt: QuickJournalPrompt) => void;
  onSeeAllPress: () => void;
}

export const QuickJournalSection: React.FC<QuickJournalSectionProps> =
  React.memo(({ onCardPress, onSeeAllPress }) => {
    return (
      <View className="mt-6">
        <View className="flex-row justify-between items-center mb-4 px-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-bold text-gray-900">
              Quick Journal
            </Text>
            <XPBadge amount={XP_REWARDS[XPActionType.JOURNAL_ENTRY]} />
          </View>
          <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
            <Text className="text-sm text-gray-500 font-medium">See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {QUICK_JOURNAL_PROMPTS.map((prompt) => (
            <QuickJournalCard
              key={prompt.id}
              prompt={prompt}
              onPress={onCardPress}
            />
          ))}
        </ScrollView>
      </View>
    );
  });

QuickJournalSection.displayName = "QuickJournalSection";

export { QUICK_JOURNAL_PROMPTS };
export type { QuickJournalPrompt };
