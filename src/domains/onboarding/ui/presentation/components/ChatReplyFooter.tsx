// ponytail: footer reply strip — flat switch over ChatPhase, matching .agents/onboarding.html's choose()/type() calls
import React from 'react';
import { ChatPhase } from '../../../domain/enums';
import { QuickReplyStrip } from './QuickReplyStrip';
import { PersonalInputComposer } from './PersonalInputComposer';
import { BELIEF_OPTIONS, THOUGHT_STARTERS } from '../../../domain/scoring';

export interface ChatReplyFooterProps {
  phase: ChatPhase;
  composerText: string;
  moreExamplesAvailable: boolean;
  personalStarters: { situation: readonly string[]; thought: readonly string[] };
  onRateBelief: (rating: number) => void;
  onReality: (answer: 'yes' | 'unsure' | 'no') => void;
  onTryMine: () => void;
  onAnotherExample: () => void;
  onSaveThisOne: () => void;
  onChangeComposerText: (text: string) => void;
  onSelectStarter: (starter: string) => void;
  onSubmitPersonal: () => void;
  onSkipPersonal: () => void;
}

const REALITY_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'Not sure', value: 'unsure' },
  { label: 'No', value: 'no' },
] as const;

const RATING_OPTIONS = BELIEF_OPTIONS.map((label, i) => ({ label, value: String(i) }));

export function ChatReplyFooter({
  phase,
  composerText,
  moreExamplesAvailable,
  personalStarters,
  onRateBelief,
  onReality,
  onTryMine,
  onAnotherExample,
  onSaveThisOne,
  onChangeComposerText,
  onSelectStarter,
  onSubmitPersonal,
  onSkipPersonal,
}: ChatReplyFooterProps): React.JSX.Element {
  switch (phase) {
    case ChatPhase.Reality:
      return (
        <QuickReplyStrip
          options={[...REALITY_OPTIONS]}
          isWrap
          onSelect={(opt) => onReality(opt.value as 'yes' | 'unsure' | 'no')}
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

    case ChatPhase.AfterTeach:
      return (
        <QuickReplyStrip
          options={[
            { label: 'Try with something from today', value: 'mine' },
            ...(moreExamplesAvailable ? [{ label: 'Another example', value: 'more' }] : []),
            { label: 'Save this one', value: 'go' },
          ]}
          onSelect={(opt) => {
            if (opt.value === 'mine') onTryMine();
            else if (opt.value === 'more') onAnotherExample();
            else onSaveThisOne();
          }}
        />
      );

    case ChatPhase.PersonalSituation:
      return (
        <PersonalInputComposer
          value={composerText}
          placeholder="What happened, in a few words"
          starters={personalStarters.situation}
          maxChars={280}
          onChangeText={onChangeComposerText}
          onSelectStarter={onSelectStarter}
          onSubmit={onSubmitPersonal}
          onSkip={onSkipPersonal}
        />
      );

    case ChatPhase.PersonalThought:
      return (
        <PersonalInputComposer
          value={composerText}
          placeholder="The thought, in a few words"
          starters={personalStarters.thought}
          maxChars={280}
          onChangeText={onChangeComposerText}
          onSelectStarter={onSelectStarter}
          onSubmit={onSubmitPersonal}
          onSkip={onSkipPersonal}
        />
      );

    case ChatPhase.PersonalFair:
    default:
      return (
        <PersonalInputComposer
          value={composerText}
          placeholder="Another way to see it"
          starters={THOUGHT_STARTERS}
          maxChars={280}
          onChangeText={onChangeComposerText}
          onSelectStarter={onSelectStarter}
          onSubmit={onSubmitPersonal}
          onSkip={onSkipPersonal}
        />
      );
  }
}
