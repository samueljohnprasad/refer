import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import PremiumBadge from './PremiumBadge';

interface UpgradePromptProps {
    title: string;
    description: string;
    emoji: string;
    feature: string;
    ctaLabel?: string;
    onDismiss?: () => void;
    showDismiss?: boolean;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
    title,
    description,
    emoji,
    feature,
    ctaLabel = 'Upgrade to Premium',
    onDismiss,
    showDismiss = true,
}) => {
    const { presentPaywall } = useRevenueCat();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

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
            className="bg-white rounded-2xl p-5 mx-4 mb-4"
            style={{
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
            }}
        >
            <View className="flex-row items-start mb-4">
                <View className="w-12 h-12 rounded-xl bg-purple-50 items-center justify-center mr-4">
                    <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </View>
                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <Text className="text-base font-bold text-gray-800 mr-2">{title}</Text>
                        <PremiumBadge size="small" />
                    </View>
                    <Text className="text-sm text-gray-500 font-medium leading-5">
                        {description}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleUpgrade}
                onPressIn={() => {
                    scale.value = withSpring(0.97, { damping: 20, stiffness: 100, overshootClamping: true });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, { damping: 20, stiffness: 100, overshootClamping: true });
                }}
                activeOpacity={1}
                accessibilityLabel={ctaLabel}
                accessibilityRole="button"
            >
                <Animated.View
                    style={animatedStyle}
                    className="bg-purple-600 rounded-xl py-3 items-center"
                >
                    <Text className="text-white text-sm font-bold">{ctaLabel}</Text>
                </Animated.View>
            </TouchableOpacity>

            {showDismiss && onDismiss && (
                <TouchableOpacity
                    onPress={handleDismiss}
                    className="items-center mt-2 py-2"
                    accessibilityLabel="Dismiss upgrade prompt"
                    accessibilityRole="button"
                >
                    <Text className="text-gray-400 text-xs font-medium">Not now</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

export default React.memo(UpgradePrompt);
