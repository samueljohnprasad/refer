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
    // ponytail: compact reflection card with tightened vertical rhythm
    <Card
      variant="tile"
      radius="lg"
      showDepth={false}
      haptic="none"
      contentClassName="p-3.5 pt-3 pb-3"
    >
      <View className="absolute right-2.5 top-2.5 z-10">
        <TouchableOpacity
          onPress={cyclePrompt}
          className="h-11 w-11 items-center justify-center active:opacity-60"
          accessibilityLabel="New reflection prompt"
          accessibilityRole="button"
        >
          <Feather name="refresh-cw" size={17} color={SEMANTIC_COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      <View className="min-h-[56px] pr-10 justify-center" key={currentPrompt.id}>
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
          minHeight: 46,
          marginTop: 8,
          paddingHorizontal: 24,
          backgroundColor: SEMANTIC_COLORS.brand.primary,
        }}
        labelStyle={{ fontFamily: APP_FONT_FAMILIES.bold, fontSize: 16 }}
      />
    </Card>
  );
};
