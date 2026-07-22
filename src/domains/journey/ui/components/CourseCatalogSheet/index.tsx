import React from "react";
import { useCourseCatalogViewModel, type CourseCatalogSheetProps } from "../../hooks/useCourseCatalogViewModel";
import { CourseCatalogView } from "./CourseCatalogView";

/**
 * Container component for CourseCatalogSheet.
 * Handles API queries, mutations, insets, and list behavior via useCourseCatalogViewModel.
 * Passes pure data model and actions to CourseCatalogView.
 */
export default function CourseCatalogSheet(
  props: CourseCatalogSheetProps,
): React.JSX.Element | null {
  const { model, actions } = useCourseCatalogViewModel(props);
  return <CourseCatalogView model={model} actions={actions} />;
}

export * from "../../hooks/useCourseCatalogViewModel";
export * from "./CourseCatalogView";
