---
type: audit
topic: Current-state first-use audit — Happy onboarding, analytics, paywall boundary, progress mechanics
decision: Prerequisite for implementing onboarding-first-use-decision.md
status: complete
created: 2026-10-31
method: Static read-only code audit (three parallel lanes). Load-bearing claims spot-checked by hand (marked ✓). Nothing runtime-verified.
---

# Current-state first-use audit

Answers the "Required next artifact" in `onboarding-first-use-decision.md`: map every first-use screen to the belief it establishes, flag screens that establish none, verify analytics and privacy, and locate the real paywall boundary. Adds progress mechanics against the Q4 decision in `research-onboarding-competitive-teardown.md`.

## Summary

1. **Two must-fix items regardless of the redesign.** Raw journal and thought text is sent to PostHog on every Gemini call ✓, and the Gemini API key ships in the client bundle.
2. **The flow is short but the value chain breaks at Own → Remember.** Eight screens and roughly 30–60 seconds, with no typed input. The Thought Catcher is canned, accepts every answer as correct, and its result is never shown again.
3. **The paywall is the last onboarding step, before Home and before any saved artifact.** That matches the old Model A, not the accepted decision (paywall after Home arrival or the saved-artifact reveal).
4. **A streak pledge precedes value.** "LOCK IN DAY 1 STREAK" is the commitment ritual the research says to avoid, and the streak is the hero metric everywhere — opposite of the Q4 lifetime-count plus weekly-ring decision.
5. **Saved history is never locked, but writing is capped at 3 entries a day** ✓, which conflicts with "saved reflections always free."

## 1. First-use screen map

Routing: `app/index.tsx:84` sends a session to `onboard-container.tsx`, which sends incomplete users to `premium-onboarding.tsx:29`. Step order comes from `ONBOARDING_STEPS` in `src/screens/OnboardingScreen/constants.ts:16` ✓.

| # | Screen | file | User action | Belief it should establish | Establishes it? | Verdict |
|---|---|---|---|---|---|---|
| 0 | Entry / Begin | `app/index.tsx:88-108` | 1 tap; anonymous session created | "This is calm and easy to start" | Yes | Keep |
| 1 | welcome | `WelcomeStep.tsx` | 1 tap, same hero canvas as step 0 | Nothing new | **No** — duplicate of step 0 | **Cut** |
| 2 | quiz_motivation | `QuizMotivationStep.tsx` | 1 tap of 5 goals; sets active course | "Happy fits my need" (Route) | Yes — routes the course | Keep |
| 3 | building_journey | `BuildingJourneyStep.tsx`; `constants.ts:431-434` | 0 taps; ~3.5s of fake loading tasks ("Analyzing your stress profile") | "This is personalized for me" | **No** — personalization theatre; the stress question it reads is no longer asked | **Cut** |
| 4 | thought_catch_micro | `ThoughtCatchMicroStep.tsx`; `thoughtCatchData.ts:12-67` | 2 taps; pick 1 of 3 trap cards; +10 XP | "I understand the CBT move" (Understand/Participate) | **Partly** — canned; any answer shows "Trap identified"; anxiety answer key mislabeled (`mind_reading` id vs "Fortune Telling" label, lines 27-29) | **Redesign** as worked example → optional personal practice |
| 5 | milestone_celebration | `MilestoneCelebrationStep.tsx:50`; `OnboardingScreen.tsx:209-212` | 1 tap: "LOCK IN DAY 1 STREAK"; sets `pactSigned` | "I've committed" | **Wrong belief** — pledge before value; streak framing contradicts Q4 | **Replace** with save-and-recognize moment |
| 6 | notification_permission | `NotificationPermissionStep.tsx`; `utils/onboardingNotifications.ts:22-40` | 3 slots on by default; Set or Skip | "Happy will help me continue" | Partly — asked before a meaningful action exists; skip sends no event | **Move** after save, offer one slot, if-then framing |
| 7 | soft_paywall | `SoftPaywallStep.tsx:44-54` | RevenueCat template; close button | "Continuing is worth paying for" | **Premature** — no saved artifact, no Home seen | **Move** after Home arrival |
| — | Home first visit | `app/tabs/(tabs)/home/index.tsx:58` → `JournalCalendarScreen.tsx` | — | "My work is saved; I know what's next" (Recognize/Own/Continue) | **No** — saved Thought Catcher result is written to `@happy/onboarding_thought_catch` but never read; display name hard-coded `""` (`onboardingCompletion.ts:32`); next lesson depends on non-fatal enrollment | **Fix** — show artifact and next step |

Value-chain mapping (decision record's 9 stages): Orient ✓ (0), Understand partial (4), Participate partial (4), **Recognize ✗, Own ✗, Remember ✗**, Continue partial (6), Preserve not offered (sign-in sheet never opens), Purchase present but early (7).

### Correctness issues found (static, not runtime-verified)

- **Guest loop:** if anonymous session creation fails, `app/index.tsx:60-63` continues as guest, then `onboard-container.tsx:30` routes back to `/`.
- **Guest re-onboarding:** `useCompleteOnboarding.ts:38` returns early with no user, so the completion flag is never stored.
- **Purchase path:** `handleContinue(false)` bails because `isStepActionReady` is false on the paywall step (`OnboardingScreen.tsx:112,132`); recovery likely via `onDismiss`, which records `trialStarted=false`.
- **Dead code:** 9 unreachable cases in `OnboardingStepRenderer.tsx:64-177`; 6 orphaned step files (`CbtStepPreviewStep`, `JourneyStepPreviewStep`, `EnhancedCelebrationStep`, `JourneyMapStep`, `QuickWinMoodStep`, `ProgressGraphVictoryStep`); `SignInBottomSheet` never presented (`premium-onboarding.tsx:38-46`, `app/index.tsx:107`); unused form fields (`stressLevel`, `dailyGoal`, …).

## 2. Analytics and privacy

**Setup:** PostHog (`src/config/posthog.ts:24-41`) with lifecycle events, logs channel, and exception autocapture; no session replay; no console shipping; manual screen events (`RootLayoutNav.tsx:56-57`). RevenueCat (`RevenueCatProvider.tsx:232`). Gemini called directly from the client (`src/network/geminiClient.ts:9-15`). No Sentry, Firebase, Mixpanel, or AppsFlyer.

### Privacy flags

| Severity | Finding | Location |
|---|---|---|
| **Confirmed leak** ✓ | `$ai_generation` sends full prompt (`$ai_input`) and full response (`$ai_output_choices`) to PostHog, including for anonymous users. Prompts include journal entries, thought text, and image-extracted text. | `src/observability/ai.ts:61-91`; callers `genAi.ts:145,223,467`, `beliefClustering.ts:25-38`, `hooks/insights/*`, `extractTextFromImage.ts:22` |
| **Security** | `EXPO_PUBLIC_GEMINI_API_KEY` is bundled into the client and extractable. | `src/network/geminiClient.ts:9-15` |
| Third-party exposure | Journal entries, thoughts, and images go to Google Gemini directly from the device. Needs to be disclosed in the privacy policy. | same |
| PII (expected) | Email and name set as person properties for signed-in users. | `AuthContext.tsx:162-171` |
| Latent leak | `onboarding_thought_bubble_selected` sends `thought_text`; safe today only because text is canned. Arguments also swapped (`scenario_id` receives text). Becomes a leak when personal practice ships. | `useOnboardingAnalytics.ts:~201-204`; `ThoughtCatchMicroStep.tsx:47` |
| Possible | Raw error strings in `signup_auth_failed.error_message` and `paywall_error.error`; exception autocapture messages. | `useSignUpAnalytics.ts:~78`; `RevenueCatProvider.tsx:178`; `posthog.ts:36` |
| Safe | `journal_entry_saved` sends only `text_length`. | `useJournalOperationsHandler.ts:98` |

Free text at rest: Supabase `exercise_entries`, `journal_records`, `journal_reflection_lineage`; AsyncStorage drafts; on-device LLM (llama.rn / Apple AI) stays local. Voice transcription goes through the `save-journal-ai-insights` edge function (server side not inspected).

### Funnel coverage vs the validation plan

| Stage | Status |
|---|---|
| App open | ✓ `Application Opened`, `app_session_started` |
| Goal routed | ✓ `onboarding_motivation_selected` |
| Worked example started | **Missing** (only generic `onboarding_step_viewed`) |
| Worked example completed | Partial (`onboarding_step_completed`) |
| Personal practice chosen / skipped / completed | Chosen ✓ (StarterPath); **skipped missing**; completed ✓ `exercise_completed` |
| Artifact saved | Partial — `journal_entry_saved` only; **no exercise-artifact save event** |
| Home reached | ✓ `starter_path_home_returned`, `tab_initial_viewed` |
| Signup shown / completed | ✓ `signup_sheet_viewed` / `signup_auth_succeeded` (sheet never opens in onboarding) |
| Reminder asked / granted | Partial — onboarding only; skip path sends nothing; 3 other permission sites untracked |
| Paywall shown / dismissed | ✓ `paywall_viewed` / `paywall_dismissed` |
| Trial started | Partial — onboarding only; RevenueCat flows emit `paywall_purchased` with no trial distinction |

## 3. Paywall boundary

SDK: RevenueCat, entitlement `"Premium journals"` (`RevenueCatProvider.tsx:39`). Paywall copy lives in the RevenueCat dashboard template — not in the repo. A local copy block (`src/locales/en/onboarding.json:357-373`, including "Streak repair & premium themes") is unused.

**First paywall a new user sees:** onboarding step 7, after the canned Thought Catcher, before any saved artifact, before Home. Dismissible (`displayCloseButton: true`); dismissal still completes onboarding. Close-button delay, trial length, and renewal copy are set remotely — **verify in the RevenueCat dashboard.**

Other triggers: journey Unit 2+; 8 Pro exercises; >3 journal entries per day ✓; weekly AI summary; 3 locked insight cards; 4th habit / 6th coping card; Settings promos. No timer or Home-load triggers.

What is gated vs the Q3 decision (lead with insights + journeys, history free):

| Item | Current | Fits Q3? |
|---|---|---|
| Journeys beyond Unit 1 | Pro | ✓ guided journeys |
| Insight cards (Thought Patterns, Belief Decay, Therapist Notebook) | Pro, and also count thresholds | ✓ insights — but gate on count first, then Pro |
| Reading saved history | Free; lapsed users keep it | ✓ |
| Writing entries | **Capped at 3/day**; voice recorder closes on cap (`voice-recorder.tsx:37-41`) | ✗ conflicts with "reflections always free" |
| Weekly AI summary | Pro after a cap that counts **lifetime** rows, not weekly (`useWeeklyInsightsLimit.ts:31-34`) | Bug |
| Streak repair | Advertised in unused copy only | ✗ must never be sold |

## 4. Progress mechanics vs the Q4 decision

| Target | Current | Status | Change needed |
|---|---|---|---|
| Lifetime practice count, never resets, no broken state | Data exists (`useExerciseStats.ts:101`, `useTotalJournalCount`) but streak is the hero metric (`DuolingoHeader.tsx:126`, `DiscoveryHeader.tsx:36`, `JournalCalendarScreen.tsx:217`) | Partial | Swap displays to lifetime count |
| Weekly ring "2 of 3 this week", silent Monday refill | `weeklyProgress` is tied to the streak; one miss erases the week's dots (`useStreak.ts:179-191`); weekly counts start Sunday (`useCurrentWeekJournalCount.ts:20`) | Absent | New Monday-start weekly count with target 3; remove dot-erasing logic |
| Insights unlocked by reflection count, never consecutive days | Count thresholds exist (≥5 in `usePersonalEffectiveness.ts:38`, `useSkillProgression.ts:130`, `useTherapistNotebook.ts:202`); some nudges depend on streak (`useInsightNudge.ts:67,77`) | Mostly exists | Remove streak dependency from nudges |
| No break shown as failure, no sold repair | No "lost streak" copy; 7 PM notification is gentle (`home.json:74-78`); but milestone modal promises "You earned a Streak Freeze!" with no freeze implemented (`useStreakMilestoneModalViewModel.ts:39,51`); challenges show "Resets at midnight" (`ChallengesScreen.tsx:151`) | Partial | Remove freeze promise and daily-reset challenge pressure |

Other: streak count is computed by the `update_user_streak` RPC, whose SQL is not in the repo (timezone and reset rule unverified). XP, levels, achievements (streak badges at 3/7/14/30), challenges, and rewards shop exist; gamification screens have no navigation entry (`app/tabs/_layout.tsx:62` route only).

## 5. Gap list, ordered

**P0 — fix now, independent of redesign**

1. Strip `$ai_input` and `$ai_output_choices` from `src/observability/ai.ts`; keep model, operation, tokens, latency, error flag.
2. Move Gemini calls behind a Supabase edge function; rotate the key.
3. Fix swapped arguments in `ThoughtCatchMicroStep.tsx:47` and drop `thought_text` from the onboarding event before personal practice ships.

**P1 — onboarding redesign (maps to the decision record's 9 steps)**

4. Cut `welcome` (duplicate) and `building_journey` (fake loading).
5. Rebuild `thought_catch_micro` as worked example → optional personal practice (try with today / another example / skip); correct the answer key.
6. Replace `milestone_celebration` streak pledge with a reflect-and-save moment that writes a real artifact.
7. Read the saved artifact on Home first visit; guarantee a next-lesson card even if enrollment fails.
8. Move notification ask after save; one slot, if-then framing; track the skip path.
9. Move the paywall from step 7 to after Home arrival; rewrite RevenueCat template copy to lead with journeys + count-unlocked insights; add trial timeline with reminder before charge.
10. Add missing funnel events: worked-example started, practice skipped, artifact saved, trial started outside onboarding.

**P2 — progress and gating alignment**

11. Swap streak hero displays to lifetime count; add Monday-start weekly ring (target 3, silent refill); delete dot-erasing logic.
12. Remove "Streak Freeze" promise and "Streak repair" copy; reconsider midnight-reset challenges.
13. Remove or raise the 3-per-day journal write cap; fix the lifetime-vs-weekly AI summary cap.
14. Fix guest loop and guest completion flag; decide fate of the never-opened sign-in sheet.
15. Delete dead onboarding steps and fields.

**Verify outside the repo**

- RevenueCat dashboard: paywall template copy, close-button delay, trial length, renewal disclosure.
- Supabase: `update_user_streak` SQL (timezone, reset rule); `save-journal-ai-insights` edge function (what it sends to third parties).
- Privacy policy: disclosure of Gemini processing and PostHog AI events.
