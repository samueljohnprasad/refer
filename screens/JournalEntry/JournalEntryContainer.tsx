import React from "react";
import JournalEntryView from "./JournalEntryView";
import { useJournalEntry } from "@/hooks/useJournalEntry";

const JournalEntryContainer: React.FC = () => {
  const {
    moods,
    selectedMood,
    setSelectedMood,
    currentRecommendation,
  } = useJournalEntry();

  return (
    <JournalEntryView
      moods={moods}
      selectedMood={selectedMood}
      setSelectedMood={setSelectedMood}
      currentRecommendation={currentRecommendation}
    />
  );
};

export default JournalEntryContainer;
