/**
 * Content Icon Registry
 *
 * Maps string keys used in ChoiceStep / BooleanStep / MultiChoiceStep options
 * to Hugeicons icon objects. Replaces inline emoji strings in exercise configs.
 */

import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  HelpCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  AngryIcon,
  Sad01Icon,
  Alert01Icon,
  Sad02Icon,
  SmileIcon,
  SleepingIcon,
  ThumbsDownIcon,
  HeartbreakIcon,
  Briefcase01Icon,
  Hospital01Icon,
  Timer01Icon,
  Clock01Icon,
  Clock04Icon,
  Calendar01Icon,
  HandGripIcon,
  WorkoutRunIcon,
  WellnessIcon,
  MusicNote01Icon,
  Yoga01Icon,
  EyeIcon,
  RefreshIcon,
  AiPhone01Icon,
  Fire02Icon,
  Target01Icon,
  SparklesIcon,
  FavouriteIcon,
  StarIcon,
  UserGroupIcon,
  Brain01Icon,
  Idea01Icon,
  Shield01Icon,
  ZapIcon,
  CloudIcon,
} from "@hugeicons/core-free-icons";

import type { HugeIconObject } from "@/src/data/journey/hugeiconsRegistry";

/** Lookup map: content icon key → Hugeicons icon object */
export const CONTENT_ICON_REGISTRY: Record<string, HugeIconObject> = {
  // Common boolean/choice
  check: CheckmarkCircle01Icon,
  cross: Cancel01Icon,
  question: HelpCircleIcon,
  warning: Alert01Icon,

  // Arrows
  arrow_down: ArrowDown01Icon,
  arrow_up: ArrowUp01Icon,

  // Emotions / moods
  happy: SmileIcon,
  neutral: EyeIcon,
  anxious: Alert01Icon,
  sad: Sad01Icon,
  frustrated: AngryIcon,
  stressed: Sad02Icon,
  angry: AngryIcon,
  fearful: Alert01Icon,
  guilty: Sad01Icon,
  ashamed: Sad02Icon,
  hopeless: Sad01Icon,
  overwhelmed: Brain01Icon,
  lonely: Sad02Icon,
  shame: Sad02Icon,

  // Activities
  walk: WorkoutRunIcon,
  call_friend: AiPhone01Icon,
  cook: Fire02Icon,
  exercise: WorkoutRunIcon,
  running: WorkoutRunIcon,

  // Coping / techniques
  deep_breathing: WellnessIcon,
  count_to_10: Timer01Icon,
  walk_away: WorkoutRunIcon,
  cold_water: CloudIcon,
  grounding: HandGripIcon,
  movement: WorkoutRunIcon,
  breath: WellnessIcon,
  music: MusicNote01Icon,
  breathing: WellnessIcon,
  body_scan: Yoga01Icon,
  skip_sleep: SleepingIcon,

  // Rumination themes
  past_regret: Clock01Icon,
  self_criticism: ThumbsDownIcon,
  relationship: HeartbreakIcon,
  work: Briefcase01Icon,
  health: Hospital01Icon,
  other: HelpCircleIcon,

  // Time durations
  minutes: Timer01Icon,
  hour: Clock01Icon,
  hours: Clock04Icon,
  days: Calendar01Icon,

  // Thinking traps / distortions
  all_or_nothing: Cancel01Icon,
  catastrophizing: Alert01Icon,
  mind_reading: Brain01Icon,
  fortune_telling: EyeIcon,
  emotional_reasoning: FavouriteIcon,
  should_statements: Shield01Icon,
  labeling: StarIcon,
  personalization: UserGroupIcon,
  disqualifying_positive: ThumbsDownIcon,
  magnification: ArrowUp01Icon,

  // Gratitude categories
  people: FavouriteIcon,
  growth: SparklesIcon,
  simple_joy: SmileIcon,

  // TIPP techniques
  temperature: CloudIcon,
  intense_exercise: WorkoutRunIcon,
  paced_breathing: WellnessIcon,
  paired_relaxation: Yoga01Icon,

  // Boolean defaults
  yes: CheckmarkCircle01Icon,
  no: Cancel01Icon,
  refresh: RefreshIcon,
  sleep: SleepingIcon,

  // Misc
  idea: Idea01Icon,
  target: Target01Icon,
  zap: ZapIcon,
};

/**
 * Resolve a content icon by key.
 * Returns undefined if key not found (caller can skip rendering).
 */
export function getContentIcon(key: string): HugeIconObject | undefined {
  return CONTENT_ICON_REGISTRY[key];
}
