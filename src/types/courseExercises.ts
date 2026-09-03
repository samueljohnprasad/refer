import type { V1ExerciseCategory } from "@/src/types/journeyLearning";

export enum CourseExerciseCategoryEnum {
  GuessReveal = "guess_reveal",
  SymptomDecoder = "symptom_decoder",
  LearnCards = "learn_cards",
  TwinCase = "twin_case",
  IntuitionCheck = "intuition_check",
  ReflectionChoice = "reflection_choice",
  NameIt = "name_it",
  CourseChoice = "course_choice",
  InventFirst = "invent_first",
  LayerZoom = "layer_zoom",
  Dialogue = "dialogue",
  ConceptCard = "concept_card",
  StoryWalkthrough = "story_walkthrough",
  CommonTrap = "common_trap",
  StorySerial = "story_serial",
  TwoDialSandbox = "two_dial_sandbox",
  ExplorableModel = "explorable_model",
  WhiteBearExperiment = "white_bear_experiment",
  ParadoxCard = "paradox_card",
  InteractiveReframe = "interactive_reframe",
  OneLineReveal = "one_line_reveal",
  WhatIfMachine = "what_if_machine",
  GuidedRecallChips = "guided_recall_chips",
  TermChip = "term_chip",
  GuidedDiscoveryTrail = "guided_discovery_trail",
  TeachBackChain = "teach_back_chain",
  RecallWarmup = "recall_warmup",
  SurgeDiagram = "surge_diagram",
  FillBlank = "fill_blank",
  CuriosityBet = "curiosity_bet",
  PanicWaveCommit = "panic_wave_commit",
  WaveSequence = "wave_sequence",
  WaveOrdering = "wave_ordering",
  WaveScrubber = "wave_scrubber",
  EvidenceBite = "evidence_bite",
  SurgeTimer = "surge_timer",
  WhyItMatters = "why_it_matters",
  BreathingRound = "breathing_round",
  WaveFaq = "wave_faq",
  EveningComparison = "evening_comparison",
  LeverCheck = "lever_check",
  AnnotatedDiary = "annotated_diary",
  PrivateCheck = "private_check",
  SameButDifferent = "same_but_different",
  SocraticDialogue = "socratic_dialogue",
  AssociationMeter = "association_meter",
  LensReplay = "lens_replay",
  ToolkitShelf = "toolkit_shelf",
  LeverMatch = "lever_match",
  LeverScenario = "lever_scenario",
  WorkedRewrite = "worked_rewrite",
  FadedThoughtRecord = "faded_thought_record",
  ReframeBuilder = "reframe_builder",
  SituationLanguage = "situation_language",
  IfThenPlan = "if_then_plan",
  CourseCheckpoint = "course_checkpoint",
  SectionMilestone = "section_milestone",
  TimelineRewind = "timeline_rewind",
  StateSwitch = "state_switch",
}

export type CourseExerciseCategory = `${CourseExerciseCategoryEnum}`;

export type RenderableExerciseCategory =
  V1ExerciseCategory | CourseExerciseCategory;

const COURSE_EXERCISE_CATEGORIES = new Set<string>(
  Object.values(CourseExerciseCategoryEnum),
);

export function isCourseExerciseCategory(
  category: RenderableExerciseCategory,
): category is CourseExerciseCategory {
  return COURSE_EXERCISE_CATEGORIES.has(category);
}
