// ponytail: matches .agents/exercises.html's `.next` — one exercise you have not tried, one pill.
// Navigation reuses CircularRevealWrapper like every other exercise card.
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { CircularRevealWrapper } from '@/src/components/CircularRevealWrapper';
import { ExerciseArt } from '@/src/domains/exercises/ui/presentation/components/ExerciseArt';
import { buildExerciseRoute, getCategoryBadgeTheme } from '@/src/screens/ExercisesScreen/exerciseScreenUtils';
import type { ExerciseConfig } from '@/src/types/exerciseFlow';

export function PracticeNextCard({ exercise }: { exercise: ExerciseConfig<any> }): React.JSX.Element {
  const theme = getCategoryBadgeTheme(exercise.category);
  return (
    <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={theme.bg}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Not tried yet: ${exercise.title}. Try it`}
        className="flex-row items-center gap-3 p-3 rounded-2xl bg-happy-surface border border-happy-sep"
      >
        <View className="w-12 h-12 rounded-xl overflow-hidden" style={{ backgroundColor: theme.bg }}>
          <ExerciseArt type={exercise.type} />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-t-foot font-bold text-happy-accent">Not tried yet</Text>
          <Text className="font-bold leading-tight text-happy-label" numberOfLines={1}>{exercise.title}</Text>
          <Text className="mt-0.5 text-t-foot font-semibold text-happy-label-2">{exercise.duration}</Text>
        </View>
        <View className="min-h-11 px-4 justify-center rounded-pill bg-happy-ink">
          <Text className="text-t-foot font-bold text-white">Try it</Text>
        </View>
      </Pressable>
    </CircularRevealWrapper>
  );
}
