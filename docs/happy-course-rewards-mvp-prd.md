# PRD: Happy Course Rewards and Celebrations — MVP

**Product:** Happy mental-health learning experience  
**Feature:** Journey-map rewards, unit trophies, and completion celebrations  
**Scope:** MVP only  
**Audience:** Product, design, curriculum, and implementation agents  
**Status:** Ready for repository discovery and implementation planning

---

## 1. Implementation instruction

Do not implement immediately after reading this PRD.

First inspect the Happy repository and identify how it currently represents:

- courses, sections, units, lessons/nodes, exercises, and checkpoints;
- required versus optional content;
- lesson, unit, and course completion;
- journey-map rendering and navigation;
- local and remote progress persistence;
- offline behavior and synchronization;
- state management and server state;
- animation, haptics, audio, modals, sheets, and completion screens;
- design tokens and reusable components;
- analytics, feature flags, and tests;
- production users and existing course progress.

Return a short repository discovery report and an implementation plan before modifying code. Map this PRD onto existing project concepts. Do not create duplicate progress models, introduce a new state-management library, or build a generalized rewards platform for the MVP.

---

## 2. Product summary

Happy will add a small, coherent reward loop to its mental-health course journey map:

> Complete a lesson → see useful progress → reach one unit chest → collect one insight → finish the unit → earn a trophy → finish the course → receive meaningful closure.

The MVP contains four user-facing features:

1. A lightweight celebration after completing a lesson.
2. One deterministic insight chest within eligible units.
3. A permanent trophy when a unit is completed.
4. A distinctive full-course completion celebration.

This feature takes inspiration from Duolingo's layered progress feedback, but it must fit mental-health education. Happy will celebrate learning and practice without scoring emotions, symptoms, disclosures, trauma, calmness, positivity, speed, perfection, or treatment outcomes.

---

## 3. Problem

When every completed lesson simply returns to the map, progress may feel mechanical. Learners may not clearly feel the difference between:

- finishing one small lesson;
- reaching the middle of a unit;
- developing a complete unit-level capability;
- finishing an entire course.

Conversely, giving every action a large celebration would interrupt learning, create cognitive load, and make important milestones feel ordinary.

The MVP must create a restrained hierarchy in which each significant level has a recognizably different response without building a large economy or achievement system.

---

## 4. MVP goals

1. Make lesson, unit, and course progress feel meaningfully different.
2. Add anticipation to the journey map using one visible chest in eligible units.
3. Connect every trophy and insight reward to something the learner actually learned.
4. Give the end of a course a clear, memorable conclusion.
5. Preserve a calm adult tone appropriate for learners who may be anxious, tired, distracted, ashamed, or emotionally activated.
6. Reuse Happy's existing architecture and design system.
7. Ensure rewards cannot be duplicated or lost during retries, app closure, or ordinary offline behavior supported by the project.
8. Ship a small foundation that can be expanded later without prematurely building currency, inventory, social sharing, or complex reward rules.

---

## 5. Success criteria

The MVP succeeds when:

- a newly completed lesson receives immediate, short acknowledgement;
- the learner can see an upcoming chest on the course path;
- reaching and opening the chest feels rewarding but does not pressure another lesson;
- the chest always grants the intended unit insight;
- the unit trophy clearly states the capability developed;
- the trophy remains visible after leaving and reopening the app;
- full course completion is unmistakable and does not look like an ordinary lesson result;
- simultaneous lesson, unit, and course events produce one coherent sequence rather than multiple repetitive screens;
- no completion condition uses sensitive mental-health information;
- completion and rewards survive supported interruption and synchronization scenarios;
- the experience works with Reduce Motion, sound disabled, and assistive technology.

---

## 6. Explicitly out of scope

The MVP must not include:

1. Section-completion celebrations.
2. Multiple chests per unit.
3. Common, rare, epic, or randomized chest tiers.
4. Gems, coins, currency, a shop, or paid chest keys.
5. A general reward inventory or collectible gallery.
6. XP boosts, timers, expiring rewards, or forced continuation.
7. Leaderboards or social comparison.
8. Course-completion sharing.
9. New streak mechanics.
10. Multiple reward categories.
11. Cosmetic map customization.
12. Reward selection or reward substitution flows.
13. New mastery/Legendary modes.
14. New assessments created only to justify a trophy.
15. Complex effort scoring for chest placement.
16. Cross-course reward reuse.
17. Historical celebration replay for all previously completed content.
18. A standalone achievements page.
19. Rewarding journal writing, mood logging, disclosure, or symptom change.
20. Locking essential lessons, safety guidance, crisis support, or coping tools behind rewards.

---

## 7. Mental-health safety principles

### 7.1 What Happy may celebrate

- Completing required educational content.
- Practising a taught skill.
- Retrieving or distinguishing a taught idea.
- Completing an existing course checkpoint.
- Correcting a misunderstanding and continuing.
- Completing a unit or course learning arc.

### 7.2 What Happy must never celebrate or score

- Reporting less anxiety, depression, distress, or other symptoms.
- Selecting a positive emotion.
- Disclosing a personal experience.
- Writing a longer or more intimate journal response.
- Saying that an exercise worked.
- Maintaining perfect coping behavior.
- Completing content quickly.
- Never making a mistake.
- Medication or treatment adherence.

### 7.3 Required tone

Use warm, factual language that names progress without exaggeration.

Preferred:

- “Lesson complete.”
- “You practised separating a prediction from a fact.”
- “Unit complete.”
- “You can now identify the parts of an anxiety loop.”

Avoid:

- “You conquered anxiety.”
- “You are healed.”
- “Your mental health is improving.”
- “Perfect mind!”
- “Never feel anxious again.”
- “You crushed it!” repeated after every lesson.

Course completion represents completion of education, not completion of treatment or guaranteed improvement.

---

## 8. MVP experience hierarchy

| Event | Treatment | Permanence |
|---|---|---|
| Lesson completed | Short completion surface | Existing lesson progress |
| Chest reached | Claimable chest on the journey map | Claim state and insight |
| Unit completed | Trophy transformation and capability message | Permanent trophy state |
| Course completed | Unique full-screen finale | Permanent course-complete state |

Correct-answer feedback remains part of existing exercise behavior and is not redesigned by this MVP.

---

## 9. Feature 1: lesson-completion celebration

### 9.1 Trigger

Trigger only when a required or recognized lesson/node transitions from incomplete to complete according to the project's canonical progress rules.

Replaying an already completed lesson must not be treated as a new first completion unless the existing product explicitly distinguishes review completion.

### 9.2 Required content

The completion surface contains:

1. A short title: “Lesson complete” or the existing equivalent.
2. One concise learning takeaway describing what became clearer or what was practised.
3. Existing progress information only if it is already meaningful and visually restrained.
4. One primary action: normally “Back to path” or the project's established equivalent.
5. A safe stopping route if the interface also encourages another lesson.

The takeaway should come from existing lesson outcome metadata when available. If the repository lacks appropriate metadata, the agent must propose the smallest validated content addition rather than generate runtime copy from arbitrary lesson titles.

### 9.3 Interaction sequence

1. Learner completes the final exercise.
2. Existing answer/completion feedback resolves.
3. Lesson progress is committed or safely staged using the existing architecture.
4. Completion UI appears without unnecessary waiting for analytics or secondary network requests.
5. Learner reads the takeaway.
6. Learner returns to the path or stops.

### 9.4 Visual behavior

- Use Happy's existing completion, mascot, illustration, animation, haptic, and sound primitives if present.
- The celebration should feel satisfying but should not visually compete with unit or course completion.
- Prefer one focal illustration/animation, one takeaway, and one primary CTA.
- Do not add dense statistics such as speed, rank, reward totals, or multiple performance cards.
- Do not use accuracy as praise if errors are an expected part of learning.

### 9.5 Collision behavior

- If the lesson completes a unit but not the course, the unit-completion flow replaces the normal lesson-completion surface or absorbs its takeaway.
- If the lesson completes the course, the course-completion flow absorbs both lesson and unit celebrations.
- The learner must not see three consecutive completion screens for one final action.

---

## 10. Feature 2: one insight chest per eligible unit

### 10.1 Purpose

The chest divides a longer unit into a psychologically manageable stretch and creates anticipation. It grants one optional but useful “Insight Card” connected to the unit's learning.

The Insight Card is the only MVP reward type.

### 10.2 Eligible units

- Units with fewer than four required lesson/nodes: no chest.
- Units with four or more required lesson/nodes: one chest by default.
- Curriculum authors may explicitly omit the chest when it would interrupt a sensitive or tightly connected learning flow.
- No unit may contain more than one chest in the MVP.

### 10.3 Placement

Use the following simple default when an authored position is absent:

- Place the chest after the required node closest to the unit midpoint.
- The chest must have at least one required node before it and at least one required node after it.
- Do not place it immediately before the unit trophy.
- Optional nodes do not determine the midpoint unless the existing course model treats them as progression requirements.
- If the calculated placement violates these constraints, omit the chest and record a validation warning rather than adding complex placement logic.

### 10.4 Chest states

The journey map must distinguish:

1. **Locked:** the required preceding progress is incomplete.
2. **Available:** the learner has reached the chest but has not opened it.
3. **Opening:** temporary user-initiated interaction state.
4. **Claimed:** reward was granted and remains accessible from the chest.
5. **Fallback/error:** the claim is safe, but presentation content or assets could not load.

These states must not rely on color alone.

### 10.5 Reaching the chest

1. Learner completes the node immediately before the chest.
2. After the appropriate completion flow, the journey map focuses on the newly available chest.
3. The chest changes from locked to available with restrained motion or a static accessible state change.
4. The learner decides when to tap it.
5. The chest must not open automatically.
6. The chest must not block closing the app or stopping the session.

Whether the chest must be opened before continuing along the path should follow the existing map's gating architecture. The recommended MVP behavior is that the chest is claimable but does not block the next lesson, because the reward is optional enrichment rather than required learning.

### 10.6 Opening the chest

1. Learner taps an available chest.
2. The claim action is protected against double taps.
3. The chest plays a short reveal animation.
4. The Insight Card appears with:
   - title;
   - one concise useful idea;
   - optional supporting visual already available in the product;
   - “Back to path” CTA.
5. The claim is durably recorded.
6. Tapping a claimed chest reopens the same Insight Card without replaying the full reward grant.

### 10.7 Insight Card requirements

The insight must:

- connect directly to the unit's learning outcome;
- reinforce or summarize a useful distinction;
- contain no essential information required to understand later lessons;
- be understandable without remembering hidden context;
- use adult, non-diagnostic language;
- avoid promises, prescriptions, or simplified neuroscience claims;
- fit on one focused surface without dense scrolling;
- be authored and validated with course content.

Example:

**Title:** A prediction is not a fact  
**Body:** Anxiety can make a possible outcome feel certain. Naming it as a prediction creates room to examine the evidence.

The implementation agent must not author the complete reward content for all courses unless separately requested. It must define and validate the mechanism and identify missing authored fields.

### 10.8 Determinism

- The reward is predefined by the unit or chest configuration.
- The same chest always reveals the same insight.
- No random selection, rarity, upgrade chance, probability, near-miss, or variable value is allowed.
- Repeated requests must not grant duplicate records.

---

## 11. Feature 3: unit trophy

### 11.1 Trigger

Earn the standard unit trophy when the unit becomes complete according to existing canonical rules.

The MVP must not invent a new exam. If the unit already ends with a checkpoint, synthesis, or application node, that existing requirement may remain part of completion. Otherwise, completing all required nodes earns the trophy.

Perfect accuracy and personal disclosure are never required.

### 11.2 Unit-completion flow

1. Learner completes the final required unit node.
2. Progress is safely recorded.
3. Normal lesson completion is absorbed into the unit flow.
4. The journey map or existing completion surface transitions to the unit trophy.
5. Show:
   - “Unit complete”;
   - unit title;
   - one “You can now…” capability statement;
   - one primary CTA to continue or return to the map.
6. Mark the trophy as permanently earned.
7. Unlock the next unit using existing prerequisite logic.

### 11.3 Capability statement

Every unit must have an authored capability statement or a validated equivalent derived from existing unit outcome metadata.

Preferred form:

> You can now [recognize, distinguish, explain, choose, sequence, rehearse, or apply a specific skill].

Good examples:

- “You can now identify the trigger, prediction, and response in an anxiety loop.”
- “You can now distinguish helpful planning from repetitive worry.”
- “You can now rehearse a short grounding sequence and choose when it may be useful.”

Bad examples:

- “You understand anxiety.”
- “You are less anxious now.”
- “You mastered your emotions.”
- “You successfully fixed your thinking.”

### 11.4 Persistent map state

- Earned trophy remains visible on the journey map.
- Tapping it may reopen the unit capability message or existing unit review destination.
- Reopening must not create another trophy grant.
- The trophy should use Happy's achievement color treatment and should remain visually distinct from current lesson nodes and the chest.

---

## 12. Feature 4: course-completion celebration

### 12.1 Trigger

Trigger when the course becomes complete according to existing required-content and prerequisite rules.

Optional content must not block course completion unless it is already explicitly required by the course schema.

### 12.2 Required experience

The course finale must be visually and structurally different from both lesson and unit completion.

It contains:

1. Clear title: “Course complete.”
2. Course title.
3. A warm acknowledgement of the effort involved.
4. Three to five concrete capabilities developed across the course.
5. A permanent course-complete visual or award state.
6. Available actions:
   - “Review course” or return to the completed map;
   - begin another relevant course only if the existing product already has an appropriate destination;
   - “Finish for now.”

### 12.3 Completion language

Recommended core message:

> You completed this course. You now have a set of ideas and skills you can return to when they are useful.

The finale must not imply that the learner has completed treatment, eliminated symptoms, or permanently mastered their mental health.

### 12.4 Capability summary

Capability statements should come from the course's authored outcome and its major unit outcomes. They should describe abilities, not list content consumed.

Prefer:

- notice a familiar pattern;
- distinguish between two responses;
- choose a fitting tool;
- rehearse a skill;
- explain a useful model.

Avoid:

- 24 lessons completed;
- 182 cards viewed;
- fastest lesson time;
- perfect-answer percentage;
- personal mood changes.

### 12.5 Collision handling

When the final lesson also completes its unit and the course:

- commit all relevant progress states;
- grant the unit trophy silently as part of the durable state;
- show only the course-completion flow;
- include the final unit capability in the course summary when relevant;
- do not show separate lesson and unit celebration screens first.

### 12.6 Re-entry

- The full finale is shown once for the original completion event.
- After dismissal, reopening the completed course shows a stable completed state rather than automatically replaying the finale.
- If the app closes before the learner sees the finale, it may be restored once on the next appropriate entry.
- The learner must always be able to revisit a static course-completion summary.

---

## 13. Visual design requirements

The agent must inspect and reuse Happy's real design system rather than inventing a parallel visual language.

Known direction:

1. Neutral base with intentional sage accents.
2. Sage for active states, brand moments, and primary actions.
3. Gold reserved for rewards, trophies, and rare achievement moments.
4. Terracotta reserved for warning and error states.
5. Do not make every completed item saturated green.
6. Primary CTA remains visually strongest.
7. Progress and supporting information remain quieter.
8. Reuse existing tactile depth, button, card, radius, border, typography, spacing, icon, and shadow patterns.
9. Selection and correctness colors remain separate from achievement colors.
10. Locked, available, claimed, and completed states must use more than color: icon, shape, label, or texture/state change.

### 13.1 Motion hierarchy

- Lesson completion: shortest and quietest.
- Chest opening: playful but user initiated.
- Unit trophy: more substantial than lesson completion.
- Course completion: largest and most distinctive.

Motion must never delay access to the result or CTA unnecessarily.

---

## 14. Accessibility

The MVP is incomplete unless all four flows are accessible.

Requirements:

- Respect system Reduce Motion and existing in-app preferences.
- Reduced-motion variants use fades and direct state changes instead of large movement or particle effects.
- No essential information appears only through animation, sound, haptic feedback, or color.
- Sound and haptics are optional enhancements.
- Use accessible roles, names, states, hints, focus order, and announcements.
- Do not repeatedly announce animated counters or decorative state changes.
- Support the text scaling and device sizes already supported by Happy.
- Avoid flashing effects.
- Chest opening must work with one standard activation and without precise timing or repeated rapid taps.
- Static fallbacks must provide the same title, capability, reward, and CTA information.

---

## 15. Minimal data and configuration requirements

These requirements are conceptual. The agent must map them onto existing schemas and types.

### 15.1 Content metadata

The system needs an equivalent of:

- lesson learning takeaway;
- optional unit chest placement or an explicit chest omission;
- unit Insight Card identifier/content reference;
- unit capability statement;
- course-completion capability list or inputs from which it is authored;
- stable identifiers and ordering.

### 15.2 Learner state

The system needs an equivalent of:

- lesson completion;
- chest locked/available/claimed state;
- reward identity granted by the chest;
- unit trophy earned state;
- course completed state;
- whether the one-time course finale has been consumed;
- source event or idempotency identity needed to prevent duplicates.

### 15.3 Architectural boundary

- Course configuration declares the milestone copy, placement override, and reward content.
- Existing canonical progress logic determines when requirements are satisfied.
- A minimal orchestration layer decides which single celebration should be displayed.
- Presentation components render the relevant state.
- Persistence follows existing project patterns.

Do not scatter course-specific conditions across individual screens. Do not build a generic rule language, reward service, inventory system, or remote experimentation framework for the MVP.

---

## 16. State and reliability rules

1. Lesson, unit, and course completion must use the project's canonical source of truth.
2. Chest availability and chest claiming are separate states.
3. Opening a chest must be idempotent.
4. Unit trophies are earned automatically and durably; they do not require a second claim action.
5. Course completion is durable even if the celebration fails to render.
6. Replaying completed lessons cannot re-grant chests or trophies.
7. Analytics failure cannot block learning progress or rewards.
8. Animation or asset failure cannot block navigation.
9. Double taps, retries, and repeated requests cannot duplicate reward grants.
10. Optional nodes must follow existing completion semantics.
11. Do not add backward compatibility or migration behavior until the repository inspection establishes whether real learner progress exists.

### 16.1 App interruption

If the app closes:

- after lesson completion but before acknowledgement: progress remains complete;
- after chest availability but before opening: chest remains available;
- during chest opening after claim commit: chest remains claimed and the Insight Card can be reopened;
- before claim commit: chest remains available;
- during unit celebration: trophy remains earned;
- before first course finale display: finale may resume once;
- after finale dismissal: do not replay it automatically.

### 16.2 Offline behavior

Follow existing project capability:

- If lessons already complete offline, the deterministic chest reward and milestone calculation must work within that architecture.
- If rewards require remote content, claiming should still preserve entitlement and show a retryable content state.
- Reconnection must not duplicate rewards.
- If the project does not support offline course completion, this feature does not introduce full offline infrastructure.

---

## 17. Minimal analytics

Use the project's existing analytics conventions and privacy rules.

Track only what is required to verify the MVP:

- lesson completion celebration shown;
- lesson completion celebration dismissed;
- chest became available;
- chest opened;
- insight shown;
- unit trophy earned;
- unit celebration shown;
- course completed;
- course finale shown;
- course finale dismissed;
- celebration fallback shown;
- duplicate claim prevented.

Allowed properties include stable course/unit/lesson/reward identifiers, platform, app version, offline status, new-versus-replay state, and Reduce Motion status when permitted by existing privacy policy.

Never send journal text, free-text exercise answers, symptom responses, mood, diagnosis, trauma disclosure, medication information, or other sensitive learner content.

The MVP must not optimize for maximum session duration. Useful measures are reliable completion, chest claim success, unit-to-unit continuation, course-finale acknowledgement, and failure rates.

---

## 18. Required repository discovery report

Before implementation, the agent must report:

1. Exact project hierarchy and completion rules.
2. Relevant file paths and module responsibilities.
3. Current content schema and validators.
4. Current journey-map components and visual states.
5. Canonical progress source and data flow.
6. Existing offline/sync behavior.
7. Existing completion, animation, haptic, sound, modal/sheet, and navigation primitives.
8. Existing theme tokens and reusable components.
9. Existing analytics and tests.
10. Whether production progress exists and migration is required.
11. Smallest schema additions necessary.
12. Smallest set of implementation slices.
13. Any contradiction between this PRD and current architecture.
14. Product decisions that remain genuinely unresolved.

The agent must recommend how to adapt the feature. It should ask the user only about decisions that materially alter behavior or scope.

---

## 19. MVP edge cases

Implementation and tests must cover:

1. Repeated final-exercise submission.
2. App closure before lesson celebration.
3. App closure before opening an available chest.
4. App closure during chest opening.
5. Reward committed but artwork/content fails.
6. Claimed chest tapped again.
7. Unit with fewer than four required nodes.
8. Unit with an invalid authored chest position.
9. Optional nodes completed before required nodes.
10. Replaying a completed lesson.
11. One lesson simultaneously completing the unit and course.
12. Reduce Motion enabled.
13. Sound or haptics unavailable.
14. Screen reader active.
15. Analytics unavailable.
16. Offline completion if currently supported.
17. Same account synchronization across devices if currently supported.
18. Existing learner who already completed a unit or course.

---

## 20. Acceptance criteria

### 20.1 Lesson completion

- Newly completed lessons receive one short completion experience.
- It contains an accurate learning takeaway or approved fallback.
- It does not show speed, rank, or sensitive mental-health metrics.
- It offers a clear return path and does not pressure continuation.
- Unit and course completion correctly replace it when applicable.

### 20.2 Chest

- Eligible units contain no more than one chest.
- Units shorter than four required nodes omit the chest by default.
- Default placement is near the required-node midpoint and never final.
- Locked, available, and claimed states are persistent and accessible.
- Opening is user initiated.
- Chest grants exactly one authored Insight Card.
- Claiming is deterministic and idempotent.
- Claimed chest can reopen the insight.
- Chest does not gate essential learning or start a timer.

### 20.3 Unit trophy

- Trophy is earned exactly once when canonical unit requirements are met.
- No new assessment is required solely for the trophy.
- Standard trophy does not require perfection or disclosure.
- Unit completion states one concrete capability.
- Trophy remains visible after restart and sync according to existing architecture.
- Next unit unlock uses existing prerequisite logic.

### 20.4 Course completion

- Course finale is visually distinct and shown once for initial completion.
- It absorbs the final lesson and unit celebrations.
- It lists three to five concrete learning capabilities.
- It never claims recovery, treatment success, or symptom improvement.
- Completed state remains revisit-able after dismissal.
- Learner can review, return to the map, or finish for now.

### 20.5 Reliability and accessibility

- No reward or trophy duplicates under retry or double tap.
- App interruption cannot erase valid completion.
- Asset, animation, analytics, or secondary-network failure cannot block progress.
- Reduce Motion has a complete alternative.
- Essential state is not communicated by color, motion, sound, or haptic alone.
- Automated tests cover core state transitions and collision handling.

---

## 21. Recommended implementation slices

The agent must revise these slices after repository discovery, but the MVP should remain approximately this size.

### Slice 1: Discovery and content contract

- Map existing architecture.
- Identify metadata gaps for takeaways, insights, and capability statements.
- Add or extend schema validation using existing patterns.
- Confirm behavior for existing progress.

### Slice 2: Lesson and unit completion

- Reuse/adapt the existing completion surface.
- Add celebration collision rules.
- Add unit capability message and persistent trophy state.
- Add core tests and analytics.

### Slice 3: Insight chest

- Add single-chest placement and validation.
- Add locked/available/claimed states.
- Add deterministic claim and Insight Card presentation.
- Add interruption, replay, and failure tests.

### Slice 4: Course finale and hardening

- Add unique course-completion flow.
- Absorb simultaneous completion events.
- Add revisit behavior.
- Verify accessibility, reduced motion, restart, offline behavior already supported, and lower-end device performance.

Do not expand a slice into currency, inventory, sharing, multiple reward types, generalized achievements, or new course assessments.

---

## 22. Test requirements

Use the project's existing test tools and conventions.

### Logic tests

- eligible versus ineligible unit chest placement;
- explicit omission and authored placement;
- chest availability;
- idempotent claim;
- lesson/unit/course collision selection;
- unit and course completion;
- replay behavior;
- optional-versus-required nodes.

### Component tests

- completion copy and CTA;
- chest locked/available/claimed/fallback states;
- Insight Card rendering;
- trophy state;
- course finale;
- Reduce Motion variants;
- accessibility roles, labels, states, and focus.

### Integration/end-to-end tests

- complete an ordinary lesson;
- reach and claim a chest;
- reopen a claimed chest;
- complete a unit and earn a trophy;
- complete the final unit and see only the course finale;
- close/reopen during each critical transition;
- retry completion without duplicate rewards;
- complete supported flows offline and synchronize, if the project already supports offline course progress.

---

## 23. Definition of done

The MVP is done only when:

1. Lesson completion, one eligible-unit chest, unit trophy, and course finale work end to end.
2. One deterministic Insight Card is the only chest reward type.
3. Unit and course outcomes provide accurate capability-focused copy.
4. Celebration collision rules prevent repetitive screen stacks.
5. Completion and claiming are durable and idempotent.
6. Existing project architecture, visual system, analytics, and test patterns are reused.
7. The experience is complete under Reduce Motion and without sound or haptics.
8. Essential mental-health content is never gated.
9. No sensitive emotional or personal data is scored or emitted in analytics.
10. All MVP acceptance criteria and critical automated tests pass.
11. Repository-specific architectural decisions are documented.
12. Deferred features remain unimplemented.

---

## 24. Agent handoff prompt

Use this prompt with the coding agent:

> Read this MVP PRD completely. Do not implement yet. First inspect the repository using Section 18 and return a repository-specific discovery report. Map the PRD's course, unit, lesson, completion, chest, trophy, and reward concepts onto the project's existing schema and runtime. Identify reusable components, the canonical progress source, required schema changes, existing-user migration impact, and the smallest implementation slices. Preserve the MVP exclusions. Do not introduce a new state library, currency, reward inventory, generalized achievement platform, random rewards, or parallel progress model. After the discovery report, provide a detailed implementation plan and wait for approval before editing code.

