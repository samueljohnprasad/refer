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
      {/* Happi asks from bubble on right (Duolingo style) */}
      <View className="flex-row items-start gap-2 pt-2 mb-5">
        <View className="w-[92px] items-center justify-center">
          {guideStage ?? <HappiGuideStage weather={0.35} size="mini" />}
        </View>
        <View className="relative flex-1 mt-3 p-3.5 border-2 border-happy-sep rounded-2xl bg-happy-surface shadow-xs">
          {/* Bubble tail pointing left to Happi */}
          <View className="absolute -left-2 top-6 w-3 h-3 bg-happy-surface border-l-2 border-b-2 border-happy-sep rotate-45" />
          <Text className="text-t-title font-semibold font-display text-happy-label leading-tight">
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
              className={`min-h-[76px] flex-row items-center p-2 pr-6 rounded-2xl border-2 relative active:translate-y-0.5 ${
                isSelected
                  ? 'bg-happy-tint border-happy-ink shadow-[0_3px_0_var(--color-happy-ink)]'
                  : 'bg-happy-surface border-happy-sep shadow-[0_3px_0_var(--color-happy-sep)]'
              }`}
            >
              <View
                className="w-[58px] h-[58px] rounded-m items-center justify-center mr-3.5"
                style={{ backgroundColor: g.tint }}
              >
                <HappiHeadSvg goalId={g.id} size={50} />
              </View>

              <View className="flex-1">
                <Text
                  className={`text-t-body font-bold ${
                    isSelected ? 'text-happy-accent' : 'text-happy-label'
                  }`}
                >
                  {g.label}
                </Text>
                <Text className="text-t-sub font-medium text-happy-label-2 mt-0.5">
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
