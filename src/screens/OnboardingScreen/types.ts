export type OnboardingStepName =
  | "welcome"
  | "mascot_greeting"
  | "quiz_motivation"
  | "quiz_stress_level"
  | "quiz_experience"
  | "quiz_timing"
  | "daily_goal"
  | "pact_signing"
  | "building_journey"
  | "plan_reveal"
  | "journey_step_preview"
  | "mood_check_lesson"
  | "ai_insight"
  | "lesson_complete"
  | "cbt_step_preview"
  | "notification_permission"
  | "journey_map"
  | "letter_from_future"
  | "soft_paywall"
  | "welcome_to_happy";

export type OnboardingStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type MotivationAnswer =
  | "anxiety"
  | "mood"
  | "stress"
  | "self_understanding"
  | "sleep";
export type StressLevel = "light" | "moderate" | "heavy" | "overwhelming";
export type JournalExperience = "never" | "tried_quit" | "active";
export type StressTiming = "morning" | "afternoon" | "evening" | "night";
export type DailyGoalMinutes = 3 | 5 | 10 | 15;
export type FeelingEmoji =
  | "calm"
  | "anxious"
  | "happy"
  | "sad"
  | "angry"
  | "hopeful"
  | "tired"
  | "grateful";
export type PricingTier = "weekly" | "annual" | "monthly";
export type NotificationTime = "morning" | "afternoon" | "evening";

export interface OnboardingFormData {
  motivation?: MotivationAnswer;
  stressLevel?: StressLevel;
  journalExperience?: JournalExperience;
  stressTiming?: StressTiming;
  dailyGoal: DailyGoalMinutes;
  pactSigned: boolean;
  selectedFeeling?: FeelingEmoji;
  notificationTime?: NotificationTime;
  notificationPermissionGranted: boolean;
  selectedPricingTier?: PricingTier;
  trialStarted: boolean;
}

export interface OnboardingStepConfig {
  name: OnboardingStepName;
  stage: OnboardingStage;
  backgroundColor: string;
  showBackButton: boolean;
  showContinueButton: boolean;
  continueButtonLabel: string;
  autoAdvance: boolean;
  canSkip: boolean;
  analyticsLabel: string;
  isContinueEnabled?: (formData: OnboardingFormData) => boolean;
}

export interface QuizOption<T extends string> {
  id: T;
  emoji: string;
  title: string;
  subtitle: string;
}

export interface GoalCardConfig {
  minutes: DailyGoalMinutes;
  displayLabel?: string;
  tag: string;
  tagVariant: "casual" | "recommended" | "committed" | "serious";
  description: string;
}

export interface LoadingTask {
  id: string;
  label: string;
  durationMs: number;
}

export interface PricingPlanConfig {
  tier: PricingTier;
  label: string;
  price: string;
  perUnit: string;
  featured: boolean;
  headline?: string;
  badge?: string;
  savings?: string;
  comparisonPrice?: string;
  detailLabel?: string;
  detailPrefix?: string;
  detailEmphasis?: string;
  detailSuffix?: string;
  isDecoy?: boolean;
}

export type JourneyNodeStatus = "completed" | "current" | "locked";

export interface JourneyMapNode {
  id: string;
  emoji: string;
  label: string;
  subtitle: string;
  status: JourneyNodeStatus;
}

export interface FeelingOption {
  id: FeelingEmoji;
  emoji: string;
  label: string;
}

export type MochiExpression =
  | "happy"
  | "waving"
  | "concentrating"
  | "celebrating"
  | "peaceful"
  | "notes";

export interface OnboardingChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  route: string;
  xpReward: number;
}
