// ponytail: the start screen (.agents/abc-analysis.html's `intro`): what this takes, the picture, Happi's
// question, and the sentence the exercise will build, every part still a gap.
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import type { ABCAnalysisResponse, StepProps } from '@/src/types/exerciseFlow';
import { ExerciseArt } from '@/src/domains/exercises/ui/presentation/components/ExerciseArt';
import { AbcAsk } from './abcAsk';
import { resetAbcCrisis } from './useAbcCrisisGuard';

export function AbcIntroStep(_: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  useEffect(resetAbcCrisis, []); // a new run: Happi may come back
  const gap = (k: string) => <Text className="text-t-foot font-medium text-happy-label-3">{`[${k}]`}</Text>;
  return (
    <View>
      <Text className="text-t-foot font-semibold text-happy-label-2">ABC Analysis · 7 to 10 min · private to you</Text>
      <View className="mt-3 rounded-3xl overflow-hidden bg-[#e2eef8]" style={{ aspectRatio: 160 / 96 }}>
        <ExerciseArt type="abc_analysis" />
      </View>
      <AbcAsk question="Did something upset you today?" />
      <Text className="text-t-lead leading-7 font-medium text-happy-label-2">
        When {gap('A')}, I thought {gap('B')}, and felt {gap('C')}.
      </Text>
    </View>
  );
}
