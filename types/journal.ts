export interface ProgressCardProps {
  icon: string;
  value: string;
  label: string;
  accent: string;
}

export interface JournalEntry {
  marked: boolean;
  customStyles: {
    text: {
      color: string;
    };
  };
}

export interface JournalEntries {
  [date: string]: JournalEntry;
}

export type ModalType = 'add' | 'view';

export interface ModalState {
  open: boolean;
  date: string;
  modalType: ModalType;
}

export interface MoodEmojiMap {
  [date: string]: JSX.Element;
}
