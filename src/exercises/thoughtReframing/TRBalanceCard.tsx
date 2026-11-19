// ponytail: the prototype's `.balcard` + `.legend` pair, shared by both evidence steps. The side you are
// filling in reads darker; counts come straight from the response, nothing is stored.
import React from 'react';
import { Text, View } from 'react-native';
import { TRBalanceScale } from './TRBalanceScale';
import { useTRBalanceMotion } from './useTRBalanceMotion';

function Legend({ label, count, kind, current }: { label: string; count: number; kind: 'for' | 'against'; current: boolean }) {
  return (
    <View className="flex-row items-center gap-2">
      <View
        style={kind === 'for'
          ? { width: 14, height: 12, borderRadius: 3, backgroundColor: '#5f7f58', borderBottomWidth: 3, borderBottomColor: '#44633f' }
          : { width: 14, height: 13, borderRadius: 7, backgroundColor: '#f5b942', borderBottomWidth: 3, borderBottomColor: '#e09a24' }}
      />
      <Text className={`text-t-foot ${current ? 'font-extrabold text-happy-label' : 'font-bold text-happy-label-2'}`}>{label}</Text>
      <Text className="font-display text-t-lead text-happy-label">{count}</Text>
    </View>
  );
}

export function TRBalanceCard({ forCount, againstCount, current }: { forCount: number; againstCount: number; current: 'for' | 'against' }): React.JSX.Element {
  const motion = useTRBalanceMotion(forCount, againstCount);
  return (
    <View className="mb-4">
      <View className="items-center overflow-hidden rounded-3xl" style={{ backgroundColor: '#f6ecd8' }}>
        <TRBalanceScale forCount={forCount} againstCount={againstCount} {...motion} />
      </View>
      <View className="flex-row justify-between mx-2 mt-2">
        <Legend label="Backs it up" count={forCount} kind="for" current={current === 'for'} />
        <Legend label="Goes against it" count={againstCount} kind="against" current={current === 'against'} />
      </View>
    </View>
  );
}
