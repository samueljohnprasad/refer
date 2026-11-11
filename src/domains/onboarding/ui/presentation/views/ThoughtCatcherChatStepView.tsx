// ponytail: exact S2 Thought Catcher Chat view matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { GoalId } from '../../../domain/enums';
import type { ChatMessage } from '../../../domain/types';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { SceneArtSvg } from '../components/SceneArtSvg';
import { HappiGuideStage } from '../components/HappiGuideStage';

export interface ThoughtCatcherChatStepViewProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isHeroPhase: boolean;
  heroMirrorText: string;
  activeSceneGoalId: GoalId | null;
  activeSceneCaption: string | null;
  weather: number;
  onShowMe: () => void;
  footerReplyView: React.ReactNode;
}

export function ThoughtCatcherChatStepView({
  messages,
  isTyping,
  isHeroPhase,
  heroMirrorText,
  activeSceneGoalId,
  activeSceneCaption,
  weather,
  onShowMe,
  footerReplyView,
}: ThoughtCatcherChatStepViewProps): React.JSX.Element {
  // S2 Entry Beat: Hero Happi with speech bubble above (exact prototype .stage.hero)
  if (isHeroPhase) {
    return (
      <View className="flex-1 justify-between px-6 pb-6 pt-8">
        <View className="flex-1 items-center justify-center">
          {/* Speech bubble above Happi */}
          <View className="relative max-w-[300px] mb-6 p-4 border-2 border-happy-sep rounded-2xl bg-happy-surface shadow-xs">
            <Text className="text-t-title font-semibold font-display text-happy-label text-center leading-tight">
              {heroMirrorText}
            </Text>
            {/* Downward pointer tail */}
            <View className="absolute left-1/2 -ml-1.5 -bottom-1.5 w-3 h-3 bg-happy-surface border-r-2 border-b-2 border-happy-sep rotate-45" />
          </View>

          {/* Large Happi character */}
          <View className="w-[228px] h-[228px] items-center justify-center">
            <HappiGuideStage weather={weather} size="hero" />
          </View>
        </View>

        <Pressable
          onPress={onShowMe}
          className="w-full min-h-[56px] bg-happy-ink rounded-pill items-center justify-center shadow-[0_4px_0_var(--color-happy-accent)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-happy-accent)]"
          accessibilityRole="button"
        >
          <Text className="text-white text-t-body font-bold">Show me</Text>
        </Pressable>
      </View>
    );
  }

  // Active chat thread with corner Happi stage
  return (
    <View className="flex-1">
      {/* Corner guide stage */}
      <View className="w-full items-end pr-4 py-1 z-10">
        <HappiGuideStage weather={weather} size="compact" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {activeSceneGoalId && activeSceneCaption && (
          <SceneArtSvg goalId={activeSceneGoalId} caption={activeSceneCaption} />
        )}

        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
      </ScrollView>

      {/* Sticky footer reply area */}
      <View className="px-4 pb-4 pt-2 bg-happy-surface/95 border-t border-happy-sep">
        {footerReplyView}
      </View>
    </View>
  );
}
