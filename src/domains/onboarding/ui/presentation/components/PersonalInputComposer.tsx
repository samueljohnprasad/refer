// ponytail: exact Personal Input Composer matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, TextInput, Pressable, Text, ScrollView } from 'react-native';
import { Send } from 'lucide-react-native';
import { trim } from 'lodash-es';

export interface PersonalInputComposerProps {
  value: string;
  placeholder: string;
  starters: readonly string[];
  maxChars: number;
  onChangeText: (text: string) => void;
  onSelectStarter: (starter: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

export function PersonalInputComposer({
  value,
  placeholder,
  starters,
  maxChars,
  onChangeText,
  onSelectStarter,
  onSubmit,
  onSkip,
}: PersonalInputComposerProps): React.JSX.Element {
  const canSubmit = trim(value).length > 0;
  const charsLeft = maxChars - value.length;

  return (
    <View className="w-full">
      {/* Starters carousel */}
      {starters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-2 mb-2 pb-1"
        >
          {starters.map((starter) => (
            <Pressable
              key={starter}
              onPress={() => onSelectStarter(starter)}
              className="px-3.5 py-2 rounded-pill bg-happy-surface-2 active:bg-happy-tint mr-2 min-h-[38px] justify-center"
            >
              <Text className="text-happy-label-2 text-[14px] font-medium">{starter}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Input pill row */}
      <View className="flex-row items-center bg-happy-surface-2 rounded-pill px-4 py-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          maxLength={maxChars}
          className="flex-1 min-h-[44px] text-happy-label font-medium text-t-body py-2"
          placeholderTextColor="#767676"
        />
        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          className={`w-10 h-10 rounded-pill items-center justify-center ${
            canSubmit ? 'bg-happy-ink' : 'bg-transparent'
          }`}
        >
          <Send size={18} color={canSubmit ? '#ffffff' : '#aaaaaa'} />
        </Pressable>
      </View>

      {/* Footer link and char count */}
      <View className="flex-row justify-between items-center mt-2 px-2">
        <Pressable onPress={onSkip} className="min-h-[44px] justify-center">
          <Text className="text-t-foot font-medium text-happy-label-3">Skip for now</Text>
        </Pressable>
        {value.length >= 200 && (
          <Text className="text-t-cap font-bold text-happy-label-3">{charsLeft} left</Text>
        )}
      </View>
    </View>
  );
}
