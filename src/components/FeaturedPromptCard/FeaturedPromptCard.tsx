import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState, useCallback } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { Card } from "@/src/components/ui/Card";
import BeginButton from "@/src/components/BeginButton";
import { BRAND_SURFACE, SAGE } from "@/lib/tokens";
import { useThemeColor } from "@/lib/useThemeColor";
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
  const theme = useThemeColor();
  const [activeIndex, setActiveIndex] = useState(0);

  const cyclePrompt = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % prompts.length);
  }, [prompts.length]);

  const currentPrompt = prompts[activeIndex];

  if (!currentPrompt || prompts.length === 0) return null;

  return (
    <Card
      variant="tile"
      radius="lg"
      showDepth={false}
      haptic="none"
      contentClassName="min-h-[220px] p-5"
    >
      <View className="absolute right-2 top-2 z-10">
        <TouchableOpacity
          onPress={cyclePrompt}
          className="h-11 w-11 items-center justify-center"
          accessibilityLabel="Show next prompt"
          accessibilityRole="button"
        >
          <Feather name="refresh-cw" size={18} color={theme.foreground} />
        </TouchableOpacity>
      </View>

      <View className="min-h-[112px] pr-10" key={currentPrompt.id}>
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.extraBold,
            color: theme.foreground,
            fontSize: 30,
            letterSpacing: -0.5,
            lineHeight: 34,
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
            tintColor={BRAND_SURFACE}
            weight="medium"
            style={{ width: 18, height: 18 }}
          />
        }
        onPress={() => onPress(currentPrompt)}
        accessibilityLabel={`Start reflection: ${currentPrompt.description}`}
        style={{
          minHeight: 50,
          marginTop: 20,
          paddingHorizontal: 24,
          backgroundColor: SAGE[500],
        }}
        labelStyle={{ fontFamily: APP_FONT_FAMILIES.bold, fontSize: 16 }}
      />
    </Card>
  );
};
