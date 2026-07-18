---
target: screenshots / src/components/exercise/steps/TextInputStep.tsx
total_score: 23
p0_count: 0
p1_count: 2
timestamp: 2026-07-17T06-05-23Z
slug: src-components-exercise-steps-textinputstep-tsx
---
Method: dual-agent (A: 019f6eaa-4b7e-7360-b7e3-3c09b6d35921 · B: 019f6eaa-7672-7111-ab8d-68887e4fe0d7)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|------:|-----------|
| 1 | Visibility of System Status | 2 | Progress is visible, but the disabled Continue state does not explain what is required. |
| 2 | Match System / Real World | 2 | The AI examples are unrealistic and break therapeutic trust. |
| 3 | User Control and Freedom | 3 | Back exists, but tapping a suggestion appears to replace the input without clear confirmation. |
| 4 | Consistency and Standards | 2 | Tip, AI cards, input surface, voice affordance, and footer use competing visual languages. |
| 5 | Error Prevention | 2 | There is no direct visible rule like “write at least one sentence” near the disabled CTA. |
| 6 | Recognition Rather Than Recall | 3 | Prompt and camera-facts tip are useful; examples help only if they are credible. |
| 7 | Flexibility and Efficiency | 2 | Voice and suggestions exist, but both are unclear relative to the primary writing task. |
| 8 | Aesthetic and Minimalist Design | 2 | Too many helper layers appear before the user reaches the actual input. |
| 9 | Error Recovery | 2 | Bad suggestions cannot be dismissed or reported; invalid empty state is not explained. |
| 10 | Help and Documentation | 3 | The CBT guidance is conceptually strong but should be shorter and closer to the input. |
| **Total** | | **23/40** | **Functional but not distilled; AI suggestions damage trust.** |

## Anti-Patterns Verdict

**LLM assessment**: The surface is calm, but it has obvious AI-assisted product slop: sparkle-prefixed examples, repeated bordered rows, soft gray labels, an oversized empty text area, and a generic sage/white CBT palette. The biggest issue is not the visual style alone; it is that the screen asks for a personal stressful event but leads with robotic generated examples like “new bird… don’t want to see it.” That makes the product feel unserious at a trust-critical moment.

**Deterministic scan**: `detect.mjs` returned exit code `0` and `[]` findings for `src/components/exercise/steps/TextInputStep.tsx`, `src/components/exercise/SuggestionCards.tsx`, `src/components/exercise/steps/StepLayout.tsx`, and `src/components/GlowyInput.tsx`. The detector did not flag known slop patterns. This is a false sense of safety: the problem is higher-level product judgment, hierarchy, and generated-content quality.

**Visual overlays**: No reliable overlay is available. The target was supplied as static screenshots, not a live URL or mutable DOM/browser target, so browser injection was skipped.

## Overall Impression

The screen has the right core prompt and the right therapeutic constraint. “What happened?” plus “facts a camera could capture” is strong CBT UX. The execution buries that strength under generic AI suggestions and a busy stack of support elements. The screen should feel like a quiet writing moment; currently it feels like a suggestion picker with a journal field attached.

## What's Working

- The title “What happened?” is plain, direct, and emotionally appropriate.
- The camera-facts tip is the strongest piece of UX copy on the screen because it prevents interpretation spirals.
- The fixed bottom CTA and Back action fit a contained mobile exercise flow.

## Priority Issues

### [P1] AI examples undermine trust

**Why it matters**: The generated suggestions are absurd and synthetic, which makes the app feel unserious. In a mental-health flow, bad examples are worse than no examples.

**Evidence**: AI suggestions are rendered before the input in `src/components/exercise/steps/TextInputStep.tsx:134`, then each suggestion is shown as a selectable card in `src/components/exercise/SuggestionCards.tsx:61`.

**Fix**: Rename “AI Suggestions” to “Examples” or “If you’re stuck,” hide it behind an optional disclosure, and use one or two realistic CBT examples. Do not lead with generated filler.

**Suggested command**: `$impeccable clarify src/components/exercise/SuggestionCards.tsx`

### [P1] The main writing task is visually late

**Why it matters**: The user must pass through tip text and suggestion cards before reaching the writing surface. That reverses the task hierarchy: support should follow the action, not precede it.

**Evidence**: Tip content renders at `src/components/exercise/steps/TextInputStep.tsx:102`, suggestions render at `src/components/exercise/steps/TextInputStep.tsx:123`, and the actual input begins later at `src/components/exercise/steps/TextInputStep.tsx:151`.

**Fix**: Reorder to: heading → input → compact camera-facts hint → optional examples. The first interactive surface should be the user’s own field.

**Suggested command**: `$impeccable distill src/components/exercise/steps/TextInputStep.tsx`

### [P2] Layout rhythm is stacked, not composed

**Why it matters**: The screen uses repeated bottom margins and card rows, producing a feed-like stack rather than a focused exercise step.

**Evidence**: The tip uses `mb-6` in `src/components/exercise/steps/TextInputStep.tsx:104`; suggestion groups use `mb-6` and repeated cards in `src/components/exercise/SuggestionCards.tsx:55` and `src/components/exercise/SuggestionCards.tsx:69`.

**Fix**: Make the writing field the dominant block. Compress examples into a lighter shelf or one-line expansion below the input.

**Suggested command**: `$impeccable layout src/components/exercise/steps/TextInputStep.tsx`

### [P2] Typography is too muted where clarity matters

**Why it matters**: Stressed users need high-confidence hierarchy. The subtitle and section labels look disabled rather than calmly secondary.

**Evidence**: Header subtitle uses an H3 variant with opacity styling in `src/screens/ThoughtReframingScreen/components/StepHeader.tsx:26`; suggestion section title uses muted body-bold in `src/components/exercise/SuggestionCards.tsx:57`.

**Fix**: Use fewer type roles: strong title, readable body subtitle, small but higher-contrast support label. Stop using gray as the main hierarchy tool.

**Suggested command**: `$impeccable typeset src/components/exercise/steps/TextInputStep.tsx`

### [P2] Input visual language feels like a chat toy

**Why it matters**: The reflective task should feel like journaling, not like a chatbot composer. The wave button and glow compete with the exercise’s calm clinical/editorial intent.

**Evidence**: `GlowyInput` uses a large rounded composer surface at `src/components/GlowyInput.tsx:399` with voice action styling at `src/components/GlowyInput.tsx:449`.

**Fix**: Use a quiet journaling surface by default. Reserve glow for focus only, reduce voice prominence, and make the placeholder readable enough to meet contrast requirements.

**Suggested command**: `$impeccable quieter src/components/GlowyInput.tsx`

### [P3] Plus icons imply the wrong interaction model

**Why it matters**: A plus icon suggests adding multiple items. Here, tapping a suggestion fills/replaces one text field.

**Evidence**: Unselected suggestions render a plus icon in `src/components/exercise/SuggestionCards.tsx:86`.

**Fix**: Use “Use” text, a chevron, or no trailing icon. If suggestions replace input, make that explicit.

**Suggested command**: `$impeccable polish src/components/exercise/SuggestionCards.tsx`

## Persona Red Flags

**Jordan (First-Timer)**: Jordan may not know whether to type, tap a suggestion, or press the voice button first. The bad examples teach the wrong shape of answer.

**Sam (Accessibility-Dependent User)**: Sam gets muted labels, icon-only plus/check/mic controls, and a disabled Continue state with no nearby text explanation. The placeholder and subtitle need contrast review.

**Casey (Distracted Mobile User)**: Casey sees examples before the input and may remember the synthetic examples more than the actual task. Keyboard opening can leave the writing field cramped after a long suggestion stack.

## Minor Observations

- `ValidationMessage` is imported in `src/components/exercise/steps/TextInputStep.tsx:11` but not rendered here, which matches the critique: disabled state lacks local explanation.
- `maxLength` is accepted at `src/components/exercise/steps/TextInputStep.tsx:23` but not visibly enforced in the shown source path.
- The sparkle emoji in suggestions makes generated text feel more decorative than clinically grounded.

## Questions to Consider

- Should this step be a writing screen with optional examples, or an example-selection screen with a custom input fallback?
- What is the minimum help a stressed user needs before they start typing?
- Would this still feel premium if every AI suggestion disappeared?
