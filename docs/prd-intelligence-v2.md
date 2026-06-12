# PRD: Intelligence Layer — "Your Personal Therapist's Notebook"

**Author:** Product & Engineering  
**Date:** June 4, 2026  
**Status:** Draft  
**Priority:** P1  
**Supersedes:** PRD Phase 3 (§5.11–5.13) from `prd-cbt-exercises-v2.md`

---

## 1. Why This Matters

Every CBT app on the market does the same thing: shows users a distortion count, a streak number, a weekly exercise tally. This is reporting — not intelligence. Users don't open an app at 11pm because they want a bar chart. They open it because they're spiraling and want to know: **"Am I getting better? Is this working? What should I do right now?"**

A human therapist answers these questions by:

- Tracking the same thought across sessions and showing it weakening
- Noticing which techniques work for this specific person
- Connecting dots the client can't see (triggers, timing, core beliefs)
- Intervening upstream — before the spiral, not during it

No competitor does any of this. They can't — they don't collect pre/post data on every exercise, they don't store full thought text, and they don't have exercise variety to compare techniques per-user.

**We have all of it. This PRD turns that data into a moat.**

---

## 2. Competitive Landscape: Why "Intelligence" Currently Means Nothing

| App                           | What they call "insights"           | Why it's weak                                                                                 |
| ----------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| **Woebot**                    | Weekly mood summary, exercise count | No technique comparison, no longitudinal belief tracking                                      |
| **Wysa**                      | Mood graph, trigger list            | Surface-level — "your triggers are work and relationships" (user already knows)               |
| **Finch**                     | Mood trends over time               | No CBT depth — just emoji moods plotted on a line                                             |
| **Calm**                      | Streak count, minutes meditated     | Quantified self, not therapeutic insight                                                      |
| **Headspace**                 | Practice frequency, focus score     | Measures meditation, not cognitive change                                                     |
| **Clarity/CBT Thought Diary** | Thought frequency, mood correlation | Closest competitor — but no effectiveness ranking, no belief decay, no proactive intervention |

**The gap:** No app tells you "This specific technique works 3x better for YOUR specific anxiety pattern" or "The thought 'I'm not good enough' had 90% power over you 3 weeks ago — it's at 45% now."

---

## 3. Our Unfair Advantage (Data We Already Collect)

| Data point                             | Where it lives                                                                                           | What it enables                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Pre/post intensity on ALL 16 exercises | `exercise_entries.response` (preRating, postRating, intensity, postIntensity, anxietyBefore/After, etc.) | Per-exercise effectiveness ranking for each user                   |
| Full text of automatic thoughts        | `response.automaticThought`                                                                              | NLP clustering → detect recurring core beliefs                     |
| Full text of situations                | `response.situation`                                                                                     | Trigger clustering (work, relationships, health, etc.)             |
| Cognitive distortions identified       | `response.selectedDistortions`                                                                           | Skill acquisition tracking — distortion-catching speed             |
| Exercise timestamps                    | `exercise_entries.completed_at`                                                                          | Temporal pattern detection (time-of-day, day-of-week)              |
| Balanced thoughts generated            | `response.balancedThought`                                                                               | Belief decay curve — same thought challenged multiple times        |
| Exercise type diversity                | 16 types across 4 categories                                                                             | Technique comparison — cognitive vs physiological vs metacognitive |
| Emotion selections                     | `response.selectedEmotions`                                                                              | Emotional pattern over time                                        |

---

## 4. The Six Intelligence Features

### Feature 1: Personal Effectiveness Score

**What it answers:** "Which techniques work best for MY brain?"

**The insight:**

> "When you're anxious, your data says:
>
> 1. Decatastrophizing → avg −4.2 anxiety points
> 2. Box Breathing → avg −3.1 points
> 3. Thought Reframing → avg −1.8 points
>
> **Decatastrophizing is your power tool for anxiety.**"

**Why no one else has it:** Requires pre/post measurement on every exercise (we do), AND multiple exercise types to compare (we have 16). Woebot has 1 technique (chat-based CBT). Calm has 1 technique (meditation). They can't compare.

**Implementation:**

```typescript
// src/hooks/insights/usePersonalEffectiveness.ts

interface EffectivenessScore {
  exerciseType: ExerciseType;
  exerciseLabel: string;
  avgDrop: number; // absolute pre - post average
  sampleSize: number; // how many completions
  category: ExerciseCategory;
}

// Logic:
// 1. Group completed exercise_entries by exercise_type
// 2. For each group, use PRE_POST_FIELDS mapping to extract pre/post
// 3. Compute avg(pre - post)
// 4. Filter to n >= 2 (need at least 2 completions for signal)
// 5. Sort descending by avgDrop
// 6. Return top 5 + "best for anxiety" / "best for overthinking" sub-rankings
```

**UI:** Ranked list card in InsightsScreen + "Recommended for you" card in ExercisesScreen pulls from the #1 result for the user's most-detected emotion category.

**Data needed:** Already collected. Zero new fields.

---

### Feature 2: Belief Decay Curve

**What it answers:** "Am I getting better? Is this thought losing power?"

**The insight:**

> "The thought 'I'm not good enough' appeared 4 times over 3 weeks:
>
> - May 5: 90% belief strength
> - May 12: 75% (after reframing)
> - May 20: 60%
> - May 28: 42%
>
> **This thought has lost 53% of its grip on you.**"

**Why no one else has it:** Requires (a) storing the full text of automatic thoughts, (b) clustering similar thoughts across sessions, (c) tracking intensity over time. Most apps don't persist exercise outputs at all.

**Implementation:**

```typescript
// src/hooks/insights/useBeliefDecay.ts

interface BeliefCluster {
  coreThought: string; // representative text (shortest/most common)
  variants: string[]; // all thought texts in this cluster
  intensityOverTime: Array<{
    date: string;
    preIntensity: number;
    postIntensity: number;
  }>;
  totalDecay: number; // first pre - last post
  decayPercentage: number; // as %
}

// Logic:
// 1. Extract all (automaticThought, intensity, postIntensity, date) from entries
// 2. Call Gemini with the texts: "Group these thoughts by underlying belief.
//    Return cluster IDs." (embedding similarity alternative: compute locally)
// 3. For each cluster with 3+ entries, compute the decay curve
// 4. Surface clusters with significant decay (>20%) as positive reinforcement
// 5. Surface clusters with NO decay as "stuck points" needing different approach
```

**AI prompt for clustering:**

```
Given these automatic thoughts from a CBT exercise journal (one per session over several weeks), identify recurring core beliefs. Group thoughts that express the same underlying belief even if worded differently.

Thoughts:
1. "I'm going to get fired" (May 5)
2. "My boss hates my work" (May 8)
3. "I always mess up presentations" (May 12)
4. "Nobody actually likes having me on the team" (May 19)
5. "I'm going to embarrass myself at dinner" (May 22)
6. "My friends just invite me out of pity" (May 25)

Group by core belief and name each group.
```

Expected output: Group 1 (work inadequacy): 1,2,3,4 | Group 2 (social rejection): 5,6

**UI:** A "Your Beliefs Over Time" card in InsightsScreen. Each belief cluster shown as a mini sparkline (intensity dots over time) with a decay percentage badge. Tappable → detail view showing all variants and the full curve.

**Frequency:** Recompute when 3+ new entries since last computation. Cache aggressively (staleTime: 24h).

---

### Feature 3: Trigger Cluster Map

**What it answers:** "What's actually causing my anxiety?"

**The insight:**

> "Pattern detected across your last 12 exercises:
>
> - **7/12** involve work authority figures (boss, manager, team lead)
> - **4/12** happen between 9–11pm (evening rumination window)
> - **8/12** contain Mind Reading (assuming what others think)
>
> **Your core pattern:** Work performance anxiety, triggered by authority interactions, expressed through Mind Reading, mostly in the evening."

**Why no one else has it:** Requires full situation text (we have it), AI-powered thematic extraction (we have Gemini), temporal metadata (we have `completed_at`), and distortion data (we have it). This is the "what would a therapist notice after 10 sessions" feature.

**Implementation:**

```typescript
// src/hooks/insights/useTriggerClusters.ts

interface TriggerCluster {
  theme: string; // "work authority", "social judgment", "health worry"
  count: number; // how many exercises in this cluster
  percentage: number; // of total exercises
  peakHours: number[]; // common hours (e.g., [21, 22, 23])
  topDistortions: string[]; // most common distortions in this cluster
  topEmotions: string[]; // most common emotions
  effectiveTechniques: Array<{ type: ExerciseType; avgDrop: number }>;
}

// Logic:
// 1. Extract all (situation, completed_at hour, selectedDistortions, selectedEmotions, exerciseType, preDelta)
// 2. Call Gemini: "Categorize these situations into 3-5 trigger themes"
// 3. For each cluster: compute time-of-day distribution, top distortions, effectiveness
// 4. Cross-reference with Personal Effectiveness to suggest: "For your work anxiety, Decatastrophizing works best"
```

**UI:** "Your Anxiety Map" card — shows 2-3 trigger clusters as labeled bubbles (size = frequency). Each tappable → detail: when it hits, which distortions fire, and which exercise works best for it.

---

### Feature 4: Proactive Timing Nudges

**What it answers:** Nothing — it acts BEFORE the user needs to ask.

**The insight (push notification):**

> 7:45pm: "Evening coming up. Your anxiety usually peaks around 9pm. A 4-minute breathing exercise now can get ahead of it."

> Monday 8:00am: "Mondays are your toughest day (anxiety avg 7.2 vs other days 4.8). Thought Catcher is quick and helps."

**Why no one else has it:** Woebot sends generic daily check-ins. Calm sends "time to meditate." Neither analyzes YOUR temporal patterns and suggests YOUR best technique.

**Implementation:**

```typescript
// src/hooks/insights/useTemporalPatterns.ts

interface TemporalPattern {
  type: "time_of_day" | "day_of_week";
  peakWindow: { start: number; end: number }; // hour (0-23) or day (0-6)
  avgIntensity: number; // average pre-score during peak
  offPeakAvgIntensity: number;
  bestExercise: ExerciseType; // from personal effectiveness for entries in this window
  confidence: number; // only surface if n >= 5 entries in the window
}

// Logic:
// 1. Group entries by hour(completed_at) — find if any 3-hour window has 40%+ of entries
// 2. Group by dayOfWeek(completed_at) — find if any day is 1.5x above average
// 3. For significant patterns: compute average pre-intensity and best exercise
// 4. Schedule local notification 1 hour BEFORE the peak (if confidence high enough)
```

**Notification scheduling:**

- Use existing `expo-notifications` infrastructure (already in `habitNotifications.ts`)
- Only schedule if pattern has n >= 5 entries AND peak intensity >= 6/10
- Recalculate weekly
- User can disable per-pattern ("Don't remind me about evening anxiety")

**UI:** Settings toggle "Smart timing nudges" (on by default). In InsightsScreen: "Your Patterns" card showing detected time/day patterns with small clock icons.

---

### Feature 5: Skill Progression Visualization

**What it answers:** "Am I getting better at CBT — not just doing it, but doing it more effectively?"

**The insight:**

> "Reframing Skill:
>
> - Week 1: After reframing, thoughts still felt 62% true
> - Week 2: 48% true
> - Week 3: 35% true
> - This week: 28% true
>
> **Your rational mind is getting louder. Each reframe cuts deeper than the last.**"

**Why no one else has it:** This requires comparing the SAME metric (postIntensity) across time, which requires (a) consistent pre/post measurement (we have it), (b) enough exercises to show a trend (our engagement work in Phase 1-2 drives this), (c) the concept of "skill" not just "activity."

**Implementation:**

```typescript
// src/hooks/insights/useSkillProgression.ts

interface SkillTrend {
  skill: "reframing" | "breathing" | "exposure" | "mindfulness";
  weeklyAverages: Array<{
    weekStart: string;
    avgPostScore: number; // lower = better (thought intensity after)
    avgDelta: number; // pre - post (higher = more effective)
    count: number;
  }>;
  overallTrend: "improving" | "stable" | "declining";
  improvementRate: number; // % improvement per week
  message: string; // human-readable insight
}

// Logic:
// 1. Group exercises by skill category:
//    - reframing: thought_catcher, thought_reframing, abc_analysis
//    - breathing: box_breathing, breathing_478, mindful_breathing
//    - exposure: fear_ladder, decatastrophizing, worry_decision_tree
//    - mindfulness: grounding, body_scan, detached_mindfulness, attention_training
// 2. For each category: group by week, compute avg pre-post delta
// 3. Linear regression on weekly deltas → slope = improvement rate
// 4. Generate message based on slope direction and magnitude
```

**UI:** "Your Skills" card — 4 mini-sparklines (one per category) showing the weekly effectiveness trend. Color: green for improving, neutral for stable, gentle amber for declining (with encouragement, not alarm). Tappable → expanded view with weekly bars.

**Relapse Detection (sub-feature):**

When a skill category that was previously improving (positive slope over 3+ weeks) reverses direction for 2+ consecutive weeks, surface a proactive insight:

> "Your anxiety scores have risen over the past 2 weeks after being stable. This sometimes happens with new stressors. When scores were high before, Decatastrophizing worked best for you — want to try it?"

Logic: detect when `weeklyAverages[n].avgDelta < weeklyAverages[n-1].avgDelta` for 2 consecutive weeks AND prior slope was positive. Cross-reference with Personal Effectiveness for the category to suggest the right exercise. Never alarm — always frame as "this is normal, here's what to do."

---

### Feature 6: Therapist's Notebook (The Moat Feature)

**What it answers:** "What would a therapist say after reviewing all my sessions?"

**The insight (generated weekly via Gemini):**

> "Across your 8 exercises this month, I notice a core belief pattern:
>
> **'If I make a mistake, people will reject me.'**
>
> This shows up as:
>
> - Catastrophizing at work (3x) — 'I'll get fired'
> - Mind Reading with friends (2x) — 'They think I'm weird'
> - Avoidance of new things (Fear Ladder 1x) — not trying = can't fail
>
> **What's working:** Your evidence-against collections have been strong — you've listed 12 concrete examples of being accepted despite mistakes. Your Decatastrophizing scores are your best (−4.8 avg drop).
>
> **Suggestion:** Your strongest evidence is 'My boss gave me a raise 2 months ago despite the Q3 bug.' That one fact alone disproves the core belief. Consider saving it as a coping card for quick access."

**Why no one else can do this:** Requires ALL of: stored thought text, stored evidence text, stored distortions, stored pre/post scores, exercise type diversity, temporal data, AND an AI capable of synthesis (not just summarization). We have every piece.

**Implementation:**

```typescript
// src/hooks/insights/useTherapistNotebook.ts

interface TherapistInsight {
  coreBeliefIdentified: string;
  manifestations: Array<{
    situation: string;
    distortion: string;
    exerciseType: ExerciseType;
  }>;
  whatIsWorking: string;
  bestEvidence: string; // strongest counter-evidence the user has generated
  suggestion: string;
  generatedAt: string;
  weekNumber: number;
}

// Logic:
// 1. Gather last 4 weeks of exercise entries (minimum 5 to generate)
// 2. Build structured prompt with:
//    - All automatic thoughts + situations
//    - All distortion selections
//    - All evidence-against lists
//    - Pre/post deltas per exercise
//    - Coping cards saved
// 3. Ask Gemini to synthesize (not summarize):
//    "You are a CBT therapist reviewing a client's exercise journal.
//     Identify: core belief pattern, how it manifests across situations,
//     what's working, strongest evidence against the belief, and one
//     specific suggestion for next week."
// 4. Cache result for 7 days (queryKey includes weekNumber)
// 5. Only generate if user has 5+ entries with thought text
```

**UI:** Dedicated "Therapist's Notebook" card — expandable, rich text, shows once per week when new analysis is ready. Premium feature (gated behind pro).

**Evidence-to-Coping-Card Bridge:**

When Therapist's Notebook identifies a "strongest evidence" text, it auto-creates a draft coping card in `coping_cards` with `starred: false` and a special `reframe_label: "Evidence from your Notebook"`. The UI shows: "I found a powerful piece of evidence in your journal. [Save to Coping Cards →]" — one tap confirms, no extra typing needed. This bridges the insight layer into the action layer.

**Safety:** Add disclaimer: "These patterns are AI-detected from your exercise data. They are not a clinical assessment. If you're in crisis, contact a professional."

---

### Feature 7: AI Narrative Synthesis ("What This Means For You")

**What it answers:** Connects ALL computed data into one 3-4 sentence paragraph that makes the user FEEL understood.

**The insight (generated weekly from computed data):**

> "Your anxiety peaks in the evenings around 9pm, usually tied to work authority worries. Decatastrophizing is your sharpest tool — it cuts anxiety by 4.2 points on average, which is 2x more effective than breathing alone for this pattern. Your reframing skill is getting stronger at 18% per week, meaning thoughts that used to feel 62% true now drop to 35%. Keep showing up in the evenings — that's where your biggest growth is happening."

**Why this is critical:** Features 1-6 produce data. Feature 7 turns data into narrative. Users don't remember numbers — they remember "the app that told me my anxiety about work is getting better." This is the difference between a dashboard and a companion.

**Implementation:**

- Takes structured output from Features 1, 3, 4, 5 (not raw entries — no PII sent unnecessarily)
- One Gemini call per week (~1K tokens in, ~300 out)
- Displayed as top card in InsightsScreen — the first thing users see
- Fallback: if AI unavailable, card hides. Computed cards always render standalone.
- NOT pro-gated — this is the hook that makes free users want more.

**AI for notification personalization:**
Template notifications feel generic ("Time to breathe"). AI-personalized notifications reference the user's actual pattern:

- Template: "Evening coming up. Try breathing."
- AI-personalized: "You tend to spiral about tomorrow's meetings around 9pm. Last time, Decatastrophizing brought you from 9 to 4. Get ahead of it?"

Cost: negligible (one notification text generation per scheduled nudge, ~100 tokens).

---

## 5. Feature Priority & Dependencies

```
┌─────────────────────────────────────────────────────────┐
│ WEEK 1-2: Foundation                                     │
│                                                         │
│  Feature 1: Personal Effectiveness Score                │
│  └── Pure computation on existing data                  │
│  └── Zero AI, zero new tables                           │
│  └── Enables: Recommendations in ExercisesScreen       │
│                                                         │
│  Feature 5: Skill Progression                           │
│  └── Also pure computation (weekly averages + slope)    │
│  └── Enables: "Am I getting better?" answer            │
├─────────────────────────────────────────────────────────┤
│ WEEK 3-4: Pattern Detection                             │
│                                                         │
│  Feature 3: Trigger Clusters                            │
│  └── Gemini call for situation → theme extraction       │
│  └── Cross-references effectiveness data (Feature 1)   │
│                                                         │
│  Feature 4: Proactive Timing Nudges                     │
│  └── Temporal analysis + local notification scheduling  │
│  └── Uses existing expo-notifications infra             │
├─────────────────────────────────────────────────────────┤
│ WEEK 5-6: Deep Insight (Premium)                        │
│                                                         │
│  Feature 2: Belief Decay Curve                          │
│  └── Gemini embedding/clustering on thought texts       │
│  └── Longitudinal intensity plotting                    │
│                                                         │
│  Feature 6: Therapist's Notebook                        │
│  └── Synthesis prompt combining ALL data types          │
│  └── Weekly generation, pro-gated                       │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Technical Architecture

### New Files

```
src/hooks/insights/
├── usePersonalEffectiveness.ts       (Feature 1)
├── useSkillProgression.ts            (Feature 5)
├── useTriggerClusters.ts             (Feature 3)
├── useTemporalPatterns.ts            (Feature 4)
├── useBeliefDecay.ts                 (Feature 2)
└── useTherapistNotebook.ts           (Feature 6)

src/components/insights/
├── PersonalEffectivenessCard.tsx      (Feature 1)
├── SkillProgressionCard.tsx           (Feature 5)
├── TriggerClusterCard.tsx             (Feature 3)
├── BeliefDecayCard.tsx                (Feature 2)
├── TherapistNotebookCard.tsx          (Feature 6)
└── RecommendedForYouCard.tsx          (Feature 1 → ExercisesScreen)

src/utils/insights/
├── temporalAnalysis.ts               (Feature 4 — hour/day grouping)
└── beliefClustering.ts               (Feature 2 — Gemini prompt builder)
```

### Modified Files

```
src/screens/InsightsScreen/InsightsScreen.tsx     (add new cards)
src/screens/ExercisesScreen/ExercisesScreen.tsx   (add RecommendedForYouCard)
src/hooks/insights/useExerciseRecommendation.ts   (use PersonalEffectiveness as signal)
src/utils/habitNotifications.ts                    (add temporal nudge scheduling)
```

### Data Flow

```
exercise_entries (Supabase)
        │
        ▼
useExerciseStats()              ← already exists, fetches all completed entries
        │
   ┌────┴────────────────────────────────────────┐
   │                                              │
   ▼                                              ▼
usePersonalEffectiveness()              useTemporalPatterns()
  → per-exercise avgDelta                 → peak hours/days
  → "best for anxiety/overthinking"       → schedule notifications
   │
   ▼
useSkillProgression()
  → weekly trend per category
  → slope = improvement rate
        │
        ▼ (requires Gemini)
useTriggerClusters()
  → situation text → themes
  → cross-ref effectiveness + timing

useBeliefDecay()
  → thought text → clusters
  → intensity over time per cluster

useTherapistNotebook()
  → ALL data synthesized
  → weekly generation, pro-gated
```

### AI Cost Estimation

| Feature              | Gemini calls/user/week | Est. tokens/call  | Monthly cost @ $0.15/1M tokens |
| -------------------- | ---------------------- | ----------------- | ------------------------------ |
| Trigger Clusters     | 1/week                 | ~2K in + ~500 out | ~$0.04/user                    |
| Belief Decay         | 1/week                 | ~3K in + ~1K out  | ~$0.06/user                    |
| Therapist's Notebook | 1/week                 | ~5K in + ~1K out  | ~$0.09/user                    |
| **Total**            | **3/week**             |                   | **~$0.19/user/month**          |

At 10K MAU: ~$1,900/month. At 100K MAU: ~$19K/month. Gate Features 2 + 6 behind Pro to offset.

---

## 7. User Experience

### ExercisesScreen (Discovery)

```
┌─────────────────────────────────────────────────┐
│  Exercises                              [📑] [⚡]│
│                                                  │
│  ┌─── Recommended for you ────────────────────┐ │
│  │ 🔭 Decatastrophizing                       │ │
│  │ "Works best for your anxiety (−4.2 avg)"   │ │
│  │                              [Try now →]   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  CBT Core                                        │
│  ┌─── Thought Catcher ─────────────────────────┐│
│  │ ...                                         ││
```

### InsightsScreen (Intelligence)

```
┌─────────────────────────────────────────────────┐
│  Your Practice                      [7d ▼]      │
│                                                  │
│  ┌ This Week ────────────────────────────────┐  │
│  │ 5 sessions  │  −3.2 avg  │  8d streak    │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌ Your Skills ──────────────────────────────┐  │
│  │ Reframing  ▁▂▃▅▇  improving (+18%/wk)    │  │
│  │ Breathing  ▃▃▄▄▅  stable                  │  │
│  │ Exposure   ▁▂▃▃▃  building                │  │
│  │ Mindfulness ▃▃▃▃▃  steady                 │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌ Best Tools for You ───────────────────────┐  │
│  │ 🥇 Decatastrophizing  (−4.2 per session)  │  │
│  │ 🥈 Box Breathing      (−3.1 per session)  │  │
│  │ 🥉 Fear Ladder        (−2.8 per session)  │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌ Your Pattern ─────────────────────────────┐  │
│  │ 📍 Work authority (7/12 exercises)         │  │
│  │ 🕙 Evening peak (9-11pm)                  │  │
│  │ 🔮 Mind Reading (top trap)                 │  │
│  │                                            │  │
│  │ "Your core anxiety pattern involves..."    │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌ Belief Tracker ──── PRO ──────────────────┐  │
│  │ "I'm not good enough"                      │  │
│  │  ●────●────●────●                          │  │
│  │  90%  75%  60%  42%                        │  │
│  │  "Lost 53% of its grip" ↓                 │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌ Therapist's Notebook ──── PRO ────────────┐  │
│  │ 📓 Weekly synthesis available              │  │
│  │ "I notice a core belief pattern..."       │  │
│  │ [Read full analysis →]                    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Push Notification Examples

| Timing                                  | Message                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1h before detected peak                 | "Evening coming up. Box Breathing works well for you around now — 3 minutes?"               |
| Monday morning (if Monday is tough day) | "Mondays are your hardest day. A quick Thought Catcher now can set the tone."               |
| After 3+ exercises in a week            | "You've been consistent. Your weekly insight is ready — see what patterns I found."         |
| After significant belief decay          | "The thought 'I'll get fired' is at 42% — down from 90% a month ago. That's real progress." |

---

## 8. Premium Gating Strategy

| Feature                      | Free                    | Pro                                       |
| ---------------------------- | ----------------------- | ----------------------------------------- |
| Personal Effectiveness Score | ✅ Top 3 shown          | ✅ Full ranking + per-category            |
| Skill Progression            | ✅ Trend direction only | ✅ Full weekly chart + improvement %      |
| Trigger Clusters             | ✅ Top cluster name     | ✅ All clusters + effectiveness cross-ref |
| Proactive Timing             | ✅ 1 nudge/day max      | ✅ Unlimited + customizable               |
| Belief Decay Curve           | ❌                      | ✅ Full longitudinal view                 |
| Therapist's Notebook         | ❌                      | ✅ Weekly synthesis                       |

This creates a clear value ladder: free users see enough to know patterns exist → pro unlocks the deep "therapist-level" insight that drives retention.

---

## 9. Success Metrics

| Metric                                    | Current | Target | Timeframe |
| ----------------------------------------- | ------- | ------ | --------- |
| 7-day retention after insights unlock     | N/A     | 65%    | 3 months  |
| Exercises/user/week (users with insights) | ~2      | 5+     | 3 months  |
| Push notification tap-through rate        | N/A     | 15%+   | 2 months  |
| Pro conversion from insights screen       | N/A     | 8%     | 3 months  |
| NPS score among power users (5+/week)     | N/A     | 50+    | 6 months  |
| "Am I getting better?" (survey positive)  | N/A     | 70%+   | 6 months  |

---

## 10. Risks & Mitigations

| Risk                                   | Mitigation                                                                                                                                                                                                                                                           |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI pattern detection wrong/harmful     | Disclaimer on all AI outputs. Therapist's Notebook framed as "patterns I notice" not "diagnosis." User can dismiss/disagree.                                                                                                                                         |
| Belief Decay shows no improvement      | Frame positively: "This thought is persistent. That's common — some beliefs take longer. Different techniques might help: [suggestion]." Never show declining curves without actionable suggestion.                                                                  |
| Proactive nudges become annoying       | Default to 1/day max. Easy snooze ("Not now — don't remind me about this pattern for a week"). Require 5+ entries minimum before activating.                                                                                                                         |
| Gemini latency on insight generation   | All AI features run async in background (React Query staleTime: 24h). Never block UI. Show cached result immediately, refresh silently.                                                                                                                              |
| Privacy concerns (AI reading thoughts) | Thoughts are sent to Gemini for processing but are NOT used to train Google's models (per Gemini API data terms) and are NOT stored by Google after processing. Add "Your thoughts are processed privately and never used to train AI" messaging in insights screen. |
| Users with few entries get empty state | Feature 1+5 require minimum 5 entries. Feature 2+3+6 require 8+. Show encouraging empty states: "3 more exercises until I can find your patterns."                                                                                                                   |
| Skill regression triggers anxiety      | Never use red/negative colors. Frame declining trends as: "This category needs a different approach — try [X] instead." Tone is always coaching, never grading.                                                                                                      |

---

## 11. What Makes This a Market Leader

1. **Personal Effectiveness** — No app tells you which technique works best for YOUR brain. This alone is a differentiator worth mentioning in App Store copy.

2. **Belief Decay** — The #1 question therapy answers ("Is my thought pattern changing?") visualized in real-time. This is the "before/after transformation photo" for mental health.

3. **Proactive Timing** — Intervening upstream before the spiral. Shifts the app from reactive tool → anticipatory companion. Wysa and Woebot do daily check-ins; we intervene at YOUR peak moment.

4. **Therapist's Notebook** — The $200/session insight for free (or Pro). Connects dots across weeks like a human therapist. Justifies premium pricing immediately.

5. **Combined moat** — Each feature uses ALL the unique data we collect. A competitor would need to (a) add pre/post measurement, (b) store full thought text, (c) have 16 exercise types, AND (d) wire AI synthesis — then wait months for user data to accumulate. We're already there.

**App Store tagline potential:** "The first CBT app that learns how YOUR mind works."

---

## 12. Implementation Timeline

| Week | Features  | Key Deliverables                                                                                           |
| ---- | --------- | ---------------------------------------------------------------------------------------------------------- |
| 1    | Feature 1 | `usePersonalEffectiveness` hook + `PersonalEffectivenessCard` + `RecommendedForYouCard` in ExercisesScreen |
| 2    | Feature 5 | `useSkillProgression` hook + `SkillProgressionCard` in InsightsScreen                                      |
| 3    | Feature 4 | `useTemporalPatterns` + notification scheduling + settings toggle                                          |
| 4    | Feature 3 | `useTriggerClusters` + Gemini prompt + `TriggerClusterCard`                                                |
| 5    | Feature 2 | `useBeliefDecay` + Gemini clustering + `BeliefDecayCard` (Pro)                                             |
| 6    | Feature 6 | `useTherapistNotebook` + synthesis prompt + `TherapistNotebookCard` (Pro)                                  |

---

_This PRD replaces the generic "show numbers" Phase 3 approach with intelligence that no competitor can replicate without rebuilding their data layer from scratch._
