# Journey path and reward ceremonies: research

Examined 2026-11-08 on Mobbin (iOS). Every observation below cites a screen or flow I opened in this session. Mobbin shows stills, so **every duration, easing, haptic and sound in this document is an inference**, marked *(inferred)*. Duolingo path sizes were measured from the pixels of the F1 path screen (299 × 678 px thumbnail; ×1.304 = pt), and are ±5%. Other sizes are estimates from thumbnails, marked "about".

Method notes:
- The `appllama` skill named in the brief is not installed in this environment. App structure and flow order come from Mobbin flows instead.
- Peak and Impulse are not on Mobbin. Searches for them returned Speak, Brilliant, Bevel, Nike Training Club and Sweatcoin, which are used as substitutes where relevant.
- Yuka and Rise are on Mobbin but have no path or reward ceremony. They are covered briefly.
- Motion vocabulary follows `.agents/skills/rossark-motion-skill` (flow, track, moving holds, one-shot clock, ease-out for arrivals, frequency decides how much).
- Existing project rules this research must respect: `docs/research/soul/03-character.md` (Happi presence and the expression set), `05-tokens.md` (motion, haptics, copy caps) and `06-implementation-spec.md` (Completion and Journeys screens).

---

## 1. Per-app teardown

### 1.1 Duolingo (the benchmark)

**Path.** Flows [F1 Completing a lesson, 23 screens](https://mobbin.com/flows/706ba483-579e-4628-9903-ba0809870d18), [F5 Completing a lesson (chess)](https://mobbin.com/flows/7f446798-f87a-4eb5-8cfe-03e817a1290a), [F6 Streak](https://mobbin.com/flows/d1739059-58c7-4b20-8630-8833869d34bb), [F7 Streak](https://mobbin.com/flows/e7d141df-f1bd-4092-b218-59df9b26a657).
- **Unit banner.**
  - Full-width rounded card in the unit colour, with an eyebrow "SECTION 1, UNIT 4", a title "Learn basic phrases" and a guidebook icon in a divided right segment.
  - 77 pt tall (measured), with a darker bottom rim like the nodes.
  - Each unit has its own hue (green, blue, pink, red, observed in F1, F3, F5 and [screen edb09afd](https://mobbin.com/screens/edb09afd-5b2a-4262-aca1-01d5d6b7e41f)).
- **Node.** A "puck": an elliptical top face plus a rim in a darker shade of the same hue, 69 × 52 pt in total (measured). There is no stroke and no drop shadow; depth comes only from the rim. A white glyph sits in the centre at about 40% of the node width.
- **Layout.** Zigzag offsets of 0, +46, +69 and +46 pt from the centre line, with a vertical pitch of 85 pt between node centres (measured, F1). Nodes have no labels; a tap opens a popover card under the node in the unit colour with a pointer, a title, a line and buttons ([screen fac0e197](https://mobbin.com/screens/fac0e197-2364-48f1-bc26-be8ddf392179), "REVIEW +5 XP" and "LEGENDARY +40 XP").
- **Current node.**
  - Full unit colour, inside a light grey ring track about 110 pt across (measured: radius about 42 px).
  - A white "CONTINUE"/"START" callout pill sits above it, in unit-colour text with a pointer (F1).
  - After one lesson inside a multi-lesson node, the ring shows an arc of about 1/6 in the unit colour (F1, return screen). Section 2 shows the ring as dashed segments, one per lesson (F3 blue path).
- **Locked nodes.** Light grey pucks with grey glyphs: star = lesson, dumbbell = practice, video, headphones = radio, mic = speaking, book = story. The chest is a grey 3D chest with no puck, and the unit-end trophy is a grey goblet (F1, F3, F5).
- **Completed nodes.**
  - Solid unit colour with a white glyph or check, and no ring (F5: the first node goes solid and the ring moves to node 2).
  - The **legendary/perfected** state is a gold puck with a dark-gold star (F6 Korean path).
  - A claimed chest is a gold open chest on a light grey square tile (F6). The unit trophy is a green goblet with laurels and the unit number (F6, and [screen f482c76d](https://mobbin.com/screens/f482c76d-09ea-43b4-a3b5-85538d9ff763) shows a scalloped rosette "10").
- **Decoration.**
  - Each unit has a character vignette beside the path (Duo with a globe, a chef at a campfire, a chess player), greyed while the unit is locked and in full colour once it is done (F1 vs F6).
  - Duo shows a 1–3 star rating under him beside a completed unit (F6).
- **Unit divider.** A thin grey rule with the next unit's title centred in grey ("Learn Korean consonants", F6).
- **Jump button.** A white rounded square with a blue arrow at the bottom right, pointing up or down towards the current node (F6, [screen f482c76d](https://mobbin.com/screens/f482c76d-09ea-43b4-a3b5-85538d9ff763)).

**Lesson completion sequence** (order observed across F1, F2 [without Super](https://mobbin.com/flows/2f3bfacf-8cf3-44b2-95c6-9b8d0e92acc8), F3 [Completing a lesson](https://mobbin.com/flows/c199f9a9-7a91-4795-8ba5-5a3c24847009) and F4 [suit event](https://mobbin.com/flows/c37d3e49-5729-4d1c-9a11-f531e09ddd49)):
1. Last answer: a bottom feedback sheet ("Awesome!" on green with a cloud-shaped top edge, or "Incorrect / Correct Answer: ant / GOT IT" on red).
2. Combo burst mid-lesson: a full-screen "PERFECT" sticker with yellow light rays and "17 IN A ROW" on the progress bar (F3).
3. Celebration screen.
   - Duo and a secondary character perform a jump or high-five ("Word wizard! You learned 6 new words!").
   - Three stat cards follow, each with a coloured header strip: TOTAL XP / QUICK 4:46 / GOOD 88%.
   - Then the "CLAIM XP" button (F2).
   - A perfect run swaps in "Go ahead, brag! 0 mistakes? You're really good at this." with a muscle Duo wearing a #1 medal, AMAZING 100% and BLAZING 1:02 ([screen fe966528](https://mobbin.com/screens/fe966528-929c-475b-b917-9b342e3868a5)).
4. Streak screen: a huge "6 day streak", Duo hugging a flame, the bubble "Tomorrow makes 7 days, let's gooooooo!", a week row of check circles with a blue freeze, a sunglasses icon for the next milestone, and the CTA "I'M COMMITTED" ([screen f6675d16](https://mobbin.com/screens/f6675d16-c6b5-4847-aa9f-fb66a2d61e88)).
5. Streak goal ask: "I bet 7 days will be easy peasy! Right?" with "I CAN DO IT" (F3).
6. Social inserts: "Friend Streak with Sam Lee" ([eebf51b7](https://mobbin.com/screens/eebf51b7-7358-477b-ba2b-e2ed8aedbef2)) and a Friends Quest "3 days left! Do 9 more lessons…" with "SEND XP BOOST 20 gems" / "MAYBE LATER" (F3).
7. Rewards:
   - "+5 gems": an open wooden chest overflowing blue gems, with small gems arcing above and a grey floor shadow (F1).
   - "+50 gems … for unlocking your French Score!" with "CONTINUE" (F3).
   - A purple **EPIC** chest with three tap-chance dots and "1 chance left!", then a **RARE** suit reveal from a cardboard box on a sky background ("The Sneaky Cat suit is yours!") and a Suit Quest collection meter (F4, [2e232372](https://mobbin.com/screens/2e232372-827c-46f4-828e-9ce42af9d4ad), [2df438b2](https://mobbin.com/screens/2df438b2-5c11-49f3-af79-1e4de036b85d)).
8. Monetisation: a "Skip ads with a 7 day free trial of Super!" interstitial inside the completion flow (F4).
9. Return to path: the ring arc grows (F1), or the completed node turns solid and the current ring moves to the next node (F5).

**Duo's behaviour.**
- Full-body acting on every celebration: jumping, high-fiving, flexing, hugging the flame.
- Exclamation-heavy bubbles.
- Distress in absence states: widget cards "1 week abandoned" (pale crying Duo) and "1 week without French" (wilted Duo with a rose) ([d7d5d9f4](https://mobbin.com/screens/d7d5d9f4-233f-4cbe-99ba-02e32cc6dc16)), and teary eyes on "Delete Account" ([d11f999b](https://mobbin.com/screens/d11f999b-fe53-43bf-ab06-334852364c27)).
- Secondary cast: several human characters appear as lesson hosts and as Duo's partner in celebration duets (F2, F3).
- Streak hub: a "588 day streak!" STREAK SOCIETY badge, a 7-Day Challenge with milestones at 7, 14 and 30, "Freezes used" and a locked "Reach a 7 day streak to join the Streak Society" (F6). A Friends tab carries NUDGE buttons (F7).

### 1.2 Finch (closest to the warm, gentle register)

- **Claiming a milestone** ([flow f9db79f5](https://mobbin.com/flows/f9db79f5-0f15-474a-8756-5ff201c81062)):
  1. A Weekly Milestones card, "Calm / Do a goal for 2 days", with a green **Claim** button.
  2. The reveal: a mint background, the pet sitting among bushes with a butterfly, and a bubble about *its own* day ("Today felt like a soft cloud!").
  3. A smiling star on soft radial rays: "A Shiny Star for You! 2 days of Calm goals done this week! You're planting the seeds of a habit!"
  4. Confetti appears on the first frame and is gone on the settled frame *(inferred: one-shot burst of about 1 s)*. A single white CTA reads "Awesome!".
- **Completing a goal** ([flow 2d8a4c8a](https://mobbin.com/flows/2d8a4c8a-20d1-4239-b528-c4fbd26742a7)):
  1. Home: a room scene with the pet, a "2nd Adventure 0/15" energy bar, and goal rows with check buttons.
  2. Completion: a full-screen night-forest scene, with confetti on the first frame only. The energy bar fills to MAX with a glowing lightning orb at its end, then "Woohoo! Lee drank Water and energized for Day 1", a chip "Lee got +139 Rainbow Stones", and "Continue".
  3. Third goal: "3RD GOAL COMPLETED!", the pet hugging a heart beside an egg, "Your Micropet egg just got one step closer to hatching!", a striped bar "4 goal completions until hatch!", a secondary "Reflect" link and "Yay!".
  4. A proactive **Streak Repair**: "You earned a free Streak Repair! With this one-time Repair, you can miss one day without losing your streak." with "Claim".
- **Reading.** Rewards are attached to the *pet's* journey, so the user is caring for someone rather than being scored. Forgiveness is offered before it is needed. Currency and confetti are still present.

### 1.3 Headspace (quietest complete loop)

- **Today list** ([flow 7763b37d](https://mobbin.com/flows/7763b37d-c5e6-4394-9471-f8f1823c9fc7)): a vertical dashed timeline of cards. Done = green check circle, current = solid orange dot, upcoming = hollow grey ring. After a session the check fills and the orange dot moves down one card. This is the same "indicator travels to the next step" mechanic as Duolingo, with no celebration.
- **Completing a session** ([flow a7d6a68b](https://mobbin.com/flows/a7d6a68b-d9af-4e4f-8871-c4fa5e2d6922), 15 screens):
  1. The player ("Feeling Overwhelmed").
  2. **"How'd it go? Take a moment to reflect."** with "Great, I'm feeling relaxed", "Challenging, but I'm eager to keep trying", "Difficult, I'm feeling discouraged" and "I'm not sure". A difficult outcome is allowed and is not penalised.
  3. "Minutes Meditated 13" on a warm yellow band, paged, with a quote "Imagine all of the thinking, sensations, and tension in the body just beginning to melt away.", heart, share and **Finish**.
  4. Back on Today, the check is added and the dot advances.
- There is no mascot acting and no confetti. The sun character exists only as art.

### 1.4 Calm

- **Streak as history** ([Adding a session](https://mobbin.com/flows/adcd11ae-e731-40e9-95c1-d016a02cf35e), [Share streak](https://mobbin.com/flows/95fcff7e-98a3-4c62-8550-7509b4d779df)). The streak lives in Profile > Dashboard as calendar days joined by a soft band, with "My Streak History: 3 Days 2025 Dec 17–19".
- Users can **add a session done outside the app** ("Here you can manually add a meditation session that you completed outside of the Calm app"), so practice counts wherever it happened.
- The share card is a line-art rosette "3 Day Streak" with Total Sessions, Mindful Minutes and Longest Streak, on a deep blue gradient with no mascot.

### 1.5 Fabulous

- **Completing a routine** ([flow ad4a6656](https://mobbin.com/flows/ad4a6656-2277-421c-9dd0-16c2bb3d7b78)): five habit rows go from a hollow circle to a green check in place. The player uses painterly full-bleed art, a timer and a large purple check button. No separate ceremony screen was captured.
- **Adding a habit** ([flow 5e2e311a](https://mobbin.com/flows/5e2e311a-724f-495d-909a-e101bd17cc3f)): a pacing guardrail, "**Start Small** … Too much change, too fast, can be overwhelming." The app actively slows the user down.

### 1.6 Ahead (closest CBT-adjacent path)

- **Journey map** ([screen 1ae37391](https://mobbin.com/screens/1ae37391-2ea3-4ad8-89dc-e146f731fce7)).
  - A misty teal illustrated landscape fills the screen behind the path: forest, lake and a rowing boat.
  - Numbered round nodes (1…5) sit on a winding path. Done node 1 is dark teal with a label pill, "Catch insecurity before it leads to regrets". The current node 2 is violet with a white halo ring. Locked nodes are pale circles.
  - A **red gift box** node sits between nodes 4 and 5, and a chapter label sits inside the scenery: "Stop caring what people think".
  - The course header reads "Calm Insecurity 5%" over a thin bar.
  - The ghost mascot has a dismissible bubble: "Great job! The secret to success? Keep taking steps!"
- **Completing a technique** ([flow 3ca31591](https://mobbin.com/flows/3ca31591-c1f7-4f1a-9636-891a72785a8c)): a 6-step card stepper ("1 out of 6", magenta gradient, a reply chip). On completion the mascot becomes a **gold trophy** with a crown and sunglasses on a plinth, with "You've made progress!" and no stats. Then "How did you like this?" with three emoji.
- **Setup** ([flow cdccf26c](https://mobbin.com/flows/cdccf26c-165b-4769-bc67-80f934fcbe4c)): the mascot holds a torch, "You'll be 4x more likely to complete the course with a clear goal!". Time choices are ranked "Small steps / Strong start / Clearly committed / Unstoppable".

### 1.7 BitePal (illustration and character benchmark)

- **Home** ([e04f2471](https://mobbin.com/screens/e04f2471-89eb-4d97-bc7e-1f3b53169c52)): a large raccoon pet, about 60% of the screen width, with a thick dark outline and flat fills, in an illustrated orchard. It has four health hearts, a streak flame of 2 and a calorie ring.
- **Logging as care** ([eb74890f](https://mobbin.com/screens/eb74890f-44ab-41bd-8933-7beebe1036c3)): "Feed Alex / What did you eat last?" in a heavy condensed display face, inside a card whose speech tail points at the plus button. "I'll do it later" is the escape.
- **Review ask** ([f83ea821](https://mobbin.com/screens/f83ea821-75dc-4132-a702-55c1e3238875)): the pet in a chef hat, squinting happily, over "Rate your food logging experience?" with five stars.

### 1.8 Speak, Brilliant, Elevate (learning peers)

- **Speak.**
  - "Lesson Complete!" in a white bubble over a happy robot, with pastel letters drifting around it as *themed, low-saturation confetti* ([49d467f5](https://mobbin.com/screens/49d467f5-28f5-48fb-ac77-ec42caedd0e2)).
  - "Review Completed … Overall Mastery Level 100% mastered +4 XP" ([6a3b6d11](https://mobbin.com/screens/6a3b6d11-6522-4a57-9e65-00fcaf04f1f4)).
  - An in-lesson card **explains why**: "You'll see this again in 365 days to maximize long-term memory!", with a "Continuing in 8…" countdown ([cdfcd4b7](https://mobbin.com/screens/cdfcd4b7-8a0f-4bdc-ac02-a0786fff8c73)).
  - "1 day streak! Amazing start! Think you can do it again tomorrow?" ([7acbb2fc](https://mobbin.com/screens/7acbb2fc-3817-408f-9db3-25380bb43706)).
- **Brilliant.**
  - The path is "LEVEL 1 Taking the First Steps": isometric violet pedestal nodes stacked straight down, each labelled ("While Loop Challenge"), with a scalloped grey **Level Review** pedestal as the unit-end milestone and a "Jump here" sheet ([fd4efbd9](https://mobbin.com/screens/fd4efbd9-32d7-4abb-b129-dd5d335245ad)).
  - In a lesson, the streak arrives as a toast dropping from the top ("Nice work today! Keep it up."), not as a separate screen. The correct-answer footer carries a "Why?" button ([92ab8d9b](https://mobbin.com/screens/92ab8d9b-3897-4fd5-a786-eaa0164b977a)).
- **Elevate.**
  - The workout is a straight vertical line of **hexagon** nodes. Unrevealed ones are grey hexagons with "?". The current one is a filled pink hexagon with an icon and the label "Processing / Reading". The next is a teal hexagon with an outline ring. The line turns blue below completed nodes ([flow 2bace6c3](https://mobbin.com/flows/2bace6c3-4cce-4940-9fc6-06bfc8c471c1)).
  - The result screen shows "Current 72 → Next Up 74 (+2)", "75% of answers correct" as dots, and "Workouts will adjust based on your feedback." Performance shows percentile **Rankings** ([flow 29e7f3f0](https://mobbin.com/flows/29e7f3f0-12ea-4eb7-90c3-fb8427475b91)).

### 1.9 Yuka, Rise and others

- **Yuka.** No ceremony. A carrot mascot pushing a cart appears only in the empty state, "NO PRODUCTS" ([fb4d406f](https://mobbin.com/screens/fb4d406f-e05a-40de-a819-02825530c2cb)). The score is a coloured dot with "18/100 Bad" ([eee5a97d](https://mobbin.com/screens/eee5a97d-2edb-440a-b8d7-85b477b27da1)).
- **Rise.** No ceremony found. Progress is an energy curve, and the reward is understanding: "The Science Behind It" before "GET STARTED" ([flow 7aafd5ca](https://mobbin.com/flows/7aafd5ca-582e-4ad7-a75b-2d28cb0fe523)).
- **Sweatcoin** "Boost completed": **concentric soft lavender rings** radiate behind a white circle with a check ([6555c020](https://mobbin.com/screens/6555c020-1d7d-4d27-bc2b-e05e9a0cf4f0)), a calm radial halo that works without confetti.
- **Nike Training Club.** A thin white circle check, "Great Job!" over a photo ([5c8b5f72](https://mobbin.com/screens/5c8b5f72-316d-45ae-b055-ca83fc0c88e4)). The milestones grid counts **total workouts** (1, 3, 5 … 75), not consecutive days ([157f0153](https://mobbin.com/screens/157f0153-940c-4092-9a89-4eafb71206f9)).
- **Cal AI** escalating streak badges, "Rookie, Getting Serious, Locked In, … No Days Off, Immortal" ([40849b04](https://mobbin.com/screens/40849b04-f210-49aa-8144-e830e38a2710)). **WHOOP** "3 more until your next milestone" ([ff4d5412](https://mobbin.com/screens/ff4d5412-608d-4566-81b8-c22f90ab0a28)).

---

## 2. Node anatomy (Duolingo, observed)

| Node type | Locked | Available / current | In progress | Completed | Perfected / legendary |
|---|---|---|---|---|---|
| Lesson (star) | grey puck `≈#E5E5E5` top, darker grey rim, grey star (F1) | unit-colour puck, white star, grey ring track about 110 pt, START/CONTINUE pill above (F1) | ring arc fills per lesson (≈1/6 after one, F1); dashed segments per lesson (F3) | unit-colour puck, white star or check, no ring (F5, F6) | gold puck, dark-gold star or check (F6) |
| Practice (dumbbell) | grey puck, grey dumbbell (F1, F5) | as lesson | as lesson | unit colour | gold |
| Story / radio / video / speaking | grey puck with book, headphones, video, mic (F3, edb09afd) | unit colour | n/a | unit colour, popover "REVIEW +15 XP" | — |
| Chest | grey 3D chest, no puck (F1, F5) | — | — | open chest on a light grey tile; gold when claimed (F6, fac0e197) | — |
| Unit end (trophy / review) | grey goblet (F1) | — | — | green goblet with laurels and the number "1"; scalloped rosette "10" (F6, f482c76d) | — |
| Unit header | banner in the unit colour, eyebrow plus title, guidebook button (all paths) | | | | |
| Character vignette | greyed while locked (F1, F5) | | | full colour with a 1–3 star rating (F6) | |

Construction: flat fills, no outlines on nodes, depth from a same-hue darker rim (puck total 69 × 52 pt, measured); glyphs are white solid shapes about 40% of the node width; chests and characters use thicker, more illustrated drawing with a grey floor ellipse.

---

## 3. Completion-sequence timelines

Screens and their order are observed. **All ms values are inferred** from common practice and the rossark durations, because Mobbin has no motion. Treat them as a model to beat, not measurements.

### 3.1 Duolingo (F2/F3 order)

| Beat | Screen (observed) | What moves *(inferred)* | ms *(inferred)* |
|---|---|---|---|
| 1 | Feedback sheet "Awesome!" | sheet rises, cloud edge, check | 0–300 |
| 2 | Celebration hero | Duo and a partner jump or high-five (squash, lift, land), sparkle burst | 300–1800 |
| 3 | Title + subline | drop or fade-in | 900–1300 |
| 4 | 3 stat cards | stagger about 120 ms, numbers count up | 1300–2400 |
| 5 | CLAIM XP | button arrives, waits for tap | 2400 → tap |
| 6 | Streak screen | flame ignites, number ticks +1, week checks fill left to right | +0–1500 |
| 7 | Streak goal / friend streak / quests | each a new full screen | +1500 per screen |
| 8 | Chest / gems | chest bursts open, gems arc out | +0–1200 |
| 9 | Path | ring arc grows, or the node goes solid and the indicator moves | +0–800 |

After the last answer, F2 and F3 show up to 7 distinct screen types (celebration, streak, streak goal, friend streak, friends quest, gem chest, path), each needing a tap. The total of 8–20 s is *(inferred)* from that count. Haptics and sound are not verifiable from Mobbin.

### 3.2 Headspace (best calm alternative)

| Beat | Screen (observed) | Motion *(inferred)* | ms *(inferred)* |
|---|---|---|---|
| 1 | Player ends | audio fades | 0–500 |
| 2 | "How'd it go?" (4 options, including Difficult and Not sure) | illustration header, options fade in | 0–300 |
| 3 | "Minutes Meditated 13" + quote | number appears (no count-up visible), quote fades | 0–400 |
| 4 | Finish | — | tap |
| 5 | Today list | check fills, orange dot slides to the next card | 0–500 |

The total is about 2–3 s of motion across 2 screens, and the user can say it went badly.

### 3.3 Finch (best warm alternative)

| Beat | Screen (observed) | Motion *(inferred)* | ms *(inferred)* |
|---|---|---|---|
| 1 | Claim tapped on the milestone card | press | 0–150 |
| 2 | Pet scene + bubble about its day | pet idle, bubble fades in | 0–400 |
| 3 | Star on radial rays | star pops from about 0.9, rays rotate slowly, confetti one-shot | 300–1300 |
| 4 | Title + specific line ("2 days of Calm goals") | fade and rise | 600–1000 |
| 5 | "Awesome!" | — | tap |

The goal-completion variant fills the energy bar to MAX with a glowing orb (about 800–1200 ms *(inferred)*) before the copy.

---

## 4. Cross-app patterns

1. **The indicator travels.** Duolingo (ring moves to the next node), Headspace (orange dot moves down), Elevate (line colours below the done node) and Ahead (halo on the next number) all show progress by moving the "you are here" marker. This is the cheapest, most legible payoff, and it happens on the path, not on a separate screen.
2. **Depth through a same-hue rim, no outlines** on nodes: Duolingo, plus Brilliant's isometric pedestals. Illustrated characters and props get more detail than nodes.
3. **One accent colour per unit,** with locked items in neutral grey: Duolingo, Elevate, Ahead.
4. **Specific copy beats generic praise when it names what was done:** Finch "2 days of Calm goals done this week", Duolingo "You learned 6 new words!", Speak "You reviewed and practiced 1 concept".
5. **A unit-end object that differs in shape** from lessons (Duolingo trophy and rosette, Brilliant scalloped "Level Review" pedestal, Elevate hexagons). Milestones need their own silhouette.
6. **A radial halo or rays behind the reward** (Finch star rays, Sweatcoin concentric rings, Duolingo gem arc). It centres attention without a full-screen burst.
7. **A floor shadow ellipse** under characters and chests (Duolingo, BitePal, Finch).

## 5. Gentle variants worth copying over Duolingo

| Copy this | From | Instead of Duolingo's | Why for a CBT app |
|---|---|---|---|
| Reflect first, with a "Difficult" option that is not penalised | Headspace "How'd it go?" | score cards (GOOD 88%) | a hard session is still a done session; grading feelings is the clinical harm |
| The reward is location: the indicator moves on the path | Headspace, Ahead | XP and gem counters | progress through skills, not a currency |
| Specific line naming the skill practised | Finch, Speak | "Go ahead, brag!" | competence feedback without social comparison |
| Radial halo, one-shot | Sweatcoin, Finch | confetti plus speed ribbons | calm attention, low arousal |
| Count practice, not consecutive days; history over countdown | Calm, Nike Training Club | streak loss and the Streak Society | no loss aversion |
| Proactive forgiveness | Finch Streak Repair | freeze bought with gems | if any continuity is shown, missing a day is pre-forgiven |
| Pace the user down | Fabulous "Start Small" | "Do 9 more lessons" | overdoing CBT homework is a known drop-off path |
| Character cares about its own small day | Finch "Today felt like a soft cloud!" | Duo hyping the user | warmth without evaluation |

## 6. Anti-patterns (what makes rewards cheap, manipulative or exhausting)

| Anti-pattern | Seen at | Harm |
|---|---|---|
| Loot-box chest with rarity tiers and tap chances | Duolingo EPIC chest "1 chance left!" (F4), RARE suit, Suit Quest | variable-ratio reward; gambling mechanics |
| Monetisation inside the ceremony | Duolingo Super trial interstitial (F4) | turns a moment of pride into a sales funnel |
| Commitment and challenge asks right after effort | "I'M COMMITTED", "I CAN DO IT" (Duolingo); "Think you can do it again tomorrow?" (Speak) | obligation; failure tomorrow becomes a broken promise |
| Mascot distress for absence or exit | Duolingo "1 week abandoned", teary Delete Account | guilt, confirmshaming, caretaking of the character |
| Escalating streak badges and status clubs | Cal AI "No Days Off, Immortal"; Duolingo Streak Society | loss aversion; rest becomes failure |
| Social pressure inserts | Duolingo Friends Quest deadline, NUDGE; Elevate Rankings | comparison; shame |
| Persuasion statistics in the character's mouth | Ahead "4x more likely" | manipulative, unverifiable |
| Grading the person, not the task | Ahead "Unstoppable" tier, Duolingo GOOD 88% | identity scoring |
| Review ask in the reward moment | BitePal "Rate your food logging experience?" | exploits the positive affect peak |
| Ceremony sprawl: up to 7 tap-through screen types after one lesson | Duolingo F2, F3 | exhausting; trains users to tap blindly |
| Confetti on routine actions | Finch goal completion ("Woohoo!" first frame) and the egg screen ([flow 2d8a4c8a](https://mobbin.com/flows/2d8a4c8a-20d1-4239-b528-c4fbd26742a7)); Bevel ([ffce8bfe](https://mobbin.com/screens/ffce8bfe-c19b-4978-a37f-a858f29bcffa)) | devalues the rare moment; arousal on a calm app |

## 7. Gaps and limits

- No motion, haptic or sound was observable. Every ms value above is inferred. Duolingo's haptics and sound are not verified.
- Peak and Impulse are not on Mobbin. Rise and Yuka have no reward ceremony.
- The `appllama` skill was not available.
- Only the Duolingo path was pixel-measured; other sizes are estimates.
