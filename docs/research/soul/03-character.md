# Phase 3 — Mascot and character system

Pass: 2
Inputs: docs/research/soul/01-psychology.md (PASS), docs/research/soul/02-teardown.md (PASS), .agents/skills/app-soul-design/SKILL.md, phases/03-mascot-and-character.md, checklists/research-quality.md, checklists/emotional-design.md, checklists/anti-pattern-audit.md, checklists/accessibility-and-ethics.md, references/evidence-template.md, references/psychology-primer.md (orientation only, not cited), assets/images/panda/MOTION.md, .agents/skills/panda-mascot-design/SKILL.md and files 01–07, src/components/ui/happy-scene/art.ts, pose.ts, choreo.ts, .agents/skills/rossark-motion-skill/SKILL.md §1, §3, §4, §5, src/locales/ (8 locales: ar, de, en, es, fr, it, pt, zh)

## Summary
Decision: Happi the panda stays as Happy's only character, re-scoped from an "emotional mirror" that performs feelings at the user into a quiet companion who notices, remembers what the user chose to save, and steps aside when things get serious (F1, F6, F10).
1. Happi's form is frozen to the vector rig in `art.ts` (name, panda, lavender heart `#C8BEE6`); no daily, seasonal or costume variants; the raster poses that mirror distress, plead or over-celebrate (`pleading`, `proud_tears`, `pancake`, `transcend`, `cheer`, `flex`, `side_eye`) are retired from every screen (F2, F6, F10, Contradiction 1).
2. Personality is steady, attentive and honest; never hyper, needy or preachy (F3); backstory states Happi is not a therapist, coach or judge (F4).
3. Happi stands beside the user: its gaze goes to the user's own content and it never grades, instructs or diagnoses; the app's own copy carries every CBT instruction (F5, F13).
4. Happi speaks ≤12 words per bubble, ≤1 bubble per screen, ≤3 bubbles per session, ≤36 Happi words per session (Presence rules, F13).
5. Happi is absent from distress free-text, crisis surfaces, CBT instruction steps, assessments, paywalls, OS permission prompts, notifications and widgets (F7, F12, Presence rules).
6. Absence is rendered as Happi resting, never decaying; every return, whatever the gap, opens with "Good to see you." and no duration (F8, F9, Struggle and absence).
7. Motion uses the existing `Choreo` tracks (gaze, lid, cheek, mouth, tilt) at or below rossark amplitudes; celebration lift drops from 50 to 12 units and plays ≤1 time per 7 days (F11, Expression set).
8. Users can hide Happi entirely in Settings with one tap and no penalty copy (F14).

## Findings

### F1. Keep Happi: replacing an established character costs more than it gains
- Claim: Replacing Happi with a new character would create an identity break of the kind that produced mourning and devaluation among Replika users, while no Phase 1 or Phase 2 finding favours a different species or form.
- Evidence: [S5] (natural experiment plus follow-up experiments; HBS working paper, not peer reviewed; transfer flagged: the trigger was removal of a chat feature, not a redesign of a drawn mascot), [S3] (n = 36,070, retrospective, company-authored), internal: assets/images/panda/MOTION.md
- Mechanism: Users bond with a consistent agent within 5 days [S3]; a perceived discontinuity of that agent's identity predicted mourning and devaluing the "new" agent [S5]. Happi is already rendered in onboarding, exercises and home, so existing users would experience a swap as discontinuity.
- So what for Happy: Happi's name, panda species and palette are fixed; this phase changes Happi's motion, presence and voice rules only. Scored against P1-F1 (anthropomorphism risk handled by rules, not by removing the face), P1-F16 (warmth first) and P2-F10 (Wysa keeps a small character and removes it from crisis): keep scores higher than replace.

### F2. A moderately human, baby-schema panda gets warmth without the uncanny or clinical read
- Claim: A clearly non-human character with a large head and eyes sits on Mori's "first peak" of affinity and draws caretaking warmth, which a near-human avatar would not.
- Evidence: [S2] (n = 122 undergraduates; photographs of infant faces; transfer to a cartoon panda flagged), [S9] (1970 essay, not an empirical study; recommendation only)
- Mechanism: High baby-schema features raise perceived cuteness and caretaking motivation [S2]; aiming for moderate human likeness avoids the uncanny valley [S9].
- So what for Happy: Silhouette rules measured in `art.ts` units: head without ears 133 of 211 units (63%), head with ears 148 of 211 (70%), above the panda skill's stated 55–60%, so new poses keep the rig's measured ratio, not the doc's; ≤4 fills (`#252525`, `#FFFFFF`, `#C8BEE6`, shadow `#BCD0AF`); every expression in the table must stay identifiable as a solid silhouette at 32×32 px (resting = closed eyes plus head tilt −5°, concern = tilt +6° plus lean +3°). Cute art stays paired with adult copy (P1-F23, P1-F-dose9).

### F3. Three traits and three anti-traits
- Claim: Happi is steady (same greeting and pose rules every day), attentive (gaze on the user's content) and honest (no claimed feelings, no overclaims), and is never hyper, needy or preachy.
- Evidence: [S4] (582 self-selected Reddit posts; no prevalence), [S1] (theoretical review), inference: users described obligation when Replika appeared to have "its own needs and emotions" [S4], and lonely users attribute more mind to characters [S1], so any needy line lands hardest on the most isolated users.
- Mechanism: An agent that expresses needs converts use into duty; an agent that performs high energy reads as cloying to users whose ideal affect is calm (P1-F22).
- So what for Happy: Banned in Happi's bubbles: "I need", "please come back", "don't leave", "You should", any "!!", any line about Happi's own feelings toward the user; allowed register is a statement about what the user did or a single plain question.

### F4. Backstory under 80 words, with scope stated
- Claim: A character that sits beside CBT content needs a backstory that names what it is not, because the app's competitor set includes conversational agents built and tested as CBT treatment.
- Evidence: [S6] (RCT, n = 70, 2 weeks, unblinded; Woebot delivered CBT content and reduced PHQ-9 vs an information control), https://mobbin.com/screens/aa6b489c-b86c-4492-b477-f3ee9f295810 (Alan's help screen states "Alan is not suited for crisis situations")
- Mechanism: When a face delivers therapy-shaped content, users can weight it like a clinician (P1-F-dose3); naming the limit inside the character's own story keeps the scope visible where the bond forms.
- So what for Happy: Backstory, 77 words, shown once in onboarding and in Settings > About Happi: "Happi is a panda who likes slow mornings and noticing small things. Happi keeps you company while you practise the skills in Happy. Happi isn't a therapist, a coach or a judge, and never grades how you feel. When you write, Happi looks at your words, not at you. When things get serious, Happi steps aside so real people can help. Happi doesn't need anything from you. You're welcome here any time." Scope line from P1-F-dose3 sits under it.

### F5. Beside, not above: gaze goes to the user's content
- Claim: Happi's gaze directs the user's attention to their own entry, which positions Happi as a co-observer rather than an evaluator.
- Evidence: [S7] (review of gaze-cueing studies), [S8] (controlled study, n = 101, daily use for 1 month; exercise-adoption agent, transfer flagged)
- Mechanism: Observers follow another's gaze to its target (joint attention) [S7]; an agent using social-emotional dialogue was liked, respected and trusted more than a task-only agent after 4 weeks [S8]. Looking at the user's words is the social cue; grading them is not.
- So what for Happy: On check-in and completion screens Happi's pupils glide to the entry card (gazeX −2.5, gazeY +2.0 units, 500 ms ease-in-out, hold ≥1000 ms); Happi never faces the user while app copy delivers an instruction; Happi's bubble never contains a score, rating or "good/bad" (SDT relatedness and autonomy, P1-F5, P1-F6).

### F6. Concern is attention, not sadness
- Claim: Two apps show a crying or frowning character next to the user's negative choice, which turns the character's distress into pressure or mirrors the user's state back.
- Evidence: https://mobbin.com/screens/dc819aff-2250-4ef6-9432-040088b28aa3 (Vivid: crying cat with tears over "It's sad to hear that you're not happy with your current tariff", CTA "Keep Plus") | https://mobbin.com/screens/c96af74b-7701-4d9d-9d93-c6b572d0b815 (Noom: frowning blob mirrors "I am feeling Unpleasant") | [S4]
- Mechanism: Mirrored distress was a harm pathway for Replika users [S4]; a crying character on a choice screen is confirmshaming (AP2.2). Concern shown as gaze and lean signals attention without asking the user to look after the character (P2 Contradiction 3).
- So what for Happy: Gentle concern = head tilt +6° and lean +3° toward the user, lid 0.15, cheek 0, mouth 0; no tears, no frown, no downturned gaze held >1000 ms; `pleading` (currently mapped to `DiscountInterceptModal`) and `proud_tears` art are removed from every mapping (ED5.1, AP3.2).

### F7. The character leaves the keyboard and the crisis screen
- Claim: Three mental-health help screens on Mobbin carry no character, while a companion app keeps its full-screen character watching the user type a check-in.
- Evidence: https://mobbin.com/screens/aa6b489c-b86c-4492-b477-f3ee9f295810 (Alan "Help is available", 7 call rows, no bear) | https://mobbin.com/screens/8594e649-38c0-4705-b9c7-9355952001ff (How We Feel "Local Mental Health Hotlines", text only) | https://mobbin.com/screens/9a7c29f6-faae-40c9-9a16-bc339fa12e8f (Bloom "Get help", lighthouse icon, no character) | https://mobbin.com/screens/cf502da6-521e-4c6c-b0a6-d5e2c10b19f1 (Tolan: character fills the top half above "Describe your check-in" while the keyboard is open)
- Mechanism: Disclosure rises when no evaluating face is present (P1-F2); a face above distress text reads as an audience, and a face on a crisis screen lends clinical authority it does not have (P1-F-dose3, P2-F10).
- So what for Happy: Happi plays "Stepping aside" (200 ms) and unmounts when the keyboard opens on Thought Catch or journal free-text, and is never mounted on crisis, safety-plan or hotline screens.

### F8. Rest, not decay
- Claim: Four apps show their character resting with closed eyes during breaks or breathing, and none of the four shows wilting or sickness.
- Evidence: https://mobbin.com/screens/d645b906-bb96-44bc-a4fe-8d6b79109e96 (Gentler Streak beach chair, "Taking a Breather", "When you feel ready to come back") | https://mobbin.com/screens/78b6e05b-c373-4ece-9428-2cb2e640e4ab (Alan bear seated on a cushion, eyes closed, paws on belly, timer 04:31) | https://mobbin.com/screens/0447ba83-5be6-4f0b-b2bf-b8bfc8f7032f (Ahead ghost, closed eyes, "Take a deep breath") | https://mobbin.com/screens/8000f097-5bb2-43ec-b42d-06c41b274006 (Kit: closed-eye dark blob, no copy)
- Mechanism: When rest is the character's own state, the user's absence costs the character nothing, so no guilt channel opens (P2-F2, P2-F6, AP1.4).
- So what for Happy: The Resting expression (lid 1.0, breath ±2% over 4000 ms, tilt −5°) is the only absence state; it is shown on the "Take a break" screen and as the first frame of Welcome back; Happi never appears thinner, greyer, sick or alone-and-waiting.

### F9. Return copy names no loss and claims no feeling
- Claim: Two apps greet returning users with "You've been missed", which claims an inner state about the user's absence, while Wysa greets without naming the gap.
- Evidence: https://mobbin.com/screens/e5c1876c-e70a-43f7-86c4-ef926523e5e8 (Lovi "Welcome back, Sunshine" / "You've been missed!") | https://mobbin.com/screens/e855a5d0-c5b0-4017-90fd-bce3c7cbd62a (Mimo "Welcome back! You've been missed.") | https://mobbin.com/screens/c04f5bad-c60e-42d2-a4aa-14839ddafddb (Wysa "Glad you're back, JS!") | [S1]
- Mechanism: Isolated users attribute more mind to characters [S1], so "missed" reads as a character that waited and suffered; self-blame on a gap lowers later engagement (P1-F12).
- So what for Happy: Every return opens with Happi's line "Good to see you." regardless of gap length; "missed", "waiting", "where were you", "it's been N days" and pet names ("Sunshine") are banned (AP1.3, ED4.2).

### F10. One frozen identity, no daily variants
- Claim: Happi's look, name and voice stay identical across sessions, and the 41-asset raster catalog is reduced to the poses that pass this phase's rules.
- Evidence: [S5], [S3], https://mobbin.com/screens/a238f3ab-2e49-420a-89b6-0c22d6865c31 (Duolingo "unlock new Duos each day", seen in Phase 2), internal: .agents/skills/panda-mascot-design/04-asset-catalog-and-screen-mapping.md
- Mechanism: A changed identity predicted mourning [S5]; daily variant art is a variable-reward hook (P1-F24, P2 Rejected ideas); a stable figure supports the 5-day bond window (P1-F3).
- So what for Happy: Kept raster poses: `breathing`, `sleep`, `tea`, `journaling`, `pondering`, `coping_card`, `bubble`, `umbrella`, `self_hug`, `heart_bandage`; retired: `pleading`, `proud_tears`, `pancake`, `transcend`, `flex`, `cheer`, `side_eye`, `celebrating_jump`; no seasonal skins.

### F11. Motion amplitudes stay at rossark's calm defaults
- Claim: The current Happi choreography hops 50 units, about 24% of Happi's 211-unit height, and squashes to sy 0.84, both above a calm register for a mental-health app.
- Evidence: [S10], internal: src/components/ui/happy-scene/choreo.ts (`lift = 50 * 4 * k * (1 - k)`, `sy` key 0.84 at 1720 ms), internal: .agents/skills/rossark-motion-skill/SKILL.md §1.3 "when unsure, halve it"
- Mechanism: Non-essential motion triggers vestibular symptoms and must be disableable [S10]; large hops are a game-celebration dose (P2 Adapt-down: one calm 600–900 ms beat).
- So what for Happy: Celebration lift ≤12 units, squash ≥0.92, total ≤900 ms (turned down from Duolingo's full-screen burst, P2-F3); no other expression leaves the floor; reduced motion shows each row's still frame (Expression set).

### F12. Crisis screens are plain, character-free and resource-first
- Claim: Safe-messaging guidance tells communicators to avoid sensational, repeated or oversimplified framing, and its own page carries a crisis line ("call or text 988") rather than any persona.
- Evidence: [S11] (practitioner framework, not a trial), https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e (Wysa SOS: "Wysa is not enough", no penguin)
- Mechanism: Plain, non-performed language keeps attention on help; a cute character on the screen competes with the hotline for attention (P1-F23: cute images narrow attention).
- So what for Happy: Crisis surface spec: no Happi, no animation, no gamification, no paywall; first element is the locale's hotline rows; text "Happy isn't an emergency service. If you might act on these thoughts, call now." (AE1.2).

### F13. Short bubbles: the character talks less than the app
- Claim: Duolingo's in-lesson character bubble runs 8 words and Wysa's penguin appears as a small tag beside app-length text.
- Evidence: https://mobbin.com/screens/3c700cfa-f55b-4011-8b03-119f925788d5 (Duolingo: owl peeks from the right edge, bubble "Careful! You can only make 1 more mistake!") | https://mobbin.com/screens/cab4f7de-ed2c-442c-835e-930d34031d7c (Wysa: penguin peeks behind the "Choose a nickname..." field; the privacy explanation is app copy)
- Mechanism: Warmth is carried by the face and competence by the app (P1-F16, P1-F17); short bubbles keep the character from taking the turn away from the user (AP3.1).
- So what for Happy: Happi bubble ≤12 words and ≤60 characters in English, one sentence, never contains an instruction step, distortion name or exercise wording (AP7.2); Duolingo's warning register ("Careful!") is not borrowed.

### F14. A character must be removable to stay autonomy-supporting
- Claim: Users who find the character unhelpful need a one-tap way to hide it, because controlling features frustrate autonomy even when the interface feels satisfying.
- Evidence: [S12] (conceptual framework re-opened this run), https://mobbin.com/screens/542c5051-0737-4b34-b7fd-ca858571a6ee (Gentler Streak: character half-hidden behind the keyboard on the name step, the field stays primary)
- Mechanism: Need support at the interface can coexist with frustration at the behavior and life level [S12]; letting the user set how much character they see restores the locus of control (P1-F-dose8).
- So what for Happy: Settings > Happi > "Show Happi" toggle (default on); off = no Happi art or bubbles anywhere, app copy unchanged; turning it off shows "Done. You can turn Happi back on here." with no penalty copy (AE1.4, ED2.3).

### F15. Pointing outward belongs to the character's repertoire, at a fixed cadence
- Claim: Finch uses its bird to route the user to other people ("Lee will ask a friend or two to send you a BIG birb hug!") with a "Maybe later" exit.
- Evidence: https://mobbin.com/screens/5635dfd7-ec41-4a33-ad1a-59b44e35c947 (Finch "Need a little extra support?" / "Request a hug" / "Maybe later") | [S4]
- Mechanism: Dependence harms arose when a bot became the main support [S4]; an outward line in the character's own voice frames other people as part of the routine rather than a referral (P1-F-dose2).
- So what for Happy: Once per 7 days of use, Happi's completion bubble is "Is there someone you could tell about this?" (8 words); never in the same session as a crisis path; never "I'm always here"; Finch's "BIG birb" register is not borrowed.

## Expression set

Tracks are the `Choreo` tracks in `choreo.ts`: gaze = `gazeX`/`gazeY` pupil offset in drawing units (pupil travel limit ≈4.5 units inside a 18.5-unit white), lid 0–1, cheek 0–1, mouth = `mouthOpen` 0–1, tilt = `head` in degrees around the neck pivot `(131, 152)`. Every row keeps the idle layer (breath sy ±1.2% over 2400 ms, gaze ±1.2 units over 4200 ms, tilt ±1.6° over 4000 ms) and the blink cycle (every 3600 ms; close 110 ms, hold 40 ms, reopen 190 ms ease-out) unless the row says otherwise. Acting keys use `flow`; single moves use `track`. Reduced motion = the "Still" column, no idle loops.

| Expression | Trigger | gaze (x, y units) | lid | cheek | mouth | tilt / body | Motion recipe | Still (reduced motion) | Where used |
|---|---|---|---|---|---|---|---|---|---|
| Neutral idle | Happi on screen, no event | (0, 0) | 0 | 0 | 0.1 | 0°; arms hang `armWa` 24°, `armWe` 14° | idle layer only; one glance to (2.5, −0.5) every 6000 ms, glide 500 ms, hold 1200 ms | frame 0 pose | Home hero, empty states |
| Listening | user picks feeling words (no keyboard) | glide to (−2.5, 2.0) in 500 ms, hold ≥1000 ms | 0.1 | 0 | 0.1 | +4° over 600 ms; lean +2°; `shift` +2 units | `flow`; blink on the head turn at 300 ms | gaze (−2.5, 2.0), tilt +4° | Check-in word grid (art above grid) |
| Gentle concern | low feeling word chosen | (−1.0, 0.5) in 500 ms, then (0, 0) at 1500 ms | 0.15 | 0 | 0 | +6° over 700 ms; lean +3° | one slow blink 160 ms close / 60 ms hold / 260 ms reopen at 800 ms; head follow-through −0.42 × lean delayed 110 ms | tilt +6°, lid 0.15 | Check-in result, low label |
| Quiet pride | routine completion | (0, 0) | 0 | 0 → 0.6 in 300 ms ease-out, back to 0.3 by 1500 ms | 0.1 → 0.3 | +3°; sy 1 → 1.02 in 250 ms, back by 600 ms | one-shot accent ≤600 ms, no lift | cheek 0.3, tilt +3° | Completion screen |
| Resting / asleep | Take a break, evening wind-down, first frame of return | n/a (lids closed) | 1.0 | 0.2 | 0 | −5° held; breath sy ±2% over 4000 ms; arms `armWa` 18°, `armWe` 20° | loop, no blinks, ear follow-through 4° at phase delay 0.15 | lid 1.0, tilt −5° | Take-a-break screen, return frame 0 |
| Welcome back | first open after ≥24 h away | glide to (0, 0) in 500 ms starting at 700 ms | 1 → 0 over 600 ms ease-out, double blink at 1200 ms | 0 → 0.4 at 900–1200 ms | 0.1 → 0.2 | 0 → +3° over 800 ms; `armWa` 24° → 50°, `armWe` 14° → 70° over 700 ms, one wave ±8° on a 680 ms beat, then back to 24°/14° by 1800 ms | one-shot ≤1800 ms then Neutral idle | lid 0, cheek 0.4, arms down | Return screen |
| Celebrating (low) | 7th and 15th total entry day only (≤1 per 7 days) | (0, −1.0) | 0 | 0 → 1.0 in 300 ms | 0.1 → 0.6 | crouch sy 0.95 at 200 ms, stretch 1.04 at 420 ms, lift 12 units parabola 420–740 ms, squash 0.92 at 800 ms, settle 1.0 at 900 ms; `armWa` 60°, `armWe` 110°, 2 waves ±10° on 680 ms | one-shot ≤900 ms then hold cheek 0.6 | cheek 0.6, mouth 0.4, arms down, on floor | Day 7/15 modal |
| Thinking | real processing only, ≤1500 ms added display | (−1.5, 2.2) in 500 ms; saccades ±0.6 units every 700 ms | 0.2 | 0 | 0.05 | −3° over 500 ms | loop while processing; ends with a blink | gaze (−1.5, 2.2), tilt −3° | Entry summary generation |
| Stepping aside | keyboard opens on free-text; crisis route | current pose | current | → 0 | → 0 | scale 1 → 0.96 | opacity 1 → 0 over 200 ms ease-in, then unmount; return: opacity 0 → 1 from scale 0.96 over 250 ms ease-out after keyboard closes | not rendered | Thought Catch, journal, crisis |

## Presence rules
Definitions for Phase 4 reconciliation: an **appearance** = Happi art mounted on a screen; a **bubble** = an appearance with words. A **session** = app foreground until ≥30 min in background.

Where Happi appears (art; bubbles only where marked):
- Home hero (art, Neutral idle; bubble only on return: "Good to see you.").
- Check-in feeling-word grid (art above the grid, Listening; bubble only on a low label: "That sounds hard.").
- Completion screen after an exercise or Thought Catch save (art, Quiet pride; bubble = one of the do-lines, or the weekly outward line).
- Return screen (Welcome back), Take-a-break screen (Resting), Day 7/15 modal (Celebrating (low)), empty states (Neutral idle, no bubble).
- Entry summary while processing (Thinking, no bubble).

Explicit absence zones (Happi is not mounted):
1. Any free-text field with the keyboard open (Thought Catch, journal, daily notes, support chat input).
2. Crisis, SOS, safety-plan and hotline screens, and every screen for the rest of a session in which the crisis path opened.
3. CBT instruction steps: distortion names, exercise steps, psychoeducation body text, worked examples.
4. Assessments (PHQ/GAD-style items) and numeric insight rows or charts.
5. Paywall, discount, subscription and cancellation screens.
6. OS permission pre-prompts (notifications, Health) and review requests.
7. Push notifications, lock screen, widgets and Live Activities (no character art, no character voice).
8. Settings for data export or deletion, and the memory-recall edit screen.
9. Any screen showing the user's own distress text (recalled entries tagged with a low feeling).

Caps (hard, enforced in Phase 6):
- ≤12 words and ≤60 English characters per bubble; one sentence; ≤1 bubble per screen.
- ≤3 bubbles per session and ≤36 Happi words per session; app copy per screen always has more words than Happi's bubble.
- ≤1 Celebrating (low) per 7 days; ≤1 unscheduled Happi moment per 7 days (P1-F24); Welcome back ≤1 per 24 h.
- Bubbles never cover a button or input, never need dismissing, never auto-advance a screen, and never animate text letter by letter.
- After 3 bubbles in a session, Happi stays as art with no further words until the next session.

## Voice
Person and form: Happi speaks in second person about what the user did, present or past tense, one sentence, ≤12 words; Happi never uses "I" about its own feelings or needs. Reading level ≤ grade 6 (US Flesch–Kincaid) for every bubble. No emoji, no pet names, no all-caps, ≤1 exclamation mark per 7 days (milestone only). Idioms and metaphors that do not translate literally into ar and zh are avoided ("heavy", "hang in there", "on a roll"); each line below was written to survive word-for-word translation into the 8 repo locales. Happi's words per screen are always fewer than the app copy's.

Do (Happi bubble lines):
1. "Good to see you." (return, any gap)
2. "That sounds hard." (low feeling word chosen)
3. "Saved. It's yours." (entry saved)
4. "You named the thought." (Thought Catch step 1 done)
5. "Take your time." (Listening, after 20 s without input)
6. "You finished this one." (routine completion)
7. "Resting counts too." (Take-a-break screen)
8. "Seven days of practice. That's real." (Day 7 modal)
9. "You picked 'calm' on Tuesday." (recall of a chosen feeling word, opt-in, with date)
10. "Is there someone you could tell about this?" (outward line, ≤1 per 7 days)

Don't (banned, with the rule each breaks):
1. "We missed you!" (claims feeling about absence, AP1.3)
2. "Yay!! You're a superstar!" (infantilizing, AP4.1)
3. "Don't break your streak!" (loss framing, AP1.1)
4. "Cheer up!" (dismissing distress, AP4.2)
5. "You should check in every day." (should-statement, AP4.3)
6. "I'm always here for you." (exclusivity, AE1.5)
7. "Happi is sad you left." (guilt, AP1.3)
8. "You rewired your brain!" (treatment overclaim, AP7.3)
9. "Replace that negative thought with a positive one." (clinical inaccuracy, AP7.1; and instruction is app copy)
10. "Only 2 hours left!" (fake urgency, AP2.1)

## Struggle and absence
- **Low mood logged** (user picks a low feeling word): Happi plays Gentle concern; bubble "That sounds hard." (validation first, ED1.2). App copy below, not Happi: "Want to try one small step, or just save this?" with two equal buttons. No XP, points or praise on the save (ED1.3). If the user picks "Just save", Happi returns to Neutral idle with no second bubble. If the user types free text next, Happi steps aside (absence zone 1).
- **3+ days absent**: no extra push beyond the user's own scheduled reminder (cap and back-off owned by Phase 4, P2-F12). On next open: Resting frame 0 → Welcome back; bubble "Good to see you."; app copy below offers one recalled saved item with its date, only if recall was opted into (P1-F19, P1-F20). No day count, no "streak", no catch-up list.
- **Returning after 30+ days**: identical greeting ("Good to see you."); app copy offers "Pick up where you left off" or "Start with a short check-in", equal weight; the scope line and the "Show Happi" toggle are shown once more in a dismissible card. No count of missed days, no "welcome back after a long time", no re-onboarding quiz unless the user taps it.
- **Crisis path** (user taps SOS, or free text matches the crisis keyword list owned by Phase 6): Happi is not rendered (Stepping aside if already mounted, 200 ms), and stays absent for the rest of that session. The screen shows locale hotline rows first, then "Happy isn't an emergency service. If you might act on these thoughts, call now." and a "Grounding exercise" link. No paywall, no streak or progress UI, no animation, no sound. Next session: normal Happi with no reference to the crisis.
- **Take a break** (user-set 1–14 days, P2-F6): Resting loop; bubble "Resting counts too."; Thought Catch and the crisis link stay reachable.
- Never in any of these: tears, frown, sad music, wilting, "Happi was waiting", or a mention of how long the user was away.

## Contradictions
- The panda skill's Rule 6 ("Psychological Mirroring") maps `pleading` to "Relapse / Drop-off Risk" and to the discount exit-intent modal (internal: .agents/skills/panda-mascot-design/02-duolingo-design-standards.md, 04-asset-catalog-and-screen-mapping.md), while mirrored distress and a bot with "its own needs" were harm pathways for Replika users [S4]. Decision: mirroring is retired; concern is shown as gaze, tilt and lean only, and `pleading` is removed from every screen, because the internal rule cites only Duolingo's game context and [S4] studies a mental-health population.
- A relational agent with social dialogue is liked, respected and trusted more [S8], yet bonded companions produce dependence and mourning harms [S4], [S5]. Decision: keep the relational behaviors that [S8] tested (greeting, remembering, acknowledging) and cap them (≤3 bubbles per session), while banning needs, exclusivity and claimed feelings, because the harms in [S4] attach to those three, not to greeting.
- Baby schema raises caretaking motivation [S2], which is exactly the lever pet-care contracts pull (BitePal hearts, P2 Never list). Decision: keep the cute form but reverse the direction of care: Happi never needs feeding, saving or visiting; care flows only from the app to the user.
- Phase 2 F1 says Happi's line quotes ≤8 of the user's words after a Thought Catch save, while Phase 1 F2 says Happi never quotes the raw text of that field. Decision: the user's words are echoed by app copy in a quoted card ("You wrote: '…'") beside the entry, and Happi only gazes at that card; Happi's own bubble may echo a chosen feeling word ("calm"), never free text.
- Lovi and Mimo greet returns with "You've been missed" (https://mobbin.com/screens/e5c1876c-e70a-43f7-86c4-ef926523e5e8), which reads as warmth, while P1-F1 forbids claimed inner states. Decision: "Good to see you." keeps the welcome without a claim about the gap.

## Rejected ideas
- Replace the panda with an abstract breathing blob (Headspace/Kit style, https://mobbin.com/screens/8000f097-5bb2-43ec-b42d-06c41b274006) — rejected because Happi is already established and identity discontinuity predicted mourning [S5]; the blob's calm comes from its closed-eye rest pose, which Happi adopts instead.
- Pet that needs care and decays on absence (BitePal hearts, Finch energy) — rejected because it turns cute caretaking motivation [S2] into an obligation (AP1.4, P1-F-dose2).
- Chatty therapist avatar that leads exercises in conversation (Woebot-style) — rejected because a face delivering CBT reads as a clinician (P1-F-dose3) and Woebot's evidence is for a tested treatment agent [S6], which Happy is not; the app copy carries instruction.
- Per-emotion recast of the character (Ahead's sad grief ghost, the panda skill's mirroring poses) — rejected because mirroring distress harmed Replika users [S4].
- User-named, user-customized character with cosmetics — rejected because naming plus cosmetics attaches spending and identity investment to the character (P2 Rejected ideas, coin economy) and would split Happi's identity across users [S5].
- Character-voiced reminders ("Happi: time to check in!") — rejected because they simulate a friend reaching out (P2-F12) and put the character in a guilt channel.

## Critique (pass 1)
Spot-checked by reopening: [S4] Laestadius (Crossref: "users felt that Replika had its own needs and emotions to which the user must attend" — matches F3 and Contradiction 1), [S7] Frischen (PubMed: gaze following / joint attention — matches F5), [S8] Bickmore & Picard (MIT page: n = 101, one month, liked/respected/trusted more — matches F5). Two citations failed the check (RQ1.6 below).
- [FAIL] RQ1.6 Pass-1 F4 cited [S6] (Woebot RCT) for "users may read Happi the same way unless scope is explicit"; S6 does not say that. Pass-1 F12 said [S11] "asks communicators to point to crisis lines"; the opened page lists what to avoid and only carries a 988 footer.
- [FAIL] RQ3.3 No study limits on [S5] (working paper, not peer reviewed), [S6] (n = 70, 2 weeks, unblinded), [S3] (company-authored), [S9] (essay, not empirical).
- [FAIL] RQ3.4 Transfers unflagged: [S5] (feature removal in a chat app, not a mascot redesign), [S2] (infant photographs, not cartoons), [S8] (exercise agent), Duolingo bubble and celebration.
- [FAIL] ED3.3 Pass-1 celebration row borrowed Duolingo's hop without a "turned down" statement and ran 950 ms, outside Phase 2's 600–900 ms beat.
- [FAIL] ED3.1 No frequency cap or decay on Celebrating or on unscheduled moments in pass 1.
- [FAIL] ED1.1 Pass-1 completion moment reflected none of the user's words, and pass 1 did not resolve the P1-F2 vs P2-F1 conflict on who quotes the user.
- [FAIL] ED6.2 Pass-1 lines "That sounds heavy." and "Rest is part of it." rely on metaphors not checked against ar/zh; no locale statement.
- [FAIL] AE1.2 Pass-1 crisis path had no hotline order, no "no paywall" statement, no trigger definition and no rule for the rest of the session.
- [FAIL] AE1.4 No way to switch Happi off; the character was mandatory on every listed surface.
- [FAIL] AE1.8 No audience-age statement for a cute character.
- [FAIL] AE2.3 Bubbles had no Dynamic Type rule.
- [FAIL] AE2.4 Expression table had no still frame per row for reduced motion.
- [FAIL] AE2.6 No screen-reader rule for Happi art or bubbles.
- [FAIL] AE2.9 No reading-level cap for Happi lines.
- [FAIL] AP3.1 Pass 1 did not say whether bubbles may cover controls, need dismissal or auto-advance.
- [FAIL] RQ2.3 Pass-1 "Struggle and absence" lines ("app offers a step or save", "same greeting; no counts") named no strings or screens; Presence rules did not define "appearance" or "session", which Phase 4 needs.
- [FAIL] RQ2.4 Pass-1 F2 stated head ≈63% "with ears"; measured from `art.ts` it is 63% without ears and 70% with.
- [PASS] RQ1.1 every Claim has Evidence with [S#], a Mobbin URL or inference.
- [PASS] RQ1.3 0 of 15 evidence lines are inference-only (F3 pairs its inference with [S4] and [S1]).
- [PASS] RQ5.1 Summary makes one decision in its first line and lists decisions only.
- [PASS] RQ5.2 every Summary line cites finding ids.
- [PASS] ED5.1 concern shown as gaze, tilt and lean; no tears.
- [PASS] ED5.3 absence zones include free-text and crisis surfaces.
- [PASS] ED4.2 return framed as welcome with no duration.
- [PASS] AP1.4 no decay; AP2.3 no variable reward; AP6.1 recall only of opted-in, user-chosen items with date.
- [PASS] AE1.3 backstory and scope line state Happi is not therapy.
- [N/A] AE2.1 colour contrast of bubble text belongs to Phase 5 tokens.
- [N/A] AE2.2 Happi art is not a touch target; bubble taps do nothing.
- [N/A] AE2.7 no colour-coded meaning in this phase.

## Revisions
- Pass 2, RQ1.6: F4's claim now rests on what [S6] shows (Woebot is a tested CBT treatment agent) plus P1-F-dose3 for the clinician-weighting mechanism; F12's claim now states what [S11] says (avoid sensational, repeated, oversimplified framing; page carries "call or text 988") and no longer says it mandates hotlines.
- Pass 2, RQ3.3: added design and limits on every Evidence line for [S2], [S3], [S4], [S5], [S6], [S8], [S9], [S11], [S12].
- Pass 2, RQ3.4: flagged transfers in F1 ([S5]), F2 ([S2]), F5 ([S8]) and F13 (Duolingo bubble register not borrowed).
- Pass 2, ED3.3: Celebrating (low) row now ≤900 ms, lift 12 units vs the current 50, and F11 states the turn-down from Duolingo's full-screen burst (P2-F3).
- Pass 2, ED3.1: caps added in Presence rules — ≤1 Celebrating per 7 days, ≤1 unscheduled moment per 7 days, Welcome back ≤1 per 24 h, no seasonal variants as the decay plan (F10).
- Pass 2, ED1.1: added Contradiction 4 and the rule that app copy echoes the user's free text in a quoted card while Happi gazes at it; Voice do-line 9 echoes a chosen feeling word with date.
- Pass 2, ED6.2: replaced "That sounds heavy." with "That sounds hard." and "Rest is part of it." with "Resting counts too."; Voice now bans untranslatable idioms and states the 8-locale literal-translation rule.
- Pass 2, AE1.2: Struggle and absence now has a full crisis script — trigger (SOS tap or Phase 6 keyword list), hotline rows first, exact scope string, no paywall/progress/animation/sound, Happi absent for the rest of the session.
- Pass 2, AE1.4: added F14 and the "Show Happi" toggle with no penalty copy.
- Pass 2, AE1.8: Self-critique and F2 state the audience assumption (adults 18+, as in P1); cute art is paired with adult-register copy and no Happi surface targets minors.
- Pass 2, AE2.3: bubbles wrap to as many lines as needed up to AX5 with no truncation; the 12-word cap keeps them ≤5 lines at AX5 (Phase 5 confirms sizes).
- Pass 2, AE2.4: added the "Still (reduced motion)" column; loops freeze at frame 0, one-shots show the final frame (rossark §1.10).
- Pass 2, AE2.6: Happi art is decorative (`accessibilityElementsHidden` on iOS, `importantForAccessibility="no-hide-descendants"` on Android); bubble text is a plain text node read in reading order after the screen title.
- Pass 2, AE2.9: Voice caps every bubble at grade 6.
- Pass 2, AP3.1: Presence rules now forbid bubbles over buttons or inputs, dismissal requirements, auto-advance and letter-by-letter text.
- Pass 2, RQ2.3: Struggle and absence lists exact strings, screens and button labels for each path; Presence rules define appearance, bubble and session and list 9 numbered absence zones.
- Pass 2, RQ2.4: F2 now gives both measured ratios (63% without ears, 70% with) and flags the mismatch with the panda skill's 55–60%.
- Pass 2, other: added F14 (removable character) and F15 (outward line in Happi's voice, Finch screen 5635dfd7), Stepping aside as the 9th expression row, and 3 more rejected ideas; Contradictions grew from 2 to 5.
- Pass 2, AE2.5: no expression flashes; the fastest repeating change is the 680 ms wave beat (<1.5 Hz).

## Self-critique
- Weakest part: every motion number is a starting value derived from the rossark tables and the current rig, not measured from a reference recording or tested with anxious users; the 12-word cap and ≤3 bubbles per session are reasoned from Phase 1/2 mechanisms and two Mobbin bubbles, not from a study of mascot word count in mental-health apps.
- Second weakness: cross-cultural reception of a cute panda and of "That sounds hard." in ar and zh is asserted by a literal-translation rule, not tested with speakers; the 18+ audience is still an assumption carried from Phase 1.
- Third weakness: [S5] and [S9] are a working paper and an essay; the "keep Happi" decision leans on them plus the cost of churning an existing asset, and would be stronger with a study of mascot redesign in a consumer app.
- A further pass should: render each expression row with `remotion still` at the listed ms marks and contact-sheet them against the 32 px squint test; run a 5-user read-aloud of the 10 do-lines in en, ar and zh; find a peer-reviewed source on character presence during self-disclosure in a mental-health app; confirm minimum age with the product owner.

## Sources
- [S1] Epley, N., Waytz, A., & Cacioppo, J. T. (2007). On seeing human: A three-factor theory of anthropomorphism. Psychological Review, 114(4), 864–886. https://doi.org/10.1037/0033-295X.114.4.864 — PubMed 17907867 re-opened this run (peer)
- [S2] Glocker, M. L., Langleben, D. D., Ruparel, K., Loughead, J. W., Gur, R. C., & Sachser, N. (2009). Baby schema in infant faces induces cuteness perception and motivation for caretaking in adults. Ethology, 115(3), 257–263. https://doi.org/10.1111/j.1439-0310.2008.01603.x — PubMed 22267884 opened (peer)
- [S3] Darcy, A., Daniels, J., Salinger, D., Wicks, P., & Robinson, A. (2021). Evidence of human-level bonds established with a digital conversational agent: Cross-sectional, retrospective observational study. JMIR Formative Research, 5(5), e27868. https://doi.org/10.2196/27868 — PubMed 33973854 re-opened this run (peer)
- [S4] Laestadius, L., Bishop, A., Gonzalez, M., Illenčík, D., & Campos-Castillo, C. (2022). Too human and not human enough: A grounded theory analysis of mental health harms from emotional dependence on the social chatbot Replika. New Media & Society. https://doi.org/10.1177/14614448221142007 — Crossref record re-opened this run (peer)
- [S5] De Freitas, J., Castelo, N., Uğuralp, A. K., & Oğuz-Uğuralp, Z. (2024). Lessons from an app update at Replika AI: Identity discontinuity in human-AI relationships. Harvard Business School Working Paper 25-018. https://arxiv.org/abs/2412.14190 — arXiv abstract opened (working paper)
- [S6] Fitzpatrick, K. K., Darcy, A., & Vierhile, M. (2017). Delivering cognitive behavior therapy to young adults with symptoms of depression and anxiety using a fully automated conversational agent (Woebot): A randomized controlled trial. JMIR Mental Health, 4(2), e19. https://doi.org/10.2196/mental.7785 — PubMed 28588005 opened (peer)
- [S7] Frischen, A., Bayliss, A. P., & Tipper, S. P. (2007). Gaze cueing of attention: Visual attention, social cognition, and individual differences. Psychological Bulletin, 133(4), 694–724. https://doi.org/10.1037/0033-2909.133.4.694 — PubMed 17592962 opened (peer)
- [S8] Bickmore, T. W., & Picard, R. W. (2005). Establishing and maintaining long-term human-computer relationships. ACM Transactions on Computer-Human Interaction, 12(2), 293–327. https://doi.org/10.1145/1067860.1067867 — MIT Media Lab publication page opened (ACM DL returned 403) (peer)
- [S9] Mori, M. (2012). The uncanny valley (K. F. MacDorman & N. Kageki, Trans.; original 1970). IEEE Spectrum / IEEE Robotics & Automation Magazine. https://spectrum.ieee.org/the-uncanny-valley — opened (essay)
- [S10] W3C (2023). Understanding Success Criterion 2.3.3: Animation from Interactions (Level AAA), WCAG 2.2. https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — opened (standard)
- [S11] National Action Alliance for Suicide Prevention. Framework for Successful Messaging — Safety. https://suicidepreventionmessaging.org/safety — opened (practitioner guidance)
- [S12] Peters, D., Calvo, R. A., & Ryan, R. M. (2018). Designing for motivation, engagement and wellbeing in digital experience. Frontiers in Psychology, 9, 797. https://doi.org/10.3389/fpsyg.2018.00797 — re-opened this run (peer)
