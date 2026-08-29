import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CheckpointContent } from "./checkpointContent";
import { CheckpointResponse } from "./checkpointResponse";
import { recordItemOutcome } from "./checkpointState";
import { SingleChoiceAdapter, OrderingAdapter, MatchingAdapter, RecallAdapter } from "./CheckpointAdapters";

interface Props {
  content: CheckpointContent;
  response: CheckpointResponse;
  onResponse: (response: CheckpointResponse) => void;
}

export const CheckpointCategoryEngine: React.FC<Props> = ({ content, response, onResponse }) => {
  const { phase, currentItemIndex } = response;

  if (phase === "intro") {
    return (
      <View className="flex-1 p-6 justify-center">
        <Text className="text-3xl font-cormorant text-ink text-center mb-4">
          {content.intro.title}
        </Text>
        <Text className="text-lg font-geist text-sage-600 text-center">
          {content.intro.subtitle}
        </Text>
      </View>
    );
  }

  if (phase === "summary" || phase === "complete") {
    return (
      <View className="flex-1 p-6 justify-center">
        <Text className="text-3xl font-cormorant text-ink text-center mb-4">
          {content.summary.title}
        </Text>
        <Text className="text-lg font-geist text-sage-600 text-center mb-12">
          {content.summary.subtitle}
        </Text>
        
        <View className="space-y-4">
          <Text className="text-xl font-cormorant text-ink font-bold">Concept Mastery:</Text>
          {Object.entries(response.itemOutcomes).map(([conceptId, outcome]) => (
            <View key={conceptId} className="flex-row justify-between items-center p-4 bg-white rounded-xl border border-sage-200">
              <Text className="text-lg font-geist text-ink">{conceptId}</Text>
              <Text className={`text-sm font-geist uppercase tracking-wider font-bold ${outcome === "solid" ? "text-green-700" : "text-amber-700"}`}>
                {outcome === "solid" ? "Solid" : "Review Soon"}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Item phase
  const currentItem = content.items[currentItemIndex];
  
  const handleItemComplete = (isCorrect: boolean) => {
    let nextResp = recordItemOutcome(response, currentItem, isCorrect);
    
    // If correct or already failed once (meaning they just saw worked support), advance
    const attempts = nextResp.itemAttempts[currentItem.id] || 0;
    if (isCorrect || attempts >= 2) {
      if (currentItemIndex >= content.items.length - 1) {
        nextResp = { ...nextResp, phase: "summary" };
      } else {
        nextResp = { ...nextResp, currentItemIndex: currentItemIndex + 1 };
      }
    }
    
    onResponse(nextResp);
  };

  const renderAdapter = () => {
    switch (currentItem.type) {
      case "single_choice":
        return <SingleChoiceAdapter item={currentItem} response={response} onComplete={handleItemComplete} />;
      case "ordering":
        return <OrderingAdapter item={currentItem} response={response} onComplete={handleItemComplete} />;
      case "matching":
        return <MatchingAdapter item={currentItem} response={response} onResponse={onResponse} onComplete={handleItemComplete} />;
      case "recall":
        return <RecallAdapter item={currentItem} response={response} onComplete={handleItemComplete} />;
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6 flex-row justify-between items-center">
        <Text className="text-sm font-geist text-sage-500 uppercase tracking-wider">
          Question {currentItemIndex + 1} of {content.items.length}
        </Text>
      </View>
      {renderAdapter()}
    </ScrollView>
  );
};
