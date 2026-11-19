// ponytail: exact .ask/.feel/.you/.rec section matching .agents/exercises.html's Lessons chat
// picker — Happi asks once, reply tiles route to one recommendation. Only exercises with real
// EXERCISE_REPLY_COPY render as tiles (see exerciseCopy.ts for why the prototype's 15-exercise
// set is narrower here); "Not sure" falls back to the first free, untried exercise.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { HappiStage } from '@/src/domains/onboarding/ui/presentation/components/HappiStage';
import { useHappiGuideMotion } from '@/src/domains/onboarding/ui/containers/useHappiGuideMotion';
import { ActingPose } from '@/src/domains/onboarding/ui/containers/happiPoses';
import { CircularRevealWrapper } from '@/src/components/CircularRevealWrapper';
import { useFreemiumGate } from '@/src/hooks/useFreemiumGate';
import type { ExerciseConfig, ExerciseType } from '@/src/types/exerciseFlow';
import { ExerciseArt, ReplyGlyph } from '../components/ExerciseArt';
import { EXERCISE_REPLY_COPY, AUTO_FALLBACK } from '../../../data/exerciseCopy';
import { getCategoryBadgeTheme, buildExerciseRoute } from '@/src/screens/ExercisesScreen/exerciseScreenUtils';

export interface LessonsChatPickerProps {
  exercises: ExerciseConfig<any>[];
  recentIds: string[];
  onStart: (exercise: ExerciseConfig<any>) => void;
}

export function LessonsChatPicker({ exercises, recentIds, onStart }: LessonsChatPickerProps): React.JSX.Element | null {
  const { hasPro } = useFreemiumGate();
  const motion = useHappiGuideMotion();
  const { setPose } = motion;
  useEffect(() => { setPose(ActingPose.Wave); }, [setPose]);

  const replies = useMemo(
    () => exercises.filter((e) => EXERCISE_REPLY_COPY[e.type]),
    [exercises],
  );

  const autoTarget = useMemo(() => {
    const untried = exercises.find((e) => !e.isProOnly && !recentIds.includes(e.type));
    return untried ?? exercises.find((e) => !e.isProOnly) ?? exercises[0] ?? null;
  }, [exercises, recentIds]);

  const [pickedType, setPickedType] = useState<ExerciseType | 'auto' | null>(null);

  const reset = useCallback(() => setPickedType(null), []);

  if (replies.length === 0 && !autoTarget) return null;

  const picked: { exercise: ExerciseConfig<any>; reply: string; why: string } | null =
    pickedType === 'auto'
      ? (autoTarget ? { exercise: autoTarget, reply: AUTO_FALLBACK.reply, why: AUTO_FALLBACK.why } : null)
      : pickedType
        ? (() => {
            const exercise = exercises.find((e) => e.type === pickedType);
            const copy = exercise ? EXERCISE_REPLY_COPY[exercise.type] : undefined;
            return exercise && copy ? { exercise, reply: copy.reply, why: copy.why } : null;
          })()
        : null;

  if (!picked) {
    return (
      <View className="mb-4">
        <View className="flex-row items-end gap-2">
          <View style={{ width: 92, aspectRatio: 220 / 246 }}>
            <HappiStage motion={motion} size="scene" width={92} />
          </View>
          <View className="flex-1 self-center px-4 py-3 rounded-2xl bg-happy-tint">
            <Text className="text-t-h font-bold text-happy-label">What's on your mind?</Text>
            <Text className="text-t-sub text-happy-label-2 mt-0.5">Pick the closest. I'll suggest one.</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {replies.map((exercise) => {
            const copy = EXERCISE_REPLY_COPY[exercise.type]!;
            const theme = getCategoryBadgeTheme(exercise.category);
            return (
              <Pressable
                key={exercise.type}
                onPress={() => setPickedType(exercise.type)}
                className="basis-[48%] grow min-h-28 p-3 pb-4 rounded-[20px] active:scale-95"
                style={{ backgroundColor: theme.bg }}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mb-3 bg-white"
                >
                  <View style={{ width: 24, height: 24 }}>
                    <ReplyGlyph kind={copy.glyph} />
                  </View>
                </View>
                <Text className="text-t-sub font-bold leading-snug text-happy-label">{copy.reply}</Text>
              </Pressable>
            );
          })}
        </View>

        {autoTarget && (
          <Pressable onPress={() => setPickedType('auto')} className="flex-row items-center justify-center gap-2 w-full min-h-11 mt-2">
            <View style={{ width: 24, height: 24 }}>
              <ReplyGlyph kind="unsure" />
            </View>
            <Text className="text-t-sub font-bold text-happy-accent">Not sure? Pick one for me</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const { exercise, reply, why } = picked;
  const theme = getCategoryBadgeTheme(exercise.category);

  return (
    <View className="mb-4">
      <View className="items-end mb-3">
        <View className="max-w-[80%] px-4 py-2 rounded-2xl rounded-br-[4px] bg-happy-ink">
          <Text className="text-white font-semibold">{reply}</Text>
        </View>
      </View>

      <View
        className="rounded-[20px] bg-happy-surface overflow-hidden border border-happy-sep"
      >
        <View style={{ aspectRatio: 160 / 96, backgroundColor: theme.bg }}>
          <ExerciseArt type={exercise.type} />
        </View>
        <View className="p-4">
          <Text className="text-t-lead font-bold text-happy-label">{exercise.title}</Text>
          <Text className="text-t-sub text-happy-label-2 mt-1">{why}</Text>
          <Text className="text-t-foot font-bold text-happy-label-3 mt-2">{exercise.duration}</Text>

          <CircularRevealWrapper href={buildExerciseRoute(exercise.type)} color={theme.bg} disabled={!!exercise.isProOnly && !hasPro}>
            <Pressable
              onPress={() => onStart(exercise)}
              className="w-full min-h-14 mt-4 items-center justify-center rounded-pill bg-happy-ink border-b-4 border-b-sage-700 active:translate-y-0.5 active:border-b-2"
            >
              <Text className="text-white text-t-body font-bold">Start</Text>
            </Pressable>
          </CircularRevealWrapper>
        </View>
      </View>

      <Pressable onPress={reset} className="w-full min-h-11 mt-3">
        <Text className="text-t-foot font-bold text-happy-label-3">Something else is on my mind</Text>
      </Pressable>
    </View>
  );
}
