import { JournalEntries, MoodEmojiMap } from "@/types/journal";
import Happy from "@/assets/Icons/Happy";
import Sad from "@/assets/Icons/Sad";
import Laugh from "@/assets/Icons/Laugh";
import Lost from "@/assets/Icons/Lost";
import Angry from "@/assets/Icons/Angry";
interface UseJournalDataReturn {
  journalEntries: JournalEntries;
  getMoodEmoji: (date: string) => JSX.Element | undefined;
}

export const useJournalData = (theme: any): UseJournalDataReturn => {
  // Sample journal entry data with mood indicators
  const journalEntries: JournalEntries = {
    "2025-07-21": {
      marked: true,
      customStyles: { text: { color: theme.particleSparkle } },
    },
    "2025-07-22": {
      marked: true,
      customStyles: { text: { color: theme.particleDot } },
    },
    "2025-07-23": {
      marked: true,
      customStyles: { text: { color: theme.particleSparkle } },
    },
  };

  // Mood emoji mapping
  const moodEmojiMap: MoodEmojiMap = {
    "2025-07-21": <Happy />,
    "2025-07-22": <Sad />,
    "2025-07-23": <Laugh />,
    "2025-07-24": <Lost />,
    "2025-07-25": <Angry />,
  };

  const getMoodEmoji = (date: string): JSX.Element | undefined => {
    return moodEmojiMap[date];
  };

  return {
    journalEntries,
    getMoodEmoji,
  };
};
