import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SymbolView } from "expo-symbols";
import { Card } from "@/src/components/ui/Card";
import BeginButton from "@/src/components/BeginButton";
import { BRAND_SURFACE, SAGE, INK } from "@/lib/tokens";
import { StaggeredText, type StaggeredTextRef } from "@/src/animations/everybody-can-cook/components/staggered-text";
import { useInterval } from "@/src/hooks/useInterval";
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

  // Rotate every 1 minute
  useInterval(cyclePrompt, 60000);

  const currentPrompt = prompts[activeIndex];
  const textRef = useRef<StaggeredTextRef>(null);

  useEffect(() => {
    textRef.current?.reset();
    textRef.current?.animate();
  }, [currentPrompt?.id]);

  if (!currentPrompt || prompts.length === 0) return null;

  return (
    <Card
      variant="tile"
      radius="xl"
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
          <Feather name="refresh-cw" size={18} color={SAGE[700]} />
        </TouchableOpacity>
      </View>

      <View className="min-h-[112px] pr-10" key={currentPrompt.id}>
        <StaggeredText
          ref={textRef}
          text={currentPrompt.description}
          fontSize={30}
          textStyle={{
            fontFamily: "CormorantBold",
            color: INK,
            letterSpacing: -0.5,
            lineHeight: 34,
          }}
        />
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
        style={{ minHeight: 50, marginTop: 20, paddingHorizontal: 24 }}
        labelStyle={{ fontFamily: "GeistBold", fontSize: 16 }}
      />
    </Card>
  );
};
