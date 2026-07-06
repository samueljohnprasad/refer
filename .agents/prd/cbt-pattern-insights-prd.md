# PRD: Pattern Insights Engine

> **Version:** 2.0 | **Date:** 2026-05-22  
> **Companion to:** cbt-content-guide.md, mental-health-journey-map-prd.md

---

## 1. Problem

Users complete CBT, anxiety, mindfulness, and overthinking exercises but receive no feedback on their patterns over time. Each exercise exists in isolation. Without visible progress:

- Users can't see what's working (no motivation to continue)
- Users can't identify their most common traps (no self-awareness growth)
- The app can't recommend the RIGHT next exercise (everything feels generic)
- Retention drops because there's no "aha moment" loop

## 2. Vision

Insights is not a tab — it's an **engine that surfaces the right data at the right moment across the entire app**. The deep-dive screen exists for curious users, but the primary value is delivered where users already are: the home screen, post-exercise flow, exercise picker, and journey reports.

```
DO exercise → DATA collected → PATTERNS detected → INSIGHT surfaced → BETTER recommendation → DO targeted exercise
```

## 3. Architecture

```
              usePracticeInsights() — shared data hook
                         │
         ┌───────────────┼──────────────────────┐
         │               │                      │
         ▼               ▼                      ▼
   Home Nudge      Post-Exercise         Smart Recommendations
  (daily card)    (completion stat)     (exercise picker suggestions)
         │               │                      │
         └───────────────┼──────────────────────┘
                         │
                         ▼
              Insights Deep-Dive Tab
              (full charts, power users)
                         │
                         ▼
               Weekly Summary Push
              (notification + card)
```

---

## 4. Data Layer

### 4.1 Source Tables

| Table                       | Category | Key Fields                                                                                 |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `thought_reframing_entries` | CBT      | emotions[] (initial/final intensity), cognitive_distortions[], situation, balanced_thought |
| `thought_catcher_entries`   | CBT      | intensity (1-10), situation, is_true, status                                               |
| `exercise_entries`          | All      | exercise_type, response (JSON), completed_at, step_timings                                 |

### 4.2 Exercise Types by Category

| Category         | Types                                                                                | Trackable Metric                                                 |
| ---------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **CBT Core**     | thought_catcher, thought_reframing, abc_analysis, gratitude_reframe                  | Distortion frequency, emotion shift, reframe success             |
| **Anxiety**      | worry_time, fear_ladder, decatastrophizing, worry_decision_tree                      | Worry count trend, anxiety before/after, technique effectiveness |
| **Mindfulness**  | box_breathing, breathing_478, mindful_breathing_1min, body_scan_pmr, grounding_54321 | Session consistency, calm before/after, total minutes            |
| **Overthinking** | recognizing_rumination, detached_mindfulness, attention_training                     | Rumination triggers, detachment usage, attention scores          |

### 4.3 Core Data Hook

**`usePracticeInsights(timeRange: '7d' | '30d' | 'all')`**

```typescript
interface PracticeInsights {
  // ─── Universal (all categories) ───────────────────
  totalExercises: number;
  currentStreak: number;
  activityHeatmap: { date: string; count: number }[];
  categoryBreakdown: {
    category: string;
    count: number;
    trend: "up" | "down" | "stable";
  }[];
  mostPracticedCategory: string;

  // ─── CBT-Specific ─────────────────────────────────
  cbt: {
    distortionFrequency: {
      key: CognitiveDistortionKey;
      label: string;
      count: number;
    }[];
    topDistortion: { key: CognitiveDistortionKey; count: number } | null;
    avgEmotionShift: number;
    emotionShiftTrend: { week: string; avgShift: number }[];
    emotionRadar: { emotion: EmotionName; count: number }[];
    reframeSuccessRate: number;
  };

  // ─── Anxiety-Specific ─────────────────────────────
  anxiety: {
    avgAnxietyReduction: number;
    topTechnique: { type: string; avgReduction: number } | null;
    worryCountTrend: { week: string; count: number }[];
  };

  // ─── Mindfulness-Specific ─────────────────────────
  mindfulness: {
    totalMinutes: number;
    sessionsPerWeek: number;
    avgCalmImprovement: number;
    preferredTime: "morning" | "afternoon" | "evening" | "night" | null;
    consistencyRate: number; // % of target days practiced
  };

  // ─── Overthinking-Specific ────────────────────────
  overthinking: {
    ruminationTriggers: { trigger: string; count: number }[];
    detachmentEffectiveness: number;
  };

  // ─── Derived (for surfaces) ───────────────────────
  todayNudge: InsightNudge | null;
  exerciseRecommendation: ExerciseRecommendation | null;

  isLoading: boolean;
}

interface InsightNudge {
  message: string; // "You've caught 3 catastrophizing thoughts this week"
  detail: string; // "That's 2 fewer than last week"
  tone: "encouraging" | "curious" | "celebrating";
  ctaLabel?: string; // "See patterns"
  ctaRoute?: string; // "/tabs/(tabs)/insights"
}

interface ExerciseRecommendation {
  exerciseType: string;
  reason: string; // "You've been catastrophizing — this targets that"
  priority: number;
}
```

### 4.4 Nudge Generation Logic

The hook computes `todayNudge` using these rules (priority order):

1. **Milestone:** "You just completed your 10th/25th/50th exercise!" (celebration)
2. **Improvement:** Emotion shift improved vs. last period → "Your reframes are getting more effective"
3. **Pattern alert:** One distortion is 3x+ more common than others → "Catastrophizing is your #1 trap — name it to tame it"
4. **Streak:** Streak ≥ 7 → "7-day streak! Consistency is the #1 predictor of progress"
5. **Comeback:** No exercise in 3+ days → "Your last exercise reduced anxiety by 3 points. Ready for another?"
6. **Category gap:** One category has 0 entries → "You haven't tried mindfulness yet — 2 minutes of breathing can shift your whole day"

Only show 1 nudge per day. Rotate if multiple qualify.

---

## 5. Surface Points

### 5.1 Home Screen Nudge Card

**Location:** Home scroll, between mood logger and exercise section  
**Frequency:** 1 per day, rotates  
**Visibility:** Always visible (not premium-gated — this drives engagement)

```
┌─────────────────────────────────────────────┐
│ 💡 Your Pattern                             │
│                                             │
│ "You've caught 3 catastrophizing thoughts   │
│  this week — that's 2 fewer than last week. │
│  You're getting better at spotting them."   │
│                                             │
│                         [See your patterns →]│
└─────────────────────────────────────────────┘
```

**Rules:**

- Hide if user has < 3 total exercises (show nothing, not an empty state here)
- Tap navigates to Insights deep-dive
- Card uses `happy-brand-card` styling (existing utility)
- Tone is always warm/encouraging, never clinical

### 5.2 Post-Exercise Completion Stat

**Location:** Exercise completion/summary screen, below the "Well done" message  
**Trigger:** After every completed exercise

```
┌─────────────────────────────────────────────┐
│ ✓ Complete                        +15 XP    │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 📊 "That's your 4th reframe this week. │ │
│ │     Your avg emotion drop is now -2.8   │ │
│ │     — up from -1.4 last month."         │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│        [View All Insights]                  │
└─────────────────────────────────────────────┘
```

**Per-category stat shown:**

| Category        | Stat                                                       |
| --------------- | ---------------------------------------------------------- |
| CBT (reframing) | Emotion shift for this session vs. average                 |
| CBT (catcher)   | "X times you caught [top distortion] this month"           |
| Anxiety         | "Anxiety went from X to Y — [technique] works for you"     |
| Mindfulness     | "X total minutes this week. Y% calmer on average."         |
| Overthinking    | "You've practiced detachment X times — building the habit" |

### 5.3 Smart Exercise Recommendations

**Location:** Exercise picker screen, above the full exercise list  
**Heading:** "Suggested for you"

```
┌─────────────────────────────────────────────┐
│ Suggested for you                           │
│                                             │
│ ┌────────────────────────────────────┐      │
│ │ 🎯 Decatastrophizing              │      │
│ │ Your top trap is catastrophizing — │      │
│ │ this exercise directly targets it. │      │
│ │                           [Start →]│      │
│ └────────────────────────────────────┘      │
│                                             │
│ All Exercises                               │
│ ├── CBT Core (4)                            │
│ ├── Anxiety (4)                             │
│ ...                                         │
└─────────────────────────────────────────────┘
```

**Recommendation logic:**

1. If top distortion is catastrophizing → suggest decatastrophizing
2. If anxiety exercises show high before-scores → suggest grounding or breathing
3. If user hasn't done mindfulness in 7+ days → suggest a 1-min breathing session
4. If user only does catchers, never reframing → suggest reframing with "Go deeper on your thoughts"
5. If no pattern detected → suggest least-practiced category

Only show 1 recommendation. If user has < 5 total exercises, hide this section.

### 5.4 Weekly Summary (Push Notification + Card)

**Trigger:** Every Sunday at 7pm (configurable via notification preferences)  
**Notification text:** "Your week: X exercises, [top stat]. See your report →"

**Opens:** A modal/bottom sheet with a swipeable 3-card summary:

**Card 1: Numbers**

```
This Week
━━━━━━━━━━━━━━━━━━
Exercises:     6  (↑2 vs last week)
Streak:        12 days
Top category:  CBT (4 sessions)
```

**Card 2: Key Insight**

```
Your Pattern
━━━━━━━━━━━━━━━━━━
"Mind reading was your most common
trap this week (3x). When you
challenged it, emotions dropped
an average of 3.2 points."
```

**Card 3: Next Week**

```
Suggestion
━━━━━━━━━━━━━━━━━━
"Try the Evidence Court exercise
next time you catch yourself
mind-reading. It's designed for
exactly that trap."

[Start Evidence Court]
```

### 5.5 Journey Report Integration

**Location:** End of each journey section (existing "AI Report" nodes)  
**Enhancement:** Feed real user pattern data into the report generation prompt

Current behavior: Generic completion summary  
New behavior: Personalized summary using actual distortion counts, emotion shifts, and exercise data from that section's time period.

---

## 6. Insights Deep-Dive Tab

**Location:** `app/tabs/(tabs)/insights/index.tsx`  
**Role:** Power-user destination for exploring full patterns. Linked from nudge cards and post-exercise stats.

### 6.1 Screen Structure

```
┌─────────────────────────────────────────────┐
│  Your Practice             [7d | 30d | All] │
├─────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  47  │ │ -2.4 │ │ 12d  │ │ 72%  │       │
│  │exerc.│ │shift │ │streak│ │success│       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
├─────────────────────────────────────────────┤
│  Activity                                   │
│  ░░█░█░██░█░░█░█░░░█░██░█░ (heatmap)       │
├─────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐         │
│  │ CBT Patterns │  │ Anxiety      │         │
│  │ 18 sessions  │  │ 12 sessions  │         │
│  │ Top: Catast. │  │ ↓1.8 avg     │         │
│  │   [Details →]│  │   [Details →]│         │
│  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐         │
│  │ Mindfulness  │  │ Overthinking │         │
│  │ 11 sessions  │  │ 6 sessions   │         │
│  │ 42 min total │  │ ↓ rumination │         │
│  │   [Details →]│  │   [Details →]│         │
│  └──────────────┘  └──────────────┘         │
├─────────────────────────────────────────────┤
│  🔒 AI Thought Themes (Premium)             │
│  "Unlock to see AI-detected patterns"       │
└─────────────────────────────────────────────┘
```

### 6.2 Category Deep-Dive (tapped from category card)

Each navigates to a dedicated screen with category-specific charts:

**CBT Deep-Dive:**

- Distortion frequency (horizontal bars)
- Emotion shift trend (line chart)
- Emotion radar (polar chart)
- Reframe success rate (donut)

**Anxiety Deep-Dive:**

- Anxiety level trend (before/after line chart)
- Technique effectiveness comparison (bar chart)
- Worry themes (AI-generated, premium)

**Mindfulness Deep-Dive:**

- Sessions per week (bar chart)
- Calm improvement trend (line chart)
- Total minutes (cumulative area chart)
- Practice time distribution (morning/evening)

**Overthinking Deep-Dive:**

- Rumination trigger frequency (horizontal bars)
- Attention training scores over time
- Detachment technique usage

### 6.3 Empty States

| Condition                  | Display                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------- |
| < 3 total exercises        | Full-screen empty state: "Complete a few exercises to unlock your patterns" + CTA to exercise picker |
| Category has 0 entries     | Card shows "Not started yet" with muted styling + "Try it" CTA                                       |
| Only catchers, no reframes | Show catcher stats + prompt: "Ready to go deeper? Try reframing"                                     |

---

## 7. Premium Gating

| Feature                             | Free         | Premium         |
| ----------------------------------- | ------------ | --------------- |
| Home nudge card                     | ✓            | ✓               |
| Post-exercise stat                  | ✓            | ✓               |
| Exercise recommendation             | ✓            | ✓               |
| Weekly summary notification         | ✓            | ✓               |
| Insights overview (stats + heatmap) | ✓            | ✓               |
| Category cards (summary)            | ✓            | ✓               |
| Category deep-dive charts           | Top 3 items  | Full data       |
| AI Thought Themes                   | 🔒           | ✓               |
| Emotion shift trend (all time)      | 🔒 (7d only) | ✓               |
| Weekly summary detail card          | Basic        | Full AI insight |

**Philosophy:** Free users see enough to know insights exist and feel motivated. Premium unlocks the full picture.

---

## 8. Implementation Phases

### Phase 1: Data Layer + Post-Exercise Stat (1 week)

- Build `usePracticeInsights` hook (queries + aggregation)
- Add post-exercise micro-stat to exercise completion screen
- This ships value immediately with zero new screens

### Phase 2: Home Nudge + Recommendation (1 week)

- Add nudge card to home screen
- Add recommendation section to exercise picker
- Nudge generation logic

### Phase 3: Insights Overview Screen (1 week)

- Replace insights redirect with overview screen
- Summary stats + heatmap + category cards
- Empty states

### Phase 4: Category Deep-Dives (1-2 weeks)

- CBT deep-dive (distortion chart, emotion shift, radar, success rate)
- Anxiety deep-dive
- Mindfulness deep-dive
- Overthinking deep-dive

### Phase 5: Weekly Summary + AI (1 week)

- Weekly push notification
- Summary modal/card
- AI thought themes (premium)
- Journey report integration

---

## 9. Existing Code to Reuse

| Component/Pattern         | Path                                                  | Reuse For                 |
| ------------------------- | ----------------------------------------------------- | ------------------------- |
| EmotionRadarChart         | `src/components/charts/EmotionRadarChart.tsx`         | CBT emotion radar         |
| JournalingHeatmap         | `src/components/charts/JournalingHeatmap.tsx`         | Activity heatmap          |
| EmotionalGrowthTrajectory | `src/components/charts/EmotionalGrowthTrajectory.tsx` | Trend lines               |
| CognitivePatternFlow      | `src/components/charts/CognitivePatternFlow.tsx`      | Distortion viz reference  |
| Victory-native            | Already installed                                     | All charts                |
| WeeklySummary type        | `src/network/genAi.ts`                                | AI report structure       |
| useCBTHistory             | `src/screens/ExercisesScreen/hooks/useCBTHistory.ts`  | Multi-table query pattern |
| Premium gating            | Existing chart components                             | Premium lock pattern      |
| CARD_SHADOW               | `constants/shadows.ts`                                | Card elevation            |
| happy-brand-card          | `global.css`                                          | Nudge card styling        |
| PressableScale            | `src/components/ui/PressableScale.tsx`                | Tappable category cards   |

---

## 10. Success Metrics

| Metric                                      | Target                               | Why                               |
| ------------------------------------------- | ------------------------------------ | --------------------------------- |
| Insight tab visit rate                      | 40%+ of active users/week            | Proves discoverability via nudges |
| Post-insight exercise starts                | 20%+ tap "Start" from recommendation | Proves the loop works             |
| Exercise frequency (users who see insights) | +30% vs. control                     | Core engagement lift              |
| 30-day retention (insight-exposed)          | 2x vs. non-exposed                   | Long-term value proof             |
| Avg emotion shift (over time)               | Improving trend                      | Actual therapeutic efficacy       |
| Weekly summary open rate                    | 50%+ of pushes                       | Re-engagement effectiveness       |

---

## 11. Safety Considerations

- Insights should NEVER frame patterns negatively ("You're getting worse")
- Always use growth framing ("Here's what you're working on")
- If emotion shift is worsening: don't highlight it. Instead suggest a different approach
- Crisis language detection remains in exercise flow (separate from insights)
- Never show insights that could feel like a diagnosis
