import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { XPBadge } from "@/src/components/XP/XPBadge";
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
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${prompt.title}. ${prompt.description}. ${prompt.category} prompt`}
        accessibilityHint="Starts a journaling session with this prompt"
      >
        {/* Top row: Emoji */}
        <View className="mb-3">
          <View
            className="w-10 h-10 rounded-2xl items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.65)" }}
          >
            <Text style={{ fontSize: 20 }}>{prompt.emoji}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2 mb-1">
          <Text
            className="text-gray-900 text-sm font-bold flex-1"
            numberOfLines={1}
          >
            {prompt.title}
          </Text>
        </View>
        <Text
          className="text-sm text-gray-600 mb-3"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {prompt.description}
        </Text>
        <View className="bg-white/40 self-start px-2 py-0.5 rounded-full mt-2">
          <Text className="text-gray-900 text-[10px] font-medium">
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
        <View className="flex-row justify-between items-center mb-3 px-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
              Quick Journal
            </Text>
            <XPBadge amount={XP_REWARDS[XPActionType.JOURNAL_ENTRY]} />
          </View>
          <TouchableOpacity
            onPress={onSeeAllPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityHint="View all journaling prompts"
          >
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
