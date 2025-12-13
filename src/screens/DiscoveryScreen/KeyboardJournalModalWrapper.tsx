import React, { useState } from "react";
import { useAtom } from "jotai";
import { keyboardJournalOpenAtom } from "./helpers";
import VoiceRecorderModal from "./VoiceRecorderModal";
import KeyboardJournalScreen from "./KeyboardJournalScreen";
import JournalEntryScreen from "../JournalEntryScreen/JournalEntryScreen";
import EmotionAnalysisLoadingScreen from "./EmotionAnalysisLoadingScreen";
import { JournalEntry } from "@/hooks/data/types";
import { useSaveJournal } from "@/hooks/post/useSaveJournal";
import { useSaveToast } from "@/hooks/useSaveToast";

const KeyboardJournalModalWrapper: React.FC = () => {
  const [journalOpen, setJournalOpen] = useAtom(keyboardJournalOpenAtom);
  const [stepper, setStepper] = useState(0);
  const [journalText, setJournalText] = useState<string>("");
  const [insights, setInsights] = useState<JournalEntry>();
  const { saveJournalQuick, saving } = useSaveJournal();
  const { showToast } = useSaveToast();

  const onClose = () => {
    setJournalOpen(false);
    setStepper(0);
    setJournalText("");
    setInsights(undefined);
  };

  return (
    <VoiceRecorderModal visible={journalOpen} onRequestClose={onClose}>
      {stepper === 0 && (
        <KeyboardJournalScreen
          onSubmit={async (text, enableAIInsights) => {
            setJournalText(text);
            if (!enableAIInsights) {
              try {
                await saveJournalQuick(text, { inputType: "typing" });
                showToast("success", "Journal saved successfully");
                onClose();
              } catch (error) {
                showToast("error", "Failed to save journal");
              }
            } else {
              setStepper(1);
            }
          }}
          onClose={onClose}
        />
      )}
      {stepper === 1 && (
        <EmotionAnalysisLoadingScreen
          journalText={journalText}
          onAnalysisCompleted={({ insights }) => {
            setInsights(insights);
            setStepper(2);
          }}
        />
      )}
      {stepper === 2 && (
        <JournalEntryScreen insights={insights} onClose={onClose} />
      )}
    </VoiceRecorderModal>
  );
};

export default KeyboardJournalModalWrapper;
