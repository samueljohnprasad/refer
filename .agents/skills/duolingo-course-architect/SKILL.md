---
name: duolingo-course-architect
description: "Design gamified micro-learning courses using Duolingo's proven methodology. Combines behavioral psychology (Hook Model, loss aversion, flow state, variable rewards), instructional design (scaffolding, spaced repetition, interleaving), and structured curriculum architecture (Course → Section → Unit → Lesson → Exercise). Use when designing courses, lesson sequences, exercise progression, skill trees, or curriculum paths for any learning domain. Triggers on: course design, lesson plan, curriculum, learning path, gamified learning, micro-lesson, spaced repetition, scaffolding, skill progression, exercise generation."
---

# Duolingo Course Architect

## Identity

**Role**: Learning Experience Architect & Behavioral Designer

**You are**: An expert who combines learning science, behavioral psychology, and game design to create courses that are as habit-forming as Duolingo. You don't just structure content — you engineer daily return through psychological precision.

**Core belief**: The best course is one users *can't stop coming back to* — not because of manipulation, but because each session delivers genuine progress that compounds.

---

## Part 1: Behavioral Psychology Framework

**Foundation**: All design decisions below are grounded in the 50 Psychology Principles (see `references/psychology-principles.md` for full research). Every rule cites which principle(s) justify it.

### 1.1 The Hook Model (Nir Eyal) — Applied to Learning

**Principle Justification**: Commitment & Consistency (#13), Habit Loop (#38), Temporal Motivation (#24)

Every lesson session must complete a full hook cycle:

```
TRIGGER → ACTION → VARIABLE REWARD → INVESTMENT → (loads next trigger)
```

| Phase | In Learning Context | Design Rule |
|-------|-------------------|-------------|
| **Trigger** | Internal: "I feel anxious about sleep" / External: streak notification | Triggers must connect to user's felt problem, not abstract learning goal |
| **Action** | Open app → tap one lesson (< 30 sec to start) | Minimize friction. One tap to lesson. No navigation decisions. |
| **Variable Reward** | XP amount varies, surprise chest, AI insight, new technique unlocked | Never the same reward twice in a row. Mix: Tribe (social), Hunt (achievement), Self (mastery) |
| **Investment** | Streak counter increments, mood data logged, journal written | User puts something IN that makes leaving costly and coming back more valuable |

### 1.2 Loss Aversion Architecture

**Principle Justification**: Loss Aversion (#8), Contrast Effect (#32)

Humans feel losses ~2x more intensely than equivalent gains (Kahneman & Tversky, 1979).

**Design Rules:**
- Frame streak as "don't break it" not "keep building it"
- Show what user will LOSE if they skip (streak, position, frozen progress)
- Streak freeze = commitment device (buying it increases adherence even when unused)
- After lesson: show "tomorrow's lesson unlocks in X hours" (anticipated loss of access)

**Implementation:**
```
IF user.streak >= 7 THEN notification.frame = "loss"
  → "Your 12-day streak is in danger"
IF user.streak < 7 THEN notification.frame = "gain"  
  → "Complete today to build your streak to 4!"
```

### 1.3 Flow State Calibration

**Principle Justification**: Flow State (#7), Desirable Difficulties (#5), Self-Efficacy (#12), Adaptive Difficulty (#45)

Flow occurs when challenge matches skill. Duolingo targets **80% accuracy per session** (technically 75-85%, adaptive per user).

```
Flow Channel:

ANXIETY ──────────────────────────────────
                          ╱
                    FLOW ╱
                       ╱
BOREDOM ─────────────╱──────────────────────
         Low Skill ────────────── High Skill
```

**Design Rules:**
- First lesson: >95% success rate (build self-efficacy)
- Steady state: 75-85% accuracy target
- If accuracy drops below 70%: reduce difficulty, add scaffolding
- If accuracy exceeds 90%: increase challenge, remove scaffolding
- Never let user fail 3 times in a row without support

**Difficulty Levers (ordered by impact):**
1. Scaffolding level (hints, word banks, multiple choice vs. free recall)
2. Content complexity (familiar vs. novel concepts)
3. Time pressure (timed vs. untimed)
4. Distractor similarity (obvious vs. subtle wrong answers)

### 1.4 Variable Reward Schedule

**Principle Justification**: Variable Ratio Reinforcement (#9), Dopamine & Reward Timing (#37), Novelty & Variety (#43), Points/Badges/Leaderboards (#44)

Fixed rewards create habituation. Variable rewards create anticipation (Skinner, operant conditioning).

**Schedule Design:**
```yaml
reward_schedule:
  every_lesson:
    - XP (amount varies: 10-25 base + 0-15 bonus)
    - Accuracy percentage
    - Time taken
  variable_ratio: # Average every 3rd lesson, but unpredictable
    - Bonus XP burst
    - Insight unlock
    - New technique preview
  milestone: # At section boundaries
    - Badge/achievement
    - Skill recap
    - Mood comparison (before vs. after)
  rare: # ~Every 8-12 lessons
    - Chest with cosmetic/audio reward
    - AI-generated personalized insight
    - "Letter from future self"
```

### 1.5 Commitment & Consistency (Cialdini)

**Principle Justification**: Commitment & Consistency (#13), Implementation Intentions (#15), Sunk Cost Effect (#14), Intrinsic Motivation (#33)

People act consistently with prior commitments, especially public ones.

**Design Rules:**
- Onboarding: user states WHY they're here (written commitment)
- Pact signing: "I commit to X minutes per day"
- Show commitment back to user when motivation drops
- Progress is visible to others (optional social layer)

### 1.6 Endowed Progress Effect

**Principle Justification**: Endowed Progress Effect (#10), Progress Visualization & Momentum (#46)

People complete tasks faster when given a "head start" (Nunes & Drèze, 2006).

**Design Rules:**
- Never start progress at 0%. Start at 10-20% after first action.
- "You've already completed Lesson 1!" after onboarding
- Path shows distance traveled, not just distance remaining
- Placement quiz = instant endowed progress ("You're already at Level 3!")

### 1.7 Zeigarnik Effect

**Principle Justification**: Zeigarnik Effect (#11), Temporal Motivation (#24), Streaks as Anchors (#50)

Incomplete tasks create psychological tension that motivates completion.

**Design Rules:**
- Always show "X lessons until next checkpoint"
- Lesson interrupted → "Continue where you left off?" on return
- Weekly progress: "3 of 5 lessons complete this week"
- Never end a session at a natural stopping point — always show what's NEXT

---

## Part 2: Instructional Design Framework

### 2.1 Curriculum Architecture (Hierarchy)

```
COURSE (e.g., "The Gentle Wind-Down")
  └── SECTION (topical arc, 3-6 units, has narrative identity)
        └── UNIT (medium-term goal, 3-7 lessons, has checkpoint)
              └── LESSON (single session, 5-15 min, 8-15 exercises)
                    └── EXERCISE (single interaction, 15-60 sec)
```

**Each level serves a psychological purpose:**

| Level | Purpose | Duration | Psychology |
|-------|---------|----------|-----------|
| Course | Identity ("I'm learning X") | Weeks-months | Commitment, identity |
| Section | Narrative arc ("Chapter") | 1-3 weeks | Curiosity, completion drive |
| Unit | Visible goal ("Almost done") | 3-7 days | Zeigarnik, near-completion |
| Lesson | Micro-commitment ("Just one more") | 5-15 min | Flow, daily habit |
| Exercise | Instant feedback | 15-60 sec | Dopamine, mastery |

### 2.2 Content Sequencing: Spaced Interleaved Curriculum

**NEVER use blocked learning** (all of topic A, then all of topic B).

**ALWAYS use spaced interleaving:**
- Mix concepts within lessons (70% current topic, 30% review)
- Each concept appears across multiple sessions at increasing intervals
- Review is woven IN, not tacked on

**Spacing Algorithm (simplified Leitner-inspired):**
```
Concept first introduced: Session N
First review: Session N+1 (next day)
Second review: Session N+3 (2 days later)
Third review: Session N+7 (4 days later)
Fourth review: Session N+14 (7 days later)
Fifth review: Session N+30 (16 days later)

IF user gets review wrong → reset to Session N+1 spacing
IF user gets review right → advance to next interval
```

### 2.3 Scaffolding Sequence (Per Concept)

Every new concept follows a 6-step ladder from recognition → production:

```
Step 1: PASSIVE EXPOSURE
  → See concept presented with full explanation
  → No response required
  → "Here's what box breathing is..."

Step 2: RECOGNITION (Easy)
  → Multiple choice with obvious wrong answers
  → "Which of these describes box breathing? A) Breathing in squares B) Holding breath underwater C) Eating boxes"

Step 3: RECOGNITION (Hard)  
  → Multiple choice with plausible distractors
  → "Box breathing involves: A) 4-4-4-4 pattern B) 4-7-8 pattern C) 5-5-5-5 pattern"

Step 4: GUIDED PRODUCTION
  → Fill-in-the-blank, word bank, or prompted response
  → "The four phases of box breathing are: inhale ___, hold ___, exhale ___, hold ___"

Step 5: FREE PRODUCTION
  → Open response, no scaffolding
  → "Describe when you would use box breathing and why"

Step 6: APPLICATION IN CONTEXT
  → Apply concept in novel scenario
  → "Your mind is racing at 11pm. Walk through the technique you'd use."
```

**Advancement Rule:** User must achieve 80%+ accuracy at each step before progressing.

### 2.4 Exercise Type Variety

Use ~8-12 distinct exercise types per course. Variety prevents habituation.

| Exercise Type | Cognitive Mode | Scaffolding Level | Best For |
|--------------|---------------|-------------------|----------|
| Learn cards (carousel) | Receptive | High (passive) | Introducing concepts |
| Multiple choice | Recognition | Medium | Checking understanding |
| True/false with explanation | Discrimination | Medium | Challenging assumptions |
| Fill-in-the-blank | Guided production | Medium-Low | Active recall |
| Matching pairs | Association | Medium | Connecting concepts |
| Ordering/sequencing | Structural understanding | Low | Process learning |
| Free text response | Production | Low (no scaffold) | Deep processing |
| Slider/rating | Self-assessment | High | Mood checks, reflection |
| Guided journal | Production + reflection | Medium | Personal application |
| Scenario/simulation | Application | Low | Real-world transfer |
| Quiz with explanation | Testing + learning | Medium | Retention measurement |
| Breathing/body timer | Experiential | High | Somatic exercises |

**Variety Rule:** No two consecutive exercises should use the same type. Within a lesson of 10 exercises, use minimum 4 distinct types.

### 2.5 Session Design Template

Every lesson follows this emotional arc:

```
MINUTES   PHASE              EXERCISES           FEELING
0-1       WARM-UP            Review (easy)       "I remember this"
1-3       INTRODUCTION       Learn cards         "This is interesting"  
3-7       CHALLENGE          New exercises       "I can do this" (flow)
7-10      PEAK DIFFICULTY    Hard exercises      "Challenging but I got it"
10-12     CONSOLIDATION      Mix review + new    "It's coming together"
12-15     COOL-DOWN          Easy + reflection   "I feel accomplished"
```

**Session Rules:**
- Start with something user already knows (confidence builder)
- Introduce max 1-2 new concepts per session
- End on success (never end on failure)
- Final exercise should be easy enough to guarantee success
- Total session: 5-15 minutes (never exceed 20)

### 2.6 Difficulty Curve (Per Course)

```
Difficulty
│
│                                    ╭──── Section 3
│                              ╭────╯     (Advanced)
│                         ╭───╯
│                    ╭───╯     Section 2
│              ╭────╯          (Intermediate)
│         ╭───╯
│    ╭───╯     Section 1
│───╯          (Foundation)
│
└──────────────────────────────────────── Lessons
     ↑                    ↑
  Easy start         Checkpoint
  (>95% success)     (consolidation dip)
```

**Rules:**
- Difficulty increases within sections (gradual slope)
- At section boundaries: difficulty DROPS (consolidation + review)
- Each section starts slightly above where previous section ended
- Checkpoints are easier than surrounding content (reward for persistence)

---

## Part 3: LLM-Readable Course Specification Schema

### 3.1 Course Definition Schema

```yaml
course:
  id: "gentle-wind-down"
  title: "The Gentle Wind-Down"
  tagline: "From restless nights to gentler wind-downs"
  domain: "sleep_wellness"  # anxiety | mood | stress | self_understanding | sleep
  target_audience: "Adults struggling with sleep onset or quality"
  
  # Curriculum parameters
  total_duration_weeks: 4  # Expected completion time
  sessions_per_week: 5     # Recommended frequency
  session_duration_minutes: [5, 15]  # Min-max range
  
  # Difficulty parameters
  starting_difficulty: 0.2    # 0-1 scale (0.2 = very accessible)
  ending_difficulty: 0.7      # Final section difficulty
  target_accuracy: 0.80       # Flow zone target
  max_new_concepts_per_session: 2
  
  # Engagement parameters
  streak_enabled: true
  variable_reward_frequency: 3  # Average lessons between surprise rewards
  checkpoint_frequency: 5       # Lessons between checkpoints
  
  # Spaced repetition
  review_ratio: 0.30  # 30% of each lesson is review of prior concepts
  spacing_multiplier: 2.0  # Each successful review doubles the interval
  
  sections: [...]  # See below
```

### 3.2 Section Schema

```yaml
section:
  id: "foundations"
  title: "Evening Awareness"
  description: "Learn to notice what your nervous system is doing at night"
  narrative_hook: "Before we can change anything, we need to see it clearly"
  
  # Learning objectives (Bloom's taxonomy)
  objectives:
    remember: "Name the 3 states of the nervous system"
    understand: "Explain why evenings activate the stress response"
    apply: "Perform a basic body awareness check-in"
    analyze: "Identify personal evening stress triggers"
  
  # Scaffolding
  concepts_introduced:
    - id: "nervous_system_basics"
      prerequisite: null
      scaffold_steps: 6  # Full ladder
    - id: "body_awareness_checkin"
      prerequisite: "nervous_system_basics"
      scaffold_steps: 4  # Skip passive exposure (experiential)
    - id: "evening_trigger_identification"
      prerequisite: "body_awareness_checkin"
      scaffold_steps: 5
  
  # Section-level engagement
  badge_on_complete: "Evening Awareness Unlocked"
  mood_comparison: true  # Show mood at start vs. end of section
  checkpoint_type: "skills_recap"
  
  units: [...]
```

### 3.3 Unit Schema

```yaml
unit:
  id: "unit_1_1"
  title: "Your Nervous System at Night"
  section_id: "foundations"
  position: 1
  
  lessons:
    - id: "lesson_1"
      title: "The Evening Shape"
      type: "introduction"  # introduction | practice | review | checkpoint | assessment
      duration_minutes: 8
      new_concepts: ["nervous_system_basics"]
      review_concepts: []  # First lesson, nothing to review yet
      
    - id: "lesson_2"
      title: "Fight, Flight, or Rest"
      type: "practice"
      duration_minutes: 10
      new_concepts: ["sympathetic_vs_parasympathetic"]
      review_concepts: ["nervous_system_basics"]
      
    - id: "lesson_3"
      title: "Reading Your Body's Signals"
      type: "practice"
      duration_minutes: 12
      new_concepts: ["body_awareness_checkin"]
      review_concepts: ["nervous_system_basics", "sympathetic_vs_parasympathetic"]
```

### 3.4 Lesson Schema (Detailed Exercise Sequence)

```yaml
lesson:
  id: "lesson_3"
  title: "Reading Your Body's Signals"
  estimated_minutes: 12
  target_accuracy: 0.80
  difficulty: 0.25  # Early in course
  
  # Emotional arc
  arc: [warmup, introduce, challenge, peak, consolidate, cooldown]
  
  exercises:
    # --- WARM-UP (review, easy) ---
    - type: "multiple_choice"
      phase: "warmup"
      concept: "nervous_system_basics"  # Review
      scaffold_level: 3  # Recognition (hard) — already learned this
      difficulty: 0.2
      prompt: "When you feel your heart racing at bedtime, which system is active?"
      options: ["Sympathetic (fight-or-flight)", "Parasympathetic (rest-and-digest)", "Digestive system"]
      correct: 0
      feedback_correct: "Right — your body is in alert mode."
      feedback_incorrect: "That's the fight-or-flight response — the sympathetic nervous system."
      
    # --- INTRODUCTION (new concept, passive) ---
    - type: "learn_cards"
      phase: "introduce"
      concept: "body_awareness_checkin"  # New
      scaffold_level: 1  # Passive exposure
      cards:
        - text: "Your body is always talking. Tension in your jaw, shoulders pulled up, shallow breath — these are signals."
          visual_key: "body_signals_illustration"
        - text: "A body awareness check-in means pausing to scan for these signals without trying to fix them."
          visual_key: "body_scan_neutral"
        - text: "Tonight, we'll learn to read your body's evening state in under 60 seconds."
          visual_key: "clock_60_seconds"
    
    # --- CHALLENGE (new concept, guided) ---
    - type: "multi_choice"
      phase: "challenge"
      concept: "body_awareness_checkin"
      scaffold_level: 2  # Recognition (easy distractors)
      difficulty: 0.3
      prompt: "What does a body awareness check-in involve?"
      options: ["Noticing tension without fixing it", "Forcing muscles to relax", "Doing 100 pushups"]
      correct: 0
      
    - type: "ordering"
      phase: "challenge"
      concept: "body_awareness_checkin"
      scaffold_level: 4  # Guided production
      difficulty: 0.4
      prompt: "Put these body scan steps in order:"
      items: ["Pause and close eyes", "Scan from head to feet", "Notice without judgment", "Note what you found"]
      correct_order: [0, 1, 2, 3]
      
    # --- PEAK DIFFICULTY (application) ---
    - type: "body_scan_exercise"
      phase: "peak"
      concept: "body_awareness_checkin"
      scaffold_level: 5  # Free production (experiential)
      difficulty: 0.5
      config:
        areas: ["jaw", "shoulders", "chest", "stomach", "hands"]
        instruction: "Notice each area. Rate tension 1-5."
        duration_seconds: 60
      
    - type: "free_text"
      phase: "peak"
      concept: "body_awareness_checkin"
      scaffold_level: 5
      difficulty: 0.5
      prompt: "What surprised you about your body scan just now?"
      min_words: 5
      max_words: 50
      
    # --- CONSOLIDATION (mix review + new) ---
    - type: "true_false"
      phase: "consolidate"
      concept: "body_awareness_checkin"
      scaffold_level: 3
      difficulty: 0.35
      statement: "The goal of a body check-in is to immediately relax all tension."
      correct: false
      explanation: "The goal is awareness, not fixing. Noticing without judgment is the skill."
      
    - type: "multi_choice"
      phase: "consolidate"
      concept: "sympathetic_vs_parasympathetic"  # Review
      scaffold_level: 3
      difficulty: 0.3
      prompt: "Shallow breathing and tight shoulders indicate your _____ system is active."
      options: ["sympathetic", "parasympathetic", "immune"]
      correct: 0
      
    # --- COOL-DOWN (easy, reflection) ---
    - type: "mood_check"
      phase: "cooldown"
      concept: null  # Meta-exercise
      prompt: "How does your body feel after that scan?"
      scale: 5
      labels: ["Very tense", "Somewhat tense", "Neutral", "Somewhat relaxed", "Very relaxed"]
      
    - type: "learn_cards"
      phase: "cooldown"
      concept: "body_awareness_checkin"
      scaffold_level: 1  # Bookend with easy card
      cards:
        - text: "You just did your first body awareness check-in. That's a skill most people never learn. Tomorrow, we'll use this to read your evening state."
          visual_key: "celebration_subtle"
  
  # Post-lesson engagement
  completion_reward:
    xp: 15
    bonus_xp_if_accuracy_above_90: 5
    variable_reward_roll: true  # 33% chance of bonus chest
  
  next_lesson_teaser: "Tomorrow: What your body is telling you at 10pm"
```

### 3.5 Concept Tracking Schema

```yaml
concept:
  id: "body_awareness_checkin"
  domain: "somatic_awareness"
  section: "foundations"
  
  # Scaffolding state per user
  scaffold_state:
    current_level: 1-6      # Where user is on the scaffold ladder
    accuracy_at_level: 0.0-1.0
    exposures_at_level: 0+
    advance_threshold: 0.80  # Must hit 80% to advance
    
  # Spaced repetition state per user
  repetition_state:
    times_seen: 0+
    times_correct: 0+
    last_seen: timestamp
    next_review: timestamp
    interval_days: 1         # Current spacing (doubles on success)
    ease_factor: 2.5         # SM-2 style ease
    
  # Relationships
  prerequisites: ["nervous_system_basics"]
  unlocks: ["evening_trigger_identification", "body_scan_pmr"]
  related_exercises: ["body_scan_pmr", "grounding_54321"]
```

### 3.6 Engagement Event Schema

```yaml
engagement_events:
  # Lesson-level rewards
  lesson_complete:
    always:
      - type: "xp"
        amount: "{base_xp} + {accuracy_bonus}"
      - type: "progress_update"
        message: "Lesson {n} of {total} in {unit_name}"
    variable:  # Randomly triggered
      - type: "bonus_xp"
        probability: 0.25
        amount: [5, 10, 15]  # Random from set
      - type: "chest"
        probability: 0.12
        rewards: ["audio_track", "theme_unlock", "streak_freeze"]
      - type: "insight_preview"
        probability: 0.15
        content: "AI-generated pattern observation from user's data"
  
  # Streak events
  streak:
    maintained:
      notification: "🔥 {streak_count} days! {encouragement}"
    at_risk:
      notification: "Your {streak_count}-day streak ends at midnight"
      offer: "streak_freeze"
    broken:
      recovery_window_hours: 24
      message: "Streaks can be rebuilt. Your progress is still here."
    milestones: [3, 7, 14, 30, 60, 100]
  
  # Checkpoint events
  checkpoint:
    type: "section_complete"
    rewards:
      - badge: "{section_name} Mastery"
      - skills_recap: ["list of skills learned in section"]
      - mood_comparison: "Your average mood: start vs. now"
    next_section_teaser: "Coming up: {next_section_title}"
```

---

## Part 4: LLM Prompting Framework

### 4.1 Course Generation Prompt Template

Use this prompt to generate a complete course:

```markdown
You are a Duolingo Course Architect. Generate a course following these rules:

**DOMAIN**: {domain_description}
**TARGET USER**: {user_persona}
**COURSE GOAL**: {what_user_will_be_able_to_do_after}
**SESSION CONSTRAINT**: {min}-{max} minutes per lesson
**TOTAL DURATION**: {weeks} weeks at {frequency} sessions/week

**RULES YOU MUST FOLLOW:**

1. CURRICULUM ARCHITECTURE:
   - Structure: Course → Sections (3-5) → Units (2-4 per section) → Lessons (3-7 per unit) → Exercises (8-15 per lesson)
   - Single linear path — no branching
   - Each section has a narrative identity and learning objectives (Bloom's taxonomy)

2. DIFFICULTY CALIBRATION:
   - First lesson: >95% success rate
   - Target accuracy: 80% across course
   - Difficulty increases within sections, drops at boundaries
   - Max 2 new concepts per lesson
   - 30% of each lesson is review of prior concepts

3. SCAFFOLDING:
   - Every concept follows: Passive → Recognition(easy) → Recognition(hard) → Guided Production → Free Production → Application
   - User must hit 80% at each level before advancing
   - Scaffold across multiple lessons — don't rush one concept in one session

4. SPACED REPETITION:
   - Concepts reappear at intervals: +1, +3, +7, +14, +30 lessons
   - Failed reviews reset to +1
   - Mix 70% current + 30% review in every lesson

5. ENGAGEMENT:
   - Variable rewards every ~3 lessons (unpredictable)
   - Checkpoints every 5 lessons with badge + skills recap
   - End every lesson on success (easy final exercise)
   - Show next lesson teaser after completion

6. SESSION ARC:
   - Warm-up (review, easy) → Introduce (new, passive) → Challenge (new, active) → Peak (hardest) → Consolidate (mix) → Cool-down (easy + reflection)

7. EXERCISE VARIETY:
   - Minimum 4 distinct exercise types per lesson
   - Never 2 consecutive exercises of same type
   - Types: learn_cards, multiple_choice, true_false, fill_blank, ordering, matching, free_text, slider_rating, guided_journal, scenario, timer_exercise, mood_check

**OUTPUT FORMAT**: Generate using the YAML schema defined in the Course Specification Schema (sections 3.1-3.6).
```

### 4.2 Single Lesson Generation Prompt

```markdown
Generate a single lesson for the following context:

**Lesson Position**: Lesson {n} of {total} in Unit "{unit_name}"
**New Concepts**: {list_of_concepts_to_introduce}
**Review Concepts**: {list_of_concepts_to_review}
**Difficulty Target**: {0.0-1.0}
**User's Current Scaffold Levels**: {concept: level} for each active concept
**Duration Target**: {minutes} minutes

**CONSTRAINTS**:
- Follow the session arc: warmup → introduce → challenge → peak → consolidate → cooldown
- Use minimum 4 exercise types
- 70% new content, 30% review
- End on guaranteed success
- Target 80% accuracy
- Include one mood_check or reflection exercise
- Add a "next lesson teaser" at the end

Generate the full exercise sequence in YAML format.
```

---

## Part 5: Quality Validation Checklist

### Before Shipping Any Lesson:

```
□ Does the first exercise guarantee success? (>95% chance of correct)
□ Does the last exercise guarantee success?
□ Are there at least 4 distinct exercise types?
□ Is review content woven in (not tacked on at end)?
□ Does difficulty follow the arc (not flat or random)?
□ Is there at least one reflection/mood check?
□ Does the lesson introduce max 2 new concepts?
□ Is total time within 5-15 minute window?
□ Does completion trigger a reward (XP at minimum)?
□ Is the next lesson teaser present?
□ Would a user finishing this feel MORE capable than when they started?
```

### Before Shipping Any Course:

```
□ Is the path strictly linear (no branching decisions)?
□ Does difficulty increase within sections and drop at boundaries?
□ Are checkpoints placed every 4-6 lessons?
□ Does every concept have spaced repetition scheduled?
□ Are variable rewards distributed unpredictably?
□ Is the first lesson completable in under 5 minutes?
□ Does the course get HARDER (not just longer)?
□ Are there at least 8 exercise types used across the course?
□ Does each section have clear learning objectives (Bloom's)?
□ Would Day 10 feel meaningfully different from Day 1?
```

---

## Part 6: Anti-Patterns

### What This Skill Should NEVER Produce:

| Anti-Pattern | Why It Fails | What To Do Instead |
|-------------|-------------|-------------------|
| All learn cards, no interaction | No retrieval practice, no retention | Mix passive and active in every lesson |
| Same exercise type repeated | Habituation, boredom | Minimum 4 types per lesson |
| Difficulty spike without scaffolding | Frustration, dropout | Always scaffold before testing |
| Review bolted on at end | Feels like punishment | Weave review into lesson flow |
| Fixed rewards every lesson | Anticipation dies | Variable ratio schedule |
| Lessons longer than 15 min | Dropout mid-session | Cap at 15 min, split if needed |
| Starting with hardest concept | Failure → learned helplessness | Start easy, build confidence |
| No reflection/mood check | Misses the "I'm growing" signal | Include self-assessment every lesson |
| Blocked content (all Topic A then B) | Poor long-term retention | Interleave from session 2 onward |
| Punishing streak loss harshly | Users quit permanently | Offer repair, show progress preserved |

---

## Part 7: Domain-Specific Adaptations

### For Mental Health / Wellness Courses:

**Additional constraints:**
- Never generate content that could substitute for professional care
- Mood checks are clinical MEASURES, not just engagement — treat data seriously
- Exercises should be evidence-based (CBT, ACT, mindfulness with citations)
- "Failure" in mental health = using the wrong framing. There are no wrong answers in journaling.
- Session timing matters: evening courses should have calming final exercises
- Progress = behavioral change, not just knowledge acquisition

**Exercise type additions for wellness:**
- Breathing timer (with visual guide)
- Body scan (progressive muscle relaxation)
- Guided journal (prompted writing)
- Behavioral experiment (try X, report back)
- Coping card creation
- Values clarification

**Scaffolding adaptation:**
- Step 1 (Passive): Psychoeducation cards
- Step 2-3 (Recognition): Identify patterns in scenarios
- Step 4 (Guided): Practice technique with full instruction
- Step 5 (Free): Practice technique independently
- Step 6 (Application): Apply in real evening/night context

---

## Reference System

Always ground decisions in:
- `references/psychology-principles.md` — The WHY behind each design choice
- `references/exercise-taxonomy.md` — Complete exercise type reference
- `references/spacing-algorithm.md` — Spaced repetition implementation details

## Keywords

duolingo, course design, gamification, micro-learning, spaced repetition, scaffolding, curriculum architecture, lesson design, exercise generation, flow state, loss aversion, variable rewards, hook model, streak mechanics, instructional design, learning path, skill progression, adaptive difficulty, engagement loops, retention
