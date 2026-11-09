# Phase 5 — Synthesis and tokens

Pass: 2
Inputs: docs/research/soul/01-psychology.md (PASS), 02-teardown.md (PASS), 03-character.md (PASS), 04-connection-systems.md (PASS), 00-status.md, .agents/skills/app-soul-design/SKILL.md, phases/05-synthesis-and-tokens.md, all four checklists, references/evidence-template.md, src/theme/{colors,palette,typography,radius,elevation,spacing}.ts, global.css (Uniwind/Tailwind v4 theme; no tailwind.config.* exists in the repo), constants/moodColors.ts, src/components/ui/Text.tsx, src/components/ui/happy-scene/art.ts, src/components/ui/motion/engine.ts, .agents/skills/rossark-motion-skill/SKILL.md §1–§7 and templates/react-native/motion.ts, assets/images/panda/MOTION.md. Contrast ratios computed with a WCAG relative-luminance script in $TMPDIR (sRGB threshold 0.04045, coefficients 0.2126/0.7152/0.0722, ratio (L1 + 0.05)/(L2 + 0.05), never rounded up) [S4], [S5].

## Summary
Decisions this phase makes (each traces to findings):
1. Happy keeps its sage-on-white identity and Nunito; no cream canvas, no serif, no dark-first theme (F4, Rejected ideas).
2. One accent with one role: sage marks "where to act" (CTA fill `#5F7F58`, accent text `#44633F`); gold, macaw purple and bee yellow leave the UI with XP and the streak flame (F1, F2, P4-F8).
3. 14 current color pairings that fail WCAG 2.2 AA are replaced; every color row below carries its computed ratio in light and dark mode (F1).
4. Mood marks move off red/green into a mid-luminance band (relative luminance 0.16–0.30) so each mark is ≥3:1 on both white and dark surfaces, and every mark ships with its word and icon (F6).
5. Type follows Apple's Dynamic Type scale up to AX5 with per-role scale caps; eyebrows become sentence case; Caveat is Latin/Cyrillic-only hand-lettering, ≤1 per screen (F3, F4, F7).
6. Interface motion is ≤300 ms, exits run 30–35% faster than entrances, there are no springs, and every row has a reduced-motion still (F5).
7. Haptics are capped per event with a global ≤1 non-selection haptic per 1000 ms; Success fires at most once per 7 days (F8).
8. "Saved. It's yours." is app copy; Happi voices it only when Happi is mounted and the session bubble budget is unspent (Contradictions).

## Findings

### F1. 14 current color pairings fail WCAG 2.2 AA
- Claim: Computed with the WCAG formula, 14 pairings in `palette.ts`, `colors.ts`, `global.css` and `moodColors.ts` fall below 4.5:1 (text) or 3:1 (non-text), the worst being bee-yellow text at 1.38:1 on white.
- Evidence: [S1] (4.5:1 text, 3:1 large text; "4.499:1 would not meet the 4.5:1 threshold"), [S2] (3:1 for component boundaries and state indicators), [S4], [S15] (token values read this run)
- Mechanism: Text below 4.5:1 drops legibility for low-vision readers and for anyone reading in sunlight or with a dimmed screen, which is common at night check-ins; a state indicator below 3:1 hides which feeling word is selected.
- So what for Happy: Fixes in `## Color` and `## Diff vs current`: `ink-muted #AFAFAF` (2.19:1) stops carrying readable text; `selection.border #ABC0A2` (1.95:1) becomes `#5F7F58` (4.50:1); `info.indicator #1CB0F6` (2.45:1) becomes `#006699` (6.25:1); `error.foreground #E7000B` on its tint (3.84:1) becomes `#B71C1C` (5.28:1); dark `text.tertiary #5A6A5A` (2.62:1) becomes `#A0B0A0` (6.63:1); dark pressed label (3.36:1) moves to fill `#93AB88` (6.06:1).

### F2. Sage-500 passes as text only on pure white, by 0.003
- Claim: `#5F7F58` reaches 4.503:1 on `#FFFFFF` but 4.29:1 on `#F8FAF7` and 4.17:1 on the selected-card tint `#F2F8EF`, so the eyebrow and active labels fail as soon as they sit on any tinted surface.
- Evidence: [S1] (thresholds are not rounded), [S15] (`text-sage-500` on eyebrow; `happy-brand-card-selected` uses `#F2F8EF`)
- Mechanism: A token that passes only on one background fails silently when a component is reused on another surface.
- So what for Happy: Accent text (eyebrows, links, active tab labels) uses sage-600 `#44633F` (6.77:1 white, 6.27:1 on `#F2F8EF`); sage-500 stays only as a fill (CTA, progress, selected border), where white labels on it measure 4.503:1 and the fill-vs-surface edge measures ≥3:1 (P4-F11: one main action per screen keeps sage scarce).

### F3. Text must scale to AX5 without truncating instructions
- Claim: Apple's Dynamic Type takes Body from 17 pt (leading 22 pt) at the default size to 53 pt (leading 62 pt) at AX5, a 3.12× step, and asks apps to allow at least 200% enlargement.
- Evidence: [S6] (default and AX5 tables; minimum 11 pt), [S7] ("at least 200 percent"), [S11] (≤80 characters per line)
- Mechanism: Low-vision and older users raise text size; fixed-size text or clipped containers hide CBT steps and the crisis line exactly for those users.
- So what for Happy: Every role in `## Type` has a maximum scale; body, bubble, crisis and instruction text scale to the full AX5 step (×3.12); a Happi bubble at AX5 holds ≤60 characters in ~11 characters per line on a 318 pt inner width, so it wraps to ≤6 lines (not the ≤5 assumed in P3), and at AX1–AX5 Happi art shrinks to ≤96 pt tall and the bubble moves below it full-width (P3 Presence rules, AE2.3).

### F4. Nunito and Caveat do not cover Arabic or Chinese
- Claim: Nunito ships Latin, Latin-ext, Cyrillic, Cyrillic-ext and Vietnamese subsets with a weight axis of 200–1000, and Caveat ships Latin and Cyrillic only, so 2 of Happy's 8 locales (ar, zh) render in system fallback fonts.
- Evidence: [S13], [S14]
- Mechanism: A fallback font has different metrics; Arabic marks above and below the line need more leading than Latin at the same size, and a handwriting face missing glyphs renders as tofu or a mismatched fallback.
- So what for Happy: Keep Nunito (no evidence argues against it; rounded terminals match Happi's round silhouette, P3-F2); ar and zh use the iOS system face at the same pt sizes with +4 pt leading per role; Caveat is used only for the one hand-lettered Insights note (P4-F12 surprise #6) at ≥20 pt in Latin/Cyrillic locales, and ar/zh show Nunito-equivalent system text instead.

### F5. Interface motion stays ≤300 ms and exits faster than it enters
- Claim: Apple asks for brief, precise feedback animation and no added motion on frequent interactions, and the project's motion skill sets press feedback at 100–160 ms, sheets at 200–500 ms and says to keep interface moves under 300 ms with exits quicker than entrances.
- Evidence: [S9] ("Aim for brevity and precision"; "generally avoid adding motion to UI interactions that occur frequently"; "Let people cancel motion"), [S16] (§7 durations and asymmetric timing; curves `bezier(0.23, 1, 0.32, 1)` ease-out, `bezier(0.77, 0, 0.175, 1)` ease-in-out, `bezier(0.55, 0, 1, 0.45)` ease-in)
- Mechanism: Each extra 100 ms on a daily path is paid every day; an anxious reader waiting on a save confirmation reads a slow animation as uncertainty about whether the words were kept.
- So what for Happy: `## Motion` caps UI at 300 ms; P4's 400 ms quote-card rise drops to 300 ms; the streak CTA spring (mass 0.6, stiffness 280, damping 20) becomes 300 ms ease-out; Happi one-shots keep their P3 durations because they are character acting, not interface feedback (P3 Expression set, P4-F11).

### F6. Mood colors coded red for "1" double as the error color and grade the feeling
- Claim: `MOOD_COLORS` maps score 1 to `#EF4444` red and 4 to `#10B981` green, and scores 2–5 measure 1.92–2.80:1 on white, below the 3:1 graphical-object minimum.
- Evidence: [S15] (`constants/moodColors.ts`), [S2] (graphical objects needed to understand content need 3:1)
- Mechanism: Red is Happy's error and danger signal, so a low mood shown in red reads as a mistake, which is the "mood as a score" harm (P1-F-dose5); marks under 3:1 disappear for low-vision users, leaving color as the only weak carrier.
- So what for Happy: Five mood marks chosen in the relative-luminance band 0.16–0.30, the band in which one hex is ≥3:1 against both `#FFFFFF` and `#1A2A1A`; no red, no success green; each mark always shows its feeling word and an icon (AE2.7); marks sit on `surface.primary` only, because two of them fall to 2.92:1 and 2.98:1 on the dark elevated surface.

### F7. All-caps eyebrows break the low-arousal register and do not exist in ar or zh
- Claim: The `eyebrow` and `overline` variants render 11 pt uppercase with widest tracking, while Phase 1 bans all-caps in routine copy across all 8 locales.
- Evidence: [S15] (`Text.tsx` eyebrow "uppercase tracking-widest"), [S6] (11 pt is the iOS minimum), inference: Arabic and Chinese have no letter case, so the uppercase transform gives those locales a different hierarchy cue than the other 6, and P1-F22 sets the low-arousal default.
- Mechanism: Uppercase at the 11 pt minimum is the hardest text on the screen to read and reads as a raised voice.
- So what for Happy: Eyebrow becomes sentence case, 13 pt/18 pt Nunito Bold, tracking 0.02 em, `#44633F`; overline merges into caption (P1-F22, P4-F1).

### F8. Haptics need one meaning each and a frequency ceiling
- Claim: Apple asks for haptics used consistently with a causal link to one action, warns that a haptic becomes tiresome when it plays frequently, and asks that haptics be optional.
- Evidence: [S8] ("Use haptics consistently"; "become tiresome when it plays frequently"; "Make haptics optional"), [S16] (§7 frequency table: the more often seen, the less it moves)
- Mechanism: A pattern that fires on 40 different events (P4-F9) teaches nothing; a pattern reserved for one rare event carries meaning without being noticed day to day.
- So what for Happy: `## Haptics` keeps P4's 10-row map and adds a max frequency per row plus a global ceiling of ≤1 non-selection haptic per 1000 ms; Success fires on Day 7 and Day 15 only, so ≤1 per 7 days (P4-F9, P3 Presence rules).

### F9. Touch targets follow Apple's 44 pt, not WCAG's 24 px floor
- Claim: WCAG 2.2 SC 2.5.8 sets a 24 × 24 CSS px minimum with a spacing exception, while Apple's default control size is 44 × 44 pt.
- Evidence: [S3], [S7]
- Mechanism: Tremor, cold hands and distress all reduce pointing accuracy; the larger target costs no screen space when the hit area extends past the visual.
- So what for Happy: Every tappable element has a ≥44 × 44 pt hit area, chips are 44 pt tall with ≥8 pt gaps, and "Hide counter", "Why am I seeing this?" and "Skip" text buttons get padded hit areas (P2-F4, P4-F3).

### F10. Reduced motion is readable live in React Native
- Claim: React Native's `AccessibilityInfo.isReduceMotionEnabled()` resolves the current setting and `reduceMotionChanged` fires when it changes, and Apple asks apps to reduce automatic and repetitive animation and replace transitions with fades when the setting is on.
- Evidence: [S10], [S7] ("reducing automatic and repetitive animations, including zooming, scaling, and peripheral motion"; "Replacing transitions with fades")
- Mechanism: A setting read only at launch misses a user who turns it on mid-session after feeling unwell.
- So what for Happy: Every `## Motion` row names its fallback; loop clocks freeze at frame 0 and one-shots jump to their final frame through the existing `useLoopClock` / `useOneShotClock` (`live` and `reduced` flags) [S16], [S17]; screen transitions become 150 ms cross-fades (P3-F11, P4-F11).

### F11. Celebration amplitude in tokens must match the low-arousal dose
- Claim: The `counter` text role is 36 pt ExtraBold and the palette names gold and parrot orange as "achievement" and "rare rewards" colors, which encode game-register celebration in the token layer.
- Evidence: [S15] (`global.css` accent palette comments: "Gamification: XP badges, streaks, rewards"), [S12] (no flashing above 3 per second), inference: P1-F-dose9 caps high-arousal celebration at ≤1 per 7 days and P4-F8 removes XP, so tokens built for XP have no remaining use.
- Mechanism: Tokens make a register cheap to reach; a gold, 36 pt counter invites every surface to celebrate.
- So what for Happy: Counter becomes 28 pt Bold in `#142414`; gold, bee-yellow, macaw-purple and parrot-orange tokens are retired from the UI; the Day 7/15 modal uses sage and Happi's Celebrating (low) pose only, with no particle effects (P1-F-dose9, P3 Expression set).

### F12. Line length must stay under 80 characters on tablets
- Claim: WCAG SC 1.4.8 asks that blocks of text can be shown at ≤80 characters per line with line spacing ≥1.5.
- Evidence: [S11]
- Mechanism: Long lines make the eye lose the next line; at 17 pt Nunito (~8.8 pt average glyph width, an estimate of ~0.52 em, not measured) a 768 pt iPad column would run past 80 characters.
- So what for Happy: Reading columns cap at 560 pt wide (≈63 characters at 17 pt); body leading 24 pt (1.41) stays; instructional blocks use 1.5× paragraph spacing (12 pt after each paragraph) (P4-F1 instructional mode).

## Type

Family: Nunito (`NunitoRegular` 400, `NunitoSemiBold` 600, `NunitoBold` 700, `NunitoExtraBold` 800). Sizes are React Native points (1 pt = 1 CSS px for WCAG purposes; large text = ≥24 pt regular or ≥19 pt bold). `allowFontScaling` stays on everywhere; `maxFontSizeMultiplier` per role below. ar and zh: system face, same size, +4 pt leading.

| Role | Weight | Size / leading (pt) | Max scale (pt at AX5) | Max line length | Use | Intent / driven by |
|---|---|---|---|---|---|---|
| display | ExtraBold 800 | 36 / 40 | ×1.67 (60) | 20 characters | Day 7/15 modal number only; ≤1 per screen | One loud number per milestone, nowhere else (P1-F-dose9, F11) |
| h1 screen title | ExtraBold 800 | 28 / 34 (was 32) | ×2.0 (56) | 30 characters | One per screen | Leading matches Apple Title 1 34 pt so wrapped titles do not collide (F3, P4-F1) |
| h2 section | ExtraBold 800 | 22 / 28 (was 26) | ×2.0 (44) | 40 characters | Section heads, crisis sheet heading | Apple Title 2 leading 28 pt (F3) |
| h3 card | Bold 700 | 18 / 24 (was 22) | ×2.2 (40) | 40 characters | Card titles | Leading ≥1.3 for wrapped titles at AX sizes (F3) |
| body | Regular 400 | 17 / 24 | ×3.12 (53) | 63 characters (560 pt column) | All explanatory copy, CBT steps, crisis text | Full AX5 scaling for anything the user must read to act (F3, F12, P4-F1) |
| body-bold | Bold 700 | 17 / 24 (was 22) | ×3.12 (53) | 63 characters | Answer options, inline emphasis | Same leading as body so mixed lines align (F3) |
| quote (user's words) | SemiBold 600, upright | 17 / 24 | ×3.12 (53) | ≤8 words, wraps | "You wrote: '…'" card | Upright, not italic, so the user's words stay as legible as body (P2-F1, P3 Contradiction 4) |
| happi-bubble | Regular 400 | 17 / 24 | ×3.12 (53); ≤6 lines at AX5 | ≤60 characters per bubble | Happi lines only | Same size as body so Happi is never louder than the app (P3-F13, F3) |
| button-label | Bold 700 | 17 / 22 | ×3.12 (53), wraps to ≤3 lines; button grows from 52 pt | ≤3 words | All buttons | Labels never truncate at AX5 (F3, F9) |
| label | SemiBold 600 | 14 / 20 | ×3.27 (46) | 40 characters | Form labels, settings rows | Unchanged size; above the 11 pt minimum [S6] |
| caption | SemiBold 600 | 13 / 19 | ×3.38 (44) | 63 characters | Dates ("From your note on 12 Oct"), metadata | Dates carry recall provenance, so they use readable `text.secondary` (P1-F19, F1) |
| eyebrow | Bold 700, sentence case, tracking 0.02 em | 13 / 18 (was 11 / 16 uppercase) | ×3.38 (44) | 30 characters | Section labels | No all-caps; no case dependence in ar/zh (F7, P1-F22) |
| chip | Bold 700 | 13 / 18 (was 12 / 16) | ×3.38 (44) | 20 characters | Feeling-word chips | Feeling words are the check-in's main content, not metadata (P1-F10, F7) |
| counter | Bold 700, tabular numerals | 28 / 32 (was 36 / 36 ExtraBold) | ×2.0 (56) | 6 characters | "Days practised this month" | Count of practice, not a trophy (P4-F8, F11) |
| hand-lettered | Caveat SemiBold 600 | 22 / 28 | ×2.0 (44) | 30 characters | One Insights note per lifetime; Latin/Cyrillic locales only | Signals human authorship without a second UI voice (P4-F12 #6, F4) |

## Spacing

Base unit 4 pt; every margin, padding and gap is a multiple of 4 pt.

| Token | Value (pt) | Use | Intent / driven by |
|---|---|---|---|
| space-1 | 4 | Icon-to-label gap | 4 pt grid keeps rhythm without decisions per screen (F12) |
| space-2 | 8 | Gap between chips; between a quote and its date | ≥8 pt between 44 pt targets avoids mis-taps (F9, P4-F3) |
| space-3 | 12 | Paragraph spacing in instructional blocks; bubble-to-art gap | 1.5× paragraph spacing for CBT steps (F12, P4-F1) |
| space-4 | 16 | Card padding; bubble inner padding | One padding for every card so content never crowds (P4-F13) |
| space-5 | 20 | Screen gutter on phones (width ≤430 pt) | 350 pt text column at 390 pt width (F12) |
| space-6 | 24 | Screen gutter on widths ≥600 pt; gap between cards | Breathing room scales with screen (F12) |
| space-8 | 32 | Gap between sections | One action per screen reads as one block (P4-F13) |
| space-12 | 48 | Space above the single primary CTA | Separates the one action from content (P4-F11) |
| touch-min | 44 | Minimum hit area, both axes | Apple default control size [S7] (F9, AE2.2) |
| button-height | 52 | Primary and secondary buttons at default type size; grows with Dynamic Type | 44 pt target + visual padding (F9) |
| content-max | 560 | Max reading-column width on tablets | ≤80 characters per line [S11] (F12) |

## Color

Light backgrounds: canvas `#FFFFFF`, secondary surface `#F7F7F7`. Dark backgrounds: canvas `#0F1A0F`, surface `#1A2A1A`, elevated `#2A3A2A`. Each ratio is the worst case against the backgrounds the role may sit on. Text ≥4.5:1; non-text UI ≥3:1.

| Role | Light hex | Dark hex | Contrast (light / dark) | Emotional intent | Intent / driven by |
|---|---|---|---|---|---|
| text.primary | #142414 | #F0F5F0 | 15.48:1 on #F8FAF7, 16.25:1 on #FFFFFF / 10.95:1 on #2A3A2A | Green-black ink: steady, never stark | Clear over entertaining (P4-F1) |
| text.secondary | #6B6B6B | #A0B0A0 | 4.97:1 on #F7F7F7 / 5.30:1 on #2A3A2A | Quiet support copy that is still fully readable | Dates carry recall provenance (P1-F19, F1) |
| text.tertiary | alias of text.secondary (#6B6B6B) | alias (#A0B0A0) | 4.97:1 / 5.30:1 (was 2.19:1 and 2.62:1) | No third, half-readable grey | Fix of failing muted text (F1, AE2.1) |
| text on sage-100 and tints | #142414 | #F0F5F0 | 13.57:1 on #E5EDE1, 13.07:1 on #FFDFE0 / 14.72:1 on #142414 | Tinted surfaces keep full-strength ink | ink-soft falls to 4.45:1 on #E5EDE1, so it is banned there (F1) |
| text.disabled | #AFAFAF | #5A6A5A | 2.19:1 / 2.62:1, exempt as inactive (SC 1.4.3, 1.4.11) | Unavailable, never used for content | Inactive controls are exempt [S2]; label wording stays (F1) |
| accent.text (eyebrow, link, active tab) | #44633F | #ABC0A2 | 6.27:1 on #F2F8EF, 6.77:1 on #FFFFFF / 6.21:1 on #2A3A2A | The one accent says "you can act here" | Sage-500 fails on tints (F2, P4-F11) |
| brand.primary fill (CTA) + label | #5F7F58 with #FFFFFF label | #7E9874 with #1A2A1A label | label 4.503:1 / 4.77:1; fill edge 4.20:1 on #F7F7F7 / 4.77:1 on #1A2A1A | One sage action per screen | One main action (P4-F11, F2) |
| brand.pressed + label | #44633F with #FFFFFF | #93AB88 with #1A2A1A (was #5F7F58, 3.36:1) | 6.77:1 / 6.06:1 | Pressed confirms the touch without a color jump | Dark pressed label failed (F1) |
| brand.soft + onSoft | #E5EDE1 with #29452A | #142414 with #ABC0A2 | 8.86:1 / 8.35:1 | Soft wells for icons and secondary chips | Unchanged, passes (F1) |
| selection.border + check icon | #5F7F58 (was #ABC0A2, 1.95:1) | #5F7F58 | 4.17:1 on #F2F8EF, 4.50:1 on #FFFFFF / 3.36:1 on #1A2A1A | A chosen feeling word is unmistakable | State indicator needs 3:1 [S2]; check icon so color is not alone (P1-F10, AE2.7) |
| selection.surface + foreground | #F2F8EF with #29452A | #1A2F1A with #D3E0CD | 9.83:1 / 10.45:1 | Selected reads warm, not alarming | Unchanged pairing, passes (F1) |
| border.control (inputs, unselected chips, switch edge) | #8A918A (was #E5E5E5 1.26:1, #999999 2.85:1) | #748474 (was #3A4A3A, 1.60:1) | 3.02:1 on #F7F7F7, 3.23:1 on #FFFFFF / 3.05:1 on #2A3A2A, 3.81:1 on #1A2A1A | Where to type is visible without hunting | Component boundary 3:1 [S2] (F1, F9) |
| border.decorative (card edge, divider) | #E5E5E5 | #2A3A2A | 1.26:1 / 1.25:1, decorative: never the only cue of a control | Cards recede behind content | Cards are identified by their text [S2] (P4-F13) |
| progress fill vs track | #5F7F58 on #E5E5E5 | #7E9874 on #2A3A2A | 3.58:1 / 3.82:1 | Growth bar readable as a shape | Graphical object 3:1 [S2] (P4-F8) |
| focus ring (3 pt) | #44633F | #ABC0A2 | 6.77:1 on #FFFFFF / 7.77:1 on #1A2A1A | Keyboard and Switch Control users see where they are | Focus indicator 3:1 [S2] (F9) |
| danger.text | #B71C1C (was #E7000B, 3.84:1 on tint; #FF4B4B, 3.30:1 as text) | #FF9090 | 5.28:1 on #FFDFE0, 6.57:1 on #FFFFFF / 6.94:1 on #1A2A1A | Plain warning, used only for errors and deletion | Error text must be read, not glanced at (F1, P4-F14) |
| danger.indicator (icon, error field edge) | #D63A3A (was #FF4B4B, 2.66:1 on tint; #FF9090 border, 2.18:1) | #FF4B4B | 3.73:1 on #FFDFE0, 4.64:1 on #FFFFFF / 4.58:1 on #1A2A1A | Error state visible without alarm-red glare | Non-text 3:1 [S2] (F1) |
| danger.surface + text | #FFDFE0 with #142414 | #2E0F0F with #F0F5F0 | 13.07:1 / 15.97:1 | Error tint carries full-strength ink | Never accent text on its own tint (F1) |
| info.text and info.indicator | #006699 (indicator was #1CB0F6, 2.45:1) | #99D6FF text, #1CB0F6 indicator | 5.49:1 on #DDF4FF, 6.25:1 on #FFFFFF / 9.65:1 and 6.18:1 on #1A2A1A | Neutral information, no urgency | Failing indicator fixed (F1) |
| success (exercise answer correct) | alias accent.text #44633F, indicator #5F7F58 (was #15803D, #16A34A) | #ABC0A2, indicator #7E9874 | 6.49:1 on #F8FBF6, indicator 4.50:1 / 7.37:1 on #1A2F1A, indicator 4.77:1 | One green in the app, not two competing ones | One accent, one role (F2, P4-F8) |
| warning.text and indicator | #8A4F00 text, #C76F00 indicator | #FFD299 text, #FF9600 indicator | 5.75:1 on #FEEDE0, indicator 3.44:1 on #F7F7F7 / 11.32:1 on #2E1F0F, indicator 6.92:1 on #1A2A1A | Rare caution (offline, unsynced) | Unchanged, passes (P4-F14) |
| crisis.action fill + label | #142414 fill, #FFFFFF label | #F0F5F0 fill, #0F1A0F label | label 16.25:1, fill 16.25:1 on #FFFFFF / label 16.19:1, fill 13.69:1 on #1A2A1A | Highest-contrast, brand-free call buttons | Crisis surface is plain and resource-first (P3-F12, P4-F16) |
| happi.bubble surface + text | #F8FBF6 with #142414 | #2A3A2A with #F0F5F0 | 15.57:1 / 10.95:1 | Happi's words sit on a soft, quiet card | Bubble text is plain readable text (P3 Voice, AE2.6) |
| mood mark 1 | #5B7DB8 | #5B7DB8 | 3.87:1 on #F7F7F7, 4.14:1 on #FFFFFF / 3.65:1 on #1A2A1A | Low feelings get a calm blue, not alarm red | No red, mark plus word (P1-F-dose5, F6) |
| mood mark 2 | #8A72B8 | #8A72B8 | 3.78:1 on #F7F7F7, 4.05:1 on #FFFFFF / 3.73:1 on #1A2A1A | Muted violet, no grade implied | Mid-luminance band (F6) |
| mood mark 3 | #8C8A7A | #8C8A7A | 3.25:1 on #F7F7F7, 3.48:1 on #FFFFFF / 4.34:1 on #1A2A1A | Neutral stone for "in between" | Mid-luminance band (F6) |
| mood mark 4 | #3E9A8A | #3E9A8A | 3.17:1 on #F7F7F7, 3.39:1 on #FFFFFF / 4.46:1 on #1A2A1A | Teal, kept distinct from brand sage | Mood colors separate from brand (F6) |
| mood mark 5 | #C07A2C | #C07A2C | 3.23:1 on #F7F7F7, 3.47:1 on #FFFFFF / 4.36:1 on #1A2A1A | Warm amber, not gold reward | No gold reward cue (F6, F11) |
| happi.ink silhouette | #252525 | #252525 plus 1.5-unit #A0B0A0 outline | 15.33:1 on #FFFFFF / fill 1.02:1 on #1A2A1A, outline 7.84:1 on #0F1A0F | Happi stays legible as a shape in both modes | Expressions must read as a silhouette (P3-F2) |
| happi.heart | #C8BEE6 | #C8BEE6 | 8.73:1 on #252525 torso / 8.73:1 | Lavender is Happi's alone, never a UI color | One accent, one role (P3 Summary 1) |

Rules for the table above:
- Mood marks sit only on `surface.primary` (`#FFFFFF` / `#1A2A1A`); on `#2A3A2A` marks 1 and 2 measure 2.92:1 and 2.98:1, so mood charts never use the elevated surface.
- Sage-500 is never a text color; `text.secondary` is never placed on `#E5EDE1`.
- No color carries meaning alone: selection adds a check icon, mood adds its word and icon, errors add a text line (AE2.7).

## Radii and elevation

| Token | Value | Allowed on | Not allowed on | Intent / driven by |
|---|---|---|---|---|
| radius-sm | 4 pt | Focus ring corner offset, inline tags | Cards, buttons | Small parts stay crisp (F9) |
| radius-md | 8 pt | Text inputs, status chips (offline, unsynced) | Happi bubble | Inputs read as fields, not cards (P4-F14) |
| radius-lg | 12 pt | Buttons, quote card | Sheets | Rounded enough to echo Happi's round form (P3-F2) |
| radius-xl | 16 pt | Cards, icon wells (absorbs `icon-well` 18 pt) | Pills | One card radius across the app (P4-F13) |
| radius-2xl | 20 pt | Happi bubble (with tail), bottom-sheet top corners | Inputs | Bubble shape distinct from cards (P3 Voice) |
| radius-3xl | 24 pt | Day 7/15 modal, crisis sheet top corners | Inline content | Rare containers only (P1-F-dose9) |
| radius-full | 9999 pt | Feeling-word chips, toggles, progress track | Cards | Chips read as choices (P1-F10) |
| elevation-none | offset 0, opacity 0 | Default for all content | — | Flat by default; depth only where it means "above" (F11) |
| elevation-low | offset 0 × 2 pt, blur 8 pt, opacity 0.05 | Bottom sheets, recall card on home | Every card in a list | One lifted item per screen (P4-F3) |
| elevation-medium | offset 0 × 4 pt, blur 16 pt, opacity 0.08 | Day 7/15 modal, crisis sheet | Toasts | Modal sits above everything (P3 Expression set) |
| elevation-high | retired (was 0 × 8 pt, blur 24 pt, 0.12) | — | — | No third depth needed (F11) |
| depth-border (bottom edge) | primary CTA 3 pt (was 4 pt); cards 0 pt (was 4–6 pt) | Primary CTA only | Cards, tiles, chips | Duolingo's chunky 3D tiles turned down to one tactile button (P2-F3 adapt-down, F11) |
| dark-mode depth | surface step #1A2A1A → #2A3A2A replaces shadow | All dark elevated layers | — | Shadows are invisible on #0F1A0F (F1) |

## Motion

Curves: ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`, ease-in `cubic-bezier(0.55, 0, 1, 0.45)` (exits only), linear (loops only) [S16]. No springs anywhere: damping and stiffness are not used. Reduced motion is read live via `reduceMotionChanged` [S10].

| Category | Move | Entrance ms / exit ms | Curve | Reduced-motion fallback | Intent / driven by |
|---|---|---|---|---|---|
| press | Button and chip press: scale 1 → 0.97 | 120 ms in / 100 ms release | ease-out cubic-bezier(0.23, 1, 0.32, 1) | Pressed color only, 0 ms | Confirms touch on a path used daily (F5, P4 haptic map) |
| press | Feeling-word chip fill + check icon | 150 ms in / 100 ms out | ease-out cubic-bezier(0.23, 1, 0.32, 1) | Color and check swap at 0 ms | Selection must read at once (P1-F10, F5) |
| enter / exit | Screen push: translate 24 pt + opacity | 280 ms in / 200 ms out | in: ease-out (0.23, 1, 0.32, 1); out: ease-in (0.55, 0, 1, 0.45) | 150 ms cross-fade both ways | Apple: replace transitions with fades [S7] (F10) |
| enter / exit | Bottom sheet (reminders, Memory) | 300 ms in / 220 ms out | ease-out / ease-in | 150 ms opacity | Sheets 200–500 ms, kept at the 300 ms UI cap [S16] (F5) |
| enter / exit | Status chip (offline, unsynced) | 200 ms in / 150 ms out | ease-out / ease-in | Appears and leaves at 0 ms | Calm error states (P4-F14) |
| enter | Saved: quote card rises 8 pt + fades in | 300 ms (was 400 ms) | ease-out cubic-bezier(0.23, 1, 0.32, 1) | Final frame, opacity 150 ms | UI ≤300 ms (F5, P4-F5) |
| enter / exit | Happi bubble: opacity + scale 0.96 → 1 | 250 ms in / 180 ms out | ease-out / ease-in | Present at load, removed at 0 ms | Nothing appears from nothing, never letter by letter [S16] (P3 Presence rules) |
| exit / enter | Happi Stepping aside (keyboard opens) | 250 ms return / 200 ms leave | leave: ease-in (0.55, 0, 1, 0.45); return: ease-out | Unmounted at 0 ms, returns at 0 ms | Disclosure without an audience (P3-F7) |
| mascot idle | Breath sy ±1.2%, gaze drift ±1.2 units, tilt ±1.6° | loops 2400 ms / 4200 ms / 4000 ms | linear sine (wave) | Frozen at frame 0, no loop | Alive but quiet (P3 Expression set, [S17]) |
| mascot idle | Blink every 3600 ms | 110 ms close / 40 ms hold / 190 ms reopen | close ease-in-out (0.77, 0, 0.175, 1); reopen ease-out | No blink, eyes open | Reopen slower than close [S16] (P3 Expression set) |
| mascot one-shot | Gentle concern: tilt +6°, lean +3° | 700 ms | ease-in-out cubic-bezier(0.77, 0, 0.175, 1) via `flow` | Final pose (tilt +6°, lid 0.15) | Concern as attention (P3-F6) |
| mascot one-shot | Quiet pride: cheek 0 → 0.6, sy 1.02 | ≤600 ms | ease-out cubic-bezier(0.23, 1, 0.32, 1) | Final frame (cheek 0.3, tilt +3°) | Routine acknowledgement ≤600 ms (P1-F-dose9) |
| mascot one-shot | Welcome back: lids open, one wave | ≤1800 ms | ease-out for lids, `flow` for arms | Final frame (lid 0, cheek 0.4, arms down) | Return as welcome (P3-F9, P4-F15) |
| celebration | Day 7/15: Happi lift 12 units + modal enter | Happi 900 ms; modal 300 ms in / 220 ms out | Happi `flow`; modal ease-out / ease-in | Final pose + modal at 0 ms; Success haptic still plays unless haptics off | One calm beat, no confetti (P2 adapt-down, P3-F11) |
| loop | Breath cue circle 0.9 → 1.0 | 4000 ms inhale / 4000 ms exhale | ease-in-out cubic-bezier(0.77, 0, 0.175, 1) | Static circle + "Breathe in / Breathe out" with a 4 s counter | Ritual pacing (P1-F14, P4 haptic map) |
| loop | Happi Thinking (real processing only) | ≤1500 ms added; saccades every 700 ms | ease-in-out | Still pose (gaze −1.5, 2.2) | Visible effort, never fake delay (P2-F11) |
| counter | Days-practised number change: cross-fade | 200 ms in / 150 ms out | ease-out / ease-in | Number swaps at 0 ms | No odometer count-up; a count, not a jackpot (P4-F8, F11) |
| return | Return greeting fade-in | 300 ms | ease-out | Text present at load | Quiet arrival (P4-F15) |
| ambient | Seasonal leaves or snow | ≥2000 ms per cycle, ≤4 scenes per year | linear | Off | ≤1 cycle per 2 s, nothing flashes >3 per second [S12] (P4-F12) |
| crisis | Crisis sheet | 0 ms in / 0 ms out | none | Same: appears at once | No animation on crisis surfaces (P3-F12, P4-F16) |

## Illustration

| Attribute | Rule | Intent / driven by |
|---|---|---|
| Character | Happi only, vector rig from `art.ts`; retired raster poses never ship | One frozen identity (P3-F10) |
| Line weight | Happi: fills only, no outline in light mode; dark mode adds a 1.5-unit `#A0B0A0` outline (7.84:1 on `#0F1A0F`); scene props: 3-unit stroke at the 390-unit canvas (≈3 pt at 1×) | Silhouette reads at 32 × 32 px in both modes (P3-F2, Color table) |
| Palette subset | Happi: `#252525`, `#FFFFFF`, `#C8BEE6`, ground `#BCD0AF`; scene: `#F0F5EC`, `#EAF1E5`, `#E3EDDC`, prop greens `#7C9C6B` / `#A8C392`; no UI accent colors inside art | Art never competes with the one UI accent (F2, P3-F2) |
| Shading | Flat fills; one shadow tone, ground oval only, scaled by `1 − lift / 220`; no gradients except the 3-band scene background | Calm, low-detail art (P3-F2, [S17]) |
| Framing | Full body with floor visible; ≥16 pt clear space on all sides; Happi's gaze points toward the content it accompanies, never at a button | Beside, not above (P3-F5) |
| Max size: home hero | ≤35% of screen height (≈295 pt on an 844 pt screen) | Smaller than BitePal's ~45% home pet so content leads (P2 BitePal, P4-F13) |
| Max size: check-in grid | ≤120 pt tall, above the grid | Feeling words stay the focus (P1-F10) |
| Max size: completion | ≤160 pt tall | Quote card leads, Happi accompanies (P3-F5, P4-F5) |
| Max size: Day 7/15 modal | ≤200 pt tall | The one larger moment, ≤1 per 7 days (P1-F-dose9) |
| Max size: empty state | ≤120 pt tall | One line, one action lead (P4-F13) |
| Max size: accessibility sizes | AX1–AX5: ≤96 pt tall, bubble moves below at full width | Text space wins at large type (F3) |
| Absent | Crisis, errors, offline chips, settings for deletion, notifications, widgets | Absence zones (P3 Presence rules) |
| Screen readers | Art hidden (`accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`); bubble read as plain text after the title | Decorative art (P3 Revisions AE2.6) |

## Haptics

All through expo-haptics; in-app "Haptics" toggle beside "Sounds"; system haptics-off and Low Power Mode suppress everything [S8]. Global ceiling: ≤1 non-selection haptic per 1000 ms; no haptic is the only carrier of meaning.

| Event | Generator | Style / intensity | Max frequency | Paired visual or text | Intent / driven by |
|---|---|---|---|---|---|
| Feeling-word chip select | `selectionAsync()` | system selection tick | ≤1 per 100 ms; none during scroll | Fill + check icon (150 ms) | Selection feedback while values change [S8] (P4 haptic map) |
| Primary button press | none | — | 0 | Scale 0.97, 120 ms | Frequent path stays silent (F5, F8) |
| Entry or Thought Catch saved | `impactAsync(Soft)` | Soft, the quietest expo style | ≤1 per save and ≤1 per 2000 ms | Quote card rise 300 ms + "Saved. It's yours." | Routine save stays low-arousal (P4-F9, P1-F-dose9) |
| Breath cue phase change (opt-in) | `impactAsync(Soft)` | Soft | 1 per 4000 ms phase (≤15 per minute) | Circle scale + "Breathe in / out" text | Pacing a ritual, opt-in only (P4 haptic map, P1-F14) |
| Day 7 and Day 15 milestone | `notificationAsync(Success)` | Success | ≤1 per 7 days; 2 per lifetime | Modal + Happi Celebrating (low) | Success means a task completed [S8]; rare, so it carries meaning (P4-F9) |
| Final "Delete all data" confirm | `notificationAsync(Warning)` | Warning | ≤1 per confirm | Sheet with danger.text line | Irreversible action is felt (P4 haptic map) |
| Offline, sync or save error | none | — | 0 | Status chip text | Errors stay calm (P4-F14) |
| Crisis sheet | none | — | 0, not configurable | Sheet appears at once | No sensory load on the worst screen (P4-F16, P3-F12) |
| Reminder toggle | system switch | system | system default | Switch state + label | Platform behavior (P4 haptic map) |
| Return after absence | none | — | 0 | Greeting fade 300 ms | Welcome without a jolt (P4-F15) |

## Copy rules

| Rule | Numeric cap | Applies to | Intent / driven by |
|---|---|---|---|
| Words per sentence | ≤12 everyday and celebrating; ≤10 struggling; ≤20 instructional-clinical | All app copy | Stressed readers have less working memory (P4-F1) |
| Sentences per block | ≤2 everyday, struggling and celebrating; ≤3 instructional | All app copy | One idea per block (P4-F1) |
| Reading grade (Flesch-Kincaid) | ≤6 everyday; ≤5 struggling; ≤8 instructional and crisis | Checked before merge | AE2.9 (P4-F1) |
| Happi bubble | ≤12 words, ≤60 English characters, 1 sentence, ≤1 per screen, ≤3 and ≤36 words per session | Happi lines only | Character talks less than the app (P3-F13) |
| Exclamation marks | 0 per screen; Day 7/15 modal ≤1, which is ≤1 per 7 days | Every screen | Low-arousal default in 8 locales (P1-F22) |
| Emoji | 0 in app copy and in Happi bubbles | Every string | Adult register (P3 Voice, AP4.1) |
| All-caps | 0 strings and 0 uppercase transforms (eyebrow is sentence case) | Every string and text style | No raised voice; ar/zh have no case (F7, P1-F22) |
| Button labels | ≤3 words, verb first ("Save", "Keep writing") | Buttons | Fast decisions at AX5 sizes too (F3) |
| Error copy | ≤2 sentences; sentence 1 states what is safe | Errors, offline | Data safety first (P4-F14) |
| Quote of the user | ≤8 words, in quotation marks, with "You wrote" and a date | Completion, recall | Responsiveness with visible source (P1-F18, P1-F19) |
| Return copy | 0 durations, 0 day counts | Return, widgets, pushes | Return as welcome (P2-F2, P3-F9) |
| Banned words | 0 occurrences of "amazing", "superstar", "legend", "yay", "awesome", "rewired", "should", "must", "streak at risk", "don't lose", "unlock" (own data), "cure", "fix" | All locales | P4 banned list carried into tokens (P4-F1) |
| Shared save line | "Saved. It's yours." is app copy; Happi voices it only when mounted and ≤2 bubbles used this session, and the app line then becomes the date stamp | Completion screen | Contradiction decided below (P3 Voice, P4-F5) |
| Tone per screen type | home, check-in, completion = everyday; after a low word, return, errors = struggling; Day 7/15 = celebrating; CBT steps, crisis, privacy, delete = instructional-clinical | Every screen | One voice, tone set by the reader's state (P4-F1) |

## Diff vs current

| Current token (file) | New token | Reason |
|---|---|---|
| `NEUTRAL.inkMuted #AFAFAF` as `text.tertiary` / `caption-muted` / `overline` / `happy-brand-secondary-cta-text` (palette.ts, colors.ts, global.css, Text.tsx) | `text.tertiary` = `text.secondary #6B6B6B`; `#AFAFAF` only for disabled | 2.19:1 on white fails text; 4.97:1 after (F1) |
| dark `text.tertiary` / `disabled.foreground #5A6A5A` (colors.ts) | tertiary = `#A0B0A0`; disabled stays `#5A6A5A` | 2.62:1 fails; 6.63:1 after (F1) |
| `selection.border #ABC0A2` (colors.ts) | `#5F7F58` + check icon | 1.95:1 fails SC 1.4.11 state; 4.50:1 after (F1) |
| `brand-border-strong #999999`, `border.strong #E5E5E5` (global.css, colors.ts) | `border.control #8A918A` for inputs, chips, switches | 2.85:1 and 1.26:1 fail as control boundaries; 3.02:1 after (F1) |
| dark `border.strong #3A4A3A` | `#748474` | 1.60:1 fails; 3.05:1 after (F1) |
| `error.foreground #E7000B` on `#FFDFE0` | `#B71C1C` (existing `cardinal-dark`) | 3.84:1 fails; 5.28:1 after (F1) |
| Text color `danger` = `cardinal-red #FF4B4B` (Text.tsx) | `#B71C1C` | 3.30:1 fails text; 6.57:1 after (F1) |
| `error.border #FF9090`, `error.indicator #FF4B4B` on tint | `#D63A3A` | 2.18:1 and 2.66:1 fail; 3.73:1 after (F1) |
| `info.indicator #1CB0F6` (light) | `#006699` | 2.45:1 fails; 6.25:1 after (F1) |
| dark `brand.pressed #5F7F58` with `#1A2A1A` label | `#93AB88` | 3.36:1 fails; 6.06:1 after (F1) |
| Text color `streak` = bee-yellow `#FFD900` | retired | 1.38:1 on white; XP and streak flame removed (F11, P4-F8) |
| Text color `premium` = macaw `#CE82FF` | retired; paywall uses ink and sage | 2.54:1 on white (F1, F11) |
| `MOOD_COLORS` 1–5 `#EF4444 #F97316 #EAB308 #10B981 #0EA5E9` (constants/moodColors.ts) | `#5B7DB8 #8A72B8 #8C8A7A #3E9A8A #C07A2C` | Scores 2–5 at 1.92–2.80:1 fail 3:1; red reads as error (F6, P1-F-dose5) |
| `success.*` `#15803D` / `#16A34A` / `#4ADE80` | alias of sage accent tokens | One green, one role (F2) |
| `text-sage-500` as text (eyebrow, `sage` color) | `#44633F` | 4.17:1 on `#F2F8EF` fails (F2) |
| gold, bee-yellow, parrot-orange, macaw-purple palette (global.css "Accent palette") | retired from UI | Gamification tokens with no remaining use (F11) |
| `eyebrow` / `overline` 11 / 16 pt uppercase (Text.tsx) | eyebrow 13 / 18 pt sentence case; overline merged into caption | F7 |
| `h1` leading 32 pt, `h2` 26 pt, `h3` 22 pt, `body-bold` 22 pt | 34, 28, 24, 24 pt | Apple leading ratios for wrapped text (F3) |
| `chip` 12 / 16 pt | 13 / 18 pt | Feeling words are content (F7) |
| `counter` 36 / 36 pt ExtraBold | 28 / 32 pt Bold | Low-arousal count (F11) |
| no `maxFontSizeMultiplier` per role | per-role caps in `## Type` | AX5 support (F3) |
| `SPACING` empty object (spacing.ts) | 4 pt scale, gutters 20 / 24 pt, content-max 560 pt | F9, F12 |
| `RADIUS.icon-well 18` | folded into `xl 16` | One card radius (Radii table) |
| `ELEVATION.high` | retired | F11 |
| card depth borders 4–6 pt (`happy-brand-raised-panel`, `preview-tile`, `pressed-card`) | 0 pt; primary CTA 3 pt (was 4 pt) | Adapt-down of Duolingo tiles (P2-F3) |
| `withSpring(mass 0.6, stiffness 280, damping 20)` (StreakCelebrationCopy.tsx) | 300 ms ease-out, no spring | F5, P4-F11 |
| P4 quote-card rise 400 ms | 300 ms | F5 |
| `colors.ts surface.canvas #F8FAF7` vs `global.css brand-canvas #FFFFFF` | canvas `#FFFFFF` in both | Two sources disagreed; white keeps every ratio at its maximum (F1) |
| `NEUTRAL.ink #142414`, `inkSoft #6B6B6B`, `SAGE` 50–800, dark `#F0F5F0` / `#A0B0A0`, surfaces `#FFFFFF` / `#F7F7F7` / `#0F1A0F` / `#1A2A1A` / `#2A3A2A` | unchanged | All pass (Color table) |
| CTA fill `#5F7F58` + white label | unchanged | 4.503:1 passes; margin risk noted (F2) |
| warning `#8A4F00` / `#C76F00` / `#FFD299` / `#FF9600`, info text `#006699` / `#99D6FF` | unchanged | Pass (Color table) |
| Nunito family and weights 400/600/700/800; body 17 / 24 pt; caption 13 / 19 pt; label 14 / 20 pt | unchanged | Keep identity; sizes meet Apple defaults (F4) |
| engine curves `EASE_OUT (0.23, 1, 0.32, 1)`, `EASE_IN_OUT (0.77, 0, 0.175, 1)`, `EASE_IN (0.55, 0, 1, 0.45)` (engine.ts) | unchanged | Already the rossark curves [S16] |
| `RADIUS` sm 4, md 8, lg 12, xl 16, 2xl 20, 3xl 24, full; `ELEVATION` none, low, medium | unchanged values, new allowed-use rules | Radii table |

## Contradictions
- Phase 3 Voice lists "Saved. It's yours." as Happi do-line 3, Phase 4 F5 and its Contradiction 5 make it app copy by default, and Phase 1 F14 wrote it as "Saved. That's yours." Decision: the canonical string is "Saved. It's yours." (3 words, already in the P4 phrase bank and measured there); it is app copy owned by the completion screen; Happi voices it only when Happi is mounted on that screen and ≤2 bubbles have been used this session, and then the app line becomes the date stamp ("Today, 9:14") so the words never appear twice; with Happi hidden, in an absence zone, or with the 3-bubble budget spent, the app line shows. This keeps the save acknowledgement for every user (AE1.4: "Show Happi" off has no penalty) while respecting P3's bubble caps.
- Phase 4's haptic map gives the save quote card a 400 ms rise, while the rossark interface rule and Apple's brevity guidance put interface moves under 300 ms [S16], [S9]. Decision: 300 ms ease-out, because the save line is feedback on a daily path and the user is waiting on it; Happi one-shots keep their longer P3 timings because they are character acting, not feedback.
- Phase 3 Revisions say a 12-word bubble stays ≤5 lines at AX5, while the AX5 Body size of 53 pt [S6] on a 318 pt inner width gives ~11 characters per line, so a 60-character bubble wraps to 6 lines. Decision: ≤6 lines at AX5, Happi art shrinks to ≤96 pt and the bubble moves below it full-width at AX1–AX5; the 60-character cap stays.
- WCAG's large-text rule allows 3:1 for ≥14 pt bold [S1], and Apple's table allows 3:1 for all bold text [S7], so a 17 pt bold label on sage-500 could pass at 3:1. Decision: Happy treats RN points as CSS px, so large text starts at 24 pt regular or 19 pt bold, and every text below that needs 4.5:1; this is stricter than Apple's table and removes the ambiguity in mapping pt to CSS px.

## Rejected ideas
- Cream canvas with a serif display face (the "calm wellness" default seen across meditation apps) — rejected because Happi's art, the sage palette and Nunito are established assets with no evidence against them (SKILL rule 8), Nunito already covers the Latin/Cyrillic locales [S13], and a serif face would add a third family whose ar/zh fallback is still the system face (F4).
- Dark-first theme with lime accent (fintech look) — rejected because a high-chroma lime on near-black is the high-arousal register Phase 1 caps for routine use (P1-F22, P1-F-dose9), and Happi's black fills fall to 1.02:1 on dark surfaces, so dark-first would make the character depend on an outline everywhere (Color table).
- Keeping Duolingo's gold/purple/orange reward palette for milestones only — rejected because tokens make the register cheap to reuse, and XP and the streak flame they served are removed (F11, P4-F8).
- Red-to-green mood scale with labels added — rejected because red is the error color and a red-to-green ramp grades feelings even with labels (F6, P1-F-dose5).
- Spring physics for button and modal feedback — rejected because the rossark method bans bouncy overshoot unless the brand asks for it [S16] and Apple's Reduce Motion guidance asks to tighten springs anyway [S7]; timed curves give the same feel with a predictable end.
- An all-sage UI (sage text, sage borders, sage icons) — rejected because sage-500 fails as text on tints (F2) and an accent used everywhere no longer marks the one action (P4-F11).

## Critique (pass 1)
Spot-checked by reopening in this run: [S1] (rounding statement "4.499:1 would not meet the 4.5:1 threshold" — matches F1, F2), [S6] (HIG typography JSON: Body 17/22 default, 53/62 at AX5, minimum 11 pt — matches F3 and Contradiction 3), [S8] (HIG haptics JSON: "Make haptics optional." and "Use haptics consistently" — matches F8).
- [FAIL] AE2.1 Pass-1 color table kept dark `text.tertiary #5A6A5A` (2.62:1), did not compute the dark pressed label (3.36:1), proposed tertiary `#707870` that measured 4.25:1 on `#F7F7F7`, and allowed mood marks on `#2A3A2A` where marks 1–2 measure 2.92:1 and 2.98:1.
- [FAIL] ED5.4 Pass-1 motion copied Phase 4's 400 ms quote-card rise, above the ≤300 ms interface cap.
- [FAIL] AE2.3 Pass-1 type table gave fixed sizes with no per-role scale cap and no AX5 bubble behaviour.
- [FAIL] ED6.2 Pass-1 kept the 11 pt uppercase eyebrow and used Caveat for every locale, though Caveat has no Arabic or CJK glyphs [S14].
- [FAIL] AE2.7 Pass-1 kept `MOOD_COLORS` red-to-green with labels as the only fix.
- [FAIL] RQ2.4 Pass-1 line length was stated as "readable measure" with no character count or column width.
- [FAIL] RQ1.6 Pass-1 F5 cited [S9] for "under 300 ms"; the HIG motion page gives no duration (it says brevity), the 300 ms number comes from the rossark skill [S16].
- [PASS] RQ1.1 every Claim has Evidence with [S#] or inference.
- [PASS] RQ1.3 2 of 12 evidence lines carry an inference, each paired with a source.
- [PASS] RQ5.1 Summary states decisions only.
- [PASS] ED3.1 celebration capped ≤1 per 7 days in Motion and Haptics.
- [PASS] ED3.2 routine save ≤300 ms, Soft haptic, no confetti.
- [PASS] ED3.3 Duolingo tiles and celebration palette stated as turned down (depth 3 pt CTA only; gold retired).
- [PASS] ED1.3 no reward color or haptic on logging a low feeling.
- [PASS] AE2.2 44 × 44 pt hit areas in Spacing.
- [PASS] AE2.4 every Motion row has a reduced-motion still.
- [PASS] AE2.5 no row cycles faster than 1 per 2000 ms except blinks (one per 3600 ms).
- [PASS] AE2.6 Happi art hidden from screen readers; bubble read as text.
- [PASS] AE2.8 no haptic carries meaning alone; system settings respected.
- [PASS] AE2.9 grade caps in Copy rules.
- [PASS] AE1.4 haptics and Happi have one-tap off with no penalty; save line survives "Show Happi" off.
- [N/A] AE1.2 crisis flow behaviour is owned by Phases 3, 4 and 6; this phase supplies only crisis colors (16.25:1) and 0 ms motion.
- [N/A] AE1.6 no data-recall behaviour is set in tokens.

## Revisions
- Pass 2, AE2.1: dark tertiary collapsed into `#A0B0A0` (5.30:1 worst case); light tertiary collapsed into `#6B6B6B` (4.97:1) instead of `#707870`; dark pressed fill moved to `#93AB88` (6.06:1); mood marks restricted to `surface.primary` with ratios ≥3.17:1 light and ≥3.65:1 dark; Happi dark-mode outline added (7.84:1).
- Pass 2, ED5.4: quote-card rise set to 300 ms and recorded in Contradictions; every UI row ≤300 ms with exits faster.
- Pass 2, AE2.3: added the max-scale column (×1.67 to ×3.38) and the AX1–AX5 Happi/bubble layout rule (F3, Contradiction 3).
- Pass 2, ED6.2: eyebrow sentence case (F7); Caveat limited to Latin/Cyrillic locales with system text for ar/zh; ar/zh +4 pt leading (F4).
- Pass 2, AE2.7: new mood marks with no red or success green, always with word and icon (F6).
- Pass 2, RQ2.4: line length set as characters per role and a 560 pt content column (F12).
- Pass 2, RQ1.6: F5 now cites [S9] only for brevity and frequent-interaction guidance and [S16] for the 300 ms figure.

## Self-critique
- Weakest part: the mood-mark hues and the 0.16–0.30 luminance band are computed for contrast, not tested with users for emotional reading across the 8 locales; "calm blue for low" is an inference from P1-F-dose5, not a study. The ~0.52 em average glyph width for Nunito used in F3 and F12 is an estimate, so the 6-line AX5 bubble and 63-character column are approximate.
- Second weakness: the CTA white-on-sage pairing passes at 4.503:1, so any future tweak of sage-500 or a translucent overlay breaks it; nothing in the repo enforces ratios automatically. Haptic frequency caps rest on Apple's guidance [S8], not on a study with anxious users.
- A further pass should: render the AX5 bubble and type roles in Remotion stills at 390 pt and 768 pt widths to measure real line counts; add a contrast unit test that reads `palette.ts` and fails below the table's ratios; test the 5 mood marks with 5 users each in en, ar and zh for unintended meaning (e.g. violet as mourning).

## Sources
- [S1] W3C (2023). Understanding Success Criterion 1.4.3: Contrast (Minimum), WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html — opened 2026-11-03 (4.5:1, 3:1 large text, 18 pt / 14 pt bold, thresholds not rounded)
- [S2] W3C (2023). Understanding Success Criterion 1.4.11: Non-text Contrast, WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html — opened 2026-11-03 (3:1 for components, states, graphics; inactive exempt)
- [S3] W3C (2023). Understanding Success Criterion 2.5.8: Target Size (Minimum), WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html — opened 2026-11-03 (24 × 24 CSS px, spacing exception)
- [S4] W3C WAI Working Group wiki — Relative luminance. https://www.w3.org/WAI/GL/wiki/Relative_luminance — opened 2026-11-03 (0.2126/0.7152/0.0722; 0.04045 threshold errata)
- [S5] W3C (2023). Web Content Accessibility Guidelines (WCAG) 2.2, definition of contrast ratio. https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio — opened 2026-11-03 ((L1 + 0.05)/(L2 + 0.05))
- [S6] Apple — Human Interface Guidelines: Typography. https://developer.apple.com/design/human-interface-guidelines/typography — opened 2026-11-03 via the HIG JSON endpoint (Dynamic Type default and AX5 tables; 17 pt default, 11 pt minimum)
- [S7] Apple — Human Interface Guidelines: Accessibility. https://developer.apple.com/design/human-interface-guidelines/accessibility — opened 2026-11-03 via the HIG JSON endpoint (44 × 44 pt; ≥200% text enlargement; Reduce Motion: replace transitions with fades, tighten springs)
- [S8] Apple — Human Interface Guidelines: Playing haptics. https://developer.apple.com/design/human-interface-guidelines/playing-haptics — opened 2026-11-03 via the HIG JSON endpoint (consistent, optional, not frequent; Soft, Selection, Success, Warning definitions)
- [S9] Apple — Human Interface Guidelines: Motion. https://developer.apple.com/design/human-interface-guidelines/motion — opened 2026-11-03 via the HIG JSON endpoint (brevity and precision; avoid motion on frequent interactions; let people cancel motion; no duration given)
- [S10] React Native — AccessibilityInfo. https://reactnative.dev/docs/accessibilityinfo — opened 2026-11-03 (isReduceMotionEnabled, reduceMotionChanged, prefersCrossFadeTransitions)
- [S11] W3C (2023). Understanding Success Criterion 1.4.8: Visual Presentation, WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html — opened 2026-11-03 (≤80 characters, line spacing 1.5, paragraph spacing 1.5×)
- [S12] W3C (2023). Understanding Success Criterion 2.3.1: Three Flashes or Below Threshold, WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html — opened 2026-11-03
- [S13] Google Fonts — Nunito METADATA.pb. https://github.com/google/fonts/blob/main/ofl/nunito/METADATA.pb — opened 2026-11-03 (subsets latin, latin-ext, cyrillic, cyrillic-ext, vietnamese; wght 200–1000)
- [S14] Google Fonts — Caveat METADATA.pb. https://github.com/google/fonts/blob/main/ofl/caveat/METADATA.pb — opened 2026-11-03 (subsets latin, latin-ext, cyrillic, cyrillic-ext)
- [S15] internal: src/theme/{colors,palette,typography,radius,elevation,spacing}.ts, global.css, constants/moodColors.ts, src/components/ui/Text.tsx
- [S16] internal: src/components/ui/motion/engine.ts, .agents/skills/rossark-motion-skill/SKILL.md §1–§7, templates/react-native/motion.ts
- [S17] internal: assets/images/panda/MOTION.md, src/components/ui/happy-scene/art.ts
