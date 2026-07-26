import React from "react";
import MicControlView from "./MicControlView";
import { BottomSheet } from "@/components/ui/bottomsheet";

export interface MicControlProps {
  isRecording: boolean;
  isPaused: boolean;
  durationSeconds: number;
  onToggleRecord: () => void;
  onStop: () => void;
  onDiscard?: () => void;
  isStopped: boolean;
}

const MicControlContainer: React.FC<MicControlProps> = ({
  isRecording,
  isPaused,
  durationSeconds,
  onToggleRecord,
  onStop,
  onDiscard,
  isStopped,
}) => {
  return (
    <BottomSheet>
      <MicControlView
        isStopped={isStopped}
        isRecording={isRecording}
        isPaused={isPaused}
        durationSeconds={durationSeconds}
        onToggleRecord={onToggleRecord}
        onStop={onStop}
        onDiscard={onDiscard}
      />
    </BottomSheet>
  );
};

export default React.memo(MicControlContainer);
