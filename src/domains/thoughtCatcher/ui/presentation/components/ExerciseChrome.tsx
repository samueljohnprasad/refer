// ponytail: header (back, three stage segments, Get help, close), footer and toast — the wizard's frame.
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface ExerciseHeaderProps {
  progress: readonly number[];
  progressText: string;
  canGoBack: boolean;
  onBack: () => void;
  onHelp: () => void;
  onClose: () => void;
}

export function ExerciseHeader({ progress, progressText, canGoBack, onBack, onHelp, onClose }: ExerciseHeaderProps): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-3 px-3 pt-2">
      <Pressable onPress={onBack} disabled={!canGoBack} accessibilityRole="button" accessibilityLabel="Back" style={{ opacity: canGoBack ? 1 : 0 }} className="h-11 w-11 items-center justify-center">
        <Feather name="chevron-left" size={26} color="#142414" />
      </Pressable>
      <View className="flex-1 flex-row gap-1.5" accessibilityRole="progressbar" accessibilityLabel="Progress" accessibilityValue={{ text: progressText }}>
        {progress.map((pct, i) => (
          <View key={i} className="h-2 flex-1 overflow-hidden rounded-pill bg-happy-sep">
            <View className="h-full rounded-pill bg-happy-ink" style={{ width: `${pct}%` }} />
          </View>
        ))}
      </View>
      <Pressable onPress={onHelp} accessibilityRole="button" className="min-h-11 justify-center px-2">
        <Text className="text-t-foot font-semibold text-happy-label-2">Get help</Text>
      </Pressable>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Exit exercise" className="h-11 w-11 items-center justify-center">
        <Feather name="x" size={24} color="#142414" />
      </Pressable>
    </View>
  );
}

export interface ExerciseFooterProps {
  nextLabel: string;
  nextEnabled: boolean;
  onNext: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export function ExerciseFooter({ nextLabel, nextEnabled, onNext, secondaryLabel, onSecondary }: ExerciseFooterProps): React.JSX.Element {
  return (
    <View className="flex-row gap-3 px-4 pb-6 pt-3">
      {secondaryLabel ? (
        <Pressable onPress={onSecondary} accessibilityRole="button" className="min-h-14 items-center justify-center rounded-pill bg-happy-surface-2 px-5">
          <Text className="text-lg font-bold text-happy-label">{secondaryLabel}</Text>
        </Pressable>
      ) : null}
      <Pressable
        onPress={onNext}
        disabled={!nextEnabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: !nextEnabled }}
        className="min-h-14 flex-1 items-center justify-center rounded-pill px-5 active:translate-y-0.5"
        style={{ backgroundColor: nextEnabled ? '#5f7f58' : '#e5e5e5', borderBottomWidth: 4, borderBottomColor: nextEnabled ? '#29452a' : '#cfcfcf' }}
      >
        <Text className="text-lg font-bold" style={{ color: nextEnabled ? '#fff' : '#4b4b4b' }}>{nextLabel}</Text>
      </Pressable>
    </View>
  );
}

export function Toast({ message }: { message: string | null }): React.JSX.Element | null {
  if (!message) return null;
  return (
    <View pointerEvents="none" className="absolute inset-x-0 bottom-28 items-center" accessibilityLiveRegion="polite">
      <View className="rounded-pill bg-happy-label px-5 py-3"><Text className="text-t-body font-bold text-white">{message}</Text></View>
    </View>
  );
}
