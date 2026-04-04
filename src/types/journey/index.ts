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

export type { JourneyReward, PathNodeData, NodePosition } from "./node";

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
