import React from 'react';
import JournalEntryView from './JournalEntryView';
import { useJournalEntry } from '@/hooks/useJournalEntry';

const JournalEntryContainer: React.FC = () => {
  const {
    moods,
    selectedMood,
    setSelectedMood,
    currentPrompt,
    shufflePrompt,
    currentRecommendation,
    badges,
  } = useJournalEntry();

  return (
    <JournalEntryView
      moods={moods}
      selectedMood={selectedMood}
      setSelectedMood={setSelectedMood}
      currentPrompt={currentPrompt}
      shufflePrompt={shufflePrompt}
      currentRecommendation={currentRecommendation}
      badges={badges}
    />
  );
};

export default JournalEntryContainer;
