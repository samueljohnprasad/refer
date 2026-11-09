# Onboarding: prototype to Expo handoff

Build the production onboarding from `.agents/onboarding.html`. This file says what each prototype piece becomes in the Expo app, so nothing gets guessed.

**Order of authority on conflict:**
1. `_bmad-output/initiative-happy-product-direction/ux-onboarding-and-day-0/EXPERIENCE.md` (behaviour, asks, analytics)
2. `.../ux-onboarding-and-day-0/DESIGN.md` (tokens, components)
3. This file (motion, rig, file mapping)
4. `onboarding.html` (a rendering of all three)

Open the prototype: `.agents/onboarding.html`. It finishes at `.agents/home.html?empty&welcome` (the Home tab). To replay a fresh install: `home.html?new`. `exercises.html` is only the Exercises tab.

## 1. Flow: prototype vs. live steps

Live order today (`src/screens/OnboardingScreen/constants.ts` `ONBOARDING_STEPS`):
`welcome → quiz_motivation → building_journey → thought_catch_micro → milestone_celebration → notification_permission → soft_paywall`

| Prototype | Production target | Action |
|---|---|---|
| `s1()` goal pick | New `GoalPickStep.tsx` in `src/screens/OnboardingScreen/steps/` | Replaces `welcome` and `quiz_motivation`. Tapping a goal starts the flow; no Begin button. Creates the anonymous session silently. |
| `chat()` + `teach()` + `personal()` | `ThoughtCatchMicroStep.tsx` + `thoughtCatchData.ts` | Rebuild as one chat thread. Data = `GOALS` in the prototype: 5 worked examples, one per goal, each with `mirror`, `scene`, `thought`, `trap`, `recall`, `fair`. Personal practice is optional, in the same thread. |
| `teach()` beats | Same chat | Per example: what happened / what the mind added, before belief, **Is it actually true?**, reframe + `why` line + trap label, after belief + `shiftCopy`. No trap quiz, no fill-in-the-blank. |
| `saved()` card | New `SavedReflectionCard` at the end of the chat step | Card, lifetime count, weekly ring. Ends onboarding. |
| `remindAsk()` | Inline in the saved card. Reuse `components/NotificationPreview.tsx`, `utils/onboardingNotifications.ts`, `utils/reminderConfig.ts` | Replaces the `notification_permission` step. Call the native prompt **only** after a time chip is tapped. |
| `building_journey` | — | Cut (fake loader). |
| `milestone_celebration` / `PactSigningStep` | — | Cut (pledge before value). |
| `soft_paywall` | `RevenueCatUI.presentPaywall()` once on first Home arrival | Remove from onboarding. The paywall is the **remote RevenueCat template**; the app builds no paywall UI. |
| `?welcome` card + signup card in `home.html` | Home: `src/screens/JournalCalendarScreen/...`; signup via existing `SignInBottomSheet`, `GuestSignUpSheet`, `AnonymousPurchaseClaimPrompt` | Reuse. Restyle `GuestSignUpSheet` from purple/lock to the sage tokens (EXPERIENCE.md §12). |

**Unslop pass (from the Revmp before/after references in `design-references/revmp-before-after/`):** goal screen is a 2-column grid of tiles led by Happi's head in the goal's pose (the same `POSES` table, cropped to the head, drawn once; Sleep spans both columns); fill separates surfaces and only acted-on things are outlined; labels are sentence case; body weight 500; the scene is a soft grey card and the reframe the one bordered card; the stage gets a soft wash tinted by the thought's weight (`f`), clearing with the reframe; the saved card uses hairline rows and a regular-weight count; unchosen chips fade in 120ms, the chosen one flies into the thread in 220ms ease-out. Not done yet: smooth interpolation through poses (`flow`) and a hip sway on the reframe.

**Chat avatar:** every Happi line (and its typing dots) sits beside the app icon, 30pt, radius 9, hairline ring `--sep`, so it reads as the app talking to the user. Source: `assets/icons/icon-panda.png` (the `expo.icon` in `app.json`). Bubble tail is bottom-left, next to the icon. User bubbles carry no avatar.

**Samples in the prototype that must not be built:**
- the iOS notification alert (`.ios`): production calls `expo-notifications` `requestPermissionsAsync()`
- the sign-in sheet (in production that's `SignInBottomSheet`)
- the RevenueCat paywall sheet in `home.html` (opens once over Home after onboarding) and `exercises.html` (tapping a Pro exercise) (in production that's `RevenueCatUI`)

## 2. The guide: Happi panda plus the thought cloud

The prototype ports the production rig, so it maps file to file:

| Prototype (`onboarding.html`) | Production |
|---|---|
| `HAPPI` SVG markup, `data-p` groups | `src/components/ui/happy-scene/HappiRig.tsx` (same paths, same group nesting, copied verbatim from `art.ts`) |
| `mx()` | `matrix()` in `happy-scene/pose.ts` |
| `EASE_IN_OUT`, `EASE_OUT`, `wave`, `loop`, `seeded`, `track` | `src/components/ui/motion/engine.ts` |
| `render()` idle layers: breath, head sway, ear lag, arm drift, heart beat | `getHappyPose()` idle terms in `pose.ts` (same constants) |
| `greet()` | The brand wave in `pose.ts`: shoulder 12→70°, elbow trails by 90ms to 110°, forearm ±13° on a 680ms beat |

**New rig parameters** (not in `HappiRig.tsx` yet):
- `mouth`: wrap the mouth path in an `AnimatedGroup` with `mouthProps` = `matrix(0,0,0,132,124.5,1,mouth)`. 1 = smile (today's art), 0 = flat, below 0 = turned down.
- `lid`: resting eyelid, combined with blinks as `Math.max(lid, blink)`. Feeds today's `eyesProps`.
- `sink`: the head group translates down by `sink` px, so the head droops into the shoulders and the feet stay put. Becomes `matrix(0, sink, headAngle, 131, 152)`.

**Channels:** each pose value eases from wherever it is to its target; nothing jumps.
- `to(k, v, dur, delay)` maps to `sv.value = withDelay(delay, withTiming(v, { duration: dur, easing: Easing.bezier(.77,0,.175,1) }))`.
- `shot(k, keys)` (one-shot keyframes added on top of a channel) maps to `track(clock - start, keys)` inside the worklet, or `withSequence`.
- Keep the single `useFrameCallback` clock from `HappyScene.tsx`. Idle terms read the clock; pose channels are shared values.

### Acting poses (`POSES`)

| Pose | head° | gazeX | gazeY | mouth | lid | sink | sy | Fires when |
|---|---|---|---|---|---|---|---|---|
| rest | 0 | 0 | 0 | 1 | 0 | 0 | 1 | S1 entry, after each beat, saved |
| worry | 4 | 3 | -1 | .2 | 0 | 0 | 1 | goal = Worry |
| mood | -3 | 0 | 2.6 | -.5 | .3 | 4 | .985 | goal = Low mood |
| stress | 0 | -1.5 | 0 | -.3 | 0 | 1 | .965 | goal = Stress |
| self | -5 | -2 | 2.4 | -.35 | .15 | 2 | 1 | goal = Self-talk |
| sleep | 5 | 0 | 1.2 | .3 | .5 | 2 | 1 | goal = Sleep |
| listen | -3 | -1.5 | 2 | .6 | 0 | 0 | 1 | personal practice starts |
| gentle | 6 | 0 | .5 | .6 | 0 | 0 | 1 | wrong trap pick (a tilt, never a shake) |
| relieved | 0 | 2.8 | -2.4 | 1 | 0 | 0 | 1 | reframe lands (1600ms; Happi looks up at the clearing sky) |

- **Default pose duration:** 600ms. **Follow-through delays** at 600ms (scale with duration): eyes and mouth 0, lid 60, head 90, sink and sy 150.
- **Story beats own the gaze:** a pose of 1000ms or longer blocks conversational glances until it lands (`H.hold`).
- **Conversational glances** (gaze only, 400ms):
  - while Happi types: (1.5, -2), thinking
  - when a bubble lands: (-1.2, 1.6), at the thread
  - when replies show: (0, 2.8), at the reply strip
- **Nod** (correct answer): head +5° over 160ms, back with ease-out by 460ms.

### Thought cloud prop

A small cloud beside Happi's head, in the rig's coordinates (viewBox `44 0 236 240`). It replaces production's decorative `scenery.cloud` on these screens. Build it as a new `ThoughtCloud` group in the same SVG.

**Weather `f`:** 0 = clear, 1 = heavy. It is how true the thought feels.

| Moment | f |
|---|---|
| S1 | .35 |
| Goal picked | goal's value (worry .68, mood .78, stress .72, self .64, sleep .6) |
| Personal practice starts | .6 |
| Reframe | .12 (slow) |
| After "Makes sense" | .3 |
| Belief rating | `.15 + rating × .15` (0–4) |
| Saved | .08 |

**What `f` controls:**
- **Cloud colour:** mix `#e4eee0` → `#a9bfa0` by `f`.
- **Puffs:** 3 circles (229,30 r11), (245,22 r14), (260,31 r10) plus a base rect (220,29 50×12 rx6). Each has a clearness channel `c = 1 - f`, tweened with **90ms stagger** on a slow clearing. Parting amount = `clamp01((c - .6)/.35)`. A puff moves by (-12,2), (0,-7), (12,3) × part, scales to `1 - .3 × part`, opacity `1 - .6 × part`. The base rect fades by the mean parting.
- **Sun:** on an arc around (240,44), r 30, angle `-10° + 80° × (1 - f)`. Opacity `clamp01(1.15 - 1.4f)`. Rays rotate once per 40s.
- **Rain:** 4 drops. x = `226 + seeded(i,1)·36`, period `950 + seeded(i,2)·450` ms, phase `seeded(i,3)`, length `5 + seeded(i,4)·3`. y runs 44→62.
  - Each drop's alpha is sampled once per fall: `clamp01((f - .5) × 3)`. A drop already falling finishes when the sky clears; it never vanishes.
- **Idle:** the whole cloud drifts ±1.5px on a 7s wave.

**Weather tween:** 600ms, or 1600ms for the reframe (the one main beat on S2).

## 3. Motion timings (all screens)

| Thing | Spec | Expo |
|---|---|---|
| Curves | travel `(.77,0,.175,1)`, arrive `(.23,1,.32,1)` | `EASE_IN_OUT`, `EASE_OUT` in `engine.ts` |
| Press | scale .97, 120ms ease-out, no spring | Pressable + `withTiming` |
| Bubble in | 220ms, rise 8px + scale .97, ease-out | `FadeInDown.duration(220)` or a custom entering |
| Typing time | `min(900, 380 + 7ms × chars)`; skipped under reduced motion | same |
| Blink | close 110 / hold 40 / reopen 190 ease-out, next in 3–4s seeded | replaces `pose.ts` fixed blink times for the live guide |
| S1 tap to chat | pose + weather 600ms, chat opens at 420ms | |
| Saved card | rise 450ms → check draws at 350 → count ticks at 560 → ring fills to 1/3 at 700 | `withDelay` per element |
| Saved bloom | soft sage radial behind Happi, 1.4s once | Reanimated opacity + scale |
| Saved Happi | rest pose + brand wave + sky to .08 | rare moment, the one place for full delight |
| Reminder preview | drops in 350ms at 500ms | `NotificationPreview` with copy "Ready to catch one more thought? 2 min" |
| Sun/moon chip | swings −9° then +4° around its top over 280ms, then the native prompt | |
| Home weekly ring | fills from 0 over 600ms at 400ms, first arrival only | |

**Not used, on purpose:** confetti, bounce or overshoot, flame or streak visuals, motion on quick-reply chips or goal cards at rest. The reframe bubble is not flown into the card as a shared element because it fights the thread's scroll; the card appears directly below it.

## 4. Must-haves the prototype demonstrates

- **Reduced motion:** loops freeze, one-shots show their final frame, typing delays drop to 0, weather and pose snap. Use `useReducedMotion` from `src/hooks/useReducedMotion.ts`.
- **Nothing runs unseen:**
  - pause the clock on `AppState` background (as in `HappyScene.tsx`)
  - pause when the screen is unfocused (`useIsFocused`) or the guide is unmounted
- **Haptics:** prototype `buzz()` maps to `expo-haptics` `selectionAsync()` on taps and `notificationAsync(Success)` on save.
- **Privacy:**
  - free text (thought, reframe) is stored locally with the reflection only
  - never in analytics; event list in EXPERIENCE.md §8
  - escape it anywhere it is rendered as HTML, as both prototypes do
- **Accessibility:**
  - Happi and the cloud are decorative (`accessible={false}`)
  - the thread is a live region
  - quick replies are buttons with 44pt targets
  - the progress pair's label reads "Practices completed: 1. 1 of 3 practices this week"

## 5. Verify in production

- Poses: render stills with Remotion (`remotion/HappyScene.tsx`, `npx remotion still remotion/index.ts HappyMascot <out.png> --frame=N`), one per pose row above.
- Flow: walk the prototype and the build side by side. Same beats, same copy, same order of asks (save, then reminder, then Home, then paywall once).
