import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { GRADIENTS } from "@/constants/palette";
import { CARD_SHADOW } from "@/constants/shadows";
import { PressableScale } from "@/src/components/ui/PressableScale";

interface FeaturedPromptCardProps {
  category?: string;
  xpReward?: number;
  prompt: string;
  emoji?: string;
  onPress: () => void;
}

/**
 * Featured journaling prompt card for home screen — Hero treatment
 * Accessible, scalable typography, high contrast focus
 */
export const FeaturedPromptCard: React.FC<FeaturedPromptCardProps> = ({
  category = "Journaling",
  prompt,
  onPress,
}) => {
  return (
    <View style={CARD_SHADOW} className="rounded-3xl bg-indigo-50 shadow-sm">
      <PressableScale
        onPress={onPress}
        scale={0.98}
        hapticStyle="light"
        accessibilityRole="button"
        accessibilityLabel={`Take a moment to write. Featured Prompt: ${prompt}.`}
        accessibilityHint="Opens the journal recorder for this prompt"
      >
        <LinearGradient
          colors={GRADIENTS.featured}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-5 overflow-hidden"
          style={{ padding: 20, borderRadius: 24 }}
        >
          <View className="mb-4 flex-row items-center justify-between">
            <View className="w-10 h-10 rounded-full items-center justify-center overflow-hidden bg-white/20">
              <Image
                source={require("@/assets/images/happy-dog.png")}
                className="w-8 h-8"
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            </View>
            <View className="bg-white/30 px-2.5 py-1 rounded-full">
              <Text className="text-teal-900 text-[11px] font-bold uppercase tracking-wider">{category}</Text>
            </View>
          </View>

          <Text 
            className="text-[26px] font-extrabold text-gray-900 mb-8 leading-tight tracking-tight"
            minimumFontScale={0.8}
            adjustsFontSizeToFit
          >
            {prompt}
          </Text>

          <View className="bg-black/5 flex-row items-center justify-center h-12 rounded-2xl mt-auto">
            <HugeiconsIcon icon={PencilEdit01Icon} size={18} color="#111827" />
            <Text className="text-gray-900 font-bold text-[15px] ml-2.5 tracking-tight">
              Start writing
            </Text>
          </View>
        </LinearGradient>
      </PressableScale>
    </View>
  );
};
