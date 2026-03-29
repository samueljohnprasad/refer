import React, { useCallback } from 'react';
import { View, ScrollView, Pressable, AccessibilityInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Clock01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';

import { CBTExercise } from '@/src/types/exercises';
import { CBT_EXERCISES } from '@/src/data/exercises';

// ---------------------------------------------------------------------------
// Route map — exercises without a route show a "coming soon" state
// ---------------------------------------------------------------------------
const ROUTE_MAP: Record<string, string> = {
  'thought-reframing': '/tabs/screens/thought-reframing',
  'gratitude-reframe': '/tabs/screens/gratitude-reframe',
};

// ---------------------------------------------------------------------------
// ExerciseCard — presentational, single-responsibility
// ---------------------------------------------------------------------------
interface ExerciseCardProps {
  exercise: CBTExercise;
  onPress: (exercise: CBTExercise) => void;
}

function ExerciseCard({ exercise, onPress }: ExerciseCardProps): React.JSX.Element {
  const isAvailable: boolean = Boolean(ROUTE_MAP[exercise.id]);

  return (
    <Pressable
      onPress={() => onPress(exercise)}
      accessibilityRole="button"
      accessibilityLabel={`${exercise.title}: ${exercise.subtitle}. Duration: ${exercise.duration}.${!isAvailable ? ' Coming soon.' : ''}`}
      accessibilityState={{ disabled: !isAvailable }}
      className={`bg-white rounded-3xl p-4 shadow-sm shadow-slate-200 border border-slate-100 flex-row items-center mb-4 ${
        !isAvailable ? 'opacity-50' : 'active:bg-slate-50'
      }`}
    >
      {/* Icon tile */}
      <View
        style={{ backgroundColor: exercise.backgroundColor }}
        className="h-16 w-16 rounded-2xl items-center justify-center mr-4"
        accessible={false}
      >
        <Text className="text-[32px]">{exercise.icon}</Text>
        <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
          <Text className="text-sm">{exercise.badgeIcon}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 py-1">
        {/* Title row */}
        <View className="flex-row items-center mb-1">
          <Text className="text-[17px] font-bold text-slate-800 mr-2 flex-shrink">
            {exercise.title}
          </Text>
          {!isAvailable && (
            <View className="bg-amber-100 px-[6px] py-[2px] rounded-md">
              <Text className="text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                Soon
              </Text>
            </View>
          )}
        </View>

        {/* Subtitle */}
        <Text className="text-[14px] text-slate-500 mb-2 font-medium">
          {exercise.subtitle}
        </Text>

        {/* Duration chip */}
        <View className="flex-row items-center">
          <View className="bg-slate-100 px-2 py-1 rounded-full flex-row items-center">
            <HugeiconsIcon icon={Clock01Icon} size={12} color="#64748B" />
            <Text className="text-slate-500 text-xs font-bold ml-1">
              {exercise.duration}
            </Text>
          </View>
        </View>
      </View>

      {/* Chevron — darker for visibility (Fitts's Law: clear affordance) */}
      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#94A3B8" />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Empty state — shown when no exercises are loaded
// ---------------------------------------------------------------------------
function EmptyState(): React.JSX.Element {
  return (
    <View
      className="items-center justify-center py-16 px-8"
      accessibilityLiveRegion="polite"
    >
      <Text
        className="text-[48px] mb-4"
        accessibilityLabel="Exercise illustration"
        accessibilityRole="image"
      >
        🏋️
      </Text>
      <Text className="text-xl font-bold text-slate-700 mb-2 text-center">
        No exercises yet
      </Text>
      <Text className="text-sm text-slate-400 text-center leading-relaxed">
        Exercises will appear here as they become available. Check back soon!
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ExercisesScreen — container
// ---------------------------------------------------------------------------
export default function ExercisesScreen(): React.JSX.Element {
  const handleExercisePress = useCallback((exercise: CBTExercise): void => {
    const route: string | undefined = ROUTE_MAP[exercise.id];
    if (route) {
      router.push(route as never);
    } else {
      // Exercise not yet available — announce to screen readers and do nothing
      AccessibilityInfo.announceForAccessibility(
        `${exercise.title} is coming soon.`,
      );
    }
  }, []);

  const hasExercises: boolean = CBT_EXERCISES.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Header ---- */}
        <View className="mb-6 flex-row justify-between items-center mt-4">
          <View className="flex-1 pr-4">
            <Text className="text-3xl font-bold text-slate-800 mb-1">
              CBT Exercises
            </Text>
            <Text className="text-base text-slate-500">
              {hasExercises
                ? `${CBT_EXERCISES.length} exercise${CBT_EXERCISES.length === 1 ? '' : 's'} available`
                : 'Exercises to help shift your thinking'}
            </Text>
          </View>
          <View
            className="h-16 w-16 items-center justify-center -mr-2"
            accessible={true}
            accessibilityLabel="CBT exercises illustration"
            accessibilityRole="image"
          >
            <Text className="text-[46px]">🧠</Text>
          </View>
        </View>

        {/* ---- Exercise list or empty state ---- */}
        {hasExercises ? (
          <View>
            {CBT_EXERCISES.map((exercise: CBTExercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onPress={handleExercisePress}
              />
            ))}
          </View>
        ) : (
          <EmptyState />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
