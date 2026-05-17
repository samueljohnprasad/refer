import type { IconSvgElement } from "@hugeicons/react-native";
import type { HappyAssistantCommand } from "@/src/store/slices/happyAssistantSlice";

export enum HappyAssistantActionIdEnum {
  SaveProgress = "save_progress",
  SavePremiumProfile = "save_premium_profile",
  ResumeOrBreathing = "resume_or_breathing",
  ResumeExercise = "resume_exercise",
  TryOneMinuteBreathing = "try_1min_breathing",
  TryBreathing = "try_breathing",
  CalmMeDown = "calm_me_down",
  ThoughtCatcher = "thought_catcher",
  ViewExerciseLog = "view_exercise_log",
  VoiceJournal = "voice_journal",
  KeyboardJournal = "keyboard_journal",
  MoodCheck = "mood_check",
  AiInsight = "ai_insight",
  ContinueJourney = "continue_journey",
  RestorePurchases = "restore_purchases",
  Support = "support",
  OpenSettings = "open_settings",
}

export type HappyAssistantActionId = `${HappyAssistantActionIdEnum}`;

export type ResolvedHappyAssistantActionId = Exclude<
  HappyAssistantActionId,
  `${HappyAssistantActionIdEnum.ResumeOrBreathing}`
>;

export interface AssistantActionConfig {
  id: ResolvedHappyAssistantActionId;
  command: HappyAssistantCommand;
  label: string;
  description: string;
  icon: IconSvgElement;
  tint: string;
}

export type HappyAssistantActionDescriptor = AssistantActionConfig;

export enum HappyAssistantContextEnum {
  Exercises = "exercises",
  Journal = "journal",
  Record = "record",
  Journeys = "journeys",
  Settings = "settings",
  Default = "default",
}

export type HappyAssistantContext = `${HappyAssistantContextEnum}`;

export interface AssistantContextConfig {
  actionIds: readonly HappyAssistantActionId[];
}

export interface AssistantCopyConfig {
  title: string;
  subtitle: string;
}

export interface AssistantResolverInput {
  pathname: string | null;
  isAnonymous: boolean;
  hasPro: boolean;
  shouldPromptAccountClaim: boolean;
  hasProgress: boolean;
  latestIncompleteExerciseTitle?: string;
}

export interface AssistantResolverResult {
  title: string;
  subtitle: string;
  actions: HappyAssistantActionDescriptor[];
}
