import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Text } from "@/components/ui/text";
import JourneyCatalogContainer from "@/app/tabs/screens/JourneyCatalogScreen/JourneyCatalogContainer";
import JourneyOnboardingScreen from "@/src/components/journey/JourneyOnboardingScreen";
import { useJourneyOnboarding } from "@/src/hooks/useJourneyOnboarding";
import { createLogger } from "@/src/lib/logger";
import JourneyMapContainer from "@/src/screens/JourneyMapScreen/JourneyMapContainer";
import type { SectionViewMode } from "@/src/types/journey/sectionMap";
import { JourneyLoadingSkeleton } from "@/src/components/journey";

const log = createLogger("JourneysTab");

export default function JourneysTab(): React.JSX.Element {
  return <JourneyMapContainer />;
}
