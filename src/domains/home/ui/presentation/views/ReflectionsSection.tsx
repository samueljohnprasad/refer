// ponytail: exact .mine section matching .agents/home.html's #day0 — most-recent reflection card + the
// conditional claim-account nudge (guest, not signed in, not deferred).
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { ReflectionData } from '@/src/domains/onboarding/domain/types';
import { useTranslation } from 'react-i18next';
import { TRAP_LABEL_KEYS, fromTrapType } from '@/src/domains/exercises/domain/trap';

export interface ReflectionsSectionProps {
  mostRecent: ReflectionData;
  count: number;
  isPersonal: boolean;
  showClaimNudge: boolean;
  onLater: () => void;
  onSave: () => void;
}

export function ReflectionsSection({
  mostRecent, count, isPersonal, showClaimNudge, onLater, onSave,
}: ReflectionsSectionProps): React.JSX.Element {
  const at = new Date(mostRecent.at ?? Date.now()).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
  const { t } = useTranslation('exercises');
  const choice = fromTrapType(mostRecent.trap);
  const trapLabel = choice ? t(TRAP_LABEL_KEYS[choice]) : undefined;

  return (
    <View className="mt-12">
      <View className="flex-row items-baseline justify-between mb-3">
        <Text className="text-t-lead font-extrabold tracking-tight text-happy-label">
          {isPersonal ? 'Your reflections' : 'Your practice'}
        </Text>
        <Text className="text-t-foot font-semibold text-happy-label-3">{count} kept</Text>
      </View>

      <View className="p-4 rounded-[20px] bg-happy-surface border border-happy-sep">
        {trapLabel && (
          <View className="self-start px-2.5 py-0.5 rounded-pill bg-happy-tint mb-2">
            <Text className="text-t-cap font-bold text-happy-accent">{trapLabel}</Text>
          </View>
        )}
        <Text className="text-t-sub text-happy-label-3">"{mostRecent.thought}"</Text>
        <View className="w-7 h-7 my-2 items-center justify-center rounded-full bg-happy-tint">
          <Svg width={12} height={16} viewBox="0 0 14 18" fill="none">
            <Path d="M7 1v14M2 10l5 5 5-5" stroke="#44633f" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
        <Text className="font-display text-t-lead font-bold leading-snug tracking-tight text-happy-label">
          {mostRecent.fair}
        </Text>
        <Text className="text-t-foot font-medium text-happy-label-3 mt-3">Today, {at}</Text>
      </View>

      {count > 1 && (
        <Text className="text-t-foot text-happy-label-3 mt-2 ml-1">
          +{count - 1} earlier reflection{count > 2 ? 's' : ''}
        </Text>
      )}

      {showClaimNudge && (
        <View className="flex-row items-center gap-3 mt-3 pt-2">
          <View className="flex-1">
            <Text className="text-t-sub font-bold text-happy-label">Keep it safe</Text>
            <Text className="text-t-foot text-happy-label-3">
              Sign in so {count > 1 ? 'they survive' : 'it survives'} a new phone.
            </Text>
          </View>
          <Pressable onPress={onLater} className="min-h-11 px-2 justify-center">
            <Text className="text-t-foot font-medium text-happy-label-3">Later</Text>
          </Pressable>
          <Pressable
            onPress={onSave}
            className="min-h-9 px-4 justify-center items-center rounded-pill bg-happy-ink border-b-[3px] border-b-sage-700"
          >
            <Text className="text-t-foot font-bold text-white">Save</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
