// ponytail: reminder preset selection state
import { useState, useCallback } from 'react';
import { ReminderPreset } from '../../../domain/enums';

export interface UseReminderSelectionReturn {
  activeTime: string | null;
  isSet: boolean;
  selectPreset: (preset: ReminderPreset) => void;
  resetSelection: () => void;
}

export function useReminderSelection(
  onSelect: (preset: ReminderPreset) => void
): UseReminderSelectionReturn {
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const [isSet, setIsSet] = useState<boolean>(false);

  const selectPreset = useCallback(
    (preset: ReminderPreset): void => {
      setActiveTime(preset);
      setIsSet(true);
      onSelect(preset);
    },
    [onSelect]
  );

  const resetSelection = useCallback((): void => {
    setIsSet(false);
  }, []);

  return { activeTime, isSet, selectPreset, resetSelection };
}
