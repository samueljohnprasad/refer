---
name: Happy Onboarding & Day-0 — Experience Spine
description: 'Two-screen onboarding (goal pick, Thought Catcher chat ending in a saved card), first Home visit, the triggered asks that follow the first save, and (Parts 13–19) the states after Day 0: lifecycle Home, lapse and return, notifications, distress and crisis, the PHQ-4 check, graduation.'
status: draft
sources:
  - ../research-onboarding-competitive-teardown/onboarding-redesign-sequence.md
  - ../research-onboarding-competitive-teardown/onboarding-first-use-decision.md
  - ../research-onboarding-competitive-teardown/current-state-first-use-audit.md
  - ../research-onboarding-competitive-teardown/research-onboarding-competitive-teardown.md
  - ./DESIGN.md
  - ./imports/mobbin-refs.md
  - ../../../PRODUCT.md
  - ../../../docs/research/retention-strategy.md
  - ../../../docs/research/winback-copy.md
  - ../research-retention-gaps/research-retention-gaps.md
  - ../research-user-voice/research-user-voice.md
  - ../../../docs/research/soul/06-implementation-spec.md
updated: 2026-11-09
---

# Happy Onboarding & Day-0 — Experience Spine

`DESIGN.md` owns how it looks. This spine owns how it works. Mocks live in [mockups/](mockups/); this spine wins on conflict. The newest visual truth is the HTML prototypes in [.agents/](../../../.agents/) (`onboarding.html`, `home.html`, `journeys.html`, `happi.js`, `happy-ui.css`); none of them shows an after-Day-0 state. Supersedes the 2026-10-20 seven-step spine (see `.memlog.md` overrides). Parts 1–12 are Day 0. **Parts 13–19 cover everything after Day 0**; they hold decisions and exact copy, while the full composition of each Home state (order of blocks, research) stays in `retention-strategy.md` Part 5 and is not duplicated here. §19 records how conflicts with soul/06 were resolved.

## 1. Foundation

- **Platform:** iOS, iPhone portrait. Expo Router, React Native, NativeWind. Android follows the same behavior.
- **UI system:** existing Happy components (`TactileButton`, chips, Happi rig). This spine specifies only behavior deltas.
- **Rule of the flow:** one ask per moment; every ask comes after the value it protects. No account, pledge, reminder, or paywall before the first saved reflection.
- **Guest first:** anonymous Supabase session is created silently on the first goal tap. The guest has the full free product.
- **Visual identity:** `DESIGN.md`.

## 2. Information Architecture

Onboarding is two screens. Home is the destination, not a step.

| Surface | Reached from | Job | Exit |
|---|---|---|---|
| **S1 Goal pick** | First launch | Route to a course in one tap | Tap a goal card |
| **S2 Thought Catcher chat** | S1 | Teach one catch, let the user try, save the result | Tap **Go to Home** on the saved card |
| **Home** (`/tabs/(tabs)/home`) | S2, every later launch | Show the saved work and the next step | — |
| **Premium sheet** (remote RevenueCat template) | Home, once after first arrival; later at any of 12 existing gated entries in code (journal limit, AI insights, locked lesson, voice recorder, etc.) | Offer continuation honestly | Start trial, or ✕ — layout is the dashboard's, not this spine's |
| **Signup sheet / card** | Triggers (§9) | Protect saved work across devices | Sign in, or Later |
| **Account** (header person icon) | Home, always | The permanent place to sign in, check backup, set a reminder | Close |
| **Reminder primer (re-offer)** | After 2nd saved practice, if first ask declined | One more chance at a reminder | Pick time, or Not now |
| **Home variants** (D1…D30+, lapsed, post-return) | Every launch after Day 0 | The right next step for this gap and mood | §13–§14 |
| **Distressed variant** | Not okay chip, "I'm struggling", crisis phrase, positive risk item | Safety, grounding, a human route | §16 |
| **Crisis sheet** | Get help pill, Settings **Get help now**, **Talk to someone now**, crisis phrase | Region helplines, call or text | §16 |
| **Wellbeing check** (full-screen sheet of PHQ-4 + risk item screens) | Opt-in prompt card on a calm Home, or Account | Measure whether practice helps | §17 |
| **Trial banner** | Every open in the 2 days before a trial charge | A legally plain notice of date and price | §15 |
| **Look-back** (story cards) | D7 (n ≥ 2), then Mondays; opt-in in Account | Show the user's own week | §4 |
| **Help (icon)** | Header, always | How Happy works, contact, privacy. Not a crisis route (that is the Get help pill) | — |
| **Graduation card** | D30+, once, when eligible | Offer less Happy without losing it | §18 |

**Cut from current build:** `welcome`, `building_journey`, `milestone_celebration`, `notification_permission` as a step, `soft_paywall` as a step, entry "Begin" screen. Orphaned step files and unreachable renderer cases go with them.

### S1 Goal pick
Mock: [mockups/key-s1-goal-pick.html](mockups/key-s1-goal-pick.html)

- Happi (calm pose) + headline "What's on your mind?" + one-line sub: "Two minutes. No sign-up."
- Five goal cards, single select: worry, low mood, stress, self-talk, sleep. Labels in plain words.
- Tap = select + advance (280ms selection feedback, then push S2). No Continue button.
- Small "I already have an account" text link, bottom. Opens sign-in sheet; on success, returning users skip to Home.

### S2 Thought Catcher chat
Mocks: [mockups/key-s2-chat.html](mockups/key-s2-chat.html) · [mockups/key-s2-saved-card.html](mockups/key-s2-saved-card.html)

One scrolling conversation. Happi bubbles left, user replies right. Input area at the bottom shows quick-reply chips or, in the personal branch only, a text field.

| Beat | Happi says (shape) | User does |
|---|---|---|
| 1 Mirror | Names the goal back: "Worry runs ahead of the facts. Let's catch one together." | Tap **Show me** |
| 2 Example | Splits the moment: **What happened** (a camera's view) then **What the mind added** (the thought) | — |
| 3 Before | "If this happened to you, how true would that thought feel?" BeliefScale | Tap; cloud weight follows |
| 4 Reality check | "Is it actually true?" **Yes** / **Not sure** / **No** | Tap. Every answer gets a kind reply; none is wrong |
| 5 Reframe | One balanced alternative + one line on **why it's plausible** + the trap name as a small label (taught, not tested) | — |
| 5b After | "And now, how true does the first thought feel?" BeliefScale, then a shift line (unchanged is fine) | Tap |
| 6 Choice | "Want to try one of yours?" | **Try with something from today** / **Another example** / **Continue** (equal weight) |
| 7a Personal (opt-in) | "What happened? Just what a camera would have seen." | Type ≤ 280 chars, or **Skip, show an example** (shows another example) |
| 7b | "What did your mind add?" | Type |
| 7c | Before BeliefScale, then **Is it actually true?** | Tap, tap |
| 7d | "What's another way to see it?" + 3 starter chips | Type or tap a starter |
| 7e | After BeliefScale + shift line | Tap; unchanged is valid |
| 8 Saved card | Card slides in as the last message (§4 SavedCard) | Pick reminder time or **Not now**, then **Go to Home** |

- **Aha this chat is built for** (research report, "Define the aha precisely"): *the event did not change, but I can see another credible interpretation, and I know the move I just practiced.* No terminology quiz: trap names are shown, never tested.
- **Another example** loops beats 2–5b once with a second thought, then returns to beat 6 without that option.
- **Continue** goes to beat 8 with the worked example as the saved item.
- Target: beats 1–6 under 60s; personal branch under 90s.
- Back: chevron top-left returns to S1 until beat 3; after that it asks "Leave this practice?" (Keep going / Leave). Leaving keeps nothing and returns to S1.

### Home (first visit)
Mock: [mockups/key-home-premium-sheet.html](mockups/key-home-premium-sheet.html). **Stale in two places:** it shows a Lesson 2 card (held back to D1, C6) and has no Get help pill; follow this spine.

Existing `JournalCalendarScreen` layout stays. Deltas only:
1. **SavedReflectionCard** at top: the reflection from S2, tap to open.
2. **ProgressPair** (count + weekly ring) replaces the streak capsule and sits as a body block under the saved card, as in every Home state (§13). Header holds only greeting, Get help pill, help icon, Account. [ASSUMPTION: body block, matching strategy §5; the prototypes still show it in the header]
3. **No filled CTA on D0.** The saved card is the hero; a quiet text link **"Catch another one"** sits below it. `StarterPathNextActionCard` (lesson 2) is held back to D1 (see §19, conflict C6). H1 **"That one's saved."**, sub **"Whenever another thought sticks around, catch it here."** (the strategy's "Come back when…" is dropped: "come back" is banned in §3)
4. **SignupNudgeCard** below the saved card (trigger 1).
5. **Header:** **Get help** pill (outlined), help icon, Account icon (person). Pill and Account are always visible, signed in or not (§4 Account, §16).
6. **Premium sheet** presents 600ms after Home settles, once.

## 3. Voice and Tone

- Plain words. "Thinking trap," never "cognitive distortion." No diagnosis, no promised improvement.
- Happi is curious, brief, warm. Max two short sentences per bubble.
- Never shame: wrong chip = "Close — this one's more like…"; unchanged belief = "That's useful to know."
- Asks name their benefit and accept a no: "Not now," "Later," "No thanks." Never "No, I don't want to feel better."
- Paywall states price, trial length, reminder day, and how to cancel in the same view.
- **Wellness wording (FDA General Wellness, 2026-01-06).** Every string says "manage stress", "feel calmer", "see a thought more fairly"; never "treats", "heals", or a diagnosis [RG22]. Full rule and the safe-messaging don'ts: §16.
- **Never name the gap.** Banned in return and win-back copy: "missed", "streak", "waiting", "lost", "haven't", "been a while", "come back", "still there?", "we miss you", any day count. In-app copy: Happi speaks, no "we". Pushes and system notices are signed Happy and never voiced by Happi; they say "Happy", not "we" or "Happi". One ask per message (§14).
- Microcopy table:

| Moment | Copy |
|---|---|
| S1 sub | Two minutes. No sign-up. |
| Saved card title | Saved to your journal |
| Count | Practices completed: 1 |
| Ring | 1 of 3 this week |
| Reminder ask | Want a nudge for your next one? |
| Reminder sample on the saved card (N0) | Happy — What's been on your mind today? (the one place this sample appears) |
| Daily reminder (N1), rotates | five templates, §15 |
| Signup card | Keep your reflections safe — they'll be here on a new phone too. |
| Signup sheet (2nd save) | Don't lose your 2 reflections |
| Post-purchase | Protect your subscription on other devices |
| Paywall dismiss | ✕ / Not now — your reflections stay free |
| Account, signed in | You're signed in. Your reflections are backed up. They'll be here on a new phone too. |

## 4. Component Patterns

### GoalCard
Single-select tile (two columns; Happi's head in the goal's pose, see DESIGN.md). Tap applies selected style, haptic, Happi takes on the goal's pose, 420ms hold, advances. Only one tap processed; double taps ignored.

### ChatThread
- Happi bubbles enter one at a time: typing indicator 400–700ms (scaled to length), then bubble. Reduce Motion: no indicator, instant bubble.
- Auto-scroll to newest; user scroll-up pauses auto-scroll until they return to bottom.
- Past quick replies collapse into a user bubble showing the chosen text.

### QuickReplyChips
- 2–4 chips above the safe area. Stacked full-width when any label > 22 chars, else wrap.
- Tap: chip echoes as user bubble, chips disappear, next Happi beat starts.

### ChatTextInput (personal branch only)
- Multiline, 280-char cap, counter at 240+. Send disabled when empty.
- Idea chips above the field (goal-matched, tap to fill, still editable) and a text link "Skip, show an example" below it.
- Text stays on device until save; never sent to analytics.

### BeliefScale
Five tappable steps, labeled ends ("Not at all" / "Completely"). Selection required to continue; any value valid.

### SavedCard
- Content: three rows that show the aha: **What happened** ("didn't change"), **The thought** with its before belief, **Another way to see it** with its after belief; trap label on examples only; then the move named: "You split what happened from what your mind added, and found another way to see it." **Saved to your journal** with check, `ProgressPair` (count + ring), reminder row, **Go to Home**.
- Reminder row: "Want a nudge for your next one?" + chips **Morning** / **Evening** / **Pick a time** / **Not now**.
  - Morning / Evening → custom confirm already done → native permission prompt → on grant, schedule one daily reminder; row turns to "Reminder set for 8:00 PM ✓ Change".
  - Pick a time → inline time wheel → same path.
  - Native denied → row reads "Reminders are off. You can turn them on in Settings." No retry this session.
  - Not now → row collapses to "No reminder" quietly.
- **Go to Home** enabled regardless of reminder choice.

### ProgressPair
Lifetime count ("Practices completed: N", only increases, never resets) + weekly ring ("N of 3 this week", refills Monday, no fail state). Never labeled "streak." The count and all saved reflections survive reinstall and device change once the user signs in. Account has a **Hide progress** switch that removes the pair from every Home state (soul/06 "Hide counter", kept).
- **Visibility, one rule:** shown from n ≥ 1, as a body block (not the header); the ring alone is hidden while w = 0 and the count stays. Hidden in the Distressed variant, and on a Lapsed 30+ return until the first practice since the return, after which it returns with the lifetime count intact. Shown on Lapsed 3–29 (§14).
- **Count typography:** `numeral` (34/40) on the saved card and Account; `title` (28/34) in the compact Home block.

### PremiumSheet (remote — RevenueCat template, not built here)
- Code reality: `RevenueCatUI.Paywall` (onboarding, `SoftPaywallStep.tsx`) and `RevenueCatUI.presentPaywall()` (every gated entry, `RevenueCatProvider.tsx:119`) render whatever template is configured in the RevenueCat dashboard for the current offering. This spine does not own its layout — the dashboard does.
- What this spine does own: `displayCloseButton: true` is already set (close visible from frame one, confirmed in code) — keep it. Call site passes `offering` from `Purchases.getOfferings().current`; content follows that offering's template.
- **Content checklist for whoever edits the dashboard template** (from research Q3 + decision-record guardrails, not enforceable in code):
  - Lead with the guided journey available now; pattern insights framed as unlocking after enough reflections (a count), never consecutive days.
  - Never list saved reflections or history as a paid benefit.
  - Trial timeline with a reminder before charge; price and renewal stated plainly.
  - No discount-intercept step on dismiss (not configured as a separate screen in this flow).
  - Charge date and price on the first screen. The Pro entry is explained in plain words; naming a plan before its value is a known complaint ("Finch Plus without knowing what Finch plus means", [UV2 R2.6]).
  - Every exercise reachable from the Distressed variant (breathing, short Thought Catcher, safety plan, grounding) stays free; "paywalling help" reads as a broken promise.
  - Price and funnel anchors are a PRD decision; see retention-strategy §6.5 ([RG6]–[RG9]).
  - **Trial-ending notice is mandatory** (N8, §15): a push two days before the charge plus an in-app banner on every open those two days, even with reminders paused or permission denied, and not subject to the practised-today, Distressed-day or graduated skip rules.
  - **Automatic presentation** (D0 first arrival) is the only one; it is never shown in the Distressed variant, in a session with a Low or Not okay chip or crisis phrase, or on any Lapsed 14+ return. A user tapping a gated entry always opens it, except in the Distressed variant, where every reachable exercise is free. This is the single suppression rule; §9 and §14 repeat it.
- Dismiss: `onDismiss` → `trackPaywallDismissed` → returns to caller screen. No app-side discount intercept exists or is added.
- [NOTE FOR UX] `key-home-premium-sheet.html` is a directional reference for dashboard authoring, not a build spec — actual pixels come from RevenueCat's paywall builder.

### SignupNudgeCard (Home)
Card with benefit line, **Save my reflections** + **Later**. Later hides it for 7 days [ASSUMPTION]; reappears only if no account.

### Account (header icon)
Reference: guest-capable apps put a guest card on a Profile screen; wellness apps reach it from a header person icon (Mobbin pass, Nov 2026; detail in `imports/mobbin-refs.md`). Happy has no Profile tab, so the header icon is the entry.

- **Guest:** icon opens the sign-in sheet (`SignInBottomSheet`): "Keep your reflections safe", Apple / Google / email, **Later**.
- **Signed in:** icon opens the Account screen. Modelled on Duolingo and BitePal (coloured hero with the character, settings in rounded fill cards under small grey titles, Delete apart, confirms in the mascot's voice). Top to bottom:
  1. Hero: a tinted band with Happi, "You're signed in", "Joined <month>". Back arrow only; no gear, since settings are on this screen.
  2. **Your practice:** two `surface-soft` cards, **Practices completed** and **This week** (mini ring + "N of 3"). Never a streak.
  3. **Reminders:** card with a **Daily reminder** switch and, when on, a **Time** row. Switching on opens the time sheet; switching off clears it. If OS notification permission is denied, the switch reads off and a row beneath says "Reminders are off in Settings." with **Open Settings**; if permission is undetermined, switching on shows the native prompt after the time sheet. When reminders were auto-paused (N4, §15) the switch is off and a **Turn reminders back on** link sits under it. After graduation the card shows the chosen cadence (§18) and **Back to daily**.
  3b. **Wellbeing check** (optional): a switch for the fortnightly check (§17) and, when on, the last two results as plain words. Off by default.
  3c. **Preferences:** **Hide progress**; **Remember my last reflection** (recall, default on; off gives the fallback line in §14); **Weekly look-back** (default off; turns N7 on); **Show Happi** (mirrors the scope-card switch). All plain switches, no confirm.
  3d. **Happy Pro:** one row. Shows the plan state and opens `presentPaywall()` for the current offering (strategy §6.5). Never an automatic presentation.
  4. **Your data:** **Backup** row ("Backed up just now").
  5. **Account:** **Sign out** opens a confirm sheet, "Sure you want to sign out? Happi will be here when you're back."
  6. **Delete account** in its own card, last. Label in `ink`, with a `terracotta` icon only (`terracotta` text on white is 3.30:1 and fails AA). Confirm sheet says reflections are removed from the phone and the cloud.
- Prototype `home.html` ships both: the guest sheet and the signed-in Account screen (hero, progress cards, reminder switch, backup, sign-out and delete confirm sheets).
- Signing in from here keeps anonymous reflections (link, not replace). **If the identity already has an account** with reflections (the new-phone case), show a sheet: "This account already has reflections." with **Add yours to it** (merge; nothing is deleted on either side) and **Cancel**. There is no "replace". [ASSUMPTION: merge-only; confirm with architecture]

### SignupSheet
Existing `SignInBottomSheet`. Apple, Google, email. Title by trigger (§3). Always dismissible. Sign-in failure keeps the sheet open with an inline message; cancelling the Apple/Google dialog returns to the sheet. An identity that already has reflections triggers the merge sheet (§4 Account).

### After-Day-0 components (behavior; visuals in DESIGN.md.Components)
Each component below is specified here in one place; the Parts hold the surrounding rules.

| Component | Behavior |
|---|---|
| **Get help pill** | Header of every Home state; text button on every free-text screen. Tap opens the Crisis sheet. 2 taps or fewer from anywhere (§16). |
| **Check-in chips** | §13. The rotating question is plain label text above the chips (app UI), not a Happi bubble. |
| **Recall line** | §14. **Why am I seeing this?** opens a small sheet: "Happy shows your last reflection so you can see how you saw it then." with **Keep showing** and **Turn off** (the Account **Remember my last reflection** switch). |
| **Look-back card** | Story format, 3 cards: "You caught N thoughts." · "The trap that showed up most: {trap}." · one fair thought the user wrote (recall rules apply). End card buttons **Done** / **Catch a thought**. D7 once when n ≥ 2, else the D2–D6 Home; then Mondays when last week had ≥ 2 practices; monthly on the 1st from D30. Cross-fade 300 ms; Reduce Motion: static cards, tap to advance. Opt-in for the weekly form (Account); the N7 push follows the same switch. Composition: strategy §5.4. |
| **Scope card** | Lapsed 30+. A **Show Happi** switch (off hides the Happi rig, persists, mirrors Account) and **Got it**, which collapses the card for good. The reassurance line "Your reflections are saved. Start wherever feels right." sits above the buttons, not inside the card. |
| **Trial banner** | Strip under the header on every open in the two days before the charge, on every Home state including Distressed and lapsed (it is a notice, not a promotion). **Manage** opens the subscription settings. The 44 pt dismiss hides it for the current session only; it returns on the next open until the charge. Gone once the trial is cancelled, converted or expired. |
| **Wellbeing check** | Full-screen sheet from a prompt card or Account (§17). One question per screen, **Skip** on every screen, progress label "n of 5", closes with **Not now** at any point. |
| **Choice rows** (wellbeing answers, graduation options) | Single select. Wellbeing: tap selects and advances after 200 ms. Graduation: tap selects and commits at once, then a one-line confirmation; the choice is reversible in Account. |
| **Graduation card** | §18. If ignored, it stays pinned on the maintenance Home until the user chooses; the **Not yet** text link hides it for 30 days; always reachable from Account. |
| **Hotline row** | Name, number, **Call** (`tel:`) or **Text** (`sms:`). The OS shows its own call confirmation. Region from the device; **Change country** (ink underlined link) opens a country list; unknown region falls back to the country list plus the international finder. |
| **Crisis sheet** | Opened from the Get help pill, Settings **Get help now**, **Talk to someone now** or a crisis phrase. Dismiss with a Close text button or swipe; reopening is always allowed. Focus lands on the heading, then the first hotline row (§7). No motion in any mode (§16). |


## 5. State Patterns

| State | Where | Behavior |
|---|---|---|
| Session creation fails | S1 tap | Proceed locally as guest; retry session silently on S2 save and Home. Never route back to S1 (fixes guest loop). |
| Offline | S1–S2 | Fully local; saved card says "Saved on this phone" until sync. |
| Personal text empty | 7a | Send disabled. |
| App killed mid-chat | S2 | Relaunch returns to S1; nothing saved. Onboarding not marked complete. |
| App killed after save | S2 beat 8 | Reflection persisted; onboarding marked complete; relaunch to Home. |
| Paywall load slow | Home | Sheet waits up to 3s, else skipped this launch; next gated entry shows it. |
| Purchase fails/cancelled | Premium sheet | Inline message, sheet stays, ✕ works. |
| Already signed in (returning) | S1 link | Skip S2, go Home. |
| Guest completes onboarding | Save | Completion flag stored locally for guests too (fixes re-onboarding). |
| Notifications denied earlier (OS) | Saved card | Row shows Settings hint instead of chips. |
| Crisis phrase typed | S2 7a–7d, any free-text screen | Matched on device, field never blocks. Opens the Crisis sheet once per entry, cancels any AI request, sends nothing. The user may finish the entry; the Get help text button stays in the header. Marks `distress_24h`. |
| Distressed before onboarding is complete | Home, `n = 0` | Precedence rule 1 wins: Distressed variant is shown. Onboarding is not marked complete; the next calm open resumes at S1. The D0 Premium sheet is not consumed. |
| Sign-in finds an existing account | Signup sheet, Account | Merge sheet (§4 Account). Sign-in error: inline message, sheet stays open. |
| Home cold-load | Home | Renders from the local store. After a reinstall, before sync lands, `n` is unknown: show the neutral shell (greeting, Happi, **Catch a thought**) and recompute when sync lands. Never route to S1 for a signed-in user. |
| Home offline | Home | Fully usable from the local store; Backup row says "Saved on this phone". No banner. |
| Clock change | Home variants | `gap` and `d_install` use the device's local calendar date; a date earlier than the last practice counts as `gap = 0`. |
| Notification tapped | Cold or warm open | Lands on the Home variant for the current gap. N7 opens the Look-back; N8 opens Home with the Trial banner in view. |
| Wellbeing check skipped / abandoned | Wellbeing check | See §17: Skip on a PHQ item leaves that item blank and the check unscored; Skip or close on the risk item is handled as unanswered; an unscored check is never shown as a result. |
| Trial banner states | Home, all variants | §4 table. Not shown once cancelled or converted. |
| Helpline data | Crisis sheet | Bundled table; if older than 90 days, still shown (a stale number beats none) and the next release is flagged to refresh. Unknown region: country list plus the international finder. |

**Persistence on save (single write):** reflection record, `onboarding_completed = true`, practice count +1, weekly count +1. The Home `SavedReflectionCard` reads the same record (fixes write-only `@happy/onboarding_thought_catch`).

## 6. Interaction Primitives

| Event | Motion | Haptic |
|---|---|---|
| Goal card tap | Scale 1.02 + border to selected | `selectionAsync` |
| Happi bubble in | Fade + 8pt rise, 200ms | none |
| Quick reply tap | Chip → user bubble morph, 180ms | `selectionAsync` |
| Reality check answered | Chip fills; Happi nods (No / Not sure) or tilts kindly (Yes) | `selectionAsync` |
| Saved card in | Slide up 24pt + fade, 260ms; count ticks 0→1 | `notificationAsync(Success)` |
| Ring fill | 1/3 arc animates 400ms | none |
| Premium sheet | Spring up; ✕ visible at start | none |
| Sheet dismiss | Slide down 200ms | `selectionAsync` |
| Check-in chip answered | Chip fills, row collapses to "Today: Okay", 180 ms | `selectionAsync` |
| Return greeting | Happi Resting then Welcome back, one shot, 1,800 ms at most | none |
| First practice after a return | Quiet pride, 600 ms at most, once | none |
| Distressed variant | Happi fades in over 300 ms, then still | none |
| Crisis sheet | 0 ms in and out, in every motion mode | none |
| Trial banner | Appears with the screen; no slide | none |
| Look-back cards | Cross-fade 300 ms; progress segments fill linearly | none |

Reduce Motion: no rise or spring; opacity-only, count shown final.

## 7. Accessibility Floor

- Touch targets ≥ 44×44pt, chips included.
- VoiceOver: new Happi bubbles announced via live region; quick replies grouped as "Replies, 3 options"; BeliefScale as adjustable.
- Dynamic Type to AX3: chips stack, bubbles wrap, saved card scrolls.
- Ring exposes text "1 of 3 practices this week."
- No timeouts on any step. Typing indicator never blocks reading.
- Personal text field labeled; counter announced at 260+.
- **Crisis sheet:** announced as a modal dialog; VoiceOver focus lands on the heading, then the first hotline row. **Call**/**Text** buttons are labeled with the line's name ("Call 988 Suicide and Crisis Lifeline"). Rows reflow at AX3, never truncate the number. Closing returns focus to the control that opened it.
- **Check-in chips:** a group labeled with the day's question; the collapsed result reads "Today: Okay, double-tap to change".
- **Wellbeing check:** each question is a radio group with its position ("Question 2 of 5"); **Skip** is always reachable; the risk question is announced exactly like the others.
- **Trial banner:** a static text element read on screen open; the dismiss is a labeled button.
- **Distressed variant:** the three options are plain buttons in reading order; nothing auto-focuses or auto-announces except the H1.

## 8. Analytics (no free text, ever)

`onboarding_goal_selected {goal}` · `chat_beat_completed {beat}` · `reality_check {yes|unsure|no}` · `belief_rated {phase: before|after, value}` · `practice_path_chosen {personal|example|continue}` · `personal_practice_completed {belief_delta}` · `reflection_saved {count, source}` · `reminder_primer_answered {morning|evening|custom|not_now}` · `push_permission_result {granted|denied}` · `home_first_view` · `paywall_shown {placement}` · `paywall_dismissed` · `trial_started` · `signup_prompt_shown {trigger}` · `signup_completed {trigger, method}` · `account_opened {state: guest|signed_in}`.

After Day 0 (never any text). **Health-derived events** (`mood_checked`, `home_viewed.mood_today`, `outcome_check_completed`, `risk_item_answered`) are first-party only: they go to Happy's own backend, never to a third-party analytics SDK, and `risk_item_answered` is not sent with any user or device identifier. [ASSUMPTION: needs a privacy and legal decision before build]. Added events: `trial_banner_shown` / `trial_banner_dismissed` · `wellbeing_offered` / `wellbeing_declined` / `wellbeing_skipped {item}` · `recall_why_opened`. `home_viewed {variant, d_install, gap_days, n, w, mood_today}` · `mood_checked {value}` · `notification_sent` / `notification_opened {type: N1–N8, template_id, hour_local}` · `reminder_paused` / `reminder_resumed {reason: ignored_3|user}` · `distressed_variant_shown {trigger: chip|keyword|struggling|risk_item}` · `help_opened {source: pill|keyword|distressed|settings|text_button}` · `hotline_tapped` / `safety_plan_started {region}` · `outcome_check_completed {phq4_total, phq4_anxiety, phq4_depression}` · `risk_item_answered {positive}` · `graduation_offered` / `graduation_chosen {choice}` · `lookback_opened` / `lookback_completed`.

## 9. Asks: triggers and limits

| Ask | First shown | Re-shown | Never |
|---|---|---|---|
| Reminder | Saved card (after first save) | Once, after 2nd save, if declined via Not now. After N4 auto-pause, one quiet inline row on the next open: **Keep reminders?** (**Keep** / **Not now**), shown instead of the Reminders link; on 7+ day returns the link is used and the row is skipped | Any other app-open prompt; after OS denial |
| Trial ending | Two days before the charge (push + in-app banner) | Banner on every open until the charge (dismiss lasts the session) | Skipped for any reason: exempt from practised-today, Distressed-day and graduated skips (mandatory) |
| Wellbeing check | Opt-in from a prompt card (calm Home, D14+, n ≥ 4) or Account | At most every 14 days; declined = not asked again for 30 days [ASSUMPTION] | Gating practice; in a Low or Not okay session; on a lapsed return |
| Graduation card | D30+, once, when eligible | Pinned until chosen; **Not yet** hides it 30 days; reachable from Account | Before 2 practices since a return; in a Distressed or Low session |
| Paywall | Once over Home, first arrival (new: wire `presentPaywall("home_first_visit")`) | Already gated in code at 12 call sites (journal limit, AI insights, locked lesson, voice recorder, etc.), opened by the user's tap — content is the dashboard template's job, not this spine's | Automatic presentation mid-chat; on a timer; with a discount intercept; in the Distressed variant; in a session with a Low or Not okay chip or a crisis phrase; on any Lapsed 14+ return (§4 PremiumSheet holds the rule) |
| Signup | Home card after 1st save | Sheet after 2nd save; sheet after purchase; header account icon (always available) | Before first save; as a gate on practice |

## 10. Inspiration & Anti-patterns

Patterns from `imports/mobbin-refs.md`: Headspace goal list, Life Reset answer mirror, Ahead/Bevel/WHOOP chat with quick replies, WHOOP and Once completion cards, Insight Timer time-first reminder, Google "You're so close" Home card, Hinge dismissible sign-in sheet, Brilliant/pillowtalk trial timelines, pillowtalk/WHOOP count-gated insights.

Anti-patterns: Me+ signed pledge; Headspace/Waking Up account before value; Ahead consecutive-streak unlock; fake personalization loaders; discount intercepts on dismiss.

After Day 0 (Mobbin and observed): Wysa SOS ladder and "Are you feeling better now?"; Headspace "Mindful Moment:" and Flo "A little time for yourself today?" as content-first push precedent [RG12][RG13]; Duolingo stops reminders after about 8 ignored and says so on return [RG14] (Happy stops after 3); stoic. "done" state for D0; How We Feel and WHOOP story recaps for the D7 look-back. Anti-patterns: "we miss you" drips, streak-saver pushes, day counts on return, discount pushes, paywalling help, the drag-a-face mood input (the one "condescending" complaint found targeted it).

## 11. Key Flows

### Priya, 31, product designer — Sunday 10:40 PM, can't stop replaying a Slack message
1. Opens Happy. S1: "What's on your mind?" Taps **Worry**.
2. Happi: "Worry runs ahead of the facts. Let's catch one together." She taps **Show me**.
3. Example: a friend texts "Can we talk later?"; the mind adds "I've done something wrong." She rates it **Mostly**, answers **Not sure**.
4. Reframe with its reason ("She didn't say what it's about, so it's a guess"). She rates it again: **A little**.
5. She taps **Try with something from today**. What happened: "Manager left one comment on my doc." Her mind added: "She thinks my work is sloppy."
6. Rates **Completely**, answers **Yes**; Happi: "Feeling sure isn't the same as knowing." Taps starter "I don't actually know that yet" and edits it.
7. After: **Somewhat**. "Even a small shift matters."
8. **Climax:** the saved card puts her moment, her thought (Completely) and her fairer view (Somewhat) side by side, and names the move she just did.
9. Taps **Evening**; iOS prompt; Allow. "Reminder set for 8:00 PM ✓."
10. Home: her card on top, no other CTA. Premium sheet slides up; she reads the timeline, taps ✕. Her card is still there.
11. Wednesday, second practice saved: sheet "Don't lose your 2 reflections." She signs in with Apple.

### Dev, 24, student — skips personal practice
1. S1 **Stress**. Chat beats 1–5.
2. Taps **Continue** at the choice.
3. Saved card shows the worked example as his first saved item. Taps **Not now** on reminder.
4. Home, closes Premium sheet. No further asks this session.

### Mara, 36, ICU nurse — Tuesday 7:50 AM, three weeks after her last practice
1. Her N4 pause notice fired weeks ago; nothing has pinged since. The Monday after day 14 she got one push at 12:30: "New week. Happy's here whenever you are." She ignored it.
2. Today she opens Happy on her own. Home is the 14–29 day variant: H1 "Good to see you.", Happi waking from Resting, CTA **Start with a 30-second check-in** (it expands the check-in chips), link **Or catch a thought**.
3. Recall line: "Last time, you wrote: 'I don't actually know that yet.'" with **Why am I seeing this?**. No count, no gap.
4. She taps **Good** on the check-in, then the CTA becomes **Catch a thought**.
5. **Climax:** she saves one reflection. Happi shows Quiet pride and one bubble, once: "That's one more kept." Her lifetime count is still intact; nothing reset.
6. A link under the reminders card reads "Turn reminders back on". She leaves it for later. (A 7+ day return uses the link, not the **Keep reminders?** row.)
7. **Failure path:** had she tapped **Okay** instead, Home would have kept **Start with a 30-second check-in** collapsed to "Today: Okay" and the CTA would still turn to **Catch a thought**; had she tapped **Low**, the follow-up row (§13) would have opened.

### Tomas, 34, warehouse lead — Wednesday 11:40 PM, phone in the dark
1. Taps **Not okay** on the check-in. Home turns into the Distressed variant: H1 "That sounds hard. Let's go gently."; three equal options; Get help pill.
2. He taps **Talk to someone now**. Region hotlines first; "Can't call right now?" below. Nothing animates, no sound.
3. **Climax:** he picks **Breathe with me — 1 minute** instead. No paywall, no count, no bubble.
4. Next morning the check-in reads "How are you now?" He taps **Better**. Home returns to normal with no recap of last night.
5. **Failure paths:** **Can't call right now?** shows **Make a safety plan** and **Grounding for 1 minute**. **Still not okay** re-enters the variant. With no region match he sees the country list first.

### Ines, 41, teacher — Sunday 9:15 PM, answering the fortnightly check
1. A calm Home shows a quiet card: "A two-minute look at how you've been. Want to?" She taps **Yes**.
2. Four questions, one per screen, two-week frame at the top. She skips question 3.
3. The fifth screen is the risk question, styled like the others. She answers **Several days**.
4. **Climax:** the Distressed variant opens, then the Crisis sheet's region lines. She taps **Close**, then **Breathe with me — 1 minute**. No score is shown.
5. Failure paths: skipping the risk question leaves it unanswered and shows one plain line, "Get help is always at the top of Home.", with no Distressed variant; closing mid-check saves nothing and offers no retry for 14 days.

### Ravi, 29, analyst — Day 62, graduation
1. Eighth-plus practice done, two PHQ-4 checks (second lower, no subscale at 3+), no Not okay in 14 days, 2 practices since any return.
2. Home shows the card under the Happi bubble "You've built a real skill." He taps **Switch to a weekly check-in**; a one-line confirmation follows.
3. **Climax:** nothing celebrates. The next Monday one reminder arrives; Home is unchanged.
4. Weeks later he opens Account and taps **Back to daily**. No recap.
5. Failure path: **Not yet** hides the card for 30 days.

### Lena, 38 — Day 6 of a free trial
1. Two days before the charge she opens Happy: the Trial banner reads "Trial ends Nov 20. You'll be charged $X unless you cancel." She taps **Manage**.
2. The N8 push arrives at her slot the same day, even though she already practised.
3. **Climax:** she cancels in subscription settings; the banner is gone on her next open.
4. Failure path: she dismisses the banner; it returns on her next open until the charge.

## 12. Open items

- Account screen is prototyped. Still open: real Backup row states (syncing, offline, failed) and the identity line (name or Apple email) once auth data is wired.
- After the 2nd save, one ask per moment: reminder re-offer if declined (once, then never again), else the signup sheet. Chosen so two sheets never stack. Revisit if signup conversion needs the sheet every time.

- **Reuse found, not yet in this spine:** `GuestSignUpSheet` (count + XP based, "Save my progress" / "Not now", purple/lock visual) and `AnonymousPurchaseClaimPrompt` (fires on `shouldPromptAccountClaim` after purchase, 350ms delay, skippable) already exist and partially satisfy §9's signup triggers. Before building SignupNudgeCard/SignupSheet fresh: confirm whether GuestSignUpSheet already covers the "after 2nd save" trigger, and reconcile its purple/lock visual against this spine's sage tokens (one system should win, not two).
- [ASSUMPTION] Signup Home card hides 7 days after Later.
- [ASSUMPTION] Reminder chip times: Morning 8:00 AM, Evening 8:00 PM.
- Test: signup sheet at 2nd vs 3rd save.
- Test: weekly ring alone vs daily mechanic for day-7 return.
- Paywall copy lives in RevenueCat dashboard; must match §4 PremiumSheet order.
- **After Day 0 — open:**
  - Feeling-word check-in. soul/06 specified 12 feeling words ("Which word fits right now?"); the retention strategy uses four routing chips (Good, Okay, Low, Not okay) with a rotating question. This spine keeps the four chips because they drive Home routing (§13); a 12-word picker as an optional second step is **undecided** (§19, C4).
  - Crisis sheet in Settings (soul/06, 2 taps) and Get help pill on every Home state (retention strategy) both ship; confirm the pill label wording.
  - Clinician review required before build: graduation thresholds (§18), the risk-item wording and response protocol (§17), the crisis phrase list.
  - Helplines: Tele-MANAS (India) confirmed by secondary sources only; verify on the primary page. Never list KIRAN.
  - PHQ-4 licence ("no permission required" from secondary pages): verify on phqscreeners.com before launch.
  - DESIGN.md now specifies lapsed Home, Distressed, crisis sheet, wellbeing check, graduation card and trial banner, but none has a mock; render key-screen mocks for the Distressed variant, Crisis sheet and wellbeing check before build.
  - **Assumptions from the 2026-11-09 review pass, to confirm:** ProgressPair is a body block, not header (§2); **Talk to someone now** opens the Crisis sheet; Account merge-only on sign-in to an existing account; **Keep reminders?** inline row; trial banner dismiss lasts one session; wellbeing prompt at D14+ and n ≥ 4; skipped risk item shows a plain line and no Distressed variant; "Better" clears chip and struggling triggers only; health-derived analytics first-party only; Help icon is a general help screen; dropped "Come back" from the D0 sub; N4 copy says "Happy" not "We".
  - Win-back push copy and in-app lapsed copy are untested inferences; experiment E12 (retention-strategy §8.6) picks the winners.
- Copy gaps (shown as grey bars in mocks): per-goal reframe bubble text, Premium sheet headline, 7a text-field placeholder, Happi's correct-answer line (mock shows ✓ on chip only).

## 13. Lifecycle Home (after Day 0)

Home is one screen with many variants. The decision order below is binding; each state's block order and research live in `retention-strategy.md` §5.

**Inputs:** `d_install`, `gap` (days since last practice), `n` (lifetime practices), `w` (practices this week), `mood_today`, `distress_24h`, `reminder_state`, `graduation_eligible`, `returned_at`.

**Precedence (first match wins):**

| # | Condition | Variant |
|---|---|---|
| 1 | `distress_24h`, or today's chip is Not okay / I'm struggling | Distressed (§16) |
| 2 | `n = 0` | Resume onboarding at S1 |
| 3 | `gap` ≥ 3 | Lapsed band (§14): 3–6, 7–13, 14–29, 30+ |
| 4 | Returned from a ≥7-day gap within the last 7 days | Post-return week (§14) |
| 5 | By `d_install` | D0, D1, D2–D6, D7 (look-back if n ≥ 2), D8–D29, D30+ (graduation card when eligible) |

After a Low chip, Home never routes back to a lesson CTA the user did not pick; after any chip, that day's CTA follows the chip (below). The CTA for **Start with a 30-second check-in** (Lapsed 7–29) expands the check-in chips in place; once answered, the CTA becomes **Catch a thought**.

**Blocks every variant draws from:** Header (greeting, Get help pill, help, Account), Hero (Happi plus at most one bubble), Check-in chips, one filled CTA, Last-reflection card, ProgressPair, Pattern line, Look-back, Explore, Signup and Premium. One filled CTA per state, with two exceptions: D0 has none; Lapsed 30+ has two equal outline buttons; the Distressed variant has three equal options. Cards that offer a choice rather than an action (graduation card, wellbeing prompt) use equal-weight choice rows and are not CTAs.

**Presence caps for Happi:** at most 1 bubble per screen and 3 per session; Welcome back at most once per 24 h; Celebrating at most once per 7 days. A bubble appears only for: D1 recall, return greeting, pattern unlock, ring filled, exercise unlock, look-back ready, graduation card, and the daily ask (at most once per day, lowest priority of the eight; conditions in [ux-engagement-logging/EXPERIENCE.md](../ux-engagement-logging/EXPERIENCE.md), added 2026-11-15). Otherwise Happi idles silently.

### Check-in chips (from D1)
- Once a day. The question rotates and never repeats on consecutive days: "How's today?" · "How are you feeling right now?" · "What's the weather inside today?" · "How's your head today?". Answers stay **Good · Okay · Low · Not okay**. Word chips only: no drag-a-face input.
- An answered chip collapses to one line ("Today: Okay").
- **Low** opens a follow-up row: "Want to start small?" with **Catch the thought behind it** (becomes the CTA), **Breathe for a minute**, **One small thing** (once Behavioral Activation is unlocked), **I'm struggling** (opens the Distressed variant).
- **Not okay** opens the Distressed variant at once.
- The rotating question is app UI label text above the chips, never a Happi bubble (the bubble list above has no check-in entry). Pronouns: none.

### Memory callbacks
- Recall only the last **saved** reflection, never a reflection saved in a Low or Not okay session, and never an unrelated heavy topic. Every recalled line carries **Why am I seeing this?** (≥44 pt hit area).
- Callbacks read as care; repetition reads as boring, so greeting and check-in wording rotate.

## 14. Lapse and return

Never name the gap. One ask per surface. Pushes are sent once per lapse and then stop.

| Gap | Push | Home variant | Primary CTA | Bubble / H1 |
|---|---|---|---|---|
| 3–6 days | N1 until N4 | Lapsed 3–6 | **Catch a thought** | "Good to see you." |
| 7–13 days | None (N4 has paused reminders) | Lapsed 7–13 | **Start with a 30-second check-in**; link **Or catch a thought** | "Good to see you." (variants "Easy does it.", "Glad you're here.") |
| 14–29 days | N5, next Monday 12:30 | Lapsed 14–29 | Same as 7–13 | H1 "New week." on Mondays, "New month." on the 1st, else "Good to see you." |
| 30+ days | N6, 1st of the month 12:30, then silence for good | Lapsed 30+ | Two equal outline buttons: **Pick up where you left off** / **Start with a short check-in**; link **Change reminders** | "Good to see you." |
| After a return | None | Post-return week (7 days) | As D2–D6 (adaptive on chips) | After the first practice: "That's one more kept." (once) |

- **Recall line (7+ days):** "Last time, you wrote: '{quote}'" with **Why am I seeing this?**. Fallback when recall is off, or nothing is saved: **"Your reflections are right where you left them."**
- **Hidden on lapsed returns:** Explore, Pattern line, Look-back, SignupNudgeCard; automatic PremiumSheet presentation on 14+ (the §4 rule); on 30+ also ProgressPair (until the first practice since the return) and the graduation card (until two practices since the return).
- **Lapsed 30+:** Happi Resting, then Welcome back (≤1,800 ms, at most once per 24 h; never sad, thinner or "waiting"). Scope card: "Happy helps you practice CBT skills. It isn't therapy and doesn't replace professional care." with a **Show Happi** switch and **Got it**. Above it, the reassurance line **"Your reflections are saved. Start wherever feels right."** No chips.
- **Reminders link** (7+ days): **Turn reminders back on**, shown when N4 paused them. Under 7 days the same open shows the inline **Keep reminders?** row instead (§9).
- **Greeting:** "Good to see you." (or "New week." / "New month.") is the H1 in `title`. The return bubble, when shown, is Happi's variant line ("Easy does it.", "Glad you're here.") or silence; the same sentence never appears as both H1 and bubble. [ASSUMPTION: strategy shows both with identical text]
- **Post-return week:** Home keeps the last reflection pinned; Look-back and the graduation card wait for 2 practices since `returned_at`. No "back on track" or count language.
- **Progress:** ProgressPair returns after the first practice with the lifetime count intact; a fresh week is never shown as broken.
- Win-back copy tables and the three push variants: `docs/research/winback-copy.md`. All of it is untested inference until E12 reports.

## 15. Notifications

At most **1 push per day** (up to 7 a week; the skip rule makes 3–6 typical). The slot picker offers 08:00–21:30 local only. Signed "Happy", never voiced by Happi. No thought, mood or reflection content in any push, widget or lock screen. Skipped if the user already practised, and on any day the Distressed variant was shown, with one exception: N8 (below) is never skipped. Skipped too when the user graduated to "I'll come when I need it" (N5 and N6 included).

| # | Push | Trigger | Copy |
|---|---|---|---|
| N0 | Reminder ask (in-app) | Saved card | "Want a nudge for your next one?" with sample "Happy — What's been on your mind today?" |
| N1 | Daily reminder | User slot, D1+ | Rotates: "What's been on your mind today?" · "One thought, two minutes, whenever you're ready." · "A quick check-in is here when you want it." · "Anything sticking with you today?" · "Two minutes for you." |
| N2 | Suggested slot | No slot chosen, D1, D3, D5, 12:30, 3 total | "One thought, two minutes, whenever you're ready." |
| N3 | Skip rule | Practised today | No send (a rule, not a push) |
| N4 | Pause notice | 3 consecutive reminders ignored (no open within 6 h) | "Happy will pause reminders for now. You can turn them back on anytime in Account." Next open shows the inline **Keep reminders?** row (§9) |
| N5 | Fresh start | Gap ≥ 14 days, next Monday 12:30, once per lapse | Variants A/B/C in `winback-copy.md` (A: "New week. Happy's here whenever you are.") |
| N6 | New month | Gap ≥ 30 days, 1st of month 12:30, once, then silence | Variants A/B/C in `winback-copy.md` (A: "New month. One small thought, whenever you're ready.") |
| N7 | Look-back ready (opt-in) | Monday, ≥2 practices last week; replaces that day's N1 | "Your week, in three cards." |
| N8 | Trial ending | 2 days before charge; push at the user's slot plus in-app banner | Push: "Your free trial ends in 2 days. Nothing changes for your saved reflections." Banner: "Trial ends {date}. You'll be charged {price} unless you cancel. Manage" |

- **Banned pushes:** streak-saver, "we miss you", "Happi is waiting", FOMO, discount pushes.
- **N8 is mandatory.** It is sent even if reminders are paused, if the user already practised, on a Distressed day, and after graduating to as-needed; if push permission is denied the banner carries it alone. It takes the day's single push slot. With no slot chosen it goes at 12:30. [`retention-strategy.md` §7.4 still gates N8 behind those skips; reconcile it.]
- Duolingo stops after about 8 ignored reminders and says so on return [RG14]; Happy's N4 stops after 3.
- Other skipped and sent decisions follow `retention-strategy.md` §7.4. Graduated "weekly" users get one Monday reminder in place of N1; N7 replaces it when opted in.

## 16. Distress and crisis

### Distressed variant (overrides every Home state)
- **Trigger:** a Not okay chip, "I'm struggling" in the Low follow-up, a crisis phrase in any session within the last 24 h, or a positive risk item (§17).
- **Screen:** H1 **"That sounds hard. Let's go gently."**; three full-width options of equal weight: **Breathe with me — 1 minute**, **Write down the loudest thought** (short Thought Catcher), **Talk to someone now**, which opens the Crisis sheet (region helplines first, then **Can't call right now?** with **Make a safety plan** and **Grounding for 1 minute**). [ASSUMPTION: always the sheet, never an inline expansion, so nothing animates]
- **Hidden:** paywall, signup, progress, pattern, look-back, Explore, milestone modals, all bubbles.
- **Happi:** Gentle concern, small, no bubble, 300 ms fade. On the crisis sheet itself: no Happi, 0 ms, no sound, no haptics, no motion.
- **Next open within 24 h:** the check-in chips sit above the three options and read **How are you now?** with **Better · About the same · Still not okay** (the last re-enters this variant). **Better** returns Home to normal with no recap when the trigger was a chip or **I'm struggling**. A crisis phrase or a positive risk item holds the Distressed variant for the full 24 h whatever the chip says; the user can still reach everything through the options and the pill. [ASSUMPTION: clinician to confirm]
- **Free:** every exercise reachable here is free, always.

### Get help
- A **Get help** pill (outlined, never filled) in the header of every Home state, and a text button on every free-text screen (S2 personal branch, Thought Catcher, any journal field). Reachable in 2 taps or fewer from anywhere. The Settings row **Get help now** also stays (soul/06). The header's **help icon** is separate: a general help screen, never a crisis route.
- Tap shows region helplines first (call or text), then **Can't call right now?**.
- Disclaimer lines: "Happy isn't an emergency service. If you might act on these thoughts, call now." and "In danger right now? Call {emergency}."
- Crisis phrases are matched **on the device**, never block the field, open the sheet at most once per entry, cancel any AI request for that entry, and send no text anywhere.

### Helplines (shown by device region; bundled table re-verified every 90 days)

| Region | Lines | Confidence |
|---|---|---|
| US | 988 (call or text); Crisis Text Line, text HOME to 741741 [RG24][RG25][RG26] | high |
| UK | Samaritans 116 123; NHS 111 mental-health option; 999 if life is at risk; Shout, text 85258 [RG27][RG28][RG26] | high |
| India | Tele-MANAS 14416 / 1-800-891-4416 [RG55] | medium; secondary sources only |

Other regions use the soul/06 locale table. **Never list KIRAN (1800-599-0019):** merged into Tele-MANAS and phased out [RG29].

### Wording rules for all copy
- **FDA wellness line:** "manage stress", "feel calmer", "self-esteem" are fine; "treats anxiety" or any diagnosis claim is not [RG22]. Applies to pushes, win-back, graduation, store listing and paywall.
- **Safe messaging** (Action Alliance): never show methods or locations; never glorify; never portray suicide as common or inevitable; never oversimplify causes; never "committed" or "successful"; say "died by suicide"; pair any mention with help and hopeful framing [RG23][RG52][RG53][RG54].
- Apple and Google both require honest health claims and have no crisis rules of their own [RG48][RG49]; the sheet above is Happy's own responsibility.

## 17. Wellbeing check (PHQ-4 and risk item)

- **What:** PHQ-4 (four questions, scored 0–3, two-week recall, total 0–12; each subscale positive at 3 or more) [RG15][RG16][RG17]. Opt-in, never gating practice.
- **When:** at most every 14 days. A quiet prompt card ("A two-minute look at how you've been. Want to?" **Yes** / **Not now**) on a calm Home from D14 with n ≥ 4, never Low, Not okay, or a lapsed return; or from Account. Declining is respected (§9). [ASSUMPTION: eligibility]
- **Form:** a full-screen sheet; one question per screen; four PHQ-4 questions then the risk question last; **Skip** on each; **Not now** at any point. Skipping a PHQ item leaves the check unscored (nothing is stored or shown as a result); closing mid-check saves nothing and the prompt is not shown again for 14 days. Entry points and recall are never gated on completing it.
- **Risk item:** PHQ-4 has no suicide question [RG17], so one separate risk question is asked with it. Any non-zero answer opens the Distressed variant, then the Crisis sheet (§16). A skipped or unanswered risk question shows one plain line, "Get help is always at the top of Home.", and does not open the Distressed variant. Wording and the response protocol need clinician sign-off before build.
- **Display:** the user sees plain words about the change, not a diagnosis: no "depression" or "anxiety disorder" label, no clinical banding. Results compare to the user's own earlier results only (smartphone-administered scores can read higher than paper [RG37], so never compare to paper bands).
- **Belief slider:** stays in Thought Catcher as an optional progress signal, not an outcome measure (no outcome validation found [RG18]).
- **Privacy:** answers stay in the account; analytics carry scores only, never free text, and follow the first-party-only rule in §8.

## 18. Graduation

- **Offered once, from D30+,** when all hold (thresholds are inference; clinician sign-off required): at least 8 weeks since activation, at least 8 completed practices, PHQ-4 total on the latest check lower than the first with no subscale at 3 or more, and no Not okay chip in the last 14 days [RG19][RG20].
- **Card:** bubble "You've built a real skill." / "You've built a real skill. How often do you want Happy now?" Equal-weight options: **Keep my daily reminder** · **Switch to a weekly check-in** (one reminder a week, Mondays) · **I'll come when I need it** (all reminders off; Home stays fully usable; Get help stays).
- **Needs two PHQ-4 results** (the "latest lower than the first" test); a user who keeps the wellbeing check off is never offered the card, and can change cadence from Account (**Change how often**). [ASSUMPTION]
- **Never forced.** Hidden until 2 practices since a return, and in any Distressed or Low session. If ignored it stays pinned; **Not yet** hides it for 30 days.
- **Way back:** **Back to daily** lives permanently in Account and on the maintenance Home, one tap, no recap. Relapse is common (about 66% within a year after low-intensity care, single source) [RG20].
- **Graduated users** are a separate segment, excluded from churn; success is reporting Okay or better when they return.

## 19. Conflicts resolved against soul/06 and the retention strategy

| # | soul/06 or earlier spec said | Retention strategy / this spine says | Decision |
|---|---|---|---|
| C1 | Return recall: "From your note on {date}: '{quote}'" | "Last time, you wrote: '{quote}'" | This spine's wording wins; **Why am I seeing this?** link from soul/06 kept |
| C2 | Recall off: "Last time you practised: {exercise}." | Fallback "Your reflections are right where you left them." | Strategy fallback wins: when recall is off, no last-session detail is named |
| C3 | Crisis entry only in Settings (2 taps) and on free-text screens | Get help pill on every Home state | Both ship; the pill is the stricter rule |
| C4 | Home check-in: 12 feeling words, "Which word fits right now?" | Four routing chips with a rotating question | **Closed 2026-11-15.** Four chips kept because they drive Home routing; no feeling-word second step |
| C5 | Home flame pill replaced by a leaf "days practised this month" counter | Practice count plus weekly ring (decided 2026-10-31, Q4) | This spine wins; soul/06's **Hide counter** kept as Hide progress |
| C6 | D0 Home shows `StarterPathNextActionCard` as the next step | D0 is a closure state: no filled CTA; link "Catch another one" | Strategy wins; the Starter card moves to D1. [ASSUMPTION] pending confirmation |
| C7 | Completion screen "Saved. It's yours." with no ring | Saved card shows count and weekly ring | This spine wins; the ring has no fail state |
| C8 | Notification body "Ready to catch one more thought? 2 minutes." | N1 rotates five templates | N1 rotation wins |
| C9 | Onboarding keeps 5 of 7 steps | Two screens plus Home | Already superseded in `.memlog.md` (2026-10-31); no change |
| C10 | Happi absent on the reminder pre-prompt and paywall (absence zones) | Saved card carries the reminder row | Happi holds still (no motion) on the reminder row and the Premium sheet; absent on the crisis sheet |
| C11 | Low-tagged entries never recalled unless saved as a coping card | Recall only the last saved reflection | Compatible; soul/06 rule kept |
| C12 | Strategy §5.1 D0 sub: "Come back when another thought sticks around." | §3 bans "come back" | This spine drops the phrase: "Whenever another thought sticks around, catch it here." |
| C13 | Strategy N4 "We'll pause…", winback-copy "Happi's here" | Pushes are signed Happy, never Happi, no "we" | N4 and N5 say "Happy" |
| C14 | Strategy §7.4 skips N8 on practised-today, Distressed-day, graduated | N8 is mandatory | This spine wins; strategy §7.4 to be updated |
| C15 | Strategy §5.8 and soul/06: bubble and H1 both "Good to see you." | One greeting per screen | H1 carries it; bubble is a variant line or silence. [ASSUMPTION] |
