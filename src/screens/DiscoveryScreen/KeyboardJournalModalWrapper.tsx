import React, { useState } from "react";
import { useAtom } from "jotai";
import { keyboardJournalOpenAtom } from "./helpers";
import { defaultInsights, InsightsType } from "@/src/network/genAi";
import VoiceRecorderModal from "./VoiceRecorderModal";
import KeyboardJournalScreen from "./KeyboardJournalScreen";
import JournalEntryScreen from "../JournalEntryScreen/JournalEntryScreen";
import EmotionAnalysisLoadingScreen from "./EmotionAnalysisLoadingScreen";

type KeyboardJournalModalWrapperProps = {
  selectedDate?: Date;
};

const KeyboardJournalModalWrapper: React.FC<KeyboardJournalModalWrapperProps> = ({
  selectedDate,
}) => {
  const [journalOpen, setJournalOpen] = useAtom(keyboardJournalOpenAtom);
  const [stepper, setStepper] = useState(0);
  const [journalText, setJournalText] = useState<string>("");
  const [transcripts, setTranscripts] = useState<string[] | null>(null);
  const [insights, setInsights] = useState<InsightsType>(defaultInsights);
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Date>(selectedDate || new Date());

  const onClose = () => {
    setJournalOpen(false);
    setStepper(0);
    setJournalText("");
    setTranscripts(null);
    setInsights(defaultInsights);
  };

  return (
    <VoiceRecorderModal visible={journalOpen} onRequestClose={onClose}>
      {stepper === 0 && (
        <KeyboardJournalScreen
          selectedDate={currentSelectedDate}
          onDateChange={(date) => setCurrentSelectedDate(date)}
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
          selectedDate={currentSelectedDate}
          onAnalysisCompleted={({ transcripts, insights }) => {
            setTranscripts(transcripts);
            setInsights(insights);
            setStepper(2);
          }}
        />
      )}
      {stepper === 2 && (
        <JournalEntryScreen
          insights={insights}
          transcripts={transcripts || []}
          selectedDate={currentSelectedDate}
        />
      )}
    </VoiceRecorderModal>
  );
};

export default KeyboardJournalModalWrapper;
