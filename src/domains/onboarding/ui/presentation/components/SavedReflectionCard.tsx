// ponytail: exact Keepsake Card matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { Check, ArrowDown } from 'lucide-react-native';
import type { ReflectionData } from '../../../domain/types';
import { SceneArtSvg } from './SceneArtSvg';
import { HappiHeadSvg } from './HappiHeadSvg';
import { TRAP_LABELS } from '../../../domain/traps';
import { formatBeliefSummary } from '../../../domain/scoring';
import { GOALS } from '../../../domain/goals';

export interface SavedReflectionCardProps {
  reflection: ReflectionData;
}

export function SavedReflectionCard({
  reflection,
}: SavedReflectionCardProps): React.JSX.Element {
  const isPersonal = reflection.source === 'personal';
  const trapTitle = reflection.trap ? TRAP_LABELS[reflection.trap] : '';
  const beliefText = formatBeliefSummary(reflection.before, reflection.after);
  const formattedDate = format(new Date(), 'MMM d');
  const goal = GOALS.find((g) => g.id === (reflection.art ?? reflection.goal));
  const bandTint = goal?.tint ?? 'var(--color-happy-tint)';

  return (
    <View className="relative w-full rounded-l border-2 border-b-[5px] border-happy-sep bg-happy-surface my-6">
      {/* Corner sticker rotated 8deg (exact prototype) */}
      <View
        className="absolute -top-4 right-3.5 w-[62px] h-[62px] p-1 border-2 border-happy-sep rounded-pill bg-happy-surface z-20 items-center justify-center"
        style={{ transform: [{ rotate: '8deg' }] }}
      >
        <HappiHeadSvg goalId="card" size={48} />
      </View>

      {/* Top Band */}
      <View
        className="rounded-t-[22px] overflow-hidden"
        style={{ backgroundColor: bandTint }}
      >
        {!isPersonal && reflection.art && (
          <View className="px-4 pt-3">
            <SceneArtSvg goalId={reflection.art} caption="" />
          </View>
        )}

        <View className="flex-row items-center gap-1.5 px-4 py-3">
          <View className="w-[18px] h-[18px] rounded-full bg-happy-accent items-center justify-center">
            <Check size={11} color="#ffffff" strokeWidth={3.5} />
          </View>
          <Text className="text-t-foot font-bold text-happy-accent">
            {isPersonal ? 'Saved to your journal' : 'Saved as practice'}
          </Text>
          <Text className="text-t-foot font-semibold text-happy-label-2 ml-auto mr-14">
            {formattedDate}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View className="p-4">
        {/* Was section */}
        <View className="p-3.5 rounded-m bg-happy-surface-2">
          {isPersonal && Boolean(reflection.situation) && (
            <View className="mb-2">
              <Text className="text-t-foot font-semibold text-happy-label-2">What happened</Text>
              <Text className="text-t-sub font-medium text-happy-label mt-0.5">
                {reflection.situation}
              </Text>
            </View>
          )}
          <Text className="text-t-foot font-semibold text-happy-label-2">
            {isPersonal ? 'You thought' : 'The thought'}
          </Text>
          <Text className="text-t-sub font-medium text-happy-label mt-0.5">
            “{reflection.thought}”
          </Text>
        </View>

        {/* Turn Circle with 4px white halo */}
        <View className="w-8 h-8 rounded-full bg-happy-ink self-center items-center justify-center my-[-8px] z-10 border-4 border-white shadow-xs">
          <ArrowDown size={14} color="#ffffff" strokeWidth={3} />
        </View>

        {/* Now section (chosen reframe in display style) */}
        <View className="p-4 border-2 border-happy-ink rounded-m bg-happy-tint mt-1 mb-3">
          <Text className="text-t-foot font-semibold text-happy-accent">
            {isPersonal ? 'You landed on' : 'Another view'}
          </Text>
          <Text className="text-t-lead font-bold text-happy-label mt-1 leading-snug">
            {reflection.fair}
          </Text>
        </View>

        {/* Stats grid */}
        <View className="flex-row flex-wrap gap-2 mt-1">
          <View className="flex-1 min-w-[130px] p-3 rounded-m bg-happy-surface-2">
            <Text className="text-t-foot font-semibold text-happy-label-2">How true it felt</Text>
            <Text className="text-t-sub font-bold text-happy-label mt-1">{beliefText}</Text>
          </View>
          <View className="flex-1 min-w-[130px] p-3 rounded-m bg-happy-surface-2">
            <Text className="text-t-foot font-semibold text-happy-label-2">Practice</Text>
            <Text className="text-t-sub font-bold text-happy-label mt-1">1 completed · 1 of 3 this week</Text>
          </View>
          {Boolean(trapTitle) && (
            <View className="w-full p-3 rounded-m bg-happy-surface-2">
              <Text className="text-t-foot font-semibold text-happy-label-2">Trap</Text>
              <Text className="text-t-sub font-bold text-happy-label mt-1">{trapTitle}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
