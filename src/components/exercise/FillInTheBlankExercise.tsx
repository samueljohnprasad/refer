import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import { Mascot } from '@/src/components/ui/Mascot';
import { OptionButton } from '@/src/components/ui/OptionButton';
import { FillInTheBlankPayload } from '../../../types/exercises';

interface FillInTheBlankExerciseProps {
  payload: FillInTheBlankPayload & { title?: string };
  savedResponse?: { fills?: Record<string, string>; isCorrect?: boolean };
  onInteraction: (response: { fills: Record<string, string>; isCorrect?: boolean }, isReady: boolean) => void;
}

export const FillInTheBlankExercise: React.FC<FillInTheBlankExerciseProps> = ({
  payload,
  savedResponse,
  onInteraction
}) => {
  const { prompt, template, options = [] } = payload.content || {};

  const [fills, setFills] = useState<Record<string, string>>(savedResponse?.fills || {});
  const [activeTarget, setActiveTarget] = useState<string | null>(null);

  // Extract targets from the template
  const parseTemplate = () => {
    if (!template) return { parts: [], targets: [] };
    const parts = template.split(/(\{\d+\})/g);
    const targets: string[] = [];
    parts.forEach(part => {
      const match = part.match(/\{(\d+)\}/);
      if (match) {
        targets.push(match[1]);
      }
    });
    return { parts, targets };
  };

  const { parts, targets } = parseTemplate();

  // Initialize active target to the first unfilled one
  useEffect(() => {
    if (targets.length > 0 && !activeTarget) {
      const firstUnfilled = targets.find(t => !fills[t]);
      if (firstUnfilled) {
        setActiveTarget(firstUnfilled);
      } else if (targets.length > 0) {
        setActiveTarget(targets[0]);
      }
    }
  }, [fills, targets, activeTarget]);

  // Determine if all targets are filled
  useEffect(() => {
    const isReady = targets.length > 0 && targets.every(t => !!fills[t]);
    let isCorrect = false;
    if (isReady) {
      // Check if every target is filled with an option that specifies that target
      isCorrect = targets.every(t => {
        const selectedOptionId = fills[t];
        const option = options.find((o: any) => o.id === selectedOptionId);
        return option && option.target === t;
      });
    }
    
    onInteraction({ fills, isCorrect }, isReady);
  }, [fills, targets]); // removed onInteraction from deps to avoid infinite loops

  const handleOptionPress = (optionId: string) => {
    if (activeTarget) {
      setFills(prev => {
        const newFills = { ...prev, [activeTarget]: optionId };
        return newFills;
      });
      // Move to next unfilled
      const nextUnfilled = targets.find(t => t !== activeTarget && !fills[t]);
      if (nextUnfilled) {
        setActiveTarget(nextUnfilled);
      }
    }
  };

  const handleSlotPress = (targetId: string) => {
    if (fills[targetId]) {
      // Clear it
      setFills(prev => {
        const newFills = { ...prev };
        delete newFills[targetId];
        return newFills;
      });
    }
    setActiveTarget(targetId);
  };

  // Find unused options
  const usedOptionIds = Object.values(fills);
  const unusedOptions = options.filter((o: any) => !usedOptionIds.includes(o.id));

  return (
    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text variant="h2" color="ink" className="font-bold">
          {payload.title || "Fill in the Blanks"}
        </Text>
      </View>

      {prompt && (
        <View className="flex-row items-start mb-8">
          <View className="mr-4 mt-2 z-10">
            <Mascot state="panda-happy" size={80} />
          </View>
          <View className="flex-1 bg-white rounded-3xl p-6 border-2 border-slate-200 relative">
            <View 
              className="absolute -left-3 top-10 w-5 h-5 bg-white border-l-2 border-b-2 border-slate-200 rounded-bl-[4px] rotate-45" 
            />
            <Text variant="body" color="ink" className="leading-relaxed text-base font-medium">
              {prompt}
            </Text>
          </View>
        </View>
      )}

      {/* Sentence rendering with blanks */}
      <View className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-8 flex-row flex-wrap items-center">
        {parts.map((part: string, index: number) => {
          const match = part.match(/\{(\d+)\}/);
          if (match) {
            const targetId = match[1];
            const filledOptionId = fills[targetId];
            const filledOption = options.find((o: any) => o.id === filledOptionId);
            const isActive = activeTarget === targetId;

            return (
              <TouchableOpacity 
                key={`slot-${index}`}
                onPress={() => handleSlotPress(targetId)}
                activeOpacity={0.7}
                className={`mx-1 px-4 py-2 rounded-xl border-b-4 
                  ${filledOption ? 'bg-sky-100 border-sky-300' : 
                    isActive ? 'bg-white border-sky-400 shadow-sm shadow-sky-100 border-2 border-b-4' : 'bg-slate-200 border-slate-300'}
                `}
              >
                <Text className={`font-bold ${filledOption ? 'text-sky-700' : isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                  {filledOption ? filledOption.text : '      '}
                </Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <Text key={`text-${index}`} variant="body" color="ink" className="text-lg leading-loose">
                {part}
              </Text>
            );
          }
        })}
      </View>

      {/* Options Bank */}
      <View className="flex-row flex-wrap gap-3 pb-12 justify-center">
        {unusedOptions.map((option: any) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleOptionPress(option.id)}
            activeOpacity={0.7}
            className="bg-white border-2 border-b-4 border-slate-200 rounded-2xl px-6 py-3"
          >
            <Text className="text-slate-700 font-bold text-base">
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
        {unusedOptions.length === 0 && (
          <Text className="text-slate-400 font-medium italic mt-4 text-center w-full">
            All blanks filled!
          </Text>
        )}
      </View>
    </ScrollView>
  );
};
