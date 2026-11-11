# DDD Clean Architecture Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the production onboarding flow from `.agents/onboarding.html` as a modular domain (`src/domains/onboarding`) with clean separation of Presentation, Container, Domain, and Data layers. Uses TypeScript Enums, existing libraries (`lodash-es`, `lucide-react-native`, `date-fns`), small single-responsibility hooks (no big monolithic hook), and low cognitive complexity (zero nested ternaries).

**Architecture:** Domain layer holds Enums, Goal models, and simple scoring logic with zero React or UI dependencies. Data layer encapsulates AsyncStorage persistence, Supabase profile updates, and notification scheduling. Container layer is decomposed into small single-purpose custom hooks (`useOnboardingStep`, `useChatMessages`, `useReflectionState`, `useReminderState`, `useComposerState`), and Presentation layer renders pure JSX components driven strictly by props with zero business logic or nested JSX ternaries.

**Tech Stack:** React Native, Expo Router, NativeWind (Tailwind CSS), TypeScript (Enums), `lodash-es`, `lucide-react-native`, `date-fns`, react-native-reanimated, react-native-svg, expo-haptics, expo-notifications, Supabase.

## Global Constraints

- Use TypeScript Enums (`enum`) across all domain choices.
- Use libraries (`lodash-es`, `lucide-react-native`, `date-fns`) instead of writing manual helpers or scratch SVG paths.
- Separation of Concerns in Hooks: NO monolithic hook. Split into focused hooks <= 100 lines each.
- Low Cognitive Complexity: NO nested ternary operators in JSX (`a ? b : c ? d : e`). Use declarative subcomponents and flat switch statements.
- Presentation Layer: strictly JSX and props only; no side effects, no API calls, no internal business logic.
- Max file length: <= 300 lines per file (hooks target <= 120 lines).
- Styling: Tailwind CSS classes only (NativeWind).
- Typography: Fredoka for display headings, Nunito for choices and body text.
- Minimal code / YAGNI (Ponytail mode): no unnecessary abstractions or validations; mark simplifications with `// ponytail:`.
- Safety: NO crisis detection or crisis regex.
- Verification: `npx tsc --noEmit`. NEVER commit or push code automatically.

---

### Task 1: Domain Enums, Models & Goal Definitions

**Files:**
- Create: `src/domains/onboarding/domain/enums.ts`
- Create: `src/domains/onboarding/domain/types.ts`
- Create: `src/domains/onboarding/domain/traps.ts`
- Create: `src/domains/onboarding/domain/goals.ts`

**Interfaces:**
- Consumes: None (pure TypeScript definitions)
- Produces: `GoalId`, `TrapType`, `OnboardingStep`, `ChatPhase`, `SheetType`, `MessageSender`, `ReminderPreset`, `GoalDefinition`, `ChatMessage`, `ReflectionData`

- [ ] **Step 1: Create domain enums**

Create `src/domains/onboarding/domain/enums.ts`:

```typescript
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
  RateShift = 'rate_shift',
  ReadyToSave = 'ready_to_save',
  PersonalInput = 'personal_input',
}

export enum SheetType {
  Who = 'who',
  Leave = 'leave',
  SignIn = 'signin',
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
```

- [ ] **Step 2: Create domain types**

Create `src/domains/onboarding/domain/types.ts`:

```typescript
import { GoalId, TrapType, MessageSender, ReminderPreset } from './enums';

export interface GoalDefinition {
  id: GoalId;
  label: string;
  sub: string;
  tint: string;
  f: number;
  mirror: string;
  scene: string;
  thought: string;
  trap: TrapType;
  why: string;
  fair: string;
  ideas: {
    sit: string[];
    th: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  isHeading?: boolean;
  isQuote?: boolean;
  isFair?: boolean;
  why?: string;
  trapLabel?: string;
  timestamp: number;
}

export interface ReflectionData {
  goal: GoalId | null;
  source: 'example' | 'personal';
  art?: GoalId;
  situation: string;
  thought: string;
  trap?: TrapType;
  why: string;
  fair: string;
  before: number | null;
  after: number | null;
  reminder: ReminderPreset | string | null;
  at?: number;
}
```

- [ ] **Step 3: Create traps dictionary**

Create `src/domains/onboarding/domain/traps.ts`:

```typescript
import { TrapType } from './enums';

export const TRAP_LABELS: Record<TrapType, string> = {
  [TrapType.MindReading]: 'Mind reading',
  [TrapType.Overgeneralizing]: 'Overgeneralizing',
  [TrapType.Catastrophizing]: 'Catastrophizing',
  [TrapType.Labeling]: 'Labeling',
  [TrapType.FortuneTelling]: 'Fortune telling',
  [TrapType.AllOrNothing]: 'All-or-nothing',
  [TrapType.Should]: 'Should statements',
};
```

- [ ] **Step 4: Create goal definitions**

Create `src/domains/onboarding/domain/goals.ts`:

```typescript
import { GoalId, TrapType } from './enums';
import type { GoalDefinition } from './types';

export const GOALS: GoalDefinition[] = [
  {
    id: GoalId.Worry,
    tint: '#fff1d6',
    label: 'Worry',
    sub: 'I worry about what could go wrong',
    f: 0.68,
    mirror: 'Worry jumps to what might happen. Let’s catch one together.',
    scene: 'A friend texts: “Can we talk later?”',
    thought: 'I’ve done something wrong.',
    trap: TrapType.MindReading,
    why: 'She didn’t say what it’s about, so “I did something wrong” is a guess, not a fact.',
    fair: 'I don’t know why she wants to talk. It could be about anything.',
    ideas: {
      sit: ['A friend left my message on read.', 'I have a doctor’s appointment next week.', 'My boss said “let’s talk Monday.”'],
      th: ['Something is going to go wrong.', 'I’ve missed something important.', 'They’re upset with me.'],
    },
  },
  {
    id: GoalId.Mood,
    tint: '#e2eef8',
    label: 'Low mood',
    sub: 'Everything feels hard lately',
    f: 0.78,
    mirror: 'Low mood makes everything look worse. Let’s look at one thought.',
    scene: 'You stayed in all weekend.',
    thought: 'I never get anything done.',
    trap: TrapType.Overgeneralizing,
    why: 'Resting one weekend doesn’t erase what you got done last month.',
    fair: 'This weekend I rested. Last month I finished a lot.',
    ideas: {
      sit: ['I stayed in bed most of Saturday.', 'I skipped the thing I’d planned.', 'I forgot to reply to a few messages.'],
      th: ['I never get anything done.', 'Nothing is going to get better.', 'I’m letting everyone down.'],
    },
  },
  {
    id: GoalId.Stress,
    tint: '#fde5dc',
    label: 'Stress',
    sub: 'I have too much to do',
    f: 0.72,
    mirror: 'Stress turns every task into an emergency. Let’s catch one.',
    scene: 'Three things are due on the same day.',
    thought: 'If I miss one, everything falls apart.',
    trap: TrapType.Catastrophizing,
    why: 'Deadlines slip and get handled. One late task rarely ruins everything.',
    fair: 'One late task is a problem I can explain, not the end of everything.',
    ideas: {
      sit: ['Three things are due this week.', 'My inbox has 80 unread emails.', 'I’m behind on a project.'],
      th: ['It’s all going to fall apart.', 'I can’t handle all of this.', 'If I slip once, I’m done.'],
    },
  },
  {
    id: GoalId.Self,
    tint: '#ece6f7',
    label: 'Self-talk',
    sub: 'I’m hard on myself',
    f: 0.64,
    mirror: 'The voice in your head can be very harsh. Let’s look at what it says.',
    scene: 'You stumbled over a word in a meeting.',
    thought: 'I’m such an idiot.',
    trap: TrapType.Labeling,
    why: 'Everyone gets a word wrong sometimes. One stumble is a moment, not a verdict on you.',
    fair: 'I stumbled once. That’s a moment, not who I am.',
    ideas: {
      sit: ['I got a word wrong in a meeting.', 'I snapped at someone I love.', 'I made a small mistake at work.'],
      th: ['I’m such an idiot.', 'I always mess things up.', 'I’m not good enough.'],
    },
  },
  {
    id: GoalId.Sleep,
    tint: '#e4e6f5',
    label: 'Sleep',
    sub: 'My thoughts keep me up',
    f: 0.6,
    mirror: 'At night, small worries grow big. Let’s catch one.',
    scene: 'It’s 1 AM and you’re still awake.',
    thought: 'Tomorrow is going to be a disaster.',
    trap: TrapType.FortuneTelling,
    why: 'You’ve got through tired days before, so “disaster” is a prediction, not a fact.',
    fair: 'I’ve managed on little sleep before. Tomorrow may be tiring, not ruined.',
    ideas: {
      sit: ['It’s 1 AM and I’m still awake.', 'I woke up at 3 AM again.', 'I have an early start tomorrow.'],
      th: ['Tomorrow will be a disaster.', 'I’ll never fall asleep.', 'I can’t function on this little sleep.'],
    },
  },
];
```

- [ ] **Step 5: Verify domain files**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

---

### Task 2: Domain Logic & Scoring (Using `lodash-es`)

**Files:**
- Create: `src/domains/onboarding/domain/scoring.ts`

**Interfaces:**
- Consumes: `lodash-es` (`clamp`, `capitalize`, `trim`)
- Produces: `getShiftCopy()`, `weighBelief()`, `formatBeliefSummary()`, `BELIEF_OPTIONS`, `THOUGHT_STARTERS`

- [ ] **Step 1: Implement scoring helpers using `lodash-es`**

Create `src/domains/onboarding/domain/scoring.ts`:

```typescript
import { clamp } from 'lodash-es';

// ponytail: domain scoring utilizing lodash utilities
export const BELIEF_OPTIONS = [
  'Not at all',
  'A little',
  'Somewhat',
  'Mostly',
  'Completely',
] as const;

export const THOUGHT_STARTERS = [
  'I don’t actually know that yet.',
  'One moment isn’t the whole story.',
  'What would I tell a friend?',
] as const;

export function getShiftCopy(before: number, after: number): string {
  const diff = before - after;
  if (diff < 0) {
    return 'You believe it a bit more right now. You still looked at it closely.';
  }
  if (diff === 0) {
    return 'Your belief stayed the same, and you still stopped to check it.';
  }
  if (diff >= 2) {
    return 'You believe it a lot less now.';
  }
  return 'You believe it a little less. That’s room for another view.';
}

export function weighBelief(value: number): number {
  return clamp(0.2 + value * 0.15, 0.1, 0.95);
}

export function formatBeliefSummary(before: number | null, after: number | null): string {
  if (before === null) return '';
  if (before === 0) return BELIEF_OPTIONS[0];
  if (after === null || after === before) {
    return `${BELIEF_OPTIONS[before]}, still`;
  }
  return `${BELIEF_OPTIONS[before]}, now ${BELIEF_OPTIONS[after].toLowerCase()}`;
}
```

- [ ] **Step 2: Verify scoring logic**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 3: Data Layer (Storage, Repository & Notification Scheduling)

**Files:**
- Create: `src/domains/onboarding/data/onboardingStorage.ts`
- Create: `src/domains/onboarding/data/onboardingRepository.ts`
- Create: `src/domains/onboarding/data/notificationScheduler.ts`

**Interfaces:**
- Consumes: `ReflectionData`, `AsyncStorage`, Supabase client, `notification-reminders.ts`
- Produces: `saveLocalReflection()`, `completeOnboarding()`, `scheduleOnboardingReminder()`

- [ ] **Step 1: Implement local storage wrapper**

Create `src/domains/onboarding/data/onboardingStorage.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReflectionData } from '../domain/types';

const ONBOARDING_KEY = 'happy.onboarding';
const COMPLETED_KEY = 'onboarding_completed';

export async function saveLocalReflection(reflection: ReflectionData): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(reflection));
    await AsyncStorage.setItem(COMPLETED_KEY, 'true');
  } catch {
    // ponytail: safe in guest mode
  }
}
```

- [ ] **Step 2: Implement simplified notification scheduler**

Create `src/domains/onboarding/data/notificationScheduler.ts`:

```typescript
import {
  ensureNotificationPermissions,
  scheduleDailyReminder,
  saveRemindersConfig,
  type RemindersConfig,
} from '@/src/components/lib/notification-reminders';

export async function scheduleOnboardingReminder(timeStr: string): Promise<boolean> {
  try {
    const granted = await ensureNotificationPermissions();
    if (!granted) return false;

    const isMorning = timeStr.includes('8:00 AM');
    const hour = isMorning ? 8 : 20;

    const cfg: RemindersConfig = {
      daily_thought_catch: {
        id: 'daily_thought_catch',
        enabled: true,
        hour,
        minute: 0,
        title: 'Happy',
        body: 'Ready to catch one more thought? 2 minutes.',
      },
    };

    await scheduleDailyReminder(
      'daily_thought_catch',
      'Happy',
      { hour, minute: 0 },
      'Ready to catch one more thought? 2 minutes.'
    );
    await saveRemindersConfig(cfg);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Implement onboarding repository**

Create `src/domains/onboarding/data/onboardingRepository.ts`:

```typescript
import { supabase } from '@/src/network/auth/supabase';
import { updateUserStreak } from '@/src/lib/api/mentalHealthJourneyApi';
import { saveLocalReflection } from './onboardingStorage';
import { scheduleOnboardingReminder } from './notificationScheduler';
import type { ReflectionData } from '../domain/types';

export async function completeOnboarding(
  userId: string | undefined,
  reflection: ReflectionData
): Promise<void> {
  await saveLocalReflection(reflection);

  if (reflection.reminder) {
    await scheduleOnboardingReminder(reflection.reminder);
  }

  if (userId) {
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId);
      await updateUserStreak();
    } catch {
      // ponytail: proceed in guest mode if supabase fails
    }
  }
}
```

- [ ] **Step 4: Verify data layer**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 4: Presentation Layer - Primitives & Icons (Using `lucide-react-native`)

**Files:**
- Create: `src/domains/onboarding/ui/presentation/components/SceneArtSvg.tsx`
- Create: `src/domains/onboarding/ui/presentation/components/OnboardingHeader.tsx`
- Create: `src/domains/onboarding/ui/presentation/components/TypingIndicator.tsx`
- Create: `src/domains/onboarding/ui/presentation/components/ChatMessageBubble.tsx`

**Interfaces:**
- Consumes: `GoalId`, `ChatMessage`, `ChevronLeft` from `lucide-react-native`
- Produces: Strictly JSX presentational components receiving all values via props.

- [ ] **Step 1: Create scene art component**

Create `src/domains/onboarding/ui/presentation/components/SceneArtSvg.tsx`:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Circle, G, Ellipse, Text as SvgText } from 'react-native-svg';
import { GoalId } from '../../../domain/enums';

export interface SceneArtSvgProps {
  goalId: GoalId;
  caption: string;
}

export function SceneArtSvg({ goalId, caption }: SceneArtSvgProps): React.JSX.Element {
  return (
    <View className="w-full rounded-3xl overflow-hidden bg-white/40 mb-3 border border-black/5">
      <View className="w-full h-24 items-center justify-center p-2">
        {goalId === GoalId.Worry && (
          <Svg viewBox="0 0 240 100" className="w-full h-full">
            <Ellipse cx="120" cy="96" rx="34" ry="4" fill="#142414" opacity={0.07} />
            <G transform="rotate(-6 120 52)">
              <Rect x="96" y="10" width="48" height="80" rx="10" fill="#c3b3ea" />
              <Rect x="101" y="18" width="38" height="64" rx="5" fill="#fffaf0" />
            </G>
            <SvgText x="44" y="52" fontSize="24" fontWeight="700" fill="#e09a24">?</SvgText>
          </Svg>
        )}
        {goalId === GoalId.Mood && (
          <Svg viewBox="0 0 240 100" className="w-full h-full">
            <Rect x="34" y="14" width="62" height="56" rx="7" fill="#c99363" />
            <Rect x="40" y="20" width="50" height="44" rx="3" fill="#b9c6cf" />
          </Svg>
        )}
        {goalId === GoalId.Stress && (
          <Svg viewBox="0 0 240 100" className="w-full h-full">
            <Rect x="93" y="24" width="54" height="62" rx="8" fill="#fff" />
            <SvgText x="120" y="70" textAnchor="middle" fontSize="20" fontWeight="700" fill="#dd7b5a">14</SvgText>
          </Svg>
        )}
        {goalId === GoalId.Self && (
          <Svg viewBox="0 0 240 100" className="w-full h-full">
            <Rect x="66" y="12" width="112" height="56" rx="20" fill="#fff" />
            <SvgText x="120" y="50" textAnchor="middle" fontSize="16" fontWeight="700" fill="#9a83d4">words</SvgText>
          </Svg>
        )}
        {goalId === GoalId.Sleep && (
          <Svg viewBox="0 0 240 100" className="w-full h-full">
            <Circle cx="156" cy="56" r="31" fill="#9cc8ec" />
            <Circle cx="156" cy="56" r="24" fill="#fff" />
          </Svg>
        )}
      </View>
      {Boolean(caption) && (
        <Text className="px-4 pb-3 font-semibold text-slate-800 text-sm">{caption}</Text>
      )}
    </View>
  );
}
```

- [ ] **Step 2: Create OnboardingHeader**

Create `src/domains/onboarding/ui/presentation/components/OnboardingHeader.tsx`:

```tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

export interface OnboardingHeaderProps {
  showBack: boolean;
  showProgress: boolean;
  progressFill: number;
  onBack: () => void;
}

export function OnboardingHeader({
  showBack,
  showProgress,
  progressFill,
  onBack,
}: OnboardingHeaderProps): React.JSX.Element {
  return (
    <View className="flex-row items-center justify-between px-3 pt-2 min-h-[52px]">
      {showBack ? (
        <Pressable
          onPress={onBack}
          className="w-11 h-11 items-center justify-center rounded-full active:opacity-60"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ChevronLeft size={24} color="#142414" />
        </Pressable>
      ) : (
        <View className="w-11" />
      )}

      {showProgress ? (
        <View className="flex-1 mx-3 h-3.5 bg-neutral-200 rounded-full overflow-hidden relative">
          <View
            className="h-full bg-[#44633f] rounded-full"
            style={{ width: `${Math.max(8, Math.min(100, progressFill * 100))}%` }}
          >
            <View className="absolute left-1.5 right-1.5 top-0.5 h-[3px] rounded-sm bg-white/30" />
          </View>
        </View>
      ) : (
        <View className="flex-1" />
      )}

      <View className="w-11" />
    </View>
  );
}
```

- [ ] **Step 3: Create TypingIndicator & ChatMessageBubble**

Create `src/domains/onboarding/ui/presentation/components/TypingIndicator.tsx`:

```tsx
import React from 'react';
import { View, Image } from 'react-native';

export function TypingIndicator(): React.JSX.Element {
  return (
    <View className="flex-row items-end gap-2 mb-2 self-start max-w-[94%]">
      <Image
        source={require('@/assets/icons/icon-panda.png')}
        className="w-[30px] h-[30px] rounded-[9px] border border-neutral-200"
      />
      <View className="flex-row items-center gap-1.5 py-3 px-4 bg-[#f2f8ef] rounded-2xl rounded-bl-sm">
        <View className="w-2 h-2 rounded-full bg-[#a9bfa0]" />
        <View className="w-2 h-2 rounded-full bg-[#a9bfa0]" />
        <View className="w-2 h-2 rounded-full bg-[#a9bfa0]" />
      </View>
    </View>
  );
}
```

Create `src/domains/onboarding/ui/presentation/components/ChatMessageBubble.tsx`:

```tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { MessageSender } from '../../../domain/enums';
import type { ChatMessage } from '../../../domain/types';

export interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps): React.JSX.Element {
  const isHappi = message.sender === MessageSender.Happi;

  if (!isHappi) {
    return (
      <View className="self-end max-w-[85%] bg-[#5f7f58] rounded-2xl rounded-br-sm py-3 px-4 mb-2">
        <Text className="text-white text-base font-medium">{message.text}</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-2 mb-2 self-start max-w-[94%]">
      <Image
        source={require('@/assets/icons/icon-panda.png')}
        className="w-[30px] h-[30px] rounded-[9px] border border-neutral-200"
      />
      <View className="bg-[#f2f8ef] rounded-2xl rounded-bl-sm py-3 px-4 flex-1">
        <Text className="text-neutral-900 text-base font-medium leading-relaxed">
          {message.text}
        </Text>
        {message.isQuote && (
          <View className="flex-row items-center gap-2 mt-2 pl-2">
            <View className="w-2.5 h-2.5 rounded-full border-2 border-[#5f7f58] bg-white" />
            <Text className="text-lg font-bold text-neutral-900 flex-1">
              “{message.text}”
            </Text>
          </View>
        )}
        {message.isFair && (
          <View className="flex-row items-center gap-2 mt-2 pl-2">
            <View className="w-2.5 h-2.5 rounded-full bg-[#5f7f58]" />
            <Text className="text-lg font-bold text-neutral-900 flex-1">
              {message.text}
            </Text>
          </View>
        )}
        {Boolean(message.why) && (
          <Text className="text-neutral-600 text-sm mt-2 font-normal">
            {message.why} {message.trapLabel ? `This trap is called “${message.trapLabel.toLowerCase()}.”` : ''}
          </Text>
        )}
      </View>
    </View>
  );
}
```

- [ ] **Step 4: Verify presentation primitives**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 5: Presentation Layer - Input Controls & Flat Chat Footer (No Nested Ternaries)

**Files:**
- Create: `src/domains/onboarding/ui/presentation/components/QuickReplyStrip.tsx`
- Create: `src/domains/onboarding/ui/presentation/components/PersonalInputComposer.tsx`
- Create: `src/domains/onboarding/ui/presentation/components/ChatReplyFooter.tsx`
- Create: `src/domains/onboarding/ui/presentation/components/OnboardingSheetsModal.tsx`

**Interfaces:**
- Consumes: `ChatPhase` enum, callbacks
- Produces: Strictly JSX interactive controls with zero nested JSX ternaries.

- [ ] **Step 1: Create QuickReplyStrip**

Create `src/domains/onboarding/ui/presentation/components/QuickReplyStrip.tsx`:

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface QuickReplyOption {
  label: string;
  value: string;
}

export interface QuickReplyStripProps {
  options: QuickReplyOption[];
  onSelect: (option: QuickReplyOption) => void;
  isWrap?: boolean;
}

export function QuickReplyStrip({
  options,
  onSelect,
  isWrap,
}: QuickReplyStripProps): React.JSX.Element {
  return (
    <View className={isWrap ? 'flex-row flex-wrap gap-2' : 'flex-col gap-2'}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option)}
          className={`min-h-[44px] justify-center px-4 py-2.5 bg-white border border-neutral-200 active:border-[#5f7f58] active:scale-[0.98] ${
            isWrap ? 'rounded-full' : 'rounded-2xl rounded-br-sm'
          }`}
          accessibilityRole="button"
        >
          <Text className="text-neutral-900 font-semibold text-base text-center">
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
```

- [ ] **Step 2: Create PersonalInputComposer (using `Send` icon & `lodash-es`)**

Create `src/domains/onboarding/ui/presentation/components/PersonalInputComposer.tsx`:

```tsx
import React from 'react';
import { View, TextInput, Pressable, Text, ScrollView } from 'react-native';
import { Send } from 'lucide-react-native';
import { trim } from 'lodash-es';

export interface PersonalInputComposerProps {
  value: string;
  placeholder: string;
  starters: readonly string[];
  maxChars: number;
  onChangeText: (text: string) => void;
  onSelectStarter: (starter: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
}

export function PersonalInputComposer({
  value,
  placeholder,
  starters,
  maxChars,
  onChangeText,
  onSelectStarter,
  onSubmit,
  onSkip,
}: PersonalInputComposerProps): React.JSX.Element {
  const canSubmit = trim(value).length > 0;

  return (
    <View className="w-full">
      {starters.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row gap-2 mb-2 pb-1"
        >
          {starters.map((starter) => (
            <Pressable
              key={starter}
              onPress={() => onSelectStarter(starter)}
              className="px-3.5 py-2 rounded-full bg-neutral-100 active:bg-[#f2f8ef] mr-2"
            >
              <Text className="text-neutral-700 text-sm font-medium">{starter}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View className="flex-row items-center bg-neutral-100 rounded-full px-4 py-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          maxLength={maxChars}
          className="flex-1 min-h-[44px] text-neutral-900 font-medium text-base py-2"
          placeholderTextColor="#767676"
        />
        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            canSubmit ? 'bg-[#5f7f58]' : 'bg-transparent'
          }`}
        >
          <Send size={18} color={canSubmit ? '#ffffff' : '#aaaaaa'} />
        </Pressable>
      </View>

      <View className="flex-row justify-between items-center mt-2 px-2">
        <Pressable onPress={onSkip}>
          <Text className="text-xs font-medium text-neutral-500">Skip for now</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Create ChatReplyFooter (Zero Nested Ternaries)**

Create `src/domains/onboarding/ui/presentation/components/ChatReplyFooter.tsx`:

```tsx
import React from 'react';
import { ChatPhase } from '../../../domain/enums';
import { QuickReplyStrip } from './QuickReplyStrip';
import { PersonalInputComposer } from './PersonalInputComposer';
import { THOUGHT_STARTERS } from '../../../domain/scoring';

export interface ChatReplyFooterProps {
  phase: ChatPhase;
  composerText: string;
  onShowMe: () => void;
  onRateBelief: (rating: number) => void;
  onSaveReflection: () => void;
  onChangeComposerText: (text: string) => void;
  onSelectStarter: (starter: string) => void;
  onSubmitPersonal: () => void;
}

const RATING_OPTIONS = [
  { label: 'Not at all', value: '0' },
  { label: 'A little', value: '1' },
  { label: 'Somewhat', value: '2' },
  { label: 'Mostly', value: '3' },
];

// ponytail: flat switch replaces complex nested JSX ternaries
export function ChatReplyFooter({
  phase,
  composerText,
  onShowMe,
  onRateBelief,
  onSaveReflection,
  onChangeComposerText,
  onSelectStarter,
  onSubmitPersonal,
}: ChatReplyFooterProps): React.JSX.Element {
  switch (phase) {
    case ChatPhase.ShowMe:
      return (
        <QuickReplyStrip
          options={[{ label: 'Show me', value: 'show' }]}
          onSelect={onShowMe}
        />
      );

    case ChatPhase.RateInitial:
    case ChatPhase.RateShift:
      return (
        <QuickReplyStrip
          options={RATING_OPTIONS}
          isWrap
          onSelect={(opt) => onRateBelief(parseInt(opt.value, 10))}
        />
      );

    case ChatPhase.ReadyToSave:
      return (
        <QuickReplyStrip
          options={[{ label: 'Save this reflection', value: 'save' }]}
          onSelect={onSaveReflection}
        />
      );

    case ChatPhase.PersonalInput:
    default:
      return (
        <PersonalInputComposer
          value={composerText}
          placeholder="Write what happened..."
          starters={THOUGHT_STARTERS}
          maxChars={280}
          onChangeText={onChangeComposerText}
          onSelectStarter={onSelectStarter}
          onSubmit={onSubmitPersonal}
          onSkip={onSaveReflection}
        />
      );
  }
}
```

- [ ] **Step 4: Create OnboardingSheetsModal**

Create `src/domains/onboarding/ui/presentation/components/OnboardingSheetsModal.tsx`:

```tsx
import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { SheetType } from '../../../domain/enums';

export interface OnboardingSheetsModalProps {
  activeSheet: SheetType | null;
  onClose: () => void;
  onLeaveConfirm: () => void;
  onSignInPress: () => void;
}

export function OnboardingSheetsModal({
  activeSheet,
  onClose,
  onLeaveConfirm,
  onSignInPress,
}: OnboardingSheetsModalProps): React.JSX.Element {
  if (!activeSheet) return <></>;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/40 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-3xl p-6 pt-5">
          {activeSheet === SheetType.Who && (
            <View>
              <Text className="text-xl font-bold text-neutral-900 mb-2">Who is Happi?</Text>
              <Text className="text-sm font-medium text-neutral-700 leading-relaxed mb-4">
                Happi is a panda who likes slow mornings and noticing small things. Happi keeps you
                company while you practise the skills in Happy. Happi isn’t a therapist, coach, or judge.
              </Text>
              <Pressable
                onPress={onClose}
                className="w-full min-h-[52px] bg-[#5f7f58] rounded-full items-center justify-center"
              >
                <Text className="text-white font-bold text-base">Got it</Text>
              </Pressable>
            </View>
          )}

          {activeSheet === SheetType.Leave && (
            <View>
              <Text className="text-xl font-bold text-neutral-900 mb-2">Leave this practice?</Text>
              <Text className="text-sm font-medium text-neutral-600 mb-4">Nothing is saved yet.</Text>
              <Pressable
                onPress={onClose}
                className="w-full min-h-[52px] bg-[#5f7f58] rounded-full items-center justify-center mb-2"
              >
                <Text className="text-white font-bold text-base">Keep going</Text>
              </Pressable>
              <Pressable
                onPress={onLeaveConfirm}
                className="w-full min-h-[48px] bg-neutral-100 rounded-full items-center justify-center mt-2"
              >
                <Text className="text-neutral-700 font-semibold text-base">Leave</Text>
              </Pressable>
            </View>
          )}

          {activeSheet === SheetType.SignIn && (
            <View>
              <Text className="text-xl font-bold text-neutral-900 mb-2">Welcome back</Text>
              <Text className="text-sm font-medium text-neutral-600 mb-4">
                Sign in to pick up where you left off.
              </Text>
              <Pressable
                onPress={onSignInPress}
                className="w-full min-h-[52px] bg-neutral-900 rounded-full items-center justify-center mb-2"
              >
                <Text className="text-white font-bold text-base">Continue</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

- [ ] **Step 5: Verify input and footer components**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 6: Presentation Layer - Keepsake Card & Inline Reminder (Using `date-fns` & `lucide-react-native`)

**Files:**
- Create: `src/domains/onboarding/ui/presentation/components/SavedReflectionCard.tsx`
- Create: `src/domains/onboarding/ui/presentation/components/InlineReminderBanner.tsx`

**Interfaces:**
- Consumes: `ReflectionData`, `format` from `date-fns`, `Check`, `ArrowDown`, `Sun`, `Moon` from `lucide-react-native`
- Produces: Strictly JSX keepsake card and inline notification banner.

- [ ] **Step 1: Create SavedReflectionCard**

Create `src/domains/onboarding/ui/presentation/components/SavedReflectionCard.tsx`:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { Check, ArrowDown } from 'lucide-react-native';
import type { ReflectionData } from '../../../domain/types';
import { SceneArtSvg } from './SceneArtSvg';
import { TRAP_LABELS } from '../../../domain/traps';
import { formatBeliefSummary } from '../../../domain/scoring';

export interface SavedReflectionCardProps {
  reflection: ReflectionData;
}

export function SavedReflectionCard({
  reflection,
}: SavedReflectionCardProps): React.JSX.Element {
  const isPersonal = reflection.source === 'personal';
  const trapTitle = reflection.trap ? TRAP_LABELS[reflection.trap] : '';
  const beliefText = formatBeliefSummary(reflection.before, reflection.after);
  const formattedDate = format(new Date(), 'MMM d');

  return (
    <View className="w-full rounded-3xl border-2 border-neutral-200 bg-white overflow-hidden my-4 shadow-sm">
      <View className="bg-[#f2f8ef] px-4 pt-4 pb-2 border-b border-neutral-100">
        {!isPersonal && reflection.art && (
          <SceneArtSvg goalId={reflection.art} caption="" />
        )}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View className="w-5 h-5 rounded-full bg-[#44633f] items-center justify-center">
              <Check size={12} color="#ffffff" strokeWidth={3} />
            </View>
            <Text className="text-xs font-bold text-[#44633f]">
              {isPersonal ? 'Saved to your journal' : 'Saved as practice'}
            </Text>
          </View>
          <Text className="text-xs font-semibold text-neutral-500">{formattedDate}</Text>
        </View>
      </View>

      <View className="p-4">
        <View className="bg-neutral-100 rounded-2xl p-3.5 mb-2">
          {isPersonal && reflection.situation ? (
            <View className="mb-2">
              <Text className="text-xs font-semibold text-neutral-500">What happened</Text>
              <Text className="text-sm font-medium text-neutral-900 mt-0.5">{reflection.situation}</Text>
            </View>
          ) : null}
          <Text className="text-xs font-semibold text-neutral-500">
            {isPersonal ? 'You thought' : 'The thought'}
          </Text>
          <Text className="text-base font-bold text-neutral-900 mt-0.5">“{reflection.thought}”</Text>
        </View>

        <View className="w-8 h-8 rounded-full bg-[#5f7f58] self-center items-center justify-center my-[-10px] z-10 border-2 border-white">
          <ArrowDown size={14} color="#ffffff" strokeWidth={3} />
        </View>

        <View className="border-2 border-[#5f7f58] bg-[#f2f8ef] rounded-2xl p-4 mt-2 mb-3">
          <Text className="text-xs font-semibold text-[#44633f]">
            {isPersonal ? 'You landed on' : 'Another view'}
          </Text>
          <Text className="text-base font-bold text-neutral-900 mt-1">{reflection.fair}</Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <View className="flex-1 min-w-[130px] p-3 rounded-2xl bg-neutral-100">
            <Text className="text-xs font-semibold text-neutral-500">How true it felt</Text>
            <Text className="text-sm font-bold text-neutral-900 mt-0.5">{beliefText}</Text>
          </View>
          <View className="flex-1 min-w-[130px] p-3 rounded-2xl bg-neutral-100">
            <Text className="text-xs font-semibold text-neutral-500">Practice</Text>
            <Text className="text-sm font-bold text-neutral-900 mt-0.5">1 completed · 1 of 3 this week</Text>
          </View>
          {Boolean(trapTitle) && (
            <View className="w-full p-3 rounded-2xl bg-neutral-100">
              <Text className="text-xs font-semibold text-neutral-500">Trap</Text>
              <Text className="text-sm font-bold text-neutral-900 mt-0.5">{trapTitle}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Create InlineReminderBanner**

Create `src/domains/onboarding/ui/presentation/components/InlineReminderBanner.tsx`:

```tsx
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { ReminderPreset } from '../../../domain/enums';

export interface InlineReminderBannerProps {
  isSet: boolean;
  activeTime: string | null;
  onPickPreset: (preset: ReminderPreset) => void;
  onChangeTime: () => void;
}

export function InlineReminderBanner({
  isSet,
  activeTime,
  onPickPreset,
  onChangeTime,
}: InlineReminderBannerProps): React.JSX.Element {
  if (isSet) {
    return (
      <View className="flex-row items-center justify-between p-4 bg-neutral-100 rounded-2xl mb-4">
        <Text className="text-sm font-bold text-neutral-800">
          Reminder set for {activeTime}
        </Text>
        <Pressable onPress={onChangeTime} className="p-1">
          <Text className="text-xs font-bold text-[#44633f]">Change</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="w-full my-3">
      <Text className="text-base font-bold text-neutral-900 mb-2">
        Want a nudge for your next one?
      </Text>

      <View className="flex-row items-start gap-3 p-3.5 bg-neutral-100 rounded-2xl mb-3">
        <Image
          source={require('@/assets/icons/icon-panda.png')}
          className="w-7 h-7 rounded-md"
        />
        <View className="flex-1">
          <Text className="text-xs font-bold text-neutral-900">Happy</Text>
          <Text className="text-xs font-medium text-neutral-600 mt-0.5">
            Ready to catch one more thought? 2 minutes.
          </Text>
        </View>
        <Text className="text-[10px] font-medium text-neutral-400">now</Text>
      </View>

      <View className="flex-col gap-2">
        <Pressable
          onPress={() => onPickPreset(ReminderPreset.Morning)}
          className="flex-row items-center justify-between p-3.5 bg-white border border-neutral-200 rounded-2xl active:bg-neutral-50"
        >
          <View className="flex-row items-center gap-2">
            <Sun size={20} color="#f5b942" />
            <Text className="text-base font-bold text-neutral-900">Morning</Text>
          </View>
          <Text className="text-sm font-semibold text-neutral-500">8:00 AM</Text>
        </Pressable>

        <Pressable
          onPress={() => onPickPreset(ReminderPreset.Evening)}
          className="flex-row items-center justify-between p-3.5 bg-white border border-neutral-200 rounded-2xl active:bg-neutral-50"
        >
          <View className="flex-row items-center gap-2">
            <Moon size={20} color="#a493d6" />
            <Text className="text-base font-bold text-neutral-900">Evening</Text>
          </View>
          <Text className="text-sm font-semibold text-neutral-500">8:00 PM</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Verify card and reminder banner**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 7: Presentation Layer - Screen Views

**Files:**
- Create: `src/domains/onboarding/ui/presentation/views/HelloStepView.tsx`
- Create: `src/domains/onboarding/ui/presentation/views/GoalPickStepView.tsx`
- Create: `src/domains/onboarding/ui/presentation/views/ThoughtCatcherChatStepView.tsx`
- Create: `src/domains/onboarding/ui/presentation/views/SavedKeepsakeStepView.tsx`

**Interfaces:**
- Consumes: Models, state, and callbacks from Container
- Produces: Pure JSX views for each step of onboarding.

- [ ] **Step 1: Create HelloStepView**

Create `src/domains/onboarding/ui/presentation/views/HelloStepView.tsx`:

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface HelloStepViewProps {
  guideStage: React.ReactNode;
  onHiPress: () => void;
  onWhoPress: () => void;
  onSignInPress: () => void;
}

export function HelloStepView({
  guideStage,
  onHiPress,
  onWhoPress,
  onSignInPress,
}: HelloStepViewProps): React.JSX.Element {
  return (
    <View className="flex-1 justify-between px-6 pb-6 pt-4">
      <View className="items-center">
        <View className="bg-white border border-neutral-200 rounded-2xl px-4 py-2 mb-3 shadow-xs">
          <Text className="text-sm font-semibold text-neutral-800">Hi, I’m Happi.</Text>
        </View>
        <View className="w-56 h-56 items-center justify-center my-2">
          {guideStage}
        </View>
        <Text className="text-3xl font-bold text-neutral-900 text-center mt-3">
          One thought at a time.
        </Text>
        <Text className="text-lg font-medium text-neutral-600 text-center mt-1">
          Two minutes. No sign-up.
        </Text>
        <Text className="text-xs font-normal text-neutral-500 text-center max-w-[280px] mt-3">
          Happy helps you practise CBT skills. It isn’t therapy and doesn’t replace professional care.
        </Text>
      </View>

      <View className="w-full gap-3">
        <Pressable
          onPress={onHiPress}
          className="w-full min-h-[56px] bg-[#5f7f58] rounded-full items-center justify-center shadow-md active:scale-[0.98]"
        >
          <Text className="text-white text-lg font-bold">Hi, Happi</Text>
        </Pressable>
        <Pressable onPress={onWhoPress} className="items-center py-1">
          <Text className="text-xs font-semibold text-neutral-500 underline">Who is Happi?</Text>
        </Pressable>
        <Pressable onPress={onSignInPress} className="items-center py-1">
          <Text className="text-xs font-semibold text-neutral-500 underline">I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Create GoalPickStepView**

Create `src/domains/onboarding/ui/presentation/views/GoalPickStepView.tsx`:

```tsx
import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { GoalId } from '../../../domain/enums';
import type { GoalDefinition } from '../../../domain/types';

export interface GoalPickStepViewProps {
  goals: GoalDefinition[];
  selectedGoalId: GoalId | null;
  guideStage: React.ReactNode;
  onSelectGoal: (goal: GoalDefinition) => void;
}

export function GoalPickStepView({
  goals,
  selectedGoalId,
  guideStage,
  onSelectGoal,
}: GoalPickStepViewProps): React.JSX.Element {
  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center gap-3 pt-2 mb-4">
        <View className="w-20 h-20 items-center justify-center">
          {guideStage}
        </View>
        <View className="flex-1 bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-xs">
          <Text className="text-lg font-bold text-neutral-900 leading-snug">
            What’s on your mind?
          </Text>
        </View>
      </View>

      <View className="flex-col gap-2.5 pb-8">
        {goals.map((g) => {
          const isSelected = selectedGoalId === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => onSelectGoal(g)}
              className={`min-h-[76px] flex-row items-center p-3 rounded-2xl border-2 active:scale-[0.99] ${
                isSelected
                  ? 'bg-[#f2f8ef] border-[#5f7f58]'
                  : 'bg-white border-neutral-200'
              }`}
            >
              <View
                className="w-14 h-14 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: g.tint }}
              >
                <Text className="text-xl font-bold text-neutral-800">
                  {g.id === GoalId.Worry ? '💭' : g.id === GoalId.Mood ? '🌧️' : g.id === GoalId.Stress ? '⚡' : g.id === GoalId.Self ? '💬' : '🌙'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-neutral-900">{g.label}</Text>
                <Text className="text-xs font-medium text-neutral-600 mt-0.5">{g.sub}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 3: Create ThoughtCatcherChatStepView & SavedKeepsakeStepView**

Create `src/domains/onboarding/ui/presentation/views/ThoughtCatcherChatStepView.tsx`:

```tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { GoalId } from '../../../domain/enums';
import type { ChatMessage } from '../../../domain/types';
import { ChatMessageBubble } from '../components/ChatMessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { SceneArtSvg } from '../components/SceneArtSvg';

export interface ThoughtCatcherChatStepViewProps {
  messages: ChatMessage[];
  isTyping: boolean;
  activeSceneGoalId: GoalId | null;
  activeSceneCaption: string | null;
  guideStage: React.ReactNode;
  footerReplyView: React.ReactNode;
}

export function ThoughtCatcherChatStepView({
  messages,
  isTyping,
  activeSceneGoalId,
  activeSceneCaption,
  guideStage,
  footerReplyView,
}: ThoughtCatcherChatStepViewProps): React.JSX.Element {
  return (
    <View className="flex-1">
      <View className="w-full items-end pr-4 py-1 z-10">
        {guideStage}
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {activeSceneGoalId && activeSceneCaption && (
          <SceneArtSvg goalId={activeSceneGoalId} caption={activeSceneCaption} />
        )}

        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}
      </ScrollView>

      <View className="px-4 pb-4 pt-2 bg-white/90 border-t border-neutral-100">
        {footerReplyView}
      </View>
    </View>
  );
}
```

Create `src/domains/onboarding/ui/presentation/views/SavedKeepsakeStepView.tsx`:

```tsx
import React from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';
import { ReminderPreset } from '../../../domain/enums';
import type { ReflectionData } from '../../../domain/types';
import { SavedReflectionCard } from '../components/SavedReflectionCard';
import { InlineReminderBanner } from '../components/InlineReminderBanner';

export interface SavedKeepsakeStepViewProps {
  reflection: ReflectionData;
  isReminderSet: boolean;
  activeReminderTime: string | null;
  onPickPreset: (preset: ReminderPreset) => void;
  onChangeReminderTime: () => void;
  onGoHome: () => void;
}

export function SavedKeepsakeStepView({
  reflection,
  isReminderSet,
  activeReminderTime,
  onPickPreset,
  onChangeReminderTime,
  onGoHome,
}: SavedKeepsakeStepViewProps): React.JSX.Element {
  return (
    <View className="flex-1 justify-between px-4 pb-6">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <SavedReflectionCard reflection={reflection} />
        <InlineReminderBanner
          isSet={isReminderSet}
          activeTime={activeReminderTime}
          onPickPreset={onPickPreset}
          onChangeTime={onChangeReminderTime}
        />
      </ScrollView>

      <Pressable
        onPress={onGoHome}
        className="w-full min-h-[56px] bg-[#5f7f58] rounded-full items-center justify-center shadow-md active:scale-[0.98] mt-2"
      >
        <Text className="text-white text-lg font-bold">Go to Home</Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 4: Verify step views**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 8: Container Layer - Motion Hook & Character Stage

**Files:**
- Create: `src/domains/onboarding/ui/containers/useHappiGuideMotion.ts`
- Create: `src/domains/onboarding/ui/presentation/components/HappiGuideStage.tsx`

**Interfaces:**
- Consumes: Reanimated shared values, `GoalId`
- Produces: `useHappiGuideMotion` hook and `HappiGuideStage` component.

- [ ] **Step 1: Implement motion hook**

Create `src/domains/onboarding/ui/containers/useHappiGuideMotion.ts`:

```typescript
import { useCallback } from 'react';
import { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { GoalId } from '../../domain/enums';

export enum ActingPose {
  Rest = 'rest',
  Worry = 'worry',
  Mood = 'mood',
  Relieved = 'relieved',
  Pride = 'pride',
}

export function useHappiGuideMotion() {
  const weatherF = useSharedValue(0.35);

  const setWeather = useCallback((f: number, slow = false) => {
    weatherF.value = withTiming(f, {
      duration: slow ? 1600 : 600,
      easing: Easing.bezier(0.77, 0, 0.175, 1),
    });
  }, [weatherF]);

  const actPose = useCallback((_pose: ActingPose | GoalId) => {
    // ponytail: simplified pose tracking
  }, []);

  return {
    weatherF,
    setWeather,
    actPose,
  };
}
```

- [ ] **Step 2: Implement HappiGuideStage**

Create `src/domains/onboarding/ui/presentation/components/HappiGuideStage.tsx`:

```tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Rect, Ellipse } from 'react-native-svg';

export interface HappiGuideStageProps {
  weather: number;
  size?: 'hero' | 'compact';
}

export function HappiGuideStage({
  weather,
  size = 'compact',
}: HappiGuideStageProps): React.JSX.Element {
  const isHero = size === 'hero';
  const width = isHero ? 180 : 90;
  const height = isHero ? 180 : 90;

  return (
    <View style={{ width, height }} className="items-center justify-center">
      <Svg viewBox="44 0 236 240" className="w-full h-full">
        <Circle cx="229" cy="30" r="11" fill={weather > 0.5 ? '#a9bfa0' : '#e4eee0'} />
        <Circle cx="245" cy="22" r="14" fill={weather > 0.5 ? '#a9bfa0' : '#e4eee0'} />
        <Circle cx="260" cy="31" r="10" fill={weather > 0.5 ? '#a9bfa0' : '#e4eee0'} />
        <Rect x="220" y="29" width="50" height="12" rx="6" fill={weather > 0.5 ? '#a9bfa0' : '#e4eee0'} />
        <Ellipse cx="130" cy="229" rx="54" ry="8" fill="#BCD0AF" />
        <Circle cx="132" cy="115" r="45" fill="#252525" />
        <Circle cx="132" cy="115" r="40" fill="#ffffff" />
        <Circle cx="118" cy="110" r="8" fill="#252525" />
        <Circle cx="146" cy="110" r="8" fill="#252525" />
      </Svg>
    </View>
  );
}
```

- [ ] **Step 3: Verify motion hook & stage**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 9: Container Layer - Focused Custom Hooks (Separation of Concerns)

**Files:**
- Create: `src/domains/onboarding/ui/containers/hooks/useOnboardingStep.ts`
- Create: `src/domains/onboarding/ui/containers/hooks/useChatMessages.ts`
- Create: `src/domains/onboarding/ui/containers/hooks/useReflectionDraft.ts`
- Create: `src/domains/onboarding/ui/containers/hooks/useReminderSelection.ts`
- Create: `src/domains/onboarding/ui/containers/hooks/useComposerState.ts`

**Interfaces:**
- Decomposes monolithic controller into 5 focused hooks <= 60 lines each.

- [ ] **Step 1: Implement `useOnboardingStep` (Navigation & Progress)**

Create `src/domains/onboarding/ui/containers/hooks/useOnboardingStep.ts`:

```typescript
import { useState, useCallback } from 'react';
import { OnboardingStep } from '../../../domain/enums';

export function useOnboardingStep() {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.Hello);
  const [progressFill, setProgressFill] = useState<number>(0.08);

  const goToStep = useCallback((nextStep: OnboardingStep, progress: number) => {
    setStep(nextStep);
    setProgressFill(progress);
  }, []);

  const goBack = useCallback(() => {
    if (step === OnboardingStep.Saved) {
      setStep(OnboardingStep.Chat);
      setProgressFill(0.7);
    } else if (step === OnboardingStep.Chat) {
      setStep(OnboardingStep.GoalPick);
      setProgressFill(0.2);
    } else if (step === OnboardingStep.GoalPick) {
      setStep(OnboardingStep.Hello);
      setProgressFill(0.08);
    }
  }, [step]);

  return { step, progressFill, goToStep, goBack };
}
```

- [ ] **Step 2: Implement `useChatMessages` (Chat Thread & Typing Indicator)**

Create `src/domains/onboarding/ui/containers/hooks/useChatMessages.ts`:

```typescript
import { useState, useCallback, useRef } from 'react';
import { MessageSender } from '../../../domain/enums';
import type { ChatMessage } from '../../../domain/types';

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const idGen = useRef(0);

  const pushMessage = useCallback((sender: MessageSender, text: string, extra?: Partial<ChatMessage>) => {
    idGen.current += 1;
    const msg: ChatMessage = {
      id: `msg_${idGen.current}`,
      sender,
      text,
      timestamp: Date.now(),
      ...extra,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  return { messages, isTyping, setIsTyping, pushMessage };
}
```

- [ ] **Step 3: Implement `useReflectionDraft` (Reflection State Management)**

Create `src/domains/onboarding/ui/containers/hooks/useReflectionDraft.ts`:

```typescript
import { useState, useCallback } from 'react';
import type { GoalDefinition, ReflectionData } from '../../../domain/types';
import type { ReminderPreset } from '../../../domain/enums';

const INITIAL_REFLECTION: ReflectionData = {
  goal: null,
  source: 'example',
  situation: '',
  thought: '',
  why: '',
  fair: '',
  before: null,
  after: null,
  reminder: null,
};

export function useReflectionDraft() {
  const [reflection, setReflection] = useState<ReflectionData>(INITIAL_REFLECTION);

  const applyGoal = useCallback((g: GoalDefinition) => {
    setReflection((prev) => ({
      ...prev,
      goal: g.id,
      art: g.id,
      situation: g.scene,
      thought: g.thought,
      trap: g.trap,
      why: g.why,
      fair: g.fair,
    }));
  }, []);

  const setBeliefRating = useCallback((rating: number, isAfter: boolean) => {
    setReflection((prev) => (isAfter ? { ...prev, after: rating } : { ...prev, before: rating }));
  }, []);

  const setPersonalThought = useCallback((text: string) => {
    setReflection((prev) => ({
      ...prev,
      source: 'personal',
      thought: text,
      situation: text,
    }));
  }, []);

  const setReminder = useCallback((time: ReminderPreset | string) => {
    setReflection((prev) => ({ ...prev, reminder: time }));
  }, []);

  return { reflection, applyGoal, setBeliefRating, setPersonalThought, setReminder };
}
```

- [ ] **Step 4: Implement `useReminderSelection` & `useComposerState`**

Create `src/domains/onboarding/ui/containers/hooks/useReminderSelection.ts`:

```typescript
import { useState, useCallback } from 'react';
import { ReminderPreset } from '../../../domain/enums';

export function useReminderSelection(onSelect: (preset: ReminderPreset) => void) {
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const [isSet, setIsSet] = useState<boolean>(false);

  const selectPreset = useCallback((preset: ReminderPreset) => {
    setActiveTime(preset);
    setIsSet(true);
    onSelect(preset);
  }, [onSelect]);

  const resetSelection = useCallback(() => {
    setIsSet(false);
  }, []);

  return { activeTime, isSet, selectPreset, resetSelection };
}
```

Create `src/domains/onboarding/ui/containers/hooks/useComposerState.ts`:

```typescript
import { useState, useCallback } from 'react';

export function useComposerState() {
  const [text, setText] = useState<string>('');

  const applyStarter = useCallback((starter: string) => {
    setText(starter);
  }, []);

  const clearText = useCallback(() => {
    setText('');
  }, []);

  return { text, setText, applyStarter, clearText };
}
```

- [ ] **Step 5: Verify all individual hooks**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 10: Container Layer - Root Container & Domain Index Export

**Files:**
- Create: `src/domains/onboarding/ui/containers/OnboardingContainer.tsx`
- Create: `src/domains/onboarding/ui/index.ts`
- Create: `src/domains/onboarding/index.ts`

**Interfaces:**
- Consumes: Composed focused hooks, presentation views
- Produces: Top-level `OnboardingContainer` ready to drop into any route.

- [ ] **Step 1: Implement OnboardingContainer**

Create `src/domains/onboarding/ui/containers/OnboardingContainer.tsx`:

```tsx
import React, { useState, useCallback } from 'react';
import { View, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { OnboardingStep, ChatPhase, SheetType, MessageSender, ReminderPreset } from '../../domain/enums';
import { GOALS } from '../../domain/goals';
import { getShiftCopy, weighBelief } from '../../domain/scoring';
import { completeOnboarding } from '../../data/onboardingRepository';

import { useOnboardingStep } from './hooks/useOnboardingStep';
import { useChatMessages } from './hooks/useChatMessages';
import { useReflectionDraft } from './hooks/useReflectionDraft';
import { useReminderSelection } from './hooks/useReminderSelection';
import { useComposerState } from './hooks/useComposerState';
import { useHappiGuideMotion, ActingPose } from './useHappiGuideMotion';

import { OnboardingHeader } from '../presentation/components/OnboardingHeader';
import { HappiGuideStage } from '../presentation/components/HappiGuideStage';
import { HelloStepView } from '../presentation/views/HelloStepView';
import { GoalPickStepView } from '../presentation/views/GoalPickStepView';
import { ThoughtCatcherChatStepView } from '../presentation/views/ThoughtCatcherChatStepView';
import { SavedKeepsakeStepView } from '../presentation/views/SavedKeepsakeStepView';
import { ChatReplyFooter } from '../presentation/components/ChatReplyFooter';
import { OnboardingSheetsModal } from '../presentation/components/OnboardingSheetsModal';
import type { GoalDefinition } from '../../domain/types';

export interface OnboardingContainerProps {
  userId?: string;
  onComplete: () => void;
}

export function OnboardingContainer({
  userId,
  onComplete,
}: OnboardingContainerProps): React.JSX.Element {
  const { step, progressFill, goToStep, goBack } = useOnboardingStep();
  const { messages, isTyping, setIsTyping, pushMessage } = useChatMessages();
  const { reflection, applyGoal, setBeliefRating, setPersonalThought, setReminder } = useReflectionDraft();
  const reminder = useReminderSelection((p) => setReminder(p));
  const composer = useComposerState();
  const guide = useHappiGuideMotion();

  const [selectedGoal, setSelectedGoal] = useState<GoalDefinition | null>(null);
  const [chatPhase, setChatPhase] = useState<ChatPhase>(ChatPhase.ShowMe);
  const [activeSheet, setActiveSheet] = useState<SheetType | null>(null);

  const handleStartHello = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    goToStep(OnboardingStep.GoalPick, 0.2);
    guide.actPose(ActingPose.Rest);
    guide.setWeather(0.35);
  }, [goToStep, guide]);

  const handleSelectGoal = useCallback((g: GoalDefinition) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGoal(g);
    applyGoal(g);
    guide.actPose(g.id);
    guide.setWeather(g.f);
    goToStep(OnboardingStep.Chat, 0.35);
    setChatPhase(ChatPhase.ShowMe);
    pushMessage(MessageSender.Happi, g.mirror, { isHeading: true });
  }, [applyGoal, goToStep, guide, pushMessage]);

  const handleRateBelief = useCallback((rating: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (chatPhase === ChatPhase.RateInitial) {
      setBeliefRating(rating, false);
      guide.setWeather(weighBelief(rating));
      pushMessage(MessageSender.User, `${rating}/4`);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        if (selectedGoal) {
          guide.actPose(ActingPose.Relieved);
          guide.setWeather(0.12, true);
          pushMessage(MessageSender.Happi, selectedGoal.fair, {
            isFair: true,
            why: selectedGoal.why,
            trapLabel: selectedGoal.trap,
          });
          setChatPhase(ChatPhase.RateShift);
        }
      }, 600);
    } else {
      setBeliefRating(rating, true);
      const copy = getShiftCopy(reflection.before ?? 3, rating);
      pushMessage(MessageSender.User, `${rating}/4`);
      pushMessage(MessageSender.Happi, copy);
      guide.actPose(ActingPose.Rest);
      setChatPhase(ChatPhase.ReadyToSave);
    }
  }, [chatPhase, guide, pushMessage, reflection.before, selectedGoal, setBeliefRating, setIsTyping]);

  const handleShowSaved = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    goToStep(OnboardingStep.Saved, 1.0);
    guide.actPose(ActingPose.Pride);
    guide.setWeather(0.08);
  }, [goToStep, guide]);

  const handlePersonalSubmit = useCallback(() => {
    if (!composer.text.trim()) return;
    setPersonalThought(composer.text.trim());
    pushMessage(MessageSender.User, composer.text.trim());
    composer.clearText();
    setChatPhase(ChatPhase.RateInitial);
  }, [composer, pushMessage, setPersonalThought]);

  const handleFinish = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await completeOnboarding(userId, reflection);
    onComplete();
  }, [userId, reflection, onComplete]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <OnboardingHeader
        showBack={step !== OnboardingStep.Hello}
        showProgress={step !== OnboardingStep.Hello}
        progressFill={progressFill}
        onBack={goBack}
      />

      <View className="flex-1">
        {step === OnboardingStep.Hello && (
          <HelloStepView
            guideStage={<HappiGuideStage weather={guide.weatherF.value} size="hero" />}
            onHiPress={handleStartHello}
            onWhoPress={() => setActiveSheet(SheetType.Who)}
            onSignInPress={() => setActiveSheet(SheetType.SignIn)}
          />
        )}

        {step === OnboardingStep.GoalPick && (
          <GoalPickStepView
            goals={GOALS}
            selectedGoalId={selectedGoal?.id ?? null}
            guideStage={<HappiGuideStage weather={guide.weatherF.value} size="compact" />}
            onSelectGoal={handleSelectGoal}
          />
        )}

        {step === OnboardingStep.Chat && (
          <ThoughtCatcherChatStepView
            messages={messages}
            isTyping={isTyping}
            activeSceneGoalId={selectedGoal?.id ?? null}
            activeSceneCaption={selectedGoal?.scene ?? null}
            guideStage={<HappiGuideStage weather={guide.weatherF.value} size="compact" />}
            footerReplyView={
              <ChatReplyFooter
                phase={chatPhase}
                composerText={composer.text}
                onShowMe={() => setChatPhase(ChatPhase.RateInitial)}
                onRateBelief={handleRateBelief}
                onSaveReflection={handleShowSaved}
                onChangeComposerText={composer.setText}
                onSelectStarter={composer.applyStarter}
                onSubmitPersonal={handlePersonalSubmit}
              />
            }
          />
        )}

        {step === OnboardingStep.Saved && (
          <SavedKeepsakeStepView
            reflection={reflection}
            isReminderSet={reminder.isSet}
            activeReminderTime={reminder.activeTime}
            onPickPreset={reminder.selectPreset}
            onChangeReminderTime={() => reminder.selectPreset(ReminderPreset.Evening)}
            onGoHome={handleFinish}
          />
        )}
      </View>

      <OnboardingSheetsModal
        activeSheet={activeSheet}
        onClose={() => setActiveSheet(null)}
        onLeaveConfirm={() => {
          setActiveSheet(null);
          goBack();
        }}
        onSignInPress={() => {
          setActiveSheet(null);
          handleFinish();
        }}
      />
    </SafeAreaView>
  );
}
```

- [ ] **Step 2: Create public module exports**

Create `src/domains/onboarding/ui/index.ts`:

```typescript
export { OnboardingContainer } from './containers/OnboardingContainer';
export type { OnboardingContainerProps } from './containers/OnboardingContainer';
```

Create `src/domains/onboarding/index.ts`:

```typescript
export * from './domain/enums';
export * from './domain/types';
export * from './domain/goals';
export * from './domain/traps';
export * from './domain/scoring';
export * from './ui';
```

- [ ] **Step 3: Verify module exports**

Run: `npx tsc --noEmit`
Expected: PASS.

---

### Task 11: Route Integration & Verification

**Files:**
- Modify: `app/tabs/screens/(onboarding)/premium-onboarding.tsx`

**Interfaces:**
- Consumes: `OnboardingContainer` from `src/domains/onboarding`
- Produces: Updated route pointing directly to clean DDD onboarding container.

- [ ] **Step 1: Update premium onboarding route**

In `app/tabs/screens/(onboarding)/premium-onboarding.tsx`, swap legacy onboarding with `OnboardingContainer`:

```tsx
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import SignInBottomSheet, { type SignInBottomSheetHandle } from "@/src/components/SignInBottomSheet";
import { useAuth } from "@/src/context/AuthContext";
import { OnboardingContainer } from "@/src/domains/onboarding";

// ponytail: use clean architecture OnboardingContainer with guest continuity
export default function PremiumOnboardingRoute(): React.JSX.Element {
  const router = useRouter();
  const signInSheetRef = useRef<SignInBottomSheetHandle>(null);
  const hasContinuedRef = useRef<boolean>(false);
  const { user } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const continueToHome = useCallback((): void => {
    if (hasContinuedRef.current) return;
    hasContinuedRef.current = true;
    router.replace("/tabs/(tabs)/home");
  }, [router]);

  const handleComplete = useCallback(async (): Promise<void> => {
    continueToHome();
  }, [continueToHome]);

  return (
    <View className="flex-1">
      <OnboardingContainer userId={user?.id} onComplete={handleComplete} />
      {isSheetOpen && (
        <View
          style={StyleSheet.absoluteFill}
          className="bg-black/35"
          pointerEvents="auto"
        />
      )}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <SignInBottomSheet
          ref={signInSheetRef}
          source="onboarding"
          showSkipButton
          onOpenChange={setIsSheetOpen}
          onDismiss={continueToHome}
          onSkip={continueToHome}
          onSuccess={continueToHome}
        />
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 3: Update knowledge graph**

Run: `graphify update .`
Expected: Success update of codebase AST knowledge graph.
