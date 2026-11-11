// ponytail: coordinate guest storage, push reminder, and supabase profile completion
import { supabase } from '@/src/network/auth/supabase';
import { updateUserStreak } from '@/src/lib/api/mentalHealthJourneyApi';
import { saveLocalReflection } from './onboardingStorage';
import { scheduleOnboardingReminder } from './notificationScheduler';
import type { ReflectionData } from '../domain/types';

export async function completeOnboarding(
  userId: string | undefined,
  reflection: ReflectionData
): Promise<void> {
  await saveLocalReflection(reflection);

  if (reflection.reminder) {
    await scheduleOnboardingReminder(reflection.reminder);
  }

  if (userId) {
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId);
      await updateUserStreak();
    } catch {
      // ponytail: proceed in guest mode if supabase fails
    }
  }
}
