# Mental Health Journey — Implementation Tasks

> **Source PRDs:** mental-health-journey-map-prd.md, cbt-content-guide.md  
> **Legend:** ⬜ = Not started | 🔄 = In progress | ✅ = Done  
> **Tracking:** Check off subtasks as you complete them. A task is done when ALL subtasks are ✅.

---

## Phase Overview

| Phase | Name | Weeks | What Ships | Depends On |
|-------|------|-------|-----------|------------|
| **1** | **Foundation** | 1-6 | Journey map with 1 complete journey ("Anxiety Toolkit" — 28 nodes), 6 node renderers (Learn, Exercise, Journal, Quiz, Mood Check, Checkpoint + Chest), Streak + XP system, Onboarding | Existing journey map infra |
| **2** | Gamification | 7-10 | Wellness Leagues, Achievement Badges, Daily Challenges, Chest rewards, Practice nodes, 3 more journeys | Phase 1 |
| **3** | AI & Personalization | 11-14 | AI Insight reports, Intake assessment, Adaptive difficulty, Voice journaling, AI coaching moments | Phase 1 + 2 |
| **4** | Social & Growth | 15-18 | Friends, Challenges, Social sharing, Referrals, Seasonal events | Phase 2 + 3 |
| **5** | Scale & Evergreen | 19+ | AI-generated journeys, CMS for clinical team, Localization, Premium tier, Therapist integration | Phase 3 + 4 |

**This file contains Phase 1 only.** Phases 2-5 will be added as separate files when we're ready.

---

# PHASE 1: Foundation (Weeks 1-6)

**Goal:** Ship the core journey experience end-to-end. A user can browse journeys, start "Anxiety Toolkit", progress through all 28 nodes (learn, exercise, journal, quiz, mood check, checkpoint, chest), earn Insight Points, maintain a streak, and feel the Duolingo-style delight on every tap.

**Estimated total: ~186 hours (~4.7 weeks at 40h/week)**

---

## P1.1 — Database & Data Layer (~39h)

Everything starts here. No UI works without the data foundation.

### P1.1.1 ⬜ Supabase Migration: Journey Content Tables (4h)

Create the tables that hold authored journey content (not user data).

- ⬜ Create `journeys` table
  - Columns: `id` UUID PK, `slug` TEXT UNIQUE, `title` TEXT, `description` TEXT, `category` TEXT (anxiety/mood/stress/growth), `difficulty` TEXT (beginner/intermediate/advanced), `estimated_days` INT, `total_nodes` INT, `color_theme_key` TEXT, `icon_key` TEXT, `is_published` BOOL DEFAULT false, `sort_order` INT, `created_at` TIMESTAMPTZ, `updated_at` TIMESTAMPTZ
  - Index on `is_published`, `category`
- ⬜ Create `journey_sections` table
  - Columns: `id` UUID PK, `journey_id` UUID FK → journeys(id) ON DELETE CASCADE, `title` TEXT, `description` TEXT, `sort_order` INT, `unlock_rule` TEXT DEFAULT 'sequential', `created_at` TIMESTAMPTZ
  - Index on `journey_id`
- ⬜ Create `journey_nodes` table
  - Columns: `id` UUID PK, `section_id` UUID FK → journey_sections(id) ON DELETE CASCADE, `node_type` TEXT NOT NULL (learn/exercise/journal/quiz/chest/checkpoint/ai_insight/practice/mood_check), `title` TEXT, `description` TEXT, `content` JSONB NOT NULL, `xp_reward` INT DEFAULT 10, `estimated_minutes` INT DEFAULT 3, `sort_order` INT, `icon_key` TEXT, `variant_key` TEXT DEFAULT 'lesson', `created_at` TIMESTAMPTZ
  - Index on `section_id`, `node_type`
- ⬜ Run migration locally, verify in Supabase Studio
- ⬜ Add migration file to `supabase/migrations/`

### P1.1.2 ⬜ Supabase Migration: User Progress Tables (3h)

Track each user's enrollment and node-by-node completion.

- ⬜ Create `user_journeys` table
  - Columns: `id` UUID PK, `user_id` UUID FK → auth.users(id) ON DELETE CASCADE, `journey_id` UUID FK → journeys(id), `status` TEXT DEFAULT 'active' (active/completed/paused/abandoned), `started_at` TIMESTAMPTZ, `completed_at` TIMESTAMPTZ, `current_section_id` UUID FK, `current_node_id` UUID FK
  - UNIQUE constraint on (`user_id`, `journey_id`)
- ⬜ Create `user_node_completions` table
  - Columns: `id` UUID PK, `user_id` UUID FK, `node_id` UUID FK → journey_nodes(id), `journey_id` UUID FK, `response_data` JSONB (user's answers/journal text/quiz results/mood rating), `xp_earned` INT, `completed_at` TIMESTAMPTZ, `duration_seconds` INT, `mood_before` INT (1-5), `mood_after` INT (1-5)
  - Index on `user_id`, `journey_id`, `completed_at`
- ⬜ Run migration, verify foreign keys and cascades

### P1.1.3 ⬜ Supabase Migration: Streak & XP Tables (3h)

- ⬜ Create `user_streaks` table
  - Columns: `user_id` UUID PK FK → auth.users(id) ON DELETE CASCADE, `current_streak` INT DEFAULT 0, `longest_streak` INT DEFAULT 0, `last_activity_date` DATE DEFAULT CURRENT_DATE, `streak_freezes_available` INT DEFAULT 0, `rest_days_used_this_week` INT DEFAULT 0, `updated_at` TIMESTAMPTZ
- ⬜ Create `user_xp_ledger` table
  - Columns: `id` UUID PK, `user_id` UUID FK, `amount` INT, `source` TEXT (node_completion/streak_bonus/daily_challenge/chest/perfect_day), `source_id` UUID, `earned_at` TIMESTAMPTZ DEFAULT now()
  - Index on `user_id`, `earned_at`
- ⬜ Create helper view `user_xp_totals` — aggregate total IP per user (for leaderboard later)
- ⬜ Run migration, verify

### P1.1.4 ⬜ Row-Level Security (RLS) Policies (3h)

Users must only see their own progress, but can read all published journey content.

- ⬜ `journeys` — SELECT: anyone (published = true). INSERT/UPDATE/DELETE: service_role only
- ⬜ `journey_sections` — SELECT: anyone (join to published journey). Mutations: service_role only
- ⬜ `journey_nodes` — SELECT: anyone (join to published journey). Mutations: service_role only
- ⬜ `user_journeys` — SELECT/INSERT/UPDATE: `auth.uid() = user_id`. DELETE: `auth.uid() = user_id`
- ⬜ `user_node_completions` — SELECT/INSERT: `auth.uid() = user_id`. No UPDATE/DELETE (immutable log)
- ⬜ `user_streaks` — SELECT/UPDATE: `auth.uid() = user_id`. INSERT: via trigger on first activity
- ⬜ `user_xp_ledger` — SELECT: `auth.uid() = user_id`. INSERT: `auth.uid() = user_id`. No UPDATE/DELETE
- ⬜ Test all policies with Supabase SQL editor using test users

### P1.1.5 ⬜ Seed Data: "Anxiety Toolkit" Journey (8h)

Author the complete first journey (28 nodes, 4 sections) as JSONB content. This is content authoring, not code.

- ⬜ **Section 1: Understanding Anxiety (7 nodes)**
  - ⬜ Node 1 — Mood Check: emoji selector (content JSONB: `{ type: "mood_check", prompt: "How anxious do you feel right now?", scale: 5 }`)
  - ⬜ Node 2 — Learn: "What is Anxiety?" (content JSONB: array of 5 cards with `text` + `visual_key` per card)
  - ⬜ Node 3 — Learn: "The Anxiety Cycle" (5 cards: thoughts→feelings→behaviors loop)
  - ⬜ Node 4 — Exercise: "Map Your Personal Anxiety Cycle" (content JSONB: step-by-step wizard with 4 input fields)
  - ⬜ Node 5 — Journal: "Describe your last anxiety spike" (content JSONB: `{ prompt, mood_before: true, mood_after: true }`)
  - ⬜ Node 6 — Quiz: "Understanding Anxiety" (content JSONB: 4 questions with options, correct answer, explanation)
  - ⬜ Node 7 — Chest: Unlock "Quick Calm Breathing" audio (content JSONB: `{ reward_type, reward_key, rarity }`)
- ⬜ **Section 2: Challenging Anxious Thoughts (8 nodes)**
  - ⬜ Node 8 — Mood Check
  - ⬜ Node 9 — Learn: "Cognitive Distortions of Anxiety" (catastrophizing, fortune telling, mind reading)
  - ⬜ Node 10 — Learn: "Top 5 Anxiety Distortions" (5 cards, one per distortion with example)
  - ⬜ Node 11 — Exercise: "Spot the Distortion" (5 scenarios → user picks which trap)
  - ⬜ Node 12 — Exercise: "Thought Record — A Real Worry" (7-step interactive worksheet from CBT guide §4.1)
  - ⬜ Node 13 — Journal: "Rewrite your biggest worry as a balanced thought"
  - ⬜ Node 14 — Quiz: "Cognitive Distortions Master Test" (6 questions)
  - ⬜ Node 15 — Checkpoint: "Thought Challenger" badge + skill recap + mood comparison
- ⬜ **Section 3: Calming Your Body (7 nodes)**
  - ⬜ Node 16 — Mood Check
  - ⬜ Node 17 — Learn: "The Body-Mind Connection" (4 cards)
  - ⬜ Node 18 — Exercise: "5-4-3-2-1 Grounding" (guided sensory exercise, CBT guide §7.1)
  - ⬜ Node 19 — Exercise: "Box Breathing 4-4-4-4" (animated visual guide, CBT guide §7.2)
  - ⬜ Node 20 — Exercise: "Progressive Muscle Relaxation" (audio-guided body scan, CBT guide §7.4)
  - ⬜ Node 21 — Journal: "Which calming technique worked best for you? Why?"
  - ⬜ Node 22 — Chest: Unlock "Sleep Body Scan" 10-min audio
- ⬜ **Section 4: Your Anxiety Action Plan (6 nodes)**
  - ⬜ Node 23 — Mood Check
  - ⬜ Node 24 — Learn: "Building Your Personal Coping Toolkit" (4 cards)
  - ⬜ Node 25 — Exercise: "Build Your Anxiety Emergency Plan" (pick top 3 techniques from journey)
  - ⬜ Node 26 — Practice: "Apply your toolkit to a scenario" (scenario-based, CBT guide §4.5)
  - ⬜ Node 27 — Mood Check: Final "How anxious do you feel now vs. Day 1?"
  - ⬜ Node 28 — Checkpoint: "Anxiety Toolkit Complete!" badge + journey summary
- ⬜ Write SQL INSERT seed script, run against local Supabase
- ⬜ Verify all 28 nodes load correctly via Supabase Studio

### P1.1.6 ⬜ TypeScript Types for Journey Entities (3h)

Create types in `src/types/journey/` that mirror the database schema.

- ⬜ `Journey` type — matches `journeys` table
- ⬜ `JourneySection` type — matches `journey_sections` table
- ⬜ `JourneyNode` type — matches `journey_nodes` table with discriminated union on `node_type`
- ⬜ `NodeContent` union type — `LearnContent | ExerciseContent | JournalContent | QuizContent | MoodCheckContent | ChestContent | CheckpointContent`
  - ⬜ `LearnContent`: `{ cards: Array<{ text: string; visual_key: string }> }`
  - ⬜ `ExerciseContent`: `{ steps: Array<{ prompt: string; input_type: 'text'|'slider'|'picker'|'multi_choice'; options?: string[] }> }`
  - ⬜ `JournalContent`: `{ prompt: string; mood_before: boolean; mood_after: boolean; voice_enabled: boolean }`
  - ⬜ `QuizContent`: `{ questions: Array<{ text: string; options: string[]; correct_index: number; explanation: string }> }`
  - ⬜ `MoodCheckContent`: `{ prompt: string; scale: number; note_enabled: boolean }`
  - ⬜ `ChestContent`: `{ reward_type: string; reward_key: string; rarity: 'common'|'uncommon'|'rare'|'legendary' }`
  - ⬜ `CheckpointContent`: `{ badge_key: string; skills_recap: string[]; show_mood_comparison: boolean }`
- ⬜ `UserJourney` type — matches `user_journeys` table
- ⬜ `UserNodeCompletion` type — matches `user_node_completions` table
- ⬜ `UserStreak` type — matches `user_streaks` table
- ⬜ `XPLedgerEntry` type — matches `user_xp_ledger` table
- ⬜ Export all from `src/types/journey/index.ts`

### P1.1.7 ⬜ `useJourney` Hook — Fetch Structure + User Progress (4h)

Single hook that gives a screen everything it needs to render the journey map.

- ⬜ Fetch journey by `slug` or `id` — include sections + nodes (ordered by `sort_order`)
- ⬜ Fetch `user_journeys` row for current user + journey
- ⬜ Fetch all `user_node_completions` for this journey (to calculate node statuses)
- ⬜ Derive node status for each node: `LOCKED | ACTIVE | COMPLETED`
  - First incomplete node = ACTIVE
  - All nodes before it = COMPLETED
  - All nodes after it = LOCKED
  - Chest/Checkpoint after completed node = ACTIVE (auto-unlock)
- ⬜ Return: `{ journey, sections, nodes, userProgress, currentNodeId, completedCount, totalCount, isLoading, error }`
- ⬜ Add `startJourney(journeyId)` — insert `user_journeys` row if not exists
- ⬜ Handle edge case: journey not enrolled yet (return `userProgress: null`)
- ⬜ Real-time subscription or manual refetch on node completion

### P1.1.8 ⬜ `useNodeCompletion` Hook — Mark Node Complete + Award XP (4h)

Called when user finishes any node. Handles the entire completion pipeline.

- ⬜ `completeNode({ nodeId, journeyId, responseData, durationSeconds, moodBefore?, moodAfter? })`
- ⬜ Insert into `user_node_completions`
- ⬜ Calculate XP: base `xp_reward` from node + bonuses (perfect quiz, streak bonus, perfect day)
- ⬜ Insert into `user_xp_ledger`
- ⬜ Update `user_journeys.current_node_id` to next node
- ⬜ Check if section is complete → if yes, unlock next section
- ⬜ Check if journey is complete → if yes, set `user_journeys.status = 'completed'`, `completed_at`
- ⬜ Call `updateStreak()` from `useStreak` hook
- ⬜ Return: `{ xpEarned, newTotalXP, streakUpdated, sectionCompleted, journeyCompleted }`
- ⬜ Wrap in Supabase transaction (or sequential with error rollback)

### P1.1.9 ⬜ `useStreak` Hook — Streak Logic (4h)

- ⬜ `getStreak()` — fetch `user_streaks` for current user
- ⬜ `updateStreak()` — called on every node completion
  - If `last_activity_date` = today → no change (already active today)
  - If `last_activity_date` = yesterday → increment `current_streak`
  - If `last_activity_date` < yesterday AND streak_freeze available → consume freeze, keep streak
  - If `last_activity_date` < yesterday AND no freeze → reset `current_streak` to 1
  - Always update `longest_streak = MAX(longest_streak, current_streak)`
  - Always set `last_activity_date = today`
- ⬜ `useStreakFreeze()` — consume a freeze (decrement `streak_freezes_available`)
- ⬜ `checkStreakStatus()` — is streak at risk today? (for notification logic)
- ⬜ Streak milestone detection: after update, check if `current_streak` matches any milestone (3, 7, 14, 30, 60, 100, 365) → return milestone info
- ⬜ Return: `{ currentStreak, longestStreak, freezesAvailable, isAtRisk, lastActivity, checkStreak, updateStreak }`

### P1.1.10 ⬜ `useXP` Hook — Insight Points (3h)

- ⬜ `getTotalXP()` — SUM of `user_xp_ledger.amount` for current user
- ⬜ `getTodayXP()` — SUM where `earned_at` = today (for daily display)
- ⬜ `earnXP({ amount, source, sourceId })` — insert into ledger
- ⬜ `getXPHistory(days)` — last N days of XP for chart (future use)
- ⬜ Return: `{ totalXP, todayXP, earnXP, isLoading }`

---

## P1.2 — Journey Catalog Screen (~20h)

The discovery surface where users browse and start journeys.

### P1.2.1 ⬜ `JourneyCatalogScreen` — Container (4h)

- ⬜ Fetch all published journeys from Supabase (`is_published = true`, ordered by `sort_order`)
- ⬜ Fetch user's enrolled journeys (`user_journeys` for current user)
- ⬜ Merge: for each journey, attach enrollment status (not_started / in_progress / completed) and progress %
- ⬜ Handle loading, error, empty states
- ⬜ Pass data to presentation component
- ⬜ Handle `onJourneyPress(journey)` → navigate to journey map OR open detail sheet
- ⬜ Handle `onStartJourney(journeyId)` → call `useJourney.startJourney()` then navigate

### P1.2.2 ⬜ `JourneyCatalogPresentation` — UI (6h)

- ⬜ Header: "Your Journeys" title + streak banner (from P1.5.1) + XP counter (from P1.5.2)
- ⬜ **Active Journey section** (if any in-progress) — featured card at top with progress bar and "Continue" CTA
- ⬜ **Browse section** — scrollable grid/list of journey cards
- ⬜ Category filter pills (All, Anxiety, Mood, Stress, Growth) — horizontal scroll
- ⬜ Empty state: "Start your first journey!" with illustration
- ⬜ Loading skeleton state
- ⬜ Pull-to-refresh
- ⬜ Use NativeWind / existing app styling conventions

### P1.2.3 ⬜ `JourneyCard` Component (3h)

Reusable card shown in the catalog grid.

- ⬜ Journey icon (from `icon_key`) + color theme background (from `color_theme_key`)
- ⬜ Title, description (2-line truncated)
- ⬜ Metadata row: `estimated_days` + `total_nodes` nodes + difficulty badge
- ⬜ Progress bar (if enrolled) — `completedNodes / totalNodes`
- ⬜ Status badge: "New" / "In Progress" / "Completed ✓"
- ⬜ Press → `onJourneyPress(journey)`
- ⬜ Use `AnimatedButton` or `PressableScale` for press feedback

### P1.2.4 ⬜ `JourneyDetailSheet` — Bottom Sheet (4h)

Shown when user taps a journey card (before starting). Full description + preview.

- ⬜ Bottom sheet (use existing bottom sheet component or `@gorhom/bottom-sheet`)
- ⬜ Journey header: icon, title, category tag, difficulty
- ⬜ Full description text
- ⬜ Section preview list: "Section 1: Understanding Anxiety (7 nodes)" — collapsed list of section titles
- ⬜ "What you'll learn" bullet list (derived from section descriptions)
- ⬜ Duration + node count summary
- ⬜ **"Start Journey" CTA** — `AnimatedButton` with color theme
- ⬜ If already enrolled: "Continue Journey" button instead
- ⬜ If completed: "Completed ✓" badge + "Restart Journey" option

### P1.2.5 ⬜ Expo Router Route (1h)

- ⬜ Add route for journey catalog (e.g., `app/tabs/(tabs)/journeys.tsx` or integrate into existing tab)
- ⬜ Add route for individual journey map: `app/tabs/screens/journey/[slug].tsx`
- ⬜ Verify deep linking works

### P1.2.6 ⬜ Tab Navigation Integration (2h)

- ⬜ Add "Journeys" tab to bottom tab navigator (or integrate into existing navigation)
- ⬜ Tab icon (map/path icon from existing icon set)
- ⬜ Active/inactive tab states
- ⬜ Ensure smooth transition between catalog and journey map screens

---

## P1.3 — Node Content Renderers (~53h)

Each node type needs its own full-screen renderer. This is the largest workstream.

### P1.3.1 ⬜ `LearnNodeRenderer` — Swipeable Card Carousel (8h)

Renders the 📖 Learn nodes (2-4 min psychoeducation).

- ⬜ Full-screen card carousel (horizontal swipe)
- ⬜ Each card shows: illustration area (top 60%) + text content (bottom 40%)
- ⬜ Max 40 words per card enforced in display
- ⬜ Progress dots at bottom (card 1 of 5, etc.)
- ⬜ Swipe gesture with spring animation between cards
- ⬜ Last card = "Key Takeaway" summary card with distinct styling
- ⬜ "Continue" button on last card → triggers node completion
- ⬜ Cannot skip (must swipe through all cards) — but can swipe back
- ⬜ Illustration rendering: resolve `visual_key` to asset (image component or icon)
- ⬜ Accessibility: screen reader announces card content, swipe hints

### P1.3.2 ⬜ `ExerciseNodeRenderer` — Step-by-Step Wizard (12h)

Renders the 🏋️ Exercise nodes. The most complex renderer — supports multiple input types.

- ⬜ **Wizard layout**: one step per screen, progress bar at top, back/next navigation
- ⬜ **Input types** (driven by `ExerciseContent.steps[].input_type`):
  - ⬜ `text` — multi-line text input with character encouragement (not minimum), keyboard-aware scroll
  - ⬜ `slider` — labeled slider (e.g., "Rate your emotion 0-100") with animated value label
  - ⬜ `picker` — emotion picker grid (tap to select one or multiple) using existing emoji assets
  - ⬜ `multi_choice` — list of options, tap to select (for "Spot the Distortion" type exercises)
  - ⬜ `rating` — 1-10 numbered scale (horizontal buttons)
- ⬜ **Validation**: "Next" button enabled only when current step has input (for text: min 1 char; for picker: ≥1 selected)
- ⬜ **Summary screen** at end: show all answers compiled, "Complete Exercise" CTA
- ⬜ Store all step responses in `responseData` JSONB on completion
- ⬜ Smooth keyboard handling (KeyboardAvoidingView)
- ⬜ Haptic feedback on "Next" step transition
- ⬜ Special exercise types from CBT guide:
  - ⬜ **Thought Record** (§4.1): 7-step wizard — situation → emotion picker + slider → automatic thought → distortion picker → evidence for → evidence against → balanced thought + re-rate
  - ⬜ **5-4-3-2-1 Grounding** (§7.1): 5 steps with haptic pulse at each entry, decreasing count
  - ⬜ **Box Breathing** (§7.2): Animated square guide (4s inhale → 4s hold → 4s exhale → 4s hold), 4 rounds with timer
- ⬜ Accessibility: step announcements, input labels

### P1.3.3 ⬜ `JournalNodeRenderer` — Guided Journaling (6h)

Renders the ✍️ Journal nodes. Integrates with existing journal system.

- ⬜ **Mood before** (if `content.mood_before`): emoji picker (5 levels) shown first
- ⬜ **Guided prompt**: displayed at top as a gentle question/instruction
- ⬜ **Writing area**: large multi-line TextInput, auto-focus, clean writing surface
- ⬜ Word count display (encouraging, not mandatory — e.g., "42 words — nice!")
- ⬜ **Voice-to-text button** (microphone icon) — placeholder for Phase 3 Whisper integration. In Phase 1: show button but display "Coming soon" tooltip
- ⬜ **Emotion tag**: after writing, optional emotion tag selector (happy, sad, anxious, calm, etc.)
- ⬜ **Mood after** (if `content.mood_after`): emoji picker shown after writing
- ⬜ "Save & Continue" CTA
- ⬜ **Integration with existing journal system**:
  - ⬜ Save entry to existing journal tables/hooks (reuse `useJournalOperations` from `hooks/journals/`)
  - ⬜ Tag entry with `journey_slug` + `node_id` for AI analysis later
  - ⬜ Entry appears in normal journal feed with journey badge
- ⬜ Store `mood_before`, `mood_after`, word count in `responseData`

### P1.3.4 ⬜ `QuizNodeRenderer` — Interactive Quiz (8h)

Renders the ❓ Quiz nodes. Duolingo-style instant feedback.

- ⬜ **One question per screen** layout
- ⬜ Progress bar at top (question 1 of 6)
- ⬜ Question text displayed prominently
- ⬜ **Answer options**: list of tappable option cards (A, B, C, D)
  - ⬜ Unselected state: neutral border
  - ⬜ Selected state: highlighted border, slight scale animation
  - ⬜ After "Check" tap — correct: green background + checkmark + brief explanation. Incorrect: red background + X + explanation + show correct answer
- ⬜ **"Check Answer" button** — appears after selection, triggers feedback
- ⬜ **Instant feedback** with animation:
  - ⬜ Correct: green flash, "ding" haptic (Light), +1 to correct counter
  - ⬜ Incorrect: gentle red shake, explanation text slides in, "That's okay!" encouragement
- ⬜ **"Continue" button** after feedback → next question
- ⬜ **Score summary screen** at end:
  - ⬜ "You got X/Y correct!"
  - ⬜ Celebration animation if perfect (confetti)
  - ⬜ Encouragement if imperfect ("Great effort! Review the explanations above.")
  - ⬜ List of questions with ✓/✗ marks
- ⬜ **XP calculation**: base 15 IP + 5 bonus if perfect score
- ⬜ Store `{ answers: [{questionIndex, selectedIndex, correct}], score, perfectBonus }` in `responseData`
- ⬜ **Never punish**: wrong answers don't subtract XP, just miss the bonus

### P1.3.5 ⬜ `MoodCheckRenderer` — Quick Mood Entry (3h)

Renders the 🪞 Mood Check nodes. Must be fast — 30 seconds max.

- ⬜ Prompt text at top (e.g., "How anxious do you feel right now?")
- ⬜ **Emoji selector**: row of 5 mood emojis (😢 😕 😐 🙂 😊) — large touch targets (≥48dp)
  - ⬜ Use existing emoji assets from `assets/emojis/`
  - ⬜ Tap to select, selected emoji scales up with spring animation
  - ⬜ Haptic feedback on selection
- ⬜ **Optional one-line note**: single-line TextInput below ("Anything you'd like to add?")
- ⬜ "Continue" button — auto-enabled on emoji selection (note is optional)
- ⬜ Store `{ mood_rating: 1-5, note: string|null }` in `responseData`
- ⬜ Minimal UI — no distractions, fast in and out

### P1.3.6 ⬜ `CheckpointRenderer` — Section Celebration (5h)

Renders the ⭐ Checkpoint nodes. The "level complete!" moment.

- ⬜ **Full-screen celebration layout**
- ⬜ "Section Complete!" title with animation (scale-in with spring)
- ⬜ **Badge reveal animation**: badge icon slides in with glow effect
  - ⬜ Badge name (e.g., "Thought Challenger")
  - ⬜ Badge icon (from `content.badge_key`)
- ⬜ **Skills recap**: bullet list of techniques learned in this section (from `content.skills_recap`)
- ⬜ **Mood comparison** (if `content.show_mood_comparison`):
  - ⬜ "Your mood at section start: 😕 (2/5)" vs "Your mood now: 🙂 (4/5)"
  - ⬜ Fetch first mood check and last mood check in this section from `user_node_completions`
  - ⬜ Simple before/after visual (emoji + number)
- ⬜ **XP earned**: "+50 IP!" with animated counter
- ⬜ **"Continue to next section" CTA** — or "Journey Complete!" if last section
- ⬜ Confetti/particle animation on screen (reuse existing achievement animations if available)
- ⬜ Haptic: Heavy impact on badge reveal

### P1.3.7 ⬜ `ChestOpeningRenderer` — Chest Reward Reveal (5h)

Renders the 🎁 Chest opening. Variable reward moment.

- ⬜ **Chest animation sequence**:
  1. Closed chest with glow/shimmer (idle animation)
  2. "Tap to open" prompt
  3. On tap: chest opens with spring animation + particle burst
  4. Reward item rises from chest with reveal animation
  5. Reward name + description displayed
- ⬜ Determine reward from `content` JSONB (`reward_type`, `reward_key`, `rarity`)
- ⬜ Rarity-based visual effects:
  - ⬜ Common: simple sparkle
  - ⬜ Uncommon: golden glow
  - ⬜ Rare: rainbow particles
  - ⬜ Legendary: full-screen fireworks (future — for Phase 1, just extra particles)
- ⬜ **Add reward to inventory**: In Phase 1, just store in `user_node_completions.response_data`. Phase 2 adds `user_inventory` table.
- ⬜ Haptic burst on chest open (Heavy)
- ⬜ "Awesome!" CTA to continue
- ⬜ Reuse existing `ChestNode` animation patterns from `src/components/journey/ChestNode.tsx`

### P1.3.8 ⬜ `NodeRenderer` — Dispatcher Component (2h)

Routes `node_type` string to the correct renderer.

- ⬜ Accept props: `node: JourneyNode`, `onComplete: (responseData) => void`, `onClose: () => void`
- ⬜ Switch on `node.node_type`:
  - `learn` → `LearnNodeRenderer`
  - `exercise` → `ExerciseNodeRenderer`
  - `journal` → `JournalNodeRenderer`
  - `quiz` → `QuizNodeRenderer`
  - `mood_check` → `MoodCheckRenderer`
  - `checkpoint` → `CheckpointRenderer`
  - `chest` → `ChestOpeningRenderer`
  - Default → error boundary / fallback
- ⬜ Wrap in full-screen modal or bottom sheet (consistent presentation)
- ⬜ Handle `onComplete` → call `useNodeCompletion.completeNode()` → trigger celebration → advance map
- ⬜ Handle `onClose` without completion (back button / X) — confirm if in-progress

### P1.3.9 ⬜ `NodeCompletionCelebration` — Post-Node Reward Screen (4h)

Shown immediately after every node completion (except Checkpoints which have their own).

- ⬜ "+X IP!" animated counter (number counts up from 0)
- ⬜ Streak status: "🔥 Day 12!" (or "🔥 Streak started!" if day 1)
- ⬜ If streak milestone hit → show milestone badge inline
- ⬜ **"Next up" preview**: title + icon of next node, with subtle glow ("Just one more" effect)
- ⬜ Two CTAs:
  - "Continue" → open next node immediately
  - "Done for now" → return to journey map
- ⬜ Confetti animation (light — not as heavy as checkpoint)
- ⬜ Haptic: Medium impact
- ⬜ Auto-dismiss after 5 seconds if user doesn't interact (return to map)

---

## P1.4 — Journey Map Integration (~20h)

Wire the new content system into the existing `ConfigDrivenNode` / `PathNode` journey map infrastructure.

### P1.4.1 ⬜ Extend Journey Config for Mental Health Node Types (4h)

- ⬜ Add new `NodeVariantConfig` entries for each node type:
  - `learn` → 📖 icon, blue theme
  - `exercise` → 🏋️ icon, green theme
  - `journal` → ✍️ icon, purple theme
  - `quiz` → ❓ icon, orange theme
  - `mood_check` → 🪞 icon, teal theme
  - `checkpoint` → ⭐ icon, gold theme
  - `chest` → 🎁 icon, yellow theme (already exists in ChestNode)
- ⬜ Add variant keys to existing `UnitNodeConfig` type
- ⬜ Add color themes for each node type to existing journey color system
- ⬜ Ensure locked/active/completed visual states work for all new variants

### P1.4.2 ⬜ Map Content Nodes to ConfigDrivenNode Variants (3h)

- ⬜ Create mapping: `journey_nodes.node_type` + `variant_key` → `ConfigDrivenNode` props
- ⬜ Map icons: resolve `icon_key` to SVG/emoji for each node type
- ⬜ Map colors: resolve `color_theme_key` to node background/shadow colors
- ⬜ Map labels: node title displayed as tooltip/label on the map
- ⬜ Handle special nodes: Chest uses `ChestNode` component, Checkpoint uses ⭐ variant

### P1.4.3 ⬜ `JourneyMapDataAdapter` — DB Data → PathNodeData[] (4h)

Transform the relational DB data into the format the journey map scroll view expects.

- ⬜ Input: `{ journey, sections, nodes, userNodeCompletions }` from `useJourney`
- ⬜ Output: `PathNodeData[]` compatible with `MultiUnitPresentation` / `JourneyMapContainer`
- ⬜ For each node, compute:
  - `id` = node.id
  - `type` = map node_type to existing `NodeType` enum (LESSON, CHECKPOINT, CHEST)
  - `status` = LOCKED / ACTIVE / COMPLETED (from useJourney derivation)
  - `icon` = resolved icon config
  - `label` = node.title
  - `progress` = for active node, partial progress if applicable
- ⬜ Group nodes by section for `UnitConfig[]` generation
- ⬜ Add section divider data between sections
- ⬜ Handle daily bonus node injection at map top (placeholder node)

### P1.4.4 ⬜ Wire Node Press → Open NodeRenderer Modal (4h)

- ⬜ In `JourneyMapContainer` (or new wrapper), handle `onNodePress(nodeId)`
- ⬜ Look up full `JourneyNode` data by id (from useJourney cache)
- ⬜ If node status = LOCKED → show locked tooltip ("Complete previous nodes first")
- ⬜ If node status = COMPLETED → show "Already completed" with option to review (read-only) — exercise/journal not re-submittable, learn/quiz reviewable
- ⬜ If node status = ACTIVE → open `NodeRenderer` in full-screen modal
- ⬜ On `NodeRenderer.onComplete` → call `useNodeCompletion` → show `NodeCompletionCelebration` → refresh map data
- ⬜ Modal transition: slide-up animation with spring

### P1.4.5 ⬜ Section Dividers (2h)

- ⬜ Between each section's nodes, insert a visual divider in the path
- ⬜ Use existing `UnitDivider` component or create a simple section header
- ⬜ Show section title + "X/Y nodes completed"
- ⬜ Locked sections show lock icon + "Complete previous section to unlock"

### P1.4.6 ⬜ Daily Practice Bonus Node (3h)

- ⬜ Inject a special "Daily Practice" node at the top of the journey map
- ⬜ Content: rotating exercise from completed sections (e.g., "Today: Try Box Breathing")
- ⬜ Replayable — can be completed once per day
- ⬜ Bonus XP: +15 IP
- ⬜ Distinct visual: star/sparkle icon, different color than regular nodes
- ⬜ Content selection: random from completed exercise nodes (or first section if nothing completed)

---

## P1.5 — Streak & XP UI (~15h)

The visible motivation layer. Users need to see and feel their progress.

### P1.5.1 ⬜ `StreakBanner` Component (3h)

- ⬜ Horizontal bar: 🔥 flame icon + streak count + "day streak" label
- ⬜ If streak ≥ 7: flame icon gets animated (subtle pulse)
- ⬜ If streak = 0: show "Start your streak!" CTA instead
- ⬜ Streak freeze indicator: small ❄️ badge with count if user has freezes
- ⬜ Tap → open streak detail (shows calendar, longest streak, milestones)
- ⬜ Used on: catalog screen header, journey map header, home screen
- ⬜ Compact variant for inline use (icon + number only)

### P1.5.2 ⬜ `XPCounter` Component (3h)

- ⬜ Animated counter showing total IP with ⚡ icon
- ⬜ On XP earn: animate number counting up from old → new value
- ⬜ Small "+X" flyover animation when XP is earned (floats up and fades)
- ⬜ Tap → open XP detail (today's breakdown by source)
- ⬜ Used alongside StreakBanner in headers

### P1.5.3 ⬜ `StreakMilestoneModal` Component (4h)

- ⬜ Triggered when `useStreak.updateStreak()` returns a milestone
- ⬜ Full-screen modal with celebration:
  - ⬜ Milestone badge icon (🔥 with number)
  - ⬜ "7-Day Streak!" title with scale-in animation
  - ⬜ Reward description (e.g., "You earned a Streak Freeze!")
  - ⬜ Confetti animation
  - ⬜ "Keep it going!" CTA
- ⬜ Heavy haptic impact on badge reveal
- ⬜ Milestones to handle: 3, 7, 14, 30, 60, 100, 365
- ⬜ Award streak freeze at 7-day milestone (call useStreak to add freeze)

### P1.5.4 ⬜ Journey Map Header (2h)

- ⬜ Sticky header above the scrollable journey map
- ⬜ Contains: back button, journey title, progress (X/28 nodes), StreakBanner, XPCounter
- ⬜ Compact layout — single row
- ⬜ Progress bar under the header (thin, colored by journey theme)

### P1.5.5 ⬜ Streak Saver Notification (3h)

- ⬜ Schedule local notification at 8 PM daily via `expo-notifications`
- ⬜ Only schedule if: user has streak ≥ 1 AND no node completed today
- ⬜ Dynamic copy: "Your {N}-day streak ends at midnight! Just one quick exercise to keep it going 💪"
- ⬜ Cancel notification if user completes a node before 8 PM
- ⬜ Respect user notification preferences (opt-out check)
- ⬜ Tap notification → deep link to journey map (current active node)

---

## P1.6 — Onboarding (~13h)

Get users to value as fast as possible. Duolingo's #1 retention lever.

### P1.6.1 ⬜ Try-Before-Sign-Up Flow (4h)

Allow unauthenticated users to experience the first 2 nodes before requiring sign-up.

- ⬜ Unauthenticated access to: Journey Catalog + Journey Detail + first 2 nodes of any journey
- ⬜ Store progress locally in AsyncStorage (`{ tempNodeCompletions, tempXP }`)
- ⬜ After node 2 completion → show sign-up prompt: "Sign up to save your progress and continue your journey"
- ⬜ On sign-up → migrate local progress to Supabase (insert `user_journeys` + `user_node_completions`)
- ⬜ Node 3+ blocked without auth — show gentle lock screen with sign-up CTA
- ⬜ Ensure celebrations and XP still work during unauthenticated session (local state)

### P1.6.2 ⬜ Journey Selection Questionnaire (5h)

Short questionnaire after sign-up that recommends a journey.

- ⬜ **Q1**: "What brings you here?" — multiple choice (Anxiety/Stress, Low mood, Self-improvement, Just curious)
- ⬜ **Q2**: "How much time do you have daily?" — 2 min / 5 min / 10+ min
- ⬜ **Q3**: "Have you tried CBT or therapy exercises before?" — Never / A little / Yes, regularly
- ⬜ **Q4**: "What sounds most helpful?" — Learn techniques / Journal & reflect / Quick exercises / All of the above
- ⬜ Recommendation engine: simple rule-based mapping → suggest 1 journey + "Browse All" fallback
- ⬜ Animated transitions between questions (horizontal swipe)
- ⬜ Skippable ("Skip → Browse All Journeys")
- ⬜ Store answers in user profile for Phase 3 AI personalization

### P1.6.3 ⬜ Progressive Feature Tooltips (4h)

Introduce features gradually to avoid overwhelming new users.

- ⬜ Tooltip system: spotlight (dims background) + tooltip pointing to UI element
- ⬜ Session tracking in AsyncStorage: `{ tooltipsShown: { session1: true, session2: false, ... } }`
- ⬜ Schedule:
  - ⬜ Session 1: "This is your journey map. Tap a node to start!" (point to first active node)
  - ⬜ Session 1: "You earned Insight Points!" (point to XP counter after first node)
  - ⬜ Session 2: "You're on a streak! Come back tomorrow to keep it going." (point to streak banner)
  - ⬜ Session 3: "Try today's Daily Challenge!" (point to daily challenge card — placeholder for Phase 2)
  - ⬜ Session 5: "You've been added to a Wellness League!" (placeholder — actual leagues in Phase 2)
  - ⬜ Session 7: "Chests contain rewards!" (point to upcoming chest node)
- ⬜ Each tooltip: dismissible on tap, "Got it" button, never shows again once dismissed
- ⬜ Respect reduced motion preferences

---

## P1.7 — Content Authoring for CBT Exercises (~16h)

Translate the CBT Content Guide into actual JSONB payloads that the renderers consume. This is pure content work referencing `cbt-content-guide.md`.

### P1.7.1 ⬜ Learn Node Content Authoring (4h)

Write the actual card text + visual keys for all Learn nodes in "Anxiety Toolkit".

- ⬜ "What is Anxiety?" — 5 cards (text + visual_key per card, per CBT guide §2.1 analogies)
- ⬜ "The Anxiety Cycle" — 5 cards (thoughts→feelings→behaviors, using "Three Gears" analogy)
- ⬜ "Cognitive Distortions of Anxiety" — 5 cards (catastrophizing, fortune telling, mind reading)
- ⬜ "Top 5 Anxiety Distortions" — 5 cards (one distortion per card with example from CBT guide §3)
- ⬜ "The Body-Mind Connection" — 4 cards
- ⬜ "Building Your Personal Coping Toolkit" — 4 cards
- ⬜ All cards follow content rules: ≤40 words, friendly tone, no jargon, analogy-first

### P1.7.2 ⬜ Exercise Node Content Authoring (5h)

Write the step-by-step content for all Exercise nodes.

- ⬜ "Map Your Personal Anxiety Cycle" — 4 steps: trigger → thought → feeling → behavior (text inputs)
- ⬜ "Spot the Distortion" — 5 scenario screens with multi_choice (from CBT guide §3 quiz questions)
- ⬜ "Thought Record — A Real Worry" — 7 steps matching CBT guide §4.1 exact flow
- ⬜ "5-4-3-2-1 Grounding" — 5 steps: see(5) → touch(4) → hear(3) → smell(2) → taste(1) with haptic config
- ⬜ "Box Breathing 4-4-4-4" — config for animation timing (4s per phase, 4 rounds)
- ⬜ "Progressive Muscle Relaxation" — 10 body areas with tense/release timing config
- ⬜ "Build Your Anxiety Emergency Plan" — picker step: select top 3 techniques from learned list
- ⬜ "Apply Toolkit to Scenario" — scenario text + multi-step application (CBT guide §4.5)

### P1.7.3 ⬜ Quiz Node Content Authoring (3h)

Write questions, options, correct answers, and explanations.

- ⬜ "Understanding Anxiety" quiz — 4 questions (CBT guide §15 quiz format)
- ⬜ "Cognitive Distortions Master Test" — 6 questions (identify-the-trap + best-response types, from CBT guide §15)
- ⬜ All questions follow quiz design rules: instant feedback, explain wrong answers, progressive difficulty
- ⬜ Each question JSONB: `{ text, options: string[], correct_index: number, explanation: string }`

### P1.7.4 ⬜ Journal + Mood + Chest + Checkpoint Content (4h)

- ⬜ 5 Journal prompts (from CBT guide §16 journal library, anxiety-linked)
- ⬜ 5 Mood Check configs (prompts tailored to section context)
- ⬜ 2 Chest reward configs (reward_type, reward_key, rarity)
- ⬜ 2 Checkpoint configs (badge_key, skills_recap arrays, mood_comparison flag)
- ⬜ Compile all content into final seed SQL script (update P1.1.5 seed)

---

## Phase 1 Summary

| Area | Tasks | Subtasks | Hours |
|------|-------|----------|-------|
| P1.1 Data Layer | 10 | 48 | 39h |
| P1.2 Catalog Screen | 6 | 30 | 20h |
| P1.3 Node Renderers | 9 | 62 | 53h |
| P1.4 Map Integration | 6 | 26 | 20h |
| P1.5 Streak & XP UI | 5 | 24 | 15h |
| P1.6 Onboarding | 3 | 19 | 13h |
| P1.7 Content Authoring | 4 | 20 | 16h |
| **Total** | **43 tasks** | **229 subtasks** | **~176h** |

**Recommended execution order:**
1. P1.1 (Data Layer) — everything depends on this
2. P1.1.6 (Types) + P1.4.1-P1.4.3 (Map config) — can parallel with DB work
3. P1.3.8 (NodeRenderer dispatcher) + P1.3.5 (MoodCheck, simplest renderer) — get the pipe working end-to-end
4. P1.3.1 (Learn) + P1.3.4 (Quiz) — next simplest renderers
5. P1.3.2 (Exercise) — most complex, needs the most time
6. P1.3.3 (Journal) — integrates with existing journal system
7. P1.3.6 (Checkpoint) + P1.3.7 (Chest) — reward renderers
8. P1.3.9 (Celebration) — ties everything together
9. P1.2 (Catalog) — discovery surface
10. P1.4.4-P1.4.6 (Map wiring) — connect everything
11. P1.5 (Streak/XP UI) — visible motivation layer
12. P1.6 (Onboarding) — polish
13. P1.7 (Content authoring) — can start early and run parallel with renderer work

---

*Phases 2-5 task files will be created when Phase 1 nears completion.*
