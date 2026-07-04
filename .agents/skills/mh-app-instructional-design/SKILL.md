---
name: mh-app-instructional-design
description: >
  Research and generate a structured instructional-design report for mental health learning apps.
  Covers content delivery formats (stories, audio, cards, animations, chat-based learning),
  interactive exercises (MCQ, fill-in-blank, matching, drag-drop, scenario decisions, journaling,
  habit tracking, mood check-ins, flashcards, daily challenges), and engagement techniques
  (gamification, adaptive paths, streaks, AI coaching, community learning). Produces a Markdown
  report with per-method analysis, scientific evidence, app examples, advantages/disadvantages,
  ideal use cases, and a prioritized implementation roadmap.
  Use whenever someone asks about: instructional design for mental health apps, how to teach mental
  health concepts, what exercises to put in a wellness/meditation/CBT app, best methods for mental
  health education, engagement techniques for therapy apps, learning activities for mindfulness
  apps, content formats for psychoeducation apps, or research on teaching methods for mental wellness.
  Also trigger on: "how should we teach X in the app", "what learning methods work for mental health",
  "best exercises for a wellness app", "research mental health app pedagogy", or any request to
  audit/compare instructional approaches for a health/wellbeing product.
---

# Mental Health App — Instructional Design Research Skill

Produces a structured, evidence-backed research report on instructional methods and exercises
best suited for mental health learning apps.

---

## Phase 1 — Requirements Interview

Ask clarifying questions before doing any research. Start with this core set, then add follow-ups
only if an answer is ambiguous or reveals a new dimension that matters for the research scope.

### Core questions (always ask)

1. **Target audience** — Who uses this app? (general public, teens, adults with clinical conditions,
   therapists, caregivers, employees in workplace wellness programs, etc.)

2. **Primary learning goal** — What should users be able to *do* or *feel* after using the app?
   (build coping skills, understand their condition, form daily habits, reduce anxiety, etc.)

3. **Platform and interaction constraints** — What's supported? (no video support, audio-only,
   text-only, touch gestures, accessibility requirements, etc.) Be explicit — this gates which
   formats are viable.

4. **Existing approach** — Does the app already have a pedagogical direction or content already
   built? Is this greenfield research or a gap analysis?

5. **Output focus** — Should the report cover *all* method categories broadly, or go deep on a
   specific subset? (e.g., "only exercises", "only engagement mechanics", "only delivery formats")

### Follow-up triggers

- If audience includes minors → ask about trauma-informed and age-appropriate design constraints
- If clinical conditions are mentioned → ask whether content is adjunctive to therapy or standalone
- If gamification is mentioned → ask about risk tolerance for over-gamification (trivializing mental health)
- If the user says "everything" → confirm they want the full breadth report with roadmap

Gather all answers before moving to Phase 2. Do not start research until the interview is complete.

---

## Phase 2 — Research

Invoke the `deep-research` skill, passing it a research brief built from the interview answers.

Construct the brief to cover these domains (filter based on what's in-scope per the interview):

### Research domains

**A. Content delivery formats**
- Interactive stories / narrative scenarios / case studies
- Podcast and audio lessons
- Swipeable cards and carousels
- Short-form animations
- Chat-based / conversational learning
- Journaling prompts as content delivery
- Visual infographics
- Microlearning lessons (< 5 min modules)
- Guided exercises and meditations
- Role-play and simulations

**B. Learning activities and assessments**
- True/False, Multiple-choice, Multiple-select
- Fill-in-the-blank, Matching, Drag-and-drop
- Scenario-based decision making
- Reflection questions
- Mood check-ins
- Journaling exercises
- Habit tracking
- Quizzes and flashcards
- Polls and knowledge checks
- Daily challenges
- Goal-setting exercises
- Progress reviews
- Personalized feedback

**C. Engagement techniques**
- Gamification: XP, levels, streaks, badges
- Personalized learning paths
- Adaptive content (difficulty/topic adjusts to user)
- Notifications and reminders
- Rewards and achievements
- Community and social learning
- AI coaching and conversational guidance
- Daily check-ins
- Habit formation techniques (implementation intentions, cue-routine-reward)

**D. Mental health education best practices**
- Trauma-informed learning design
- Evidence-based teaching approaches (CBT-informed, ACT-informed, positive psychology)
- Cognitive load reduction in sensitive topics
- Accessibility and inclusive design
- Motivation and retention strategies (self-determination theory, spaced repetition)
- Ethical considerations and user safety
- Crisis safety design patterns

For each item across all domains, the research should surface:
- How it works mechanically
- Why it's effective specifically for mental health education (not just generic education)
- Advantages and disadvantages in this context
- Ideal use cases (topic types, audience types)
- Examples from successful apps (Headspace, Calm, Woebot, Wysa, BetterHelp, Duolingo, Noom,
  Happify, MoodMission, What's Up, Sanvello, etc.)
- Scientific evidence or supporting research (cite study authors/year where possible)

---

## Phase 3 — Report Generation

After research completes, synthesize the findings into the following structured Markdown report.
Save the report to `docs/mh-instructional-design-report.md` (create the file, do not just print inline).
Also print a short executive summary inline so the user can see it immediately.

### Report structure

```
# Mental Health App — Instructional Design Research Report

## Executive Summary
3–5 bullets: the most important findings, the recommended core stack, the biggest risks to avoid.

## Methodology Note
What was researched, what was out of scope (per the interview), date of research.

## Part 1: Content Delivery Formats
For each format:
### [Format Name]
**How it works:** ...
**Why it's effective for mental health education:** ...
**Advantages:** ...
**Disadvantages:** ...
**Ideal use cases:** ...
**App examples:** ...
**Evidence:** ...

## Part 2: Learning Activities & Assessments
(same per-item structure)

## Part 3: Engagement Techniques
(same per-item structure)

## Part 4: Mental Health Education Best Practices
(same per-item structure)

## Part 5: Comparative Analysis
A table or structured comparison of formats/activities ranked by:
- Engagement potential
- Learning retention
- Effort to implement
- Risk level (can trivialize or retraumatize if misused)

## Part 6: Recommended Stack for [App Name/Audience from interview]
The optimal combination of 6–10 methods tailored to the specific context from the interview.
Explain why each was chosen and how they work together.

## Part 7: Prioritized Implementation Roadmap
### Phase 1 — MVP (High impact, low risk, low implementation effort)
### Phase 2 — Core Engagement Layer (Medium effort, high retention payoff)
### Phase 3 — Advanced Personalization (High effort, high ceiling)
For each phase: what to build, why in this order, what to validate before proceeding.

## Appendix: Research Sources
Numbered citations.
```

---

## Constraints and quality standards

- No video content in recommendations unless the interview explicitly confirms video is supported.
- All recommendations must be grounded in cited evidence, not just intuition.
- Flag any method that carries meaningful risk in a mental health context (e.g., gamification can
  trivialize distress; leaderboards can harm users with low engagement; some reflection prompts
  can be retraumatizing). Call this out explicitly — do not soft-pedal it.
- Respect the platform constraints from the interview throughout — never recommend a format that
  was ruled out.
- The roadmap must be specific and actionable: "add streak mechanic" is worse than "add a 7-day
  streak for completing daily mood check-ins, with a compassionate reset message (not a shaming
  one) if the streak breaks."
- Do not conflate general education research with mental health–specific research — where evidence
  is specific to mental health contexts, say so; where it's borrowed from general ed, say that too.