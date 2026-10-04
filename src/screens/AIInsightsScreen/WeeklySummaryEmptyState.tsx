import React from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { weeklyAnalysis } from "@/assets/images";

interface WeeklySummaryEmptyStateProps {
  dateRange: string;
  isGenerating: boolean;
  shouldShowPaywall: boolean;
  onGenerate: () => void;
  labels: {
    title: string;
    description: string;
    generate: string;
    unlock: string;
    generating: string;
    analyzing: string;
  };
}

export function WeeklySummaryEmptyState({
  dateRange,
  isGenerating,
  shouldShowPaywall,
  onGenerate,
  labels,
}: WeeklySummaryEmptyStateProps) {
  return (
    <View className="bg-white rounded-3xl overflow-hidden items-center shadow-sm">
      <Image source={weeklyAnalysis} style={{ width: "100%", height: 240 }} resizeMode="cover" />
      <View className="px-8 pt-6 pb-8">
        <Text className="text-[28px] font-cormorantBold text-[#0F172A] mb-3 text-center leading-tight">
          {labels.title}
        </Text>
        <Text className="text-[15px] text-[#64748B] text-center mb-6 leading-6 font-jakartaMedium">
          {labels.description}{"\n"}
          <Text className="font-jakartaBold text-[#475569]">{dateRange}</Text>
        </Text>
      </View>
      <View className="w-full px-6 pb-6">
        <TouchableOpacity className="rounded-2xl overflow-hidden w-full active:opacity-90" onPress={onGenerate} disabled={isGenerating}>
          <LinearGradient
            colors={isGenerating ? ["#999", "#777"] : ["#7B61FF", "#9C7CFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center justify-center py-4 px-6 gap-2"
          >
            {isGenerating ? <ActivityIndicator size="small" color="#FFF" /> : <Feather name={shouldShowPaywall ? "lock" : "zap"} size={18} color="#FFF" />}
            <Text className="text-base font-bold text-white font-jakarta">
              {isGenerating ? labels.generating : shouldShowPaywall ? labels.unlock : labels.generate}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {isGenerating && <Text className="text-[13px] text-[#6B7280] mt-4 text-center italic">{labels.analyzing}</Text>}
    </View>
  );
}
