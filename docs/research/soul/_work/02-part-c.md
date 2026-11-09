# Phase 2 — Competitive teardown, part C (worker output)

Pass: 1
Inputs: .claude/agents/soul-design-researcher.md, .agents/skills/app-soul-design/phases/02-competitive-teardown.md, references/evidence-template.md, checklists/anti-pattern-audit.md, references/psychology-primer.md (orientation only, not cited)

Assigned set: Rootd, Daylio, Balance, Wysa + 1 standout.

## Coverage and substitutions

- **Rootd — not on Mobbin.** Queries tried: `Rootd panic attack button` (screens, deep), `Rootd anxiety app home screen` (screens, deep), `Rootd onboarding` (flows). Zero Rootd results; returns were QUITTR, Wysa, Headspace, Liven, Mindvalley, Brilliant. **Substituted with Tolan** (companion character app with strong memory and reciprocity craft).
- **Daylio — not on Mobbin.** Queries tried: `Daylio mood check-in` (screens, deep), `Daylio mood diary entry` (flows), `Daylio` (screens, standard). Zero Daylio results; returns were Noom, Calm, Me+, Bevel, Insight Timer, WHOOP, Tolan. **Substituted with Opal** (habit/focus app with a gem-collection progress system; useful as a progress-design contrast).
- Bearable also checked (`Bearable symptom mood tracker`) — not on Mobbin.
- **Standout: Gentler Streak** (2024 Apple Design Award, Social Impact [S1]) — streak model that counts rest.
- Balance and Wysa: present on iOS.

Every row below was described from the returned screenshot, not from metadata. Copy in double quotes is transcribed from the image.

---

### App: Tolan (substitute for Rootd)

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
- Character-voiced pushes, "finally chatting" opener → [PARASOCIAL] [ATTACHMENT]
- Echo of the user's answer, sketch tied to a logged act → [VALIDATION] [MEMORY] [RECIPROCITY]
- "Can we stop?" honoured → [SDT] (autonomy)
- Voice choice, naming → [SDT] (autonomy) and IKEA investment
- Locked reading levels → [REWARD]

Harm check:
- Guilt: not observed.
- Loss aversion: not observed (no streak seen).
- Fake urgency: not observed.
- Nagging: risk — permission copy promises unsolicited character messages ("messages from your Tolan"); cadence not visible. https://mobbin.com/flows/3734e10b-c681-4d05-90c9-5a2dad369e02
- Infantilizing / unearned emotion: "Hey Alex, I can't believe we're finally chatting!" performs excitement on a first contact (AP3.2) and "Chat as long as you like!" sets no boundary on use. https://mobbin.com/screens/5a4666e3-bc29-47e2-aa70-5cd14b804afe
- Crisis handling: not observed (no crisis surface found in Mobbin results).

---

### App: Opal (substitute for Daylio)

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
- Gem collection, locked 5/30 milestone → [REWARD]
- "Owned by 69%", "Top 17% WORLDWIDE", "what most people don't" → [CULTURE] (social-comparison norm) and loss-aversion risk under [REWARD]
- "put your phone down around 1PM-2PM" → [MEMORY]
- Countdown "3" → [RITUAL]

Harm check:
- Guilt: not observed in captured screens.
- Loss aversion: consecutive-day gates ("30 days in a row", "2 days straight") plus a header flame streak make a missed day cost the gem. https://mobbin.com/screens/1ab1ceef-2aad-4a64-bf1d-b26d6e193f38
- Social comparison: "Top 17% WORLDWIDE", "Owned by 69%", "You're doing what most people don't." — would turn a mood log into a ranking if copied. https://mobbin.com/screens/a4301fe8-32d4-4b09-8054-bf68100ced03
- Unsupported outcome claim (AP7.3 analogue): "Opal will get you back 9 years of your life". https://mobbin.com/screens/e21e4d00-1d89-488b-bde6-4882ccc5749c
- Fake urgency: not observed.
- Nagging: not observed.
- Infantilizing: "Let's solidify it with a fist bump" — mild, adult register. Not a hit.
- Crisis handling: not applicable (not a mental-health product); not observed.

---

### App: Balance

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
- "If you like", "Not sure", user-set reminder → [SDT] (autonomy)
- Skill levels → [SDT] (competence)
- Named narrator voice → [PARASOCIAL] [WARMTH]
- Day N of 10 plan + closing screen → [RITUAL]
- Badge "Get a 2-day streak" → [REWARD]

Harm check:
- Guilt: not observed; closing copy has no should-statement.
- Loss aversion: mild — streak badge "Get a 2-day streak" exists, but no loss copy observed. https://mobbin.com/screens/5e8cdc0a-eba0-4b82-afd1-052d0132fbdd
- Fake urgency: observed (AP2.1) — "SALE - 65% OFF" pill on the daily plan and banner "65% off lifetime memberships, for a limited time". https://mobbin.com/screens/8a01b107-7823-46ce-83c4-780bf0ee6108
- Nagging: risk — push settings list 7 reminder types plus "Sleep tips" and "Recommendations" toggled on; "Plan push campaigns" off. https://mobbin.com/screens/a746a2c1-9bcb-4c93-91e6-284f3da91fa9
- Infantilizing: not observed ("Nice job today" is adult register).
- Crisis handling: not observed.

---

### App: Wysa

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
| sound/haptic | Text-to-speech playback added in v7.2.0 [S2]; haptics not visible, no source found | — |

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
- "Glad you're back", typing dots → [ATTACHMENT] [RECIPROCITY]
- Quoted echo, "Some days our feelings go into hiding" → [VALIDATION]
- Happiness box → [MEMORY] and IKEA investment
- #Relax shortcut → [RITUAL]
- Penguin as chat persona → [PARASOCIAL]
- "NOT NOW", "Got to go!" → [SDT] (autonomy)

Harm check:
- Guilt: not observed — return copy omits the gap.
- Loss aversion: not observed (no streak in captured screens).
- Fake urgency: not observed.
- Nagging: not observed beyond one daily check-in toggle. https://mobbin.com/screens/e1be7ff1-4331-4038-974e-87ad6235ee4d
- Infantilizing: borderline — emoji density ("Ok!👍", "😇", "☝️") and "Sometimes, all we need is someone who can be there for us, right? 😇" positions the bot as the someone. https://mobbin.com/screens/6eb03ca6-a5da-44e8-a2d0-fe3a33db7dca
- Crisis handling: present and character-free; states its limit ("Wysa is not enough"). https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e — App Store copy also disclaims diagnosis/treatment [S2].

---

### App: Gentler Streak (standout)

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
| sound/haptic | Not visible; App Store listing makes no claim [S1] | — |

Mascot mechanisms:
- Pose-as-state: the same character shows rest, fatigue and pause through body posture, with no speech bubble.
- Character relaxes during user absence (beach chair) instead of decaying — absence rendered as the character's holiday too.
- Character never appears beside metrics or warnings; it sits in the hero illustration only.

Non-mascot soul mechanisms:
- Streak redefined so rest days count [S1] ("rest days part of the equation").
- Absence is a user-set status ("Taking a Breather") with a user-triggered return.
- Missed days reported as dated facts without evaluation.
- Rest delivered as an explicit choice phrase the user taps ("Today I Choose Rest").
- Hand-drawn annotation in onboarding signals human authorship.

Phase 1 link:
- Rest counts, "full permission to rest" → [SDT] (autonomy) and loss-aversion removal under [REWARD]
- User-set breather status, neutral "NO ACTIVITIES" chip → [VALIDATION] (self-compassion) [WARMTH]
- Pose-as-state character → [PARASOCIAL] at low arousal [CULTURE]
- Monthly Recap → [MEMORY] [RITUAL]

Harm check:
- Guilt: not observed — "skip feeling guilty" is product copy [S1]; missed day is a factual chip. https://mobbin.com/screens/597f67c9-a016-40a8-b3fd-2e0c6cd70bf9
- Loss aversion: not observed in copy; the red band with a warning triangle on the status bar could read as alarm for overtraining. https://mobbin.com/screens/af1d374d-4ab3-4d9c-9c9d-47a1ed767ee1
- Fake urgency: not observed; "Go Premium — 1 week free" card on home is a plain upsell.
- Nagging: not observed.
- Infantilizing: not observed.
- Crisis handling: not applicable.

---

## Candidate cross-app findings

### F1. Absence is rendered as a state the user chooses, not a lapse the app records
- Claim: The 3 apps here with no observed guilt copy (Gentler Streak, Wysa, Balance) each treat a gap as either a user-set status or not mention it at all, with 0 references to how long the user was away.
- Evidence: https://mobbin.com/screens/d645b906-bb96-44bc-a4fe-8d6b79109e96 (Gentler "Taking a Breather … When you feel ready to come back"), https://mobbin.com/screens/c04f5bad-c60e-42d2-a4aa-14839ddafddb (Wysa "Glad you're back, JS!"), https://mobbin.com/screens/2852d5ec-532c-4f0f-b00f-ffe5ee4d9c3f (Balance "Come back tomorrow, or keep exploring Balance.")
- Mechanism: Attributing the gap to a chosen state (or omitting it) keeps the lapse off the person, avoiding shame and the avoidance it drives [VALIDATION] [SDT]; Gentler goes further by letting the user set the state, so return is self-initiated.
- So what for Happy: Return screen copy names no duration; add a user-settable "taking a breather" status that pauses the streak counter and shows Happi resting (not sad). Happi's absence pose = rest, never decay.

### F2. Warmth arrives by echoing the user's exact words within one turn
- Claim: Both chat-led apps repeat the user's own phrase back within the next character message before offering anything new.
- Evidence: https://mobbin.com/screens/0804ae99-d713-466d-93b5-719ca47b34e2 (Wysa "'Caring, kind and helpful'. ☝️ That is a powerful affirmation."), https://mobbin.com/flows/f1595b35-4bcf-4abe-aeaf-ed5ff33f399b (Tolan "Building friendship—a classic choice!"), https://mobbin.com/screens/138ebfc1-f62f-48ff-abb7-8281f1572edd (Tolan sketch "you just chose to see a friend with full appreciation")
- Mechanism: Reflecting content is level-1/2 validation (being heard accurately) and shows the app processed the input [VALIDATION] [RECIPROCITY]; quoting rather than paraphrasing avoids putting words in the user's mouth.
- So what for Happy: After a Thought Catch save, Happi's one line quotes ≤8 words of the user's thought in quotation marks before any reframe prompt; never paraphrase the distortion back as a judgement.

### F3. The character leaves the room on crisis and metric surfaces
- Claim: Wysa's crisis screen and Gentler Streak's metric/warning rows contain no character art, while both apps show the character elsewhere.
- Evidence: https://mobbin.com/screens/de96d391-118b-4684-add3-62a5634d2d7e (Wysa SOS: helplines, no penguin), https://mobbin.com/screens/0dffe6d2-52aa-41c7-b1d6-de34abea4f7e (Gentler metric cards: no heart character), https://mobbin.com/screens/89addee0-a199-4220-bf7c-5fc6b916e1da (Gentler character confined to hero)
- Mechanism: A cute face on high-stakes information lowers perceived seriousness and can imply clinical authority [WARMTH] [PARASOCIAL]; removing it hands authority to humans/data.
- So what for Happy: Happi is hidden on crisis resources, SOS, and over the user's own distress text (matches AP3.4); keep Happi in hero/illustration slots only.

### F4. Streaks that count rest or sit beside skills read as care; consecutive-day gates read as pressure
- Claim: Gentler Streak counts rest days in the streak and Balance shows streak as 1 of 3 equal stats, whereas Opal gates named rewards on unbroken runs ("30 days in a row") and displays a header flame.
- Evidence: https://mobbin.com/screens/3403a2b3-a7c6-4e30-b5f8-51c079ebb2f3 (Gentler "A healthy streak includes rest days"), https://mobbin.com/screens/7df0b77f-aa05-4cec-86e4-aa4ee37d84df (Balance "Daily streak 1 day" beside "Time trained" and "Awareness Level 1"), https://mobbin.com/screens/1ab1ceef-2aad-4a64-bf1d-b26d6e193f38 (Opal "Radiant Gem … 30 days in a row", "5/30 days", "Locked")
- Mechanism: A gate that resets on one miss makes the streak a loss to avoid (loss aversion), which crowds out intrinsic motivation; counting rest or demoting the count to one stat keeps competence signals without the threat [REWARD] [SDT]. Gentler states the intent as letting users "skip feeling guilty" [S1].
- So what for Happy: Replace the Day 7/15 streak modal with a "days practiced" count that never resets, and let a declared rest day count; no milestone object is ever locked behind consecutive days.

### F5. Percentile and rarity framing appears only in the productivity app, never in the mental-health ones
- Claim: Opal labels every gem with an ownership percentage and the profile with "Top 17% WORLDWIDE", while Wysa and Balance show only self-referenced progress (own levels, own calendar).
- Evidence: https://mobbin.com/screens/a4301fe8-32d4-4b09-8054-bf68100ced03 (Opal "Top 17% WORLDWIDE", "Owned by 23%"), https://mobbin.com/screens/5299e905-4ad4-402a-9161-3c8a03bbf7ae (Opal "You're doing what most people don't."), https://mobbin.com/screens/6023c500-9076-4e9d-8972-17b36ad50bc4 (Balance own-calendar progress)
- Mechanism: Upward/downward social comparison makes progress conditional on others; for users prone to self-criticism this feeds the "should" distortions CBT targets [CULTURE] [VALIDATION].
- So what for Happy: No percentiles, "most people", or rarity labels anywhere; progress copy compares the user only to their own past ("3 thoughts caught this week, 1 last week").

### F6. Notification permission framed as the character reaching out raises the parasocial stakes
- Claim: Tolan asks for push permission as messages from the character ("like that new song they found for you"), whereas Wysa and Balance frame it as reminders the user schedules.
- Evidence: https://mobbin.com/flows/3734e10b-c681-4d05-90c9-5a2dad369e02 (Tolan "You'll get messages from your Tolan…"), https://mobbin.com/screens/ff59c484-845f-4eb0-a383-8be9c465b5fc (Wysa "get reminders to check in with Wysa", "NOT NOW"), https://mobbin.com/screens/91b1390e-4556-4c8b-8b94-566519cd87c5 (Balance "When would you like to be reminded?")
- Mechanism: Character-initiated contact simulates a friend thinking of you, strengthening attachment but also creating obligation to respond and a channel for guilt [PARASOCIAL] [ATTACHMENT]; user-scheduled reminders keep control with the user [SDT].
- So what for Happy: Permission ask asks the user to pick a time (Balance pattern); pushes are signed by the app, not voiced as Happi "missing" the user, and carry no mood content on the lock screen.

### F7. A visible exit in every conversational turn
- Claim: Wysa and Tolan both make leaving a first-class reply: Wysa offers "Got to go! 👋" among quick replies and Tolan honours "Can we stop?" in one message.
- Evidence: https://mobbin.com/screens/32320b65-7a02-40a2-9310-430501acac02 (Wysa), https://mobbin.com/screens/425acb5c-514b-4183-ac56-380ca2d8dacb (Tolan "Got you, I'll chill.")
- Mechanism: An explicit, unpunished exit preserves autonomy, which raises willingness to return [SDT] [ATTACHMENT].
- So what for Happy: Every Happi-led step in a CBT flow carries a "Stop here" quick reply that saves progress and closes with one neutral line, no persuasion.

## Sources
- [S1] Gentler Streak Workout Tracker — App Store listing (US): "Keep your streak alive by following your body's needs, even when it calls for rest days"; "skip feeling guilty"; 2024 Apple Design Award for Social Impact; 2022 Apple Watch App of the Year. https://apps.apple.com/us/app/gentler-streak-workout-tracker/id1576857102 (opened 2026-11-03)
- [S2] Wysa: Mental Wellbeing AI — App Store listing (US): disclaimer "Wysa does not offer any diagnostic measurements or treatment advice…"; v7.2.0 text-to-speech. https://apps.apple.com/us/app/wysa-mental-health-support/id1166585565 (opened 2026-11-03)
