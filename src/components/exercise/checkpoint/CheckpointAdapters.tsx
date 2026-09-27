import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Button } from "@/src/components/ui/Button";
import { CheckpointSingleChoice, CheckpointOrdering, CheckpointMatching, CheckpointRecall } from "./checkpointContent";
import { CheckpointResponse } from "./checkpointResponse";

interface AdapterProps<T> {
  item: T;
  response: CheckpointResponse;
  onComplete: (isCorrect: boolean) => void;
  onResponse?: (response: CheckpointResponse) => void;
}

export const SingleChoiceAdapter: React.FC<AdapterProps<CheckpointSingleChoice>> = ({ item, response, onComplete }) => {
  const attempts = response.itemAttempts[item.id] || 0;
  const showWorkedSupport = attempts >= 2;

  if (showWorkedSupport) {
    return (
      <View className="space-y-6">
        <Text className="text-2xl font-cormorant text-ink">{item.question}</Text>
        <View className="p-4 bg-sage-50 rounded-xl border border-sage-200">
          <Text className="text-sm font-geist text-sage-500 uppercase tracking-wider mb-2">Worked Support</Text>
          <Text className="text-lg font-geist text-ink">{item.workedSupport}</Text>
        </View>
        <Button label="Next" onPress={() => onComplete(false)} size="lg" />
      </View>
    );
  }

  return (
    <View className="space-y-6">
      <Text className="text-2xl font-cormorant text-ink">{item.question}</Text>
      <View className="space-y-4">
        {item.options.map(opt => (
          <TouchableOpacity 
            key={opt.id} 
            onPress={() => onComplete(opt.isCorrect)}
            className="p-4 rounded-xl border border-sage-200 bg-white"
          >
            <Text className="text-lg font-geist text-ink">{opt.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const OrderingAdapter: React.FC<AdapterProps<CheckpointOrdering>> = ({ item, response, onComplete }) => {
  const attempts = response.itemAttempts[item.id] || 0;
  const showWorkedSupport = attempts >= 2;
  const [order, setOrder] = useState([...item.items]);
  
  if (showWorkedSupport) {
    return (
      <View className="space-y-6">
        <Text className="text-2xl font-cormorant text-ink">{item.instruction}</Text>
        <View className="p-4 bg-sage-50 rounded-xl border border-sage-200">
          <Text className="text-sm font-geist text-sage-500 uppercase tracking-wider mb-2">Worked Support</Text>
          <Text className="text-lg font-geist text-ink">{item.workedSupport}</Text>
        </View>
        <Button label="Next" onPress={() => onComplete(false)} size="lg" />
      </View>
    );
  }

  const handleCheck = () => {
    const isCorrect = order.every((o, i) => o.id === item.correctOrderIds[i]);
    onComplete(isCorrect);
  };
  
  // Ponytail: Simple up/down arrows for ordering instead of complex D&D
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrder(newOrder);
  };
  
  return (
    <View className="space-y-6">
      <Text className="text-2xl font-cormorant text-ink">{item.instruction}</Text>
      {attempts === 1 && (
        <Text className="text-sm font-geist text-amber-700 uppercase tracking-wider mb-2">Some items are in the wrong position. Try again!</Text>
      )}
      <View className="space-y-2">
        {order.map((o, index) => {
          const isRetry = attempts === 1;
          const isWrongPosition = isRetry && o.id !== item.correctOrderIds[index];
          const borderClass = isWrongPosition ? "border-amber-400 border-2" : "border-sage-200";
          const bgClass = isWrongPosition ? "bg-amber-50" : "bg-white";
          
          return (
            <View key={o.id} className="flex-row items-center space-x-2">
              <TouchableOpacity onPress={() => moveUp(index)} className="p-4 bg-sage-100 rounded-lg">
                <Text className="text-ink font-bold font-geist">↑</Text>
              </TouchableOpacity>
              <View className={`flex-1 p-4 rounded-xl ${borderClass} ${bgClass}`}>
                <Text className="text-lg font-geist text-ink">{o.text}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View className="mt-4">
        <Button label="Check Order" onPress={handleCheck} size="lg" />
      </View>
    </View>
  );
};

export const MatchingAdapter: React.FC<AdapterProps<CheckpointMatching>> = ({ item, response, onComplete, onResponse }) => {
  const attempts = response.itemAttempts[item.id] || 0;
  const showWorkedSupport = attempts >= 2;
  const { leftId, rightId } = response.currentMatchSelection;
  
  // Local state for matched pairs so we can remove them from the list
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());

  if (showWorkedSupport) {
    return (
      <View className="space-y-6">
        <Text className="text-2xl font-cormorant text-ink">{item.instruction}</Text>
        <View className="p-4 bg-sage-50 rounded-xl border border-sage-200">
          <Text className="text-sm font-geist text-sage-500 uppercase tracking-wider mb-2">Worked Support</Text>
          <Text className="text-lg font-geist text-ink">{item.workedSupport}</Text>
        </View>
        <Button label="Next" onPress={() => onComplete(false)} size="lg" />
      </View>
    );
  }

  const handleSelectLeft = (id: string) => {
    onResponse?.({ ...response, currentMatchSelection: { leftId: id, rightId } });
    checkMatch(id, rightId);
  };
  
  const handleSelectRight = (id: string) => {
    onResponse?.({ ...response, currentMatchSelection: { leftId, rightId: id } });
    checkMatch(leftId, id);
  };
  
  const checkMatch = (lId: string | null, rId: string | null) => {
    if (!lId || !rId) return;
    
    // Check if they match
    const pair = item.pairs.find(p => p.id === lId && p.id === rId); // In this setup left and right come from the same pair ID
    
    if (pair) {
      // Match found
      const nextMatched = new Set(matchedIds).add(pair.id);
      setMatchedIds(nextMatched);
      onResponse?.({ ...response, currentMatchSelection: { leftId: null, rightId: null } });
      
      if (nextMatched.size === item.pairs.length) {
        onComplete(true);
      }
    } else {
      // Incorrect match
      onResponse?.({ ...response, currentMatchSelection: { leftId: null, rightId: null } });
      onComplete(false); // Register failure
    }
  };

  return (
    <View className="space-y-6">
      <Text className="text-2xl font-cormorant text-ink">{item.instruction}</Text>
      
      <View className="flex-row space-x-4">
        {/* Left List */}
        <View className="flex-1 space-y-4">
          {item.pairs.filter(p => !matchedIds.has(p.id)).map(p => (
            <TouchableOpacity 
              key={`l-${p.id}`} 
              onPress={() => handleSelectLeft(p.id)}
              className={`p-4 rounded-xl border ${leftId === p.id ? "bg-sage-100 border-ink" : "bg-white border-sage-200"}`}
            >
              <Text className="text-base font-geist text-ink">{p.left}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Right List (Shuffled ideally, but simple for MVP) */}
        <View className="flex-1 space-y-4">
          {[...item.pairs].reverse().filter(p => !matchedIds.has(p.id)).map(p => (
            <TouchableOpacity 
              key={`r-${p.id}`} 
              onPress={() => handleSelectRight(p.id)}
              className={`p-4 rounded-xl border ${rightId === p.id ? "bg-sage-100 border-ink" : "bg-white border-sage-200"}`}
            >
              <Text className="text-base font-geist text-ink">{p.right}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export const RecallAdapter: React.FC<AdapterProps<CheckpointRecall>> = ({ item, response, onComplete }) => {
  const [revealed, setRevealed] = useState(false);
  
  return (
    <View className="space-y-6">
      <View className="p-6 bg-white rounded-2xl border border-sage-200 shadow-sm min-h-[200px] justify-center items-center">
        <Text className="text-2xl font-cormorant text-ink text-center mb-6">{item.question}</Text>
        
        {revealed ? (
          <View className="items-center w-full">
            <View className="w-16 h-px bg-sage-200 mb-6" />
            <Text className="text-xl font-geist text-ink text-center">{item.answer}</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setRevealed(true)} className="px-6 py-3 bg-sage-100 rounded-full">
            <Text className="text-sage-800 font-geist font-bold">Reveal Answer</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {revealed && (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label="Need Practice"
              variant="secondary"
              onPress={() => onComplete(false)}
              size="lg"
            />
          </View>
          <View className="flex-1">
            <Button
              label="Got It"
              variant="primary"
              onPress={() => onComplete(true)}
              size="lg"
            />
          </View>
        </View>
      )}
    </View>
  );
};
