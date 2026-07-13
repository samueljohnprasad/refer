import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import PremiumBadge from './PremiumBadge';

interface EmptyStateWithUpsellProps {
    emoji: string;
    title: string;
    description: string;
    primaryCtaLabel: string;
    onPrimaryCta: () => void;
    premiumFeature?: string;
    premiumCtaLabel?: string;
    showPremiumUpsell?: boolean;
}

const EmptyStateWithUpsell: React.FC<EmptyStateWithUpsellProps> = ({
    emoji,
    title,
    description,
    primaryCtaLabel,
    onPrimaryCta,
    premiumFeature,
    premiumCtaLabel = 'Unlock with Premium',
    showPremiumUpsell = true,
}) => {
    const { hasPro, presentPaywall } = useRevenueCat();

    const handlePrimaryCta = (): void => {
        Haptics.selectionAsync();
        onPrimaryCta();
    };

    const handlePremiumCta = async (): Promise<void> => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await presentPaywall();
    };

    return (
        <Animated.View
            entering={FadeIn.duration(500)}
            className="items-center px-8 py-12"
        >
            <View className="w-20 h-20 rounded-3xl bg-gray-100 items-center justify-center mb-5">
                <Text style={{ fontSize: 40 }}>{emoji}</Text>
            </View>

            <Text className="text-xl font-bold text-gray-800 text-center mb-2">
                {title}
            </Text>

            <Text className="text-sm text-gray-500 font-medium text-center leading-5 mb-6 px-4">
                {description}
            </Text>

            <TouchableOpacity
                onPress={handlePrimaryCta}
                className="bg-purple-600 rounded-2xl py-3.5 px-8 mb-3"
                activeOpacity={0.8}
                accessibilityLabel={primaryCtaLabel}
                accessibilityRole="button"
            >
                <Text className="text-white text-sm font-bold">{primaryCtaLabel}</Text>
            </TouchableOpacity>

            {showPremiumUpsell && !hasPro && premiumFeature && (
                <TouchableOpacity
                    onPress={handlePremiumCta}
                    className="flex-row items-center py-2 px-4 gap-2"
                    activeOpacity={0.7}
                    accessibilityLabel={premiumCtaLabel}
                    accessibilityRole="button"
                >
                    <PremiumBadge size="small" />
                    <Text className="text-purple-600 text-sm font-semibold">
                        {premiumCtaLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

export default React.memo(EmptyStateWithUpsell);
