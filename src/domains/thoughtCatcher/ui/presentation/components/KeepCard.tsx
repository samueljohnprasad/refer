// ponytail: the keepsake (`.keep`): the thought as weather, then the words — "caught" shows one sky,
// "fairer" shows Before → Now and the fairer thought above the one it replaces.
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WORD } from '../../../domain/scoring';
import { Sky } from './Sky';

function Figure({ label, value }: { label: string; value: number }): React.JSX.Element {
  return (
    <View className="flex-1" accessible accessibilityLabel={`${label}: ${WORD(value)}`}>
      <Sky f={value / 10} />
      <View className="flex-row justify-center items-baseline gap-2 px-1 pt-1" accessibilityElementsHidden>
        <Text className="text-t-foot font-semibold text-happy-label-2">{label}</Text>
        <Text className="text-t-body font-semibold text-happy-label">{WORD(value)}</Text>
      </View>
    </View>
  );
}

export type KeepCardProps =
  | { kind: 'caught'; situation: string; thought: string; intensity: number }
  | { kind: 'fairer'; situation: string; thought: string; fairer: string; intensity: number; post: number };

export function KeepCard(props: KeepCardProps): React.JSX.Element {
  return (
    <View className="rounded-3xl bg-happy-tint px-3 pt-3 pb-6" accessibilityLabel={props.kind === 'caught' ? 'The thought you caught' : 'Your fairer thought'}>
      {props.kind === 'caught' ? (
        <View className="items-center">
          <View className="w-[200px] max-w-full"><Figure label="Believability" value={props.intensity} /></View>
        </View>
      ) : (
        <View className="flex-row items-center gap-1">
          <Figure label="Before" value={props.intensity} />
          <Feather name="arrow-right" size={20} color="#4b4b4b" />
          <Figure label="Now" value={props.post} />
        </View>
      )}
      <Text className="mt-6 mx-2 text-t-sub font-medium text-happy-label-2">
        When {props.situation}, {props.kind === 'caught' ? 'my mind said' : 'I could think'}
      </Text>
      <Text className="mt-1 mx-2 font-display text-t-title font-semibold leading-[32px] text-happy-label">
        “{props.kind === 'caught' ? props.thought : props.fairer}”
      </Text>
      {props.kind === 'fairer' && (
        <Text className="mt-3 mx-2 text-t-sub font-medium text-happy-label-2">Instead of “{props.thought}”</Text>
      )}
    </View>
  );
}
