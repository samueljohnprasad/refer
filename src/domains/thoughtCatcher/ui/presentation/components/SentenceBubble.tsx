// ponytail: the signature — the moment and the thought it caught, as one sentence with a gap (`.me` / `.line`).
import React from 'react';
import { View, Text } from 'react-native';
import { tidy, situationPhrase } from '../../../domain/text';

function Gap({ text, k }: { text: string; k: string }): React.JSX.Element {
  return text
    ? <Text className="font-bold">{text}</Text>
    : <Text style={{ fontSize: 13, fontWeight: '500', textDecorationLine: 'underline', textDecorationStyle: 'dashed' }} accessibilityLabel="not written yet">{`  ${k}  `}</Text>;
}

export interface SentenceBubbleProps {
  situation: string;
  thought: string;
  /** "my mind said" or, after the fairer thought, "I could think" */
  lead?: string;
}

export function SentenceBubble({ situation, thought, lead = 'my mind said' }: SentenceBubbleProps): React.JSX.Element {
  const t = thought.trim() ? tidy(thought) : '';
  return (
    <View className="items-end mb-4">
      <View className="max-w-[85%] bg-happy-ink px-4 py-3" style={{ borderRadius: 16, borderBottomRightRadius: 4 }}>
        <Text numberOfLines={4} className="font-medium leading-[22px] text-white">
          When <Gap text={situationPhrase(situation)} k="moment" />, {lead} {t ? <>“<Gap text={t} k="thought" />”</> : <Gap text="" k="thought" />}.
        </Text>
      </View>
    </View>
  );
}
