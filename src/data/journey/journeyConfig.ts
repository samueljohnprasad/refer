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

import { ColorThemeConfig, JourneyConfig, JourneySettingsConfig, NodeVariantConfig, SectionConfig, UnitConfig } from '@/src/types/journey';
import { NodeStatus, JourneyRewardType } from '@/src/types/journey/enums';

// ---------------------------------------------------------------------------
// 1. Node Variant Registry
// ---------------------------------------------------------------------------

const NODE_VARIANT_REGISTRY: Record<string, NodeVariantConfig> = {
    star: {
        key: 'star',
        label: 'Lesson',
        icons: {
            [NodeStatus.LOCKED]: { type: 'svg', value: 'star_locked' },
            [NodeStatus.ACTIVE]: { type: 'svg', value: 'star_active' },
            [NodeStatus.COMPLETED]: { type: 'svg', value: 'star_completed' },
        },
        colors: {
            [NodeStatus.LOCKED]: { fill: '#E5E5E5', border: '#CBD5E0' },
            [NodeStatus.ACTIVE]: { fill: '#58CC02', border: '#46A302', glow: 'rgba(88,204,2,0.4)' },
            [NodeStatus.COMPLETED]: { fill: '#FFC800', border: '#E5B400' },
        },
        rewards: [{ type: JourneyRewardType.XP, amount: 10, icon: '⚡' }],
        activeAnimation: 'breathing',
        showProgressRing: true,
    },

    checkpoint: {
        key: 'checkpoint',
        label: 'Checkpoint',
        icons: {
            [NodeStatus.LOCKED]: { type: 'svg', value: 'book_locked' },
            [NodeStatus.ACTIVE]: { type: 'svg', value: 'book_active' },
            [NodeStatus.COMPLETED]: { type: 'svg', value: 'checkmark_completed' },
        },
        colors: {
            [NodeStatus.LOCKED]: { fill: '#E5E5E5', border: '#CBD5E0' },
            [NodeStatus.ACTIVE]: { fill: '#58CC02', border: '#46A302', glow: 'rgba(88,204,2,0.4)' },
            [NodeStatus.COMPLETED]: { fill: '#FFC800', border: '#E5B400' },
        },
        rewards: [
            { type: JourneyRewardType.XP, amount: 25, icon: '⚡' },
            { type: JourneyRewardType.GEMS, amount: 5, icon: '💎' },
        ],
        activeAnimation: 'breathing',
        showProgressRing: true,
    },

    chest: {
        key: 'chest',
        label: 'Treasure Chest',
        icons: {
            [NodeStatus.LOCKED]: { type: 'svg', value: 'chest_locked' },
            [NodeStatus.ACTIVE]: { type: 'svg', value: 'chest_active' },
            [NodeStatus.COMPLETED]: { type: 'svg', value: 'chest_completed' },
        },
        colors: {
            [NodeStatus.LOCKED]: { fill: '#A0AEC0', border: '#718096' },
            [NodeStatus.ACTIVE]: { fill: '#8B5E3C', border: '#6B4226', glow: 'rgba(255,215,0,0.3)' },
            [NodeStatus.COMPLETED]: { fill: '#8B5E3C', border: '#6B4226' },
        },
        rewards: [
            { type: JourneyRewardType.XP, amount: 50, icon: '⚡' },
            { type: JourneyRewardType.GEMS, amount: 15, icon: '💎' },
            { type: JourneyRewardType.HEARTS, amount: 2, icon: '❤️' },
        ],
        size: 80,
        activeAnimation: 'shine',
        showProgressRing: false,
    },

    microphone: {
        key: 'microphone',
        label: 'Voice Exercise',
        icons: {
            [NodeStatus.LOCKED]: { type: 'svg', value: 'microphone_locked' },
            [NodeStatus.ACTIVE]: { type: 'svg', value: 'microphone_active' },
            [NodeStatus.COMPLETED]: { type: 'svg', value: 'microphone_completed' },
        },
        colors: {
            [NodeStatus.LOCKED]: { fill: '#E5E5E5', border: '#CBD5E0' },
            [NodeStatus.ACTIVE]: { fill: '#58CC02', border: '#46A302', glow: 'rgba(88,204,2,0.4)' },
            [NodeStatus.COMPLETED]: { fill: '#FFC800', border: '#E5B400' },
        },
        rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: '⚡' }],
        activeAnimation: 'breathing',
        showProgressRing: true,
    },

    video: {
        key: 'video',
        label: 'Video Exercise',
        icons: {
            [NodeStatus.LOCKED]: { type: 'svg', value: 'video_locked' },
            [NodeStatus.ACTIVE]: { type: 'svg', value: 'video_active' },
            [NodeStatus.COMPLETED]: { type: 'svg', value: 'video_completed' },
        },
        colors: {
            [NodeStatus.LOCKED]: { fill: '#E5E5E5', border: '#CBD5E0' },
            [NodeStatus.ACTIVE]: { fill: '#58CC02', border: '#46A302', glow: 'rgba(88,204,2,0.4)' },
            [NodeStatus.COMPLETED]: { fill: '#FFC800', border: '#E5B400' },
        },
        rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: '⚡' }],
        activeAnimation: 'breathing',
        showProgressRing: true,
    },

    gamepad: {
        key: 'gamepad',
        label: 'Interactive Exercise',
        icons: {
            [NodeStatus.LOCKED]: { type: 'svg', value: 'gamepad_locked' },
            [NodeStatus.ACTIVE]: { type: 'svg', value: 'gamepad_active' },
            [NodeStatus.COMPLETED]: { type: 'svg', value: 'gamepad_completed' },
        },
        colors: {
            [NodeStatus.LOCKED]: { fill: '#E5E5E5', border: '#CBD5E0' },
            [NodeStatus.ACTIVE]: { fill: '#58CC02', border: '#46A302', glow: 'rgba(88,204,2,0.4)' },
            [NodeStatus.COMPLETED]: { fill: '#FFC800', border: '#E5B400' },
        },
        rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: '⚡' }],
        activeAnimation: 'breathing',
        showProgressRing: true,
    },

    headphones: {
        key: 'headphones',
        label: 'Listening Exercise',
        icons: {
            [NodeStatus.LOCKED]: { type: 'svg', value: 'headphones_locked' },
            [NodeStatus.ACTIVE]: { type: 'svg', value: 'headphones_active' },
            [NodeStatus.COMPLETED]: { type: 'svg', value: 'headphones_completed' },
        },
        colors: {
            [NodeStatus.LOCKED]: { fill: '#E5E5E5', border: '#CBD5E0' },
            [NodeStatus.ACTIVE]: { fill: '#58CC02', border: '#46A302', glow: 'rgba(88,204,2,0.4)' },
            [NodeStatus.COMPLETED]: { fill: '#FFC800', border: '#E5B400' },
        },
        rewards: [{ type: JourneyRewardType.XP, amount: 15, icon: '⚡' }],
        activeAnimation: 'breathing',
        showProgressRing: true,
    },
};

// ---------------------------------------------------------------------------
// 2. Color Theme Registry
// ---------------------------------------------------------------------------

const COLOR_THEME_REGISTRY: Record<string, ColorThemeConfig> = {
    green: {
        key: 'green',
        headerGradient: ['#78C800', '#58CC02'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#78C800',
        dividerColor: '#58CC02',
        jumpButtonColor: '#58CC02',
    },
    blue: {
        key: 'blue',
        headerGradient: ['#1CB0F6', '#0A8FD4'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#1CB0F6',
        dividerColor: '#1CB0F6',
        jumpButtonColor: '#1CB0F6',
    },
    purple: {
        key: 'purple',
        headerGradient: ['#CE82FF', '#A855F7'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#CE82FF',
        dividerColor: '#A855F7',
        jumpButtonColor: '#A855F7',
    },
    orange: {
        key: 'orange',
        headerGradient: ['#FF9600', '#FF7800'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#FF9600',
        dividerColor: '#FF7800',
        jumpButtonColor: '#FF7800',
    },
    pink: {
        key: 'pink',
        headerGradient: ['#FF86D0', '#E05CB0'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#FF86D0',
        dividerColor: '#E05CB0',
        jumpButtonColor: '#E05CB0',
    },
    indigo: {
        key: 'indigo',
        headerGradient: ['#818CF8', '#6366F1'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#818CF8',
        dividerColor: '#6366F1',
        jumpButtonColor: '#6366F1',
    },
    teal: {
        key: 'teal',
        headerGradient: ['#20E3B2', '#00C895'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#20E3B2',
        dividerColor: '#00C895',
        jumpButtonColor: '#00C895',
    },
    rose: {
        key: 'rose',
        headerGradient: ['#FB7185', '#E11D48'],
        headerTextColor: '#FFFFFF',
        pathActiveColor: '#FB7185',
        dividerColor: '#E11D48',
        jumpButtonColor: '#E11D48',
    },
};

// ---------------------------------------------------------------------------
// 3. Mascot Message Registry
// ---------------------------------------------------------------------------

const MASCOT_MESSAGE_REGISTRY: Record<string, string> = {
    great_job: 'Great job! Keep going! 🎉',
    on_fire: "You're on fire! 🔥",
    almost_there: 'Almost there! 💪',
    incredible: 'Incredible progress! ⭐',
    star_learner: "You're a star learner! 🌟",
    way_to_go: 'Way to go! 🚀',
    keep_it_up: 'Keep it up! 👏',
    you_got_this: "You've got this! 💯",
    amazing_work: 'Amazing work! ✨',
    one_step: 'One step at a time! 🐾',
    section_1_intro: 'Hallo! Let\'s get started!',
    section_2_intro: 'Ready for the next challenge?',
    unit_1_encourage: 'Great start! Keep going!',
    unit_2_encourage: 'You\'re building strong skills!',
    unit_3_encourage: 'Advanced territory — impressive!',
};

// ---------------------------------------------------------------------------
// 4. Section Configs
// ---------------------------------------------------------------------------

const SECTION_CONFIGS: SectionConfig[] = [
    {
        id: 'section_1',
        sectionNumber: 1,
        title: 'Section 1',
        unitRangeLabel: 'Units 1 to 3',
        cardBackgroundColor: '#E0F2FE',
        mascot: {
            imageKey: 'owl_default',
            message: 'section_1_intro',
            side: 'right',
        },
        unitIds: ['11000000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000002', '33000000-0000-0000-0000-000000000003'],
    },
    {
        id: 'section_2',
        sectionNumber: 2,
        title: 'Journaling Fundamentals',
        unitRangeLabel: 'Units 4 to 5',
        cardBackgroundColor: '#F3E8FF',
        mascot: {
            imageKey: 'owl_excited',
            message: 'section_2_intro',
            side: 'right',
        },
        unitIds: ['44000000-0000-0000-0000-000000000004', '55000000-0000-0000-0000-000000000005'],
    },
];

// ---------------------------------------------------------------------------
// 5. Unit Configs
// ---------------------------------------------------------------------------

const UNIT_CONFIGS: UnitConfig[] = [
    {
        id: '11000000-0000-0000-0000-000000000001',
        unitNumber: 1,
        title: 'Use basic phrases',
        description: 'Use basic phrases, greet people',
        colorThemeKey: 'blue',
        sectionId: 'section_1',
        nodes: [
            { variantKey: 'star', taskId: 'task_0', taskType: 'thought_reframing' },
            { variantKey: 'star', taskId: 'task_1', taskType: 'journal_prompt' },
            { variantKey: 'checkpoint', taskId: 'task_2', taskType: 'mood_check_in' },
            { variantKey: 'gamepad', taskId: 'task_3', taskType: 'thought_catcher' },
            { variantKey: 'microphone', taskId: 'task_4', taskType: 'voice_journal' },
            { variantKey: 'chest', taskId: 'task_5', taskType: 'chest_reward' },
            { variantKey: 'video', taskId: 'task_6', taskType: 'mini_lesson' },
            { variantKey: 'headphones', taskId: 'task_7', taskType: 'gratitude_reframe' },
        ],
        mascotPlacements: [
            { afterNodeIndex: 3, side: 'right', messageKey: 'great_job' },
            { afterNodeIndex: 5, side: 'left', messageKey: 'on_fire' },
        ],
        divider: {
            title: 'Use basic phrases',
            showJumpHere: false,
        },
    },
    {
        id: '22000000-0000-0000-0000-000000000002',
        unitNumber: 2,
        title: 'Describe your family',
        description: 'Order food and drink, describe your family',
        colorThemeKey: 'purple',
        sectionId: 'section_1',
        nodes: [
            { variantKey: 'star', taskId: 'task_8', taskType: 'thought_reframing' },
            { variantKey: 'microphone', taskId: 'task_9', taskType: 'voice_journal' },
            { variantKey: 'star', taskId: 'task_10', taskType: 'journal_prompt' },
            { variantKey: 'checkpoint', taskId: 'task_11', taskType: 'mood_check_in' },
            { variantKey: 'video', taskId: 'task_12', taskType: 'mini_lesson' },
            { variantKey: 'chest', taskId: 'task_13', taskType: 'chest_reward' },
            { variantKey: 'headphones', taskId: 'task_14', taskType: 'gratitude_reframe' },
        ],
        mascotPlacements: [
            { afterNodeIndex: 3, side: 'right', messageKey: 'incredible' },
        ],
        divider: {
            title: 'Describe your family',
            showJumpHere: true,
        },
    },
    {
        id: '33000000-0000-0000-0000-000000000003',
        unitNumber: 3,
        title: 'Talk about travel',
        description: 'Use the past tense, talk about travel',
        colorThemeKey: 'teal',
        sectionId: 'section_1',
        nodes: [
            { variantKey: 'star', taskId: 'task_15', taskType: 'thought_reframing' },
            { variantKey: 'gamepad', taskId: 'task_16', taskType: 'thought_catcher' },
            { variantKey: 'checkpoint', taskId: 'task_17', taskType: 'mood_check_in' },
            { variantKey: 'microphone', taskId: 'task_18', taskType: 'voice_journal' },
            { variantKey: 'chest', taskId: 'task_19', taskType: 'chest_reward' },
            { variantKey: 'star', taskId: 'task_20', taskType: 'mini_lesson' },
        ],
        mascotPlacements: [
            { afterNodeIndex: 2, side: 'left', messageKey: 'star_learner' },
        ],
        divider: {
            title: 'Talk about travel',
            showJumpHere: true,
        },
        pathGeometry: 'sine',
    },
    {
        id: '44000000-0000-0000-0000-000000000004',
        unitNumber: 4,
        title: 'Start Journaling',
        description: 'Explore your thoughts and establish a journaling habit',
        colorThemeKey: 'rose',
        sectionId: 'section_2',
        nodes: [
            { variantKey: 'star', taskId: 'task_j1', taskType: 'journal_prompt' },
            { variantKey: 'star', taskId: 'task_j2', taskType: 'thought_reframing' },
            { variantKey: 'checkpoint', taskId: 'task_j3', taskType: 'mood_check_in' },
            { variantKey: 'microphone', taskId: 'task_j4', taskType: 'voice_journal' },
            { variantKey: 'chest', taskId: 'task_j5', taskType: 'chest_reward' },
        ],
        mascotPlacements: [
            { afterNodeIndex: 2, side: 'right', messageKey: 'amazing_work' },
        ],
        divider: {
            title: 'Journaling Basics',
            showJumpHere: false,
        },
        pathGeometry: 'organic',
    },
    {
        id: '55000000-0000-0000-0000-000000000005',
        unitNumber: 5,
        title: 'Deep Reflection',
        description: 'Challenge your perspectives with intensive reframing',
        colorThemeKey: 'pink',
        sectionId: 'section_2',
        nodes: [
            { variantKey: 'star', taskId: 'task_j6', taskType: 'journal_prompt' },
            { variantKey: 'headphones', taskId: 'task_j7', taskType: 'gratitude_reframe' },
            { variantKey: 'gamepad', taskId: 'task_j8', taskType: 'thought_catcher' },
            { variantKey: 'chest', taskId: 'task_j9', taskType: 'chest_reward' },
        ],
        mascotPlacements: [
            { afterNodeIndex: 1, side: 'left', messageKey: 'keep_it_up' },
        ],
        divider: {
            title: 'Deep Reflection',
            showJumpHere: true,
        },
        pathGeometry: 'zigzag',
    },
];

// ---------------------------------------------------------------------------
// 6. Global Settings
// ---------------------------------------------------------------------------

const JOURNEY_SETTINGS: JourneySettingsConfig = {
    defaultNodeSize: 64,
    chestNodeSize: 80,
    verticalGap: 120,
    amplitudeFactor: 0.22,
    waveFrequency: 2.5,
    pathStrokeWidth: 10,
    pathInactiveColor: '#E0E0E0',
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
    units: UNIT_CONFIGS,
    mascotMessages: MASCOT_MESSAGE_REGISTRY,
    settings: JOURNEY_SETTINGS,
};
