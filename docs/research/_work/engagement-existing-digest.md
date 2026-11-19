# Existing-research digest for `engagement-and-logging.md`

Read 2026-11-15. Sources: `journey-and-rewards.md` (J&R), `retention-strategy.md` (RS), `reward-screens-craft.md` (RSC), `winback-copy.md` (WB), `soul/00..06` (P1..P6), `.agents/skills/rossark-motion-skill/SKILL.md` + `MOTION.md` (ROS), `assets/images/panda/MOTION.md` (project motion notes).
Coverage caveat: P5 read = Summary, F5/F8/F11, Motion, Illustration, Haptics, Copy rules, Contradictions, Rejected. P6 read = Summary, F3–F7, Home, Return, Streak, Flow runner, Thought Catcher, Reframe, ABC, Coping Cards, Completion, Journal, Journeys, Insights, Measurement, Contradictions, Rejected, Self-critique. Not read: P5 Type/Spacing/Color/Radii tables, P6 remaining screen tables (BA, Fear Ladder, Onboarding, Settings, Paywall, Crisis tables), RS §7.1 mermaid.

---

## 1. Binding decisions

### 1.1 Character and voice
- **Species conflict:** every doc read says Happi is a **panda** (P3 Summary; `art.ts` header "traced off panda-capture.png"). The brief says cloud. No doc read records the change. See §5.
- Sole character, "quiet companion", not "emotional mirror" (P3 Summary, F1). Traits: steady, attentive, honest; never hyper, needy, preachy (P3 F3).
- **Caps (P3 Presence rules; P5 Copy rules):** ≤12 words and ≤60 EN chars per bubble, 1 sentence; ≤1 bubble/screen; ≤3 bubbles and ≤36 words/session (session = foreground until ≥30 min background); app copy always has more words than the bubble. Bubbles never cover a control, need dismissing, auto-advance, or type letter by letter.
- Voice (P3 Voice): second person about what the user did; never "I" about own feelings/needs; grade ≤6; no emoji, pet names, all-caps; ≤1 "!" per 7 days (milestone only); no idioms that fail literal ar/zh translation.
- Do-lines (P3 Voice): "Good to see you." / "That sounds hard." / "Saved. It's yours." / "You named the thought." / "Take your time." (Listening, after 20 s no input) / "You finished this one." / "Resting counts too." / "Seven days of practice. That's real." / "You picked 'calm' on Tuesday." / "Is there someone you could tell about this?"
- Banned words (P4 F1, P5 Copy rules): "amazing", "superstar", "legend", "yay", "awesome", "crush", "rewired", "should", "must", "failed", "streak at risk", "don't lose", "unlock" (own data), "cure", "fix".
- **Happi never instructs.** App copy carries every CBT step, distortion name, exercise wording (P1 F17, P3 F5/F13). Happi never grades, scores, says good/bad.
- **Happi never quotes free text.** App copy echoes it in a quoted card ("You wrote: '…'", ≤8 words, with date); Happi only gazes at the card. Happi may echo a chosen feeling word (P3 Contradiction 4; P5 Copy rules).
- 2-beat template for any thought challenge: beat 1 reflects chosen feeling word, beat 2 asks one question; never state the reframe first (P2 F7).
- Tone modes (P4 F1): everyday ≤12 words/sentence; struggling ≤10, no "why" questions; celebrating Day 7/15 only; instructional ≤20, grade ≤8.

### 1.2 Absence zones (P3 Presence rules, 9 zones)
Happi unmounted on: (1) any free-text field with keyboard open; (2) crisis/SOS and rest of that session; (3) CBT instruction steps; (4) assessments, numeric insight rows, charts; (5) paywall; (6) OS permission pre-prompts, review requests; (7) pushes, lock screen, widgets; (8) data export/delete, recall edit; (9) any screen showing user's own distress text. P6 Thought Catcher/Reframe/ABC rows: "Illustration / mascot: None". Happi appears only on Completion (P6 Flow runner).
- **Direct tension for the new doc:** RS §7.2 specifies "S2 Thought Catcher chat — Happi asks, user replies" and memory says CBT flows are conversational with the mascot asking. See §5.

### 1.3 Caretaking stance
- **Happi does not depend on the user.** Backstory: "Happi doesn't need anything from you." (P3 F4). No needs, no feeding, no health meter, no decay; "care flows only from the app to the user" (P3 Contradiction 3; P2 Never; P1 F4).
- Never claims feelings about absence: no "I missed you", "I was worried" (P1 F1).
- Rejected: pet care contract, user-named/customised character, cosmetics, coin economy, per-emotion recast, character-voiced reminders (P3 Rejected; P2 Rejected).
- RS softening: "Happi's world grows with *total* practices, never shrinks" (RS Part 3 verdicts) — stated, not specified.
- RS §6.4: "character attachment brings people back in Finch and Wysa (HIGH, [UV2] R2.4)".

### 1.4 Streak, absence, return
- **Current ruling (RS §4.4, supersedes P6):** no daily streak; word "streak" never appears. Only `ProgressPair`: "Practices completed: N" (lifetime) + ring "N of 3 this week" (refills Monday, no fail state, hidden at 0, never red/"0"). At 3: "3 of 3 — that's your week." Nothing asks for a 4th.
- Older soul ruling: leaf icon "{{count}} days practised this month" + "Hide counter" (P1 F12, P4 F8, P6 Streak). Superseded by RS.
- Milestone modal on **7th and 15th total entry day** only, CTA "Continue", Celebrating (low) ≤900 ms (P2 F5; RS §6.4 keeps it).
- Absence = Happi **Resting** (lid 1.0, tilt −5°), never sad/thin/waiting (P3 F8).
- Return: "Good to see you." at any gap; no duration, no "missed" (P3 F9). Landmarks allowed: "New week." / "New month." (P4 F15).
- Lapsed ladder (RS §5.7–5.11): 3–6 d CTA "Catch a thought"; 7–13 d CTA "Start with a 30-second check-in" + link "Or catch a thought" + recall line; 14–29 d same with landmark H1; 30+ two equal buttons "Pick up where you left off" / "Start with a short check-in"; post-relapse bubble once "That's one more kept."
- "Take a break" 1–14 days, Happi rests, Thought Catch and crisis link stay reachable (P2 F6).
- Progress never lost; survives reinstall after sign-in (RS §4.4).

### 1.5 Guilt rules
- Banned win-back words: "missed", "streak", "waiting", "lost", "it's been X days", "we miss you", "haven't", "been a while", "come back", "still there?"; no "we", no emoji, no urgency, no clinical words (RS §6.2; WB Rules).
- No pledges ("I'm committed", drawn checkmark) (P2 F3; RS Part 9). No broken/zero state. No "next milestone in N days" (RS §6.4).
- No ask (review/share/upsell/feedback) on completion or milestone screens (P1 F-dose4; P2 F9).
- No XP, coins, levels, chests, shop on any therapeutic action (P1 F6; P4 F8; P6 F3).
- No gating of user's own insights (P2 F13). No percentile/social comparison (P2 Never).
- Low mood logged: no praise or points on the save (P3 Struggle).

### 1.6 Notifications
- Global (RS §6.1): ≤1 push/day; slot picker 08:00–21:30; signed "Happy", never Happi-voiced; no thought/mood content in push/widget/lock screen; skip if practised today; none on a Distressed day.
- N0 priming on D0 saved card: "Want a nudge for your next one?" Morning · Evening · Pick a time · Not now. N1 daily copy rotates (5 lines, e.g. "What's been on your mind today?"). N2 12:30 on D1/D3/D5, 3 total. N4 pause after 3 consecutive ignored (no open within 6 h). N5 gap ≥14 d, next Monday 12:30, once. N6 gap ≥30 d, 1st of month 12:30, once then silence forever. N7 look-back (opt-in). N8 trial ending (mandatory).
- Push ≤60 chars, one ask (WB Rules).
- Evidence: +3.9% 24 h engagement, best slot 12:30 (Bidargaddi 2018); effect front-loaded, decays over 42 days (Klasnja 2019). "Do not expect notifications to carry D30."

### 1.7 Silence rules
- After 3 bubbles in a session Happi is art only (P3 Caps).
- Hero bubble **only** for: D1 recall, return greeting, pattern unlock, ring filled, exercise unlock, look-back ready, graduation card. "Otherwise Happi idles silently" (RS §5.0).
- D0 Home: no bubble, "the card speaks" (RS §5.1). Distressed: no bubbles, 300 ms fade only (RS §5.12).
- Crisis sheet: 0 ms, no Happi, sound, haptic, paywall (P4 F16).
- Sound default OFF (P4 F10). Haptic ≤1 non-selection per 1000 ms (P5 Haptics).
- Surprise: ≤1 moment per 7 days; none in days 1–5; none on a low-word day or crisis session; type dismissed 2× retires (P4 F12).
- Days 1–5: greeting, voice, position identical, no variants (P1 F3).

### 1.8 Customisation
- "Show Happi" toggle, default on; off copy "Done. You can turn Happi back on here." (P3 F14).
- Rejected: naming, cosmetics, costumes, seasonal skins, daily variants (P3 F10, Rejected).
- Deferred experiment E9: coach-tone picker (BitePal) (RS Part 3, §8.6).
- User picks reminder slot; "Hide counter"; recall opt-in with Edit/Forget/"Forget all" (P4 F4).

### 1.9 Progression / journey spec
- **No Happy node spec exists in the docs read.** J&R is teardown only (Duolingo node anatomy, no Happy proposal). P6 "Journeys and course lessons" row is the only spec:
  - Keep existing Duolingo-style node path (`src/domains/journey/ui/components/`); remove chest nodes and chest modal; node completion = Completion pattern.
  - Visuals: completed = sage; current = sage outline; locked = `#AFAFAF` + lock icon; nodes ≥44 pt; locked label "Locked, part of Happy Plus".
  - Happi on map without bubble; tapping does nothing. "No bouncing current node loop (idle on chrome forbidden)."
  - Copy: "PERFECT LESSON" removed → "Lesson done." (RSC §1 then calls "Lesson done." generic.)
  - What earns a node: lesson completion only; no XP, perfect bonus, stars.
- Home-side progression is time + count gated (RS §5.13): chips D1; Thought Reframing D3; Behavioral Activation D5 or first Low; Pattern line at first trap ≥2 entries; Look-back D7 if n ≥ 2; ABC D10 / Journal D14 / Fear Ladder D21 (each needs n ≥ 4); search by trap n ≥ 10; monthly look-back + graduation D30+. Each unlock announced once by a one-line chip, never a modal.
- RSC proposals (need sign-off, not ratified): reward escalation lesson → keepsake → unit → section → course; "Something to keep" tin with user's notes as taped paper cards ±2°; split palette (sage UI, warm illustration).
- J&R reference measurements (Duolingo F1, ±5%): node puck 69 × 52 pt; zigzag offsets 0/+46/+69/+46 pt; pitch 85 pt; unit banner 77 pt; current ring ≈110 pt; glyph ≈40% of node width.

### 1.10 Reflection / look-back surfaces
- Completion (P6): "Saved. It's yours." → "You wrote: '{{≤8 words}}'" → specific line (Thought Catcher "You named the thought and tested it."; Reframe "You weighed the evidence and wrote a fairer thought."; ABC "You linked the moment, the thought and what followed.") → "Breathe for 30 s" / "Done".
- Last reflection card (thought + fair version); never from Low/Not okay/crisis sessions (RS §5.0).
- D1 recall bubble: "Yesterday you turned '…' into '…'" (RS §5.2). **Exceeds 12 words and quotes free text.** See §5.
- Pattern line: "Mind reading came up 3 times this week." Unlock bubble "Mind reading came up twice. Want to see how you answered it?" (RS §5.3).
- D7 story, 3 cards: "You caught N thoughts." / "The trap that showed up most: Mind reading." / one quoted fair thought. Then Mondays "Last week, in 3 cards"; monthly "Your month, in 3 cards" + "How your check-ins moved" (RS §5.4–5.6).
- Belief rating: "You believed it 80 → 40" on saved card, optional (RS §6.3).
- Recall window 30 days, saved/pinned items only, source + date + "Why am I seeing this?" (P4 F3/F4).
- Monthly recap, opt-in, no scores (P4 F12 #7).

### 1.11 Novelty / rotation
- Check-in question rotates daily, never same two days: "How's today?" · "How are you feeling right now?" · "What's the weather inside today?" · "How's your head today?"; answers fixed Good · Okay · Low · Not okay. Word chips only, no drag-a-face (RS §5.0).
- N1 5 templates; N5/N6 3 variants (E12); lapsed bubble variants "Good to see you." · "Easy does it." · "Glad you're here."
- RSC §5.5 proposes 3–5 first-person variants per reward moment (not ratified; conflicts with P1 F24 "same trigger, same form").
- Surprise catalogue, 8 items (P4 F12): seasonal scene ≤4/yr; "One month ago you saved:"; first coping card flips; Day 7/15 note; 30/60/100 notes; hand-lettered note at 20th entry; monthly recap; Happi holds a leaf ≤1/14 days, 3 variants then stop.

### 1.12 Measurement already defined
- Events (RS §8.2): `practice_started` {exercise, entry, home_variant, d_install, gap_days}; `practice_saved` {exercise, trap_label, belief_before, belief_after, duration_s, is_first}; `practice_abandoned` {exercise, **step**, duration_s}; `mood_checked`; `home_viewed`; `reminder_set/changed`; `notification_sent/opened`; `reminder_paused/resumed`; `lookback_opened/completed`; `pattern_line_shown/tapped`; `distressed_variant_shown`; `help_opened`; `hotline_tapped`; `graduation_offered/chosen`; `outcome_check_completed`; `risk_item_answered`.
- Activation = one saved Thought Catcher reflection (thought + trap label + fair version) in session one (RS §4.1). Time-to-value: fair thought ≤90 s, saved card ≤120 s (RS §4.2).
- Targets (inference): activation ≥70%; D1 ≥30%; D7 ≥15%; D30 ≥8%; week-1 ≥2 practices ≥25% (RS §8.3).
- North star: practices with belief drop ≥20 points per weekly active user (RS §8.5).
- P6 guardrails: check-in word chosen in ≤10 s; Show Happi off >30% → review; recall Forget >20% → review; "Keep writing" >80% → phrase-list review.
- Experiments E1–E12 (RS §8.6); E10 belief slider "watch for drop" in completion.
- **No per-step funnel, per-turn latency, chip-vs-typed, or reaction-seen events exist.**

---

## 2. Teardown coverage

### 2.1 Apps covered
| App | Where | Conclusion |
|---|---|---|
| Duolingo | P2 (17 URLs), J&R §1.1/§2/§3.1, RSC §3, RS Part 3 | Adapt milestone motion to one 600–900 ms beat; reject commitment CTA, mascot distress, loot chest, ceremony sprawl (up to 7 screen types) |
| BitePal | P2 (10), J&R §1.7, RSC §4, RS Part 3 | Reject care contract/hearts/cosmetics; adapt visible-effort pose; tone picker deferred |
| Finch | P2 (20), J&R §1.2/§3.3, RSC §4, RS §2.2 | Steal pause mode, streak off-switch, verbatim echo, "It's okay to miss a day"; reject gem repair, confetti on routine |
| Ahead | P2 (13), J&R §1.6, RSC §4 | Steal validate-then-question; reject "You just rewired your brain!", drawn pledge, gated insights |
| Headspace | P2 (14), J&R §1.3/§3.2, RS §2.2 | Steal "How'd it go?" with Difficult option; hideable streak; travelling indicator |
| Calm | P2 (14), J&R §1.4, RS §2.2 | Weekly count; own words on dated card |
| How We Feel | P2 (13), RS §2.2 | Two-step labelling (quadrant → word); weekly story recap |
| Stoic | P2 (11), RS §2.2 | Emotion words reused in next prompt; done state "All set for the morning." |
| Wysa | P2 (14), RS §2.2 | Penguin as speaker tag; quoted echo; typing dots; SOS without character |
| Woebot | RS §2.2 (text only, no Mobbin) | Remembered follow-up; 83% at 2 weeks (RCT) |
| Tolan, Opal, Balance, Gentler Streak | P2 | Tolan exit-respect; Opal reject percentiles; Gentler rest-as-state |
| Abode, Bears Gratitude | RSC §2/§4 | Stage not screen; entry as framed keepsake |
| Speak, Brilliant, Elevate, Sweatcoin, NTC, Cal AI, WHOOP, Yuka, Rise, Fabulous, Noom | J&R §1.5/§1.8/§1.9, RS Part 3 | Minor patterns |
| 5 Minute Journal, Liven, Dot, Life Reset, Lovi, Mimo, Runna, Lifesum, Alan, Bloom, Vivid | P3, P4 | Recall, return, crisis, empty states |

### 2.2 Screens most reusable for the new doc
- Wysa Thoughtpad "Tell me the first thought on your mind. 👇": https://mobbin.com/screens/513cc1dd-75a3-4d45-be6c-6b24255613e4
- Wysa quoted echo: https://mobbin.com/screens/0804ae99-d713-466d-93b5-719ca47b34e2 ; typing dots: https://mobbin.com/screens/d01b5847-36ec-454c-b8d9-4777f88a0c65 ; exit reply "Got to go!": https://mobbin.com/screens/32320b65-7a02-40a2-9310-430501acac02 ; drag-face check-in: https://mobbin.com/screens/31047b03-c2a4-43b8-9acd-75847f7575aa
- Ahead 6-step stepper with optional note: https://mobbin.com/screens/aef7519a-2891-4779-a70b-ca9663bcc0ae , https://mobbin.com/screens/3225153d-c9bf-4a94-9a09-f019032cbf7d ; flow https://mobbin.com/flows/3ca31591-c1f7-4f1a-9636-891a72785a8c ; noticed counts: https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9
- How We Feel quadrant → words: https://mobbin.com/screens/ef93be6c-567e-4b33-8c04-059cbe7aca58 , https://mobbin.com/screens/d8171890-2681-4f31-8462-036346d49e2e ; Reflect menu "Identify a thinking trap": https://mobbin.com/screens/6eb1a996-a775-4313-b097-8307ee3b06fd ; context chips: https://mobbin.com/screens/ffd410a5-ea2c-498a-8536-0dc5fda49ef8 ; weekly recap: https://mobbin.com/screens/9b70b030-04c4-422f-aeef-04556bb27818
- Finch chosen word reused + chips + free text: https://mobbin.com/screens/b2649bef-8a87-4874-aa5c-d0dbe7317557 ; summary replay: https://mobbin.com/screens/46bc26b8-3f04-4a9e-b206-47ef103f1723
- Stoic "Skip writing about emotions": https://mobbin.com/screens/90e65788-ed6b-4728-84b3-83952fb40a94 ; words/time on completion: https://mobbin.com/screens/f872477c-61a4-42cd-93bf-9e85af0e0814
- BitePal "Feed Alex": https://mobbin.com/screens/eb74890f-44ab-41bd-8933-7beebe1036c3 ; post-log reaction: https://mobbin.com/screens/17e84593-48e4-4a97-9efe-39f3edc4ced1 ; "Checking database..": https://mobbin.com/screens/e904fdb7-bc19-486f-9f99-9bd7b0564e1b
- Tolan character above open keyboard (negative example): https://mobbin.com/screens/cf502da6-521e-4c6c-b0a6-d5e2c10b19f1
- Full catalogue: `docs/research/_work/retention/E-mobbin-screens.md` (not read).
- Web sources: Deconstructor of Fun (Duolingo streaks, +1.7% D7); Habitbox Finch review; Nutrola BitePal review; 60fps Design; Mazal/Lenny (CURR); Duolingo blog (503, unverified).

### 2.3 NOT covered
- **Logging-effort reduction.** No teardown of how any app splits a thought record into turns/chips. Wysa Thoughtpad cited as one still; Woebot text only; no flow walk, no count of taps/typed fields/turns, no chip-vs-free-text ratio, no prefilled examples, no voice input, no "short mode" spec (RS §5.12 names "Thought Catcher, short mode" without defining it). Current flow is 9 steps (P6 Thought Catcher), Reframe 10 steps, ABC 9 steps; nobody questioned the step count.
- **Post-log reaction timing.** Only BitePal's sparkle-eyes still. No measured delay between save and mascot reaction, no ordering (haptic → card → mascot), no per-turn acknowledgement inside a multi-turn log. All ms values in J&R §3 are *inferred*. P2 Self-critique: 10 of 13 apps have no verified motion/sound/haptic evidence.
- **Effort ladder.** Only two rungs named: 30-second mood check vs 2-minute Thought Catcher (RS §4.3), plus 3-tap bad-day path (P4 F6). No ladder from chip-only → one-line → full record; no rule for moving a user up or down; no competitor ladder torn down.
- **Data reflected back.** Covered at surface level (Pattern line, look-backs, HWF/Stoic/Ahead counts). Not covered: timing of first reflection-back relative to first log, minimum data before insight, in-flow reflection (mid-record), visual forms, Daylio/Bearable (no Mobbin screens), whether reflected data raises next-log rate.
- Also missing: Rootd, Daylio, Woebot, Youper flows; any screen recording; chat-style CBT UI patterns (bubble layout, quick replies, composer).

---

## 3. Psychology citations already used

| Author, year | Claim as used | Where |
|---|---|---|
| Epley, Waytz & Cacioppo 2007 | Lonely users attribute more mind to characters | P1 F1 |
| Lucas et al. 2014 (n=239) | More disclosure to an agent believed non-human | P1 F2 |
| Darcy et al. 2021 (n=36,070) | Woebot bond 3.8 within 5 days | P1 F3 |
| Laestadius et al. 2022 (582 posts) | Replika harm when bot has needs / mirrors distress | P1 F4 |
| Ryan, Rigby & Przybylski 2006 | Autonomy, competence, relatedness predict continued use | P1 F5 |
| Deci, Koestner & Ryan 1999 (128 exps) | Expected engagement-contingent rewards d = −0.40; verbal feedback d = +0.33 | P1 F6 |
| Peters, Calvo & Ryan 2018 | METUX: interface-level satisfaction can coexist with life-level harm | P1 F7 |
| Buell & Norton 2011 | Labor illusion: visible effort raises value | P1 F8 |
| Norton, Mochon & Ariely 2012 | IKEA effect only when work is completed | P1 F9 |
| Lieberman et al. 2007; Torre & Lieberman 2018 | Affect labeling lowers amygdala; implicit regulation | P1 F10/F11 |
| Schultz, Dayan & Montague 1997 | Dopamine = prediction error | P1 F24 |
| Silverman & Barasch 2023 (7 studies) | Broken streak lowers engagement; worse with self-blame; repair attenuates | P1 F12, RS §1.5 |
| Lally et al. 2010 (n=96) | 18–254 days; one miss harmless | P1 F13, RS §1.4 |
| Hobson et al. 2018 | Rituals regulate emotion, goals, connection | P1 F14 |
| Brooks et al. 2016 | RETRACTED, cite only as excluded | P1 |
| Breines & Chen 2012 | Self-compassion raises improvement motivation | P1 F15 |
| Fiske, Cuddy & Glick 2007 | Warmth judged before competence | P1 F16 |
| Aaker, Vohs & Mogilner 2010 | Competence drives willingness to use | P1 F17 |
| Laurenceau et al. 1998 | Perceived responsiveness turns disclosure into intimacy | P1 F18 |
| Aguirre et al. 2015 | Covert personalisation backfires | P1 F19 |
| Baumel et al. 2019 (93 apps) | D15 3.9%, D30 3.3% | P1 F21, RS §1.1 |
| Kaveladze et al. 2022 | ~4% / ~3% D15/D30 | RS §1.1 |
| Tsai 2007 | Low- vs high-arousal ideal affect | P1 F22 |
| Nittono et al. 2012 | Cute images narrow attention | P1 F23 |
| Mathur et al. 2019 | 1,818 dark patterns / 11K sites | P1 |
| Glocker et al. 2009 | Baby schema → caretaking motivation | P3 F2 |
| De Freitas et al. 2024 (working paper) | Identity discontinuity → mourning | P3 F1 |
| Fitzpatrick, Darcy & Vierhile 2017 (n=70) | Woebot RCT; 83% at 2 weeks; users liked being "remembered" | P3 F4, RS |
| Frischen, Bayliss & Tipper 2007 | Gaze cueing / joint attention | P3 F5 |
| Bickmore & Picard 2005 (n=101) | Relational agent liked/trusted more after 1 month | P3 F5 |
| Mori 1970/2012 | Uncanny valley (essay) | P3 F2 |
| Dai, Milkman & Riis 2014 | Fresh start effect | P4 F15, RS §1.4 |
| Bidargaddi et al. 2018 (n=1,255) | Push +3.9%; 12:30 best | P4, RS §1.6 |
| Klasnja et al. 2019 (n=37) | Prompt effect +107% at start, decays over 42 days | RS §1.6 |
| Alkhaldi et al. 2016 | Prompts RR 1.27 | RS §1.6 |
| Martinengo et al. 2019 | 9% of apps wrong crisis number | P4 F16 |
| Su et al. 2021 | mHealth copy at grade 11–15 | P4 F1 |
| Gollwitzer & Sheeran 2006 (94 tests) | If-then plans d = 0.65 | RS §1.4 |
| Wood & Neal 2007 | Habits = context cue → response | RS §1.4 |
| Sailer & Homner 2020 | Gamification effects small, unstable | RS §1.7 |
| Fleming et al. 2018; Neil et al. 2009 | dCBT completion 0.5–28.6%; MoodGYM 10% ≥2 modules | RS §1.1 |
| Linardon & Fuller-Tyszkiewicz 2020; Torous et al. 2020 | Attrition 24.1%/35.5%; dropout 26.2% (47.8% adj.); human feedback 11.74% vs 33.96%; mood monitoring lowers dropout | RS §2.1 |
| Eysenbach 2005 | Law of attrition | RS §2.1 |
| Borghouts et al. 2021 (208 articles) | Barriers: severity, tech, no personalisation; facilitators: insight, control, privacy | RS §2.1 |
| Brighten preprint (arXiv 2412.00942) | Low mood impairs initiation | RS §2.1 |
| Nahum-Shani et al. 2018 | JITAI | RS §2.1 |
| Musiat et al. 2022; Karyotaki et al. 2021 | Guidance g = 0.29; guided = unguided at 6–12 mo | RS §2.1 |
| Mohr, Cuijpers & Lehman 2011 | Supportive accountability | RS §2.1 |
| Beatty et al. 2022 | Wysa alliance after 3 days (company) | RS §2.1 |
| Yardley et al. 2016 | Effective engagement, not maximal | RS §2.1 |
| Donkin et al. 2013 (n=280) | Activities completed per log-in, not time, predicted change | RS §1.3 |
| Kauer et al. 2012 | Self-monitoring → emotional self-awareness → fewer symptoms | RS §2.3 |
| Parrish et al. 2021 | 35% of MH apps show crisis resources | RS §2.3 |
| Kroenke et al. 2009 (via RG) | PHQ-4 | RS §8.5 |

Missing for the new doc: cognitive load / response effort, Fogg, goal-gradient, endowed progress, Zeigarnik, self-efficacy, typing vs recognition, thought-record adherence or homework-compliance literature, belief-rating validity (RS notes none found), chatbot turn-length studies. RS flags "Hook model, Tiny Habits: no peer-reviewed validation found; not used as evidence".

---

## 4. Rossark motion rules to evaluate against

**Principles (ROS §1):** never teleport; calm, no bouncy overshoot; small amplitudes, "when unsure, halve it"; arcs and pivots; overlap/follow-through; one main action per scene + 2–3 idle loops; opacity only to appear/disappear; layout never moves; reduced motion = still (loops freeze at frame 0, one-shots show final frame); nothing runs unseen; anything <~100 ms is 2–3 frames at 30 fps and flickers.

**Curves (ROS §2, §7.5; P5 Motion):**
- travel / moving on screen: ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`
- enter / arrive / respond: ease-out `cubic-bezier(0.23, 1, 0.32, 1)`
- exit only: ease-in `cubic-bezier(0.55, 0, 1, 0.45)` (P5)
- loops: linear
- "Never ease-in on something the user is waiting for."

**Springs:** none. ROS §5.4 "Follow-through by delay, not by springs". P5: "No springs anywhere: damping and stiffness are not used." The one spring found, `withSpring(mass 0.6, stiffness 280, damping 20)`, is replaced by 300 ms ease-out (P4 F11). So there are **no spring params to evaluate against**; any spring is a violation.

**Interface durations (ROS §7.4):** press 100–160 ms; popovers/tooltips 125–200 ms; menus 150–250 ms; sheets/modals 200–500 ms; "Keep interface moves under 300 ms". Exits faster than entrances (P5: 30–35% faster). Enter from scale 0.9–0.97 + opacity, never scale 0. Press = scale 0.97. Interruptible: continue from current value.

**Frequency table (ROS §7.1):** hundreds/day → no animation; tens/day → minimal, fast; now and then → standard transition; rarely → full delight. A chip tap inside a log is high-frequency.

**Project tokens (P5 Motion):** button/chip press 120 in / 100 release; chip fill + check 150 / 100; screen push 24 pt 280 / 200; sheet 300 / 220; status chip 200 / 150; saved quote card rise 8 pt 300; Happi bubble opacity + scale 0.96→1 250 / 180; Stepping aside 200 leave / 250 return; counter cross-fade 200 / 150 (no count-up); return greeting 300; crisis 0.

**Stagger:** ROS §3 chart bars 40–80 ms. RSC §5.8 cards 60 ms apart (proposal). J&R §3.1 stat cards ~120 ms (inferred Duolingo, not a rule). ROS §6: next beat starts slightly before the last ends.

**Reaction timing (Happi):**
- Quiet pride ≤600 ms, cheek 0→0.6 in 300 ms ease-out, sy 1→1.02 in 250 ms, back by 600; no lift (P3 Expression set).
- Gentle concern: tilt +6° over 700 ms, lean +3°, slow blink at 800 ms (160 close / 60 hold / 260 reopen); head follow-through −0.42 × lean delayed 110 ms.
- Listening: gaze glide to (−2.5, 2.0) in 500 ms, hold ≥1000 ms; tilt +4° over 600 ms; blink at 300 ms.
- Thinking: real processing only, ≤1500 ms added display; saccades ±0.6 units every 700 ms. Reading state 800–1200 ms only if real processing (P1 F8).
- Welcome back ≤1800 ms. Celebrating (low) ≤900 ms: crouch 0.95 at 200, stretch 1.04 at 420, lift 12 units 420–740, squash 0.92 at 800, settle 900; ≤1 per 7 days.
- Idle: breath ±1.2% over 2400 ms; gaze ±1.2 units over 4200 ms; tilt ±1.6° over 4000 ms; blink every 3600 ms (110 close / 40 hold / 190 reopen). Wave beat 680 ms.
- Routine acknowledgement total ≤600 ms (P1 F-dose9); routine completion ≤400 ms motion per P4 critique, later 300 ms (P5).
- Follow-through delay 60–150 ms at 0.3–0.6 strength (ROS §5.4). Gaze glide ~500 ms, hold ≥1 s (ROS §4).
- RSC §5.8 reward choreography (proposal): 0 ms background; 150 ms Happi drops with squash + light haptic; 300 ms sparkles; 450 ms title; 550 ms+ cards at 60 ms; numbers count up; 900 ms CTA; tap skips to end.

**Haptics (P5):** chip select `selectionAsync()` ≤1 per 100 ms; primary button none; save `impactAsync(Soft)` once, ≤1 per 2000 ms; Success only Day 7/15; ≤1 non-selection per 1000 ms.

**Reduced motion:** read live via `reduceMotionChanged`; every row has a still; screen push → 150 ms cross-fade; saved card → final frame, opacity 150 ms; Happi one-shots → final pose; idle loops off; flash limit 3/s; particles ≤1 cycle per 2 s and off.

**Waiting-to-be-tapped jiggle (ROS §3):** 1.5–3% squash on a 200–350 ms beat. P6 forbids idle on chrome ("no bouncing current node loop").

---

## 5. Contradictions and open questions

1. **Panda vs cloud.** All docs and `art.ts` describe a panda with arms, ears, lavender heart. Brief and memory say cloud. Expression set (arm angles, ear follow-through) may not map. Unrecorded decision.
2. **Conversational Thought Catcher vs absence zones.** RS §7.2 "Happi asks, user replies" and memory "cloud asks, user replies, quick replies" vs P3 zones 1 and 3 (no Happi on free text or instruction steps), P1 F17 (Happi never carries CBT instruction), P3 Rejected "Chatty therapist avatar that leads exercises in conversation (Woebot-style)", and the ≤3 bubbles / ≤36 words per session cap. A multi-turn chat breaks the cap in one log. Unreconciled; the new doc must rule.
3. **Who quotes the user.** P2 F1: Happi quotes ≤8 words. P3 Contradiction 4: app copy quotes, Happi only gazes. RS §5.2 D1 bubble has Happi quoting thought and fair version (~16 words, two free-text quotes). RS wins by date but breaks three P3 caps.
4. **Progress model.** "days practised this month" + leaf (P1, P4, P6) vs lifetime count + weekly ring (RS §4.4, explicitly supersedes). P2 F5 says "total entries plus days this week". Day 7/15 entry-day modal survives in RS §6.4 beside the ring: two systems.
5. **Check-in input.** 12 feeling words, "Which word fits right now?" (P1 F10, P4 F6, P6 Home) vs four chips Good · Okay · Low · Not okay with rotating question (RS §5.0). RS does not say it supersedes. Affect-labelling rationale (≥12 granular words) is lost in the 4-chip version.
6. **Belief scale.** 0–10 slider in current flow (P6 Thought Catcher) vs 0–100 (RS §8.5, "80 → 40"). P1 F-dose5 warns against turning feelings into numbers; RS north star is a numeric drop.
7. **Variation vs predictability.** P1 F24 "same trigger, same form"; P1 F3 identical days 1–5. RS rotates the check-in question daily from D1; RSC wants 3–5 copy variants per reward and Duolingo-style pose variety.
8. **Celebration scale.** P3/P5: ≤900 ms, lift 12 units, no confetti, no particles, Happi ≤160 pt on completion, sage only. RSC: Happi ~38% of height, full scenes, sparkles, squash-and-stretch drop, count-ups, honey palette, tin shake. RSC says "Needs your sign-off". P5 bans count-up ("No odometer"); RSC adds it.
9. **Completion copy.** P6: "Lesson done." RSC §1: "Generic title 'Lesson done.'" is the problem.
10. **Save card duration.** P4 400 ms → P5 300 ms (resolved, P5 wins).
11. **Scope line.** P1/P3/P4 "Happy supports CBT practice…" → P6 "Happy helps you practise CBT skills. It isn't therapy and doesn't replace professional care." (resolved).
12. **"Saved. It's yours." vs "That one's saved."** P5 canonical save line; RS §5.1 D0 H1 is "That one's saved." Both may show in one flow.
13. **Reminder back-off.** P1 F-dose8 "≤1 non-user-scheduled push per day"; P4 F6 one user-picked reminder only; RS adds system-timed N2 (12:30), N5, N6. P4 Contradiction 2 rejected system-timed nudges.
14. **Graduation thresholds.** RS §4.6 says 8 weeks + 8 practices; RS Self-critique says "12 practices, 3/week for 3 weeks". Clinician sign-off pending.
15. **Idle on tappable things.** ROS §3 says a waiting object jiggles; P6 forbids idle on chrome.

Open (flagged by the docs themselves): no motion/haptic measurement from any competitor; word caps reasoned not studied; ar/zh untested; 18+ assumed; no metric baselines; effort asymmetry "no direct study found" (RS §2.1); belief slider unvalidated as outcome; "Thought Catcher, short mode" undefined; Happi new poses needed (RSC §7); RS motion "adequate for a spec but not for build".
