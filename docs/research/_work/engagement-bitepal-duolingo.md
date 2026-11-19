# Engagement teardown: BitePal + Duolingo (working notes)

Scope: how two mascot apps get users to do effortful logging / lessons, and what transfers to CBT logging (thought records, naming distortions, reframes).
Date of research: 2026-11-15.

Evidence labels used below:
- **[Screen]** = I looked at the Mobbin screenshot; copy in quotes is transcribed from the image.
- **[Web]** = fetched page; quote is from that page.
- **[Snippet]** = seen only in a search-result excerpt; the primary page could not be opened (blog.duolingo.com and research.duolingo.com returned HTTP 503 to the fetcher). Treat as lower confidence.
- **Inference:** = my reading, not stated by a source.
- **[Unverified]** = could not confirm; do not cite as fact.

Mobbin screen URL pattern: `https://mobbin.com/screens/<id>`; flows: `https://mobbin.com/flows/<id>`.

---

# PART 1 — BITEPAL

Developer: Reface Lithuania UAB (the Reface face-swap team). App Store 4.7 from 58K ratings. [Web] https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917 ; [Web] https://consumerapplab.substack.com/p/bitepals-ai-pet-makes-meal-logging

## 1.1 The ask

- Logging is framed as feeding the pet, not as data entry. First-log screen: small label "Feed Alex" (Alex = user-chosen pet name), headline "What did you eat last?", a typed example ("Caprese salad"), camera / + / gallery buttons, and an opt-out link "I'll do it later". The raccoon stands above the card, arms open. [Screen] flow "Logging a meal (AI)" https://mobbin.com/flows/d757d3c6-9f95-44bd-b251-309bc6d8f9bb
- Who asks: the character. The question sits in a card with a speech-bubble tail pointing down at the + button; the pet's name is in the label. [Screen] same flow.
- Home state: raccoon fills the top ~40% of the screen, name + 4 hearts top-left, a black floating "+" bottom-right on every home state. [Screen] https://mobbin.com/screens/59cbdcda-5d83-4d87-940f-12e95fcfacfb , https://mobbin.com/screens/51e4e1aa-21b7-48c2-bef1-ac3e3c642845
- Widget ask: home-screen widgets read "Getting hungry" / "Feed me" with a worried raccoon, a streak flame count ("2"), and a "+" button. [Screen] https://mobbin.com/screens/95100213-d306-4e5a-8d16-0246db487b2e
- Live Activity / island-style banner: "Meal not logged yet" / "Feed me" / "+". [Screen] https://mobbin.com/screens/c911cccc-2076-4a3c-8a56-9a9c3c62e2cd
- Neutral-state widget (after logging): "Calories left 993" with the raccoon peeking, no demand. [Screen] https://mobbin.com/screens/65342473-a749-438c-b475-8cc4804183ff
- Push copy shown in onboarding preview: "❤️🤍🤍🤍 (1 left)" / "Don't forget to snap your meal 📸", under the headline "We'll support you to keep logging", CTA "Set up reminders". [Screen] https://mobbin.com/screens/083cc63f-4506-4dd8-9fc4-b20c2dba4f77
- Staged notification consent: the app asks inside its own UI when the user wants reminders and shows the iOS dialog only after a yes. [Web] https://consumerapplab.substack.com/p/bitepals-ai-pet-makes-meal-logging
- App Store listing copy: "Your raccoon is already hungry!" [Snippet] https://apps.apple.com/app/id6479529917
- Notification send times: **[Unverified]** — not visible in any screen or source I opened.

## 1.2 Effort reduction

- Three entry paths from one camera screen: shutter (photo), "Gallery", "Type"; top toggle "Meal | Label" (label = nutrition-label scan). [Screen] flow "Logging a meal (text input)" https://mobbin.com/flows/ad60f834-06e1-4b8c-bb66-21458040c039
- Free-text describe: placeholder "Type what you ate (e.g., 2 eggs, a slice of bread, 1 avocado)", with "Recent logs" chips underneath for one-tap re-log (e.g. "caesar salah with 200g of chicken" — typo preserved, i.e. sloppy input is accepted). [Screen] flow "Logging a custom meal" https://mobbin.com/flows/e1ac5ba1-e9d0-4e3c-a000-2416c045b5e2
- "Enter kcal" tab: name + one number; "Macronutrients (optional)". [Screen] same flow.
- AI does the decomposition, user only confirms: "AI-detected ingredients" list (Avocado toast 150 g, Egg 50 g), "Serving(s) 1", "+ Add new ingredient", single "Confirm" button. [Screen] https://mobbin.com/flows/ad60f834-06e1-4b8c-bb66-21458040c039
- Food library search with "Analyze with AI" fallback button pinned at the bottom. [Screen] flow "Logging a meal (text input)" https://mobbin.com/flows/9610e471-1a28-4dac-8687-74660587cba9
- Meal-plan items have a one-tap "+ Log" (and "Swap"). [Screen] flow "Logging a meal (meal plan)" https://mobbin.com/flows/4fb427c6-7270-465d-95cc-362ba97b44cd
- Global "+" menu lists five loggables with current status inline: Workout "317 kcal left", Weight "60.9 kg", Water "0 ml", Fasting "Planned at 5:00 PM" START, Food "396 kcal over" with keyboard and camera shortcuts. [Screen] https://mobbin.com/screens/ca8ee4f2-2546-4c00-9696-3e4228ed0265
- Waiting is covered by the character: "Analyzing…" / "Checking database.." with the raccoon thinking (question marks over head) while a scan line passes over the photo. [Screen] https://mobbin.com/screens/e904fdb7-bc19-486f-9f99-9bd7b0564e1b
- First log happens inside onboarding (the "Feed Alex / What did you eat last?" screen precedes the first home screen and the "+15 BiteCoins — Log your first meal" toast). **Inference:** from flow order; I did not see every onboarding screen. [Screen] https://mobbin.com/flows/d757d3c6-9f95-44bd-b251-309bc6d8f9bb , https://mobbin.com/screens/2ee8e5d6-668b-400b-a273-e9b1d588d572
- Voice logging: **[Unverified]** — no mic/voice entry point visible in the screens I saw.

## 1.3 Payoff at the instant of logging

Sequence observed across the logging flows:
1. Raccoon "eats": full-screen green check circle, raccoon laughing with speech line "Hmm, something tasty.." [Screen] https://mobbin.com/screens/62cf07f5-7317-4d27-8775-d6c31ffff3fa
2. Meal detail with a verdict word and score: "Nutrition score — Excellent — 96", then "Awards & highlights" (3 hex slots, locked on free tier: "Unlock awards & highlights"), "Done" pill. [Screen] https://mobbin.com/flows/d757d3c6-9f95-44bd-b251-309bc6d8f9bb
3. Achievement bubble from the raccoon with confetti: "You've just unlocked the achievement: \"Ultimate Raccoon Feeder!\"" [Screen] https://mobbin.com/flows/9610e471-1a28-4dac-8687-74660587cba9
4. Streak screen: "1 day streak!", week dots, "A Streak is born! Keep logging everyday to make it grow.", buttons share + "I'm commited" (sic). [Screen] https://mobbin.com/screens/465c5840-e986-43f6-8826-c15a74866956
5. Back on home: toast "+15 BiteCoins — Log your first meal"; later "+35 BiteCoins — Reach 90% of your goal"; challenge toast "Award hunter — Earn 50 nutrition awards (32 / …)". [Screen] https://mobbin.com/screens/2ee8e5d6-668b-400b-a273-e9b1d588d572 , https://mobbin.com/screens/c66d58cb-28f3-4e65-aa27-2e39899ae74e , https://mobbin.com/screens/a329058e-b581-4121-a37b-5ea2ee54645c
6. Lightweight path (manual kcal): just a green toast "Boom. Logged it." over the home screen, counter jumps (363 → 1,076 kcal), meal thumbnails stack. [Screen] https://mobbin.com/flows/e1ac5ba1-e9d0-4e3c-a000-2416c045b5e2
- Counters that move: calories ring, macro bars, meal thumbnail row, streak flame number, coin balance. [Screen] https://mobbin.com/screens/51e4e1aa-21b7-48c2-bef1-ac3e3c642845
- **Inference:** two payoff tiers — full ceremony for AI/photo logs, a 3-word toast for quick logs — keeps repeat logging fast.

## 1.4 Caretaking loop

- The pet has 4 hearts shown under its name on home. [Screen] https://mobbin.com/screens/59cbdcda-5d83-4d87-940f-12e95fcfacfb
- Hearts drain when meals are not logged: reminder preview shows 1 of 4 hearts left "(1 left)". [Screen] https://mobbin.com/screens/083cc63f-4506-4dd8-9fc4-b20c2dba4f77
- User account: "feeling guilty about Bobo (my racoon) not getting to eat and losing health points". [Web] App Store review by usernameusername556, 09/19/2024, https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917
- Journalist account: skipping a log drains the creature's energy bar — "a subtle dose of fear that nudges compliance." [Web] https://consumerapplab.substack.com/p/bitepals-ai-pet-makes-meal-logging
- Miss state is worry, not death: widget raccoon bites its nails under "Getting hungry / Feed me". [Screen] https://mobbin.com/screens/95100213-d306-4e5a-8d16-0246db487b2e
- What happens at 0 hearts (pet leaves? dies? resets?): **[Unverified]** — no screen or source found.
- Second-hand: "missing a day made the raccoon look sad" (competitor blog, treat with caution). [Snippet] https://nutrola.app/en/blog/why-i-switched-from-bitepal
- Fasting gives the pet a rest state: night scene, raccoon asleep, "Zz Fasting" replaces hearts. [Screen] https://mobbin.com/screens/c795817a-268d-4573-888f-983dbc81c18a
- Failed fast: droopy raccoon, "0h 0m", "Less than 12h isn't enough for fat-burning. Keep fasting to make this fast count." with "Keep fasting" as the plain-text default and a coral "Cancel current fast". [Screen] https://mobbin.com/screens/ea09e87c-837f-4614-891f-6b93719bf718

### Reaction design: logs / skips / over target
- Logs: laughing raccoon, "Hmm, something tasty..", score word, coins. (1.3)
- Skips: hearts drop, worried face, "Feed me". No red, no "you failed" wording in any screen I saw.
- Over target: the app states it as a number, not a judgment. Home shows "Calories eaten 2,933" with carbs "445/317 g" and fats "178/56 g" and a darker-red ring; the + menu says "Food — 396 kcal over". The raccoon on the same screen is still smiling with arms open. [Screen] https://mobbin.com/screens/6c40ce24-b766-4a60-a0d0-97c3fd4ee801 , https://mobbin.com/screens/ca8ee4f2-2546-4c00-9696-3e4228ed0265
- Excess nutrient copy is jokey: "Fiber — Very rich — That's a lot of fiber today – your digestion might be working overtime, so try not to overdo it." [Screen] https://mobbin.com/screens/52e4857d-3d89-4ebb-a9c7-50589b1a589b
- Under goal is framed as achievement: "Goal reached: 317 kcal"; "4.1 kg below goal: 65 kg". [Screen] https://mobbin.com/screens/46a02ecf-d18a-4847-bb3c-6ba18e1b52bc , https://mobbin.com/screens/52e4857d-3d89-4ebb-a9c7-50589b1a589b
- **Inference:** the pet's mood is tied to *whether you logged*, not to *what you ate*. That separation is the core non-punitive move.

### Streak treatment
- Streak = days logged; flame + number on home and widget. [Screen] https://mobbin.com/screens/59cbdcda-5d83-4d87-940f-12e95fcfacfb
- Week strip ends in a lightning-bolt slot on day 7 (reward marker). [Screen] https://mobbin.com/screens/465c5840-e986-43f6-8826-c15a74866956
- Weekly challenge "Keep the streak — Stay active 5 days" (3/5, 100 coins): the paid-out target is 5 of 7 days, not 7 of 7. [Screen] https://mobbin.com/screens/f6acf138-8589-497c-8e83-ad0105baefd8
- Streak-loss screen and any freeze/repair mechanic: **[Unverified]** — not seen.

## 1.5 Progression

- BiteCoins currency: earned per action (+15 first meal, +35 for 90% of goal, 100–200 per weekly challenge). [Screen] https://mobbin.com/screens/2ee8e5d6-668b-400b-a273-e9b1d588d572 , https://mobbin.com/screens/c66d58cb-28f3-4e65-aa27-2e39899ae74e , https://mobbin.com/screens/f6acf138-8589-497c-8e83-ad0105baefd8
- Coins can also be bought: "BitePal 400 Bitecoins Pack $0.99". [Web] https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917
- Nutrition awards: hex badges with counts (×4, ×2, ×5…) per food quality type; "More nutritious food – more shiny awards". [Screen] https://mobbin.com/screens/5ffe3673-524f-4a3f-8a63-a60748ed2d8d
- Named achievements ("Ultimate Raccoon Feeder!"). [Screen] https://mobbin.com/flows/9610e471-1a28-4dac-8687-74660587cba9
- Pet growth / evolution / levels: none visible. **Inference:** progression is wardrobe + badges, not pet evolution. **[Unverified]** that no evolution exists.

## 1.6 Customization and when

- In onboarding, before any logging: "Open to see who is there" (trash can with a striped tail) → "This raccoon is now your virtual pet" → "Name your raccoon" (with a dice button for a random name). [Screen] https://mobbin.com/flows/280827a4-34c7-4915-9dde-5d4de3005186 , https://mobbin.com/screens/1e19816e-88c6-419e-9258-b336cfe58722 , https://mobbin.com/screens/c4bc41b1-0690-4630-9cc4-bfd2647d601e
- Voice/persona picker with a live sample line: options "Cheerleader", "Gentle & kind", "Straight talker", "Mindful guide"; selecting "Gentle & kind" previews the bubble "You showed up again today. That's the whole thing." [Screen] https://mobbin.com/screens/2079a9b1-d935-48ba-a533-058e77de08a0
- Shop after first logs: tabs for backgrounds, hats, glasses, scarves, colors, extras; prices 250 / 300 / 450 coins; confirm sheet "Background — Cozy room — Unlock for 250". Balance seen 155 → 535 → 285. [Screen] https://mobbin.com/screens/9044f455-3995-4a39-8e8b-a73406beb823 , https://mobbin.com/screens/b4bd8e47-e8a0-45ac-8170-61ac7cee286e , https://mobbin.com/screens/49941afc-fdc0-4d6e-a12d-fef622bc92e4
- Shop entry icon on home carries a red dot (new items). [Screen] https://mobbin.com/screens/59cbdcda-5d83-4d87-940f-12e95fcfacfb
- Listing copy: "Personalize your raccoon with outfits, accessories, and seasonal looks that match your vibe." [Web] https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917
- Pricing math: a 250-coin item ≈ first meal (15) + several days of goal hits (35) + 1–2 weekly challenges (100–200). **Inference:** first unlock lands in week 1.

## 1.7 Rhythm / novelty

- Weekly challenges tab with countdown "2d left": Keep the streak (5 days), Calorie control (5 days), Fiber focus (4 days), Hydration hero (5 days), Fasting flow (3 times), Award hunter (50 awards). [Screen] https://mobbin.com/screens/f6acf138-8589-497c-8e83-ad0105baefd8
- Seasonal scenes: Halloween pumpkin background on home; Christmas-tree and pumpkin backgrounds in shop. [Screen] https://mobbin.com/screens/00f41a2b-baf5-4fd9-affb-6b04770c856a , https://mobbin.com/screens/9044f455-3995-4a39-8e8b-a73406beb823
- Character states seen: arms-open happy, laughing/eating, thinking (analysis), sleeping (fasting), droopy (fast failed), nail-biting (hungry), peeking (widget), shy/blushing (streak, onboarding).

## 1.8 Data reflected back

- "Statistics — This week": donut "20 Total" split into 15 Meals / 0 Desserts / 0 Snacks / 5 Beverages; Nutrition score "58 Avg. score", "72 Top score", "-3 This week"; daily line chart S–S with avg line; Macro balance %. [Screen] https://mobbin.com/screens/8cde4018-9805-4042-8e49-b6fb65c2f77f
- Per-meal: nutrition score, protein level, fiber level, "Nutrition tips — Keep doing". [Screen] https://mobbin.com/flows/9610e471-1a28-4dac-8687-74660587cba9
- Year-in-review style recap: **[Unverified]** — not seen.

## 1.9 Copy / voice

- Sentence length: 2–7 words for asks and confirmations ("Feed me", "Boom. Logged it.", "Hmm, something tasty..", "What did you eat last?").
- Good day: exclamation + playful title ("Ultimate Raccoon Feeder!", "A Streak is born!").
- Bad day: fact + next step, no adjectives about the user ("396 kcal over"; "Less than 12h isn't enough for fat-burning. Keep fasting to make this fast count.").
- Persona sample for the gentle voice: "You showed up again today. That's the whole thing." — praise for attendance, not outcome. [Screen] https://mobbin.com/screens/2079a9b1-d935-48ba-a533-058e77de08a0
- Onboarding goal list includes "Build healthy relationship with food", "Feel better about myself". [Screen] https://mobbin.com/flows/280827a4-34c7-4915-9dde-5d4de3005186
- Independent review: "Messaging avoids guilt and restriction." [Web] https://neurospicynomnoms.beehiiv.com/p/bitepal-review

## 1.10 Motion

- Static screenshots only; I cannot give durations. **[Unverified]** timing.
- Visible from stills: scan line over the photo during analysis; confetti beside the achievement bubble; sunburst behind the streak raccoon; squash on the laughing raccoon.

## 1.11 Where it gets annoying (quoted)

- Paywall on basics: "I didn't realize that changing calorie values was only a paid option". App Store review, vlhcihxkhdoychlh, 04/09/2025. [Web] https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917
- Macros locked on free home (padlocks under Carbs/Fats/Proteins, orange "BitePal Plus" tab stuck to the pet scene). [Screen] https://mobbin.com/screens/e04f2471-89eb-4d97-bc7e-1f3b53169c52
- "Editing mistakes often requires upgrading." / "Free tier feels more like a demo." [Web] https://neurospicynomnoms.beehiiv.com/p/bitepal-review
- Accuracy: "the AI seems to wayyy over estimate calories" (same App Store review); "it undercut the calories every single time" (dulcetvoice, Jan 13); "the app will add thousands of calories to my daily intake" (Corndog2021, Mar 30). [Web] https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917
- AI logged 60 tortilla chips instead of 6; "Same meal can vary wildly in calorie count." [Web] https://neurospicynomnoms.beehiiv.com/p/bitepal-review
- Pet guilt displacing the real goal: "I ate better because I cared more about taking care of a dang raccoon than of taking care of myself" (review titled "Not how I want to lose weight", dulcetvoice). [Web] https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917
- Billing: "I was charged for a membership after deleting my subscription weeks before." (Camilla Grosso, Nov 2026, 1 star). Trustpilot overall 4.6 from 3,773 reviews. [Web] https://www.trustpilot.com/review/bitepal.app
- Pricing: $3.99–$5.99 weekly, $35.99–$59.99 yearly. [Web] https://apps.apple.com/us/app/bitepal-ai-calorie-tracker/id6479529917
- Reddit threads on BitePal: **[Unverified]** — none opened directly.

## 1.12 Numbers

- Lifetime installs passed 400,000 in December (2024); company-reported ~400,000 new downloads in a recent 30-day window (~13,000/day). Source is internally ambiguous on lifetime vs monthly. [Web] https://consumerapplab.substack.com/p/bitepals-ai-pet-makes-meal-logging
- No retention or cohort figures published. Founder interview: none found. **[Unverified]** third-party revenue estimate of ~$150K/month (screensdesign.com).

## 1.13 Transfer to CBT logging

Transfers:
- Frame the entry as an act toward the character ("Feed Alex" → e.g. "Tell <name> what happened"), with the pet's name in the label and an explicit "I'll do it later".
- Tie character mood to *showing up*, never to content. BitePal never makes the raccoon sad about a 2,933-kcal day; a CBT pet must never look sad about a dark thought.
- AI does the decomposition, user confirms: BitePal's "AI-detected ingredients → Confirm" maps to "free-text thought → suggested distortion chips → confirm/edit".
- Two payoff tiers: ceremony for a full record, 3-word toast for a quick check-in.
- Persona picker with a live sample line, offered in onboarding.
- Weekly target of 5/7 days rather than a perfect streak.
- Recent-entry chips for one-tap re-log (recurring situations / recurring thoughts).
- Character covers latency ("Analyzing…" with thinking pose).

Does not transfer:
- Hearts that drain on a miss. Users report guilt ("feeling guilty about Bobo… losing health points"). In a mental-health app the miss days are often the worst days; a hungry pet adds a second stressor. Use a rest/sleep state (BitePal's fasting-sleep scene is the model) instead of a depleting meter.
- "Feed me" imperatives on the lock screen.
- Score verdicts on the entry ("Excellent 96"). A thought record should not be graded.
- Locking edits behind a paywall — editing a reframe is the therapy.
- Coins purchasable for cash next to an emotional pet.

---

# PART 2 — DUOLINGO

## 2.1 The ask

- Duo asks in a speech bubble; the button is a first-person commitment. "What's your daily learning goal?" → 5 / 10 / 15 / 20 min per day labelled Casual / Regular / Serious / Intense → button "I'M COMMITTED". [Screen] https://mobbin.com/screens/14f1b986-098a-47da-9172-1f3567c17b5c
- "Let's set up a learning routine!" [Screen] https://mobbin.com/screens/88ba156b-e484-4d98-b17b-7123a1d7c6cb
- Notification priming by Duo: "I'll remind you to practice so it becomes a habit!" with an arrow pointing at "Allow" on a mock of the iOS dialog; button "REMIND ME TO PRACTICE". [Screen] https://mobbin.com/screens/817844ed-f7df-4645-b18b-a9803879821f
- After lesson 1: "Can you practice every day?" above "1 day streak", button "I'M COMMITTED". [Screen] https://mobbin.com/screens/58c9920b-ef13-4098-ae02-2baa5d109c45
- Streak goal: "Let's commit to learning with a Streak Goal!" → 3 days "Earn 30 gems" / 5 days "Earn 500 gems" / 7 days "Earn 700 gems"; picking 5 changes the bubble to "You'll be 5x more likely to complete the course!"; button "COMMIT TO MY GOAL". [Screen] https://mobbin.com/screens/e2891a87-9018-41a0-a755-cb0ed32913b7 , https://mobbin.com/screens/0164fbbf-cd13-4c13-90f0-336963decf5f
- Changing the CTA from "Continue" to "Commit to my goal" is described by the retention PM as a significant retention win (no figure given on the page). [Web] https://www.lennysnewsletter.com/p/duolingo-streaks
- Home ask: one highlighted path node with a "START" / "CONTINUE" bubble; everything else grey. [Screen] flow "Completing a lesson" https://mobbin.com/flows/706ba483-579e-4628-9903-ba0809870d18
- Widget ask escalates through the day: blue "6 days — Get started early!" (flexing Duo) → purple "845 days — Please practice!" / "Extend your streak!" (sweating Duo, alert icon on flame) → red "Last chance!" (Duo with arms crossed / collapsed). [Screen] https://mobbin.com/screens/3730667e-3607-419e-b2ca-873815f89de9 , https://mobbin.com/screens/292dabe3-384b-4a45-81d8-85d998bbf852 , https://mobbin.com/screens/c78046b1-5d17-4225-ad76-2d66a72ac8bd
- In-app deadline: "Less than 3 hours to extend your 5 day streak!" / "EXTEND STREAK". [Screen] https://mobbin.com/screens/1755644a-3b98-4a8e-906f-0ef606e166eb
- Lapsed-user copy collected by a 20-day teardown: "Got 3 mins?", "Time for a tiny lesson", "Your skills are getting mouldy", "Did Duo come on too strong?", "Are we done here", and on day 8 "These reminders don't seem to be working" (reminders pause, then resume about three days later; a second pause message on day 18). [Web] https://growth-dives.kit.com/posts/20-days-of-blackmail
- Reminder timing of ~23.5 h after the previous session: **[Unverified]** (my recollection of the KDD paper; PDF returned 503).

## 2.2 Effort reduction

- Lesson is sized in the ask: "Okay! Here's your first 2 minute lesson." [Screen] https://mobbin.com/screens/b8a54efb-c06d-4818-b56e-968b2309c88b
- Setup is counted down: "Just 7 quick questions before we start your first lesson!" [Screen] https://mobbin.com/screens/74201708-1b1b-4b6d-b804-92f9eb2d65c9
- Observed lesson durations on completion screens: 3:34 ("Quick"), 4:46 ("Quick"), story 1:40 ("Speedy", "You completed this story in under 2 minutes"). [Screen] https://mobbin.com/flows/706ba483-579e-4628-9903-ba0809870d18 , https://mobbin.com/flows/40841c36-1296-4b96-95a1-1e1c60c64b83 , https://mobbin.com/flows/1ff832eb-e370-438f-960e-b19609d66685
- Exercises are recognition, not production: "Select the correct image" (4 picture cards), "Select the correct translation" (3 buttons), "Translate this sentence" via word-bank chips, yes/no comprehension. No keyboard in any lesson screen I saw. [Screen] same flows.
- Difficulty is labelled so effort feels expected: tags "NEW WORD", "PREVIOUS MISTAKE", "HARD EXERCISE". [Screen] same flows.
- One lesson per day keeps the streak; tying streaks to XP confused users and "Simplifying the system to just completing one lesson a day made the streaks more effective." [Web] https://www.lennysnewsletter.com/p/duolingo-streaks
- Try-before-signup: letting users do steps before registering gave about a 20% DAU increase; later soft/hard wall tuning gave 8.2% DAU. Second-hand via First Round interview with Gina Gotthilf. [Snippet] https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker

## 2.3 Payoff

- Per answer: green bottom sheet with a check and a word — "Excellent!", "Good job!", "Awesome!" — and CONTINUE. [Screen] https://mobbin.com/flows/706ba483-579e-4628-9903-ba0809870d18
- Combo: bar label "17 IN A ROW", full-screen "PERFECT" burst with the lesson character cheering. [Screen] https://mobbin.com/flows/c199f9a9-7a91-4795-8ba5-5a3c24847009
- Wrong answer: red sheet "Incorrect — Correct Answer: ant — GOT IT". No character scolding on the screen. [Screen] https://mobbin.com/flows/40841c36-1296-4b96-95a1-1e1c60c64b83
- Lesson end: title varies by what you did well — "Lesson complete!", "Word wizard! You learned 6 new words!", "Super fast!" — plus three stat tiles (TOTAL XP 25 / GREAT 94% / QUICK 3:34), Duo + a cast character posing, button "CLAIM XP". [Screen] same flows.
- Then stacked rewards: chest "+5 gems"; "+50 gems — You earned 50 gems for unlocking your French Score!"; "+1 Quest Point!" with three daily-quest bars; streak screen; league position. [Screen] https://mobbin.com/flows/40841c36-1296-4b96-95a1-1e1c60c64b83 , https://mobbin.com/screens/60b2c7e0-b3c5-4ebe-ae99-976f7cb8ece6
- Streak screen copy scales with day: day 1 "Can you practice every day?"; day 6 "Tomorrow makes 7 days, let's gooooooo!" with a frozen day shown in the week strip; day 5 flame-Duo in sunglasses with "SHARE +20 GEMS". [Screen] https://mobbin.com/screens/e319cd42-df5e-4862-ad4a-9cffdc5234d2 , https://mobbin.com/screens/f6675d16-c6b5-4847-aa9f-fb66a2d61e88 , https://mobbin.com/screens/84ec5a7b-37ce-4c38-808d-7c3c91c3c0aa
- Path ring around the node fills by a segment per lesson. [Screen] https://mobbin.com/flows/706ba483-579e-4628-9903-ba0809870d18

## 2.4 Caretaking loop / miss handling

- Duo needs nothing material; what is at risk is the user's own number. The character expresses the risk (sweating, then angry/collapsed on the widget). [Screen] https://mobbin.com/screens/292dabe3-384b-4a45-81d8-85d998bbf852 , https://mobbin.com/screens/c78046b1-5d17-4225-ad76-2d66a72ac8bd
- Miss with a freeze: next open shows "You protected your 5 day streak with a Streak Freeze!" with one used and one empty slot, "REFILL 💎425" / "NO THANKS". Calendar marks the day with a blue ice icon and "1 Freeze used". [Screen] https://mobbin.com/screens/3b18d128-382c-4604-9f98-214c7d239779 , https://mobbin.com/screens/1755644a-3b98-4a8e-906f-0ef606e166eb
- Two labels for a month: "PERFECT" (no freezes) vs "GOOD" (freeze used) — the freeze saves the count but downgrades the badge. "Keep your Perfect Streak by doing a lesson every day!" [Screen] https://mobbin.com/screens/801382ea-9bcc-4fd6-b461-a14b36161486 , https://mobbin.com/screens/1755644a-3b98-4a8e-906f-0ef606e166eb
- "Streak Protection" section exists below the streak goal. [Screen] https://mobbin.com/screens/736a41b0-0984-4010-b7da-33a2c922d0b9
- Guilt escalation in notifications ends in a self-silencing message ("These reminders don't seem to be working") on day 8 of silence. [Web] https://growth-dives.kit.com/posts/20-days-of-blackmail
- That message is described second-hand as one of the most successful notifications, with no number. [Snippet] https://gigazine.net/gsc_news/en/20240618-duolingo-app-streaks
- Notification governance: "we established one foundational rule: protect the channel"; teams "could not increase the quantity of notifications without strong justification and CEO approval". [Web] https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- Streak-lost / repair / "earn back" screen: **[Unverified]** — not seen in Mobbin results.
- Out-of-hearts / out-of-energy screen: **[Unverified]** — not seen; hearts counter "5" and an "∞" energy/Super icon are visible in lesson headers. [Screen] https://mobbin.com/flows/706ba483-579e-4628-9903-ba0809870d18

## 2.5 Progression

- Path: sections → units ("SECTION 1, UNIT 2 — Greet people") → nodes (star, book/story, headphones, mic, dumbbell, chest, trophy); grey cast characters stand beside the path and colour in as you reach them. [Screen] https://mobbin.com/flows/1ff832eb-e370-438f-960e-b19609d66685
- Streak goals step up after each is met (1→3→5; 825→850), tooltip "Next streak milestone" on the calendar. [Screen] https://mobbin.com/screens/fbef2d10-7767-41e4-8a9f-825e022ead13 , https://mobbin.com/screens/b7578a37-b5f0-4921-a9c2-3b42bad94eb9
- "Streak Society — Reach a 7 day streak to join the Streak Society and earn exclusive rewards." [Screen] https://mobbin.com/screens/fbef2d10-7767-41e4-8a9f-825e022ead13
- Leagues: "Sapphire League — 1 DAY", "PROMOTION ZONE", "The top 8 move up to the next league. Will you make it?" / "I CAN DO IT"; weekly result "Congratulations! You finished #9 last week." [Screen] https://mobbin.com/screens/3ca570fe-9e97-4e65-85eb-3e544a7eacab , https://mobbin.com/screens/5966689f-bae2-476e-8afd-57402080775b , https://mobbin.com/screens/99e7f2d1-6876-4848-b5cf-dbd596d2e0ce
- Friend Streaks: "Start Friend Streaks to make daily progress together!", list of up to 5 slots. [Screen] https://mobbin.com/screens/d1ba4abc-768c-4722-9c11-c2336900bba7 , https://mobbin.com/screens/e570e5bb-54f0-4621-adac-5cd9171c9e58

## 2.6 Customization and when

- Almost none for Duo. What the user picks: daily minutes, streak goal, motivations ("Just for fun", "Boost my career", "Spend time productively", "Connect with people"…) — all in onboarding before lesson 1. [Screen] https://mobbin.com/screens/1a2c3854-ea7a-41fa-ab1b-95466c2c0228
- Cosmetic novelty comes from the app, not the user: flame-Duo with sunglasses at milestones, "Suit Quest — Earn quest points to unlock suits" (3/5, 15, 20). [Screen] https://mobbin.com/screens/84ec5a7b-37ce-4c38-808d-7c3c91c3c0aa , https://mobbin.com/screens/e5c1fac7-5244-474c-90a5-2f54234da188
- Special streak app icon as an identity marker (2022 experiment, no number). [Web] https://design.lazyweb.com/blog/duolingo-retention-experiments.md

## 2.7 Rhythm / novelty

Four nested clocks, all visible on the Quests tab:
- Daily quests (resets, "5H"/"11H" left): "Complete your next 2 lessons", "Score 90% in 1 lesson", "Earn 70 XP", "Spend 10 minutes learning". [Screen] https://mobbin.com/screens/9f9ad31c-ec4e-4a7c-98a0-764d40835315 , https://mobbin.com/screens/60b2c7e0-b3c5-4ebe-ae99-976f7cb8ece6
- Weekend quest ("2D"): "Earn 100 XP" / "Complete 15 lessons". [Screen] https://mobbin.com/screens/f35dbc35-4569-483e-9d66-cc3a7832b8f2
- Friends quest: "Complete 25 lessons" shared bar, "You 23 lessons / Alex 2 lessons", "HIGH FIVED ALEX!"; nudge "3 days left! Do 9 more lessons to finish this Friends Quest." [Screen] https://mobbin.com/screens/30e202bf-259b-4d41-83de-4adebaaa892a
- Monthly quest: "December Quest — 19 DAYS — Earn 30 Quest Points 11/30", different cast character each month. [Screen] https://mobbin.com/screens/9f9ad31c-ec4e-4a7c-98a0-764d40835315
- Weekly league reset. (2.5)
- "All Daily Quests complete!" → "OPEN CHEST". [Screen] https://mobbin.com/screens/d530dada-6595-4901-8541-1895451c7863

## 2.8 Data reflected back

- Streak calendar per month with "Days practiced" and "Freezes used". [Screen] https://mobbin.com/screens/801382ea-9bcc-4fd6-b461-a14b36161486
- Per-lesson accuracy % and time. (2.3)
- Weekly league rank. (2.5)
- Year in Review: **[Unverified]** — not seen in this pass.

## 2.9 Copy / voice

- Bubbles are 4–9 words, second person, often a question that invites a yes: "Can you practice every day?", "I bet 7 days will be easy peasy! Right?" → button "I CAN DO IT". [Screen] https://mobbin.com/flows/c199f9a9-7a91-4795-8ba5-5a3c24847009
- Good day: elongated cheer ("let's gooooooo!"), titles that name a strength ("Word wizard!").
- Bad day in-app: terse and factual ("Incorrect", "Less than 3 hours to extend your 5 day streak!").
- Bad day out-of-app: guilt and mock-hurt ("Did Duo come on too strong?", "Your skills are getting mouldy"). [Web] https://growth-dives.kit.com/posts/20-days-of-blackmail
- Buttons are the user's voice ("I'M COMMITTED", "COMMIT TO MY GOAL", "REMIND ME TO PRACTICE", "I CAN DO IT").

## 2.10 Motion

- Lesson characters run on Rive state machines; mouth shapes (visemes) are driven by audio timing data at runtime; the same state machine holds reaction states for right/wrong answers; exported as a single runtime file. [Snippet] https://blog.duolingo.com/world-character-visemes
- State machine lets the team avoid pre-baked sequences and reduce file size (Rive's own case study). [Snippet] https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life
- Streak screen: Duo spins in the air and bursts into an orange flame. [Snippet] https://blog.duolingo.com/how-duolingo-streak-builds-habit
- A new streak animation raised day-7 retention of brand-new learners by 1.7%. [Snippet] https://blog.duolingo.com/how-duolingo-streak-builds-habit
- Milestone redesign (Duo with balloons at 50/100/365) has a section on timing. [Snippet] https://blog.duolingo.com/streak-milestone-design-animation
- Viseme count, frame counts, durations in ms: **[Unverified]** — primary posts would not load.

## 2.11 Published numbers tied to mechanics

| Mechanic | Number | Source |
|---|---|---|
| Leaderboards | "Overall learning time increased by 17%"; highly engaged learners (≥1 h/day, 5 days/week) "tripled" | [Web] https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth |
| Retention programme overall | CURR up 21%; "reduction in the daily churn of our best users by over 40%"; DAU 4.5x in four years | [Web] same |
| Why retention | "CURR had a gigantic impact on DAU—5 times the impact of the second-best metric." | [Web] same |
| Streak depth | share of DAU with 7+ day streak "increased almost 3 times to more than half of our DAU" | [Web] same |
| Streak saver notification | "first big win", no figure | [Web] same |
| Referral programme (failed copy of Uber) | "new users increased by only 3%" | [Web] same |
| 7-day streak | learners who reach it are 3.6x more likely to complete their course | [Snippet] https://blog.duolingo.com/how-duolingo-streak-builds-habit |
| 7-day streak | 2.4x more likely to use the app the next day than learners without a streak | [Snippet] https://blog.duolingo.com/improving-the-streak |
| Streak Freeze | allowing two equipped freezes raised daily active learners by 0.38% | [Snippet] https://blog.duolingo.com/improving-the-streak |
| Streak animation | +1.7% day-7 retention for new learners | [Snippet] https://blog.duolingo.com/how-duolingo-streak-builds-habit |
| Streak experiments | 600+ experiments on the streak | [Web] https://www.lennysnewsletter.com/p/duolingo-streaks |
| Long streaks | "over 9 million users with a year plus streak" (Dec 2024 podcast) | [Snippet] https://www.lennysnewsletter.com/p/duolingo-streaks |
| Widget | half of learners with the widget have a streak of 6+ months; widget users retain better after controlling for commitment; no % given | [Snippet] https://blog.duolingo.com/widget-feature |
| Notification bandit | trained on ~200 million reminders over 34 days; more learners completed lessons "within a matter of weeks"; no % in what I could read | [Snippet] https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/ ; paper https://research.duolingo.com/papers/yancey.kdd20.pdf |
| Delayed signup | ~20% DAU; later wall tuning 8.2% DAU (interview, second-hand) | [Snippet] https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker |
| In-app claim | "You'll be 5x more likely to complete the course!" (5-day streak goal) | [Screen] https://mobbin.com/screens/0164fbbf-cd13-4c13-90f0-336963decf5f |

Not confirmed: "widget +60%" (no source found); bandit paper lift percentages; 23.5-hour reminder timing.

## 2.12 Where it gets annoying (quoted)

- Gamification anxiety: "The excessive gamification is also slowly building up my anxiety and growing the urge to just walk away from the platform entirely." [Snippet] https://androidauthority.com/duolingo-xp-boost-ux-trap-3674572
- Streak guilt + paid repair: a commenter says they "intentionally break my Duolingo streak every Shabbat so I don't get a high number and feel guilted into paying $4 to fix it." [Snippet] https://annehelen.substack.com/p/how-did-we-get-so-obsessed-with-streaks/comments
- Burnout: a Reddit search for "Duolingo burnout" returns pages of users fed up, per The Decision Lab. [Snippet] https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification
- Long-streak loss as an exit: losing a long streak "provides a convenient exit point" for loyal users. [Snippet] https://uxdesign.cc/3-reframing-streaks-on-duolingo-5-ideas-for-a-more-healthy-and-flexible-approach-to-language-8fd89545771e
- Personified guilt: user who stayed away 32 days felt "like Duolingo was upset with me". [Snippet] https://www.lemon8-app.com/@user305163899/7629331722475192846?region=us
- Energy replacing hearts (2025): 25 energy units that drain on every exercise, right or wrong; Super/Max get unlimited. Reddit: "if Duolingo really wanted the energy system to work, they would improve on the heart system, not make it worse". [Snippet] https://techissuestoday.com/duolingo-energy-system-user-backlash ; thread https://www.reddit.com/r/duolingo/comments/1l5wmyl/
- Petitions: "Duolingo: Hearts, Not Energy". [Snippet] https://www.change.org/p/duolingo-hearts-not-energy
- Direct Reddit pages returned 403 to the fetcher; all Reddit quotes above are via secondary pages. **[Unverified]** against the original threads.

## 2.13 What transfers to CBT logging

Transfers:
- Size the task in the ask ("your first 2 minute lesson").
- Commitment button in first person ("I'm committed") after the first completed entry, not before.
- Minimum unit keeps the day (one lesson) — define a one-tap minimum CBT entry.
- Freeze shown as protection after the fact ("You protected your 5 day streak"), plus a weekly-target option.
- Completion title names what the user did well ("Word wizard!") → e.g. name the skill used ("Spotted a mind-read").
- Recognition before production: distortion chips and word-bank reframes before free text.
- Nested clocks (daily / weekly / monthly) with a different cast character per month.
- "Protect the channel": cap notifications, and a self-silencing message after ignored reminders.
- Notification priming by the character before the OS dialog.

Does not transfer:
- Escalating widget states ("Last chance!", angry Duo) and mock-hurt notifications.
- PERFECT vs GOOD labels that mark freeze days as lesser.
- Leagues/XP races — comparison on mental-health entries.
- Energy/hearts that stop a session; paid streak repair.
- Red "Incorrect" sheets: a named distortion is not right/wrong.

---

# Could not verify (summary)

1. Duolingo primary blog posts and the KDD notification paper would not load (503). Figures 3.6x, 2.4x, 0.38%, 1.7%, widget 6-month stat, 200M reminders are from search excerpts of those pages.
2. Any Duolingo animation timing numbers (ms, frames, viseme count).
3. Reminder timing (23.5 h) and bandit lift percentages.
4. "Widget +60%" — no source.
5. Duolingo streak-lost / repair / out-of-energy screens, Year in Review — not viewed.
6. BitePal: what happens at 0 hearts; streak loss/freeze; notification send times; voice logging; pet evolution; any retention data; any founder interview; Reddit threads.
7. BitePal download figure is ambiguous in the only source (lifetime vs monthly).
8. All motion observations are from stills.
