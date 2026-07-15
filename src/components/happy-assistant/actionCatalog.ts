import {
  AiBrain01Icon,
  ArrowReloadHorizontalIcon,
  Book02Icon,
  Brain01Icon,
  CustomerService01Icon,
  KeyboardIcon,
  MapsIcon,
  Mic01Icon,
  Notebook02Icon,
  Settings02Icon,
  SmileIcon,
  UserShield01Icon,
  Yoga02Icon,
} from "@hugeicons/core-free-icons";

import {
  HappyAssistantActionIdEnum,
  HappyAssistantContextEnum,
  type AssistantActionConfig,
  type AssistantContextConfig,
  type AssistantCopyConfig,
  type HappyAssistantContext,
  type ResolvedHappyAssistantActionId,
} from "./types";
import { HappyAssistantCommandEnum } from "@/src/store/slices/happyAssistantSlice";

export const ASSISTANT_ACTION_REGISTRY = {
  [HappyAssistantActionIdEnum.SaveProgress]: {
    id: HappyAssistantActionIdEnum.SaveProgress,
    command: HappyAssistantCommandEnum.OpenSaveProfile,
    label: "Save Progress",
    description: "Add a login so this progress is not lost.",
    icon: UserShield01Icon,
    tint: "#7C3AED",
  },
  [HappyAssistantActionIdEnum.SavePremiumProfile]: {
    id: HappyAssistantActionIdEnum.SavePremiumProfile,
    command: HappyAssistantCommandEnum.OpenSaveProfile,
    label: "Save Premium Profile",
    description: "Keep Premium and progress safe with Apple or Google.",
    icon: UserShield01Icon,
    tint: "#7C3AED",
  },
  [HappyAssistantActionIdEnum.ResumeExercise]: {
    id: HappyAssistantActionIdEnum.ResumeExercise,
    command: HappyAssistantCommandEnum.ResumeExercise,
    label: "Resume Exercise",
    description: "Continue where you left off.",
    icon: Notebook02Icon,
    tint: "#2563EB",
  },
  [HappyAssistantActionIdEnum.TryOneMinuteBreathing]: {
    id: HappyAssistantActionIdEnum.TryOneMinuteBreathing,
    command: HappyAssistantCommandEnum.TryBreathing,
    label: "Try 1-Min Breathing",
    description: "A quick reset when your mind feels busy.",
    icon: Yoga02Icon,
    tint: "#16A34A",
  },
  [HappyAssistantActionIdEnum.TryBreathing]: {
    id: HappyAssistantActionIdEnum.TryBreathing,
    command: HappyAssistantCommandEnum.TryBreathing,
    label: "Try Breathing",
    description: "Take one minute to settle your body.",
    icon: Yoga02Icon,
    tint: "#16A34A",
  },
  [HappyAssistantActionIdEnum.CalmMeDown]: {
    id: HappyAssistantActionIdEnum.CalmMeDown,
    command: HappyAssistantCommandEnum.TryBreathing,
    label: "Calm Me Down",
    description: "A tiny breathing reset before continuing.",
    icon: Yoga02Icon,
    tint: "#16A34A",
  },
  [HappyAssistantActionIdEnum.ThoughtCatcher]: {
    id: HappyAssistantActionIdEnum.ThoughtCatcher,
    command: HappyAssistantCommandEnum.ThoughtCatcher,
    label: "Thought Catcher",
    description: "Catch and untangle one anxious thought.",
    icon: Brain01Icon,
    tint: "#EA580C",
  },
  [HappyAssistantActionIdEnum.ViewExerciseLog]: {
    id: HappyAssistantActionIdEnum.ViewExerciseLog,
    command: HappyAssistantCommandEnum.ViewExerciseLog,
    label: "View Exercise Log",
    description: "See what you have completed so far.",
    icon: Book02Icon,
    tint: "#475569",
  },
  [HappyAssistantActionIdEnum.VoiceJournal]: {
    id: HappyAssistantActionIdEnum.VoiceJournal,
    command: HappyAssistantCommandEnum.VoiceJournal,
    label: "Voice Journal",
    description: "Start talking and turn it into a journal.",
    icon: Mic01Icon,
    tint: "#EF4444",
  },
  [HappyAssistantActionIdEnum.KeyboardJournal]: {
    id: HappyAssistantActionIdEnum.KeyboardJournal,
    command: HappyAssistantCommandEnum.KeyboardJournal,
    label: "Keyboard Journal",
    description: "Write a quick private note.",
    icon: KeyboardIcon,
    tint: "#2563EB",
  },
  [HappyAssistantActionIdEnum.MoodCheck]: {
    id: HappyAssistantActionIdEnum.MoodCheck,
    command: HappyAssistantCommandEnum.MoodCheck,
    label: "Mood Check",
    description: "Log how you feel in a few seconds.",
    icon: SmileIcon,
    tint: "#F59E0B",
  },
  [HappyAssistantActionIdEnum.AiInsight]: {
    id: HappyAssistantActionIdEnum.AiInsight,
    command: HappyAssistantCommandEnum.AiInsight,
    label: "AI Insight",
    description: "Open your weekly reflection summary.",
    icon: AiBrain01Icon,
    tint: "#7C3AED",
  },
  [HappyAssistantActionIdEnum.ContinueJourney]: {
    id: HappyAssistantActionIdEnum.ContinueJourney,
    command: HappyAssistantCommandEnum.ContinueJourney,
    label: "Continue Journey",
    description: "Jump back into your current path.",
    icon: MapsIcon,
    tint: "#2563EB",
  },
  [HappyAssistantActionIdEnum.RestorePurchases]: {
    id: HappyAssistantActionIdEnum.RestorePurchases,
    command: HappyAssistantCommandEnum.RestorePurchases,
    label: "Restore Purchases",
    description: "Refresh Premium from the App Store.",
    icon: ArrowReloadHorizontalIcon,
    tint: "#16A34A",
  },
  [HappyAssistantActionIdEnum.Support]: {
    id: HappyAssistantActionIdEnum.Support,
    command: HappyAssistantCommandEnum.Support,
    label: "Contact Support",
    description: "Get help with account or Premium issues.",
    icon: CustomerService01Icon,
    tint: "#2563EB",
  },
  [HappyAssistantActionIdEnum.OpenSettings]: {
    id: HappyAssistantActionIdEnum.OpenSettings,
    command: HappyAssistantCommandEnum.OpenSettings,
    label: "Open Settings",
    description: "Manage Premium, account, and support.",
    icon: Settings02Icon,
    tint: "#475569",
  },
} satisfies Record<ResolvedHappyAssistantActionId, AssistantActionConfig>;

export const ASSISTANT_CONTEXT_CONFIG = {
  [HappyAssistantContextEnum.Exercises]: {
    actionIds: [
      HappyAssistantActionIdEnum.ResumeOrBreathing,
      HappyAssistantActionIdEnum.ThoughtCatcher,
      HappyAssistantActionIdEnum.ViewExerciseLog,
    ],
  },
  [HappyAssistantContextEnum.Journal]: {
    actionIds: [
      HappyAssistantActionIdEnum.VoiceJournal,
      HappyAssistantActionIdEnum.MoodCheck,
      HappyAssistantActionIdEnum.AiInsight,
    ],
  },
  [HappyAssistantContextEnum.Record]: {
    actionIds: [
      HappyAssistantActionIdEnum.VoiceJournal,
      HappyAssistantActionIdEnum.KeyboardJournal,
      HappyAssistantActionIdEnum.MoodCheck,
    ],
  },
  [HappyAssistantContextEnum.Journeys]: {
    actionIds: [
      HappyAssistantActionIdEnum.ContinueJourney,
      HappyAssistantActionIdEnum.CalmMeDown,
      HappyAssistantActionIdEnum.MoodCheck,
    ],
  },
  [HappyAssistantContextEnum.Settings]: {
    actionIds: [
      HappyAssistantActionIdEnum.RestorePurchases,
      HappyAssistantActionIdEnum.Support,
      HappyAssistantActionIdEnum.VoiceJournal,
    ],
  },
  [HappyAssistantContextEnum.Default]: {
    actionIds: [
      HappyAssistantActionIdEnum.VoiceJournal,
      HappyAssistantActionIdEnum.TryBreathing,
      HappyAssistantActionIdEnum.MoodCheck,
    ],
  },
} satisfies Record<HappyAssistantContext, AssistantContextConfig>;

export const ASSISTANT_COPY_CONFIG = {
  [HappyAssistantContextEnum.Exercises]: {
    title: "Hi, I'm Happy",
    subtitle: "Want a quick next step for your mind?",
  },
  [HappyAssistantContextEnum.Journal]: {
    title: "Hi, I'm Happy",
    subtitle: "Capture, check in, or open your insight.",
  },
  [HappyAssistantContextEnum.Record]: {
    title: "Hi, I'm Happy",
    subtitle: "Let's make journaling frictionless.",
  },
  [HappyAssistantContextEnum.Journeys]: {
    title: "Hi, I'm Happy",
    subtitle: "Keep the journey moving gently.",
  },
  [HappyAssistantContextEnum.Settings]: {
    title: "Hi, I'm Happy",
    subtitle: "Account, restore, and support shortcuts.",
  },
  [HappyAssistantContextEnum.Default]: {
    title: "Hi, I'm Happy",
    subtitle: "Pick one tiny helpful action.",
  },
} satisfies Record<HappyAssistantContext, AssistantCopyConfig>;
