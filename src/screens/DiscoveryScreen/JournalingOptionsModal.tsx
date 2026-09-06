import React from "react";
import { JournalingOptionsModalView } from "./components/JournalingOptionsModalView";
import { useJournalingOptionsViewModel } from "./hooks/useJournalingOptionsViewModel";

export interface JournalingOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  allPrompts: string[];
  currentPrompt: string;
  onScanJournal?: () => void;
}

// ponytail: thin container component delegating options logic to hook and rendering pure JournalingOptionsModalView
export const JournalingOptionsModal: React.FC<JournalingOptionsModalProps> = React.memo(
  ({
    visible,
    onClose,
    onSelectPrompt,
    allPrompts,
    currentPrompt,
    onScanJournal,
  }) => {
    const { displayPrompts, selectedPrompt, handleSelectPrompt, handleScanJournal } =
      useJournalingOptionsViewModel({
        allPrompts,
        currentPrompt,
        onClose,
        onSelectPrompt,
        onScanJournal,
      });

    return (
      <JournalingOptionsModalView
        visible={visible}
        onClose={onClose}
        currentPrompt={selectedPrompt}
        displayPrompts={displayPrompts}
        onSelectPrompt={handleSelectPrompt}
        onScanJournal={handleScanJournal}
      />
    );
  }
);

JournalingOptionsModal.displayName = "JournalingOptionsModal";
export default JournalingOptionsModal;
