import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { PricingPlan } from "../types";
import {
    PRICING_PLANS,
    TRIAL_DAYS,
    PREMIUM_MEMBER_COUNT,
    BRAND_PURPLE,
} from "../constants";
import PremiumBadge from "../../../components/premium/PremiumBadge";

interface SoftPaywallStepProps {
    relevantFeatures: {
        id: string;
        title: string;
        description: string;
        emoji: string;
        isPremium: boolean;
        statLabel: string;
        statValue: string;
    }[];
    onStartTrial: (plan: "annual" | "weekly") => void;
    onSkipTrial: () => void;
}

interface PricingCardProps {
    plan: PricingPlan;
    isSelected: boolean;
    onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
    plan,
    isSelected,
    onSelect,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (): void => {
        scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    };

    const handlePressOut = (): void => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    return (
        <TouchableOpacity
            onPress={onSelect}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            className="flex-1"
            accessibilityLabel={`Select ${plan.label} plan at ${plan.price}`}
            accessibilityRole="button"
        >
            <Animated.View
                style={animatedStyle}
                className={`rounded-2xl p-4 border-2 ${isSelected
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 bg-white"
                    }`}
            >
                {plan.badge && (
                    <View className="absolute -top-3 left-3 bg-purple-600 rounded-full px-3 py-0.5">
                        <Text className="text-white text-xs font-bold">{plan.badge}</Text>
                    </View>
                )}

                <Text className="text-sm font-bold text-gray-800 mb-1">
                    {plan.label}
                </Text>
                <Text
                    className="text-lg font-extrabold text-gray-900"
                    style={{ letterSpacing: -0.3 }}
                >
                    {plan.price}
                </Text>
                <Text className="text-xs text-gray-500 font-medium">
                    {plan.perMonthPrice}
                </Text>
                {plan.savings && (
                    <View className="bg-green-100 rounded-full px-2 py-0.5 mt-2 self-start">
                        <Text className="text-green-700 text-xs font-bold">
                            {plan.savings}
                        </Text>
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

interface FeatureListItemProps {
    emoji: string;
    title: string;
    delay: number;
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({
    emoji,
    title,
    delay,
}) => (
    <Animated.View
        entering={FadeInDown.duration(400).delay(delay)}
        className="flex-row items-center py-2"
    >
        <View className="w-8 h-8 rounded-full bg-purple-50 items-center justify-center mr-3">
            <Text style={{ fontSize: 14 }}>{emoji}</Text>
        </View>
        <Text className="flex-1 text-sm font-semibold text-gray-700">{title}</Text>
        <Text className="text-green-500 text-sm">✓</Text>
    </Animated.View>
);

const SoftPaywallStep: React.FC<SoftPaywallStepProps> = ({
    relevantFeatures,
    onStartTrial,
    onSkipTrial,
}) => {
    const [selectedPlan, setSelectedPlan] = useState<"annual" | "weekly">(
        "annual",
    );
    const ctaScale = useSharedValue(1);

    const ctaAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ctaScale.value }],
    }));

    const handleStartTrial = (): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onStartTrial(selectedPlan);
    };

    const handleSkip = (): void => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSkipTrial();
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            className="flex-1 px-6 pt-6"
        >
            <Animated.View
                entering={FadeInUp.duration(600).springify()}
                className="items-center mb-6"
            >
                <View className="mb-3">
                    <PremiumBadge
                        size="large"
                        label="PREMIUM"
                    />
                </View>
                <Text
                    className="text-center text-gray-900 mb-2"
                    style={{
                        fontFamily: "CormorantBold",
                        fontSize: 28,
                        lineHeight: 34,
                        letterSpacing: -0.5,
                    }}
                >
                    Start Your Free Trial
                </Text>
                <Text className="text-center text-gray-500 text-sm font-medium leading-5">
                    Try all premium features free for {TRIAL_DAYS} days
                </Text>
            </Animated.View>

            <Animated.View
                entering={FadeIn.duration(400).delay(200)}
                className="bg-white rounded-2xl p-5 mb-5"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                }}
            >
                <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Everything included
                </Text>
                {relevantFeatures.map((feature, index: number) => (
                    <FeatureListItem
                        key={feature.id}
                        emoji={feature.emoji}
                        title={feature.title}
                        delay={300 + index * 80}
                    />
                ))}
            </Animated.View>

            <Animated.View
                entering={FadeIn.duration(400).delay(600)}
                className="flex-row gap-3 mb-5"
            >
                {PRICING_PLANS.map((plan: PricingPlan) => (
                    <PricingCard
                        key={plan.id}
                        plan={plan}
                        isSelected={selectedPlan === plan.id}
                        onSelect={() => {
                            Haptics.selectionAsync();
                            setSelectedPlan(plan.id);
                        }}
                    />
                ))}
            </Animated.View>

            <Animated.View entering={FadeIn.duration(400).delay(700)}>
                <TouchableOpacity
                    onPress={handleStartTrial}
                    onPressIn={() => {
                        ctaScale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
                    }}
                    onPressOut={() => {
                        ctaScale.value = withSpring(1, { damping: 15, stiffness: 400 });
                    }}
                    activeOpacity={1}
                    accessibilityLabel="Start free trial"
                    accessibilityRole="button"
                >
                    <Animated.View
                        style={ctaAnimatedStyle}
                        className="bg-purple-600 rounded-2xl py-4 items-center"
                    >
                        <Text className="text-white text-base font-bold">
                            Start {TRIAL_DAYS}-Day Free Trial
                        </Text>
                    </Animated.View>
                </TouchableOpacity>

                <View className="flex-row items-center justify-center mt-3 gap-4">
                    <Text className="text-gray-400 text-xs font-medium">
                        Cancel anytime
                    </Text>
                    <Text className="text-gray-300">•</Text>
                    <Text className="text-gray-400 text-xs font-medium">
                        No charge for {TRIAL_DAYS} days
                    </Text>
                </View>

                <Text className="text-gray-400 text-xs font-normal text-center leading-4 mt-3 px-2">
                    After your {TRIAL_DAYS}-day free trial, your selected plan will
                    automatically renew. You can cancel anytime before the trial ends and
                    you won't be charged.
                </Text>
            </Animated.View>

            <Animated.View
                entering={FadeIn.duration(400).delay(800)}
                className="items-center mt-5"
            >
                <TouchableOpacity
                    onPress={handleSkip}
                    className="py-4 px-8"
                    hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
                    accessibilityLabel="Skip trial and continue without premium"
                    accessibilityRole="button"
                >
                    <Text className="text-gray-400 text-sm font-semibold">
                        Maybe Later
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View
                entering={FadeIn.duration(300).delay(900)}
                className="items-center mt-2 mb-4"
            >
                <Text className="text-gray-400 text-xs font-medium">
                    Join {PREMIUM_MEMBER_COUNT} premium members
                </Text>
            </Animated.View>
        </ScrollView>
    );
};

export default React.memo(SoftPaywallStep);
