import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "@/src/components/ui/Card";
import { SAGE, INK_MUTED, INK } from "@/lib/tokens";
import { StaggeredText, type StaggeredTextRef } from "@/src/animations/everybody-can-cook/components/staggered-text";
import { format } from "date-fns";
import { useInterval } from "@/src/hooks/useInterval";
import type { QuickJournalPrompt } from "@/src/screens/DiscoveryScreen/QuickJournalSection";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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
  const currentDateStr = format(new Date(), "MMMM d");

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
      onPress={() => onPress(currentPrompt)}
      showDepth={false}
      haptic="light"
      contentClassName="pt-5 px-5 pb-0 overflow-hidden min-h-[220px]"
      accessibilityLabel={`Take a moment to write. Featured Prompt: ${currentPrompt.description}.`}
      accessibilityHint="Opens the journal recorder for this prompt"
    >
      <View className="mb-6 flex-row items-center justify-end z-10">
        <TouchableOpacity 
          onPress={cyclePrompt}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Show next prompt"
          accessibilityRole="button"
        >
          <Feather name="refresh-cw" size={18} color={SAGE[700]} />
        </TouchableOpacity>
      </View>

      <View className="z-10 pr-[120px] pb-12" key={currentPrompt.id}>
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

      {/* Mascot Image positioned absolutely at the bottom right */}
      <View className="absolute -bottom-2 -right-4 opacity-100 z-0 pointer-events-none">
        <Image 
          source={require('@/assets/images/panda/panda-happy.png')}
          style={{ width: 140, height: 140, resizeMode: "contain" }}
        />
      </View>
    </Card>
  );
};
