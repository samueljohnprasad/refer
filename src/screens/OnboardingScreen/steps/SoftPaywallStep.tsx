import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import MochiMascot from '../components/MochiMascot';
import PricingTierCard from '../components/PricingTierCard';
import TactileButton from '../components/TactileButton';
import DiscountInterceptModal from '../components/DiscountInterceptModal';
import { StackedCarousel } from '../../../animations/stacked-carousel';
import { PricingTier } from '../types';
import { PRICING_PLANS, PAYWALL_BENEFITS } from '../constants';
import TestimonialCard from '../components/TestimonialCard';

interface SoftPaywallStepProps {
  selectedTier?: PricingTier;
  onSelectTier: (tier: PricingTier) => void;
  onStartTrial: () => void;
  onContinueFree: () => void;
}

const LOCKED_LESSONS = [
  {
    day: 2,
    title: 'The Thought Spiral',
    meta: 'Day 2 · 5 min · Cognitive distortions',
  },
  {
    day: 3,
    title: 'Body as Compass',
    meta: 'Day 3 · 5 min · Somatic awareness',
  },
  {
    day: 4,
    title: 'Thought Records: Your First CBT Tool',
    meta: 'Day 4 · 7 min · Hands-on exercise',
  },
] as const;

const SoftPaywallStep: React.FC<SoftPaywallStepProps> = ({
  selectedTier,
  onSelectTier,
  onStartTrial,
  onContinueFree,
}) => {
  const [showIntercept, setShowIntercept] = useState(false);

  const handleContinueFree = () => {
    Haptics.selectionAsync();
    setShowIntercept(true);
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 px-6 pt-2"
      >
        <Animated.View
          entering={FadeIn.duration(180).delay(80)}
          className="items-center pt-1"
        >
          <View className="mb-2 flex-row items-center gap-1.5 rounded-full border border-sage-200 bg-sage-50 px-3.5 py-1.5">
            <Text
              style={{ fontFamily: 'GeistSemiBold' }}
              className="text-[12px] text-sage-800"
            >
              App of the Day
            </Text>
          </View>
          <MochiMascot expression="happy" size={84} delay={200} />
          <Text
            style={{ fontFamily: 'CormorantSemiBold' }}
            className="mt-3 text-center text-[26px] leading-[1.15] tracking-[-0.02em] text-ink"
          >
            Become someone who doesn&apos;t run from{' '}
            <Text
              style={{ fontFamily: 'CormorantRegularItalic', color: '#5F7F58' }}
            >
              how they feel.
            </Text>
          </Text>
          <Text
            style={{ fontFamily: 'GeistRegular' }}
            className="mt-1.5 text-center text-[13px] text-ink-soft"
          >
            12 journeys · 800+ exercises · Unlimited AI insights
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(180).delay(160)} className="mt-3.5 gap-2">
          {PAYWALL_BENEFITS.map((benefit) => (
            <View key={benefit} className="flex-row items-center gap-2.5">
              <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-sage-500">
                <Text className="text-xs font-extrabold text-white">✓</Text>
              </View>
              <Text className="flex-1 text-[13px] font-medium text-ink">{benefit}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeIn.duration(180).delay(220)} className="mt-3.5">
          <Text
            style={{ fontFamily: 'GeistSemiBold' }}
            className="mb-2.5 text-[13px] text-sage-800"
          >
            Your next 3 lessons (locked without Plus)
          </Text>
          {LOCKED_LESSONS.map((lesson) => (
              <View
                key={lesson.day}
                style={{ borderCurve: 'continuous' }}
                className="relative mb-1.5 flex-row items-center gap-3 overflow-hidden rounded-xl border border-sage-100 bg-warm-white px-3 py-2.5"
              >
                <View className="flex-1 flex-row items-center gap-3 opacity-90">
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-sage-100">
                    <Text
                      style={{ fontFamily: 'CormorantSemiBold' }}
                      className="text-sm text-ink-muted"
                    >
                      {lesson.day}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{ fontFamily: 'GeistSemiBold' }}
                      className="text-[13px] text-ink"
                    >
                      {lesson.title}
                    </Text>
                    <Text
                      style={{ fontFamily: 'GeistRegular' }}
                      className="mt-0.5 text-[11px] text-ink-muted"
                    >
                      {lesson.meta}
                    </Text>
                  </View>
                </View>
                <BlurView
                  tint="light"
                  intensity={8}
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 54,
                    opacity: 0.42,
                  }}
                />
                <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-sage-600">
                  <Text className="text-xs text-gold">🔒</Text>
                </View>
              </View>
            ))}
          <Text
            style={{ fontFamily: 'CormorantRegularItalic' }}
            className="mt-2 text-center text-[13px] text-ink-muted"
          >
            Continue your journey or restart from Day 1.
          </Text>
        </Animated.View>

        <View className="mt-3.5 gap-2.5">
          {PRICING_PLANS.map((plan) => (
            <PricingTierCard
              key={plan.tier}
              plan={plan}
              isSelected={selectedTier === plan.tier}
              onSelect={() => onSelectTier(plan.tier)}
            />
          ))}
        </View>

        <Animated.View entering={FadeIn.duration(180).delay(300)} className="mt-4">
          <Text className="text-center text-[11px] text-ink-muted">
            7-day free trial · No charge until day 8 · Cancel anytime
          </Text>
          <Text className="mt-1 text-center text-[11px] text-ink-muted">
            💚 30-day full refund · No questions asked
          </Text>
        </Animated.View>

        <View className="mt-5">
          <TactileButton label="Start my 7-day free trial" onPress={onStartTrial} />
          <Pressable onPress={handleContinueFree} className="mt-3 items-center py-2">
            <Text className="text-sm text-ink-muted">Continue with free</Text>
          </Pressable>
        </View>

        <Animated.View
          entering={FadeIn.duration(180).delay(360)}
          className="mt-5 flex-row items-center justify-center gap-4 border-t border-sage-100 pt-3"
        >
          <View className="items-center">
            <Text style={{ fontFamily: 'CormorantSemiBold' }} className="text-base text-sage-600">
              3 in 4
            </Text>
            <Text style={{ fontFamily: 'GeistMedium' }} className="text-[11.5px] text-ink-soft">
              sleep better by Day 14
            </Text>
          </View>
          <View className="items-center">
            <Text style={{ fontFamily: 'CormorantSemiBold' }} className="text-base text-sage-600">
              ★ 4.9
            </Text>
            <Text style={{ fontFamily: 'GeistMedium' }} className="text-[11.5px] text-ink-soft">12k reviews</Text>
          </View>
          <View className="items-center">
            <Text style={{ fontFamily: 'CormorantSemiBold' }} className="text-base text-sage-600">
              220k
            </Text>
            <Text style={{ fontFamily: 'GeistMedium' }} className="text-[11.5px] text-ink-soft">in the Grove</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(180).delay(420)}
          className="mt-4"
        >
          <TestimonialCard
            initial="M"
            tone="sage"
            quote={`"I'm a 47-year-old guy. Never thought I'd journal. The CBT lessons are why I stayed — they actually teach you something. Day 89."`}
            name="Marcus"
            age={47}
            metaLabel="Happy Plus member"
          />
        </Animated.View>
      </ScrollView>

      <DiscountInterceptModal
        visible={showIntercept}
        onAccept={() => {
          setShowIntercept(false);
          onStartTrial();
        }}
        onDismiss={() => {
          setShowIntercept(false);
          onContinueFree();
        }}
      />
    </>
  );
};

export default React.memo(SoftPaywallStep);
