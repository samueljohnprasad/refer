# Phase 2 — Competitive teardown

Pass: 2
Inputs: docs/research/soul/01-psychology.md (PASS), docs/research/soul/_work/02-part-a.md, 02-part-b.md, 02-part-c.md, .agents/skills/app-soul-design/phases/02-competitive-teardown.md, checklists/research-quality.md, checklists/anti-pattern-audit.md, references/evidence-template.md

## Summary
- Happy's Day 7/15 streak modal is rebuilt around a count that cannot break: total entries plus "days this week", never a consecutive chain that resets to 0 (F3, F4, F5).
- The modal gets no forward-commitment CTA ("I'm committed" pattern is never copied) and carries a "Hide streak" control from the first streak surface on Day 1 (F3, F4).
- `requestReview` is removed from the streak-modal close; the review ask moves to a neutral, non-celebratory moment (F9).
- Happi's absence behavior is rest, never decay: no sad, angry or sick Happi on return, widgets or notifications; return copy names no duration (F2, F6).
- After every Thought Catch save Happi quotes ≤8 of the user's own words in quotation marks next to the entry before any reframe prompt (F1, F7).
- Completion copy names what the user did in specifics at low arousal; "amazing", "legend", "rewired your brain" registers are banned (F8).
- Happi leaves crisis/SOS surfaces and never sits over the user's distress text (F10).
- Steal from Finch, Gentler Streak, Stoic, Wysa; adapt Duolingo's milestone motion down to one calm 600–900 ms beat; never copy pet decay, paid streak repair, percentile ranks or character-voiced pushes (Steal / Adapt-down / Never).

## Method and coverage
- Platform: Mobbin iOS, `search_screens` (deep) and `search_flows`, run by three workers (parts A, B, C) and re-checked by the phase owner. Every screen was described from the returned image; quoted copy is transcribed from the image.
- 13 app sections: Duolingo, BitePal, Finch, Ahead, Headspace, Calm, How We Feel, Stoic, Tolan, Opal, Balance, Wysa, Gentler Streak.
- Substitutions: **Rootd not on Mobbin** (queries: `Rootd panic attack button`, `Rootd anxiety app home screen`, flow `Rootd onboarding`) → Tolan. **Daylio not on Mobbin** (queries: `Daylio mood check-in`, flow `Daylio mood diary entry`, `Daylio`) → Opal. Bearable also checked, not on Mobbin. Standout added: Gentler Streak.
- Queries per app are listed in the worker drafts under `docs/research/soul/_work/`; the phase owner added 5 re-searches during critique (`Finch streak repair missed day`, `Stoic streak turn off first reflection`, `Wysa crisis SOS helpline screen`, `Duolingo frozen streak hours left to extend streak`, `Calm weekly streak days this week check marks`).
- Limits: Mobbin stills cannot show motion timing, sound or haptics; those channels rely on web sources and are marked weak/absent where unverified. Notification cadence is not visible on Mobbin for any app.
- "Phase 1 link" lines cite finding ids from `01-psychology.md` as `P1-F#`.

## App teardowns

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
| Motion (measured) | Redesigned milestone (phoenix) animation moved day-7 retention +1.7% [S1] — a language-learning result, not a mental-health one. Character motion: "a subtle wing flap when you ace a quiz or a triumphant spin when you cross a milestone" [S5]. | [S1], [S5] |
| Sound / haptic | (unverified) Duolingo's own milestone-design post [S11] returned HTTP 503 on 3 fetches in this run; [S1] does not mention sound or haptics. No sound/haptic claim is made or counted for Duolingo. | — |
| Progress (gated) | Streak page: Streak Goal bar 1 → 3 → 5 days; "Reach a 7 day streak to join the Streak Society and earn exclusive rewards" behind a padlock (seen on re-search during critique) | https://mobbin.com/screens/fbef2d10-7767-41e4-8a9f-825e022ead13 |

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
- P1-F1, P1-F2: Duo's first-person "I'll…" lines and daily widget variants build a repeated persona (817844ed, a238f3ab).
- P1-F4, P1-F-dose2 (inverted attachment): warmth is contingent on attendance — Duo hugs at 846 days, glares when at risk (3ed7f990, 7d0f39fd). This is the anxious-checking extreme in the primer map.
- P1-F24, P1-F-dose1: variable art ("new Duos each day") and gem rewards for sharing (a238f3ab, 84ec5a7b).
- P1-F-dose7, P1-F12: "I'M COMMITTED" tap after each streak day is a micro-commitment ritual (58c9920b).
- P1-F5, P1-F6: competence via XP/accuracy tiles; autonomy reduced by loss framing; Streak Society reward is engagement-contingent (fbef2d10).

Harm check:
- Guilt: observed — "1 week abandoned" with crying ghost Duo (d7d5d9f4); "Don't forget me!" (3ed7f990).
- Loss aversion: observed — "Keep your Perfect Streak" (801382ea); streak shield sold for 3000 gems (64e6436a, AP1.2); [S1] states "The threat of losing all of it gives this push weight".
- Fake urgency: observed — "Less than 3 hours to extend your 5 day streak!" with stopwatch (1755644a, AP2.1); [S1] describes an "urgent last-chance push" at day's end.
- Nagging: observed — escalating widget faces (7d0f39fd).
- Infantilizing: partial — "let's gooooooo!" (f6675d16) and "Learning legend!" for a first lesson (a5edfc91) are high-arousal praise for a minimal act (AP3.2, AP4.1).

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
| Sound / haptic | Not visible; no verified source found this run. Absence behavior per review: "Miss logging for a few days and the pet visibly sulks." [S3] (single non-peer review) | [S3] |

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
- P1-F1, P1-F9: named (user-authored), always-visible pet occupying the top half of home (46a02ecf).
- P1-F8: visible "thinking" during scan (e904fdb7).
- P1-F4, P1-F-dose2 (inverted attachment): health meter + sulking makes the pet's wellbeing contingent on the user's logging (904bb160, [S3]) — AP1.4 risk.
- P1-F6, P1-F-dose1: coins → hats; confetti on goal completion (b4bd8e47, b72074d3).
- P1-F-dose7: "I'm commited" daily tap (b04e4b6c).

Harm check:
- Guilt: observed — "Now you should take care of Caramel" (should-statement, AP4.3) tied to a health meter (904bb160); sulking pet on absence [S3] (AP1.4).
- Loss aversion: observed — hearts as depletable health (904bb160); streak flame (46a02ecf).
- Fake urgency: not observed.
- Nagging: not observed on screens retrieved; notifications not surfaced on Mobbin.
- Infantilizing: not observed in copy; copy stays factual ("Great job staying committed!").

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
| Sound / haptic | Not visible on Mobbin; no verified source. Review (re-opened in critique) states Finch's streaks "never penalize missed days" and the bird "never dies if you skip a day" [S2] — partly contradicted by the gem-priced repair screen d6e7a7b1. | [S2] |
| Progress (opt-out) | Streak sheet "3 day streak! Open the app and visit Lee every day to maintain your self-care streak!" overlaid by "Don't find Streaks motivating? You can turn them off if you want." with toggles Pause mode / Enable daily check-in streaks / Adjust day boundary (seen on re-search during critique) | https://mobbin.com/screens/dc8d14c8-3908-497e-9ec4-82a26ef4eb15 |

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
- P1-F15, P1-F12: "It's okay to miss a day…" before any option (d6e7a7b1).
- P1-F5, P1-F-dose8: autonomy: streak off-switch (dc8d14c8), pause with self-set return date, Skip/Snooze, content preference (a75ce727, 99094ecd, 4c680bdf); competence: first-completion reflection (5fb6d536).
- P1-F18: verbatim answer replay (46bc26b8); chosen emotion word reused (b2649bef).
- P1-F3, P1-F-dose2: secure-base pattern: pet persists, rests, and returns on a fixed timer independent of user guilt (7c5b20e8).
- P1-F13, P1-F14: morning goal-of-the-day (13d6c98d).
- P1-F12 (repair attenuates break harm), P1-F-dose1: gem-priced repair and confetti "Woohoo!" (d6e7a7b1, 80222488).

Harm check:
- Guilt: not observed in copy; lapse copy is explicitly non-blaming (d6e7a7b1).
- Loss aversion: observed, mild — "Save your streak to keep it alive!" and repair priced at 2,000 gems after the first free one (d6e7a7b1, AP1.2); confirm dialog "Are you sure you want to start your 10 day streak over?" (50df8ab5).
- Fake urgency: observed, mild — "1ST TIME OFFER" label on repair (d6e7a7b1).
- Nagging: not observed.
- Infantilizing: observed, mild — "You're amazing!" for a first checked task (a36bbc85, AP3.2); "Woohoo!" (80222488).

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
- P1-F10, P1-F15: "You're not alone"; "can feel very real" before the reframe (ccf1b06f, aef7519a).
- P1-F18, P1-F20: noticed-sign counts (a03ee6bd).
- P1-F14, P1-F-dose7: drawn commitment (91163634).
- P1-F5: autonomy via mantra choice (066118f3); competence via XP skill bars (de7ea7d0).
- P1-F8: "Processing your insights..." framed as work being done for the user (a03ee6bd).
- P1-F22, P1-F4: emotion cast uses low-arousal sad/neutral faces for grief and heartbreak rather than smiles (0f68e10e).

Harm check:
- Guilt: not observed.
- Loss aversion / gating: observed — personal insights withheld until "Hit a 7 day streak" (a03ee6bd); streak counter in header on every tab (d048e0d7).
- Fake urgency: not observed.
- Nagging: not observed on screens; daily reminders not verified on a screen.
- Infantilizing / overclaim: observed — "You just rewired your brain!" / "Soon you'll be your best in any situation." after one 6-step exercise (eff02637, AP7.3 + AP3.2); "The only way to fail is to give up too quickly." assigns failure to the user (91163634, AP4.3).

### App: Headspace

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| character | Faceless orange/yellow "sun" blobs with closed-eye smiles head the check-in prompt and the goal picker; no name, no dialogue, no animation visible in stills | https://mobbin.com/screens/1f158192-d73e-4196-9ec1-6be406e76b59 |
| character | Same closed-eye smile is drawn onto a bell to frame the notification ask: "Your 14 day trial has started" with "Remind me" / "Maybe later" | https://mobbin.com/screens/66e6952c-8999-4997-903d-514d9e6fbb4c |
| copy | Post-first-session check-in uses first name and names the effort: "Let's take a moment to check in, Alex" / "You just finished your first exercise — great job." | https://mobbin.com/screens/21881bb1-e8ed-4f0d-9615-5d43f7add214 |
| copy | Reflection answers include negative and uncertain options: "Challenging, but I'm eager to keep trying", "Difficult, I'm feeling discouraged", "I'm not sure" | https://mobbin.com/screens/60bf931f-5547-4244-91a0-a15b3a7edffe |
| progress | Session-end card shows "Run Streak 1" above a normalising quote: "It's normal for your thoughts to wander..." | https://mobbin.com/screens/4317df7c-ee78-4696-bbd9-e88af979b904 |
| progress | Profile streak can be hidden (eye icon); hidden state replaces the number with "Remember, this is all about you. Meditate on a schedule that feels good." | https://mobbin.com/screens/bb0004ec-e553-4e4d-a10e-1e21e59c8781 |
| progress | Visible state of the same row: "Run streak 1 day" with flag illustration and eye toggle | https://mobbin.com/screens/9aa70f7b-071a-4879-8c2e-f8dcc3d8ef0a |
| memory | Anxiety chart empty state: "Start tracking your anxiety over time with bi-weekly check-ins." — memory is offered as a future, not shown as a gap | https://mobbin.com/screens/0731479c-5e54-49d6-a10c-27cc0a97ce33 |
| memory | Activity history grouped by date (Aug 20, Aug 19) lists every played item | https://mobbin.com/screens/e779c6a0-bcdf-47e5-ad1b-77d69d21efa0 |
| ritual | Bedtime reminders split into "Wind-down reminder" and "Bedtime reminder" — "Get a gentle nudge when it's time for bed." | https://mobbin.com/screens/046e6e13-fa43-4d69-96a3-58fa7b8e42b8 |
| sound/haptic | Per-session "Haptic Assistance" toggle: "Receive a series of gentle haptic vibrations that let you know when it's time to look at your device." Watch app: 4-s in / 4-s out taps [S8] | https://mobbin.com/screens/1749c7df-ee7d-4f21-8358-c518a39a0a48 |
| surprise | Rotating quote on the session-end card (two different quotes on two captures of the same card) | https://mobbin.com/screens/b5f5652b-3033-4f25-8d19-8c93583dd184 |
| clinical | GAD-7-style item "Over the last two weeks, how often have you been bothered by..." 1/7 | https://mobbin.com/screens/adb5db43-5635-43cb-bd6c-186aebf23010 |

Mascot mechanisms:
- No named mascot. Illustrated "smile blob" characters act as an ambient brand face: they sit above the question, never speak, never react to the answer (https://mobbin.com/screens/60bf931f-5547-4244-91a0-a15b3a7edffe).
- Character is reused on system asks (notification bell) to soften a permission request (https://mobbin.com/screens/66e6952c-8999-4997-903d-514d9e6fbb4c).

Non-mascot soul mechanisms:
- Name + effort acknowledgement right after the first session, before asking anything (21881bb1).
- Answer set legitimises "Difficult" and "I'm not sure", so the check-in does not demand a positive report (60bf931f).
- Streak is user-hideable; hidden copy reframes cadence as self-chosen (bb0004ec).
- Quote under the streak normalises mind-wandering, pairing a count with a reassurance (4317df7c).
- Haptic channel offered as opt-in accessibility, not as reward feedback (1749c7df).

Phase 1 link:
- P1-F10, P1-F-dose5: "Difficult, I'm feeling discouraged" as a first-class answer; normalising quote under streak.
- P1-F5, P1-F-dose8: autonomy — hideable streak, "Maybe later" on reminder, "schedule that feels good".
- P1-F16, P1-F18: first-name greeting + "great job" after first exercise.
- P1-F14: wind-down / bedtime pair.
- P1-F18: dated activity history; check-in trend chart.

Harm check:
- Guilt: not observed.
- Loss aversion: not observed — streak can be hidden (bb0004ec); no streak-loss copy seen.
- Fake urgency: not observed.
- Nagging: weak risk — notification ask framed around trial end ("Get notifications about when your trial is about to end and more"), mixing billing and care pushes (66e6952c).
- Infantilizing: not observed; copy is adult. Share tooltip sits over the session-end card at a reflective moment ("Like this course? Share the whole thing with a friend.") — https://mobbin.com/screens/2bc7441f-4430-477a-860e-b8b45d05349f.

### App: Calm

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| ritual | Onboarding opens on a single line "take a deep breath" over a blue gradient; press report says rain audio follows on launch [S6] | https://mobbin.com/flows/38549b00-2fe8-4fd1-914b-13c4905db245 |
| ritual | Breathing interstitial: two dots + "Reflect on how sleep restores your body" | https://mobbin.com/screens/fec18d50-a7b6-4299-a5c1-824842e8cc06 |
| copy | Post-meditation sheet: "Take a deep breath" / "We hope you enjoyed that meditation" then offers "Do a Mood Check-In" | https://mobbin.com/screens/f82ec52f-f9d3-42eb-9073-db5ea575d00f |
| progress | Weekly count, not consecutive days: "Day 4, score!" with M–S dots (Mon, Tue, Sat unchecked) and "Four seems to be your lucky number. Great job using Calm 4 days this week." | https://mobbin.com/screens/f2dbc8b8-cd62-4853-b6bc-b2c34e1ae7ae |
| progress | "My Streaks": Total 2 days / Longest 3 days / Current 1 day + calendar + "Share My Streaks" | https://mobbin.com/screens/efbc1e20-0fdd-4b59-ab04-423a9e0982a3 |
| memory | Reflection recap shows the user's own answer back on a dated card: "What parts of your body are you most grateful for? Why?" / "My legs because I love to hike." with "You've completed your 1st reflection" | https://mobbin.com/screens/feb92e75-a5ba-4cc8-ba68-5e976576ba5e |
| memory | Mood journal entry: emoji header + user text "Today I took things slow." | https://mobbin.com/screens/e4921529-6ece-4e76-a6d1-acfb2cf83d20 |
| copy (empty) | "You haven't completed any mood check-ins yet." + one outline button | https://mobbin.com/screens/fd29ca49-45e8-4339-b27b-4d427e76a6eb |
| ritual | Sleep check-in asks the user to pick reminder slot: "When would you like to check in?" Morning / Afternoon / Night | https://mobbin.com/screens/f8a32877-5740-4fe0-94d9-4742c73aae72 |
| copy | Time-of-day greeting "Good Afternoon" on home | https://mobbin.com/screens/ef1a6269-491a-47c4-8056-4001889880bd |
| progress (locked) | Blurred insight tags with "Keep checking in to unlock your sleep insights" | https://mobbin.com/screens/efb70f0a-118c-4dd7-9181-f3ea43ce5039 |
| sound | Rain track has irregular distant thunder; stream track a bird call every few minutes, so the loop does not read as mechanical [S7] (audio claim from [S7] only; no Mobbin still can show sound) | — |
| character | none — imagery is landscape video and celebrity narrator portraits (Matthew McConaughey, Harry Styles) | https://mobbin.com/screens/e378a36f-528f-4b22-920e-cb4cad3144f8 |

Mascot mechanisms:
- none — no mascot. Parasocial role is carried by celebrity narrator faces and voices on sleep stories (e378a36f, f7b6055d-a700-4807-b055-7d43e50bd120 "Fall asleep and fall in love with the dreamy voice of Harry Styles": https://mobbin.com/screens/f7b6055d-a700-4807-b055-7d43e50bd120).

Non-mascot soul mechanisms:
- Opening ritual of one instruction ("take a deep breath") before any UI (flow 38549b00) [S6].
- Weekly-count framing: missed days stay visible but the headline counts days achieved this week (f2dbc8b8).
- User's own words returned on a dated card immediately after writing (feb92e75).
- Ambient sound with low-rate irregular variation [S7].
- User picks the reminder slot inside the feature it serves (f8a32877).

Phase 1 link:
- P1-F14: breath-first launch; post-session breath line.
- P1-F18: reflection card echoing "My legs because I love to hike."
- P1-F1: celebrity narrator voice as companion.
- P1-F13, P1-F6: weekly score card; locked insights as delayed reward.
- P1-F5, P1-F-dose8: reminder slot chosen by user.
- P1-F22, P1-F-dose9: low-arousal register (gradient, slow copy) except "Day 4, score!".

Harm check:
- Guilt: not observed.
- Loss aversion: weak — "Current 1 day" shown next to "Longest 3 days" invites comparison to a lost run (efbc1e20).
- Fake urgency: observed — anchor pricing "$19.99/year (previously $69.99)" in a modal over home (https://mobbin.com/screens/fe887a6f-5806-400d-b560-e874893b8f73).
- Nagging: observed — home leads with "Subscribe to Family Plan" above content (ef1a6269); insights gated behind "Keep checking in to unlock" (efb70f0a).
- Infantilizing: mild — "Day 4, score!" / "Four seems to be your lucky number." is game register in a sleep/meditation product (f2dbc8b8).

### App: How We Feel

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| character | No mascot; each emotion gets a generated abstract shape that morphs per pairing ("proud & good" = yellow crescent + green blob) | https://mobbin.com/screens/d20239e6-f60e-42f2-bdf6-2de759d8572a |
| copy | Onboarding single promise: "Notice how you feel" over the emotion bubble field | https://mobbin.com/screens/f3d4ac4b-d7f7-4e60-8453-24c3124db4a5 |
| check-in | Two-step labelling: quadrant "Tap the color that best describes how you feel right now" (each circle also labelled in text, e.g. "Low Energy Unpleasant") | https://mobbin.com/screens/ef93be6c-567e-4b33-8c04-059cbe7aca58 |
| check-in | Then granular words: "Disheartened", "Lonely", "Burned Out", "Helpless", "Meh" | https://mobbin.com/screens/d8171890-2681-4f31-8462-036346d49e2e |
| copy | Home greets by time of day: "How are you feeling this evening?" with counters "1 unique feelings" / "1 day streak" | https://mobbin.com/screens/8acaa4b0-2e51-4714-ab1e-2d6df5924dfb |
| progress | Streak modal: large "2", "You stayed with it! Your new streak is gaining momentum. Your future self thanks you." | https://mobbin.com/screens/824dac5c-f611-4999-888c-8c3163475a2f |
| surprise | Reminder named "Evening Surprise 5pm–9pm" — a time window, not a fixed time; screen header: "By creating repetition with your check-ins, you can uncover more about your emotional self." | https://mobbin.com/screens/269c2989-3382-4946-9a61-a51f3add4d36 |
| ritual | Reminder setup in onboarding has "Skip" | https://mobbin.com/screens/ed3aa779-3bca-4e78-91f9-2dfb1419d447 |
| memory | Reflection reads the user's typed answer ("Because I can exercise") back into a follow-up | https://mobbin.com/screens/d02f5f0b-11a0-4b9f-8f22-f8244ce4db15 |
| memory | History groups past check-ins by quadrant with percentages ("LOW ENERGY — PLEASANT (6)", 44%) and "Export 6 Check-ins" | https://mobbin.com/screens/ef70a2d1-ead8-4252-b58d-b76989c15ba1 |
| clinical | Reflect menu: "Identify a thinking trap", "Suggest affirmations", "Suggest an action", "See it differently" + footer "If you are in crisis, get professional support here" | https://mobbin.com/screens/6eb1a996-a775-4313-b097-8307ee3b06fd |
| copy | Sad check-in card: "I'm feeling sad" / "Ask if this feeling is serving you. To shift your focus, try this tool." → "Try Coherent Breathing" | https://mobbin.com/screens/df9fe2e8-28a1-48de-a6e1-8b40d6aa74d1 |
| motion | Breathing orb rendered as a dot sphere (still frame; animation not verifiable from Mobbin) | https://mobbin.com/screens/df9fe2e8-28a1-48de-a6e1-8b40d6aa74d1 |

Mascot mechanisms:
- none — no mascot. The emotion shapes act as a per-entry avatar: the user's own label generates the "face" of the entry (d20239e6, edfb30ac https://mobbin.com/screens/edfb30ac-81f1-41f9-8bf3-195df30fbbf1).

Non-mascot soul mechanisms:
- Affect labelling in two steps: coarse quadrant then granular word (ef93be6c → d8171890).
- Time-of-day question replaces a static title (8acaa4b0).
- Reminder as a randomised window labelled "Surprise" (269c2989).
- Streak praise framed as "future self", not as a loss to avoid (824dac5c).
- Crisis link persistently on the reflection surface (6eb1a996).

Phase 1 link:
- P1-F10, P1-F11: granular negative words ("Helpless", "Burned Out") offered without correction.
- P1-F18, P1-F20: typed answer reused in the next prompt; exportable history.
- P1-F24, P1-F-dose1: "Evening Surprise" window = variable timing on a cue, not on a reward.
- P1-F14: morning/evening check-in pair.
- P1-F5, P1-F-dose8: Skip on reminders; user chooses which reflect tool.
- P1-F16, P1-F6: "Your future self thanks you."

Harm check:
- Guilt: not observed.
- Loss aversion: not observed in captured screens; streak shown as a small counter (8acaa4b0).
- Fake urgency: not observed.
- Nagging: weak — "Friends Notifications" on by default next to daily reminders (269c2989).
- Infantilizing: not observed. Tone risk: "Ask if this feeling is serving you." on a sad entry pushes toward shifting before acknowledging (df9fe2e8) — a validation-skip, not infantilizing.

### App: Stoic

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| copy | Home greets lowercase by time of day: "good afternoon." with week strip and two cards "Morning Preparation — Ready to take on the day?" / "Evening complete." | https://mobbin.com/screens/f97f3994-4a60-4b79-96b5-ecb944e23697 |
| ritual | Morning/evening bookends + weekly themed prompt "on glowing reviews. Day 5 of 7" | https://mobbin.com/screens/f97f3994-4a60-4b79-96b5-ecb944e23697 |
| progress | First-streak screen: "You completed your first reflection and started a streak." + "Stoic streaks are motivating, but you can turn them off if you want. You can also hide them later in settings" with "Use streaks" toggle | https://mobbin.com/screens/5fddacf1-5456-43e4-9a72-8bec9591bd75 |
| progress | User sets the streak goal: "How many days do you want to reach with your streak?" 3 / 10 / 15 / 30 days | https://mobbin.com/screens/0fa16add-4841-45a5-b1a2-0389f05902c4 |
| progress | Day-1 completion lists what the user did: "Daily Reflection Completed", "First Journaling Prompt Answered", ... + "See you tomorrow!" | https://mobbin.com/screens/81a9db8f-58c9-4c74-a96c-8c7c0145a9e0 |
| memory | Journey feed restates the chosen words: "You felt curious, comfortable, and grateful"; breathing log "You did 4 breaths in 1 min, 14 secs." | https://mobbin.com/screens/b802e263-e9cd-429b-b056-a8dc669e6d9d |
| memory | Next prompt carries the user's emotions: "What's going on, what's making you feel curious, inspired, and motivated?" | https://mobbin.com/screens/2b88e656-f883-42c3-ad30-c391c35b9f3c |
| check-in | "Would you like to talk more about these emotions?" with per-emotion buttons and "Skip writing about emotions" | https://mobbin.com/screens/90e65788-ed6b-4728-84b3-83952fb40a94 |
| memory | Weekly highlight "How you felt — Based on 7 answers": Good 43% / Fine 29% / Not great 14% | https://mobbin.com/screens/c00fcab1-8056-49b2-8693-a57a91b3de74 |
| surprise | Library counter "there are already 1,394 and counting. Happy scrolling!" | https://mobbin.com/screens/4c61040d-4624-4f99-a8ec-94fd0d82412e |
| ritual/notification | Reminder setup defaults three toggles on: "You're most likely to form a healthy habit with 3 daily notifications." Preview push: "Hey, what are you grateful for today? 🌞" | https://mobbin.com/screens/edeffaa6-a6dc-4346-9aee-efad391ace50 |
| character | Grey petal/flower glyph on streak screens; no face | https://mobbin.com/screens/5fddacf1-5456-43e4-9a72-8bec9591bd75 |

Mascot mechanisms:
- none — no mascot. A petal glyph stands in as a neutral emblem on streak screens (5fddacf1, 81a9db8f).

Non-mascot soul mechanisms:
- Streak opt-out offered at the moment the streak is born (5fddacf1).
- User-set streak target, starting from 3 days (0fa16add).
- Echo of the user's emotion words inside the next question (2b88e656) and in the feed (b802e263).
- Skip path on emotional elaboration (90e65788).
- Lowercase, period-terminated headings ("good afternoon.") set a quiet register (f97f3994).

Phase 1 link:
- P1-F5, P1-F-dose7: streak toggle + chosen goal + skip.
- P1-F18: emotion words restated in prompt and feed.
- P1-F14: morning preparation / evening reflection pair; 7-day themes.
- P1-F-dose5: "Not great 14%" shown without corrective copy.
- P1-F22: lowercase, low-arousal headings.

Harm check:
- Guilt: not observed.
- Loss aversion: weak — flame icon with count on home (f97f3994); offset by opt-out (5fddacf1).
- Fake urgency: not observed.
- Nagging: observed risk — three daily pushes toggled on by default with a habit claim (edeffaa6, https://mobbin.com/screens/bf867df9-6820-4519-adca-d573fba434d1); breaches AP2.5 spirit if accepted without edit, though user-scheduled.
- Infantilizing: not observed; "Good job!" on day 1 is the strongest praise seen (81a9db8f).

### App: Tolan (substitute for Rootd)

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| character | Soft 3D alien with a neck ring stands full-screen on a small planet; idle pose, eyes forward; user can pick its voice ("What should they sound like?") | https://mobbin.com/flows/f1595b35-4bcf-4abe-aeaf-ed5ff33f399b |
| copy | First chat opens with performed excitement: "Hey Alex, I can't believe we're finally chatting!" plus banner "Chat as long as you like!" | https://mobbin.com/screens/5a4666e3-bc29-47e2-aa70-5cd14b804afe |
| copy | User types "Can we stop?" → character: "Got you, I'll chill." then offers a menu "random stuff, big feelings, or tell-me-a-weird-story?" | https://mobbin.com/screens/425acb5c-514b-4183-ac56-380ca2d8dacb |
| memory | Hand-drawn sketch card "I sketched something for you..." tied to a logged act: "Alex, you just chose to see a friend with full appreciation." Focus area bar "+1", "1 intention completed" | https://mobbin.com/screens/138ebfc1-f62f-48ff-abb7-8281f1572edd |
| memory / progress | "First Impressions" personality reading: "Alex, you have that quiet, restless-mind energy … and I like that about you." Further readings locked behind "Level 2" / "Level 3" | https://mobbin.com/screens/9a7af0b3-da28-4670-bbbf-b701aac62ee1 |
| ritual / copy | Onboarding "Oracle" (blurred particle figure, then crystal) interviews the user and echoes each answer: "Building friendship—a classic choice!" before "See your reading" | https://mobbin.com/flows/f1595b35-4bcf-4abe-aeaf-ed5ff33f399b |
| motion | Onboarding opens on a particle-cloud figure with glowing eyes, caption "I am the Oracle, here to find the…", "FINDING YOUR TOLAN", "Tap to talk" / "Can't talk" | https://mobbin.com/flows/1b7a3a3b-82c3-4dc8-a1a0-06ad576e79ff |
| sound/haptic | Voice picker (8 voice blobs) during setup; mute toggle top-right of chat. Haptics not visible; no source found | https://mobbin.com/flows/f1595b35-4bcf-4abe-aeaf-ed5ff33f399b |
| surprise | Push permission framed as character-initiated gifts: "You'll get messages from your Tolan, like that new song they found for you, or an update from their world." | https://mobbin.com/flows/3734e10b-c681-4d05-90c9-5a2dad369e02 |

Mascot mechanisms:
- Character-voiced permission ask: notification preview "Hey Alex — Don't forget to get a gift for the birthday party this weekend!" above the character and an "Allow" button; the character is the sender, not the app (flow f1595b35).
- Reflective echo inside the character's turn ("Building friendship—a classic choice!") — the user's own phrase is repeated within 1 message.
- Exit-respect: "Can we stop?" is honoured in 1 turn with a downshift ("I'll chill") rather than persuasion.
- Artifact gift: an illustrated sketch plus metaphor ("Like stones in still water, your quiet appreciation sends ripples…") rewards a completed intention — effort the app visibly spent on the user.
- User-chosen voice and the user naming flow make the character co-authored (IKEA-style investment).

Non-mascot soul mechanisms:
- Locked levels ("Level 2", "Level 3") on the personality reading turn being known into a progression unlock.
- Focus-area progress bar with "+1" ties a social intention to visible growth, not a streak.

Phase 1 link:
- Character-voiced pushes, "finally chatting" opener → P1-F1, P1-F3, P1-F-dose2
- Echo of the user's answer, sketch tied to a logged act → P1-F18, P1-F8
- "Can we stop?" honoured → P1-F5 (autonomy)
- Voice choice, naming → P1-F5 (autonomy), P1-F9 (IKEA investment)
- Locked reading levels → P1-F6, P1-F20

Harm check:
- Guilt: not observed.
- Loss aversion: not observed (no streak seen).
- Fake urgency: not observed.
- Nagging: risk — permission copy promises unsolicited character messages ("messages from your Tolan"); cadence not visible. https://mobbin.com/flows/3734e10b-c681-4d05-90c9-5a2dad369e02
- Infantilizing / unearned emotion: "Hey Alex, I can't believe we're finally chatting!" performs excitement on a first contact (AP3.2) and "Chat as long as you like!" sets no boundary on use. https://mobbin.com/screens/5a4666e3-bc29-47e2-aa70-5cd14b804afe
- Crisis handling: not observed (no crisis surface found in Mobbin results).

### App: Opal (substitute for Daylio)

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| character | No mascot; photoreal gemstones on a rock plinth in a cave act as the collectible "character" of progress | https://mobbin.com/screens/56b8946f-b0a6-4a63-b663-88c11e993f84 |
| copy | Onboarding promise: "Sam, Opal will get you back 9 years of your life", CTA "Let's solidify it with a fist bump" / "👊 Let's Do It" | https://mobbin.com/screens/e21e4d00-1d89-488b-bde6-4882ccc5749c |
| progress | Locked milestone: "Radiant Gem — Reach this MileStone when you complete a Focus Session 30 days in a row." bar "5/30 days", badge "Owned by 69%", "Locked" | https://mobbin.com/screens/1ab1ceef-2aad-4a64-bf1d-b26d6e193f38 |
| progress | Earned milestone: "Motivated Gem — MileStone reached! You stayed focused for 2 days straight." "Owned by 95%", reward "Apply Theme" | https://mobbin.com/screens/8b51c457-7e86-44a4-b5b4-7379783ce730 |
| progress / memory | Profile: "5 DAY STREAK" flame, "Top 17% WORLDWIDE", gemstone shelf each labelled "Owned by 23% / 95% / 98%" | https://mobbin.com/screens/a4301fe8-32d4-4b09-8054-bf68100ced03 |
| copy / memory | Home card "Strong start — Five days of showing up. You're doing what most people don't." and "This week, you've put your phone down around 1PM-2PM" | https://mobbin.com/screens/5299e905-4ad4-402a-9161-3c8a03bbf7ae |
| ritual / motion | Session start: full-bleed blurred gradient with a large "3" countdown before a focus block | https://mobbin.com/screens/9da75c2e-2f77-41ba-bef9-dd277dc93d8c |
| memory | Weekly insight: "You're on track to spend an average of 36m per day … That's about 4% of your waking hours." radial dial | https://mobbin.com/screens/62769965-9c74-417e-ae28-deb6c2aba10e |
| surprise | Referral ladder: "20 FRIENDS — 2 Years of Opal Pro", "100 FRIENDS — Life-Changing Gear" | https://mobbin.com/screens/8c8e30d8-6c2e-46ca-bdc8-21e259e21350 |
| sound/haptic | Not visible; no source found | — |

Mascot mechanisms:
- none — no mascot. The gem object substitutes for one: each milestone is a named, rendered object ("First Gem", "Motivated Gem", "Radiant Gem") the user owns.

Non-mascot soul mechanisms:
- Named collectible per milestone; earned gem unlocks a cosmetic ("Apply Theme").
- Behavioural reflection with a time window the user can verify ("put your phone down around 1PM-2PM").
- Countdown ritual ("3") as a threshold into a session.
- Rarity / percentile framing on every gem and on the profile.

Phase 1 link:
- Gem collection, locked 5/30 milestone → P1-F12, P1-F6
- "Owned by 69%", "Top 17% WORLDWIDE", "what most people don't" → P1-F7 (interface need support vs life-level harm; social-comparison norm), loss-aversion risk under P1-F12
- "put your phone down around 1PM-2PM" → P1-F18, P1-F-dose6
- Countdown "3" → P1-F14

Harm check:
- Guilt: not observed in captured screens.
- Loss aversion: consecutive-day gates ("30 days in a row", "2 days straight") plus a header flame streak make a missed day cost the gem. https://mobbin.com/screens/1ab1ceef-2aad-4a64-bf1d-b26d6e193f38
- Social comparison: "Top 17% WORLDWIDE", "Owned by 69%", "You're doing what most people don't." — would turn a mood log into a ranking if copied. https://mobbin.com/screens/a4301fe8-32d4-4b09-8054-bf68100ced03
- Unsupported outcome claim (AP7.3 analogue): "Opal will get you back 9 years of your life". https://mobbin.com/screens/e21e4d00-1d89-488b-bde6-4882ccc5749c
- Fake urgency: not observed.
- Nagging: not observed.
- Infantilizing: "Let's solidify it with a fist bump" — mild, adult register. Not a hit.
- Crisis handling: not applicable (not a mental-health product); not observed.

### App: Balance

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| character | No mascot; flat line illustrations (sprouts of 1–4 stems for experience level, sun/moon for time of day, a seated figure in concentric circles on plan cards) | https://mobbin.com/screens/7c3ac925-8df7-43b8-88bf-685e83cf419e |
| copy | Greeting uses the user's name in caps, low-key: "HI, MOBBIN." "Answer a few questions to start personalizing your meditation program." "TAP TO CONTINUE" | https://mobbin.com/screens/75539c33-9827-4c38-beec-28e84709ac62 |
| copy | Choice framed as permission: "Let's move on to your first meditation. If you like, you can change the duration." default "3 min — Recommended" | https://mobbin.com/screens/bfd98a57-688b-4864-b8af-a7afca6c567e |
| copy | Escape option on schedule question: "When would you like to meditate?" Morning / Afternoon / Evening / "Not sure" | https://mobbin.com/screens/9abe47fe-4ce3-47cb-9899-a3ebdfdfd0f4 |
| ritual | Daily plan card "Day 3 of 10 — Foundations Plan" → session screen with "Skills", "Time 3 min", "Voice Ofosu", "Begin" | https://mobbin.com/screens/14311c4b-ba7e-4242-94a5-ca08cc0d399a |
| progress | Post-session "Report": "Time trained 16 min", "Daily streak 1 day", "Skills developed — Awareness Level 1" with progress bar | https://mobbin.com/screens/7df0b77f-aa05-4cec-86e4-aa4ee37d84df |
| progress / copy | Closing screen: "Nice job today, Mobbin." 7-dot week row with today checked, "Come back tomorrow, or keep exploring Balance." | https://mobbin.com/screens/2852d5ec-532c-4f0f-b00f-ffe5ee4d9c3f |
| progress | Badge modal "Streak — Get a 2-day streak" bar "1 / 2" | https://mobbin.com/screens/5e8cdc0a-eba0-4b82-afd1-052d0132fbdd |
| memory | Profile tabs Progress / Skills / Badges with a month calendar marking practice days | https://mobbin.com/screens/6023c500-9076-4e9d-8972-17b36ad50bc4 |
| ritual | Reminder set in onboarding: "When would you like to be reminded?" time wheel, "Set reminder" | https://mobbin.com/screens/91b1390e-4556-4c8b-8b94-566519cd87c5 |
| motion | Session cards use static geometric compositions (arcs, triangle, dots); no motion visible in stills | https://mobbin.com/screens/f723838f-c53f-4e9c-9279-9ec2c44a045c |
| sound/haptic | User chooses the narrator voice per session ("Voice Ofosu"); haptics not visible, no source found | https://mobbin.com/screens/14311c4b-ba7e-4242-94a5-ca08cc0d399a |
| surprise | not observed | — |

Mascot mechanisms:
- none — no mascot.

Non-mascot soul mechanisms:
- Named human narrator chosen by the user carries the relationship (voice as persona).
- Progress expressed as skills with levels ("Awareness Level 1", "Breath Focus Level 1"), streak shown as one equal-weight stat beside time.
- Closing line offers two exits without pressure: "Come back tomorrow, or keep exploring Balance."
- Every onboarding question has a non-committal option ("Not sure", "If you like").
- Reminder time picked by the user before any push.

Phase 1 link:
- "If you like", "Not sure", user-set reminder → P1-F5 (autonomy)
- Skill levels → P1-F5 (competence)
- Named narrator voice → P1-F1, P1-F16
- Day N of 10 plan + closing screen → P1-F14
- Badge "Get a 2-day streak" → P1-F6, P1-F12

Harm check:
- Guilt: not observed; closing copy has no should-statement.
- Loss aversion: mild — streak badge "Get a 2-day streak" exists, but no loss copy observed. https://mobbin.com/screens/5e8cdc0a-eba0-4b82-afd1-052d0132fbdd
- Fake urgency: observed (AP2.1) — "SALE - 65% OFF" pill on the daily plan and banner "65% off lifetime memberships, for a limited time". https://mobbin.com/screens/8a01b107-7823-46ce-83c4-780bf0ee6108
- Nagging: risk — push settings list 7 reminder types plus "Sleep tips" and "Recommendations" toggled on; "Plan push campaigns" off. https://mobbin.com/screens/a746a2c1-9bcb-4c93-91e6-284f3da91fa9
- Infantilizing: not observed ("Nice job today" is adult register).
- Crisis handling: not observed.

### App: Wysa

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| character | Small penguin avatar (~20 pt) sits beside chat bubbles; also appears as the "Talk" tile and in "Continue conversation from a few seconds ago" | https://mobbin.com/screens/56efd85c-91a9-46b1-8059-06056f9932cb |
| copy | Return greeting without blame: "Glad you're back, JS! 👋 How are you today?" | https://mobbin.com/screens/c04f5bad-c60e-42d2-a4aa-14839ddafddb |
| motion | Check-in is a large face the user drags up/down ("Move the smiley up or down to let me know"); face morphs from flat mouth to wide grin, quick reply label changes ("Okay I guess..." → "As good as it gets") | https://mobbin.com/screens/31047b03-c2a4-43b8-9acd-75847f7575aa |
| copy | Low mood met with normalising validation: user "Meh" → "Ah, that's okay. Some days our feelings go into hiding for a bit." | https://mobbin.com/screens/e3c524bd-7242-412e-bc7e-9da023baa588 |
| memory / copy | Echoes user's own words in quotes: "'Caring, kind and helpful'. ☝️ That is a powerful affirmation." | https://mobbin.com/screens/0804ae99-d713-466d-93b5-719ca47b34e2 |
| copy | Anxiety disclosure ("first time attending a fitness class and I am pretty nervous") → "I'm here to help you feel more in control." | https://mobbin.com/screens/9aedd24d-6b78-4e6a-a1bd-481277d50698 |
| motion | Typing-dots bubble before replies ("Hi, JS. 😊 Thanks for sharing a little bit about yourself." then "• • •") — visible effort | https://mobbin.com/screens/d01b5847-36ec-454c-b8d9-4777f88a0c65 |
| ritual | Shortcut ritual taught in chat: "any time you need help with feeling calm, just say #Relax"; quick replies include an exit "Got to go! 👋" | https://mobbin.com/screens/32320b65-7a02-40a2-9310-430501acac02 |
| ritual / memory | "Happiness box": "add these things, people, and activities as a reminder for tough days." | https://mobbin.com/screens/fda57843-befd-4e76-b20d-42eb430496a3 |
| CBT tool | Thoughtpad walk-through: "Take a few deep breaths." "Tell me the first thought on your mind. 👇" | https://mobbin.com/screens/513cc1dd-75a3-4d45-be6c-6b24255613e4 |
| crisis | SOS screen: "Are you in crisis? You are not alone. Help is just a call away." two helpline buttons, "Wysa is not enough", "Create Safety Plan", "Grounding for panic"; no penguin on screen | https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e |
| ritual | Push permission in utility framing: "Before you start — Enable push notifications … get reminders to check in with Wysa", "ENABLE NOTIFICATIONS" / "NOT NOW" | https://mobbin.com/screens/ff59c484-845f-4eb0-a383-8be9c465b5fc |
| sound/haptic | Text-to-speech playback added in v7.2.0 [S10]; haptics not visible, no source found | — |

Mascot mechanisms:
- Penguin is a speaker tag, not a performer: it never takes over the screen; text carries the warmth.
- Return greeting by name without referencing the gap ("Glad you're back").
- Turn-taking signals effort (typing dots) before each reply.
- Echo of user's exact words inside quotation marks before moving on.
- Penguin is absent from the crisis screen; human helplines replace it.

Non-mascot soul mechanisms:
- Direct-manipulation mood face (drag to set) instead of a list — affect labelling through the body of the face.
- Persistent "SOS" pill in the home header.
- User-built "happiness box" (own people/activities) stored for tough days.
- Quick replies always include an exit ("Got to go! 👋").

Phase 1 link:
- "Glad you're back", typing dots → P1-F3, P1-F8
- Quoted echo, "Some days our feelings go into hiding" → P1-F15, P1-F18
- Happiness box → P1-F20 (user-controlled recall), P1-F9 (IKEA investment)
- #Relax shortcut → P1-F14
- Penguin as chat persona → P1-F2, P1-F-dose3
- "NOT NOW", "Got to go!" → P1-F5 (autonomy)

Harm check:
- Guilt: not observed — return copy omits the gap.
- Loss aversion: not observed (no streak in captured screens).
- Fake urgency: not observed.
- Nagging: not observed beyond one daily check-in toggle. https://mobbin.com/screens/e1be7ff1-4331-4038-974e-87ad6235ee4d
- Infantilizing: borderline — emoji density ("Ok!👍", "😇", "☝️") and "Sometimes, all we need is someone who can be there for us, right? 😇" positions the bot as the someone. https://mobbin.com/screens/6eb03ca6-a5da-44e8-a2d0-fe3a33db7dca
- Crisis handling: present and character-free; states its limit ("Wysa is not enough"). https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e — App Store copy also disclaims diagnosis/treatment [S10].

### App: Gentler Streak (standout)

Soul inventory

| Channel | What it does | Screen |
|---|---|---|
| character | Orange heart-shaped character with arms/legs; pose encodes status: sitting on a cloud (rest day), yawning/drowsy (mindful), lounging in a beach chair with sunglasses (paused) | https://mobbin.com/screens/89addee0-a199-4220-bf7c-5fc6b916e1da |
| character / copy | Paused status: character in beach chair, "Taking a Breather — Taking some time off can give you a psychological break from exercise…", CTA under "When you feel ready to come back": "Change Status to Active" | https://mobbin.com/screens/d645b906-bb96-44bc-a4fe-8d6b79109e96 |
| copy | Rest framed as permission and a choice: "You have full permission to rest and relax." CTA "Today I Choose Rest" | https://mobbin.com/screens/af1d374d-4ab3-4d9c-9c9d-47a1ed767ee1 |
| copy | Alternative to rest on the same sheet: "Active Recovery — A light jog or walk, easy bike ride, yoga…" | https://mobbin.com/screens/05a2e8a3-f043-4b99-977d-a06b0e4e0c22 |
| progress | Activity Path explainer: "Gentler Streak challenges traditional streaks by making rest days part of the equation. A healthy streak includes rest days…" | https://mobbin.com/screens/3403a2b3-a7c6-4e30-b5f8-51c079ebb2f3 |
| progress | Onboarding: hand-drawn annotations "Activity Path", "you today" over a green band; "Keep a gentler streak by staying on your optimal activity path." | https://mobbin.com/screens/3daa822b-826d-4d52-ab6b-35552a455f71 |
| progress / copy | Missed-day fact stated neutrally as a chip: "NO ACTIVITIES ON MONDAY, NOV 3" under "Be Mindful With Your Approach" | https://mobbin.com/screens/597f67c9-a016-40a8-b3fd-2e0c6cd70bf9 |
| memory | "Monthly Recap" card ("NEW", "October") on home | https://mobbin.com/screens/f9bf6004-fa31-4dbe-818a-6acbd51f0cae |
| ritual | Widget/glance "Embracing a Day Off — Physical and mental break from exercise makes you fresh and motivated on your return." | https://mobbin.com/screens/0dffe6d2-52aa-41c7-b1d6-de34abea4f7e |
| sound/haptic | Not visible; App Store listing makes no claim [S9] | — |

Mascot mechanisms:
- Pose-as-state: the same character shows rest, fatigue and pause through body posture, with no speech bubble.
- Character relaxes during user absence (beach chair) instead of decaying — absence rendered as the character's holiday too.
- Character never appears beside metrics or warnings; it sits in the hero illustration only.

Non-mascot soul mechanisms:
- Streak redefined so rest days count [S9] ("rest days part of the equation").
- Absence is a user-set status ("Taking a Breather") with a user-triggered return.
- Missed days reported as dated facts without evaluation.
- Rest delivered as an explicit choice phrase the user taps ("Today I Choose Rest").
- Hand-drawn annotation in onboarding signals human authorship.

Phase 1 link:
- Rest counts, "full permission to rest" → P1-F5 (autonomy), P1-F13 and P1-F12 (loss-aversion removal)
- User-set breather status, neutral "NO ACTIVITIES" chip → P1-F15 (self-compassion), P1-F16
- Pose-as-state character → P1-F1 at low arousal, P1-F22
- Monthly Recap → P1-F18, P1-F14

Harm check:
- Guilt: not observed — "skip feeling guilty" is product copy [S9]; missed day is a factual chip. https://mobbin.com/screens/597f67c9-a016-40a8-b3fd-2e0c6cd70bf9
- Loss aversion: not observed in copy; the red band with a warning triangle on the status bar could read as alarm for overtraining. https://mobbin.com/screens/af1d374d-4ab3-4d9c-9c9d-47a1ed767ee1
- Fake urgency: not observed; "Go Premium — 1 week free" card on home is a plain upsell.
- Nagging: not observed.
- Infantilizing: not observed.
- Crisis handling: not applicable.


## Findings

### F1. Warm apps quote the user's own words back within one screen or one turn
- Claim: 7 of 13 apps (Finch, Calm, How We Feel, Stoic, Wysa, Tolan, Ahead) show the user's own typed or selected words on the next screen or in the next character turn, and none of the 7 does it from inferred data.
- Evidence: https://mobbin.com/screens/46bc26b8-3f04-4a9e-b206-47ef103f1723 (Finch summary replays answers) | https://mobbin.com/screens/feb92e75-a5ba-4cc8-ba68-5e976576ba5e (Calm "My legs because I love to hike.") | https://mobbin.com/screens/2b88e656-f883-42c3-ad30-c391c35b9f3c (Stoic reuses chosen emotions in next prompt) | https://mobbin.com/screens/0804ae99-d713-466d-93b5-719ca47b34e2 (Wysa "'Caring, kind and helpful'.") | https://mobbin.com/screens/d02f5f0b-11a0-4b9f-8f22-f8244ce4db15 (How We Feel)
- Mechanism: Perceived responsiveness converts disclosure into felt intimacy (P1-F18); quoting with the source on screen keeps the recall overt, which avoids the vulnerability spike of covert personalization (P1-F19, P1-F20).
- So what for Happy: After a Thought Catch save, Happi's single line quotes ≤8 words of the user's thought inside quotation marks, rendered adjacent to that entry; home recall uses only user-tagged items and shows their date.

### F2. Absence copy splits into blame (game apps) versus permission (wellbeing apps)
- Claim: Duolingo and BitePal attach the mascot's distress to the user's absence ("1 week abandoned", sulking pet), while Finch, Wysa and Gentler Streak name the gap neutrally or not at all.
- Evidence: https://mobbin.com/screens/d7d5d9f4-233f-4cbe-99ba-02e32cc6dc16 (Duolingo crying ghost "1 week abandoned") | https://mobbin.com/screens/7d0f39fd-a349-4ef0-9a3b-d907200515fa (Duolingo laser-eyes "Save your streak!") | [S3] | https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85 (Finch "It's okay to miss a day.") | https://mobbin.com/screens/c04f5bad-c60e-42d2-a4aa-14839ddafddb (Wysa "Glad you're back, JS!") | https://mobbin.com/screens/d645b906-bb96-44bc-a4fe-8d6b79109e96 (Gentler "Taking a Breather")
- Mechanism: A broken streak lowers later engagement most when the break is attributed to the self (P1-F12, 7 studies); self-compassion after failure raises motivation to improve (P1-F15). Blame copy maximizes self-attribution; permission copy removes it.
- So what for Happy: Return screen copy names no duration and no blame ("Good to see you. Pick up wherever you like."); Happi's absence pose is resting, never sad, crying, angry or wilting; widget and notification art never escalates with days away (forbidden pattern: AP1.3, AP1.4).

### F3. The "I'm committed" streak screen is copied across apps and turns each completion into a promise
- Claim: Duolingo and BitePal ship a near-identical streak-day screen (large day number, 7-dot week row, mascot over a flame, single CTA "I'm committed"), and Ahead asks for a drawn signature to "commit to myself" for 5 days.
- Evidence: https://mobbin.com/screens/58c9920b-ef13-4098-ae02-2baa5d109c45 (Duolingo) | https://mobbin.com/screens/b04e4b6c-9383-498a-b2d0-6541427e3cc6 (BitePal) | https://mobbin.com/screens/91163634-334d-40ea-a43d-04baacad948c (Ahead) | [S1]
- Mechanism: The only CTA affirms future behavior, so the ritual becomes a standard the user can fail (P1-F-dose7) and loss of the chain carries "the threat of losing all of it" [S1] (P1-F12). The +1.7% day-7 retention in [S1] is a language-learning result; it is a transfer, not mental-health evidence (RQ3.4).
- So what for Happy: The Day 7/15 streak modal has one CTA, "Continue", and no forward-commitment string; the strings "I'm committed", "Promise", "Don't break" are forbidden in modal copy.

### F4. Low-pressure apps put an off-switch on the streak surface at the moment it first appears
- Claim: Stoic, Finch and Headspace each place a streak hide/off control on the streak surface itself, and Stoic offers it on the first-ever streak screen.
- Evidence: https://mobbin.com/screens/5fddacf1-5456-43e4-9a72-8bec9591bd75 (Stoic "you can turn them off if you want") | https://mobbin.com/screens/dc8d14c8-3908-497e-9ec4-82a26ef4eb15 (Finch "Don't find Streaks motivating? You can turn them off if you want.") | https://mobbin.com/screens/bb0004ec-e553-4e4d-a10e-1e21e59c8781 (Headspace hidden streak "Meditate on a schedule that feels good.")
- Mechanism: An expected, engagement-contingent reward undermines intrinsic motivation (P1-F6, d = -0.40); making the counter optional reframes it as information and protects autonomy (P1-F5, P1-F-dose8). Offering it on day 1 precedes any sunk investment.
- So what for Happy: The Day 1 streak surface and the Day 7/15 modal both show a "Hide streak" text button (≥44×44 pt); the hidden state has its own copy ("Your entries are still here, counted quietly.") rather than a blank.

### F5. Window counts and rest-inclusive counts replace consecutive chains in the calmest apps
- Claim: Calm counts days achieved this week and Gentler Streak counts declared rest days inside the streak, while Opal and Duolingo gate named rewards on unbroken runs.
- Evidence: https://mobbin.com/screens/f2dbc8b8-cd62-4853-b6bc-b2c34e1ae7ae (Calm "Great job using Calm 4 days this week" with Mon/Tue/Sat unchecked) | https://mobbin.com/screens/3403a2b3-a7c6-4e30-b5f8-51c079ebb2f3 (Gentler "A healthy streak includes rest days") | [S9] | https://mobbin.com/screens/1ab1ceef-2aad-4a64-bf1d-b26d6e193f38 (Opal "30 days in a row", "5/30", "Locked") | https://mobbin.com/screens/801382ea-9bcc-4fd6-b461-a14b36161486 (Duolingo "Keep your Perfect Streak")
- Mechanism: Missing a single day does not materially affect habit formation (P1-F13, n = 96, 12 weeks), so a reset-to-zero counter punishes a lapse that has no behavioral cost; a window count drops by 1 instead of to 0, removing the loss spike (P1-F12).
- So what for Happy: The home counter shows total entries and "days this week"; the Day 7/15 modal triggers on the 7th and 15th total entry day, not consecutive days; no Happy surface ever displays "0 day streak".

### F6. Only wellbeing apps let the user schedule a break that protects progress; the game app sells it
- Claim: Finch and Gentler Streak let the user set a pause/breather status that preserves progress and hides goals, while Duolingo sells a 7-day streak shield for 3,000 gems.
- Evidence: https://mobbin.com/screens/a75ce727-dff2-4e5c-bf63-125991e2e224 (Finch "Your Streak will be paused and preserved") | https://mobbin.com/screens/a5edeeba-6436-4e55-a691-63b508711579 (Finch "First Aid Kit is still here if you need it.") | https://mobbin.com/screens/d645b906-bb96-44bc-a4fe-8d6b79109e96 (Gentler "When you feel ready to come back") | https://mobbin.com/screens/64e6436a-7982-437f-862b-62748636aa0e (Duolingo "BUY FOR 3000")
- Mechanism: A self-chosen pause is an autonomy act (P1-F5) and makes the counter repairable, which attenuates the broken-streak drop (P1-F12); selling protection monetizes the anxiety the streak created (AP1.2, P1-F-dose1).
- So what for Happy: Add "Take a break" in Settings and in the return flow; the user picks 1–14 days; home shows Happi resting; Thought Catch and the crisis link stay reachable during the break; no currency exists in Happy.

### F7. Mental-health apps validate the feeling before they question the thought
- Claim: Ahead, Wysa and Finch put a validating clause before any reframe or option ("Worries can feel very real. But…", "Ah, that's okay.", "It's okay to miss a day."), while How We Feel's sad card opens with "Ask if this feeling is serving you."
- Evidence: https://mobbin.com/screens/aef7519a-2891-4779-a70b-ca9663bcc0ae (Ahead) | https://mobbin.com/screens/e3c524bd-7242-412e-bc7e-9da023baa588 (Wysa) | https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85 (Finch) | https://mobbin.com/screens/df9fe2e8-28a1-48de-a6e1-8b40d6aa74d1 (How We Feel, validation skipped)
- Mechanism: Naming the feeling first acts as implicit regulation (P1-F10, P1-F11) and lowers defensiveness, so the Socratic question that follows reads as an invitation rather than a correction.
- So what for Happy: Every Happi prompt that challenges a thought uses a fixed 2-beat template — beat 1 reflects the user's chosen feeling word, beat 2 asks one question; Happi never states the reframe first and never asks whether a feeling is "serving you".

### F8. Celebration intensity is decoupled from effort in 4 apps; specific praise appears in 3
- Claim: Duolingo ("Learning legend!"), Finch ("You're amazing! First time completion!"), Ahead ("You just rewired your brain!") and Tolan ("I can't believe we're finally chatting!") give top-register praise for a first minimal act, while BitePal, Stoic and Balance name the exact accomplishment at low arousal.
- Evidence: https://mobbin.com/screens/a5edfc91-474c-4ff6-b1b2-e418bfe5a383 (Duolingo) | https://mobbin.com/screens/a36bbc85-679f-4396-b907-739d2bba480e (Finch) | https://mobbin.com/screens/eff02637-d235-4f75-ba96-34b68740a83f (Ahead) | https://mobbin.com/screens/5a4666e3-bc29-47e2-aa70-5cd14b804afe (Tolan) | https://mobbin.com/screens/b72074d3-9a06-4b05-91ed-0c8d5b354b46 (BitePal "You've completed your 12h fasting goal") | https://mobbin.com/screens/81a9db8f-58c9-4c74-a96c-8c7c0145a9e0 (Stoic lists completed items) | https://mobbin.com/screens/2852d5ec-532c-4f0f-b00f-ffe5ee4d9c3f (Balance "Nice job today, Mobbin.")
- Mechanism: Informational verbal feedback raises intrinsic motivation (P1-F6, d = 0.33), while high-arousal praise on routine acts reads as cloying to users whose ideal affect is calm (P1-F22, P1-F-dose9); Ahead's line adds an unsupported treatment claim (AP7.3).
- So what for Happy: Completion lines name what the user did ("You wrote the thought down and found 2 other ways to see it."); banned strings: "amazing", "legend", "superstar", "rewired", "!!"; confetti is reserved for the Day 7/15 modal only.

### F9. Asks for shares, ratings and feedback sit on the warmest screen in 4 apps
- Claim: Duolingo ("SHARE +20 GEMS"), BitePal ("Share to Stories"), Headspace (share tooltip over the session-end card) and Ahead ("Did you find this activity helpful?") each place an ask on the completion or celebration screen.
- Evidence: https://mobbin.com/screens/84ec5a7b-37ce-4c38-808d-7c3c91c3c0aa (Duolingo) | https://mobbin.com/screens/b72074d3-9a06-4b05-91ed-0c8d5b354b46 (BitePal) | https://mobbin.com/screens/2bc7441f-4430-477a-860e-b8b45d05349f (Headspace) | https://mobbin.com/screens/eff02637-d235-4f75-ba96-34b68740a83f (Ahead)
- Mechanism: An ask placed directly after a warm, effortful moment exploits the reciprocity the moment created (P1-F-dose4); for a mental-health user the celebration becomes a transaction.
- So what for Happy: Remove `requestReview` from the Day 7/15 streak-modal close; trigger it only on a neutral screen (Settings or Insights open) after ≥15 total entry days, ≥24 h away from any modal, and never in the same session as a negative mood label or the crisis path.

### F10. The character leaves crisis and metric surfaces
- Claim: Wysa's crisis screen and Gentler Streak's metric cards contain no character art, while both apps show their character elsewhere, and Ahead keeps its character in the tab bar rather than over content.
- Evidence: https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e (Wysa SOS, no penguin, "Wysa is not enough") | https://mobbin.com/screens/0dffe6d2-52aa-41c7-b1d6-de34abea4f7e (Gentler metric glance, no character) | https://mobbin.com/screens/d048e0d7-d3b3-4e65-afc3-4657516f4baf (Ahead character as center tab) | [S10]
- Mechanism: A trusted face receiving high disclosure can be mistaken for a clinician (P1-F-dose3, P1-F2); removing it from high-stakes surfaces hands authority to humans and data.
- So what for Happy: Happi is absent from crisis/SOS screens, from any surface showing the user's own distress text, and from numeric insight rows; Happi occupies hero/illustration slots only (AP3.4).

### F11. Showing work at the moment of waiting signals effort for the user
- Claim: BitePal ("Checking database.." with a thinking raccoon), Ahead ("Processing your insights...") and Wysa (typing dots before every reply) show the system working during real waits.
- Evidence: https://mobbin.com/screens/e904fdb7-bc19-486f-9f99-9bd7b0564e1b (BitePal) | https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9 (Ahead) | https://mobbin.com/screens/d01b5847-36ec-454c-b8d9-4777f88a0c65 (Wysa)
- Mechanism: Displaying the work being done raises perceived value even with longer waits (P1-F8, 5 experiments); on a character it reads as attention rather than loading.
- So what for Happy: When generating an entry summary or pattern view, Happi shows a "reading" pose with "Reading what you wrote…" for the real processing time only, capped at 1.5 s of added display; no fake delay on instant results.

### F12. Reminder control stays with the user in wellbeing apps; character-voiced or default-on pushes appear elsewhere
- Claim: Calm, Balance and How We Feel ask the user to pick a reminder slot or skip, while Stoic toggles 3 daily pushes on by default and Tolan frames pushes as messages from the character.
- Evidence: https://mobbin.com/screens/f8a32877-5740-4fe0-94d9-4742c73aae72 (Calm Morning/Afternoon/Night) | https://mobbin.com/screens/91b1390e-4556-4c8b-8b94-566519cd87c5 (Balance time wheel) | https://mobbin.com/screens/ed3aa779-3bca-4e78-91f9-2dfb1419d447 (How We Feel "Skip") | https://mobbin.com/screens/edeffaa6-a6dc-4346-9aee-efad391ace50 (Stoic 3-on default) | https://mobbin.com/flows/3734e10b-c681-4d05-90c9-5a2dad369e02 (Tolan "messages from your Tolan")
- Mechanism: Reminders that cannot be scheduled or switched off convert autonomy support into control (P1-F-dose8); character-initiated contact simulates a friend thinking of you, creating obligation and a guilt channel (P1-F-dose2, P1-F4).
- So what for Happy: One reminder, off until the user picks a slot; pushes are signed "Happy", never voiced as Happi missing the user; no mood or entry content on the lock screen (AP6.2); after 3 ignored pushes, reminders pause and the next app open asks whether to keep them.

### F13. Gating the user's own insights behind streaks appears in 4 apps
- Claim: Ahead ("Hit a 7 day streak to uncover your patterns"), Calm ("Keep checking in to unlock your sleep insights"), Duolingo (Streak Society locked until 7 days) and Opal (gem locked until 30 days in a row) withhold content behind continued attendance.
- Evidence: https://mobbin.com/screens/a03ee6bd-3b1f-4ed9-b279-78e788532dc9 (Ahead) | https://mobbin.com/screens/efb70f0a-118c-4dd7-9181-f3ea43ce5039 (Calm) | https://mobbin.com/screens/fbef2d10-7767-41e4-8a9f-825e022ead13 (Duolingo) | https://mobbin.com/screens/1ab1ceef-2aad-4a64-bf1d-b26d6e193f38 (Opal)
- Mechanism: Locking a user's own data turns memory into an engagement-contingent reward (P1-F6) and removes the user's control over what they disclosed (P1-F20); a hard day costs the user their own history.
- So what for Happy: Every pattern or insight view is available from the first entry with honest copy ("Patterns get clearer with more entries; here is what 2 entries show."); no Happy content is ever locked behind streaks or entry counts.

## Pattern matrix

Cells: **strong** = the channel carries soul on ≥2 viewed screens or a verified source; **weak** = 1 screen or minor role; **absent** = not observed. Motion and sound are under-observed for every app because Mobbin shows stills.

| App | Character | Copy | Motion | Sound/haptic | Memory | Ritual | Surprise | Progress |
|---|---|---|---|---|---|---|---|---|
| Duolingo | strong | strong | strong [S1] [S5] | absent (unverified) | weak | strong | strong | strong |
| BitePal | strong | weak | weak | absent | absent | weak | weak | strong |
| Finch | strong | strong | weak | absent | strong | strong | weak | strong |
| Ahead | strong | strong | absent | absent | weak | strong | absent | strong |
| Headspace | weak | strong | absent | strong [S8] | weak | weak | weak | weak |
| Calm | absent | weak | weak | strong [S6] [S7] | strong | strong | absent | weak |
| How We Feel | weak | weak | weak | absent | strong | weak | weak | weak |
| Stoic | absent | strong | absent | absent | strong | strong | weak | weak |
| Tolan | strong | strong | weak | weak | strong | weak | strong | weak |
| Opal | absent | weak | weak | absent | weak | weak | weak | strong |
| Balance | absent | weak | absent | weak | weak | weak | absent | weak |
| Wysa | weak | strong | weak | weak [S10] | strong | weak | absent | absent |
| Gentler Streak | strong | strong | absent | absent | weak | weak | absent | strong |

Reading: memory is strong in 6 of 13 apps and is the cheapest channel to build (it needs only the user's own text); sound/haptic is strong only in the two audio-first products; no app is strong on surprise without also using a currency or variable-reward mechanic except Tolan's one-off sketch gift.

## Anti-pattern observations (Phase 2 lens)

| AP id | Observed in | Screen / source |
|---|---|---|
| AP1.1 loss-framed streak | Duolingo, Finch (mild), Opal | https://mobbin.com/screens/801382ea-9bcc-4fd6-b461-a14b36161486, https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85 |
| AP1.2 paid streak repair | Duolingo (3,000 gems), Finch (2,000 gems after first free) | https://mobbin.com/screens/64e6436a-7982-437f-862b-62748636aa0e |
| AP1.3 blaming absence copy | Duolingo | https://mobbin.com/screens/3ed7f990-7eea-4cfa-bc35-af1ee8ecee40 |
| AP1.4 decaying pet | BitePal (health hearts, sulking [S3]) | https://mobbin.com/screens/904bb160-7998-47a0-acd8-f0ea3b401004 |
| AP2.1 fake urgency | Duolingo, Calm, Balance, Finch ("1ST TIME OFFER") | https://mobbin.com/screens/1755644a-3b98-4a8e-906f-0ef606e166eb, https://mobbin.com/screens/8a01b107-7823-46ce-83c4-780bf0ee6108 |
| AP2.3 variable reward on therapeutic act | not observed on a therapeutic act; Duolingo daily variant art on a widget hook | https://mobbin.com/screens/a238f3ab-2e49-420a-89b6-0c22d6865c31 |
| AP2.5 notification load | Stoic (3 daily on by default), Balance (7 types) | https://mobbin.com/screens/edeffaa6-a6dc-4346-9aee-efad391ace50, https://mobbin.com/screens/a746a2c1-9bcb-4c93-91e6-284f3da91fa9 |
| AP3.2 unearned emotion | Duolingo, Finch, Ahead, Tolan | see F8 |
| AP3.4 mascot on crisis | not observed; Wysa removes it | https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e |
| AP4.3 should-statement | BitePal "Now you should take care of Caramel"; Ahead "The only way to fail is to give up too quickly." | https://mobbin.com/screens/904bb160-7998-47a0-acd8-f0ea3b401004 |
| AP7.3 treatment overclaim | Ahead "You just rewired your brain!", Opal "9 years of your life" | https://mobbin.com/screens/e21e4d00-1d89-488b-bde6-4882ccc5749c |
| AP6.1 covert recall | not observed in any app | — |

## Steal / Adapt-down / Never

Steal (as is, mental-health safe):
- Verbatim echo of the user's words on the next screen (Finch, Calm, Wysa) — adaptation: quote ≤8 words, always next to the source entry (F1).
- User-scheduled pause that keeps tools and crisis link reachable (Finch, Gentler) — adaptation: no currency, 1–14 days, Happi rests (F6).
- Streak off-switch on the first streak surface (Stoic, Finch) — adaptation: hidden state gets its own reassuring copy (F4).
- Validate-then-question 2-beat copy (Ahead, Wysa) — adaptation: beat 1 uses the user's chosen feeling word; distortion names stay clinically accurate (F7, AP7.2).
- Character absent from crisis surfaces (Wysa) — adaptation: also absent over distress text and numeric rows (F10).
- Exit reply in every conversational step (Wysa "Got to go!", Tolan "Can we stop?") — adaptation: "Stop here" saves progress and closes with one neutral line.

Adapt-down (borrow, turn the dose down, state how):
- Duolingo milestone animation — adaptation: one 600–900 ms ease-out beat for Happi at Day 7/15 only, no flame character, no sunglasses, reduced motion = still pose; the +1.7% lift is a transfer from language learning (F3).
- Weekly count (Calm "4 days this week") — adaptation: drop "score!" / "lucky number" game register; plain "4 days with Happy this week" (F5).
- Visible effort pose (BitePal, Ahead) — adaptation: only during real processing, ≤1.5 s added (F11).
- Pose-as-state character (Gentler Streak, Ahead emotion cast) — adaptation: Happi shows soft, attentive concern for negative labels and never mirrors intensity (crying, rain cloud), because mirroring distress harmed Replika users (P1-F4).
- Seasonal scene swap (BitePal Halloween) — adaptation: ≤4 scene variants per year, with a decay plan so it is not a daily hook (AP5.3).
- Named narrator / chosen voice (Balance, Tolan) — adaptation: deferred to Phase 3 as optional, no celebrity faces.

Never:
- Pet health meter / feeding contract (BitePal) — AP1.4; Happi's wellbeing never depends on the user's logging.
- Paid or currency-gated streak protection (Duolingo, Finch) — AP1.2, P1-F-dose1.
- "I'm committed" forward-commitment CTA (Duolingo, BitePal) — P1-F-dose7.
- Escalating mascot faces on widgets/notifications (Duolingo) — AP1.3, P1-F12.
- Percentile, rarity or "most people" framing (Opal) — P1-F7 social comparison feeds should-statements.
- Character-voiced pushes (Tolan) — P1-F-dose2 dependence.
- Insights locked behind streaks (Ahead, Calm) — P1-F20 (F13).
- Asks on celebration screens, including `requestReview` on modal close (F9) — P1-F-dose4.

## Contradictions
- Finch's reviewer states Finch's streaks "never penalize missed days" [S2], yet Finch's lapse screen says "Save your streak to keep it alive!" and prices repair at 2,000 gems after one free use (https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85), with a confirm dialog "Are you sure you want to start your 10 day streak over?" (https://mobbin.com/screens/50df8ab5-8949-4b15-84a3-27f67dc18c1a); P1-F12 adds that repairability attenuates the broken-streak drop. Decision: trust the screens over the review; Happy avoids the whole question by counting total entry days that cannot break, so no repair, no currency and no "start over" dialog exist.
- Calm, Stoic, Headspace and Finch make streaks optional or windowed (https://mobbin.com/screens/f2dbc8b8-cd62-4853-b6bc-b2c34e1ae7ae, https://mobbin.com/screens/5fddacf1-5456-43e4-9a72-8bec9591bd75), while Duolingo and BitePal require an "I'm committed" tap and Duolingo reports a +1.7% day-7 retention lift from milestone animation [S1]. Decision: keep a celebratory Day 7/15 modal (the motion lever transfers) but strip the commitment CTA and the consecutive-day rule, and add "Hide streak"; the retention evidence is from a language app and does not justify loss framing for anxious users (P1-F12, P1-F-dose7).
- Ahead shows a sad, candle-holding character for grief (https://mobbin.com/screens/ccf1b06f-ef31-490a-9b8b-6e88935fcb22), which reads as validation, while P1-F4 records harm when a companion mirrors the user's depression. Decision: Happi acknowledges negative labels with a soft, attentive pose (eyes open, slight lean, no tears) and never amplifies the user's state.
- Visible effort raises perceived value (P1-F8; https://mobbin.com/screens/e904fdb7-bc19-486f-9f99-9bd7b0564e1b), but an added delay on an instant result is a fake-effort dark pattern. Decision: show the reading pose only for real processing time, capped at 1.5 s added display (F11).

## Rejected ideas
- Pet care contract (log = feed = hearts, BitePal https://mobbin.com/screens/904bb160-7998-47a0-acd8-f0ea3b401004) — rejected because it makes Happi's health contingent on the user's compliance (AP1.4, P1-F-dose2).
- Gem/coin economy with cosmetics and streak protection (Duolingo, BitePal, Finch) — rejected because currency attached to streaks monetizes loss aversion (AP1.2, P1-F-dose1) and adds a second progress system to a journaling app.
- Daily-variant mascot art as a widget-install hook (Duolingo https://mobbin.com/screens/a238f3ab-2e49-420a-89b6-0c22d6865c31) — rejected because it is variable reward on app installation and novelty without a decay plan (AP5.3, P1-F24).
- Drawn-signature commitment ritual (Ahead https://mobbin.com/screens/91163634-334d-40ea-a43d-04baacad948c) — rejected because the body-based ritual is attached to "commit to 5 days" and "The only way to fail is to give up too quickly", which converts a ritual into a standard to fail (P1-F-dose7, AP4.3).
- Character-voiced push notifications (Tolan) — rejected because they simulate a friend reaching out and create obligation (P1-F-dose2, F12).
- Percentile and rarity labels (Opal) — rejected because ranking against others feeds the should-statements CBT targets (Never list, P1-F7).

## Critique (pass 1)
- [FAIL] RQ1.5 Duolingo sound/haptic row in the part-A draft relied on a blog that returned HTTP 503 and on a search snippet; the claim was presented as a channel observation.
- [FAIL] RQ1.6 Calm's sound row cited [S7] (audio variation) beside a Mobbin home-screen URL (ecb19e99) that cannot show sound, implying the screen proves the audio claim.
- [FAIL] RQ1.6 Finch review quote in the draft did not match the wording seen on re-opening [S2] ("never penalize missed days", "never dies if you skip a day").
- [FAIL] RQ3.4 Duolingo's +1.7% day-7 retention [S1] was used as a "lever" without flagging it as a language-learning transfer.
- [FAIL] RQ3.3 BitePal's absence behavior (pet sulks) rests on one non-peer review [S3] and was stated without that label.
- [FAIL] RQ2.3 Draft cross-app candidate "Happi should borrow the mirroring rule" (part B F6) named no screen, string or pose and conflicted with P1-F4.
- [FAIL] RQ1.6 Part-B candidate claimed Stoic and Headspace were the only apps with a streak off-switch; re-search found the same control in Finch (dc8d14c8).
- [PASS] RQ1.4 13 app sections, each ≥4 distinct Mobbin URLs (counts in Self-critique).
- [PASS] RQ2.2 every finding has Mechanism and So what for Happy.
- [PASS] RQ5.1 Summary states decisions only.
- [PASS] RQ5.2 every Summary line cites ≥1 finding id.
- [PASS] AP lens: anti-pattern observations table records AP1.1–AP7.3 hits with screens; AP3.4 and AP6.1 recorded as not observed.
- [PASS] RQ1.6 spot-checked by re-search in this run: https://mobbin.com/screens/f6675d16-c6b5-4847-aa9f-fb66a2d61e88 (Duolingo "Tomorrow makes 7 days, let's gooooooo!" + "I'M COMMITTED" — matches), https://mobbin.com/screens/f2dbc8b8-cd62-4853-b6bc-b2c34e1ae7ae (Calm "Day 4, score!", M/T/S unchecked — matches), https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e (Wysa crisis, "Wysa is not enough", no penguin — matches); web sources [S1], [S2], [S6], [S7], [S8] re-opened and match the claims they support.

## Revisions
- Pass 2, RQ1.5: retried the Duolingo blog once more (HTTP 503 again); listed it as [S11] (unverified), made no sound/haptic claim for Duolingo, and set the matrix cell to "absent (unverified)"; the measured motion claim now cites only [S1] and [S5].
- Pass 2, RQ1.6 (Calm sound): removed the ecb19e99 link from the sound row; the row now cites [S7] only and states that stills cannot show sound.
- Pass 2, RQ1.6 (Finch quote): replaced the draft quote with the wording seen on re-opening [S2]; the contradiction with the 2,000-gem repair screen is kept in ## Contradictions.
- Pass 2, RQ1.6 (off-switch coverage): added Finch dc8d14c8 to the Finch section and to F4; F4's claim now covers Stoic, Finch and Headspace.
- Pass 2, RQ3.4: F3, the Duolingo motion row, Adapt-down and Contradiction 2 now state that +1.7% is a language-learning transfer and dose it down to one calm beat.
- Pass 2, RQ3.3: BitePal's sulking-pet row and F2 label [S3] as a single non-peer review; no Happy rule depends on it alone (AP1.4 is enforced by the health-meter screen 904bb160).
- Pass 2, RQ2.3: replaced the mirroring candidate with Contradiction 3's concrete pose rule (soft attentive pose, no tears) and the Adapt-down entry citing P1-F4.
- Pass 2: replaced worker topic-tag "Phase 1 link" lines with specific `P1-F#` ids; renumbered 10 web sources into one list plus 1 unverified.

## Self-critique
- Weakest part: motion, sound and haptic channels — 10 of 13 apps have no verified evidence for them, so the matrix under-reports those channels and the Duolingo milestone-motion recommendation rests on one secondary analysis [S1].
- Second weakness: Rootd and Daylio were replaced (not on Mobbin), so a panic-button flow and a mood-diary-first app are not represented; notification cadence could not be observed for any app.
- Distinct Mobbin URLs per app section (machine-counted): Duolingo 17, BitePal 10, Finch 20, Ahead 13, Headspace 14, Calm 14, How We Feel 13, Stoic 11, Tolan 7, Opal 9, Balance 13, Wysa 14, Gentler Streak 9; Tolan and Gentler Streak are thinnest.
- A further pass should: capture screen recordings (not stills) of Duolingo, Finch and Gentler Streak milestone moments to measure motion duration in ms, find a verified source on Finch/Duolingo haptics, and add one panic/grounding-first app (e.g. Rootd via App Store screenshots) as a substitute check.

## Sources
- [S1] Deconstructor of Fun — Duolingo mechanics: Streaks. https://duolingo.deconstructoroffun.com/mechanics/streaks (re-opened 2026-11-03; "+1.7%" day-7 retention from phoenix animation; "The threat of losing all of it"; "urgent last-chance push"; no sound/haptic content)
- [S2] Habitbox — Finch app review. https://habitbox.app/blog/finch-app-review (re-opened 2026-11-03; streaks "never penalize missed days"; bird "never dies if you skip a day") — single non-peer review
- [S3] Nutrola — BitePal Review 2026. https://nutrola.app/en/blog/bitepal-review-2026 (opened by worker A; "Miss logging for a few days and the pet visibly sulks.") — single non-peer review
- [S4] Apple App Store — Ahead: Emotional Companion. https://apps.apple.com/us/app/ahead-emotional-companion/id1570430177 (opened by worker A; "5 minutes a day"; Apple Design Award 2024 Social Impact)
- [S5] 60fps Design — Duolingo character motion essay. https://60fpsdesign.substack.com/p/fun-in-every-frame (opened by worker A; Duo wing-flap / milestone-spin quote)
- [S6] Raphael, S. (2017, Sep 21). Bedtime stories by Stephen Fry: there's an app for that. Refinery29. https://refinery29.com/en-gb/stephen-fry-audio-calm-app (opened 2026-11-03; "Take a deep breath" on launch "followed by the sound of rain"; narrators)
- [S7] Altringer Eagle, B. (2023). Calm App Nature Sounds. Desirability Lab Backfill. https://desirabilitylab.com/backfill/backfill-2024-224-calm-app-nature-sounds (opened 2026-11-03; irregular distant thunder; bird call every few minutes)
- [S8] Headspace — Headspace for Apple Watch. https://www.headspace.com/integrations/apple-watch (opened 2026-11-03; 60-second haptic breathing, taps for 4 s in / 4 s out)
- [S9] Apple App Store — Gentler Streak Workout Tracker. https://apps.apple.com/us/app/gentler-streak-workout-tracker/id1576857102 (opened by worker C 2026-11-03; "skip feeling guilty"; 2024 Apple Design Award Social Impact)
- [S10] Apple App Store — Wysa: Mental Wellbeing AI. https://apps.apple.com/us/app/wysa-mental-health-support/id1166585565 (opened by worker C 2026-11-03; diagnosis/treatment disclaimer; v7.2.0 text-to-speech)
- [S11] (unverified) Duolingo blog — streak milestone design animation. https://blog.duolingo.com/streak-milestone-design-animation/ (HTTP 503 on 3 attempts; not counted, no claim relies on it)
