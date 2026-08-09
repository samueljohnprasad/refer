import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import PremiumBadge from "./PremiumBadge";

interface BlurredPremiumPreviewProps {
    children: React.ReactNode;
    feature: string;
    title?: string;
    ctaLabel?: string;
    blurIntensity?: "light" | "medium" | "heavy";
}

const BLUR_TINT_MAP: Record<string, number> = {
    light: 40,
    medium: 60,
    heavy: 80,
};

const FALLBACK_OPACITY: Record<string, number> = {
    light: 0.6,
    medium: 0.75,
    heavy: 0.88,
};

const BlurredPremiumPreview: React.FC<BlurredPremiumPreviewProps> = ({
    children,
    feature,
    title = "Premium Feature",
    ctaLabel = "Unlock with Premium",
    blurIntensity = "medium",
}) => {
    const { hasPro, presentPaywall } = useRevenueCat();

    if (hasPro) {
        return <>{children}</>;
    }

    const handleUnlock = async (): Promise<void> => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await presentPaywall();
    };

    const overlayContent: React.ReactNode = (
        <View className="items-center px-6">
            <View className="w-14 h-14 rounded-2xl bg-purple-100 items-center justify-center mb-4">
                <Text style={{ fontSize: 28 }}>🔒</Text>
            </View>

            <PremiumBadge
                size="medium"
                label="PREMIUM"
            />

            <Text className="text-base font-bold text-gray-800 dark:text-gray-200 text-center mt-3 mb-2">
                {title}
            </Text>

            <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center leading-4 mb-4 px-4">
                Get a sneak peek. Unlock the full experience with Premium.
            </Text>

            <TouchableOpacity
                onPress={handleUnlock}
                className="bg-purple-600 rounded-2xl py-3.5 px-8"
                activeOpacity={0.8}
                accessibilityLabel={`Unlock ${feature} with premium`}
                accessibilityRole="button"
            >
                <Text className="text-white text-sm font-bold">{ctaLabel}</Text>
            </TouchableOpacity>
        </View>
    );

    const isNative: boolean = Platform.OS === "ios" || Platform.OS === "android";

    return (
        <View className="relative overflow-hidden rounded-2xl">
            <View
                pointerEvents="none"
                accessibilityElementsHidden
            >
                {children}
            </View>

            <Animated.View
                entering={FadeIn.duration(300)}
                className="absolute inset-0 items-center justify-center rounded-2xl overflow-hidden"
            >
                {isNative ? (
                    <BlurView
                        intensity={BLUR_TINT_MAP[blurIntensity]}
                        tint="light"
                        className="absolute inset-0"
                    />
                ) : (
                    <View
                        className="absolute inset-0"
                        style={{
                            backgroundColor: `rgba(255, 255, 255, ${FALLBACK_OPACITY[blurIntensity]})`,
                        }}
                    />
                )}
                {overlayContent}
            </Animated.View>
        </View>
    );
};

export default React.memo(BlurredPremiumPreview);


