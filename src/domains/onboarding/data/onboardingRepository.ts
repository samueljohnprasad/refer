// ponytail: coordinate guest storage, push reminder, and supabase profile completion
import { supabase } from '@/src/network/auth/supabase';
import { updateUserStreak } from '@/src/lib/api/mentalHealthJourneyApi';
import { saveLocalReflection } from './onboardingStorage';
import { upsertReflection } from '@/src/domains/home/data/reflectionsStorage';
import type { ReflectionData } from '../domain/types';

// ponytail: the reminder itself is scheduled immediately when a time is tapped in the saved card
// (useReminderSelection), matching .agents/onboarding.html's "native prompt only after a time chip is
// tapped" rule — not re-scheduled here on Finish.
export async function completeOnboarding(
  userId: string | undefined,
  reflection: ReflectionData
): Promise<void> {
  await saveLocalReflection(reflection);
  await upsertReflection(reflection);

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
