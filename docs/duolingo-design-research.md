# Duolingo Design Research

## How Duolingo Engineers Curriculum, UI Psychology, and Retention

> **Purpose:** A comprehensive breakdown of every system Duolingo uses to maximize course completion, daily active use, and long-term retention — from behavioral science to A/B testing strategy.

---

## Table of Contents

1. [The Core Metric: CURR](#1-the-core-metric-curr)
2. [Curriculum Architecture](#2-curriculum-architecture)
3. [Pedagogical Model](#3-pedagogical-model)
4. [Gamification System](#4-gamification-system)
5. [Behavioral Psychology Principles](#5-behavioral-psychology-principles)
6. [Notification & Re-engagement Engine](#6-notification--re-engagement-engine)
7. [Adaptive Learning System](#7-adaptive-learning-system)
8. [The 2022 Path Redesign](#8-the-2022-path-redesign)
9. [Onboarding Funnel](#9-onboarding-funnel)
10. [What Duolingo Learned from Failures](#10-what-duolingo-learned-from-failures)
11. [Metrics That Matter](#11-metrics-that-matter)
12. [Summary: The Completion Formula](#12-summary-the-completion-formula)

---

## 1. The Core Metric: CURR

**CURR = Current User Retention Rate** — the percentage of active users who remain active in the next period.

This single metric became Duolingo's north star above all others (above DAU, downloads, revenue).

### Why CURR over DAU?

- CURR has **5x more leverage on long-term DAU** than any acquisition metric
- A 21% improvement in CURR led to **4.5x DAU growth over 4 years**
- Referral programs only drove ~3% new user growth — retention beat acquisition every time

### The Streak as CURR Proxy

| Streak Milestone | Retention Effect                                                     |
| ---------------- | -------------------------------------------------------------------- |
| Day 1–3          | High churn window; most users never return                           |
| Day 7            | First trust signal; user has formed a habit loop                     |
| Day 10           | **Critical inflection point** — retention curve bends sharply upward |
| Day 30+          | Considered "hooked"; loss aversion becomes primary retention force   |

Users with 7+ day streaks grew from **<20% to >50% of DAU** after streak mechanics were prioritized.

---

## 2. Curriculum Architecture

### 2.1 Unit → Section → Path Structure

Duolingo organizes content into a strict hierarchy:

```
Course
  └── Section (e.g., "Greetings", "Travel", "Work")
        └── Unit (e.g., "Basic phrases", "Describing places")
              └── Lesson (2–5 min each)
                    └── Exercise (10–20 per lesson)
```

Each level serves a specific psychological purpose:

- **Sections** provide narrative arc and topical identity ("I'm learning about food")
- **Units** provide medium-term goals with visible completion ("3 lessons left")
- **Lessons** are sized for micro-commitment ("just one more")
- **Exercises** provide instant feedback loops

### 2.2 Single Linear Path (Post-2022)

Prior to August 2022, Duolingo used a branching "skill tree" where users could choose which skill to study. This was replaced with a **single, forced-linear path**.

**Why the change worked:**

- Eliminated decision fatigue — users spent cognitive energy learning, not planning
- Ensured prerequisites were never skipped
- Created a clear "next step" at all times
- Allowed curriculum designers to guarantee scaffolding sequence integrity
- A/B testing showed improved metrics across all cohorts despite social media backlash

**Key insight:** The vocal minority who complained on Reddit were the highly-engaged power users who wanted agency. The **silent majority** — the users Duolingo needed to retain — benefited from the guided structure.

### 2.3 Content Sequencing Philosophy

Duolingo uses a **spaced, interleaved curriculum** rather than blocked learning:

| Approach    | What It Looks Like                                         | Why It Works                                                        |
| ----------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Blocked     | Learn all verb conjugations, then all nouns                | Easy in the short term; poor long-term retention                    |
| Interleaved | Mix verbs, nouns, and phrases across multiple lessons      | Harder in the moment; 40%+ better retention (Kornell & Bjork, 2008) |
| Spaced      | Vocabulary appears across sessions at increasing intervals | Exploits spacing effect; reduces total review time                  |

Within a single lesson, Duolingo deliberately mixes:

- New vocabulary alongside familiar vocabulary
- Productive exercises alongside receptive exercises
- Topics from the current unit alongside review from prior units

---

## 3. Pedagogical Model

### 3.1 Core Philosophy: Learn by Doing

Users are **never given a textbook page to read before starting.** They are placed directly into exercises from the first second. Errors are expected and treated as data, not failure.

This is rooted in:

- **Testing Effect** (Roediger & Karpicke, 2006): Retrieval practice improves memory more than re-study
- **Generation Effect**: Producing an answer (even wrongly) creates stronger memory traces than reading it
- **Desirable Difficulties** (Bjork): Challenges that feel hard in the moment produce better long-term retention

### 3.2 Scaffolding Sequence Within Each New Concept

Every new concept follows a graduated exposure ladder:

```
1. Passive Recognition
   └── See new word with translation provided; no response required

2. Forced Choice (Easy Distractors)
   └── "Which means 'dog'? cat / dog / table" — obvious wrong answers

3. Forced Choice (Hard Distractors)
   └── Plausible wrong answers; requires genuine discrimination

4. Guided Construction
   └── Tap-to-build from word tiles; answer structure visible

5. Free Production
   └── Type the full answer; no scaffolding

6. Application in Context
   └── Use the word in an unfamiliar sentence or scenario
```

Users only advance to the next step once accuracy reaches threshold. Struggling users receive more exposures at each stage before moving up.

### 3.3 Exercise Type Variety

Duolingo uses ~15 distinct exercise types per language. Variety serves two functions:

1. **Pedagogical** — different modalities (reading, writing, speaking, listening) engage different cognitive pathways
2. **Engagement** — novelty prevents habituation; users don't know what exercise is coming next

| Exercise Type             | Skill Targeted          | Psychology Mechanism   |
| ------------------------- | ----------------------- | ---------------------- |
| Translate from L2 to L1   | Comprehension           | Forced recall          |
| Translate from L1 to L2   | Production              | Generation effect      |
| Match pairs               | Vocabulary recall       | Speed + accuracy       |
| Fill in the blank         | Contextual usage        | Cloze testing          |
| Listen + type             | Listening comprehension | Multi-modal encoding   |
| Speak the sentence        | Pronunciation           | Production + feedback  |
| Select the image          | Vocabulary mapping      | Dual coding            |
| Arrange the words         | Syntax understanding    | Constructive retrieval |
| Choose the correct answer | Recognition             | Low-stakes recall      |
| Story reading             | Reading fluency         | Contextual inference   |

### 3.4 Target Accuracy Rate: 80%

Duolingo's adaptive system targets an **80% accuracy rate per session.** This is the "flow zone":

- Below 70%: Feels too hard → frustration → dropout
- 70–90%: Optimal — challenging but achievable ("desirable difficulty")
- Above 90%: Too easy → boredom → dropout

If accuracy drops below threshold, the system:

- Reduces difficulty of distractors
- Adds more scaffolding exercises
- Introduces "hint" prompts on hover

If accuracy is consistently high, the system:

- Increases spacing between review sessions
- Promotes harder exercise types
- Reduces repeat exposures

### 3.5 Spaced Repetition: Half-Life Regression

Duolingo's proprietary spaced repetition algorithm (Settles & Meeder, ACL 2016) is trained on **13 million learner traces** from the Harvard Dataverse.

**What it tracks per learner per concept:**

- Number of prior exposures
- Time since last correct response
- Historical accuracy on this concept
- Lexeme difficulty (corpus frequency, phonological complexity)
- Estimated "memory half-life" — how long before recall probability drops to 50%

**How scheduling works:**

- Review is scheduled just before the predicted forgetting threshold
- Scheduling adapts per person — a strong learner of Spanish sees Spanish vocabulary less often than a struggling learner of the same vocabulary
- Outperforms Leitner boxes and Pimsleur-style fixed intervals on retention tests

---

## 4. Gamification System

### 4.1 Streaks (Loss Aversion)

The streak counter is Duolingo's most powerful retention tool, exploiting **loss aversion** (Kahneman & Tversky): losses feel ~2x more painful than equivalent gains feel pleasurable.

**How it's designed:**

- Streak counter prominently displayed on home screen, profile, and in notifications
- Fire emoji and increasing flame size reinforce identity ("I am a streak person")
- **Streak Freeze** — purchasable with gems; protects streak during a missed day
  - Clever mechanic: users with streak freezes actually miss fewer days (commitment device effect)
- **Streak Society** — community for users with long streaks; social identity reinforcement
- **Streak Repair** — limited-time offer after a missed day to restore streak for gems
  - Converts a dropout moment into a monetization moment

**Notification copy examples:**

- "You're on a 14-day streak! Don't break it now."
- "😢 Your streak is in danger! Quick, do a lesson."
- "Duo is heartbroken. 5 minutes can save your streak."

### 4.2 XP and Leagues

Leagues are Duolingo's **social comparison engine.** Every Monday, users are assigned to a random group of 30 users at their tier level:

| League Tier | Colors       | Weekly Movement                  |
| ----------- | ------------ | -------------------------------- |
| Bronze      | Brown        | Top 10 → promote to Silver       |
| Silver      | Gray         | Top 10 → promote to Gold         |
| Gold        | Yellow       | Top 10 → promote to Sapphire     |
| Sapphire    | Blue         | Top 10 → promote to Ruby         |
| Ruby        | Red          | Top 10 → promote to Emerald      |
| Emerald     | Green        | Top 10 → promote to Amethyst     |
| Amethyst    | Purple       | Top 10 → promote to Pearl        |
| Pearl       | White        | Top 10 → promote to Obsidian     |
| Obsidian    | Black        | Top 10 → promote to Diamond      |
| Diamond     | Blue-diamond | Top tier; compete within Diamond |

**Results from league rollout:**

- 17% increase in total learning time across all users
- Highly-engaged users (top tier) **tripled** their learning time
- Weekly competitive cycle creates Monday motivation spike + Friday urgency

**Psychology mechanics used:**

- **Social comparison theory** — humans naturally benchmark against peers
- **Relative ranking** — seeing yourself at #8 of 30 is far more motivating than "you earned 240 XP"
- **Promotion/demotion stakes** — fear of falling back to the previous tier
- **Randomized grouping** — you never know if your group will be competitive or easy

### 4.3 Hearts / Lives System

Users start with 5 hearts. Each wrong answer costs 1 heart.

- At 0 hearts: must wait (timer-based refill) or practice old content to earn hearts back
- Free users: 5 hearts max
- Duolingo Plus users: unlimited hearts

**Psychology rationale:**

- Creates "careful attention" rather than guess-and-click behavior
- Each interaction feels consequential
- Frustration at loss → motivation to practice more carefully
- **Monetization lever**: users out of hearts can purchase refills with gems or subscribe to Plus

**Design tension:** Hearts frustrate new users the most. Duolingo balances this by:

- Making first-lesson exercises very easy (rarely triggering heart loss)
- Providing "practice" sessions that restore hearts (reinforces spaced repetition use)

### 4.4 Daily Goals

Users choose their daily goal at onboarding:

| Goal    | Daily XP Target | Time ~Estimate | Label             |
| ------- | --------------- | -------------- | ----------------- |
| Casual  | 10 XP           | ~5 min         | "Just for fun"    |
| Regular | 20 XP           | ~10 min        | "Most popular"    |
| Serious | 30 XP           | ~15 min        | "I mean business" |
| Intense | 50 XP           | ~20 min        | "I'm committed"   |

**Critical design insight:** The **Casual** goal is intentionally achievable in under 5 minutes.

Why this works:

- Removes the "I don't have time" excuse entirely
- Users who start with Casual and maintain a streak naturally increase engagement over time
- Streak maintenance (even at low intensity) beats high-intensity dropout every time
- Low bar = high percentage of users who actually hit it = streak preserved = retention

### 4.5 Variable Reward System

Duolingo deploys **variable ratio reinforcement schedules** (Skinner's operant conditioning) — the same mechanism behind slot machines.

**Implementation:**

- Gem/chest rewards appear at **unpredictable** lesson completions (not every 5th lesson)
- Achievement badges unlock at **non-obvious thresholds** (e.g., "500 hearts lost" not "100 lessons")
- "Bonus XP" awarded at random during some lessons
- Random "legendary" exercises appear; completing them yields extra rewards

**Why variable > fixed rewards:**

- Fixed rewards (every 5th lesson) create predictable schedules — users habituate and the reward loses motivational value
- Variable rewards create **anticipation dopamine** — the uncertain possibility of reward is more motivating than a certain one
- This is the core psychological mechanism in gambling, social media "likes," and loot boxes

### 4.6 Gems / Lingots (In-App Currency)

Duolingo's internal currency serves as a **commitment device and reward store**:

- Earned through: lesson streaks, league XP, daily goals, achievements
- Spent on: streak freezes, heart refills, bonus lessons, cosmetic items (outfits for Duo)

**Behavioral function:**

- Saving gems creates "sunk cost" attachment
- Spending gems feels less painful than real money (psychological discount)
- Cosmetic spending (Duo outfits) is pure identity play — creates emotional attachment to the mascot

---

## 5. Behavioral Psychology Principles

### 5.1 Endowed Progress Effect

**The principle:** People are more motivated to finish something already in progress than to start from zero.

**Duolingo's implementation:**

- Placement test at onboarding: "You already know 12% of this course!"
- New users see progress bars that are **pre-filled** based on placement
- "Unit 1: You've already completed 2 lessons" shown even for true beginners
- Path shows a long trail stretching into the distance — you're already on it

Research basis: Nunes & Drèze (2006) — customers with a "head start" loyalty card completed a 10-stamp card twice as fast as those starting from zero.

### 5.2 Zeigarnik Effect

**The principle:** Incomplete tasks create psychological tension that motivates completion (Zeigarnik, 1927).

**Duolingo's implementation:**

- "You're 1 lesson away from completing Unit 3" shown prominently
- Partial progress bars are always visible on the path
- Lesson interrupted mid-session prompts "Finish your lesson?" on next app open
- Weekly league standing shows gap from promotion zone: "3 spots until you promote!"

The effect is deliberately used at every granularity — within a lesson, within a unit, within a section.

### 5.3 Implementation Intentions ("If-Then" Planning)

**The principle:** Specifying when and where you'll do a behavior doubles follow-through rates (Gollwitzer meta-analyses: 2–3x increase).

**Duolingo's implementation:**

- Onboarding asks: "When do you want to practice? Morning / Afternoon / Evening"
- Notification timing is set to match the user's stated intention
- Streak reminders sent at the stated practice time: "It's your evening practice time!"
- "Set a reminder" prompt appears if user hasn't done a lesson by 2 hours before midnight

### 5.4 Social Proof and Commitment

- "50 million people are learning [language]" shown during onboarding
- Friends' streaks visible in social tab — passive normative pressure
- "X of your Facebook friends are on Duolingo" during sign-up
- Sharing streak milestones to social media — public commitment + social reward

### 5.5 Loss Aversion Architecture

Every core mechanic has a loss-framing version:

| Mechanic   | Gain Frame                 | Loss Frame Used Instead       |
| ---------- | -------------------------- | ----------------------------- |
| Streak     | "You're building a habit!" | "Don't break your streak!"    |
| League     | "You could promote!"       | "You're about to be demoted!" |
| Hearts     | "You have lives"           | "You're losing hearts!"       |
| Daily goal | "You could earn XP"        | "You haven't practiced today" |

Loss framing is not cruel — it's triggered selectively (afternoon/evening if no lesson done yet) and balanced with encouraging copy when users do complete lessons.

### 5.6 Commitment Devices

- **Streak Freeze**: Purchasing a streak freeze is a **pre-commitment** to maintaining the streak even during busy periods. Users who buy it maintain higher streaks even when they don't use it (buying it signals commitment to self).
- **Goals**: Stating a goal during onboarding (e.g., "learn before a trip to Spain") is a commitment device — makes behavior more likely.
- **Weekly challenge reminders**: "You have X days to complete this week's challenge" frames the week as a commitment window.

---

## 6. Notification & Re-engagement Engine

### 6.1 Duo the Owl — Notification Character

Duo (the owl mascot) became an internet phenomenon for its "passive-aggressive" streak reminders. This was intentional design:

- Humanized notifications outperform generic push notifications by large margins
- Duo's emotional expressions (sad, worried, angry, happy) create genuine emotional response
- The meme-ability of Duo's reminders drove massive organic social media amplification
- Users who laughed at "passive-aggressive Duo" memes were doing the app's marketing for free

**Notification copy evolution:**

- Generic: "Time to practice your Spanish!"
- Humanized: "The Spanish language misses you. Just sayin'."
- Emotional: "😢 Duo is crying. You haven't practiced in 3 days."
- Meme-bait: "Your streak is on fire. The bad kind of fire. Please help."

### 6.2 Bandit Algorithm for Notification Timing

Duolingo uses a **multi-armed bandit algorithm** to optimize notification send time per user:

- Each user has a modeled "optimal send time" based on their historical open rates
- Algorithm explores (tries different times occasionally) and exploits (defaults to best-known time)
- Notification content is also optimized — A/B testing different copy variants per user segment
- Reactivation notifications use a **"recovering difference softmax" bandit** — matches user's previous pattern of return

**Result:** Personalized notification timing significantly outperforms any fixed send time (e.g., "send all at 7pm").

### 6.3 Notification Frequency Logic

Duolingo avoids notification fatigue through:

- **Cap per day**: Maximum 2 notifications per day regardless of user state
- **Time-of-day respect**: No notifications after 10pm in user's local timezone
- **Escalation ladder**: Gentle → urgent as midnight approaches for streak preservation
- **Silence after engagement**: If user already practiced today, no more notifications
- **Win-back campaigns**: Users inactive for 7 days receive different copy than 30-day inactive users

---

## 7. Adaptive Learning System

### 7.1 Per-User Difficulty Model

Beyond the spaced repetition algorithm, Duolingo adapts multiple dimensions:

| Dimension               | How It Adapts                                              |
| ----------------------- | ---------------------------------------------------------- |
| Exercise type           | Struggling users get more scaffolded (word-bank) exercises |
| Distractor difficulty   | Wrong answer options become harder as user improves        |
| Session length          | Hint: Daily goal XP scales with capability                 |
| Review frequency        | Concepts with lower accuracy get scheduled more often      |
| Streak reminder urgency | More aggressive if user recently broke a streak            |
| League grouping         | Matched by recent XP activity level                        |

### 7.2 Placement Test

The placement test serves multiple functions simultaneously:

1. **Skip already-known content** — prevents boredom and "I already know this" dropout
2. **Endowed progress** — test completion = "you're already partway through"
3. **Personalization** — curriculum adapted to actual knowledge level
4. **Commitment** — users who invest time in a placement test convert at higher rates

### 7.3 Stories Feature (Contextual Learning)

Stories are extended, narrative reading/listening exercises introduced at intermediate levels:

- Provide **contextual vocabulary acquisition** (words learned in story context are retained better than isolated vocabulary)
- Introduce **cultural nuance** that drill-style exercises cannot
- Create emotional engagement through character and plot
- Break up exercise monotony with a distinct format
- Used as a difficulty inflection point — gateway to more complex content

---

## 8. The 2022 Path Redesign

This was Duolingo's most significant UX decision in recent years and a masterclass in data-over-opinions product management.

### Before: Skill Tree

```
[Home Screen]
○──○──○──○
      \  \
       ○──○──○
             \
              ○──○
```

- Users could see all available skills and choose any unlocked one
- "Completed" skills faded but could be revisited
- Users often cherry-picked, skipping foundational content
- Highly-engaged users loved the freedom and customization
- Most users were paralyzed by choice or skipped fundamentals

### After: Single Linear Path

```
[Home Screen - vertical scroll]
  ●  ← Current lesson (pulsing, animated)
  ○
  ○
  ○  ← Unit 2 locked
  ...
```

- One clear next step always
- No navigation decisions required
- Progress is unambiguous: you're at point X on the path
- Path stretches far into the future (motivation: "there's so much more")
- Checkpoints with legendary challenges break up the path

### Why Vocal Minority Backlash Was Ignored

The users who complained loudest (Reddit, Twitter) were:

- Already highly engaged (by definition — they cared enough to post)
- Not representative of the median user
- The users Duolingo was _least_ at risk of losing

The silent majority who never post were:

- Casual learners who needed structure
- New users who didn't know what to choose
- The users most likely to churn under the old tree

**Design lesson:** Never let vocal power-users veto changes that improve outcomes for the majority. Measure behavior, not stated preferences.

---

## 9. Onboarding Funnel

The Duolingo onboarding is ruthlessly optimized. Every screen serves a specific conversion goal.

### Screen Sequence (approximate, as of 2024)

| Screen                               | Goal                      | Psychology Used                                         |
| ------------------------------------ | ------------------------- | ------------------------------------------------------- |
| "What language?"                     | Immediate goal-setting    | Commitment; no account required yet                     |
| "Why are you learning?"              | Goal clarification        | Self-determination; creates intrinsic frame             |
| "How much do you know?"              | Placement option          | Endowed progress if they test; efficiency signal        |
| Placement test                       | Skill calibration         | Investment; commitment; endowed progress                |
| "How often do you want to practice?" | Habit design              | Implementation intention                                |
| First lesson (no signup yet)         | Value delivery before ask | "Try before you sign up" reduces friction               |
| Sign-up prompt (post-first-lesson)   | Account creation          | User already invested in lesson; much higher conversion |
| Streak setup                         | Commitment device         | "Your streak starts now" creates stakes immediately     |

**Key insight:** Duolingo **delays sign-up until after the first lesson.** This is counterintuitive but dramatically increases conversion — users who experience value first are far more likely to create an account than users who hit a sign-up wall immediately.

### Onboarding Length Optimization

- A/B testing showed 4–6 screens is optimal for onboarding (before first lesson)
- Too few: users don't feel invested; no personalization
- Too many: drop-off before they reach the product
- The first lesson must be completable in under 3 minutes
- First lesson success rate target: >95% (nearly everyone should finish it)

---

## 10. What Duolingo Learned from Failures

These are documented from Duolingo's published growth blog posts and conference talks:

### 1. Copying Game Mechanics Blindly Doesn't Work

Duolingo tested mechanics from popular mobile games (energy systems, time-limited events, etc.). Most were "completely neutral" — no improvement.

**Why:** Game mechanics work because of the game's context (narrative, challenge escalation, social structures). Lifted out of that context, they're just UI widgets. The question to ask is always: **"Why does this work in that context, and does that reason exist here?"**

### 2. Acquisition vs. Retention Tradeoff

Referral programs, paid acquisition campaigns, and viral features were all tested. None of them had more than a fraction of the impact of retention improvements.

**Conclusion:** If your product has retention problems, fixing acquisition is like "filling a leaky bucket." Fix the leak first.

### 3. The Wrong User Research Trap

Early Duolingo heavily weighted feedback from dedicated learners on forums and beta programs. These users wanted more advanced content, more customization, more complexity.

When that content was built, it didn't move retention metrics because **the users who would churn didn't want complexity — they wanted simplicity and success.**

**Lesson:** Survey your at-risk users, not your champions.

### 4. Push Notification Over-Optimization

At one point, Duolingo increased notification frequency in an attempt to drive more daily sessions. Short-term DAU went up. Long-term, notification opt-out rates rose and CURR suffered.

**Lesson:** Notifications are a loan from the user's attention. Over-drafting kills the account.

---

## 11. Metrics That Matter

Duolingo's metric hierarchy (from their public growth research):

```
CURR (Current User Retention Rate)
    └── 5x leverage on DAU growth
    └── Primary north star

DAU (Daily Active Users)
    └── Business health signal
    └── Driven by CURR, not acquisition

D1 Retention (Day 1 Return Rate)
    └── Onboarding quality signal
    └── Does the first session deliver enough value?

Streak Distribution
    └── % of users with 7+ day streaks
    └── Leading indicator of CURR

Session Depth
    └── Avg exercises per session
    └── Proxy for engagement quality (not just opens)

Notification Open Rate
    └── Per-segment, per-timing cohort
    └── Drives re-engagement efficiency
```

### Key Benchmarks (Duolingo published / estimated)

| Metric                                        | Duolingo Figure                     |
| --------------------------------------------- | ----------------------------------- |
| DAU/MAU ratio                                 | ~25–30% (vs. ~15% for typical apps) |
| Users with 7+ day streaks (post-optimization) | >50% of DAU                         |
| Impact of CURR vs. acquisition on DAU         | 5:1 leverage                        |
| DAU growth from 21% CURR improvement          | 4.5x over 4 years                   |
| Leagues impact on learning time               | +17% across all users               |
| Highly-engaged users after leagues            | 3x more learning time               |

---

## 12. Summary: The Completion Formula

Duolingo's success is not from any single mechanic. It's from a system where each layer reinforces the others:

### The Flywheel

```
Easy First Session
      ↓
User Succeeds → Feels Competent
      ↓
Streak Starts → Loss Aversion Activates
      ↓
Daily Goal Set → Low Enough to Hit
      ↓
League Assigned → Social Stakes
      ↓
Streak Grows → Identity Shift ("I'm a language learner")
      ↓
Spaced Repetition → Content Stays Relevant
      ↓
Path Design → Always Clear What's Next
      ↓
Progress Visible → Completion Feels Possible
      ↓
Streak Deepens → Sunk Cost + Loss Aversion Compounds
```

### The 10 Rules Extracted

1. **CURR over everything** — retention beats acquisition, always
2. **Remove choice to reduce friction** — one path, one next step
3. **Make the first session trivially easy** — guaranteed success builds self-efficacy
4. **Sessions must be under 5 minutes** — eliminate "no time" as an excuse
5. **Loss aversion is stronger than reward** — frame mechanics around what users will lose
6. **Variable rewards > fixed rewards** — unpredictability sustains engagement longer
7. **Target 80% accuracy** — the flow zone; not too easy, not too hard
8. **Personalize timing, not content** — notification timing matters more than copy
9. **Measure behavior, not stated preferences** — vocal users are not representative
10. **Day 10 streak is the real goal** — get users there and retention curves bend permanently

---

## Sources & Further Reading

### Duolingo Official

| Resource                       | Link                                                                                                                    | What's in it                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Duolingo Engineering Blog      | [blog.duolingo.com](https://blog.duolingo.com)                                                                          | A/B tests, growth experiments, leagues rollout, streak mechanics |
| Duolingo Research              | [research.duolingo.com](https://research.duolingo.com)                                                                  | Published papers, learner datasets, spaced repetition work       |
| Duolingo Approach to Learning  | [duolingo.com/approach](https://www.duolingo.com/approach)                                                              | Official pedagogy overview                                       |
| Path Redesign Blog Post (2022) | [blog.duolingo.com/new-duolingo-home-screen-update](https://blog.duolingo.com/new-duolingo-home-screen-update/)         | Official rationale for dropping the skill tree                   |
| Leagues Launch Post            | [blog.duolingo.com — leagues](https://blog.duolingo.com/we-launched-leagues-and-streaks-went-up/)                       | Leagues rollout: +17% learning time result                       |
| Streak Society                 | [blog.duolingo.com/streak-society](https://blog.duolingo.com/streak-society/)                                           | Streak community, loss aversion mechanics                        |
| AI-Personalized Notifications  | [blog.duolingo.com — notifications](https://blog.duolingo.com/how-duolingo-uses-ai-to-send-you-the-right-notification/) | Bandit algorithm for notification timing per user                |

### Talks & Interviews

| Resource                                    | Link                                                                                                                    | What's in it                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Luis von Ahn on Lenny's Podcast (2023)      | [lennyspodcast.com](https://www.lennyspodcast.com/how-duolingo-grows-luis-von-ahn/)                                     | CURR north star, streak inflection point, league experiment numbers |
| Luis von Ahn — Y Combinator Talk (2021)     | [youtube.com/watch?v=P6FORpg0KVo](https://www.youtube.com/watch?v=P6FORpg0KVo)                                          | Retention over acquisition, streak origin story                     |
| Cem Kansu (Duolingo CPO) on Lenny's Podcast | [lennyspodcast.com — Cem Kansu](https://www.lennyspodcast.com/duolingo-cpo-cem-kansu-on-data-driven-product-decisions/) | A/B testing culture, metric hierarchy at Duolingo                   |

### Academic Papers — Spaced Repetition & Memory

| Paper                                          | Link                                                                                                           | Relevance                                                        |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Settles & Meeder (2016) — Half-Life Regression | [aclanthology.org/P16-1174](https://aclanthology.org/P16-1174/)                                                | Duolingo's proprietary spaced repetition algorithm               |
| Duolingo Learner Dataset (Harvard Dataverse)   | [dataverse.harvard.edu](aud)                                                                                   | 13M learner traces the algorithm was trained on                  |
| Roediger & Karpicke (2006) — Testing Effect    | [doi.org/10.1111/j.1467-9280.2006.01693.x](https://doi.org/10.1111/j.1467-9280.2006.01693.x)                   | Retrieval practice beats re-study for retention                  |
| Kornell & Bjork (2008) — Interleaving          | [doi.org/10.1111/j.1467-9280.2008.02094.x](https://doi.org/10.1111/j.1467-9280.2008.02094.x)                   | Interleaved practice outperforms blocked for long-term retention |
| Bjork (1994) — Desirable Difficulties          | [scholar.google.com](https://scholar.google.com/scholar?q=Bjork+1994+desirable+difficulties+memory+metamemory) | Hard-in-the-moment challenges produce better long-term retention |

### Academic Papers — Behavioral Psychology

| Paper                                          | Link                                                                                              | Relevance                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Kahneman & Tversky (1979) — Prospect Theory    | [jstor.org/stable/1914185](https://www.jstor.org/stable/1914185)                                  | Loss aversion: losses feel ~2x more painful than equal gains feel good |
| Nunes & Drèze (2006) — Endowed Progress Effect | [doi.org/10.1086/500480](https://doi.org/10.1086/500480)                                          | Artificial head starts increase task completion rates                  |
| Gollwitzer (1999) — Implementation Intentions  | [doi.org/10.1037/0003-066X.54.7.493](https://doi.org/10.1037/0003-066X.54.7.493)                  | "If-then" planning doubles follow-through rates                        |
| Zeigarnik (1927) — Incomplete Tasks Effect     | [scholar.google.com](https://scholar.google.com/scholar?q=Zeigarnik+1927+unfinished+tasks+memory) | Unfinished tasks create psychological tension motivating completion    |
