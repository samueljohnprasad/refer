# Product Requirements Document: Engagement & Retention Features

**App Name:** Refer (Mental Wellness & Self-Improvement)
**Version:** v2.0 Feature Expansion
**Date:** April 2, 2026
**Author:** AI Product Consultant

---

## 1. Executive Summary

Refer is a gamified mental wellness app combining **journaling** (text, voice, image), **CBT exercises** (thought reframing, gratitude reframe, thought catcher), **mood tracking**, **calorie/nutrition logging**, **habit tracking**, and a **Duolingo-style learning journey map**. It already has a strong gamification foundation — XP, levels, coins, achievements, daily/weekly challenges, streak tracking, and a rewards shop.

This PRD proposes **7 high-impact feature areas** designed to increase DAU, session length, D7/D30 retention, and monetization. Each feature is prioritized by effort-to-impact ratio and builds on the existing codebase infrastructure.

---

## 2. Current App Audit

### What Exists (Strengths)
| System | Status |
|--------|--------|
| XP + Levels (5 tiers: Beginner → Zen Master) | ✅ Shipped |
| Coins + Rewards Shop (themes, avatars, prompt packs, animations) | ✅ Shipped |
| Achievements (17 badges across 5 categories) | ✅ Shipped |
| Daily Challenges (8 types, 3 shown/day) | ✅ Shipped |
| Weekly Challenges (6 types, 2 shown/week) | ✅ Shipped |
| Streak tracking + milestone rewards | ✅ Shipped |
| Level-up celebration modals | ✅ Shipped |
| Journey Map with units, nodes, chests, mascot | ✅ Shipped |
| Voice journaling + image journaling | ✅ Shipped |
| CBT Exercises (thought reframing, gratitude, thought catcher) | ✅ Shipped |
| AI Weekly Insights (paywall-gated) | ✅ Shipped |
| Onboarding (goals, mood, feature discovery, soft paywall) | ✅ Shipped |
| Push notifications with deep linking | ✅ Shipped |
| RevenueCat subscription integration | ✅ Shipped |

### What's Missing (Gaps)
| Gap | Impact |
|-----|--------|
| No social features — app is entirely single-player | High |
| No daily "home" ritual — home tab shows calendar, not today's tasks | High |
| Journey map lessons not connected to real exercises | High |
| No streak recovery (lose streak = lose motivation) | Medium |
| Limited notification intelligence (no behavioral triggers) | Medium |
| No progress visualization over time (graphs, trends) | Medium |
| Rewards shop has no "spend coins" sink beyond unlocks | Medium |
| No community or accountability system | High |

---

## 3. Proposed Features (Priority Order)

---

### 3.1 🏠 FEATURE: Daily Action Hub (Home Screen Redesign)

**Priority:** P0 — Highest Impact
**Effort:** ~2 weeks
**Retention lever:** Gives users a clear daily mission every time they open the app

#### Problem
The Home tab currently shows a journal calendar — useful for review, but not for driving daily action. Users open the app and don't know what to do first. This causes session abandonment and breaks the habit loop.

#### Solution
Replace/augment the Home tab with a **"Today" dashboard** — a single screen that surfaces everything the user should do today in priority order.

#### Requirements

**3.1.1 Daily Greeting Card**
- Personalized greeting based on time of day: "Good morning, {name}"
- Current streak count with flame icon and streak-freeze indicator
- Today's XP earned vs daily XP goal (configurable, default 50 XP)
- Animated progress ring showing daily XP completion percentage

**3.1.2 Today's Challenges Section**
- Show the 3 daily + 2 weekly challenges as interactive cards
- Each card shows: icon, title, progress bar (e.g. "1/3 meals tracked"), XP + coin reward
- Tapping a challenge deep-links to the relevant feature (journal, mood log, etc.)
- Completed challenges show checkmark animation + "Claimed" state
- Auto-claim rewards when challenge completes (with confetti micro-animation)

**3.1.3 Quick Action Row**
- Horizontal row of 4 shortcut buttons: "Journal", "Mood", "Exercise", "Track Meal"
- Each button opens the relevant screen in one tap
- Badges on buttons if there's a related uncompleted challenge

**3.1.4 Journey Progress Card**
- Mini journey map preview showing current unit name + node progress (e.g. "Unit 1: 4/8 lessons")
- "Continue Learning" CTA that navigates to Learn tab
- Shows next lesson name and estimated time

**3.1.5 Streak + Stats Bar**
- Current streak (days), total journals, current level with progress bar
- Tapping opens full stats/achievements screen

**3.1.6 Motivational Quote / Mascot Message**
- Owl mascot with rotating daily message (pull from existing `MASCOT_ENCOURAGEMENT_MESSAGES`)
- Tappable to cycle messages (reuse `MascotBubble` component)

#### Success Metrics
- **Primary:** D1 retention +15%, daily sessions +20%
- **Secondary:** Challenge completion rate +30%, average session length +25%

#### Technical Notes
- Reuse `ChallengesContext`, `XPContext`, `LevelContext`, `journeyStatsAtom`
- New screen: `src/screens/TodayScreen/TodayScreen.tsx` (container + presentation pattern)
- New hook: `useDailyGoal.ts` for XP goal tracking
- Replace Home tab route or add as a new first tab

---

### 3.2 🔗 FEATURE: Journey ↔ Exercise Integration

**Priority:** P0 — Highest Impact
**Effort:** ~2 weeks
**Retention lever:** Makes the learning journey functional, not decorative

#### Problem
The journey map has units, nodes, and chests, but tapping an ACTIVE node navigates to `/tabs/screens/task/${node.taskId}` which doesn't exist as a real task. The exercises screen lists CBT exercises separately. There's no connection between the journey path and the actual therapeutic exercises.

#### Solution
Wire journey nodes to actual exercises so that completing a journey lesson means completing a real CBT exercise, journal prompt, or wellness activity.

#### Requirements

**3.2.1 Task Type System**
```typescript
type JourneyTaskType =
  | 'thought_reframing'    // links to ThoughtReframingScreen
  | 'gratitude_reframe'    // links to GratitudeReframeScreen
  | 'thought_catcher'      // links to ThoughtCatcherScreen
  | 'journal_prompt'       // opens journal with a specific prompt
  | 'mood_check_in'        // opens mood logger
  | 'voice_journal'        // opens voice recorder
  | 'mini_lesson'          // in-app educational content (text + quiz)
  | 'breathing_exercise'   // guided breathing (new)
  | 'body_scan'            // guided body scan (new)
```

**3.2.2 Node ↔ Task Mapping**
- Each `PathNodeData` gets a `taskType: JourneyTaskType` field and optional `taskConfig` object
- Unit 1 (Foundations): mood check-in → journal prompt → thought catcher → gratitude reframe → chest
- Unit 2 (Intermediate): thought reframing → voice journal → mini lesson → breathing → chest
- Unit 3 (Advanced): full CBT chain → body scan → deep reflection prompt → chest

**3.2.3 Task Router**
- New `useTaskRouter(taskType, taskConfig)` hook that returns the correct screen route
- `handleNodePress` in `JourneyMapContainer` navigates to the correct exercise screen
- On exercise completion, callback marks the journey node as complete + awards XP

**3.2.4 Completion Callback Flow**
1. User taps ACTIVE node → navigates to exercise
2. User completes exercise → exercise screen calls `onComplete(nodeId)`
3. `onComplete` triggers: `completeNode()` + `awardXP()` + `earnCoins()` + `checkAchievements()`
4. User returns to journey map → sees node completed, next node unlocked
5. If was last node → `UnitCompleteModal` appears

**3.2.5 Mini Lessons (New Content Type)**
- Short, swipeable educational cards (3–5 slides) covering CBT concepts
- Each slide: illustration + short text (< 50 words) + optional interactive element
- Quiz at end: 1–2 multiple choice questions
- Correct answers required to complete the node
- Content stored as JSON data files, no backend needed initially

#### Success Metrics
- **Primary:** Journey map completion rate (target: 40% complete Unit 1 in first 2 weeks)
- **Secondary:** Exercise completion rate +50%, time in app +30%

#### Technical Notes
- Modify `PathNodeData` type in `src/types/journey/node.ts`
- New hook: `src/hooks/useTaskRouter.ts`
- New screen: `src/screens/MiniLessonScreen/` (swipeable card format)
- New data: `src/data/journey/lessonContent.ts` (JSON-based educational content)
- Reuse existing exercise screens with optional `onComplete` callback prop

---

### 3.3 🔥 FEATURE: Streak Shield + Recovery System

**Priority:** P1
**Effort:** ~1 week
**Retention lever:** Prevents the #1 cause of churn — breaking a streak

#### Problem
If a user misses a single day, their streak resets to zero. Research shows this is the single largest cause of app abandonment in habit apps. Duolingo solved this with "streak freezes" — the app should too.

#### Solution
Implement streak shields (automatic streak protection) that users earn or purchase with coins.

#### Requirements

**3.3.1 Streak Shield Item**
- New item in rewards system: "Streak Shield" costs 50 coins
- User can hold max 3 shields at a time
- A shield auto-activates if user misses a day — streak is preserved
- Visual indicator on streak counter: shield icon + count

**3.3.2 Earning Shields**
- 1 free shield awarded at: 7-day streak, 14-day streak, 30-day streak
- 1 free shield awarded when completing a weekly challenge
- Purchasable in rewards shop (50 coins each)

**3.3.3 Shield Activation UX**
- When user returns after missing a day, show modal:
  - "You missed yesterday, but your Streak Shield saved you! 🛡️"
  - Shows streak count preserved
  - Shows remaining shields
- If no shields available and streak breaks, show recovery modal:
  - "Your 12-day streak ended. Want to restore it?"
  - Option A: Watch an ad (if ad SDK integrated) or share the app
  - Option B: Pay 100 coins to restore
  - Option C: Start fresh (with encouraging message)

**3.3.4 Streak Calendar Visualization**
- On the streak detail screen, show a month calendar view
- Days active: filled green circles
- Shield-saved days: filled green circles with small shield badge
- Missed days: empty circles
- Current day: pulsing indicator

#### Success Metrics
- **Primary:** Streak break churn rate -40%
- **Secondary:** Coins purchased/spent +25%, daily active rate +10%

#### Technical Notes
- New fields in user profile / Supabase: `streak_shields: number`, `shield_history: array`
- Extend `useRewards` hook with shield purchase/consume logic
- New component: `StreakShieldModal.tsx`
- Modify streak calculation logic to check for shields before resetting

---

### 3.4 👥 FEATURE: Accountability Buddies

**Priority:** P1
**Effort:** ~3 weeks
**Retention lever:** Social commitment dramatically increases habit adherence

#### Problem
The app is entirely single-player. Research consistently shows that social accountability increases habit completion by 65%+. Users with no external accountability are 3x more likely to churn.

#### Solution
Allow users to pair up with a friend (via invite link) for mutual accountability. Not a social network — just lightweight "I can see you're active" mutual visibility.

#### Requirements

**3.4.1 Buddy Invitation**
- "Add Buddy" button on profile or home screen
- Generate shareable deep link (Expo Linking)
- Recipient opens link → app prompts "Accept buddy request from {name}?"
- Max 3 buddies to keep it intimate and low-pressure

**3.4.2 Buddy Activity Feed (Minimal)**
- NOT a full social feed — just a small card on Today screen
- Shows each buddy's: streak count, whether they've journaled today, current level
- Status indicators: 🟢 "Active today" / 🔴 "Not yet active"
- No content sharing — only activity metadata (privacy-first)

**3.4.3 Mutual Nudge**
- "Send nudge" button on buddy card
- Sends push notification: "{Name} nudged you! Time to journal 📝"
- Max 1 nudge per buddy per day (prevents spam)
- Nudge received shows as small animation on home screen

**3.4.4 Buddy Streak**
- Track consecutive days where BOTH buddies are active
- "Buddy streak: 🔥 12 days" shown on buddy card
- Buddy streak milestones unlock bonus XP (7 days: 50 XP, 14 days: 100 XP, 30 days: 200 XP)

**3.4.5 Privacy Controls**
- Toggle what buddies can see: streak only / streak + level / streak + level + today's activity
- Block/remove buddy at any time
- All buddy data is activity metadata only — no journal content is ever shared

#### Success Metrics
- **Primary:** D30 retention for buddy users vs non-buddy users (target: +25%)
- **Secondary:** Daily active rate +15% for paired users

#### Technical Notes
- New Supabase tables: `buddy_relationships`, `buddy_activity`, `buddy_nudges`
- New context: `BuddyContext.tsx`
- New components: `BuddyCard.tsx`, `BuddyInviteModal.tsx`, `NudgeAnimation.tsx`
- Push notification integration via existing `usePushNotificationSetup`
- Deep link handling via expo-router for buddy invite acceptance

---

### 3.5 📊 FEATURE: Progress Insights Dashboard

**Priority:** P1
**Effort:** ~2 weeks
**Retention lever:** Visualizing progress creates emotional investment + "sunk cost" that prevents churn

#### Problem
Users have no way to see how far they've come over time. The AI Insights screen shows weekly summaries, but there's no visual progress dashboard with trends, charts, and milestones. This means users can't appreciate their growth, reducing long-term motivation.

#### Solution
A dedicated Progress screen with charts showing mood trends, journaling frequency, streak history, XP growth, and personal records.

#### Requirements

**3.5.1 Mood Trend Chart**
- Line chart showing average mood over the past 7 / 30 / 90 days
- Colored by mood category (happy = green, sad = blue, anxious = yellow, etc.)
- Tap on a data point to see the journal entry from that day
- Show overall trend: "Your mood has improved 15% this month" 📈

**3.5.2 Activity Heatmap**
- GitHub-style contribution heatmap for the past 12 weeks
- Color intensity = number of activities that day (journal + mood + habits + exercises)
- Tapping a day shows what was completed
- "Most active day: Wednesday" insight

**3.5.3 Journaling Stats**
- Total entries (text / voice / image breakdown)
- Average word count trend
- Most used emotions/tags
- Journaling time of day distribution (morning / afternoon / evening / night)

**3.5.4 Streak History**
- Bar chart showing all past streaks (with dates)
- Personal best streak highlighted
- "Current streak vs personal best" comparison
- Shield usage history

**3.5.5 XP + Level Progress**
- XP earned per week chart (bar chart)
- Level progression timeline
- "Time to next level" estimate based on current pace
- Coins earned and spent history

**3.5.6 Personal Records**
- "Your Records" section showing personal bests:
  - Longest streak
  - Most journals in one week
  - Highest single-day XP
  - Most challenges completed in one week
  - First achievement unlocked date

**3.5.7 Monthly Recap (Auto-generated)**
- At the end of each month, generate a summary card:
  - Total journals, streak days, XP earned, achievements unlocked
  - Mood trend summary
  - "Highlight" — best day based on activity
  - Shareable as an image (for social media / stories)

#### Success Metrics
- **Primary:** Weekly active users viewing progress screen: target 40%+
- **Secondary:** Screenshot/share rate for monthly recap: target 10%

#### Technical Notes
- Use `react-native-svg` for charts (already in project)
- New screen: `src/screens/ProgressScreen/` (container + presentation)
- New hook: `useProgressStats.ts` — aggregates data from Supabase queries
- New hook: `useMoodTrends.ts` — queries mood log history with date ranges
- Chart components: `MoodTrendChart.tsx`, `ActivityHeatmap.tsx`, `XPBarChart.tsx`
- Monthly recap: generate image using `react-native-view-shot` for sharing

---

### 3.6 🎯 FEATURE: Smart Notifications (Behavioral Triggers)

**Priority:** P2
**Effort:** ~2 weeks
**Retention lever:** Right message at the right time = re-engagement

#### Problem
Current push notifications use fixed categories (`mood_check_in`, `habit_reminder`, `weekly_insight`) with no personalization. Users receive the same type of notification regardless of their behavior, leading to notification fatigue and opt-outs.

#### Solution
Implement a client-side behavioral trigger system that sends contextual notifications based on the user's actual patterns.

#### Requirements

**3.6.1 Trigger: Streak at Risk**
- If user hasn't completed any activity by 8 PM (local time), send:
  - "Your {N}-day streak is at risk! Quick 2-min journal to save it 📝"
  - Deep link to voice journal (lowest friction)
- Only fire if streak ≥ 3 days (don't nag new users)

**3.6.2 Trigger: Comeback After Absence**
- If user hasn't opened app in 2 days:
  - Day 2: "We miss you! Your owl mascot is lonely 🦉"
  - Day 4: "You're {X} XP from Level {N}! Quick check-in?"
  - Day 7: "Your friends are still journaling. Come say hi!"
- Escalating urgency, max 3 messages per absence

**3.6.3 Trigger: Achievement Almost Unlocked**
- When user is within 20% of unlocking an achievement:
  - "Just {N} more journal entries to unlock '{Achievement Name}'! 🏆"
  - Deep link to the relevant activity

**3.6.4 Trigger: Challenge Expiring**
- 4 hours before daily reset, if uncompleted daily challenges remain:
  - "You have {N} uncompleted challenges. {X} XP waiting for you!"

**3.6.5 Trigger: Optimal Journaling Time**
- Track when user typically journals (time-of-day histogram)
- Send gentle nudge 15 minutes before their usual time:
  - "Almost journaling time ✍️ Ready for your evening reflection?"

**3.6.6 Smart Quiet Hours**
- Never send notifications between 10 PM and 7 AM (configurable)
- Respect system-level notification settings
- Max 2 notifications per day total

#### Success Metrics
- **Primary:** Push notification tap-through rate +40%
- **Secondary:** Churned user re-activation rate +20%

#### Technical Notes
- New service: `src/services/notificationScheduler.ts`
- Uses `expo-notifications` `scheduleNotificationAsync` for local scheduling
- Client-side only — no server needed for triggers
- New hook: `useNotificationScheduler.ts` — runs on app foreground, evaluates all triggers
- New storage: `@notification_triggers_v1` in AsyncStorage for last-sent timestamps
- Integrates with existing `usePushNotificationSetup` hook

---

### 3.7 🎁 FEATURE: Enhanced Rewards Economy

**Priority:** P2
**Effort:** ~1.5 weeks
**Retention lever:** Meaningful coin sinks keep the earning loop interesting

#### Problem
The rewards shop has 17 purchasable items (themes, avatars, prompt packs, animations). Once a user buys them all, coins become meaningless. Without a coin sink, the earning loop breaks and motivation drops.

#### Solution
Add recurring/consumable rewards alongside the existing permanent unlocks.

#### Requirements

**3.7.1 Consumable Items**
| Item | Cost | Effect |
|------|------|--------|
| Streak Shield | 50 coins | Protects streak for 1 missed day (max 3) |
| Double XP Boost (24h) | 75 coins | All XP earned doubled for 24 hours |
| Challenge Reroll | 30 coins | Replace one daily challenge with a new random one |
| Hint Token | 40 coins | Unlocks a hint during CBT exercises |
| Custom Prompt | 100 coins | Generate a personalized AI journal prompt |

**3.7.2 Seasonal / Limited-Time Rewards**
- Rotate 2–3 exclusive rewards monthly (seasonal themes, special avatars)
- "Limited Edition" badge creates urgency
- After the month ends, items become unavailable (FOMO)
- Example: "Spring Blossom Theme" 🌸 — available April only, costs 300 coins

**3.7.3 Reward Tiers & Progression**
- Unlock higher-tier shop items as user levels up:
  - Level 1–2: Basic items visible
  - Level 3: Premium items unlock
  - Level 4–5: Exclusive items unlock
- Shows locked items with level requirement: "Unlocks at Level 4 ✨"

**3.7.4 Gift Coins to Buddy**
- If buddy system is implemented, allow sending coins as encouragement
- "Send 10 coins to {buddy}" — triggers notification for recipient
- Max 20 coins gifted per day

**3.7.5 Coin Doubler (IAP)**
- In-app purchase: "Coin Doubler" — permanently doubles all coin earnings
- Priced at $2.99 one-time purchase
- RevenueCat integration (already in app)
- Shows "+5 → +10" visual on all coin earn events

#### Success Metrics
- **Primary:** Average coins spent per week +100%
- **Secondary:** Coin Doubler IAP conversion: target 5% of active users

#### Technical Notes
- Extend `RewardsContext` with consumable item management
- New types in `src/types/rewards.ts`: `ConsumableItem`, `ActiveBoost`
- New Supabase table: `user_consumables` (tracks active boosts + inventory)
- Timer system for time-limited boosts (24h Double XP)
- Modify `earnCoins` to check for active Coin Doubler boost

---

## 4. Implementation Roadmap

### Phase 1 — Foundation (Weeks 1–3)
| Week | Feature | Effort |
|------|---------|--------|
| 1 | 3.1 Daily Action Hub | Core layout + challenges |
| 2 | 3.1 Daily Action Hub | Quick actions + journey card + polish |
| 3 | 3.2 Journey ↔ Exercise Integration | Task router + node mapping |

### Phase 2 — Retention Hooks (Weeks 4–6)
| Week | Feature | Effort |
|------|---------|--------|
| 4 | 3.2 Mini Lessons + completion flow | Content + quiz component |
| 5 | 3.3 Streak Shield System | Shield logic + modals + shop |
| 6 | 3.7 Enhanced Rewards (consumables + tiers) | Economy rebalance |

### Phase 3 — Social + Insights (Weeks 7–10)
| Week | Feature | Effort |
|------|---------|--------|
| 7–8 | 3.4 Accountability Buddies | Invitation + activity feed |
| 9 | 3.5 Progress Dashboard (charts) | Mood trends + heatmap |
| 10 | 3.5 Progress Dashboard (records + recap) | Monthly recap + share |

### Phase 4 — Intelligence (Weeks 11–12)
| Week | Feature | Effort |
|------|---------|--------|
| 11 | 3.6 Smart Notifications | Trigger system + scheduling |
| 12 | 3.6 Smart Notifications + polish | Testing + quiet hours + analytics |

---

## 5. Key Metrics to Track (PostHog Events)

The app already uses PostHog. Add these events:

| Event | Properties | Purpose |
|-------|-----------|---------|
| `daily_hub_viewed` | `challenges_shown`, `completion_pct` | Track hub engagement |
| `challenge_completed` | `challenge_id`, `type`, `time_to_complete` | Challenge effectiveness |
| `journey_lesson_started` | `node_id`, `task_type`, `unit` | Journey funnel |
| `journey_lesson_completed` | `node_id`, `task_type`, `duration_sec` | Completion rate |
| `streak_shield_used` | `streak_length`, `shields_remaining` | Shield economics |
| `streak_shield_purchased` | `cost`, `wallet_balance` | Coin sink |
| `buddy_nudge_sent` | `buddy_id`, `time_of_day` | Social engagement |
| `buddy_nudge_received` | `buddy_id`, `opened_within_min` | Nudge effectiveness |
| `progress_screen_viewed` | `tab`, `time_range` | Progress engagement |
| `monthly_recap_shared` | `platform`, `streak`, `total_xp` | Viral coefficient |
| `notification_trigger_fired` | `trigger_type`, `streak_length` | Notification relevance |
| `consumable_purchased` | `item_id`, `cost`, `wallet_balance` | Economy health |
| `double_xp_activated` | `duration`, `source` | Boost engagement |

---

## 6. Revenue Impact

| Feature | Revenue Mechanism |
|---------|------------------|
| Streak Shield | Increases coin demand → drives Coin Doubler IAP |
| Consumable items | Creates recurring coin demand → sustainable economy |
| Coin Doubler IAP | New $2.99 one-time purchase (target: 5% conversion) |
| Limited-time rewards | FOMO drives engagement → increases premium subscription |
| Buddy system | Social proof → organic growth → larger user base |
| Monthly recap sharing | Free viral marketing → organic acquisition |
| Smart notifications | Reduces churn → increases LTV of existing subscribers |

**Estimated ARR impact:** +15–25% from reduced churn + new IAP + increased subscription conversion.

---

## 7. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Notification fatigue from smart triggers | Hard cap: 2/day, smart quiet hours, easy opt-out per trigger type |
| Buddy system privacy concerns | Metadata only (never journal content), granular privacy controls |
| Coin economy inflation | Balance coin earn rates vs new sinks, cap daily earnings |
| Feature bloat overwhelming users | Progressive disclosure — features unlock with level progression |
| Social pressure anxiety | Buddy system is optional, nudges are gentle, no leaderboards with strangers |

---

## 8. Out of Scope (Future Consideration)

These are ideas worth tracking but not in this PRD:

- **Community forums / groups** — Too complex for now, buddy system tests social appetite
- **Therapist integration** — Regulatory complexity, consider for v3
- **AI-generated CBT exercises** — Interesting but needs clinical validation
- **Global leaderboards** — Could create toxic competition in a wellness app; buddy-only comparisons safer
- **Apple Watch / wearable integration** — Valuable for mood/habit tracking, but requires separate native development
- **Multiplayer challenges** — Buddy challenges first, group challenges later

---

## 9. Definition of Done

A feature is considered "shipped" when:
1. ✅ Container + Presentation pattern followed (per coding standards)
2. ✅ TypeScript strict — no `any` types, all params/returns typed
3. ✅ NativeWind/Tailwind for all styling (no inline styles)
4. ✅ Works on iOS + Android + Web
5. ✅ Accessibility labels on all interactive elements
6. ✅ PostHog analytics events instrumented
7. ✅ Error states handled (network failure, empty states, loading skeletons)
8. ✅ Reduced motion support via `useReducedMotion`
9. ✅ Tested on 3+ device sizes
10. ✅ No regressions in existing features

---

*This PRD is a living document. Priorities should be re-evaluated after each phase based on analytics data from PostHog.*





