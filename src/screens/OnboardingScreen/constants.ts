import {
  OnboardingStepConfig,
  OnboardingChecklistItem,
  QuizOption,
  MotivationAnswer,
  StressLevel,
  GoalCardConfig,
  LoadingTask,
  PricingPlanConfig,
  FeelingOption,
  JourneyMapNode,
} from "./types";

const ONBOARDING_BACKGROUND = "#FFFFFF";

export const ONBOARDING_STEPS: readonly OnboardingStepConfig[] = [
  {
    name: "welcome",
    stage: 1,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "LET'S BEGIN",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "welcome",
  },
  {
    name: "mascot_greeting",
    stage: 1,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "I'M READY",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "mascot_greeting",
  },
  {
    name: "quiz_motivation",
    stage: 2,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "quiz_motivation",
  },
  {
    name: "quiz_stress_level",
    stage: 2,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "quiz_stress_level",
  },
  {
    name: "daily_goal",
    stage: 3,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "SET MY GOAL",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "daily_goal",
    isContinueEnabled: (formData) => formData.dailyGoal !== undefined,
  },
  {
    name: "building_journey",
    stage: 4,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: false,
    continueButtonLabel: "",
    autoAdvance: true,
    canSkip: false,
    analyticsLabel: "building_journey",
  },
  {
    name: "plan_reveal",
    stage: 4,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "START DAY 1",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "plan_reveal",
  },
  {
    name: "pact_signing",
    stage: 4,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "pact_signing",
  },
  {
    name: "mood_check_lesson",
    stage: 5,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "mood_check_lesson",
    isContinueEnabled: (formData) => formData.selectedFeeling !== undefined,
  },
  {
    name: "ai_insight",
    stage: 5,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "ai_insight",
  },
  {
    name: "lesson_complete",
    stage: 5,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "lesson_complete",
  },
  {
    name: "journey_map",
    stage: 6,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "journey_map",
  },
  {
    name: "letter_from_future",
    stage: 6,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "I NEEDED THIS",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "letter_from_future",
  },
  {
    name: "soft_paywall",
    stage: 7,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: false,
    continueButtonLabel: "",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "soft_paywall",
  },
  {
    name: "notification_permission",
    stage: 7,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "ENABLE REMINDERS",
    autoAdvance: false,
    canSkip: true,
    analyticsLabel: "notification_permission",
  },
  {
    name: "welcome_to_happy",
    stage: 7,
    backgroundColor: ONBOARDING_BACKGROUND,
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "BEGIN MY JOURNEY",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "welcome_to_happy",
  },
] as const;

export const TOTAL_ONBOARDING_STEPS = ONBOARDING_STEPS.length;

export const MOTIVATION_OPTIONS: readonly QuizOption<MotivationAnswer>[] = [
  {
    id: "anxiety",
    emoji: "🌊",
    title: "Manage anxiety",
    subtitle: "Quiet the racing thoughts",
  },
  {
    id: "mood",
    emoji: "☁️",
    title: "Lift my mood",
    subtitle: "Find lightness in heavy days",
  },
  {
    id: "stress",
    emoji: "🪨",
    title: "Handle stress better",
    subtitle: "Build resilience for hard moments",
  },
  {
    id: "self_understanding",
    emoji: "🪞",
    title: "Understand myself",
    subtitle: "Patterns, triggers, and growth",
  },
  {
    id: "sleep",
    emoji: "🌙",
    title: "Sleep & rest better",
    subtitle: "Wind-down rituals that work",
  },
];

export const STRESS_LEVEL_OPTIONS: readonly QuizOption<StressLevel>[] = [
  {
    id: "light",
    emoji: "🌤️",
    title: "Light breeze",
    subtitle: "Manageable — I just want to stay ahead of it",
  },
  {
    id: "moderate",
    emoji: "🌥️",
    title: "Moderate weight",
    subtitle: "It comes and goes, some days harder than others",
  },
  {
    id: "heavy",
    emoji: "🌧️",
    title: "Heavy clouds",
    subtitle: "It affects my daily life significantly",
  },
  {
    id: "overwhelming",
    emoji: "⛈️",
    title: "Overwhelming storm",
    subtitle: "Some days I don't know how to start",
  },
];

export const MOTIVATION_FOLLOWUP: Record<
  MotivationAnswer,
  {
    question: string;
    subtext: string;
    options: readonly QuizOption<StressLevel>[];
  }
> = {
  anxiety: {
    question: "How intense is your anxiety",
    subtext: "This helps us set the right pace — no judgment here.",
    options: [
      {
        id: "light",
        emoji: "🌤️",
        title: "Background hum",
        subtitle: "It's there but I can still function well",
      },
      {
        id: "moderate",
        emoji: "🌥️",
        title: "Regular tension",
        subtitle: "Noticeable most days, sometimes hard to shake",
      },
      {
        id: "heavy",
        emoji: "🌧️",
        title: "Constant weight",
        subtitle: "Anxiety is with me most of the day",
      },
      {
        id: "overwhelming",
        emoji: "⛈️",
        title: "Hard to manage",
        subtitle: "Some days it takes over completely",
      },
    ],
  },
  mood: {
    question: "How heavy are your low moods",
    subtext: "Knowing this helps us match the right lessons to where you are.",
    options: [
      {
        id: "light",
        emoji: "🌤️",
        title: "Occasional dips",
        subtitle: "I feel off sometimes but bounce back",
      },
      {
        id: "moderate",
        emoji: "🌥️",
        title: "Regular lows",
        subtitle: "Low periods come and go through the week",
      },
      {
        id: "heavy",
        emoji: "🌧️",
        title: "Most days feel heavy",
        subtitle: "It's hard to find lightness most of the time",
      },
      {
        id: "overwhelming",
        emoji: "⛈️",
        title: "Hard to get through",
        subtitle: "Some days just getting through feels like a lot",
      },
    ],
  },
  stress: {
    question: "How much pressure are you carrying",
    subtext: "This helps us calibrate the right pace and tools for you.",
    options: [
      {
        id: "light",
        emoji: "🌤️",
        title: "Manageable load",
        subtitle: "Busy but mostly in control",
      },
      {
        id: "moderate",
        emoji: "🌥️",
        title: "Building pressure",
        subtitle: "It piles up and I don't always decompress",
      },
      {
        id: "heavy",
        emoji: "🌧️",
        title: "Constant pressure",
        subtitle: "Stress is a daily companion right now",
      },
      {
        id: "overwhelming",
        emoji: "⛈️",
        title: "Pushed to the limit",
        subtitle: "Running on empty most of the time",
      },
    ],
  },
  self_understanding: {
    question: "How lost do you feel right now",
    subtext: "There's no wrong answer — we'll meet you exactly where you are.",
    options: [
      {
        id: "light",
        emoji: "🌤️",
        title: "Mildly curious",
        subtitle: "I mostly know myself, just want more clarity",
      },
      {
        id: "moderate",
        emoji: "🌥️",
        title: "Some confusion",
        subtitle: "I have patterns I can't quite explain",
      },
      {
        id: "heavy",
        emoji: "🌧️",
        title: "Often uncertain",
        subtitle: "I find myself reacting and not understanding why",
      },
      {
        id: "overwhelming",
        emoji: "⛈️",
        title: "Quite lost",
        subtitle: "It's hard to know what I actually feel or want",
      },
    ],
  },
  sleep: {
    question: "How disrupted is your sleep",
    subtext: "This shapes the wind-down practices we'll build for you.",
    options: [
      {
        id: "light",
        emoji: "🌤️",
        title: "Slightly restless",
        subtitle: "Occasional bad nights, mostly okay",
      },
      {
        id: "moderate",
        emoji: "🌥️",
        title: "Inconsistent",
        subtitle: "Sleep varies a lot — good nights and bad nights",
      },
      {
        id: "heavy",
        emoji: "🌧️",
        title: "Regularly poor",
        subtitle: "I rarely feel rested in the morning",
      },
      {
        id: "overwhelming",
        emoji: "⛈️",
        title: "Severely disrupted",
        subtitle: "Sleep is a real problem affecting my daily life",
      },
    ],
  },
};

export const DAILY_GOAL_CONTEXT: Record<
  MotivationAnswer,
  {
    headline: string;
    subtext: string;
    testimonial: {
      initial: string;
      name: string;
      age: number;
      quote: string;
      tone: "lavender" | "sage" | "sky" | "terracotta";
    };
  }
> = {
  anxiety: {
    headline: "How long can you sit with",
    subtext:
      "Even 3 minutes of daily reflection can interrupt an anxiety spiral. Start where you are.",
    testimonial: {
      initial: "S",
      name: "Sara",
      age: 31,
      quote:
        '"3 minutes felt embarrassingly short. But showing up daily for 3 minutes did more than my once-a-week 30-minute attempts ever did."',
      tone: "lavender",
    },
  },
  mood: {
    headline: "How much time can you protect for",
    subtext:
      "Consistency matters more than length. A small daily habit outlasts big occasional ones.",
    testimonial: {
      initial: "M",
      name: "Marcus",
      age: 34,
      quote:
        '"5 minutes every morning became the thing I actually looked forward to. It set a different tone for the whole day."',
      tone: "sage",
    },
  },
  stress: {
    headline: "How much time can you reclaim for",
    subtext:
      "A short decompression window beats a long one you never actually do. Be honest.",
    testimonial: {
      initial: "P",
      name: "Priya",
      age: 29,
      quote:
        '"I thought I needed an hour of self-care. Turns out 5 minutes of structured reflection lowered my cortisol more than scrolling for an hour."',
      tone: "terracotta",
    },
  },
  self_understanding: {
    headline: "How much time will you give",
    subtext:
      "Self-understanding builds slowly. Even short, consistent reflection compounds over time.",
    testimonial: {
      initial: "R",
      name: "Riley",
      age: 26,
      quote:
        '"I started with 5 minutes just to see patterns. Six weeks later I finally understood why I kept sabotaging myself."',
      tone: "sky",
    },
  },
  sleep: {
    headline: "How long can you wind down for",
    subtext:
      "A short wind-down ritual done consistently rewires your nervous system over time.",
    testimonial: {
      initial: "D",
      name: "Dani",
      age: 28,
      quote:
        '"5 minutes of journaling before bed replaced 45 minutes of doom-scrolling. I\'m asleep in under 20 minutes now."',
      tone: "lavender",
    },
  },
};

export const DAILY_GOAL_CARDS: readonly GoalCardConfig[] = [
  {
    minutes: 3,
    tag: "Gentle",
    tagVariant: "casual",
    description: "A check-in",
  },
  {
    minutes: 5,
    tag: "Recommended",
    tagVariant: "recommended",
    description: "A meaningful pause",
  },
  {
    minutes: 10,
    tag: "Committed",
    tagVariant: "committed",
    description: "A real reflection",
  },
  {
    minutes: 15,
    displayLabel: "15+ min",
    tag: "Serious",
    tagVariant: "serious",
    description: "A deep practice",
  },
];

export const LOADING_TASKS: readonly LoadingTask[] = [
  { id: "stress", label: "Analyzing your stress profile", durationMs: 800 },
  { id: "plan", label: "Building your personal journey", durationMs: 900 },
  { id: "cbt", label: "Selecting CBT exercises for you", durationMs: 1000 },
  { id: "schedule", label: "Optimizing your daily schedule", durationMs: 800 },
];

export const FEELINGS: readonly FeelingOption[] = [
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "sad", emoji: "😢", label: "Sad" },
  { id: "angry", emoji: "😤", label: "Angry" },
  { id: "hopeful", emoji: "🌟", label: "Hopeful" },
  { id: "tired", emoji: "😴", label: "Tired" },
  { id: "grateful", emoji: "🙏", label: "Grateful" },
];

export const PRICING_PLANS: readonly PricingPlanConfig[] = [
  {
    tier: "weekly",
    label: "Weekly",
    price: "$7.99",
    detailLabel: "Cancel anytime",
    perUnit: "/week",
    featured: false,
    isDecoy: true,
  },
  {
    tier: "annual",
    label: "Annual",
    price: "$99.99",
    perUnit: "billed yearly",
    featured: true,
    headline: "365 days of showing up for yourself.",
    badge: "BEST VALUE",
    savings: "SAVE 67%",
    comparisonPrice: "$299/yr",
    detailPrefix: "Just ",
    detailEmphasis: "$0.27 per day",
    detailSuffix: " · billed yearly",
  },
  {
    tier: "monthly",
    label: "Monthly",
    price: "$14.99",
    detailLabel: "Cancel anytime",
    perUnit: "/month",
    featured: false,
  },
];

export const NOTIFICATION_TIMES = [
  { id: "morning" as const, label: "Morning", time: "8:00 AM" },
  { id: "afternoon" as const, label: "Afternoon", time: "1:00 PM" },
  { id: "evening" as const, label: "Evening", time: "7:00 PM" },
];

export const PAYWALL_BENEFITS = [
  "All 12 journeys with sequenced lessons",
  "Unlimited AI insights & weekly patterns",
  "Full CBT toolkit (20+ exercises)",
  "Streak repair & premium themes",
];

export const PACT_TEXT = `I commit to showing up for myself — even on the days I don't feel like it. Just {minutes} minutes. That's all it takes.`;

export const FUTURE_LETTER_TEXT = `You did it. You actually showed up — not once, but every single day for 30 days.\n\nRemember how heavy things felt when you started? The {timing} were the hardest. But you kept coming back. {minutes} minutes at a time.\n\nYou're not the same person who opened this app a month ago. You're calmer. You notice your thoughts before they spiral. You have tools now.\n\nI'm proud of you.`;

export const PLAN_STATS = [
  { value: "7", label: "Days" },
  { value: "14", label: "Lessons" },
  { value: "9", label: "CBT Exercises" },
  { value: "5 min", label: "Per Day" },
];

export const DEFAULT_CHECKLIST_ITEMS: readonly OnboardingChecklistItem[] = [
  {
    id: "first_mood",
    label: "Log your first mood",
    completed: false,
    route: "/(tabs)/home",
    xpReward: 20,
  },
  {
    id: "first_journal",
    label: "Write your first journal entry",
    completed: false,
    route: "/(tabs)/record",
    xpReward: 30,
  },
  {
    id: "first_cbt",
    label: "Try a CBT exercise",
    completed: false,
    route: "/(tabs)/exercises",
    xpReward: 25,
  },
  {
    id: "setup_reminders",
    label: "Set up daily reminders",
    completed: false,
    route: "/tabs/screens/reminders",
    xpReward: 15,
  },
  {
    id: "first_habit",
    label: "Create your first habit",
    completed: false,
    route: "/(tabs)/home",
    xpReward: 20,
  },
];

export const TRIAL_DAYS = 7;
export const POST_TRIAL_DISCOUNT_PERCENT = 30;
export const POST_TRIAL_ANNUAL_PRICE = "$69.99/year";
export const POST_TRIAL_ANNUAL_PER_MONTH = "$5.83/mo";

export interface PersonalizedCourseConfig {
  /** Placeholder UUID — replace with real Supabase course ID when seeded. */
  courseId: string;
  title: string;
  tagline: string;
  durationDays: number;
  nodes: readonly JourneyMapNode[];
}

// ---------------------------------------------------------------------------
// MOTIVATION_COURSE_MAP
// ---------------------------------------------------------------------------
// Maps each motivation answer to a course config. Right now this is local —
// when real courses are seeded in Supabase, replace the body of
// usePersonalizedCourse with a getCourseByMotivation(motivation) query and
// keep this as the fallback / type reference.
// ---------------------------------------------------------------------------
export const MOTIVATION_COURSE_MAP: Record<
  MotivationAnswer,
  PersonalizedCourseConfig
> = {
  anxiety: {
    courseId: "00000000-0000-0000-0000-000000000001",
    title: "Quieting the Storm",
    tagline: "From racing thoughts to steady ground.",
    durationDays: 7,
    nodes: [
      {
        id: "1",
        emoji: "😌",
        label: "How are you, really?",
        subtitle: "Day 1 · Mood check-in",
        status: "current",
      },
      {
        id: "2",
        emoji: "🧠",
        label: "The Thought Spiral",
        subtitle: "Day 2 · Cognitive distortions",
        status: "locked",
      },
      {
        id: "3",
        emoji: "🫁",
        label: "Body as Compass",
        subtitle: "Day 3 · Somatic awareness",
        status: "locked",
      },
      {
        id: "4",
        emoji: "📝",
        label: "Thought Records",
        subtitle: "Day 4 · Your first CBT tool",
        status: "locked",
      },
      {
        id: "5",
        emoji: "🌊",
        label: "Riding the Wave",
        subtitle: "Day 5 · Acceptance",
        status: "locked",
      },
      {
        id: "6",
        emoji: "🔑",
        label: "Patterns Unlocked",
        subtitle: "Day 6 · AI insights",
        status: "locked",
      },
      {
        id: "7",
        emoji: "🏔️",
        label: "The Quiet Summit",
        subtitle: "Day 7 · Reflection",
        status: "locked",
      },
    ],
  },
  mood: {
    courseId: "00000000-0000-0000-0000-000000000002",
    title: "Finding Light Again",
    tagline: "From heavy days to steadier light.",
    durationDays: 7,
    nodes: [
      {
        id: "1",
        emoji: "😌",
        label: "Name what you feel",
        subtitle: "Day 1 · Emotional clarity",
        status: "current",
      },
      {
        id: "2",
        emoji: "🌤️",
        label: "Tiny Lifts",
        subtitle: "Day 2 · Mood anchors",
        status: "locked",
      },
      {
        id: "3",
        emoji: "🫁",
        label: "Body as Compass",
        subtitle: "Day 3 · Somatic check-in",
        status: "locked",
      },
      {
        id: "4",
        emoji: "🔦",
        label: "Finding the Pattern",
        subtitle: "Day 4 · Low mood triggers",
        status: "locked",
      },
      {
        id: "5",
        emoji: "🪴",
        label: "Behavioural Activation",
        subtitle: "Day 5 · Small actions",
        status: "locked",
      },
      {
        id: "6",
        emoji: "🔑",
        label: "Patterns Unlocked",
        subtitle: "Day 6 · AI insights",
        status: "locked",
      },
      {
        id: "7",
        emoji: "🌅",
        label: "A Steadier Morning",
        subtitle: "Day 7 · Reflection",
        status: "locked",
      },
    ],
  },
  stress: {
    courseId: "00000000-0000-0000-0000-000000000003",
    title: "Steady Under Pressure",
    tagline: "From pressure to steadier ground.",
    durationDays: 7,
    nodes: [
      {
        id: "1",
        emoji: "😌",
        label: "Where does it live?",
        subtitle: "Day 1 · Body stress mapping",
        status: "current",
      },
      {
        id: "2",
        emoji: "⚡",
        label: "Pressure Points",
        subtitle: "Day 2 · Stress patterns",
        status: "locked",
      },
      {
        id: "3",
        emoji: "🫁",
        label: "The Decompression Window",
        subtitle: "Day 3 · Nervous system reset",
        status: "locked",
      },
      {
        id: "4",
        emoji: "📝",
        label: "Thought Records",
        subtitle: "Day 4 · Reframe the load",
        status: "locked",
      },
      {
        id: "5",
        emoji: "🧱",
        label: "Building the Wall",
        subtitle: "Day 5 · Boundaries & capacity",
        status: "locked",
      },
      {
        id: "6",
        emoji: "🔑",
        label: "Patterns Unlocked",
        subtitle: "Day 6 · AI insights",
        status: "locked",
      },
      {
        id: "7",
        emoji: "🏔️",
        label: "Steady at the Top",
        subtitle: "Day 7 · Reflection",
        status: "locked",
      },
    ],
  },
  self_understanding: {
    courseId: "00000000-0000-0000-0000-000000000004",
    title: "Coming Home to Yourself",
    tagline: "From confusion to clearer patterns.",
    durationDays: 7,
    nodes: [
      {
        id: "1",
        emoji: "🪞",
        label: "Who am I, right now?",
        subtitle: "Day 1 · Values check-in",
        status: "current",
      },
      {
        id: "2",
        emoji: "🧠",
        label: "The Story You Tell",
        subtitle: "Day 2 · Core beliefs",
        status: "locked",
      },
      {
        id: "3",
        emoji: "🔦",
        label: "Trigger Mapping",
        subtitle: "Day 3 · Pattern spotting",
        status: "locked",
      },
      {
        id: "4",
        emoji: "📝",
        label: "Thought Records",
        subtitle: "Day 4 · Your first CBT tool",
        status: "locked",
      },
      {
        id: "5",
        emoji: "🌱",
        label: "Parts of You",
        subtitle: "Day 5 · Inner conflict",
        status: "locked",
      },
      {
        id: "6",
        emoji: "🔑",
        label: "Patterns Unlocked",
        subtitle: "Day 6 · AI insights",
        status: "locked",
      },
      {
        id: "7",
        emoji: "🏡",
        label: "Home",
        subtitle: "Day 7 · Reflection",
        status: "locked",
      },
    ],
  },
  sleep: {
    courseId: "00000000-0000-0000-0000-000000000005",
    title: "The Gentle Wind-Down",
    tagline: "From restless nights to gentler wind-downs.",
    durationDays: 7,
    nodes: [
      {
        id: "1",
        emoji: "🌙",
        label: "The Evening Shape",
        subtitle: "Day 1 · Nervous system check-in",
        status: "current",
      },
      {
        id: "2",
        emoji: "🧠",
        label: "The Evening Spiral",
        subtitle: "Day 2 · Night-time thought loops",
        status: "locked",
      },
      {
        id: "3",
        emoji: "🫁",
        label: "Body Scan",
        subtitle: "Day 3 · Wind-down cues",
        status: "locked",
      },
      {
        id: "4",
        emoji: "📝",
        label: "Unloading the Day",
        subtitle: "Day 4 · Brain dump technique",
        status: "locked",
      },
      {
        id: "5",
        emoji: "🌊",
        label: "Riding the Wave",
        subtitle: "Day 5 · Acceptance at night",
        status: "locked",
      },
      {
        id: "6",
        emoji: "🔑",
        label: "Patterns Unlocked",
        subtitle: "Day 6 · AI insights",
        status: "locked",
      },
      {
        id: "7",
        emoji: "⭐",
        label: "The Quiet Night",
        subtitle: "Day 7 · Reflection",
        status: "locked",
      },
    ],
  },
};
export const PREMIUM_GOLD = "#D4A943";
