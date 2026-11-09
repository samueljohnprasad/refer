# Phase 2 — Part B: Headspace, Calm, How We Feel, Stoic

Worker: Phase 2 part B. Platform: iOS (Mobbin). All four apps found on Mobbin; no substitution needed. Stoic is listed on Mobbin as "stoic.".
Queries run: Headspace — "streak or progress screen", "check-in how are you feeling mood", "reminder notification permission". Calm — "streak or session completion screen" (returned other apps only), "Calm app sleep stories meditation home", "Calm mood check-in streak profile progress", flow "Calm onboarding". How We Feel — "emotion check-in mood meter", "reminders notifications schedule check-in streak". Stoic — "stoic journal app morning preparation evening reflection" (returned one How We Feel screen, kept), "stoic. daily reflection journaling prompt mood", "stoic. streak broken or reminders notification setup".
Phase 1 artifact not available to this worker; links use topic tags.

### App: Headspace

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
| sound/haptic | Per-session "Haptic Assistance" toggle: "Receive a series of gentle haptic vibrations that let you know when it's time to look at your device." Watch app: 4-s in / 4-s out taps [S3] | https://mobbin.com/screens/1749c7df-ee7d-4f21-8358-c518a39a0a48 |
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
- [VALIDATION] "Difficult, I'm feeling discouraged" as a first-class answer; normalising quote under streak.
- [SDT] autonomy — hideable streak, "Maybe later" on reminder, "schedule that feels good".
- [WARMTH] first-name greeting + "great job" after first exercise.
- [RITUAL] wind-down / bedtime pair.
- [MEMORY] dated activity history; check-in trend chart.

Harm check:
- Guilt: not observed.
- Loss aversion: not observed — streak can be hidden (bb0004ec); no streak-loss copy seen.
- Fake urgency: not observed.
- Nagging: weak risk — notification ask framed around trial end ("Get notifications about when your trial is about to end and more"), mixing billing and care pushes (66e6952c).
- Infantilizing: not observed; copy is adult. Share tooltip sits over the session-end card at a reflective moment ("Like this course? Share the whole thing with a friend.") — https://mobbin.com/screens/2bc7441f-4430-477a-860e-b8b45d05349f.

### App: Calm

| Channel | What it does | Screen |
|---|---|---|
| ritual | Onboarding opens on a single line "take a deep breath" over a blue gradient; press report says rain audio follows on launch [S1] | https://mobbin.com/flows/38549b00-2fe8-4fd1-914b-13c4905db245 |
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
| sound | Rain track has irregular distant thunder; stream track a bird call every few minutes, so the loop does not read as mechanical [S2] | https://mobbin.com/screens/ecb19e99-688b-491e-a12f-e5e43e59dfd8 |
| character | none — imagery is landscape video and celebrity narrator portraits (Matthew McConaughey, Harry Styles) | https://mobbin.com/screens/e378a36f-528f-4b22-920e-cb4cad3144f8 |

Mascot mechanisms:
- none — no mascot. Parasocial role is carried by celebrity narrator faces and voices on sleep stories (e378a36f, f7b6055d-a700-4807-b055-7d43e50bd120 "Fall asleep and fall in love with the dreamy voice of Harry Styles": https://mobbin.com/screens/f7b6055d-a700-4807-b055-7d43e50bd120).

Non-mascot soul mechanisms:
- Opening ritual of one instruction ("take a deep breath") before any UI (flow 38549b00) [S1].
- Weekly-count framing: missed days stay visible but the headline counts days achieved this week (f2dbc8b8).
- User's own words returned on a dated card immediately after writing (feb92e75).
- Ambient sound with low-rate irregular variation [S2].
- User picks the reminder slot inside the feature it serves (f8a32877).

Phase 1 link:
- [RITUAL] breath-first launch; post-session breath line.
- [MEMORY] reflection card echoing "My legs because I love to hike."
- [PARASOCIAL] celebrity narrator voice as companion.
- [REWARD] weekly score card; locked insights as delayed reward.
- [SDT] reminder slot chosen by user.
- [CULTURE] low-arousal register (gradient, slow copy) except "Day 4, score!".

Harm check:
- Guilt: not observed.
- Loss aversion: weak — "Current 1 day" shown next to "Longest 3 days" invites comparison to a lost run (efbc1e20).
- Fake urgency: observed — anchor pricing "$19.99/year (previously $69.99)" in a modal over home (https://mobbin.com/screens/fe887a6f-5806-400d-b560-e874893b8f73).
- Nagging: observed — home leads with "Subscribe to Family Plan" above content (ef1a6269); insights gated behind "Keep checking in to unlock" (efb70f0a).
- Infantilizing: mild — "Day 4, score!" / "Four seems to be your lucky number." is game register in a sleep/meditation product (f2dbc8b8).

### App: How We Feel

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
- [VALIDATION] granular negative words ("Helpless", "Burned Out") offered without correction.
- [MEMORY] typed answer reused in the next prompt; exportable history.
- [REWARD] "Evening Surprise" window = variable timing on a cue, not on a reward.
- [RITUAL] morning/evening check-in pair.
- [SDT] Skip on reminders; user chooses which reflect tool.
- [WARMTH] "Your future self thanks you."

Harm check:
- Guilt: not observed.
- Loss aversion: not observed in captured screens; streak shown as a small counter (8acaa4b0).
- Fake urgency: not observed.
- Nagging: weak — "Friends Notifications" on by default next to daily reminders (269c2989).
- Infantilizing: not observed. Tone risk: "Ask if this feeling is serving you." on a sad entry pushes toward shifting before acknowledging (df9fe2e8) — a validation-skip, not infantilizing.

### App: Stoic

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
- [SDT] streak toggle + chosen goal + skip.
- [MEMORY] emotion words restated in prompt and feed.
- [RITUAL] morning preparation / evening reflection pair; 7-day themes.
- [VALIDATION] "Not great 14%" shown without corrective copy.
- [CULTURE] lowercase, low-arousal headings.

Harm check:
- Guilt: not observed.
- Loss aversion: weak — flame icon with count on home (f97f3994); offset by opt-out (5fddacf1).
- Fake urgency: not observed.
- Nagging: observed risk — three daily pushes toggled on by default with a habit claim (edeffaa6, https://mobbin.com/screens/bf867df9-6820-4519-adca-d573fba434d1); breaches AP2.5 spirit if accepted without edit, though user-scheduled.
- Infantilizing: not observed; "Good job!" on day 1 is the strongest praise seen (81a9db8f).

## Candidate cross-app findings

### F1. Streak control is offered at the moment the streak first appears
- Claim: The two lowest-pressure streak systems in this set give the user an off-switch or hide control on the streak surface itself.
- Evidence: https://mobbin.com/screens/5fddacf1-5456-43e4-9a72-8bec9591bd75 (Stoic "you can turn them off if you want"); https://mobbin.com/screens/bb0004ec-e553-4e4d-a10e-1e21e59c8781 (Headspace hidden streak "Meditate on a schedule that feels good.")
- Mechanism: inference: a counter the user can switch off is perceived as informational rather than controlling, which SDT predicts preserves autonomy; offering it at birth (day 1) precedes any investment, so opting out costs nothing.
- So what for Happy: the Day 7/15 streak modal and home counter need a visible "Hide streaks" control on the first streak surface (Day 1), and the hidden state needs its own copy, not a blank.

### F2. Calm-register apps count days in a window, not consecutive days
- Claim: Calm and Stoic frame progress as days achieved in a week rather than an unbroken chain.
- Evidence: https://mobbin.com/screens/f2dbc8b8-cd62-4853-b6bc-b2c34e1ae7ae (Calm "4 days this week" with unchecked Mon/Tue/Sat); https://mobbin.com/screens/c00fcab1-8056-49b2-8693-a57a91b3de74 (Stoic "Based on 7 answers" weekly highlight); https://mobbin.com/screens/0fa16add-4841-45a5-b1a2-0389f05902c4 (Stoic user-picked target from 3 days)
- Mechanism: inference: a missed day in a weekly count lowers the number by one instead of resetting to zero, removing the loss-aversion spike that a broken chain creates; a user-picked small target (3 days) makes the first win reachable.
- So what for Happy: replace consecutive-day counting behind the Day 7/15 modal with "days this week" or a user-chosen target; a lapse should never display 0.

### F3. Warm apps reflect the user's own words back within one screen
- Claim: Calm, How We Feel and Stoic each quote the user's typed answer or chosen emotion word on the next screen.
- Evidence: https://mobbin.com/screens/feb92e75-a5ba-4cc8-ba68-5e976576ba5e (Calm "My legs because I love to hike."); https://mobbin.com/screens/d02f5f0b-11a0-4b9f-8f22-f8244ce4db15 (How We Feel reuses "Because I can exercise"); https://mobbin.com/screens/2b88e656-f883-42c3-ad30-c391c35b9f3c (Stoic "what's making you feel curious, inspired, and motivated?")
- Mechanism: inference: restating a disclosure is a low-level validation signal (being heard) and a visible memory cue, and it happens where the source is on screen, so it does not read as surveillance.
- So what for Happy: after a thought-catch entry, Happi's next line must contain the user's own emotion word or a phrase from the entry, shown adjacent to that entry.

### F4. Negative and uncertain answers are first-class options in check-ins
- Claim: Headspace and How We Feel present "difficult" and "not sure" states as equal-weight buttons, without corrective copy on the same screen.
- Evidence: https://mobbin.com/screens/60bf931f-5547-4244-91a0-a15b3a7edffe (Headspace "Difficult, I'm feeling discouraged", "I'm not sure"); https://mobbin.com/screens/d8171890-2681-4f31-8462-036346d49e2e (How We Feel "Helpless", "Burned Out", "Lonely"); https://mobbin.com/screens/c00fcab1-8056-49b2-8693-a57a91b3de74 (Stoic "Not great 14%" shown plainly)
- Mechanism: inference: equal visual weight signals that every answer is acceptable, which supports honest reporting and affect labelling; corrective copy on the same screen would signal the answer was wrong.
- So what for Happy: check-in options keep identical button styling for negative states; the first response after a negative label acknowledges before suggesting (contrast How We Feel's "Ask if this feeling is serving you." at https://mobbin.com/screens/df9fe2e8-28a1-48de-a6e1-8b40d6aa74d1).

### F5. Reminders are chosen inside the feature, with a skip
- Claim: Calm, How We Feel and Stoic ask for reminder timing as a slot choice tied to the activity, each with an exit.
- Evidence: https://mobbin.com/screens/f8a32877-5740-4fe0-94d9-4742c73aae72 (Calm Morning/Afternoon/Night); https://mobbin.com/screens/ed3aa779-3bca-4e78-91f9-2dfb1419d447 (How We Feel "Skip"); https://mobbin.com/screens/269c2989-3382-4946-9a61-a51f3add4d36 (How We Feel "Evening Surprise 5pm–9pm")
- Mechanism: inference: a reminder the user schedules is a self-set cue, not an external demand; a time window adds variability to the cue without attaching variable reward to the act.
- So what for Happy: one reminder by default (off until chosen), set from a slot picker, with an optional window mode; never three-on defaults as in Stoic (https://mobbin.com/screens/edeffaa6-a6dc-4346-9aee-efad391ace50).

### F6. No app in this set uses a speaking mascot; character is ambient or generated from the user's input
- Claim: Headspace uses silent smile blobs and How We Feel generates a shape from the user's emotion label; neither character speaks.
- Evidence: https://mobbin.com/screens/1f158192-d73e-4196-9ec1-6be406e76b59 (Headspace blob over "What's on your mind?"); https://mobbin.com/screens/d20239e6-f60e-42f2-bdf6-2de759d8572a (How We Feel "proud & good" shape)
- Mechanism: inference: a non-speaking character carries warmth without making claims or giving instruction, avoiding perceived clinical authority; a character derived from the user's label mirrors the user rather than performing its own emotion.
- So what for Happy: Happi can speak (Happy's differentiator) but should borrow the mirroring rule — Happi's expression follows the user's labelled emotion, not a fixed cheer.

## Sources
- [S1] Raphael, S. (2017, Sep 21). "Bedtime Stories By Stephen Fry? There's An App For That." Refinery29. https://refinery29.com/en-gb/stephen-fry-audio-calm-app
- [S2] Altringer Eagle, B. (2023, Oct). "Calm App Nature Sounds." Desirability Lab Backfill. https://desirabilitylab.com/backfill/backfill-2024-224-calm-app-nature-sounds
- [S3] Headspace. "Headspace for Apple Watch — breathing & mindfulness app." https://www.headspace.com/integrations/apple-watch
