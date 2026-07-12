import type { ExerciseType } from "@/src/types/exerciseFlow";

export const ASSISTANT_BUTTON_SIZE = 54;
export const ASSISTANT_BUTTON_INNER_SIZE = 44;
export const ASSISTANT_EDGE_MARGIN = 12;
export const ASSISTANT_BOTTOM_CLEARANCE = 112;
export const ASSISTANT_TAP_DISTANCE = 6;

export const COMPLETE_EXERCISE_STATUSES = new Set([
  "completed",
  "summary",
  "checker_completed",
]);

export const HAPPY_ASSISTANT_ROUTES = {
  record: "/tabs/(tabs)/record",
  journal: "/tabs/(tabs)/journal",
  exercisesLog: "/tabs/(tabs)/exercises?tab=log",
  journeys: "/tabs/(tabs)/journeys",
  settings: "/tabs/screens/settings",
  support: "/tabs/screens/support-chat",
  breathingExercise:
    "/tabs/screens/exercise-flow?type=mindful_breathing_1min",
  thoughtCatcherExercise:
    "/tabs/screens/exercise-flow?type=thought_catcher",
} as const;

export function shouldHideAssistant(pathname: string | null): boolean {
  const path = pathname ?? "";

  return (
    path === "/" ||
    path.includes("onboarding") ||
    path.includes("onboard-container") ||
    path.includes("premium-onboarding") ||
    path.includes("paywall") ||
    path.includes("purchase") ||
    path.includes("summary") ||
    path.includes("Summary") ||
    path.includes("reminders") ||
    path.includes("support-chat")
  );
}

export function buildExerciseFlowRoute(
  type: ExerciseType,
  options?: { entryId?: string; readOnly?: boolean },
): string {
  const params = [`type=${encodeURIComponent(type)}`];

  if (options?.entryId) {
    params.push(`entryId=${encodeURIComponent(options.entryId)}`);
  }

  if (options?.readOnly) {
    params.push("readOnly=true");
  }

  return `/tabs/screens/exercise-flow?${params.join("&")}`;
}
