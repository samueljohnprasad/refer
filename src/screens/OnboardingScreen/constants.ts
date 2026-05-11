import {
  OnboardingStepConfig,
  OnboardingChecklistItem,
  QuizOption,
  MotivationAnswer,
  StressLevel,
  JournalExperience,
  StressTiming,
  GoalCardConfig,
  LoadingTask,
  PricingPlanConfig,
  FeelingOption,
  JourneyMapNode,
} from "./types";

export const ONBOARDING_STEPS: readonly OnboardingStepConfig[] = [
  {
    name: "welcome",
    stage: 1,
    backgroundColor: "#FAF6ED",
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
    backgroundColor: "#FAF6ED",
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
    backgroundColor: "#FAF6ED",
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
    backgroundColor: "#FAF6ED",
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "quiz_stress_level",
  },
  {
    name: "quiz_experience",
    stage: 2,
    backgroundColor: "#FAF6ED",
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "quiz_experience",
  },
  {
    name: "quiz_timing",
    stage: 2,
    backgroundColor: "#FAF6ED",
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "quiz_timing",
  },
  {
    name: "daily_goal",
    stage: 3,
    backgroundColor: "#FAF6ED",
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "SET MY GOAL",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "daily_goal",
    isContinueEnabled: (formData) => formData.dailyGoal !== undefined,
  },
  {
    name: "pact_signing",
    stage: 3,
    backgroundColor: "#FAF6ED",
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "pact_signing",
  },
  {
    name: "building_journey",
    stage: 4,
    backgroundColor: "#FAF6ED",
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
    backgroundColor: "#FAF6ED",
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "START DAY 1",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "plan_reveal",
  },
  {
    name: "mood_check_lesson",
    stage: 5,
    backgroundColor: "#FFFCF5",
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
    backgroundColor: "#FFFCF5",
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
    backgroundColor: "#FAF6ED",
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "lesson_complete",
  },
  {
    name: "notification_permission",
    stage: 6,
    backgroundColor: "#FAF6ED",
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "ENABLE REMINDERS",
    autoAdvance: false,
    canSkip: true,
    analyticsLabel: "notification_permission",
  },
  {
    name: "journey_map",
    stage: 6,
    backgroundColor: "#FAF6ED",
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "CONTINUE",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "journey_map",
  },
  {
    name: "letter_from_future",
    stage: 7,
    backgroundColor: "#FAF6ED",
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
    backgroundColor: "#FFFCF5",
    showBackButton: false,
    showContinueButton: false,
    continueButtonLabel: "",
    autoAdvance: false,
    canSkip: false,
    analyticsLabel: "soft_paywall",
  },
  {
    name: "welcome_to_happy",
    stage: 7,
    backgroundColor: "#FAF6ED",
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

export const EXPERIENCE_OPTIONS: readonly QuizOption<JournalExperience>[] = [
  {
    id: "never",
    emoji: "🆕",
    title: "Never tried it",
    subtitle: "I'm completely new to journaling",
  },
  {
    id: "tried_quit",
    emoji: "🔄",
    title: "Tried but stopped",
    subtitle: "I've started before but couldn't keep it up",
  },
  {
    id: "active",
    emoji: "📔",
    title: "I journal regularly",
    subtitle: "Looking for structure and deeper insights",
  },
];

export const TIMING_OPTIONS: readonly QuizOption<StressTiming>[] = [
  {
    id: "morning",
    emoji: "🌅",
    title: "Mornings",
    subtitle: "The day ahead feels overwhelming before it starts",
  },
  {
    id: "afternoon",
    emoji: "☀️",
    title: "Afternoons",
    subtitle: "Midday crashes and mounting pressure",
  },
  {
    id: "evening",
    emoji: "🌆",
    title: "Evenings",
    subtitle: "The day's weight hits hardest after work",
  },
  {
    id: "night",
    emoji: "🌙",
    title: "Late at night",
    subtitle: "Racing thoughts when trying to wind down",
  },
];

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

export const JOURNEY_MAP_NODES: readonly JourneyMapNode[] = [
  {
    id: "1",
    emoji: "😌",
    label: "How are you, really?",
    subtitle: "Mood check-in",
    status: "completed",
  },
  {
    id: "2",
    emoji: "🧠",
    label: "The Thought Spiral",
    subtitle: "Day 2 · CBT basics",
    status: "current",
  },
  {
    id: "3",
    emoji: "🫁",
    label: "Body as Compass",
    subtitle: "Day 3 · Body scan",
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
export const PREMIUM_GOLD = "#D4A943";
