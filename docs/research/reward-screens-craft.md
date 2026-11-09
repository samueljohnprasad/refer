# Reward screens: craft, background, motion

Research only. Goal: make Happy's reward moments (lesson done, keepsake, unit / section / course complete) feel handcrafted, warm and rewarding. Sources: Mobbin (Abode, Duolingo, Finch, BitePal, Bears Gratitude, Tolan, Ahead), Duolingo design blog, Rive articles.

## 1. What is wrong with the current screens

| Screen | Problem |
|---|---|
| Lesson done | White void. Happi floats with no ground or scene. Generic title "Lesson done." Grey form-like card. Progress dots tiny. Bottom 40% empty. No hero moment. |
| Something to keep | Flat geometric box inside generic concentric circles. Three identical grey cards read as a list or form, not a treasure. User's own words, the most precious thing on screen, look like database rows. Happi absent. |
| Unit complete | Sheet over a dimmed path feels like a modal, not a celebration. Happi shoved to the left at odd scale, not acting. Medal is a stock rosette in the same dull sage. "What you practised" row is plain. |
| All | Everything is one sage. The "one accent" rule became a "one colour" rule, so nothing feels warm. No background, no scene, no texture, no light. Happi uses the same idle pose everywhere. No choreographed motion. Copy is flat and the same every time. |

Root cause: the screens are laid out like UI, not staged like moments.

## 2. Abode: modern, handcrafted, warm

Refs: [board](https://mobbin.com/screens/b3fbd884-220f-4bd3-9867-4bde38143430), [board 2](https://mobbin.com/screens/9e5bb073-6c9d-4b05-9a20-88f245c2f344), [pet](https://mobbin.com/screens/df4dc946-060d-45cd-b5da-9c35cfbdee68), [egg incubating](https://mobbin.com/screens/32967fba-5950-4b50-a68d-fdd6183d8d8c), [egg hatching](https://mobbin.com/screens/4d26520f-f3e9-417a-94b0-869f962c474e), [doodle board](https://mobbin.com/screens/3b2d808d-4fe6-421c-9871-143641509d51), [empty state](https://mobbin.com/screens/d305258b-6be1-430f-90fc-13c1a0e13ac0), [Product Hunt](https://www.producthunt.com/products/abode-3/launches).

- **Each object has its own colour.** Todo is pale blue, game is saturated yellow with red, note is blush pink, album is a full-bleed photo. The brand colour (red or blue per group) frames the board, while the objects inside carry their own palettes. UI accent and illustration palette are separate systems.
- **Pet screen = a stage.** Layered illustrated landscape: tan hills, mountain silhouette, green foliage clumps framing the edges, soft clouds. The creature sits centre on a ground shadow. A thought bubble shows its want (watermelon). The scene makes it feel alive even when static.
- **Tactile buttons.** Actions are chunky squircles in strong colours (orange, green, magenta) with a darker bottom edge, so they look pressable.
- **Type with personality.** Heavy rounded display type for card titles ("Pet", "Lexico", "Let's play!"). Warm tan lettering for states ("incubating…"). Body stays neutral.
- **States are characters.** Incubating egg, cracked egg ("shake the device to hatch"), hatched pet. Progress is shown by the object changing, not by a bar.
- **Handmade marks.** Doodled hearts and a palette sticker give a human touch on top of the clean grid.
- **Soft surfaces.** Large radius (~24pt), no borders, pastel fills, generous gutters.

## 3. Duolingo: celebration, motion, reward

### Lesson complete
Refs: [lesson complete](https://mobbin.com/screens/31fdc425-1a41-4b78-b4e6-762bff0b9306), [flawless](https://mobbin.com/screens/a5edfc91-474c-4ff6-b1b2-e418bfe5a383), [parade](https://mobbin.com/screens/8086bc1d-dede-4e4f-bc90-181f53bd642f), [speedrun](https://mobbin.com/screens/b3bdc9ab-f666-4a33-b1b6-9113bfa4cebd), [story complete](https://mobbin.com/screens/c00bbcbd-f4c9-4b5c-acf0-00dd9be39813).

- Background stays white, but the character is huge (~40% of the screen) and **acting**: happy-crying, flexing with a gold medal, on roller skates, putting on lipstick.
- **Variation is the magic.** Same layout, around ten headline and pose combinations picked by outcome: "When's the parade?", "Flawless — you're like a pristine, freshwater pearl", "Whoa whoa whoa". The screen feels personal every time.
- Title in a warm brand colour (yellow), not black.
- Three stat tiles, each with a coloured header band and tinted outline (yellow Total XP, green accuracy, blue time). Short, scannable, colourful.
- Four-point sparkles around the character, tinted from the character's colour.
- One CTA.

### Escalation by rarity
Refs: [legendary](https://mobbin.com/screens/5f698e13-7b77-4a3f-813f-f06e5ee279c8), [stellar student](https://mobbin.com/screens/59103155-d55e-4497-af83-324226e9b48b), [league trophy](https://mobbin.com/screens/2df438b2-5c11-49f3-af79-1e4de036b85d), [rare chest](https://mobbin.com/screens/f35dbc35-4569-483e-9d66-cc3a7832b8f2), [epic chest](https://mobbin.com/screens/7f725edb-d343-472f-8895-ab2e708a6521), [gems](https://mobbin.com/screens/f58776e8-cc51-489b-a4b4-439217b3cfbb), [suit reward](https://mobbin.com/screens/53295092-90a0-4bba-8acb-6481757faaa5), [streak](https://mobbin.com/screens/fe966528-929c-475b-b917-9b342e3868a5), [quests complete](https://mobbin.com/screens/d530dada-6595-4901-8541-1895451c7863).

| Moment | Background | Hero |
|---|---|---|
| Lesson | White | Acting Duo, sparkles |
| Quest / chest | Full colour field (blue = rare, purple = epic) | Chest centred, rarity label, sparkles. You tap to upgrade it, so you take part. |
| Gems | White | Opened chest overflowing, gems flying out |
| Suit | Sky gradient with soft clouds | Character popping out of a box |
| League | Pink with spotlight beams from above | Trophy on a plinth |
| Legendary | Near black with a gold radial burst | Gold coin above a gold Duo |
| Year review | Illustrated arches, deep blue | Duo reaching for a star |

Rule: **the bigger the achievement, the more the background takes over.** Small wins stay light; big wins get a full scene and a light source.

### Streak
Giant number (6) in brand orange, flame behind the character, a week row of check badges, and a speech bubble looking forward ("Tomorrow makes 7 days").

### Motion (Duolingo design blog + Rive)
- Five motion principles: make people feel something; find a rhythm (every animation has a beat); play with expectations; be intentional; get to the point. ([blog](https://blog.duolingo.com/streak-milestone-design-animation))
- Milestone animations fire only on milestone days. Scarcity keeps them special. Redesigning one milestone animation moved day-7 retention by +1.7%.
- Characters are Rive state machines with layered body and face, plus idle breathing and blinking, so the character is never frozen. ([Rive notes](https://dev.to/uianimation/how-duolingo-uses-rive-for-their-character-animation-and-how-you-can-build-a-similar-rive-mascot-5d19))
- In-lesson "PERFECT" moment: stamp text drops in, light rays burst, and a grass mound rises from the bottom.

## 4. Mental-health peers: warmth without noise

- **Finch** ([star reward](https://mobbin.com/screens/c246a0cd-fc4a-4ebc-af35-c7f033c3fce9), [night forest](https://mobbin.com/screens/bdeb1b66-7512-4d70-bb37-a2d7b6d148c7), [chest](https://mobbin.com/screens/ec68b7e0-e55d-4a50-be7c-c073e8d791b2), [missed day](https://mobbin.com/screens/d57f16e6-eb3b-4562-810c-0c6be6eaf239), [friends tree](https://mobbin.com/screens/85ccc06a-9be2-4978-9079-9e7505c1406c)): soft pastel scenes (mint field, moonlit forest, warm cream room). The bird always stands on ground with a shadow. It speaks in first person and kindly ("Today felt like a soft cloud!", "It's okay to miss a day"). The reward object glows, and rays sit behind the chest. This proves scenes and soft confetti suit a self-care tone.
- **Bears Gratitude** ([entry card](https://mobbin.com/screens/34fd4c95-ebe2-4024-9e58-ef310e6b6e3b), [rewards](https://mobbin.com/screens/336d8e68-4825-4d1d-928a-3061190d7d16), [pamper](https://mobbin.com/screens/7ae2c7ca-ccf4-4e9f-a97f-a86590e0f974)): hand-drawn line art on warm paper tones. Each journal entry is a framed card with an illustration and a date stamp, so your own words become a keepsake. This is the closest model for "Something to keep".
- **BitePal** ([praise bubble](https://mobbin.com/screens/c3bbc587-3c65-4942-a658-b049e17b0f8e), [feed](https://mobbin.com/screens/eb74890f-44ab-41bd-8933-7beebe1036c3)): the mascot has big expressive faces and floating hearts, a chunky grotesque headline, and a leafy scene background behind the header.
- **Tolan** ([pair space](https://mobbin.com/screens/9af1f4b7-c4de-444f-a4b6-7cc59d5e30ae)): painterly scene header with two characters and a serif title over it. Emotional and premium.
- **Ahead** ([unlock](https://mobbin.com/screens/7e9b3309-bc26-4ecc-8ae8-3495ab5efc71)): soft radial rays behind the unlocked item, which stands on a little plinth.

## 5. Principles for Happy

1. **Stage, not screen.** Every reward has a background, a ground plane and a light source. A white void is not allowed.
2. **Split the palette.** Sage stays the only accent for interactive UI (buttons, progress, links). Illustration gets its own warm palette: cream paper, honey light, sky, blush, leaf. This revises the earlier "no honey" call; that call should apply to UI, not art. Needs your sign-off.
3. **Happi acts.** One pose per moment: holding the note up, hugging the opened tin, wearing the medal, jumping. Idle breathing and blinking between beats.
4. **The user's words are the treasure.** Show them as paper notes with tape, a slight rotation (±2°), a date stamp and soft grain. Never as grey rows.
5. **Variable, first-person copy.** Happi speaks. Use 3–5 variants per moment, chosen by context (first time, streak, return after a gap). No "Lesson done."
6. **Stats that celebrate effort, not performance.** Duolingo-style tinted tiles but CBT-safe: "minutes with yourself", "thoughts noticed", "step 3 of 5". No accuracy or speed judgements.
7. **Escalate by rarity.**
   - Lesson: white plus a soft sage ground mound and sparkles.
   - Keepsake: warm cream paper field and a honey glow behind the tin.
   - Unit: full sage-to-sky scene with hills.
   - Section: dusk scene.
   - Course: night sky with stars and a spotlight.
   - Big moments go full screen, not a sheet over the path.
8. **Choreograph the motion beats** (Duolingo's "find a rhythm"):
   - 0 ms: background fades and scales in.
   - 150 ms: Happi drops in with squash and stretch, plus a light haptic.
   - 300 ms: sparkles twinkle, staggered.
   - 450 ms: title rises.
   - 550 ms onward: cards stagger in 60 ms apart.
   - Numbers count up.
   - 900 ms: CTA arrives.
   - Keepsake: the tin shakes (anticipation), the lid pops, the notes rise one by one, a success haptic plays.
   - Unit: the medal drops and bounces, a shine sweeps across it, Happi jumps.
   - Reduced motion shows the final frame.
   - Tapping skips to the end.
9. **Craft details on every illustration.** Inner highlight strip, darker bottom rim (3D like the Duolingo path), soft ellipse ground shadow, four-point sparkles, subtle paper grain, hand-drawn underline under key words.
10. **Make it interactive where it is cheap.** Tap the tin to open it (Duolingo chest, Abode egg). The user takes part in the reward instead of just reading it.
11. **Guardrails.** Celebrate the act of trying. Keep the quiet variant for heavy topics. Keep the "okay to miss a day" tone. No loss-aversion pressure.

## 6. Per-screen direction

- **Lesson done:** full screen. A pale sage ground mound with a soft sky tint at the top. Happi large (~38% of height), holding up a small paper note that carries the user's line. Happi's speech bubble picks one variant ("You named it. That's the hard part."). Two effort tiles (step, time). Week or unit dots rendered as larger stamped circles. One CTA.
- **Something to keep:** full screen on cream paper. The tin is redrawn with highlights, rim and shadow, and a honey glow behind it. The tin is tapped to open. Notes rise as taped paper cards, slightly rotated, with dates in a handwriting-style font, stacked and overlapping rather than listed. Happi peeks from the side of the tin. "Added to your Keepsakes" becomes a stamp.
- **Unit complete:** full-screen scene (hills, sky, light rays). The medal is redrawn with a metallic sage-gold, a shine sweep and a ribbon. Happi wears it or holds it up, centred, not pushed to the side. The headline comes in a warm display colour. "What you practised" becomes illustrated skill chips with a session count.

## 7. Gaps

- Mobbin captures are static, so Abode's motion was not observed. Motion guidance comes from the Duolingo principles and Rive write-ups.
- The Duolingo streak blog post returned 503. Its principles and the +1.7% figure come from the search summary of that post.
- Happi art needs new poses (holding note, hugging tin, wearing medal, jumping). happi.js may need extending, or these could be drawn as standalone SVGs.
