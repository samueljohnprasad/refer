# Duolingo Design System — Master Reference

### Principal Design System Architect & UX Psychology Analysis

> A complete reverse-engineering of Duolingo's visual language, component
> architecture, and cognitive mechanics. Written as a source of design
> inspiration and competitive reference — not for copying, but for
> understanding _why_ it works at the level it does.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Typography](#2-typography)
3. [Font Variations](#3-font-variations)
4. [Colour System](#4-colour-system)
5. [Spacing & Layout](#5-spacing--layout)
6. [Depth System — The 3D Border Trick](#6-depth-system--the-3d-border-trick)
7. [Button Variations](#7-button-variations)
8. [Card Variations](#8-card-variations)
9. [Component Primitives](#9-component-primitives)
10. [Motion & Feedback](#10-motion--feedback)
11. [Character & Illustration System](#11-character--illustration-system)
12. [Cognitive Psychology Mechanics](#12-cognitive-psychology-mechanics)
13. [Hyper-Consistency as a Trust Signal](#13-hyper-consistency-as-a-trust-signal)
14. [What Makes It Premium](#14-what-makes-it-premium)

---

## 1. Design Philosophy

Duolingo's design is built around a single, deliberately difficult constraint:
**make daily habit formation feel like play, not work — for adults.**

That constraint eliminates entire categories of design decisions. You cannot be
too serious (kills the play), too juvenile (alienates adults), too complex
(kills habit formation), or too simple (feels patronising). The narrow channel
between those failure modes is where Duolingo's visual language lives.

Their internal north star is **"joyful, not juvenile."** Every design decision
— the rounded type, the pastel palette, the thick border depth, the
celebrating owl — is tested against that single phrase.

### The three-layer model

Duolingo's design operates across three simultaneous layers:

```
Layer 1 — Visual clarity     Clean, readable, zero cognitive load to parse
Layer 2 — Emotional warmth   Friendly, encouraging, never cold or clinical
Layer 3 — Psychological pull  Reward loops, progress signals, loss signals
```

Most apps achieve one or two layers. Duolingo sustains all three
simultaneously, at scale, across 30+ languages, on both platforms. That is
the engineering achievement of the design system — not any single component.

---

## 2. Typography

> ✅ **Applied to global.css** — Two-typeface pairing implemented:
> `FrauncesBold/SemiBold/Medium/Regular` (display) ↔ `GeistBold/SemiBold/Medium/Regular` (body).
> See `happy-font-heading-*` and `happy-font-body-*` utilities.

### Primary typeface — Feather Bold (custom)

Duolingo commissioned a custom typeface for their 2021 rebrand. Feather Bold is
the centrepiece of the visual identity.

**Characteristics:**

- Extra-bold weight only (one weight, maximum authority)
- Rounded terminals on every stroke — `r`, `a`, `f`, `l` all have soft
  endings, no sharp cuts
- Slightly condensed — packs more words into narrow mobile widths without
  feeling cramped
- Large x-height (~0.74) — excellent legibility at small sizes on low-DPI
  screens
- OpenType features: tabular numerals for score/XP counters (numbers never
  shift width when incrementing — critical for animations)
- Designed to feel "hand-lettered but disciplined" — not a display font, not
  a text font, something between

**Type scale (approximate, from observation):**

| Role            | Size | Weight                  | Line height | Tracking |
| --------------- | ---- | ----------------------- | ----------- | -------- |
| Display / hero  | 36px | Feather Bold            | 1.1         | -0.02em  |
| Screen title    | 28px | Feather Bold            | 1.15        | -0.01em  |
| Section heading | 22px | Feather Bold            | 1.2         | 0        |
| Card heading    | 18px | Feather Bold            | 1.25        | 0        |
| Body / label    | 16px | DIN Next Rounded Bold   | 1.4         | 0        |
| Caption / meta  | 13px | DIN Next Rounded Medium | 1.5         | +0.01em  |
| Eyebrow tag     | 11px | DIN Next Rounded Bold   | 1.0         | +0.08em  |

### Secondary typeface — DIN Next Rounded

Used for body copy, button labels, metadata, and any running text. DIN Next
Rounded is an industrial geometric sans with softened terminals — it pairs
with Feather Bold by sharing the rounded aesthetic without competing in weight.

**Key properties:**

- Available in Medium and Bold (Duolingo uses primarily Bold for UI)
- The rounded terminals are subtle — it reads as "clean geometric" not
  "playful" when used at body sizes, which is the intent
- Slightly wider than Feather — creates natural visual hierarchy just from
  the width difference alone
- Fallback stack on web: `"DIN Next Rounded", "Nunito", system-ui, sans-serif`

### Typography rules

**Rule 1: Almost everything is bold or extra-bold.**
Duolingo uses almost no Regular or Light weight. The reasoning: bold text
reads faster, requires less eye focus, and reduces the cognitive effort of
a language learner who is already working hard to process content. Lighter
weights feel like homework.

**Rule 2: Line heights are generous — 1.25–1.5 for body.**
Low line height (1.1–1.2) is reserved for display headings only. Body and
label text has room to breathe. Tight line heights feel stressful; generous
line heights feel like the app is not in a hurry.

**Rule 3: Negative tracking only at display sizes.**
Headings are tracked -0.01em to -0.02em. Body and UI text is 0 or slightly
positive. Over-tightening body text is a common premium mistake — it looks
editorial on a poster, but causes fatigue on a reading-heavy app screen.

**Rule 4: Never use ALL CAPS for more than 3 words.**
Section eyebrows and badge labels use ALL CAPS + wide tracking. Long strings
in all-caps are punishing for language learners who are already processing
foreign script.

---

## 3. Font Variations

The type system is not a scale of sizes — it is a vocabulary of roles. Each
style exists for one purpose and should not be applied outside it. Using a
Display style on a caption does not feel "bold and punchy"; it feels broken.

---

### Display ✅ → `happy-font-heading-bold` (FrauncesBold) ✅ → `Text` variant="display"

```
Typeface:     Feather Bold
Size:         36–40px
Line height:  1.08
Tracking:     -0.02em
Colour:       ink (#1F1F1F)  ✅ → text-ink
Usage:        Lesson complete screen headline. Streak milestone number.
              Onboarding hero text. One instance per screen maximum.
```

Display is the loudest voice in the room. It exists for single moments of
celebration or strong instruction. The negative tracking (-0.02em) tightens
the letterforms so they read as a single unit rather than a row of characters.
Never use at body sizes — the extreme weight creates visual noise.

---

### Screen Title (H1) ✅ → `happy-font-heading` (FrauncesSemiBold) ✅ → `Text` variant="h1"

```
Typeface:     Feather Bold
Size:         28px
Line height:  1.15
Tracking:     -0.01em
Colour:       ink (#1F1F1F)  ✅ → text-ink
Usage:        Page headers, modal titles, section introductions.
              One per screen.
```

This is the "you are here" signal. Every major screen has exactly one H1.
It anchors the user spatially and tells them what the current context is.
Duolingo never omits the H1 — even screens with very little text have a
heading because it's a wayfinding signal, not just a label.

---

### Section Heading (H2) ✅ → `happy-font-heading` (FrauncesSemiBold) ✅ → `Text` variant="h2"

```
Typeface:     Feather Bold
Size:         22px
Line height:  1.2
Tracking:     0
Colour:       ink (#1F1F1F)  ✅ → text-ink
Usage:        Sub-sections within a screen. Grouped content blocks.
              Challenge category names. Settings section headers.
```

H2 is the workhorse heading. It appears multiple times per screen where
content is grouped into discrete topics. The zero tracking (vs negative for
H1) creates a visible hierarchy step even without size comparison.

---

### Card Heading (H3) ✅ → `happy-font-heading-medium` (FrauncesMedium) ✅ → `Text` variant="h3"

```
Typeface:     Feather Bold
Size:         18px
Line height:  1.25
Tracking:     0
Colour:       ink (#1F1F1F)  ✅ → text-ink
Usage:        Card titles. Lesson names. Achievement titles.
              Challenge names in list views.
```

Card headings must be scannable in a list. At 18px bold, they are large
enough to read during a thumb scroll without being so large they dominate
the card layout. Never set card headings in anything lighter than Bold —
semi-bold or medium weight at this size disappears against the card surface.

---

### Body — Bold ✅ → `happy-font-body-bold` (GeistBold) ✅ → `Text` variant="body-bold"

```
Typeface:     DIN Next Rounded Bold
Size:         16px
Line height:  1.4
Tracking:     0
Colour:       ink (#1F1F1F) or wolf-grey-400 (#777777)  ✅ → text-ink / text-ink-soft
Usage:        Answer option text. Primary button labels. Key instructions
              inside a lesson. Any interactive text element.
```

The default text weight for interactive elements. Everything a user reads
_before_ making a decision should be Body Bold. The reason: cognitive
load is highest at decision points, and bold text reduces reading effort
during that load spike.

---

### Body — Regular ✅ → `happy-font-body` (GeistRegular) ✅ → `Text` variant="body"

```
Typeface:     DIN Next Rounded Regular (or Medium)
Size:         16px
Line height:  1.5
Tracking:     0
Colour:       wolf-grey-400 (#777777) or ink (#1F1F1F)  ✅ → text-ink-soft / text-ink
Usage:        Explanatory text after a correct/incorrect answer.
              Tips. Help text. Non-interactive descriptions.
```

Regular weight signals "this is informational, not interactive." In
Duolingo's lesson flow, the explanation that appears after an answer is
always Regular — it communicates "this is context, not a prompt to act."
This weight distinction is invisible to users but deeply felt.

---

### Caption / Metadata ✅ → `happy-font-body-medium` (GeistMedium) ✅ → `Text` variant="caption|caption-muted"

```
Typeface:     DIN Next Rounded Medium
Size:         13px
Line height:  1.5
Tracking:     +0.01em
Colour:       wolf-grey-400 (#777777) or wolf-grey-200 (#AFAFAF)  ✅ → text-ink-soft / text-ink-muted
Usage:        Timestamps. XP amounts on non-primary displays.
              Lesson duration estimates. Supplementary counts.
              "2 mistakes · 3 min" style secondary information.
```

Caption text sits at the edge of legibility and must never be set in
Regular weight — it will be too light to read on mobile. Medium holds
the necessary contrast. The slight positive tracking (+0.01em) opens
up the letterforms at small size, preventing stroke collision in condensed
typefaces.

---

### Eyebrow / Label Tag ✅ → `happy-brand-eyebrow` utility ✅ → `Text` variant="eyebrow|overline"

```
Typeface:     DIN Next Rounded Bold
Size:         11px
Line height:  1.0
Tracking:     +0.08em (very wide)  ✅ → tracking-widest
Case:         ALL CAPS             ✅ → uppercase
Colour:       wolf-grey-400 (#777777) or contextual accent  ✅ → text-sage-500 (brand accent)
Usage:        Section identifiers. Badge labels. Category names.
              "STREAK", "XP", "UNIT 2" style tags.
```

The combination of ALL CAPS + wide tracking + bold + 11px creates a
visually distinct object that reads as a "label" rather than as text.
Users scan for eyebrows to orient themselves, not to read them carefully.
Wide tracking makes ALL CAPS legible at small sizes (tight tracking on
capitals causes collision at <12px).

**Maximum 3 words.** Eyebrows longer than 3 words should be reclassified
as Captions or H3.

---

### Counter / Numeric Display ✅ → `Text` variant="counter"

```
Typeface:     Feather Bold (with tabular numerals enabled)
Size:         Contextual (28–48px depending on placement)
Line height:  1.0
Tracking:     -0.01em
Colour:       Contextual — streak (#FFD900), XP (#58CC02), neutral (ink)
Usage:        Streak count. XP counter. Hearts remaining.
              League score. Timer countdown.
```

Counters use **tabular numerals** — every digit occupies the same width
regardless of the numeral (1 is the same width as 8). This prevents the
layout from shifting as numbers increment during animations. A counter
that shifts width as it counts up is broken, even if users can't explain
why it bothers them.

---

### Button Label ✅ → `happy-font-body-bold` (GeistBold) ✅ → `Text` variant="button-label"

```
Typeface:     DIN Next Rounded Bold
Size:         16–17px
Line height:  1.0 (buttons are height-constrained, not text-flow)
Tracking:     +0.01em
Case:         Title Case (not ALL CAPS)
Colour:       White (#FFFFFF) on coloured CTA; ink (#1F1F1F) on ghost  ✅ → text-brand-surface / text-ink-soft
Usage:        CTA labels. Navigation confirmations. Action labels.
```

Button labels are Title Case, never ALL CAPS. This is a deliberate tone
decision: ALL CAPS reads as shouting, which is the opposite of Duolingo's
encouraging voice. Title Case is firm but friendly.

The +0.01em tracking compensates for the bold weight in a constrained
(single-line) context — bold type in a tight line-height without tracking
creates visual pressure.

---

### Prohibited Combinations

```
✗  Feather Bold below 16px — the rounded terminals clog at small sizes
✗  DIN Next Rounded Regular for interactive elements — too light, lacks
   affordance signal
✗  Caption text in Feather Bold — wrong register, reads as a heading
✗  Body text with negative tracking — creates unreadable dense blocks
✗  Mixed typefaces in a single component — pick Feather (display/heading)
   or DIN (body/UI), never both in the same text block
✗  ALL CAPS for body copy — acceptable only for 1–3 word eyebrows
```

---

## 4. Colour System

### Design principle: pastel-saturated, non-gray

Duolingo's palette is the most studied element of their design system. The
colours are simultaneously saturated enough to feel energetic and soft enough
to feel safe. This is a technically difficult zone to occupy — most brand
palettes fall into either muted-and-trustworthy or vivid-and-aggressive.

The secret is **high saturation at mid-lightness.** Pure #FF0000 red is
aggressive. Pale #FFCCCC red is weak. Duolingo's red (#FF4B4B) sits at
roughly 60–65% lightness — it reads as "important" without triggering the
stress response that a darker or purer red would.

### Core palette

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  BRAND                                                                         │
│  Duo Green        #58CC02    Primary. CTAs, progress, XP.  ✅ → sage-500 (swap)│
│  Duo Green Dark   #58A700    CTA border-bottom shadow.      ✅ → sage-700 (swap)│
│  Duo Dark         #1F1F1F    Near-black. Primary text.      ✅ → ink    (swap)  │
│                                                                                │
│  FUNCTIONAL                                                                    │
│  Cardinal Red     #FF4B4B    Incorrect, error, hearts lost. ✅ adopted directly │
│  Bee Yellow       #FFD900    Streak. XP boosts. Gems.       ✅ adopted directly │
│  Otter Blue       #1CB0F6    Correct answers, info states.  ✅ adopted directly │
│  Macaw Purple     #CE82FF    Super/Premium. Special lessons. ✅ adopted directly│
│  Parrot Orange    #FF9600    Bonus, rare rewards.           ✅ adopted directly │
│                                                                                │
│  NEUTRAL                                                                       │
│  Wolf Grey 100    #F7F7F7    Screen background.             ✅ brand-surface-soft│
│  Wolf Grey 200    #AFAFAF    Disabled text + border shadow. ✅ ink-muted + border-strong│
│  Wolf Grey 300    #E5E5E5    Dividers, inactive borders.    ✅ brand-border     │
│  Wolf Grey 400    #777777    Secondary body text.           ✅ ink-soft         │
│  Feather White    #FFFFFF    Card surfaces.                 ✅ brand-surface    │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Why there are almost no grays

Duolingo's backgrounds are off-white (#F7F7F7) — a warm neutral, not a cool
gray. Their neutrals are used _only_ for disabled and inactive states. This is
a deliberate psychological choice:

Gray communicates "unavailable", "offline", "turned off." Duolingo's product
goal is to make every screen feel _alive_ — like the lesson is ready and
waiting for you. Replacing cool grays with very slightly warm whites and
off-whites removes the "dormant" signal entirely.

### Colour pairing rules

**Each colour has one or two sanctioned background pairings:**

| Foreground       | Background | Context                  |
| ---------------- | ---------- | ------------------------ |
| #58CC02 (green)  | #FFFFFF    | CTA button               |
| #1CB0F6 (blue)   | #DDF4FF    | Correct answer state     |
| #FF4B4B (red)    | #FFDFE0    | Incorrect answer state   |
| #FFD900 (yellow) | #FFF5D6    | Streak / XP area         |
| #CE82FF (purple) | #F0DEFF    | Super Duolingo / premium |
| #FF9600 (orange) | #FEEDE0    | Rare reward, bonus       |

The tinted backgrounds are critical. Never pairing a saturated colour against
pure white ensures the colour never feels harsh or aggressive. The tinted
background absorbs the impact of the main colour and creates a soft glow
effect without any CSS gradient.

### Dark mode

Duolingo's dark mode maps each pastel to a slightly deeper (but not dark)
equivalent. The _brand green stays green_. This is unusual — most dark modes
desaturate the brand colour. Duolingo keeps it saturated because the green is
their primary action signal, and desaturating it would weaken every CTA on
screen.

Background in dark mode: `#131F24` — a very dark blue-teal, not black. This
preserves the warmth of the experience and makes the brand green pop
brilliantly against it.

---

## 5. Spacing & Layout

### 8-point grid

All spacing is derived from multiples of 8px:

```
4px   — Internal component micro-spacing (icon-to-text gap)
8px   — Tight element spacing (between two related labels)
12px  — Default small gap
16px  — Default card padding, row spacing
24px  — Section gap, content group spacing
32px  — Large section separation
40px  — Screen edge to content on wide displays
```

The 4px half-step is permitted only inside components. Screen-level layout
never uses 4px.

### Screen architecture

```
Screen padding:     16px left/right (phone), 24px (phablet)
Header height:      56px (contains back arrow + progress bar + hearts)
CTA zone:           Fixed bottom, 84px height including safe area
Content area:       Everything between header and CTA zone
Card internal pad:  16px uniform, 20px on hero cards
```

### Tap target minimums

- Minimum: 44×44px (Apple HIG)
- Preferred: 56×56px (Duolingo's actual practice)
- Answer option cards: full width, minimum 64px height
- Bottom CTA: full width, 56px height

The large tap targets are not just accessibility — they communicate confidence.
A small button looks uncertain. A full-width button looks inevitable.

### Rounded corners ✅ → `--radius-*` scale in global.css

```
Small chips / badges:   full pill (border-radius: 999px)  ✅ → radius-full / rounded-full
Answer option cards:    16px                               ✅ → radius-xl (16px)
Quiz cards / panels:    12–16px                            ✅ → radius-lg (12px) / radius-xl (16px)
CTA buttons:            12px (not pill)                    ✅ → radius-lg (12px)
Bottom sheets:          24px top corners only              ✅ → radius-3xl (24px)
Modals:                 16px                               ✅ → radius-xl (16px)
```

One important detail: Duolingo's CTA buttons are **not** pill-shaped, even
though pill shapes are common in consumer apps. The 12px radius reads as
"button" — it looks like something to press. Pill shapes read as "chip" or
"tag" — less affordance to click.

---

## 6. Depth System — The 3D Border Trick

> ✅ **Fully applied to global.css** — Implemented across all `happy-brand-*` surface utilities:
> `happy-brand-pressed-card` (border-b-4), `happy-brand-preview-tile` (border-b-[5px]),
> `happy-brand-raised-panel` (border-b-[6px]), `happy-brand-primary-cta` (border-b-4 sage-700).
> Bottom border always uses `brand-border-strong` (darker) vs `brand-border` (sides) — mirrors
> Duolingo's #AFAFAF bottom vs #E5E5E5 sides depth trick.

This is the most imitated and least understood element of Duolingo's visual
language. The 3D depth effect is achieved entirely with CSS borders — no
`box-shadow`, no `filter: drop-shadow`, no transforms at rest.

### The mechanism

```css
/* The standard Duolingo button at rest */
.duo-button {
  background-color: #58cc02;
  border: 2px solid #58a700;
  border-bottom-width: 4px; /* ← This single line creates the 3D illusion */
  border-radius: 12px;
}

/* The pressed state */
.duo-button:active {
  border-bottom-width: 2px; /* ← Bottom border collapses to match sides */
  transform: translateY(2px); /* ← Element moves down by the difference */
}
```

The pressed state mathematically cancels the offset: 4px bottom border
collapses to 2px, and the element shifts 2px down. This means the bottom
edge of the button stays at exactly the same Y coordinate — it doesn't jump
around. The only thing that changes is the perceived depth disappears.

### Why not box-shadow?

`box-shadow` renders outside the element's bounds, causing issues in:

- Overflow-hidden containers (the shadow clips)
- Stacked card layouts (shadows from adjacent cards bleed and look messy)
- Performance on older Android devices (shadow rendering is expensive)

The thick border solution renders within the element's bounds, stacks cleanly,
and costs zero in rendering performance. It is also trivially animatable with
CSS transitions.

### Depth scale

```
Subtle (card borders):    border: 2px solid;  border-bottom: 4px solid;
Standard (buttons):       border: 2px solid;  border-bottom: 4px solid;
Prominent (hero panels):  border: 2px solid;  border-bottom: 6px solid;
```

The border-bottom colour is always a darker shade of the fill — usually 15–20%
darker. This creates the shadow that makes the depth feel physically plausible.

### Colours used across component types

| Component      | Fill    | Border side | Border bottom |
| -------------- | ------- | ----------- | ------------- |
| Green CTA      | #58CC02 | #58A700     | #58A700       |
| Answer card    | #FFFFFF | #E5E5E5     | #AFAFAF       |
| Correct card   | #DDF4FF | #84D8FF     | #84D8FF       |
| Incorrect card | #FFDFE0 | #FF9090     | #FF9090       |
| Streak button  | #FFD900 | #F0B400     | #F0B400       |

The bottom border on a white answer card is noticeably darker than the sides
(#AFAFAF vs #E5E5E5). This intentional mismatch creates the illusion that the
bottom is further away from the light source — physically accurate, makes the
depth feel real.

---

## 7. Button Variations

Buttons are the most trust-critical component in Duolingo. Every lesson ends
with a button tap. Every wrong answer is followed by a button tap. Every
streak save is a button tap. The tactile quality of these buttons — their
weight, their depth, their pressed state — is load-bearing for the product's
emotional tone.

All Duolingo buttons share the same depth mechanic (thick border-bottom) but
differ in fill, border colour, size, and semantic role.

---

### 7.1 Primary CTA — "Check" / "Continue" ✅ → `happy-brand-primary-cta` / `happy-brand-primary-cta-disabled`

The most important button in the product. Full-width, bottom of screen,
always visible, always the single clear next action.

```
┌─────────────────────────────────────────────┐
│                  CONTINUE                   │  ← DIN Next Rounded Bold, 17px
└─────────────────────────────────────────────┘
```

```
Size:           Full width, 56px height
Border radius:  12px (not pill — "button", not "chip")  ✅ → radius-lg
Fill:           #58CC02 (Duo Green)                     ✅ → bg-sage-500
Border:         2px solid #58A700 on sides and top      ✅ → border-b-sage-700 (bottom only)
Border-bottom:  4px solid #58A700 (creates 3D depth)    ✅ → border-b-4 border-b-sage-700
Label:          White (#FFFFFF), DIN Next Rounded Bold, 17px  ✅ → text-brand-surface happy-font-body-bold
Padding:        0 24px
```

**States:**

| State    | Fill    | Border-bottom | Transform       | Happy mapping                           |
| -------- | ------- | ------------- | --------------- | --------------------------------------- |
| Default  | #58CC02 | 4px #58A700   | none            | ✅ `happy-brand-primary-cta`            |
| Pressed  | #58CC02 | 2px #58A700   | translateY(2px) | PressableScale handles transform        |
| Disabled | #E5E5E5 | 4px #AFAFAF   | none            | ✅ `happy-brand-primary-cta-disabled`   |
| Loading  | #58CC02 | 4px #58A700   | none            | use `happy-brand-primary-cta` + spinner |

The pressed state is critical. `border-bottom` collapses from 4px to 2px
and the element translates down 2px — so the bottom edge stays at the same
Y coordinate. The button "sinks into the screen." This is the physical model
of pressing a real button.

**Psychological role:** The primary CTA is the reward delivery mechanism.
After completing a correct answer, pressing this button is the act of
_claiming_ the XP. Making it large, green, and tactile amplifies the
reward sensation.

---

### 7.2 Correct Answer CTA — "Got It"

A variant of the Primary CTA that appears specifically in the correct-answer
state. Same structure, different colour register.

```
Fill:           #DDF4FF (otter blue tint)
Border:         2px solid #84D8FF
Border-bottom:  4px solid #84D8FF
Label:          #1CB0F6 (otter blue), DIN Next Rounded Bold
```

The blue variant signals "success confirmed, move forward." It pairs with the
blue correct-answer feedback card above it, creating a unified correct-answer
colour moment. Green is deliberately absent — green is the neutral next-action
colour; blue is the correct-answer signal.

---

### 7.3 Incorrect Answer CTA — "Got It"

```
Fill:           #FFDFE0 (cardinal red tint)
Border:         2px solid #FF9090
Border-bottom:  4px solid #FF9090
Label:          #FF4B4B (cardinal red), DIN Next Rounded Bold
```

Same structure, red register. Reinforces the incorrect-answer state.

---

### 7.4 Secondary / Ghost Button ✅ → `happy-brand-secondary-cta`

Used for secondary actions — "Skip", "Remind me later", "Maybe later".

```
Size:           Full width or content-width, 48–56px height
Border radius:  12px                               ✅ → radius-lg
Fill:           #FFFFFF (transparent or white)     ✅ → bg-brand-surface
Border:         2px solid #E5E5E5 (wolf grey 300)  ✅ → border-brand-border
Border-bottom:  4px solid #AFAFAF                  ✅ → border-b-4 border-b-brand-border-strong
Label:          #777777 (wolf grey 400), Bold, 16px ✅ → text-ink-soft happy-font-body-bold
```

Ghost buttons have significantly less visual weight than the Primary CTA —
which is the point. The eye goes to the Primary CTA first. The Ghost button
exists for users who want to decline, not for users who want to proceed.

**Duolingo rule:** Ghost buttons never appear without a Primary CTA adjacent
to them. A screen should never have two equal-weight buttons — always one
primary, one secondary.

---

### 7.5 Destructive Button

Used for irreversible actions: account deletion, data clearing.

```
Fill:           #FFFFFF
Border:         2px solid #FF9090
Border-bottom:  4px solid #FF4B4B
Label:          #FF4B4B (cardinal red), DIN Next Rounded Bold
```

The destructive button uses red borders rather than red fill. A fully red
filled button reads as a panic state — too aggressive for a product with
Duolingo's warm voice. Red border on white fill reads as "warning: be sure"
without creating alarm.

**Always paired** with a Ghost "Cancel" button above or adjacent. Never the
only action on screen.

---

### 7.6 Super Duolingo / Premium CTA

```
Fill:           #CE82FF (macaw purple)
Border:         2px solid #9B59B6
Border-bottom:  4px solid #9B59B6
Label:          #FFFFFF, DIN Next Rounded Bold
```

Purple is reserved exclusively for Super Duolingo (premium) surfaces. When
users see a purple button, they have trained (unconsciously) to read it as
"this is a premium feature." The colour does the semantic labelling before
any copy is read.

---

### 7.7 Streak Freeze / Special Action Button

```
Fill:           #FFD900 (bee yellow)
Border:         2px solid #F0B400
Border-bottom:  4px solid #F0B400
Label:          #3C3C3C (dark ink), DIN Next Rounded Bold
```

Yellow buttons are rare — used only for streak-adjacent actions (buy streak
freeze, activate XP boost). The yellow creates an instant visual connection
to the streak counter above it, making the button feel thematically related
without needing explanatory copy.

Dark label on yellow (not white) because yellow's luminance is high enough
that white text fails contrast requirements.

---

### 7.8 Icon-Only Button

Used for navigation: back arrow, close (×), hint request.

```
Size:           44×44px minimum, usually 48×48px
Border radius:  50% (circle) or 12px (rounded square for close)
Fill:           Transparent (in content) or #F7F7F7 (in header)
Border:         None (no depth effect — not a primary action)
Icon:           24px, wolf-grey-400 (#777777) or contextual
```

Icon buttons deliberately omit the depth border. The depth effect signals
"press me to advance." Navigation icons are ambient — they should not
compete visually with the primary CTA.

---

### 7.9 Answer Toggle (Tap-to-Select)

Not a traditional "button" but uses the same depth mechanics. Covered in
detail in Card Variations (§8.3) because it behaves as a card with a
selected state.

---

### 7.10 Pill / Chip Button

Small, pill-shaped, used for hint words in word-bank exercises.

```
Size:           Content-width, 40px height
Border radius:  999px (full pill)
Fill:           #FFFFFF
Border:         2px solid #E5E5E5
Border-bottom:  3px solid #AFAFAF (depth, but shallower than primary CTA)
Label:          ink (#1F1F1F), DIN Next Rounded Bold, 15px
Padding:        0 16px
```

Pill buttons are shallower depth (border-b: 3px not 4px) because they are
smaller elements — full 4px depth on a 40px height element looks out of
proportion.

---

## 8. Card Variations

Cards are the information containers of Duolingo's UI. Unlike buttons, cards
are primarily read before being acted on. Their design is optimised for fast
scanning — the user must be able to understand the card's content, state,
and actionability in under one second of visual processing.

All cards share the depth border mechanic. Inactive/locked cards drop the
depth border — flat appearance signals "not currently actionable."

---

### 8.1 Answer Option Card ✅ → `happy-brand-pressed-card` + state variants ✅ → `Card` variant="answer|answer-selected|answer-correct|answer-incorrect|answer-disabled"

The most-used component in the entire product. Used in multiple-choice,
translation matching, and listening exercises.

```
Size:           Full width, min 64px height (grows with content)
Border radius:  16px                               ✅ → radius-xl / rounded-2xl
Fill:           #FFFFFF                            ✅ → bg-brand-surface
Border:         2px solid #E5E5E5                  ✅ → border-brand-border
Border-bottom:  4px solid #AFAFAF                  ✅ → border-b-4 border-b-brand-border-strong
Padding:        16px horizontal, 14px vertical
Label:          DIN Next Rounded Bold, 16px, ink   ✅ → happy-font-body-bold text-ink
```

**Full state matrix:**

| State     | Fill    | Border-side | Border-bottom | Happy mapping                          |
| --------- | ------- | ----------- | ------------- | -------------------------------------- |
| Default   | #FFFFFF | #E5E5E5     | #AFAFAF       | ✅ `happy-brand-pressed-card`          |
| Selected  | #DDF4FF | #84D8FF     | #84D8FF       | ✅ `happy-brand-pressed-card-selected` |
| Correct   | #DDF4FF | #84D8FF     | #84D8FF       | ✅ `happy-brand-card-correct`          |
| Incorrect | #FFDFE0 | #FF9090     | #FF9090       | ✅ `happy-brand-card-incorrect`        |
| Disabled  | #F7F7F7 | #E5E5E5     | #E5E5E5       | ✅ `Card` variant="answer-disabled"    |

**Anatomy of the card:**

```
┌──────────────────────────────────────────────────────────┐
│  [optional icon / flag]    Answer text here              │  ← content
│                                                          │
└──────────────────────────────────────────────────────────┘
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← border-bottom
```

The darker bottom border creates the impression the card is resting on a
surface. When tapped, it "sinks" with translateY and border-b collapse.

---

### 8.2 Word Bank Tile ✅ → `Card` variant="word-bank|word-bank-placed"

Used in type-the-answer exercises. Smaller than the answer option card.

```
Size:           Content-width, 40px height
Border radius:  999px (pill)
Fill:           #FFFFFF
Border:         2px solid #E5E5E5
Border-bottom:  3px solid #AFAFAF
Padding:        0 16px
Label:          DIN Next Rounded Bold, 15px, ink
```

| State    | Fill    | Border-bottom | Action                 |
| -------- | ------- | ------------- | ---------------------- |
| Default  | #FFFFFF | #AFAFAF       | Available to tap       |
| Selected | #F0F0F0 | (flat)        | Placed in answer area  |
| Disabled | #F7F7F7 | (flat)        | Already used in answer |

When a word tile is "placed" in the answer area, it appears flat (no depth)
in the destination slot and the source slot goes flat/disabled. The depth
is restored if the word is tapped back to the bank.

---

### 8.3 Lesson Tile (Path Circle)

The circles on the learning path. Each represents one lesson.

```
Size:           72×72px (standard), 88×88px (unit start / boss lesson)
Border radius:  50% (circle) or 12px (shield/star shapes for special types)
```

**States:**

| State     | Fill    | Border      | Icon                           | Interaction       |
| --------- | ------- | ----------- | ------------------------------ | ----------------- |
| Locked    | #E5E5E5 | none (flat) | Lock icon, grey                | Non-tappable      |
| Available | #58CC02 | 4px #58A700 | Star / lesson type icon, white | Tappable          |
| Current   | #58CC02 | 4px #58A700 | Pulsing ring animation         | Tappable          |
| Complete  | #58CC02 | none (flat) | Checkmark, white               | Tappable (review) |
| Legendary | #FFD900 | 4px #F0B400 | Star icon                      | Tappable          |

The pulsing ring on the current lesson is the only persistent animation in
the home screen — a slow scale pulse (1.0 → 1.08 → 1.0, 2s period) that
draws the eye to exactly where the user should tap next. Everything else is
static; the current lesson breathes.

---

### 8.4 Unit / Section Card ✅ → `Card` variant="unit"

The banner that divides sections of the learning path.

```
Size:           Full width, ~100px height
Border radius:  16px
Fill:           Contextual (each unit has a unique accent fill — blue,
                purple, orange, etc. One colour per unit for wayfinding)
Border:         none
Padding:        16px
```

**Anatomy:**

```
┌─────────────────────────────────────────────────────────┐
│  UNIT 2 · BASIC PHRASES               [Unit illustration] │
│  Learn simple greetings and phrases                      │
└─────────────────────────────────────────────────────────┘
```

Unit cards intentionally drop the depth border — they are wayfinding
containers, not interactive actions. Flat appearance communicates "this is
information, not a button."

---

### 8.5 XP / Stats Card ✅ → `happy-brand-metric-card` ✅ → `Card` variant="metric"

```
Size:           Full width or ~half width (two per row), 80–100px height
Border radius:  16px                                  ✅ → radius-xl
Fill:           Contextual tint (yellow for XP, etc.) ✅ → bg-brand-surface-soft (sage tint)
Border:         2px solid (slightly darker than fill)
Border-bottom:  4px solid
Padding:        16px
```

**Anatomy:**

```
┌─────────────────────────────────────────────────────────┐
│  🔥 STREAK                                               │
│  47                                                      │
│  Day streak                                              │
└─────────────────────────────────────────────────────────┘
```

Stats cards use Eyebrow + Counter + Caption stacked vertically.
The Counter uses Feather Bold at the largest size in the component (28–36px)
because the number IS the content — everything else is labelling context.

---

### 8.6 Achievement / Badge Card ✅ → `Card` variant="achievement-unlocked|achievement-locked"

```
Size:           80×80px (grid) or full-width (detail)
Border radius:  16px
Fill:           #FFFFFF (unlocked) or #F7F7F7 (locked)
Border:         2px solid (gold for unlocked, #E5E5E5 for locked)
Border-bottom:  4px solid (gold for unlocked, none for locked)
```

| State    | Fill    | Badge icon              | Label colour  |
| -------- | ------- | ----------------------- | ------------- |
| Locked   | #F7F7F7 | Greyscale / silhouette  | wolf-grey-200 |
| Unlocked | #FFFFFF | Full colour + glow      | ink (#1F1F1F) |
| New      | #FFFFFF | Full colour + badge dot | ink + red dot |

Locked badges show a silhouette of the badge shape rather than hiding them
entirely. Users can see what they're working toward — ambiguity would remove
the motivational pull. The shape is legible, the colour is withheld.

---

### 8.7 Notification / Nudge Card ✅ → `Card` variant="notification"

```
Size:           Full width, ~72px height
Border radius:  16px
Fill:           Contextual (yellow for streak, green for XP, blue for info)
Border:         2px solid (darker version of fill colour)
Border-bottom:  4px solid
Padding:        12px 16px
```

**Anatomy:**

```
┌───────────────────────────────────────────────────────────┐
│  [Icon]  Headline text in bold                       [→]  │
│          Secondary detail text, smaller, regular          │
└───────────────────────────────────────────────────────────┘
```

The trailing chevron (→) is the only interactive affordance cue — it signals
"this is tappable and leads somewhere." Without it, the card reads as a
static notification.

---

### 8.8 League / Leaderboard Row Card ✅ → `Card` variant="leaderboard-default|leaderboard-self|leaderboard-promotion|leaderboard-demotion"

```
Size:           Full width, 56px height
Border radius:  0 (rows in a list have no individual radius)
Fill:
  — Default:            #FFFFFF
  — User's own row:     #FFF5D6 (yellow tint — "you are here")
  — Promotion zone:     #F0FAE8 (green tint — top 10, getting promoted)
  — Demotion zone:      #FFF0F0 (red tint — bottom 5, at risk)
Border:         Bottom only, 1px solid #E5E5E5 (divider)
```

**Anatomy:**

```
  3  [Avatar]  UserName                           1,240 XP  [+12] ↑
```

Position, avatar, name, and XP in a single scannable row. The `[+12] ↑`
delta indicator shows recent movement — which is the most psychologically
triggering element on the screen. Users react more to relative movement
than to absolute score.

---

### 8.9 Reward / Chest Card

```
Size:           Full width, ~120px height
Border radius:  16px
Fill:           Gradient — dark rich colour (e.g., deep purple or dark
                teal) with gold ornament on top
Border:         2px solid gold (#FFD900)
Border-bottom:  6px solid (darkened gold)
```

Chest cards are the most visually elaborate cards in the system. They
use gradient fills — the only component in Duolingo's UI where a gradient
is sanctioned. The rationale: rewards should feel special, and gradients
signal "this is not a regular card." Using gradients everywhere would
dilute this signal.

**States:**
| State | Fill | Lock icon | Interaction |
|-----------|----------------|-----------|---------------|
| Locked | Dark gradient | Gold lock | Non-tappable |
| Unlocking | Animated glow | Animating | In-progress |
| Opened | Flat #F7F7F7 | None | Content shown |

---

### 8.10 Empty State Card ✅ → `happy-brand-empty-state` ✅ → `Card` variant="empty"

```
Size:           Full width, ~200px height
Border radius:  16px                                ✅ → radius-xl
Fill:           #F7F7F7                             ✅ → bg-brand-surface-soft
Border:         2px dashed #E5E5E5                  ✅ → border-dashed border-brand-border
Border-bottom:  none (flat — not a pressable item)  ✅ → no border-b depth applied
```

Empty states use a **dashed border** — the only context in Duolingo's system
where dashed borders appear. The dashed style communicates "placeholder" or
"slot awaiting content" at a pre-conscious level. It is universally understood
without explanation.

---

## 9. Component Primitives

### Answer option card

The most important component in Duolingo. Users tap it hundreds of times per
session. Its states:

```
Default:   White fill, grey border-2, grey border-b-4
Hover:     Slight darkening on fill (#F7F7F7), no size change
Selected:  Blue fill (#DDF4FF), blue border (#84D8FF)
Correct:   Blue fill + checkmark icon + "Correct!" banner slides up
Incorrect: Red fill (#FFDFE0) + shake animation (2–3 cycles, 300ms total)
```

The shake on incorrect is calibrated carefully: 2–3 short cycles, not the
long panic shake seen in password fields. A short shake reads as "nope, try
again" — friendly correction. A long shake reads as "you failed badly."

### Progress bar (XP / lesson) ✅ → `happy-brand-progress-track` / `happy-brand-progress-fill`

```
Track:     #E5E5E5 (grey, recedes)    ✅ → bg-brand-border (rounded-full)
Fill:      #58CC02 (brand green)      ✅ → bg-sage-500 (rounded-full)
Animation: Spring-eased fill (overshoot ~3px, settle back) on each correct
           answer. The overshoot is important — it feels like the bar is
           excited, not just moving.
Shape:     Full pill (border-radius: 999px)  ✅ → rounded-full
Height:    8px (lesson), 16px (XP weekly goal)
```

The fill overshoot on correct answers is a micro-feedback that is below
conscious perception but above subliminal — users can't describe it, but
removing it makes the progress bar feel "dead."

### Hearts (lives)

Hearts are displayed in the header, in a row, as filled/empty emoji-style
icons. Key design decisions:

- Full hearts: bright red (#FF4B4B fill), slightly darker outline
- Empty hearts: grey (#AFAFAF) outline only — the empty space is a visual
  ghost of what was lost
- The transition from full to empty is an animation: heart collapses with
  a brief scale-down and opacity fade
- Refill timer is shown with a subtle circular countdown under the hearts

The empty heart ghost is a loss aversion trigger: the absence of something
that was present is more motivating than an abstract "lives remaining" count.

### Streak display

```
Streak number:  Large, Feather Bold, yellow (#FFD900)
Flame icon:     Animated on active day (subtle pulse, 1s period)
Background:     Yellow tinted surface (#FFF5D6)
Frozen state:   Grey fill, broken flame icon — communicates loss viscerally
```

The streak component is arguably the most psychologically loaded UI element
in Duolingo. Its placement at the top of the home screen means it is the
first thing users see every session. This is deliberate — the streak primes
the engagement before any learning content is visible.

### Leaderboard

Users are shown their position in a league of 30 people. Key design choices:

- Top 3: Gold/Silver/Bronze crown icons — borrows from sports podium mental
  model, immediately understood
- Promotion zone: subtle green background tint behind top 10 rows
- Demotion zone: subtle red background tint behind bottom 5 rows
- The user's own row: slightly elevated (box-shadow or background highlight)
  so it's instantly findable on scroll
- Refresh animations: new scores cause rows to animate upward, showing
  real-time competition

---

## 10. Motion & Feedback

### Motion philosophy

Duolingo's motion principle: **every animation communicates state, nothing
is decorative.** This is the hardest motion discipline to maintain at scale,
and Duolingo maintains it almost perfectly.

Every animation in the product answers one of these questions:

1. Did my action succeed or fail?
2. Where am I in the flow?
3. What am I being rewarded with?

If an animation doesn't answer one of those questions, it doesn't ship.

### Celebration animations (XP gain, lesson complete)

```
XP counter:     Number increments with a fast count-up (ease-out, ~600ms)
               Numbers are tabular (equal width) so the counter doesn't jump
Lesson complete: Confetti burst — randomised particles, ~2 seconds
               Duo animates into frame with a specific "celebration" pose
Streak increase: Flame grows briefly (scale: 1.0 → 1.4 → 1.0) with a
               warm particle effect. Sound is paired (iOS haptic on mobile)
```

The count-up on XP is psychologically significant. Even if you know you're
getting 10 XP, watching the number count from 0 to 10 triggers more dopamine
than simply displaying "10 XP." This is the same effect casinos use with
coin-drop sounds on slot machines.

### Error feedback

```
Wrong answer shake:    translateX: 0 → 8px → -6px → 4px → -2px → 0
                       Duration: ~300ms, ease-in-out for each step
                       Cycles: 3 (enough to signal error, not punish)
Heart loss pulse:      Scale down + opacity fade on the lost heart
                       Duration: 400ms
                       A replacement grey ghost heart fades in simultaneously
Session end (no hearts): Duo appears with sad/disappointed expression,
                       full screen modal — not a banner. Forces acknowledgment.
```

### Transition timing

| Context                      | Duration | Easing              |
| ---------------------------- | -------- | ------------------- |
| Button press feedback        | 100ms    | ease-in             |
| Card selection               | 150ms    | ease-out            |
| Progress bar fill            | 400ms    | spring (overshoot)  |
| Screen transition            | 250ms    | ease-in-out         |
| Celebration (confetti, etc.) | 1500ms   | custom              |
| Modal enter                  | 300ms    | ease-out (slide up) |
| Duo character entrance       | 350ms    | spring              |

The 100ms button press is below the threshold of conscious perception — the
user experiences it as "responsive" without being able to measure it. Anything
over 200ms on a tap starts to feel sluggish on mobile.

---

## 11. Character & Illustration System

### Duo the owl

Duo is not a mascot. Duo is a relationship.

The character is designed with a small number of deliberate emotional states,
each with a specific in-product trigger:

| Duo state           | Trigger                             | Psychological role        |
| ------------------- | ----------------------------------- | ------------------------- |
| Happy / celebrating | Lesson complete, streak milestone   | Positive reinforcement    |
| Encouraging         | Mid-lesson, first question prompt   | Social presence, warmth   |
| Nervous / worried   | User hasn't opened app in 20+ hours | Mild social guilt trigger |
| Sad / disappointed  | Streak broken                       | Loss reinforcement        |
| Excited / surprised | Rare achievement, league promotion  | Reward amplification      |
| Angry (meme state)  | Never official, but acknowledged    | Cultural resonance        |

The worried/sad states are the most psychologically sophisticated. They invoke
a _social obligation_ — the user feels like they are letting down a character
they have a relationship with. This is more effective than any abstract
"don't break your streak" warning because it triggers the same neural pathway
as disappointing a friend.

### Character design principles

**Flat with dimension:** Characters are 2D illustration style but have subtle
shading and highlight fills that give them volume without entering 3D rendering
territory. This keeps render costs low and maintains stylistic consistency
across thousands of individual character poses.

**Consistent line weight:** Every character uses the same stroke weight
(approximately 3–4px equivalent). Mixing line weights across characters would
make the illustration universe feel incoherent.

**Diverse but not tokenistic:** The human characters in Duolingo lessons
represent a wide range of body types, skin tones, ages, and cultural contexts.
The diversity is integrated into the character system at the design token level
— skin tone, hair style, and clothing are modular, so any base character can
be varied without redrawing from scratch.

**Emotion through silhouette:** Duo's emotional states are distinguishable in
silhouette — the character's posture and the shape of its eyebrows tell the
story before you see any detail. This is a Disney animation principle:
"the pose must read at thumbnail size."

---

## 12. Cognitive Psychology Mechanics

This section is the core of what separates Duolingo from other educational
apps. The visual design is excellent, but the psychological architecture is
what generates the 500M+ daily active users.

### 12.1 Loss aversion (Kahneman & Tversky)

**The mechanism:** Humans feel the pain of a loss approximately 2× more
intensely than the pleasure of an equivalent gain. Duolingo weaponises this
asymmetry across multiple features.

**Streak system:** Once a user has a 30-day streak, they are not motivated by
"I want to reach 31 days." They are paralysed by "I cannot lose 30 days." The
fear of loss is 2× stronger than the desire to gain. Every day the streak
grows, the loss aversion grows with it. The system is self-compounding.

**Hearts (lives):** Each wrong answer costs a heart. The pain of losing a
heart is far greater than the satisfaction of keeping it. Users slow down,
double-check answers, and engage more carefully — all because of loss
aversion, not because of learning motivation.

**Streak Shield (paid feature):** Users can purchase streak insurance. The
brilliant design insight: you're not selling a streak freeze, you're selling
_relief from loss anxiety._ The product monetises the psychological distress
that the product itself created. This is ethically controversial but
commercially brilliant.

### 12.2 Variable reward schedules (Skinner)

**The mechanism:** Intermittent variable reinforcement — rewards delivered
unpredictably — creates stronger behaviour attachment than fixed schedules.
This is the same mechanism behind slot machines.

**Duolingo's implementation:**

- Gem rewards after lessons are variable (sometimes 0, sometimes 5, sometimes
  rare bonus amounts)
- "Daily bonus" XP multipliers appear unpredictably
- League positions shift unpredictably throughout the week
- "Chest" rewards in some versions contained random amounts

The unpredictability means users cannot habituate to the reward and stop
caring. They always open the app wondering "what will I get today?"

### 12.3 Commitment devices (Ariely)

**The mechanism:** People are more likely to follow through on commitments
they have articulated themselves, especially if those commitments are public
or visible.

**Duolingo's implementation:**

- Daily goal setting: "5 minutes / 10 minutes / 15 minutes / 20 minutes"
  Users choose the goal — they have made a commitment to themselves
- The goal setting happens during onboarding, when motivation is highest
- The app reinforces the commitment ("You said you wanted 10 minutes/day")
  making it feel like the user is failing their own promise, not an external
  rule

### 12.4 Social comparison theory (Festinger)

**The mechanism:** Humans evaluate themselves by comparing to others. When
the comparison is favourable (we're ahead), we feel good. When unfavourable
(we're behind), we are motivated to close the gap.

**Duolingo's league system:**

- 30 strangers in a league — unknown people, so you can't feel embarrassed,
  but real enough to trigger comparison
- The promotion/demotion zones create urgency: stay above the demotion line,
  push into the promotion zone
- Weekly reset keeps competition fresh — no one can permanently dominate

The placement of the leaderboard (prominent but not primary) is calibrated
to trigger social comparison without making it the dominant experience.
Users who find competition demotivating can ignore it; users who find it
motivating cannot avoid it.

### 12.5 Progress visualization (Zeigarnik effect)

**The mechanism:** Incomplete tasks create psychological tension that persists
until the task is complete. The brain keeps interrupted tasks "open" in
working memory, generating an uncomfortable pull toward completion.

**Duolingo's implementation:**

- Lesson XP progress bar is always visible during a lesson
- The daily goal ring is partially filled from the moment you open the app
- Unit completion circles show exactly how many lessons remain
- The circle is **never** shown as "0% complete" — the first lesson always
  pre-fills a small segment to make the circle look started, not empty

That last point is critical. An empty circle reads as "this task hasn't
started." A 5% filled circle reads as "this task is in progress." The
Zeigarnik effect only operates on tasks that feel started — Duolingo
manufactures that feeling from the very first moment.

### 12.6 Identity-based habit formation (Clear, Fogg)

**The mechanism:** Habits attached to identity ("I am someone who X") are
more durable than habits attached to outcomes ("I want to achieve X").

**Duolingo's implementation:**

- Streak count is displayed as identity: "You're on a 47-day streak" not
  "You have 47 streak points"
- League tier names (Bronze, Silver, Gold, Sapphire, Diamond) create
  identity hierarchy — "I'm a Diamond League learner"
- The onboarding asks "Why are you learning?" — anchoring the app to a
  deeply personal motivation (reconnecting with family heritage, preparing
  for travel, etc.)
- Profile display of streak and XP to friends makes the habit semi-public,
  strengthening identity attachment

### 12.7 The sunk cost trap (ethically managed)

**The mechanism:** Humans over-weight past investments when making present
decisions. Prior effort creates psychological commitment that continues even
when the rational calculation would say "stop."

**Duolingo's use:** A 200-day streak represents approximately 200 units of
sunk time investment. Breaking it not only triggers loss aversion but also
feels like retroactively wasting all prior effort. The two mechanisms
compound each other.

**The ethical note:** Duolingo has been credited with making this mechanism
_pro-social_ — users actually are learning, so the sunk cost reinforcement
produces genuine real-world value. Compare to social media engagement loops
that exploit the same mechanism for pure extraction.

### 12.8 Anchoring and the "just 5 minutes" effect

**The mechanism:** Anchoring — the first number you encounter shapes all
subsequent evaluation. "5 minutes" anchors the perception of the daily
commitment.

**Duolingo's onboarding:** The minimum daily goal is 5 minutes. This anchor
makes the task feel trivially small. Users who genuinely spend 45 minutes
doing lessons still think of themselves as "5 minute/day Duolingo users."
When they miss a day, the regret is proportional to a 5-minute task —
not a 45-minute task — which makes the commitment easier to resume.

---

## 13. Hyper-Consistency as a Trust Signal

### What hyper-consistency means

Every screen in Duolingo — across all 30+ languages, iOS and Android,
onboarding and advanced lessons, free and premium tiers — uses identical
visual patterns. The answer card looks the same in Spanish as in Korean.
The progress bar works the same in beginner mode as in advanced mode.
The celebration animation is the same whether you're learning your first
word or your ten-thousandth.

This is not laziness or lack of design investment. It is a deliberate trust
architecture.

### Why consistency builds trust

The human brain is a pattern-matching machine. When a UI behaves consistently:

1. **Cognitive load drops to zero** — the user never has to think about
   "how does this work?" They already know. Their attention is free for
   the learning task.

2. **Predictability is safety** — in contexts of cognitive effort (learning),
   unpredictable UI feels threatening. Consistent UI feels safe. Safe
   environments are where learning happens.

3. **Implicit competence** — users who move through a consistent UI feel
   competent and fluent. That feeling of competence transfers to the
   learning task ("I understand this app, I can understand this language").

### How Duolingo enforces it

**The design system as a constraint, not a toolkit.** Most design systems
offer components as options. Duolingo's system offers them as requirements.
A new team building a new feature does not have the option to invent a new
kind of answer card or a new kind of progress indicator. They use what exists,
and if what exists doesn't work, they propose an addition to the system —
not a one-off exception.

**Design QA is part of shipping.** Every screen shipped at Duolingo goes
through a visual consistency review. Not "does this look good?" (subjective)
but "does this use the system correctly?" (objective and auditable).

**The same component, unchanged, for years.** The core answer option card
has not structurally changed since the 2021 rebrand. Users who started on
Duolingo in 2021 and return in 2025 recognise it instantly. That recognition
is a product asset — it is the tactile equivalent of a friend's handshake.

---

## 14. What Makes It Premium

"Premium" in consumer software is not about expense. It is about the sensation
that the product was made with care, by people who thought hard about every
decision, for users whose intelligence and time they respect.

Duolingo achieves this through five specific design choices:

### 1. Restraint in celebration

Duolingo celebrates constantly — every correct answer, every lesson complete,
every league advancement. But each celebration is _short._ The confetti lasts
2 seconds. Duo's animation plays once. The XP counter finishes in under a
second. The celebration never outstays its welcome.

Apps that shower users with endless celebration animations read as desperate.
Quick, genuine celebrations read as confident.

### 2. Never punishing, always redirecting

A wrong answer in Duolingo shows you the correct answer immediately and
moves you forward. There is no score reduction, no screen of shame, no
waiting penalty (in most modes). The app treats being wrong as information,
not a failure. This is an incredibly difficult UX position to maintain —
the temptation to add friction to errors (to make success feel more earned)
is strong. Duolingo resists it.

### 3. Asymmetric screen hierarchy

Every screen has a single primary action. One button. One next step. The
cognitive load of "what do I do now?" is zero. This is harder to design
than it looks — it requires saying no to every stakeholder who wants a
secondary CTA on the lesson complete screen, a settings shortcut on the
quiz screen, an upsell banner on the progress screen. Duolingo says no.

### 4. The typography-colour relationship

Duolingo's brand green (#58CC02) appears almost exclusively on:

- Primary CTA buttons
- Progress fills
- Correct-answer states

It does not appear in text, does not appear in decorative elements, does not
appear in navigation. This restraint means that everywhere green appears,
it communicates "action" or "success." Users learn this mapping subconsciously
within their first session. After that, green requires no label — it is a
universal signal.

### 5. The sound of the product

Duolingo's audio design is a separate system that mirrors the visual system:

- Correct answer: short, warm tone (major chord interval, ~200ms)
- Wrong answer: short, lower tone (minor, slightly dissonant, ~200ms)
- Lesson complete: full musical phrase (~3 seconds)
- Streak milestone: unique sound, longer, more celebratory

The sounds are never random. Every audio event maps to a specific product
event, and users learn the mapping the same way they learn the visual mapping.
The audio layer doubles every feedback signal — which is why Duolingo works
with sound on, but also works perfectly with sound off (the visuals carry
the full load).

---

## Summary: The design lesson

Duolingo's design system teaches one lesson that is worth more than any
individual component or colour token:

**The product is not the feature. The product is the habit.**

Everything in the design system — the type, the colour, the depth effects,
the motion, the characters, the psychology mechanics — is organised around
a single goal: reducing the activation energy required to open the app
again tomorrow.

The visual clarity reduces cognitive load (so it's easy to start).
The emotional warmth makes users like it (so they want to come back).
The psychological pull makes users feel they need to come back (so they do).

Each layer amplifies the others. Remove any one and the product still works.
Have all three and you have something that 500 million people use every day.

---

_Research compiled from: Duolingo's public design.duolingo.com guidelines,
published blog posts on the 2021 rebrand, academic literature on gamification
and behavioural psychology (Kahneman, Tversky, Ariely, Skinner, Festinger,
Clear, Fogg), and design system analysis from industry publications._
