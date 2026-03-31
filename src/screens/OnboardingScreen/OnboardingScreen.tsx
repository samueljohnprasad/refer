import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    Easing,
    FadeIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { useOnboardingAnalytics } from "./hooks/useOnboardingAnalytics";
import { usePremiumFeatureMapping } from "./hooks/usePremiumFeatureMapping";
import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { OnboardingStepName, MoodValue, JournalingGoal } from "./types";
import {
    ONBOARDING_STEPS,
    BRAND_PURPLE,
    TOTAL_ONBOARDING_STEPS,
} from "./constants";

import WelcomeValueStep from "./steps/WelcomeValueStep";
import GoalsSelectionStep from "./steps/GoalsSelectionStep";
import QuickWinMoodStep from "./steps/QuickWinMoodStep";
import FeatureDiscoveryStep from "./steps/FeatureDiscoveryStep";
import SoftPaywallStep from "./steps/SoftPaywallStep";
import EnhancedCelebrationStep from "./steps/EnhancedCelebrationStep";

import { Demographics } from "@/src/components/steps/src/steps/demographics/Demographics";
import { AGE_RANGES, GENDERS } from "@/src/components/steps/src/constants";
import { AgeRange, Gender } from "@/types/types";

interface OnboardingScreenProps {
    onComplete: () => Promise<void>;
}

interface ProgressDotsProps {
    totalSteps: number;
    currentStep: number;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({
    totalSteps,
    currentStep,
}) => (
    <View className="flex-row items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_: unknown, index: number) => (
            <View
                key={index}
                className={`h-1.5 rounded-full ${index <= currentStep ? "bg-purple-600 w-5" : "bg-gray-300 w-1.5"
                    }`}
            />
        ))}
    </View>
);

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const router = useRouter();
    const analytics = useOnboardingAnalytics();
    const { markCompleted } = useCompleteOnboarding();
    const { presentPaywall } = useRevenueCat();
    const [loading, setLoading] = React.useState<boolean>(false);

    const {
        currentStepIndex,
        currentStep,
        totalSteps,
        isFirstStep,
        isLastStep,
        progress,
        formData,
        goNext,
        goBack,
        updateName,
        updateGoals,
        updateQuickWinMood,
        updateTrialStarted,
        updateFormField,
    } = useOnboardingFlow();

    const { relevantSlides, relevantPremiumFeatures } = usePremiumFeatureMapping(
        formData.goals,
    );

    const bgColor = useSharedValue<string>(ONBOARDING_STEPS[0].backgroundColor);

    const backgroundAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: bgColor.value,
    }));

    useEffect(() => {
        bgColor.value = withTiming(
            ONBOARDING_STEPS[currentStepIndex].backgroundColor,
            { duration: 400, easing: Easing.out(Easing.cubic) },
        );
        analytics.trackStepViewed(currentStep, currentStepIndex);
    }, [currentStepIndex, currentStep]);

    const { height } = useGradualAnimation();
    const keyboardPadding = useAnimatedStyle(
        () => ({ height: height.value }),
        [],
    );

    const handleContinue = useCallback(async (): Promise<void> => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        analytics.trackStepCompleted(currentStep, currentStepIndex);

        if (isLastStep) {
            try {
                setLoading(true);
                await markCompleted({
                    name: formData.name,
                    ageRange: formData.ageRange,
                    gender: formData.gender,
                    reasons: formData.reasons,
                    cfg: {} as never,
                });
                await onComplete();
            } catch (error) {
                console.error("[Onboarding] Failed to complete:", error);
            } finally {
                setLoading(false);
            }
            return;
        }

        goNext();
    }, [
        isLastStep,
        currentStep,
        currentStepIndex,
        formData,
        markCompleted,
        onComplete,
        goNext,
        analytics,
    ]);

    const handleBack = useCallback((): void => {
        Haptics.selectionAsync();
        goBack();
    }, [goBack]);

    const handleSkip = useCallback((): void => {
        Haptics.selectionAsync();
        analytics.trackStepSkipped(currentStep);
        goNext();
    }, [currentStep, goNext, analytics]);

    const handleTrialStart = useCallback(
        async (plan: "annual" | "weekly"): Promise<void> => {
            analytics.trackTrialStarted(plan);
            updateTrialStarted(true, plan);
            const success: boolean = await presentPaywall();
            if (success) {
                updateTrialStarted(true, plan);
            }
            goNext();
        },
        [analytics, updateTrialStarted, presentPaywall, goNext],
    );

    const handleTrialSkip = useCallback((): void => {
        analytics.trackTrialSkipped();
        updateTrialStarted(false);
        goNext();
    }, [analytics, updateTrialStarted, goNext]);

    const canContinue: boolean = (() => {
        switch (currentStep) {
            case "welcome":
                return true;
            case "demographics":
                return formData.name.trim().length > 0;
            case "goals":
                return formData.goals.length > 0;
            case "quick_win_mood":
                return formData.quickWinMood !== undefined;
            case "feature_discovery":
                return true;
            case "soft_paywall":
                return true;
            case "celebration":
                return true;
            default:
                return true;
        }
    })();

    const currentStepConfig = ONBOARDING_STEPS[currentStepIndex];
    const showSkip: boolean = currentStepConfig.canSkip && !isLastStep;
    const ctaLabel: string = isLastStep ? "Start Your Journey 🚀" : "Continue";

    const renderStep = (): React.ReactNode => {
        switch (currentStep) {
            case "welcome":
                return <WelcomeValueStep />;

            case "demographics":
                return (
                    <Animated.View
                        entering={FadeIn.duration(500).delay(100)}
                        className="flex-1"
                    >
                        <View className="px-6 pt-4 pb-2">
                            <Text
                                className="text-gray-900 mb-1"
                                style={{
                                    fontFamily: "CormorantSemiBold",
                                    fontSize: 22,
                                    lineHeight: 28,
                                }}
                            >
                                What should we call you?
                            </Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(text: string) => updateFormField({ name: text })}
                                placeholder="Your name"
                                placeholderTextColor="#9CA3AF"
                                maxLength={30}
                                autoFocus
                                className="text-lg font-semibold text-gray-800 border-b-2 border-purple-300 py-3 mb-2"
                                accessibilityLabel="Enter your name"
                            />
                            {formData.name.trim().length > 0 && (
                                <Animated.View entering={FadeIn.duration(300)}>
                                    <Text className="text-sm text-purple-500 font-medium mt-1">
                                        Nice to meet you, {formData.name.trim()}! 👋
                                    </Text>
                                </Animated.View>
                            )}
                        </View>
                        <Demographics
                            ageRanges={AGE_RANGES}
                            selectedAgeRange={formData.ageRange}
                            onSelectAgeRange={(value: AgeRange | undefined) =>
                                updateFormField({ ageRange: value })
                            }
                            genders={GENDERS}
                            selectedGender={formData.gender}
                            onSelectGender={(value: Gender | undefined) =>
                                updateFormField({ gender: value })
                            }
                            title=""
                            helperText=""
                        />
                    </Animated.View>
                );

            case "goals":
                return (
                    <GoalsSelectionStep
                        selectedGoals={formData.goals}
                        onUpdateGoals={updateGoals}
                    />
                );

            case "quick_win_mood":
                return (
                    <QuickWinMoodStep
                        selectedMood={formData.quickWinMood}
                        onSelectMood={updateQuickWinMood}
                    />
                );

            case "feature_discovery":
                return <FeatureDiscoveryStep slides={relevantSlides} />;

            case "soft_paywall":
                return (
                    <SoftPaywallStep
                        relevantFeatures={relevantPremiumFeatures}
                        onStartTrial={handleTrialStart}
                        onSkipTrial={handleTrialSkip}
                    />
                );

            case "celebration":
                return (
                    <EnhancedCelebrationStep
                        userName={formData.name}
                        trialStarted={formData.trialStarted}
                    />
                );

            default:
                return null;
        }
    };

    const isPaywallStep: boolean = currentStep === "soft_paywall";

    return (
        <Animated.View
            style={[{ flex: 1, backgroundColor: "#fff" }, backgroundAnimatedStyle]}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => (
                        <Animated.View
                            style={[{ backgroundColor: "#fff" }, backgroundAnimatedStyle]}
                            className="h-28 items-start justify-end px-5"
                        >
                            <View className="w-full flex-row items-center justify-between mb-4">
                                <ProgressDots
                                    totalSteps={totalSteps}
                                    currentStep={currentStepIndex}
                                />
                                {showSkip && (
                                    <TouchableOpacity
                                        onPress={handleSkip}
                                        className="py-3 px-4"
                                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        accessibilityLabel="Skip this step"
                                        accessibilityRole="button"
                                    >
                                        <Text className="text-gray-400 dark:text-gray-500 text-sm font-semibold">
                                            Skip
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>
                    ),
                }}
            />

            <View className="flex-1 w-full">{renderStep()}</View>

            {!isPaywallStep && (
                <View className="w-full border-t border-gray-200 px-6 pt-5 pb-8">
                    <View className="flex-row gap-3">
                        {!isFirstStep && (
                            <TouchableOpacity
                                onPress={handleBack}
                                className="bg-gray-100 dark:bg-gray-800 rounded-2xl py-4 px-6 items-center justify-center"
                                activeOpacity={0.7}
                                accessibilityLabel="Go back to previous step"
                                accessibilityRole="button"
                            >
                                <Text className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                                    Back
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={handleContinue}
                            disabled={!canContinue || loading}
                            className={`flex-1 rounded-2xl py-4 items-center justify-center ${canContinue && !loading
                                ? "bg-purple-600"
                                : "bg-gray-300 dark:bg-gray-700"
                                }`}
                            activeOpacity={0.8}
                            accessibilityLabel={ctaLabel}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: !canContinue || loading }}
                        >
                            <Text
                                className={`text-sm font-bold ${canContinue && !loading
                                    ? "text-white"
                                    : "text-gray-500 dark:text-gray-400"
                                    }`}
                            >
                                {loading ? "Setting up..." : ctaLabel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Animated.View
                style={keyboardPadding}
                pointerEvents="none"
            />
            <KeyboardToolbar
                pointerEvents="none"
                content={<Text />}
                showArrows={false}
                insets={{ left: 16, right: 0 }}
                doneText="Close keyboard"
            />
        </Animated.View>
    );
};

export default React.memo(OnboardingScreen);
