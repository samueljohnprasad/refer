---
name: Happy Onboarding & Day-0 — Design Spine
description: 'Visual identity, tokens, 3D tactile buttons, Fredoka + Nunito type hierarchy, chat and saved-card components, and Happi choreography for the two-screen onboarding and first Home visit, plus the after-Day-0 surfaces: lapsed Home, Distressed variant and crisis sheet, wellbeing check, graduation card, trial banner.'
status: draft
sources:
  - ../research-onboarding-competitive-teardown/onboarding-redesign-sequence.md
  - ./imports/mobbin-refs.md
  - ../../../PRODUCT.md
  - ../../../DESIGN.md
  - ./EXPERIENCE.md
  - ../../../docs/research/retention-strategy.md
  - ../../../docs/research/soul/06-implementation-spec.md
  - ../research-premium-consumer-craft/
updated: 2026-11-09
colors:
  canvas: '#FFFFFF'
  surface: '#FFFFFF'
  surface-soft: '#F7F7F7'
  sage-50: '#F8FBF6'
  sage-100: '#E5EDE1'
  sage-200: '#D3E0CD'
  sage-300: '#ABC0A2'
  sage-500: '#5F7F58'
  sage-600: '#44633F'
  sage-700: '#29452A'
  sage-800: '#152714'
  ink: '#142414'
  ink-2: '#4B4B4B'
  ink-soft: '#767676'
  ink-muted: '#AFAFAF'
  border: '#E5E5E5'
  border-sage: '#D3E0CD'
  gold: '#D4A943'
  # legacy streak tokens, unused here (progress is sage); kept only for old screens
  flame: '#FF9600'
  flame-surface: '#FFF7ED'
  flame-border: '#FDBA74'
  terracotta: '#FF4B4B'
  # crisis surfaces: call buttons and nothing else; no sage, no brand (soul/06 T:crisis.action)
  crisis-action: '#142414'
  # legacy, unused in this spine
  otter-blue: '#1CB0F6'
  macaw-purple: '#CE82FF'
  # exercise hues: illustration washes behind Happi and on exercise tiles only, never on controls
  hue-catch: '#E6F0E2'
  hue-reframe: '#FDF0D2'
  hue-abc: '#E2EEF8'
  hue-act: '#FDE5DC'
  hue-ladder: '#ECE6F7'
typography:
  # one display face (Fredoka) for one line per screen; Nunito for everything else (Duolingo/BitePal pattern)
  title:
    fontFamily: Fredoka
    fontSize: 28px
    fontWeight: 600
    lineHeight: 34px
    letterSpacing: '-0.01em'
  numeral:
    fontFamily: Fredoka
    fontSize: 34px
    fontWeight: 600
    lineHeight: 40px
  headline:
    fontFamily: Fredoka
    fontSize: 24px
    fontWeight: 600
    lineHeight: 29px
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
  tag:
    fontFamily: Nunito
    fontSize: 12px
    fontWeight: 700
    lineHeight: 16px
rounded:
  sm: 8px
  md: 14px
  lg: 18px
  xl: 20px
  2xl: 24px
  full: 9999px
  DEFAULT: 16px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  2xl: 24px
  3xl: 32px
  4xl: 48px
  gutter: 16px          # screen margin, Home, Exercises and exercises
  gap-section: 32px     # between sections
  gap-card: 12px        # between cards in a section
  pad-card: 16px        # inside a card
  gap-bubble: 8px       # chat bubbles within a run
  gap-speaker: 16px     # chat, between speakers
components:
  tactile-button:
    height: 56px
    pressDepth: 6px
    borderRadius: '{rounded.full}'
    backgroundColor: '{colors.sage-500}'
    rimColor: '{colors.sage-600}'
    textColor: '#FFFFFF'
    fontSize: '{typography.body.fontSize}'
    fontWeight: 700
  # surfaces separate by fill; outline (1px) only on what the user acts on
  goal-card:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.border}'
    borderWidth: 1px
    selectedBackgroundColor: '{colors.sage-50}'
    selectedBorderColor: '{colors.sage-500}'
    borderRadius: '{rounded.2xl}'
    minHeight: 150px
    padding: '{spacing.lg}'
  choice-row:
    backgroundColor: '{colors.surface-soft}'
    selectedBackgroundColor: '{colors.sage-50}'
    selectedBorderColor: '{colors.sage-500}'
    selectedBorderWidth: 1px
    borderRadius: '{rounded.lg}'
    minHeight: 56px
  chat-bubble-happi:
    backgroundColor: '{colors.sage-50}'
    textColor: '{colors.ink}'
    borderRadius: '{rounded.xl}'
    padding: '{spacing.md}'
    maxWidth: 80%
  chat-bubble-user:
    backgroundColor: '{colors.sage-500}'
    textColor: '#FFFFFF'
    fontWeight: 500
    borderRadius: '{rounded.xl}'
    padding: '{spacing.md}'
    maxWidth: 80%
  scene-card:
    backgroundColor: '{colors.surface-soft}'
    borderRadius: '{rounded.xl}'
  reframe-card:
    backgroundColor: '{colors.sage-100}'
    textColor: '{colors.ink}'
    borderRadius: '{rounded.xl}'
    padding: '{spacing.lg}'
  quick-reply-chip:
    backgroundColor: '{colors.surface-soft}'
    pressedBackgroundColor: '{colors.sage-50}'
    textColor: '{colors.ink}'
    borderRadius: '{rounded.full}'
    minHeight: 44px
  text-field:
    backgroundColor: '{colors.surface-soft}'
    focusBackgroundColor: '{colors.surface}'
    focusBorderColor: '{colors.border}'
    borderRadius: '{rounded.full}'
  saved-card:
    backgroundColor: '{colors.surface-soft}'
    accentColor: '{colors.sage-600}'
    borderRadius: '{rounded.2xl}'
    padding: '{spacing.lg}'
  floating-card:
    backgroundColor: '{colors.surface}'
    shadow: '0 1px 2px rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.05)'
    borderRadius: '{rounded.lg}'
  segmented-control:
    trackBackgroundColor: '{colors.surface-soft}'
    selectedBackgroundColor: '{colors.surface}'
    selectedShadow: '0 1px 2px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.05)'
  progress-pair:
    countColor: '{colors.ink}'
    ringTrackColor: '{colors.sage-100}'
    ringFillColor: '{colors.sage-500}'
    ringSize: 34px
    ringStroke: 5px
  # after Day 0
  help-pill:
    backgroundColor: transparent
    borderColor: '{colors.ink-soft}'
    borderWidth: 1px
    textColor: '{colors.ink}'
    borderRadius: '{rounded.full}'
    minHeight: 44px
  checkin-chip:
    backgroundColor: '{colors.surface-soft}'
    selectedBackgroundColor: '{colors.sage-50}'
    selectedBorderColor: '{colors.sage-500}'
    selectedBorderWidth: 1px
    textColor: '{colors.ink}'
    borderRadius: '{rounded.full}'
    minHeight: 44px
  outline-button:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.ink-soft}'
    borderWidth: 1px
    textColor: '{colors.ink}'
    borderRadius: '{rounded.full}'
    height: 56px
  distress-option:
    backgroundColor: '{colors.surface-soft}'
    textColor: '{colors.ink}'
    borderRadius: '{rounded.lg}'
    minHeight: 64px
    padding: '{spacing.lg}'
  hotline-row:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    minHeight: 56px
    padding: '{spacing.lg}'
  crisis-call-button:
    backgroundColor: '{colors.crisis-action}'
    textColor: '#FFFFFF'
    borderRadius: '{rounded.full}'
    minHeight: 44px
  recall-line:
    textColor: '{colors.ink-2}'
    linkColor: '{colors.sage-600}'
  scope-card:
    backgroundColor: '{colors.surface-soft}'
    textColor: '{colors.ink-2}'
    borderRadius: '{rounded.xl}'
    padding: '{spacing.lg}'
  trial-banner:
    backgroundColor: '{colors.surface-soft}'
    textColor: '{colors.ink}'
    linkColor: '{colors.sage-600}'
    borderRadius: '{rounded.lg}'
    padding: '{spacing.md}'
  wellbeing-card:
    backgroundColor: '{colors.surface-soft}'
    borderRadius: '{rounded.2xl}'
    padding: '{spacing.lg}'
  graduation-card:
    backgroundColor: '{colors.sage-50}'
    textColor: '{colors.ink}'
    borderRadius: '{rounded.2xl}'
    padding: '{spacing.lg}'
  account-card:
    backgroundColor: '{colors.surface-soft}'
    borderRadius: '{rounded.2xl}'
    padding: '{spacing.lg}'
  look-back-card:
    backgroundColor: '{colors.surface-soft}'
    borderRadius: '{rounded.2xl}'
    padding: '{spacing.lg}'
    progressTrackColor: '{colors.sage-100}'
    progressFillColor: '{colors.sage-500}'
  # premium-sheet: not a token here — content and layout are the RevenueCat
  # dashboard template, not built by this app. See EXPERIENCE.md §4 PremiumSheet.
---

# Happy Onboarding & Day-0 — Design Spine

`DESIGN.md` owns the visual identity, tokens, and aesthetic styling rules for Happy's two-screen onboarding and the first Home visit. Visual references live under [mockups/](mockups/). On conflict with mocks or legacy code, this spine is the source of truth.

## 1. Brand & Style

Happy is a guided mental health learning companion that blends the playful gamification of Duolingo, the companion warmth of Finch, and the restorative calm of Headspace.

* **Playful, Not Childish**: Rounded forms, vibrant botanical accents, and expressive character acting invite participation without trivializing emotional pain.
* **Tactile & Physical**: Buttons and interactive choices have physical weight. They compress when pressed, spring back when released, and pair with crisp haptic ticks.
* **Calm & Grounded**: A soothing Sage palette anchors the cognitive workspace. High-contrast alerts are strictly reserved for genuine skill moments.
* **Anti-Slop Craft**: Clean 2D vector illustrations with uniform dark charcoal line art and zero generative AI artifacting. The same restraint applies to the UI: one accent, fill instead of outline, one bold level, hairline dividers, and the illustration as the picture (tested against Revmp's before/after set and the quiet list-and-divider structure of Calm and Insight Timer on Mobbin).

## 2. Colors

Benchmark: Duolingo and BitePal. A plain white base, neutral greys, one accent; the colour on screen lives in the illustration, not in the chrome.

* `{colors.canvas}` / `{colors.surface}` (`#FFFFFF`): Every screen background and every raised card. One white, no off-white canvas.
* `{colors.surface-soft}` (`#F7F7F7`): Filled rows, fields, quick replies and the saved card. Fill separates surfaces; outlines don't.
* `{colors.sage-50}` to `{colors.sage-200}`: Happi's bubble, the selected-row tint, the reframe card.
* `{colors.sage-500}` (`#5F7F58`) with `{colors.sage-600}` rim: Forward buttons and the selected ring. The only accent on controls.
* `{colors.sage-600}` (`#44633F`): Accent text, at most one place per screen (a completion headline, a link).
* Text: `{colors.ink}` (`#142414`) primary, `{colors.ink-2}` (`#4B4B4B`) secondary, `{colors.ink-soft}` (`#767676`) captions. Never pure black.
* `{colors.border}` (`#E5E5E5`): Hairline dividers and the focus ring of fields.
* Exercise hues (`{colors.hue-catch}` sage, `{colors.hue-reframe}` sun, `{colors.hue-abc}` sky, `{colors.hue-act}` coral, `{colors.hue-ladder}` lilac): One soft wash per exercise, behind Happi and on that exercise's tile. Never on buttons, chips or text.
* `{colors.flame}` (`#FF9600`) & `{colors.flame-surface}` (`#FFF7ED`): Legacy streak tokens. Not used; progress uses sage.
* `{colors.gold}` (`#D4A943`): Earned skill moments and locked curriculum indicators. Not a badge colour.
* `{colors.crisis-action}` (`#142414`): The call buttons on the crisis sheet and on the hotline rows of the Distressed variant, nothing else. It equals `{colors.ink}` on purpose, so help reads as plain and serious, never branded.
* **Distressed and crisis surfaces are neutral.** `canvas`, `surface-soft`, `ink`, `crisis-action` only: no sage wash, no exercise hue, no gold, no flame, no `terracotta`.

**Light mode only in this spine.** Dark mode is not specified; add a paired set before it ships. **Contrast (WCAG 2.2 AA; ratios computed from the hex values).** Body text needs 4.5:1, large text and non-text controls 3:1.

| Pair | Ratio | Use |
|---|---|---|
| `ink` on `canvas` / `surface-soft` / `sage-50` / `sage-100` | 16.25 / 15.17 / 15.57 / 13.57 | All primary text |
| `ink-2` on `canvas` / `surface-soft` / `sage-100` | 8.72 / 8.14 / 7.28 | Secondary text, recall line, scope-card text |
| `ink-soft` on `canvas` | 4.54 | Captions on white only |
| `ink-soft` on `surface-soft` / `sage-50` | 4.24 / 4.35 | **Fails 4.5:1. Do not use for text on tinted fills.** Use `ink-2` |
| white on `sage-500` | 4.50 | Tactile button and user bubble; at the floor, so no lighter sage |
| white on `crisis-action` | 16.25 | Crisis call buttons |
| `sage-600` on `canvas` / `surface-soft` / `sage-50` / `sage-100` | 6.77 / 6.32 / 6.49 / 5.65 | Links and accent text |
| `sage-500` (selected border) on `sage-50` / `surface-soft` | 4.31 / 4.20 | Selected chips and rows; non-text, needs 3:1 |
| `ink-soft` on `sage-100` | 3.79 | **Fails 4.5:1.** Use `ink-2` on `sage-100` |
| `terracotta` on `canvas` | 3.30 | **Fails 4.5:1 as text.** Icon only (Delete account); never a text colour |
| `ink-soft` (control border) on `canvas` | 4.54 | `help-pill` and `outline-button` borders, which need 3:1 |
| `ink-muted` on `canvas` | 2.19 | **Never for text or a control edge.** Decorative only |
| `border` (`#E5E5E5`) | about 1.3 | Hairlines only; never the sole edge of a control |

## 3. Typography

Two faces, Duolingo/BitePal style: one heavy rounded **display face (Fredoka 600)** carries the brand on one line per screen; **Nunito** carries everything else. Hierarchy is size first, weight second, colour third. Four levels on a screen at most.

| Level | Spec | Use |
|---|---|---|
| Title | Fredoka 600, 28/34, −0.01em | Screen title (Home, Exercises, an exercise's first line). One per screen. |
| Headline | Fredoka 600, 24/29 | Completion and sheet headlines. |
| Numeral | Fredoka 600, 34/40 | Hero numbers: lifetime count, stat tiles, ratings. |
| Lead | Nunito 700, 20/26 | Section headers (sentence case, primary ink), Happi's key statement in a chat. |
| Body | Nunito 500, 17/25 | Chat lines, rows, fields, buttons (700 on buttons). |
| Sub | Nunito 500, 15/21 | Second line under a row title. |
| Caption | Nunito 500, 13/18, `{colors.ink-soft}` on white, `{colors.ink-2}` on `surface-soft`, `sage-50` and `sage-100` | Field labels, meta, footnotes. Sentence case, no tracking. |
| Tag | Nunito 700, 12/16 | Tiny meta only (Pro, New). Sentence case. |

* **Weight rule**: body 500; one key phrase 700; display lines 600 Fredoka. Never two bold levels side by side. Quoted user text is upright, never italic.
* **Prototype tokens**: `--t-cap 12 · --t-foot 13 · --t-sub 15 · --t-body 17 · --t-lead 20 · --t-h 24 · --t-title 28 · --t-num 34`, `--w-body 500 · --w-strong 700 · --w-display 600`, in `.agents/happy-ui.css`.

## 4. Layout & Spacing

Benchmark: Duolingo and BitePal measured on Mobbin (`../research-premium-consumer-craft/`). Breathing room comes from the gap between sections, not from padding inside cards.

* **Device & Grid**: iOS 26+, 393pt width.
* **Screen margin**: `{spacing.gutter}` (16px) everywhere.
* **Rhythm**: `{spacing.gap-section}` (32px) between sections; `{spacing.gap-card}` (12px) between cards inside a section; `{spacing.pad-card}` (16px) inside a card; section header sits 12px above its first card.
* **Hero space**: The first screen of Home and every completion gives Happi 40–45% of the viewport height. Nothing else competes in that band.
* **Bottom CTA**: One full-width forward button, 16px from the sides, above the bottom safe area.
* **Chat layout:** 30px avatar left of the last bubble in a run; bubbles `{spacing.gap-bubble}` apart within a run, `{spacing.gap-speaker}` between speakers; quick-reply tray pinned above the bottom safe area on `{colors.canvas}`.
* **Visual References** (older look; this spine wins on conflict):
  - S1 Goal pick: [mockups/key-s1-goal-pick.html](mockups/key-s1-goal-pick.html)
  - S2 Thought Catcher chat: [mockups/key-s2-chat.html](mockups/key-s2-chat.html)
  - S2 Saved card: [mockups/key-s2-saved-card.html](mockups/key-s2-saved-card.html)
  - Home + Premium sheet: [mockups/key-home-premium-sheet.html](mockups/key-home-premium-sheet.html)
  - Newest visual truth: the prototypes in [`.agents/`](../../../.agents/) (`onboarding.html`, `home.html`, `journeys.html`, `happi.js`, `happy-ui.css`). The `home.html` prototype has no after-Day-0 states and `key-home-premium-sheet.html` still shows a Lesson 2 card and no Get help pill; follow this spine.
  - Superseded: [mockups/legacy-2026-10-20/](mockups/legacy-2026-10-20/) (seven-step era; do not build from).
  - After-Day-0 surfaces (lapsed Home, Distressed variant, crisis sheet, wellbeing check, graduation card, trial banner, Account, Look-back) have **no mocks yet**: they are built from this spine and `EXPERIENCE.md` §13–§18 alone. Render key-screen mocks before build if layout questions arise.

## 5. Elevation & Depth

* **3D Tactile Rim**: Primary buttons feature a physical 6px bottom rim (`{colors.sage-600}`) beneath the face (`{colors.sage-500}`). When pressed, the face translates down 6px via a 20ms timing curve, giving instantaneous mechanical feedback.
* **Card Elevation**: Cards at rest have no border and no shadow; they are a fill (`surface-soft` or `sage-50`). Only things that float (the sign-up nudge, a notification preview, the selected segmented-control tab, sheets) carry the soft two-layer shadow `0 1px 2px rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.05)`.
* **Tonal Stacking**: Depth is achieved through color stacking (`canvas` $\rightarrow$ `surface-soft` $\rightarrow$ `sage-50` accent) rather than blur layers. Dividers between rows are 1px hairlines at about 9% ink, never nested cards.
* **Atmosphere**: One soft radial wash behind Happi, tinted by how heavy the thought is, that fades out inside its box. It is the only gradient in the app.

## 6. Shapes

* **Buttons & Pills**: Locked to full pill shape (`{rounded.full}`, `9999px`) for high tap friendliness.
* **Cards & Containers**: Rounded to `{rounded.2xl}` (`24px`) for large containers, and `{rounded.lg}` (`18px`) for chips and selector pills.
* **Circular Badges**: Avatars, mascot ponds, and progress rings are circular (`50%` radius).

## 7. Components

### TactileButton (`TactileButton.tsx` / `SvgAppButton.tsx`)
* **Height**: 56px face + 6px bottom rim. Total container 62px.
* **Press Dynamics**: 20ms translation down on press-in; spring release (damping 20, stiffness 100) on touch up.
* **Haptics**: `Haptics.selectionAsync()` on touch down.

### Choice rows & DistortionChips
* **Unselected**: `surface-soft` fill, no border, `body-strong` label. Chips drop emoji; the name is the label.
* **Selected**: `sage-50` fill with a 1px `{colors.sage-500}` border. No rim shadow, no check badge.
* **Reframe Transition**: The chosen thinking trap opens the `reframe-card`.

### GoalCard
* Two-column tiles, 150px min height (the fifth, Sleep, spans both columns). White, 1px `border`, 24px radius. Leads with Happi's head in that goal's pose (no generic icon tile, no emoji); label in `body-strong`, one-line sub in `caption`. Selected: sage-50 fill, sage-500 border.

### Chat bubbles & QuickReplyChips
* Happi bubble: `sage-50` fill, no border, `{rounded.xl}`, `body` text in ink, with the 30px app-icon avatar on the last bubble of a run only. User bubble: sage-500 fill, white 500-weight text, right-aligned.
* **Scene card** (what happened / what the mind added): `surface-soft`, labels in `caption`, the quoted thought in 700.
* **Reframe card**: `sage-100` fill, no border. A `caption` label with a small sun dot, the reframe at `title` size in 700, the why in `body` regular grey, then a hairline and the trap as a `caption` footnote with the trap name in sage-600. This is the one emphasised card in the thread.
* Quick replies: pill, `surface-soft` fill, no border, body text in ink, 44px min height, pressed: sage-50 fill. Starter suggestions are the same pill at 36px. Tapped reply flies into the thread as the user bubble (220ms); the others fade (120ms).

### Text field
* Pill field, `surface-soft` fill at rest, white with a 1px `border` on focus. Send button is a plain arrow while empty and becomes the sage circle once there is text. The skip link is a quiet grey text link, no underline.

### SavedCard
* `surface-soft` card, no border, `{rounded.2xl}`. A `caption` row in sage ("Saved to your journal" with a thin check), then the lesson as the headline ("You split what happened from what your mind added, and found another way to see it."). Rows (what happened, the thought, another way to see it) divided by hairlines; row labels in `caption` with the belief change ("Before: somewhat", "Now: somewhat") also in `caption` grey. The thought is upright 500 grey; the other view is the one sage 600 line. The trap is a `caption` footnote. Then `ProgressPair`, then the reminder block below a hairline with a notification preview (`floating-card`, real app icon). Full-width `TactileButton` "Go to Home".

### ProgressPair
* Left: count in `numeral` (34/40, 600) ink on the saved card and Account, in `title` (28/34, 600) in the compact Home block, with `caption` label "Practices completed". A body block on Home, not in the header. The ring is hidden while the week is at zero; the count stays. Right: 34px ring, 5px stroke, sage-100 track, sage-500 fill, `caption` "1 of 3 this week". No flame, no red, no "streak" wording.

### Get help pill (`help-pill`)
* Outlined, never filled: transparent, 1px `{colors.ink-soft}` border, "Get help" in `ink`, 44px minimum height, `{rounded.full}`. Sits in the header of every Home state beside the help and Account icons; it never takes the primary-button treatment, so it cannot compete with the one filled CTA. On free-text screens it is a plain `ink` text button in the header.

### Check-in chips (`checkin-chip`)
* Four word chips (Good · Okay · Low · Not okay) in one row; wraps to two lines at large type. Same pill as `quick-reply-chip`; selected = `sage-50` fill with a 1px `{colors.sage-500}` border. No faces, no emoji, no drag input. An answered chip collapses to one caption line ("Today: Okay"). The follow-up row after **Low** uses the same chip, stacked full width.

### Lapsed Home variants
* **Layout is the Home blocks reduced, never extended.** Greeting, Happi, one CTA, the recall line, ProgressPair (3–29 days), the reminders link. No cards fill the space that a hidden block leaves; Happi's band grows instead.
* **Recall line** (`recall-line`): the quote upright in `body-strong`, intro in `body` `{colors.ink-2}`, **Why am I seeing this?** as a `{colors.sage-600}` text link with a 44×44pt hit area. The fallback line "Your reflections are right where you left them." is `body` `{colors.ink-2}`.
* **Lapsed 30+:** two `outline-button`s of equal size, stacked, full width, 12px apart; no filled button and no tactile rim. Below them the reassurance line, then the `scope-card` ("Happy helps you practice CBT skills…") with a native switch ("Show Happi") and a quiet **Got it** text link.
* The H1 greeting is the one Fredoka `title` line on the screen ("Good to see you.", "New week.", "New month.").

### Distressed variant (`distress-option`)
* Neutral surface: `canvas` with `surface-soft` rows. H1 "That sounds hard. Let's go gently." in `title`. Three `distress-option` rows of equal weight, full width, 12px apart, each a `body-strong` label; none is filled, none is highlighted. The **Talk to someone now** row always opens the crisis sheet (never an inline expansion, so nothing on the Distressed screen animates).
* Happi: Gentle concern, small (≤160pt), top of the screen, no bubble, 300ms fade in. No wash, no ring, no progress, no premium surface.

### Crisis sheet and hotline rows
* A plain bottom sheet on `surface`. Heading in `lead`; each `hotline-row` shows the name in `body-strong`, the number in `body`, and a `crisis-call-button` ("Call" or "Text") on the right. Rows are 56pt minimum with a 1px `border` hairline between them. Disclaimer lines in `caption` `{colors.ink-2}`. Links ("Can't call right now?", "Change country") are `ink` underlined. **Change country** opens a plain list. A **Close** text button sits top right.
* **0 ms in and out** in every motion mode; no Happi, no sound, no haptics, no shadow animation. The sheet is the only surface in the app with no motion at all.

### Wellbeing check (`wellbeing-card`)
* A full-screen sheet of `wellbeing-card` screens (`surface-soft`, `{rounded.2xl}`), with a calm prompt card on Home as the entry (same fill, one `body` line, **Yes** / **Not now**). One question per screen in `lead`, with the two-week frame stated once at the top in `caption`. Answers are four stacked `choice-row`s (Not at all · Several days · More than half the days · Nearly every day). A thin progress label in `caption` ("2 of 5") and a **Skip** text link on every screen. The risk question is visually identical to the others: no red, no alarm, no different weight. The result is two plain sentences in `body`, no score and no band label on screen.

### Graduation card (`graduation-card`)
* `sage-50` card, `{rounded.2xl}`, with the Happi bubble line "You've built a real skill." above it. The question in `lead`, then three `choice-row`s of equal weight (Keep my daily reminder · Switch to a weekly check-in · I'll come when I need it). No confetti, no gold, no badge, no celebration pose. A **Back to daily** row in Account uses the same `choice-row`.

### Trial banner (`trial-banner`)
* A full-width `surface-soft` strip under the header on every open for the two days before the charge: "Trial ends [date]. You'll be charged [price] unless you cancel." with a **Manage** link in `{colors.sage-600}` and a 44×44pt dismiss. No colour alarm; legibility, not urgency, is the job.

### Happi expressions after Day 0
Art in `assets/images/panda/expressions/` (`resting`, `welcome-back`, `quiet-pride`, `neutral`, `gentle-concern`, `celebrating`, `listening`, `thinking`). Rules, not decoration:

| State | Expression | Motion |
|---|---|---|
| Home D0 | Quiet pride, then Neutral | ≤600 ms, once |
| Home idle, D1–D30+ | Neutral | Idle breathing only |
| Return after 3+ days | Resting → Welcome back | One shot, ≤1,800 ms, at most once per 24 h; never sad, thinner or "waiting" |
| After the first practice on a return | Quiet pride | ≤600 ms, once |
| Distressed variant | Gentle concern, small | 300 ms fade, then still |
| Crisis sheet | None (unmounted) | 0 ms |
| Ring filled, Day 7 or 15 modal | Celebrating | At most once per 7 days |
| Reminder row, Premium sheet | Held still | No motion |

Reduce Motion freezes Happi on the final frame of the expression. A bubble appears only for the moments listed in `EXPERIENCE.md` §13.

### Segmented control (Lessons / My Log / Practice)
* `surface-soft` track; the selected tab is a raised white pill with the soft shadow, label in ink. Never a solid green block.

### PremiumSheet — remote, not styled here
* `RevenueCatUI.Paywall` / `presentPaywall()` render the RevenueCat dashboard's configured template for the current offering. This file does not set its colors, type, or layout.
* Code already sets `displayCloseButton: true`; nothing else in this screen is app-controlled.
* `mockups/key-home-premium-sheet.html` is a directional sketch for whoever authors the dashboard template (tone, order, no-discount-intercept), not a spec this app builds to.

### Account screen
* `canvas` base. Hero: a `sage-100` band with Happi and a `lead` line. Below, groups of `surface-soft` cards ({rounded.2xl}, no border, no shadow) under `caption` titles in `ink-2`; rows separated by hairlines; native switches. **Delete account** in its own card, last, label in `ink`, icon in `terracotta`. Confirm sheets use the standard sheet shadow.

### Look-back card
* Story cards: full-width `surface-soft`, `{rounded.2xl}`, one `title` line and one `body` line per card, trap name in `sage-600`. Segmented progress bar at the top (`sage-100` track, `sage-500` fill). End card: **Done** (quiet text) and **Catch a thought** (`TactileButton`). No confetti, no gold.

### Header (Home)
* Greeting left; right side: **Get help** pill, help icon (general help, line icon, 44×44 target), Account icon. The pill and Account are always visible.

### Home (existing layout, deltas)
* Keeps `JournalCalendarScreen`. Adds a welcome line (`caption` in sage over the headline), the saved reflection as a `saved-card` (first reflection, thought upright with a thin rule beside it, the other view at `title` size, trap footnote) and a one-row `floating-card` sign-up nudge (title, subtitle, quiet "Later", small "Save"). Header streak capsule removed; ProgressPair is a body block under the saved card.

## 8. Do's and Don'ts

### Do's
* **DO** let fill, not outline, separate surfaces; outline only the thing the user acts on, at 1px. Use hairlines between rows instead of nested cards.
* **DO** set labels in sentence case, small, grey, regular tracking.
* **DO** contrast weight: body 400–500, one key phrase 700, numerals in Fredoka 600. One bold level per surface.
* **DO** use the 3D tactile button on the forward action of a screen; secondary actions are quiet text links or small filled buttons without the rim.
* **DO** keep the dismiss `✕` on paywall at a minimum of 44x44pt touch area.
* **DO** show Happi with emotional intent matching the cognitive state of each step; the illustration is the picture.
* **DO** use sage for all progress (count, ring); reserve gold for earned skill moments.
* **DO** show one avatar per run of Happi messages, on the last one.
* **DO** keep Distressed and crisis surfaces neutral and still: no sage wash, no Happi on the sheet, 0 ms, no sound.
* **DO** give the Get help pill a 44pt target and a 3:1 edge (`{colors.ink-soft}`); outlined, never filled.
* **DO** use `{colors.ink-2}` for caption text on any tinted fill.

### Don'ts
* **DON'T** use tracked all-caps labels, caps badges or pills for labels.
* **DON'T** put a generic line icon in a tinted square as decoration, or emoji in chips.
* **DON'T** use nested boxes (a bordered card holding a tinted box holding a pill).
* **DON'T** set everything bold, or italicise quoted user text.
* **DON'T** use flat generic gradients or blurry neon glows (the mood wash fades inside its box).
* **DON'T** use pure black (`#000000`) for text; always use `{colors.ink}` (`#142414`).
* **DON'T** show a text field outside the opt-in personal practice branch; chips are the default path.
* **DON'T** use flame, red, or broken-chain visuals for progress; a missed week has no visual fail state.
* **DON'T** show clinical diagnostic labels (e.g. DSM-5 terms); use plain-language terms like "thinking traps".
* **DON'T** show a PHQ-4 score, band or diagnostic word on screen; show plain sentences about change.
* **DON'T** use `{colors.ink-soft}` for text on `surface-soft` or `sage-50` (4.24:1 and 4.35:1 fail AA), or `{colors.ink-muted}` for any text.
* **DON'T** colour the risk question or the Get help pill red or alarming; calm and plain is the point.
* **DON'T** show a sad, thinner or "waiting" Happi on a return; no guilt imagery, no empty-state mourning.
* **DON'T** add a celebration, confetti, gold or badge to the graduation card.
