import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import MochiMascot from '../components/MochiMascot';
import PricingTierCard from '../components/PricingTierCard';
import TactileButton from '../components/TactileButton';
import DiscountInterceptModal from '../components/DiscountInterceptModal';
import { PricingTier } from '../types';
import { PRICING_PLANS, PAYWALL_BENEFITS } from '../constants';

interface SoftPaywallStepProps {
  selectedTier?: PricingTier;
  onSelectTier: (tier: PricingTier) => void;
  onStartTrial: () => void;
  onContinueFree: () => void;
}

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
        className="flex-1 px-6 pt-4"
      >
        <Animated.View entering={FadeIn.duration(180).delay(80)} className="items-center">
          <View className="flex-row items-center gap-1.5 rounded-full bg-sage-700 px-3.5 py-1.5">
            <Text className="text-[11px] font-bold uppercase tracking-wider text-gold">
              ⭐ App of the Day
            </Text>
          </View>
          <MochiMascot expression="happy" size={100} delay={200} />
          <Text
            style={{ fontFamily: 'CormorantSemiBold' }}
            className="mt-3 text-center text-[26px] leading-[1.15] text-ink"
          >
            Become someone who doesn't run from how they feel.
          </Text>
          <Text className="mt-2 text-center text-[13px] text-ink-soft">
            Co-designed with Dr. Lena Park, PhD · Licensed CBT therapist
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(180).delay(160)} className="mt-5 gap-2">
          {PAYWALL_BENEFITS.map((benefit) => (
            <View key={benefit} className="flex-row items-center gap-2.5">
              <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-sage-500">
                <Text className="text-xs font-extrabold text-white">✓</Text>
              </View>
              <Text className="flex-1 text-[13px] font-medium text-ink">{benefit}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeIn.duration(180).delay(220)} className="mt-5">
          <Text className="mb-2.5 text-xs font-bold uppercase tracking-wide text-sage-700">
            Your next 3 lessons (locked without Plus)
          </Text>
          {['The Thought Spiral', 'Body as Compass', 'Thought Records: Your First CBT Tool'].map(
            (name, i) => (
              <View
                key={name}
                className="mb-2 flex-row items-center gap-3 rounded-xl border border-sage-100 bg-warm-white px-3.5 py-3"
              >
                <View className="h-8 w-8 items-center justify-center rounded-lg bg-sage-100">
                  <Text
                    style={{ fontFamily: 'CormorantSemiBold' }}
                    className="text-sm text-ink-muted"
                  >
                    {i + 2}
                  </Text>
                </View>
                <Text className="flex-1 text-[13px] font-semibold text-ink">{name}</Text>
                <View className="h-[26px] w-[26px] items-center justify-center rounded-full bg-sage-700">
                  <Text className="text-xs text-gold">🔒</Text>
                </View>
              </View>
            ),
          )}
        </Animated.View>

        <View className="mt-5 gap-2.5">
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
          <TactileButton label="START FREE TRIAL" onPress={onStartTrial} />
          <Pressable onPress={handleContinueFree} className="mt-3 items-center py-2">
            <Text className="text-sm text-ink-muted">Continue with free</Text>
          </Pressable>
        </View>

        <Animated.View
          entering={FadeIn.duration(180).delay(360)}
          className="mt-5 flex-row items-center justify-center gap-3.5 border-t border-sage-100 pt-3"
        >
          <View className="items-center">
            <Text style={{ fontFamily: 'CormorantSemiBold' }} className="text-base text-sage-600">
              3 in 4
            </Text>
            <Text className="text-[9px] uppercase tracking-wide text-ink-muted">
              sleep better by Day 14
            </Text>
          </View>
          <View className="items-center">
            <Text style={{ fontFamily: 'CormorantSemiBold' }} className="text-base text-sage-600">
              ★ 4.9
            </Text>
            <Text className="text-[9px] uppercase tracking-wide text-ink-muted">12k reviews</Text>
          </View>
          <View className="items-center">
            <Text style={{ fontFamily: 'CormorantSemiBold' }} className="text-base text-sage-600">
              220k
            </Text>
            <Text className="text-[9px] uppercase tracking-wide text-ink-muted">in the Grove</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(180).delay(420)}
          className="mt-4 rounded-[14px] border-l-[3px] border-gold bg-warm-white px-4 py-3"
        >
          <Text
            style={{ fontFamily: 'CormorantMedium' }}
            className="text-[13px] italic leading-[1.4] text-ink"
          >
            "I'm a 47-year-old guy. Never thought I'd journal. The CBT lessons are why I stayed — they actually teach you something. Day 89."
          </Text>
          <Text className="mt-1 text-[11px] text-ink-muted">— Marcus, 47</Text>
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
