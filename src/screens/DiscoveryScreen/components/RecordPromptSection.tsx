import React from "react";
import { RecordPromptSectionView } from "./RecordPromptSectionView";
import { useRecordPromptSectionViewModel } from "../hooks/useRecordPromptSectionViewModel";

export interface RecordPromptSectionProps {
  selectedDate: Date;
  onDatePress: () => void;
  onTodayPress: () => void;
  prompt: string;
  onShufflePrompt: () => void;
  onOpenOptions: () => void;
}

// ponytail: thin container component delegating prompt section state to ViewModel hook and rendering presentational view
export const RecordPromptSection: React.FC<RecordPromptSectionProps> = React.memo(
  (props) => {
    const viewModel = useRecordPromptSectionViewModel(props);
    return <RecordPromptSectionView {...viewModel} />;
  }
);

RecordPromptSection.displayName = "RecordPromptSection";
export default RecordPromptSection;
