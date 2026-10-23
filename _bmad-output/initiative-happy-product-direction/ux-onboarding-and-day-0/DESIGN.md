---
name: Happy Onboarding & Day-0 — Design Spine
description: Visual identity, tokens, Duolingo-grade 3D tactile buttons, Nunito type hierarchy, and Happi mascot choreography for 7-step onboarding and Day-0 landing.
status: final
sources:
  - ../prd-onboarding-and-day-0/prd-onboarding-and-day-0.md
  - ../forge-onboarding-7-step/forge-onboarding-7-step.md
  - ../../../../PRODUCT.md
  - ../../../../DESIGN.md
updated: 2026-10-20
colors:
  canvas: '#F8FAF7'
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
  ink-soft: '#767676'
  ink-muted: '#AFAFAF'
  border: '#E5E5E5'
  border-sage: '#D3E0CD'
  gold: '#D4A943'
  flame: '#FF9600'
  flame-surface: '#FFF7ED'
  flame-border: '#FDBA74'
  terracotta: '#FF4B4B'
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
    lineHeight: 34px
    letterSpacing: '-0.01em'
  title:
    fontFamily: Nunito
    fontSize: 22px
    fontWeight: 700
    lineHeight: 26px
  body:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-bold:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: 700
    lineHeight: 24px
  label:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: 700
    lineHeight: 18px
  caption:
    fontFamily: Nunito
    fontSize: 12px
    fontWeight: 800
    lineHeight: 16px
    letterSpacing: '0.04em'
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
  xl: 20px
  2xl: 24px
  3xl: 32px
  screen-padding: 24px
  gutter: 16px
components:
  tactile-button:
    height: 56px
    pressDepth: 6px
    borderRadius: '{rounded.full}'
    backgroundColor: '{colors.sage-500}'
    rimColor: '{colors.sage-600}'
    textColor: '#FFFFFF'
    fontSize: '{typography.label.fontSize}'
    fontWeight: 800
  card-interactive:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.sage-200}'
    borderWidth: 2px
    borderRadius: '{rounded.2xl}'
    padding: '{spacing.xl}'
  distortion-chip:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.sage-200}'
    activeBackgroundColor: '{colors.sage-100}'
    activeBorderColor: '{colors.sage-500}'
    borderRadius: '{rounded.lg}'
    padding: '{spacing.lg}'
  streak-capsule:
    backgroundColor: '{colors.flame-surface}'
    borderColor: '{colors.flame-border}'
    textColor: '{colors.flame}'
    borderRadius: '{rounded.full}'
---

# Happy Onboarding & Day-0 — Design Spine

`DESIGN.md` owns the visual identity, tokens, and aesthetic styling rules for Happy's 7-step onboarding and the first 60 seconds on Home. Visual references live under [mockups/](mockups/). On conflict with mocks or legacy code, this spine is the source of truth.

## 1. Brand & Style

Happy is a guided mental health learning companion that blends the playful gamification of Duolingo, the companion warmth of Finch, and the restorative calm of Headspace.

* **Playful, Not Childish**: Rounded forms, vibrant botanical accents, and expressive character acting invite participation without trivializing emotional pain.
* **Tactile & Physical**: Buttons and interactive choices have physical weight. They compress when pressed, spring back when released, and pair with crisp haptic ticks.
* **Calm & Grounded**: A soothing Sage palette anchors the cognitive workspace. High-contrast alerts are strictly reserved for genuine emotional milestones and streak wins.
* **Anti-Slop Craft**: Clean 2D vector illustrations with uniform dark charcoal line art and zero generative AI artifacting.

## 2. Colors

* `{colors.canvas}` (`#F8FAF7`): Warm off-white botanical backdrop that prevents eye strain during late-night spirals.
* `{colors.surface}` (`#FFFFFF`): Pure white elevated card layer for reading and micro-interaction focus.
* `{colors.sage-50}` (`#F8FBF6`) to `{colors.sage-200}` (`#D3E0CD`): Soft reassurance surfaces, instruction containers, and card perimeter borders.
* `{colors.sage-500}` (`#5F7F58`): Primary action face. Used on all major forward CTAs.
* `{colors.sage-600}` (`#44633F`): 3D button press rim. Provides depth and physical feedback.
* `{colors.sage-700}` (`#29452A`) and `{colors.sage-800}` (`#152714`): High-legibility text on light green containers.
* `{colors.ink}` (`#142414`): Deep green-charcoal primary body text. Never pure `#000000`.
* `{colors.flame}` (`#FF9600`) & `{colors.flame-surface}` (`#FFF7ED`): Celebration fire for the Day-1 streak counter.
* `{colors.gold}` (`#D4A943`): Rewarding XP badges and locked curriculum indicators.

## 3. Typography

Nunito is used across all mobile surfaces. Hierarchy is established strictly through weight, scale, and color.

* **Display** (`36px`, 800 ExtraBold, `-0.02em` tracking): Hero greeting and celebration headlines.
* **Headline** (`28px`, 800 ExtraBold, `-0.01em` tracking): Core screen prompts (e.g. *"Notice the trap in your thinking"*).
* **Title** (`22px`, 700 Bold): Card titles and section headers.
* **Body** (`16px`, 400 Regular / 700 Bold, line height `24px`): Thought scenarios, reframes, and descriptive copy.
* **Label / Action** (`14px`–`16px`, 800 ExtraBold, uppercase `0.04em` tracking): Tactile button CTA labels.
* **Caption / Pill** (`12px`, 800 ExtraBold, uppercase tracking): Course anchor badges (e.g. `✦ LESSON 1 · CATCHING THE ALARM`).

## 4. Layout & Spacing

* **Device & Grid**: Optimized for iOS 26+ devices (e.g. iPhone 15/16 Pro, 393pt width).
* **Margins & Gutters**: Horizontal screen margins locked at `{spacing.screen-padding}` (`24px`).
* **Vertical Rhythm**: Progressive disclosure layout with dynamic spacing:
  - Top header progress bar sits 60pt from top safe area.
  - Interactive cards sit in the optical center.
  - Primary CTA locked to bottom with 36pt safe-area bottom clearance.
* **Visual References**:
  - Step 4 Thought Catch: [mockups/key-thought-catch.html](mockups/key-thought-catch.html)
  - Step 5 Milestone Celebration: [mockups/key-milestone.html](mockups/key-milestone.html)
  - Step 7 Timeline Paywall: [mockups/key-paywall.html](mockups/key-paywall.html)
  - First 60s on Home: [mockups/key-home-first60s.html](mockups/key-home-first60s.html)

## 5. Elevation & Depth

* **3D Tactile Rim**: Primary buttons feature a physical 6px bottom rim (`{colors.sage-600}`) beneath the face (`{colors.sage-500}`). When pressed, the face translates down 6px via a 20ms timing curve, giving instantaneous mechanical feedback.
* **Card Elevation**: Subtle 0 4px 12px `rgba(0,0,0,0.03)` shadow with a crisp 2px solid border (`{colors.sage-200}`). No heavy drop shadows.
* **Tonal Stacking**: Depth is achieved through color stacking (`canvas` $\rightarrow$ `surface` $\rightarrow$ `sage-50` accent) rather than blur layers.

## 6. Shapes

* **Buttons & Pills**: Locked to full pill shape (`{rounded.full}`, `9999px`) for high tap friendliness.
* **Cards & Containers**: Rounded to `{rounded.2xl}` (`24px`) for large containers, and `{rounded.lg}` (`18px`) for chips and selector pills.
* **Circular Badges**: Avatars, mascot ponds, and streak counters are circular (`50%` radius).

## 7. Components

### TactileButton (`TactileButton.tsx` / `SvgAppButton.tsx`)
* **Height**: 56px face + 6px bottom rim. Total container 62px.
* **Press Dynamics**: 20ms translation down on press-in; spring release (damping 20, stiffness 100) on touch up.
* **Haptics**: `Haptics.selectionAsync()` on touch down.

### ThoughtCard & DistortionChips
* **Unselected State**: White surface, 2px sage-200 border, italicized thought text.
* **Chips**: 3 selectable options with emoji icons. Active state transitions to `{colors.sage-100}` fill with 2px `{colors.sage-500}` border.
* **Reframe Transition**: Selected chip pops in the `{colors.sage-50}` Reframed Reality card with a golden XP badge.

### StreakCelebration & StreakProgressGraphic (Existing Components)
* **Components Reused**: `@/src/components/Streak/StreakCelebration.tsx` and `StreakCelebrationParts.tsx`.
* **Visuals**: Clean centered `StreakCelebrationFlame`, bold `DayStreakLabel`, and `WeekStreakRow` (`M T W T F S S` with fire icons). No diagonal lines or unnecessary clutter.
* **Home Screen**: Inherits existing production `JournalCalendarScreen` layout (`HomeHeader`, `FeaturedPromptCard`, `EmotionLogger`, `StarterPathNextActionCard`). Zero unprompted visual shifts.

### TimelineCard (Paywall)
* **3-Node Vertical Stepper**: Connected by a 2px vertical guide rail (`{colors.sage-200}`).
* **Nodes**:
  1. *Today*: Green check node, $0.00 access.
  2. *Day 5*: Bell node, 48h reminder notice.
  3. *Day 7*: Lock/Calendar node, annual renewal term.

## 8. Do's and Don'ts

### Do's
* **DO** use the 3D tactile button system on every forward progression action.
* **DO** keep Nunito font weights strictly matched to hierarchy (800 for titles, 700 for actions, 400 for copy).
* **DO** keep the dismiss `✕` on paywall at a minimum of 44x44pt touch area.
* **DO** show Happi mascot with emotional intent matching the cognitive state of each step.

### Don'ts
* **DON'T** use flat generic gradients or blurry neon glows.
* **DON'T** use pure black (`#000000`) for text; always use `{colors.ink}` (`#142414`).
* **DON'T** introduce text input fields in onboarding; use 1-tap chips to prevent blank-slate paralysis.
* **DON'T** show clinical diagnostic labels (e.g. DSM-5 terms); use plain-language terms like "thinking traps".
