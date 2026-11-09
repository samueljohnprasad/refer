# Onboarding soul audit: `.agents/onboarding.html` against Phases 3–6

Pass: 2
Mode: audit (Phases 1–6 PASS in `00-status.md`, not redone). Research/spec only; no app code or `.agents/*.html` edited.
Inputs: `.agents/onboarding.html` (692 lines, read in full), `.agents/happy-ui.css`, `.agents/onboarding-handoff.md` §1–2; screenshots 115, 116, 117 (full frame) and 119, 120, 121 (cropped); `03-character.md` (Summary, F5–F7, F11–F13, Expression set, Presence rules, Voice, Struggle and absence); `04-connection-systems.md` (F5, F6, F8, Phrase bank); `05-tokens.md` (headings, contrast notes in 00-status); `06-implementation-spec.md` (Summary, P6-F4, Thought Catcher, Completion, Onboarding, Crisis path); `references/prototype-learnings.md` L1–L16; all four `checklists/`.
Rendering: not rendered by me (L14). Layout claims come from the user's screenshots; behaviour claims come from code line numbers.

**Mobbin note (L15).** No Mobbin MCP tool was exposed to this agent in this run, so no fresh Mobbin search was possible. Mobbin URLs below come from `02-teardown.md` / `03-character.md` / `04-connection-systems.md`. Those screens were viewed in Phases 2–4 and were **not re-opened in this run**. They are marked `(P2)` and are not presented as fresh research. Fresh web sources opened in this run: [S1]–[S3]. Re-run the Mobbin queries listed in Self-critique once the MCP is attached.

## Summary
Verdict: **the flow now has soul in the middle and leaks it at both ends.** The S2 chat matches Duolingo's per-answer character reaction [S1] at a mental-health dose, which is the right call. The weather prop (belief = cloud weight, reframe = the sky clears) is the signature, and Happi steps aside while you type. Five things break the spec:
1. **No crisis path** on the three free-text steps (AE1.2, P6 Crisis path). This is a Critical blocker.
2. **Happi mirrors distress.** Four of the goal poses and `heavy` turn the mouth down (−0.3 to −0.7) and sink the head for the whole example (P3-F6, ED5.1). `relieved` opens the arms to welcome-back range on every reframe, even when belief was "Not at all" (AP3.2, ED3.2).
3. **The ending lies and adds a quota.** The example path saves the app's text under "You thought" / "You landed on" with Happi saying "Saved. It's yours." "1 of 3 this week" adds a target the user never set (P4-F5, P4-F8, AP2.4).
4. **Duplicate "Continue"** (screenshot 120). The flow also has two exits on the reminder step (AP5.2).
5. **Accessibility:** starter chips are 36 px tall, the placeholder contrast is 4.24:1, and S0 has no scope line (AE2.2, AE2.1, AE1.3).

Single change that adds the most soul: **make the saved beat about the user.** Happi turns its gaze to the card. It says "Saved. It's yours." only over the user's own words and "You finished this one." over an example. The card names an example as practice. Details in § Soul verdict.

## Soul strengths to keep (do not regress)
| # | Strength | Evidence | Rule it satisfies |
|---|---|---|---|
| K1 | Happi steps aside (opacity 0, scale .96, 200 ms ease-in, clock paused) whenever the composer opens, and returns on send | lines 86, 513–515, 525–526; screenshot 116 (no Happi above composer) | P3-F7, absence zone 1 |
| K2 | One main beat per screen: the thought's weight is the cloud's weather; the reframe clears it over 1600 ms while Happi looks up at it | lines 384, 421–431, 555; screenshots 115 (rain) → 117 (sun) | rossark §7, L10 (the prop encodes belief) |
| K3 | The exercise is a chat: app asks, user answers in `.me` bubbles, quick replies in the footer, the chosen chip flies into the thread in 220 ms | lines 496–511; screenshots 115, 116 | L1 |
| K4 | Happi speaks ≤3 lines per session ("Hi, I'm Happi.", "You named the thought.", "Saved. It's yours."), each ≤4 words, ≤1 per screen, never covering input; the app carries every instruction | lines 446–447, 453, 573, 618 | P3 Presence caps, P3-F13, ED5.2 |
| K5 | Belief in words (5 levels), and the shift copy never grades: "Your belief stayed the same, and you still stopped to check it." | lines 273, 536–540 | L5, L6, ED2.1 |
| K6 | Validation before the challenge: "It feels true, and that's real. But feeling sure isn't the same as knowing." | line 534 | ED1.2 |
| K7 | Hollow dot (thought) → filled dot (other view) runs from the chat bubble to the saved card and My Log | lines 94–99, 148–155; screenshots 115, 120 | L7, ED4.1 groundwork |
| K8 | Value before commitment: "Two minutes. No sign-up." The notification permission prompt appears only after the user taps a time chip, with a preview of the real message | lines 454, 639–653; screenshot 121 | Duolingo gradual engagement [S2]; zone 6; AE1.4 |
| K9 | "Who is Happi?" sheet: not a therapist, steps aside for real people, "doesn't need anything from you", scope line | line 670 | P3-F4, AE1.3, AE1.5 |
| K10 | Reduced motion: every keyframe off, typing dots skipped, poses jump to their final value, speech held 6 s | lines 223, 283, 369, 447, 491 | AE2.4, ED5.4 |

## Findings per screen
Severity: Critical (ethics gate, ship-blocker) · High (spec rule broken, user-visible) · Medium (spec drift or friction) · Low (polish).

### S0: hello
| # | Rule | Evidence | Gap | Fix (exact, in this HTML) | Severity |
|---|---|---|---|---|---|
| S0-1 | AE1.3; P6 § Onboarding Copy ("welcome caption") | lines 453–454: only `h1` + lede; the scope line lives only inside the "Who is Happi?" sheet (line 670) | The not-therapy scope is not on screen at first contact. P6 puts it on the welcome screen. | After the `.lede` `<p>` add `<p class="scope0">Happy helps you practise CBT skills. It isn’t therapy and doesn’t replace professional care.</p>`; CSS `.s0 .scope0{margin-top:var(--sp-3);max-width:30ch;font-size:var(--t-foot);color:var(--label-2)}` (#4B4B4B on #FFF = 8.72:1) | High |
| S0-2 | P3 Expression set "Welcome back" (≤1800 ms, wave ±8°); ED5.4 | lines 381–382: the wave holds the shoulder at 58° until 2600 ms and the whole wave lasts 3300 ms; line 406: forearm `13*wave(t,680)` | The hello is about 1.8× longer than P3's greeting recipe, and the forearm swing is 13°, above P3's ±8°. | `greet`: `shot('sL',[[0,0],[500,50],[1300,50],[1800,0]]);shot('eL',[[0,0],[90,0],[590,70],[1390,70],[1890,0]]);shot('wave',[[0,0],[600,0],[800,1],[1300,1],[1500,0]])`; line 406 `13*wave` → `8*wave` | Medium |
| S0-3 | P3 Voice ("never uses 'I' about its own feelings or needs") | line 453 "Hi, I’m Happi."; CTA "Hi, Happi" line 455 | Compliant: the line states identity, not a feeling or need. It is bubble 1 of 3. The CTA answers the character, which keeps the first tap social. **Keep.** | none | — |

### S1: goal pick
| # | Rule | Evidence | Gap | Fix | Severity |
|---|---|---|---|---|---|
| S1-1 | P3-F6, ED5.1, P3 Summary ("re-scoped from an emotional mirror") | lines 351–356: `mood` mouth −0.7, lid .4, sink 6; `stress` mouth −0.5, pup .78; `self` mouth −0.5; `worry` pup .72 (alarmed); tiles draw these heads (line 470); line 475 comment "Happi takes on the feeling you picked" | The first choice surface shows 4 frowning or alarmed panda heads. On tap the host panda copies the user's feeling, which is the mirror Phase 3 retired. | Edit `POSES`: `worry` pup .72→.9; `mood` mouth −.7→0, lid .4→.15, sink 6→2, sy .975→.99; `stress` mouth −.5→0, sink 3→1, pup .78→.9; `self` mouth −.5→0, sink 3→1. Keep the arms and gaze, which show attention, not sadness. Line 475 comment → "Happi leans into what you picked" | High |
| S1-2 | L10; inference: with mouths flat, the 56 px heads differ only by tilt, lid and gaze | lines 389–398 (head-only crop drops the arms that carry the read) | Once the frowns go, the tile heads may stop encoding their goal. That is unverified at 56 px. | Keep the heads. Verify with a jsdom snapshot (L14). If two heads read the same, widen the tile crop `viewBox="40 10 180 166"` → `"40 10 180 200"` so the arm pose shows | Low |
| S1-3 | Duolingo/Finch goal pickers (P2) | lines 468–469; subtitles in first person ("I’m hard on myself") | Compliant. Tap-to-start with no Begin button. The user's own voice is in each subtitle (ED1.1). **Keep.** | none | — |

### S2: chat
| # | Rule | Evidence | Gap | Fix | Severity |
|---|---|---|---|---|---|
| C-1 | AE1.2; P6 Crisis path ("1 tap from every free-text screen"; phrase match on save); AP3.4 | `type()` lines 514–529: no help entry, no phrase check; three free-text steps (lines 568, 571, 577) | A user who types "I want to die" as their thought gets a belief scale and a reframe prompt. That is the exact failure P6-F7 names. | (a) Header line 232: replace the spacer with `<button class="link quiet" id="sos" hidden style="margin:0">Get help</button>`; in `type()` set `$('#sos').hidden=false` and hide it again on resolve. (b) `const CRISIS=/\b(kill myself\|end my life\|want to die\|wish i was dead\|better off dead\|better off without me\|suicid(e\|al)\|hurt myself\|self[- ]harm\|cut myself\|overdose\|no reason to live\|can'?t go on\|don'?t want to be here)\b/i` (P6 English list). In `send.onclick`, test `v.replace(/[’‘]/g,"'")`. On a match: `H.crisis=true;aside(true);openSheet('help')`, and keep the text. (c) `aside=on=>{$('.stage')?.classList.toggle('aside',on\|\|H.crisis);wake()}`, which keeps Happi gone for the session (zone 2). (d) `SHEETS.help` with P6 strings: h3 "If you’re thinking about hurting yourself, you deserve support now.", row "988 Suicide &amp; Crisis Lifeline · call or text 988" + "Call" button, "Happy isn’t an emergency service. If you might act on these thoughts, call now.", button "Keep writing" `data-close`; `.sheet.help{animation:none}` | Critical |
| C-2 | AP3.2, ED3.2, P3 Expression set (arms 50° is the Welcome-back range, ≤1 per 24 h) | line 555 runs `act('relieved',1600)` before the `before===0` check at line 558; screenshot 119 shows the "Not at all" path; `relieved` sL 48 / sR −48 (line 359) plays on every reframe, up to 3 per session | Happi performs relief for a thought the user never believed, and repeats a welcome-sized gesture per reframe. | Lines 555 and 579: `if(before>0){sky(.12,true);act('relieved',1600);stretch()}else{sky(.12);act('listen')}`. `relieved` arms sL 48→24, eL 40→20, sR −48→−24, eR −40→−20. Keep cheek .6 and the upward gaze: the look at the clearing sky is the beat | High |
| C-3 | ED5.1, L6 ("direction without judgement"), ED2.1 | `rate()` line 549 always calls `sky(weigh(v))`, so after the reframe a rating of "Mostly" brings the rain back and plays `heavy` (line 357: mouth −.3, sink 5) | After the reframe, the weather and Happi's slump act as a grade on the user's honest answer. | `async function rate(q,after=false){…;sky(after?Math.min(weigh(v),.3):weigh(v));act(after?'listen':v>=3?'heavy':v===0?'gentle':'listen');…}`; pass `true` at lines 559 and 581. `heavy`: mouth −.3→0, sink 5→2 | High |
| C-4 | Copy honesty | line 520 "Skip, show an example" is echoed (line 526) even when `more` is false. Line 609 then says "No problem. Want to try one of yours, or move on?" (screenshot 117: echo, then no example) | The user's own bubble promises an example that never comes. | Hoist `more` to module state (line 441: `let R,goal,beat=0,more=true`; reset in `s1()`; drop `more=true` from line 595). In `type()`: `const skip=more?'Skip, show an example':'Skip for now'`, used for both the button text (line 520) and the echo (line 526) | Medium |
| C-5 | L2 ("example copy must not ignore what they already said") | line 571: thought starters are always `goal.ideas.th`, whatever the user typed as the situation | Someone who typed "my sister didn't call back" sees "I never get anything done" as a suggested thought. | `sit[i]` and `th[i]` are parallel. Have `type()` record the tapped starter index (`b.dataset.s`). Show thought starters only when the situation came from starter i, and then `[goal.ideas.th[i]]` only. Typed situations get none | Medium |
| C-6 | P6 Thought Catcher Copy (retired "Is this thought actually true?" → "Hard thoughts can feel true. Let's check this one."); ED1.2 | line 545 "Is it actually true?" follows directly on "Completely" or "Mostly" | After a high rating, the challenge question arrives with no acknowledgement. Validation comes only after a "Yes". | Line 545: `await say(before>=3?'Hard thoughts can feel true. Is this one actually true?':'Is it actually true?')` | Low |
| C-7 | P3 Presence (≤3 bubbles) vs handoff §Chat avatar | line 90 "chat lines are the app talking, so they carry no face"; the handoff wants the 30 pt app icon (the panda face) beside every line | If the panda icon sat beside about 20 chat lines, users would read them as Happi (inference), so Happi would exceed the 3-bubble cap as users perceive it. | Keep the prototype (no avatar). The handoff §Chat avatar is stale (Contradictions) | Medium (doc) |
| C-8 | AE2.2, AP8.2 | line 131 `.starters .qr{min-height:36px}` (screenshot 116) | 36 px is below the 44 pt touch-target minimum. | `min-height:var(--tap)` | High |
| C-9 | AE2.1, AP8.1 | line 125 placeholder `--label-3` #767676 on `.row` #F7F7F7 = **4.24:1** (WCAG formula, computed in $TMPDIR) | Instruction text ("What happened, in a few words") is below 4.5:1. | `.row textarea::placeholder{color:var(--label-2)}` (#4B4B4B on #F7F7F7 = 8.14:1) | High |
| C-10 | AE2.3 (Dynamic Type), P5-F3 | lines 81–84 sticky stage about 150 px plus footer; screenshot 115 shows the stage taking about 30% of the frame before the first bubble | At AX sizes, the stage and a 2-row reply strip squeeze the thread to a few lines. | Handoff rule: when `fontScale ≥ 1.3`, render the stage at 72 pt with the speech below Happi. In this HTML: `@media (max-height:700px){.stage .host{width:96px}}` | Medium |
| C-11 | ED6.2 | line 540 "That’s room for another view." | The idiom "room for" needs a meaning gloss for ar/zh (P4-F1). | Add translator gloss "room for = space for"; keep the string | Low |

### Saved card
| # | Rule | Evidence | Gap | Fix | Severity |
|---|---|---|---|---|---|
| V-1 | ED1.1, P4-F5 ("the user's quote"), honesty | lines 620–623 always print "You thought" / "You landed on" plus the scene in second person. Screenshots 117 and 120 show "You thought “I never get anything done.”" after the user picked "Not at all" and wrote nothing; line 618 Happi: "Saved. It’s yours." | On the example path, the journal's first entry attributes app-written text to the user, and Happi calls it theirs. This is the path in all 3 end-state screenshots. | `const mine=R.source==='personal'`. Header: `mine?'Saved to your journal':'Saved as practice'`. Labels: `mine?'You thought':'The thought'` / `mine?'You landed on':'Another view'`. Example `.sum`: `` `You practised on an example${R.before>0?`, and believed it ${BELIEF[R.before].toLowerCase()} at first`:''}.` `` plus the trap. Line 618: `speak(mine?'Saved. It’s yours.':'You finished this one.')` (both on the P3 Do list) | High |
| V-2 | P4-F8 ("counts, not chains"), P6 Completion ("no XP, streak, ring"), AP2.4, ED3.3, L10 | line 624 `.week` = 3 dots + "1 of 3 this week"; empty dots #A9BFA0 on #F7F7F7 = 1.84:1 (fails the 3:1 non-text minimum) | On day 0 this sets a weekly quota the user never chose. It is Duolingo's daily goal with no turn-down. | Delete line 624 and the `.week` CSS (lines 162–166). Home's "{{count}} days practised this month" carries the count (P6 Streak surfaces) | High |
| V-3 | P3-F5 (gaze to the user's content: −2.5, 2.0, 500 ms, hold ≥1000 ms) | line 618 `act('pride')`: gaze (0, 0) at the user; screenshot 117 shows Happi facing the viewer, not the card | Happi watches the user instead of looking at the user's entry with them. | After `act('pride')` add `to('gx',-2.5,500);to('gy',2,500);H.hold=H.t+1500` | Medium (soul) |
| V-4 | P4-F5 ("when Happi is present … the app line becomes the date stamp, so the words are not duplicated") | line 618 speech "Saved. It’s yours." + line 620 header "Saved to your journal" | Two "Saved" lines appear within 300 ms of each other. | After V-1, personal header: `` `In your journal · Today, ${new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}` `` | Low |
| V-5 | AP5.2 (one main action); screenshot 120 | line 599 chip "Continue" is echoed as the user's bubble (line 508), then line 627 adds a footer button "Continue" | Duplicate "Continue": the user "says" Continue, then has to tap Continue again. "Continue" also isn't something a person says in a chat. | Line 599: `{t:'Save this one',v:'go'}` (the echo then causes the "Saved" card). Make `saved()` async. Replace lines 627–628 with `$('#foot').innerHTML='';await wait(2400);remind()` (Happi gets 2.4 s of pride, then steps aside for zone 6). The card stays in the thread. No screen auto-advances: the reminder ask is the next chat line | High |

### Reminder step
| # | Rule | Evidence | Gap | Fix | Severity |
|---|---|---|---|---|---|
| R-1 | AP5.2, AE1.4; screenshot 121 | line 635 footer "Continue to Happy" is shown alongside 4 chips including "Not now" (line 642) | Two exits compete with the ask, and "Not now" duplicates the footer button. | Remove line 635. Add `const showHome=()=>{$('#foot').innerHTML='<button class="btn" id="home">Continue to Happy</button>';$('#home').onclick=finish;$('#home').focus({preventScroll:true})}` and call it at the end of the `no` branch (line 644) and of both `systemPrompt` branches (lines 659–660) | High |
| R-2 | P6 Onboarding Copy (reminder title/body); ED6.2 ("nudge" is an idiom); AE1.4 | line 633 "Want a nudge for your next one?"; no body line | This is not the spec string, and it drops "You can change it anytime." | Line 633: `await say('Want one reminder? You pick the time, and you can change it anytime.')` (app voice) | Medium |
| R-3 | Zone 6 (OS permission pre-prompts), P6 Onboarding mascot row | line 632 `aside(true)`; comment line 630 | Compliant: no Happi on the permission ask. **Keep.** | none | — |
| R-4 | P6 slots "Morning / Midday / Evening" vs prototype "Morning / Evening / Pick a time" | lines 641–642 | The prototype deviates from P6. Decision: keep the prototype, since "Pick a time" gives more choice (AE1.4). See Contradictions | none | — |
| R-5 | Soul at the exit | onboarding ends on "Continue to Happy" with Happi off stage (lines 632–635) | The last frame has no character. That is right for zone 6, but Happi's last presence is then the 2.4 s pride beat (V-5), so V-1 and V-3 have to make that beat count. | Covered by V-1, V-3, V-5 | — |

## Happi presence, voice and caps: compliance
- **Caps: PASS.** Max 3 bubbles per session and 10 words total (`Hi, I’m Happi.` 3, `You named the thought.` 4, `Saved. It’s yours.` 3), ≤1 per screen. Bubbles never cover input (stage speech sits left of Happi, line 197), auto-fade (3.6 s, or 6 s with reduced motion), and are announced through `aria-live="polite"` without taking focus [S3]. The example path uses 2 bubbles.
- **Voice: PASS.** All lines are on the P3 Do list or state identity. After V-1, the example path uses Do line 6 instead of a false "It's yours."
- **Absence zones:** zone 1 (keyboard) PASS, zone 6 (permission) PASS, zone 2 (crisis) **FAIL**: no crisis surface exists (C-1). Zone 3 (worked examples) is overridden by P6 for onboarding; see Contradictions.
- **Expression set: FAIL.** The prototype uses 11 poses, 6 of them outside the P3 set (worry, mood, stress, self, sleep, heavy). Four carry downturned mouths (S1-1, C-3), and `relieved` uses the Welcome-back arm range per reframe (C-2). Once the fixes land, these become attention poses: arms and gaze change, the mouth stays ≥0, and sink stays ≤2. That fits the P3 "Gentle concern" and "Listening" rows.

## Soul verdict vs Duolingo / BitePal
- Duolingo's soul comes from a character present where learners spend most of their time, with a unique animation "anytime a learner answered an exercise correctly" [S1], and from value before sign-up [S2]. The S2 chat now does this: Happi's body answers every belief rating, and the sky carries the CBT act itself. That signature is stronger than Duolingo's right/wrong state, because it shows the skill rather than a score. Happy turns the dose down: no XP, no mid-lesson interstitials, 3 bubbles instead of continuous character speech (Duolingo in-lesson bubble https://mobbin.com/screens/3c700cfa-f55b-4011-8b03-119f925788d5 (P2); ed-tech transfer, dose-adjusted).
- BitePal's completion names the exact accomplishment at low arousal (https://mobbin.com/screens/b72074d3-9a06-4b05-91ed-0c8d5b354b46 (P2)). Finch's summary replays the user's own answers (https://mobbin.com/screens/46bc26b8-3f04-4a9e-b206-47ef103f1723 (P2)). The Happy prototype's ending does neither on the example path (V-1), and it adds a quota (V-2). So the soul peaks mid-chat and goes flat at the payoff.
- **Decision: the single change that adds the most soul is the saved beat (V-1 + V-3 + V-5 shipped together).** Happi turns to look at the card for 1.5 s. It says "Saved. It's yours." only over the user's own words and "You finished this one." over an example. The card says "Saved as practice" for an example, and the flow continues into the reminder ask with no second "Continue". Why this beats the alternatives: it is the last time Happi is on screen in onboarding (zone 6 removes it next), being seen is the connection mechanism the spec already ties to completion (ED1.1, P4-F5), and it costs about 15 lines.

## Ranked top-5 fixes
1. **C-1 crisis path** on free-text steps: "Get help" in the header, a P6 phrase match on send, a plain sheet with no Happi, and Happi gone for the session. Critical, AE1.2.
2. **Stop the mirroring:** mouths ≥0 and sink ≤2 in `mood/stress/self/heavy` (and worry pupils .9); `relieved` only when belief > 0, at half the arm amplitude; the sky never re-darkens after the reframe (S1-1, C-2, C-3). High, ED5.1 / AP3.2.
3. **Honest, user-centred saved beat:** example path labelled as practice, Happi line by source, gaze to the card, delete "1 of 3 this week" (V-1, V-2, V-3). High, ED1.1 / AP2.4.
4. **One exit at a time:** chip "Save this one", saved card flows into the reminder ask, "Continue to Happy" appears only after a reminder choice, spec reminder copy (V-5, R-1, R-2). High, AP5.2.
5. **Access and scope:** starters to 44 px, placeholder to label-2 (8.14:1), S0 scope line, honest "Skip" label (C-8, C-9, S0-1, C-4). High, AE2.2 / AE2.1 / AE1.3.

## Checklist run (on the prototype as it is now; after-fix status in brackets)
**Accessibility and ethics:**
- [PASS] AE1.1: harmful extremes named per mechanism (mirroring, quota, re-darkening sky), each with a guard.
- [FAIL] AE1.2: no crisis surface or phrase match (C-1) [fixed by C-1].
- [FAIL] AE1.3: scope line only in a sheet (S0-1) [fixed].
- [PASS] AE1.4: reminder opt-in; "Not now" and "Reminders are off. You can turn them on in Settings." carry no penalty.
- [PASS] AE1.5: Who-is-Happi sheet points to real people.
- [N/A] AE1.6: no recall in onboarding; the stored record carries `source`.
- [PASS] AE1.7: no efficacy claims; "Two minutes" is a duration.
- [N/A] AE1.8: the age statement lives in the store listing and Terms (P6).
- [FAIL] AE2.1: placeholder 4.24:1; week dots 1.84:1 (C-9, V-2) [fixed].
- [FAIL] AE2.2: starters 36 px (C-8) [fixed].
- [FAIL] AE2.3: stage not reduced at large text (C-10) [handoff rule].
- [PASS] AE2.4.
- [PASS] AE2.5: rain drops fade on 950–1400 ms cycles, below 3 Hz.
- [PASS] AE2.6: SVG `aria-hidden`, speech in an `aria-live` text node.
- [PASS] AE2.7: belief in words.
- [PASS] AE2.8: `vibrate(8)` is never the only signal.
- [PASS] AE2.9: Flesch-Kincaid grade of 12 key strings max 6.1 (the sheet), chat lines −1.1 to 5.4.

**Anti-pattern:**
- [PASS] AP1.1–AP1.4.
- [PASS] AP2.1–AP2.3.
- [FAIL] AP2.4: "1 of 3 this week" (V-2).
- [PASS] AP2.5.
- [N/A] AP2.6: no paywall in onboarding.
- [PASS] AP3.1.
- [FAIL] AP3.2: relief on "Not at all" (C-2).
- [PASS] AP3.3.
- [FAIL] AP3.4: no crisis surface to keep Happi off (C-1).
- [PASS] AP4.1–AP4.3.
- [PASS] AP5.1.
- [FAIL] AP5.2: reminder has two exits; duplicate Continue (R-1, V-5).
- [N/A] AP5.3: once per install.
- [PASS] AP6.1–AP6.3.
- [PASS] AP7.1–AP7.3: trap names accurate; "Fair and believable, not forced positive".
- [FAIL] AP8.1, AP8.2: see AE2.1 and AE2.2.
- [PASS] AP8.3.
- [FAIL] AP8.4: week dots carry state by fill (the text "1 of 3" partly mitigates; removed by V-2).
- [PASS] AP9.1: two arc labels are the first-sight legend for the dot language, not a per-field stack.
- [FAIL] AP9.2: week dots encode a quota (L10).
- [PASS] AP9.3.

**Emotional design:**
- [FAIL] ED1.1: example attributed to the user (V-1).
- [PASS] ED1.2 (C-6 Low).
- [PASS] ED1.3.
- [PASS] ED2.1 (C-3 aside).
- [N/A] ED2.2: weekly cadence, single session.
- [PASS] ED2.3.
- [FAIL] ED3.1: welcome-range gesture per reframe with no cap (C-2).
- [FAIL] ED3.2: same (C-2).
- [FAIL] ED3.3: the weekly goal is not turned down (V-2).
- [N/A] ED4.1, ED4.2: first session.
- [FAIL] ED5.1: downturned mouths and sink (S1-1, C-3).
- [PASS] ED5.2.
- [PASS] ED5.3: zones defined; 1 and 6 implemented; crisis is under AE1.2.
- [FAIL] ED5.4: greet 3.3 s and ±13° (S0-2).
- [PASS] ED6.1.
- [FAIL] ED6.2: "nudge" (R-2).

**Research quality (adapted to an audit):**
- [PASS] RQ1.1: every row has code, screenshot or URL evidence.
- [PASS] RQ1.2.
- [PASS] RQ1.3: inference labelled in S1-2 and C-7 only.
- [N/A] RQ1.4: audit, not a phase minimum.
- [PASS] RQ1.5: Mobbin URLs labelled (P2), not re-opened; [S1]–[S3] opened this run.
- [PASS] RQ1.6: spot-checks below.
- [PASS] RQ2.1–RQ2.4.
- [PASS] RQ3.1, RQ3.2.
- [PASS] RQ3.3: [S2] is a secondary write-up, labelled.
- [PASS] RQ3.4: Duolingo is flagged as an ed-tech transfer.
- [PASS] RQ4.1–RQ4.4.
- [PASS] RQ5.1, RQ5.2.

## Contradictions
- P3 absence zone 3 bars Happi from "worked examples"; P6 § Onboarding keeps `pondering` on the thought catch; the prototype keeps an acting Happi on the stage through the example. Decision: Happi stays (P6 is the later, screen-level spec, and K2 is the strongest soul mechanism), limited to attention poses (S1-1, C-2, C-3). Instruction stays in app bubbles.
- P6 § Onboarding ethics guard specifies a trap pick ("Close. This one fits a bit better: {{label}}."); the handoff (authority order EXPERIENCE.md > handoff) says "no trap quiz". Decision: no quiz in onboarding. It is one fewer assessment-like step in the first two minutes, and the trap is named by app copy (line 556). The P6 row is stale for onboarding.
- Handoff §Chat avatar puts the panda app icon beside every chat line; prototype line 90 removes it. Decision: no avatar (C-7), because the icon is Happi's face.
- P6 Thought Catcher uses "{{n}} of 10" belief; L5 is binding. Decision: words (line 273).
- P6 reminder slots Morning/Midday/Evening; prototype Morning/Evening/Pick a time. Decision: keep the prototype (more choice, AE1.4) and adopt the P6 title/body (R-2).
- `happy-ui.css` adds Fredoka as the display face; P5 keeps Nunito with system fallback for ar/zh. Decision: out of soul scope; flag to the Phase 5 owner because Fredoka also lacks ar/zh glyphs.

## Rejected ideas
- Give Happi a bubble on every beat to match Duolingo's speaking characters [S1]. Rejected: P3 caps ≤3 bubbles and ≤36 words per session (AP3.1); the body and the sky already react per answer.
- Do not save example runs at all. Rejected: the user would lose their first artefact and the dot language would have nothing to carry into My Log. Labelling it as practice (V-1) keeps it honest.
- Keep the week dots but let the user set the target. Rejected: a target on day 0 is still a quota (P4-F8). Counting lives on Home.
- Play Celebrating (low) on the first saved card. Rejected: reserved for entry days 7 and 15, ≤1 per 7 days (P3 Expression set); a routine close gets ≤600 ms (ED3.2).
- Remove Happi from S2 entirely (strict zone 3). Rejected: it deletes K2 to fix a problem the pose fixes already solve.

## Critique (pass 1)
- [FAIL] RQ1.5: pass 1 cited Mobbin URLs as if viewed now; no Mobbin tool was available this run.
- [FAIL] RQ2.3: pass 1 fix for the duplicate Continue said "merge the steps", which is not implementable as written.
- [FAIL] ED5.1: pass 1 treated the goal-pose frowns as goal encoding (L10) and missed P3-F6's "no frown" rule.
- [FAIL] AE2.1: pass 1 assumed label-3 passes everywhere; the placeholder contrast was not computed.
- [FAIL] RQ5.1: pass 1 Soul verdict offered "either gaze-to-card or more Happi lines".
- [PASS] AE1.2: crisis gap found in pass 1.
- [PASS] AP2.4.
- Spot-checked 3 citations by reopening:
  - [S1]: "unique animation that would play anytime a learner answered an exercise correctly". Matches the verdict.
  - [S2]: lesson before sign-up. Matches K8.
  - `03-character.md` Presence caps: ≤12 words, ≤1 bubble per screen, ≤3 per session. Matches the caps check.

## Revisions
- Pass 2, RQ1.5: added the Mobbin note; every Mobbin URL is tagged `(P2)` and excluded from fresh-research claims.
- Pass 2, RQ2.3: V-5 and R-1 now give exact line edits (`Save this one`, async `saved()`, `showHome()`).
- Pass 2, ED5.1: added S1-1, C-2 and C-3 with pose values; S1-2 keeps L10 as a verification item.
- Pass 2, AE2.1: computed 4.24:1 (placeholder) and 1.84:1 (week dots) with the WCAG formula; C-9 and V-2 updated.
- Pass 2, RQ5.1: Soul verdict now decides on the saved beat and states why.

## Self-critique
- Weakest part: no fresh Mobbin evidence. The Duolingo/BitePal/Finch comparisons use Phase 2 stills, and the claim that the reframe beat reads as soul is inference from code plus 6 screenshots, not a rendered run. S1-2 (do flat-mouth heads still read at 56 px?) is unverified.
- A further pass should:
  - Run Mobbin with Duolingo "first lesson complete", Finch "onboarding first goal", Wysa "first conversation", Gentler Streak "onboarding" and BitePal "first log". Look at how the character behaves on the completion beat and whether chat lines are attributed to the mascot.
  - Render the fixed HTML through the L14 jsdom walk. (The C-1 regex was already checked in Python: 16/16 P6 phrases matched, 0 hits on 3 non-crisis lines including "I could die of embarrassment".)
  - Propose a Phase 3 Expression-set amendment that lists the attention-only goal poses.

## Sources
- [S1] Duolingo. "Building character". Duolingo Blog. https://blog.duolingo.com/building-character/ (opened this run)
- [S2] Appcues GoodUX. "Duolingo's delightful user onboarding experience". https://goodux.appcues.com/blog/duolingo-user-onboarding (opened this run; secondary write-up, not Duolingo's own data)
- [S3] W3C. Understanding WCAG 2.2 SC 4.1.3 Status Messages. https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html (opened this run)
- internal: `.agents/onboarding.html`, `.agents/happy-ui.css`, `.agents/onboarding-handoff.md`, `docs/research/soul/03-character.md`, `04-connection-systems.md`, `05-tokens.md`, `06-implementation-spec.md`, `.agents/skills/app-soul-design/references/prototype-learnings.md`
- Mobbin (viewed in Phases 2–4, not re-opened this run): Duolingo in-lesson bubble https://mobbin.com/screens/3c700cfa-f55b-4011-8b03-119f925788d5 · BitePal completion https://mobbin.com/screens/b72074d3-9a06-4b05-91ed-0c8d5b354b46 · Finch summary https://mobbin.com/screens/46bc26b8-3f04-4a9e-b206-47ef103f1723 · Wysa SOS, no penguin https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e · Tolan character above keyboard (anti-pattern) https://mobbin.com/screens/cf502da6-521e-4c6c-b0a6-d5e2c10b19f1
