# Phase 3 Tasks — Intelligence: "Your Personal Therapist's Notebook"

> **Goal:** Turn exercise data into intelligence no competitor can replicate.
> **Timeline:** ~6 weeks
> **Reference:** `docs/prd-intelligence-v2.md`
> **Prerequisite:** Phase 1 ✅ + Phase 2 ✅

---

## Track A: Foundation (Pure Computation — No AI)

### ✅ TASK-024 — Personal Effectiveness Score hook + card

**Files to create:**

- `src/hooks/insights/usePersonalEffectiveness.ts`
- `src/components/insights/PersonalEffectivenessCard.tsx`
- `src/components/insights/RecommendedForYouCard.tsx`

**Files to modify:**

- `src/screens/InsightsScreen/InsightsScreen.tsx` (add card)
- `src/screens/ExercisesScreen/ExercisesScreen.tsx` (add recommendation card)

**Logic:**

1. Import `useExerciseStats()` — already fetches all completed entries
2. Group entries by `exercise_type`
3. For each group: use existing `PRE_POST_FIELDS` mapping from `src/constants/insights.ts` to extract pre/post values from `entry.response`
4. Compute `avgDelta = average(pre - post)` for each exercise type
5. Filter to types with `n >= 2` (minimum signal)
6. Sort descending by `avgDelta`
7. Return:
   ```typescript
   interface PersonalEffectiveness {
     ranked: EffectivenessScore[]; // all types, sorted best-first
     bestForAnxiety: EffectivenessScore | null; // highest delta among anxiety-category exercises
     bestForOverthinking: EffectivenessScore | null;
     bestOverall: EffectivenessScore | null;
   }
   ```

**PersonalEffectivenessCard UI:**

- Title: "Best Tools for You"
- Top 3 ranked with medal emoji (🥇🥈🥉)
- Each row: exercise icon + name + "(−X.X per session)" in sage text
- Tappable row → navigates to that exercise

**RecommendedForYouCard UI:**

- Renders above exercise list in `ExercisesScreen`
- Shows `bestOverall.exerciseLabel` + `bestOverall.avgDrop` as the reason
- "Works best for your [category] (−X.X avg)" subtitle
- Single CTA: "Try now →"
- Hidden when no data (< 5 total entries)

**Acceptance criteria:**

- [ ] Hook computes correct averages from exercise history
- [ ] Card renders ranked list in InsightsScreen
- [ ] Recommendation card renders in ExercisesScreen with correct exercise
- [ ] Tapping navigates to exercise-flow screen
- [ ] Empty state hidden (not shown until 5+ completed entries)

---

### ✅ TASK-025 — Skill Progression hook + card

**Files to create:**

- `src/hooks/insights/useSkillProgression.ts`
- `src/components/insights/SkillProgressionCard.tsx`

**Files to modify:**

- `src/screens/InsightsScreen/InsightsScreen.tsx` (add card)

**Logic:**

1. Import `useExerciseStats()`
2. Define skill categories:
   ```typescript
   const SKILL_CATEGORIES = {
     reframing: ["thought_catcher", "thought_reframing", "abc_analysis"],
     breathing: ["box_breathing", "breathing_478", "mindful_breathing_1min"],
     exposure: [
       "fear_ladder",
       "decatastrophizing",
       "worry_decision_tree",
       "worry_time",
     ],
     mindfulness: [
       "grounding_54321",
       "body_scan_pmr",
       "detached_mindfulness",
       "attention_training",
       "recognizing_rumination",
     ],
   };
   ```
3. For each category: group entries by ISO week, compute `avgDelta` per week
4. Compute slope via simple linear regression on weekly deltas (x = week index, y = avgDelta)
5. Classify: `slope > 0.3` = improving, `slope < -0.3` = declining, else stable
6. Generate message per category:
   - Improving: "Your [skill] is getting stronger — each session cuts deeper."
   - Stable: "Steady and consistent. Maintenance is a skill too."
   - Declining: "This category needs a different approach. Try [bestExercise from PersonalEffectiveness for this category] instead."

**Relapse Detection (sub-feature):**

- If a category was improving (slope > 0.3 over 3+ weeks) but last 2 weeks reversed (avgDelta decreasing), flag it:
  ```typescript
  interface RelapseAlert {
    category: SkillCategory;
    previousTrend: "improving";
    currentWeeksDecline: number;
    suggestedExercise: ExerciseType;
    message: string;
  }
  ```
- Message: "Your [category] scores have risen after being stable. When this happened before, [exercise] worked best for you."
- Display as a subtle amber card within the SkillProgressionCard — never alarming, always actionable.

**SkillProgressionCard UI:**

- Title: "Your Skills"
- 4 rows, one per category:
  - Category name + mini sparkline (5-6 dots representing last 5-6 weeks)
  - Trend badge: "improving (+X%/wk)" in sage, "stable" in neutral, or "needs attention" in soft amber
- Tappable → expanded detail with weekly bar chart (use `View` width % bars, not a chart library)
- Relapse alert card below if detected

**Acceptance criteria:**

- [ ] Weekly averages compute correctly per category
- [ ] Sparkline direction matches actual trend
- [ ] Linear regression slope classifies correctly (test with mock data)
- [ ] Relapse detection fires when 2+ weeks decline after improvement
- [ ] Messages are actionable (not just descriptive)

---

### ✅ TASK-026 — Temporal Patterns hook + Proactive Nudges

**Files to create:**

- `src/hooks/insights/useTemporalPatterns.ts`
- `src/utils/insights/temporalAnalysis.ts`

**Files to modify:**

- `src/utils/habitNotifications.ts` (add smart nudge scheduling)
- `src/screens/SettingsScreen/` (add "Smart timing nudges" toggle — or inline in insights)

**Logic in `temporalAnalysis.ts`:**

```typescript
interface TemporalPattern {
  type: "time_of_day" | "day_of_week";
  peakWindow: { start: number; end: number };
  entryCount: number;
  avgPreIntensity: number;
  offPeakAvgIntensity: number;
  confidence: number; // entryCount / total * significance
  bestExercise: ExerciseType;
}

function detectTimeOfDayPattern(entries): TemporalPattern | null {
  // 1. Bucket entries by 3-hour windows (0-2, 3-5, 6-8, ..., 21-23)
  // 2. Find if any window has 40%+ of all entries
  // 3. If yes AND avgPreIntensity in that window >= 6: pattern found
  // 4. Set bestExercise from PersonalEffectiveness for entries in that window
}

function detectDayOfWeekPattern(entries): TemporalPattern | null {
  // 1. Bucket by dayOfWeek (0=Sun ... 6=Sat)
  // 2. Find if any day has 1.5x the mean count
  // 3. If yes AND avgPreIntensity on that day >= 6: pattern found
}
```

**Notification scheduling:**

1. `useTemporalPatterns` returns detected patterns
2. When a pattern has `confidence >= 0.6` AND `entryCount >= 5`:
   - Schedule a local notification 1 hour BEFORE the peak window start
   - Content: "Evening coming up. [bestExercise.label] works well for you around now — [duration]?"
3. Use existing `expo-notifications` scheduling (same pattern as `habitNotifications.ts`)
4. Recalculate every Sunday at a background check (or whenever InsightsScreen opens)
5. User can disable: add `smartNudgesEnabled` to user preferences (AsyncStorage or Supabase profile)

**UI in InsightsScreen:**

- "Your Timing" mini-card showing detected patterns as clock icons + text:
  - "📍 Peak: 9–11pm (62% of exercises)"
  - "📅 Hardest day: Monday (avg 7.2)"
- Shown only when a pattern is detected with confidence >= 0.6

**Acceptance criteria:**

- [ ] Time-of-day pattern detected correctly from entry timestamps
- [ ] Day-of-week pattern detected
- [ ] Notification scheduled 1 hour before peak (verified in expo-notifications logs)
- [ ] Notification content includes best exercise name and duration
- [ ] Pattern hidden when < 5 entries or confidence < 0.6
- [ ] User can disable nudges

---

## Track B: Pattern Detection (Requires Gemini)

### ✅ TASK-027 — Trigger Clusters hook + card

**Files to create:**

- `src/hooks/insights/useTriggerClusters.ts`
- `src/components/insights/TriggerClusterCard.tsx`

**Files to modify:**

- `src/screens/InsightsScreen/InsightsScreen.tsx` (add card)

**Logic:**

1. Extract from completed entries (last 30 days): `{ situation, completedHour, selectedDistortions, selectedEmotions, exerciseType, preDelta }`
2. Minimum: 8 entries with situation text to trigger analysis
3. Build Gemini prompt:

   ```
   You are a CBT therapist reviewing a client's exercise journal.
   Categorize these situations into 3-5 trigger themes
   (e.g., "work authority", "social judgment", "health worry", "financial stress").

   Situations:
   1. "[situation text]" (hour: 21, distortions: mind_reading, catastrophizing)
   2. "[situation text]" (hour: 14, distortions: personalizing)
   ...

   Return JSON array: [{ theme: string, entries: number[] }]
   ```

4. For each cluster returned:
   - Count entries in cluster
   - Extract peak hours from those entries
   - Get top distortions from those entries
   - Get top emotions from those entries
   - Cross-reference with `usePersonalEffectiveness` → find best exercise FOR entries in that cluster
5. Cache: `staleTime: 24h`, `queryKey: ['trigger_clusters', userId, entryCount]`

**TriggerClusterCard UI:**

- Title: "Your Pattern"
- For each cluster (max 3 shown):
  - Theme name as bold text
  - Count badge: "7/12 exercises"
  - Top distortion + top emotion as small chips below
  - Peak time if detected
- Bottom: 1-2 sentence AI-generated summary connecting them
- Free tier: show top cluster name only. Pro: full detail.

**Acceptance criteria:**

- [ ] Gemini prompt returns valid JSON clusters
- [ ] Each cluster has count, peak hours, distortions, emotions, best exercise
- [ ] Card renders max 3 clusters with correct data
- [ ] Cached for 24h — no re-call on every screen open
- [ ] Empty state: "8 more exercises to detect patterns"
- [ ] Pro gate on full cluster detail

---

### ✅ TASK-028 — Belief Decay Curve hook + card

**Files to create:**

- `src/hooks/insights/useBeliefDecay.ts`
- `src/utils/insights/beliefClustering.ts`
- `src/components/insights/BeliefDecayCard.tsx`

**Files to modify:**

- `src/screens/InsightsScreen/InsightsScreen.tsx` (add card, pro-gated)

**Logic in `beliefClustering.ts`:**

1. Extract all entries with `automaticThought` text + `intensity` + `postIntensity` + `completed_at`
2. Minimum: 5 entries with thought text
3. Build Gemini prompt for clustering:

   ```
   Given these automatic thoughts from a CBT journal (one per session),
   group them by underlying core belief. Thoughts that express the same
   fear/assumption belong together even if worded differently.

   Thoughts:
   1. "I'm going to get fired" (Jun 1, intensity: 85%)
   2. "My boss hates my work" (Jun 3, intensity: 78%)
   3. "I'll embarrass myself at the party" (Jun 5, intensity: 70%)
   ...

   Return JSON: [{ coreBeliefName: string, thoughtIndices: number[] }]
   ```

4. For each cluster with 3+ entries:
   - Sort by date
   - Extract `(date, preIntensity, postIntensity)` series
   - Compute decay: `(first.preIntensity - last.postIntensity) / first.preIntensity * 100`
   - Classify: decay > 20% = "weakening", decay < -10% = "strengthening" (stuck), else "stable"

**BeliefDecayCard UI:**

- Title: "Belief Tracker" + PRO badge
- For each cluster (max 2 shown):
  - Core belief name in quotes: "I'm not good enough"
  - Mini dot-chart: 3-5 dots showing preIntensity over time, connected by a line
  - Decay badge: "Lost 53% of its grip ↓" in sage green
  - If stuck: "This belief is persistent. Try a different approach?" in soft amber
- Tappable → detail showing all thought variants and full timeline
- Locked state for free users: "Unlock Belief Tracker to see which thoughts are losing power"

**Acceptance criteria:**

- [ ] Gemini groups thoughts into valid clusters
- [ ] Decay percentage computed correctly (first pre vs last post)
- [ ] Mini dot-chart renders with correct values at correct positions
- [ ] "Stuck" beliefs flagged with encouraging (not alarming) message + exercise suggestion
- [ ] Pro gate works — free users see locked card
- [ ] Cache: staleTime 24h, recomputes after 3+ new entries

---

## Track C: Deep Insight (Premium — Requires Gemini)

### ✅ TASK-029 — Therapist's Notebook hook + card

**Files to create:**

- `src/hooks/insights/useTherapistNotebook.ts`
- `src/components/insights/TherapistNotebookCard.tsx`

**Files to modify:**

- `src/screens/InsightsScreen/InsightsScreen.tsx` (add card, pro-gated)

**Logic:**

1. Gather last 4 weeks of entries (minimum 5 with thought text to generate)
2. Build structured Gemini prompt:

   ```
   You are a CBT therapist reviewing a client's exercise journal for the past month.

   Sessions:
   - Jun 1: Thought Reframing
     Situation: "[text]"
     Automatic thought: "[text]" (intensity: 85% → 40% after)
     Distortions: catastrophizing, mind_reading
     Evidence against: ["boss gave me a raise", "colleague asked for my help"]
     Balanced thought: "[text]"

   - Jun 3: Decatastrophizing
     Fear: "[text]" (anxiety: 8 → 4)
     Coping plan: "[text]"

   ... [all entries]

   As a therapist, provide:
   1. coreBeliefIdentified: The single core belief driving most of these patterns
   2. manifestations: How it shows up (list 2-3 situations + which distortion)
   3. whatIsWorking: Which techniques/evidence have been most effective
   4. bestEvidence: Quote the single strongest evidence-against text the client has generated
   5. suggestion: One specific, actionable suggestion for next week

   Return as JSON matching the schema.
   ```

3. Response schema:
   ```typescript
   interface TherapistInsight {
     coreBeliefIdentified: string;
     manifestations: Array<{
       situation: string;
       distortion: string;
       exerciseType: string;
     }>;
     whatIsWorking: string;
     bestEvidence: string;
     suggestion: string;
   }
   ```
4. Cache: `queryKey: ['therapist_notebook', userId, isoWeekNumber]`, `staleTime: 7 days`
5. Only regenerate when new week AND new entries since last generation

**Evidence-to-Coping-Card Bridge:**

- When `bestEvidence` is non-empty, auto-create a draft coping card via `useCopingCards().saveCard()`:
  ```typescript
  if (insight.bestEvidence && !alreadySaved) {
    await saveCard({
      exercise_type: "thought_reframing", // or whichever produced it
      reframe_text: insight.bestEvidence,
      reframe_label: "Evidence from your Notebook",
    });
  }
  ```
- Show in the UI: "💡 I found powerful evidence in your journal. [Saved to Coping Cards ✓]"

**TherapistNotebookCard UI:**

- Title: "Therapist's Notebook" + 📓 + PRO badge
- Collapsed: "Weekly synthesis available — [Read full analysis →]"
- Expanded:
  - **Core belief** in bold quotes
  - **Manifestations** as 2-3 bullet points with distortion chips
  - **What's working** paragraph
  - **Suggestion** in a sage action card
  - **Evidence bridge** — saved coping card confirmation
- Disclaimer at bottom: "AI-detected patterns from your exercises. Not a clinical assessment."
- Locked state for free: "Your therapist's notebook is ready. Upgrade to read your weekly analysis."

**Acceptance criteria:**

- [ ] Gemini returns structured insight matching schema
- [ ] Card renders all sections correctly when expanded
- [ ] Evidence auto-saved to coping cards (no duplicate saves)
- [ ] Cached per week — one Gemini call per week max
- [ ] Pro gate works — free users see locked teaser
- [ ] Disclaimer always visible
- [ ] Minimum 5 entries required — otherwise shows "X more exercises until your first insight"

---

## Track D: Wiring & Polish

### ✅ TASK-030 — Update `useExerciseRecommendation` to use Personal Effectiveness

**File to modify:**

- `src/hooks/insights/useExerciseRecommendation.ts`

**What:** The existing heuristic hook has 4 hardcoded rules. Replace the recommendation logic to use `usePersonalEffectiveness` as the primary signal, falling back to the existing heuristics when effectiveness data is insufficient.

**New priority order:**

1. If PersonalEffectiveness has data → recommend `bestOverall` or `bestForCategory` matching user's most recent emotion
2. If thought_catcher count >= 3 AND thought_reframing count == 0 → "Go deeper"
3. If no mindfulness in 7 days → suggest 1-min breathing
4. If anxiety avg pre >= 7 → suggest grounding
5. Least-practiced category fallback

**Also add:**

- Integration with `useTemporalPatterns` — if we're within 1 hour of a detected peak, boost the recommendation for that pattern's `bestExercise`

**Acceptance criteria:**

- [ ] With 5+ entries, recommendation comes from effectiveness data (not hardcoded)
- [ ] Near temporal peak, recommendation shifts to pattern-specific exercise
- [ ] Still falls back to heuristics gracefully when < 5 entries

---

### ✅ TASK-030B — AI Narrative Synthesis ("What This Means For You")

**Files to create:**

- `src/hooks/insights/useInsightNarrative.ts`
- `src/components/insights/InsightNarrativeCard.tsx`

**Files to modify:**

- `src/screens/InsightsScreen/InsightsScreen.tsx` (add as top card below StatsRow)

**What:** A single Gemini call that takes ALL computed outputs from TASK-024/025/026/027 and generates one connected 3-4 sentence paragraph that synthesizes them into a narrative the user can feel.

**Why:** Numbers alone don't create an "aha" moment. "−4.2 avg" is data. "When your anxiety is about work authority figures, Decatastrophizing cuts it in half — and you're getting better at it every week" is intelligence.

**Input to Gemini (structured, not raw):**

```typescript
interface NarrativeInput {
  bestExercise: { type: string; avgDrop: number; category: string } | null;
  skillTrends: Array<{
    skill: string;
    trend: "improving" | "stable" | "declining";
    rate: number;
  }>;
  temporalPeak: { window: string; avgIntensity: number } | null;
  topTriggerTheme: string | null;
  topDistortion: string | null;
  relapseDetected: boolean;
  beliefDecay: { thought: string; decayPct: number } | null;
}
```

**Gemini prompt:**

```
You are a warm, insightful CBT companion. Given this user's exercise data summary,
write 3-4 sentences that connect the patterns into a meaningful insight. Be specific
(use their actual numbers), warm (not clinical), and actionable (end with what to do).

Data:
- Best technique: [type] (drops intensity by [X] per session)
- Skill trend: [category] is [improving/stable/declining] at [rate]%/week
- Peak time: [window] with avg intensity [X]
- Top trigger: [theme]
- Top distortion: [distortion]
- Relapse: [yes/no]
- Belief changing: "[thought]" has lost [X]% power

Write as direct address ("you"), max 4 sentences, no bullet points.
```

**Example output:**

> "Your anxiety peaks in the evenings around 9pm, usually tied to work authority worries. Decatastrophizing is your sharpest tool — it cuts anxiety by 4.2 points on average, which is 2x more effective than breathing alone for this pattern. Your reframing skill is getting stronger at 18% per week, meaning thoughts that used to feel 62% true now drop to 35%. Keep showing up in the evenings — that's where your biggest growth is happening."

**Cadence:** Regenerate weekly OR when underlying data shifts significantly (new trigger cluster, relapse detected, belief decay milestone). `staleTime: 7 days`.

**Fallback:** If Gemini fails or user has < 5 entries, card is hidden. The computed cards (TASK-024/025/026) always render standalone regardless of narrative availability.

**InsightNarrativeCard UI:**

- Top of InsightsScreen (below StatsRow, above everything else)
- Sage-50 background, rounded-2xl, p-5
- Small "✨ Your Insight" header
- 3-4 sentence paragraph in 15px body text
- "Updated [day]" timestamp in muted text at bottom
- No pro gate — this is the hook that makes free users want more

**Acceptance criteria:**

- [ ] Takes computed data from hooks, builds structured input (no raw entries sent to AI)
- [ ] Gemini returns <4 sentences, specific and warm
- [ ] Card hidden when data insufficient or AI fails
- [ ] Cached for 7 days — one call per week
- [ ] Always renders below StatsRow, above other cards
- [ ] References actual numbers from user's data (not generic)

---

### ✅ TASK-031 — Assemble Intelligence cards into InsightsScreen

**File to modify:**

- `src/screens/InsightsScreen/InsightsScreen.tsx`

**What:** Add all new cards to the InsightsScreen in the correct order. All cards already handle their own loading/empty states, so this is pure layout wiring.

**Card order (top to bottom):**

1. `Header` + `TimeRangeSelector` (existing)
2. `StatsRow` (existing)
3. **`InsightNarrativeCard`** (new — TASK-030B — THE hook, top of screen)
4. `WeeklySummaryCard` (existing)
5. **`SkillProgressionCard`** (new — TASK-025)
6. **`PersonalEffectivenessCard`** (new — TASK-024)
7. **`TriggerClusterCard`** (new — TASK-027)
8. **`BeliefDecayCard`** (new — TASK-028, pro-gated)
9. **`TherapistNotebookCard`** (new — TASK-029, pro-gated)
10. `ThoughtPatternsCard` (existing)
11. `ActivityHeatmap` (existing)
12. Category cards (existing)

**Also add:** "Smart nudges" small toggle row between StatsRow and WeeklySummaryCard — shows detected time pattern + enable/disable.

**Acceptance criteria:**

- [ ] All cards render in correct order
- [ ] Pro-gated cards show locked state for free users
- [ ] No layout shifts — cards hide cleanly when no data
- [ ] Screen doesn't crash when all hooks return empty

---

## Implementation Order & Dependencies

```
TASK-024 (Personal Effectiveness) ─────┐
                                        ├──► TASK-030 (update recommendations)
TASK-025 (Skill Progression) ──────────┤
                                        ├──► TASK-030B (AI narrative — reads all computed data)
TASK-026 (Temporal Patterns) ──────────┤
                                        ├──► TASK-031 (assemble InsightsScreen)
TASK-027 (Trigger Clusters) ───────────┤  ← requires TASK-024 for cross-ref
                                        │
TASK-028 (Belief Decay) ───────────────┤
                                        │
TASK-029 (Therapist's Notebook) ───────┘  ← requires TASK-028 for belief data
                                              + uses useCopingCards (Phase 2)
```

**Suggested build order:**

1. **TASK-024** — Personal Effectiveness (foundation for everything else)
2. **TASK-025** — Skill Progression (uses same data layer, adds relapse detection)
3. **TASK-026** — Temporal Patterns (independent, enables proactive nudges)
4. **TASK-030** — Update recommendations (wires TASK-024 + TASK-026 together)
5. **TASK-027** — Trigger Clusters (first Gemini feature, cross-refs TASK-024)
6. **TASK-028** — Belief Decay (second Gemini feature)
7. **TASK-030B** — AI Narrative Synthesis (takes outputs from 024+025+026+027, generates connected paragraph)
8. **TASK-029** — Therapist's Notebook (capstone — uses everything)
9. **TASK-031** — Assemble all cards into InsightsScreen (final wiring)

---

## Effort Estimates

| Task      | Feature                     | AI Required | Effort | New Files | Modified Files |
| --------- | --------------------------- | ----------- | ------ | --------- | -------------- |
| TASK-024  | Personal Effectiveness      | No          | Small  | 3         | 2              |
| TASK-025  | Skill Progression + Relapse | No          | Medium | 2         | 1              |
| TASK-026  | Temporal Patterns + Nudges  | No          | Medium | 2         | 2              |
| TASK-027  | Trigger Clusters            | Gemini      | Medium | 2         | 1              |
| TASK-028  | Belief Decay                | Gemini      | Medium | 3         | 1              |
| TASK-029  | Therapist's Notebook        | Gemini      | Medium | 2         | 1              |
| TASK-030  | Update Recommendations      | No          | Small  | 0         | 1              |
| TASK-030B | AI Narrative Synthesis      | Gemini      | Small  | 2         | 1              |
| TASK-031  | Assemble InsightsScreen     | No          | Small  | 0         | 1              |

**Total: 9 tasks, ~16 new files, ~10 modified files, 6 weeks.**

---

## Out of Scope

- New exercises (Behavioral Activation, Safety Plan) — separate track
- Chart library additions — all visualizations use plain `View` width % bars and dot arrays
- Supabase Edge Functions for AI — Gemini called client-side via existing `@google/genai` pattern
- ML/embeddings — clustering done via Gemini structured output, not local embeddings

---

_Tasks reference: `docs/prd-intelligence-v2.md` § 4–6_
