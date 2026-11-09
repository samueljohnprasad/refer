# Phase 6 — Implementation spec

Pass: 2
Inputs: docs/research/soul/00-status.md (Phases 1–5 PASS, notes read), 01-psychology.md, 02-teardown.md (Summary, Findings, Steal / Adapt-down / Never, Contradictions, Rejected ideas), 03-character.md, 04-connection-systems.md, 05-tokens.md, .agents/skills/app-soul-design/SKILL.md, phases/06-implementation-spec.md, all four checklists, references/evidence-template.md; code read (not edited): `app/` (every route file listed in Inventory), `src/screens/*`, `src/exercises/*/config.ts`, `src/types/exerciseFlow.ts`, `src/components/{Streak,Level,XP,Rewards,celebration,modals,happy-assistant,notifications,exercise}`, `src/hooks/{useStreakSaverNotification,useReviewPrompt}.ts`, `src/store/soundStore.ts`, `src/locales/en/*.json`; HTML explorations `.agents/*.html` read as reference only.

## Summary
1. Build the crisis path first: a "Get help now" entry ≤2 taps from Home and 1 tap from every free-text screen, plus an on-device phrase match that opens a non-blocking sheet with region-matched, verified hotlines; no Happi, sound, haptic, paywall or animation (P6-F1, P6-F7).
2. Remove every ask, loss and points mechanic that touches a therapeutic action in one slice: 5 `requestReview` call sites, the 8 PM streak-saver push, XP on mood/journal/exercise, the level-up modal, coins, chest, rewards shop, challenges and the Day-1 "LOCK IN" step (P6-F2, P6-F3, P6-F4).
3. Completion becomes one quiet screen: "Saved. It's yours.", the user's quoted words, one specific line, one optional next step; no XP, streak, ring, chest, share or sound (P6-F3).
4. Home check-in moves from a 5-face score to 12 feeling words with validation first; the flame streak pill becomes a leaf "days practised this month" counter with "Hide counter" (P1-F10, P1-F12).
5. Happi follows Phase 3 presence rules everywhere; the global floating "Hi, I'm Happy" assistant is retired because it floats over absence zones and speaks as a second "I" (P6-F5).
6. Onboarding keeps 5 of 7 steps: the fake 3.5 s "Building your journey" loader and the "Day 1 Streak Ignited" step are cut; the reminder step asks for one slot with no "3x" claim (P6-F4).
7. Exercise copy is corrected for clinical accuracy and honest claims ("used by Navy SEALs", "A powerful technique…", "Black or White", "Reframed reality") and the second AI persona "Sage" is removed (P6-F6).
8. Every new or changed string is written in English first, measured with Flesch-Kincaid before merge, then retranslated (not patched) into ar, de, es, fr, it, pt, zh with the P4-F1 meaning glosses; crisis strings and phrase lists are written by native-speaking clinicians, not translated (P4-F1, P6-F7).

## Inventory

Every user-facing route in `app/` and every exercise type in `src/types/exerciseFlow.ts` (13 `ExerciseType` ids) is listed. "Spec" = has a `## Screen:` section below.

| # | Surface | File(s) | Disposition |
|---|---|---|---|
| 1 | Home tab | `app/tabs/(tabs)/home/index.tsx`, `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`, `components/HomeHeader.tsx`, `src/components/EmotionLogger.tsx` | Spec: Home |
| 2 | Return after absence | new behaviour on Home | Spec: Return-after-absence |
| 3 | Streak modal and surfaces | `src/components/Streak/{StreakDisplay,StreakCelebration,StreakCelebrationCopy,StreakCelebrationParts,WeeklyStreakWidget}.tsx`, `src/hooks/useStreakSaverNotification.ts`, `src/hooks/useReviewPrompt.ts` | Spec: Streak and progress surfaces |
| 4 | XP, levels, coins, shop, achievements, challenges | `app/tabs/screens/(gamification)/{rewards-shop,xp-history,achievements,challenges}.tsx`, `src/components/{Level,XP,Rewards,Challenges}/`, `src/context/{XPContext,LevelContext,RewardsContext}.tsx` | Spec: Rewards, XP and coin shop disposition |
| 5 | Tab bar | `app/tabs/(tabs)/_layout.tsx` | Spec: Navigation / tab bar |
| 6 | Exercises tab (Lessons / My Log / Practice) | `app/tabs/(tabs)/exercises/index.tsx`, `src/screens/ExercisesScreen/` | Spec: Exercise hub |
| 7 | Exercise flow runner | `app/tabs/screens/(exercises)/exercise-flow.tsx`, `src/screens/ExerciseFlowScreen/ExerciseFlowRunner.tsx`, `src/components/exercise/steps/` | Spec: Exercise flow runner |
| 8 | `thought_catcher` | `src/exercises/thoughtCatcher/` | Spec: Thought Catcher |
| 9 | `thought_reframing` | `src/exercises/thoughtReframing/`, `src/screens/ThoughtReframingScreen/data/` | Spec: Reframe |
| 10 | `abc_analysis` | `src/exercises/abcAnalysis/` | Spec: ABC Analysis |
| 11 | `gratitude_reframe` | `src/exercises/gratitudeReframe/` | Spec: Gratitude Reframe |
| 12 | `decatastrophizing` | `src/exercises/decatastrophizing/` | Spec: Decatastrophizing |
| 13 | `worry_decision_tree` | `src/exercises/worryDecisionTree/` | Spec: Worry Decision Tree |
| 14 | `detached_mindfulness`, `attention_training` | `src/exercises/{detachedMindfulness,attentionTraining}/` | Spec: Overthinking exercises |
| 15 | `box_breathing`, `breathing_478`, `mindful_breathing_1min`, `grounding_54321`, `body_scan_pmr` | `src/exercises/{boxBreathing,breathing478,mindfulBreathing1Min,grounding54321,bodyScanPMR}/` | Spec: Mindfulness exercises |
| 16 | Behavioral activation | not in code; `.agents/behavioral-activation.html` only | Spec: Behavioral Activation (build-time rules) |
| 17 | Fear ladder | not in code; label `copingCards.exerciseTypes.fear_ladder` and `.agents/fear-ladder.html` only | Spec: Fear Ladder (build-time rules) |
| 18 | Coping cards | `app/tabs/screens/(exercises)/coping-cards.tsx`, `src/screens/CopingCardsScreen/` | Spec: Coping Cards |
| 19 | Completion | `src/screens/ExerciseFlowScreen/components/ExerciseCompletionContainer.tsx`, `src/components/celebration/LessonCompleteCelebration.tsx` and parts, `src/exercises/*/…Summary.tsx` | Spec: Completion |
| 20 | Onboarding (7 active steps) and splash | `app/index.tsx`, `app/tabs/screens/(onboarding)/premium-onboarding.tsx`, `src/screens/OnboardingScreen/constants.ts:16-97`, `steps/` | Spec: Onboarding |
| 21 | Journal tab, capture, entry, voice, analysis | `app/tabs/(tabs)/journal/index.tsx`, `app/tabs/screens/(recording)/{record,journal-entry,keyboard-recorder,voice-recorder,all-prompts}.tsx`, `src/screens/{DailyNotesScreen,DiscoveryScreen,JournalEntryScreen,AllPromptsScreen}/` | Spec: Journal capture and entry |
| 22 | Journeys tab, map, course lessons (51 lesson engines), node/chest modals | `app/tabs/(tabs)/journeys/index.tsx`, `app/tabs/screens/(journey)/*`, `app/tabs/screens/(exercises)/cbt-step-preview.tsx`, `src/domains/journey/`, `src/exercises/{AssociationMeter…WorkedRewrite}/`, `src/components/exercise/*CategoryEngine.tsx` | Spec: Journeys and course lessons |
| 23 | Insights, Practice, deep dives | `app/tabs/(tabs)/insights/*.tsx`, `app/tabs/(tabs)/exercises/practice.tsx`, `app/tabs/screens/(tracking)/insights.tsx`, `src/screens/InsightsScreen/`, `src/components/insights/` | Spec: Insights and Practice |
| 24 | Timeline tab | `app/tabs/(tabs)/timeline/index.tsx`, `app/tabs/screens/(tracking)/timelines.tsx`, `src/domains/timeline/ui/` | Spec: Timeline |
| 25 | Empty states | `src/screens/DailyNotesScreen/notes/EntryCardsView.tsx:97-98`, `src/screens/ExercisesScreen/components/{ExercisesTabEmptyStates,ExerciseTimelineEmptyState}.tsx`, `src/screens/CopingCardsScreen/CopingCardsEmptyState.tsx`, insights `ui.emptyTitle` | Spec: Empty states |
| 26 | Crisis path | none exists (grep for 988/hotline/crisis/suicide in `src`, `app`: 0 hits) | Spec: Crisis path (new) |
| 27 | Settings, reminders, notification preferences, name, language | `app/tabs/screens/(settings)/{settings,reminders,notification-preferences,name-edit,language}.tsx`, `src/screens/SettingsScreen/`, `src/components/notifications/NotificationPreferencesScreen.tsx` | Spec: Settings |
| 28 | Paywall, soft paywall, post-trial banner | `app/paywall.tsx`, `src/screens/OnboardingScreen/steps/SoftPaywallStep.tsx`, `src/components/premium/PostTrialDiscountBanner.tsx` | Spec: Paywall and offers |
| 29 | Floating Happy Assistant | `src/components/happy-assistant/`, mounted in `src/components/layout/RootLayoutNav.tsx:149` | Spec: Floating Happy Assistant |
| 30 | Update modal | `src/components/modals/UpdateModal.tsx`, opened from `JournalCalendarScreen.tsx:209-214` | Spec: Update modal |
| 31 | Support chat | `app/tabs/screens/(settings)/support-chat.tsx`, `src/screens/SupportChatScreen/` | Covered by Crisis path (keyword hook on its input); otherwise out of scope because it is human customer support, not a CBT surface |
| 32 | Happy scene modal (tap Happi on Home) | `src/components/ui/happy-scene/HappySceneModal.tsx` | Covered inside Home (Illustration row) |
| 33 | Level-up, daily-goal toast, XP gain animation | `src/components/Level/LevelUpCelebration.tsx`, `src/components/celebration/{DailyGoalToast,DailyGoalRing}.tsx`, `src/components/XP/XPGainAnimation.tsx` | Covered by Rewards disposition (deleted) |
| 34 | `DiscountInterceptModal` | not found in `src` or `app`; `pleading` is mapped only in `.agents/skills/panda-mascot-design/04-asset-catalog-and-screen-mapping.md`; unused `onboarding.paywall.discount.*` strings exist at `src/locales/en/onboarding.json:364` | Covered by Paywall and offers (strings deleted, never built) |
| 35 | Habits modal, calorie tracker, micronutrients, test charts | `app/tabs/screens/habits-modal/*`, `app/tabs/screens/(tracking)/{calorie-tracker,micronutrient-tracking,test-charts}.tsx` | Out of scope because they are nutrition/habit tools outside CBT practice and no Phase 1–5 finding targets them; tokens from Phase 5 still apply globally |
| 36 | Dev and model screens | `app/dev/celebration-test.tsx`, `app/tabs/screens/(settings)/{active-model,apple-intelligence,animated-symbols,course-exercises}.tsx` | Out of scope because they are developer or model-configuration screens not shown in production navigation |
| 37 | Starter path screen | `src/screens/StarterPathScreen/` (no route imports it; only `StarterPathNextActionCard` on Home is live) | Out of scope because it is not routed; its `onboarding.starter_path.boundary` scope string is reused in Settings > About |
| 38 | `+not-found`, `+html`, `modal.tsx` | `app/+not-found.tsx`, `app/+html.tsx`, `app/modal.tsx` | Out of scope because they are framework shells with no product copy |

## Findings

### F1. Verified crisis lines exist for 7 of 8 locales, with one gap and one limited-hours line
- Claim: Seven repo locales map to a verified national line (en-US 988, en-GB/IE 116 123, de 0800 1110111 / 116 123, fr 3114, es-ES 024, it 02 2327 2327, zh-CN 12356, pt-BR 188), while Arabic has no single line and Portugal's SOS Voz Amiga answers only 15:30–00:30.
- Evidence: [S1], [S3], [S4], [S5], [S6], [S7], [S8], [S9], [S10], [S2]
- Mechanism: A locale is a language, not a country; the wrong country's number fails at the moment it matters (P4-F16: 9% of 69 apps listed an erroneous number).
- So what for Happy: Crisis rows are chosen by the OS region setting, not the app language, from a bundled table re-verified every 90 days against [S2]; Arabic-language users get their region's line from [S2] plus the local emergency number; any line that is not 24/7 shows its hours on the row and is always paired with an emergency row.

### F2. Five review prompts fire at warm moments, which Apple's own guidance partly endorses
- Claim: `requestReview` runs on streak-modal close (`StreakDisplay.tsx:28-37`), 2.0 s after the exercise celebration (`ExerciseFlowRunner.tsx:71-78`), after the first journal save (`useJournalOperationsHandler.ts:111`) and on course-unit completion (`useJourneyRewardsController.ts:113`, `useCelebrationOrchestrator.ts:54`), while Apple suggests asking "when they complete a game level or a significant task".
- Evidence: [S12], [S11]
- Mechanism: An ask placed on an emotional high converts effort-based reciprocity into a rating (P1-F-dose4); Apple optimises rating yield, not user wellbeing.
- So what for Happy: All 5 call sites are deleted; one prompt remains, from Settings "Rate Happy on the App Store" (user-initiated) and from a neutral Insights open after ≥15 total entry days, ≥14 days between requests, never in a session with a low feeling word or the crisis sheet (P2-F9).

### F3. Points and streaks are attached to 6 therapeutic actions today
- Claim: XP or coins are awarded on mood log (`EmotionLogger.tsx:137-142`), onboarding thought catch (`ThoughtCatchMicroStep.tsx:50-54`), journal prompt (`JournalPromptRow.tsx:52` "Daily Reflection • +10 XP"), every exercise (`config.ts` `xp: 5–15`), course lessons (`lessonStats.ts:6` perfect bonus 5 XP) and the completion screen shows XP, streak, a daily-goal ring and a "Perfect week chest" (`LessonCompleteCelebration.tsx:203-249`).
- Evidence: [S12], [S13]
- Mechanism: Engagement-contingent expected rewards lower intrinsic motivation (P1-F6, d = -0.40) and a chest tap is a variable-reward hook (P1-F-dose1).
- So what for Happy: Every XP/coin award, the chest, the level modal and the shop are deleted (Rewards disposition section); verbal, specific feedback replaces them (Completion section).

### F4. Onboarding shows a fixed-time "analysis" and a forward-commitment CTA
- Claim: `BuildingJourneyStep` animates 4 tasks with fixed `durationMs` 800–1000 ms ("Analyzing your stress profile", "Optimizing your daily schedule") that do no processing, and `MilestoneCelebrationStep` ends with "LOCK IN DAY 1 STREAK" after "Day 1 Streak Ignited! 🔥".
- Evidence: [S12] (`src/screens/OnboardingScreen/constants.ts:431-434`, `steps/MilestoneCelebrationStep.tsx:76-108`)
- Mechanism: A fake progress state is the fake-effort pattern P1-F8 forbids; "lock in" is the commitment CTA P2-F3 bans.
- So what for Happy: Both steps are removed; onboarding runs welcome → motivation → thought catch → reminder → paywall, and any real course resolution shows "Setting up your first lesson…" only for its measured time, capped at 1500 ms added display (P2-F11).

### F5. A global floating assistant speaks as a second "I" over every absence zone
- Claim: `FloatingHappyAssistant` is mounted once at the root (`RootLayoutNav.tsx:149`), draggable over every route, and greets "Hi, I'm Happy" in 6 contexts (`settings.json` `assistantUi.contexts`).
- Evidence: [S12], [S13]
- Mechanism: A root-mounted overlay cannot know it is on a paywall, free-text field or crisis sheet, so it breaks absence zones 1, 2 and 5 (P3-F7), and a first-person "I" voice contradicts Happi's no-"I" rule (P3 Voice).
- So what for Happy: Retire the floating button; its 5 actions already exist in the Home toolbar (capture), Settings (account, restore) and the Exercises tab.

### F6. Exercise copy carries claims and labels that fail AE1.7 and AP7.2
- Claim: Box breathing says "used by Navy SEALs" (`boxBreathing/config.ts:34`), 4-7-8 says "A powerful technique to calm your nervous system quickly" (`breathing478/config.ts:34`), onboarding names all-or-nothing thinking "Black or White" (`thoughtCatchData.ts:23`) and titles a solved item "Reframed reality" (`ThoughtCatchMicroStep.tsx:106`), and AI loaders name a persona "Reframing with Sage..." (`thoughtCatcher/config.ts`).
- Evidence: [S12]
- Mechanism: Authority and speed claims without a trial of this app are efficacy overclaims (AE1.7); renamed distortions break the accuracy users need to recognise them elsewhere (AP7.2); a named AI persona is a second character beside Happi (P3-F10).
- So what for Happy: Replacement strings are given per exercise section; AI loaders describe the task ("Writing 3 options from your evidence…") and run only during the real request.

### F7. Crisis detection must be on-device phrase matching that never blocks, because 12+ free-text fields already send text to a remote model
- Claim: At least 12 free-text inputs (journal keyboard, voice transcript, support chat, and the situation, thought, balanced-thought, evidence, worry, fear and ABC fields across 7 exercise configs) accept distress text, and 18 AI-assisted steps across 6 exercise configs build Gemini prompts from that text, opening with "You are a CBT therapist assistant" (e.g. `thoughtReframing/config.ts:128-304`), while no field checks for crisis language.
- Evidence: [S12], [S2], inference: a remote classifier would add a network dependency and a data-sharing step at the worst moment, and a model that reframes "I want to die" as a "balanced thought" is a clinical-accuracy failure (AP7.1), so the check has to run locally before any AI call.
- Mechanism: A local phrase list is deterministic, works offline, sends nothing, and can be reviewed line by line by a clinician; its false positives cost one dismissible sheet ("Keep writing"), its false negatives are covered by the always-visible "Get help" button.
- So what for Happy: The `### Crisis phrase matching` rules in the Crisis path section are the implementation: per-locale phrase files, normalisation, trigger timing, one auto-open per entry, AI call skipped on match, no text in analytics, 90-day review with a named clinical owner.

## Screen: Home

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | `JournalCalendarScreen.tsx:169-205`: header with name + flame pill + Happi (158 pt) → "Today's reflection" prompt card → 5-face mood row → starter path + continue journey | Order: greeting + Happi (≤35% height) → check-in (feeling words) → counter line → today's prompt card → continue journey; one primary action (check-in) | P4-F6, T:space-8 |
| Type | Name 42/48 pt ExtraBold, `numberOfLines={1}` + `adjustsFontSizeToFit` (`HomeHeader.tsx:65-72`); section labels 12 pt uppercase tracked (`JournalCalendarScreen.tsx:180`, `EmotionLogger.tsx:164`) | Greeting T:h1 28/34 wraps, no shrink-to-fit; section labels T:eyebrow 13/18 sentence case | T:h1 |
| Color | Flame `ORANGE.primary` on `bg-gold-tint` (`HomeHeader.tsx:80-85`); chevron `SAGE[500]` | Leaf icon in T:accent.text `#44633F`; counter `#142414`; no gold or orange | T:accent.text |
| Spacing | `px-6 pb-16 pt-8`, `mt-12` between sections | Gutter T:space-5 20 pt; sections T:space-8 32 pt | T:space-5 |
| Illustration / mascot | Raster `panda-happy` 158 pt in a sage circle, tappable → full-screen `HappySceneModal` (`HomeHeader.tsx:46-56`) | Vector rig (`HappiRig`) Neutral idle ≤295 pt; tap still opens HappySceneModal (user-initiated, no bubble); art hidden when "Show Happi" is off | P3-F10 |
| Motion | Mood count badge springs to 1.2 (`EmotionLogger.tsx:47-54`) | Chip select fill 150 ms ease-out; no count badge spring; counter cross-fade 200 ms | T:press |
| Haptics | Mood item `hapticStyle="light"` (`EmotionLogger.tsx:75`) | Feeling chip `selectionAsync()`; save `impactAsync(Soft)` once | P4-F9 |
| Copy (exact strings) | "How are you feeling?", "Terrible", "Bad", "Okay", "Good", "Great", "Day streak", fallback name "Friend" (`home.json:6-27`) | Check-in title "Which word fits right now?"; 12 chips "Calm", "Content", "Hopeful", "Grateful", "Okay", "Tired", "Restless", "Anxious", "Sad", "Angry", "Lonely", "Overwhelmed"; after a word: "{{word}}. Thanks for naming it."; after a low word (Anxious, Sad, Angry, Lonely, Overwhelmed): Happi "That sounds hard." then app "Want to try one small step, or just save this?" buttons "One small step" / "Just save"; no fallback name (greeting only) | P1-F10, P4-F6 |
| Accessibility | Mood items 54×66 pt; name truncates at large sizes | Chips 44 pt tall, ≥8 pt gaps, wrap to new rows at AX1–AX5; Happi art `accessibilityElementsHidden`; chip label "Sad, feeling word, selected" | T:touch-min |
| Ethics guard | `handleEmotionLogged` opens the streak modal after every log (`JournalCalendarScreen.tsx:111-117`); XP + coins on first log (`EmotionLogger.tsx:137-142`) | No modal after a log; no XP/coins; mood word never appears in pushes or widgets; surprise moments from the P4-F12 catalogue (seasonal scene ≤4/year, leaf held by Happi ≤1/14 days) obey ≤1 per 7 days per user, none in days 1–5, none on a low-word day, none in a crisis session, a type dismissed 2 times retires; Happi bubbles draw from one session budget (≤3 bubbles, ≤36 words; session ends after ≥30 min in background) stored in a single in-memory counter that every bubble call checks | P1-F6, P4-F12, P3-F13 |

## Screen: Return-after-absence

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | No return state; Home renders identically; insights nudge "It has been a few days · ready to pick back up?" (`common.json:63` `nudges.pickBackUp`) | First open ≥24 h after last foreground: Home with greeting line + one recall card; ≥30 days: same + two equal buttons + one dismissible card | P4-F15 |
| Type | n/a | Greeting T:body 17/24; recall quote T:quote SemiBold upright; date T:caption | T:quote |
| Color | n/a | Recall card surface `#FFFFFF`, quote `#142414`, date T:text.secondary `#6B6B6B` (4.97:1) | T:text.secondary |
| Spacing | n/a | Card padding T:space-4 16 pt; quote-to-date gap T:space-2 8 pt | T:space-4 |
| Illustration / mascot | n/a | Resting frame 0 → Welcome back one-shot ≤1800 ms, ≤1 per 24 h; never sad, thinner or "waiting" | P3-F8, P3-F9 |
| Motion | n/a | Greeting fade 300 ms ease-out; reduced motion: text present at load, Happi final frame | T:return |
| Haptics | n/a | None | P4-F9 |
| Copy (exact strings) | `nudges.pickBackUp` above; streak saver "You're on a {{count}}-day streak…" (`home.json:74-77`) | Line 1 (Happi bubble if mounted, else app line): "Good to see you."; recall on: "From your note on {{date}}: '{{quote}}'" + link "Why am I seeing this?"; recall off: "Last time you practised: {{exercise}}."; ≥30 days: buttons "Pick up where you left off" / "Start with a short check-in", link "Change reminders", card "Happy helps you practise CBT skills. It isn't therapy and doesn't replace professional care." with "Show Happi" toggle and "Got it"; Monday or 1st: append "New week." / "New month." | P3-F9, P4-F15 |
| Accessibility | n/a | "Why am I seeing this?" hit area ≥44×44 pt; card wraps at AX5 without truncating the quote; VoiceOver: "You wrote: {{quote}}. From your note on {{long date}}." | P4-F3 |
| Ethics guard | n/a | Never names the gap, never a day count, never "missed"; low-tagged entries never recalled unless saved as a coping card; no catch-up list | P4-F4 |

## Screen: Streak and progress surfaces

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Home flame pill opens `StreakDisplay` modal on tap (`HomeHeader.tsx:74-101`); modal = flame graphic + 7-dot week + "Continue" (`StreakCelebration.tsx:53-66`); `WeeklyStreakWidget` exported but not rendered (only `Streak/index.ts`) | Home counter line "{{count}} days practised this month" + "Hide counter"; tap opens a Progress sheet (total entry days, words written); milestone modal only on total entry day 7 and 15, once each; delete `WeeklyStreakWidget` | P1-F12, P2-F4 |
| Type | Count 18 pt ExtraBold + "Day streak" 13 pt | T:counter 28/32 Bold tabular in sheet; Home line T:body | T:counter |
| Color | Flame orange, gold tint; week dots `bg-brand-primary` | Leaf T:accent.text; progress fill `#5F7F58` on `#E5E5E5` (3.58:1) | T:accent.text |
| Spacing | `mt-6 min-h-11` pill | Counter line min 44 pt hit area; sheet padding T:space-4 | T:touch-min |
| Illustration / mascot | Flame + `StreakCelebrationFlame.tsx` | Day 7/15 modal: Happi Celebrating (low) ≤200 pt, lift 12 units, ≤900 ms; no flame anywhere | P3-F11 |
| Motion | CTA `withSpring(mass 0.6, stiffness 280, damping 20)` (`StreakCelebrationCopy.tsx:68-71`) | Modal 300 ms in / 220 ms out ease-out/ease-in; CTA no spring; reduced motion = final pose | T:celebration |
| Haptics | `impactAsync(Medium)` at 390 ms (`StreakCelebration.tsx:43-45`) | Day 7/15: `notificationAsync(Success)` once; elsewhere none | P5-F8 |
| Copy (exact strings) | "Day streak", "{{count}} day streak", "A new streak begins! Keep showing up each day to build your progress." (`home.json:65-73`); push "You're on a {{count}}-day streak. A short exercise today keeps the momentum going 🌿" (`home.json:74-77`) | "{{count}} days practised this month"; hidden: "Your entries are still here, counted quietly."; Day 7: "Seven days of practice. That's real."; Day 15: "Fifteen days of practice. That counts."; CTA "Continue"; text button "Hide counter"; streak-saver push strings deleted | P1-F-dose9, P2-F3 |
| Accessibility | a11y label "Current streak: {{count}} days. Tap to view streak history." | "{{count}} days practised this month. Opens progress." | T:touch-min |
| Ethics guard | `requestReview` on close at streak 3/7/15 (`StreakDisplay.tsx:21-37`); 8 PM streak-saver push with `sound: "default"` (`useStreakSaverNotification.ts:1-14, 79-91`) | Delete review call and `useStreakSaverNotification`; counter never shows 0 or a break; modal never after a low word or in a crisis session | P1-F-dose4, P6-F2 |

## Screen: Rewards, XP and coin shop disposition

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Routes `rewards-shop`, `xp-history`, `achievements`, `challenges` (`app/tabs/screens/(gamification)/`); providers `XPProvider` / `LevelProvider` / `RewardsProvider` wrap the app (`RootLayoutNav.tsx:131-161`) | Delete the 4 routes, `LevelUpCelebration`, `XPGainAnimation`, `DailyGoalToast`, `DailyGoalRing`, `CelebrationRewardCard`, `ChestRewardModal`, `CoinsBadge`, `ChallengesSection` and the 3 providers | P1-F6, P4-F8 |
| Type | Level names "Zen Master" … "Eternal Calm" (`common.json:53`) | Removed | P4-F8 |
| Color | Confetti `#FF6B6B #4ECDC4 #FFE66D …` (`LevelUpCelebration.tsx:33-40`); gold/bee/macaw tokens | Retired with the tokens in Phase 5 | T:counter |
| Spacing | n/a | n/a (deleted) | P4-F8 |
| Illustration / mascot | `proud` panda on chest open (`LessonCompleteCelebration.tsx:142`) | Removed with the chest | P3-F10 |
| Motion | 30 confetti pieces, springs to 1.3 (`LevelUpCelebration.tsx:70-94`) | Removed | P1-F-dose9 |
| Haptics | `notificationAsync(Success)` on every level-up (`LevelUpCelebration.tsx:83`) | Removed; Success reserved for Day 7/15 | P5-F8 |
| Copy (exact strings) | "Level up! 🎉", "Congratulations! You've reached level {{level}}.\nKeep up the great work!", "Perfect week. Tap to open your chest", "{{count}} XP to go" | Deleted; one-time Home card for existing users: "We removed points and levels. Your entries and cards are unchanged." with "Got it" | P6-F3 |
| Accessibility | Level modal dismiss by tapping backdrop only | n/a (deleted) | P4-F8 |
| Ethics guard | Coins earned per mood log; chest = random-feel reward on a 7/7 week | No currency anywhere; users with coins lose nothing that unlocked content (shop items were cosmetic) | P1-F-dose1 |

## Screen: Navigation / tab bar

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | 5 native tabs Home, Journal, Timeline, Journeys, Exercises (`app/tabs/(tabs)/_layout.tsx:62-108`) | Keep 5 tabs and order; no badge counts or dots on any tab | P2-F4 |
| Type | System tab labels | System labels; honour Dynamic Type large-content viewer on long-press | T:caption |
| Color | `tintColor` `SEMANTIC_COLORS.brand.primary` `#5F7F58` (`_layout.tsx:47`) | Active T:accent.text `#44633F` light / `#ABC0A2` dark; inactive `#6B6B6B` | T:accent.text |
| Spacing | System | System | T:touch-min |
| Illustration / mascot | None | None; Happi never in the tab bar | P3-F7 |
| Motion | System | System; no custom tab animation | P4-F11 |
| Haptics | None | None | P5-F8 |
| Copy (exact strings) | `common.navigation.*` | Unchanged labels "Home", "Journal", "Timeline", "Journeys", "Exercises" | P4-F1 |
| Accessibility | SF symbols with labels | Unchanged; selected state announced by system | T:touch-min |
| Ethics guard | `tab_switched` analytics with path (`_layout.tsx:23-43`) | Keep; analytics never include entry text or feeling words | P4-F17 |

## Screen: Exercise hub

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Header h1 32 pt "Exercises" + completed badge + coping-cards bookmark + segmented Lessons/My Log/Practice (`ExercisesTabHeader.tsx:54-96`); "Jump Back In" shelf; 4 category sections (`ExercisesScreen.tsx:124-131`) | Keep structure; jump-back-in shows ≤2 items; one primary per card ("Start"); Pro-gated cards show a lock icon + "Plus" text, never a countdown | P4-F13 |
| Type | h1 32/38 | T:h1 28/34; card titles T:h3 18/24; category labels T:eyebrow sentence case | T:h1 |
| Color | Hard-coded `#FFFFFF` bg (`ExercisesScreen.tsx:115`), `#FCFDFB` header, `#EEF2EC` border | Canvas `#FFFFFF`; divider T:border.decorative `#E5E5E5`; badge text `#29452A` on `#E5EDE1` (8.86:1) | T:text.primary |
| Spacing | `paddingHorizontal: 20`, `paddingTop: 16` | T:space-5 gutter; T:space-6 between cards | T:space-6 |
| Illustration / mascot | Exercise icons; no Happi | No Happi on the hub (CBT instruction surface) | P3-F7 |
| Motion | Circular reveal on log item (`ExercisesScreen.tsx:73-93`) | Replace circular reveal with screen push 280 ms; reduced motion 150 ms cross-fade | T:enter |
| Haptics | None on card press | None | P5-F8 |
| Copy (exact strings) | "Jump Back In", "{{count}} exercises completed", category "CBT Core" | "Pick up again", "{{count}} exercises done", "CBT basics"; subtitle per card stays from config after P6-F6 fixes | P4-F1 |
| Accessibility | Bookmark button 36×36 with `hitSlop={8}` (`ExercisesTabHeader.tsx:69-77`) | Visual 36 pt allowed, hit area ≥44 pt (hitSlop 4 each side minimum); label "My coping cards" | T:touch-min |
| Ethics guard | `requirePro("exercise")` on Pro cards (`ExercisesScreen.tsx:56-62`) | Pro gate never shown in a session that opened the crisis sheet or within the same session as a low feeling word; Thought Catcher and Grounding are never Pro-gated | P4-F16 |

## Screen: Exercise flow runner

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | `LessonScreen` with progress bar, close icon, primary + secondary buttons (`ExerciseFlowRunner.tsx:226-268`) | Keep; add a "Get help" text button in the header right on every step with a free-text field | P4-F16 |
| Type | Step titles from configs, title case ("Before We Start", "Reality Check") | All step titles sentence case T:h2 22/28; body T:body; instructional copy ≤20 words per sentence, grade ≤8 | T:h2 |
| Color | `config.backgroundColor` per exercise | Canvas `#FFFFFF` for all; primary T:brand.primary with white label (4.503:1) | T:brand.primary |
| Spacing | n/a | Instruction blocks: 12 pt after each paragraph; column ≤560 pt | T:content-max |
| Illustration / mascot | None in steps | None in steps (absence zone 3); Happi only on Completion | P3-F7 |
| Motion | `AnimatedStepContainer` per step | Step change: 280 ms push / 150 ms cross-fade under reduced motion | T:enter |
| Haptics | Step-level varies | Save: Soft once; no haptic on Next | P4-F9 |
| Copy (exact strings) | "Exercise complete!", "You showed up for yourself today." (`exercises.json` `flow.ui.celebrationTitle/Message`); exit "Exit exercise?" / "Your progress will be saved as a draft." | Exit dialog kept verbatim; celebration strings replaced by Completion; AI loaders: "Reading what you wrote…" (thought step), "Writing 3 options from your evidence…" (balanced thought), shown only while the request runs, ≤1500 ms added | P2-F11 |
| Accessibility | Progress bar visual only | Progress announced "Step {{n}} of {{total}}"; primary button grows with type, never truncates | T:button-label |
| Ethics guard | `requestReviewForMilestone("first_exercise_completed")` 2000 ms after celebration (`ExerciseFlowRunner.tsx:71-78`) | Delete; crisis phrase in any field skips the AI request for that step and opens the crisis sheet | P6-F2, P6-F7 |

## Screen: Thought Catcher

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | intro → situation → automatic thought → belief 0–10 → checkpoint → "Reality Check" Yes/Not Sure/No → balanced thought → belief after → summary (`thoughtCatcher/config.ts:59-330`) | Keep order; checkpoint shows the quoted thought card before the check | P2-F7 |
| Type | Slider labels "Not true / Partly / Completely" | Labels T:caption; value shown as T:body "{{n}} of 10", not a large number | T:body |
| Color | Slider default | Track `#E5E5E5`, fill `#5F7F58` (3.58:1) | T:brand.primary |
| Spacing | `composerMinHeight: 100` | Composer min 100 pt kept; T:space-4 around reference quote | T:space-4 |
| Illustration / mascot | None | None (instruction + free text) | P3-F7 |
| Motion | Default | T:enter for steps | T:enter |
| Haptics | Choice autoAdvance | Selection tick only | P4-F9 |
| Copy (exact strings) | "Reality Check" / "Is this thought actually true?"; loaders "Finding relatable situations...", "Listening to your thoughts...", "Reframing with Sage..." | "Check the thought" / "Hard thoughts can feel true. Let's check this one."; loaders "Finding example situations…", "Reading what you wrote…", "Writing 3 options…"; summary keeps "The thought feels stronger right now. Looking at it still counts." | P2-F7, P6-F6 |
| Accessibility | Slider has no spoken value label | Slider adjustable via VoiceOver in steps of 1, value "{{n}} of 10, {{label}}"; composer grows at AX5 with no clipped tip text | T:touch-min |
| Ethics guard | AI prompt "You are a CBT therapist assistant" sends raw text | Crisis phrase skips AI; no XP; draft on exit never labelled "incomplete" | P1-F9 |

## Screen: Reframe

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | situation → thought → belief → emotions → distortions → evidence for → against → balanced → re-evaluate → summary (`thoughtReframing/config.ts:99-341`) | Keep; after emotions insert one validation line above the distortion step | P2-F7 |
| Type | Emotion chips with emoji (`emotions.ts:12-21`) | T:chip 13/18 Bold, no emoji | T:chip |
| Color | Per-emotion colors incl. `#E53935` angry, `#E85D04` anxious | Neutral chips; selected T:selection.border `#5F7F58` + check icon | T:selection.border |
| Spacing | n/a | Chip gap T:space-2 8 pt | T:space-2 |
| Illustration / mascot | None | None | P3-F7 |
| Motion | Default | T:press for chips | T:press |
| Haptics | Selection | Selection tick | P4-F9 |
| Copy (exact strings) | "How did it make you feel?", "Notice the thought pattern", "Write a balanced thought" / "Aim for something fair and believable, not forced positive." | Validation line: "{{emotion}} makes sense after that. Now look at the thought."; distortion names unchanged (accurate list of 10); balanced-thought subtitle kept verbatim | P2-F7, P4-F1 |
| Accessibility | Chips | Chip label "{{emotion}}, selected, 2 of 3" | T:touch-min |
| Ethics guard | "Hopeless" chip has no follow-up | Selecting "Hopeless" shows inline link "Get help now" under the chips (non-blocking) | P4-F16 |

## Screen: ABC Analysis

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | intensity before → A event → B belief → C emotion → C behaviour → alternative belief → new consequence → intensity after → summary (`abcAnalysis/config.ts:44-213`) | Keep; label steps "A · What happened", "B · The thought", "C · What followed" | P1-F17 |
| Type | Titles "What happened?", "Automatic thought" | T:h2 sentence case | T:h2 |
| Color | n/a | Emotion chips as Reframe | T:selection.border |
| Spacing | n/a | T:space-3 between tip and field | T:space-3 |
| Illustration / mascot | None | None | P3-F7 |
| Motion | Default | T:enter | T:enter |
| Haptics | Selection | Selection | P4-F9 |
| Copy (exact strings) | "Write what a camera could have seen or heard.", "Do not make it fair yet. Just catch it." | Kept verbatim (accurate, ≤12 words) | P1-F17 |
| Accessibility | Selected count "{{count}}/{{max}} selected" | Kept; announced on change | T:touch-min |
| Ethics guard | No XP removal | `xp: 15` removed from config; crisis phrase hook on A, B, C fields | P1-F6 |

## Screen: Gratitude Reframe

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | intro → "Current Mood" → intensity → prompt → items (`gratitudeReframe/config.ts:59-148`) | After a low mood word, insert a choice screen with two equal buttons | P1-F11 |
| Type | Title case titles | Sentence case T:h2 | T:h2 |
| Color | n/a | Neutral chips | T:selection.border |
| Spacing | n/a | T:space-4 | T:space-4 |
| Illustration / mascot | None | None | P3-F7 |
| Motion | Default | T:enter | T:enter |
| Haptics | Selection | Selection | P4-F9 |
| Copy (exact strings) | "Shift your focus toward what's good in your life." | "Notice small things that helped today."; low-mood screen: "That sounds hard. Gratitude can sit beside it, not replace it." buttons "Keep going" / "Try Thought Catcher" | P4-F1 |
| Accessibility | n/a | Buttons equal size, both ≥44 pt | T:touch-min |
| Ethics guard | Prompts can read as "think positive" on a low day | Never says "look on the bright side"; no XP | P1-F6 |

## Screen: Decatastrophizing

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | anxiety before → fear → probability → coping plan → most likely → summary (`decatastrophizing/config.ts:50-142`) | Keep | P1-F17 |
| Type | "Before We Start", "The Fear" | "Before you start", "The fear" | T:h2 |
| Color | n/a | Slider fill sage | T:brand.primary |
| Spacing | n/a | T:space-4 | T:space-4 |
| Illustration / mascot | None | None | P3-F7 |
| Motion | Default | T:enter | T:enter |
| Haptics | n/a | None on slider drag | P5-F8 |
| Copy (exact strings) | "What catastrophe are you imagining?", "Realistically, how likely is this?" | "What's the worst outcome your mind predicts?"; probability kept | P1-F17 |
| Accessibility | Slider | Adjustable, value spoken as "{{n}} percent" | T:touch-min |
| Ethics guard | Free text about worst outcomes | Crisis phrase hook; AI suggestions skipped on match | P6-F7 |

## Screen: Worry Decision Tree

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | rating → worry → "Can You Act?" → plan → schedule or acceptance (`worryDecisionTree/config.ts:38-139`) | Keep branches | P1-F17 |
| Type | Title case | Sentence case | T:h2 |
| Color | n/a | Choice cards neutral, selected sage border | T:selection.border |
| Spacing | n/a | T:space-4 | T:space-4 |
| Illustration / mascot | None | None | P3-F7 |
| Motion | Default | T:enter | T:enter |
| Haptics | n/a | Selection | P4-F9 |
| Copy (exact strings) | "Act on it or accept it · decide and move on" | "Act on it, or let it be for now."; schedule step: "When will you do it?" | P4-F1 |
| Accessibility | n/a | Time picker native | T:touch-min |
| Ethics guard | Scheduling creates a reminder? | Any scheduled action reminder is opt-in and its push shows only "A planned step is due." (no worry text) | P4-F4 |

## Screen: Overthinking exercises

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Detached mindfulness: rating → notice → label → shift attention (`detachedMindfulness/config.ts:38-121`); ATT: rating → sound 1–3 countdowns 30 s each (`attentionTraining/config.ts:36-101`) | Keep | P1-F17 |
| Type | "Strengthen your attentional control (Wells ATT)" | Kept with attribution | T:body |
| Color | n/a | Countdown ring sage on `#E5E5E5` | T:brand.primary |
| Spacing | n/a | T:space-8 around timer | T:space-8 |
| Illustration / mascot | None | None | P3-F7 |
| Motion | Countdown ring | Linear ring; reduced motion: numeric countdown text only | T:loop |
| Haptics | n/a | None at phase ends unless "Breath cue" haptics opted in | P4-F9 |
| Copy (exact strings) | "How loud are your thoughts right now?" | Kept; "Before We Start" → "Before you start" | P4-F1 |
| Accessibility | Timer | Remaining time announced every 10 s only if VoiceOver on | T:touch-min |
| Ethics guard | XP 10–12 | Removed | P1-F6 |

## Screen: Mindfulness exercises

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | rating → timer → rating → summary for box, 4-7-8, 1-min; grounding 5-4-3-2-1 text steps; PMR circular timer (`boxBreathing/config.ts:31-109`, `breathing478/config.ts:31-108`, `grounding54321/config.ts:35-124`, `bodyScanPMR/config.ts:32-140`) | Keep; grounding is reachable from the crisis sheet with no rating step and no Pro gate | P4-F16 |
| Type | "Breathing complete!", "Body released!" | T:h2 sentence case, no "!" | T:h2 |
| Color | n/a | Breath circle `#5F7F58` fill on `#F7F7F7` | T:brand.primary |
| Spacing | n/a | Circle centered, ≥32 pt from text | T:space-8 |
| Illustration / mascot | None | Optional Happi breathing pose only on box/4-7-8 intro, ≤120 pt | P3-F10 |
| Motion | Breathing animation | Circle 0.9→1.0 over 4000 ms ease-in-out; reduced motion static circle + "Breathe in / Breathe out" + 4 s counter | T:loop |
| Haptics | n/a | Soft per phase only if opted in | P4-F9 |
| Copy (exact strings) | "A calming 4-4-4-4 breathing pattern used by Navy SEALs.", "A powerful technique to calm your nervous system quickly." | "A slow 4-4-4-4 pattern: in, hold, out, hold."; "Breathe in for 4, hold for 7, out for 8."; "Breathing done."; "Scan done." | P6-F6 |
| Accessibility | n/a | Phase text always present; never animation alone | P5-F10 |
| Ethics guard | XP 5–12 | Removed; no "calmer" score claim | P1-F6 |

## Screen: Behavioral Activation

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Not implemented (no `ExerciseType`); exploration `.agents/behavioral-activation.html` | When built: pick 1 small activity → schedule → after: rate mood before/after with words | P1-F13 |
| Type | n/a | Same as runner | T:body |
| Color | n/a | Same as runner | T:brand.primary |
| Spacing | n/a | Same as runner | T:space-4 |
| Illustration / mascot | n/a | None in steps | P3-F7 |
| Motion | n/a | T:enter | T:enter |
| Haptics | n/a | Soft on save | P4-F9 |
| Copy (exact strings) | n/a | "Pick one small thing you could do today."; examples "Step outside for 5 minutes", "Text one person"; after: "You did it, even if it felt small." | P1-F-dose2 |
| Accessibility | n/a | Same as runner | T:touch-min |
| Ethics guard | n/a | No streak of activities; skipping a planned activity shows "Plans change. Want to pick a new time?" | P1-F15 |

## Screen: Fear Ladder

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Not implemented; label `copingCards.exerciseTypes.fear_ladder` (`exercises.json`), exploration `.agents/fear-ladder.html` | When built: list 5–10 steps, rate each 0–100 distress, start at the lowest | P1-F17 |
| Type | n/a | Ratings T:body tabular | T:body |
| Color | n/a | Ratings never red→green; neutral bar | P5-F6 |
| Spacing | n/a | T:space-3 between rungs | T:space-3 |
| Illustration / mascot | n/a | None | P3-F7 |
| Motion | n/a | No celebration per rung | P1-F-dose9 |
| Haptics | n/a | None | P5-F8 |
| Copy (exact strings) | n/a | "Go at your own pace. You can stop at any step."; after a rung: "You stayed with step {{n}}." | P1-F15 |
| Accessibility | n/a | Reorder by buttons, not drag only | T:touch-min |
| Ethics guard | n/a | Never Pro-gated mid-ladder; no timers that pressure staying | P1-F-dose7 |

## Screen: Coping Cards

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Active/Archived segmented list, star, archive (undo toast), delete (`CopingCardsScreen.tsx:87-264`) | Keep; delete gets the same 5 s undo toast as archive | P4-F4 |
| Type | Card text | Card quote T:quote; source T:caption | T:quote |
| Color | n/a | Card `#FFFFFF`, border decorative | T:border.decorative |
| Spacing | n/a | T:space-6 between cards | T:space-6 |
| Illustration / mascot | Empty: `panda-coping-card` 130 pt | Empty only, ≤120 pt | P3-F10 |
| Motion | Default list | Removal 200 ms fade | T:enter |
| Haptics | Delete `impactAsync(Heavy)` (`CopingCardsScreen.tsx:89`) | None on delete; selection on star | P4-F9 |
| Copy (exact strings) | "Failed to load your coping cards", "Card archived" | "We couldn't load your cards. They're still saved."; "Card archived" kept; delete toast "Card deleted" + "Undo" | P4-F14 |
| Accessibility | Swipe actions | Actions also available via VoiceOver custom actions | T:touch-min |
| Ethics guard | n/a | Cards are the only home-recall source besides chosen words; deleting a card removes it from recall | P4-F4 |

## Screen: Completion

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Full-screen modal: mute button, panda + title + message, XP/streak/daily-goal stats, perfect-week chest, share card (`LessonCompleteCelebration.tsx:144-249`) | Single screen: Happi Quiet pride (≤160 pt) → line 1 → quote card → specific line → one optional next step + "Done" | P4-F5 |
| Type | Title large, stats | Line 1 T:h2; quote T:quote; date T:caption | T:quote |
| Color | Gold badge `#FFFDF0/#FDE68A/#92400E`, orange milestone `#FFEDD5`, glow `#FFE89C` (`:104-113`) | `#142414` on `#FFFFFF`; quote card `#F8FBF6`; no gold/orange | T:happi.bubble |
| Spacing | n/a | Happi → line 1 T:space-3; card padding T:space-4; CTA T:space-12 above | T:space-12 |
| Illustration / mascot | `proud`/`happy` raster variants, glow | Vector Happi Quiet pride ≤600 ms; hidden when Show Happi off | P3-F5 |
| Motion | XP count-up, ring fill, chest | Quote card rise 8 pt + fade 300 ms; reduced motion final frame | T:enter |
| Haptics | Multiple | `impactAsync(Soft)` once | P4-F9 |
| Copy (exact strings) | "Lesson complete!", "Perfect lesson!", "Daily goal reached. Beautiful.", "You're building a calmer you.", "Not a single slip. That's mastery." | "Saved. It's yours." (Happi says it if mounted and ≤2 bubbles used; then app line is "Today, {{time}}"); quote "You wrote: '{{≤8 words}}'"; specific line per type: Thought Catcher "You named the thought and tested it.", Reframe "You weighed the evidence and wrote a fairer thought.", ABC "You linked the moment, the thought and what followed.", breathing "You finished this one."; next step "Breathe for 30 s" / "Done"; once per 7 days of use the next step is "Is there someone you could tell about this?" | P4-F5, P1-F18 |
| Accessibility | Mute button, share | VoiceOver order: line 1, quote, line, buttons; Happi hidden | P3-F7 |
| Ethics guard | Review prompt at 2000 ms; share card; sound on by default | No ask, no share, no sound; no surprise moment on a low-word day | P6-F2 |

## Screen: Onboarding

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | 7 steps: welcome, quiz_motivation, building_journey, thought_catch_micro, milestone_celebration, notification_permission, soft_paywall (`OnboardingScreen/constants.ts:16-97`) | 5 steps: welcome, quiz_motivation, thought_catch_micro, reminder, soft_paywall | P6-F4 |
| Type | Step labels 11 pt uppercase (`QuizMotivationStep.tsx:55`, `ThoughtCatchMicroStep.tsx:96`, `NotificationPermissionStep.tsx:99-101`) | T:eyebrow sentence case; titles T:h1 | T:eyebrow |
| Color | Reminder slot tints `#D97706 #0284C7 #4F46E5` (`NotificationPermissionStep.tsx:30-32`) | Sage accents only | T:accent.text |
| Spacing | `px-5`/`px-6` mixed | T:space-5 | T:space-5 |
| Illustration / mascot | `analyst`/`high_five` (building), `pondering` + video (thought catch), `bell` with bubble (reminders) | `pondering` on thought catch only; no Happi on reminder (OS permission pre-prompt zone 6) or paywall (zone 5) | P3-F7 |
| Motion | Progress spring `damping 18, stiffness 90` (`BuildingJourneyStep.tsx:61-64`) | Removed with the step; FadeIn ≤200 ms kept | T:enter |
| Haptics | `notificationAsync(Success)` at loader end and on "lock in"; Medium on distortion choice | None; selection on choice | P5-F8 |
| Copy (exact strings) | "LET'S BEGIN"; "What brings you here, friend?"; "Lesson 1 · 30s micro-win"; "Reframed reality"; "When you name the trap, the thought loses its grip."; "Black or White"; "Day 1 Streak Ignited! 🔥"; "LOCK IN DAY 1 STREAK"; "Members with reminders are 3x more likely to keep their daily streak." | "Let's begin"; "What brings you here?"; "Lesson 1 · about 30 seconds"; "Thought caught"; "Naming the pattern makes it easier to question."; "All-or-nothing thinking"; reminder title "Want one reminder?" body "One reminder, at a time you pick. You can change it anytime." slots "Morning", "Midday", "Evening", skip "Not now"; welcome caption "Happy helps you practise CBT skills. It isn't therapy and doesn't replace professional care." | P4-F2, P6-F6 |
| Accessibility | Distortion cards 72 pt | Kept ≥44 pt; video replaced by poster frame under reduced motion | P5-F10 |
| Ethics guard | +10 XP on any distortion (`ThoughtCatchMicroStep.tsx:50-54`); every option accepted as correct; no age statement | No XP; each scenario has a best-fit id; other picks show "Close. This one fits a bit better: {{label}}."; audience stated as adults 18+ (Phase 1 assumption) in the store listing and Terms, with no Happi copy or art aimed at children; welcome offers a "Who is Happi?" text button that opens the P3-F4 backstory sheet once | P1-F6, P2-F7, P3-F4 |

## Screen: Journal capture and entry

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Journal tab calendar + entries + habits (`DailyNotesScreen.tsx`); capture screen with prompts; keyboard/voice editors; analysis loader (`EmotionAnalysisLoadingScreen.tsx`) | Keep; add "Get help" text button in the editor header | P4-F16 |
| Type | n/a | Editor body T:body; prompt T:h3 | T:body |
| Color | n/a | Editor `#FFFFFF`, placeholder `#6B6B6B` | T:text.secondary |
| Spacing | n/a | Editor inset T:space-5 | T:space-5 |
| Illustration / mascot | Analysis loader shows "Reflecting panda" | Loader: Happi Thinking only during real transcription/AI; editor: Happi unmounted while keyboard open | P3-F7, P2-F11 |
| Motion | Loader pulse 2200 ms | Thinking saccades every 700 ms; reduced motion still pose | T:loop |
| Haptics | n/a | Soft on save | P4-F9 |
| Copy (exact strings) | "Daily Reflection • +10 XP" (`JournalPromptRow.tsx:52`); "Generating CBT insights" | "Daily reflection"; loader steps kept except "Generating CBT insights" → "Finding patterns in your words"; save line "Saved. It's yours." | P4-F2 |
| Accessibility | n/a | Editor supports AX5 without clipping | T:body |
| Ethics guard | `requestReviewForMilestone("first_journal_saved")` (`useJournalOperationsHandler.ts:111`) | Delete; crisis phrase hook on text and on voice transcript | P6-F2, P6-F7 |

## Screen: Journeys and course lessons

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Duolingo-style node path, chest reward modal, node completion modal (`src/domains/journey/ui/components/`) | Keep path; remove chest nodes and chest modal; node completion = Completion pattern | P2-F3 |
| Type | Node labels | T:h3 / T:caption | T:h3 |
| Color | Node colors | Completed sage, current sage outline, locked `#AFAFAF` disabled + lock icon | T:selection.border |
| Spacing | n/a | Unchanged path spacing | T:space-6 |
| Illustration / mascot | `MascotBubble` on map with "tapForEncouragement" | Happi on map without bubble; tapping Happi does nothing; ≤3 bubbles/session cap applies | P3-F13 |
| Motion | Node animations | Node press T:press; no bouncing current node loop (idle on chrome forbidden) | P5-F5 |
| Haptics | n/a | Selection on node press | P4-F9 |
| Copy (exact strings) | "PERFECT LESSON", perfect bonus | Removed; "Lesson done." | P2-F8 |
| Accessibility | n/a | Nodes ≥44 pt; locked node label "Locked, part of Happy Plus" | T:touch-min |
| Ethics guard | Review prompt on unit completion (`useJourneyRewardsController.ts:113`, `useCelebrationOrchestrator.ts:54`) | Delete | P6-F2 |

## Screen: Insights and Practice

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Practice score, best tools, thinking traps, Therapist's Notebook locked card (`TherapistNotebookCard.tsx:47-139`) | Keep pattern cards; remove "Practice score"; notebook unlocked for the user's own data | P2-F13 |
| Type | "TODAY'S SCORE" uppercase | Sentence case | T:eyebrow |
| Color | Mood colors red→green (`constants/moodColors.ts`) | New mood marks `#5B7DB8 #8A72B8 #8C8A7A #3E9A8A #C07A2C`, always with word + icon | T:mood mark |
| Spacing | n/a | T:space-6 | T:space-6 |
| Illustration / mascot | n/a | None (numeric rows, zone 4) | P3-F7 |
| Motion | Chart animations | Charts draw ≤300 ms; reduced motion static | T:enter |
| Haptics | n/a | None | P5-F8 |
| Copy (exact strings) | "Unlock to see what patterns a therapist would notice across your sessions.", "Core belief detected", "Consistency is the #1 predictor of progress.", "{{count}}-day streak! You are building a real habit.", "you are on a roll.", "That's real dedication to your mental health." | "Patterns get clearer with more entries. Here is what {{count}} show."; "A belief that came up often"; "Practice helps many people. Effects differ."; "{{count}} days with Happy this month."; "{{count}} exercises this week."; "{{count}} exercises done." | P4-F2 |
| Accessibility | Charts | Each chart has a text summary row | P5-F6 |
| Ethics guard | AI disclaimer "Not a clinical assessment." exists | Keep disclaimer on every AI card; no "therapist" framing | P1-F-dose3 |

## Screen: Timeline

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Days / Weeks / Months tabs with AI insight cards (`timelines.tsx:79-138`) | Keep | P4-F3 |
| Type | n/a | T:body | T:body |
| Color | Mood colors | New mood marks + words | T:mood mark |
| Spacing | n/a | T:space-4 | T:space-4 |
| Illustration / mascot | n/a | None | P3-F7 |
| Motion | n/a | T:enter | T:enter |
| Haptics | n/a | Selection on tab change | P4-F9 |
| Copy (exact strings) | "View insight" | Each AI insight shows "Based on {{count}} entries from {{range}}" | P1-F19 |
| Accessibility | n/a | Mood marks never color only | P5-F6 |
| Ethics guard | n/a | Low-tagged entries shown only here and in Journal, never resurfaced on Home | P4-F4 |

## Screen: Empty states

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Journal: rotating titles + description (`EntryCardsView.tsx:97-98`); exercises: sprout panda + text, no action (`ExercisesTabEmptyStates.tsx:6-17`); timeline log: bubble panda + "Explore Exercises" (`ExerciseTimelineEmptyState.tsx:14-38`); coping cards: panda + sentence | One title, one sentence, one primary action each | P4-F13 |
| Type | Mixed h2/h3 sizes | Title T:h3, body T:body | T:h3 |
| Color | `text-ink-muted` `#AFAFAF` body (`ExerciseTimelineEmptyState.tsx:31`) | T:text.secondary `#6B6B6B` | T:text.secondary |
| Spacing | `py-16`/`py-20` | T:space-8 above and below | T:space-8 |
| Illustration / mascot | `panda-sprout` 60 pt, `panda-bubble` 96 pt, `panda-coping-card` 130 pt | Kept poses only (`journaling`, `bubble`, `coping_card`), ≤120 pt, Neutral idle, no bubble | P3-F10 |
| Motion | None | None | P5-F5 |
| Haptics | None | None | P5-F8 |
| Copy (exact strings) | "A space for your thoughts" / "Your completed reflections and exercises will live here." / "Explore Exercises"; "Start your first guided reflection" | Journal: "What's on your mind?" + "Private by default. Just start where you are." + "Write"; Exercises log: "Your exercises will show here." + "Start an exercise"; Coping cards kept | P4-F13 |
| Accessibility | n/a | Mascot hidden from VoiceOver | P3-F7 |
| Ethics guard | n/a | No "you haven't done anything yet" phrasing | P4-F13 |

## Screen: Crisis path

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | None (0 hits for 988, hotline, crisis, suicide in `src`/`app`) | Entry "Get help now" in Settings (Home → gear → row = 2 taps) and as a header text button on every free-text screen (1 tap); sheet: heading → hotline rows → emergency row → scope line → "Grounding exercise" → "Keep writing" | P4-F16, P6-F1 |
| Type | n/a | Heading T:h2; rows T:body-bold name + T:body number; full AX5 | T:body |
| Color | n/a | Call buttons T:crisis.action `#142414` fill, white label (16.25:1); no sage, no brand | T:crisis.action |
| Spacing | n/a | Rows 56 pt min; T:space-4 padding | T:touch-min |
| Illustration / mascot | n/a | No Happi; Happi unmounted for the rest of the session | P3-F12 |
| Motion | n/a | 0 ms in/out in every mode | T:crisis |
| Haptics | n/a | None, not configurable | P4-F9 |
| Copy (exact strings) | n/a | Heading "If you're thinking about hurting yourself, you deserve support now."; row "{{name}} · {{number}}" with "Call" / "Text"; "In danger right now? Call {{emergency}}."; "Happy isn't an emergency service. If you might act on these thoughts, call now."; "Grounding exercise"; "Keep writing"; "Not in {{country}}? Change country" | P4-F16, P3-F12 |
| Accessibility | n/a | VoiceOver reads heading then first row "{{name}}, {{number}}, call button" | T:touch-min |
| Ethics guard | n/a | No paywall, streak, milestone, surprise, review or sound in that session; analytics event `crisis_sheet_shown` with `{trigger: "button" or "phrase", locale}` only, never text | P4-F16 |

### Crisis phrase matching
- Files: one reviewed list per locale (`en`, `ar`, `de`, `es`, `fr`, `it`, `pt`, `zh`), each written by a native-speaking clinician from the same 14 concepts, never machine-translated (P6-F7, P4-F16).
- English list (phrases, not single words, to cut false positives): "kill myself", "end my life", "want to die", "wish I was dead", "better off dead", "better off without me", "suicide", "suicidal", "hurt myself", "self harm", "self-harm", "cut myself", "overdose", "no reason to live", "can't go on", "don't want to be here".
- Normalisation: lowercase; fold curly apostrophes to "'"; strip diacritics for Latin scripts; match on word boundaries for Latin and Arabic script, plain substring for Chinese (no word spaces).
- Trigger: on a 1500 ms typing pause, on save, and on a finished voice transcript; the sheet auto-opens at most once per entry; the "Get help" button always opens it.
- On match: the sheet opens non-blocking over the field; the text stays; any AI suggestion request for that step is cancelled and not retried for that entry; Happi unmounts for the session.
- Review: a named clinical owner re-reads every list and every phone number every 90 days; the date of the last review is shown in Settings > Get help now as "Numbers checked {{date}}".

### Locale resource table
Rows are chosen by `getLocales()[0].regionCode` from expo-localization (the OS region the user set), not by app language and not by location; the sheet always offers "Change country".

| Region | Line (verified 2026-11-03) | Hours shown | Source |
|---|---|---|---|
| US | 988 Suicide & Crisis Lifeline — call or text 988 | "24/7" | [S1] |
| GB, IE | Samaritans — 116 123 | "24/7" | [S3] |
| DE | TelefonSeelsorge — 0800 1110111, 0800 1110222, 116 123 | "24/7" | [S4] |
| FR | 3114 — Numéro national de prévention du suicide | "24/7" | [S5] |
| ES | Línea 024; emergencies 112 | "24/7" | [S6] |
| IT | Telefono Amico Italia — 02 2327 2327 | "24/7" | [S7] |
| BR | CVV — 188 | "24/7" | [S8] |
| PT | SOS Voz Amiga — 213 544 545 | "15:30–00:30" plus emergency row | [S9] |
| CN | 12356 全国统一心理援助热线 | as published by the line | [S10] |
| Any other region (all Arabic-speaking regions included) | Lines for that country from Find A Helpline's verified directory, bundled at build time | as listed | [S2] |

## Screen: Settings

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Promo card, post-trial banner, Preferences (daily goal, language, reminders, notifications), Account, Community, Legal, Account management (`SettingsScreen.tsx:120-260`) | Add top section "Your care": "Get help now", "About Happi", "Show Happi", "Sounds", "Haptics", "Memory", "Take a break"; remove DailyGoalPicker (XP goal) | P3-F14 |
| Type | n/a | Rows T:label 14/20 | T:label |
| Color | n/a | Switch on `#5F7F58`, off edge T:border.control `#8A918A` | T:border.control |
| Spacing | n/a | Row min 44 pt | T:touch-min |
| Illustration / mascot | None | None on Memory and delete screens (zone 8) | P3-F7 |
| Motion | n/a | System switch | P5-F5 |
| Haptics | `selectionAsync` on most rows | Kept; "Delete all data" final confirm `notificationAsync(Warning)` | P4-F9 |
| Copy (exact strings) | "Get notified when your journal streak is at risk"; "Max {{count}} notification per day. We use AI to find the best time to send you notifications based on your usage patterns." | Remove "Streak Reminders" and "Achievement Nudges" rows; limit copy "One reminder, at a time you pick. You can change it anytime."; "Show Happi" off toast "Done. You can turn Happi back on here."; "Sounds" default off; reminder push "A gentle check-in" / "Take a few minutes to notice what you are carrying." | P4-F17, P1-F-dose8 |
| Accessibility | n/a | Every switch has a label and state | T:touch-min |
| Ethics guard | `soundMutedAtom` default `false` (`soundStore.ts:20`) and `loadSoundMuted` returns `false` when unset (`soundStore.ts:27-35`) | Default `true` in both; no penalty copy on any off-switch; after 3 ignored reminders in a row reminders pause and the next open asks "Keep reminders?" with "Keep" / "Turn off" | P4-F10, P4-F6 |

### Settings rows and exact copy
- "Get help now" — opens the crisis sheet; subtitle "Numbers checked {{date}}" (P4-F16).
- "About Happi" — the 77-word backstory from P3-F4, verbatim, then the scope line "Happy helps you practise CBT skills. It isn't therapy and doesn't replace professional care.", then the existing boundary text `onboarding.starter_path.boundary` (P3-F4, P1-F-dose3).
- "Show Happi" — switch, default on; off toast "Done. You can turn Happi back on here." (P3-F14).
- "Sounds" — switch, default off; subtitle "Sounds never play when your phone is on silent." (P4-F10).
- "Haptics" — switch, default on; subtitle "Gentle taps when you save." (P5-F8).
- "Memory" — opt-in switch "Bring back things I saved", default off until the first coping card; list of recallable items, each with "Edit" and "Forget"; footer button "Forget all"; Forget removes recall only, entries stay (P4-F4, P1-F20).
- "Take a break" — pick 1–14 days; Home shows Happi Resting with "Resting counts too."; reminders pause; Thought Catcher and Get help stay reachable; ends with no message (P2-F6).
- "Rate Happy on the App Store" — kept as the only user-initiated rating entry (P6-F2).

## Screen: Paywall and offers

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | RevenueCat remote paywall, `gestureEnabled: false`, no `displayCloseButton` (`app/paywall.tsx:35-46`) | Pass `displayCloseButton: true`; allow swipe back | AP2.2 via P1-F-dose8 |
| Type | Remote | Remote config uses Nunito sizes from T:body | T:body |
| Color | Remote | Ink and sage only | T:brand.primary |
| Spacing | Remote | T:space-5 | T:space-5 |
| Illustration / mascot | Remote | No Happi (zone 5) | P3-F7 |
| Motion | Remote | No countdown or pulsing CTA | P5-F5 |
| Haptics | n/a | None | P5-F8 |
| Copy (exact strings) | Unused keys "Become someone who doesn't run from how they feel.", "3 in 4 sleep better by Day {{day}}", "💚 30-day full refund…" (`onboarding.json:359-363`); post-trial "Special Offer for You" | Delete unused keys; remote title "Keep learning with Happy."; no efficacy statistics; refund line without emoji | P4-F2 |
| Accessibility | Remote | Close button ≥44 pt | T:touch-min |
| Ethics guard | Paywall reachable anytime | Never presented in a crisis session or after a low feeling word in the same session | P4-F16 |

## Screen: Floating Happy Assistant

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Draggable floating button on every route (`RootLayoutNav.tsx:149`) | Removed | P6-F5 |
| Type | n/a | n/a | P6-F5 |
| Color | n/a | n/a | P6-F5 |
| Spacing | n/a | n/a | P6-F5 |
| Illustration / mascot | Floating Happy icon | Removed | P3-F7 |
| Motion | `useFloatingAssistantButtonMotion.ts` | Removed | P5-F5 |
| Haptics | n/a | n/a | P5-F8 |
| Copy (exact strings) | "Hi, I'm Happy", "Let's make journaling frictionless." | Removed | P6-F5 |
| Accessibility | n/a | n/a | P6-F5 |
| Ethics guard | Overlays crisis/paywall/free text | Removed | P6-F5 |

## Screen: Update modal

| Dimension | Current (file:line) | Change | Driven by |
|---|---|---|---|
| Layout | Bottom sheet 45% with two buttons (`UpdateModal.tsx:75-125`) | Keep | P4-F13 |
| Type | Cormorant heading 3xl | T:h2 Nunito | T:h2 |
| Color | Purple `#7B61FF` CTA, `#F6F4FF` | Sage CTA, neutral secondary | T:brand.primary |
| Spacing | n/a | T:space-4 | T:space-4 |
| Illustration / mascot | Sparkles icon | Keep icon, no Happi | P3-F7 |
| Motion | Sheet | 300 ms | T:enter |
| Haptics | Medium on update | None | P5-F8 |
| Copy (exact strings) | "Update Available", "A new version is available! Update now to get the latest features and improvements." | "Update available", "A new version is ready with fixes and new tools."; "Update" / "Later" | P4-F1 |
| Accessibility | n/a | Buttons ≥52 pt | T:button-height |
| Ethics guard | Auto-opens on Home | Never in a crisis session or after a low feeling word | P4-F16 |

## Build order

1. Crisis path — "Get help now" in Settings and editor headers, 8 per-locale phrase files, region-matched rows from the Locale resource table, sheet with 0 ms motion. Acceptance: unit test feeds each English phrase and 20 neutral sentences (e.g. "I could kill for a coffee") and expects all 16 phrases to match and 0 of the 20 neutral sentences to match; ≤2 taps from Home; sheet visible <100 ms after match; VoiceOver reads heading then first hotline; Happi not mounted for the rest of the session; paywall request in that session is a no-op.
2. Remove asks and pushes — 5 `requestReview` sites, streak-saver push, "3x"/"#1"/"AI timing" strings, streak and achievement notification toggles; sound default muted. Acceptance: grep finds 0 `requestReviewForMilestone` call sites outside Settings; fresh install plays no sound.
3. Completion screen — quote card, "Saved. It's yours.", one next step. Acceptance: no XP/streak text on completion; reduced motion shows final frame.
4. Home check-in — 12 feeling words, validation-first, leaf counter, modal only day 7/15. Acceptance: low word shows "That sounds hard." before any suggestion; no modal after a routine log.
5. Points disposition — delete XP, levels, coins, chest, shop, challenges and providers; one-time explanatory card. Acceptance: app builds with 0 imports of `XPContext`.
6. Onboarding — 5 steps, accurate distortion feedback, single reminder slot. Acceptance: no step shows a fixed-time loader; "LOCK IN" absent.
7. Happi presence — vector rig on Home/completion/empty, Show Happi toggle, floating assistant removed. Acceptance: VoiceOver reads Happi as decorative; Show Happi off removes all art and bubbles.
8. Return and memory — welcome-back, recall card, Settings > Memory. Acceptance: return copy contains no number of days.
9. Tokens and accessibility — Phase 5 color/type/motion/haptic tables. Acceptance: contrast unit test passes table ratios; AX5 shows no truncated instruction.
10. Exercise copy, accuracy and locales — P6-F6 strings, sentence case, AI loaders, then retranslation of every changed key into the 7 non-English locales. Acceptance: 0 "!" in exercise configs; 0 emoji in chips; every new English string at or under its tone-mode grade cap; 2 native readers per locale sign off ar and zh crisis and Happi lines.

## Measurement plan

| Slice | Metric | Guardrail |
|---|---|---|
| 1 Crisis path | Share of crisis-sheet opens that tap Call or Text | "Keep writing" rate after an auto-open >80% triggers phrase-list review (false positives); 0 analytics events containing entry text |
| 2 Asks removed | App Store rating count per 1,000 weekly users | Review mentions of "streak", "guilt", "pressure", "nag" do not rise; notification opt-out rate falls or holds |
| 3 Completion | Exercise completion → next-day return rate | Exit-before-completion rate does not rise |
| 4 Home check-in | Share of check-ins with a word chosen in ≤10 s | Share of low-word check-ins followed by "Just save" is tracked, not optimised |
| 5 Points removed | D7 and D30 retention | No rise in uninstalls within 7 days of release |
| 6 Onboarding | Onboarding completion rate | Reminder opt-in measured; no "3x" or commitment copy |
| 7 Happi | Share of users with Show Happi off | >30% off triggers a presence review |
| 8 Return | Return-visit D15/D30 | Recall "Forget" rate >20% triggers review |
| 9 Tokens | Accessibility-size user share retained at D7 | No contrast regression in unit test |
| 10 Copy | Support tickets about wrong distortion names | 0 efficacy claims in strings |

## Contradictions
- Apple suggests rating prompts "when they complete a game level or a significant task" [S11], while P1-F-dose4 forbids asks on completion screens. Decision: no prompt on any completion; one prompt from a neutral Insights open after ≥15 entry days with ≥14 days between requests, taking only Apple's frequency rule ("a week or two between requests").
- P4-F17 and AP6.3 forbid personalising from location, yet a crisis number is only correct for the user's country (P6-F1). Decision: read the OS region the user set (`regionCode`), never GPS or IP, keep the choice on the device, and always show "Change country", because a user-set region is given knowingly while a wrong hotline is the highest-harm failure (P4-F16).
- Phase 1, 3 and 4 fix the scope line as "Happy supports CBT practice. It isn't therapy or a replacement for professional care.", which measures grade 8.7 with the standard Flesch-Kincaid formula (script in $TMPDIR), above the AE2.9 cap of 8 for instructional copy. Decision: ship "Happy helps you practise CBT skills. It isn't therapy and doesn't replace professional care." (grade 5.7, same meaning, same two claims).
- P3-F4 says the backstory is "shown once in onboarding", while P6-F4 cuts onboarding to 5 steps to remove friction. Decision: the welcome step carries a "Who is Happi?" text button that opens the backstory sheet, and Settings > About Happi always shows it; reading it is offered, not forced.
- The existing Day-15 completion copy ("Fifteen days strong. This is who you are now.", `exercises.json` `flow.ui.celebration.milestoneMessage15`) makes an identity claim at a milestone, while P1-F-dose9 caps celebration register and P1-F22 sets low arousal. Decision: Day 15 says "Fifteen days of practice. That counts.", which counts practice and makes no identity claim.
- Most verified lines are 24/7 [S1], [S3], [S4], [S5], [S6], [S7], [S8], while Portugal's SOS Voz Amiga answers 15:30–00:30 only [S9]. Decision: show hours on every row that is not 24/7 and always pair it with the emergency row, rather than hide a line that is the best national option.

## Rejected ideas
- Keep XP for course lessons only — rejected because points on CBT learning are still engagement-contingent rewards (P1-F6).
- A full-screen blocking crisis modal — rejected because it removes the user's words and can feel punitive (P4 Rejected ideas); the sheet is non-blocking with "Keep writing".
- Keep the floating assistant but hide it on absence zones — rejected because a root overlay cannot see zone state reliably and its "Hi, I'm Happy" voice is a second first-person character (P6-F5, P3 Voice).
- A server-side AI classifier for crisis language — rejected because it sends distress text off the device at the worst moment and fails offline (P6-F7).
- A dedicated crisis tab in the tab bar — rejected because a permanent crisis icon on every screen frames daily practice around emergencies; 1 tap from every free-text screen and 2 taps from Home meet P4-F16.
- Keeping the onboarding "Building your journey" loader with real data behind it — rejected because course resolution is a keyword match over the course catalog (`courseResolver.ts`), not an analysis of the user, so a task list naming "Analyzing your stress profile" would still misdescribe the work; any real wait uses the 1500 ms rule instead (P1-F8, P2-F11).

## Critique (pass 1)
Spot-checked by reopening in this run: [S11] (HIG JSON re-read: "Ask for a rating only after people have demonstrated engagement" and "a week or two between requests" — matches P6-F2 and Contradiction 1), [S9] (SOS Voz Amiga page: "Diariamente das 15h30 às 00h30" — matches P6-F1 and the PT table row), [S4] (TelefonSeelsorge page: "0800 1110111", "116 123", "Tag und Nacht erreichbar" — matches the DE row).
- [FAIL] AE1.2 Pass-1 crisis section had no phrase list, normalisation, trigger timing, false-positive handling or per-region resource table, though the task requires both.
- [FAIL] RQ5.2 Pass-1 Summary and three tables cited "F7", which did not exist, and the machine check rejected 15 Driven-by cells that cited bare "F#" instead of "P6-F#".
- [FAIL] AE2.9 Pass-1 introduced about 60 new strings with no reading-level measurement; the shared scope line measured grade 8.7 when checked.
- [FAIL] AE1.6 Pass-1 Settings listed a "Memory" row with no edit, forget or opt-in behaviour.
- [FAIL] AE1.8 Pass-1 stated no audience age anywhere, while Happi stays cute.
- [FAIL] ED3.1 Pass-1 Home placed none of the P4-F12 surprise moments and repeated no frequency cap or decay rule.
- [FAIL] ED5.2 Pass-1 named the ≤3-bubble session cap but gave no mechanism that enforces it across Home, check-in, completion and return.
- [FAIL] ED6.2 Pass-1 said nothing about how about 60 new English strings and the crisis lists reach ar, de, es, fr, it, pt and zh.
- [FAIL] AP2.5 Pass-1 Settings kept a single reminder but dropped the back-off after 3 ignored reminders.
- [FAIL] RQ3.1 Pass-1 had 1 contradiction; the P3-F4 backstory placement, the location rule versus country-correct numbers, and the limited-hours Portuguese line were decided silently.
- [FAIL] RQ2.3 Pass-1 Thought Catcher rows held placeholders ("T:counter-free plain body", "AE2.6 is met via P3-F7") instead of targets.
- [PASS] RQ1.1 every Claim has Evidence with [S#] or inference.
- [PASS] RQ1.3 0 of 6 pass-1 evidence lines were inference-only.
- [PASS] RQ1.4 11 verified non-internal sources opened in this run.
- [PASS] RQ1.5 every external source was opened via WebFetch in this run; 12356 found by WebSearch and then opened at news.cn.
- [PASS] RQ5.1 Summary states decisions, no options.
- [PASS] ED1.1 check-in reflects the chosen word, completion quotes ≤8 user words, Thought Catcher checkpoint quotes the caught thought.
- [PASS] ED1.2 validation precedes redirection on Home, Reframe and Gratitude Reframe.
- [PASS] ED1.3 no XP or praise on logging a low word.
- [PASS] ED2.1 no grading of feelings; "Practice score" removed.
- [PASS] ED2.2 outward line once per 7 days on Completion; Behavioral Activation examples point outward.
- [PASS] ED2.3 reminders, recall, sound, haptics and Happi are switchable with no penalty copy.
- [PASS] ED3.2 routine completion: Soft haptic, 300 ms card, no confetti.
- [PASS] ED3.3 Duolingo path, milestone and celebration each stated as turned down (chest removed, lift 12 units, no flame).
- [PASS] ED4.1 return shows one recalled item or the last exercise name.
- [PASS] ED4.2 return names no gap.
- [PASS] ED5.1 concern as gaze and lean only; no tears anywhere.
- [PASS] ED5.3 absence zones applied: editors, crisis, hub, steps, insights, paywall, reminder pre-prompt, Memory.
- [PASS] ED5.4 motion ease-out, no springs, reduced-motion stills on every animated row.
- [PASS] ED6.1 new strings pass the read-aloud test; "friend", "yay" and "!" removed.
- [PASS] AP1.1–AP1.4 no loss framing, paid repair, blame or decay.
- [PASS] AP2.1–AP2.4, AP2.6 no fake urgency, confirmshaming, variable reward, engagement goals, or paywall in distress or crisis.
- [PASS] AP3.1–AP3.4 Happi capped, absent from crisis and distress text, no clinical instruction.
- [PASS] AP4.1–AP4.3 infantilising, toxic-positivity and should-statement strings replaced ("This is who you are now.", "you are on a roll.").
- [PASS] AP5.1–AP5.3 confetti removed; idle node bounce removed; surprise decays.
- [PASS] AP6.1–AP6.3 recall only from saved items with source; no mood in pushes; no location inference.
- [PASS] AP7.1–AP7.3 distortion names restored; "powerful", "Navy SEALs" and "3x" claims removed.
- [PASS] AP8.1–AP8.4 contrast, targets, reduced motion and color-plus-word rules carried from Phase 5.
- [PASS] AE1.1 every adopted mechanism keeps its Phase 1/4 guard; new mechanisms (phrase match, region read) name their harm and guard.
- [PASS] AE1.3 scope line on welcome, About Happi, crisis sheet and 30-day return.
- [PASS] AE1.4 every reminder, recall, sound, haptic and Happi switch is opt-in or one-tap off.
- [PASS] AE1.5 outward line and no exclusivity copy.
- [PASS] AE1.7 efficacy claims removed; Insights keeps "Not a clinical assessment."
- [PASS] AE2.1 ratios taken from Phase 5 tables (e.g. crisis label 16.25:1).
- [PASS] AE2.2 hit areas ≥44 pt named where visuals are smaller.
- [PASS] AE2.3 AX5 wrapping stated for greeting, chips, recall, composer, crisis rows.
- [PASS] AE2.4 reduced-motion fallback on every animated row.
- [PASS] AE2.5 no flashing; seasonal particles ≤1 cycle per 2 s from Phase 5.
- [PASS] AE2.6 Happi art decorative; bubbles read as text.
- [PASS] AE2.7 mood marks always with word and icon.
- [PASS] AE2.8 haptics and sound never carry meaning alone.

## Revisions
- Pass 2, AE1.2: added `### Crisis phrase matching` (16 English phrases, normalisation per script, 1500 ms pause trigger, one auto-open per entry, AI call cancelled, 90-day clinical review) and `### Locale resource table` (10 rows, 9 sourced lines plus the Find A Helpline fallback) inside the Crisis path section; build slice 1 gained a 16-match / 0-false-match unit test.
- Pass 2, RQ5.2: added finding P6-F7 and rewrote every bare "F#" reference as "P6-F#".
- Pass 2, AE2.9: measured 23 new strings with a Flesch-Kincaid script in $TMPDIR (max 7.2 for the crisis heading, mean 2.0); replaced the 8.7 scope line with a 5.7 version (Contradiction 3); Summary item 8 makes the check a merge rule.
- Pass 2, AE1.6: Settings now lists the Memory switch, Edit, Forget and "Forget all", and states that Forget removes recall only.
- Pass 2, AE1.8: Onboarding ethics row states the 18+ audience assumption and that no Happi content targets children.
- Pass 2, ED3.1: Home ethics row now places the P4-F12 surprise moments with ≤1 per 7 days, none in days 1–5, none on a low-word or crisis day, and retirement after 2 dismissals.
- Pass 2, ED5.2: Home ethics row specifies one in-memory session bubble budget (≤3 bubbles, ≤36 words, reset after ≥30 min in background) checked by every bubble call.
- Pass 2, ED6.2: Summary item 8 and build slice 10 require English-first writing, retranslation of every changed key, clinician-written crisis lists and 2 native readers per locale for ar and zh.
- Pass 2, AP2.5: Settings ethics row restores the pause after 3 ignored reminders and the "Keep reminders?" ask.
- Pass 2, RQ3.1: Contradictions grew from 1 to 6 (region versus location, scope-line grade, backstory placement, Day 15 identity copy, limited-hours line).
- Pass 2, RQ2.3: Thought Catcher Type and Accessibility rows now name T:caption, T:body and the spoken slider value.
- Pass 2, other: Rejected ideas grew from 3 to 6; Settings gained `### Settings rows and exact copy` with About Happi, Sounds, Haptics and Take a break strings.

## Self-critique
- Weakest part: the crisis phrase list is an English seed written from general safe-messaging knowledge, not from a validated lexicon; its false-positive and false-negative rates are unknown until the slice-1 test set and real use, and 7 locale lists do not exist yet. The `Current (file:line)` column for remote-configured surfaces (RevenueCat paywall) and the Journeys map cites folders, not lines, because their copy lives outside the repo or across 51 engines.
- Second weakness: 29 screen sections share many rows that only restate Phase 5 tokens; sections for the two unbuilt exercises (Behavioral Activation, Fear Ladder) are build-time rules, not changes to existing code, and the course-lesson engines were reviewed by folder and shared shell, not one by one.
- Third weakness: the measurement plan names metrics and guardrails but no baselines or sample sizes, so the first release cannot say whether D7 moved by chance.
- A further pass should: get a clinician to review the 16 English phrases and author the 7 other lists; pull current PostHog baselines for each metric; walk each of the 51 course-lesson engines for copy that grades the user ("PERFECT LESSON"-style strings); verify Arabic-region lines for Saudi Arabia, Egypt and the UAE in Find A Helpline and add them to the bundled table.

## Sources
- [S1] 988 Suicide & Crisis Lifeline. https://988lifeline.org/ — opened 2026-11-03 ("The 988 Lifeline is available 24/7/365. Your conversations are free and confidential."; call, text, chat)
- [S2] Find A Helpline (ThroughLine). https://findahelpline.com/ — opened 2026-11-03 ("We partner with verified helplines in 175+ countries"; helplines "verify their information with us directly")
- [S3] Samaritans — Contact a Samaritan. https://www.samaritans.org/how-we-can-help/contact-samaritan/ — opened 2026-11-03 ("Call 116 123"; "any time, day or night, 365 days a year")
- [S4] TelefonSeelsorge Deutschland. https://www.telefonseelsorge.de/ — opened 2026-11-03 ("0800 1110111", "0800 1110222", "116 123"; "Tag und Nacht erreichbar")
- [S5] 3114 — Numéro national de prévention du suicide. https://3114.fr/ — opened 2026-11-03 ("Le 3114 est accessible 24h/24 et 7j/7, gratuitement, en France entière")
- [S6] Ministerio de Sanidad — Línea 024. https://www.sanidad.gob.es/linea024/home.htm — opened 2026-11-03 ("gratuito, confidencial y disponible las 24 horas del día, los 365 días del año"; emergency referral to 112)
- [S7] Telefono Amico Italia. https://www.telefonoamico.it/ — opened 2026-11-03 ("02 2327 2327", "tutti i giorni 24 ore su 24")
- [S8] CVV — Centro de Valorização da Vida. https://cvv.org.br/ — opened 2026-11-03 ("LIGUE 188"; "24 horas por dia")
- [S9] SOS Voz Amiga. https://www.sosvozamiga.org/ — opened 2026-11-03 ("213 544 545"; "Diariamente das 15h30 às 00h30")
- [S10] Xinhua (2025-05-08). 12356 national psychological assistance hotline. https://www.news.cn/politics/20250508/b45e439c15bb4732858ad5c7640e9ba9/c.html — opened 2026-11-03 ("'12356'是全国统一心理援助热线电话号码"; all 31 provinces activated by 1 May 2025)
- [S11] Apple — Human Interface Guidelines: Ratings and reviews. https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews — opened 2026-11-03 via the HIG JSON endpoint ("Ask for a rating only after people have demonstrated engagement"; "Avoid interrupting people while they're performing a task"; "Consider allowing at least a week or two between requests")
- [S12] internal: code read 2026-11-03 — `src/components/Streak/*`, `src/screens/ExerciseFlowScreen/ExerciseFlowRunner.tsx`, `src/screens/JournalEntryScreen/hooks/useJournalOperationsHandler.ts`, `src/domains/journey/rewards/*`, `src/components/EmotionLogger.tsx`, `src/screens/OnboardingScreen/**`, `src/components/celebration/LessonCompleteCelebration.tsx`, `src/components/layout/RootLayoutNav.tsx`, `src/exercises/*/config.ts`
- [S13] internal: `src/locales/en/{home,common,exercises,onboarding,settings,journal,insights}.json`
