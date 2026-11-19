// ponytail: the signature — the user's answers as one sentence in their own bubble, the missing part a
// dashed gap (.agents/abc-analysis.html's `.me`/`.gap`). Pure presentation over abcSentence().
import React from 'react';
import { View, Text } from 'react-native';
import type { SentenceSegment } from './abcDomain';

export function AbcSentenceBubble({ segments }: { segments: readonly SentenceSegment[] }): React.JSX.Element {
  const spoken = segments.map((s) => (s.empty ? '…' : s.text)).join('');
  return (
    <View className="items-end mb-4" accessible accessibilityLabel={spoken}>
      <View className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-[4px] bg-happy-ink">
        <Text className="font-medium leading-[22px] text-white" numberOfLines={4}>
          {segments.map((s, i) => s.empty
            ? <Text key={i} className="text-t-foot font-medium text-white/80">{`[${s.text}]`}</Text>
            : <Text key={i} className={s.gap ? 'font-bold' : undefined}>{s.text}</Text>)}
        </Text>
      </View>
    </View>
  );
}
