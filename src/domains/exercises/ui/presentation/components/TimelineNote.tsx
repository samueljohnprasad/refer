// ponytail: exact .note matching .agents/exercises.html's `note()` — intensity in words (How We
// Feel-style "a lot"/"somewhat"), never a 7/10 number. Pure presentation: takes a TimelineNoteModel.
import React, { Fragment } from 'react';
import { Text } from '@/src/components/ui/Text';
import type { TimelineNoteModel } from '../../../domain/timelineEntry';

/** "a, b and c" — comma-joins all but the last, "and" before the last. */
function interleaveWithAnd(nodes: React.ReactNode[]): React.ReactNode[] {
  return nodes.flatMap((node, i) => {
    if (i === 0) return [node];
    const sep = i === nodes.length - 1 ? ' and ' : ', ';
    return [sep, node];
  });
}

export interface TimelineNoteProps {
  note: TimelineNoteModel;
}

export function TimelineNote({ note }: TimelineNoteProps): React.JSX.Element | null {
  const felt = note.feltEmotions.length > 0
    ? (
      <Text className="text-[13px] happy-font-body-medium text-happy-label-2 leading-[20px]">
        You felt{' '}
        {interleaveWithAnd(
          note.feltEmotions.map((e, i) => (
            <Fragment key={i}>
              <Text className="happy-font-body-bold text-happy-label">{e.emotion.toLowerCase()}</Text>{' '}{e.amount}
            </Fragment>
          )),
        )}.
      </Text>
    )
    : null;

  const trap = note.trapTags.length > 0
    ? (
      <Text className="text-[13px] happy-font-body-medium text-happy-label-2 leading-[20px]">
        {note.trapTags.length > 1 ? 'Traps' : 'Trap'} you spotted:{' '}
        {interleaveWithAnd(note.trapTags.map((tag, i) => <Fragment key={i}>"{tag.toLowerCase()}"</Fragment>))}.
      </Text>
    )
    : null;

  if (!felt && !trap) return null;
  return <>{felt}{trap}</>;
}
