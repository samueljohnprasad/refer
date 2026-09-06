import React from "react";
import { ImageJournalModalView } from "./components/ImageJournalModalView";
import { useImageJournalScanner } from "./hooks/useImageJournalScanner";
import type { InsightsType } from "@/src/network/genAi";

export interface ImageJournalModalProps {
  visible: boolean;
  onClose: () => void;
  onInsightsReady: (insights: InsightsType, transcript: string) => void;
  selectedDate: Date;
}

// ponytail: thin container component delegating scanner logic to hook and rendering pure ImageJournalModalView
export const ImageJournalModal: React.FC<ImageJournalModalProps> = React.memo(
  ({ visible, onClose, onInsightsReady }) => {
    const scanner = useImageJournalScanner({ onClose, onInsightsReady });

    return <ImageJournalModalView visible={visible} {...scanner} />;
  }
);

ImageJournalModal.displayName = "ImageJournalModal";
export default ImageJournalModal;
