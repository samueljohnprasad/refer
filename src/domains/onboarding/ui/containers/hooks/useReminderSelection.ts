// ponytail: reminder preset selection + the one native permission prompt, fired only after a time is tapped
import { useState, useCallback } from 'react';
import { ReminderPreset } from '../../../domain/enums';
import { scheduleOnboardingReminder } from '../../../data/notificationScheduler';

export type ReminderStatus = 'unset' | 'granted' | 'denied';

export interface UseReminderSelectionReturn {
  activeTime: string | null;
  status: ReminderStatus;
  selectPreset: (preset: ReminderPreset) => Promise<void>;
  resetSelection: () => void;
}

export function useReminderSelection(
  onSelect: (preset: ReminderPreset) => void,
): UseReminderSelectionReturn {
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const [status, setStatus] = useState<ReminderStatus>('unset');

  const selectPreset = useCallback(async (preset: ReminderPreset): Promise<void> => {
    setActiveTime(preset);
    onSelect(preset);
    const granted = await scheduleOnboardingReminder(preset);
    setStatus(granted ? 'granted' : 'denied');
  }, [onSelect]);

  const resetSelection = useCallback((): void => {
    setStatus('unset');
  }, []);

  return { activeTime, status, selectPreset, resetSelection };
}
