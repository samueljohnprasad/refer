import React from "react";
import { ActivityIndicator, View } from "react-native";

import { Text } from "@/components/ui/text";
import JourneyCatalogContainer from "@/app/tabs/screens/JourneyCatalogScreen/JourneyCatalogContainer";
import JourneyOnboardingScreen from "@/src/components/journey/JourneyOnboardingScreen";
import { JourneyConfigProvider } from "@/src/context/JourneyConfigContext";
import { useJourneyOnboarding } from "@/src/hooks/useJourneyOnboarding";
import { useMultiJourney } from "@/src/hooks/useMultiJourney";
import JourneyMapContainer from "@/src/screens/JourneyMapScreen/JourneyMapContainer";

export default function JourneysTab(): React.JSX.Element {
    const [showCatalog, setShowCatalog] = React.useState<boolean>(false);
    const {
        hasEnrollments,
        activeSlug,
        isLoading: isLoadingEnrollments,
    } = useMultiJourney();
    const {
        questions,
        isCheckingStatus,
        isEnrolling,
        handleQuizComplete,
        handleSkip,
    } = useJourneyOnboarding();

    const handleBrowseAll = React.useCallback(async (): Promise<void> => {
        await handleSkip();
        setShowCatalog(true);
    }, [handleSkip]);

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

    if (hasEnrollments) {
        return (
            <JourneyConfigProvider>
                <JourneyMapContainer slugOverride={activeSlug ?? undefined} />
            </JourneyConfigProvider>
        );
    }

    if (showCatalog) {
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
