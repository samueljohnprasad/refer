// ponytail: bridge to notification-reminders helper
import {
  ensureNotificationPermissions,
  scheduleDailyReminder,
  saveRemindersConfig,
  type RemindersConfig,
} from '@/src/components/lib/notification-reminders';

export async function scheduleOnboardingReminder(timeStr: string): Promise<boolean> {
  try {
    const granted = await ensureNotificationPermissions();
    if (!granted) return false;

    const isMorning = timeStr.includes('8:00 AM');
    const hour = isMorning ? 8 : 20;

    const cfg: RemindersConfig = {
      daily_thought_catch: {
        enabled: true,
        hour,
        minute: 0,
        title: 'Happy',
        body: 'Ready to catch one more thought? 2 minutes.',
      },
    };

    await scheduleDailyReminder(
      'daily_thought_catch',
      'Happy',
      { hour, minute: 0 },
      'Ready to catch one more thought? 2 minutes.'
    );
    await saveRemindersConfig(cfg);
    return true;
  } catch {
    return false;
  }
}
