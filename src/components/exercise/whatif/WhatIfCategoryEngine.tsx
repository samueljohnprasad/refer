import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { WhatIfContent } from "./whatIfContent";
import { WhatIfResponse } from "./whatIfResponse";

interface Props {
  content: WhatIfContent;
  response: WhatIfResponse;
  onResponse: (response: WhatIfResponse) => void;
}

export const WhatIfCategoryEngine: React.FC<Props> = ({ content, response, onResponse }) => {
  const { phase, selectedPredictionId, consequenceIndex } = response;

  const handleSelectPrediction = (id: string) => {
    if (phase !== "prediction") return;
    onResponse({ ...response, selectedPredictionId: id });
  };

  if (phase === "prediction") {
    return (
      <View className="flex-1 p-6 justify-center">
        <Text className="text-2xl font-cormorant text-ink mb-8 text-center">
          What do you think will happen?
        </Text>
        <View className="space-y-4">
          {content.predictions.map((p) => {
            const isSelected = selectedPredictionId === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => handleSelectPrediction(p.id)}
                className={`p-4 rounded-xl border ${
                  isSelected ? "border-ink bg-sage-50" : "border-sage-200"
                }`}
              >
                <Text className={`text-lg font-geist ${isSelected ? "text-ink font-bold" : "text-sage-700"}`}>
                  {p.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  if (phase === "running") {
    return (
      <ScrollView className="flex-1 p-6">
        <View className="space-y-6 pb-20">
          {content.consequences.slice(0, consequenceIndex).map((c, idx) => {
            const isLatest = idx === consequenceIndex - 1;
            const containerClass = isLatest ? "p-4 bg-white shadow-sm" : "p-3 bg-sage-50 opacity-70";
            const labelClass = isLatest ? "text-sm text-sage-500 uppercase tracking-wider mb-2" : "text-xs text-sage-400 uppercase tracking-wider mb-1";
            const textClass = isLatest ? "text-lg text-ink font-bold" : "text-base text-ink line-clamp-1";
            
            return (
              <View key={c.id} className={`rounded-xl border border-sage-100 ${containerClass}`}>
                <Text className={`font-geist ${labelClass}`}>
                  Step {idx + 1}
                </Text>
                <Text className={`font-geist ${textClass}`}>{c.text}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  // Complete phase (final comparison)
  const userPrediction = content.predictions.find((p) => p.id === selectedPredictionId);
  const finalConsequence = content.consequences[content.consequences.length - 1];

  return (
    <View className="flex-1 p-6 justify-center">
      <Text className="text-3xl font-cormorant text-ink text-center mb-4">
        {content.finalComparison.heading}
      </Text>
      <Text className="text-lg font-geist text-sage-600 text-center mb-12">
        {content.finalComparison.description}
      </Text>
      <View className="space-y-6">
        <View className="p-4 rounded-xl bg-sage-50 border border-sage-200">
          <Text className="text-sm font-geist text-sage-500 uppercase tracking-wider mb-2">You Predicted</Text>
          <Text className="text-lg font-geist text-ink">{userPrediction?.text}</Text>
        </View>
        <View className="p-4 rounded-xl bg-white border border-sage-200">
          <Text className="text-sm font-geist text-sage-500 uppercase tracking-wider mb-2">Actual Outcome</Text>
          <Text className="text-lg font-geist text-ink font-bold">{finalConsequence?.text}</Text>
        </View>
      </View>
    </View>
  );
};
