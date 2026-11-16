// ponytail: exact S1 Goal Pick UI matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { GoalId } from '../../../domain/enums';
import type { GoalDefinition } from '../../../domain/types';
import { HappiHeadSvg } from '../components/HappiHeadSvg';
import { HappiGuideStage } from '../components/HappiGuideStage';

export interface GoalPickStepViewProps {
  goals: GoalDefinition[];
  selectedGoalId: GoalId | null;
  guideStage?: React.ReactNode;
  onSelectGoal: (goal: GoalDefinition) => void;
}

export function GoalPickStepView({
  goals,
  selectedGoalId,
  guideStage,
  onSelectGoal,
}: GoalPickStepViewProps): React.JSX.Element {
  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      {/* Happi asks from bubble on right (Duolingo / BitePal style) */}
      <View className="flex-row items-start gap-2 pt-2 mb-4">
        <View className="w-[88px] items-center justify-center">
          {guideStage ?? <HappiGuideStage weather={0.35} size="mini" hideWeather />}
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
        {goals.map((g) => {
          const isSelected = selectedGoalId === g.id;
          return (
            <Pressable
              key={g.id}
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
                <HappiHeadSvg goalId={g.id} size={48} />
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
                <View className="w-6 h-6 rounded-full bg-happy-ink items-center justify-center ml-2">
                  <Check size={14} color="#ffffff" strokeWidth={3.5} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
