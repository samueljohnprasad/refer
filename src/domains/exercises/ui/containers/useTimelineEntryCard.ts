// ponytail: stateful container for one My Log entry — owns expand/collapse + press-feedback
// animation, derives the domain view-model (arc/note), and reuses the existing data layer
// (ExerciseTimelineItem from useExerciseTimeline/useCBTHistory) untouched. Presentation layer
// below this (TimelineEntryCard.tsx) takes only the returned props, no hooks of its own.
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getExerciseConfig } from '@/src/data/exerciseRegistry';
import { getCategoryBadgeTheme } from '@/src/screens/ExercisesScreen/exerciseScreenUtils';
import {
  formatTimelineTimestamp,
  getLocalizedDistortion,
  getLocalizedExerciseTitle,
  getLocalizedLogFieldLabel,
  getLocalizedRatingLabel,
} from '@/src/screens/ExercisesScreen/components/ExerciseTimeline/timelineLocalization';
import type { ExerciseTimelineItem } from '@/src/screens/ExercisesScreen/components/ExerciseTimeline/types';
import { buildThoughtArc, buildTimelineNote, moveTone } from '../../domain/timelineEntry';

export function useTimelineEntryCard(item: ExerciseTimelineItem) {
  const { t } = useTranslation('exercises');
  const { t: commonT } = useTranslation('common');
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const [isExpanded, setIsExpanded] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 260, easing: Easing.out(Easing.cubic) }) }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.98, { duration: 100, easing: Easing.out(Easing.ease) });
  }, [scale]);
  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
  }, [scale]);

  const arc = useMemo(() => buildThoughtArc({
    previewLabel: item.previewLabel && getLocalizedLogFieldLabel(t, item.previewLabel),
    previewText: item.previewText,
    expandedLabel: item.expandedLabel && getLocalizedLogFieldLabel(t, item.expandedLabel),
    expandedText: item.expandedText,
  }), [item.previewLabel, item.previewText, item.expandedLabel, item.expandedText, t]);

  const note = useMemo(() => buildTimelineNote(
    item.emotions,
    item.tags?.map((tag) => getLocalizedDistortion(commonT, tag)),
  ), [item.emotions, item.tags, commonT]);

  const canExpand = !!(arc || note || item.gratitudeEntries?.length);

  const onToggle = useCallback(() => {
    Haptics.selectionAsync();
    if (canExpand) {
      setIsExpanded((prev) => !prev);
    } else {
      item.onPress();
    }
  }, [canExpand, item]);

  const hasMoveTrack = !arc && item.ratingLabel !== undefined
    && item.beforeRating !== undefined && item.afterRating !== undefined;

  return {
    isExpanded,
    animatedStyle,
    chevronStyle,
    onPressIn,
    onPressOut,
    onToggle,
    canExpand,
    exerciseType: item.exerciseType,
    categoryBg: getCategoryBadgeTheme(getExerciseConfig(item.exerciseType)?.category ?? 'cbt_core').bg,
    title: getLocalizedExerciseTitle(t, item),
    timeLabel: formatTimelineTimestamp(new Date(item.date), locale),
    collapsedPreviewText: !arc ? undefined : item.previewText,
    moveTrack: hasMoveTrack
      ? {
        before: item.beforeRating!,
        after: item.afterRating!,
        label: getLocalizedRatingLabel(t, item.ratingLabel!),
        tone: moveTone(item.ratingLabel!, item.beforeRating!, item.afterRating!),
      }
      : null,
    inProgressText: item.status === 'in_progress'
      ? item.pausedRung
        ? t('log.pausedRung', { ...item.pausedRung, defaultValue: "Paused at rung {{position}} of {{total}}. It's saved." })
        : t('log.pausedPartWay', { defaultValue: "Paused part way. It's saved." })
      : undefined,
    arc,
    note,
    gratitudeEntries: item.gratitudeEntries,
    onOpenAgain: item.onPress,
  };
}
