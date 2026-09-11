import React from "react";
import { useLocalSearchParams } from "expo-router";
import JourneyMapScreen from "@/src/domains/journey/ui/JourneyMapContainer";

export default function JourneyMapRoute(): React.JSX.Element {
  const { courseId, slug, completedNodeId } = useLocalSearchParams<{
    courseId?: string;
    slug?: string;
    completedNodeId?: string;
  }>();
  return <JourneyMapScreen courseId={courseId} slug={slug} completedNodeId={completedNodeId} />;
}
