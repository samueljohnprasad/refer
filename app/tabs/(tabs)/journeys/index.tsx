import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Text } from "@/components/ui/text";
import JourneyCatalogContainer from "@/app/tabs/screens/JourneyCatalogScreen/JourneyCatalogContainer";
import JourneyOnboardingScreen from "@/src/components/journey/JourneyOnboardingScreen";
import { JourneyConfigProvider } from "@/src/context/JourneyConfigContext";
import { useJourneyOnboarding } from "@/src/hooks/useJourneyOnboarding";
import { useMultiJourney } from "@/src/hooks/useMultiJourney";
import { createLogger } from "@/src/lib/logger";
import JourneyMapContainer from "@/src/screens/JourneyMapScreen/JourneyMapContainer";
import type { SectionViewMode } from "@/src/types/journey/sectionMap";

const log = createLogger("JourneysTab");

export default function JourneysTab(): React.JSX.Element {
    const routeParams = useLocalSearchParams<{
        slug?: string;
        mode?: SectionViewMode;
        view?: "catalog";
    }>();
    const routeSlug: string | null = routeParams.slug ?? null;
    const routeMode: SectionViewMode | null = routeParams.mode ?? null;
    const routeView: "catalog" | null = routeParams.view === "catalog"
        ? "catalog"
        : null;
    const [showCatalog, setShowCatalog] = React.useState<boolean>(false);
    const {
        hasEnrollments,
        activeSlug,
        enrollments,
        isLoading: isLoadingEnrollments,
    } = useMultiJourney();
    const hasAnyEnrollmentHistory: boolean = enrollments.length > 0;
    const {
        questions,
        hasCompletedOnboarding,
        isCheckingStatus,
        isEnrolling,
        handleQuizComplete,
        handleSkip,
    } = useJourneyOnboarding();

    const handleBrowseAll = React.useCallback(async (): Promise<void> => {
        log.info("Browse all requested from onboarding");
        await handleSkip();
        setShowCatalog(true);
    }, [handleSkip]);

    React.useEffect(() => {
        const branch = isLoadingEnrollments || isCheckingStatus
            ? "loading"
            : routeSlug && routeMode === "completed"
                ? "completed-map"
            : routeView === "catalog"
                ? "catalog-route"
            : hasEnrollments
                ? "enrolled-map"
                : showCatalog
                    ? "catalog"
                    : hasCompletedOnboarding && activeSlug && !hasAnyEnrollmentHistory
                        ? "preview-map"
                        : hasCompletedOnboarding
                            ? "catalog-after-onboarding"
                            : "onboarding";

        log.info("Journeys tab branch resolved", {
            branch,
            hasEnrollments,
            hasAnyEnrollmentHistory,
            activeSlug,
            routeSlug,
            routeMode,
            routeView,
            isLoadingEnrollments,
            isCheckingStatus,
            hasCompletedOnboarding,
            showCatalog,
            isEnrolling,
        });
    }, [
        activeSlug,
        hasCompletedOnboarding,
        hasAnyEnrollmentHistory,
        hasEnrollments,
        isCheckingStatus,
        isEnrolling,
        isLoadingEnrollments,
        showCatalog,
        routeMode,
        routeSlug,
        routeView,
    ]);

    if (isLoadingEnrollments || isCheckingStatus) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#7B61FF" />
                <Text className="mt-3 text-sm text-gray-400">
                    Loading your journeys...
                </Text>
            </View>
        );
    }

    if (routeSlug && routeMode === "completed") {
        return (
            <JourneyConfigProvider>
                <JourneyMapContainer
                    slugOverride={routeSlug}
                    modeOverride="completed"
                />
            </JourneyConfigProvider>
        );
    }

    if (routeView === "catalog") {
        return <JourneyCatalogContainer />;
    }

    if (hasEnrollments) {
        return (
            <JourneyConfigProvider>
                <JourneyMapContainer
                    slugOverride={activeSlug ?? undefined}
                    modeOverride="active"
                />
            </JourneyConfigProvider>
        );
    }

    if (showCatalog) {
        return <JourneyCatalogContainer />;
    }

    if (hasCompletedOnboarding && activeSlug && !hasAnyEnrollmentHistory) {
        return (
            <JourneyConfigProvider>
                <JourneyMapContainer
                    slugOverride={activeSlug}
                    modeOverride="preview"
                />
            </JourneyConfigProvider>
        );
    }

    if (hasCompletedOnboarding) {
        return <JourneyCatalogContainer />;
    }

    return (
        <JourneyOnboardingScreen
            questions={questions}
            onQuizComplete={handleQuizComplete}
            onSkip={handleBrowseAll}
            isEnrolling={isEnrolling}
        />
    );
}
