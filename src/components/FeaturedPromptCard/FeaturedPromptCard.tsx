import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { XPBadge } from "../XP/XPBadge";

interface FeaturedPromptCardProps {
  category?: string;
  xpReward?: number;
  prompt: string;
  emoji?: string;
  onPress: () => void;
}

/**
 * Featured journaling prompt card for home screen
 * Displays a visually appealing card with gradient background, prompt question, and XP reward
 */
export const FeaturedPromptCard: React.FC<FeaturedPromptCardProps> = ({
  category = "Journaling",
  xpReward = 30,
  prompt,
  emoji = "🤓",
  onPress,
}) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <LinearGradient
      colors={["#E0F7FA", "#B2EBF2", "#E0F2F1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ padding: 20, overflow: "hidden", borderRadius: 24 }}
    >
      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-4">
        {/* Image Mascot */}
        <View className="w-32 h-32 items-center justify-center overflow-hidden">
          <Image
            source={require("@/assets/images/happy-dog.png")}
            style={{ width: 128, height: 128 }}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Prompt Question */}
      <Text className="text-[28px] font-bold text-gray-900 mb-8 leading-tight">
        {prompt}
      </Text>

      {/* Add Entry Button */}
      <TouchableOpacity
        onPress={handlePress}
        className="bg-gray-900 flex-row items-center justify-center py-4 rounded-full"
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add entry for featured prompt"
        accessibilityHint="Opens the journal recorder for this prompt"
      >
        <HugeiconsIcon icon={PencilEdit01Icon} size={18} color="#FFFFFF" />
        <Text className="text-white font-semibold text-base ml-2">
          Add entry
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};
