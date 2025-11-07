import React, { useState } from "react";
import { useAtom } from "jotai";
import { keyboardJournalOpenAtom } from "./helpers";
import { defaultInsights, InsightsType } from "@/src/network/genAi";
import VoiceRecorderModal from "./VoiceRecorderModal";
import KeyboardJournalScreen from "./KeyboardJournalScreen";
import JournalEntryScreen from "../JournalEntryScreen/JournalEntryScreen";
import EmotionAnalysisLoadingScreen from "./EmotionAnalysisLoadingScreen";

const KeyboardJournalModalWrapper: React.FC = () => {
  const [journalOpen, setJournalOpen] = useAtom(keyboardJournalOpenAtom);
  const [stepper, setStepper] = useState(0);
  const [journalText, setJournalText] = useState<string>("");
  const [insights, setInsights] = useState<InsightsType>(defaultInsights);

  const onClose = () => {
    setJournalOpen(false);
    setStepper(0);
    setJournalText("");
    setInsights(defaultInsights);
  };

  return (
    <VoiceRecorderModal visible={journalOpen} onRequestClose={onClose}>
      {stepper === 0 && (
        <KeyboardJournalScreen
          onSubmit={(text) => {
            setJournalText(text);
            setStepper(1);
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
      {stepper === 2 && <JournalEntryScreen insights={insights} />}
    </VoiceRecorderModal>
  );
};

export default KeyboardJournalModalWrapper;
