# Exercise UI Audit — Duolingo-Level Design in Sage

## Current State Assessment

### What's Already Good (Duolingo-aligned)

| Element                                         | Current state                                       | Duolingo parity                         |
| ----------------------------------------------- | --------------------------------------------------- | --------------------------------------- |
| **3D depth buttons** (`SvgAppButton`)           | ✅ Rim shadow on primary CTA                        | Matches Duo's "Continue" button exactly |
| **StageProgressBar**                            | ✅ Animated spring, rounded pill, inner glow        | Close to Duo's lesson progress bar      |
| **Card variants** (`answer`, `answer-selected`) | ✅ Border depth, sage-green selected state          | Matches Duo's answer card pattern       |
| **IntroStep mascot**                            | ✅ Panda mascot, centered, "Let's Go" CTA           | Matches Duo's lesson start screen       |
| **ChoiceStep cards**                            | ✅ Depth border, radio check, icon wells            | Good — close to Duo's multi-choice      |
| **Haptic feedback**                             | ✅ Light impact on Continue, selection on Back      | Matches Duo's tactile feel              |
| **Font system**                                 | ✅ `GeistBold` for buttons, `Fraunces` for headings | Distinctive, works well                 |
| **Color accent per category**                   | ✅ Sage/Otter Blue/Parrot Orange/Macaw Purple       | Good categorization signal              |

### What's NOT Duolingo-Level Yet

| Element                      | Current state                                          | Duolingo standard                                                          | Gap                  |
| ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------- |
| **Close button**             | Plain "✕" text, transparent bg                         | Circular icon button with subtle bg + hover state                          | Minor — styling only |
| **Step transitions**         | No animation between steps                             | Duo has a subtle slide/fade between questions                              | Medium               |
| **Success animations**       | None on step completion                                | Duo has confetti, scale bounce, sound on correct answer                    | Significant          |
| **Error/invalid feedback**   | Button just stays disabled                             | Duo shakes the button + red flash on wrong answer                          | Medium               |
| **Progress bar celebration** | None at 100%                                           | Duo pulses/glows when lesson completes                                     | Minor                |
| **TextInputStep**            | `VoiceTextInput` but basic styling — `bg-white border` | Duo's text inputs have sage-tinted focus states, deeper card depth         | Medium               |
| **SliderStep**               | Native `@react-native-community/slider`                | Duo would use a custom thumb with larger touch target + value bubble above | Medium               |
| **CountdownTimerStep**       | Plain circle with border + time text                   | Should have animated ring (SVG arc), pulse effect, particle on complete    | Significant          |
| **Summary/DynamicSummary**   | Functional but not celebratory                         | Duo has confetti explosion, XP animation, character celebration, share CTA | Significant          |
| **AcknowledgeStep**          | Plain bordered box with text                           | Should feel like a "quote card" — centered, italic, breathing space        | Minor                |
| **Step spacing**             | `px-5 pb-4` — tight                                    | Duo has more vertical breathing room, centered content                     | Minor                |
| **Background**               | Flat `#FFFFFF` or `#F8FAF7`                            | Duo uses very subtle gradient or texture on lesson screens                 | Minor                |
| **MultiTextInputStep**       | Basic list with plain "+" button                       | Duo's list inputs have smooth add animations, swipe-to-delete              | Medium               |
| **Back button**              | Ghost text "Back" with left arrow                      | Duo doesn't have a back button in lessons — but when it does, it's minimal | N/A (keep as is)     |

---

## Design Principles — Duolingo's Exercise UX in Sage

### 1. Every interaction should feel PHYSICAL

Duolingo's magic is that digital buttons feel tangible. Every tap has:

- Haptic (we have this ✅)
- Depth change (button presses "in" — we have this with `SvgAppButton` ✅)
- Sound (we DON'T have this ❌)
- Visual spring (button bounces back — partial ✅)

**Action:** Add subtle sound effects on: Continue tap, correct selection, exercise complete. Use `expo-audio` with tiny wav files (~2KB each). Optional toggle in settings.

### 2. Progress should feel ALIVE

Duolingo's progress bar isn't just a width animation — it CELEBRATES:

- At each step: bar smoothly grows (we have this ✅)
- At 50%: subtle pulse
- At 100%: glow + slight scale bounce + confetti particles

**Action:** Add completion celebration to `ExerciseFlowScreen` when `isFinalStep && isSaving` resolves. Lottie confetti (we already have LottieView for streak). Scale bounce on the summary emoji.

### 3. The SPACE between elements is the design

Duolingo exercises feel spacious. Content is centered vertically. Nothing feels cramped.

**Current issue:** `StepLayout` pushes content to the top with `StepHeader` taking space. The slider/timer steps then have `flex-1 justify-center` which works — but text steps don't center.

**Action:** For non-text-input steps (slider, timer, choice, acknowledge), ensure the content area is vertically centered. Add `pt-2 pb-6` to `StepLayout` children wrapper.

### 4. Selections should CELEBRATE before advancing

In Duolingo, when you tap the right answer:

1. Border goes green ✅ (we do this)
2. Checkmark scales in (we do this)
3. Brief 200ms pause (we have `setTimeout(onNext, 300)` on auto-advance ✅)
4. Success sound
5. Card has a subtle "pop" spring

**Action:** Add `withSpring` scale animation (0.95 → 1.02 → 1.0) on card selection in `ChoiceStep` and `BooleanStep`. Requires wrapping the card in `Animated.View`.

### 5. Exercise COMPLETION should be a MOMENT

Currently: DynamicSummary renders → user taps "Complete" → exits.

Duolingo: Lesson ends with a celebration screen:

- Confetti particles
- XP count animates up
- Character does a dance
- "PERFECT!" or "Good job!" header scales in

**Action:** When `DynamicSummary` mounts:

1. Mascot celebration (use `panda-super-excite` state)
2. Emoji scale bounce (from 0 → 1 with spring)
3. XP count animation (count up from 0 to earned XP)
4. Optional: small confetti Lottie behind the emoji

---

## Specific Component Upgrades

### Upgrade 1: ExerciseFlowScreen Header Polish

**Current:** `✕` text + progress bar + percentage text
**Target:** Circular close icon (X icon in a subtle circle) + thicker progress bar (14px) + no percentage text (let the bar speak)

```diff
- <Text className="text-ink-soft text-[20px] font-bold">✕</Text>
+ <HugeiconsIcon icon={Cancel01Icon} size={18} color={INK_SOFT} />
```

Add subtle bottom border shadow to the header row for depth separation.

---

### Upgrade 2: SliderStep — Custom Thumb + Value Bubble

**Current:** Native slider with platform-default thumb
**Target:**

- Larger custom thumb (28px circle, sage-500 fill, white inner dot)
- Value displayed in a floating bubble above the thumb
- Animated value text (springs when changed)
- Track: taller (6px), sage-gradient fill

**Implementation:** Replace `@react-native-community/slider` with a custom gesture-based slider using `react-native-reanimated` + `PanGestureHandler`. Many Duolingo-style slider examples exist.

---

### Upgrade 3: CountdownTimerStep — Animated Arc Ring

**Current:** Plain circle with border + text
**Target:**

- SVG circular progress ring (like Apple Watch activity rings)
- Ring fills clockwise as time progresses
- Pulse glow effect at 50% and 100%
- "Done" state: ring fills green, checkmark scales in with spring

**Implementation:** Use `react-native-svg` (already in the project for SVG icons) with animated `strokeDashoffset`.

---

### Upgrade 4: TextInputStep — Deeper Card + Focus Animation

**Current:** `VoiceTextInput` with border styling
**Target:**

- Card-style container (2px border, 4px bottom shadow — matching `Card variant="answer"`)
- On focus: border transitions to sage-500, shadow deepens slightly
- Mic button: sage-500 (already done ✅)
- Placeholder text: slightly smaller (14px instead of 17px) and more muted

---

### Upgrade 5: DynamicSummary — Celebration Layer

**Current:** Static emoji + bars + text
**Target (add to DynamicSummary mount):**

1. Emoji: `useSharedValue(0)` → `withSpring(1)` on mount (scale from 0 → 1)
2. Score bars: animate width from 0% to target% with 500ms delay (staggered)
3. Insight message: fade in after bars complete
4. XP badge: count-up animation from 0 to XP value
5. Optional: background confetti Lottie (subtle, 2-3 seconds, once)

---

### Upgrade 6: Sound Effects

| Event               | Sound                   | Duration |
| ------------------- | ----------------------- | -------- |
| Continue button tap | Soft "pop"              | ~50ms    |
| Choice selected     | Higher "click"          | ~30ms    |
| Exercise complete   | Celebratory "ding-ding" | ~400ms   |
| Timer complete      | Bell chime              | ~300ms   |
| Slider value change | Subtle tick (optional)  | ~20ms    |

**Implementation:** `useSoundEffects` hook already exists at `src/hooks/useSoundEffects.ts`. Add exercise-specific sounds. Files: tiny WAV, bundled as assets.

---

## Color Application — Sage Duolingo

### Exercise screen backgrounds

| State               | Background                                       |
| ------------------- | ------------------------------------------------ |
| Default exercise    | `#F8FAF7` (brand-canvas — sage whisper)          |
| Timer running       | Subtle sage-50 pulse (breathing effect)          |
| Summary/celebration | `#F8FAF7` with faint sage radial gradient center |

### Card borders

| State       | Border                                                            |
| ----------- | ----------------------------------------------------------------- |
| Default     | `brand-border` (#E5E5E5) with 3-4px bottom depth                  |
| Hover/press | Border transitions to `sage-200`                                  |
| Selected    | `sage-500` border, `sage-selected` fill, depth color = `sage-500` |
| Error       | `terracotta` border flash (300ms), shake animation                |

### Button states

| State    | Look                                                    |
| -------- | ------------------------------------------------------- |
| Active   | Sage-500 face, sage-700 rim, white text                 |
| Disabled | Sage-200 face, sage-300 rim, muted text                 |
| Loading  | Sage-300 face, spinner in sage-600                      |
| Pressed  | Depth decreases (button "sinks" 2px) — already works ✅ |

---

## Priority Implementation Order

| #   | Upgrade                                                      | Impact                  | Effort | Files                               |
| --- | ------------------------------------------------------------ | ----------------------- | ------ | ----------------------------------- |
| 1   | Summary celebration animation (emoji spring + bar animation) | HIGH — the "wow" moment | Medium | `DynamicSummary.tsx`                |
| 2   | Step transition animations (fade/slide between steps)        | HIGH — smoothness       | Medium | `ExerciseFlowScreen.tsx`            |
| 3   | Sound effects on key events                                  | HIGH — tactile polish   | Low    | `useSoundEffects.ts` + asset files  |
| 4   | Timer ring animation (SVG arc)                               | MEDIUM — visual upgrade | Medium | `CountdownTimerStep.tsx`            |
| 5   | Choice/Boolean selection spring bounce                       | MEDIUM — micro-delight  | Low    | `ChoiceStep.tsx`, `BooleanStep.tsx` |
| 6   | Slider custom thumb + value bubble                           | MEDIUM — polish         | Medium | `SliderStep.tsx`                    |
| 7   | Header polish (icon close, no percentage)                    | LOW — minor cleanup     | Low    | `ExerciseFlowScreen.tsx`            |
| 8   | TextInput card depth + focus animation                       | LOW — already decent    | Low    | `VoiceTextInput.tsx`                |

---

## What NOT to change

- **`Button` component** — Already matches Duolingo with `SvgAppButton` 3D depth. Don't touch.
- **`Card` component** — Already has proper variants with depth. Don't touch.
- **`StageProgressBar`** — Already animated with spring + glow. Maybe increase height from 12 → 14px, but otherwise fine.
- **Color palette** — Sage is perfect. Don't add new colors. Just apply existing tokens more consistently.
- **Mascot** — Already appears in IntroStep. Don't overuse — Duo shows their owl sparingly.
- **Typography** — `Geist` body + `Fraunces` display works. Don't change fonts.

---

## Summary

The app is **70% Duolingo-quality already** — the foundation (3D buttons, card depth, progress bar, haptics, mascot) is solid. What's missing is the **animation layer** and the **celebration moments** that make Duolingo feel alive:

1. Things should MOVE between steps (transitions)
2. Things should CELEBRATE on success (confetti, springs, sounds)
3. Things should BREATHE between them (spacing, pauses)

The sage color system is already applied correctly to most components. The gaps are about MOTION and DELIGHT, not about color or layout.
