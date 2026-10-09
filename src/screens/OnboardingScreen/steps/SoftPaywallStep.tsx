import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import HappiMascot from '../components/HappiMascot';
import PricingTierCard from '../components/PricingTierCard';
import TactileButton from '../components/TactileButton';
import DiscountInterceptModal from '../components/DiscountInterceptModal';
import { PricingTier } from '../types';
import { PRICING_PLANS } from '../constants';
import TestimonialCard from '../components/TestimonialCard';
import { useTranslation } from 'react-i18next';

interface SoftPaywallStepProps {
  selectedTier?: PricingTier;
  onSelectTier: (tier: PricingTier) => void;
  onStartTrial: () => void;
  onContinueFree: () => void;
}

const LOCKED_LESSONS = [2, 3, 4] as const;

const SoftPaywallStep: React.FC<SoftPaywallStepProps> = ({
  selectedTier,
  onSelectTier,
  onStartTrial,
  onContinueFree,
}) => {
  const [showIntercept, setShowIntercept] = useState(false);
  const { t, i18n } = useTranslation('onboarding');
  const formatCount = (count: number) => new Intl.NumberFormat(i18n.language, { notation: 'compact' }).format(count);

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
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="text-[12px] text-sage-800"
            >
              {t('paywall.appOfTheDay')}
            </Text>
          </View>
          <HappiMascot expression="happy" size={84} delay={200} />
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="mt-3 text-center text-[26px] leading-[1.15] tracking-[-0.02em] text-ink"
          >
            {t('paywall.headlineStart')}{' '}
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.regularItalic, color: '#5F7F58' }}
            >
              {t('paywall.headlineEnd')}
            </Text>
          </Text>
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.regular }}
            className="mt-1.5 text-center text-[13px] text-ink-soft"
          >
            {t('paywall.featureSummary', { journeys: 12, exercises: 800 })}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(180).delay(160)} className="mt-3.5 gap-2">
          {(['journeys', 'ai', 'cbt', 'streak'] as const).map((benefit) => (
            <View key={benefit} className="flex-row items-center gap-2.5">
              <View className="h-[22px] w-[22px] items-center justify-center rounded-full bg-sage-500">
                <Text className="text-xs font-extrabold text-white">✓</Text>
              </View>
              <Text className="flex-1 text-[13px] font-medium text-ink">{t(`paywall.benefits.${benefit}`)}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeIn.duration(180).delay(220)} className="mt-3.5">
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
            className="mb-2.5 text-[13px] text-sage-800"
          >
            {t('paywall.lockedTitle', { count: LOCKED_LESSONS.length })}
          </Text>
          {LOCKED_LESSONS.map((lesson) => (
              <View
                key={lesson}
                style={{ borderCurve: 'continuous' }}
                className="relative mb-1.5 flex-row items-center gap-3 overflow-hidden rounded-xl border border-sage-100 bg-warm-white px-3 py-2.5"
              >
                <View className="flex-1 flex-row items-center gap-3 opacity-90">
                  <View className="h-8 w-8 items-center justify-center rounded-lg bg-sage-100">
                    <Text
                      style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                      className="text-sm text-ink-muted"
                    >
                      {lesson}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                      className="text-[13px] text-ink"
                    >
                      {t(`paywall.lessons.day${lesson}.title`)}
                    </Text>
                    <Text
                      style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                      className="mt-0.5 text-[11px] text-ink-muted"
                    >
                      {t(`paywall.lessons.day${lesson}.meta`)}
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
            style={{ fontFamily: APP_FONT_FAMILIES.regularItalic }}
            className="mt-2 text-center text-[13px] text-ink-muted"
          >
            {t('paywall.restartNote')}
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
            {t('paywall.trialTerms')}
          </Text>
          <Text className="mt-1 text-center text-[11px] text-ink-muted">
            {t('paywall.refundTerms')}
          </Text>
        </Animated.View>

        <View className="mt-5">
          <TactileButton label={t('paywall.startTrial')} onPress={onStartTrial} />
          <Pressable onPress={handleContinueFree} className="mt-3 items-center py-2">
            <Text className="text-sm text-ink-muted">{t('paywall.continueFree')}</Text>
          </Pressable>
        </View>

        <Animated.View
          entering={FadeIn.duration(180).delay(360)}
          className="mt-5 flex-row items-center justify-center gap-4 border-t border-sage-100 pt-3"
        >
          <View className="items-center">
            <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold }} className="text-base text-sage-600">
              {t('paywall.sleepRatio')}
            </Text>
            <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold }} className="text-[11.5px] text-ink-soft">
              {t('paywall.sleepCaption', { day: 14 })}
            </Text>
          </View>
          <View className="items-center">
            <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold }} className="text-base text-sage-600">
              {t('paywall.rating', { value: new Intl.NumberFormat(i18n.language, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(4.9) })}
            </Text>
            <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold }} className="text-[11.5px] text-ink-soft">{t('paywall.reviews', { count: formatCount(12000) })}</Text>
          </View>
          <View className="items-center">
            <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold }} className="text-base text-sage-600">
              {formatCount(220000)}
            </Text>
            <Text style={{ fontFamily: APP_FONT_FAMILIES.semiBold }} className="text-[11.5px] text-ink-soft">{t('paywall.groveCaption')}</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(180).delay(420)}
          className="mt-4"
        >
          <TestimonialCard
            initial="M"
            tone="sage"
            quote={t('paywall.testimonialQuote')}
            name="Marcus"
            age={47}
            metaLabel={t('paywall.memberLabel')}
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
