import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";

export interface SectionOverviewSheetProps {
  sections: SectionOverviewItem[];
  onPreviewSection: (sectionId: string) => void;
  onClose: () => void;
  journeyTitle: string;
}

export function useSectionOverviewViewModel({
  sections,
  onPreviewSection,
  onClose,
  journeyTitle,
}: SectionOverviewSheetProps) {
  const insets = useSafeAreaInsets();

  const handlePreviewAndClose = useCallback(
    (sectionId: string): void => {
      onPreviewSection(sectionId);
      onClose();
    },
    [onPreviewSection, onClose],
  );

  return {
    insets,
    handlePreviewAndClose,
    sections,
    onClose,
    journeyTitle,
  };
}
