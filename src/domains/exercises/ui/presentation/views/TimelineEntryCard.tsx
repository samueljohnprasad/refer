// ponytail: exact .en/.enh/.exp matching .agents/exercises.html's My Log entry — pure JSX only,
// every prop is already-derived data from useTimelineEntryCard (container) + ThoughtArc/
// TimelineNote/GratitudeList/MoveTrack (presentation). No hooks, no data fetching here.
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import type { ExerciseType } from '@/src/types/exerciseFlow';
import { ExerciseArt } from '../components/ExerciseArt';
import { MoveTrack } from '../components/MoveTrack';
import { ThoughtArc } from '../components/ThoughtArc';
import { TimelineNote } from '../components/TimelineNote';
import { GratitudeList } from '../components/GratitudeList';
import type { MoveTone, ThoughtArcModel, TimelineNoteModel } from '../../../domain/timelineEntry';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface TimelineEntryCardProps {
  isExpanded: boolean;
  animatedStyle: any;
  chevronStyle: any;
  onPressIn: () => void;
  onPressOut: () => void;
  onToggle: () => void;
  canExpand: boolean;
  exerciseType: ExerciseType;
  categoryBg: string;
  title: string;
  timeLabel: string;
  collapsedPreviewText?: string;
  moveTrack?: { before: number; after: number; label: string; tone: MoveTone } | null;
  inProgressText?: string;
  arc: ThoughtArcModel | null;
  note: TimelineNoteModel | null;
  gratitudeEntries?: readonly string[];
  onOpenAgain: () => void;
}

export function TimelineEntryCard(props: TimelineEntryCardProps): React.JSX.Element {
  const {
    isExpanded, animatedStyle, chevronStyle, onPressIn, onPressOut, onToggle, canExpand,
    exerciseType, categoryBg, title, timeLabel, collapsedPreviewText, moveTrack, inProgressText,
    arc, note, gratitudeEntries, onOpenAgain,
  } = props;

  return (
    <View className="mb-2 px-3 rounded-2xl bg-happy-surface border border-happy-sep">
      <AnimatedPressable
        style={animatedStyle}
        onPress={onToggle}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="flex-row items-start gap-3 py-3"
      >
        <View className="w-12 h-12 rounded-xl overflow-hidden" style={{ backgroundColor: categoryBg }}>
          <ExerciseArt type={exerciseType} />
        </View>

        <View className="flex-1 min-w-0">
          <View className="flex-row items-baseline justify-between gap-2">
            <Text className="font-bold leading-tight text-happy-label" numberOfLines={1}>{title}</Text>
            <Text className="text-t-cap font-bold text-happy-label-3">{timeLabel}</Text>
          </View>

          {collapsedPreviewText && (
            <Text className="text-t-sub leading-snug text-happy-label-2 mt-0.5" numberOfLines={2}>
              "{collapsedPreviewText}"
            </Text>
          )}
          {!collapsedPreviewText && moveTrack && (
            <View className="flex-row items-center gap-2 mt-1.5">
              <MoveTrack before={moveTrack.before} after={moveTrack.after} tone={moveTrack.tone} />
              <Text className="text-t-foot font-bold text-happy-label-2" numberOfLines={1}>
                {moveTrack.label} went {moveTrack.after < moveTrack.before ? 'down' : moveTrack.after > moveTrack.before ? 'up' : 'nowhere'}, {moveTrack.before} to {moveTrack.after}
              </Text>
            </View>
          )}
          {!collapsedPreviewText && !moveTrack && inProgressText && (
            <Text className="text-t-sub text-happy-label-2 mt-0.5">{inProgressText}</Text>
          )}
        </View>

        {canExpand ? (
          <Animated.View style={chevronStyle} className="mt-1">
            <Feather name="chevron-down" size={20} color="#767676" />
          </Animated.View>
        ) : (
          <Feather name="chevron-right" size={20} color="#767676" style={{ marginTop: 4 }} />
        )}
      </AnimatedPressable>

      {isExpanded && (
        <View className="pl-[60px] pb-4 flex-col gap-4">
          {arc && <ThoughtArc arc={arc} />}
          {note && <TimelineNote note={note} />}
          {gratitudeEntries && gratitudeEntries.length > 0 && <GratitudeList entries={gratitudeEntries} />}

          <Pressable onPress={onOpenAgain} className="self-start min-h-11 justify-center">
            <Text className="text-t-foot font-bold text-happy-accent">Do it again →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
