/**
 * Default Journey Configuration
 * The single source of truth for all journey map UI configuration.
 *
 * This is a pure data object — no functions, no component imports.
 * Every visual property (node icons, colors, rewards, section titles,
 * mascot messages, divider text) lives here.
 *
 * Adding a new node type = one entry in NODE_VARIANT_REGISTRY.
 * Adding a new color theme = one entry in COLOR_THEME_REGISTRY.
 * Adding a new section/unit = append to SECTION_CONFIGS / UNIT_CONFIGS.
 */

import {
  ColorThemeConfig,
  JourneyConfig,
  JourneySettingsConfig,
  NodeVariantConfig,
  SectionConfig,
  UnitConfig,
} from "@/src/types/journey";
import { NodeStatus, JourneyRewardType } from "@/src/types/journey/enums";

// ---------------------------------------------------------------------------
// 1. Node Variant Registry
// ---------------------------------------------------------------------------

const NODE_VARIANT_REGISTRY: Record<string, NodeVariantConfig> = {
  star: {
    key: "star",
    label: "Lesson",
    icons: {
      [NodeStatus.LOCKED]: { type: "hugeicons", value: "star_locked" },
      [NodeStatus.ACTIVE]: { type: "hugeicons", value: "star" },
      [NodeStatus.COMPLETED]: { type: "hugeicons", value: "star" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#58CC02",
        border: "#46A302",
        glow: "rgba(88,204,2,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#FFC800", border: "#E5B400" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 10, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  checkpoint: {
    key: "checkpoint",
    label: "Checkpoint",
    icons: {
      [NodeStatus.LOCKED]: { type: "hugeicons", value: "checkpoint_locked" },
      [NodeStatus.ACTIVE]: { type: "hugeicons", value: "checkpoint" },
      [NodeStatus.COMPLETED]: { type: "hugeicons", value: "checkpoint" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#58CC02",
        border: "#46A302",
        glow: "rgba(88,204,2,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#FFC800", border: "#E5B400" },
    },
    rewards: [
      { type: JourneyRewardType.XP, amount: 25, icon: "⚡" },
      { type: JourneyRewardType.GEMS, amount: 5, icon: "💎" },
    ],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  chest: {
    key: "chest",
    label: "Treasure Chest",
    icons: {
      [NodeStatus.LOCKED]: { type: "hugeicons", value: "chest_locked" },
      [NodeStatus.ACTIVE]: { type: "hugeicons", value: "chest" },
      [NodeStatus.COMPLETED]: { type: "hugeicons", value: "chest" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#8B5E3C",
        border: "#6B4226",
        glow: "rgba(255,215,0,0.3)",
      },
      [NodeStatus.COMPLETED]: { fill: "#D4A574", border: "#B8860B" },
    },
    rewards: [
      { type: JourneyRewardType.XP, amount: 50, icon: "⚡" },
      { type: JourneyRewardType.GEMS, amount: 15, icon: "💎" },
      { type: JourneyRewardType.HEARTS, amount: 2, icon: "❤️" },
    ],
    size: 72,
    activeAnimation: "shine",
    showProgressRing: false,
  },

  // ── Mental Health Node Variants ──────────────────────────────────────

  learn: {
    key: "learn",
    label: "Learn",
    icons: {
      [NodeStatus.LOCKED]: { type: "emoji", value: "📖" },
      [NodeStatus.ACTIVE]: { type: "emoji", value: "📖" },
      [NodeStatus.COMPLETED]: { type: "emoji", value: "📖" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#3B82F6",
        border: "#2563EB",
        glow: "rgba(59,130,246,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#93C5FD", border: "#3B82F6" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 10, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  exercise: {
    key: "exercise",
    label: "Exercise",
    icons: {
      [NodeStatus.LOCKED]: { type: "emoji", value: "🏋️" },
      [NodeStatus.ACTIVE]: { type: "emoji", value: "🏋️" },
      [NodeStatus.COMPLETED]: { type: "emoji", value: "🏋️" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#16A34A",
        border: "#15803D",
        glow: "rgba(22,163,74,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#86EFAC", border: "#16A34A" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  journal: {
    key: "journal",
    label: "Journal",
    icons: {
      [NodeStatus.LOCKED]: { type: "emoji", value: "✍️" },
      [NodeStatus.ACTIVE]: { type: "emoji", value: "✍️" },
      [NodeStatus.COMPLETED]: { type: "emoji", value: "✍️" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#8B5CF6",
        border: "#7C3AED",
        glow: "rgba(139,92,246,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#C4B5FD", border: "#8B5CF6" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  quiz: {
    key: "quiz",
    label: "Quiz",
    icons: {
      [NodeStatus.LOCKED]: { type: "emoji", value: "❓" },
      [NodeStatus.ACTIVE]: { type: "emoji", value: "❓" },
      [NodeStatus.COMPLETED]: { type: "emoji", value: "❓" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#D97706",
        border: "#B45309",
        glow: "rgba(217,119,6,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#FDE68A", border: "#D97706" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  mood_check: {
    key: "mood_check",
    label: "Mood Check",
    icons: {
      [NodeStatus.LOCKED]: { type: "emoji", value: "🪞" },
      [NodeStatus.ACTIVE]: { type: "emoji", value: "🪞" },
      [NodeStatus.COMPLETED]: { type: "emoji", value: "🪞" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#0D9488",
        border: "#0F766E",
        glow: "rgba(13,148,136,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#99F6E4", border: "#0D9488" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 5, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: false,
    shape: "circle",
  },

  microphone: {
    key: "microphone",
    label: "Voice Exercise",
    icons: {
      [NodeStatus.LOCKED]: { type: "hugeicons", value: "microphone_locked" },
      [NodeStatus.ACTIVE]: { type: "hugeicons", value: "microphone" },
      [NodeStatus.COMPLETED]: { type: "hugeicons", value: "microphone" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#58CC02",
        border: "#46A302",
        glow: "rgba(88,204,2,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#FFC800", border: "#E5B400" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  video: {
    key: "video",
    label: "Video Exercise",
    icons: {
      [NodeStatus.LOCKED]: { type: "hugeicons", value: "video_locked" },
      [NodeStatus.ACTIVE]: { type: "hugeicons", value: "video" },
      [NodeStatus.COMPLETED]: { type: "hugeicons", value: "video" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#58CC02",
        border: "#46A302",
        glow: "rgba(88,204,2,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#FFC800", border: "#E5B400" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  gamepad: {
    key: "gamepad",
    label: "Interactive Exercise",
    icons: {
      [NodeStatus.LOCKED]: { type: "hugeicons", value: "gamepad_locked" },
      [NodeStatus.ACTIVE]: { type: "hugeicons", value: "gamepad" },
      [NodeStatus.COMPLETED]: { type: "hugeicons", value: "gamepad" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#58CC02",
        border: "#46A302",
        glow: "rgba(88,204,2,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#FFC800", border: "#E5B400" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },

  headphones: {
    key: "headphones",
    label: "Listening Exercise",
    icons: {
      [NodeStatus.LOCKED]: { type: "hugeicons", value: "headphones_locked" },
      [NodeStatus.ACTIVE]: { type: "hugeicons", value: "headphones" },
      [NodeStatus.COMPLETED]: { type: "hugeicons", value: "headphones" },
    },
    colors: {
      [NodeStatus.LOCKED]: { fill: "#E5E5E5", border: "#AFAFAF" },
      [NodeStatus.ACTIVE]: {
        fill: "#58CC02",
        border: "#46A302",
        glow: "rgba(88,204,2,0.4)",
      },
      [NodeStatus.COMPLETED]: { fill: "#FFC800", border: "#E5B400" },
    },
    rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: "⚡" }],
    activeAnimation: "breathing",
    showProgressRing: true,
  },
};

// ---------------------------------------------------------------------------
// 2. Color Theme Registry
// ---------------------------------------------------------------------------

const COLOR_THEME_REGISTRY: Record<string, ColorThemeConfig> = {
  green: {
    key: "green",
    headerGradient: ["#7E9F76", "#6C8C65"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#7E9F76",
    dividerColor: "#8DAA86",
    jumpButtonColor: "#6C8C65",
  },
  blue: {
    key: "blue",
    headerGradient: ["#6D96B8", "#587E9D"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#6D96B8",
    dividerColor: "#8AA9C1",
    jumpButtonColor: "#587E9D",
  },
  purple: {
    key: "purple",
    headerGradient: ["#9084B5", "#796C9E"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#9084B5",
    dividerColor: "#A698C3",
    jumpButtonColor: "#796C9E",
  },
  orange: {
    key: "orange",
    headerGradient: ["#BE8A64", "#A97552"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#BE8A64",
    dividerColor: "#D0A27E",
    jumpButtonColor: "#A97552",
  },
  pink: {
    key: "pink",
    headerGradient: ["#BC8EA0", "#A97889"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#BC8EA0",
    dividerColor: "#D0A8B6",
    jumpButtonColor: "#A97889",
  },
  indigo: {
    key: "indigo",
    headerGradient: ["#7A88B6", "#64729D"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#7A88B6",
    dividerColor: "#96A2C8",
    jumpButtonColor: "#64729D",
  },
  teal: {
    key: "teal",
    headerGradient: ["#6D9E95", "#57857D"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#6D9E95",
    dividerColor: "#88B2AA",
    jumpButtonColor: "#57857D",
  },
  rose: {
    key: "rose",
    headerGradient: ["#B57A81", "#9B646A"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#B57A81",
    dividerColor: "#C9989E",
    jumpButtonColor: "#9B646A",
  },
  slate: {
    key: "slate",
    headerGradient: ["#7E8B98", "#697684"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#7E8B98",
    dividerColor: "#9AA5B1",
    jumpButtonColor: "#697684",
  },
  amber: {
    key: "amber",
    headerGradient: ["#B79763", "#9F8050"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#B79763",
    dividerColor: "#CCAE81",
    jumpButtonColor: "#9F8050",
  },
  plum: {
    key: "plum",
    headerGradient: ["#9C7C9E", "#836585"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#9C7C9E",
    dividerColor: "#B49AB5",
    jumpButtonColor: "#836585",
  },
  moss: {
    key: "moss",
    headerGradient: ["#849678", "#6D8062"],
    headerTextColor: "#FFFFFF",
    pathActiveColor: "#849678",
    dividerColor: "#9CAD92",
    jumpButtonColor: "#6D8062",
  },
};

// ---------------------------------------------------------------------------
// 3. Mascot Message Registry
// ---------------------------------------------------------------------------

const MASCOT_MESSAGE_REGISTRY: Record<string, string> = {
  great_job: "Great job! Keep going! 🎉",
  on_fire: "You're on fire! 🔥",
  almost_there: "Almost there! 💪",
  incredible: "Incredible progress! ⭐",
  star_learner: "You're a star learner! 🌟",
  way_to_go: "Way to go! 🚀",
  keep_it_up: "Keep it up! 👏",
  you_got_this: "You've got this! 💯",
  amazing_work: "Amazing work! ✨",
  one_step: "One step at a time! 🐾",
  section_1_intro: "Hallo! Let's get started!",
  section_2_intro: "Ready for the next challenge?",
  unit_1_encourage: "Great start! Keep going!",
  unit_2_encourage: "You're building strong skills!",
  unit_3_encourage: "Advanced territory — impressive!",
};

// ---------------------------------------------------------------------------
// 4. Section Configs
// @deprecated — Section metadata is now served by get_section_map RPC.
// Kept for backward compatibility with JourneyConfigContext consumers
// (SectionOverviewSheet, useJourneyFlashList, JourneyMapContainer).
// Will be removed once those consumers are migrated to sectionMap atoms.
// ---------------------------------------------------------------------------

const SECTION_CONFIGS: SectionConfig[] = [
  {
    id: "section_1",
    sectionNumber: 1,
    title: "Section 1",
    unitRangeLabel: "Units 1 to 3",
    cardBackgroundColor: "#E0F2FE",
    mascot: {
      imageKey: "owl_default",
      message: "section_1_intro",
      side: "right",
    },
    unitIds: [
      "11000000-0000-0000-0000-000000000001",
      "22000000-0000-0000-0000-000000000002",
      "33000000-0000-0000-0000-000000000003",
    ],
  },
  {
    id: "section_2",
    sectionNumber: 2,
    title: "Journaling Fundamentals",
    unitRangeLabel: "Units 4 to 5",
    cardBackgroundColor: "#F3E8FF",
    mascot: {
      imageKey: "owl_excited",
      message: "section_2_intro",
      side: "right",
    },
    unitIds: [
      "44000000-0000-0000-0000-000000000004",
      "55000000-0000-0000-0000-000000000005",
    ],
  },
];

// ---------------------------------------------------------------------------
// 6. Global Settings
// ---------------------------------------------------------------------------

const JOURNEY_SETTINGS: JourneySettingsConfig = {
  defaultNodeSize: 64,
  chestNodeSize: 80,
  verticalGap: 250,
  amplitudeFactor: 0.22,
  waveFrequency: 2.5,
  pathStrokeWidth: 10,
  pathInactiveColor: "#E0E0E0",
  topPadding: 100,
  bottomPadding: 200,
  progressRingGap: 4,
  progressRingStroke: 6,
};

// ---------------------------------------------------------------------------
// 7. Composed Master Config
// ---------------------------------------------------------------------------

export const DEFAULT_JOURNEY_CONFIG: JourneyConfig = {
  nodeVariants: NODE_VARIANT_REGISTRY,
  colorThemes: COLOR_THEME_REGISTRY,
  sections: SECTION_CONFIGS,
  units: [],
  mascotMessages: MASCOT_MESSAGE_REGISTRY,
  settings: JOURNEY_SETTINGS,
};
