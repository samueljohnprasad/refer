// ponytail: presentational typing indicator with panda avatar and dots
import React from 'react';
import { View, Image } from 'react-native';

export function TypingIndicator(): React.JSX.Element {
  return (
    <View className="flex-row items-end gap-2 mb-2 self-start max-w-[94%]">
      <Image
        source={require('@/assets/icons/icon-panda.png')}
        className="w-[30px] h-[30px] rounded-[9px] border border-happy-sep"
      />
      <View className="flex-row items-center gap-1.5 py-3 px-4 bg-happy-tint rounded-2xl rounded-bl-sm">
        <View className="w-2 h-2 rounded-full bg-happy-cloud-hi" />
        <View className="w-2 h-2 rounded-full bg-happy-cloud-hi" />
        <View className="w-2 h-2 rounded-full bg-happy-cloud-hi" />
      </View>
    </View>
  );
}
