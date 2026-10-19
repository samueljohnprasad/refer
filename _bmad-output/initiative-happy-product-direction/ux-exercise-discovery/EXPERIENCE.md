---
name: Happy Exercises — Experience Spine
description: The behavior and information architecture for discovering, continuing, and repeating Happy's educational CBT exercises.
status: final
sources:
  - ../../../../PRODUCT.md
  - ../../../../DESIGN.md
updated: 2026-10-18
---

# Happy Exercises — Experience Spine

`DESIGN.md` owns the visual identity and tokens. This spine owns information architecture, behavior, states, interaction, accessibility, and journeys. The two spines win over screenshots, mockups, or implementation details.

## Foundation

Happy is an iOS 26+ Expo mobile app. The Exercises surface is one part of the product loop: **Learn → Practice → Journal → Insight**. Exercises discovery must help a person understand a topic, choose a manageable practice, record what happened, and later see useful non-diagnostic patterns.

The surface keeps the existing three-part model: **Lessons**, **Practice**, and **My Log**. It does not add a new bottom-tab destination or split CBT tools away from learning. The default landing surface is Lessons, with the current or next useful item visible immediately.

The experience is anonymous-session friendly. It must not require signup or a paywall before the first useful lesson-to-practice loop is complete.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Exercises / Lessons | Exercises bottom tab; Home continuation link | Learn mental-health concepts through short courses and find the next linked practice |
| Exercises / Practice | Exercises segmented tab; linked lesson action | Start a known exercise, repeat a recent tool, or browse compact tools by intent |
| Exercises / My Log | Exercises segmented tab; completed exercise result | Review completed practices, dates, and user-entered reflections |
| Exercise session | Continue, Start, or Repeat action | Complete one text-led CBT or coping exercise with one clear step at a time |
| Journal entry | Exercise completion or explicit Journal navigation | Reflect privately on what the person noticed or practised |
| Timeline & Insights | Existing tracking/timeline route | Show sufficient, time-bounded, deterministic patterns; never diagnose |

### Lessons composition

Lessons is ordered by usefulness, not by catalogue completeness:

1. **Continue** — one featured in-progress or recommended exercise.
2. **Program progression** — CBT Core, Anxiety, Sleep, or another agreed learning program with completed, current, next, and locked states.
3. **Compact exercise rows** — individual tools inside each program.

Practice Again or recent items may use a limited horizontal shelf. The complete course structure remains vertically ordered and reachable without a carousel.

## Voice and Tone

Microcopy is plain-language, calm, and non-diagnostic. Explain what the person can do before naming the technique.

| Prefer | Avoid |
|---|---|
| “Notice what your mind is predicting” | “Correct your cognitive distortion” |
| “Question the thought that is making this moment harder” | “Fix your anxiety” |
| “Continue thought reframing” | “Resume protocol” |
| “Try this for 5 minutes” | “Complete treatment” |
| “Your practice is saved” | “Clinical progress achieved” |
| “Patterns may become clearer as you practise” | “We can diagnose your pattern” |

Technique labels such as Thought Catcher, Thought Reframing, Decatastrophizing, or ABC Analysis can appear as names and educational context. They must not be presented as a diagnosis, cure, or substitute for professional care.

## Component Patterns

Behavioral rules below reference visual tokens and components in `DESIGN.md`.

| Component | Use | Behavioral rules |
|---|---|---|
| Exercises header | All three Exercises surfaces | Keeps the surface title and existing completion/bookmark actions stable. Does not change meaning between tabs. |
| Surface tabs | Lessons / Practice / My Log | One selection at a time. Tapping a tab preserves the user's scroll position for that surface when practical. The selected state is announced to assistive technology. |
| ContinueCard | Lessons top section | At most one. Shows the next useful item and one primary action. Tapping the card or action opens the exercise or its next lesson step; no competing secondary CTA. |
| ProgramAnchor | Lessons program section | Introduces a learning theme and its progression. Tapping the anchor opens the program context, not an unrelated tool catalogue. Illustration is supportive and may be decorative. |
| ExerciseRow | Practice and program lists | Entire row is tappable, with a clearly labelled action. Shows title, user benefit, duration, and state. Does not require the user to understand a clinical label before acting. |
| PracticeAgainShelf | Practice and recent items | Bounded horizontal list with snap behavior and a visible next-item cue. No autoplay, no infinite pagination, and no hidden critical exercise behind horizontal scrolling. |
| ProgressIndicator | Programme and exercise state | Announces state as text as well as visually: Completed, Continue, Next, or Locked. XP is optional metadata and does not gate access to the first useful loop. |
| PictorialAnchor | Program and ContinueCard | One contained illustration per program or featured item. It never carries the only meaning of a control. Decorative art is excluded from the accessibility tree; meaningful art gets a concise label. |
| MyLogEntry | My Log | Shows what was completed, when, and the user's saved reflection summary where available. Tapping opens the saved result or journal context without rewriting the original response. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold load | Any Exercises surface | Preserve the header and tab structure. Use quiet loading placeholders that match the final vertical layout; do not flash an empty catalogue. |
| First visit | Lessons | Show the first useful course or exercise with one clear Start action. Avoid an empty-state wall or a signup gate. |
| Continue available | Lessons | Show one featured ContinueCard. The action says Continue when progress exists and Start when it does not. |
| Programme in progress | Lessons | Show completed, current, next, and locked states in vertical order. The current item receives the clearest action. |
| Completed exercise | Practice / My Log | Move the item into Practice Again or My Log, preserve its completion date, and make the next relevant action available. Do not force a celebratory interruption. |
| Empty My Log | My Log | Explain that completed practices will appear here and offer one action to view Lessons or Practice. Keep the message short and non-judgmental. |
| No recent practices | Practice | Show intent-based tools or the first program rows. Do not render an empty horizontal shelf with no useful content. |
| Locked or unavailable | Lessons / Practice | Explain the access state in plain language and preserve the visible course structure. Do not make locked content look like a failed load. The first useful educational path remains available. |
| Offline | Any surface | Show cached lessons, course state, and local progress when available. Allow a practice to continue locally where the existing runtime supports it; defer sync without losing the user's work. |
| Load or sync error | Any surface | Keep the last useful content visible and provide a compact retry action. Never replace the whole surface with a technical error. |
| Reduced motion | Any surface | Remove bounces, transitions, and press animation that are not needed for comprehension. State changes remain visible through text, layout, and color. |

## Interaction Primitives

- Tap to open a lesson, program, exercise, or log entry. Interactive targets are at least 44pt.
- Scroll vertically for the catalogue and program progression.
- Use horizontal scrolling only for bounded Practice Again or recent shelves. A partial next card is a cue, not a requirement for finding content.
- Tapping Continue opens the next incomplete step, not the top of a course the person already started.
- Back returns to the originating Exercises surface and restores its position where practical.
- Completing a lesson should offer the linked practice as the next action, preserving the Learn → Practice connection.
- Completing a practice should offer Journal as an optional next step and make the completed item visible in My Log.
- Save/bookmark actions are reversible and announce their new state.
- No autoplay, swipe-to-complete, or hidden gesture is required for progress.
- The exercise itself is text-led: one prompt, one response or choice, one clear Next action. Illustrations do not replace the prompt.

## Accessibility Floor

Behavioral accessibility is required in addition to the visual contrast rules in `DESIGN.md`.

- VoiceOver labels every exercise row with title, user benefit, duration, and state; for example, “Thought Reframing, question a difficult thought, 10 to 15 minutes, Continue.”
- The selected Lessons / Practice / My Log tab announces its state and remains reachable in reading order.
- Completed, current, next, and locked states are conveyed by text or accessible labels, not color alone.
- Decorative pictorial anchors are hidden from assistive technology. Meaningful illustrations have a concise label that describes orientation, not a medical interpretation.
- Dynamic Type must not truncate exercise titles, duration, or actions. Rows may grow vertically.
- Focus order follows the visual reading order: header, tabs, ContinueCard, program anchor, rows, then later sections.
- Reduced Motion removes non-essential bounce and transition effects while preserving immediate state feedback.
- Text remains readable on every tinted surface; essential copy never uses the muted token as its only contrast.

## Responsive & Platform

This contract targets iOS 26+ on phone-sized layouts. The existing safe-area behavior, native bottom navigation, keyboard handling, and system back gesture remain authoritative. There is no separate tablet, web, or Android layout in this UX pass.

At larger phone widths, content may gain breathing room but the information order does not change. At larger text sizes, cards and rows grow vertically rather than compressing into smaller type or horizontal overflow.

## Inspiration & Anti-patterns

Mobbin research was used as directional reference, not as a copy source. The recurring pattern across mental-health and adjacent learning products is visual program orientation paired with text-forward, vertically ordered actions.

| Reference | Observed pattern | Happy adoption |
|---|---|---|
| [Wysa on Mobbin](https://mobbin.com/screens/2801a904-7205-44dc-96bd-35b00dfb06dc) | Intent-oriented tool groups and approachable visual anchors | Use program-level anchors for CBT Core, Anxiety, and Sleep; keep the individual tool list compact |
| [Bloom program screen on Mobbin](https://mobbin.com/screens/2f015d99-0390-49b5-809e-853cba39e7a3) | Visual program framing with a clear course entry point | Use one featured Continue item, not a wall of equal cards |
| [Bloom course progression on Mobbin](https://mobbin.com/screens/c1eb668e-d109-4404-bd09-40ecc4cededb) | Vertical days/sessions with visible progression | Use completed/current/next/locked states in a vertical path |
| [Ahead CBT flow on Mobbin](https://mobbin.com/screens/456eee1e-9fd3-455b-85d0-c2da105acf68) | One focused question at a time with explicit progress | Keep CBT interactions text-led and stepwise |
| [Headspace on Mobbin](https://mobbin.com/screens/b0ec0b11-b683-4ddc-9a29-4968204769f6) | Recent content as a scannable vertical list with duration | Use compact rows for secondary and repeatable exercises |
| [Finch on Mobbin](https://mobbin.com/screens/a057550d-5b73-4af4-aa54-c28ff457e817) | Quick coping tools named by immediate user need | Lead with what the person can do, then show the technique label |

Rejected patterns:

- **All-horizontal exercise libraries:** they hide progression and make a learning system feel like a content carousel.
- **Equal 2-column card grids:** they flatten the difference between the next lesson, a repeat tool, and a locked item.
- **Technique-first clinical catalogue:** it asks a stressed person to understand CBT vocabulary before finding help.
- **Large illustration on every exercise:** it creates visual noise and competes with the user's reflection.
- **Generic gradients, sparkle assistants, and ghost-card stacks:** they signal template-driven AI wellness UI rather than Happy's calm, trustworthy identity.
- **Diagnosis or outcome promises:** they violate Happy's educational, non-diagnostic boundary.

## Key Flows

### Flow 1 — Continue the learning path (Anika, anxious before a difficult conversation)

1. Anika opens Happy after already learning about anxious thoughts.
2. Home or the Exercises tab brings her to Lessons, where the ContinueCard says “Thought Reframing.”
3. She sees the plain-language benefit and the short duration before choosing Continue.
4. The exercise opens at the next incomplete step, with one prompt and one clear response action.
5. She completes the practice and is offered Journal as the next optional step.
6. **Climax:** Anika finishes the linked practice without searching through a catalogue; the completed state is visible in My Log and the Learn → Practice connection makes sense.

Failure: if the next step cannot load, the last cached step remains visible with a retry action. Her existing response is not discarded.

### Flow 2 — Find a tool for the moment (Ravi, mind racing at night)

1. Ravi opens Exercises and taps Practice.
2. Practice Again shows a bounded shelf of tools he has used recently; below it, compact rows are grouped by intent such as Anxiety or Sleep.
3. He chooses a row labelled with a user benefit, such as “Put the worst-case story in perspective,” and sees the technique as supporting context.
4. He completes the short exercise and returns to Practice.
5. **Climax:** Ravi can repeat a useful tool in one or two taps without navigating a new product area or learning clinical terminology first.

Failure: if there are no recent practices, Practice opens directly to intent-based rows and one available starter exercise rather than an empty carousel.

### Flow 3 — Review practice and notice patterns (Maya, checking what has helped over two weeks)

1. Maya opens My Log from Exercises.
2. She sees completed exercises ordered by date with title, duration, and the reflection summary where available.
3. She opens one entry to revisit what she noticed; her original response remains intact.
4. She chooses Journal if she wants to add a private reflection, or returns to Lessons to continue the path.
5. **Climax:** Maya can connect a completed practice to her own reflection and later Timeline & Insights without Happy claiming a diagnosis or overstating what the data proves.

Failure: if there is not enough data for an insight, the app explains that more practice is needed and routes to one useful exercise. It does not manufacture a pattern.

## Assumptions & Open Questions

- `[ASSUMPTION]` Existing exercise and progress data can expose enough state to render Continue, completed/current/next/locked, recent, and My Log entries without changing the product's navigation model.
- `[ASSUMPTION]` The first build can use local placeholders or simplified custom pictorial anchors while final assets are produced.
- `[OPEN QUESTION]` Who produces the final CBT Core, Anxiety, Sleep, and featured-item illustrations, in which file format, and under what review gate?
- `[OPEN QUESTION]` Are the generated exploration previews discarded, redrawn, or used only as art-direction references? They are not approved production assets by default.
- `[OPEN QUESTION]` Which exact exercise completion threshold unlocks the first deterministic insight? This UX contract only requires truthful empty and insufficient-data states.

