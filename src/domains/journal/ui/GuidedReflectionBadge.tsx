// ponytail: reusable badge indicating guided CBT practice reflection lineage
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ReflectionContextV1 } from "../model/reflectionLineage";

interface GuidedReflectionBadgeProps {
  lineage: ReflectionContextV1;
  size?: "sm" | "md";
}

export const GuidedReflectionBadge: React.FC<GuidedReflectionBadgeProps> = ({
  lineage,
  size = "sm",
}) => {
  const isAnxiety = lineage.path_id === "understand_anxious_thoughts";
  const label = isAnxiety ? "Anxious Thoughts" : "Grounding Reset";

  if (size === "sm") {
    return (
      <View className="flex-row items-center bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200/60 self-start mb-1">
        <Feather name="compass" size={10} color="#B45309" />
        <Text className="text-[10px] font-nunito-bold text-amber-800 ml-1">
          Guided · {label}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/70 mb-4">
      <View className="flex-row items-center space-x-1.5 mb-1">
        <Feather name="compass" size={12} color="#B45309" />
        <Text className="text-xs font-nunito-extrabold text-amber-800 tracking-wide uppercase">
          Guided CBT Reflection
        </Text>
      </View>
      <Text className="text-xs font-nunito-medium text-slate-600">
        Connected to {label} practice. Private and scoped to your account.
      </Text>
    </View>
  );
};
