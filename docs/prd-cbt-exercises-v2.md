# PRD: CBT Exercises V2 — Market Leader Upgrade

**Author:** Product & Engineering  
**Date:** June 4, 2026  
**Status:** Draft  
**Priority:** P0-P2 (phased rollout)

---

## 1. Problem Statement

Our app has 16 evidence-based CBT exercises — one of the most comprehensive libraries in the market. However, user engagement, warmth, and proof-of-progress are lagging behind top-rated competitors (Finch 4.9/5, Wysa 4.9/5).

**Core issues identified:**

- Exercises feel clinical, not compassionate (no emotional validation)
- Users can't see their progress visually (generic summaries)
- Design quality is inconsistent (ABC Analysis is polished; others are generic)
- Exercises exist in isolation (no journey, no linking, no adaptive recommendations)
- Key bugs exist (Worry Time reuses fieldKey, Fear Ladder ranking UX is broken)
- No crisis safety pathway
- No voice input for users in acute distress

**Goal:** Transform our exercises from "clinical tools" to "a warm companion that helps you grow" — while maintaining our clinical depth advantage over every competitor.

---

## 2. Current State Assessment

### Exercise Ratings (10-category, 1-10 scale)

| Exercise               | Score | Key Strength                              | Key Gap                                |
| ---------------------- | ----- | ----------------------------------------- | -------------------------------------- |
| ABC Analysis           | 8.0   | Custom Duolingo-style UI, AI beliefs      | No intro step, static suggestions      |
| Detached Mindfulness   | 8.0   | True metacognitive therapy, loop logic    | No psychoeducation on concept          |
| Worry Decision Tree    | 7.5   | Elegant branching                         | Shallow acceptance path                |
| Recognizing Rumination | 7.5   | Structure + 30s interrupt timer           | Interrupt isn't guided                 |
| Thought Reframing      | 7.0   | Deepest clinical protocol, AI at 3 points | Generic UI, long, overwrites intensity |
| Attention Training     | 7.0   | Faithful Wells ATT                        | 5 identical timers, no audio           |
| Decatastrophizing      | 6.6   | Probability + time perspective            | 3 timeframes crammed in 1 field        |
| Worry Time             | 6.5   | Containment strategy                      | Bug: fieldKey reuse, no timer          |
| Fear Ladder            | 6.0   | Gold-standard exposure                    | Ranking UX broken, no persistence      |
| Gratitude Reframe      | 5.9   | Mood-specific prompts (AI)                | Only 3 fixed options, no savor step    |
| Thought Catcher        | 5.8   | Quick, low barrier                        | No AI, no emotion ID, no distortions   |

### Rating Categories Used:

1. Clinical Accuracy
2. User Flow
3. Emotional Validation
4. Onboarding/Guidance
5. Personalization
6. AI Integration
7. Pre/Post Measurement
8. Visual/UX Polish
9. Accessibility (usable during distress)
10. Therapeutic Depth

---

## 3. Competitive Positioning

### Where We Win (Already)

- **16 exercises** vs. competitors' 5-10
- **Metacognitive therapy** (Wells ATT, Detached Mindfulness) — unique in market
- **Exposure therapy** (Fear Ladder) — only shared with MindShift
- **AI-enhanced CBT** — Gemini suggests balanced thoughts, distortions, beliefs
- **Pre/post measurement** on all exercises — enables measurement-based care

### Where We Lose

| Us                        | Finch (4.9/5, 705K reviews)   | Wysa (4.9/5, 24K reviews)              |
| ------------------------- | ----------------------------- | -------------------------------------- |
| Clinical, technique-first | Warm, companion-first         | Available, non-judgmental              |
| Generic summaries         | Visual growth (bird)          | "Never tells me to change the subject" |
| No crisis pathway         | Panic first aid               | Always available at 3am                |
| Streak-based gamification | Positive-only (no punishment) | No gamification pressure               |

### Target Position

**"The deepest CBT toolkit with the warmth of a companion."**

No competitor has both clinical depth AND emotional warmth. We can own this space.

---

## 4. Success Metrics

| Metric                            | Current (estimated) | Target | Timeline |
| --------------------------------- | ------------------- | ------ | -------- |
| Exercise completion rate          | ~60%                | 80%    | 3 months |
| Return to exercise within 7 days  | ~25%                | 50%    | 3 months |
| Average pre/post intensity drop   | ~20%                | 30%    | 6 months |
| App store rating                  | N/A (pre-launch)    | 4.7+   | 6 months |
| Exercises completed per user/week | ~2                  | 4      | 3 months |

---

## 5. Feature Specifications

### Phase 1: Foundation (P0) — "Make It Warm and Safe"

#### 5.1 Emotional Validation Layer

**What:** Add a warm, 1-sentence validation message that appears contextually during exercises — after the user's first vulnerable input.

**Where it appears:**

- After "The Situation" step in Thought Catcher/Reframing
- After "Your Worry" in Worry Time/Decision Tree
- After "The Fear" in Fear Ladder/Decatastrophizing
- After "The Loop" in Recognizing Rumination
- After "The Thought" in Detached Mindfulness

**Content examples (non-blocking, inline, subtle):**
| Trigger | Validation Message |
|---------|-------------------|
| User writes a situation | "That sounds like it was hard. Let's look at it together." |
| User describes a worry | "It makes sense this is weighing on you." |
| User describes a fear | "Fear can feel so overwhelming. You're brave for facing this." |
| User writes a ruminating thought | "Getting stuck in loops is exhausting. Let's find the exit." |
| User rates high intensity (>7) | "That's a really strong feeling. You don't have to carry it alone." |

**Implementation:**

- New component: `ValidationMessage` — appears as a soft sage card with fade-in animation
- Triggered by: step completion (when user taps Continue) OR intensity > 7 on slider
- Non-blocking: user doesn't need to dismiss it, it's part of the flow
- Duration: shown for 3 seconds with fade, or persistent as a soft card above next input

**Design:**

- Sage-50 background, rounded-2xl, 14px body text, sage-800 color
- Optional gentle icon (leaf, heart, or hand)
- Never more than 2 sentences
- Never clinical language in validation messages

---

#### 5.2 Crisis Safety Pathway

**What:** Detect crisis-related language in exercise text inputs and show a warm, non-alarmist support modal with resources.

**Detection approach:**

- Local-only keyword/phrase matching (no data leaves device)
- Two severity levels:
  - **High:** "kill myself", "end my life", "want to die", "suicide", "self-harm", "hurt myself", "no reason to live"
  - **Medium:** "no point in living", "everyone better off without me", "can't go on", "give up on everything", "don't want to be here"
- Context-aware: multi-word phrases with word boundaries (not single words)
- Runs on text submission (user taps Continue), not on every keystroke

**Modal behavior:**

- Full-screen blur overlay (using existing BlurModal pattern)
- Warm, validating tone — NOT clinical or alarming
- Content:
  - Empathetic header: "It sounds like you're going through something really difficult."
  - Validation: "You don't have to handle this alone. And you don't have to feel different to deserve support."
  - Resources:
    - 988 Suicide & Crisis Lifeline (tap to call/text)
    - Crisis Text Line (text HOME to 741741)
    - "Talk to someone you trust"
  - Quick grounding: "Take 3 slow breaths with me" (optional inline breathing)
  - Dismiss: "I'm okay, continue exercise" (not dismissive — respectful of autonomy)

**Principles:**

- Never block or delete the user's text
- Never force-exit the exercise
- Never use alarming language ("EMERGENCY", "DANGER")
- Appear alongside the exercise, not instead of it
- Severity affects urgency of presentation (high = immediate modal, medium = softer banner at top)

**Implementation:**

- `src/utils/crisisDetection.ts` — detection logic
- `src/components/CrisisSupportModal.tsx` — full-screen modal
- Integration point: `useExerciseFlow` hook (intercept `goNext`) or in `ExerciseFlowScreen`'s step transition

---

#### 5.3 Dynamic Summary with Before/After Visualization

**What:** Replace generic summary steps with rich, personalized completion screens showing progress.

**Current state:** All summaries use `createSummaryStep` which renders a flat list of key-value pairs with a generic title ("Thought Caught!", "Great work!").

**New summary design:**

```
┌─────────────────────────────────────┐
│         [Celebration emoji]          │
│                                      │
│     "Your mind shifted today"        │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  Before        →      After  │    │
│  │   ████████░░   →   ███░░░░░ │    │
│  │     8/10       →     3/10   │    │
│  │                              │    │
│  │  "62% reduction in intensity"│    │
│  └─────────────────────────────┘    │
│                                      │
│  [Personalized insight message]      │
│                                      │
│  ┌ Key takeaway ──────────────┐     │
│  │ Balanced thought / alt belief│     │
│  │ [Save as coping card]       │     │
│  └────────────────────────────┘     │
│                                      │
│  "Want to go deeper?"                │
│  [Suggested next exercise]           │
│                                      │
│        [✓ Complete]                  │
│        [Edit answers]                │
└─────────────────────────────────────┘
```

**Personalized insight messages (based on data):**
| Condition | Message |
|-----------|---------|
| Intensity dropped >50% | "That's a significant shift. Your rational mind just spoke louder than your anxiety." |
| Intensity dropped 20-50% | "Every small shift adds up. You're building a new pattern." |
| Intensity dropped <20% | "Sometimes change is gradual. Showing up is what matters most." |
| Intensity increased | "That's okay. Sometimes looking at thoughts closely makes them feel bigger first. It gets easier." |
| User identified catastrophizing | "You caught catastrophizing. That's a superpower — most people never notice it." |
| User completed exposure step | "You faced something hard today. That took real courage." |

**Exercise linking suggestions:**
| Just completed | Suggest next |
|----------------|-------------|
| Thought Catcher | "Go deeper → Thought Reframing" |
| Thought Reframing | "Practice detachment → Detached Mindfulness" |
| Decatastrophizing | "Build exposure → Fear Ladder" |
| Recognizing Rumination | "Train attention → Attention Training" |
| Worry Decision Tree (can't act) | "Practice acceptance → Detached Mindfulness" |
| Box Breathing | "Go longer → 4-7-8 Breathing or Body Scan" |

---

#### 5.4 Bug Fixes

**Worry Time — fieldKey reuse:**

- Steps `action_or_accept` and `reflection` both use `fieldKey: "reflection"`
- Fix: Add `actionOrAcceptStatement` field to `WorryTimeResponse` type and update step

**Thought Reframing — intensity overwrite:**

- `re_evaluate` step uses `fieldKey: "intensity"` which overwrites the initial intensity rating
- Fix: Add `postIntensity` field (like Thought Catcher has) for the re-evaluate step

---

### Phase 2: Polish (P1) — "Make It Beautiful and Smart"

#### 5.5 Elevate Thought Reframing UI

**What:** Redesign Thought Reframing with custom step components matching ABC Analysis quality.

**Key changes:**

- Custom `ThoughtReframingSteps.tsx` with Duolingo-style cards
- Distortion cards with emoji + 1-line explanation when selected
- Evidence for/against as a visual split-screen or two-column view
- Balanced thought with AI suggestions in styled cards (not generic AITextInputStep)
- Emotion chips with color coding

**Design reference:** ABC Analysis's `customSteps.tsx` pattern — custom per-step layouts with Header, SuggestionCards, helper tips, PrimaryButton.

---

#### 5.6 Psychoeducation Micro-Cards

**What:** Optional expandable "Why this helps" cards at key steps across all exercises.

**Design:**

- Collapsed: Small text link "Why this helps →" below subtitle
- Expanded: Sage-pill background card, 1-2 sentences, collapses on tap
- Never blocks progress; purely educational

**Content examples:**
| Exercise | Step | Micro-card content |
|----------|------|-------------------|
| Thought Reframing | Cognitive Distortions | "Naming your thinking traps makes them easier to spot next time. Like learning to recognize a magician's tricks." |
| Thought Reframing | Evidence Against | "Your brain's threat system ignores positive evidence. This step helps restore the full picture." |
| Decatastrophizing | Probability | "Anxiety inflates probability estimates. Explicitly rating likelihood activates your rational brain." |
| Decatastrophizing | Time Perspective | "Anxiety narrows time. Most feared events feel smaller after just one week." |
| Worry Decision Tree | Can You Act? | "80% of worries are about things we can't control. Sorting them is half the battle." |
| Fear Ladder | Exposure Plan | "Each time you face a fear safely, your brain updates its threat map. It gets easier." |

---

#### 5.7 Coping Card Deck

**What:** A screen where users can view all their saved balanced thoughts, alternative beliefs, and key insights from past exercises.

**How it works:**

1. In summary steps of reframe-producing exercises, add "Save as coping card" button
2. Cards are stored locally (new Supabase table or AsyncStorage)
3. New screen accessible from main navigation: "My Coping Cards"
4. Swipeable card deck with:
   - The balanced thought or alternative belief
   - Original thought it replaced
   - Date created
   - Which exercise produced it
5. Works fully offline
6. Users can star favorites, archive old ones, or manually add new cards

**Applicable exercises:**

- Thought Catcher (balanced thought)
- Thought Reframing (balanced thought)
- ABC Analysis (alternative belief)
- Decatastrophizing (coping plan + most likely outcome)
- Worry Decision Tree (action plan or acceptance statement)

---

#### 5.8 Voice Input for TextInputStep

**What:** Add microphone button to all TextInputStep instances for voice-to-text transcription.

**Implementation:**

- Uses existing `src/network/transcribeAudio.ts` service
- Microphone icon button in TextInput row (right side)
- Tap to start recording, tap again to stop
- Transcribed text fills the input field
- User can edit before proceeding
- Works for TextInputStep and MultiTextInputStep

**Why critical:** Users in acute distress (panic, severe anxiety, crying) physically cannot type effectively. Voice input removes the barrier between feeling and expressing.

---

#### 5.9 Fix Decatastrophizing Time Perspective

**What:** Split the single "time perspective" field into 3 separate, guided steps.

**Current:** One TextInputStep with placeholder "In a week: ... In a month: ... In a year: ..."

**New flow:**

```
Step 1: "In One Week"
  Subtitle: "How will this situation look in 7 days?"
  fieldKey: "perspective1Week"

Step 2: "In One Month"
  Subtitle: "What else will have happened by then?"
  fieldKey: "perspective1Month"

Step 3: "In One Year"
  Subtitle: "How much will this matter in the bigger picture?"
  fieldKey: "perspective1Year"
```

Each step should have a visual time indicator (calendar icon with the timeframe) and an AI suggestion option.

---

#### 5.10 Positive-Only Gamification Audit

**What:** Review current XP/streak/gem system and remove any punitive mechanics.

**Principles:**

- Never show "streak lost" or "streak broken" messaging
- Replace streak freeze (an admission the system punishes) with cumulative "days practiced" count
- Celebrate consistency without punishing inconsistency
- Welcome-back message after absence: "Good to see you. Pick up wherever feels right." (not "You lost your streak!")
- XP and levels remain (they're additive, not subtractive)

---

### Phase 3: Intelligence (P2) — "Make It Learn"

#### 5.11 Adaptive Exercise Recommendations

**What:** Use exercise history, mood patterns, and pre/post effectiveness data to suggest the most relevant exercise.

**Data sources:**

- Exercise completion history (which exercises, when, how often)
- Pre/post delta per exercise (which exercises work best for this user)
- Time of day patterns (when does the user typically exercise)
- Mood/emotion data from exercises (what emotions appear most often)

**Recommendation triggers:**

- On exercise selection screen: "Recommended for you" section at top
- After mood check-in: "Based on how you're feeling, try [X]"
- Push notification: "You usually feel anxious around 10pm. Box Breathing helped last time."

**Recommendation logic (simple heuristic first, ML later):**

```
If user's most common emotion = "anxious" AND last effective exercise = "decatastrophizing"
  → Suggest decatastrophizing

If user has completed Thought Catcher 3+ times AND never done Thought Reframing
  → Suggest "Ready to go deeper? Try Thought Reframing"

If last exercise intensity_drop < 10% for cognitive exercises
  → Suggest breathing/grounding (physiological approach instead)
```

---

#### 5.12 "Your Thinking Patterns" Dashboard

**What:** A screen showing aggregated insights from all exercise data.

**Displays:**

1. **Most common cognitive distortions** (from Thought Reframing data) — bar chart
2. **Emotion frequency** — which emotions appear most in exercises
3. **Average intensity reduction** per exercise type — shows what works
4. **Thinking themes over time** — what topics/situations trigger most exercises
5. **Progress indicators:**
   - Total exercises completed
   - Average intensity reduction (trending up?)
   - Most improved distortion (you catch catastrophizing 50% faster now)
   - Streak of consecutive weeks with 3+ exercises

**Data already collected:** All this data exists in exercise responses (emotions, distortions, pre/post intensity, situations). We just need to aggregate and visualize.

---

#### 5.13 Weekly AI Insights

**What:** An AI-generated weekly summary analyzing exercise patterns.

**Runs every Sunday (or after 3+ exercises in a week):**

**Example output:**

> "This week you completed 5 exercises. Here's what I noticed:
>
> **Pattern:** 3 of your automatic thoughts this week involved Mind Reading — assuming what others think about you.
>
> **Progress:** Your average belief intensity dropped from 72% to 34% after reframing. That's getting faster than last week (78% → 45%).
>
> **Insight:** Work situations triggered 4 of 5 exercises. Your coping plan for the team meeting actually happened — and it went better than expected.
>
> **Suggestion:** Since Mind Reading is your most common distortion, try this: before your next meeting, ask yourself 'What evidence do I actually have for what they're thinking?'"

**Implementation:** Use existing Gemini AI service (`src/network/genAi.ts`) with structured prompts using aggregated exercise data.

---

## 6. Exercises We Should Add

Based on competitive analysis and clinical gaps:

| Exercise                       | Category     | Rationale                                                                                                                               | Priority |
| ------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Behavioral Activation**      | CBT Core     | #1 evidence-based technique for depression/low motivation. Schedule valued activities. No competitor does this well in structured form. | P1       |
| **Values Clarification**       | Growth       | ACT foundation. Helps users understand WHY they want to change. Connects exercises to deeper meaning.                                   | P2       |
| **Problem-Solving Therapy**    | CBT Core     | Structured: define problem → brainstorm → evaluate → act → review. Effective for situational stress.                                    | P2       |
| **Cognitive Defusion Gallery** | Overthinking | Multiple ACT defusion techniques in one exercise: silly voice, repeat fast, put on a leaf, thank your mind.                             | P2       |
| **Safety Plan Builder**        | Crisis       | Personal crisis plan: warning signs, coping strategies, reasons to live, people to contact. Persists and is always accessible.          | P1       |
| **Sleep Anxiety Module**       | Anxiety      | Combines 4-7-8 + PMR + cognitive techniques specifically for bedtime anxiety. High user demand per competitor reviews.                  | P2       |
| **Anger Surfing**              | Emotion Reg  | Track anger intensity over time (wave metaphor), ride it out without acting.                                                            | P3       |

---

## 7. Implementation Plan

### Phase 1: Foundation (Weeks 1-3)

| Week   | Tasks                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------- |
| Week 1 | Crisis detection utility + Crisis Support Modal. Bug fixes (Worry Time fieldKey, Thought Reframing intensity overwrite).  |
| Week 2 | Emotional Validation component + integrate into all 16 exercises. Dynamic Summary component (before/after visualization). |
| Week 3 | Exercise linking in summaries. Positive-only gamification audit + fixes. QA and polish.                                   |

### Phase 2: Polish (Weeks 4-7)

| Week   | Tasks                                                                                       |
| ------ | ------------------------------------------------------------------------------------------- |
| Week 4 | Thought Reframing custom steps redesign (match ABC Analysis quality).                       |
| Week 5 | Psychoeducation micro-cards across all exercises. Decatastrophizing time perspective split. |
| Week 6 | Coping Card Deck (data model + save functionality + new screen).                            |
| Week 7 | Voice input for TextInputStep. Fear Ladder drag-to-rank. QA and polish.                     |

### Phase 3: Intelligence (Weeks 8-12)

| Week     | Tasks                                                            |
| -------- | ---------------------------------------------------------------- |
| Week 8-9 | Adaptive exercise recommendation engine + UI.                    |
| Week 10  | "Your Thinking Patterns" dashboard.                              |
| Week 11  | Weekly AI Insights feature.                                      |
| Week 12  | Safety Plan Builder exercise. Integration testing. Final polish. |

---

## 8. Technical Architecture

### New Files to Create

```
src/
├── utils/
│   └── crisisDetection.ts          # Local keyword detection
├── components/
│   ├── CrisisSupportModal.tsx       # Full-screen crisis modal
│   ├── ValidationMessage.tsx        # Inline emotional validation
│   ├── exercise/
│   │   ├── DynamicSummary.tsx       # Before/after summary component
│   │   ├── PsychoeducationCard.tsx  # Expandable "Why this helps"
│   │   └── ExerciseLink.tsx         # "Go deeper" suggestion
│   └── CopingCardDeck/
│       ├── CopingCardScreen.tsx     # Card deck screen
│       └── CopingCard.tsx           # Individual card component
├── hooks/
│   ├── useCrisisDetection.ts       # Hook wrapping detection + modal
│   └── useExerciseRecommendation.ts # Adaptive suggestion logic
├── screens/
│   ├── CopingCardsScreen/           # New screen for card deck
│   ├── ThinkingPatternsScreen/      # Analytics dashboard
│   └── ThoughtReframingScreen/      # Upgraded custom steps
│       └── customSteps.tsx
└── exercises/
    ├── thoughtReframing/config.ts   # Updated with postIntensity
    ├── worryTime/config.ts          # Fixed fieldKey bug
    └── decatastrophizing/config.ts  # Split time perspective
```

### Modified Files

```
src/types/exerciseFlow.ts            # Add postIntensity fields, coping card types
src/components/exercise/steps/TextInputStep.tsx  # Add voice input button
src/screens/ExerciseFlowScreen/ExerciseFlowScreen.tsx  # Crisis detection integration
src/hooks/useExerciseFlow.ts         # Crisis interception in goNext
src/data/exerciseRegistry.ts         # Updated configs
```

### Data Model Additions

```typescript
// Coping Card
interface CopingCard {
  id: string;
  userId: string;
  exerciseType: ExerciseType;
  exerciseEntryId: string;
  originalThought: string;
  balancedThought: string;
  createdAt: string;
  starred: boolean;
  archived: boolean;
}

// Exercise Recommendation
interface ExerciseRecommendation {
  exerciseType: ExerciseType;
  reason: string;
  confidence: number;
  basedOn: "mood" | "pattern" | "progression" | "time";
}
```

---

## 9. Design Principles

1. **Warm before clinical** — Validate feelings before suggesting techniques
2. **Show proof** — Every exercise should leave the user with visual evidence of progress
3. **Respect autonomy** — Never force, never block, never shame. Offer and support.
4. **Reduce friction in distress** — Voice input, quick modes, one-tap exercises
5. **Build mastery** — Users should feel themselves getting better at CBT skills over time
6. **Connect the dots** — Exercises are steps in a journey, not isolated events
7. **Privacy first** — Crisis detection runs locally. Thoughts never leave the device without consent.
8. **Celebrate showing up** — Not just outcomes. "You came back today. That matters."

---

## 10. Risks and Mitigations

| Risk                                                                         | Mitigation                                                                                            |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Crisis detection false positives (e.g., "I could just die of embarrassment") | Use multi-word phrase matching, not single keywords. Allow dismiss with one tap. Never block.         |
| Emotional validation feeling patronizing                                     | Test with real users. Keep to 1 sentence max. Make it specific to their input, not generic.           |
| Gamification changes upsetting existing users                                | Gradual rollout. Keep XP/levels. Only remove punitive elements (streak loss). Add, don't subtract.    |
| AI recommendations being wrong                                               | Start with simple heuristics. Show reasoning ("because X worked well last time"). Let users dismiss.  |
| Exercise length increasing with new steps                                    | New steps (validation, psychoeducation) are non-blocking inline elements, not extra navigation steps. |
| Coping cards becoming stale                                                  | Show creation date. Allow archiving. Prompt review after 30 days: "Does this still resonate?"         |

---

## 11. Open Questions

1. Should psychoeducation micro-cards be always visible or user-enabled in settings?
2. Should coping cards sync to cloud or stay local-only for privacy?
3. Should we add a "Quick Mode" for experienced users (skip intro + psychoeducation)?
4. What is the threshold for "significant improvement" in dynamic summaries?
5. Should exercise recommendations use push notifications or only in-app prompts?
6. Should the crisis modal appear for medium-severity or only high-severity matches?
7. Do we need therapist/clinical review of all validation messages and psychoeducation content?

---

## 12. Appendix: Competitor Comparison Table

| Feature                    | Our App (Current)      | Our App (V2)                             | Woebot      | Wysa        | Finch             | Calm           |
| -------------------------- | ---------------------- | ---------------------------------------- | ----------- | ----------- | ----------------- | -------------- |
| CBT exercises              | 16                     | 16+                                      | 5-8         | 5-8         | Minimal           | Minimal        |
| Emotional validation       | None                   | Every exercise                           | Via chat    | Via chat    | Companion tone    | None           |
| Before/after visualization | Data exists, not shown | Visual summary                           | None        | None        | Bird growth       | Streaks only   |
| Crisis safety              | None                   | Detection + resources                    | Basic       | Basic       | Panic first aid   | SOS meditation |
| AI personalization         | Suggestions only       | Suggestions + recommendations + insights | Core (chat) | Core (chat) | None              | None           |
| Coping cards               | None                   | Deck with all reframes                   | None        | None        | None              | None           |
| Exercise progression       | Flat list              | Difficulty ladder + linking              | Linear chat | Linear chat | Task-based        | Programs       |
| Thinking patterns          | None                   | Dashboard + weekly insights              | None        | None        | None              | None           |
| Voice input                | None                   | All text inputs                          | Chat-based  | Chat-based  | None              | None           |
| Gamification model         | XP + streaks           | XP + positive-only growth                | None        | None        | Positive pet care | Streaks        |

---

_This PRD is based on analysis of 16 exercise configs, competitive research across 10+ apps, evidence-based CBT literature, and user review patterns from App Store data._
