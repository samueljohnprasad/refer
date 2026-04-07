/**
 * Journeys Tab — Unified Entry Point
 *
 * Routing logic (in priority order):
 * 1. Loading → spinner
 * 2. Has enrollments → Journey Map (active journey)
 * 3. New user (never completed onboarding) → Onboarding quiz
 * 4. Skipped/completed onboarding but 0 enrollments → Journey Catalog
 *
 * Transitions between states use a fade animation for polish.
 * This replaces the old split between "Journeys" (catalog) and "Learn" (map) tabs.
 */

import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";

import { useMultiJourney } from "@/src/hooks/useMultiJourney";
import { useJourneyOnboarding } from "@/src/hooks/useJourneyOnboarding";
import { JourneyConfigProvider } from "@/src/context/JourneyConfigContext";
import AnimatedScreenTransition from "@/src/components/journey/AnimatedScreenTransition";

const JourneyCatalogScreen = lazy(
    () =>
        import("@/app/tabs/screens/JourneyCatalogScreen/JourneyCatalogContainer"),
);

const JourneyMapContainer = lazy(
    () => import("@/src/screens/JourneyMapScreen/JourneyMapContainer"),
);

const JourneyOnboardingScreen = lazy(
    () => import("@/src/components/journey/JourneyOnboardingScreen"),
);

export default function JourneysTab(): React.JSX.Element {
    const {
        hasEnrollments,
        activeSlug,
        isLoading: isLoadingEnrollments,
    } = useMultiJourney();
    const {
        questions,
        hasCompletedOnboarding,
        isCheckingStatus,
        isEnrolling,
        handleQuizComplete,
        handleSkip,
    } = useJourneyOnboarding();

    // Derive a stable transition key so the fade re-triggers on state changes
    const transitionKey: string = useMemo((): string => {
        if (isLoadingEnrollments || isCheckingStatus) return "loading";
        if (hasEnrollments) return `map-${activeSlug ?? "default"}`;
        if (!hasCompletedOnboarding) return "onboarding";
        return "catalog";
    }, [
        isLoadingEnrollments,
        isCheckingStatus,
        hasEnrollments,
        activeSlug,
        hasCompletedOnboarding,
    ]);

    // Still hydrating enrollment + onboarding status
    if (isLoadingEnrollments || isCheckingStatus) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator
                    size="large"
                    color="#7B61FF"
                />
                <Text className="mt-3 text-sm text-gray-400">
                    Loading your journeys...
                </Text>
            </View>
        );
    }

    // User has enrollments → show journey map
    if (hasEnrollments) {
        return (
            <AnimatedScreenTransition transitionKey={transitionKey}>
                <SuspensLoader>
                    <JourneyConfigProvider>
                        <JourneyMapContainer />
                    </JourneyConfigProvider>
                </SuspensLoader>
            </AnimatedScreenTransition>
        );
    }

    // New user who hasn't completed or skipped onboarding → quiz
    if (!hasCompletedOnboarding) {
        return (
            <AnimatedScreenTransition transitionKey={transitionKey}>
                <SuspensLoader>
                    <JourneyOnboardingScreen
                        questions={questions}
                        onQuizComplete={handleQuizComplete}
                        onSkip={handleSkip}
                        isEnrolling={isEnrolling}
                    />
                </SuspensLoader>
            </AnimatedScreenTransition>
        );
    }

    // Onboarding done/skipped but 0 enrollments → full catalog
    return (
        <AnimatedScreenTransition transitionKey={transitionKey}>
            <SuspensLoader>
                <JourneyCatalogScreen />
            </SuspensLoader>
        </AnimatedScreenTransition>
    );
}
