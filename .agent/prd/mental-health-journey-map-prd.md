# Mental Health Journey Map — Product Requirements Document

> **Version:** 1.0 | **Date:** 2026-04-05 | **Status:** Draft

---

## 1. Executive Summary

Transform the existing Journey Map (Duolingo-style node path) into a **Mental Health Journey platform** — a gamified, therapeutically-grounded system where users progress through structured paths of journaling, CBT exercises, psychoeducation, quizzes, and AI-powered insights.

**Core bet:** If we make evidence-based mental health practices as fun and habit-forming as Duolingo makes language learning, users will build lasting emotional resilience and keep coming back daily.

**Key Outcomes:**
- DAU increase of 40%+ through daily habit loops and streaks
- D7 retention of 60%+ via progressive disclosure, variable rewards, and loss aversion
- D30 retention of 35%+ through long-arc journeys, social accountability, and AI personalization
- Meaningful therapeutic value — users report measurable mood improvement within 14 days

---

## 2. Problem Statement

**User Pain Points:**
1. Mental health is overwhelming — users don't know where to start. Decision paralysis.
2. No structure — standalone journaling lacks a progressive curriculum. Users plateau.
3. Feels like homework — traditional CBT completion rates average only 15-30%.
4. No accountability loop — without streaks or social proof, users quit in 1-2 weeks.
5. Generic content — one-size-fits-all misses the user's specific struggles.

**Business Pain Points:**
1. Current journaling features have flat engagement — users journal 5-7 days then churn.
2. No structured content pipeline to drive repeat sessions.
3. Missing a daily habit hook that compounds retention.
4. No mechanism to re-engage dormant users with fresh content.

---

## 3. Vision & Opportunity

> "A personal mental health curriculum that feels like a game — where every tap teaches something, every exercise builds a skill, and every completed journey makes you measurably stronger."

**Market:** Mental health app market $7.3B by 2027 (CAGR 16.5%). No competitor combines therapeutic rigor + Duolingo-level gamification + AI personalization.

---

## 4. Duolingo-Inspired Engagement Framework

### 4.1 Growth Model (Adapted from Duolingo/Zynga)

| Bucket | Definition | Lever |
|--------|-----------|-------|
| **New Users** | First day ever | Onboarding quality, "try before sign-up" |
| **Current Users** | Active today + ≥1 of prior 6 days | **CURR — our North Star** |
| **Reactivated** | Back after 7-29 day absence | Re-engagement notifications |
| **Resurrected** | Back after 30+ day absence | New journey launches, seasonal events |
| **At-Risk WAU** | Inactive today but active prior 6 days | Streak-saver notifications |
| **At-Risk MAU** | Inactive 7-30 days | "We miss you" + progress summary |
| **Dormant** | Inactive 31+ days | Major feature launches, social invites |

> "Increasing CURR by 21% reduced daily churn by 40% and led to 4.5x DAU increase" — Duolingo

### 4.2 Core Mechanics (Proven by Duolingo)

| Mechanic | Our Adaptation |
|----------|---------------|
| **Streaks** | Consecutive days completing ≥1 node |
| **XP** | "Insight Points" (IP) per exercise/journal/quiz |
| **Leaderboards** | "Wellness Leagues" — weekly IP competition |
| **Streak Freeze** | "Rest Day" — planned recovery without streak loss |
| **Chests** | Unlock guided meditations, journal prompts, avatar items |
| **Badges** | "Breakthroughs" — milestones like "7-day mood tracker" |
| **Mascot** | Friendly, encouraging, non-clinical push notifications |
| **Spaced Repetition** | "Practice Nodes" revisit previous CBT techniques |

### 4.3 The Hook Model (Every Session)

```
TRIGGER (notification/streak) → ACTION (tap next node, 2-5 min)
→ VARIABLE REWARD (XP/chest/insight/rank) → INVESTMENT (streak grows, AI learns)
```

### 4.4 Session Design

- **Every node completes in 2-7 minutes** — never longer
- **Session = 1-3 nodes** — always feel accomplished
- **Daily goal = 1 node** — low bar to maintain streak
- **"Just one more"** — next node glows with preview after completion
- **End on a high** — celebration screen with XP, streak, micro-insight

---

## 5. User Personas

| Persona | Age | Trigger | Journey Fit |
|---------|-----|---------|-------------|
| **Anxious Alex** (35%) | 22-30 | Work stress, social anxiety | Anxiety Toolkit, Thought Defusion |
| **Reflective Riya** (25%) | 25-35 | Life transitions, self-discovery | Self-Discovery, Gratitude Journey |
| **Burnt-Out Ben** (20%) | 28-40 | Career burnout | Burnout Recovery, Boundary Builder |
| **Curious Chris** (20%) | 18-25 | Self-improvement, competitive | EQ 101, Communication Mastery |

---

## 6. Journey Architecture

### Hierarchy

```
Journey Catalog → Journey → Section → Unit → Node → Content
```

### Progression Rules
- Linear within sections — nodes unlock sequentially
- Sections unlock progressively — complete Section 1 → unlock Section 2
- Skip-ahead placement quiz for advanced users
- Practice nodes always re-playable (spaced repetition)
- Daily bonus node at top of map (rotating content, bonus XP)

---

## 7. Node Types & Content

### 7.1 Learn Node 📖
- **Duration:** 2-4 min | **XP:** 10 IP
- **Format:** Illustrated swipeable cards, max 40 words/card, key takeaway summary
- **Example:** "What is Cognitive Distortion?" — 5 illustrated cards

### 7.2 Exercise Node 🏋️
- **Duration:** 3-7 min | **XP:** 20 IP
- **Format:** Interactive worksheets, step-by-step wizard, one question per screen
- **Types:** Thought Record, Cognitive Restructuring, Worry Decision Tree, 5-4-3-2-1 Grounding, Box Breathing, Progressive Muscle Relaxation, Values Sort, Emotion Wheel, STOP Technique, Gratitude Three, Best Possible Self

### 7.3 Journal Node ✍️
- **Duration:** 3-5 min | **XP:** 15 IP
- **Format:** Guided prompt with voice-to-text, mood before/after, emotion tag
- **Integration:** Saves to existing journal system, tagged with journey context for AI

### 7.4 Quiz Node ❓
- **Duration:** 2-3 min | **XP:** 15 IP (+5 perfect bonus)
- **Format:** 4-6 questions, instant feedback, explain wrong answers, progressive difficulty
- **Design:** One question/screen, animated feedback, never subtract XP for wrong answers

### 7.5 Chest Node 🎁
- **XP:** 5 IP | Placed every 5-7 nodes
- **Rewards:** Common (60%): bonus IP, prompts. Uncommon (25%): audio, streak freeze. Rare (12%): themes, avatar. Legendary (3%): guided series, badges.

### 7.6 Checkpoint Node ⭐
- **XP:** 50 IP + section badge
- **Content:** Progress summary, skill recap, badge award, mood start-vs-now comparison

### 7.7 AI Insight Node 🤖
- **XP:** 25 IP | End of each journey + mid-journey
- **Report:** Mood arc graph, top themes from journals, thought pattern summary, technique effectiveness, growth highlights, personalized next journey recommendation, shareable summary card

### 7.8 Practice Node 🔄
- **XP:** 10 IP | Always replayable
- **Format:** Apply learned technique to a new scenario, AI evaluates response

### 7.9 Mood Check Node 🪞
- **XP:** 5 IP | 30 seconds | Start and end of each section
- **Format:** Emoji selector (5 levels) + optional one-line note

---

## 8. Journey Catalog

### Phase 1 (MVP)

| Journey | Sections | Nodes | Duration |
|---------|----------|-------|----------|
| Anxiety Toolkit | 4 | 28 | 2 weeks |
| Mood Lifter | 3 | 21 | 10 days |
| Stress Reset | 3 | 18 | 10 days |
| EQ 101 | 4 | 24 | 2 weeks |

### Phase 2
CBT Foundations (35), Gratitude Path (21), Sleep Hygiene (24), Self-Compassion (28), Anger Management (24), Grief & Loss (30), Social Confidence (28), Relationship Skills (32)

### Phase 3+
Daily Practice Paths (infinite), Seasonal Challenges, Community Journeys, AI-Generated Journeys, Crisis Toolkit (always accessible, not gamified)

### Example: "Anxiety Toolkit" Section 1

```
Section 1: Understanding Anxiety (7 nodes)
  🪞 Mood Check → 📖 "What is Anxiety?" → 📖 "The Anxiety Cycle"
  → 🏋️ "Map Your Cycle" → ✍️ Journal → ❓ Quiz → 🎁 Chest
```

---

## 9. Gamification & Retention

### 9.1 Insight Points (IP)

| Action | IP |
|--------|----|
| Learn node | 10 |
| Exercise node | 20 |
| Journal node | 15 |
| Quiz node | 15 (+5 perfect) |
| Mood Check | 5 |
| Practice node | 10 |
| Checkpoint | 50 |
| AI Insight | 25 |
| Daily streak bonus | 10 × streak_day (cap 100) |
| Perfect day (3+ nodes) | 25 |

### 9.2 Streak System

**Milestones:** 3d (badge+50IP), 7d (badge+freeze), 14d (badge+rare chest), 30d (badge+theme), 60d (badge+AI report), 100d (badge+shareable card), 365d (lifetime badge)

**Protection:** Streak Freeze (200 IP, max 2), Rest Day (1/week, planned), Weekend Amulet (400 IP), Streak Saver notification at 8 PM

**Psychology:** Users at 10-day streak have significantly lower dropout. Loss aversion compounds — longer streak = more painful to lose.

### 9.3 Wellness Leagues

| League | Promotion | Demotion |
|--------|-----------|----------|
| 🟤 Bronze | Top 10 → Silver | None |
| ⚪ Silver | Top 10 → Gold | Bottom 5 → Bronze |
| 🟡 Gold | Top 10 → Emerald | Bottom 5 → Silver |
| 💎 Emerald | Top 5 → Diamond | Bottom 5 → Gold |
| 👑 Diamond | Top 3 → Hall of Fame | Bottom 5 → Emerald |

30 users/league, matched by activity level, weekly reset Monday, only exercise IP counts.

### 9.4 Badges ("Breakthroughs")
Journey milestones, streak badges, exercise mastery, social, consistency, quiz performance, exploration, AI engagement.

### 9.5 Daily Challenges
Rotating micro-challenges: Speed Run (3 nodes <10 min), Themed (breathing exercise), Social (encourage friend), Reflection (3 mood checks), Comeback (practice node from old journey).

---

## 10. AI Integration

- **Intake Assessment:** 2-min questionnaire → primary concern, severity, learning style, time availability
- **Adaptive Difficulty:** Adjusts content depth based on quiz/exercise performance
- **Smart Recommendations:** Next journey based on journal themes + mood trends
- **Dynamic Daily Node:** AI-selected based on current mood trend
- **Coaching Moments:** Contextual suggestions within exercises (e.g., detect all-or-nothing thinking in journal)
- **Voice Journaling:** Whisper transcription + AI reflection prompts
- **End-of-Journey Reports:** Mood arc, themes, patterns, technique effectiveness, personalized next steps

---

## 11. Onboarding

**"Try Before Sign-Up" (Duolingo's #1 retention win — +20% D1 retention):**

1. Open app → Journey Catalog (no sign-up wall)
2. Tap journey → see map with glowing first node
3. Complete first Learn node (2 min) → celebration
4. Complete second Exercise node (3 min) → celebration
5. "Sign up to save progress" (after value demonstrated)

**Progressive Feature Disclosure:**
Session 1: Map + nodes + IP. Session 2: Streak. Session 3: Daily challenge + journal. Session 5: Leagues. Session 7: Chests + freezes. Journey complete: AI report.

---

## 12. Notifications

**Rule #1: PROTECT THE CHANNEL** (never increase frequency without strong justification)

| Type | Timing | Example |
|------|--------|---------|
| Streak Saver | 8 PM if no activity | "Your 15-day streak ends at midnight! Just 2 min 💪" |
| Daily Reminder | User-set time | "Your Anxiety Toolkit has a new exercise waiting 🌅" |
| Milestone | Immediately | "🎉 7-day streak! 'One Week Strong' badge earned!" |
| League Update | Sunday 6 PM | "20 IP from staying in Gold. One exercise could do it!" |
| Re-engagement | Day 3, Day 7 inactive | "We saved your progress. Node 12 is waiting 🌿" |
| New Content | Launch day | "New Journey: 'Sleep Hygiene' — 14 days to better sleep 🌙" |

Mascot-driven: notifications from a character feel personal, not corporate.

---

## 13. Design Principles

- **Clarity:** One thing per screen. No jargon. Visual-first. Progress always visible.
- **Emotional Safety:** Never punitive. Mood-aware UI. Crisis safety net. No social comparison on sensitive data. Always optional.
- **Delight:** 3D squircle buttons (AnimatedButton), haptics, confetti, sounds, spring animations, color-coded journeys.
- **Accessibility:** Reduced motion, screen readers, voice input, 44dp touch targets, WCAG AA contrast.

---

## 14. Data Model (Core Tables)

```sql
journeys (id, slug, title, description, category, difficulty, estimated_days, total_nodes, color_theme_key, icon_key, is_published)
journey_sections (id, journey_id, title, sort_order, unlock_rule)
journey_nodes (id, section_id, node_type, title, content JSONB, xp_reward, estimated_minutes, sort_order, variant_key)
user_journeys (id, user_id, journey_id, status, started_at, completed_at, current_node_id)
user_node_completions (id, user_id, node_id, journey_id, response_data JSONB, xp_earned, completed_at, duration_seconds, mood_before, mood_after)
user_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_freezes_available)
user_xp_ledger (id, user_id, amount, source, source_id, earned_at)
user_leagues (id, user_id, league_tier, league_group_id, weekly_xp, week_start)
user_achievements (id, user_id, achievement_key, earned_at)
user_inventory (id, user_id, item_type, item_key, item_metadata JSONB, unlocked_at)
ai_insight_reports (id, user_id, journey_id, report_type, report_data JSONB, generated_at)
```

---

## 15. Success Metrics

| Metric | Target (6 months) |
|--------|--------------------|
| CURR (current user retention) | 75% |
| D1 Retention | 55% |
| D7 Retention | 40% |
| D30 Retention | 25% |
| DAU/MAU Ratio | 30% |
| Avg nodes/session | 2.5 |
| Journey completion rate | 45% |
| Streak ≥7d (% of DAU) | 50% |
| Mood improvement (journey start→end) | +1.5 pts |
| Users starting 2nd journey | 60% |

---

## 16. Phased Rollout

| Phase | Weeks | Goal |
|-------|-------|------|
| **1: Foundation** | 1-6 | Core journey + 4 node types + streak + XP + 1 journey |
| **2: Gamification** | 7-10 | Leagues + badges + daily challenges + chests + 3 more journeys |
| **3: AI** | 11-14 | AI reports + adaptive difficulty + voice journal + coaching |
| **4: Social** | 15-18 | Friends + challenges + sharing + referrals + seasonal events |
| **5: Scale** | 19+ | AI-generated journeys + CMS + localization + premium |

---

## 17. Engineering Task Breakdown

### Phase 1: Foundation (Weeks 1-6)

**P1.1 — Data Layer**
- P1.1.1: Supabase migration — `journeys`, `journey_sections`, `journey_nodes` tables (4h)
- P1.1.2: Migration — `user_journeys`, `user_node_completions` tables (3h)
- P1.1.3: Migration — `user_streaks`, `user_xp_ledger` tables (3h)
- P1.1.4: RLS policies for all journey tables (3h)
- P1.1.5: Seed "Anxiety Toolkit" journey — 28 nodes content as JSONB (8h)
- P1.1.6: TypeScript types for all journey entities (3h)
- P1.1.7: `useJourney` hook — fetch structure + user progress (4h)
- P1.1.8: `useNodeCompletion` hook — mark complete, award XP, advance (4h)
- P1.1.9: `useStreak` hook — calculate, check/update daily, freeze logic (4h)
- P1.1.10: `useXP` hook — fetch total, earn, ledger ops (3h)

**P1.2 — Journey Catalog Screen**
- P1.2.1: `JourneyCatalogScreen` container (4h)
- P1.2.2: `JourneyCatalogPresentation` — card grid, progress indicators (6h)
- P1.2.3: `JourneyCard` component (3h)
- P1.2.4: `JourneyDetailSheet` — bottom sheet with description, start CTA (4h)
- P1.2.5: Add catalog route to Expo Router (1h)
- P1.2.6: Tab navigation integration (2h)

**P1.3 — Node Content Renderers**
- P1.3.1: `LearnNodeRenderer` — swipeable card carousel (8h)
- P1.3.2: `ExerciseNodeRenderer` — step-by-step wizard, inputs, sliders (12h)
- P1.3.3: `JournalNodeRenderer` — guided prompt, text input, mood before/after (6h)
- P1.3.4: `QuizNodeRenderer` — questions, instant feedback, score summary (8h)
- P1.3.5: `MoodCheckRenderer` — emoji selector, one-line note (3h)
- P1.3.6: `CheckpointRenderer` — celebration, badge, skill recap (5h)
- P1.3.7: `ChestOpeningRenderer` — animation, reveal, inventory add (5h)
- P1.3.8: `NodeRenderer` dispatcher — routes node_type → renderer (2h)
- P1.3.9: `NodeCompletionCelebration` — confetti, XP, streak, next CTA (4h)

**P1.4 — Journey Map Integration**
- P1.4.1: Extend `JourneyConfig` for mental health node types/variants (4h)
- P1.4.2: Map content nodes to `ConfigDrivenNode` variant keys (3h)
- P1.4.3: `JourneyMapDataAdapter` — transform DB data → `PathNodeData[]` (4h)
- P1.4.4: Wire node press → open `NodeRenderer` modal (4h)
- P1.4.5: Section dividers via existing `UnitDivider` (2h)
- P1.4.6: Daily Practice bonus node at map top (3h)

**P1.5 — Streak & XP UI**
- P1.5.1: `StreakBanner` component (3h)
- P1.5.2: `XPCounter` — animated IP counter (3h)
- P1.5.3: `StreakMilestoneModal` (4h)
- P1.5.4: Streak + XP in journey map header (2h)
- P1.5.5: Streak saver local notification at 8 PM (3h)

**P1.6 — Onboarding**
- P1.6.1: Try-before-sign-up flow — first 2 nodes without auth (4h)
- P1.6.2: Journey selection questionnaire → recommendation (5h)
- P1.6.3: Progressive feature tooltip system (4h)

### Phase 2: Gamification (Weeks 7-10)

- P2.1: `user_leagues`, `user_achievements`, `user_inventory` migrations (4h)
- P2.2: `useLeague` hook — enrollment, weekly XP, promotion/demotion (6h)
- P2.3: `LeagueScreen` — leaderboard UI, tier badges, promotion animations (8h)
- P2.4: `useAchievements` hook — check conditions, award badges (4h)
- P2.5: `AchievementBadgeModal` — reveal animation + badge gallery screen (6h)
- P2.6: `DailyChallengeSystem` — rotating challenges, reward logic (6h)
- P2.7: `DailyChallengeCard` UI component (3h)
- P2.8: Chest reward pool + rarity logic + `useChestReward` hook (4h)
- P2.9: Streak freeze purchase UI + Rest Day + Weekend Amulet (4h)
- P2.10: `PracticeNodeRenderer` — spaced repetition with new scenarios (6h)
- P2.11: Seed 3 additional journeys (Mood Lifter, Stress Reset, EQ 101) (16h)

### Phase 3: AI & Personalization (Weeks 11-14)

- P3.1: AI Insight report generation — GPT-4o pipeline for journal NLP (8h)
- P3.2: `AIInsightRenderer` — mood arc graph, themes, patterns UI (8h)
- P3.3: Intake assessment flow → journey recommendation engine (6h)
- P3.4: Adaptive difficulty — adjust quiz/exercise depth from performance (4h)
- P3.5: AI coaching moments — contextual suggestions in exercises (6h)
- P3.6: Voice journaling — Whisper integration + AI reflection prompts (6h)
- P3.7: Weekly AI insight summary generation + notification (4h)
- P3.8: ML-optimized notification send times (4h)

### Phase 4: Social & Growth (Weeks 15-18)

- P4.1: Friend system — add, activity feed, encourage (8h)
- P4.2: Friend challenges — co-complete a journey (6h)
- P4.3: Social sharing — achievement cards (Instagram-story sized) (4h)
- P4.4: Referral rewards — streak freeze + 100 IP for both (4h)
- P4.5: Community journeys — collaborative progress (8h)
- P4.6: Seasonal challenge framework (6h)

### Phase 5: Scale (Weeks 19+)

- P5.1: AI-generated personalized journeys from user data (12h)
- P5.2: Daily Practice infinite rolling path (6h)
- P5.3: Content Management System for clinical team (16h)
- P5.4: Multi-language journey localization (8h)
- P5.5: Premium tier — advanced AI, unlimited freezes, exclusive journeys (8h)
- P5.6: Therapist integration — share journey data with provider (8h)

---

## 18. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Over-gamification trivializes mental health | Clinical review of all content. Gamification on process (doing exercises), never on outcomes (mood scores). |
| Crisis situations — user expresses suicidal ideation | Journal NLP detects crisis keywords → immediate, non-intrusive helpline banner. Never gamified. |
| Notification fatigue destroys channel | Duolingo's #1 rule: protect the channel. Optimize timing/copy, never volume. |
| Streak pressure causes anxiety | Streak freezes, rest days, gentle copy ("It's okay to rest"). Streaks are never public. |
| Content quality at scale | Phase 5 CMS requires clinical team approval for all content before publish. |
| AI hallucination in insights | AI reports show data-backed observations only, never diagnoses. "Patterns we noticed" not "You have X." |
| Privacy concerns with journal data | E2E encryption for journal text. AI processing on-device where possible. Clear data policy. |

---

## 19. Appendix

### A. Duolingo Research Sources
- Jorge Mazal, "How Duolingo Reignited User Growth" (Lenny's Newsletter) — CURR model, streak optimization, leaderboards, 4.5x DAU growth
- Duolingo Blog, "Meaningful Metrics: The Growth Model" — user state buckets, retention rate modeling
- StriveCloud, "Duolingo Gamification Explained" — 36% YoY DAU increase, churn reduction 47%→28%, badge referral 116% lift, streak D14 retention +14%

### B. CBT/Therapeutic Sources
- Beck Institute — Cognitive Behavioral Therapy core model
- DBT Skills Training (Marsha Linehan)
- ACT (Acceptance & Commitment Therapy) — values-based exercises
- Positive Psychology interventions (Seligman)
- Gamifying CBT research (PMC/PubMed) — mHealth gamification for youth mental health

### C. Technical Dependencies
- Existing: `ConfigDrivenNode`, `AnimatedButton` (squircle type), `AnimatedNodeButton`, `ChestNode`, `PathNode`, journey map scroll infrastructure
- New: Supabase tables, GPT-4o for NLP, Whisper for voice, `react-native-circular-progress`, notification scheduling
