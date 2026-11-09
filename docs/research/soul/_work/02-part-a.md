# Phase 2 — Competitive teardown, part A (Duolingo, BitePal, Finch, Ahead)

Worker: part A. Platform: Mobbin iOS, `search_screens` mode deep. Every screen below was opened as an image in this run; copy is transcribed from the image, not from metadata.
Phase 1 link lines use topic tags (Phase 1 artifact not yet present): [PARASOCIAL] [ATTACHMENT] [SDT] [RECIPROCITY] [VALIDATION] [REWARD] [RITUAL] [WARMTH] [MEMORY] [CULTURE].

Queries run (all ios):
- Duolingo: "Duolingo streak screen", "Duolingo welcome back after missed days", "Duolingo lesson complete celebration", "Duolingo notification permission reminder onboarding"
- BitePal: "BitePal mascot pet", "BitePal pet hungry sad health hearts low" (returned mostly Fi / Abode / Garmin; only 2 BitePal hits), "BitePal onboarding name your pet"
- Finch: "Finch self-care pet bird home", "Finch mood check-in reflection how are you feeling", "Finch streak welcome back missed day"
- Ahead: "Ahead emotional intelligence app", "Ahead mascot chat completion celebration" (returned 1 Ahead hit + Nibble, Deepstash, Alan, Me+, plus BitePal and Finch hits used below), "Ahead onboarding emotions how do you feel character"

No substitution needed: all four apps are on Mobbin iOS.

---

### App: Duolingo

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| Character | Duo leans in next to a flame with a speech bubble "Can you practice every day?" over a 1-day streak and a 7-dot week row; single CTA "I'M COMMITTED" | https://mobbin.com/screens/58c9920b-ef13-4098-ae02-2baa5d109c45 |
| Character | Day 6: Duo grins, bubble "Tomorrow makes 7 days, let's gooooooo!" — the mascot names the next milestone before it happens | https://mobbin.com/screens/f6675d16-c6b5-4847-aa9f-fb66a2d61e88 |
| Character (absence) | Home-screen widgets: crying ghost Duo "1 week abandoned"; wilted plant "1 week without French" | https://mobbin.com/screens/d7d5d9f4-233f-4cbe-99ba-02e32cc6dc16 |
| Character (absence) | Widget: Duo hugging the flame, "846 days / Don't forget me!" and "Come back soon!" | https://mobbin.com/screens/3ed7f990-7eea-4cfa-bc35-af1ee8ecee40 |
| Character (absence) | Widget escalation: Duo with red laser eyes, "Save your streak!", second tile is a dark red glaring face "Don't forget me!" | https://mobbin.com/screens/7d0f39fd-a349-4ef0-9a3b-d907200515fa |
| Copy (failure) | Duo slumped, "You didn't unlock Unit 2, but you can try again later!" — failure framed as deferral | https://mobbin.com/screens/0ee296cd-79ad-4c5c-b188-667df8c0b605 |
| Copy / progress | Streak page: "847 day streak!", "Keep your Perfect Streak by doing a lesson every day!", calendar with a "PERFECT" badge and "Freezes used" counter | https://mobbin.com/screens/801382ea-9bcc-4fd6-b461-a14b36161486 |
| Copy (urgency) | Frozen 5-day streak, ice flame, "Less than 3 hours to extend your 5 day streak!" with stopwatch icon and "EXTEND STREAK" | https://mobbin.com/screens/1755644a-3b98-4a8e-906f-0ef606e166eb |
| Progress / economy | "Streak Protection — 7-day Streak Shield BUY FOR 3000" gems; "Special Milestone Chest — Reach a 875 day streak to earn this reward — LOCKED" | https://mobbin.com/screens/64e6436a-7982-437f-862b-62748636aa0e |
| Motion / surprise | 5-day streak: the flame itself becomes a character wearing sunglasses on a full orange screen; CTA "SHARE +20 GEMS" | https://mobbin.com/screens/84ec5a7b-37ce-4c38-808d-7c3c91c3c0aa |
| Motion | "Lesson complete!" with Duo diving across a diagonal motion-blur band and floating squares | https://mobbin.com/screens/31fdc425-1a41-4b78-b4e6-762bff0b9306 |
| Copy (first win) | First lesson: "Learning legend!" / "You just completed your first lesson!" with stat tiles TOTAL XP 23, GREAT 93%, SPEEDY 2:49 | https://mobbin.com/screens/a5edfc91-474c-4ff6-b1b2-e418bfe5a383 |
| Ritual (permission) | Duo with pencil, bubble "I'll remind you to practice so it becomes a habit!", arrow pointing to iOS "Allow"; CTA "REMIND ME TO PRACTICE" | https://mobbin.com/screens/817844ed-f7df-4645-b18b-a9803879821f |
| Ritual (widget) | "I'll cheer you on from your home screen!" + "ADD WIDGET" / "NOT NOW" | https://mobbin.com/screens/02616458-9551-4f91-bd89-5c9e16046dc8 |
| Surprise | "Add the widget to unlock new Duos each day this week!" — daily variant art as the hook | https://mobbin.com/screens/a238f3ab-2e49-420a-89b6-0c22d6865c31 |
| Memory | Live Activity on lock screen: "Resume your lesson" with progress bar — picks up where the user left | https://mobbin.com/screens/b8fcbf2b-c981-4afc-9cff-1735a2fc6bd1 |
| Sound / haptic | Milestone animation is the single biggest measured lever: redesigned streak animation moved day-7 retention +1.7% [S1]. Character motion: "a subtle wing flap when you ace a quiz or a triumphant spin when you cross a milestone" [S5]. Haptic/sound specifics: not verified in this run (Duolingo blog returned 503). | [S1], [S5] |

Mascot mechanisms:
- Duo speaks in first person about the user's future ("I'll remind you", "I'll cheer you on") — the mascot takes on a job, which frames reminders as care rather than system alerts (817844ed, 02616458).
- Duo's face is a state display for streak risk: hugging (safe) → droopy "Please practice!" → laser eyes "Save your streak!" (3ed7f990, 7d0f39fd). Emotion escalates with the user's absence.
- The mascot is duplicated into the reward object (flame with sunglasses), so the streak itself becomes a second character (84ec5a7b).
- Failure screen keeps Duo slumped but copy forward-looking ("try again later!") (0ee296cd).

Non-mascot soul mechanisms:
- Calendar with "PERFECT" badge and freezes-used counter: progress is a visible artifact the user owns (801382ea).
- Lock-screen Live Activity holds the unfinished lesson — continuity without a character (b8fcbf2b).
- Stat tiles rename speed/accuracy with adjectives ("BLAZING", "SPEEDY") — the system grades the user (a5edfc91, 31fdc425).
- Gem economy attached to streak protection and sharing (64e6436a, 84ec5a7b).

Phase 1 link:
- [PARASOCIAL] Duo's first-person "I'll…" lines and daily widget variants build a repeated persona (817844ed, a238f3ab).
- [ATTACHMENT] inverted: warmth is contingent on attendance — Duo hugs at 846 days, glares when at risk (3ed7f990, 7d0f39fd). This is the anxious-checking extreme in the primer map.
- [REWARD] variable art ("new Duos each day") and gem rewards for sharing (a238f3ab, 84ec5a7b).
- [RITUAL] "I'M COMMITTED" tap after each streak day is a micro-commitment ritual (58c9920b).
- [SDT] competence via XP/accuracy tiles; autonomy reduced by loss framing.

Harm check:
- Guilt: observed — "1 week abandoned" with crying ghost Duo (d7d5d9f4); "Don't forget me!" (3ed7f990).
- Loss aversion: observed — "Keep your Perfect Streak" (801382ea); streak shield sold for 3000 gems (64e6436a, AP1.2); [S1] states "The threat of losing all of it gives this push weight".
- Fake urgency: observed — "Less than 3 hours to extend your 5 day streak!" with stopwatch (1755644a, AP2.1); [S1] describes an "urgent last-chance push" at day's end.
- Nagging: observed — escalating widget faces (7d0f39fd).
- Infantilizing: partial — "let's gooooooo!" (f6675d16) and "Learning legend!" for a first lesson (a5edfc91) are high-arousal praise for a minimal act (AP3.2, AP4.1).

URL count: 17

---

### App: BitePal

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| Character (naming) | Onboarding: "Name your raccoon", default "Alex", dice button for a random name; raccoon peeks in from the top-right corner | https://mobbin.com/screens/c4bc41b1-0690-4630-9cc4-bfd2647d601e |
| Character (care contract) | "Now you should take care of Caramel" / "Every time you log a meal, you fill Caramel health meter" with 4 hearts and a squinting-smile raccoon; CTA "Got it!" | https://mobbin.com/screens/904bb160-7998-47a0-acd8-f0ea3b401004 |
| Character (home) | Home: raccoon fills top ~45% of screen in an apple-orchard scene, name "Alex" + 4 hearts top-left, streak flame "2" | https://mobbin.com/screens/46a02ecf-d18a-4847-bb3c-6ba18e1b52bc |
| Surprise (seasonal) | Same home with Halloween pumpkins and fence; toast "Current fast was canceled" | https://mobbin.com/screens/00f41a2b-baf5-4fd9-affb-6b04770c856a |
| Motion / reaction | After a workout log: toast "1039 kcal burned / Workout logged", raccoon switches to sparkle eyes and open arms | https://mobbin.com/screens/17e84593-48e4-4a97-9efe-39f3edc4ced1 |
| Reciprocity (effort) | Photo scan: raccoon below the photo with hand on chin and floating question marks; label "Checking database.." | https://mobbin.com/screens/e904fdb7-bc19-486f-9f99-9bd7b0564e1b |
| Progress / ritual | "2 day streak!" — raccoon holding two check coins over a flame; week row; CTA "I'm commited" (layout mirrors Duolingo 58c9920b) | https://mobbin.com/screens/b04e4b6c-9383-498a-b2d0-6541427e3cc6 |
| Progress (celebration) | Fasting done: full-screen confetti, laughing raccoon, "26h 36m", "You've completed your 12h fasting goal. Great job staying committed!"; "Share to Stories" | https://mobbin.com/screens/b72074d3-9a06-4b05-91ed-0c8d5b354b46 |
| Character (economy) | Cosmetics shop: hats priced 250–300 coins; raccoon wearing selected cap | https://mobbin.com/screens/b4bd8e47-e8a0-45ac-8170-61ac7cee286e |
| Character (persistent) | Quick-add menu (Workout / Weight / Water / Fasting / Food) opens over the raccoon, which stays visible behind it | https://mobbin.com/screens/ca8ee4f2-2546-4c00-9696-3e4228ed0265 |
| Sound / haptic | Not visible; no verified source found this run. Absence behavior per review: "Miss logging for a few days and the pet visibly sulks." [S3] | [S3] |

Mascot mechanisms:
- User names the pet in onboarding; dice randomizer lowers effort of choice (c4bc41b1).
- Explicit care contract: logging = feeding = hearts (904bb160). The pet's health is a proxy for the user's compliance.
- Contingent expression: sparkle-eyed reaction to a logged workout (17e84593); sulking after missed days [S3].
- Mascot performs work: thinking pose with "Checking database.." while the AI scan runs (e904fdb7).
- Mascot is the cosmetics target, so spending currency is spending on the character (b4bd8e47).

Non-mascot soul mechanisms:
- Seasonal scene swap (Halloween) gives the home a sense of time passing without any copy (00f41a2b).
- Toast confirmations name the exact quantity ("1039 kcal burned") — specific, not generic praise (17e84593).
- Share-to-Stories after milestones turns progress into social proof (b72074d3).

Phase 1 link:
- [PARASOCIAL] named, always-visible pet occupying the top half of home (46a02ecf).
- [RECIPROCITY] visible "thinking" during scan (e904fdb7).
- [ATTACHMENT] inverted: health meter + sulking makes the pet's wellbeing contingent on the user's logging (904bb160, [S3]) — AP1.4 risk.
- [REWARD] coins → hats; confetti on goal completion (b4bd8e47, b72074d3).
- [RITUAL] "I'm commited" daily tap (b04e4b6c).

Harm check:
- Guilt: observed — "Now you should take care of Caramel" (should-statement, AP4.3) tied to a health meter (904bb160); sulking pet on absence [S3] (AP1.4).
- Loss aversion: observed — hearts as depletable health (904bb160); streak flame (46a02ecf).
- Fake urgency: not observed.
- Nagging: not observed on screens retrieved; notifications not surfaced on Mobbin.
- Infantilizing: not observed in copy; copy stays factual ("Great job staying committed!").

URL count: 10

---

### App: Finch

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| Character (lapse) | Bird holding a repair hammer, bubble "It's okay to miss a day. The important thing is you're here today, cheep!"; below: "Repair your 2 day streak?" / "Save your streak to keep it alive!" / "Repair for 2,000 FREE! 1ST TIME OFFER" / "Start over" | https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85 |
| Character (lapse, confirm) | "Are you sure you want to start your 10 day streak over?" — "Yes, start over" / "No, back to repair" | https://mobbin.com/screens/50df8ab5-8949-4b15-84a3-27f67dc18c1a |
| Ritual (pause) | "Turn on Pause mode?" — "Your Streak will be paused and preserved;" "Everything else in the app will be hidden for your peace of mind;" chooser "I will be back — in 1 day" | https://mobbin.com/screens/a75ce727-dff2-4e5c-bf63-125991e2e224 |
| Ritual (pause on) | "Pause mode is on — FOR 1 MORE DAYS"; "No goals and distractions. First Aid Kit is still here if you need it." "Take the time you need and continue your progress anytime." | https://mobbin.com/screens/a5edeeba-6436-4e55-a691-63b508711579 |
| Copy (return) | Paused area: bird lying down, "Feeling ready to jump back in?" + "Resume area" | https://mobbin.com/screens/a86fb86e-d3f7-49cc-9caa-2425306760b8 |
| Surprise | "You earned a free Streak Repair!" / "With this one-time Repair, you can miss one day without losing your streak." | https://mobbin.com/screens/6eff9964-d13f-4f24-8718-af13911bf158 |
| Character (home) | Baby bird in nest; "Gain energy so Lee can go discover new things today!"; toast "Your goal of the day is: Get out of bed" | https://mobbin.com/screens/13d6c98d-d362-4ae2-971f-d63601dcd598 |
| Character (home, grown) | Grown bird in outfit; inline under a goal: "Almost there, Alex!" | https://mobbin.com/screens/b5d29fad-9c88-43e0-9aa0-05b7602ab48d |
| Copy (tiny goals) | Goals list "Drink water", "Get out of bed", "Wash my face" with Skip / Snooze swipe actions | https://mobbin.com/screens/99094ecd-8045-4de7-a865-13ea77b3a9f0 |
| Ritual (absence of pet) | Bird walks off: "Adventuring — back in 6:00:31" with a progress track to a "?" — the pet leaves on its own schedule, not the user's | https://mobbin.com/screens/7c5b20e8-19e5-42c2-a800-65f3bef5b958 |
| Progress | Completed goals collapse into "Earlier today — Drink water, Do one thing that makes me happy, +1 more" | https://mobbin.com/screens/e7f40efd-01a8-4f03-828e-31db0c35dbc2 |
| Copy (first win) | Toast with bird: "You're amazing! First time completion!" | https://mobbin.com/screens/a36bbc85-679f-4396-b907-739d2bba480e |
| Motion | Energy bar hits "MAX", night forest, confetti, "Woohoo!" | https://mobbin.com/screens/80222488-59dd-476c-be09-49888f76e3cd |
| Check-in | "Start by taking a minute to pause and notice what you are feeling" — 3 options only: Pleasant / Neutral / Unpleasant | https://mobbin.com/screens/3bc93ed2-2835-415f-ba15-6bf094236d42 |
| Check-in | "What made you feel calm, balanced?" — the user's chosen words reused in the question, then context chips + free text | https://mobbin.com/screens/b2649bef-8a87-4874-aa5c-d0dbe7317557 |
| Memory | Reflection summary replays each prompt with the user's own answer ("Went on a roadtrip with my family", "Confused yet fun") | https://mobbin.com/screens/46bc26b8-3f04-4a9e-b206-47ef103f1723 |
| Reflection | "What is a moment in your past that you enjoyed or are grateful for?" with example hint and the user's typed answer | https://mobbin.com/screens/94b0269a-2d8f-4a53-a6a3-fad9372aacbe |
| Autonomy | "Mood check-in content" preference: Affirmation ("Make your inner voice kinder and more confident.") / Quote / Both | https://mobbin.com/screens/4c680bdf-2138-4a6b-b6b9-0ff9751f3cb4 |
| Progress (reflect) | After first completion: "Reflect on your progress — Get out of bed — First time completion!" with optional reflection prompts | https://mobbin.com/screens/5fb6d536-2c6e-445c-bcbc-9b8aa4fc4aa6 |
| Sound / haptic | Not visible on Mobbin; no verified source this run. Review: "Your bird never dies, streaks never punish you, and missing a day costs you nothing." [S2] — partly contradicted by the gem-priced repair screen d6e7a7b1. | [S2] |

Mascot mechanisms:
- Bird gives the lapse line in first person and in-voice ("cheep!"), normalizing the miss before any system option appears (d6e7a7b1).
- Pet is fed by the user's energy, but its departure ("Adventuring — back in 6:00:31") is framed as the pet's own life, not a punishment (7c5b20e8).
- Bird addresses the user by name inline next to a goal ("Almost there, Alex!") (b5d29fad).
- During Pause mode the bird lies down on grass — the character models rest rather than waiting (a75ce727, a86fb86e).
- Growth stages (baby in nest → dressed adult) make long-term progress visible on the character (13d6c98d, b5d29fad).

Non-mascot soul mechanisms:
- User-scheduled Pause mode that hides goals "for your peace of mind" and keeps "First Aid Kit" reachable (a75ce727, a5edeeba).
- Check-in starts coarse (3 valence options) then reuses the selected emotion word in the follow-up question (3bc93ed2, b2649bef).
- Reflection summary echoes the user's words verbatim (46bc26b8).
- Goals sized at self-care minimums ("Get out of bed") with Skip/Snooze always visible (99094ecd).
- User chooses whether check-ins end with an affirmation or a quote (4c680bdf).

Phase 1 link:
- [VALIDATION] "It's okay to miss a day…" before any option (d6e7a7b1).
- [SDT] autonomy: pause with self-set return date, Skip/Snooze, content preference (a75ce727, 99094ecd, 4c680bdf); competence: first-completion reflection (5fb6d536).
- [MEMORY] verbatim answer replay (46bc26b8); chosen emotion word reused (b2649bef).
- [ATTACHMENT] secure-base pattern: pet persists, rests, and returns on a fixed timer independent of user guilt (7c5b20e8).
- [RITUAL] morning goal-of-the-day (13d6c98d).
- [REWARD] gem-priced repair and confetti "Woohoo!" (d6e7a7b1, 80222488).

Harm check:
- Guilt: not observed in copy; lapse copy is explicitly non-blaming (d6e7a7b1).
- Loss aversion: observed, mild — "Save your streak to keep it alive!" and repair priced at 2,000 gems after the first free one (d6e7a7b1, AP1.2); confirm dialog "Are you sure you want to start your 10 day streak over?" (50df8ab5).
- Fake urgency: observed, mild — "1ST TIME OFFER" label on repair (d6e7a7b1).
- Nagging: not observed.
- Infantilizing: observed, mild — "You're amazing!" for a first checked task (a36bbc85, AP3.2); "Woohoo!" (80222488).

URL count: 20

---

### App: Ahead

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| Character (empathy) | Onboarding: lavender ghost holding a candle, sad eyes; "Are you carrying pain from something recent?" / "It could be loss, heartbreak, or something else that's been hard. You're not alone"; options include "I'm okay right now" | https://mobbin.com/screens/ccf1b06f-ef31-490a-9b8b-6e88935fcb22 |
| Character (per-emotion cast) | Topic cards each with a variant of the blob: Anger (red, steaming), Heartbreak (holding a split heart), Grief (under a rain cloud), with "% match" and learner counts | https://mobbin.com/screens/0f68e10e-aa7d-47ff-98fc-5d1f9235f9fd |
| Copy (reassure) | "Have you ever tried a personality or psychometric test before?" / "No problem if not - we'll do this together" | https://mobbin.com/screens/907ede0c-126c-4b6f-b73c-53a51091d692 |
| Ritual (commit) | "Give change a fair chance: Do 5 min of Ahead for 5 days!" / "The only way to fail is to give up too quickly." / "Ready to commit? Draw a happy face!" — finger-drawn face, CTA "I commit to myself" | https://mobbin.com/screens/91163634-334d-40ea-a43d-04baacad948c |
| Ritual (commit) | "Are you ready to invest in yourself?" / "Commit to yourself by drawing a checkmark:" / "I promise myself" | https://mobbin.com/screens/e3f5f49f-9020-482d-8a90-c03498e7f2a1 |
| Copy (validate → question) | Step 1/6: "Worries can feel very real. But they're just scary stories our brains come up with. Don't most worries stay just that - worries?"; optional "Note realizations here..." | https://mobbin.com/screens/aef7519a-2891-4779-a70b-ca9663bcc0ae |
| Copy (Socratic) | Step 2/6: "If a scary scenario takes over our entire mind, it can feel like it's bound to happen. But is something likely just because we can vividly imagine it?" | https://mobbin.com/screens/3225153d-c9bf-4a94-9a09-f019032cbf7d |
| Autonomy | "Pick a mantra that you can remember when emotions bubble up": "Worries are just stories!", "Those worries are guesses, not guaranteed messes!" | https://mobbin.com/screens/066118f3-f72b-44a6-ba60-54278f5ec5cb |
| Memory | "My Signs of Insecurity — Train to notice emotions": "Criticizing myself — Noticed 2 times", "Feeling judged — Noticed 1 times", "Fake-laughing" | https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9 |
| Progress (gated) | Same screen: "My Mind Map — Reach 7-day streak to unlock" / "Processing your insights... Hit a 7 day streak to uncover your patterns, triggers and personality traits" / "Streak days logged: 1/7" | https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9 |
| Progress | Skill bars "Self-awareness 220 XP/2500 XP", "Resilience 0 XP"; "Your hidden qualities are here! 84%"; "Daily streak 2" | https://mobbin.com/screens/de7ea7d0-a59c-4a7c-851b-1529b75370c0 |
| Progress (map) | Journey map with castle levels; level art "The 6 skills to conquer anxiety" with the blob among cacti and a comet | https://mobbin.com/screens/05e66e2f-b29a-4102-9532-2f93e7764746 |
| Character (persistent) | Center tab button is the blob with a heart above it; "Technique of the day" card | https://mobbin.com/screens/d048e0d7-d3b3-4e65-afc3-4657516f4baf |
| Copy (completion) | Trophy-blob with crown and sunglasses: "You just rewired your brain!" / "Soon you'll be your best in any situation." + "Did you find this activity helpful?" thumbs | https://mobbin.com/screens/eff02637-d235-4f75-ba96-34b68740a83f |
| Sound / haptic | Not visible; App Store listing describes "short, playful steps" and "5 minutes a day"; Apple Design Award 2024 Social Impact [S4]. No sound/haptic claim verified. | [S4] |

Mascot mechanisms:
- One base character recast per emotion (anger, heartbreak, grief), so the mascot mirrors the user's state instead of staying cheerful (0f68e10e, ccf1b06f).
- Mascot appears in grief context with matching sad expression and a candle — emotion matched, not upbeat (ccf1b06f).
- Mascot lives as the center tab — always one tap away, never covering content (d048e0d7).
- Mascot dressed as a trophy on completion, paired with a clinical-sounding claim (eff02637).

Non-mascot soul mechanisms:
- Validate-then-question sequence in exercise copy ("can feel very real. But…") (aef7519a, 3225153d).
- Body-based commitment: finger-drawn smiley or checkmark as the signature (91163634, e3f5f49f).
- Counts of the user's own noticed patterns ("Criticizing myself — Noticed 2 times") (a03ee6bd).
- User picks their own mantra from 6 rhymed options (066118f3).
- Optional note field on every step, saved to a named list ("Save to worries") (3225153d).
- Exit ramp offered in onboarding ("I'm okay right now") (ccf1b06f).

Phase 1 link:
- [VALIDATION] "You're not alone"; "can feel very real" before the reframe (ccf1b06f, aef7519a).
- [MEMORY] noticed-sign counts (a03ee6bd).
- [RITUAL] drawn commitment (91163634).
- [SDT] autonomy via mantra choice (066118f3); competence via XP skill bars (de7ea7d0).
- [RECIPROCITY] "Processing your insights..." framed as work being done for the user (a03ee6bd).
- [CULTURE] emotion cast uses low-arousal sad/neutral faces for grief and heartbreak rather than smiles (0f68e10e).

Harm check:
- Guilt: not observed.
- Loss aversion / gating: observed — personal insights withheld until "Hit a 7 day streak" (a03ee6bd); streak counter in header on every tab (d048e0d7).
- Fake urgency: not observed.
- Nagging: not observed on screens; daily reminders not verified on a screen.
- Infantilizing / overclaim: observed — "You just rewired your brain!" / "Soon you'll be your best in any situation." after one 6-step exercise (eff02637, AP7.3 + AP3.2); "The only way to fail is to give up too quickly." assigns failure to the user (91163634, AP4.3).

URL count: 13

---

## Candidate cross-app findings

### F1. Absence copy splits into blame vs. permission
- Claim: Of the 3 apps with observed absence/lapse copy, Duolingo attributes the gap to the user ("1 week abandoned", "Don't forget me!") while Finch states the miss is acceptable before offering any option ("It's okay to miss a day.").
- Evidence: https://mobbin.com/screens/d7d5d9f4-233f-4cbe-99ba-02e32cc6dc16 | https://mobbin.com/screens/7d0f39fd-a349-4ef0-9a3b-d907200515fa | https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85 | [S1] | [S2]
- Mechanism: Duolingo's copy makes the mascot's distress contingent on attendance, which converts the gap into guilt and works via loss aversion ([S1]: "The threat of losing all of it gives this push weight"); Finch's line separates the behavior (missed day) from the person — the guilt-not-shame distinction — so the returning user has no self-judgment to clear before acting.
- So what for Happy: Happi's return line names the gap neutrally and never shows a sad/angry Happi on absence; the Day 7/15 streak modal should not exist in a loss-framed form, and any widget/notification art must not escalate Happi's expression with days away.

### F2. Replaying the user's own words is the strongest observed memory signal
- Claim: 2 of 4 apps show the user their own past input back (Finch verbatim answers in a summary; Ahead counts of self-identified patterns), and neither uses inference to do it.
- Evidence: https://mobbin.com/screens/46bc26b8-3f04-4a9e-b206-47ef103f1723 | https://mobbin.com/screens/b2649bef-8a87-4874-aa5c-d0dbe7317557 | https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9
- Mechanism: Being remembered signals being valued (intimacy model); reusing the exact words the user typed or selected keeps the source visible, which avoids the surveillance read that inferred recall triggers (AP6.1).
- So what for Happy: After a thought record, Happi's closing screen quotes one phrase the user wrote (with the date it came from); home can show "you noticed 'all-or-nothing' 3 times" from user-tagged distortions only — never inferred ones.

### F3. Streak-day screens are copied across apps and carry the same commitment demand
- Claim: Duolingo and BitePal ship a near-identical streak screen (large day number, 7-dot week row, mascot over a flame, single CTA "I'm committed"), and Ahead gates personal insight behind "Hit a 7 day streak".
- Evidence: https://mobbin.com/screens/58c9920b-ef13-4098-ae02-2baa5d109c45 | https://mobbin.com/screens/b04e4b6c-9383-498a-b2d0-6541427e3cc6 | https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9
- Mechanism: The only CTA is an affirmation of future commitment, so each day's completion is converted into a promise that a missed day will later break; gating insight on consecutive days makes a hard day cost the user their own data.
- So what for Happy: Replace the Day 7/15 streak modal with a total-entries count ("12 entries so far") and no forward-commitment CTA; never lock a user's own patterns or history behind consecutive days.

### F4. Only Finch lets the user schedule a break that protects progress
- Claim: Finch is the only app of the 4 with a user-initiated Pause mode that preserves the streak, hides goals "for your peace of mind", and keeps a support path open; Duolingo sells the equivalent as a 3000-gem shield.
- Evidence: https://mobbin.com/screens/a75ce727-dff2-4e5c-bf63-125991e2e224 | https://mobbin.com/screens/a5edeeba-6436-4e55-a691-63b508711579 | https://mobbin.com/screens/64e6436a-7982-437f-862b-62748636aa0e
- Mechanism: A self-chosen pause supports autonomy (SDT) and removes the anticipated loss that drives anxious checking; selling protection instead monetizes the anxiety the streak created (AP1.2).
- So what for Happy: Add "Take a break" in settings and in the return flow; user picks 1–14 days; home shows Happi resting; CBT tools and crisis link stay reachable; no currency involved.

### F5. Acknowledge-then-question is the copy pattern in the two mental-health apps
- Claim: Ahead's exercise copy validates the feeling in the first clause before the Socratic question ("Worries can feel very real. But…"), and Finch's lapse copy validates before offering choices; the Duolingo and BitePal screens retrieved skip the validation step.
- Evidence: https://mobbin.com/screens/aef7519a-2891-4779-a70b-ca9663bcc0ae | https://mobbin.com/screens/3225153d-c9bf-4a94-9a09-f019032cbf7d | https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85 | https://mobbin.com/screens/ccf1b06f-ef31-490a-9b8b-6e88935fcb22
- Mechanism: Linehan-style validation lowers defensiveness, so the follow-up reframe reads as an invitation rather than a correction of the user.
- So what for Happy: Every Happi prompt that challenges a thought follows a fixed 2-beat template — reflect the feeling in the user's word, then one question — and Happi never offers the reframe first.

### F6. Mascots that visibly work for the user show reciprocity without claims
- Claim: BitePal (raccoon thinking pose + "Checking database..") and Ahead ("Processing your insights...") both show the system doing effort on the user's behalf at the moment of waiting.
- Evidence: https://mobbin.com/screens/e904fdb7-bc19-486f-9f99-9bd7b0564e1b | https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9
- Mechanism: inference: visible effort raises perceived value of the output (labor-illusion / Buell & Norton, to be re-sourced in Phase 1) and creates a reciprocity cue; on a character it reads as attention rather than loading.
- So what for Happy: When summarizing an entry or building a pattern view, show Happi reading the entry for ≤1.5 s with a short label ("Reading what you wrote…"); no fake delay beyond real processing time.

### F7. Celebration intensity is unrelated to effort in 3 of 4 apps
- Claim: Duolingo ("Learning legend!"), Finch ("You're amazing!") and Ahead ("You just rewired your brain!") each give top-register praise for a first minimal action, while BitePal's completion copy names the exact accomplishment ("You've completed your 12h fasting goal").
- Evidence: https://mobbin.com/screens/a5edfc91-474c-4ff6-b1b2-e418bfe5a383 | https://mobbin.com/screens/a36bbc85-679f-4396-b907-739d2bba480e | https://mobbin.com/screens/eff02637-d235-4f75-ba96-34b68740a83f | https://mobbin.com/screens/b72074d3-9a06-4b05-91ed-0c8d5b354b46
- Mechanism: Unearned praise loses information value (AP3.2); for depressed or anxious users high-arousal praise can contradict their self-view and read as hollow; Ahead's version also makes an unsupported treatment claim (AP7.3).
- So what for Happy: Happi's completion line states what the user did in specifics ("You wrote down the thought and found 2 other ways to see it"), low-arousal by default; no "amazing/legend" register and no brain-change claims.

## Sources
- [S1] Deconstructor of Fun — Duolingo mechanics: Streaks. https://duolingo.deconstructoroffun.com/mechanics/streaks (opened; "+1.7%" day-7 retention from phoenix animation; "The threat of losing all of it gives this push weight"; "urgent last-chance push")
- [S2] Habitbox — Finch app review. https://habitbox.app/blog/finch-app-review (opened; "Your bird never dies, streaks never punish you, and missing a day costs you nothing.")
- [S3] Nutrola — BitePal Review 2026. https://nutrola.app/en/blog/bitepal-review-2026 (opened; "Miss logging for a few days and the pet visibly sulks.")
- [S4] Apple App Store — Ahead: Emotional Companion. https://apps.apple.com/us/app/ahead-emotional-companion/id1570430177 (opened; "in just 5 minutes a day"; Apple Design Award 2024 Social Impact)
- [S5] 60fps Design — "Fun in Every Frame". https://60fpsdesign.substack.com/p/fun-in-every-frame (opened; Duo wing-flap / milestone-spin quote)
- (unverified, not counted) blog.duolingo.com/streak-milestone-design-animation — HTTP 503 twice; haptics-as-instrument claim from search snippet not used.
