import { HapticManager } from "./HapticManager";

export const hapticService = {
  // Button & Interaction
  buttonTap: () => HapticManager.triggerSystem("selection"),
  buttonTapMedium: () => HapticManager.trigger("wisp", { intensity: 0.3 }),

  // Form Fields
  fieldError: () => HapticManager.triggerSystem("notificationError"),

  // Scroll & Navigation
  scroll: () => HapticManager.triggerSystem("selection"),
  screenTransition: () => HapticManager.trigger("feather"),
  bottomSheetOpen: () => HapticManager.trigger("feather"),
  bottomSheetClose: () => HapticManager.trigger("wisp"),

  // Toggle & Switch
  toggleOn: () => HapticManager.trigger("chime", { intensity: 0.3 }),
  toggleOff: () => HapticManager.trigger("wisp", { intensity: 0.25 }),

  // Journal
  journalEntrySave: () =>
    HapticManager.triggerPattern(
      [
        { intensity: 0.4, sharpness: 0.5, duration: 50 },
        { intensity: 0.35, sharpness: 0.25, duration: 300 },
      ],
      0,
    ),
  journalEntryDelete: () =>
    HapticManager.triggerPattern(
      [
        { intensity: 0.35, sharpness: 0.6, duration: 100 },
        { intensity: 0.35, sharpness: 0.6, duration: 100 },
      ],
      200,
    ),
  journalEntryDeleted: () => HapticManager.trigger("pulse", { intensity: 0.3 }),

  // Mood Check-in
  moodSelected: () => HapticManager.trigger("heartbeat", { intensity: 0.35 }),
  moodConfirmed: () => HapticManager.trigger("bloom", { intensity: 0.45 }),
  moodIntensityChange: () => HapticManager.trigger("chime", { intensity: 0.3 }),

  // Gratitude & Positive Emotions
  gratitudeEntry: () => HapticManager.trigger("heartbeat", { intensity: 0.45 }),
  emotionalValidation: () => HapticManager.trigger("heartbeat"),
  emotionalMomentDetected: () =>
    HapticManager.trigger("ripple", { intensity: 0.3 }),

  // Breathing — sustained patterns use useBreathingHaptic in the component
  breathingCycleComplete: () =>
    HapticManager.trigger("pulse", { intensity: 0.25 }),

  // Meditation — sustained guide patterns use useBreathingHaptic in the component
  meditationStart: () => HapticManager.trigger("breath", { intensity: 0.3 }),
  meditationTransition: () =>
    HapticManager.trigger("chime", { intensity: 0.4 }),
  meditationEnd: () => HapticManager.trigger("exhale"),
  meditationComplete: () => HapticManager.trigger("heartbeat"),
  meditationReflectionSaved: () => HapticManager.trigger("chime"),

  // Focus Session
  focusSessionStart: () => HapticManager.trigger("breath", { intensity: 0.3 }),
  focusMilestone: () => HapticManager.trigger("dewdrop", { intensity: 0.35 }),
  focusSessionComplete: () =>
    HapticManager.trigger("bloom", { intensity: 0.45 }),

  // Achievement & Milestone
  dailyHabitComplete: () =>
    HapticManager.trigger("dewdrop", { intensity: 0.4 }),
  streakDay3: () =>
    HapticManager.triggerPattern(
      [
        { intensity: 0.3, sharpness: 0.4, duration: 100 },
        { intensity: 0.4, sharpness: 0.5, duration: 100 },
        { intensity: 0.55, sharpness: 0.6, duration: 100 },
      ],
      100,
    ),
  streakDay7: () => HapticManager.trigger("bloom", { intensity: 0.5 }),
  streakDay30: () => HapticManager.trigger("swell", { intensity: 0.55 }),
  lessonCompleted: () => HapticManager.trigger("bloom"),
  courseCompleted: () => HapticManager.trigger("swell"),
  levelUnlocked: () =>
    HapticManager.triggerPattern(
      [
        { intensity: 0.5, sharpness: 0.5, duration: 100 },
        { intensity: 0.55, sharpness: 0.6, duration: 300 },
      ],
      100,
    ),
  badgeEarned: () => HapticManager.trigger("radar", { intensity: 0.45 }),

  // Anxiety & Calm-Down
  anxietyScoreNoted: () =>
    HapticManager.trigger("heartbeat", { intensity: 0.35 }),
  groundingExerciseStart: () =>
    HapticManager.trigger("sway", { intensity: 0.3 }),
  anxietyCheckInSaved: () =>
    HapticManager.trigger("heartbeat", { intensity: 0.4 }),

  // Sleep & Evening
  sleepCheckIn: () => HapticManager.trigger("heartbeat", { intensity: 0.35 }),
  sleepReflectionSaved: () =>
    HapticManager.trigger("heartbeat", { intensity: 0.4 }),
  eveningWindDown: () => HapticManager.trigger("exhale", { intensity: 0.35 }),

  // Notifications
  dailyReminder: () => HapticManager.trigger("beacon", { intensity: 0.45 }),
  gentleReminder: () => HapticManager.trigger("chime", { intensity: 0.4 }),
  importantUpdate: () => HapticManager.triggerSystem("notificationWarning"),

  // Destructive Actions
  deleteWarning: () => HapticManager.triggerSystem("notificationWarning"),
  deleteConfirm: () => HapticManager.triggerSystem("notificationError"),
  logout: () => HapticManager.triggerSystem("notificationWarning"),

  // Settings
  settingChanged: () => HapticManager.trigger("chime", { intensity: 0.35 }),

  // AI Reflection
  reflectionGenerated: () =>
    HapticManager.trigger("bloom", { intensity: 0.45 }),
  reflectionResonates: () => HapticManager.trigger("heartbeat"),
  insightMoment: () => HapticManager.trigger("bloom", { intensity: 0.5 }),
  patternRecognized: () => HapticManager.trigger("radar", { intensity: 0.45 }),
};
