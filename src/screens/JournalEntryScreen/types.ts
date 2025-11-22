import { JournalEntry } from "@/hooks/data/types";
import { InsightsType, FeelingsType } from "@/src/network/genAi";

export interface JournalEntryScreenProps {
  insights?: JournalEntry;
  onClose?: () => void;
}

export interface TagItemProps {
  tag: FeelingsType;
  index: number;
  isEditing: boolean;
  colorScheme: "light" | "dark" | null | undefined;
  onRemove: (index: number) => void;
}

export interface EmojiSelectorProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
}

export interface JournalHeaderProps {
  isEditing: boolean;
  formattedDateTime: string;
  colorScheme: "light" | "dark" | null | undefined;
  onClose: () => void;
  onEdit: () => void;
  onDone: () => void;
  backIconStyle: Record<string, unknown>;
  closeIconStyle: Record<string, unknown>;
}

export interface MoodCardProps {
  selectedEmoji: string;
  title: string;
  isEditing: boolean;
  onSelectEmoji: (emoji: string) => void;
  moodCardStyle: Record<string, unknown>;
  singleEmojiStyle: Record<string, unknown>;
  summaryStyle: Record<string, unknown>;
  emojiRowStyle: Record<string, unknown>;
}

export interface TagsListProps {
  tags: FeelingsType[];
  isEditing: boolean;
  colorScheme: "light" | "dark" | null | undefined;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export interface JournalContentProps {
  isEditing: boolean;
  journalText: string;
  onTextChange: (text: string) => void;
}

export interface AIInsightsSectionProps {
  aiInsights: string;
  colorScheme: "light" | "dark" | null | undefined;
}

export interface SaveButtonProps {
  saving: boolean;
  keyboardHeight: number;
  bottomInset: number;
  onSave: () => Promise<void>;
  onLayout: (height: number) => void;
}

export interface BackupState {
  tags: FeelingsType[];
  journalText: string;
}
