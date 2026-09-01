import { getLearnCardsLabel, getNextLearnCardsState } from '@/src/domains/journey/learning/courseExercisePrimaryTransition';
import { GuessRevealCategoryEngine } from "@/src/components/exercise/GuessRevealCategoryEngine";
import { GuessRevealConfig } from "@/src/exercises/GuessReveal/config";
import { SymptomDecoderConfig } from "@/src/exercises/SymptomDecoder/config";
import { TwinCaseConfig } from "@/src/exercises/TwinCase/config";
import { IntuitionCheckConfig } from "@/src/exercises/IntuitionCheck/config";
import { NameItConfig } from "@/src/exercises/NameIt/config";
import { CourseChoiceConfig } from "@/src/exercises/CourseChoice/config";
import { InventFirstConfig } from "@/src/exercises/InventFirst/config";
import { LayerZoomConfig } from "@/src/exercises/LayerZoom/config";
import { DialogueConfig } from "@/src/exercises/Dialogue/config";
import { ConceptCardConfig } from "@/src/exercises/ConceptCard/config";
import { StoryWalkthroughConfig } from "@/src/exercises/StoryWalkthrough/config";
import { CommonTrapConfig } from "@/src/exercises/CommonTrap/config";
import { StorySerialConfig } from "@/src/exercises/StorySerial/config";
import { TwoDialSandboxConfig } from "@/src/exercises/TwoDialSandbox/config";
import { ExplorableModelConfig } from "@/src/exercises/ExplorableModel/config";
import { WhiteBearExperimentConfig } from "@/src/exercises/WhiteBearExperiment/config";
import { ParadoxCardConfig } from "@/src/exercises/ParadoxCard/config";
import { InteractiveReframeConfig } from "@/src/exercises/InteractiveReframe/config";
import { OneLineRevealConfig } from "@/src/exercises/OneLineReveal/config";
import { WhatIfMachineConfig } from "@/src/exercises/WhatIfMachine/config";
import { GuidedRecallChipsConfig } from "@/src/exercises/GuidedRecallChips/config";
import { TermChipConfig } from "@/src/exercises/TermChip/config";
import { GuidedDiscoveryTrailConfig } from "@/src/exercises/GuidedDiscoveryTrail/config";
import { TeachBackChainConfig } from "@/src/exercises/TeachBackChain/config";
import { RecallWarmupConfig } from "@/src/exercises/RecallWarmup/config";
import { SurgeDiagramConfig } from "@/src/exercises/SurgeDiagram/config";
import { FillBlankConfig } from "@/src/exercises/FillBlank/config";
import { CuriosityBetConfig } from "@/src/exercises/CuriosityBet/config";
import { PanicWaveCommitConfig } from "@/src/exercises/PanicWaveCommit/config";
import { WaveSequenceConfig } from "@/src/exercises/WaveSequence/config";
import { WaveOrderingConfig } from "@/src/exercises/WaveOrdering/config";
import { WaveScrubberConfig } from "@/src/exercises/WaveScrubber/config";
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
import { InteractiveReframeCategoryEngine } from "@/src/components/exercise/InteractiveReframeCategoryEngine";
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
import { WhiteBearExperimentCategoryEngine } from "@/src/components/exercise/WhiteBearExperimentCategoryEngine";
import { WaveOrderingCategoryEngine } from "@/src/components/exercise/WaveOrderingCategoryEngine";
import { WaveScrubberCategoryEngine } from "@/src/components/exercise/WaveScrubberCategoryEngine";
import { WaveSequenceCategoryEngine } from "@/src/components/exercise/WaveSequenceCategoryEngine";
import { EIGHTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseEighthBatchRegistry";
import { ELEVENTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseEleventhBatchRegistry";
import { FINAL_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseFinalBatchRegistry";
import { NINTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseNinthBatchRegistry";
import { TENTH_BATCH_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseTenthBatchRegistry";
import {
  IMMEDIATE_OPTION_SELECTION,
  type CourseExerciseCategoryConfig,
} from "@/src/components/exercise/courseExerciseCategoryConfig";
import { LEGACY_V1_CATEGORY_CONFIGS } from "@/src/components/exercise/courseExerciseLegacyCategoryRegistry";
import {
  CourseExerciseCategoryEnum,
  type RenderableExerciseCategory,
} from "@/src/types/courseExercises";

export type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";

export const courseExerciseCategoryEngineRegistry: Partial<Record<
  RenderableExerciseCategory,
  CourseExerciseCategoryConfig
>> = {
  ...LEGACY_V1_CATEGORY_CONFIGS,
  [CourseExerciseCategoryEnum.GuessReveal]: GuessRevealConfig,
  [CourseExerciseCategoryEnum.SymptomDecoder]: SymptomDecoderConfig,
  [CourseExerciseCategoryEnum.LearnCards]: {
    category: CourseExerciseCategoryEnum.LearnCards,
    formats: [CourseExerciseCategoryEnum.LearnCards],
    engine: LearnCardsCategoryEngine,
    goalLabel: "Learn one idea, then recall it.",
    unavailableCopy: "These learning cards are not available yet.",
    interaction: {
      submissionMode: "immediate",
      submissionRequirement: {
        fields: ["selectedOptionId"],
        values: { phase: "recall" },
      },
      getPrimaryLabel: (exercise, response) => getLearnCardsLabel(response),
      getPrimaryTransition: (exercise, response) => getNextLearnCardsState(exercise, response),
    },
  },
  [CourseExerciseCategoryEnum.TwinCase]: TwinCaseConfig,
  [CourseExerciseCategoryEnum.IntuitionCheck]: IntuitionCheckConfig,
  [CourseExerciseCategoryEnum.NameIt]: NameItConfig,
  [CourseExerciseCategoryEnum.CourseChoice]: CourseChoiceConfig,
  [CourseExerciseCategoryEnum.InventFirst]: InventFirstConfig,
  [CourseExerciseCategoryEnum.LayerZoom]: LayerZoomConfig,
  [CourseExerciseCategoryEnum.Dialogue]: DialogueConfig,
  [CourseExerciseCategoryEnum.ConceptCard]: ConceptCardConfig,
  [CourseExerciseCategoryEnum.StoryWalkthrough]: StoryWalkthroughConfig,
  [CourseExerciseCategoryEnum.CommonTrap]: CommonTrapConfig,
  [CourseExerciseCategoryEnum.StorySerial]: StorySerialConfig,
  [CourseExerciseCategoryEnum.TwoDialSandbox]: TwoDialSandboxConfig,
  [CourseExerciseCategoryEnum.ExplorableModel]: ExplorableModelConfig,
  [CourseExerciseCategoryEnum.WhiteBearExperiment]: WhiteBearExperimentConfig,
  [CourseExerciseCategoryEnum.ParadoxCard]: ParadoxCardConfig,
  [CourseExerciseCategoryEnum.InteractiveReframe]: InteractiveReframeConfig,
  [CourseExerciseCategoryEnum.OneLineReveal]: OneLineRevealConfig,
  [CourseExerciseCategoryEnum.WhatIfMachine]: WhatIfMachineConfig,
  [CourseExerciseCategoryEnum.GuidedRecallChips]: GuidedRecallChipsConfig,
  [CourseExerciseCategoryEnum.TermChip]: TermChipConfig,
  [CourseExerciseCategoryEnum.GuidedDiscoveryTrail]: GuidedDiscoveryTrailConfig,
  [CourseExerciseCategoryEnum.TeachBackChain]: TeachBackChainConfig,
  [CourseExerciseCategoryEnum.RecallWarmup]: RecallWarmupConfig,
  [CourseExerciseCategoryEnum.SurgeDiagram]: SurgeDiagramConfig,
  [CourseExerciseCategoryEnum.FillBlank]: FillBlankConfig,
  [CourseExerciseCategoryEnum.CuriosityBet]: CuriosityBetConfig,
  [CourseExerciseCategoryEnum.PanicWaveCommit]: PanicWaveCommitConfig,
  [CourseExerciseCategoryEnum.WaveSequence]: WaveSequenceConfig,
  [CourseExerciseCategoryEnum.WaveOrdering]: WaveOrderingConfig,
  [CourseExerciseCategoryEnum.WaveScrubber]: WaveScrubberConfig,
  ...EIGHTH_BATCH_CATEGORY_CONFIGS,
  ...NINTH_BATCH_CATEGORY_CONFIGS,
  ...TENTH_BATCH_CATEGORY_CONFIGS,
  ...ELEVENTH_BATCH_CATEGORY_CONFIGS,
  ...FINAL_BATCH_CATEGORY_CONFIGS,
} as Partial<Record<CourseExerciseCategoryEnum, CourseExerciseCategoryConfig>>;
