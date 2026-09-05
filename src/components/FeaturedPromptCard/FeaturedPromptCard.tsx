import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState, useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { Card } from "@/src/components/ui/Card";
import BeginButton from "@/src/components/BeginButton";


import type { QuickJournalPrompt } from "@/src/screens/DiscoveryScreen/QuickJournalSection";

interface FeaturedPromptCardProps {
  prompts: QuickJournalPrompt[];
  onPress: (prompt: QuickJournalPrompt) => void;
}

/**
 * Featured journaling prompt card for home screen — Hero treatment
 * Accessible, scalable typography, high contrast focus
 */
export const FeaturedPromptCard: React.FC<FeaturedPromptCardProps> = ({
  prompts,
  onPress,
}) => {
  
  const [activeIndex, setActiveIndex] = useState(0);

  const cyclePrompt = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % prompts.length);
  }, [prompts.length]);

  const currentPrompt = prompts[activeIndex];

  if (!currentPrompt || prompts.length === 0) return null;

  return (
    // ponytail: inset prompt refresh button and tighten card vertical whitespace
    <Card
      variant="tile"
      radius="lg"
      showDepth={false}
      haptic="none"
      contentClassName="min-h-[150px] p-4 pt-3.5 pb-4"
    >
      <View className="absolute right-3.5 top-3.5 z-10">
        <TouchableOpacity
          onPress={cyclePrompt}
          className="h-11 w-11 items-center justify-center"
          accessibilityLabel="New prompt"
          accessibilityRole="button"
        >
          <Feather name="refresh-cw" size={18} color={SEMANTIC_COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View className="min-h-[64px] pr-10" key={currentPrompt.id}>
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.extraBold,
            color: SEMANTIC_COLORS.text.primary,
            fontSize: 24,
            letterSpacing: -0.4,
            lineHeight: 28,
          }}
        >
          {currentPrompt.description}
        </Text>
      </View>

      <BeginButton
        name="Start reflection"
        showIcon={false}
        leadingIcon={
          <SymbolView
            name="mic"
            size={18}
            tintColor={SEMANTIC_COLORS.surface.primary}
            weight="medium"
            style={{ width: 18, height: 18 }}
          />
        }
        onPress={() => onPress(currentPrompt)}
        accessibilityLabel={`Start reflection: ${currentPrompt.description}`}
        style={{
          minHeight: 50,
          marginTop: 10,
          paddingHorizontal: 24,
          backgroundColor: SEMANTIC_COLORS.brand.primary,
        }}
        labelStyle={{ fontFamily: APP_FONT_FAMILIES.bold, fontSize: 16 }}
      />
    </Card>
  );
};
