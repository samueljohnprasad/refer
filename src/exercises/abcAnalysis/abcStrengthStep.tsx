// ponytail: "how strong is it" as weather + ten segments (.agents/abc-analysis.html's rateStep). The second
// rating starts at the first, so moving nothing reads as "same", never a made-up improvement.
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import type { ABCAnalysisResponse, StepProps } from '@/src/types/exerciseFlow';
import { AbcAsk } from './abcAsk';
import { AbcSky } from './abcSky';
import { AbcSentenceBubble } from './abcSentenceBubble';
import { abcComparison, abcSentence, abcStrength } from './abcDomain';
import { abcFeelPhrase } from './customStepShared';
import { isAbcCrisisSeen } from './useAbcCrisisGuard';

const DEFAULT_RATING = 5;

export interface AbcStrengthProps {
  fieldKey: 'preEmotionalIntensity' | 'postEmotionalIntensity';
  question: string;
  sub?: string;
}

export function AbcStrengthStep({ fieldKey, question, sub, response, onUpdate, readOnly }: AbcStrengthProps & StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const after = fieldKey === 'postEmotionalIntensity';
  const pre = response.preEmotionalIntensity ?? DEFAULT_RATING;
  const value = response[fieldKey] ?? DEFAULT_RATING;
  const seeded = useRef(false);

  // ponytail: an untouched "now" rating starts at the "before" one; a deliberate 5 after a different "before" is re-seeded on revisit
  useEffect(() => {
    if (after && !readOnly && !seeded.current && value === DEFAULT_RATING && pre !== DEFAULT_RATING) onUpdate({ postEmotionalIntensity: pre });
    seeded.current = true;
  }, [after, readOnly, value, pre, onUpdate]);

  const segments = after
    ? abcSentence({ event: response.activatingEvent, belief: response.alternativeBelief, feel: '', verb: 'could think', withFeel: false })
    : abcSentence({ event: response.activatingEvent, belief: '', feel: abcFeelPhrase(response.consequenceEmotion) });

  return (
    <View>
      <AbcSentenceBubble segments={segments} />
      <AbcAsk question={question} sub={sub} solo={isAbcCrisisSeen()} />
      <View className="items-center justify-center min-h-[140px]"><AbcSky strength={value / 10} width={220} /></View>
      <Text className="mt-4 mb-2 text-t-title font-bold leading-[31px] text-happy-label" accessibilityElementsHidden>{abcStrength(value)}</Text>
      <View className="h-11 justify-center">
        <View className="absolute inset-x-0 top-1 bottom-1 flex-row gap-1" pointerEvents="none">
          {Array.from({ length: 10 }, (_, i) => (
            <View key={i} className={`flex-1 rounded-lg border-2 ${i < value ? 'bg-happy-ink border-happy-ink border-b-[4px] border-b-[#29452a]' : 'bg-happy-surface-2 border-happy-sep'}`}>
              {after && i === Math.max(pre - 1, 0) && <View className="absolute -top-2.5 self-center" style={{ borderWidth: 6, borderColor: 'transparent', borderTopColor: '#29452a' }} />}
            </View>
          ))}
        </View>
        <Slider
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={value}
          disabled={readOnly}
          onValueChange={(v) => { if (v !== value) { Haptics.selectionAsync().catch(() => {}); onUpdate({ [fieldKey]: v } as Partial<ABCAnalysisResponse>); } }}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="#ffffff"
          accessibilityLabel={question}
          accessibilityValue={{ min: 0, max: 10, now: value, text: `${value} out of 10, ${abcStrength(value)}` }}
          style={{ height: 44 }}
        />
      </View>
      <View className="flex-row justify-between mt-2">
        <Text className="text-t-foot font-semibold text-happy-label-2">None</Text>
        <Text className="text-t-foot font-semibold text-happy-label-2">Very strong</Text>
      </View>
      {after && <Text accessibilityLiveRegion="polite" className="mt-2 text-t-foot font-semibold text-happy-label-2">{abcComparison(pre, value)}</Text>}
    </View>
  );
}
