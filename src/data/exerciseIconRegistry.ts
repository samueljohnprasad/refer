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

// ─── Exercise Type → Icon ────────────────────────────────────────────────────

export const EXERCISE_ICON_REGISTRY: Record<ExerciseType, HugeIconObject> = {
  // CBT Core
  thought_catcher: Brain01Icon,
  thought_reframing: AiBrain01Icon,
  gratitude_reframe: SparklesIcon,
  behavioral_activation: Flag01Icon,
  abc_analysis: BalanceScaleIcon,
  socratic_questioning: BubbleChatIcon,
  behavioral_experiment: Target01Icon,
  // Mindfulness
  box_breathing: Yoga01Icon,
  breathing_478: WellnessIcon,
  grounding_54321: HandPrayerIcon,
  body_scan_pmr: SmileIcon,
  mindful_breathing_1min: Timer01Icon,
  // Anxiety
  worry_time: WorryIcon,
  fear_ladder: Road01Icon,
  decatastrophizing: CloudIcon,
  worry_decision_tree: PathIcon,
  // Overthinking
  recognizing_rumination: EyeIcon,
  detached_mindfulness: Leaf01Icon,
  attention_training: HeadphonesIcon,
  reverse_rabbit_hole: Alert01Icon,
  // Sleep
  sleep_diary: Notebook01Icon,
  stimulus_control: BedIcon,
  cognitive_shuffle: ShuffleIcon,
  pre_sleep_worry_journal: PenTool01Icon,
  // DBT
  stop_skill: StopWatchIcon,
  opposite_action: FlashIcon,
  tipp: Fire02Icon,
  radical_acceptance: CheckmarkCircle01Icon,
  // ACT
  values_clarification: Compass01Icon,
  leaves_on_stream: Leaf01Icon,
  // Self-Compassion
  self_compassion_break: FavouriteIcon,
  self_criticism_to_coach: HappyIcon,
  // Self-Esteem
  core_beliefs_suitcase: Idea01Icon,
  // Anger
  anger_thermometer: AngryIcon,
  // Procrastination
  procrastination_buster: ZapIcon,
  // Relationships
  boundary_setting_script: Shield01Icon,
};

// ─── Category → Icon ─────────────────────────────────────────────────────────

export const CATEGORY_ICON_REGISTRY: Record<ExerciseCategory, HugeIconObject> =
  {
    cbt_core: Brain01Icon,
    mindfulness: Leaf01Icon,
    anxiety: CloudIcon,
    sleep: Moon01Icon,
    overthinking: AiBrain01Icon,
    dbt: Shield01Icon,
    act: Compass01Icon,
    self_compassion: FavouriteIcon,
    self_esteem: StarIcon,
    anger: AngryIcon,
    procrastination: ZapIcon,
    relationships: UserGroupIcon,
  };

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getExerciseIcon(type: string): HugeIconObject {
  return EXERCISE_ICON_REGISTRY[type as ExerciseType] ?? Brain01Icon;
}

export function getCategoryIcon(category: string): HugeIconObject {
  return CATEGORY_ICON_REGISTRY[category as ExerciseCategory] ?? Brain01Icon;
}
