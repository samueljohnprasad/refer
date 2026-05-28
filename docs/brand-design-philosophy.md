# Happy Brand Design Philosophy

**Related:** [Premium Feel Research](./premium-feel-research.md) — what makes Apple, Duolingo, Headspace, and Bitepal feel premium, and how to get Happy there.

## Core Idea

**Neutral canvas. Intentional sage.**

The app lives on a pure white surface. Sage green is never decorative — it only appears where it communicates something: an active state, a CTA, a progress moment, a brand mark. Because sage is scarce, every appearance feels meaningful. Structural chrome (borders, secondary text, dividers) is neutral grey so it recedes behind content and never competes with the accent.

---

## Colour System

### The Four Roles

| Role | Colour | When to use |
|---|---|---|
| **Sage** | `#5f7f58` (500) | Active states, primary icons, CTAs, section eyebrows, progress fills |
| **Gold / Bee Yellow** | `#FFD900` | XP badges, streaks, rewards — achievement moments only |
| **Ink** | three levels | All text — see Typography below |
| **Cardinal Red** | `#FF4B4B` | Error, warning, destructive actions, "can't afford" states |

### Sage Scale

The full sage scale runs from near-white to near-black. Each step has a defined job:

```
sage-50 / sage-100   Background tints, icon wells, inactive chips
sage-200 / sage-300  Decorative borders on selected surfaces, dividers
sage-400 / sage-500  Eyebrow text, progress fills, primary icon colour
sage-600             Primary icon colour, brand text accents
sage-700             CTA bottom shadow (depth), pressed CTA state
sage-800             Heavy headings (rare)
sage-selected        Selected card background — #f2f8ef (white-green tint)
sage-pill            Status badge background — #edf5e9
```

### Neutral Greys (Duolingo Wolf Grey — adopted verbatim)

The neutral greys are taken directly from Duolingo's Wolf Grey scale. This ensures our white canvas is perceptually identical to Duolingo's, so the familiar tactile depth reads consistently.

```
brand-surface        #FFFFFF   Screen and card background
brand-surface-soft   #F7F7F7   Wolf Grey 1 — tinted background, icon wells
brand-border         #E5E5E5   Wolf Grey 3 — all card edges, dividers
brand-border-strong  #AFAFAF   Wolf Grey 2 — shadow layer on 3D cards
ink-muted            #AFAFAF   Wolf Grey 2 — timestamps, captions
ink-soft             #767676   Wolf Grey 4 (darkened for AA) — body copy, descriptions
```

### Accent Palette (Duolingo — adopted verbatim)

All non-sage accent colours are Duolingo's exact values. This gives the gamification layer (XP, streaks, achievements, answer feedback) an immediately familiar feel.

```
Cardinal Red    #FF4B4B   Errors, destructive, wrong answers
Bee Yellow      #FFD900   XP, streaks, achievements
Otter Blue      #1CB0F6   Correct answers, info banners
Macaw Purple    #CE82FF   Super / premium surfaces
Parrot Orange   #FF9600   Rare rewards, bonus moments
```

**The three sage tokens are our only custom colours.** Everything else is Duolingo verbatim. This is intentional — the neutral canvas is shared, the brand identity is expressed only through sage.

---

## Typography

### Two Typefaces, One Pairing Rule

| Family | Role | Weights available |
|---|---|---|
| **Fraunces** (serif) | Display moments — screen titles, large headings, hero text, counters | Regular, Medium, SemiBold, Bold + italics |
| **Geist** (sans-serif) | Everything else — body copy, labels, UI text, captions, chips | Regular, Medium, SemiBold, Bold |

**Rule:** Fraunces for emotional/display moments. Geist for functional UI text. Never mix them in the same typographic unit.

### Variant System (`<Text variant="...">`)

All text must render via the `Text` component's `variant` prop. Raw `className` font utilities (`happy-font-*`) should never appear in screen files — they belong inside `Text.tsx` only.

```
HEADING FAMILY (Fraunces)
─────────────────────────────────────────────────────────
display          36px  bold       -0.02em   ink       Screen hero, one per screen max
h1               28px  regular    -0.01em   ink       Screen title
h2               22px  regular    —         ink       Section heading
h3               18px  medium     —         ink       Card heading, scannable titles
display-italic   36px  sb-italic  -0.02em   ink       Celebratory moments
h1-italic        28px  sb-italic  -0.01em   ink       Hero pull quotes
h2-italic        22px  m-italic   —         ink       Expressive accents

BODY FAMILY (Geist)
─────────────────────────────────────────────────────────
body-bold        17px  bold       —         ink       Interactive text, decisions
body             17px  regular    —         ink-soft  Non-interactive copy, descriptions
label            14px  medium     —         ink       Form labels, secondary UI text
label-bold       14px  bold       —         ink       Active filter pills, step numbers
caption          13px  medium     +0.01em   ink-soft  Metadata, timestamps
caption-muted    13px  medium     +0.01em   ink-muted Decorative metadata ONLY (2.19:1)
chip             12px  bold       —         ink-soft  Pill/badge text inside containers
eyebrow          11px  bold CAPS  +0.08em   sage-500  Section identifiers (max 3 words)
overline         11px  bold CAPS  +0.08em   ink-muted Neutral section label (decorative)
button-label     17px  bold       +0.01em   surface   CTA button text (white on fill)
counter          36px  bold       -0.01em   ink       Tabular numerals, streak counts
```

### Color Overrides

Use `color=` prop to override the variant's default color:

```
ink        text-ink           Primary — headings, labels, interactive
soft       text-ink-soft      Secondary — body copy, descriptions
muted      text-ink-muted     Decorative ONLY — non-essential metadata
sage       text-sage-500      Brand accent — active/success states
surface    text-brand-surface White text on dark fills
danger     text-cardinal-red  Errors (large text / icon-paired only)
streak     text-bee-yellow    ICON/FILL ONLY — never as text on white
premium    text-macaw-purple  ICON/FILL ONLY — never as text on white
```

### Three Ink Levels — Use the Correct One

```
ink        #142414   Dark green-black. Screen titles, card headings, primary labels.
                     Our custom brand ink — the only green text in the product.
                     Contrast: 16.25:1 — always passes.

ink-soft   #767676   Neutral grey. Body copy, descriptions, secondary labels.
                     Darkened from Duolingo #777777 for WCAG AA (4.54:1). No green cast.

ink-muted  #AFAFAF   Neutral mid-grey. DECORATIVE ONLY.
                     Contrast: 2.19:1 — fails WCAG AA. Never use for text the user
                     needs to read (errors, instructions, interactive labels).
                     Reserved for: timestamps, inactive tabs, peripheral metadata.
```

**Never use `text-gray-*` or `text-slate-*` in brand components.**
Map to the three ink levels instead:
- `gray-900/800` → `text-ink`
- `gray-700/600` → `text-ink-soft`
- `gray-500/400/300` → `text-ink-muted`

### Eyebrow Text

Use `<Text variant="eyebrow">` — `text-sage-500`, bold, wide tracking, ALL-CAPS. This is the *one expected place* for green text in a body layout. Examples: `DAILY REFLECTION`, `CBT CORE`, `YOUR PATTERN`.

---

## Depth System

### The Principle

Cards simulate elevation with a **thick bottom border or shadow layer** — not `box-shadow`. This is crisper, lighter to render, and consistent across platforms.

### Two Approaches

**Legacy CSS depth** (older components): `border-b-[4-6px]` with `border-b-brand-border-strong` on the card face.

**Duolingo-style spring depth** (new Card component): A separate shadow layer sits `shadowDepth`px below the face. On press, the face springs down via `translateY` into the shadow — the gap closes and the depth collapses, exactly like Duolingo's lesson nodes.

```
Face:   uniform border-2 all around (no thick border-b)
Shadow: absolutely positioned, backgroundColor: brand-border-strong
Depth:  tile = 4px, answer = 4px, word-bank = 3px
Press:  translateY(shadowDepth) via SPRING_DUOLINGO_PRESS
Release: translateY(0) with natural bounce
```

### Surface Hierarchy

```
happy-brand-screen          Screen root. bg-brand-canvas (#f8faf7).
happy-brand-card            Flat — static info, not tappable.
happy-brand-card-strong     Flat with heavier border — on tinted backgrounds.
happy-brand-card-selected   Active flat card. Sage border + sage-selected bg.
happy-brand-raised-panel    Hero panel. border-b-6. Main widget on a screen.
happy-brand-preview-tile    Interactive tile. border-b-5. Exercise/challenge cards.
happy-brand-pressed-card    Tactile list item. border-b-4.
```

**Rule:** Only tappable cards get depth. Static info panels are flat. The depth communicates pressability.

---

## Interactive Components

### CTA Button

```
Primary:   bg-sage-500, border-b-4 border-b-sage-700
           Sage fill + darker sage shadow = tactile, branded.
           Label: text-white

Disabled:  bg-sage-200, border-b-4 border-b-sage-300
           Visually greyed sage — clearly unavailable, not broken.

Secondary: border-2 border-b-4 border-brand-border border-b-brand-border-strong
           Neutral depth — pressable but not competing with primary.
           Label: text-ink-soft (never text-ink)
```

### Answer Cards (exercise flows)

```
Default:      border-2 border-brand-border bg-brand-surface
Selected:     border-2 border-sage-500 bg-sage-selected
Correct:      border-2 border-b-4 border-sage-300 border-b-sage-400 bg-sage-selected
Incorrect:    border-2 border-b-4 border-cardinal-red-border border-b-cardinal-red bg-cardinal-red-tint
```

### Status / Feedback Chips

```
happy-brand-status-chip   Rounded pill, sage-pill bg. Exercise counts, step indicators.
happy-brand-soft-chip     Rounded pill, sage-50 bg. Tag clouds, filter pills, info.
happy-brand-score-badge   Rounded rect, sage-selected bg. Scores, grades.
```

---

## Borders

**All card and panel borders use `brand-border` (`#E5E5E5`) or `brand-border-strong` (`#AFAFAF`).**

Never use:
- `border-gray-100/200` on cards
- `border-slate-*` anywhere
- `border-sage-100/200` on card edges (sage borders are reserved for selected/active states)

Sage borders on a card communicate "this is selected" or "this is active." If everything has sage borders, nothing does.

---

## Radius Scale

```
sm        4px    —
md        8px    —
lg        12px   CTA buttons, modal containers
xl        16px   Answer cards, most cards (default)
icon-well 18px   Icon well squares inside cards (h-12 / h-14 containers)
2xl       20px   Hero panels, prominent widgets
3xl       24px   Bottom sheet top corners
full      9999px Pill chips, word-bank tiles
```

Always use the named utilities — don't invent one-off pixel values.

---

## Gamification Rules

**Gold is earned, not decorative.**

Gold/Bee Yellow appears only in:
- XP badge counts (`+10 XP`, `+15 XP`)
- Streak indicators
- Reward shop items
- Achievement unlocked moments

Using gold for generic highlights kills its premium signal. The same rule applies to the other Duolingo accent colours (Otter Blue, Macaw Purple, Parrot Orange) — each has a single semantic job and must not bleed into other contexts.

---

## Premium Feel

What separates a clean app from a premium one is **intentional contrast** — variation in visual weight, motion, and density that creates composition rather than uniformity. These are the rules that apply directly to Happy's design system.

### 1. Cards must float — never place white on white

White card (`bg-brand-surface`) on a white screen (`bg-brand-surface`) = invisible. The screen background must be a distinct surface:

```
brand-canvas: #F8FAF7   ← sage whisper, 1.5% below white
```

`happy-brand-screen` should use `bg-brand-canvas`, not `bg-brand-surface`. Every card then reads as elevated without any extra work.

### 2. Shadow contrast must be visible

A geometric shadow only communicates depth if it's darker than the card face. The rule:

```
Card on brand-canvas background  →  shadowColor: BRAND_BORDER (#E5E5E5)   ✓
Card on brand-surface (white)    →  shadowColor: BRAND_BORDER_STRONG (#AFAFAF)  ✓
```

`BRAND_BORDER` on a white background = 10% delta = invisible. If the background is white, use `BRAND_BORDER_STRONG`. Fix the background first (rule 1) and the shadow works at `BRAND_BORDER`.

### 3. Depth signals pressability — and nothing else

Only tappable elements get depth. This creates a silent affordance vocabulary: if it has a shadow, it can be pressed. If it's flat, it's static. Never add `border-b` depth to a non-interactive container.

### 4. Fraunces must be visible on every major screen

The Fraunces/Geist contrast is the emotional signal that differentiates Happy from a generic app. Every screen needs at least one `display`, `h1`, or `h2` variant rendering in Fraunces. If a screen uses only `body-bold` through `label`, the brand voice is absent.

Always use `<Text variant="h2">` for section headings — never `className="happy-font-body-bold text-[20px]"`. Raw font utilities bypass the variant system.

### 5. Type range must span at least 3:1 within a screen

Premium screens have dramatic size contrast. If the largest and smallest text on a screen are within 6px of each other, the screen reads as a form, not a crafted experience.

```
Minimum viable range: display (36-40px) → eyebrow/chip (11-12px) = 3:1+
```

The variant system already covers this. Use the extremes — `display` for hero titles, `eyebrow` for section identifiers, `chip` for badges.

### 6. Sage occupies less than 10% of screen pixels

Sage is scarce by design. When it appears, it means something. Every dilution reduces that signal:

- Sage-pill backgrounds on every card → sage stops meaning "active"
- Sage borders on non-selected cards → sage stops meaning "selected"
- Sage text in body copy → sage stops meaning "brand"

Audit any screen where sage appears more than 3–4 times per viewport. If it appears on every card, remove it from at least two of those uses.

### 7. Accent colours each have exactly one semantic job

```
Sage         Active states, CTAs, progress — "do this" / "this is on"
Gold         XP, streaks, achievements — "you earned this"
Otter Blue   Correct answers, info — "this is right"
Cardinal Red Errors, destructive, wrong answers — "something is wrong"
Macaw Purple Premium/Super tier — "this costs something"
```

Never use an accent colour outside its semantic context. A gold chip on a non-reward card confuses the system. A red border on a non-error card creates false alarm.

### 8. Entry animation — screens must feel alive on arrival

Static screens feel like rendered HTML. Premium apps animate elements in. Staggered fade-up is the standard:

```
Each card: opacity 0→1 + translateY 14→0, spring {damping:20, stiffness:200}
Stagger:   40–60ms delay per item
Total:     ~300–500ms for a 6-card screen
```

Use the `FadeInItem` component (`src/components/ui/FadeInItem.tsx`). Always skip animation if `useReducedMotion()` is true — show elements at final state immediately.

### 9. One ambient motion element per screen

Ambient motion (something moving at rest, before the user touches anything) is the most powerful premium signal. One element is enough. More creates noise.

**In Happy:** the `Mascot` component on screen headers is the ambient element. It should have a slow breathing loop:

```
scale: 1.0 → 1.018 → 1.0, duration 2200ms per phase, Easing.inOut(Easing.sin), repeat infinite
```

Skip if `useReducedMotion()` is true. No other element on the same screen should also animate at rest.

### 10. Press interaction is asymmetric — snap down, spring up

The tactile press feel comes from asymmetric timing:

```
Press-in:  withTiming(shadowDepth, { duration: 30 })   — immediate, no bounce
Release:   withSpring(0, SPRING_DUOLINGO_PRESS)         — bounce back with overshoot
```

`SPRING_DUOLINGO_PRESS = { stiffness: 300, damping: 20, mass: 0.4 }` is defined in `motionTokens.ts`. Never use the same spring for both press-in and release — instant down, springy up is the mechanic.

### 11. Spacing is confidence — generous gaps between sections

Tight spacing signals "we're fitting everything in." Generous spacing signals "we have conviction in this content." Between major sections:

```
mb-7  (28px)  → utility app spacing  ✗
mb-10 (40px)  → minimum premium      ✓
mb-12 (48px)  → Apple/Headspace standard  ✓
```

Section headers also need top breathing room. A `DiscoverSection` that's not the first on screen should have `pt-8` (32px) above the eyebrow.

### 12. Haptic vocabulary — match feedback intensity to event weight

```
Tap any card/button        →  impactAsync(Light)           ← current, correct
Toggle / bookmark          →  selectionAsync()
Exercise complete          →  notificationAsync(Success)
Wrong answer / error       →  notificationAsync(Warning)
Streak milestone / major   →  impactAsync(Heavy) then notificationAsync(Success) +80ms
```

Never fire haptics on non-interactive elements. Never stack two haptics within 80ms — they merge into noise.

### 13. Icon wells use category tinting, not uniform sage-50

Every exercise category has a distinct accent from the existing palette. Apply tint to the icon well background and eyebrow only — card face stays white:

```
CBT / Core       bg-sage-50        icon: SAGE[600]
Mindfulness      bg-otter-blue/10  icon: #1CB0F6
Gratitude        bg-gold/10        icon: GOLD
Journaling       bg-macaw-purple/10 icon: #CE82FF
```

Category tinting creates visual rhythm as the user scrolls — each section has a distinct atmosphere without breaking the neutral canvas rule.

### 14. List rhythm — not every card is equal weight

Monotone lists (all items identical) read as data tables, not experiences. Break the rhythm:

- First card in a section → slightly featured: more padding, visible subtitle (`numberOfLines={2}`), eyebrow above
- Regular cards → standard
- Section separator → breathing gap (`mb-10`) + eyebrow header

The eye needs places to rest and places to focus. Identical weight across all items removes both.

### 15. Mascot state reflects context, not decoration

The `Mascot` component has multiple `MascotState` values. Use them semantically:

```
Screen idle / header     →  neutral/default state
Starting an exercise     →  encouraging state
Exercise complete        →  celebrating state
Empty state / no data    →  gentle nudge state
Streak milestone         →  excited state
```

A mascot frozen in one state regardless of context is furniture. A mascot that reacts to what just happened is a character.

---

## What Not to Do

| ❌ Wrong | ✓ Right |
|---|---|
| `text-gray-700` | `text-ink-soft` |
| `text-slate-400` | `text-ink-muted` |
| `border-gray-200` on a card | `border-brand-border` |
| `border-sage-100` on a card edge | `border-brand-border` (sage only on selected) |
| Gold for a generic highlight | Gold only for XP/streaks/achievements |
| Sage text in body copy | Sage text only for eyebrows (`happy-brand-eyebrow`) |
| Raw `#5f7f58` in a component | `SAGE[500]` from `@/lib/tokens` |
| Box-shadow for card depth | `border-b` or shadow-layer depth system |
| Arbitrary border radius | Pick from `RADIUS` scale |
| Fraunces for a label | Fraunces for display, Geist for UI |
