// ponytail: exact Saved Keepsake & Inline Reminder View matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';
import { ReminderPreset } from '../../../domain/enums';
import type { ReflectionData } from '../../../domain/types';
import type { ReminderStatus } from '../../containers/hooks/useReminderSelection';
import { SavedReflectionCard } from '../components/SavedReflectionCard';
import { InlineReminderBanner } from '../components/InlineReminderBanner';

export interface SavedKeepsakeStepViewProps {
  reflection: ReflectionData;
  reminderStatus: ReminderStatus;
  activeReminderTime: string | null;
  onPickPreset: (preset: ReminderPreset) => void;
  onChangeReminderTime: () => void;
  onGoHome: () => void;
}

export function SavedKeepsakeStepView({
  reflection,
  reminderStatus,
  activeReminderTime,
  onPickPreset,
  onChangeReminderTime,
  onGoHome,
}: SavedKeepsakeStepViewProps): React.JSX.Element {
  return (
    <View className="flex-1 justify-between px-4 pb-6">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <SavedReflectionCard reflection={reflection} />
        <InlineReminderBanner
          status={reminderStatus}
          activeTime={activeReminderTime}
          onPickPreset={onPickPreset}
          onChangeTime={onChangeReminderTime}
        />
      </ScrollView>

      {/* Chunky primary Go to Home button matching prototype */}
      <Pressable
        onPress={onGoHome}
        className="w-full min-h-[56px] bg-happy-ink rounded-pill items-center justify-center border-b-4 border-happy-accent active:translate-y-1 active:border-b-0 mt-2"
        accessibilityRole="button"
      >
        <Text className="text-white text-t-body font-bold">Go to Home</Text>
      </Pressable>
    </View>
  );
}
