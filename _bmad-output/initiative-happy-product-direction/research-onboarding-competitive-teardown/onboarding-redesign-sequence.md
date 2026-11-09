---
type: spec-draft
topic: Happy onboarding redesign — sequence, asks, guest state
created: 2026-10-31
inputs: onboarding-first-use-decision.md, current-state-first-use-audit.md, research-onboarding-competitive-teardown.md (Q3/Q4), Mobbin searches 2026-10-31
status: draft for review
---

# Onboarding redesign: what shows when

**Rule:** one ask per moment, and every ask comes after the value it protects. Nothing blocks the useful loop: no account, pledge, reminder, or paywall before the first saved reflection (decision record guardrail).

## Flow: two screens, then Home

Test for keeping a screen: it must make the user believe something new or do the skill. A screen that only transitions, loads, pledges, or repeats gets cut or folded.

| # | Screen | What happens on it | Belief it carries |
|---|---|---|---|
| 1 | **What's on your mind?** | Calm one-line intro + 5 goal options (worry, low mood, stress, self-talk, sleep). Tap = start. Anonymous session created silently on tap | "This fits me, and it's easy" |
| 2 | **Thought Catcher (chat)** | Happi opens by naming the goal back ("Worry runs ahead of the facts. Let's catch one."). Worked example as chat with quick replies, one recall tap, under 60s. Ends with three equal quick replies: **Try with something from today** / **Another example** / **Continue**. Personal branch (under 90s) runs in the same chat. Ends on the **saved card**: reflection, "Practices completed: 1", ring "1 of 3 this week", and one inline reminder question (time chips + "Not now") | "I can do this, and it's mine" |
| — | **Home** (not onboarding) | Saved card on top, next lesson below. Premium sheet shows once over it | "My work is kept; I know what's next" |

Signup is not a step. It appears by trigger (below).

### Cut and why

| Current / earlier-draft screen | Decision | Why |
|---|---|---|
| Entry "Begin" (`app/index.tsx`) | **Merge** into screen 1 | Tap on a goal is the start; a Begin button is one extra tap with no belief |
| `welcome` | **Cut** | Duplicate of entry |
| `building_journey` (fake loading) | **Cut** | Personalization theatre; reads an unasked question |
| Mirror line (earlier draft) | **Fold** into Happi's first bubble | One sentence does not need its own screen |
| "Your turn?" choice (earlier draft) | **Fold** into chat as quick replies | Choice is a conversation turn, not a page |
| Personal practice (earlier draft) | **Fold** into the same chat | Same skill, same thread; a new screen breaks flow |
| `milestone_celebration` pledge | **Cut** | Commitment before value; streak framing contradicts Q4 |
| Separate Saved screen (earlier draft) | **Fold** into chat end card | The payoff lands where the work happened |
| `notification_permission` (3 slots) | **Fold** into saved card as one inline question | Ask sits on the value it protects; native prompt only on a time tap |
| `soft_paywall` as a step | **Move** to a one-time sheet over Home | Paywall after the loop, never inside it |

Result: 8 current screens become 2 plus Home. Every remaining ask (reminder, paywall, signup) lives after the first save.

## When each ask appears

### Notification permission — inline on the saved card
- **When:** right after the first save, framed as the next practice, not as "stay on track."
- **How:** inline primer (time chips) first; native prompt only when a time is tapped. Never fire the native prompt cold (a "no" there is permanent on iOS).
- **Copy shape:** time picker + preview of the real message ("Ready to catch one more thought? 2 min"). One reminder slot.
- **Mobbin:** Insight Timer pairs "When would you like to practice?" with the native prompt [IT]; Brilliant previews the real notification above the ask ("You're about to level up!") [BR]; Sweatcoin asks only after its first value starts ("We'll start converting your steps…") [SW]; Bumble and Lloyds give a plain "Not now / Maybe later" [BU] [LL].
- **Retry:** if declined, re-offer once, in context, after the 2nd saved practice. Never on app open.

### Signup — triggered, never in the onboarding path
User stays on the anonymous session until a trigger fires. Guest gets the full free product (same limits as a signed-in free user).

| Trigger | Surface | Copy shape | Dismiss |
|---|---|---|---|
| 1st save, on Home | Quiet card at top of Home: "Keep your reflections safe" | Real benefit: survive reinstall, new phone | Yes, card stays until done or closed |
| 2nd saved practice | Bottom sheet, once | "Don't lose your 2 reflections" — Apple / Google / email | "Later" |
| Purchase or trial start | Sheet right after purchase | "Protect your subscription on other devices" | Required to restore across devices; still allowed later |
| Settings / restore / new device | Normal sign-in entry | — | — |

- **Mobbin:** Duolingo runs goal → level → daily goal → first lesson, then "Don't lose your progress! Let's create a profile" with **LATER** [DU]. Cal AI "Save your progress" [CA]. Vocabulary: "never lose favorites… when you reinstall or switch devices" [VO]. Blinkist "Save your purchase" after paying [BL].
- **Counter-pattern:** Headspace and Waking Up ask for an account before any value [HS] [WU]. Not adopted: it violates the guardrail and those apps lead with content libraries, not a skill the user must try first.
- **Code note:** wire the existing `SignInBottomSheet` (never presented today). Anonymous-to-account linking must keep saved reflections and RevenueCat app user ID. Fix the guest loop (`app/index.tsx:60-63`) and guest completion flag (`useCompleteOnboarding.ts:38`) first.

### Paywall — one sheet over Home, then contextual
- **First show:** once, on Home arrival after the save. Not before Home, not mid-loop.
- **Content:** lead with the guided journey available now and pattern insights that unlock after enough reflections (count, not consecutive days). Never list saved reflections as a paid benefit. Trial timeline with a reminder before charge; price and renewal legible; X visible from the start.
- **After dismissal:** contextual only, at a gated entry: 4th journal (`FREE_JOURNAL_LIMIT = 3`), a locked journey lesson, insight unlock tile. No timed re-pops.
- **Mobbin:** Headspace 3-step trial timeline (today / reminder / charge) [HT]; Waking Up states reminder 7 days before trial ends and "No Payment Due Now" [WU]; WHOOP gates insights on a count of 5 entries [WH].

## Engagement mechanics in the first session

- **Mirror, not theatre.** Life Reset reflects answers back ("Based on your answers…") [LR]; replaces Happy's fake "Analyzing your stress profile" loader.
- **Conversational practice.** Happi asks, user taps quick replies; free text only in the optional personal step.
- **Recall in-lesson.** Ahead uses a fill-in-the-blank recap mid-lesson [AH]; fits the Thought Catcher chat as one tap.
- **Progress, no pledge.** Me+ ends onboarding with a signed "contract" [ME]; Happy drops its pledge equivalent. Progress = lifetime count + weekly ring (Q4).
- **Day-2 hook.** Home shows "Next: Lesson 2 — catch a thought about tomorrow" so the reminder has something specific to point at.

## Analytics (no free text, ever)

`onboarding_goal_selected`, `worked_example_completed`, `practice_path_chosen {path}`, `personal_practice_completed {trap_id, rating_changed}`, `reflection_saved {count}`, `reminder_primer_shown`, `reminder_primer_answered {yes|not_now}`, `push_permission_result {granted|denied}`, `home_first_view`, `signup_prompt_shown {trigger}`, `signup_completed {trigger, method}`, `paywall_shown {placement}`, `paywall_dismissed`, `trial_started`.

Funnel to watch: entry → saved → home → day-2 return. Paywall and signup are secondary.

## Open

1. Signup trigger at 2nd save vs 3rd: test.
2. Reminder before or after Home: spec puts it before (continuation of the save). Alternative: first Home visit. Test if push opt-in is low.
3. RevenueCat template copy lives in dashboard; must match "Content" rules above.

## Mobbin references (iOS; capture dates not exposed)

- [DU] Duolingo onboarding — https://mobbin.com/flows/b0b4f93f-5637-46ec-9d77-49ecda6b991d
- [HS] Headspace onboarding — https://mobbin.com/flows/31b21791-dec6-448a-8253-648f5ebbba3e
- [HT] Headspace trial timeline — https://mobbin.com/screens/a9bf58c3-250a-4565-9808-c4722933ea54
- [WU] Waking Up onboarding — https://mobbin.com/flows/76fb3fc0-a8e4-41b5-904d-1f108dca056e
- [LR] Life Reset profile setup — https://mobbin.com/flows/e91bc9a4-db92-449a-8de2-2d5e81381f6b
- [ME] Me+ onboarding — https://mobbin.com/flows/627c7d90-e2f1-4d68-9db2-bf140530de34
- [AH] Ahead journey — https://mobbin.com/flows/49f4f375-29c0-4c70-8967-2fecca1d1ee5
- [WH] WHOOP behavior insights — https://mobbin.com/screens/95391958-b83f-4e49-a5e7-4bd6da98ac3a
- [IT] Insight Timer reminder — https://mobbin.com/screens/f7f2d2f9-85f2-43fa-9b9b-fd9a03a36804
- [BR] Brilliant reminders — https://mobbin.com/screens/c33921fd-b1a6-4f0e-8c59-70b4121a18c7
- [SW] Sweatcoin push ask — https://mobbin.com/screens/5d13e7ea-3b4a-43d1-b95f-d01a0fc084b2
- [BU] Bumble — https://mobbin.com/screens/be42614b-6115-4fe0-ac7b-4ef7f7954397
- [LL] Lloyds — https://mobbin.com/screens/0510d5f1-d6fa-46f2-8202-3525df1ec22e
- [CA] Cal AI save progress — https://mobbin.com/screens/276e3cb2-ab60-45f1-a6c6-56b179216258
- [VO] Vocabulary keep data safe — https://mobbin.com/screens/0a6c0994-1ce8-4782-ae0e-84eb5233d0cd
- [BL] Blinkist save purchase — https://mobbin.com/screens/1810475a-5918-4e5e-b308-5d1b9b8d3553
