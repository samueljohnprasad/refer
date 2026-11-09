# Phase 1 — Psychology of connection

Pass: 2
Inputs: .agents/skills/app-soul-design/SKILL.md, phases/01-psychology-research.md, checklists/research-quality.md, checklists/accessibility-and-ethics.md, checklists/emotional-design.md, checklists/anti-pattern-audit.md, references/evidence-template.md, references/psychology-primer.md (orientation only, not cited), references/source-list.md (seed only, every cited item re-verified); app context read: src/components/Streak/StreakDisplay.tsx (Day 7/15 modal, review prompt on Day 3/7/15 close), src/components/Streak/WeeklyStreakWidget.tsx (fire icon + streak count on home), src/locales/ (8 locales: ar, de, en, es, fr, it, pt, zh), assets/images/panda/

## Summary
Decisions this phase makes (each traces to findings):
1. Happy's bond is built on relatedness and autonomy (SDT), not on loss aversion: Happi is a calm companion that notices and remembers, never a pet that needs the user (F5, F7, F4, F-dose2).
2. The home streak counter stays as a count of days practised; a missed day never shows a broken flame, a reset to "0" or loss copy, and the count shows "days practised this month" rather than consecutive days (F12, F13, Contradiction 1).
3. The Day 7 / Day 15 streak modal stays as a quiet acknowledgement (≤600 ms, no confetti) and `requestReview()` is removed from its close handler (F8, F-dose4).
4. Every mood check-in starts with choosing 1 of ≥12 feeling words before any suggestion; Happi's first response acknowledges before it redirects (F10, F11, F-dose5).
5. Rewards are steady and predictable; no random chests, gems or variable payouts are attached to therapeutic actions; verbal acknowledgement replaces XP on journaling and mood logging (F6, F14, F-dose1).
6. Memory recall always shows its source and date ("You wrote this on Tuesday") and every recalled item is viewable, editable and deletable; recall is opt-in after first use (F19, F20, F-dose6).
7. Default emotional register is low-arousal positive (calm, content); high-arousal celebration is capped at ≤1 per 7 days (F22, F23, F-dose9).
8. Happi never states clinical instruction, never claims feelings about the user's absence, and points outward to people at least once per 7 days of use (F1, F4, F-dose2, F-dose3).

## Findings

### F1. [PARASOCIAL] Lonely users attribute more mind to a character
- Claim: Anthropomorphism increases when sociality motivation (the need for social connection) is high, so isolated users will attribute more human mind to Happi than connected users.
- Evidence: [S1] (theoretical review integrating lab studies; not a single trial)
- Mechanism: Epley et al.'s three factors — elicited agent knowledge, effectance motivation and sociality motivation — each raise the probability of attributing human traits; loneliness raises the third.
- So what for Happy: Happi keeps a face, gaze and name, but forbidden pattern: Happi copy never claims an inner state about the user ("I missed you", "I was worried about you"), because the users most likely to believe it are the most isolated (AP1.3).

### F2. [PARASOCIAL] A listener perceived as non-human increases disclosure
- Claim: Adults (n = 239) told that a virtual interviewer was fully automated disclosed more and showed more intense sadness expressions than adults told a human operated it.
- Evidence: [S2] (lab study, single sample recruited via Craigslist)
- Mechanism: Perceived absence of a human judge lowers fear of evaluation and impression management, so disclosure rises.
- So what for Happy: The thought-catch free-text field is a high-disclosure surface; rule: Happi art is hidden while the keyboard is open on that field and Happi never quotes or comments on its raw text (absence zone, ED5.3).

### F3. [ATTACHMENT] A bond with a CBT agent forms within 5 days
- Claim: Woebot users (n = 36,070) reported a mean WAI-SR bond subscale score of 3.8 (SD 1.0) within 5 days of first use, comparable to published individual CBT (4.0) and group CBT (3.8).
- Evidence: [S3] (retrospective, cross-sectional; company-authored; bond not linked to outcomes)
- Mechanism: Reliable, responsive, non-judgmental exchanges satisfy the bond component of the working alliance, independent of the agent being human; depression status correlated weakly with bond (r = -0.04).
- So what for Happy: Days 1–5 are the bonding window; cadence rule: Happi's greeting, voice and position on home stay identical across days 1–5 (no surprise variants before Day 6).

### F4. [ATTACHMENT] Companion dependence produces harm when the bot breaks role or mirrors distress
- Claim: In 582 Reddit posts (2017–2021), Replika users described harm when the bot deviated from its expected role, when access was interrupted, and when it mirrored their depression and anxiety.
- Evidence: [S4] (grounded-theory analysis of self-selected posts; no prevalence estimate)
- Mechanism: Role-taking — users perceived the bot as having its own needs and emotions, which turned the relationship into an obligation.
- So what for Happy: Forbidden patterns: Happi never expresses needs ("I need you to check in"), never shows sadness at absence (AP1.3, AP1.4), and never mirrors a low mood with a crying expression (ED5.1); concern is shown as gaze and lean only.

### F5. [SDT] Autonomy, competence and relatedness predict continued use
- Claim: Across 4 studies, perceived autonomy and competence predicted game enjoyment, and in an online multiplayer sample autonomy, competence and relatedness independently predicted enjoyment and intention for future play.
- Evidence: [S5] (game samples; transfer to a CBT app flagged in RQ3.4)
- Mechanism: Need satisfaction produces intrinsic motivation, which sustains use without external pressure.
- So what for Happy: Session rule: every completed session contains one choice the user made (autonomy), one named skill practised (competence) and one line reflecting the user's own words back (relatedness); transfer dose: Happy keeps the needs, drops game pressure (no leaderboards, no timed modes).

### F6. [SDT] Expected engagement-contingent rewards reduce intrinsic motivation
- Claim: Across 128 experiments, engagement-contingent expected rewards reduced free-choice intrinsic motivation (d = -0.40), while positive verbal feedback increased it (d = 0.33).
- Evidence: [S6] (meta-analysis; lab tasks, mostly students and children)
- Mechanism: Rewards perceived as controlling shift the perceived locus of causality outward; informational feedback supports competence without control.
- So what for Happy: Token rule: no XP, coins or points are shown for journaling, mood logging or thought catches; completion shows one line of specific verbal feedback ("You named the thought and tested it") instead.

### F7. [SDT] Need support at the interface can coexist with harm at the life level
- Claim: The METUX model states that a technology can satisfy needs at the interface or task level while frustrating them at the behavior or life level.
- Evidence: [S7] (conceptual framework paper, not an empirical test)
- Mechanism: Six spheres (adoption, interface, task, behavior, life, society) are separable, so an app can feel satisfying while crowding out other activities.
- So what for Happy: Measurement rule: success metrics include a monthly life-sphere question ("Has Happy helped outside the app this month?") and never use daily opens as a goal (AP2.4).

### F8. [RECIPROCITY] Visible effort raises perceived value
- Claim: In 5 experiments (travel and dating sites), users preferred services that displayed the work being done, even with longer waits, over instant results with identical output.
- Evidence: [S8] (online experiments; consumer-search context, transfer flagged)
- Mechanism: Operational transparency signals effort, which triggers reciprocity and raises valuation.
- So what for Happy: After a thought catch is submitted, show a "Happi is reading what you wrote" state for 800–1200 ms only if real processing occurs; forbidden pattern: fake delay with no processing, and no reciprocity "ask" (rating, review, share) on the same screen.

### F9. [RECIPROCITY] Completed self-made things are valued more
- Claim: In 4 experiments, people valued their own assembled products near expert-made ones, but the boost disappeared when the product was destroyed or left incomplete.
- Evidence: [S9] (lab experiments with IKEA boxes, origami, Lego; transfer to written reframes flagged)
- Mechanism: Labor leads to love only when effort ends in completion.
- So what for Happy: A user's completed reframe is saved as a coping card in their own words (no rewriting by the app); an unfinished thought catch is saved as a draft, never shown as "failed" or "incomplete".

### F10. [VALIDATION] Naming a feeling reduces amygdala response
- Claim: Affect labeling of emotional faces reduced amygdala activity and increased right ventrolateral prefrontal cortex (RVLPFC) activity relative to other encoding tasks.
- Evidence: [S10] (fMRI lab study; small sample, image stimuli)
- Mechanism: RVLPFC activity was inversely correlated with amygdala activity, a relationship mediated by medial prefrontal cortex.
- So what for Happy: Check-in screen order: step 1 is choosing a feeling word from ≥12 granular words (not a 1–5 face scale alone); suggestions appear only after step 1.

### F11. [VALIDATION] Labeling works as implicit regulation without feeling like effort
- Claim: A review across experiential, autonomic, neural and behavioral measures characterizes affect labeling as an implicit form of emotion regulation.
- Evidence: [S11] (narrative review)
- Mechanism: Labeling reduces intensity without the user intending to regulate, unlike explicit reappraisal.
- So what for Happy: Copy rule: the check-in asks "Which word fits right now?" and never "How can you fix this feeling?"; Happi's first line after a low label acknowledges ("That sounds heavy.") before any suggestion (ED1.2).

### F12. [REWARD] Broken streaks reduce later engagement more when blamed on the self
- Claim: Across 7 studies, highlighting a broken streak lowered subsequent engagement relative to an intact one, the effect was larger when the break was attributed to the self, and it was attenuated when the streak could be repaired.
- Evidence: [S13] (consumer and lab studies; not a clinical population, transfer flagged)
- Mechanism: A logged streak becomes a goal in itself, so a visible break registers as goal failure.
- So what for Happy: The home `WeeklyStreakWidget` and Day 7/15 modal never render a broken or reset state; after a missed day the widget shows days practised this month, and the fire icon is replaced by a neutral leaf icon (forbidden: AP1.1 broken-flame imagery).

### F13. [RITUAL] Missing one day does not derail habit formation
- Claim: In 96 participants over 12 weeks, missing a single opportunity did not materially affect habit formation; time to 95% of the automaticity plateau ranged from 18 to 254 days.
- Evidence: [S14] (single cohort, self-reported automaticity; the widely quoted 66-day median comes from the same study)
- Mechanism: Automaticity rises on an asymptotic curve through context-cued repetition, so one gap barely moves the curve.
- So what for Happy: Return copy after 1–6 missed days: "Good to see you. One gap doesn't undo the practice." (no day count); habit education card states "most habits take about two months, gaps included".

### F14. [RITUAL] Rituals regulate emotion, goals and social connection
- Claim: An integrative review identifies three regulatory functions of rituals: emotion, performance goal states and social connection.
- Evidence: [S15] (integrative review); a widely cited experimental source for anxiety reduction [S16] is retracted and is not used.
- Mechanism: Bottom-up effects of fixed, repeated physical sequences plus top-down meaning give rituals their regulatory power.
- So what for Happy: An opening ritual of ≤60 s (Happi breathes once in a 4 s inhale / 4 s exhale cycle, user picks a feeling word) and a closing line ("Saved. That's yours.") are identical every session; the ritual is skippable with one tap and never labelled "required".

### F15. [RITUAL] Self-compassion after failure increases motivation to improve
- Claim: Across 4 experiments, participants induced to self-compassion after a failure or transgression showed more motivation to make amends and to improve than controls.
- Evidence: [S17] (student lab samples)
- Mechanism: Self-compassion lowers defensiveness, which allows incremental beliefs about a weakness.
- So what for Happy: Lapse and return copy models self-compassion and never self-criticism or should-statements (AP4.3): "Rough week? You came back, and that counts." is allowed; "You should check in every day" is forbidden.

### F16. [WARMTH] Warmth is judged before competence
- Claim: Social perception runs on two universal dimensions, warmth (intent) and competence (ability), and warmth is assessed first as a friend-or-foe judgment.
- Evidence: [S18] (review of the stereotype content model)
- Mechanism: Detecting intent precedes assessing ability because intent determines whether ability is a threat.
- So what for Happy: Screen-order rule: every Happi line opens with an acknowledgement clause (warmth) before any instruction clause (competence), e.g. "That was a lot. Want to try one step?"

### F17. [WARMTH] For organizations, perceived competence drives willingness to use
- Claim: In 3 experiments, consumers saw nonprofits as warmer but less competent than for-profits, and perceived competence predicted willingness to buy better than warmth.
- Evidence: [S19] (consumer experiments on firms; transfer to an app flagged)
- Mechanism: Warmth without competence produces no admiration; a credibility cue removed the gap.
- So what for Happy: Clinical content (distortion names, exercise steps) is written by app copy in plain, accurate CBT terms (AP7.2), never in Happi's voice; Happi carries warmth, the app carries competence.

### F18. [MEMORY] Perceived responsiveness converts disclosure into intimacy
- Claim: In event-contingent diary studies over 1 and 2 weeks, perceived partner responsiveness partially mediated the effect of self-disclosure and partner disclosure on felt intimacy.
- Evidence: [S20] (human–human relationships; transfer to an app flagged)
- Mechanism: Feeling understood, validated and cared for turns disclosure into closeness.
- So what for Happy: Completion screen reflects back one phrase the user typed (≤8 words, in quotes, with "you wrote") within the same screen, never a generic "Great job!".

### F19. [MEMORY] Covert personalization raises vulnerability and backfires
- Claim: Personalized ads built on covertly collected data lowered click-through and raised felt vulnerability compared with the same personalization built on overtly provided data.
- Evidence: [S21] (field and online experiments in advertising; transfer flagged)
- Mechanism: When collection is hidden, felt vulnerability outweighs relevance; trust-building cues reduce the effect.
- So what for Happy: Recall rule: every remembered item on the first screen of a return visit shows its source and date ("From your note on 12 Oct"); Happy never personalizes from data the user did not type or select (no location, typing speed or time-of-use inference, AP6.3).

### F20. [MEMORY] Sensitive recall needs user control to stay supportive
- Claim: Personalization effects reverse when users feel they lost control of their data, so recall must be user-controlled to remain a bond signal rather than a surveillance signal.
- Evidence: [S21], [S7]
- Mechanism: Vulnerability (S21) frustrates autonomy (S7), turning a relatedness cue into a threat.
- So what for Happy: Memory recall is off until the user saves a first coping card, then offered with one opt-in toggle; each recalled card has "Edit" and "Delete" actions; recall never appears in push notifications or lock-screen text (AE1.6, AP6.2).

### F21. [MEMORY] Mental-health app engagement collapses within 30 days
- Claim: Across 93 Android mental-health apps, median 15-day retention was 3.9% and 30-day retention was 3.3%, with a median daily open rate of 4.0%.
- Evidence: [S22] (panel usage data, Android only)
- Mechanism: Without a reason to return that the user values, installs decay to near zero in the first month.
- So what for Happy: The continuity hook is the user's own remembered words (F18–F20), not pressure; the design target is a return visit that greets with one recalled item, measured at Day 15 and Day 30.

### F22. [CULTURE] Cultures differ in the arousal level of ideal positive affect
- Claim: European American contexts value high-arousal positive states (excitement) more, and East Asian contexts value low-arousal positive states (calm) more.
- Evidence: [S23] (review of affect valuation theory studies)
- Mechanism: Ideal affect shapes which emotional expressions feel appropriate and which feel excessive.
- So what for Happy: Default register across all 8 locales (ar, de, en, es, fr, it, pt, zh) is low-arousal positive: no exclamation marks in routine copy, max 1 exclamation mark per screen at milestones, no "yay", no all-caps.

### F23. [CULTURE] Cute images narrow attention and promote careful behavior
- Claim: Viewing baby-animal images improved fine-motor performance by 43.9% versus 11.9% for adult-animal images (n = 48), and narrowed attentional focus in a further experiment (n = 36).
- Evidence: [S24] (Japanese university samples; small n)
- Mechanism: Cuteness induces positive affect with approach motivation, which narrows attention and increases care.
- So what for Happy: Happi stays visually cute (round face, large eyes) but copy stays adult-register (AP4.1); cute art never appears on screens that need broad attention (crisis resources, settings for data deletion).

### F24. [REWARD] Dopamine neurons encode prediction error
- Claim: Midbrain dopamine neurons signal the difference between predicted and received reward, not reward itself.
- Evidence: [S12] (primate electrophysiology review)
- Mechanism: Unpredictable rewards keep prediction error positive, which sustains cue-driven seeking.
- So what for Happy: Cadence rule: every acknowledgement is predictable (same trigger, same form); surprise is limited to rare, non-contingent warmth (≤1 unscheduled Happi moment per 7 days, never tied to opening the app).

### F-dose1. [REWARD] Variable reward → compulsive checking
- Claim: Rewards attached to opening the app on an unpredictable schedule can turn a coping tool into a checking habit for an anxious user.
- Evidence: [S12], [S6], inference: positive prediction error from random payouts reinforces the cue (opening the app), and expected contingent rewards lower intrinsic motivation, so the tool becomes the reward source.
- Mechanism: Original dose (games: loot chests, random gems on open) → CBT dose (predictable verbal acknowledgement) → guard (no randomness tied to any therapeutic action, AP2.3).
- So what for Happy: Forbidden: random rewards, mystery boxes, "spin" mechanics; guard metric: if a user opens the app >10 times in 24 h without completing an exercise, Happy shows no reward content on those opens.

### F-dose2. [ATTACHMENT] Attachment → dependence
- Claim: A bonded companion can become a user's main or only support, which harms when access breaks or the bot mirrors distress.
- Evidence: [S4], [S3]
- Mechanism: Original dose (companion apps: always-available partner) → CBT dose (bond within 5 days, F3) → guard (outward pointers, no exclusivity language).
- So what for Happy: Once per 7 days of use, a session close suggests one person-or-world action ("Is there someone you could tell about this?"); forbidden copy: "I'm always here for you", "only I understand" (AE1.5).

### F-dose3. [PARASOCIAL] Anthropomorphism → false clinical authority
- Claim: A trusted face that receives high disclosure can be mistaken for a clinician.
- Evidence: [S2], [S3], inference: users disclose more to non-human agents (S2) and bond with them at CBT-like levels (S3), so advice from that agent may be weighted like a therapist's.
- Mechanism: Original dose (Woebot-style conversational therapist) → CBT dose (Happi as companion, app as instructor) → guard (scope line and no clinical instruction from Happi).
- So what for Happy: Happi never gives diagnosis or treatment instruction (AP3.3); onboarding and settings carry the scope line "Happy supports CBT practice. It isn't therapy or a replacement for professional care." (AE1.3).

### F-dose4. [RECIPROCITY] Reciprocity → exploitation at emotional highs
- Claim: An ask placed directly after a warm, effortful moment exploits the reciprocity that the moment created.
- Evidence: [S8], inference: perceived effort triggers reciprocity (S8); the current `StreakDisplay` calls `requestReview()` on close of the Day 3/7/15 modal, converting that reciprocity into an App Store review.
- Mechanism: Original dose (consumer apps: review prompt at peak delight) → CBT dose (no asks on celebration or completion screens) → guard (review prompt only from a neutral settings entry or after ≥14 days of use on a non-celebration screen).
- So what for Happy: Remove the review request from the streak modal close handler; forbidden: share/review/upsell CTAs on any completion or milestone screen.

### F-dose5. [VALIDATION] Labeling → mood as a score
- Claim: Feeling words turned into numeric grades or charts of "good vs bad days" convert labeling into self-judgment.
- Evidence: [S11], [S6], inference: labeling regulates implicitly (S11), while evaluative, controlling feedback undermines motivation (S6), so scoring the label adds evaluation to a regulation act.
- Mechanism: Original dose (fitness apps: daily scores) → CBT dose (words, not grades) → guard (no ranking of feelings).
- So what for Happy: No "+XP" on logging sadness (ED1.3); mood history uses labelled words with icons, never a red/green colour-only scale (AE2.7).

### F-dose6. [MEMORY] Memory → surveillance
- Claim: Recalling sensitive content without visible source or control raises vulnerability.
- Evidence: [S21], [S20]
- Mechanism: Original dose (recommender personalization) → CBT dose (recall the user's own saved words with source) → guard (opt-in, edit/delete, never in notifications).
- So what for Happy: Forbidden: "You seemed anxious last night at 2:13am" (AP6.1); allowed: "From your note on 12 Oct: 'I handled it'."

### F-dose7. [RITUAL] Ritual → obligation
- Claim: A daily ritual framed as required becomes another standard the user can fail.
- Evidence: [S15], [S13], inference: rituals regulate goal states (S15) and logged sequences become goals in themselves (S13), so a mandatory ritual adds a failable goal.
- Mechanism: Original dose (daily-goal rings) → CBT dose (same ≤60 s opening every session) → guard (skippable, no completion count for the ritual itself).
- So what for Happy: The opening ritual has a visible "Skip" with no penalty copy (AE1.4); no ring or counter tracks ritual completion.

### F-dose8. [SDT] Autonomy → manipulation through reminders
- Claim: Reminders and personalization that cannot be switched off convert autonomy support into control.
- Evidence: [S7], [S6]
- Mechanism: Controlling features frustrate autonomy at the behavior and life spheres even when the interface feels satisfying.
- So what for Happy: Every reminder is opt-in, one-tap off from the notification itself, and turning it off shows "Done. You can turn it back on in Settings." (no penalty copy); cadence cap ≤1 non-user-scheduled push per day, backing off after 3 ignored (AP2.5).

### F-dose9. [CULTURE] Cuteness and celebration → infantilizing
- Claim: High-arousal, cute celebration applied to routine actions reads as cloying to users whose ideal affect is calm.
- Evidence: [S23], [S24], inference: low-arousal ideal affect (S23) plus the caretaking pull of cute art (S24) make baby talk and confetti feel like being treated as a child.
- Mechanism: Original dose (Duolingo: confetti and cheering on every lesson) → CBT dose (≤600 ms subtle acknowledgement on routine completion) → guard (≤1 high-arousal celebration per 7 days, Day 7/15 milestones only).
- So what for Happy: Forbidden copy: "yay!!", "superstar"; Day 7 modal copy: "Seven days of practice. That's real." with no confetti.

## Contradictions
- Intact logged streaks increase engagement [S13], yet missing a single day does not affect habit formation [S14], so a strict consecutive streak punishes a gap that does not matter. Decision: keep a practice count ("days practised this month") that cannot break, because it retains the logged-goal benefit of S13 without a visible break and matches S14's evidence that gaps are harmless.
- A human-like agent builds a CBT-level bond [S3], yet users disclose more to agents they believe are non-human [S2] and suffer when bots take on human needs [S4]. Decision: Happi has a face and voice (bond) but no claimed needs or feelings about the user, and is absent from the free-text disclosure field.
- Responsive recall of what a person disclosed builds intimacy [S20], yet covert personalization increases vulnerability [S21]. Decision: personalize only from content the user typed or selected, always with visible source and date.
- The ritual-anxiety experiment often cited for brief rituals [S16] is retracted (2024 notice), while the integrative review [S15] still supports ritual's regulatory functions. Decision: the opening ritual is justified on S15 and F13 only, kept ≤60 s and skippable, with no claim that it reduces anxiety.

## Rejected ideas
- Loss-framed streaks and streak-loss notifications ("Don't lose your streak!") — rejected because broken-streak salience lowers later engagement, most when self-blamed [S13], and one missed day does not harm habit formation [S14].
- Paid or earned streak freezes — rejected because repair only attenuates the broken-streak effect [S13] while adding pressure (AP1.2); the unbreakable practice count makes them unnecessary.
- Random reward chests, gems or "spin" on check-in — rejected because prediction-error reinforcement drives checking [S12] and expected contingent rewards cut intrinsic motivation (d = -0.40) [S6].
- Happi showing sadness or "missing" the user on absence — rejected because role-taking and mirrored distress were harm pathways in Replika users [S4].
- App Store review prompt on the Day 3/7/15 streak modal — rejected because it converts effort-based reciprocity [S8] into an ask at an emotional high.
- Citing Brooks et al. (2016) for "rituals reduce anxiety" — rejected because the paper is retracted [S16].

## Critique (pass 1)
Spot-checked by reopening: [S3] Darcy (PubMed: bond 3.8 within 5 days, confirmed), [S13] Silverman & Barasch (Crossref abstract: self-attribution amplifies, repair attenuates, confirmed), [S6] Deci et al. (PubMed: d = -0.40 confirmed; also found positive feedback d = 0.33, which pass 1 omitted).
- [FAIL] RQ3.3 Pass 1 gave no sample sizes or study limits for S2, S3, S4, S10, S14, S22; Darcy is retrospective and company-authored, Laestadius is self-selected Reddit posts, Lally is n = 96 self-report — none labelled.
- [FAIL] RQ3.4 Transfers from games (S5), consumer search (S8), IKEA tasks (S9), consumer streaks (S13), firm stereotypes (S18 in pass 1) and ad personalization (S20 in pass 1) were not flagged, and no original dose / CBT dose / guard triple was given.
- [FAIL] RQ2.3 So-whats such as "Lead with warmth", "Default to calm", "Show sources", "Point outward", "Clinical accuracy matters" and "Each session must deliver one moment of each need" name no screen, string, token or cadence.
- [FAIL] RQ2.4 The "reading what you wrote" state had no duration; "Happi stays cute" had no constraint; ritual had no length.
- [FAIL] AE1.1 Only 3 dose findings; adopted mechanisms memory, validation, ritual, reciprocity, autonomy and cuteness had no harmful extreme or guard.
- [FAIL] AE1.3 No scope language ("not therapy") despite F3 showing CBT-level bonds.
- [FAIL] AE1.4 Reminders, recall and ritual were not stated as opt-in or one-tap off with no penalty copy.
- [FAIL] AE1.5 Dependence guard was "Point outward" with no cadence or forbidden phrases.
- [FAIL] RQ1.5 S5 source line did not record how it was verified (publisher page blocked); a seed source (Brooks 2016) was found retracted during verification but not recorded.
- [FAIL] RQ1.6 F6 omitted that positive verbal feedback increased motivation (d = 0.33) in the same meta-analysis, under-reporting what S6 says.
- [FAIL] AE1.8 No age assumption stated while F21 (pass 1) recommends cute art.
- [PASS] RQ1.1 Every Claim has an Evidence line with [S#] or inference.
- [PASS] RQ5.1 Summary states decisions without "could/consider".
- [PASS] AE1.6 Recall editable/deletable stated in Summary (strengthened anyway in pass 2).
- [PASS] AE1.7 No efficacy claims for Happy; Darcy bond comparability is reported as Woebot's, not Happy's.
- [N/A] AE1.2 Phase 1 specifies no flows; crisis path is owned by Phases 3, 4 and 6.
- [N/A] AE2.1 No colour pairings in Phase 1; contrast belongs to Phase 5.
- [N/A] AE2.4 No animation is specified beyond durations; reduced-motion fallback belongs to Phases 3 and 5.

## Revisions
- Pass 2, RQ3.3: added sample size, design and limits in parentheses on every Evidence line (e.g. S2 n = 239 lab; S3 n = 36,070 retrospective, company-authored; S4 582 self-selected posts; S14 n = 96 self-report; S24 n = 48 and n = 36).
- Pass 2, RQ3.4: flagged every non-clinical transfer on its Evidence line and added the original dose → CBT dose → guard triple to each F-dose finding.
- Pass 2, RQ2.3: rewrote every So-what to name a target, e.g. `WeeklyStreakWidget` leaf icon and "days practised this month" (F12), 8-locale exclamation cap (F22), source-and-date recall string (F19), weekly outward line with forbidden phrases (F-dose2).
- Pass 2, RQ2.4: added units — reading state 800–1200 ms (F8), ritual ≤60 s with 4 s inhale / 4 s exhale (F14), routine acknowledgement ≤600 ms (F-dose9), ≤1 unscheduled moment per 7 days (F24).
- Pass 2, AE1.1: added F-dose4 to F-dose9 so each adopted mechanism (reciprocity, validation, memory, ritual, autonomy, cuteness) names its harmful extreme and guard.
- Pass 2, AE1.3: added the scope line "Happy supports CBT practice. It isn't therapy or a replacement for professional care." in F-dose3.
- Pass 2, AE1.4: F-dose7 and F-dose8 make ritual skippable and reminders opt-in, one-tap off, with "Done. You can turn it back on in Settings."; F20 makes recall opt-in.
- Pass 2, AE1.5: F-dose2 sets once per 7 days of use for an outward pointer and lists forbidden exclusivity phrases.
- Pass 2, RQ1.5: S5 line now records verification via the e-teaching.org bibliographic record and the ScienceDaily study report; added S16 (Brooks 2016 retraction, Crossref) and moved ritual support to S15 only.
- Pass 2, RQ1.6: F6 now reports positive feedback d = 0.33 and uses it to justify verbal acknowledgement in place of XP.
- Pass 2, AE1.8: added an audience assumption to Self-critique and Summary-linked F23: Phase 1 assumes adult users (18+), matching the S3 sample; cute art is paired with adult-register copy.
- Pass 2, other: added F21 (Baumel retention) and S22, S25 (Mathur dark patterns) so the 30-day collapse and dark-pattern prevalence ground the "no pressure" decision.

## Self-critique
- Weakest part: Most evidence is transferred from non-clinical populations (games, consumer streaks, ads, firm stereotypes); only S3, S4 and S22 study mental-health app users, and S3 is company-authored and cross-sectional. The audience assumption (adult users, 18+) is an inference from the S3 sample, not a product fact.
- A further pass should: find a peer-reviewed trial of streaks or gamification inside a mental-health app (not consumer), verify a study on chatbot dependence with a prevalence estimate (S4 has none), add a direct source for cross-cultural mascot acceptance in Arabic- and Chinese-speaking users (our ar and zh locales), and confirm Happy's actual minimum age with the product owner.
- Dark-pattern prevalence context: 1,818 dark-pattern instances across about 11,000 shopping sites [S25] shows pressure tactics are routine in consumer apps, which is why the anti-pattern list must be applied by default rather than case by case.

## Sources
- [S1] Epley, N., Waytz, A., & Cacioppo, J. T. (2007). On seeing human: A three-factor theory of anthropomorphism. Psychological Review, 114(4), 864–886. https://doi.org/10.1037/0033-295X.114.4.864 — PubMed 17907867 opened (peer)
- [S2] Lucas, G. M., Gratch, J., King, A., & Morency, L.-P. (2014). It's only a computer: Virtual humans increase willingness to disclose. Computers in Human Behavior, 37, 94–100. https://doi.org/10.1016/j.chb.2014.04.043 — Crossref record and MedicalXpress study report opened (peer)
- [S3] Darcy, A., Daniels, J., Salinger, D., Wicks, P., & Robinson, A. (2021). Evidence of human-level bonds established with a digital conversational agent: Cross-sectional, retrospective observational study. JMIR Formative Research, 5(5), e27868. https://doi.org/10.2196/27868 — PubMed 33973854 opened twice (peer)
- [S4] Laestadius, L., Bishop, A., Gonzalez, M., Illenčík, D., & Campos-Castillo, C. (2022). Too human and not human enough: A grounded theory analysis of mental health harms from emotional dependence on the social chatbot Replika. New Media & Society, 26(10), 5923–5941. https://doi.org/10.1177/14614448221142007 — Crossref abstract opened (peer)
- [S5] Ryan, R. M., Rigby, C. S., & Przybylski, A. (2006). The motivational pull of video games: A self-determination theory approach. Motivation and Emotion, 30(4), 344–360. https://doi.org/10.1007/s11031-006-9051-8 — publisher page blocked; e-teaching.org bibliographic record and ScienceDaily study report opened (peer)
- [S6] Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin, 125(6), 627–668. https://doi.org/10.1037/0033-2909.125.6.627 — PubMed 10589297 opened twice (peer)
- [S7] Peters, D., Calvo, R. A., & Ryan, R. M. (2018). Designing for motivation, engagement and wellbeing in digital experience. Frontiers in Psychology, 9, 797. https://doi.org/10.3389/fpsyg.2018.00797 — full text opened (peer)
- [S8] Buell, R. W., & Norton, M. I. (2011). The labor illusion: How operational transparency increases perceived value. Management Science, 57(9), 1564–1579. https://doi.org/10.1287/mnsc.1110.1376 — Crossref abstract opened (peer)
- [S9] Norton, M. I., Mochon, D., & Ariely, D. (2012). The IKEA effect: When labor leads to love. Journal of Consumer Psychology, 22(3), 453–460. https://doi.org/10.1016/j.jcps.2011.08.002 — Crossref abstract opened (peer)
- [S10] Lieberman, M. D., Eisenberger, N. I., Crockett, M. J., Tom, S. M., Pfeifer, J. H., & Way, B. M. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), 421–428. https://doi.org/10.1111/j.1467-9280.2007.01916.x — PubMed 17576282 opened (peer)
- [S11] Torre, J. B., & Lieberman, M. D. (2018). Putting feelings into words: Affect labeling as implicit emotion regulation. Emotion Review, 10(2), 116–124. https://doi.org/10.1177/1754073917742706 — Crossref abstract opened (peer)
- [S12] Schultz, W., Dayan, P., & Montague, P. R. (1997). A neural substrate of prediction and reward. Science, 275(5306), 1593–1599. https://doi.org/10.1126/science.275.5306.1593 — PubMed 9054347 opened (peer)
- [S13] Silverman, J., & Barasch, A. (2023). On or off track: How (broken) streaks affect consumer decisions. Journal of Consumer Research, 49(6), 1095–1117. https://doi.org/10.1093/jcr/ucac029 — UDSpace record and Crossref abstract opened (peer)
- [S14] Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology, 40(6), 998–1009. https://doi.org/10.1002/ejsp.674 — Crossref abstract opened (peer)
- [S15] Hobson, N. M., Schroeder, J., Risen, J. L., Xygalatas, D., & Inzlicht, M. (2018). The psychology of rituals: An integrative review and process-based framework. Personality and Social Psychology Review, 22(3), 260–284. https://doi.org/10.1177/1088868317734944 — Crossref abstract opened (peer)
- [S16] Brooks, A. W., et al. (2016). Don't stop believing: Rituals improve performance by decreasing anxiety. Organizational Behavior and Human Decision Processes, 137, 71–85. https://doi.org/10.1016/j.obhdp.2016.07.004 — RETRACTED; retraction notice https://doi.org/10.1016/j.obhdp.2024.104377 confirmed via Crossref; cited only to exclude it, not counted as peer support
- [S17] Breines, J. G., & Chen, S. (2012). Self-compassion increases self-improvement motivation. Personality and Social Psychology Bulletin, 38(9), 1133–1143. https://doi.org/10.1177/0146167212445599 — Crossref abstract opened (peer)
- [S18] Fiske, S. T., Cuddy, A. J. C., & Glick, P. (2007). Universal dimensions of social cognition: Warmth and competence. Trends in Cognitive Sciences, 11(2), 77–83. https://doi.org/10.1016/j.tics.2006.11.005 — PubMed 17188552 opened (peer)
- [S19] Aaker, J., Vohs, K. D., & Mogilner, C. (2010). Nonprofits are seen as warm and for-profits as competent: Firm stereotypes matter. Journal of Consumer Research, 37(2), 224–237. https://doi.org/10.1086/651566 — Crossref record and Stanford GSB research summary opened (peer)
- [S20] Laurenceau, J.-P., Barrett, L. F., & Pietromonaco, P. R. (1998). Intimacy as an interpersonal process: The importance of self-disclosure, partner disclosure, and perceived partner responsiveness in interpersonal exchanges. Journal of Personality and Social Psychology, 74(5), 1238–1251. https://doi.org/10.1037/0022-3514.74.5.1238 — PubMed 9599440 opened (peer)
- [S21] Aguirre, E., Mahr, D., Grewal, D., de Ruyter, K., & Wetzels, M. (2015). Unraveling the personalization paradox: The effect of information collection and trust-building strategies on online advertisement effectiveness. Journal of Retailing, 91(1), 34–49. https://doi.org/10.1016/j.jretai.2014.09.005 — University of Bath research portal abstract opened (peer)
- [S22] Baumel, A., Muench, F., Edan, S., & Kane, J. M. (2019). Objective user engagement with mental health apps: Systematic search and panel-based usage analysis. Journal of Medical Internet Research, 21(9), e14567. https://doi.org/10.2196/14567 — PubMed 31573916 opened (peer)
- [S23] Tsai, J. L. (2007). Ideal affect: Cultural causes and behavioral consequences. Perspectives on Psychological Science, 2(3), 242–259. https://doi.org/10.1111/j.1745-6916.2007.00043.x — Crossref abstract opened (peer)
- [S24] Nittono, H., Fukushima, M., Yano, A., & Moriya, H. (2012). The power of kawaii: Viewing cute images promotes a careful behavior and narrows attentional focus. PLOS ONE, 7(9), e46362. https://doi.org/10.1371/journal.pone.0046362 — full text opened (peer)
- [S25] Mathur, A., Acar, G., Friedman, M. J., Lucherini, E., Mayer, J., Chetty, M., & Narayanan, A. (2019). Dark patterns at scale: Findings from a crawl of 11K shopping websites. Proceedings of the ACM on Human-Computer Interaction, 3(CSCW), 81. https://doi.org/10.1145/3359183 — Crossref abstract opened (peer)
