/**
 * Dynamic journey map route: /tabs/screens/journey/[slug]
 * Renders the journey map for a specific mental health journey.
 */

import React from "react";
import { useLocalSearchParams } from "expo-router";
import JourneyMapContainer from "@/src/domains/journey/ui/JourneyMapContainer";

export default function JourneyMapRoute(): React.JSX.Element {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  return <JourneyMapContainer slug={slug} />;
}
