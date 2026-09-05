/**
 * Journey Map Enums
 * All enumerated types for the journey/path system.
 * Single source of truth for status, type, and category values.
 */

/** Visual and interaction state of a path node */
export enum NodeStatus {
  LOCKED = "locked",
  ACTIVE = "active",
  COMPLETED = "completed",
  CLAIMED = "CLAIMED",
}

/** Functional type of a path node */
export enum NodeType {
  LESSON = "lesson",
  CHECKPOINT = "checkpoint",
  CHEST = "chest",
  MILESTONE = "milestone",
}

/** Visual and interaction state of a unified path node */
export enum NodeState {
  LOCKED = "locked",
  AVAILABLE = "available",
  CURRENT = "current",
  COMPLETED = "completed",
  CLAIMED = "claimed",
}

/** Icon displayed inside a path node */
export enum NodeIcon {
  STAR = "star",
  LOCK = "lock",
  CHECKMARK = "checkmark", // Keep for backwards compat
  CHECKPOINT = "checkpoint",
  BOOK = "book",
  CHEST = "chest",
  JOURNAL = "journal",
  QUIZ = "quiz",
  MOOD_CHECK = "mood_check",
  PRACTICE = "practice",
  BRAIN = "brain",
}

/** Types of rewards earned from journey nodes */
export enum JourneyRewardType {
  XP = "xp",
  GEMS = "gems",
  HEARTS = "hearts",
  ACHIEVEMENT = "achievement",
}

/** Color scheme for a unit header */
export enum UnitColorScheme {
  GREEN = "green",
  BLUE = "blue",
  PURPLE = "purple",
  ORANGE = "orange",
  PINK = "pink",
}

/** Mascot placement side relative to the path */
export enum MascotSide {
  LEFT = "left",
  RIGHT = "right",
}
