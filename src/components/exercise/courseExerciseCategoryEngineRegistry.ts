import type { ComponentType } from "react";
import { GuessRevealCategoryEngine } from "@/src/components/exercise/GuessRevealCategoryEngine";
import { CourseChoiceCategoryEngine } from "@/src/components/exercise/CourseChoiceCategoryEngine";
import { CuriosityBetCategoryEngine } from "@/src/components/exercise/CuriosityBetCategoryEngine";
import { CommonTrapCategoryEngine } from "@/src/components/exercise/CommonTrapCategoryEngine";
import { ConceptCardCategoryEngine } from "@/src/components/exercise/ConceptCardCategoryEngine";
import { DialogueCategoryEngine } from "@/src/components/exercise/DialogueCategoryEngine";
import { ExplorableModelCategoryEngine } from "@/src/components/exercise/ExplorableModelCategoryEngine";
import { FillBlankCategoryEngine } from "@/src/components/exercise/FillBlankCategoryEngine";
import { GuidedDiscoveryTrailCategoryEngine } from "@/src/components/exercise/GuidedDiscoveryTrailCategoryEngine";
import { InventFirstCategoryEngine } from "@/src/components/exercise/InventFirstCategoryEngine";
import { IntuitionCheckCategoryEngine } from "@/src/components/exercise/IntuitionCheckCategoryEngine";
import { GuidedRecallChipsCategoryEngine } from "@/src/components/exercise/GuidedRecallChipsCategoryEngine";
import { LayerZoomCategoryEngine } from "@/src/components/exercise/LayerZoomCategoryEngine";
import { LearnCardsCategoryEngine } from "@/src/components/exercise/LearnCardsCategoryEngine";
import { NameItCategoryEngine } from "@/src/components/exercise/NameItCategoryEngine";
import { OneLineRevealCategoryEngine } from "@/src/components/exercise/OneLineRevealCategoryEngine";
import { PanicWaveCommitCategoryEngine } from "@/src/components/exercise/PanicWaveCommitCategoryEngine";
import { ParadoxCardCategoryEngine } from "@/src/components/exercise/ParadoxCardCategoryEngine";
import { RecallWarmupCategoryEngine } from "@/src/components/exercise/microlearning/RecallWarmupCategoryEngine";
import { SymptomDecoderCategoryEngine } from "@/src/components/exercise/SymptomDecoderCategoryEngine";
import { StoryWalkthroughCategoryEngine } from "@/src/components/exercise/StoryWalkthroughCategoryEngine";
import { StorySerialCategoryEngine } from "@/src/components/exercise/StorySerialCategoryEngine";
import { SurgeDiagramCategoryEngine } from "@/src/components/exercise/SurgeDiagramCategoryEngine";
import { TeachBackChainCategoryEngine } from "@/src/components/exercise/TeachBackChainCategoryEngine";
import { TermChipCategoryEngine } from "@/src/components/exercise/TermChipCategoryEngine";
import { TwinCaseCategoryEngine } from "@/src/components/exercise/TwinCaseCategoryEngine";
import { TwoDialSandboxCategoryEngine } from "@/src/components/exercise/TwoDialSandboxCategoryEngine";
import { WhatIfCategoryEngine as WhatIfMachineCategoryEngine } from "@/src/components/exercise/whatif/WhatIfCategoryEngine";
import { CheckpointCategoryEngine as CourseCheckpointCategoryEngine } from "@/src/components/exercise/checkpoint/CheckpointCategoryEngine";

import { WhiteBearExperimentCategoryEngine } from "@/src/components/exercise/WhiteBearExperimentCategoryEngine";
import { WaveOrderingCategoryEngine } from "@/src/components/exercise/WaveOrderingCategoryEngine";
import { WaveScrubberCategoryEngine } from "@/src/components/exercise/WaveScrubberCategoryEngine";
import { WaveSequenceCategoryEngine } from "@/src/components/exercise/WaveSequenceCategoryEngine";
import { EIGHTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseEighthBatchRegistry";
import { ELEVENTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseEleventhBatchRegistry";
import { FINAL_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseFinalBatchRegistry";
import { NINTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseNinthBatchRegistry";
import { TENTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseTenthBatchRegistry";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  CourseExerciseCategoryEnum,
  type RenderableExerciseCategory,
} from "@/src/types/courseExercises";

export interface CourseExerciseCategoryConfig {
  category: RenderableExerciseCategory;
  formats: string[];
  engine: ComponentType<V1CategoryEngineProps>;
  goalLabel: string;
  unavailableCopy: string;
}

export const courseExerciseCategoryEngineRegistry: Partial<Record<
  RenderableExerciseCategory,
  CourseExerciseCategoryConfig
>> = {
  [CourseExerciseCategoryEnum.GuessReveal]: {
    category: CourseExerciseCategoryEnum.GuessReveal,
    formats: [CourseExerciseCategoryEnum.GuessReveal],
    engine: GuessRevealCategoryEngine,
    goalLabel: "Commit to a guess before seeing the answer.",
    unavailableCopy: "This guess and reveal is not available yet.",
  },
  [CourseExerciseCategoryEnum.SymptomDecoder]: {
    category: CourseExerciseCategoryEnum.SymptomDecoder,
    formats: [CourseExerciseCategoryEnum.SymptomDecoder],
    engine: SymptomDecoderCategoryEngine,
    goalLabel: "Connect a familiar signal to the stress response.",
    unavailableCopy: "This symptom decoder is not available yet.",
  },
  [CourseExerciseCategoryEnum.LearnCards]: {
    category: CourseExerciseCategoryEnum.LearnCards,
    formats: [CourseExerciseCategoryEnum.LearnCards],
    engine: LearnCardsCategoryEngine,
    goalLabel: "Learn one idea, then recall it.",
    unavailableCopy: "These learning cards are not available yet.",
  },
  [CourseExerciseCategoryEnum.TwinCase]: {
    category: CourseExerciseCategoryEnum.TwinCase,
    formats: [CourseExerciseCategoryEnum.TwinCase],
    engine: TwinCaseCategoryEngine,
    goalLabel: "Build an analogy by matching its parts.",
    unavailableCopy: "This matching exercise is not available yet.",
  },
  [CourseExerciseCategoryEnum.IntuitionCheck]: {
    category: CourseExerciseCategoryEnum.IntuitionCheck,
    formats: [CourseExerciseCategoryEnum.IntuitionCheck],
    engine: IntuitionCheckCategoryEngine,
    goalLabel: "Commit to an intuition before learning the rule.",
    unavailableCopy: "This intuition check is not available yet.",
  },
  [CourseExerciseCategoryEnum.NameIt]: {
    category: CourseExerciseCategoryEnum.NameIt,
    formats: [CourseExerciseCategoryEnum.NameIt],
    engine: NameItCategoryEngine,
    goalLabel: "Name a feeling precisely and rate its intensity.",
    unavailableCopy: "This feeling ladder is not available yet.",
  },
  [CourseExerciseCategoryEnum.CourseChoice]: {
    category: CourseExerciseCategoryEnum.CourseChoice,
    formats: [CourseExerciseCategoryEnum.CourseChoice],
    engine: CourseChoiceCategoryEngine,
    goalLabel: "Apply the stress model to a familiar situation.",
    unavailableCopy: "This quick check is not available yet.",
  },
  [CourseExerciseCategoryEnum.InventFirst]: {
    category: CourseExerciseCategoryEnum.InventFirst,
    formats: [CourseExerciseCategoryEnum.InventFirst],
    engine: InventFirstCategoryEngine,
    goalLabel: "Invent the thought-feeling rule from contrasting cases.",
    unavailableCopy: "This rule lab is not available yet.",
  },
  [CourseExerciseCategoryEnum.LayerZoom]: {
    category: CourseExerciseCategoryEnum.LayerZoom,
    formats: [CourseExerciseCategoryEnum.LayerZoom],
    engine: LayerZoomCategoryEngine,
    goalLabel: "Separate an event, body alarm, and interpretation.",
    unavailableCopy: "This layered explanation is not available yet.",
  },
  [CourseExerciseCategoryEnum.Dialogue]: {
    category: CourseExerciseCategoryEnum.Dialogue,
    formats: [CourseExerciseCategoryEnum.Dialogue],
    engine: DialogueCategoryEngine,
    goalLabel: "Compare two interpretations of the same event.",
    unavailableCopy: "This dialogue is not available yet.",
  },
  [CourseExerciseCategoryEnum.ConceptCard]: {
    category: CourseExerciseCategoryEnum.ConceptCard,
    formats: [CourseExerciseCategoryEnum.ConceptCard],
    engine: ConceptCardCategoryEngine,
    goalLabel: "Replace a sticky myth with a usable rule.",
    unavailableCopy: "This concept card is not available yet.",
  },
  [CourseExerciseCategoryEnum.StoryWalkthrough]: {
    category: CourseExerciseCategoryEnum.StoryWalkthrough,
    formats: [CourseExerciseCategoryEnum.StoryWalkthrough],
    engine: StoryWalkthroughCategoryEngine,
    goalLabel: "Follow a low-mood loop through one ordinary day.",
    unavailableCopy: "This story walkthrough is not available yet.",
  },
  [CourseExerciseCategoryEnum.CommonTrap]: {
    category: CourseExerciseCategoryEnum.CommonTrap,
    formats: [CourseExerciseCategoryEnum.CommonTrap],
    engine: CommonTrapCategoryEngine,
    goalLabel: "See why a tempting coping move rebounds.",
    unavailableCopy: "This common-trap exercise is not available yet.",
  },
  [CourseExerciseCategoryEnum.StorySerial]: {
    category: CourseExerciseCategoryEnum.StorySerial,
    formats: [CourseExerciseCategoryEnum.StorySerial],
    engine: StorySerialCategoryEngine,
    goalLabel: "Compare two honest paths, then notice what moved first.",
    unavailableCopy: "This story episode is not available yet.",
  },
  [CourseExerciseCategoryEnum.TwoDialSandbox]: {
    category: CourseExerciseCategoryEnum.TwoDialSandbox,
    formats: [CourseExerciseCategoryEnum.TwoDialSandbox],
    engine: TwoDialSandboxCategoryEngine,
    goalLabel: "Explore how load and recovery work together.",
    unavailableCopy: "This two-dial model is not available yet.",
  },
  [CourseExerciseCategoryEnum.ExplorableModel]: {
    category: CourseExerciseCategoryEnum.ExplorableModel,
    formats: [CourseExerciseCategoryEnum.ExplorableModel],
    engine: ExplorableModelCategoryEngine,
    goalLabel: "Open one lever at a time in a working stress model.",
    unavailableCopy: "This explorable model is not available yet.",
  },
  [CourseExerciseCategoryEnum.WhiteBearExperiment]: {
    category: CourseExerciseCategoryEnum.WhiteBearExperiment,
    formats: [CourseExerciseCategoryEnum.WhiteBearExperiment],
    engine: WhiteBearExperimentCategoryEngine,
    goalLabel: "Feel the thought-suppression effect before naming it.",
    unavailableCopy: "This thought experiment is not available yet.",
  },
  [CourseExerciseCategoryEnum.ParadoxCard]: {
    category: CourseExerciseCategoryEnum.ParadoxCard,
    formats: [CourseExerciseCategoryEnum.ParadoxCard],
    engine: ParadoxCardCategoryEngine,
    goalLabel: "Experience why forcing calm can feed the alarm.",
    unavailableCopy: "This paradox exercise is not available yet.",
  },
  [CourseExerciseCategoryEnum.OneLineReveal]: {
    category: CourseExerciseCategoryEnum.OneLineReveal,
    formats: [CourseExerciseCategoryEnum.OneLineReveal],
    engine: OneLineRevealCategoryEngine,
    goalLabel: "Complete one useful idea about avoidance.",
    unavailableCopy: "This one-line reveal is not available yet.",
  },
  [CourseExerciseCategoryEnum.CourseCheckpoint]: {
    category: CourseExerciseCategoryEnum.CourseCheckpoint,
    formats: [CourseExerciseCategoryEnum.CourseCheckpoint],
    engine: CourseCheckpointCategoryEngine as any, // Temporary cast until strict typing propagates to registry
  },
  [CourseExerciseCategoryEnum.WhatIfMachine]: {
    category: CourseExerciseCategoryEnum.WhatIfMachine,
    formats: [CourseExerciseCategoryEnum.WhatIfMachine],
    engine: WhatIfMachineCategoryEngine as any,
    goalLabel: "Predict and observe how avoidance teaches fear.",
    unavailableCopy: "This what-if experiment is not available yet.",
  },
  [CourseExerciseCategoryEnum.GuidedRecallChips]: {
    category: CourseExerciseCategoryEnum.GuidedRecallChips,
    formats: [CourseExerciseCategoryEnum.GuidedRecallChips],
    engine: GuidedRecallChipsCategoryEngine,
    goalLabel: "Rebuild the avoidance loop in order.",
    unavailableCopy: "This guided recall is not available yet.",
  },
  [CourseExerciseCategoryEnum.TermChip]: {
    category: CourseExerciseCategoryEnum.TermChip,
    formats: [CourseExerciseCategoryEnum.TermChip],
    engine: TermChipCategoryEngine,
    goalLabel: "Recognize a safety behavior and its counterexample.",
    unavailableCopy: "This term exercise is not available yet.",
  },
  [CourseExerciseCategoryEnum.GuidedDiscoveryTrail]: {
    category: CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
    formats: [CourseExerciseCategoryEnum.GuidedDiscoveryTrail],
    engine: GuidedDiscoveryTrailCategoryEngine,
    goalLabel: "Discover why relief can strengthen avoidance.",
    unavailableCopy: "This guided discovery is not available yet.",
  },
  [CourseExerciseCategoryEnum.TeachBackChain]: {
    category: CourseExerciseCategoryEnum.TeachBackChain,
    formats: [CourseExerciseCategoryEnum.TeachBackChain],
    engine: TeachBackChainCategoryEngine,
    goalLabel: "Teach the avoidance loop back in sequence.",
    unavailableCopy: "This teach-back is not available yet.",
  },
  [CourseExerciseCategoryEnum.RecallWarmup]: {
    category: CourseExerciseCategoryEnum.RecallWarmup,
    formats: [CourseExerciseCategoryEnum.RecallWarmup],
    engine: RecallWarmupCategoryEngine as any,
    goalLabel: "Retrieve three core ideas before rereading.",
    unavailableCopy: "This recall warm-up is not available yet.",
  },
  [CourseExerciseCategoryEnum.SurgeDiagram]: {
    category: CourseExerciseCategoryEnum.SurgeDiagram,
    formats: [CourseExerciseCategoryEnum.SurgeDiagram],
    engine: SurgeDiagramCategoryEngine,
    goalLabel: "See the built-in rise and fade of a stress surge.",
    unavailableCopy: "This surge diagram is not available yet.",
  },
  [CourseExerciseCategoryEnum.FillBlank]: {
    category: CourseExerciseCategoryEnum.FillBlank,
    formats: [CourseExerciseCategoryEnum.FillBlank],
    engine: FillBlankCategoryEngine,
    goalLabel: "Name adrenaline and recognize its temporary effects.",
    unavailableCopy: "This fill-in-the-blank is not available yet.",
  },
  [CourseExerciseCategoryEnum.CuriosityBet]: {
    category: CourseExerciseCategoryEnum.CuriosityBet,
    formats: [CourseExerciseCategoryEnum.CuriosityBet],
    engine: CuriosityBetCategoryEngine,
    goalLabel: "Commit to a prediction before seeing the panic timer.",
    unavailableCopy: "This curiosity bet is not available yet.",
  },
  [CourseExerciseCategoryEnum.PanicWaveCommit]: {
    category: CourseExerciseCategoryEnum.PanicWaveCommit,
    formats: [CourseExerciseCategoryEnum.PanicWaveCommit],
    engine: PanicWaveCommitCategoryEngine,
    goalLabel: "Compare a prediction with the wave’s built-in fade.",
    unavailableCopy: "This panic-wave prediction is not available yet.",
  },
  [CourseExerciseCategoryEnum.WaveSequence]: {
    category: CourseExerciseCategoryEnum.WaveSequence,
    formats: [CourseExerciseCategoryEnum.WaveSequence],
    engine: WaveSequenceCategoryEngine,
    goalLabel: "See the full anxiety wave, including its fade.",
    unavailableCopy: "This wave sequence is not available yet.",
  },
  [CourseExerciseCategoryEnum.WaveOrdering]: {
    category: CourseExerciseCategoryEnum.WaveOrdering,
    formats: [CourseExerciseCategoryEnum.WaveOrdering],
    engine: WaveOrderingCategoryEngine,
    goalLabel: "Rebuild the anxiety wave from memory.",
    unavailableCopy: "This wave ordering exercise is not available yet.",
  },
  [CourseExerciseCategoryEnum.WaveScrubber]: {
    category: CourseExerciseCategoryEnum.WaveScrubber,
    formats: [CourseExerciseCategoryEnum.WaveScrubber],
    engine: WaveScrubberCategoryEngine,
    goalLabel: "Explore how a real anxiety wave changes minute by minute.",
    unavailableCopy: "This wave scrubber is not available yet.",
  },
  ...EIGHTH_BATCH_CATEGORY_CONFIGS,
  ...NINTH_BATCH_CATEGORY_CONFIGS,
  ...TENTH_BATCH_CATEGORY_CONFIGS,
  ...ELEVENTH_BATCH_CATEGORY_CONFIGS,
  ...FINAL_BATCH_CATEGORY_CONFIGS,
};
