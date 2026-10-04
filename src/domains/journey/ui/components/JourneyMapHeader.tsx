import React from "react";
import { useTranslation } from "react-i18next";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "@/src/components/tw";
import { HomeMainButton } from "./home-main-button";
import { DuolingoHeader } from "./DuolingoHeader";
import type { JourneyMapActions, JourneyMapViewModel } from "../hooks/useJourneyMapViewModel";

export interface JourneyMapHeaderProps {
  model: JourneyMapViewModel;
  actions: JourneyMapActions;
  isOnboarding?: boolean;
}

export function JourneyMapHeader({
  model,
  actions,
  isOnboarding,
}: JourneyMapHeaderProps): React.JSX.Element {
  const { t } = useTranslation("journeys");
  const { headerState } = model.controller;
  const unitLabel = resolveUnitLabel(headerState.label);
  const unitTitle = headerState.title === "The Mechanism"
    ? t("unitTitles.theMechanism")
    : headerState.title === "Select a section"
      ? t("selectSection")
      : headerState.title;

  function resolveUnitLabel(label: string): string {
    if (label === "Journey") return t("journeyLabel");
    if (label === "Select a section") return t("selectSection");

    const sectionUnit = label.match(/^Section (\d+) • Unit (\d+)$/);
    if (sectionUnit) {
      return t("sectionUnitLabel", { section: sectionUnit[1], unit: sectionUnit[2] });
    }

    const section = label.match(/^Section (\d+)$/);
    return section ? t("sectionLabel", { section: section[1] }) : label;
  }

  return (
    <GlassView
      glassEffectStyle="regular"
      style={{
        paddingBottom: 16,
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowColor: "transparent",
        overflow: "hidden",
      }}
    >
      <SafeAreaView edges={["top"]}>
        {!isOnboarding && (
          <DuolingoHeader
            stats={model.userStats}
            enrolledCourses={model.enrolledCourses}
            activeCourseId={model.courseId}
            activeCourseSummary={model.activeCourseSummary}
            onAddCoursePress={actions.onAddCoursePress}
            onCourseSelect={actions.setActiveCourseId}
          />
        )}
        <HomeMainButton
          onPress={model.controller.handleOpenSections}
          unitLabel={unitLabel}
          unitTitle={unitTitle}
          faceColor={headerState.faceColor}
          rimColor={headerState.rimColor}
          unitIconKey={headerState.iconKey}
        />
      </SafeAreaView>
    </GlassView>
  );
}

export default JourneyMapHeader;
