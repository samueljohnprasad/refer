/**
 * Journey Map Type System
 * Barrel export for all journey-related types and enums.
 */

export {
  NodeStatus,
  NodeType,
  NodeIcon,
  JourneyRewardType,
  UnitColorScheme,
  MascotSide,
} from "./enums";

export type {
  JourneyReward,
  PathNodeData,
  NodePosition,
  JourneyNode,
  JourneyDividerItem,
  JourneyMascotItem,
  JourneyFlashListItem,
  JourneyListItemType,
} from "./node";

export type { MascotPlacement, UnitData } from "./unit";

export type { JourneyStats, JourneyState } from "./state";

export type {
  JourneyTemplate,
  JourneyTemplateUnit,
  JourneyTemplateNode,
  TemplateMascotPlacement,
  JourneyListItem,
} from "./template";

export type {
  UserJourneyProgress,
  UserJourneyEnrollment,
  UserNodeProgress,
  CompleteNodeResponse,
} from "./progress";

export type {
  NodeIconConfig,
  NodeColorConfig,
  NodeVariantConfig,
  ColorThemeConfig,
  SectionMascotConfig,
  SectionConfig,
  UnitDividerConfig,
  UnitNodeConfig,
  MascotPlacementConfig,
  UnitConfig,
  JourneySettingsConfig,
  JourneyConfig,
} from "./config";

// ---------------------------------------------------------------------------
// Mental Health Journey Types
// ---------------------------------------------------------------------------

export { MentalHealthNodeType, STREAK_MILESTONES } from "./mentalHealth";

export type {
  // Node content types
  LearnCard,
  LearnContent,
  ExerciseStep,
  ExerciseInputType,
  ExerciseContent,
  BreathingConfig,
  BodyScanArea,
  BodyScanConfig,
  JournalContent,
  QuizQuestion,
  QuizContent,
  MoodCheckContent,
  ChestRarity,
  ChestContent,
  NextJourneySuggestion,
  CheckpointContent,
  PracticeContent,
  AIInsightContent,
  NodeContent,
  // Extended template types
  JourneyCategory,
  JourneyDifficulty,
  MentalHealthJourneyFields,
  MentalHealthTemplateNode,
  // Response data types
  ExerciseResponseData,
  JournalResponseData,
  QuizResponseData,
  MoodCheckResponseData,
  ChestResponseData,
  NodeResponseData,
  // User streak types
  UserStreak,
  UpdateStreakResponse,
  // Insight Points types
  IPSource,
  IPLedgerEntry,
  IPTotals,
  // Node completion types
  UserNodeCompletion,
  CompleteNodePayload as MHCompleteNodePayload,
  CompleteNodeResult,
  // Catalog types
  MentalHealthJourneyListItem,
} from "./mentalHealth";

// ---------------------------------------------------------------------------
// Section Map Types (lazy-loaded architecture)
// ---------------------------------------------------------------------------

export type {
  ServerNodeData,
  SectionData,
  SectionUnitData,
  SectionListItem,
  SectionOverviewItem,
  SectionNodeProgress,
  SectionEnrollment,
  SectionJourneyMeta,
  SectionViewMode,
  SectionMapResponse,
  NodeContentResponse,
} from "./sectionMap";

// ---------------------------------------------------------------------------
// Multi-Journey Enrollment Types
// ---------------------------------------------------------------------------

export type {
  EnrollmentStatus,
  JourneyEnrollment,
  MultiJourneyState,
  JourneySwitcherItem,
} from "./enrollment";
