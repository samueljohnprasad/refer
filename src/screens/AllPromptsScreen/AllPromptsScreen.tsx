import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  QuickJournalPrompt,
} from "../DiscoveryScreen/QuickJournalSection";
import { useAtom, useSetAtom } from "jotai";
import { recorderOpenAtom } from "../DiscoveryScreen/helpers";
import { startRecordingAtom } from "../DailyNotesScreen/atoms";
import { useJournalEntry } from "@/hooks/useJournalEntry";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useJournalLimit } from "@/hooks/useJournalLimit";
import { useVoiceFeature } from "@/src/hooks/useVoiceFeature";
import { useTranslation } from "react-i18next";

// Extended prompts list with more options with gorgeous, premium pastel tones
export const ALL_PROMPTS: QuickJournalPrompt[] = [
  {
    id: "1",
    emoji: "🌿",
    bgColor: "#F1F7F0", // Soft Sage Green
    categoryColor: "#5F7F58",
  },
  {
    id: "2",
    emoji: "😊",
    bgColor: "#FAF5EE", // Soft Honey/Cream
    categoryColor: "#B38F4D",
  },
  {
    id: "3",
    emoji: "💚",
    bgColor: "#EDF7F6", // Soft Mint
    categoryColor: "#3D8076",
  },
  {
    id: "4",
    emoji: "🏆",
    bgColor: "#FAF2EE", // Soft Terracotta
    categoryColor: "#C77A58",
  },
  {
    id: "5",
    emoji: "☀️",
    bgColor: "#FAF7E8", // Soft Buttercream
    categoryColor: "#8E753E",
  },
  {
    id: "6",
    emoji: "🌙",
    bgColor: "#F6F2FC", // Dusty Lavender
    categoryColor: "#7E63A8",
  },
  {
    id: "7",
    emoji: "💼",
    bgColor: "#F2F6FC", // Ice Blue
    categoryColor: "#4A729D",
  },
  {
    id: "8",
    emoji: "🧘",
    bgColor: "#FCF2F2", // Soft Dusty Rose
    categoryColor: "#9C5B5B",
  },
  {
    id: "9",
    emoji: "❤️",
    bgColor: "#FCF2F7", // Soft Blossom
    categoryColor: "#A05A7B",
  },
  {
    id: "10",
    emoji: "📚",
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
    const { t } = useTranslation("common");
    const { t: tHome } = useTranslation("home");
    const title = String(t(`promptBrowser.items.${prompt.id}.title` as any));
    const description = String(tHome(`prompts.${prompt.id}` as any));
    const category = String(t(`promptBrowser.items.${prompt.id}.category` as any));

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
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${description}`}
      >
        <View className="flex-1">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-[16px] text-ink mb-1.5"
            numberOfLines={1}
          >
            {title} <Text className="text-[15px]">{prompt.emoji}</Text>
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="text-[13px] leading-[1.45] text-ink-soft mb-3"
            numberOfLines={2}
          >
            {description}
          </Text>
        </View>

        <View className="flex-row items-center gap-2 mt-auto">
          <View className="bg-white/90 px-2.5 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[10px] text-ink-soft uppercase tracking-wider"
            >
              {t("promptBrowser.today")}
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
              style={{ fontFamily: APP_FONT_FAMILIES.bold, color: prompt.categoryColor }}
              className="text-[10px] uppercase tracking-wider"
            >
              {category}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

PromptCard.displayName = "PromptCard";

export default function AllPromptsScreen() {
  const { t: tHome } = useTranslation("home");
  const [, setRecorderOpen] = useAtom(recorderOpenAtom);
  const setStartRecording = useSetAtom(startRecordingAtom);
  const { setPrompt } = useJournalEntry();
  const { presentPaywall } = useRevenueCat();
  const { shouldShowPaywall } = useJournalLimit(new Date());
  const { journalRoute, isVoiceEnabled } = useVoiceFeature();

  const handlePromptPress = useCallback(
    (prompt: QuickJournalPrompt) => {
      if (shouldShowPaywall && isVoiceEnabled) {
        presentPaywall();
        return;
      }
      setPrompt(String(tHome(`prompts.${prompt.id}` as any)));
      if (isVoiceEnabled) {
        setStartRecording(true);
      }
      router.push(journalRoute);
    },
    [
      shouldShowPaywall,
      isVoiceEnabled,
      presentPaywall,
      setPrompt,
      tHome,
      setStartRecording,
      journalRoute,
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
