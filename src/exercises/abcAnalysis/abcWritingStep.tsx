// ponytail: the three writing steps (what happened / the thought / a fairer way) share one shape —
// Happi's question, the sentence so far, a field, a quiet status line, tap-to-use chips — so they are
// one component, matching .agents/abc-analysis.html's bindText/bindStarters. Voice input is not part of
// the prototype and is not carried over.
import React from 'react';
import { TextInput, View, Text } from 'react-native';
import type { ABCAnalysisResponse, StepProps } from '@/src/types/exerciseFlow';
import { HelpSheetModal } from '@/src/domains/home/ui/containers/HelpRowWithSheet';
import { words } from '@/src/domains/thoughtCatcher/domain/words';
import { AbcAsk } from './abcAsk';
import { AbcQuickReplies } from './abcQuickReplies';
import { AbcSentenceBubble } from './abcSentenceBubble';
import { abcSentence, applyStarter, ownWords, type SentenceSegment } from './abcDomain';
import { isAbcCrisisSeen, useAbcCrisisGuard } from './useAbcCrisisGuard';

type Variant = 'viewfinder' | 'bubble' | 'frame';
type Key = 'activatingEvent' | 'belief' | 'alternativeBelief';

export interface AbcWritingProps {
  fieldKey: Key;
  variant: Variant;
  question: string;
  sub: string;
  placeholder: string;
  hint: string;
  /** minimum real words, counted after any starter is stripped */
  need: number;
  chips?: readonly string[];
  /** starters keep the user's words and go in front; plain chips replace the text and hide once typed */
  chipMode?: 'use' | 'start';
  sentence: (r: ABCAnalysisResponse) => SentenceSegment[] | null;
}

const FIELD: Record<Variant, { box: string; input: string; min: number }> = {
  viewfinder: { box: 'p-4 rounded-3xl bg-happy-surface-2', input: 'text-t-h leading-[30px]', min: 144 },
  bubble: { box: 'px-6 pt-6 pb-4 rounded-[36px] bg-[#f6ecd8] border-b-[5px] border-[#ead7b5]', input: 'text-t-lead leading-[28px]', min: 96 },
  frame: { box: 'p-3 rounded-3xl bg-[#ecd496] border-b-[5px] border-[#d8b86e]', input: 'text-t-lead leading-[28px]', min: 96 },
};

export function AbcWritingStep(props: AbcWritingProps & StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const { fieldKey, variant, question, sub, placeholder, hint, need, chips = [], chipMode = 'use', sentence, response, onUpdate } = props;
  const text = response[fieldKey] ?? '';
  const guard = useAbcCrisisGuard(text, props);
  const set = (v: string) => onUpdate({ [fieldKey]: v } as Partial<ABCAnalysisResponse>);
  const good = words(fieldKey === 'activatingEvent' ? text : ownWords(text)) >= need;
  const f = FIELD[variant];
  const segs = sentence(response);
  const showChips = chipMode === 'start' || !text.trim();

  const input = (
    <TextInput
      value={text}
      onChangeText={set}
      placeholder={placeholder}
      placeholderTextColor="#6b6b6b"
      accessibilityLabel={question}
      multiline
      maxLength={400}
      textAlignVertical="top"
      style={{ minHeight: f.min }}
      className={`font-bold text-happy-label ${f.input}`}
    />
  );

  return (
    <View>
      {segs && <AbcSentenceBubble segments={segs} />}
      <AbcAsk question={question} sub={sub} solo={isAbcCrisisSeen()} />
      <View className={f.box}>
        {variant === 'frame' ? <View className="px-4 pt-3 pb-4 rounded-[10px] bg-[#fffaf0]">{input}</View> : input}
      </View>
      <Text accessibilityLiveRegion="polite" className="mt-2 text-t-foot font-semibold text-happy-label-2 min-h-[18px]">{good ? '' : hint}</Text>
      {showChips && (
        <AbcQuickReplies
          items={chips}
          selected={chipMode === 'use' ? text.trim() : undefined}
          onPick={(item) => set(chipMode === 'start' ? applyStarter(text, item, chips) : item)}
        />
      )}
      <HelpSheetModal visible={guard.helpOpen} onClose={guard.closeHelp} />
    </View>
  );
}

export { abcSentence };
