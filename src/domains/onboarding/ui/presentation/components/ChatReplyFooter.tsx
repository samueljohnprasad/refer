import React from 'react';
import { ChatPhase } from '../../../domain/enums';
import { QuickReplyStrip } from './QuickReplyStrip';
import { PersonalInputComposer } from './PersonalInputComposer';
import { THOUGHT_STARTERS } from '../../../domain/scoring';

export interface ChatReplyFooterProps {
  phase: ChatPhase;
  composerText: string;
  onShowMe: () => void;
  onRateBelief: (rating: number) => void;
  onSaveReflection: () => void;
  onChangeComposerText: (text: string) => void;
  onSelectStarter: (starter: string) => void;
  onSubmitPersonal: () => void;
}

const RATING_OPTIONS = [
  { label: 'Not at all', value: '0' },
  { label: 'A little', value: '1' },
  { label: 'Somewhat', value: '2' },
  { label: 'Mostly', value: '3' },
];

// ponytail: flat switch replaces complex nested JSX ternaries
export function ChatReplyFooter({
  phase,
  composerText,
  onShowMe,
  onRateBelief,
  onSaveReflection,
  onChangeComposerText,
  onSelectStarter,
  onSubmitPersonal,
}: ChatReplyFooterProps): React.JSX.Element {
  switch (phase) {
    case ChatPhase.ShowMe:
      return (
        <QuickReplyStrip
          options={[{ label: 'Show me', value: 'show' }]}
          onSelect={onShowMe}
        />
      );

    case ChatPhase.RateInitial:
    case ChatPhase.RateShift:
      return (
        <QuickReplyStrip
          options={RATING_OPTIONS}
          isWrap
          onSelect={(opt) => onRateBelief(parseInt(opt.value, 10))}
        />
      );

    case ChatPhase.ReadyToSave:
      return (
        <QuickReplyStrip
          options={[{ label: 'Save this reflection', value: 'save' }]}
          onSelect={onSaveReflection}
        />
      );

    case ChatPhase.PersonalInput:
    default:
      return (
        <PersonalInputComposer
          value={composerText}
          placeholder="Write what happened..."
          starters={THOUGHT_STARTERS}
          maxChars={280}
          onChangeText={onChangeComposerText}
          onSelectStarter={onSelectStarter}
          onSubmit={onSubmitPersonal}
          onSkip={onSaveReflection}
        />
      );
  }
}
