import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
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
  bgColorClass?: string;
  categoryTextColorClass?: string;
  categoryBgColorClass?: string;
  bgColor?: string;
  categoryColor?: string;
}

const QUICK_JOURNAL_PROMPTS: QuickJournalPrompt[] = [
  {
    id: "1",
    title: "Pause & reflect",
    emoji: "🌿",
    description: "What are you grateful for today?",
    category: "Personal",
    bgColorClass: "bg-brand-surface",
    categoryTextColorClass: "text-sage-600",
    categoryBgColorClass: "bg-sage-pill",
  },
  {
    id: "2",
    title: "Set Intentions",
    emoji: "😊",
    description: "How do you want to feel?",
    category: "Family",
    bgColorClass: "bg-brand-surface",
    categoryTextColorClass: "text-sage-600",
    categoryBgColorClass: "bg-sage-pill",
  },
  {
    id: "3",
    title: "Emotional Check-in",
    emoji: "💚",
    description: "Let go of stress and anxiety",
    category: "Health",
    bgColorClass: "bg-brand-surface",
    categoryTextColorClass: "text-sage-600",
    categoryBgColorClass: "bg-sage-pill",
  },
  {
    id: "4",
    title: "Daily Wins",
    emoji: "🏆",
    description: "What went well today?",
    category: "Work",
    bgColorClass: "bg-brand-surface",
    categoryTextColorClass: "text-sage-600",
    categoryBgColorClass: "bg-sage-pill",
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
      <Animated.View style={entranceStyle} className="mr-3">
        <PressableScale
          onPress={() => onPress(prompt)}
          scale={0.97}
          hapticStyle="light"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${prompt.title}. ${prompt.description}. ${prompt.category} prompt`}
          accessibilityHint="Starts a journaling session with this prompt"
        >
          <View className="happy-brand-preview-tile w-44 rounded-[30px] p-4">
            <View className="mb-4">
              <View className="h-11 w-11 items-center justify-center rounded-[18px] border border-sage-100 bg-sage-50">
                <Text className="text-[24px]">{prompt.emoji}</Text>
              </View>
            </View>

            <View className="mb-1 flex-row items-center gap-2">
              <Text
                className="happy-font-body-bold flex-1 text-[16px] leading-5 text-ink"
                numberOfLines={1}
              >
                {prompt.title}
              </Text>
            </View>
            <Text
              className="happy-font-body-medium mb-4 text-[13px] leading-5 text-ink-muted"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {prompt.description}
            </Text>
            <View className={`mt-auto self-start rounded-full px-2.5 py-1 ${prompt.categoryBgColorClass || "bg-sage-pill"}`}>
              <Text className={`happy-font-body-bold text-[10px] uppercase tracking-wider ${prompt.categoryTextColorClass || "text-sage-600"}`}>
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
      <View className="mb-4 mt-8">
        {/* Header */}
        <View className="mb-3 min-h-[44px] flex-row items-center justify-between px-1">
          <View className="flex-row items-center gap-2">
            <Text className="happy-brand-eyebrow text-[11px]">
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
            className="min-h-[44px] items-center justify-center px-2"
          >
            <Text className="happy-font-body-bold text-[13px] text-ink-muted">See all</Text>
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
