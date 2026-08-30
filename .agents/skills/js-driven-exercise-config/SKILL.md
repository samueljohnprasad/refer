---
name: js-driven-exercise-config
description: Use when exercise types require different UI, interaction, navigation, feedback, layout, presentation, capabilities, or behavior and those differences risk becoming scattered conditional logic across the codebase.
---

# JS-Driven Exercise Configuration

## Overview

Exercise-specific variation should be declarative and configuration-driven whenever practical.

The core architecture is:

```text
Exercise Config JS
    ↓
Parse + validate
    ↓
Global defaults
    ↓
Exercise-type preset
    ↓
Exercise-level overrides
    ↓
ResolvedExerciseConfig
    ↓
Generic renderer/components
```

The guiding rule is:

Exercise identity selects configuration. Components consume configuration.

Avoid:

Exercise identity → scattered conditional logic → special cases throughout components.

Prefer:

JS → resolved behavior → generic reusable components.

The goal is to reduce cognitive complexity, keep behavior discoverable, avoid duplicate sources of truth, and make future changes possible without editing many rendering components.

## Core Principle

Use JS when a difference describes:

* what an exercise shows
* what an exercise hides
* what an exercise allows
* how an exercise behaves
* how it is laid out
* how navigation works
* how feedback works
* how answers behave
* what capabilities exist
* what interaction mode is used
* what completion behavior occurs
* what presentation variant is used

Keep logic in code when it describes:

* a complex algorithm
* domain computation
* data transformation
* state-machine internals
* animation implementation
* complex gesture implementation
* network/database behavior
* genuinely unique business logic
* genuinely unique component implementation

Configuration selects behavior.

Code implements behavior.

## The Main Rule

Before adding logic like:

```javascript
if (exercise.type === "LearnCards") {
  ...
}
```

or:

```javascript
switch (exercise.type) {
  ...
}
```

or:

```javascript
const showSomething =
  exercise.type === "A" ||
  exercise.type === "B";
```

stop and ask:

Is this difference actually a reusable exercise capability or presentation choice?

If yes, move the decision to the global JS configuration.

### Bad Architecture

```javascript
function ExerciseScreen({ exercise }) {
  const showSubtitle =
    exercise.type !== "LearnCards" &&
    exercise.type !== "RecallWarmup";

  const showSkip =
    exercise.type !== "CourseCheckpoint";

  const allowRetry =
    exercise.type === "RecallWarmup" ||
    exercise.type === "GuidedDiscoveryTrail";

  const progressMode =
    exercise.type === "LearnCards"
      ? "cards"
      : "lesson";

  ...
}
```

Problems:

* component knows too many exercise identities
* adding an exercise requires editing rendering logic
* behavior becomes scattered
* similar rules get duplicated
* cognitive complexity increases
* exercise behavior is difficult to inspect
* config and component logic can disagree

### Preferred Architecture

`exerciseTypes`:

```javascript
  learn_cards:
    presentation:
      showSubtitle: false

    progress:
      mode: cards

  recall_warmup:
    presentation:
      showSubtitle: false

    feedback:
      retryMode: until_correct

  guided_discovery_trail:
    feedback:
      retryMode: until_correct

  course_checkpoint:
    actions:
      secondaryAction: none
```

Renderer:

```javascript
const config = resolveExerciseConfig(exercise);

return (
  <>
    {config.presentation.showSubtitle && (
      <Subtitle />
    )}

    <Progress mode={config.progress.mode} />

    <ExerciseFeedback
      retryMode={config.feedback.retryMode}
    />

    <ExerciseActions
      config={config.actions}
    />
  </>
);
```

The component understands behavior.

It does not understand exercise-specific policy.

## Configuration Structure

Group configuration semantically.

Recommended top-level shape:

```javascript
schemaVersion: 1

defaults:
  presentation: {}
  layout: {}
  progress: {}
  interaction: {}
  answers: {}
  feedback: {}
  navigation: {}
  actions: {}
  assistance: {}
  media: {}
  animation: {}
  accessibility: {}
  capabilities: {}
  completion: {}

presets: {}

exerciseTypes: {}
```

Avoid one giant flat configuration:

```javascript
showSubtitle: false
showInstructions: true
showProgress: true
enableRetry: true
enableSwipe: false
showAudio: true
showTakeaway: true
...
```

Semantic grouping makes the config easier to scan and extend.

## Global Defaults

Define behavior that applies to most exercises once.

Example:

```javascript
defaults:

  presentation:
    showTitle: true
    showSubtitle: false
    showInstruction: false
    showLabels: false
    density: low

  layout:
    variant: standard
    scrollMode: auto
    footerMode: sticky

  progress:
    mode: lesson

  interaction:
    submissionMode: immediate
    revealMode: immediate

  feedback:
    mode: inline
    retryMode: none
    explanationMode: after_answer
    showTakeaway: false

  navigation:
    contentMode: single
    afterCorrect: continue
    exitBehavior: immediate

  actions:
    primaryAction: continue
    secondaryAction: none

  assistance:
    hints: false

  capabilities:
    audioPlayback: false
    imageSupport: true
    reset: false
```

Do not repeat these values in every exercise.

Exercise configurations should usually contain only deviations from defaults.

## Exercise-Type Overrides

Example:

```javascript
exerciseTypes:

  learn_cards:

    navigation:
      contentMode: paged

    progress:
      mode: cards

  recall_warmup:

    interaction:
      submissionMode: immediate

    feedback:
      retryMode: until_correct

  explorable_model:

    layout:
      variant: exploration

    interaction:
      inputMode: slider

    capabilities:
      reset: true

  dialogue:

    layout:
      variant: conversation

    navigation:
      contentMode: continuous

    capabilities:
      audioPlayback: true

  course_checkpoint:

    feedback:
      mode: inline

    completion:
      mode: celebration
```

## Exercise-Level Overrides

A specific exercise may need to differ from its type.

Example:

```javascript
exercise:
  id: sleep-pressure-recall
  type: recall_warmup

  feedback:
    retryMode: once
```

Resolution:

```text
defaults
   ↓
exercise type
   ↓
exercise override
```

Resolved result:

```javascript
feedback:
  mode: inline
  retryMode: once
  explanationMode: after_answer
  showTakeaway: false
```

Do not mutate global config at runtime for a single exercise.

Resolve an immutable final configuration.

## Optional Presets

Use presets only when several exercise types genuinely share the same behavior.

Example:

```javascript
presets:

  choice_exercise:

    interaction:
      inputMode: choice
      submissionMode: explicit

    answers:
      selectionMode: single
      layout: list

    feedback:
      mode: inline
```

Then:

```javascript
exerciseTypes:

  recall_warmup:
    extends: choice_exercise

    feedback:
      retryMode: until_correct
```

Keep inheritance shallow.

Recommended maximum:

```text
defaults
   ↓
optional preset
   ↓
exercise type
   ↓
exercise override
```

Avoid deep inheritance chains.

## Do Not Build Deep Inheritance

Avoid:

```text
default
 ↓
learning
 ↓
interactive
 ↓
question
 ↓
choice
 ↓
recall
 ↓
special-recall
 ↓
exercise
```

This becomes harder to understand than explicit code.

If understanding the final config requires following many inheritance layers, simplify it.

## Presentation Configuration

Use for recurring presentation differences.

```javascript
presentation:
  showTitle: true
  showSubtitle: false
  showInstruction: false
  showLabels: false
  showHelperText: false
  showTakeaway: true
  density: low
```

Good use cases:

* subtitle visibility
* instruction visibility
* helper text
* labels
* supporting copy
* metadata
* content density
* takeaway visibility

Avoid:

```javascript
if (exercise.type === "LearnCards") {
  hideSubtitle();
}
```

Prefer:

```javascript
if (config.presentation.showSubtitle) {
  renderSubtitle();
}
```

### Subtitle Example

Bad:

```javascript
const hideSubtitle =
  exercise.type === "LearnCards" ||
  exercise.type === "RecallWarmup";
```

Better:

```javascript
defaults:
  presentation:
    showSubtitle: false
```

Override only where required:

```javascript
exerciseTypes:

  guided_discovery_trail:
    presentation:
      showSubtitle: true
```

### Instruction Example

Bad:

```javascript
if (exercise.type !== "LearnCards") {
  renderInstruction();
}
```

Better:

```javascript
presentation:
  showInstruction: true
```

The renderer asks:

Should I render an instruction?

It should not ask:

Is this one of the exercise types where instructions exist?

### Labels Example

Bad:

```javascript
if (exercise.type === "MythReality") {
  showLabels();
}
```

Better:

```javascript
presentation:
  labelMode: contrast
```

Possible values:

```javascript
labelMode:
  - none
  - standard
  - contrast
```

Prefer semantic modes when multiple meaningful states exist.

## Layout Configuration

Example:

```javascript
layout:
  variant: standard
  contentWidth: normal
  scrollMode: auto
  footerMode: sticky
  density: low
```

Possible variants:

```javascript
variant:
  - standard
  - compact
  - immersive
  - exploration
  - comparison
  - conversation
  - builder
```

Possible scroll modes:

```javascript
scrollMode:
  - auto
  - locked
  - continuous
```

Do not configure raw visual values unless absolutely necessary.

Bad:

```javascript
paddingTop: 27
cardHeight: 493
fontSize: 19
borderRadius: 22
```

Better:

```javascript
layout:
  density: compact
  variant: exploration
```

Design-system tokens should own pixels.

## Progress Configuration

Example:

```javascript
progress:
  mode: lesson
```

Possible values:

```javascript
mode:
  - none
  - lesson
  - steps
  - cards
```

Avoid:

```javascript
if (exercise.type === "LearnCards") {
  showDots();
}
```

Prefer:

```javascript
<Progress mode={config.progress.mode} />
```

Do not accidentally show multiple competing progress systems.

If one progress mode is active, nested components should not independently invent another progress indicator unless explicitly allowed.

## Interaction Configuration

Example:

```javascript
interaction:
  inputMode: choice
  submissionMode: explicit
  revealMode: immediate
  confirmationMode: none
```

Possible input modes:

```javascript
inputMode:
  - tap
  - choice
  - text
  - builder
  - drag
  - slider
  - audio
```

Possible submission modes:

```javascript
submissionMode:
  - immediate
  - explicit
```

Possible reveal modes:

```javascript
revealMode:
  - immediate
  - progressive
  - manual
```

Possible confirmation modes:

```javascript
confirmationMode:
  - none
  - before_submit
```

### Immediate vs Explicit Submission

Avoid:

```javascript
if (exercise.type === "MultipleChoice") {
  showCheckAnswer();
}
```

Prefer:

```javascript
interaction:
  submissionMode: explicit
```

Renderer:

```javascript
if (config.interaction.submissionMode === "explicit") {
  renderCheckAnswer();
}
```

## Answer Configuration

Example:

```javascript
answers:
  selectionMode: single
  layout: list
  shuffle: false
```

Possible selection modes:

```javascript
selectionMode:
  - single
  - multiple
  - ordered
```

Possible layouts:

```javascript
layout:
  - list
  - grid
  - inline
  - builder
```

Avoid:

```javascript
if (exercise.type === "ImageChoice") {
  renderGrid();
}
```

Prefer:

```javascript
<Answers layout={config.answers.layout} />
```

## Feedback Configuration

Example:

```javascript
feedback:
  mode: inline
  retryMode: until_correct
  explanationMode: after_answer
  showTakeaway: true
  haptics: result
```

Possible modes:

```javascript
mode:
  - none
  - inline
  - sheet
```

Possible retry modes:

```javascript
retryMode:
  - none
  - once
  - until_correct
```

Possible explanation modes:

```javascript
explanationMode:
  - never
  - after_answer
  - always
```

Possible haptic modes:

```javascript
haptics:
  - none
  - selection
  - result
```

### Wrong-Answer Retry Example

Bad:

```javascript
if (
  exercise.type === "RecallWarmup" ||
  exercise.type === "GuidedDiscoveryTrail"
) {
  allowRetry();
}
```

Better:

```javascript
feedback:
  retryMode: until_correct
```

Renderer:

```javascript
switch (config.feedback.retryMode) {
  case "none":
    ...
  case "once":
    ...
  case "until_correct":
    ...
}
```

Branching on behavior mode is fine.

Branching repeatedly on exercise identity is what should be avoided.

### Explanation Example

Bad:

```javascript
if (exercise.type === "MultipleChoice") {
  showExplanationAfterAnswer = true;
}
```

Better:

```javascript
feedback:
  explanationMode: after_answer
```

### Takeaway Example

Bad:

```javascript
if (exercise.type === "GuidedDiscoveryTrail") {
  showTakeaway();
}
```

Better:

```javascript
feedback:
  showTakeaway: true
```

## Navigation Configuration

Example:

```javascript
navigation:
  contentMode: single
  afterCorrect: continue
  exitBehavior: immediate
  autoAdvanceDelayMs: null
```

Possible content modes:

```javascript
contentMode:
  - single
  - paged
  - continuous
```

Possible after-correct modes:

```javascript
afterCorrect:
  - stay
  - continue
  - auto_advance
```

Possible exit behaviors:

```javascript
exitBehavior:
  - immediate
  - confirm
  - disabled
```

### Auto-Advance Example

Bad:

```javascript
if (exercise.type === "RecallWarmup") {
  setTimeout(next, 700);
}
```

Better:

```javascript
navigation:
  afterCorrect: auto_advance
  autoAdvanceDelayMs: 700
```

Only expose timing when exercises genuinely need different values.

Otherwise keep timing in the implementation/design system.

## Actions Configuration

Example:

```javascript
actions:

  primary:
    type: continue

  secondary:
    type: none
```

Possible primary actions:

```javascript
type:
  - continue
  - check_answer
  - try_again
  - complete
```

Possible secondary actions:

```javascript
type:
  - none
  - skip
  - reset
  - hint
```

### Button Label Example

Avoid:

```javascript
if (exercise.type === "LearnCards") {
  label = "Next card";
} else if (exercise.type === "MultipleChoice") {
  label = "Check answer";
} else {
  label = "Continue";
}
```

Prefer:

```javascript
actions:
  primary:
    type: continue
```

The action renderer knows that continue maps to the appropriate localized UI label.

Do not store display strings in configuration when a semantic action is enough.

### Skip Example

Bad:

```javascript
const showSkip =
  exercise.type !== "LearnCards" &&
  exercise.type !== "CourseCheckpoint";
```

Better:

```javascript
actions:
  secondary:
    type: none
```

or:

```javascript
actions:
  secondary:
    type: skip
```

## Assistance Configuration

Example:

```javascript
assistance:
  hints: true

  hintTrigger:
    mode: after_mistakes
    threshold: 2
```

Possible hint triggers:

```javascript
mode:
  - manual
  - after_mistakes
  - always
```

Avoid embedding arbitrary condition trees in JS.

Bad:

```javascript
ifWrong:
  when:
    attempts:
      greaterThan: 2
  then:
    showHint: true
```

Better:

```javascript
hintTrigger:
  mode: after_mistakes
  threshold: 2
```

Code knows how `after_mistakes` works.

JS selects the policy.

## Capabilities Configuration

Use capabilities for optional functionality.

```javascript
capabilities:
  hints: true
  audioPlayback: false
  imageSupport: true
  reset: false
  textInput: false
```

Capabilities describe what an exercise supports.

They should not describe implementation details.

### Audio Example

Bad:

```javascript
if (exercise.type === "Dialogue") {
  renderAudioControl();
}
```

Better:

```javascript
capabilities:
  audioPlayback: true
```

### Reset Example

Bad:

```javascript
if (exercise.type === "ExplorableModel") {
  showReset();
}
```

Better:

```javascript
capabilities:
  reset: true
```

## Media Configuration

Example:

```javascript
media:
  imageMode: hero
  audioMode: optional
```

Possible image modes:

```javascript
imageMode:
  - none
  - inline
  - hero
  - background
```

Possible audio modes:

```javascript
audioMode:
  - none
  - optional
  - required
```

## Animation Configuration

Use semantic animation modes.

```javascript
animation:
  revealMode: progressive
  completionMode: subtle
```

Avoid:

```javascript
durationMs: 437
springDamping: 14
springMass: 0.9
```

Those belong in the animation/design system.

Config should select intent:

```javascript
completionMode:
  - none
  - subtle
  - celebration
```

## Completion Configuration

Example:

```javascript
completion:
  mode: celebration
```

Possible values:

```javascript
mode:
  - standard
  - celebration
  - summary
  - none
```

Avoid:

```javascript
if (exercise.type === "CourseCheckpoint") {
  showCelebration();
}
```

## Accessibility Configuration

Use only when behavior genuinely differs.

```javascript
accessibility:
  announceDynamicChanges: true
  focusMode: content
```

Do not use configuration to opt exercises out of basic accessibility requirements.

Accessibility defaults should remain safe.

Exercise config may select behavior only when the interaction genuinely requires it.

## Content vs Behavior

Separate lesson content from UI behavior.

Example:

```javascript
exercise:

  content:
    title: Sleep pressure builds
    subtitle: See how sleep need changes.
    body: >
      Your need for sleep gradually increases while you're awake.

  presentation:
    showSubtitle: false
```

Content answers:

*What content exists?*

Configuration answers:

*How should this exercise present and behave?*

Do not remove backend content merely because one renderer does not currently display it.

Likewise, do not force the UI to render every field simply because the backend supplies it.

### Backend-Driven Content Rule

Backend data availability must not automatically determine UI hierarchy.

For example, the backend may provide:

```javascript
content:
  title: Sleep pressure builds
  subtitle: See how sleep need and sleep stages change across a night.
```

The renderer may resolve:

```javascript
presentation:
  showSubtitle: false
```

That is valid.

The content exists.

The presentation config decides whether it earns visual space.

## Example: Learn Cards

```javascript
exerciseTypes:

  learn_cards:

    presentation:
      showSubtitle: false
      showInstruction: false
      showLabels: false
      density: low

    navigation:
      contentMode: paged

    progress:
      mode: lesson

    interaction:
      submissionMode: immediate

    actions:
      primary:
        type: continue
      secondary:
        type: none
```

## Example: Recall Warmup

```javascript
exerciseTypes:

  recall_warmup:

    interaction:
      inputMode: choice
      submissionMode: immediate

    answers:
      selectionMode: single
      layout: list

    feedback:
      mode: inline
      retryMode: until_correct

    navigation:
      afterCorrect: continue

    actions:
      primary:
        type: continue
```

## Example: Guided Discovery

```javascript
exerciseTypes:

  guided_discovery_trail:

    interaction:
      inputMode: tap
      revealMode: progressive

    feedback:
      retryMode: until_correct

    navigation:
      contentMode: single

    presentation:
      density: low
```

## Example: Teach Back

```javascript
exerciseTypes:

  teach_back_chain:

    interaction:
      inputMode: builder
      submissionMode: explicit

    layout:
      variant: builder

    assistance:
      hints: true

    feedback:
      mode: inline
```

## Example: Explorable Model

```javascript
exerciseTypes:

  explorable_model:

    layout:
      variant: exploration
      scrollMode: auto

    interaction:
      inputMode: slider
      revealMode: immediate

    feedback:
      mode: none

    capabilities:
      reset: true
```

## Example: Dialogue

```javascript
exerciseTypes:

  dialogue:

    layout:
      variant: conversation

    navigation:
      contentMode: continuous

    interaction:
      inputMode: choice

    capabilities:
      audioPlayback: true
```

## Example: What-If Machine

```javascript
exerciseTypes:

  what_if_machine:

    layout:
      variant: exploration

    interaction:
      inputMode: slider
      revealMode: immediate
      submissionMode: immediate

    capabilities:
      reset: true

    feedback:
      mode: inline
```

## Example: Course Checkpoint

```javascript
exerciseTypes:

  course_checkpoint:

    progress:
      mode: steps

    interaction:
      submissionMode: explicit

    feedback:
      mode: inline
      retryMode: none

    completion:
      mode: celebration

    navigation:
      exitBehavior: confirm
```

## Prefer Semantic Modes Over Boolean Explosion

Bad:

```javascript
showFeedback: true
showInlineFeedback: true
showFeedbackSheet: false
showFeedbackModal: false
```

Better:

```javascript
feedback:
  mode: inline
```

Bad:

```javascript
isSingleSelect: true
isMultipleSelect: false
isOrdered: false
```

Better:

```javascript
answers:
  selectionMode: single
```

Bad:

```javascript
useNormalLayout: false
useExplorationLayout: true
useCompactLayout: false
```

Better:

```javascript
layout:
  variant: exploration
```

Whenever several booleans represent mutually exclusive states, use an enum/mode instead.

## Avoid Exercise Lists

Bad:

```javascript
hideSubtitleFor:
  - learn_cards
  - recall_warmup
  - layer_zoom
```

Bad:

```javascript
retryExercises:
  - recall_warmup
  - guided_discovery_trail
```

Bad:

```javascript
specialLayouts:
  - explorable_model
  - what_if_machine
```

These preserve identity-based thinking.

Prefer:

```javascript
learn_cards:
  presentation:
    showSubtitle: false
recall_warmup:
  feedback:
    retryMode: until_correct
explorable_model:
  layout:
    variant: exploration
```

Configure behavior at the source.

## Avoid Special Flags

Do not create:

```javascript
isSpecialExercise: true
useNewLayout: true
useV2Footer: true
isModernExercise: true
legacyMode: false
```

These names describe implementation history, not behavior.

Prefer:

```javascript
layout:
  variant: exploration
actions:
  footerMode: primary_only
feedback:
  mode: inline
```

Config names should describe intent.

## Naming Rules

Good names:

* showSubtitle
* selectionMode
* feedbackMode
* retryMode
* revealMode
* contentMode
* layoutVariant
* submissionMode
* exitBehavior

Bad names:

* specialMode
* isDifferent
* useNewThing
* v2
* legacy
* fixedLayout
* hackMode
* isLearnCard

Configuration should remain understandable months later without reading implementation history.

## Avoid Negative Double Logic

Bad:

```javascript
disableNoSubtitle: false
```

Bad:

```javascript
dontHideSkip: true
```

Prefer:

```javascript
showSubtitle: false
```

Or better, if the behavior has multiple states:

```javascript
actions:
  secondaryAction: none
```

Explicit semantic modes usually scale better than negative booleans.

## Do Not Put Programming Logic in JS

Bad:

```javascript
onWrongAnswer:
  if:
    attempts:
      greaterThan: 2
  then:
    display:
      hint: true
```

Bad:

```javascript
rules:
  - when: score > 5 && attempt < 3
    action: show_hint
```

Bad:

```javascript
script: |
  if (answer.correct) ...
```

This turns JS into a programming language.

Prefer:

```javascript
assistance:
  hintTrigger:
    mode: after_mistakes
    threshold: 2
```

Code implements the policy.

Configuration selects it.

## Do Not Build a Rules Engine

Stop moving behavior into JS when configuration starts containing:

* arbitrary expressions
* scripts
* nested if
* deeply nested rule trees
* complex boolean expressions
* dependencies between many flags
* procedural steps
* executable code
* callbacks
* implementation algorithms

At that point, implement the behavior in code and expose only a semantic mode to configuration if useful.

## Keep Raw Design Tokens Out of Exercise Config JS

Usually do not configure:

```javascript
fontSize: 21
lineHeight: 27
paddingHorizontal: 18
borderRadius: 22
color: "#00AA66"
shadowOpacity: 0.2
```

Those belong in:

* design system
* theme
* component variants
* typography tokens
* spacing tokens

Exercise config should select semantic design variants:

```javascript
presentation:
  density: low

layout:
  variant: compact
```

not implementation values.

## Config Should Reduce Cognitive Complexity

Simply moving conditions from TypeScript into JS does not automatically improve the architecture.

Bad:

```javascript
isLearnCard: true
isSpecialLearnCard: false
useAlternateFooter: true
disableOldProgress: true
hideSecondThing: false
```

This only relocates complexity.

Better:

```javascript
progress:
  mode: lesson

actions:
  footerMode: primary_only

layout:
  variant: standard
```

A developer should be able to inspect the config and understand meaningful behavior immediately.

## One Source of Truth

Never keep both:

```javascript
learn_cards:
  presentation:
    showSubtitle: false
```

and:

```javascript
if (exercise.type === "LearnCards") {
  showSubtitle = false;
}
```

Once policy moves to configuration, remove the old identity-based rule.

Otherwise two sources of truth exist.

## Resolution Function

Centralize configuration resolution.

Example conceptual API:

```javascript
const config = resolveExerciseConfig({
  exerciseType: exercise.type,
  exerciseOverrides: exercise.config,
});
```

The function should:

* load global defaults
* apply optional preset
* apply exercise-type config
* apply exercise-level override
* validate result
* return strongly typed immutable config

Reusable components should receive the resolved config.

They should not repeat resolution logic.

## Strong Typing

JS must resolve into strong application types.

Example:

```typescript
type FeedbackMode =
  | "none"
  | "inline"
  | "sheet";

type RetryMode =
  | "none"
  | "once"
  | "until_correct";

type SubmissionMode =
  | "immediate"
  | "explicit";

type ProgressMode =
  | "none"
  | "lesson"
  | "steps"
  | "cards";
```

Example:

```typescript
interface ExerciseConfig {
  presentation: PresentationConfig;
  layout: LayoutConfig;
  progress: ProgressConfig;
  interaction: InteractionConfig;
  feedback: FeedbackConfig;
  navigation: NavigationConfig;
  actions: ActionsConfig;
}
```

Do not pass arbitrary unvalidated JS objects deep into components.

## Validation Is Mandatory

JS is flexible and easy to mistype.

Validate configuration at the earliest practical point.

Validate:

* required fields
* enum values
* unknown fields
* malformed JS
* unsupported combinations
* schema versions
* invalid overrides
* contradictory configuration

Reject:

```javascript
feedback:
  mode: banana
```

Reject contradictory states when appropriate:

```javascript
feedback:
  mode: none
  showTakeaway: true
```

unless the system explicitly defines that combination.

Prefer failing in development/build/test time rather than silently producing inconsistent UI.

## Schema Versioning

If the configuration schema is expected to evolve, include:

```javascript
schemaVersion: 1
```

Increment only for meaningful breaking schema changes.

Do not version every additive property.

Do not use names like:

```javascript
newConfig: true
v2Layout: true
```

to represent schema evolution.

## JS Quality Rules

Keep JS:

* declarative
* minimal
* predictable
* strongly validated
* version-controlled
* easy to diff
* grouped by concern
* free of executable logic
* explicit
* human-readable

Use explicit booleans:

```javascript
true
false
```

Avoid ambiguous forms:

```javascript
yes
no
on
off
```

Use enums when there are more than two meaningful states.

## Do Not Repeat Defaults

Bad:

```javascript
learn_cards:
  presentation:
    showSubtitle: false
    showInstruction: false
    showLabels: false
    density: low

  progress:
    mode: lesson

  feedback:
    mode: inline
    retryMode: none

  actions:
    primaryAction: continue
    secondaryAction: none
```

if all of those already match global defaults.

Better:

```javascript
learn_cards:
  navigation:
    contentMode: paged
```

Exercise config should highlight differences.

The smaller the override, the easier it is to understand what makes an exercise unique.

## Avoid Premature Configuration

Do not add a JS property simply because something might vary in the future.

Before adding a property, ask:

* Does this actually vary?
* Is it likely to vary again?
* Does this variation have stable semantics?
* Can multiple exercise types reuse it?
* Is config easier to understand than code?
* Can the value be validated?
* Does an existing mode already represent it?

If not, keep the implementation simple.

## Configuration Review Checklist

Before adding new configuration:

* Does this describe behavior rather than implementation?
* Is the name semantic?
* Can it use an existing mode?
* Would an enum be better than multiple booleans?
* Is it genuinely exercise-specific?
* Is the default sensible?
* Does it need to be in JS?
* Can it be strongly typed?
* Can it be validated?
* Will this remove identity-based branching?
* Does this introduce another source of truth?
* Does this make config easier or harder to understand?

## Before Adding an Exercise Conditional

Whenever you are about to write:

```javascript
if (exercise.type === ...)
```

classify the difference.

### Presentation difference

Examples:

* subtitle
* instructions
* labels
* takeaway
* helper text

Usually configuration.

### Layout difference

Examples:

* standard vs exploration
* builder vs conversation
* compact vs immersive

Usually configuration selecting a known layout variant.

### Navigation difference

Examples:

* auto advance
* continue
* paged content
* exit confirmation

Configuration.

### Feedback difference

Examples:

* inline vs sheet
* retry policy
* explanation behavior
* takeaway visibility

Configuration.

### Answer behavior difference

Examples:

* single select
* multi select
* ordered
* shuffled

Configuration.

### Interaction difference

Examples:

* tap
* drag
* slider
* text
* builder
* immediate submission

Configuration.

### Capability difference

Examples:

* hints
* audio
* reset
* image support

Configuration.

### Completely different implementation

Examples:

* specialized visualization algorithm
* unique drag physics
* custom simulation engine
* complex state machine

Code.

Config may select that implementation at an architectural boundary.

## Architectural Boundary Exception

Some exercise types genuinely require different top-level components.

This is acceptable:

```javascript
const renderer = rendererRegistry[config.layout.variant];

return renderer.render(exercise, config);
```

Or:

```javascript
const ExerciseComponent =
  exerciseRegistry[exercise.renderer];

return <ExerciseComponent ... />;
```

The problem is not all branching.

The problem is repeated identity-based branching scattered throughout reusable children.

Keep unavoidable branching at clear boundaries such as:

* renderer registry
* component registry
* interaction strategy factory

Then keep child components configuration-driven.

### Strategy Pattern Example

Instead of:

```javascript
if (type === "A") handleA();
else if (type === "B") handleB();
else if (type === "C") handleC();
```

use:

```javascript
const strategy =
  interactionStrategies[
    config.interaction.inputMode
  ];

strategy.handle(...);
```

Configuration chooses a known strategy.

The strategy implements behavior.

### Registry Example

```javascript
const layoutRegistry = {
  standard: StandardLayout,
  exploration: ExplorationLayout,
  conversation: ConversationLayout,
  builder: BuilderLayout,
};
```

Then:

```javascript
const Layout =
  layoutRegistry[config.layout.variant];
```

This is preferable to components knowing every exercise type.

## Migration Workflow

When migrating existing code:

1. Search for exercise-name and exercise-type checks.
2. List each conditional.
3. Identify what behavior each conditional actually controls.
4. Group conditionals by underlying capability.
5. Decide whether each belongs in config or implementation.
6. Reuse an existing semantic config property where possible.
7. Add the smallest new property only when needed.
8. Define sensible global defaults.
9. Add type-level overrides.
10. Add per-exercise override only if truly necessary.
11. Add validation.
12. Add strong types.
13. Resolve configuration centrally.
14. Replace identity-based rendering conditions with config reads.
15. Remove obsolete conditions.
16. Verify one source of truth remains.
17. Run tests.
18. Review whether config complexity actually decreased.

Do not mechanically convert every if into a boolean.

First understand the behavior behind the condition.

### Migration Example

Before:

```javascript
const showSubtitle =
  exercise.type !== "LearnCards" &&
  exercise.type !== "RecallWarmup";

const allowRetry =
  exercise.type === "RecallWarmup" ||
  exercise.type === "GuidedDiscoveryTrail";

const showSkip =
  exercise.type !== "CourseCheckpoint";

const progressMode =
  exercise.type === "LearnCards"
    ? "cards"
    : "lesson";
```

After:

```javascript
defaults:

  presentation:
    showSubtitle: true

  feedback:
    retryMode: none

  actions:
    secondary:
      type: skip

  progress:
    mode: lesson

exerciseTypes:

  learn_cards:

    presentation:
      showSubtitle: false

    progress:
      mode: cards

  recall_warmup:

    presentation:
      showSubtitle: false

    feedback:
      retryMode: until_correct

  guided_discovery_trail:

    feedback:
      retryMode: until_correct

  course_checkpoint:

    actions:
      secondary:
        type: none
```

Renderer:

```javascript
const config =
  resolveExerciseConfig(exercise);

const {
  presentation,
  feedback,
  actions,
  progress,
} = config;
```

No exercise identity is required in those child components.

## Testing

Configuration-driven behavior must be tested.

At minimum test:

* global defaults resolve correctly
* type overrides beat defaults
* exercise overrides beat type config
* presets resolve correctly
* invalid enums fail
* malformed JS fails
* unsupported fields fail when appropriate
* contradictory config fails
* optional values fall back correctly
* resolved config is strongly typed
* components honor resolved config
* old identity-based behavior has been removed
* default exercise behavior remains unchanged
* overridden exercise behavior works

### Test Behaviors, Not Only Parsing

Weak test:

```javascript
expect(parsedYaml).toBeDefined();
```

Better:

```javascript
expect(
  resolveExerciseConfig({
    type: "learn_cards",
  }).presentation.showSubtitle
).toBe(false);
```

Better:

```javascript
render(<Exercise config={config} />);

expect(
  screen.queryByText(subtitle)
).not.toBeVisible();
```

Test the actual behavior produced by configuration.

### Test Important Variants

Whenever a config value changes runtime behavior, test representative states.

Example:

```javascript
retryMode = none
retryMode = once
retryMode = until_correct
```

Do not necessarily test every combinatorial possibility.

Avoid creating unnecessary independent flags because configuration combinations multiply quickly.

## Configuration Complexity Warning

A configuration system can become more complex than the conditionals it replaces.

Warning signs:

* dozens of booleans
* flags depending on other flags
* contradictory combinations
* configuration that requires extensive comments
* multiple inheritance layers
* rules inside JS
* per-exercise raw styling
* duplicated defaults
* naming such as special, legacy, new, v2
* developers cannot predict the resolved config

If this happens, simplify the model.

### Preferred Mental Model

A developer should be able to open an exercise configuration and answer:

What makes this exercise behave differently?

within seconds.

Example:

```javascript
recall_warmup:

  interaction:
    inputMode: choice

  feedback:
    retryMode: until_correct
```

That is good configuration.

### Bad Mental Model

```javascript
recall_warmup:

  special: true
  useNewAnswers: true
  legacyRetry: false
  hideOldFooter: true
  disableStandardFlow: true
  mode2: true
```

This requires implementation knowledge to understand.

Configuration has failed its purpose.

## Minimality Principle

Do not configure what does not need to vary.

Keep standard behavior in:

* components
* design system
* interaction strategies
* default config

Keep only meaningful variation in exercise JS.

Minimal configuration is easier to review, debug, and maintain.

## Source Control

Exercise configuration should remain in version control with the code when practical.

Benefits include:

* diffs
* code review
* rollback
* reproducible behavior
* historical visibility
* easier debugging

Configuration changes should be reviewed with the same care as code changes because they change application behavior.

## Comments

Use JS comments sparingly.

Good:

```javascript
# Course checkpoints require deliberate confirmation
# because leaving discards checkpoint progress.
exitBehavior: confirm
```

Bad:

```javascript
# Set this to true to show subtitle
showSubtitle: true
```

Do not comment obvious syntax.

Comment intent or unusual constraints.

## Generic Config Example

```javascript
schemaVersion: 1

defaults:

  presentation:
    showTitle: true
    showSubtitle: false
    showInstruction: false
    showLabels: false
    showTakeaway: false
    density: low

  layout:
    variant: standard
    contentWidth: normal
    scrollMode: auto
    footerMode: sticky

  progress:
    mode: lesson

  interaction:
    inputMode: tap
    submissionMode: immediate
    revealMode: immediate
    confirmationMode: none

  answers:
    selectionMode: single
    layout: list
    shuffle: false

  feedback:
    mode: inline
    retryMode: none
    explanationMode: after_answer
    showTakeaway: false
    haptics: result

  navigation:
    contentMode: single
    afterCorrect: continue
    exitBehavior: immediate

  actions:
    primary:
      type: continue

    secondary:
      type: none

  assistance:
    hints: false

  capabilities:
    audioPlayback: false
    imageSupport: true
    textInput: false
    reset: false

  completion:
    mode: standard

presets:

  choice_exercise:

    interaction:
      inputMode: choice
      submissionMode: explicit

    answers:
      selectionMode: single
      layout: list

    feedback:
      mode: inline

exerciseTypes:

  learn_cards:

    navigation:
      contentMode: paged

  recall_warmup:

    extends: choice_exercise

    interaction:
      submissionMode: immediate

    feedback:
      retryMode: until_correct

  guided_discovery_trail:

    interaction:
      inputMode: tap
      revealMode: progressive

    feedback:
      retryMode: until_correct

  teach_back_chain:

    layout:
      variant: builder

    interaction:
      inputMode: builder
      submissionMode: explicit

    assistance:
      hints: true

  explorable_model:

    layout:
      variant: exploration

    interaction:
      inputMode: slider

    feedback:
      mode: none

    capabilities:
      reset: true

  dialogue:

    layout:
      variant: conversation

    navigation:
      contentMode: continuous

    capabilities:
      audioPlayback: true

  what_if_machine:

    layout:
      variant: exploration

    interaction:
      inputMode: slider
      submissionMode: immediate

    capabilities:
      reset: true

  course_checkpoint:

    interaction:
      submissionMode: explicit

    progress:
      mode: steps

    navigation:
      exitBehavior: confirm

    completion:
      mode: celebration
```

## Implementation Checklist

Before completing a config-driven change:

* Search for existing exercise-type/name conditionals related to the change.
* Identify the underlying behavior, not just the exercise names.
* Check whether an existing config property already represents it.
* Add a semantic property only if necessary.
* Prefer enum/mode over multiple booleans where appropriate.
* Add a sensible default.
* Add only necessary exercise overrides.
* Validate JS.
* Maintain strong typing.
* Resolve config centrally.
* Make reusable components consume config.
* Remove old identity-based conditions.
* Confirm one source of truth.
* Test defaults.
* Test overrides.
* Test invalid configuration.
* Run existing regression tests.
* Check that the config is simpler than the code it replaced.

## Review Checklist

Reject a change when it introduces:

```javascript
if (exercise.type === "...")
```

inside a reusable component for a behavior that could reasonably be configured.

Reject config such as:

```javascript
isSpecialExercise: true
```

when the underlying capability can be modeled explicitly.

Reject duplicated defaults.

Reject raw design tokens unless the variation genuinely needs them.

Reject procedural JS.

Reject deep inheritance.

Reject multiple sources of truth.

Reject new configuration that is not validated.

## Decision Table

| Difference | Usually Config? |
| :--- | :--- |
| Show/hide subtitle | Yes |
| Show/hide instruction | Yes |
| Show labels | Yes |
| Feedback style | Yes |
| Retry policy | Yes |
| Answer selection mode | Yes |
| Answer layout | Yes |
| Progress style | Yes |
| Navigation mode | Yes |
| Skip availability | Yes |
| Primary action | Yes |
| Auto advance | Yes |
| Hint availability | Yes |
| Hint policy | Yes |
| Layout variant | Yes |
| Content density | Yes |
| Audio capability | Yes |
| Reset capability | Yes |
| Completion mode | Yes |
| Raw font size | Usually no |
| Raw color | Usually no |
| Raw spacing | Usually no |
| Data transformation | No |
| Business/domain calculation | No |
| Complex state machine | No |
| Visualization algorithm | No |
| Gesture implementation | No |
| Database behavior | No |

## Quick Rule

When the requirement sounds like:

“This exercise should…”

it is often configuration.

Examples:

* This exercise should hide the subtitle.
* This exercise should allow retries.
* This exercise should use progressive reveal.
* This exercise should use an exploration layout.
* This exercise should not show Skip.
* This exercise should auto-advance.

These are policies.

JS is a good place for policies.

When the requirement sounds like:

“To perform this behavior, the system must…”

it is usually implementation.

Examples:

* To calculate the graph, interpolate these values.
* To animate the model, compute positions every frame.
* To validate the answer, compare these structures.

Those belong in code.

## Final Standard

The desired end state is:

```text
Exercise Config JS
     ↓
Resolved typed config
     ↓
Known UI/interaction strategies
     ↓
Generic components
```

A recurring exercise variation should normally be introduced by changing configuration:

```javascript
feedback:
  retryMode: until_correct
```

rather than adding another exercise identity check:

```javascript
if (
  exercise.type === "RecallWarmup" ||
  exercise.type === "GuidedDiscoveryTrail" ||
  exercise.type === "..."
) {
  ...
}
```

Exercise-specific policy belongs in centralized, validated configuration.

Reusable components should remain largely exercise-agnostic.

Configuration must reduce cognitive complexity rather than merely relocating it.
