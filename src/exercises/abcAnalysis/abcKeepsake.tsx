// ponytail: the summary keepsake (.agents/abc-analysis.html's `.keep`): the feeling before and now as
// weather, then the fairer thought in the user's own words. Pure presentation.
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AbcSky } from './abcSky';
import { abcStrength } from './abcDomain';

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 items-center" accessible accessibilityLabel={`${label}: ${abcStrength(value)}`}>
      <AbcSky strength={value / 10} width={130} />
      <Text className="mt-1 text-t-foot font-semibold text-happy-label-2">{label} <Text className="text-t-body font-semibold text-happy-label">{abcStrength(value)}</Text></Text>
    </View>
  );
}

export function AbcKeepsake({ event, belief, fairer, pre, post }: { event: string; belief: string; fairer: string; pre: number; post: number }): React.JSX.Element {
  return (
    <View className="p-3 pb-6 rounded-3xl bg-[#e2eef8]">
      <View className="flex-row items-center gap-1">
        <Figure label="Before" value={pre} />
        <Feather name="arrow-right" size={20} color="#4b4b4b" />
        <Figure label="Now" value={post} />
      </View>
      <Text className="mt-6 mx-2 text-t-sub font-medium text-happy-label-2">When {event}, I could think</Text>
      <Text className="mt-1 mx-2 font-display text-t-title leading-[32px] tracking-tight text-happy-label">“{fairer}”</Text>
      <Text className="mt-3 mx-2 text-t-sub font-medium text-happy-label-2">Instead of “{belief}”</Text>
    </View>
  );
}
