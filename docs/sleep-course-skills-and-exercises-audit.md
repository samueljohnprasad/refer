# Sleep Course Design — Skills & Exercises Audit

## Overview

Designing "The Gentle Wind-Down" sleep course (Duolingo-style, lesson-based progression). This document lists available skills, exercises, and content types we can leverage.

---

## Available Claude Code Skills

### 1. **context7-mcp**

- **Purpose**: Fetch current documentation for libraries, frameworks, APIs
- **Use Case**: Research sleep science, CBT-I techniques, mindfulness best practices
- **Example**: Query sleep hygiene best practices, ACT acceptance techniques for insomnia

### 2. **CVE-report-fixes**

- **Purpose**: CVE remediation for dependencies
- **Use Case**: Not applicable for course design

### 3. **find-docs**

- **Purpose**: Search documentation
- **Use Case**: Find relevant patterns in existing course/exercise implementations

### 4. **rtk** (Redux Toolkit)

- **Purpose**: Redux state management
- **Use Case**: Managing course progression state, lesson unlock logic, user preferences

### 5. **refactorspring-boot**

- **Purpose**: Spring Boot Java refactoring
- **Use Case**: Not applicable (frontend/mobile project)

---

## Available Exercise Types (In Codebase)

### Breathing Exercises

- ✅ **Box Breathing** (`boxBreathing/config.ts`)
- ✅ **4-7-8 Breathing** (`breathing478/config.ts`)
- ✅ **Mindful Breathing 1 Min** (`mindfulBreathing1Min/config.ts`)

### Somatic/Body Awareness

- ✅ **Body Scan PMR** (`bodyScanPMR/config.ts`) — Progressive Muscle Relaxation
- ✅ **Grounding 5-4-3-2-1** (`grounding54321/config.ts`)

### Cognitive Techniques

- ✅ **Thought Catcher** (`thoughtCatcher/config.ts`)
- ✅ **Thought Reframing** (`thoughtReframing/config.ts`)
- ✅ **ABC Analysis** (`abcAnalysis/config.ts`)
- ✅ **Worry Time** (`worryTime/config.ts`)
- ✅ **Decatastrophizing** (`decatastrophizing/config.ts`)
- ✅ **Worry Decision Tree** (`worryDecisionTree/config.ts`)
- ✅ **Recognizing Rumination** (`recognizingRumination/config.ts`)
- ✅ **Detached Mindfulness** (`detachedMindfulness/config.ts`)
- ✅ **Attention Training** (`attentionTraining/config.ts`)

### Other

- ✅ **Gratitude Reframe** (`gratitudeReframe/config.ts`)
- ✅ **Fear Ladder** (`fearLadder/config.ts`)

---

## Available Content Node Types (Mental Health)

From `mentalHealth.ts`, we can use:

### 1. **Learn Node** (`LearnContent`)

- Carousel of educational cards
- Each card: `{ text: string (max 40 words), visual_key: string }`
- **Use**: Sleep science, wind-down principles, night-time patterns

### 2. **Exercise Node** (`ExerciseContent`)

- Steps-based wizard interface
- Input types: `text`, `slider`, `picker`, `multi_choice`, `rating`
- Supports special types: `breathing`, `body_scan`, `grounding`, `standard`
- **Use**: Breathing, body scans, wind-down rituals

### 3. **Journal Node** (`JournalContent`)

- Guided journaling with optional mood capture before/after
- Tags for AI analysis
- **Use**: Evening reflection, tomorrow planning

### 4. **Quiz Node** (`QuizContent`)

- Multiple choice with explanations
- Scoring and perfect-bonus XP
- **Use**: Knowledge checks on sleep patterns, CBT concepts

### 5. **Mood Check Node** (`MoodCheckContent`)

- Mood scale (typically 1-5)
- Optional text note
- **Use**: Pre/post lesson mood tracking, sleep quality self-assessment

### 6. **Checkpoint Node** (`CheckpointContent`)

- Badge/achievement unlock
- Skills recap
- Mood comparison (before/after section)
- **Use**: End of course or section milestones

### 7. **Chest Node** (`ChestContent`)

- Reward unlock (audio, theme, badge, streak_freeze, etc.)
- Rarity tiers
- **Use**: Motivation, collection mechanics

### 8. **AI Insight Node** (`AIInsightContent`)

- Analysis types: `mood_arc`, `journal_themes`, `thought_patterns`, `technique_effectiveness`
- Scope: `journey` or `section`
- **Use**: End-of-section data-driven insights

### 9. **Practice Node** (`PracticeContent`)

- Re-apply exercise with new scenario
- **Use**: Reinforce wind-down ritual in different contexts (travel, stress, etc.)

---

## Course Structure Framework

### Lesson Node Types Available

```
Learn → Exercise → Journal → Quiz → Mood Check
     ↓
  Checkpoint (skills recap, mood comparison)
     ↓
AI Insight (pattern analysis)
     ↓
Chest (reward)
```

### Respons Data Captured

- **Exercise**: User answers per step
- **Journal**: Text + word count + emotion tags
- **Quiz**: Per-question answers, score, perfect-bonus flag
- **Mood Check**: Rating 1-5 + optional note
- **Chest**: Reward type, key, rarity

---

## Proposed Sleep Course Structure

### "The Gentle Wind-Down" — Lesson Count TBD

**Note:** The 7-lesson structure shown in onboarding was test data. Actual course length should be determined by:

1. **Duolingo Research Principles** (from `duolingo-design-research.md`):
   - **Spaced, interleaved curriculum** — content is repeated across lessons, not blocked
   - **Scaffolding sequence** — each concept follows a 6-step ladder from passive recognition → free production
   - **Session depth** — average exercises per session should be achievable in 5-20 min
   - **Single linear path** — remove choice, provide one clear next step

2. **Sleep Science Requirements**:
   - How many distinct concepts need coverage? (nervous system basics, thought patterns, body awareness, acceptance, etc.)
   - How many spaced exposures per concept for retention?
   - Optimal spacing between practice of same technique?

3. **Habit Formation Window** (from Duolingo research):
   - Day 1–3: Churn critical; first session must succeed
   - Day 7: First trust signal
   - **Day 10: Critical inflection point** — retention curves bend sharply upward
   - Day 30+: Loss aversion becomes primary retention force

**Recommendation**: Use `/course-designer` skill with Duolingo's curriculum architecture (Unit → Section → Path) to determine optimal lesson count, not arbitrary number.

### Example Structure (Placeholder — TO BE DESIGNED):

#### Example Lesson Units (Placeholder):

**Possible structure following Duolingo patterns:**

| Unit            | Focus Area                                           | Exercises                              | Goal                             |
| --------------- | ---------------------------------------------------- | -------------------------------------- | -------------------------------- |
| **Foundations** | Evening nervous system, observation without judgment | Box Breathing, Body awareness intro    | Day 1–3 critical success window  |
| **Awareness**   | Thought patterns, rumination, body cues              | Thought Catcher, Body Scan PMR         | Scaffold recognition → awareness |
| **Tools**       | CBT techniques, worry containment                    | Worry Time, 4-7-8 Breathing, Grounding | Practice multiple modalities     |
| **Integration** | Acceptance, control, letting go                      | Guided journals, reflection exercises  | Build confidence in techniques   |
| **Patterns**    | AI-driven insights, personalized progress            | AI Insight nodes, mood comparison      | Reinforce habit formation        |
| **Practice**    | Real-world application, varied contexts              | Practice nodes (travel, stress, etc.)  | Generalization & flexibility     |

**Key design constraints from Duolingo research:**

- Each unit is spaced/interleaved (concepts repeat across units, not blocked)
- Session target: 5–15 min per session (< 20 min absolute max)
- Exercises within a lesson: 8–15 per session
- First lesson success rate target: >95% (must feel achievable)
- Day 10 inflection point: By lesson 10, establish habit loop to bend retention curve upward

**To determine actual lesson count:**

- Research how many spaced exposures needed per sleep technique for retention
- Map prerequisites (what must be learned before what)
- Validate scaffold sequence against CBT-I literature
- A/B test different path lengths (e.g., 10 vs 14 vs 20 lessons)

---

## Skills & Techniques Already Implemented

### Perfect for Sleep Course

- **Body Scan PMR** — gold standard for sleep
- **Box Breathing** — calming, repeatable
- **4-7-8 Breathing** — designed for sleep
- **Grounding 5-4-3-2-1** — anchors mind to present
- **Thought Catcher** — identify evening rumination
- **Worry Time** — contain anxiety to specific window
- **Detached Mindfulness** — let thoughts pass without engagement
- **Gratitude Reframe** — positive evening closure

### Adaptable (with context shift to evening)

- **Thought Reframing** — reframe night-time catastrophizing
- **ABC Analysis** — analyze sleep anxiety triggers
- **Decatastrophizing** — "what's the worst that actually happens if I don't sleep?"
- **Attention Training** — redirect from racing thoughts

---

## Missing / Future Considerations

### Skills Not Yet Implemented

- ❌ **Progressive Deepening Relaxation** (variant of PMR with deeper states)
- ❌ **Imagery / Safe Place Visualization** (wind-down mental escape)
- ❌ **Cognitive Defusion** (ACT: "I notice the thought, I don't believe it")
- ❌ **Sleep Hygiene Checklist** (sleep environment setup)
- ❌ **Stimulus Control** (behavioral: bed = sleep only)
- ❌ **Sleep Restriction** (timed protocol — requires coach guidance)

### Required Infrastructure

- ✅ **Learn nodes** with card carousels
- ✅ **Exercise nodes** with breathing timer UI (already exists)
- ✅ **Journal nodes** with mood tracking
- ✅ **Quiz nodes** with scoring
- ✅ **Mood check** nodes for pre/post measurement
- ✅ **AI Insight** nodes for pattern analysis
- ✅ **Checkpoint nodes** for milestone rewards

---

## Recommended Next Steps

1. **Research** (Use context7-mcp):
   - CBT-I (Cognitive Behavioral Therapy for Insomnia) best practices
   - Sleep physiology & wind-down science
   - Evening habit formation research

2. **Design Lesson Flow**:
   - Map exact node sequence for each lesson
   - Define exercises per lesson (from available registry)
   - Write Learn card copy (max 40 words each)
   - Design Quiz questions with evidence-based answers

3. **Implement Course Template**:
   - Create Supabase seed data for journey template
   - Structure lesson nodes with content JSONB
   - Wire up exercise linking

4. **Testing**:
   - Dry-run onboarding to course enrollment
   - Verify mood tracking across lesson progression
   - Test checkpoint/reward unlocks

---

## References

- **Exercise Registry**: `/src/data/exerciseRegistry.ts`
- **Mental Health Types**: `/src/types/journey/mentalHealth.ts`
- **Available Exercises**: `/src/exercises/*/config.ts`
- **Journey Constants**: `/src/data/journey/journeyConfig.ts`
