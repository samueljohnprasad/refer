# Happy — User Voice Deep Recon Report
**Type:** user-voice | **Preset:** standard | **Topology:** breadth-first | **Depth:** 2 | **Threads:** 3 | **Sources:** 24+ clusters · **Deepened:** 2026-11-09 (Round 2: retention voices)

> [!IMPORTANT]
> This report is the primary Sprint 1 calibration artifact. Every copy word, prompt, and UX pattern decision should be weighted against this user-voice evidence base.

---

## Executive Summary

Three parallel research threads returned strong signal across all 4 approved dimensions. The overarching finding: **the gap between what mental health apps promise and what anxious users can actually execute in real time is catastrophic — and almost entirely preventable with design choices.**

Happy's unbreakable streak model, Zero-Friction Triad, and symptom-first language approach are each validated by real user pain data. The research also surfaces 3 unexpected design signals not in the existing PRD.

---

## Dimension 1 — Blank-Slate Fatigue & Drop-off

### Core Finding
**30–50% of mental health app users abandon after 1–2 sessions.** Peak abandonment: days 1–10. Not because users lack motivation — because the apps fail them at the first interaction.

### The 8 Friction Archetypes

| # | Archetype | User Language |
|---|---|---|
| 1 | **Blank Canvas Wall** | "cursor blinking at me", "nothing hits my mind" |
| 2 | **Performance Trap** | "feel stupid", "needs to be profound", "second job" |
| 3 | **Overwhelm Paradox** | "too much to write, so I write nothing" |
| 4 | **Shame Spiral of Abandonment** | "excited for 3 days, forget it exists by day 7" |
| 5 | **CBT Jargon Overload** | "filling out a digital spreadsheet" |
| 6 | **Notification Guilt** | "less like a reminder, more like a failure" |
| 7 | **Robotic Scripted Paths** | "silly, patronized, downright stupid talking to a screen" |
| 8 | **Paywall Mid-Onboarding** | "aggressive pop-up right when I'm trying to figure it out" |

### Workarounds = Design Goldmines

Users invented these escapes — Happy should productize them:

- **Write the literal truth first** → Happy onboarding prompt: *"Not sure what to write? Type that."*
- **Voice rant → transcribe** → Voice-first capture mode for overwhelmed sessions
- **Brain dump bullets** → Non-prose structured dump as a valid entry type
- **One-sentence permission** → Entry goal = 1 sentence minimum, celebrate that
- **The Ugly App trick** → Deliberately low-stakes visual design reduces "official journal" performance pressure

### Happy Sprint 1 Implications
- **NEVER** open to blank text field. Always lead with: mood tap → panda prompt → or sentence starter
- Onboarding copy: *"Nothing has to be perfect here."*
- "I'm too overwhelmed to think right now" = valid first-session entry mode (1-tap → panda comfort card)

---

## Dimension 2 — The Streak Guilt Trap

### Core Finding
**Streak mechanics are the #1 churn trigger for the exact demographic Happy targets** (anxiety, ADHD, neurodivergent users). The guilt-avoidance-deletion spiral is documented verbatim across Duolingo, Finch, and journaling app communities.

### The Guilt Spiral (Exact User Words)

```
Miss a day → "devastated" → "mourned the lost time" → "deleted out of spite"
                                        ↓
                 "impossible to restart" → "all-or-nothing" → app deleted
```

### Most Damaging Mechanic Patterns

| Pattern | Why it fails | User quote |
|---|---|---|
| Streak counter resets to 0 | Triggers grief, not motivation | "I mourned the lost time" |
| Streak freeze/repair | Feels like cheating, invalidates streak | "It invalidates the whole thing" |
| Pet that looks sad when you miss | Guilt by proxy — backfires hard | "Triggers intense guilt and emotional distress" |
| "You missed X days!" notifications | Reads as accusation, not care | "Less like a reminder, more like a failure" |
| Binary success/failure mechanic | ADHD/anxiety → all-or-nothing collapse | "Shatters the all-or-nothing mental model" |

### ✅ Happy Unbreakable Streak — VALIDATED

**The user data directly validates Happy's unbreakable cumulative streak design.** Users explicitly describe wanting:

> *"Let me feel like a winner even after I miss a day"*
> *"Show me I'm still making progress even when inconsistent"*
> *"Help me restart without shame"*
> *"Don't make my healing feel like homework"*

Happy's pure cumulative counter (never resets, never breaks, every return day adds 1) is precisely the mechanic users describe wanting but have never found.

### Re-Entry Interception is Critical
**Streak guilt peaks at the re-entry moment** — not when the streak breaks, but when the user SEES the broken state. Happy's panda must intercept at that exact first-open-after-gap frame with compassion copy, not guilt mechanics.

**Suggested panda message on return after absence:**
> *"You came back. That's what counts."* + [Log today →]

---

## Dimension 3 — Acute Panic Workarounds

### Core Finding
**During actual panic, every existing app fails.** The bar is zero cognitive load. Users have built workarounds that are somatic, sensory, and social — not cognitive.

### What Users Actually Do During Panic

| Workaround | Mechanism | Happy Signal |
|---|---|---|
| Cold water on wrists | Sensory interrupt — dives the heart rate | SOS card: temperature anchor |
| 5-4-3-2-1 grounding | Attentional redirect — sensory present-moment | Already a coping card type — validated |
| Sour candy | Taste intensity breaks adrenaline loop | Novel SOS card idea |
| Clock-watching ("30 min") | Temporal reassurance — "it will pass" | Panda line: "This won't last. 20 minutes." |
| Text a friend random things | Social presence > advice | Panda proxy: "I'm here. Tell me anything." |
| Physical notebook dump | Unfiltered, analog, tactile | Voice dump fallback in SOS mode |

### Why Apps Fail During Panic (Exact User Language)

> *"Can't focus on swiping through menus, waiting for a loading screen... useless in an actual emergency."*

> *"CBT is great for therapy, but asking me to write down my distorted thoughts while I feel like I'm dying makes no sense."*

> *"Absolutely predatory when someone is panicking."* *(on subscription paywall during panic)*

### Happy SOS Design Principle
**One tap from locked screen → somatic intervention in 3 seconds.** No menus. No reading. No subscription wall. The panda must be present instantly.

JTBD: *"Don't make me think — make me feel different."*

---

## Dimension 4 — Natural User Lexicon

### The Master Vocabulary Translation Table

| NEVER use in Happy UI | USE instead |
|---|---|
| Rumination | "looping thoughts", "replaying", "stuck in my head", "can't let go" |
| Catastrophizing | "going to worst case", "spiraling", "making it bigger than it is" |
| Cognitive distortion | "unhelpful thought pattern", "your brain doing that thing again" |
| Affect dysregulation | "feeling out of control", "overwhelmed", "all over the place" |
| Anhedonia | "nothing feels good right now", "going through the motions", "feeling empty" |
| Psychoeducation | just teach through doing, never name the framework |
| Cognitive restructuring | "Let's look at that thought differently" / "flip it" |
| Intrusive thoughts | "thoughts that won't leave", "the voice that keeps going", "brain noise" |
| Check-in (clinical) | "How are you right now?" / "Let's see where you're at" |

### Universal Anxiety Vocabulary (Use These Directly in UX Copy)

**Body:**
- "chest feels tight", "heart won't slow down", "wired but exhausted", "running on empty but can't switch off"

**Mental:**
- "racing thoughts" *(most universal)*, "brain fog", "my brain won't shut off", "a browser with 100 tabs open", "scrambled eggs", "ball of tangled wires"

**Panic:**
- "doom spiral", "panic loop", "out of nowhere it just... hits", "like I can't breathe even though I can"

**Rumination:**
- "stuck in my head", "replaying every awkward thing I said", "living rent-free in my head", "can't stop overthinking", "snowballs so fast I can't stop it"

**Distortions (user language):**
- "going straight to worst-case", "waiting for the other shoe to drop", "anxious about being anxious", "I just KNOW they think I'm an idiot", "I always mess everything up"

### Retention Language (What Users Say When It Works)

> *"It talks to me like a person, not like a patient."*
> *"Even on my worst days I can manage it."*
> *"The heatmap shows me I'm doing better than I feel."*
> *"My brain feels quieter."*
> *"It doesn't feel like an app anymore, it feels like a habit."*

**Winning principle:** **Symptom-first, science-second.** Accept "my brain won't stop" as valid input before ever introducing a framework name.

---

## Cross-Dimensional Synthesis — 5 Sprint 1 Imperatives

### 1. Zero Blank Fields in First 7 Days
Every session entry point must be scaffolded: mood arc → panda prompt → or coping card tap. Blank text fields are catastrophic for the anxiety/ADHD user. Weeks 1–2 = maximum scaffolding, tapering as habit forms.

### 2. Symptom-First Language Everywhere
Audit every string in the codebase for clinical language. Replace with user vocabulary from the table above. The panda speaks in user language, not DSM language.

### 3. Re-Entry Compassion Frame
First open after any absence: panda appears with compassion message before any streak display, any metric, any prompt. Copy: *"You came back. That's what counts."* — streak counter appears AFTER this beat.

### 4. SOS = 1 Tap, Zero Friction
Pocket coping cards must be accessible from the lock screen (notification widget or home screen shortcut). No authentication wall, no menus, no paywall. Somatic interventions go first (5-4-3-2-1, temperature, pacing). CBT reframing stays for post-acute reflection.

### 5. Obligation-to-Perform Is the Enemy
Every panda message, every notification, every copy beat must pass this test: *"Does this feel like the app serving me, or me serving the app?"* Streak is cumulative. Panda never looks sad. Notifications feel like a friend, never an alarm.

---

## Unexpected Signals (Not in PRD — Consider Adding)

1. **"Anxious about being anxious" loop** — users describe meta-anxiety (anxiety about their own anxiety) as a distinct pain. Panda intervention: *"Even feeling anxious right now is okay."*

2. **"It gave me something concrete to bring to my therapist"** — therapist handoff as a retention driver and premium value prop. Could be a Vault export or Weekly Summary PDF for therapy sessions.

3. **"Clock-watching / 30-minute reminder"** — temporal reassurance is an untapped somatic coping strategy. *"Panic peaks in 20 minutes. You can do 20 minutes."* — pure timer with panda presence.

---

## Appendix — Source Clusters

| Thread | Dimension | Sources |
|---|---|---|
| A | Blank-Slate Fatigue | r/Journaling, r/Anxiety, r/ADHD, r/mentalhealth, Reflectly/Woebot/Journey reviews, JMIR meta-analyses |
| B | Streak Guilt + Panic | r/Duolingo, r/Anxiety, r/selfcare, r/mentalhealth, Finch/Calm/MindShift reviews |
| C | Natural Lexicon | r/Anxiety, r/ADHD, r/mentalhealth, r/selfimprovement, Daylio/Finch/Woebot reviews, HCI research (mdpi.com, sigma.software) |

*Full verbatim quotes and source URLs in individual digest files:*
- [`digest-A-blank-slate-fatigue.md`](digests/digest-A-blank-slate-fatigue.md)
- [`digest-B-streak-guilt-panic.md`](digests/digest-B-streak-guilt-panic.md)
- [`digest-C-natural-lexicon.md`](digests/digest-C-natural-lexicon.md)

---

## Deepening — Round 2: Retention voices (2026-11-09)

**Why this round.** Decision served: confirm or change the Home lifecycle, notification rules, recall, Happi's role, graduation offer and paywall placement in `docs/research/retention-strategy.md`, using real user words. Four parallel researchers (Q1–Q7), ~110 tool calls, sentiment window 2025-05+ where available. Digests: `digests/D-r2-*`, `E-r2-*`, `F-r2-*`, `G-r2-*`.

**Coverage warning.** reddit.com was unreachable from the research tools this run. Reddit voices come only from one snapshot mirror (r/finch, r/ADHD, r/UXDesign threads). App Store, Trustpilot, review aggregators, journalism and published studies fill the rest. Prevalence claims below are limited to themes with two independent communities or a published study; everything else is labelled.

### R2.1 Why people stay
- **Attachment to a character keeps people coming back** (HIGH — two apps, a published study theme). "the bird is too cute to disappoint" (Finch, App Store via Appbot, 2023-07); "Wysa's has a cute personality, which is what keeps me coming back" (Wysa, Google Play in a 2024 *mHealth* thematic analysis, PMC11304096). Five distinct voices, Finch + Wysa.
- **Accumulated history is a tether — and a source of stress** (MEDIUM-LOW, Finch only). "too afraid to let it go after all these years and a 400+ day streak" (r/finch, 2026-04); "haven't missed a day in 4 years" in a 2-star review calling the app "a daily source of stress" (Trustpilot, 2026-06); "Still love my birb, but that's how they got us to stay. It's underhanded" (r/finch, 2026-04). INFERENCE: the streak keeps people present, not necessarily well.
- **Low effort plus patterns over time** (MEDIUM, Daylio, mostly 2019–2021 reviews, one 2025-12): reports that "assess correlations between moods and behaviours".
- **Small wins without scolding** (MEDIUM, Finch, App Store + Reddit): "gamifies 'the little wins' in the day"; "I feel so much more grounded".

### R2.2 Reminders and notifications
- **Streak reset → shame → quit** (HIGH — r/ADHD and r/finch, independent threads, plus Trustpilot). "build a streak, have one bad day, see the reset, feel immediate shame, never open the app again" (r/ADHD, 2026-04); "it punishes you for being human instead of showing you how far you've actually come" (same thread). Counter-voice in the same thread wants a frequency goal: "if I fail one day, it doesn't kill the streak".
- **Guilt pushes read as deliberate manipulation** (MEDIUM — clear sentiment, but the sharpest quote is about Duolingo): "The notifications make you feel guilty, yes, that's the entire point." (r/UXDesign, 2026-01). Finch compared to "a casino" (r/finch, 2026-04).
- **One user-chosen daily reminder is accepted** (LOW — ~2 direct voices; Daylio reviewer credits "reminders and goal-setting" for an 869-day run). Counter-voice: some ADHD users want reminders that are harder to ignore (r/ADHD, 2026-05).
- **Promised trial-end notice that never arrived** (Finch, Trustpilot 2025-10) — see R2.6.

### R2.3 Being remembered
- **Callback reads as care** (MEDIUM — one diary study, n=26, Woebot/Wysa, 2025, PMC12552820): "It made me feel like he remembered and cared about what I'd shared, which made me feel that our relationship was deepening."
- **Repetition and forgetting erode value** (MEDIUM-HIGH — two independent studies + store review): "The chat keeps asking the same mood question every day… It gets kind of boring." (same diary study); "After a few months' usage, the AI starts to sound very redundant" (Wysa, *mHealth* 2024); "If I accidentally exit out of the chat feature, I can't go back in to work on the same thought" (same).
- **Over-applied memory feels intrusive** (LOW-MEDIUM — one outlet, general-purpose ChatGPT): "I wasn't trying to have you opine about my divorce at every chance" (Futurism, 2026-05).
- **Users want control over what resurfaces** (LOW — Day One forum 2023, plus a per-journal "On This Day" toggle that shipped). No user voice found about painful entries resurfacing in a mental-health app.

### R2.4 Mascot and companion
- **Bonding drives return** (HIGH, as R2.1). "take care of someone while they were taking care of me too" (Finch, grieving user, Appbot 2026-08).
- **Losing progress feels like grief** (one verified voice): "Finch broke my heart I cried for days" after losing 2 years of progress (Appbot 2026-08).
- **Guilt from neglecting the pet:** not verified — only spam-like pages. Engadget's reviewer reports Finch "doesn't take the guilt approach".
- **"Silly" or "condescending"** (LOW-MEDIUM, minority): "I used to feel silly 'talking' to a cartoon penguin AI bot" — the reviewer says it passed. The "Condescending and inane" review targeted a drag-the-smiley mood input in onboarding, not the penguin (INFERENCE).
- **Wanting to turn the character off:** not found.

### R2.5 Coming back, and stopping because better
- **Return moments:** no verified user quotes on what triggers a return or how re-entry feels this run. Company-side signal only: Finch shipped "App Pause" to pause without losing progress (search snippet, page not fetched).
- **"E-attainment" is a published construct** (MEDIUM — peer-reviewed, 2019): "the discontinuation of eMH engagement after personal goals have been met"; trial attrition "may reflect e-attainment" (JMIR 2019, PMC6908978). A 2024 JMIR scoping review codes "No need to track anymore" as one abandonment reason (PMC11694054). A Berkeley Help@Hand evaluation reportedly found 13% stopped Headspace because they no longer needed it — **unverified** (PDF not extracted).
- **Value fading into a chore** (LOW, one thread): "it's not really helping me anymore and is just one more thing to do before bed" (r/finch, 2026-04) — ambiguous between improvement and staleness.
- **Episodic, reactive use** as a recognised pattern (JMIR mHealth 2026) — **unverified**, abstract summary only.

### R2.6 Paywall and onboarding
- **Trial auto-charge anger** (HIGH — 5 voices, Finch/Headspace/Reflectly, Trustpilot + aggregator; Appbot's analysis of 40,294 Finch reviews Aug 2025–Aug 2026: ~6.7% of negative/mixed reviews cite trial auto-charges, pricing 21–27%). "being told they would sent a notification before the end of the trial. Never got one and got charged 80 euros" (Finch, Trustpilot, 2025-10).
- **Paywall before the user knows the app** (MEDIUM — Finch, Earkick): "offered a 'free trial' OR discounted subscription for Finch Plus (without knowing what Finch plus means & never having used the app)" (Trustpilot, 2026-03); "locked after one AI chat… please just tell us that upfront" (Earkick).
- **"Help apps should help people who can't afford help"** (MEDIUM — 2 voices + JMIR preprint snippet on "subscription gatekeeping").
- **Constant upsell** (MEDIUM): "constantly bugged with 'so you want to upgrade?' notifications" (Reflectly).
- **Fair = usable free core, optional extras, pay-what-you-can** (MEDIUM, mostly second-hand: Wysa, Finch "Can't Afford It", Earkick).
- **Onboarding:** forced login that lost data (Reflectly, 1–2 voices). No user complaints about long quizzes were found; evidence there is industry teardowns only.

### R2.7 What this changes in the retention strategy

| Retention-strategy decision | Round-2 effect | Change |
|---|---|---|
| Reject daily streak; lifetime count + weekly ring (§4.4) | **Strengthened.** Reset→shame→quit is HIGH; a user asks for exactly a frequency goal that "doesn't kill the streak". Long streaks do tether people, but long-streak users also report stress and manipulation | Add: the lifetime count must survive device loss — progress loss reads as grief. Sign-in/backup copy ties to this |
| D1 recall bubble, recall line on return (§5.2, §5.8, §6.3) | **Strengthened** (callback = care) and **refined** (repetition = boring) | Add: rotate the check-in question and the greeting; never ask the identical question two days running. Recall only the last *saved* reflection, never unrelated heavy topics |
| Happi as companion (§5, §6.4) | **Strengthened** (HIGH) | Add: inputs stay adult — word chips, no drag-a-smiley. Keep the "Show Happi" toggle (no demand found; low cost) |
| Notification rules N1–N8 (§6.1) | Guilt pushes confirmed as manipulation; trial-notice failure is a top complaint | N8 becomes mandatory and doubled: push **and** an in-app banner 2 days before charge; the paywall states the charge date up front |
| Paywall once at 600 ms after value (§6.5) | **Strengthened** — "paywall before I know the app" is a named complaint | Add: never a paywall before the first saved reflection (already); free core includes every CBT exercise used in distress |
| Graduation / maintenance mode (§4.6) | Evidence upgraded from grey to **one peer-reviewed construct** (e-attainment, 2019) + a scoping review | Cite JMIR 2019 and 2024; thresholds still inference |
| Win-back copy (§6.2) | No new evidence — still designed from principles | Unchanged; gap remains |

### R2.8 Still open
- Return triggers and re-entry feelings (no verified voices).
- Users asking to hide the mascot.
- Painful entries resurfacing.
- Notification-volume complaints for Headspace/Calm.
- Reddit access: the largest single gap. The next run should use a working mirror or have the user paste threads.
