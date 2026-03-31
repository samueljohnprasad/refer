import React from 'react';
import { View, Text } from 'react-native';
import { PREMIUM_GOLD } from '@/src/screens/OnboardingScreen/constants';

interface PremiumBadgeProps {
    size?: 'small' | 'medium' | 'large';
    label?: string;
}

const SIZE_CONFIG: Record<string, { paddingX: string; paddingY: string; fontSize: string; iconSize: number }> = {
    small: { paddingX: 'px-2', paddingY: 'py-0.5', fontSize: 'text-xs', iconSize: 10 },
    medium: { paddingX: 'px-3', paddingY: 'py-1', fontSize: 'text-sm', iconSize: 12 },
    large: { paddingX: 'px-4', paddingY: 'py-1.5', fontSize: 'text-base', iconSize: 14 },
};

const PremiumBadge: React.FC<PremiumBadgeProps> = ({
    size = 'small',
    label = 'PRO',
}) => {
    const config = SIZE_CONFIG[size];

    return (
        <View
            className={`flex-row items-center ${config.paddingX} ${config.paddingY} rounded-full bg-amber-100`}
        >
            <Text className="mr-0.5" style={{ fontSize: config.iconSize }}>
                ✨
            </Text>
            <Text
                className={`${config.fontSize} font-bold text-amber-700`}
                style={{ letterSpacing: 0.5 }}
            >
                {label}
            </Text>
        </View>
    );
};

export default React.memo(PremiumBadge);
