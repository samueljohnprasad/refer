import type {
  ExerciseType,
  ExerciseCategory,
  ExerciseConfig,
} from "@/src/types/exerciseFlow";
import { EXERCISE_CATEGORY_META } from "@/src/types/exerciseFlow";

// ─── Import all configs ─────────────────────────────────────────────────────

import { thoughtCatcherConfig } from "@/src/exercises/thoughtCatcher/config";
import { thoughtReframingConfig } from "@/src/exercises/thoughtReframing/config";
import { gratitudeReframeConfig } from "@/src/exercises/gratitudeReframe/config";
import { behavioralActivationConfig } from "@/src/exercises/behavioralActivation/config";
import { abcAnalysisConfig } from "@/src/exercises/abcAnalysis/config";
import { socraticQuestioningConfig } from "@/src/exercises/socraticQuestioning/config";
import { behavioralExperimentConfig } from "@/src/exercises/behavioralExperiment/config";
import { boxBreathingConfig } from "@/src/exercises/boxBreathing/config";
import { breathing478Config } from "@/src/exercises/breathing478/config";
import { grounding54321Config } from "@/src/exercises/grounding54321/config";
import { bodyScanPMRConfig } from "@/src/exercises/bodyScanPMR/config";
import { mindfulBreathing1MinConfig } from "@/src/exercises/mindfulBreathing1Min/config";
import { worryTimeConfig } from "@/src/exercises/worryTime/config";
import { fearLadderConfig } from "@/src/exercises/fearLadder/config";
import { decatastrophizingConfig } from "@/src/exercises/decatastrophizing/config";
import { worryDecisionTreeConfig } from "@/src/exercises/worryDecisionTree/config";
import { recognizingRuminationConfig } from "@/src/exercises/recognizingRumination/config";
import { detachedMindfulnessConfig } from "@/src/exercises/detachedMindfulness/config";
import { attentionTrainingConfig } from "@/src/exercises/attentionTraining/config";
import { sleepDiaryConfig } from "@/src/exercises/sleepDiary/config";
import { stimulusControlConfig } from "@/src/exercises/stimulusControl/config";
import { cognitiveShuffleConfig } from "@/src/exercises/cognitiveShuffle/config";
import { preSleepWorryJournalConfig } from "@/src/exercises/preSleepWorryJournal/config";
import { stopSkillConfig } from "@/src/exercises/stopSkill/config";
import { oppositeActionConfig } from "@/src/exercises/oppositeAction/config";
import { tippConfig } from "@/src/exercises/tipp/config";
import { radicalAcceptanceConfig } from "@/src/exercises/radicalAcceptance/config";
import { valuesClarificationConfig } from "@/src/exercises/valuesClarification/config";
import { selfCompassionBreakConfig } from "@/src/exercises/selfCompassionBreak/config";
import { selfCriticismToCoachConfig } from "@/src/exercises/selfCriticismToCoach/config";
import { coreBeliefsSuitcaseConfig } from "@/src/exercises/coreBeliefsSuitcase/config";
import { angerThermometerConfig } from "@/src/exercises/angerThermometer/config";
import { boundarySettingScriptConfig } from "@/src/exercises/boundarySettingScript/config";

// ─── Master Registry ────────────────────────────────────────────────────────

const ALL_CONFIGS: ExerciseConfig<any>[] = [
  // CBT Core
  thoughtCatcherConfig,
  thoughtReframingConfig,
  gratitudeReframeConfig,
  behavioralActivationConfig,
  abcAnalysisConfig,
  socraticQuestioningConfig,
  behavioralExperimentConfig,
  // Mindfulness
  boxBreathingConfig,
  breathing478Config,
  grounding54321Config,
  bodyScanPMRConfig,
  mindfulBreathing1MinConfig,
  // Anxiety
  worryTimeConfig,
  fearLadderConfig,
  decatastrophizingConfig,
  worryDecisionTreeConfig,
  // Overthinking
  recognizingRuminationConfig,
  detachedMindfulnessConfig,
  attentionTrainingConfig,
  // Sleep
  sleepDiaryConfig,
  stimulusControlConfig,
  cognitiveShuffleConfig,
  preSleepWorryJournalConfig,
  // DBT
  stopSkillConfig,
  oppositeActionConfig,
  tippConfig,
  radicalAcceptanceConfig,
  // ACT
  valuesClarificationConfig,
  // Self-Compassion
  selfCompassionBreakConfig,
  selfCriticismToCoachConfig,
  // Self-Esteem
  coreBeliefsSuitcaseConfig,
  // Anger
  angerThermometerConfig,
  // Relationships
  boundarySettingScriptConfig,
];

// ─── Lookup Maps ────────────────────────────────────────────────────────────

const configMap = new Map<ExerciseType, ExerciseConfig<any>>();
ALL_CONFIGS.forEach((c) => configMap.set(c.type, c));

// ─── Public API ─────────────────────────────────────────────────────────────

/** Get a single exercise config by its type ID */
export function getExerciseConfig<T extends ExerciseType>(
  type: T,
): ExerciseConfig<any> | undefined {
  return configMap.get(type);
}

/** Get all exercise configs */
export function getAllExercises(): ExerciseConfig<any>[] {
  return ALL_CONFIGS;
}

/** Get exercises filtered by category */
export function getExercisesByCategory(
  category: ExerciseCategory,
): ExerciseConfig<any>[] {
  return ALL_CONFIGS.filter((c) => c.category === category);
}

/** Get all categories that have at least one exercise */
export function getActiveCategories(): ExerciseCategory[] {
  const cats = new Set<ExerciseCategory>();
  ALL_CONFIGS.forEach((c) => cats.add(c.category));
  return Array.from(cats);
}

/** Get category metadata (icon, label) */
export function getCategoryMeta(category: ExerciseCategory) {
  return EXERCISE_CATEGORY_META[category];
}

/** Get exercises grouped by category for Discover tab */
export function getExercisesGrouped(): {
  category: ExerciseCategory;
  label: string;
  icon: string;
  exercises: ExerciseConfig<any>[];
}[] {
  const grouped = new Map<ExerciseCategory, ExerciseConfig<any>[]>();

  ALL_CONFIGS.forEach((c) => {
    const list = grouped.get(c.category) ?? [];
    list.push(c);
    grouped.set(c.category, list);
  });

  return Array.from(grouped.entries()).map(([cat, exercises]) => {
    const meta = EXERCISE_CATEGORY_META[cat];
    return {
      category: cat,
      label: meta.label,
      icon: meta.icon,
      exercises,
    };
  });
}

/** Total number of registered exercises */
export const TOTAL_EXERCISES = ALL_CONFIGS.length;
