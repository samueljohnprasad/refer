import React, { useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { Card } from "@/src/components/ui/Card";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { SPRING_DEFAULT, STAGGER } from "@/src/utils/motionTokens";
import { useReducedMotion } from "@/src/hooks/useReducedMotion";
import { useTranslation } from "react-i18next";

interface QuickJournalPrompt {
  id: string;
  emoji: string;
  bgColorClass?: string;
  categoryTextColorClass?: string;
  categoryBgColorClass?: string;
  bgColor?: string;
  categoryColor?: string;
}

const QUICK_JOURNAL_PROMPTS: QuickJournalPrompt[] = [
  {
    id: "1",
    emoji: "🌿",
    bgColorClass: "bg-brand-surface",
    categoryTextColorClass: "text-sage-600",
    categoryBgColorClass: "bg-sage-pill",
  },
  {
    id: "2",
    emoji: "😊",
    bgColorClass: "bg-brand-surface",
    categoryTextColorClass: "text-sage-600",
    categoryBgColorClass: "bg-sage-pill",
  },
  {
    id: "3",
    emoji: "💚",
    bgColorClass: "bg-brand-surface",
    categoryTextColorClass: "text-sage-600",
    categoryBgColorClass: "bg-sage-pill",
  },
  {
    id: "4",
    emoji: "🏆",
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
    const { t } = useTranslation("common");
    const { t: tHome } = useTranslation("home");
    const reducedMotion = useReducedMotion();
    const scale = useSharedValue<number>(reducedMotion ? 1 : 0.82);
    const opacity = useSharedValue<number>(reducedMotion ? 1 : 0);

    useEffect(() => {
      if (reducedMotion) return;
      const delay = index * STAGGER.fast; // 30ms stagger between cards
      scale.value = withDelay(delay, withSpring(1, SPRING_DEFAULT));
      opacity.value = withDelay(delay, withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const entranceStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));
    const title = t(`promptBrowser.items.${prompt.id}.title`);
    const description = tHome(`prompts.${prompt.id}`);
    const category = t(`promptBrowser.items.${prompt.id}.category`);

    return (
      <Animated.View style={entranceStyle} className="mr-3">
        <Card
          variant="tile"
          radius="xl"
          onPress={() => onPress(prompt)}
          haptic="light"
          className="w-44"
          contentClassName="p-4"
          accessibilityLabel={`${title}. ${description}. ${category}`}
          accessibilityHint={t("promptBrowser.quickHint")}
        >
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
              {title}
            </Text>
          </View>
          <Text
            className="happy-font-body-medium mb-4 text-[13px] leading-5 text-ink-muted"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
          <View
            className={`mt-auto self-start rounded-full px-2.5 py-1 ${
              prompt.categoryBgColorClass || "bg-sage-pill"
            }`}
          >
            <Text
              className={`happy-font-body-bold text-[10px] uppercase tracking-wider ${
                prompt.categoryTextColorClass || "text-sage-600"
              }`}
            >
              {category}
            </Text>
          </View>
        </Card>
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
    const { t } = useTranslation("common");
    return (
      <View className="mb-4 mt-8">
        {/* Header */}
        <View className="mb-3 min-h-[44px] flex-row items-center justify-between px-1">
          <View className="flex-row items-center gap-2">
            <Text className="happy-font-body-bold text-[15px] text-ink-muted">
              {t("promptBrowser.quickTitle")}
            </Text>
          </View>
          <PressableScale
            onPress={onSeeAllPress}
            scale={0.94}
            hapticStyle="light"
            accessibilityRole="button"
            accessibilityLabel={t("promptBrowser.quickA11y")}
            accessibilityHint={t("promptBrowser.quickHint")}
            className="min-h-[44px] items-center justify-center px-2"
          >
            <Text className="happy-font-body-bold text-[13px] text-ink-muted">{t("promptBrowser.seeAll")}</Text>
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
