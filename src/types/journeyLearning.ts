export enum V1LearningFormatEnum {
  GuidedRecall = "guided_recall",
  ScenarioWhy = "scenario_why",
  CloseDiscrimination = "close_discrimination",
}

export enum V1ExerciseCategoryEnum {
  Recall = "recall",
  Scenario = "scenario",
  Discrimination = "discrimination",
}

export enum V1ResponseModeEnum {
  WordBank = "word_bank",
  Choice = "choice",
}

export enum V1SupportLevelEnum {
  None = "none",
  Clue = "clue",
  Easier = "easier",
  Worked = "worked",
}

export enum V1ActivityResolutionEnum {
  Unresolved = "unresolved",
  IndependentComplete = "independent_complete",
  SupportedComplete = "supported_complete",
  Skipped = "skipped",
}

export enum V1ReadinessStageEnum {
  Introduced = "introduced",
  Practising = "practising",
  Ready = "ready",
}

export enum V1EvidenceStrengthEnum {
  Qualifying = "qualifying",
  Supported = "supported",
  Incorrect = "incorrect",
}

export enum V1CheckStatusEnum {
  Idle = "idle",
  Success = "success",
  Error = "error",
}

export enum V1ScenarioMissingPartEnum {
  Situation = "situation",
  Reason = "reason",
  Both = "both",
}

export enum V1NodeSessionKindEnum {
  V1Session = "v1_session",
}

export type V1LearningFormat = `${V1LearningFormatEnum}`;
export type V1ExerciseCategory = `${V1ExerciseCategoryEnum}`;
export type V1ResponseMode = `${V1ResponseModeEnum}`;
export type V1SupportLevel = `${V1SupportLevelEnum}`;
export type V1ActivityResolution = `${V1ActivityResolutionEnum}`;
export type V1ReadinessStage = `${V1ReadinessStageEnum}`;
export type V1EvidenceStrength = `${V1EvidenceStrengthEnum}`;
export type V1CheckStatus = `${V1CheckStatusEnum}`;
export type V1NodeSessionKind = `${V1NodeSessionKindEnum}`;

export interface V1LearningFeedback {
  correct: string;
  incorrect: string;
  clue?: string;
  easier?: string;
  workedAnswer: string;
}

export interface V1LearningSupport {
  clue: string;
  easier: string;
  workedAnswer: string;
}

export type V1SupportKey =
  | V1SupportLevelEnum.Clue
  | V1SupportLevelEnum.Easier
  | V1SupportLevelEnum.Worked;

export interface V1LearningItemBase {
  skillId: string;
  itemId: string;
  itemVersion: number;
  variantFamilyId: string;
  variantId: string;
  format: V1LearningFormat;
  category: V1ExerciseCategory;
  difficulty: 1 | 2 | 3;
  prompt: string;
  feedback: V1LearningFeedback;
  support: V1LearningSupport;
  reviewEligible: boolean;
}

export interface V1GuidedRecallChip {
  id: string;
  text: string;
}

export interface V1GuidedRecallItem extends V1LearningItemBase {
  format: V1LearningFormatEnum.GuidedRecall;
  category: V1ExerciseCategoryEnum.Recall;
  chips: V1GuidedRecallChip[];
  answerChipIds: string[];
}

export interface V1ScenarioOption {
  id: string;
  label: string;
}

export interface V1ScenarioWhyItem extends V1LearningItemBase {
  format: V1LearningFormatEnum.ScenarioWhy;
  category: V1ExerciseCategoryEnum.Scenario;
  situationOptions: V1ScenarioOption[];
  reasonOptions: V1ScenarioOption[];
  correctSituationId: string;
  correctReasonId: string;
}

export interface V1DiscriminationOption {
  id: string;
  label: string;
  misconceptionCode?: string;
}

export interface V1CloseDiscriminationItem extends V1LearningItemBase {
  format: V1LearningFormatEnum.CloseDiscrimination;
  category: V1ExerciseCategoryEnum.Discrimination;
  options: V1DiscriminationOption[];
  correctOptionId: string;
}

export type V1LearningItem =
  | V1GuidedRecallItem
  | V1ScenarioWhyItem
  | V1CloseDiscriminationItem;

export interface V1GuidedRecallResponse {
  format: V1LearningFormatEnum.GuidedRecall;
  selectedChipIds: string[];
  responseMode: V1ResponseModeEnum.WordBank;
  supportLevel: V1SupportLevel;
}

export interface V1ScenarioWhyResponse {
  format: V1LearningFormatEnum.ScenarioWhy;
  selectedSituationId: string | null;
  selectedReasonId: string | null;
  responseMode: V1ResponseModeEnum.Choice;
  supportLevel: V1SupportLevel;
}

export interface V1CloseDiscriminationResponse {
  format: V1LearningFormatEnum.CloseDiscrimination;
  selectedOptionId: string | null;
  responseMode: V1ResponseModeEnum.Choice;
  supportLevel: V1SupportLevel;
}

export type V1LearningResponse =
  | V1GuidedRecallResponse
  | V1ScenarioWhyResponse
  | V1CloseDiscriminationResponse;

export interface V1EvaluationResult {
  itemId: string;
  itemVersion: number;
  variantFamilyId: string;
  variantId: string;
  skillId: string;
  format: V1LearningFormat;
  category: V1ExerciseCategory;
  responseMode: V1ResponseMode;
  supportLevel: V1SupportLevel;
  isCorrect: boolean;
  isQualifying: boolean;
  evidenceStrength: V1EvidenceStrength;
  feedbackText: string;
  misconceptionCode?: string;
  missingPart?: V1ScenarioMissingPartEnum;
}

export interface V1SessionActivityState {
  item: V1LearningItem;
  response: V1LearningResponse | null;
  supportLevel: V1SupportLevel;
  missCount: number;
  resolution: V1ActivityResolution;
  lastEvaluation: V1EvaluationResult | null;
}

export interface V1SkillEvidence {
  skillId: string;
  format: V1LearningFormat;
  category: V1ExerciseCategory;
  responseMode: V1ResponseMode;
  variantFamilyId: string;
  variantId: string;
  supportLevel: V1SupportLevel;
  isCorrect: boolean;
  isQualifying: boolean;
  occurredAt: string;
  isReview?: boolean;
}

export interface V1SkillMastery {
  skillId: string;
  stage: V1ReadinessStage;
  needsReview: boolean;
  qualifyingAttempts: V1SkillEvidence[];
  readyAt: string | null;
  nextReviewAt: string | null;
}

export interface V1ReviewCandidate {
  skillId: string;
  dueAt: string;
  stage: V1ReadinessStage;
  needsReview: boolean;
}

export interface StartV1LearningSessionArgs {
  courseId: string;
  nodeId: string;
}

export type V1LearningSessionResult =
  {
    kind: V1NodeSessionKindEnum.V1Session;
    nodeId: string;
    sessionId: string;
    exerciseIds: string[];
    requiredResolvedItemCount: number;
    source: "mock";
  };
