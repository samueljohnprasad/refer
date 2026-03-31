import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import PremiumBadge from './PremiumBadge';

interface PremiumGateProps {
    children: React.ReactNode;
    feature: string;
    title?: string;
    description?: string;
    onUpgradePress?: () => void;
}

const PremiumGate: React.FC<PremiumGateProps> = ({
    children,
    feature,
    title = 'Premium Feature',
    description = 'Upgrade to unlock this feature and get the most out of your journey.',
    onUpgradePress,
}) => {
    const { hasPro, presentPaywall } = useRevenueCat();

    if (hasPro) {
        return <>{children}</>;
    }

    const handleUpgrade = async (): Promise<void> => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onUpgradePress) {
            onUpgradePress();
            return;
        }
        await presentPaywall();
    };

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-6 items-center"
        >
            <View className="mb-3">
                <PremiumBadge size="medium" />
            </View>

            <Text className="text-lg font-bold text-gray-800 text-center mb-2">
                {title}
            </Text>

            <Text className="text-sm text-gray-500 font-medium text-center leading-5 mb-5 px-4">
                {description}
            </Text>

            <TouchableOpacity
                onPress={handleUpgrade}
                className="bg-purple-600 rounded-2xl py-3.5 px-8"
                activeOpacity={0.8}
                accessibilityLabel={`Upgrade to unlock ${feature}`}
                accessibilityRole="button"
            >
                <Text className="text-white text-sm font-bold">Unlock with Premium</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default React.memo(PremiumGate);
