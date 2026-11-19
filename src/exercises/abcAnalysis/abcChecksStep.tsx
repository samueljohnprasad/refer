// ponytail: three checks on the thought, one at a time; "Not sure" is a fine answer; no score
// (.agents/abc-analysis.html). Answers are saved as response.beliefChecks.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { ABCAnalysisResponse, StepProps } from '@/src/types/exerciseFlow';
import { AbcAsk } from './abcAsk';
import { AbcQuickReplies } from './abcQuickReplies';
import { AbcSentenceBubble } from './abcSentenceBubble';
import { ABC_CHECKS, abcChecksSummary, abcSentence, capitalize, nextUnansweredCheck } from './abcDomain';
import { abcFeelPhrase } from './customStepShared';
import { isAbcCrisisSeen } from './useAbcCrisisGuard';

const ADVANCE_MS = 420;

export function AbcChecksStep({ response, onUpdate, readOnly }: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const checks = response.beliefChecks;
  const [qi, setQi] = useState(() => nextUnansweredCheck(checks));
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const { key, question, options } = ABC_CHECKS[qi];
  const feel = capitalize(abcFeelPhrase(response.consequenceEmotion));
  const lead = qi === 0 && feel ? `${feel} make${response.consequenceEmotion.includes(',') ? '' : 's'} sense. Now check the thought, not yourself.` : undefined;

  const answer = (a: string) => {
    if (readOnly) return;
    Haptics.selectionAsync().catch(() => {});
    const next = { ...checks, [key]: a };
    onUpdate({ beliefChecks: next });
    const nx = ABC_CHECKS.findIndex(({ key: k }) => !next[k]);
    if (nx >= 0) timer.current = setTimeout(() => setQi(nx), ADVANCE_MS);
  };

  return (
    <View>
      <AbcSentenceBubble segments={abcSentence({ event: response.activatingEvent, belief: response.belief, feel: abcFeelPhrase(response.consequenceEmotion) })} />
      <AbcAsk question={question} sub={lead} solo={isAbcCrisisSeen()} />
      <AbcQuickReplies items={options} selected={checks?.[key]} onPick={answer} />
      <Text accessibilityLiveRegion="polite" className="mt-3 text-t-sub font-medium text-happy-label-2">{abcChecksSummary(checks)}</Text>
    </View>
  );
}
