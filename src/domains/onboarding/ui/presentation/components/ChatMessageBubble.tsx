// ponytail: exact Chat Message Bubble matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, Text, Image } from 'react-native';
import { MessageSender } from '../../../domain/enums';
import type { ChatMessage } from '../../../domain/types';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps): React.JSX.Element {
  const isHappi = message.sender === MessageSender.Happi;

  if (!isHappi) {
    return (
      <View className="self-end max-w-[85%] bg-happy-ink rounded-m rounded-br-[4px] py-3 px-4 mb-2 shadow-xs">
        <Text className="text-white text-t-body font-medium leading-snug">
          {message.text}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-2 mb-2 self-start max-w-[94%]">
      {/* 30pt Panda avatar with 9 radius and hairline ring (exact prototype) */}
      <Image
        source={require('@/assets/icons/icon-panda.png')}
        className="w-[30px] h-[30px] rounded-[9px] border border-happy-sep"
      />

      <View className="bg-happy-tint rounded-m rounded-bl-[4px] py-3 px-4 flex-1">
        <Text className="text-happy-label text-t-body font-medium leading-relaxed">
          {message.text}
        </Text>

        {/* Hollow dot for the thought as it showed up (exact prototype .pt) */}
        {message.isQuote && (
          <View className="flex-row items-start gap-2.5 mt-2.5">
            <View className="w-[11px] h-[11px] rounded-full border-2 border-happy-ink bg-happy-surface mt-1.5" />
            <Text className="text-t-lead font-bold text-happy-label flex-1 leading-snug">
              “{message.text}”
            </Text>
          </View>
        )}

        {/* Filled dot for the new fair view (exact prototype .pt) */}
        {message.isFair && (
          <View className="flex-row items-start gap-2.5 mt-2.5">
            <View className="w-[11px] h-[11px] rounded-full bg-happy-ink mt-1.5" />
            <Text className="text-t-lead font-bold text-happy-label flex-1 leading-snug">
              {message.text}
            </Text>
          </View>
        )}

        {/* Why reason + trap name */}
        {Boolean(message.why) && (
          <Text className="text-happy-label-2 text-[14px] mt-2 font-normal leading-normal">
            {message.why} {message.trapLabel ? `This trap is called “${message.trapLabel.toLowerCase()}.”` : ''}
          </Text>
        )}
      </View>
    </View>
  );
}
