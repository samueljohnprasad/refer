// ponytail: exact S1 Goal Pick UI matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { GoalId } from '../../../domain/enums';
import type { GoalDefinition } from '../../../domain/types';
import { HappiIcon } from '../components/HappiIcon';
import { dropIn, popIn, fadeIn } from '../animations';

export interface GoalPickStepViewProps {
  goals: GoalDefinition[];
  selectedGoalId: GoalId | null;
  guideStage: React.ReactNode;
  onSelectGoal: (goal: GoalDefinition) => void;
}

export function GoalPickStepView({
  goals,
  selectedGoalId,
  guideStage,
  onSelectGoal,
}: GoalPickStepViewProps): React.JSX.Element {
  return (
    <Animated.ScrollView entering={fadeIn()} className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      {/* Happi asks from bubble on right (Duolingo / BitePal style) */}
      <View className="flex-row items-start gap-2 pt-2 mb-4">
        <View className="w-[88px] items-center justify-center">
          {guideStage}
        </View>

        {/* Question bubble (.ask h1) */}
        <View className="relative flex-1 mt-2.5 px-4 py-3.5 border-2 border-happy-sep rounded-[20px] bg-happy-surface">
          {/* Bubble tail pointing left to Happi mouth */}
          <View className="absolute -left-[7px] top-[24px] w-3 h-3 bg-happy-surface border-l-2 border-b-2 border-happy-sep rotate-45" />
          <Text className="text-[22px] font-semibold font-display text-happy-label leading-[28px]">
            What’s on your mind?
          </Text>
        </View>
      </View>

      {/* Goal Cards with tactile rim & head in pose */}
      <View className="flex-col gap-3 pb-8">
        {goals.map((g, i) => {
          const isSelected = selectedGoalId === g.id;
          return (
            <Animated.View key={g.id} entering={dropIn(80 + i * 50)}>
              <Pressable
                onPress={() => onSelectGoal(g)}
                className={`min-h-[76px] flex-row items-center p-2.5 pr-5 rounded-[20px] border-2 border-b-[5px] relative active:translate-y-[2px] active:border-b-2 ${
                  isSelected
                    ? 'bg-happy-tint border-happy-ink'
                    : 'bg-happy-surface border-happy-sep'
                }`}
                accessibilityRole="button"
                accessibilityLabel={`${g.label}, ${g.sub}`}
              >
                <View
                  className="w-[56px] h-[56px] rounded-[16px] items-center justify-center mr-3.5"
                  style={{ backgroundColor: g.tint }}
                >
                  <HappiIcon pose={g.id} size={48} />
                </View>

                <View className="flex-1">
                  <Text
                    className={`text-[17px] font-bold ${
                      isSelected ? 'text-happy-accent' : 'text-happy-label'
                    }`}
                  >
                    {g.label}
                  </Text>
                  <Text className="text-[14px] font-medium text-happy-label-2 mt-0.5 leading-snug">
                    {g.sub}
                  </Text>
                </View>

                {/* Selected check circle badge */}
                {isSelected && (
                  <Animated.View
                    entering={popIn(0, 200, 1.1)}
                    className="w-6 h-6 rounded-full bg-happy-ink items-center justify-center ml-2"
                  >
                    <Check size={14} color="#ffffff" strokeWidth={3.5} />
                  </Animated.View>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </Animated.ScrollView>
  );
}
