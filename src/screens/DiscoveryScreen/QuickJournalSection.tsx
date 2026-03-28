import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { XPBadge } from "@/src/components/XP/XPBadge";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";
import { PressableScale } from "@/src/components/ui/PressableScale";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { SPRING_DEFAULT, STAGGER } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";

interface QuickJournalPrompt {
  id: string;
  title: string;
  emoji: string;
  description: string;
  category: "Personal" | "Family" | "Work" | "Health" | "Gratitude";
  bgColorClass: string;
  categoryTextColorClass: string;
  categoryBgColorClass: string;
}

const QUICK_JOURNAL_PROMPTS: QuickJournalPrompt[] = [
  {
    id: "1",
    title: "Pause & reflect",
    emoji: "🌿",
    description: "What are you grateful for today?",
    category: "Personal",
    bgColorClass: "bg-amber-50",
    categoryTextColorClass: "text-amber-800",
    categoryBgColorClass: "bg-white/50",
  },
  {
    id: "2",
    title: "Set Intentions",
    emoji: "😊",
    description: "How do you want to feel?",
    category: "Family",
    bgColorClass: "bg-violet-50",
    categoryTextColorClass: "text-violet-800",
    categoryBgColorClass: "bg-white/50",
  },
  {
    id: "3",
    title: "Emotional Check-in",
    emoji: "💚",
    description: "Let go of stress and anxiety",
    category: "Health",
    bgColorClass: "bg-emerald-50",
    categoryTextColorClass: "text-emerald-800",
    categoryBgColorClass: "bg-white/50",
  },
  {
    id: "4",
    title: "Daily Wins",
    emoji: "🏆",
    description: "What went well today?",
    category: "Work",
    bgColorClass: "bg-red-50",
    categoryTextColorClass: "text-red-800",
    categoryBgColorClass: "bg-white/50",
  },
];

interface QuickJournalCardProps {
  prompt: QuickJournalPrompt;
  index: number;
  onPress: (prompt: QuickJournalPrompt) => void;
}

const QuickJournalCard: React.FC<QuickJournalCardProps> = React.memo(
  ({ prompt, index, onPress }) => {
    const reducedMotion = useReducedMotion();
    const scale = useSharedValue<number>(reducedMotion ? 1 : 0.82);
    const opacity = useSharedValue<number>(reducedMotion ? 1 : 0);

    useEffect(() => {
      if (reducedMotion) return;
      const delay = index * STAGGER.fast; // 30ms stagger between cards
      scale.value = withDelay(delay, withSpring(1, SPRING_DEFAULT));
      opacity.value = withDelay(delay, withSpring(1, { stiffness: 200, damping: 20 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const entranceStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    return (
      <Animated.View style={entranceStyle} className="mr-4">
        <PressableScale
          onPress={() => onPress(prompt)}
          scale={0.95}
          hapticStyle="light"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${prompt.title}. ${prompt.description}. ${prompt.category} prompt`}
          accessibilityHint="Starts a journaling session with this prompt"
        >
          <View className={`w-44 rounded-2xl p-4 ${prompt.bgColorClass}`}>
            {/* Top row: Emoji */}
            <View className="mb-3">
              <View className="w-10 h-10 rounded-2xl items-center justify-center">
                <Text style={{ fontSize: 24 }}>{prompt.emoji}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2 mb-1">
              <Text
                className="text-gray-900 text-base font-semibold flex-1 tracking-tight"
                numberOfLines={1}
              >
                {prompt.title}
              </Text>
            </View>
            <Text
              className="text-sm text-gray-700 mb-3 leading-normal"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {prompt.description}
            </Text>
            <View className={`self-start px-2 py-1 rounded-md mt-2 ${prompt.categoryBgColorClass}`}>
              <Text className={`text-xs font-bold tracking-wide uppercase ${prompt.categoryTextColorClass}`}>
                {prompt.category}
              </Text>
            </View>
          </View>
        </PressableScale>
      </Animated.View>
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
      <View className="mt-8 mb-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-2 px-1 min-h-[44px]">
          <View className="flex-row items-center gap-2">
            <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Quick Journal
            </Text>
          </View>
          <PressableScale
            onPress={onSeeAllPress}
            scale={0.94}
            hapticStyle="light"
            accessibilityRole="button"
            accessibilityLabel="See all quick journal prompts"
            accessibilityHint="Navigates to the full list of journaling prompts"
            className="px-2 min-h-[44px] justify-center items-center"
          >
            <Text className="text-[13px] text-gray-500 font-medium">See all</Text>
          </PressableScale>
        </View>

        {/* Scrollable list */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-4"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {QUICK_JOURNAL_PROMPTS.map((prompt, index) => (
            <QuickJournalCard
              key={prompt.id}
              prompt={prompt}
              index={index}
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
