import {
  GoalConfig,
  PremiumFeatureConfig,
  PricingPlan,
  OnboardingStepConfig,
  OnboardingRendererKind,
  QuickWinMoodOption,
  FeatureDiscoverySlide,
  OnboardingChecklistItem,
  JournalingGoal,
} from "./types";

export const ONBOARDING_STEPS: readonly OnboardingStepConfig[] = [
  {
    name: "welcome",
    backgroundColor: "#fff",
    canSkip: true,
    analyticsLabel: "welcome_value",
    showBackButton: false,
    showContinueButton: true,
    continueButtonLabel: "Continue",
    renderer: {
      kind: OnboardingRendererKind.JourneyStep,
      screenName: "feel-better",
      transitionKey: "feel-better",
      transitionDuration: 360,
    },
  },
  {
    name: "reframe_thoughts_intro",
    backgroundColor: "#fff",
    canSkip: true,
    analyticsLabel: "reframe_thoughts_intro",
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "Continue",
    renderer: {
      kind: OnboardingRendererKind.JourneyStep,
      screenName: "reframe-thoughts",
      transitionKey: "reframe-thoughts",
      transitionDuration: 360,
    },
  },
  {
    name: "progress_graph",
    backgroundColor: "#F4FBF1",
    canSkip: true,
    analyticsLabel: "progress_graph",
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "Continue",
    renderer: {
      kind: OnboardingRendererKind.ProgressGraph,
    },
  },
  {
    name: "goals",
    backgroundColor: "#FFF3D4",
    canSkip: false,
    analyticsLabel: "goals_selection",
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "Continue",
    isContinueEnabled: (formData) => formData.goals.length > 0,
    renderer: {
      kind: OnboardingRendererKind.Goals,
    },
  },
  {
    name: "quick_win_mood",
    backgroundColor: "#DCF2FF",
    canSkip: true,
    analyticsLabel: "quick_win_mood",
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "Continue",
    isContinueEnabled: (formData) => formData.quickWinMood !== undefined,
    renderer: {
      kind: OnboardingRendererKind.QuickWinMood,
    },
  },
  {
    name: "feature_discovery",
    backgroundColor: "#F0FDF4",
    canSkip: true,
    analyticsLabel: "feature_discovery",
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "Continue",
    renderer: {
      kind: OnboardingRendererKind.FeatureDiscovery,
    },
  },
  {
    name: "soft_paywall",
    backgroundColor: "#FFFFFF",
    canSkip: true,
    analyticsLabel: "soft_paywall",
    showBackButton: true,
    showContinueButton: false,
    continueButtonLabel: "Continue",
    renderer: {
      kind: OnboardingRendererKind.SoftPaywall,
    },
  },
  {
    name: "celebration",
    backgroundColor: "#E5FFE5",
    canSkip: false,
    analyticsLabel: "celebration",
    showBackButton: true,
    showContinueButton: true,
    continueButtonLabel: "Start Your Journey 🚀",
    renderer: {
      kind: OnboardingRendererKind.Celebration,
    },
  },
] as const;

export const TOTAL_ONBOARDING_STEPS: number = ONBOARDING_STEPS.length;

export const GOAL_OPTIONS: readonly GoalConfig[] = [
  {
    id: "track_emotions",
    label: "Track my daily emotions",
    emoji: "😊",
    premiumFeature: "advanced_mood_dashboard",
    premiumFeatureLabel: "Advanced Mood Dashboard",
  },
  {
    id: "build_habits",
    label: "Build better habits",
    emoji: "✅",
    premiumFeature: null,
    premiumFeatureLabel: null,
  },
  {
    id: "reduce_anxiety",
    label: "Reduce stress & anxiety",
    emoji: "🧘",
    premiumFeature: "cbt_exercises",
    premiumFeatureLabel: "CBT Thought Checker",
  },
  {
    id: "personal_growth",
    label: "Personal growth",
    emoji: "🌱",
    premiumFeature: "ai_insights",
    premiumFeatureLabel: "AI Insights & Summaries",
  },
  {
    id: "improve_relationships",
    label: "Improve relationships",
    emoji: "❤️",
    premiumFeature: null,
    premiumFeatureLabel: null,
  },
  {
    id: "practice_gratitude",
    label: "Practice gratitude",
    emoji: "🙏",
    premiumFeature: "gratitude_reframe",
    premiumFeatureLabel: "Gratitude Reframe",
  },
  {
    id: "self_reflection",
    label: "Self-reflection & journaling",
    emoji: "📝",
    premiumFeature: "unlimited_journals",
    premiumFeatureLabel: "Unlimited Journal Entries",
  },
] as const;

export const QUICK_WIN_MOOD_OPTIONS: readonly QuickWinMoodOption[] = [
  {
    value: "terrible",
    emoji: "😢",
    label: "Terrible",
    color: "#FEE2E2",
    insightText:
      "Acknowledging how you feel is the first step. Journaling can help process tough emotions.",
  },
  {
    value: "bad",
    emoji: "😔",
    label: "Not great",
    color: "#FED7AA",
    insightText:
      "It's okay to have off days. Users who journal regularly report 40% fewer bad days.",
  },
  {
    value: "okay",
    emoji: "😐",
    label: "Okay",
    color: "#FEF3C7",
    insightText:
      "Neutral days are perfect for reflection. Small insights today lead to big changes.",
  },
  {
    value: "good",
    emoji: "🙂",
    label: "Good",
    color: "#D1FAE5",
    insightText:
      "Great mood! Capturing positive moments helps build lasting happiness patterns.",
  },
  {
    value: "great",
    emoji: "😄",
    label: "Amazing",
    color: "#DBEAFE",
    insightText:
      "Wonderful! Tracking your highs helps you understand what makes you thrive.",
  },
] as const;

export const PREMIUM_FEATURES: readonly PremiumFeatureConfig[] = [
  {
    id: "ai_insights",
    title: "AI Insights & Summaries",
    description: "Get personalized weekly reflections powered by AI",
    emoji: "✨",
    isPremium: true,
    statLabel: "of users feel more self-aware",
    statValue: "89%",
  },
  {
    id: "cbt_exercises",
    title: "CBT Thought Checker",
    description: "Challenge negative thoughts with science-backed exercises",
    emoji: "🧠",
    isPremium: true,
    statLabel: "reduction in anxiety reported",
    statValue: "67%",
  },
  {
    id: "advanced_mood_dashboard",
    title: "Advanced Mood Dashboard",
    description: "Visualize patterns and trends in your emotional health",
    emoji: "📊",
    isPremium: true,
    statLabel: "better mood awareness",
    statValue: "92%",
  },
  {
    id: "unlimited_journals",
    title: "Unlimited Journal Entries",
    description: "Write as many entries as you want, every single day",
    emoji: "📝",
    isPremium: true,
    statLabel: "more entries per week on avg",
    statValue: "3.5x",
  },
  {
    id: "voice_recording",
    title: "Extended Voice Journaling",
    description: "Record your thoughts without time limits",
    emoji: "🎙️",
    isPremium: true,
    statLabel: "prefer voice over typing",
    statValue: "45%",
  },
  {
    id: "streak_freeze",
    title: "Streak Freeze Protection",
    description: "Protect your streak when life gets busy",
    emoji: "🛡️",
    isPremium: true,
    statLabel: "longer streaks with freeze",
    statValue: "2.8x",
  },
] as const;

export const FEATURE_DISCOVERY_SLIDES: readonly FeatureDiscoverySlide[] = [
  {
    id: "mood_tracking",
    title: "Track Your Mood",
    description:
      "Log how you feel throughout the day and discover patterns over time",
    emoji: "😊",
    isPremium: false,
    statLabel: "Users report better emotional awareness in 2 weeks",
    backgroundColor: "#FDF2F8",
  },
  {
    id: "ai_insights",
    title: "AI-Powered Insights",
    description:
      "Get personalized weekly summaries and deeper understanding of your patterns",
    emoji: "✨",
    isPremium: true,
    statLabel: "89% of users feel more self-aware with AI insights",
    backgroundColor: "#EFF6FF",
  },
  {
    id: "cbt_tools",
    title: "Science-Backed CBT Tools",
    description:
      "Challenge negative thoughts and build resilience with proven techniques",
    emoji: "🧠",
    isPremium: true,
    statLabel: "67% reduction in anxiety after 4 weeks",
    backgroundColor: "#F0FDF4",
  },
  {
    id: "habits",
    title: "Habit Tracker",
    description:
      "Build positive daily routines alongside your journaling practice",
    emoji: "✅",
    isPremium: false,
    statLabel: "78% of users build at least one lasting habit",
    backgroundColor: "#F5F3FF",
  },
  {
    id: "gratitude",
    title: "Gratitude Reframing",
    description: "Transform your perspective with guided gratitude exercises",
    emoji: "🙏",
    isPremium: true,
    statLabel: "95% report higher life satisfaction",
    backgroundColor: "#FFF7ED",
  },
] as const;

export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "annual",
    label: "Annual",
    price: "$39.99/year",
    perMonthPrice: "$3.33/mo",
    badge: "Best Value",
    savings: "Save 60%",
  },
  {
    id: "weekly",
    label: "Weekly",
    price: "$1.99/week",
    perMonthPrice: "$7.96/mo",
    badge: null,
    savings: null,
  },
] as const;

export const POST_TRIAL_DISCOUNT_PERCENT: number = 30;
export const POST_TRIAL_ANNUAL_PRICE: string = "$27.99/year";
export const POST_TRIAL_ANNUAL_PER_MONTH: string = "$2.33/mo";

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
] as const;

export const SOCIAL_PROOF_COUNT: string = "50,000+";
export const PREMIUM_MEMBER_COUNT: string = "15,000+";
export const TRIAL_DAYS: number = 7;
export const BRAND_PURPLE: string = "#7C3AED";
export const BRAND_PURPLE_LIGHT: string = "#EDE9FE";
export const SUCCESS_GREEN: string = "#10B981";
export const PREMIUM_GOLD: string = "#F59E0B";

export const GOAL_TO_FEATURES_MAP: Record<JournalingGoal, string[]> = {
  track_emotions: ["advanced_mood_dashboard", "ai_insights"],
  build_habits: ["habits"],
  reduce_anxiety: ["cbt_exercises", "ai_insights"],
  personal_growth: ["ai_insights", "unlimited_journals"],
  improve_relationships: ["ai_insights", "unlimited_journals"],
  practice_gratitude: ["gratitude", "ai_insights"],
  self_reflection: ["unlimited_journals", "voice_recording"],
};
