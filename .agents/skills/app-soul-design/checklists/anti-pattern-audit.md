# Anti-pattern audit

Phase 2 uses this as an observation lens (record which competitors exhibit each, with screens). Phases 3, 4, 6 must show their own spec contains none; any hit is a FAIL.

## AP1 Guilt and loss
- **AP1.1** Loss-framed streaks ("Don't lose your streak!"), streak-loss notifications, broken-flame imagery.
- **AP1.2** Streak freezes sold or earned via pressure; paid repair of a streak.
- **AP1.3** Absence copy that assigns blame ("We missed you… where were you?", "Happi is sad you left").
- **AP1.4** Mascot or pet that decays, starves, wilts, or "gets sick" when the user is away.

## AP2 Manipulation and dark patterns
- **AP2.1** Fake urgency or scarcity (countdown timers, "only today") outside real constraints.
- **AP2.2** Confirmshaming ("No thanks, I don't care about my mental health").
- **AP2.3** Variable-ratio reward loops (loot chests, random gems) attached to therapeutic actions.
- **AP2.4** Engagement metrics as goals in copy ("Open the app 3× today!").
- **AP2.5** Notification spam: >1 non-user-scheduled push per day, or pushes after the user ignores 3 in a row without backing off.
- **AP2.6** Paywall interrupting a distress moment or a crisis path.

## AP3 Mascot misuse
- **AP3.1** Mascot talks more than the cap, interrupts a task, or blocks content.
- **AP3.2** Mascot performs emotion it has not earned (cheering a first-ever log as "amazing", crying at absence).
- **AP3.3** Mascot gives clinical instruction or diagnosis; presents as therapist.
- **AP3.4** Mascot appears on crisis resources or over the user's own distress text.

## AP4 Tone failures
- **AP4.1** Infantilizing or cloying copy (baby talk, "yay!!", "you're a superstar!!").
- **AP4.2** Toxic positivity ("Just think happy thoughts!", "Good vibes only") or dismissing distress ("Cheer up!").
- **AP4.3** Moralizing or should-statements directed at the user (itself a CBT cognitive distortion).

## AP5 Noise
- **AP5.1** Confetti, particle bursts or sound on routine actions.
- **AP5.2** Idle animations on UI chrome; more than one main action per screen (rossark principle 7).
- **AP5.3** Novelty without a decay plan (same surprise every day).

## AP6 Surveillance
- **AP6.1** Recall of sensitive data without a visible source ("You seemed anxious last night at 2:13am").
- **AP6.2** Mood or content visible in lock-screen notifications or widgets by default.
- **AP6.3** Inference from data the user did not knowingly give (location, contacts, typing speed) for personalization.

## AP7 Clinical accuracy
- **AP7.1** CBT instructions simplified to the point of inaccuracy (e.g. "replace negative thoughts with positive ones" instead of evidence-based reappraisal).
- **AP7.2** Cognitive-distortion names or exercise steps altered for cuteness.
- **AP7.3** Claims of treatment effect not supported by evidence ("This will cure your anxiety").

## AP8 Accessibility sacrificed to aesthetics
- **AP8.1** Text contrast <4.5:1 or UI component contrast <3:1.
- **AP8.2** Touch targets <44×44 pt.
- **AP8.3** Motion without reduced-motion fallback; flashing >3 Hz.
- **AP8.4** Meaning carried by color alone (mood colors without labels).

## AP9 Visual slop
- **AP9.1** Grey eyebrow label over every field, left-rule blockquote, tinted callout card, metadata pills, per-field bars (`references/prototype-learnings.md` L9).
- **AP9.2** Decorative element that encodes nothing (L10); raw numeric scales where words work (L5); good/bad colouring of direction (L6).
- **AP9.3** Exercise screen that is a form, not a conversation (L1), or focus styling on text fields (L11).
