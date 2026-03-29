import React, { useCallback, useState } from 'react';
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
  'thought-catcher': '/tabs/screens/thought-catcher',
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
// LogCard — presentational, displays a history entry
// ---------------------------------------------------------------------------
import { useCBTHistory, HistoryLogItem } from './hooks/useCBTHistory';
import { format } from 'date-fns';
import { CheckmarkBadge01Icon, Time02Icon } from '@hugeicons/core-free-icons';

function formatStatus(status: string): { label: string; isComplete: boolean; colorClass: string; bgClass: string } {
  if (status === 'checker_completed' || status === 'completed' || status === 'summary') {
    return { label: 'Completed', isComplete: true, colorClass: 'text-emerald-700', bgClass: 'bg-emerald-100' };
  } else if (status === 'catcher_completed') {
    return { label: 'Ready to Reframe', isComplete: false, colorClass: 'text-amber-700', bgClass: 'bg-amber-100' };
  }
  return { label: 'Resume Session', isComplete: false, colorClass: 'text-slate-700', bgClass: 'bg-slate-200' };
}

function LogCard({ item, onPress }: { item: HistoryLogItem; onPress: (item: HistoryLogItem) => void }): React.JSX.Element {
  const { label, isComplete, colorClass, bgClass } = formatStatus(item.status);
  const titleStr = item.title && item.title.trim().length > 0 ? item.title : 'Untitled Session';

  const typeLabels = {
    catcher: 'Thought Catcher',
    reframing: 'Thought Reframing',
    gratitude: 'Gratitude Reframe',
  };
  const typeIcons = {
    catcher: '💡',
    reframing: '🧭',
    gratitude: '✨',
  };

  const typeLabel = typeLabels[item.type];
  const typeIcon = typeIcons[item.type];

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="bg-white rounded-3xl p-4 shadow-sm shadow-slate-200 border border-slate-100 flex-row items-center mb-4 active:bg-slate-50"
    >
      {/* Icon tile */}
      <View
        style={{ backgroundColor: isComplete ? '#D1FAE5' : '#FEF3C7' }}
        className="h-14 w-14 rounded-2xl items-center justify-center mr-4"
      >
        <Text className="text-[28px]">{typeIcon}</Text>
      </View>

      {/* Content */}
      <View className="flex-1 py-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[13px] font-bold text-slate-400 tracking-tight">
            {typeLabel}
          </Text>
          <Text className="text-[13px] text-slate-400">
            {format(new Date(item.date), 'MMM d, h:mm a')}
          </Text>
        </View>

        <Text className="text-base font-bold text-slate-800 mb-2 truncate" numberOfLines={1}>
          {titleStr}
        </Text>

        <View className="flex-row items-center">
          <View className={`${bgClass} px-2 py-1 rounded-full flex-row items-center`}>
            <HugeiconsIcon icon={isComplete ? CheckmarkBadge01Icon : Time02Icon} size={12} color={isComplete ? '#047857' : '#B45309'} />
            <Text className={`${colorClass} text-[10px] font-bold uppercase tracking-wider ml-1`}>
              {label}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// ExercisesScreen — container
// ---------------------------------------------------------------------------
export default function ExercisesScreen(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'discover' | 'log'>('discover');
  const { data: history = [], isLoading: isLoadingHistory } = useCBTHistory();

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

  const handleLogPress = useCallback((item: HistoryLogItem): void => {
    if (item.type === 'catcher') {
      router.push(`/tabs/screens/thought-checker?id=${item.id}`);
    } else if (item.type === 'reframing') {
      router.push(`/tabs/screens/thought-reframing?id=${item.id}`);
    } else if (item.type === 'gratitude') {
      router.push(`/tabs/screens/gratitude-reframe?id=${item.id}`);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <View className="px-5 pt-4 pb-2 bg-white flex-row items-end justify-between border-b border-slate-100 shadow-sm z-10">
        <View className="flex-row">
          <Pressable
            onPress={() => setActiveTab('discover')}
            className={`mr-6 pb-2 border-b-2 ${
              activeTab === 'discover' ? 'border-slate-800' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-2xl font-bold ${
                activeTab === 'discover' ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              Discover
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('log')}
            className={`pb-2 border-b-2 ${
              activeTab === 'log' ? 'border-slate-800' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-2xl font-bold ${
                activeTab === 'log' ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              My Log
            </Text>
          </Pressable>
        </View>
        <View
          className="h-10 w-10 items-center justify-center -mr-2 -mt-4 opacity-50"
          accessible={true}
          accessibilityLabel="CBT exercises illustration"
          accessibilityRole="image"
        >
          <Text className="text-[28px]">🧠</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'discover' ? (
          <>
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
          </>
        ) : (
          <View>
            {isLoadingHistory ? (
              <View className="py-12 items-center">
                <Text className="text-slate-400">Loading history...</Text>
              </View>
            ) : history.length > 0 ? (
              history.map((item) => (
                <LogCard key={`${item.type}-${item.id}`} item={item} onPress={handleLogPress} />
              ))
            ) : (
              <View className="items-center justify-center py-16 px-8">
                <Text className="text-[48px] mb-4">📚</Text>
                <Text className="text-xl font-bold text-slate-700 mb-2 text-center">
                  Your CBT history
                </Text>
                <Text className="text-sm text-slate-400 text-center leading-relaxed">
                  You haven't completed any exercises yet. Head over to the Discover tab to get started!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
