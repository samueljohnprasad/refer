// ponytail: exact S2 Thought Catcher Chat view matching .agents/onboarding.html and happy-ui tokens.
// Hero -> corner "settle": one persistently-mounted HappiStage host, Reanimated LinearTransition
// interpolates its measured frame across the className/position change (the FLIP, done for us).
import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import Animated, { LinearTransition, Easing, withTiming } from 'react-native-reanimated';
import { GoalId } from '../../../domain/enums';
import type { ChatMessage } from '../../../domain/types';
import type { HappiGuideMotion } from '../../containers/useHappiGuideMotion';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { SceneArtSvg } from '../components/SceneArtSvg';
import { HappiStage } from '../components/HappiStage';
import { sayIn } from '../animations';

export interface ThoughtCatcherChatStepViewProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isHeroPhase: boolean;
  heroMirrorText: string;
  activeSceneGoalId: GoalId | null;
  activeSceneCaption: string | null;
  motion: HappiGuideMotion;
  onShowMe: () => void;
  footerReplyView: React.ReactNode;
}

// opacity + scale(.96), 140ms ease-in — exits are quicker than entrances, matching the prototype's settle()
function bubbleExit() {
  'worklet';
  return {
    initialValues: { opacity: 1, transform: [{ scale: 1 }] },
    animations: {
      opacity: withTiming(0, { duration: 140, easing: Easing.in(Easing.ease) }),
      transform: [{ scale: withTiming(0.96, { duration: 140, easing: Easing.in(Easing.ease) }) }],
    },
  };
}

export function ThoughtCatcherChatStepView({
  messages,
  isTyping,
  isHeroPhase,
  heroMirrorText,
  activeSceneGoalId,
  activeSceneCaption,
  motion,
  onShowMe,
  footerReplyView,
}: ThoughtCatcherChatStepViewProps): React.JSX.Element {
  // keeps the latest line above the footer, matching the prototype's ResizeObserver-driven scroll()
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, isTyping]);

  return (
    <View className="flex-1">
      <Animated.View
        layout={LinearTransition.duration(420).easing(Easing.bezier(0.77, 0, 0.175, 1))}
        className={
          isHeroPhase
            ? 'items-center justify-center pt-8'
            : 'w-full items-end pr-4 py-1 z-10'
        }
      >
        <HappiStage motion={motion} size="full" width={isHeroPhase ? 228 : 148} />
      </Animated.View>

      {isHeroPhase && (
        <Animated.View entering={sayIn(120)} exiting={bubbleExit} className="items-center px-6 -mt-4">
          <View className="relative max-w-[300px] mb-6 p-4 border-2 border-happy-sep rounded-2xl bg-happy-surface">
            <Text className="text-t-title font-semibold font-display text-happy-label text-center leading-tight">
              {heroMirrorText}
            </Text>
            <View className="absolute left-1/2 -ml-1.5 -bottom-1.5 w-3 h-3 bg-happy-surface border-r-2 border-b-2 border-happy-sep rotate-45" />
          </View>
        </Animated.View>
      )}

      {!isHeroPhase && (
        <ScrollView
          ref={scrollRef}
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
      )}

      {isHeroPhase ? (
        <Pressable
          onPress={onShowMe}
          className="w-full min-h-[56px] mx-6 mb-6 bg-happy-ink rounded-pill items-center justify-center border-b-4 border-happy-accent active:translate-y-1 active:border-b-0"
          accessibilityRole="button"
        >
          <Text className="text-white text-t-body font-bold">Show me</Text>
        </Pressable>
      ) : (
        <View className="px-4 pb-4 pt-2 bg-happy-surface/95 border-t border-happy-sep">
          {footerReplyView}
        </View>
      )}
    </View>
  );
}
