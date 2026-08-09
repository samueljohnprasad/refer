import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import { useTrialStatus } from '@/hooks/data/useTrialStatus';
import { Card } from '@/src/components/ui/Card';
import {
  POST_TRIAL_DISCOUNT_PERCENT,
  POST_TRIAL_ANNUAL_PRICE,
  POST_TRIAL_ANNUAL_PER_MONTH,
} from '@/src/screens/OnboardingScreen/constants';

interface PostTrialDiscountBannerProps {
  onDismiss?: () => void;
}

const PostTrialDiscountBanner: React.FC<PostTrialDiscountBannerProps> = ({
  onDismiss,
}) => {
  const { hasPro, presentPaywall } = useRevenueCat();
  const { isTrialExpired } = useTrialStatus();

  if (hasPro || !isTrialExpired) {
    return null;
  }

  const handleUpgrade = async (): Promise<void> => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await presentPaywall();
  };

  const handleDismiss = (): void => {
    Haptics.selectionAsync();
    onDismiss?.();
  };

  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <Card
        variant="tile"
        radius="xl"
        showDepth={true}
        className="mx-5 mb-5"
        contentClassName="p-5 bg-sage-50"
      >
        <View className="rounded-[24px] border border-sage-100 bg-brand-surface p-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text style={{ fontSize: 20 }} className="mr-2">🎁</Text>
              <Text className="happy-font-body-bold text-ink text-base">
                Special Offer for You
              </Text>
            </View>
            {onDismiss && (
              <TouchableOpacity
                onPress={handleDismiss}
                className="p-1"
                accessibilityLabel="Dismiss discount banner"
                accessibilityRole="button"
              >
                <Text className="happy-font-body-bold text-ink-muted text-sm">✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="happy-font-body-medium text-ink-soft text-sm leading-5 mb-4">
            Your trial has ended. Get{' '}
            <Text className="happy-font-body-bold text-sage-700">
              {POST_TRIAL_DISCOUNT_PERCENT}% off
            </Text>{' '}
            your annual subscription!
          </Text>

          <View className="bg-sage-pill rounded-xl p-3 mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="happy-font-body-medium text-ink-muted text-xs">
                  Annual Plan
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="happy-font-body-bold text-ink text-lg mr-2">
                    {POST_TRIAL_ANNUAL_PRICE}
                  </Text>
                  <Text className="happy-font-body text-ink-muted text-xs line-through">
                    $39.99/year
                  </Text>
                </View>
                <Text className="happy-font-body-medium text-ink-muted text-xs mt-0.5">
                  Just {POST_TRIAL_ANNUAL_PER_MONTH}
                </Text>
              </View>
              <View className="bg-gold/20 rounded-full px-3 py-1">
                <Text className="happy-font-body-bold text-ink-soft text-xs">
                  {POST_TRIAL_DISCOUNT_PERCENT}% OFF
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUpgrade}
            className="happy-brand-primary-cta rounded-xl py-3.5 items-center"
            activeOpacity={0.8}
            accessibilityLabel="Claim discount and upgrade to premium"
            accessibilityRole="button"
          >
            <Text className="happy-font-body-bold text-brand-surface text-sm">
              Claim Your {POST_TRIAL_DISCOUNT_PERCENT}% Discount
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );
};

export default React.memo(PostTrialDiscountBanner);
