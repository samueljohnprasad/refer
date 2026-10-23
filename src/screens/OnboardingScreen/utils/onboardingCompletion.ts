// ponytail: isolated final onboarding completion helper — saves streak, xp, reminders & user status
import { updateUserStreak } from "@/src/lib/api/mentalHealthJourneyApi";
import { XPActionType } from "@/src/types/xp";
import { buildReminderConfig } from "./reminderConfig";
import type { RemindersConfig } from "@/src/components/lib/notification-reminders";
import type { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import type { OnboardingFormData } from "../types";
import type { useXP } from "@/src/context/XPContext";

export interface CompleteOnboardingParams {
  remindersCfg: RemindersConfig;
  formData: OnboardingFormData;
  markCompleted: ReturnType<typeof useCompleteOnboarding>["markCompleted"];
  xp: ReturnType<typeof useXP>;
  xpDescription: string;
}

export async function completeOnboardingUser({
  remindersCfg,
  formData,
  markCompleted,
  xp,
  xpDescription,
}: CompleteOnboardingParams): Promise<void> {
  const finalCfg: RemindersConfig =
    Object.keys(remindersCfg).length > 0
      ? remindersCfg
      : buildReminderConfig(formData.notificationTime);
  const hasAnyEnabled = Object.values(finalCfg).some((c) => Boolean(c?.enabled));

  await markCompleted({
    name: "",
    reasons: formData.motivation ? [formData.motivation] : [],
    cfg: finalCfg,
    reminderEnabled: hasAnyEnabled,
    motivation: formData.motivation,
  });

  await updateUserStreak();
  await xp?.awardXP(XPActionType.EXERCISE_COMPLETE, {
    customAmount: 15,
    customDescription: xpDescription,
  });
}
