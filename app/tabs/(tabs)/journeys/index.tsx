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
import { useEnrolledCoursesQuery } from "@/src/hooks/useEnrolledCoursesQuery";
import { JourneyLoadingSkeleton } from "@/src/components/journey";

const log = createLogger("JourneysTab");

export default function JourneysTab(): React.JSX.Element {
    const {
        data: enrolledCourses,
        isLoading: isLoadingCourses,
        error: coursesError,
    } = useEnrolledCoursesQuery();

    if (!enrolledCourses) {
        return <JourneyLoadingSkeleton />;
    }

    if (isLoadingCourses) {
        return <JourneyLoadingSkeleton />;
    }

    return (
        <JourneyConfigProvider>
            <JourneyMapContainer
                slugOverride={enrolledCourses?.activeSlug ?? undefined}
                modeOverride="active"
            />
        </JourneyConfigProvider>
    );
}
