---
name: Happy Engagement & Logging — Design Spine
description: Visual delta for the daily ask, the four-rung effort ladder, the hard-entry saved card, the garden and the tone picker. Inherits every base token and component from the Onboarding & Day-0 design spine.
status: final
sources:
  - ../../../docs/research/engagement-and-logging.md
  - ../ux-onboarding-and-day-0/DESIGN.md
  - ../ux-exercise-discovery/DESIGN.md
  - ./EXPERIENCE.md
updated: 2026-11-15
colors:
  # inherited, restated only where this spine uses them
  canvas: '#FFFFFF'
  surface-soft: '#F7F7F7'
  sage-50: '#F8FBF6'
  sage-100: '#E5EDE1'
  sage-200: '#D3E0CD'
  sage-500: '#5F7F58'
  sage-600: '#44633F'
  ink: '#142414'
  ink-2: '#4B4B4B'
  border: '#E5E5E5'
  # garden illustration only; never on controls or text
  garden-stem: '#5F7F58'
  garden-leaf: '#7FA876'
  garden-petal: '#F5B942'
  garden-petal-core: '#FFF7D6'
  garden-pot: '#D9825B'
  garden-pot-rim: '#E89A73'
  garden-ground: '#E4EEE0'
  garden-waiting: '#A9BFA0'
typography:
  lead:
    fontFamily: Nunito
    fontSize: 20px
    fontWeight: 700
    lineHeight: 26px
  body:
    fontFamily: Nunito
    fontSize: 17px
    fontWeight: 500
    lineHeight: 25px
  body-strong:
    fontFamily: Nunito
    fontSize: 17px
    fontWeight: 700
    lineHeight: 25px
  sub:
    fontFamily: Nunito
    fontSize: 15px
    fontWeight: 500
    lineHeight: 21px
  caption:
    fontFamily: Nunito
    fontSize: 13px
    fontWeight: 500
    lineHeight: 18px
rounded:
  lg: 18px
  xl: 20px
  2xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  gutter: 16px
  pad-card: 16px
components:
  recall-chip:
    backgroundColor: '{colors.sage-50}'
    borderColor: '{colors.sage-200}'
    borderWidth: 1px
    textColor: '{colors.ink}'
    metaTextColor: '{colors.ink-2}'
    linkColor: '{colors.sage-600}'
    borderRadius: '{rounded.lg}'
    padding: '{spacing.md}'
  step-up-row:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    optionBackgroundColor: '{colors.surface-soft}'
    optionBorderRadius: '{rounded.lg}'
    optionGap: '{spacing.sm}'
    optionMinHeight: 56px
  trap-definition:
    textColor: '{colors.ink-2}'
    typography: '{typography.sub}'
  hard-entry-line:
    textColor: '{colors.ink}'
    typography: '{typography.body-strong}'
  why-sheet:
    backgroundColor: '{colors.canvas}'
    quoteBackgroundColor: '{colors.surface-soft}'
    quoteBorderRadius: '{rounded.xl}'
    linkColor: '{colors.sage-600}'
    padding: '{spacing.pad-card}'
  week-leaf:
    filledColor: '{colors.sage-500}'
    emptyBorderColor: '{colors.sage-200}'
    size: 20px
  garden-pots:
    groundColor: '{colors.garden-ground}'
    waitingColor: '{colors.garden-waiting}'
    cardBackgroundColor: '{colors.sage-50}'
    cardBorderRadius: '{rounded.2xl}'
  garden-plot:
    backgroundColor: '{colors.sage-50}'
    borderRadius: '{rounded.xl}'
    minHeight: 136px
    leafColor: '{colors.sage-600}'
    leafSize: 14px
    leafMax: 6
  tone-card:
    backgroundColor: '{colors.surface-soft}'
    selectedBackgroundColor: '{colors.sage-50}'
    selectedBorderColor: '{colors.sage-500}'
    borderRadius: '{rounded.2xl}'
    padding: '{spacing.pad-card}'
  insight-empty-line:
    textColor: '{colors.ink-2}'
    typography: '{typography.sub}'
---

# Happy Engagement & Logging — Design Spine

This spine is a delta. The [Onboarding & Day-0 design spine](../ux-onboarding-and-day-0/DESIGN.md) ("the base spine") owns the tokens, the tactile button, chat bubbles, quick-reply and starter chips, DistortionChips, check-in chips, the text field, BeliefScale, SavedCard, ProgressPair, the look-back card and Happi's expressions. Where this spine is silent, the base spine applies. On conflict with a mock or legacy code, the two spines win.

Visual references: [mockups/key-home-ask.html](mockups/key-home-ask.html), [mockups/key-trap-chips-and-stems.html](mockups/key-trap-chips-and-stems.html), [mockups/key-saved-card-cases.html](mockups/key-saved-card-cases.html).

## Brand & Style

Logging should feel like a short conversation at a kitchen table, not a form and not a game. Happi asks one thing, the screen offers answers to pick from, and typing comes last. Nothing on a logging surface sparkles or pays out beyond what the base saved card already does.

- **Fill, not outline, and no shadow.** Every component added here separates by tonal fill; a 1px hairline appears only on something the person acts on. Nothing added here casts a shadow.
- **One accent.** Sage carries selection and action. The garden palette is illustration only.
- **Equal weight for stopping.** Where the screen offers a next step inside a flow, stopping is the same size and fill.

## Colors

- `{colors.sage-50}` marks the recall chip, a garden plot and the selected tone. `{colors.sage-200}` is the recall chip's hairline.
- `{colors.sage-600}` is link text ("Why am I seeing this?") and the by-topic leaves.
- `{colors.ink-2}` carries time costs, dates on recalled items, the trap definition and one-line empty states.
- The `garden-*` colours appear only inside the garden illustration. No garden colour tints a control or signals a state.
- No mood, rung or thinking trap has its own colour. A Low day and a Good day look the same.

Contrast: `{colors.ink}` on `{colors.sage-50}` and on `{colors.surface-soft}` both exceed 12:1. `{colors.ink-2}` on `{colors.sage-50}` is about 8:1 (not measured with a tool). The 1px `{colors.sage-500}` selected border on `{colors.sage-50}` is 4.3:1 per the base spine.

## Typography

Inherited ramp, no new roles. The time cost on a button label is part of the label, same weight. The trap definition and empty-state lines use `{typography.sub}`; dates and "Why am I seeing this?" use `{typography.caption}`; the hard-entry line uses `{typography.body-strong}`.

## Layout & Spacing

- Home keeps the base spine's blocks and order. The ask adds nothing to the layout: it is Happi's one bubble in the hero and a longer label on the existing filled button.
- Trap chips wrap in rows, `{spacing.sm}` apart. "Not sure" and "None of these, it's just hard" always sit together on their own last row.
- The recall chip sits above the stems, full width; stems wrap in one row above the text field.
- The step-up row is two full-width options stacked `{spacing.sm}` apart, each at least 56px.
- Garden plots are a two-column grid, `{spacing.sm}` gap.

## Elevation & Depth

Flat. The only depth on these surfaces is the base tactile button's rim on a filled action.

## Shapes

Cards `{rounded.2xl}`; chips are pills; the recall chip and step-up options use `{rounded.lg}` so they read as rows, not as chips.

## Components

### Ask bubble and button label (inherited)

Happi's ask uses the base `chat-bubble-happi`, unchanged. The Home button is the base `tactile-button`; its label gains the time cost: "Catch a thought · 2 min". At night the same button reads "Wind down · 1 min". No new card, no second button.

→ [mockups/key-home-ask.html](mockups/key-home-ask.html)

### Trap chips (inherited DistortionChips, plus two)

Base DistortionChips, unchanged: `surface-soft` pill, name only, selected with `sage-50` fill and a 1px `sage-500` border. This spine adds a "More" chip and two escape chips in the same pill at the same weight; they are never greyed, smaller or lighter.

**Trap definition (`trap-definition`).** One sentence of `{typography.sub}` in `{colors.ink-2}` directly under the chip rows when a trap is selected. Plain text, no card.

### Stems (inherited starter chips)

The base starter suggestion pill (36px). After a tap the row drops to 40% opacity and stays tappable.

### Recall chip (`recall-chip`)

A `{colors.sage-50}` row with a 1px `{colors.sage-200}` border. Line one: the person's own fair thought, up to two lines, `{typography.body}`. Line two, `{typography.caption}` in `{colors.ink-2}`: the date, then "Why am I seeing this?" in `{colors.sage-600}` with a 44pt hit area. Its row shape keeps it from reading as an app-written suggestion.

### Why sheet (`why-sheet`)

Standard bottom sheet on `{colors.canvas}`. Title in `{typography.lead}`, one `{typography.body}` sentence saying where the line came from, the source entry quoted on a `{colors.surface-soft}` block, then two text actions: "Open entry" and "Forget this" in `{colors.sage-600}`. No destructive colour.

### Step-up row (`step-up-row`)

One `{typography.body}` line, then two stacked options on `{colors.surface-soft}` with identical height and fill: the next step with its time cost, and "That's enough for today". No filled sage button here.

→ [mockups/key-trap-chips-and-stems.html](mockups/key-trap-chips-and-stems.html)

### Saved card (inherited) and its hard-entry variant

The base SavedCard is used as defined: "Saved to your journal", the move as the headline, the rows, ProgressPair, the reminder row, "Go to Home". Two deltas:

- **Catch-only entry.** One row (the thought). No "Another way to see it" row, no belief change.
- **Hard entry (`hard-entry-line`).** The headline is replaced by "That sounds hard." in `{typography.body-strong}`, `{colors.ink}`. An outline button "Breathe for a minute" sits above "Go to Home", and the help pill sits below it. ProgressPair is shown still. No sage headline, no success tint.

Happi on the saved card: Quiet pride for a normal save, Gentle concern (small) for a hard entry, never a bubble.

→ [mockups/key-saved-card-cases.html](mockups/key-saved-card-cases.html)

### Week leaf (`week-leaf`)

My Log's seven-slot strip. A day with any log shows a filled leaf in `{colors.sage-500}`; a day without shows a 1px `{colors.sage-200}` ring. Today's slot carries the weekday label in `{typography.caption}`. An empty slot is never red, crossed or marked as missed.

### Garden (`garden-pots`, `garden-plot`)

Owned by this spine; it exists in app code and in no earlier spine.

- **Pots, fewer than 3 practices.** A `{colors.sage-50}` card with three pots on a `{colors.garden-ground}` line: a grown plant, a sprout, or a dashed pot in `{colors.garden-waiting}`.
- **Plots, 3 or more.** One `{colors.sage-50}` plot per topic: up to 6 leaves at 14px in `{colors.sage-600}`, a leaf at 40% opacity for a paused entry, a dashed ring when nothing has been tried, and a text line under the leaves.

A plot never shows a wilted, brown, grey or smaller plant.

`[ASSUMPTION]` By-topic leaves are Feather glyphs in the app today; the prototype's leaf path is the intended art.

### Tone card (`tone-card`)

`{colors.surface-soft}` card on Home, shown once. Two rows, "Gentle" and "Plain", each with a sample line set in the base Happi bubble. Selected: `{colors.sage-50}` fill, 1px `{colors.sage-500}` border. A text link "Keep it as it is" below.

### Insight empty line (`insight-empty-line`)

One `{typography.sub}` line in `{colors.ink-2}` where a look-back or pattern will appear. No lock icon, blurred preview or placeholder chart.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Put the time cost in the button label | Add a second button or card for the ask |
| Keep the escape chips the same weight as trap chips | Grey out or shrink "None of these, it's just hard" |
| Make "That's enough for today" as large as the step up | Style stopping as the lesser choice |
| Show the recall chip as a dated row with its why link | Show a recalled sentence as if the app wrote it |
| Replace the headline with "That sounds hard." on a hard entry | Praise, tint or celebrate a hard entry |
| Keep the garden growing or still | Wilt, shrink, grey or reset anything |
| Use fill and a 1px hairline | Add a shadow to any component here |
| Keep moods and traps colourless | Colour-code feelings, rungs or traps |
