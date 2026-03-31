import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useRevenueCat } from '@/src/context/RevenueCatProvider';
import { TRIAL_DAYS } from '@/src/screens/OnboardingScreen/constants';

interface TrialBannerProps {
    trialStartDate: Date | null;
    onUpgrade: () => void;
}

const TrialBanner: React.FC<TrialBannerProps> = ({ trialStartDate, onUpgrade }) => {
    const { hasPro } = useRevenueCat();

    const daysRemaining: number = useMemo(() => {
        if (!trialStartDate) return 0;
        const now: Date = new Date();
        const trialEnd: Date = new Date(trialStartDate);
        trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
        const diffMs: number = trialEnd.getTime() - now.getTime();
        const diffDays: number = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }, [trialStartDate]);

    if (hasPro || !trialStartDate || daysRemaining <= 0) {
        return null;
    }

    const isUrgent: boolean = daysRemaining <= 2;

    const handlePress = (): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onUpgrade();
    };

    return (
        <Animated.View entering={FadeInDown.duration(400).springify()}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                accessibilityLabel={`${daysRemaining} days left in trial. Tap to upgrade.`}
                accessibilityRole="button"
            >
                <View
                    className={`flex-row items-center justify-between rounded-2xl px-4 py-3 mx-4 mb-3 ${isUrgent ? 'bg-red-50 border border-red-100' : 'bg-purple-50 border border-purple-100'
                        }`}
                >
                    <View className="flex-row items-center flex-1">
                        <Text style={{ fontSize: 16 }} className="mr-2">
                            {isUrgent ? '⏰' : '👑'}
                        </Text>
                        <View className="flex-1">
                            <Text
                                className={`text-xs font-bold ${isUrgent ? 'text-red-700' : 'text-purple-700'
                                    }`}
                            >
                                {daysRemaining === 1
                                    ? 'Last day of your trial!'
                                    : `${daysRemaining} days left in your trial`}
                            </Text>
                            <Text
                                className={`text-xs font-medium mt-0.5 ${isUrgent ? 'text-red-500' : 'text-purple-500'
                                    }`}
                            >
                                {isUrgent
                                    ? "Don't lose access to premium features"
                                    : 'Upgrade to keep all features'}
                            </Text>
                        </View>
                    </View>
                    <View
                        className={`rounded-full px-3 py-1.5 ${isUrgent ? 'bg-red-500' : 'bg-purple-600'
                            }`}
                    >
                        <Text className="text-white text-xs font-bold">Upgrade</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default React.memo(TrialBanner);

