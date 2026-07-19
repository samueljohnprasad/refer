/**
 * Exercise Icon Registry
 *
 * Maps exercise types and category keys to Hugeicons icon objects.
 * All exercise UI renders icons from this registry — zero emojis.
 */

import {
  Brain01Icon,
  Leaf01Icon,
  Compass01Icon,
  Moon01Icon,
  CloudIcon,
  Shield01Icon,
  FavouriteIcon,
  StarIcon,
  AngryIcon,
  ZapIcon,
  UserGroupIcon,
  AiBrain01Icon,
  SparklesIcon,
  HandPrayerIcon,
  Target01Icon,
  WellnessIcon,
  Yoga01Icon,
  Timer01Icon,
  StopWatchIcon,
  SleepingIcon,
  BedIcon,
  ShuffleIcon,
  Notebook01Icon,
  PenTool01Icon,
  BalanceScaleIcon,
  HeartCheckIcon,
  CheckmarkCircle01Icon,
  EyeIcon,
  FlashIcon,
  Fire02Icon,
  HeadphonesIcon,
  Alert01Icon,
  Idea01Icon,
  PathIcon,
  SmileIcon,
  BubbleChatIcon,
  Road01Icon,
  HappyIcon,
  Sad01Icon,
  Flag01Icon,
  WorryIcon,
  MoonCloudIcon,
} from "@hugeicons/core-free-icons";

import type { HugeIconObject } from "@/src/data/journey/hugeiconsRegistry";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import { SAGE, OTTER_BLUE, GOLD, MACAW_PURPLE } from "@/lib/tokens";

// ─── Exercise Type → Icon ────────────────────────────────────────────────────

export const EXERCISE_ICON_REGISTRY: Record<ExerciseType, HugeIconObject> = {
  // CBT Core
  thought_catcher: Brain01Icon,
  thought_reframing: AiBrain01Icon,
  gratitude_reframe: SparklesIcon,
  abc_analysis: BalanceScaleIcon,
  // Mindfulness
  box_breathing: Yoga01Icon,
  breathing_478: WellnessIcon,
  grounding_54321: HandPrayerIcon,
  body_scan_pmr: SmileIcon,
  mindful_breathing_1min: Timer01Icon,
  // Anxiety
  decatastrophizing: CloudIcon,
  worry_decision_tree: PathIcon,
  // Overthinking
  detached_mindfulness: Leaf01Icon,
  attention_training: HeadphonesIcon,
};

// ─── Category → Icon ─────────────────────────────────────────────────────────

export const CATEGORY_ICON_REGISTRY: Record<ExerciseCategory, HugeIconObject> =
{
  cbt_core: Brain01Icon,
  mindfulness: Leaf01Icon,
  anxiety: CloudIcon,
  overthinking: AiBrain01Icon,
};

// ─── Category tint ────────────────────────────────────────────────────────────
// Applied to icon wells and section eyebrows only — card face stays white.

export interface CategoryTint {
  iconBg: string;   // Tailwind class for icon well background
  iconColor: string; // Hex for the icon itself
  eyebrowColor: string; // Tailwind class for eyebrow text color
}

export const CATEGORY_TINT: Record<ExerciseCategory, CategoryTint> = {
  cbt_core: { iconBg: "bg-sage-50", iconColor: SAGE[600], eyebrowColor: "text-sage-500" },
  mindfulness: { iconBg: "bg-otter-blue/10", iconColor: OTTER_BLUE, eyebrowColor: "text-otter-blue" },
  anxiety: { iconBg: "bg-gold/10", iconColor: GOLD, eyebrowColor: "text-bee-yellow" },
  overthinking: { iconBg: "bg-macaw-purple/10", iconColor: MACAW_PURPLE, eyebrowColor: "text-macaw-purple" },
};

export function getCategoryTint(category: string): CategoryTint {
  return CATEGORY_TINT[category as ExerciseCategory] ?? CATEGORY_TINT.cbt_core;
}

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getExerciseIcon(type: string): HugeIconObject {
  return EXERCISE_ICON_REGISTRY[type as ExerciseType] ?? Brain01Icon;
}

export function getCategoryIcon(category: string): HugeIconObject {
  return CATEGORY_ICON_REGISTRY[category as ExerciseCategory] ?? Brain01Icon;
}
