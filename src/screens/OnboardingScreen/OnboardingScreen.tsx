import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { useOnboardingAnalytics } from "./hooks/useOnboardingAnalytics";
import { usePremiumFeatureMapping } from "./hooks/usePremiumFeatureMapping";
import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { OnboardingRendererKind } from "./types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { ONBOARDING_STEPS } from "./constants";

import GoalsSelectionStep from "./steps/GoalsSelectionStep";
import QuickWinMoodStep from "./steps/QuickWinMoodStep";
import FeatureDiscoveryStep from "./steps/FeatureDiscoveryStep";
import SoftPaywallStep from "./steps/SoftPaywallStep";
import EnhancedCelebrationStep from "./steps/EnhancedCelebrationStep";
import JourneyStepScreen from "@/src/components/journey/JourneyStepScreen";
import AnimatedScreenTransition from "@/src/components/journey/AnimatedScreenTransition";
import BeginButton from "@/src/components/BeginButton";
import ProgressGraphVictoryStep from "./steps/ProgressGraphVictoryStep";

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
    const analytics = useOnboardingAnalytics();
    const { markCompleted } = useCompleteOnboarding();
    const { presentPaywall } = useRevenueCat();
    const [loading, setLoading] = React.useState<boolean>(false);

    const {
        currentStepIndex,
        currentStep,
        totalSteps,
        isLastStep,
        formData,
        goNext,
        goBack,
        updateGoals,
        updateQuickWinMood,
        updateTrialStarted,
    } = useOnboardingFlow();

    const { relevantSlides, relevantPremiumFeatures } = usePremiumFeatureMapping(
        formData.goals,
    );
    const currentStepConfig = ONBOARDING_STEPS[currentStepIndex];

    const bgColor = useSharedValue<string>(ONBOARDING_STEPS[0].backgroundColor);

    const backgroundAnimatedStyle = useAnimatedStyle(() => ({
        backgroundColor: bgColor.value,
    }));

    useEffect(() => {
        bgColor.value = withTiming(
            currentStepConfig.backgroundColor,
            { duration: 400, easing: Easing.out(Easing.cubic) },
        );
        analytics.trackStepViewed(currentStep, currentStepIndex);
    }, [analytics, bgColor, currentStep, currentStepConfig.backgroundColor, currentStepIndex]);

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

    const canContinue: boolean = currentStepConfig.isContinueEnabled?.(formData) ?? true;
    const showSkip: boolean = currentStepConfig.canSkip;
    const showHeaderBack: boolean = currentStepConfig.showBackButton;
    const showContinueButton: boolean = currentStepConfig.showContinueButton;
    const ctaLabel: string = currentStepConfig.continueButtonLabel;

    const renderStep = (): React.ReactNode => {
        switch (currentStepConfig.renderer.kind) {
            case OnboardingRendererKind.JourneyStep:
                return (
                    <AnimatedScreenTransition
                        transitionKey={
                            currentStepConfig.renderer.transitionKey ??
                            currentStepConfig.renderer.screenName
                        }
                        duration={currentStepConfig.renderer.transitionDuration ?? 360}
                    >
                        <JourneyStepScreen
                            name={currentStepConfig.renderer.screenName}
                        />
                    </AnimatedScreenTransition>
                );

            case OnboardingRendererKind.ProgressGraph:
                return <ProgressGraphVictoryStep />;

            case OnboardingRendererKind.Goals:
                return (
                    <GoalsSelectionStep
                        selectedGoals={formData.goals}
                        onUpdateGoals={updateGoals}
                    />
                );

            case OnboardingRendererKind.QuickWinMood:
                return (
                    <QuickWinMoodStep
                        selectedMood={formData.quickWinMood}
                        onSelectMood={updateQuickWinMood}
                    />
                );

            case OnboardingRendererKind.FeatureDiscovery:
                return <FeatureDiscoveryStep slides={relevantSlides} />;

            case OnboardingRendererKind.SoftPaywall:
                return (
                    <SoftPaywallStep
                        relevantFeatures={relevantPremiumFeatures}
                        onStartTrial={handleTrialStart}
                        onSkipTrial={handleTrialSkip}
                    />
                );

            case OnboardingRendererKind.Celebration:
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
                            className="h-32 items-start justify-end px-5"
                        >
                            <View className="relative mb-4 w-full flex-row items-center justify-between">
                                {showHeaderBack ? (
                                    <TouchableOpacity
                                        onPress={handleBack}
                                        activeOpacity={0.8}
                                        className="h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5]"
                                        accessibilityLabel="Go back to previous step"
                                        accessibilityRole="button"
                                    >
                                        <HugeiconsIcon
                                            icon={ArrowLeft02Icon}
                                            size={24}
                                            color="#171717"
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <View className="h-14 w-14" />
                                )}

                                <View className="pointer-events-none absolute inset-x-0 items-center">
                                    <ProgressDots
                                        totalSteps={totalSteps}
                                        currentStep={currentStepIndex}
                                    />
                                </View>

                                <View className="min-w-[56px] items-end">
                                    {showSkip ? (
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
                                    ) : (
                                        <View className="h-14 w-14" />
                                    )}
                                </View>
                            </View>
                        </Animated.View>
                    ),
                }}
            />

            <View className="flex-1 w-full">{renderStep()}</View>

            {showContinueButton && (
                <View className="w-full border-t border-gray-200 px-6 pt-8 items-center justify-center">
                    <View className="flex-row justify-center items-center">
                        <BeginButton
                            onPress={handleContinue}
                            name={loading ? "Setting up..." : ctaLabel}
                            disabled={!canContinue || loading}
                            showIcon={true}
                            activeOpacity={0.8}
                        />
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
