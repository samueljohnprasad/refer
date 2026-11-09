---
title: What makes consumer apps feel premium — and why Happy feels flat
type: research (competitive, visual craft)
status: draft
date: 2026-11-01
sources: Mobbin MCP (iOS screens), project motion skill `.agents/skills/rossark-motion-skill`
scope: Happy Home (`.agents/home.html`), Exercises (`.agents/exercises.html`), CBT exercises (thought-catcher, thought-reframing, abc-analysis, behavioral-activation, fear-ladder)
---

# What makes consumer apps feel premium — and why Happy feels flat

**Method.** I pulled iOS screens from Mobbin for each app: home, activity list, an in-progress exercise and a completion moment where one existed. I read every value off the screenshots themselves. Mobbin renders a 393 pt iPhone at about 299 px wide, so I multiplied measured pixels by about 1.31 to get points.

**Every number marked `~` is an estimate read off a screenshot.** None of them comes from source code.

**Not on Mobbin.**
- **Rootd and Bearable:** searches returned other apps (QUITTR, Wysa, TIDE, Visible, Clue, Stardust). I note those where useful but did not score them as Rootd or Bearable.
- **Calm:** a plain query found nothing, but a deeper search did.
- **Wildcard:** Airbnb only returned onboarding and a listing tour, not its home screen.

## 1. Summary

1. **Premium comes from one big, alive illustration plus very quiet everything else.** BitePal, Finch and Duolingo give the character 30–45% of the first screen and keep the UI around it plain: white cards, one accent and system-like text.
2. **The character reacts to state.** BitePal's raccoon says "You're the master of the noms!" after a meal is logged. Finch's bird changes scene by time of day and activity. Duolingo's owl changes pose on every completion screen. **Happi currently changes weather, not acting.** That gap is the biggest one between Happy and these apps.
3. **The completion moment is the payoff and gets a full screen.** Each app shows a big illustration, then a headline in the accent colour, one line of copy, two or three stat tiles and one wide button. Happy ends its exercises on a card inside the chat.
4. **Type uses three levels, not five.** One heavy rounded display face for headlines (~22–28 pt, 700–800), body at ~15–17 pt (400–500), and captions at ~12–13 pt in mid-grey. The display face carries the brand; body stays neutral.
5. **Breathing room is set by gaps between sections, not padding.** Sections sit ~28–36 pt apart. Cards inside a section sit ~8–12 pt apart, with ~16–20 pt of padding inside. Screen margins are ~16–20 pt everywhere.
6. **Colour is a white or very light base with saturated, illustrated cards.** Ahead and Headspace put full-bleed gradient or illustrated cards on white. The colour lives in the content, not in the chrome around it.
7. **Depth is buttons that look pressable, not shadows.** Duolingo and Finch use solid buttons with a darker bottom rim and cards with a 2–4 pt rim. That is tactile without blur. Happy already owns this rim, but uses it only on buttons.
8. **Mental-health apps reward gently.** Finch says "A Shiny Star for You!" and "planting the seeds of a habit". Ahead says "You've made progress!" and asks for a rating. None of them threatens a lost streak, whereas Duolingo's streak pressure is the pattern to avoid.
9. **Exercise lists are illustrated tiles, not text rows.** Ahead uses gradient tiles with a count badge, How We Feel uses big rounded colour tiles, Finch puts a sticker icon in each card, and Headspace adds a spot illustration on the right of each card. Happy's list is text-led.
10. **The in-progress exercise is focused.** Ahead's reality check sits on one coloured surface with a segmented progress bar, a large statement and one optional note field. Duolingo shows one question, a character with a speech bubble, and the answer choices at the bottom.

## 2. Per-app teardowns

### Duolingo (learning, the craft benchmark)

- **Home:** [path](https://mobbin.com/screens/a13f2a69-17ab-48d1-b6bd-9b64b5cd426e), [path with unit popover](https://mobbin.com/screens/fd077091-e8e9-413f-9aff-bb68984e5b04), [review popover](https://mobbin.com/screens/fac0e197-2364-48f1-bc26-be8ddf392179)
  - A top status row (flag, streak, gems, energy) ~16 pt high.
  - A unit banner as a full-width green card ~60 pt tall. It has a small caption-style label (`SECTION 1, UNIT 1`, ~12 pt, 700, letter-spaced) and a title at ~17 pt / 700.
  - The path is round 3D nodes (~56 pt) with a darker bottom rim ~5 pt. Duo idles beside the path (~70 pt tall).
  - The popover is a solid green card with a white button.
- **List:** [illustrated unit tiles](https://mobbin.com/screens/f8f38286-b1c6-476d-bb7d-07451d397d64)
  - A 2-column grid of square tiles (~140 pt) with full-bleed character art, a ~3 pt dark outline and a 12 pt corner radius. The label sits under each tile at ~15 pt / 700.
- **In progress:** [select translation](https://mobbin.com/screens/faf99c88-e9a5-44ef-8e7d-3335018c4781), [fill in](https://mobbin.com/screens/fa963b87-61a6-40be-8192-3060fe947088)
  - Close button and progress bar at the top (bar ~16 pt tall with a highlight stripe).
  - The prompt is ~20 pt / 700.
  - A character with a speech bubble fills the top half.
  - Answers are full-width outlined rows (~44 pt). The selected answer has a blue tint fill and a blue rim.
  - A sticky CHECK button ~50 pt high, greyed out until something is picked.
- **Completion:** [Go ahead, brag](https://mobbin.com/screens/fe966528-929c-475b-b917-9b342e3868a5), [Whoa whoa whoa](https://mobbin.com/screens/e40fbb2d-6f69-4bb6-b27f-8cc5968c95c0), [Pearl League](https://mobbin.com/screens/e615e66f-1abe-4fcc-b279-ec97188f61cb), [quest](https://mobbin.com/screens/75eb49d6-36de-47cd-85e2-d4a821a546d0)
  - Duo is about 45% of the screen height, in a new pose each time, with a few sparkles.
  - The headline (~24 pt / 800) is in the accent colour (yellow).
  - One line of witty grey body (~17 pt).
  - Three stat tiles (~92 × 70 pt), each a coloured header strip plus a number.
  - One full-width button.
- **What to steal:**
  - Pose variety on completion screens.
  - Stat tiles.
  - One wide button at the bottom.
  - The darker rim on buttons and tiles.
- **What to avoid in a mental-health app:**
  - Streak and league pressure.
  - "How much caffeine have you had?" style jokes when the user may be distressed.

### BitePal (calorie tracker with a pet)

- **Home:** [raccoon in a scene](https://mobbin.com/screens/17e84593-48e4-4a97-9efe-39f3edc4ced1), [quick-add menu](https://mobbin.com/screens/ca8ee4f2-2546-4c00-9696-3e4228ed0265)
  - The top ~45% of the screen is a full-bleed illustrated garden with the raccoon at ~180 pt, plus a name and hearts.
  - A white sheet rises over the scene with a ~24 pt corner radius.
  - The hero number is very large (`2,537`, ~30 pt / 800). Its label is grey, ~13 pt.
  - Three macro bars are thin (~4 pt) and colour-coded.
  - A dark circular plus button. The bottom navigation floats as a pill.
- **Completion:** [meal logged: "You're the master of the noms!"](https://mobbin.com/screens/c3bbc587-3c65-4942-a658-b049e17b0f8e), [widget with confetti](https://mobbin.com/screens/487c5915-a34d-4bcf-aa0c-d07a42e93033)
  - The mascot speaks in a big white speech bubble with an ~18 pt / 800 heavy headline, floating hearts, and a small mascot in the corner.
  - The data card sits underneath.
  - A dark floating Done pill.
- **Onboarding:** [summary](https://mobbin.com/screens/ebcb96f6-6a5e-47c6-a884-0c1eaa33ee72), [welcome](https://mobbin.com/screens/7f0f1cef-f5a1-40ba-8a33-9ae85b35716e)
  - The welcome headline is a condensed heavy display face at ~56 pt, with floating 3D objects and a handwritten note ("With Cute raccoon").
- **What to steal:**
  - The scene-header Home: character in their world, data sheet below.
  - The mascot speech bubble as the reward voice.
  - Heavy numbers paired with quiet grey labels.
  - Black and white controls that let the illustration be the only colour.

### Ahead (emotional skills, closest competitor)

- **Home and techniques:** [technique of the day](https://mobbin.com/screens/1530d2d5-ebce-408c-b97e-1c78f5cde6d1), [favourites and categories](https://mobbin.com/screens/d9882278-4c07-4e0b-9f6f-4e3992730edb)
  - Section headers at ~19 pt / 600 with ~28 pt above them.
  - The featured card is a full-width magenta gradient (~110 pt tall, 20 pt corner radius) with concentric circles fading out to one side.
  - Category tiles are 2 columns, ~150 × 140 pt each, in their own gradient (pink, magenta, teal, blue). Each has a white title at ~16 pt / 700, a two-line grey-white description at ~13 pt, and a count badge.
- **Journey:** [level path](https://mobbin.com/screens/05e66e2f-b29a-4102-9532-2f93e7764746)
  - Topic chips are illustrated squircles (~76 pt) holding the mascot in different moods.
  - Levels are stacked, centred, each with an illustrated scene card.
- **Learnings:** [signs list and calendar](https://mobbin.com/screens/b9227303-6f15-4e41-9447-6008d98cb635)
  - A white card with a numbered list and grey meta text ("Noticed 2 times") at ~11 pt.
- **In progress:** [reality check step 2/6](https://mobbin.com/screens/456eee1e-9fd3-455b-85d0-c2da105acf68), [mantra pick](https://mobbin.com/screens/a450b3d2-d50b-4357-9081-9a433d999b5c), [fill-in recap](https://mobbin.com/screens/5967dc8e-fc20-4b10-910f-df0f675c804d)
  - The whole exercise sits inside one gradient card with a ~20 pt corner radius and ~8 pt inset from the screen.
  - A segmented progress bar of 6 thin dashes.
  - The statement is ~22 pt / 500, white, with generous line height (~1.35).
  - An optional note pill.
  - The CTA sits outside the card as a ~52 pt violet button.
  - Answer chips are translucent white pills.
- **Completion:** [You've made progress](https://mobbin.com/screens/b4422601-93a8-4900-b1bb-c0daffe81236), [Great job](https://mobbin.com/screens/c7ad0380-d59e-4d01-a89b-5fe60cb6c276), [XP earned](https://mobbin.com/screens/5a137b76-6e67-41be-a701-57ca0feea5a3)
  - A trophy-shaped mascot in sunglasses (~150 pt) on white.
  - A ~20 pt / 600 headline and a one-line recap ("Next time emotions rise…").
  - A three-option rating row at the bottom.
  - The XP screen is weaker: a plain card with a lot of empty white.
- **What to steal:**
  - The coloured "exercise surface" card.
  - Segmented progress.
  - A recap of what you learned on completion.
  - Gradient category tiles with the mascot inside.
- **What to avoid:**
  - Gradient everywhere at the same saturation, which competes with the art.
  - XP for emotional work.

### Finch (self-care pet, mental-health benchmark)

- **Home:** [bird adventuring outdoors](https://mobbin.com/screens/7c5b20e8-19e5-42c2-a800-65f3bef5b958), [bird at home](https://mobbin.com/screens/6e24c2f2-42f4-42da-9450-5c021b7d3678), [home with progress](https://mobbin.com/screens/e7f40efd-01a8-4f03-828e-31db0c35dbc2)
  - The top ~45% is an illustrated room or landscape that changes with state: adventuring outdoors, at home, or at night.
  - The bird (~70 pt) is centred, with a "Chat with her!" button under it.
  - The progress card is translucent (~58 pt) with an energy bar.
  - Goals are white cards (~60 pt tall, 16 pt corner radius, ~8 pt apart). Each has a sticker icon in a grey circle (~36 pt), a title at ~15 pt / 700, an energy count and a check button with a rim.
- **List:** [Breathe](https://mobbin.com/screens/8acd5f1f-b876-4975-9574-16a094271198), [Reflections](https://mobbin.com/screens/1a65c78f-c573-4d5c-933f-32756f0f2bf9), [day log](https://mobbin.com/screens/bd1cd15e-dffe-49dd-9680-5afac57f806a)
  - A coloured full-bleed header with an illustrated sticker and a ~20 pt / 800 white title.
  - Tab pills.
  - White cards (~66 pt tall) with a sticker icon, title ~15 pt / 700, one grey prompt line and a reward count.
- **In progress:** [reflection editor](https://mobbin.com/screens/191c3258-0fbc-4ab1-9994-20aab2bd95b6)
  - A plain white editor with a tiny caption (`GET OUT OF BED`), a ~20 pt / 800 title and a green Done button with a rim. This is deliberately low-craft so it feels private.
- **Completion:** [A Shiny Star for You](https://mobbin.com/screens/c246a0cd-fc4a-4ebc-af35-c7f033c3fce9), [Woohoo, energized](https://mobbin.com/screens/3d7ef155-c49e-45b6-b918-2f73c95f6162), [milestone gift](https://mobbin.com/screens/4a1b241d-57c0-4c84-94a5-1ea2958f5644)
  - The bird speaks in first person ("Today felt like a soft cloud!") inside a speech bubble.
  - A smiling star sticker, confetti, and a ~20 pt / 800 headline.
  - The copy names the habit gently: "planting the seeds of a habit".
- **What to steal:**
  - The scene changes with state.
  - The character speaks in first person.
  - A sticker icon per exercise.
  - Completion that is warm, not competitive.
  - A plain, private writing surface.

### Headspace

- **Today:** [timeline](https://mobbin.com/screens/efc82d96-660f-4e91-bff9-1f3d083c34eb)
  - A dashed vertical rail with circle markers.
  - Cream cards (~110 pt, 16 pt corner radius) with a title at ~17 pt / 700, a type label with an icon at ~13 pt, the duration, and an illustration filling the card's right ~40%.
  - Section headers ("At night") at ~22 pt / 700.
- **Explore:** [categories](https://mobbin.com/screens/9fb74046-d5b5-4af9-9204-78cacdd67661), [course cards](https://mobbin.com/screens/a2a14b62-94c2-4db3-9dbf-5aa5b39c39b9)
  - Warm off-white background (#F9F4F0-ish).
  - Category tiles in 2 columns (~56 pt) with a coloured glyph.
  - Course cards with a title at ~15 pt / 700, two lines of grey description, and a flat spot illustration cropped off the card's right edge.
- **Completion:** [minutes meditated](https://mobbin.com/screens/2bc7441f-4430-477a-860e-b8b45d05349f), [run streak](https://mobbin.com/screens/b5f5652b-3033-4f25-8d19-8c93583dd184)
  - The top half is layered yellow wave shapes with a big number (~36 pt / 700).
  - A quote below in ~17 pt with large decorative quotation marks.
  - A heart button, a share button and a blue Finish button.
- **What to steal:**
  - Illustration cropped into the card edge, so it is not a separate block.
  - A warm off-white background instead of #fff.
  - A quote as the closing reflection.

### How We Feel

- **Check in:** [ring](https://mobbin.com/screens/c84e26a7-4671-4c65-acd9-5e2feb764591), [emotion grid](https://mobbin.com/screens/68af21bd-2c76-4889-99c6-df09ac7b83ab), [first-time insight](https://mobbin.com/screens/b0ca2a04-77ba-4eb0-b6fa-609dac70074c)
  - A black background with a serif display headline (~26 pt).
  - One gradient arc around a single plus button.
  - Two quiet stat pills ("20 unique feelings", "10 day streak").
  - The insight screen sets italic serif text with the emotion word in its colour ("checked in feeling *proud*").
- **Tools:** [colour tiles](https://mobbin.com/screens/c80f1fee-98c6-4e8e-984a-b093e97f8398), [list](https://mobbin.com/screens/ec80bf25-4478-47ff-9fc2-1558f7cadbd1)
  - Very large squircles (~170 pt, corner radius ~36 pt) in muted colour, with a serif title at ~22 pt and a small count.
  - The list view has a square textured thumbnail (~60 pt, dot-matrix art) beside a title at ~15 pt / 600 and two grey lines.
- **What to steal:**
  - A brand display face used only for headlines and emotional words.
  - Generative abstract art standing in for illustration on lists.
  - Streaks reported as plain facts, not threats.

### stoic.

- **Journey:** [light](https://mobbin.com/screens/75ba9805-24ea-4842-84a9-20afa1bcef5e), [weekly highlight](https://mobbin.com/screens/c00fcab1-8056-49b2-8693-a57a91b3de74), [dark insights](https://mobbin.com/screens/c3fdc4d7-a9bc-43bc-aaed-3ac971ea3dfd)
  - A grey (#F2F2F2) background with white cards (~14 pt corner radius).
  - A big black Insights card (~120 pt) with line-art.
  - Section headers like "Today, 19 Jul", where the date runs on in grey after the bold word.
  - Entry cards have a small icon, a letter-spaced caption (`JOURNAL`, ~11 pt), the title at ~15 pt / 700 and the user's own words in ~15 pt grey.
  - The weekly view uses a full-bleed photo hero.
- **What to steal:**
  - Showing the user's own words as the content.
  - The bold word plus grey date as a header.
  - Monochrome restraint.
- **Caution:** letter-spaced capital captions are what Happy just removed. They work in stoic. because the type is otherwise austere.

### Calm

- **Home:** [Daily Calm](https://mobbin.com/screens/6c340b3f-2d75-4bb9-aeba-0583bed57f5d), [popular and dailies](https://mobbin.com/screens/e26bfbb5-3a25-4510-9992-d3bf5be279bb)
  - A full-screen landscape photo behind everything, plus a frosted floating tab bar.
  - Media cards (~240 × 150 pt, 16 pt corner radius) with a duration chip, and a narrator avatar plus two text lines below.
- **What to steal:** atmosphere as the background. **Not for Happy:** Calm's luxury comes from photography and Happy's comes from Happi. Don't mix the two.

### Wysa (CBT chat; closest to Happy's chat exercises)

- **Screens:** [Thoughtpad chat](https://mobbin.com/screens/b3cfdcda-74dc-42e8-8773-76da5fc8314e), [exercise card](https://mobbin.com/screens/bcf5b848-663c-49f7-b9b0-dd6e699d2496), [Feel more control](https://mobbin.com/screens/788e1c3c-cce5-45b6-bde4-45263a86443f)
  - A blue-to-teal gradient behind white bubbles (~16 pt corner radius) and teal user bubbles.
  - Reply chips are teal pills centred in the thread.
  - The exercise card is a photo with a serif title, then grey body text in a white box.
- **This is the counter-example:** the thread reads as a generic chatbot. Bubbles carry no character, the type is system-default, and the photo cards are stock. **Happy's chat exercises currently sit nearer Wysa than Finch, and that is the "plain" the user feels.**

### TIDE, Visible, Clue, Stardust (returned in place of Rootd and Bearable)

- **[TIDE home](https://mobbin.com/screens/c2a8edd8-9afc-4550-9337-afaaf64d984e):** an atmospheric gradient landscape, "Good day" at ~28 pt / 700, and frosted tiles.
- **[Visible](https://mobbin.com/screens/33733594-cf11-453a-9186-835e3987819d):** navy cards each with an icon in a tinted square. This is the slop pattern.
- **[Clue](https://mobbin.com/screens/932c9fc6-6655-4c85-8826-03aa8436f32e):** coloured outlined symptom tiles with custom pictograms.
- **[Stardust](https://mobbin.com/screens/c9c420da-d756-43bb-bcc5-3ec817461d63):** 3D rendered icons inside circles.

All four show a custom icon set lifting a tracker above generic. Visible shows what a generic one looks like.

### Airbnb (wildcard)

- [Property type](https://mobbin.com/screens/fcf88e90-fe40-4e5e-bf0d-93a668aa291f): a 2-column choice grid with a 1 pt grey border and a 12 pt corner radius. The selected tile gets a 2 pt black border and a pale fill. Line icons at ~28 pt, title ~26 pt / 600, and a black Next button.
- [Photo tour](https://mobbin.com/screens/fbf3a86a-e0f9-4c49-88ec-d4b99d527720): section titles at ~22 pt / 600 with ~40 pt above them, and large images.
- **Takeaway:** the restraint benchmark. One weight jump, generous gaps, and the selected state shown only by a thicker border plus a tint.

## 3. Measured tables (all approximate, in pt)

### Spacing

| App | Screen margin | Gap between sections | Gap between cards | Card padding | Card corner radius | Hero share of first screen |
|---|---|---|---|---|---|---|
| Duolingo | ~16 | ~32 | ~10 | ~16 | 12–16 | ~45% (completion) |
| BitePal | ~16 | ~24 | ~12 | ~18 | 24 (sheet) | ~45% (Home) |
| Ahead | ~20 | ~32 | ~12 | ~18 | 20 | ~20% featured card |
| Finch | ~16 | ~20 | ~8 | ~14 | 16 | ~45% (scene) |
| Headspace | ~20 | ~36 | ~16 | ~18 | 16 | card art ~40% of each card |
| How We Feel | ~12 | ~16 | ~12 | ~20 | ~36 | tiles fill the screen |
| stoic. | ~16 | ~24 | ~10 | ~16 | 14 | ~18% insights card |
| Airbnb | ~24 | ~40 | ~10 | ~16 | 12 | n/a |
| **Happy today** (tokens) | 16 (`--sp-4`) | 24–32 | 8–12 | 12–16 | 12 / 16 | Happi weather only, no scene |

### Type

| App | Display headline | Section header | Body | Caption | Font character |
|---|---|---|---|---|---|
| Duolingo | 24 / 800 in accent colour | 17 / 700 | 17 / 400 grey | 12 / 700 letter-spaced | rounded, custom (Feather/Din-like) |
| BitePal | 30 / 800 numbers, 56 condensed welcome | 15 / 700 | 15 / 500 | 13 / 500 grey | grotesk plus condensed display |
| Ahead | 22 / 500 (exercise statement) | 19 / 600 | 15 / 400 | 11–13 / 500 | geometric rounded |
| Finch | 20 / 800 | 15 / 700 | 15 / 500 | 11 / 700 letter-spaced | rounded (Rubik-like) |
| Headspace | 22 / 700 | 17 / 700 | 15 / 400 | 13 / 500 | warm geometric (custom) |
| How We Feel | 26 serif | 22 serif | 15 / 400 | 13 | serif display plus sans body |
| **Happy today** | `--t-title` 32 / 800 (h1) | 20 (`--t-lead`) | 16 / 400–500 | 13 / grey | Nunito everywhere |

**Text-colour pattern across the set:**
- Primary text is near-black, not pure #000 (#1F1F1F–#2B2B2B).
- Secondary is ~#6B6B6B.
- Tertiary is ~#9A9A9A.
- Accent-coloured text appears in about one place per screen: the completion headline (Duolingo) or a link (Ahead).

### Colour

| App | Base | How many accents | Where the colour lives |
|---|---|---|---|
| Duolingo | #FFF | 1 brand green plus status colours | buttons, path nodes, illustration |
| BitePal | #FFF plus a scene | the illustration only; controls black and white | scene, macro bars |
| Ahead | #FFF | a gradient per category | cards and tiles |
| Finch | light teal or green scene, white cards | 1 green button | scene and stickers |
| Headspace | warm off-white | orange brand plus per-card illustration colours | card art |
| How We Feel | #000 | the emotion colours | tiles and the arc |
| **Happy** | #FFF | sage `--accent` plus `--sun` | the Happi sky only |

## 4. Nielsen heuristic scorecard (1–5, judged from the screens above)

Abbreviations in this table:
- **Visibility** — visibility of system status
- **Real world** — match between system and the real world
- **Control** — user control and freedom
- **Consistency** — consistency and standards
- **Errors** — error prevention
- **Recognition** — recognition rather than recall
- **Efficiency** — flexibility and efficiency of use
- **Aesthetic** — aesthetic and minimalist design
- **Recovery** — help users recognise, diagnose and recover from errors
- **Help** — help and documentation

| Heuristic | Duolingo | BitePal | Ahead | Finch | Headspace | How We Feel | Wysa |
|---|---|---|---|---|---|---|---|
| Visibility | 5 · progress bar, XP, timer | 4 · macro bars, toast "Workout logged" | 4 · 6-dash progress, "2 out of 6" | 4 · energy bar, goals-left count | 3 · timeline markers | 3 · streak pill | 2 · no progress in chat |
| Real world | 4 · plain prompts | 4 · "Calories left" | 5 · "Give unfounded worries a reality check" | 5 · first-person bird voice | 4 | 4 · named emotions | 3 |
| Control | 4 · close button always there | 4 · back and edit on meal | 4 · back, save, mute | 4 · Cancel next to Done | 4 · Finish | 4 · close | 3 · "Not now" chips |
| Consistency | 5 · same rim and button system everywhere | 4 | 4 · same violet CTA | 5 · same rimmed checks and buttons | 5 | 4 | 3 |
| Errors | 4 · CHECK disabled until picked | 3 | 3 | 3 | 3 | 3 | 2 |
| Recognition | 5 · path icons show lesson type | 4 · food thumbnails | 4 · illustrated topic chips | 5 · sticker per goal | 4 · type label plus icon | 4 · colour = emotion family | 2 · text-only |
| Efficiency | 4 · "Jump here?" shortcut | 5 · quick-add sheet, camera | 3 | 4 · reorder, filters | 4 · search, categories | 4 · search, filters | 2 |
| Aesthetic | 5 | 5 | 4 · gradients compete a little | 4 · busy but warm | 5 | 5 | 2 |
| Recovery | 5 · "Try again!" plus correct answer | 3 | 4 · "Try again!" sheet | 3 | 3 | 3 | 2 |
| Help | 4 · lesson tips | 3 | 4 · in-lesson explanations | 4 · chat with the bird | 3 | 4 · "Learn more" article links | 4 · counsellor link |

**Happy today (from the prototype source; not rendered, so treat as an estimate):**

| Heuristic | Score | Reason |
|---|---|---|
| Visibility | 3 | No progress bar in the chat exercises. |
| Real world | 5 | Plain CBT copy. |
| Control | 4 | The skip link exists. |
| Consistency | 4 | Since happy-ui.css. |
| Errors | 4 | The send button is disabled when the field is empty. |
| Recognition | 2 | Exercise list is text-led, with no per-exercise art. |
| Efficiency | 3 | |
| Aesthetic | 3 | Clean but empty. |
| Recovery | 3 | |
| Help | 4 | The help sheet. |

## 5. Premium recipe for Happy

Concrete values. These extend the current `DESIGN.md` tokens rather than replacing them.

### Spacing

- Keep `--sp-*`.
- Add a rule: section gap = `--sp-6` (32). Card gap within a section = `--sp-3` (12). Card padding = 18 (new `--sp-card`).
- Screen margin 20 on Home and Exercises, 16 inside exercises.
- The first screen of Home gives Happi's scene **40–45% of the viewport height**, as BitePal and Finch do. Currently Happi sits in a weather strip.

### Type

Three levels plus one display.

| Level | Spec | Used for |
|---|---|---|
| Display | Nunito 800, 26–28 / 1.15 | One per screen only: Home greeting, completion headline |
| Header | 700, 19 / 1.25 | Section headers, sentence case |
| Body | 500, 16 / 1.45 | |
| Caption | 500, 13 / 1.35, `--label-3` | |
| Numbers | 800, 28–32 | Count and stat tiles only (BitePal pattern) |

- In-exercise statement: 500, 21 / 1.35. This is Ahead's large reading size, for the Happi line the user must think about.
- Accent-coloured text appears once per screen at most: the completion headline in `--accent`.

### Colour

- **Base:** #FFF for exercises. A warm off-white `#FAF8F3` for Home and Exercises, to separate chrome from white cards (Headspace).
- **Colour lives in illustration:**
  - Happi's scene.
  - A per-exercise tint for its tile. Each tile gets one soft wash from the exercise's own hue, for example:

    | Exercise | Hue |
    |---|---|
    | Thought Catcher | sage |
    | Reframing | sun |
    | ABC | sky |
    | Behavioral activation | coral |
    | Fear ladder | lilac |

  - Controls stay sage or black-and-white.
- Text: `--label` #142414 is fine. Secondary #4B4B4B is too dark next to the set; use ~#5E665C. Tertiary ~#8A9188.

### Mascot rules

1. **Home: Happi in a place, not just weather.** Give Happi a scene (a little hill or room, like Finch and BitePal) that changes with state:

   | State | Scene |
   |---|---|
   | Day 0 | Waving |
   | After a session | Content |
   | Evening | Lamp on |
   | Long gap | Simply happy to see you; never sad or guilt-tripping |

2. **Happi speaks in first person** in exactly one bubble on Home and on every completion ("I'm glad we caught that one together"). That follows Finch and BitePal.
3. **Every exercise has a Happi pose sticker** (~56 pt) on its tile, and the same sticker heads the exercise. For example: magnifier for Thought Catcher, flipping a card for Reframing, steps for Fear Ladder.
4. **Completion screen:** Happi takes ~40% of the height in a new pose, with a few sparkles. Below it:
   - the headline,
   - one recap line ("Next time this thought shows up, you have a fair answer ready"),
   - two stat tiles at most (`thoughts caught: 3`, `belief: 80 → 40`),
   - one wide button.

### Motion rules (from the motion skill)

- One main beat per screen. On completion Happi lands, settles in a ~600 ms calm curve, then idles: breathing and blinks.
- Sparkles fade in only (opacity is allowed for appear and disappear). Each gets its own phase from `seeded(i)`.
- Tiles press down 2 pt into the rim in under 120 ms. Nothing bounces; this is a calm brand.
- Reduced motion shows the final pose still.
- Nothing teleports. The Home scene crossfades between time-of-day states and Happi's pose interpolates.

### Engagement

- Lifetime count plus weekly ring (already decided).
- A **completion recap card** collects into a "Things I've caught" list (like stoic.'s entries), where the user's own words are the reward.
- No XP, no leagues, no lost-streak copy.

## 6. Gap analysis by Happy screen

| Screen | Why it feels flat today | Fix, and the pattern it comes from | Impact / effort |
|---|---|---|---|
| **Home** (`home.html`) | Happi is a weather strip. The rest is text and buttons on white, with no place, no character voice and no hero number. | A scene header covering ~45% of the screen, with Happi acting by state (BitePal, Finch). One first-person Happi bubble (Finch). The lifetime count as a big 800 number with a grey label (BitePal). The off-white base (Headspace). | High / Medium |
| **Exercises** (`exercises.html`) | A segmented control plus text-led rows. Every exercise looks the same, so recognition is weak. | Illustrated tiles: Happi pose sticker plus a per-exercise colour wash, 2 columns or a full-width featured "exercise of the day" (Ahead, How We Feel). Spot art cropped into the card edge (Headspace). | High / Medium (needs ~6 Happi poses) |
| **Thought Catcher / Reframing chat** | Reads like a Wysa-style generic chat. There is no progress indicator, and the Happi lines that carry the CBT insight are body-size. | Segmented progress at the top (Ahead). Key Happi statements at 21 / 500 reading size (Ahead). A small Happi avatar that changes expression per step instead of the static app icon (Duolingo character plus speech bubble). | High / Low–Medium |
| **ABC / Behavioral activation / Fear ladder** | Form-like choice rows. One look shared across five exercises. | Each exercise gets its own colour wash on the surface (an Ahead-style exercise card, toned down). The step header shows the exercise sticker. Selected rows are tint plus 2 pt rim (Duolingo, Airbnb). | Medium / Low |
| **Completion** (saved card in chat) | The payoff is a card in the scroll, with no full-screen moment. | A full-screen completion: Happi pose ~40%, display headline in the accent colour, recap line, two stat tiles, one button, then saved to "Things I've caught" (Duolingo, Ahead, Finch). | Highest / Medium |

## 7. Ranked recommendations

1. **Full-screen completion moment with an acting Happi.** Biggest emotional payoff, reused by every exercise.
2. **A Happi scene on Home that reacts to state, plus one first-person bubble.** This is where "soul" lives in Finch and BitePal.
3. **Illustrated exercise tiles:** a pose sticker plus a per-exercise colour wash on the Exercises tab.
4. **Reading-size Happi statements and segmented progress in the chat exercises.**
5. **Type collapse to display / header / body / caption, and a warm off-white chrome background.**
6. **Per-exercise colour wash on the form-style exercises.**
7. **"Things I've caught" collection** that shows the user's own words.

## 8. Open questions

- **Art:** Who draws the Happi pose set (about 6 exercise stickers and 4 home states)? Does the existing rig (`HappiRig.tsx`, POSES) cover them, or does this need new art?
- **Display face:** Keep Nunito 800 for display, or add a rounded display face (as Duolingo and BitePal have their own)? Adding one is a brand decision.
- **Per-exercise colours:** Does adding them break the "one accent" unslop rule? I propose the hue appears only as an illustration wash, never on controls. Needs sign-off.
- **Stat tiles:** Should completion show belief before and after as a stat tile? It risks feeling like a score; consider showing it only when belief dropped.
- **Missing apps:** Rootd and Bearable aren't on Mobbin. Check them on device if they matter.

---

**Top 3 changes for a premium feel:**
1. A full-screen completion with Happi acting a new pose.
2. A Happi scene on Home that changes with the user's state.
3. Illustrated exercise tiles, each with a Happi sticker and its own colour wash.
