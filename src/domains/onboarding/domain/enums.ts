// ponytail: explicit enums for all domain choices
export enum GoalId {
  Worry = 'worry',
  Mood = 'mood',
  Stress = 'stress',
  Self = 'self',
  Sleep = 'sleep',
}

export enum TrapType {
  MindReading = 'mind_reading',
  Overgeneralizing = 'overgeneralizing',
  Catastrophizing = 'catastrophizing',
  Labeling = 'labeling',
  FortuneTelling = 'fortune_telling',
  AllOrNothing = 'all_or_nothing',
  Should = 'should',
}

export enum OnboardingStep {
  Hello = 'hello',
  GoalPick = 'goal_pick',
  Chat = 'chat',
  Saved = 'saved',
}

export enum ChatPhase {
  ShowMe = 'show_me',
  RateInitial = 'rate_initial',
  Reality = 'reality',
  RateShift = 'rate_shift',
  AfterTeach = 'after_teach',
  PersonalSituation = 'personal_situation',
  PersonalThought = 'personal_thought',
  PersonalFair = 'personal_fair',
}

export enum SheetType {
  Who = 'who',
  Leave = 'leave',
  SignIn = 'signin',
  Help = 'help',
}

export enum MessageSender {
  Happi = 'happi',
  User = 'user',
}

export enum ReminderPreset {
  Morning = '8:00 AM',
  Evening = '8:00 PM',
  Custom = 'custom',
}
