import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import { useTrialStatus } from '@/hooks/data/useTrialStatus';
import {
  POST_TRIAL_DISCOUNT_PERCENT,
  POST_TRIAL_ANNUAL_PRICE,
  POST_TRIAL_ANNUAL_PER_MONTH,
} from '@/src/screens/OnboardingScreen/constants';
import PremiumBadge from './PremiumBadge';

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
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      <View className="bg-gradient-to-r from-purple-600 to-purple-700 p-5">
        <View className="bg-purple-600 rounded-2xl p-5">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text style={{ fontSize: 20 }} className="mr-2">🎁</Text>
              <Text className="text-white text-base font-bold">
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
                <Text className="text-purple-200 text-sm">✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-purple-100 text-sm font-medium leading-5 mb-4">
            Your trial has ended, but we have a special deal — get{' '}
            <Text className="text-white font-bold">
              {POST_TRIAL_DISCOUNT_PERCENT}% off
            </Text>{' '}
            your annual subscription!
          </Text>

          <View className="bg-white/15 rounded-xl p-3 mb-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-xs font-medium opacity-80">
                  Annual Plan
                </Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-white text-lg font-extrabold mr-2">
                    {POST_TRIAL_ANNUAL_PRICE}
                  </Text>
                  <Text className="text-purple-200 text-xs line-through">
                    $39.99/year
                  </Text>
                </View>
                <Text className="text-purple-200 text-xs font-medium mt-0.5">
                  Just {POST_TRIAL_ANNUAL_PER_MONTH}
                </Text>
              </View>
              <View className="bg-yellow-400 rounded-full px-3 py-1">
                <Text className="text-yellow-900 text-xs font-bold">
                  {POST_TRIAL_DISCOUNT_PERCENT}% OFF
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUpgrade}
            className="bg-white rounded-xl py-3.5 items-center"
            activeOpacity={0.8}
            accessibilityLabel="Claim discount and upgrade to premium"
            accessibilityRole="button"
          >
            <Text className="text-purple-700 text-sm font-bold">
              Claim Your {POST_TRIAL_DISCOUNT_PERCENT}% Discount
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default React.memo(PostTrialDiscountBanner);
