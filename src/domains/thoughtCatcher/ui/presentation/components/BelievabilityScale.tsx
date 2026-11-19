// ponytail: the believability step's body — sky in the middle, the word, then ten segments under a slider
// (thought-catcher.html `.mid` / `.read` / `.scale`). On the second rating a small marker shows where it started.
import React from 'react';
import { View, Text } from 'react-native';
import { PrototypeSlider } from '@/src/components/exercise/PrototypeSlider';
import { WORD } from '../../../domain/scoring';
import { Sky } from './Sky';

export interface BelievabilityScaleProps {
  value: number;
  /** the first rating, shown as a marker on the second step */
  was?: number;
  label: string;
  note?: string;
  onChange: (v: number) => void;
}

export function BelievabilityScale({ value, was, label, note, onChange }: BelievabilityScaleProps): React.JSX.Element {
  return (
    <View className="flex-1">
      <View className="flex-1 min-h-[140px] items-center justify-center overflow-hidden">
        <View className="w-full max-w-[240px]">
          <Sky f={value / 10} />
        </View>
      </View>
      <Text className="mt-4 mb-2 font-display text-t-title font-bold leading-[31px] text-happy-label" accessibilityElementsHidden>
        {WORD(value)}
      </Text>
      <PrototypeSlider value={value} onChange={onChange} label={label} valueText={WORD(value)}>
        {Array.from({ length: 10 }, (_, i) => (
          <View key={i} className="flex-1">
            <View
              className="flex-1 rounded-lg"
              style={i < value
                ? { backgroundColor: '#5f7f58', borderBottomWidth: 4, borderBottomColor: '#29452a' }
                : { backgroundColor: '#f7f7f7', borderWidth: 2, borderColor: '#cfcfcf' }}
            />
            {was != null && was > 0 && i === was - 1 && (
              <View
                className="absolute self-center"
                style={{ top: -10, borderWidth: 6, borderColor: 'transparent', borderTopColor: '#29452a' }}
              />
            )}
          </View>
        ))}
      </PrototypeSlider>
      <View className="flex-row justify-between mt-2" accessibilityElementsHidden>
        <Text className="text-t-foot font-semibold text-happy-label-2">Not at all</Text>
        <Text className="text-t-foot font-semibold text-happy-label-2">Completely</Text>
      </View>
      {note ? <Text className="mt-2 text-t-foot font-semibold text-happy-label-2" accessibilityLiveRegion="polite">{note}</Text> : null}
    </View>
  );
}
