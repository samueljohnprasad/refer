// ponytail: the three writing surfaces — viewfinder (what happened), thought bubble, fairer-thought frame.
// Rims are plain bottom borders, no shadows.
import React from 'react';
import { View, TextInput } from 'react-native';

export type WritingKind = 'viewfinder' | 'bubble' | 'frame';

export interface WritingFieldProps {
  kind: WritingKind;
  value: string;
  placeholder: string;
  label: string;
  maxLength: number;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}

export function WritingField({ kind, value, placeholder, label, maxLength, onChange, autoFocus }: WritingFieldProps): React.JSX.Element {
  const input = (
    <TextInput
      multiline
      autoFocus={autoFocus}
      value={value}
      onChangeText={onChange}
      maxLength={maxLength}
      placeholder={placeholder}
      placeholderTextColor="#6b6b6b"
      accessibilityLabel={label}
      textAlignVertical="top"
      className={`font-bold text-happy-label ${kind === 'viewfinder' ? 'text-t-h min-h-[144px]' : 'text-t-lead min-h-[96px]'}`}
    />
  );
  if (kind === 'viewfinder') return <View className="rounded-3xl bg-happy-surface-2 px-4 pt-4 pb-3">{input}</View>;
  if (kind === 'bubble') {
    return <View className="rounded-[36px] px-6 pt-5 pb-4" style={{ backgroundColor: '#f6ecd8', borderBottomWidth: 5, borderBottomColor: '#ead7b5' }}>{input}</View>;
  }
  return (
    <View className="rounded-3xl p-3" style={{ backgroundColor: '#ecd496', borderBottomWidth: 5, borderBottomColor: '#d8b86e' }}>
      <View className="px-4 pt-3 pb-4" style={{ backgroundColor: '#fffaf0', borderRadius: 10 }}>{input}</View>
    </View>
  );
}
