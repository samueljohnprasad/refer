---
name: Happy Exercises — Design Spine
description: A calm, playful, text-led learning library for mental-health education and CBT practice.
status: final
sources:
  - ../../../../PRODUCT.md
  - ../../../../DESIGN.md
updated: 2026-10-18
colors:
  sage-50: '#f8fbf6'
  sage-100: '#e5ede1'
  sage-200: '#d3e0cd'
  sage-300: '#abc0a2'
  sage-500: '#5f7f58'
  sage-600: '#44633f'
  sage-700: '#29452a'
  sage-800: '#152714'
  canvas: '#F8FAF7'
  surface: '#ffffff'
  surface-soft: '#F7F7F7'
  ink: '#142414'
  ink-soft: '#767676'
  ink-muted: '#AFAFAF'
  border: '#E5E5E5'
  danger: '#e7000b'
  terracotta: '#FF4B4B'
  gold: '#FFD900'
  otter-blue: '#1CB0F6'
  macaw-purple: '#CE82FF'
typography:
  display:
    fontFamily: Nunito
    fontSize: 36px
    fontWeight: 800
    lineHeight: 39px
    letterSpacing: '-0.02em'
  headline:
    fontFamily: Nunito
    fontSize: 28px
    fontWeight: 800
    lineHeight: 32px
    letterSpacing: '-0.01em'
  title:
    fontFamily: Nunito
    fontSize: 22px
    fontWeight: 700
    lineHeight: 26px
  body:
    fontFamily: Nunito
    fontSize: 17px
    fontWeight: 400
    lineHeight: 24px
  label:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
  caption:
    fontFamily: Nunito
    fontSize: 13px
    fontWeight: 500
    lineHeight: 19px
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px
  3xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
components:
  button-primary:
    backgroundColor: '{colors.sage-500}'
    textColor: '{colors.surface}'
    typography: '{typography.body}'
    rounded: '{rounded.full}'
    height: 56px
    padding: '0 24px'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.full}'
    height: 48px
    padding: '0 20px'
  exercise-surface-tabs:
    backgroundColor: '{colors.surface-soft}'
    selectedBackgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    height: 48px
  continue-card:
    backgroundColor: '{colors.sage-100}'
    textColor: '{colors.ink}'
    borderColor: '{colors.sage-200}'
    rounded: '{rounded.2xl}'
    padding: '{spacing.xl}'
  program-anchor:
    backgroundColor: '{colors.sage-50}'
    textColor: '{colors.ink}'
    borderColor: '{colors.sage-200}'
    rounded: '{rounded.xl}'
    padding: '{spacing.lg}'
  exercise-row:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    borderColor: '{colors.border}'
    rounded: '{rounded.lg}'
    minHeight: 72px
  pictorial-anchor:
    backgroundColor: '{colors.sage-100}'
    rounded: '{rounded.xl}'
    maxSize: 128px
  progress-indicator:
    activeColor: '{colors.sage-600}'
    completeColor: '{colors.sage-500}'
    inactiveColor: '{colors.sage-200}'
---

## Brand & Style

The Exercises surface is a guided learning library, not a tool dump. It should feel like a quiet therapy notebook with the momentum of a well-made learning game: warm, clear, tactile, and inviting without becoming childish or clinical.

The visual rhythm is **Hero → Shelf → List**. One featured item establishes the next useful action. A vertical progression makes the course structure legible. Compact rows keep the catalogue scannable. A small number of custom pictorial anchors gives CBT Core, Anxiety, Sleep, and the featured item a memorable identity without turning every exercise into a decorated card.

The user's goal and next action lead. The illustration supports recognition; it never competes with the exercise title, the user's own words, or the primary action.

## Colors

- **Canvas and surface** — `{colors.canvas}` and `{colors.surface}` keep the library bright and non-clinical.
- **Sage progression** — `{colors.sage-50}` through `{colors.sage-200}` create gentle program grouping and current-state emphasis. `{colors.sage-500}` through `{colors.sage-700}` carry action, selection, and readable progress.
- **Ink** — `{colors.ink}` is the primary reading color. `{colors.ink-soft}` is supporting copy only when contrast remains readable. `{colors.ink-muted}` is reserved for unavailable or secondary metadata, never essential instructions.
- **Functional accents** — `{colors.gold}` marks earned reward value such as XP; `{colors.danger}` and `{colors.terracotta}` communicate errors or strong negative feedback only. `{colors.otter-blue}` and `{colors.macaw-purple}` are not generic decoration or assistant branding.

Illustrations use the existing palette. No new gradient or category color system is introduced for this surface.

## Typography

Nunito is used throughout. `{typography.display}` and `{typography.headline}` establish the Exercises title and the featured learning moment. `{typography.title}` names an exercise or program. `{typography.body}` explains the benefit in plain language. `{typography.label}` supports section labels, duration, progress, and actions. `{typography.caption}` is reserved for low-priority metadata.

Use weight and scale before color or decoration. Avoid tracked all-caps eyebrows as a default section treatment; a compact category label may use `{typography.label}` when it genuinely orients the user.

## Layout & Spacing

Use a single-column iOS layout with the existing safe-area and bottom-tab treatment. The content gutter is `{spacing.lg}` on compact widths and may expand to `{spacing.xl}` when the device allows it. Major sections are separated by `{spacing.2xl}`; related title, description, and metadata stay within `{spacing.sm}` to `{spacing.md}`.

The default Lessons composition is:

1. Exercises header and the existing Lessons / Practice / My Log segmented surface tabs.
2. One `ContinueCard` with a single primary action and an optional pictorial anchor.
3. One or more `ProgramAnchor` sections for CBT Core, Anxiety, and Sleep.
4. Vertical `ExerciseRow` items showing state, title, user benefit, duration, and action.

Horizontal scrolling is allowed only for `PracticeAgainShelf` or recent items, where a visible next card communicates recency. It is not the structure for course progression or the complete exercise catalogue.

## Elevation & Depth

Prefer tonal layering, spacing, and a restrained border over floating-card effects. `{components.button-primary}` may retain the existing tactile face-and-rim depth because it is an action. `ContinueCard` and `ProgramAnchor` use a light border and tonal fill; they do not combine a heavy border with a wide shadow. Exercise rows remain grounded in the page.

Motion should reinforce a completed or current state, not make the library perform. Press depth may be bouncy and brief; page-load hero animations are not part of the contract.

## Shapes

Use the existing Happy radius scale. Rows use `{rounded.lg}`; program and illustration containers use `{rounded.xl}` or `{rounded.2xl}`; controls use `{rounded.full}`. Do not introduce arbitrary 32px+ card radii. A full pill is for controls and compact badges, not every surface.

## Components

### Exercises header and surface tabs

The header keeps the existing Exercises title, completion/bookmark actions, and the three-tab surface model. `{components.exercise-surface-tabs}` has one visibly selected segment and enough height for a comfortable tap target. It is structure, not a decorative floating capsule.

### ContinueCard

`{components.continue-card}` is the only dominant content card at the top of Lessons. It contains one exercise title, one plain-language benefit, duration/reward metadata, and one action: Continue or Start. A custom pictorial anchor may occupy a contained visual area without pushing the action below the fold.

### ProgramAnchor

`{components.program-anchor}` introduces CBT Core, Anxiety, or Sleep. It may include one small, custom illustration and a short program descriptor. It is a wayfinding anchor, not a second hero. Category art must remain recognizable at 64–128px and must not imply diagnosis, symptom severity, or a medical outcome.

### ExerciseRow

`{components.exercise-row}` is the default representation for individual exercises. It uses a small supporting icon, user-intent title, concise technique or benefit line, duration, availability/progress state, and a trailing action affordance. The title leads; “CBT,” “reframing,” or another technique label can follow as context.

### PracticeAgainShelf

The only horizontal shelf. It contains a small number of recently completed or repeatable exercises, uses snap points, and exposes a visible portion of the next item. It must not hide the full course structure or become an infinite carousel.

### ProgressIndicator

`{components.progress-indicator}` uses a simple completed/current/up-next/locked vocabulary. Progress is legible without relying on color alone. XP is secondary metadata, never the primary reason to practise.

### Pictorial anchors

Illustrations are custom, simple, and restrained: limited palette, strong silhouette, minimal shading, no stock photography, no generic gradient scene, and no decorative assistant or sparkle motif. They appear only at program level and on the featured Continue item. Individual CBT interactions remain text-led.

`[ASSUMPTION]` The first implementation may use a local placeholder or simplified exploratory asset while production illustrations are refined. The generated previews in the discovery work are not approved production assets.

`[OPEN QUESTION]` Final production asset format, illustration authoring workflow, and the exact visual subjects for CBT Core, Anxiety, Sleep, and Continue remain to be selected before asset handoff.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Lead with one useful next exercise | Give every exercise equal visual weight |
| Use vertical progression for learning structure | Make the whole catalogue horizontal |
| Use selective custom pictorial anchors | Put large artwork on every exercise row |
| Explain the user benefit before the CBT technique | Lead with unexplained clinical jargon |
| Use tonal surfaces and tactile actions | Add generic gradients, ghost cards, or wide shadows |
| Keep illustrations calm, ownable, and simple | Ship stock photos or unapproved generated art |
| Keep body copy readable on tinted surfaces | Use pale grey text for visual “premium” effect |
| Preserve the current Lessons / Practice / My Log model | Add another navigation destination for discovery |

