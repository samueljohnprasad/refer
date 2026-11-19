// ponytail: the saved card of .agents / key-saved-card-cases.html — standard (rung 3), catch-only (rung 2)
// and hard entry. Fill and hairline only; no bubble, no shadow, no celebration.
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { WORD } from '../../../domain/scoring';

export type SavedVariant = 'standard' | 'caught' | 'hard';

export interface SavedEntryCardProps {
  variant: SavedVariant;
  thought: string;
  fairer?: string;
  /** 0-10 believability before and after; the after is absent when it was not set */
  before: number;
  after: number | null;
  trapName?: string;
  /** undefined until usePracticeCounts has data */
  counts?: { lifetime: number; thisWeek: number };
  /** AD-26: queued entries show the unsynced line and no counts */
  sync?: 'synced' | 'queued';
}

const WEEK_GOAL = 3;

function Ring({ value }: { value: number }): React.JSX.Element {
  const c = 2 * Math.PI * 14.5;
  const fraction = Math.min(1, value / WEEK_GOAL);
  return (
    <Svg width={34} height={34} viewBox="0 0 34 34" style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={17} cy={17} r={14.5} fill="none" stroke="#e5ede1" strokeWidth={5} />
      {fraction > 0 && <Circle cx={17} cy={17} r={14.5} fill="none" stroke="#5f7f58" strokeWidth={5} strokeLinecap="round" strokeDasharray={`${fraction * c} ${c}`} />}
    </Svg>
  );
}

export function SavedEntryCard({ variant, thought, fairer, before, after, trapName, counts, sync = 'synced' }: SavedEntryCardProps): React.JSX.Element {
  const { t } = useTranslation('exercises');
  const row = 'mt-3 border-t border-happy-sep pt-3';
  return (
    <View className="rounded-3xl bg-happy-surface-2 p-4">
      <View className="flex-row items-center gap-1">
        <Feather name="check" size={14} color="#44633f" />
        <Text className="text-t-foot text-happy-accent">{t('thoughtCatcher.saved.title')}</Text>
      </View>
      {variant === 'hard' ? (
        <Text accessibilityRole="header" className="mt-2 text-t-body font-bold text-happy-label">{t('thoughtCatcher.saved.hard')}</Text>
      ) : (
        <Text accessibilityRole="header" className="mt-2 font-display text-t-title font-semibold leading-[29px] text-happy-label">
          {t(variant === 'caught' ? 'thoughtCatcher.saved.caught' : 'thoughtCatcher.saved.move')}
        </Text>
      )}
      <View className={row}>
        <View className="flex-row justify-between">
          <Text className="text-t-foot text-happy-label-2">{t('thoughtCatcher.saved.thoughtRow')}</Text>
          {variant === 'standard' && <Text className="text-t-foot text-happy-label-2">{`${t('thoughtCatcher.saved.before')}: ${WORD(before)}`}</Text>}
        </View>
        <Text className="text-t-body text-happy-label-2">{thought}</Text>
      </View>
      {variant === 'standard' && !!fairer && (
        <View className={row}>
          <View className="flex-row justify-between">
            <Text className="text-t-foot text-happy-label-2">{t('thoughtCatcher.saved.another')}</Text>
            {after !== null && <Text className="text-t-foot text-happy-label-2">{`${t('thoughtCatcher.saved.now')}: ${WORD(after)}`}</Text>}
          </View>
          <Text className="text-t-body font-bold text-happy-accent">{fairer}</Text>
        </View>
      )}
      {variant === 'standard' && !!trapName && <Text className="mt-2 text-t-foot text-happy-label-2">{trapName}</Text>}
      {sync === 'queued' && (
        <View className={row}>
          <Text className="text-t-foot text-happy-label-2">{t('thoughtCatcher.saved.unsynced')}</Text>
        </View>
      )}
      {sync === 'synced' && counts && (
        <View className={row}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="font-display text-[34px] font-semibold leading-[40px] text-happy-label">{counts.lifetime}</Text>
              <Text className="text-t-foot text-happy-label-2">{t('thoughtCatcher.saved.practices')}</Text>
            </View>
            <View className="flex-row items-center gap-2" accessible accessibilityLabel={t('thoughtCatcher.saved.ofThree', { count: Math.min(counts.thisWeek, WEEK_GOAL) })}>
              <Ring value={counts.thisWeek} />
              <Text className="text-t-foot text-happy-label-2">{t('thoughtCatcher.saved.ofThree', { count: Math.min(counts.thisWeek, WEEK_GOAL) })}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
