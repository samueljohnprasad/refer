# Finch: Self-Care Pet — engagement deep dive

Research date: 2026-11-15. Scope: how Finch gets users to do effortful logging (goals, reflections, mood naming), for a CBT app.

**Evidence rules used here**

- "Screen:" = I looked at the Mobbin screenshot (iOS, captured ~Aug 2025 per dates visible in screens). Copy in quotes is transcribed from the image.
- "Inference:" = my reading, not stated by a source.
- Mobbin flow results show a sample of each flow's screens, not all. Where I cite a flow, I only describe screens I saw.
- Not reachable: Reddit (blocked for this crawler), Finch Notion FAQ / founder AMA transcripts (JS-only, returned empty), App Store page (HTTP 429), TV Tropes, two Pratt design critiques, Headway review (connection errors). Anything depending on those is marked unverified.

Mobbin link shorthand (all `https://mobbin.com/...`):

| Tag | Link |
|---|---|
| F-ONB | [Onboarding flow, 21 screens](https://mobbin.com/flows/80ef83ef-f872-4825-b18d-6b193d60a9aa?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-GOALSETUP | [Setting up goals, 6 screens](https://mobbin.com/flows/19212698-61fe-43ca-9144-60c9e73bbcd2?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-START | [Starting today, 6 screens](https://mobbin.com/flows/c4ee7e34-62f5-448e-97a6-a31167cef41c?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-COMPLETE | [Completing a goal, 13 screens](https://mobbin.com/flows/2d8a4c8a-20d1-4239-b528-c4fbd26742a7?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-GOALSTATS | [Goal stats](https://mobbin.com/flows/08a13ba9-335e-43ca-89b2-579180ba37e2?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-GOALDETAIL | [Goal detail](https://mobbin.com/flows/46fdeb15-3c14-4027-942c-c8c4d417a134?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-MILESTONE | [Claiming a milestone (area detail)](https://mobbin.com/flows/06c82412-8f84-4bda-acda-e9bb065ca508?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-MILESTONEQ | [Claiming a milestone (Quests)](https://mobbin.com/flows/f9db79f5-0f15-474a-8756-5ff201c81062?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-LINKED | [Creating a linked goal](https://mobbin.com/flows/8790a3e0-0e55-4984-94f0-0685e48988ff?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-AREA | [Adding a goal to an area](https://mobbin.com/flows/0f0d4bd7-d532-4449-bc8f-5c541e58095c?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-IDEAS | [Adding a goal (goal ideas)](https://mobbin.com/flows/bebf1de7-904b-4073-944b-7fa51d350495?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-EDIT | [Editing a goal](https://mobbin.com/flows/9cbd2fb9-f309-47b5-b97d-d97cd1bffc3f?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-FIRSTAID | [Completing an activity (first aid kit), 11 screens](https://mobbin.com/flows/aaa1bd6f-8c79-446d-a489-b2563ed7f020?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-MOOD | [Logging a mood](https://mobbin.com/flows/91038415-4ded-44c2-9342-065adb9e82fb?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-ACTIVITIES | [Activities](https://mobbin.com/flows/bf29449c-3dcf-4326-b6d0-40a00d19aa6f?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-REPORT | [Daily report](https://mobbin.com/flows/c708f93d-0875-4c80-a754-b41d8318772b?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-PLUS | [Claiming free preview of Finch Plus](https://mobbin.com/flows/d8578ebe-5d78-45e4-9b88-e653e2665e5d?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| F-NOTIF | [Turning on notifications](https://mobbin.com/flows/e42398a2-8533-456c-ae25-eccac28f5de3?tab=screens&utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |

Individual screens are linked inline as `[S](url)`.

---

## 1. Daily loop, open to close

Observed order (assembled from several flows; exact order on a mature account may differ).

1. **Day-open interstitial.** Purple full screen: "DAY 1", "Happy Satur-Yay!", "Baby Lee has butterflies seeing you.", then a lightning icon and "Help Baby Lee gain full energy today so she can go out to explore and grow!", one button "Start today". Screen: F-ONB, F-START.
   - The ask is framed as helping the bird, not doing your tasks.
2. **Streak beat.** Blue full screen, "2 DAY STREAK", week row S S M T W T F with ticks, "Open the app and visit Lee every day to maintain your self-care streak!", button "Let's go!". Screen: F-START.
   - Streak = opening the app. Finch help: a day counts when you open the app, "just checking in is enough!" ([Understanding Streaks](https://help.finchcare.com/hc/en-us/articles/37780736136205-Understanding-Streaks)).
3. **Morning mood.** Bottom sheet over home: "How are you feeling right now?" with 5 faces (very sad to very happy). One tap. Toast afterwards: "Your mood is logged!" with confetti. Screen: [S](https://mobbin.com/screens/da33ee36-920b-4002-8f23-cb1bb53cb85b?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), F-MOOD.
   - Mood asked several times a day: "The app will ask you about your mood multiple times a day." ([Engadget, Mar 11 2025](https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html)). A reviewer reports check-ins for the day ahead, afternoon, and end of day ([Android Authority, Apr 4 2025](https://www.androidauthority.com/finch-habit-tracker-app-hands-on-3537434/)).
   - Insights later split these into "MOTIVATION — Your outlook on each day." and "SATISFACTION — Your satisfaction at the end of each day." Screen: [S](https://mobbin.com/screens/e7860cc1-d1db-48a5-9d0a-c389ba42fa16?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp). Inference: morning check-in = motivation, evening = satisfaction.
4. **Home.** Top third: bird in its room. Middle: energy card "1st Adventure 0 / 15", "Gain ⚡ energy so Lee can go discover new things today!". Below: "7 goals left for today!" and goal rows, each "5 ⚡" with a tick button. Tab bar: Home, Quests, Shop, Friends, Bag, [bird name]. Screen: [S](https://mobbin.com/screens/18d270f7-7eb4-448f-a928-174b4a7a7aa3?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
5. **Tick goals.** First tick: energy bar 5 / 15, toast "You're amazing! First time completion!". Screen: [S](https://mobbin.com/screens/a36bbc85-679f-4396-b907-739d2bba480e?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
6. **Energy full.** Full-screen: bar reads "MAX", "Woohoo!", confetti, then "Lee drank Water and energized for Day 1" and "Lee got +139 Rainbow Stones", button "Continue". Screen: F-COMPLETE.
7. **Bird leaves.** "New adventure started!", dotted track from ⚡ to "?", "Lee will have something to share with you after she completes today's adventure in 7:59:56.", button "Got it!". Screen: [S](https://mobbin.com/screens/32d7a2f7-952b-4836-aa11-1714c50b2170?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - Home now shows the bird walking with a backpack and "Adventuring — back in 7:29:37". Screen: [S](https://mobbin.com/screens/1111b645-1b13-4849-b9e4-e642b37b4954?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - Duration: 8 h countdown on screen. A reviewer says "about six hours later" ([Android Authority](https://www.androidauthority.com/finch-habit-tracker-app-hands-on-3537434/)). Inference: the gap is the time shaved by extra goals (next item).
8. **Goals done while the bird is away.** Sheet: "Hooray! Lee found 3 Rainbow Stones and will be back 10 minutes sooner!". Other observed pairs: 3 stones / 12 min, 5 stones / 20 min, 15 stones / 60 min. Screens: [S](https://mobbin.com/screens/4e5ebecb-537b-4aee-bbdf-e2f73aa00c2a?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/7d6a3f9c-bbf7-4287-9d8a-3780856bcf38?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/381bab9d-f396-46c0-97c7-afe4b3d5c172?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/10124cd6-3384-45c7-b62e-1e5f49ebdbcf?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - Help centre confirms stones come from "completing goals after your birb has returned from its daily adventure" plus quests, event days, milestones ([Energy vs Rainbow Stones](https://help.finchcare.com/hc/en-us/articles/37780134479757-Energy-vs-Rainbow-Stones)). Note the help text says "after returned"; the screens show stones during the adventure too.
9. **Return of the bird.** Sequence seen: "Lee discovered Cherries!" (item glowing above bird) → story screen with speech bubble "You just opened my eyes to a whole new world, cheep!", cards "New Discovery — Loves Cherries" and "Lee gained +5.5 Compassion", link "Reflect on story", button "Done" → map "Day 2 of exploring Finchie Forest — 3% complete". Screens: [S](https://mobbin.com/screens/a422944d-616b-440f-8492-c8def28d1989?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/b81477a0-dcc8-4751-ac87-9c093a02fc1e?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/4c4de77e-b5ad-49c5-849a-0a98c951edb5?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - Home afterwards: bird asleep in nest with a thought bubble of cherries; card "1st Adventure completed! Lee discovered Cherries today". Screen: [S](https://mobbin.com/screens/7d6b1b1e-41e7-49bd-8526-d88301daeab6?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - "Reflect on story" turns the bird's discovery into a journaling prompt. Inference: the bird's story is the hook for the user's writing.
10. **Evening.** No dedicated "evening reflection" screen appeared in Mobbin. What I saw instead:
    - Reflections library with tabs MORNING / ENERGIZE / DEEP DIVES / CALM. Screen: [S](https://mobbin.com/screens/1a65c78f-c573-4d5c-933f-32756f0f2bf9?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp). Inference: the list is time-of-day sorted; I did not see an EVENING tab (tabs scroll off-screen).
    - Day history page: date, a quote ("Talk to yourself like you would to someone you love."), then GOALS and REFLECTIONS lists. Filled example lists goals with "Completed 3x in a row!", "First time completion!", reflections with mood face, plus BREATHWORK / DEEP DIVES / MOVEMENT entries. Screens: [S](https://mobbin.com/screens/aab675a1-f7f7-446c-aa46-2f6f5175ee44?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/88256d19-d83b-449a-9d38-414f7eed3e1f?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
    - Unverified: exact evening check-in copy.

Loop summary (Inference): open → greeted by bird → 1-tap mood → 3 tiny ticks fill energy → celebration → bird leaves for ~8 h → reason to return later → discovery + stat gain → optional reflection.

---

## 2. Goals: creation, sizing, check-off

**Creation in onboarding**

- "What areas would you like support with?" multi-select. Visible options: "Strengthen social skills and connections", "Manage stress and anxiety", "Appreciate the good things", "Stay fresh and clean", "Build and keep a routine". Screen: F-ONB.
- Output: "Sam Lee's starter plan — Try these easy goals with Lee!" with 7 goals: "Get out of bed", "Brush teeth", "Wash my face", "Drink water", "Take a stretch break", "Do one thing that makes me happy", "Take 3 deep breaths". Bird bubble: "You got this, cheep!". Button "Let's do it!". Screen: F-ONB.
- User writes nothing. All 7 are pre-filled.

**Sizing**

- Every starter goal = 5 ⚡. First adventure needs 15 ⚡. Screen: [S](https://mobbin.com/screens/18d270f7-7eb4-448f-a928-174b4a7a7aa3?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- So 3 of 7 goals (43%) finishes the day's core loop. "Get out of bed" + "Brush teeth" + "Drink water" is enough. Inference: threshold is set so a bad day still succeeds.
- Other seen goals: "Literally survive the day" (area: Calm), "Stand up for 10 seconds", "Choose a healthy snack", "Eat fruits". Screens: [S](https://mobbin.com/screens/9ba350e7-f5ed-47f4-80f0-cc5bdb4f188d?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/48a1abab-bae0-427d-a75e-c0b89403adbc?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Exercises carry more energy: "Do a mindful breathing exercise 5+ ⚡", deep-dive reflections 30 ⚡. Screens: [S](https://mobbin.com/screens/48a1abab-bae0-427d-a75e-c0b89403adbc?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/1a65c78f-c573-4d5c-933f-32756f0f2bf9?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Copy reinforces small: "Tiny task? Done and dusted!", "Small steps, strong roots!", "Let's do one thing at a time, cheep!", "You're planting the seeds of a habit!". Screen: F-COMPLETE, F-MILESTONE.

**Why tiny — founder statements found**

- Budi (Nino): "To take care of yourself, you don't actually need a lot—you just need consistency and motivation," and "Motivation is as important as what you do, and that underlies everything we do at Finch." ([Paste, Jan 10 2023](https://www.pastemagazine.com/tech/finch/finch-app-mental-health-virtual-pet-self-care)).
- Yuan: they "found self-care challenging to stick with, so we were hoping to make self-care fun and accessible" (same Paste article).
- Yuan cites game designer Jane McGonigal as inspiration; "In Finch, you go very heavy into one pet you really care about." ([Disha Bhatia Substack](https://dishabhatia.substack.com/p/the-self-care-bird-app-finch)).
- Not found: a founder quote that literally says "we made goals tiny because X". Unverified.

**Adding goals later**

- Editor titled "What's the important thing you want to do today?": a plain list, last row "Tap to add goal!", a lightbulb button for ideas. Keywords auto-highlight in purple ("Drink **water**"). Screen: F-IDEAS.
- "Goal ideas" sheet with tabs EXERCISE / LOVED ONES / PRESENCE / TIDY UP (more off-screen); each idea has + and ×; bottom button "Add my own Goal". Tidy-up examples: "Make my bed", "Pick clothes off the floor", "Declutter my desk". Screen: F-IDEAS.
- Goal settings: emoji, title, "Invite a Goal Buddy — Team up with a friend to complete this goal", self-care area, time, "Notify me" toggle (off by default on the screen seen), repeat, "Times per day" stepper, "Keep this goal until complete", "Link an exercise — Select an exercise to start automatically", and Pause / Archive / Delete. Screens: F-EDIT, F-AREA.
- Self-care areas seen: Calm, Nutrition, Productivity, Movement, Self-kindness, Sleep, Gratitude, Hygiene (list continues). Screen: F-AREA.

**Check-off**

- One tap on the tick in the row. No confirm.
- Long-press / tap row opens a sheet with three actions: "Skip" (kite icon), "Complete" (big tick), "Snooze" (calendar), plus "Set as goal of the day", stats and edit icons. Screen: F-GOALDETAIL, F-COMPLETE.
- Goals with a linked exercise show a play button and "Start" in place of "Complete", plus "I already did this". Screen: F-EDIT.
- Skip is a first-class, non-punishing action. After skipping: "YOU SKIPPED — Drink water", "Dig deeper? More exercises for you", card "Goal Reflection — What made you skip 'Drink water'? 2+ ⚡", "Undo", "Done". Screen: [S](https://mobbin.com/screens/ad73f73e-009d-4651-823d-5a64327f97cd?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - Reflecting on a skip earns energy. Inference: a missed task becomes a rewarded log.
- Per-goal stats: month calendar with ticks, "4 this month", "4 all time". Screen: F-GOALSTATS.
- Typical load reported by one user: "more than 20" goals a day ([Engadget](https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html)). Screens show 7 → 13 goals within the first ~10 days.

---

## 3. Reflections without a blank page

Five layers, lightest to heaviest.

1. **Faces (1 tap).** "How are you feeling right now?" 5 emoji. Screen: [S](https://mobbin.com/screens/da33ee36-920b-4002-8f23-cb1bb53cb85b?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
2. **Funnel of chips ("Name your emotion", First Aid Kit, 5 ⚡).** Screens: F-FIRSTAID, [S](https://mobbin.com/screens/961d08f4-3a57-43ec-8c89-a1add0f2f837?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/3bc93ed2-2835-415f-ba15-6bf094236d42?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/c211d1a4-5cb7-4e22-9130-46de8b75ff58?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/b2649bef-8a87-4874-aa5c-d0dbe7317557?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - Intro: "Name your emotion — Sometimes, what we feel is not so obvious. Naming the emotion can help us gain better control and understanding of ourselves." Button "Start".
   - Step 1: "Start by taking a minute to pause and notice what you are feeling" → 3 chips: Pleasant / Neutral / Unpleasant.
   - Step 2: "Try to dig a little deeper" → scrolling column of specific words. For Neutral I counted 17 visible across two screenshots: Content, Fulfilled, Accepted, Good, Calm, Mellow, Peaceful, Comfortable, Balanced, Thoughtful, Interested, Trusting, Bored, Meh, Indifferent, Tired (+ possibly more off-screen). Multi-select.
   - Step 3: "What made you feel **calm, balanced**?" → 8 people chips (Family, Myself, Health, Pets, Co-workers, Friends, Partner, Acquaintances) + 6 place/activity chips (Work, Home, School, Hobby, Commuting, Outside) → optional text box "Add details or more reflection..." → "Save".
   - Text is optional and comes last. A complete entry needs 0 typed characters.
   - CBT relevance (Inference): this is the same shape as picking a distortion — coarse bucket first, then a specific label, then context tags, then optional free text.
3. **One-question prompts (2–3+ ⚡).** Reflections list items show the question as the subtitle so the user picks a question, not a blank page: "Morning Reflection — What made you happy today?" (3+), "Sleep Reflection — How did your mind feel when you woke up?" (3+), "Hype Machine — What do you look forward to today?" (2+), "Meal Time — What can you appreciate from today's meals?" (2+), "Confidence Booster — What is one small thing you can do today to live closer to your values?" (2+). Screen: [S](https://mobbin.com/screens/1a65c78f-c573-4d5c-933f-32756f0f2bf9?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - "Free form" exists but is a small secondary link top-right. Blank page is opt-in.
   - Energy counter sits bottom-left of the text field. It read 0 ⚡ when empty and 3 ⚡ after typing "It was hard but worth it!". Screens: [S](https://mobbin.com/screens/25be8890-f225-477a-ad27-185b58b05bed?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/191c3258-0fbc-4ab1-9994-20aab2bd95b6?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp). Inference: energy grows with characters typed — the "2+" / "3+" labels are floors. A live reward meter for writing.
4. **Goal-anchored prompts.** After a completion: "REFLECT ON YOUR PROGRESS — Get out of bed — First time completion!" with three cards: "Goal Reflection — How did 'Get out of bed' go?", "Goal Look Forward — What can you look forward to from accomplishing this goal?", "Goal Lookback — How do you feel about the progress of this goal so far?" (2+ ⚡ each). Screen: [S](https://mobbin.com/screens/5fb6d536-2c6e-445c-bcbc-9b8aa4fc4aa6?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - The prompt is generated from something the user just did. No topic to invent.
5. **Deep dives (30 ⚡, multi-step).** "Savoring Pleasant Moments": segmented progress bar (7 segments visible), one question per screen, with an example under the question: "What is a moment in your past that you enjoyed or are grateful for?" / "This might be a hot cup of coffee during a cold morning, or feeling a cool breeze on a hot summer day." / placeholder "Start writing...". Includes a do-something-offline step: "Take a few minutes and go do something that brings you joy... Come back here when you are finished." Ends with "Summary" replaying every question with the user's answer, button "Done 30 ⚡". Screens: [S](https://mobbin.com/screens/f2812cba-fcbe-4442-b923-3f04070b625b?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/0d739a65-77d2-4ca5-8089-1cb6c4ec8d48?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/46bc26b8-3f04-4a9e-b206-47ef103f1723?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
   - Other deep dives seen in lists: "Loving-Kindness", "Managing your Triggers — Handle difficult situations that cause emotional distress", "What would you say to a loved one? — Direct compassion inwards towards yourself" (all 30 ⚡). Screens: [S](https://mobbin.com/screens/17120311-91e1-4980-8a14-b07ca9e53d39?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), F-LINKED.
   - CBT relevance (Inference): the deep dive is the closest analogue to a thought record — one field per screen, worked example under each question, summary card at the end, 6x the reward of a tick.

**First Aid Kit** (pink screen, "Helpline" button top-right). Items and energy: Name your emotion 5, Repeat an Affirmation 5, 3-3-3 Rule 5, Rant Zone ("What's bothering you today?") 2+, Rainbow Grounding 5, Anxiety Breathing 10+, Processing Grief 4+, 5 to 1 Technique 5. Screen: [S](https://mobbin.com/screens/a057550d-5b73-4af4-aa54-c28ff457e817?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).

- It stays reachable in Pause Mode: "No goals and distractions. First Aid Kit is still here if you need it." Screen: [S](https://mobbin.com/screens/a5edeeba-6436-4e55-a691-63b508711579?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).

**Other structured inputs**

- Weekly check: "How satisfied are you with your effort this past week?" 5 star-faces; picking one shows a caption ("I'm happy with the progress I made"). Then "What have you felt good about last week?" with 18 chips (Sleep, Nutrition, Physical activities, Mindfulness, Relaxation, Nature, School, Work, Family, Friends, Partner, Pet, Community, Learning, Productivity, Achievement, Hobbies, Creativity). Screens: [S](https://mobbin.com/screens/8a4af42d-f8a0-4f90-b487-dc1052c840d5?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/2a5ba5d8-666d-446d-9fd0-d524a19ac574?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Quizzes: "Before we begin... Do you think you had high anxiety recently?" A No / B A little / C Yes / D I don't know; later "How difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?" (wording matches the GAD-7 / PHQ functional item — Inference). Screens: [S](https://mobbin.com/screens/818156c3-aa22-4ab5-8148-38d750700fb0?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/8be844d3-23e4-4502-801c-cacba686cbb9?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Activities hub: Goal Ideas, Reflections, Breathe, Quizzes, Soundscapes, Movements, Timers, Act of Kindness, First Aid Kit (9 tiles). Screen: F-ACTIVITIES.

---

## 4. Energy → adventure → growth

- **Energy sources.** "Earned by completing goals and doing self-care activities." ([Finch help](https://help.finchcare.com/hc/en-us/articles/37780134479757-Energy-vs-Rainbow-Stones)). On screen: goal 5, short exercise 5–10+, prompt reflection 2–4+, deep dive 30, body quiz 20.
- **Threshold.** 15 ⚡ on adventures 1–4; 20 ⚡ on adventures 9–10. Screens: [S](https://mobbin.com/screens/18d270f7-7eb4-448f-a928-174b4a7a7aa3?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/70aafcf7-8d66-4cd7-9b2a-d5c782031056?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/cca89013-d652-4235-a629-f9a8c61cadcd?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/ce199250-54a6-4631-a776-ff3c04788dce?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - A 2022 review says 25 points ([Substack](https://dishabhatia.substack.com/p/the-self-care-bird-app-finch)). Inference: threshold rises slowly with age (15 → 20 → 25), i.e. 3 → 4 → 5 basic goals. Exact schedule unverified.
- **One adventure per day.** Counter is "Nth Adventure" and the story screen says "Day 2 of exploring Finchie Forest". Help: "Energize your birb daily to make progress" ([Seasonal Event Overview](https://help.finchcare.com/hc/en-us/articles/37780438941965-Seasonal-Event-Overview)).
- **Adventure length.** 8:00:00 countdown at start; extra goals shorten it (10–60 min each). See section 1.
- **What comes back.**
  - A discovery (object or idea): "Cherries", "Baby Shark". Screens: [S](https://mobbin.com/screens/7d6b1b1e-41e7-49bd-8526-d88301daeab6?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/9ba350e7-f5ed-47f4-80f0-cc5bdb4f188d?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - A preference learned: "New Discovery — Loves Cherries".
  - A personality stat: "+5.5 Compassion", "+5.3 Logic". Screens: [S](https://mobbin.com/screens/b81477a0-dcc8-4751-ac87-9c093a02fc1e?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/dd5c38f7-7e57-418e-8d3d-e204b6e494db?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp). Profile shows a 6-axis personality hexagon. Screen: [S](https://mobbin.com/screens/1ed28d2d-6239-4d88-b6ed-7261f2b41405?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - Map progress: "3% complete" of Finchie Forest after 2 days. Inference: ~60+ days per area.
- **Rainbow Stones.** +139 on first energize; 3–15 per extra goal. Prices: clothing 300 / 500 / 900; dyes 300 / 900; daily "50% OFF SALE" item 450; "Blue Hippie Headband" 250; streak repair list price 2,000. Screens: [S](https://mobbin.com/screens/9dc19213-f77f-432e-93b8-35256e7604cb?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/58e901f0-3f98-4766-a46e-4b70b38babfb?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/6c24e0bf-1aef-4362-865e-e9bbb6210c63?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - Balance seen growing 344 → 994 → 2,449 → 5,918 across captures. Inference: a cheap item is ~2–3 days of play.
- **Growth stages.** Quest card: "Evolve Lee to a Toddler — Go on 7 adventures — 3 / 7". Screen: F-MILESTONEQ. Bird is labelled "Baby Lee"; profile shows age in days, weight, height, wingspan ("3.1g", "0.9cm"). Screen: [S](https://mobbin.com/screens/9b506c9c-3ea1-4882-b6ed-b72adc3b9950?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - Finch FAQ (via search snippet; page itself not loadable): toddler after 7 adventure days; 67 adventure days total to adult ([Finch FAQ](https://befinch.notion.site/Finch-FAQ-474652d0123d4883ac7a0cd6c8f5aa70)). Intermediate thresholds unverified.
  - Growth counts adventure days, not calendar days. Inference: absence pauses growth; it never reverses.
- **Friendship meter.** Profile row "FRIENDSHIP — Pals ♥". Screen: same profile. Levels unverified.

---

## 5. When the user is doing badly

**Low mood**

- First Aid Kit is one tap from home (icon top-right) and has a "Helpline" link. Screen: [S](https://mobbin.com/screens/a057550d-5b73-4af4-aa54-c28ff457e817?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Engadget: the First Aid Kit offers activities when mood check-ins show distress ([Engadget](https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html)).
- Friends: "Need a little extra support? Lee will ask a friend or two to send you a BIG birb hug!" → "Request a hug" / "Maybe later"; home bubble "Big hug for you!". Screens: [S](https://mobbin.com/screens/5635dfd7-ec41-4a33-ad1a-59b44e35c947?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/cca89013-d652-4235-a629-f9a8c61cadcd?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Friends can send a single goal as encouragement: "You can do it, cheep!" + "Take 3 deep breaths", button "Send back Good Vibes". Screen: [S](https://mobbin.com/screens/3831e0f3-a0d5-47ec-977e-2b4e82775609?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Not captured: the exact screen shown immediately after tapping the saddest face. Unverified.

**Missed days**

- Return screen: bird holding a wooden mallet, bubble "It's okay to miss a day. The important thing is you're here today, cheep!", "Repair your 2 day streak? Save your streak to keep it alive!", button "Repair for ~~2,000~~ FREE!" tagged "1ST TIME OFFER", second button "Start over". Screen: [S](https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Choosing start over: "Are you sure you want to start your 10 day streak over?" → "Yes, start over" / "No, back to repair". Screen: [S](https://mobbin.com/screens/50df8ab5-8949-4b15-84a3-27f67dc18c1a?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Earned buffer: "You earned a free Streak Repair! With this one-time Repair, you can miss one day without losing your streak." → "Claim". Streak page shows "1/2 ON HAND". Screens: [S](https://mobbin.com/screens/6eff9964-d13f-4f24-8718-af13911bf158?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/dc8d14c8-3908-497e-9ec4-82a26ef4eb15?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - Rule: one free saver every 3 adventures, max 2 stored; otherwise pay Rainbow Stones ([Understanding Streaks](https://help.finchcare.com/hc/en-us/articles/37780736136205-Understanding-Streaks)).
- Opt-out: "Don't find Streaks motivating? You can turn them off if you want." Toggles: "Pause mode — Take a break and preserve your progress.", "Enable daily check-in streaks", "Adjust day boundary — New day starts at 4:00am". Screens: [S](https://mobbin.com/screens/dc8d14c8-3908-497e-9ec4-82a26ef4eb15?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/ce90ce6e-09da-45d1-a4b2-c6fe48c11b0c?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Pause Mode screen: bird in a meadow with a heart; "Pause mode is on", "FOR 1 MORE DAYS", "Your 3 day Streak is paused and preserved.", "No goals and distractions. First Aid Kit is still here if you need it.", "Take the time you need and continue your progress anytime.", button "Turn Pause mode off". Screen: [S](https://mobbin.com/screens/a5edeeba-6436-4e55-a691-63b508711579?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
  - User picks number of days and an optional reminder ([Pause Mode help](https://help.finchcare.com/hc/en-us/articles/37936144770701-Pause-Mode)).
- Single goals and whole areas can be paused too: "PAUSED — Productivity — Feeling ready to jump back in? — Resume area". Screen: [S](https://mobbin.com/screens/a86fb86e-d3f7-49cc-9caa-2425306760b8?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp). Toast "Paused goal: Stand up for 10 seconds". Screen: [S](https://mobbin.com/screens/48a1abab-bae0-427d-a75e-c0b89403adbc?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).

**The pet on absence**

- No death, sickness, or sad-bird screen appears anywhere in the ~150 Finch screens I viewed. The only negative-leaning bird pose is a "?" over its head (trial ended; streak settings). Screens: [S](https://mobbin.com/screens/fa147bb8-a2bb-4c99-bf87-00f28bc44e15?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Reviewers: "Finch doesn't take the guilt approach to goal-tracking, so you won't be scolded or shamed." and "There aren't really any consequences." ([Engadget](https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html)). Bustle contrasts it with apps that "guilt you into coming back" ([Bustle, Dec 9 2024](https://www.bustle.com/wellness/finch-app-review-features-price)).
- Unverified: an official Finch statement that the bird never dies or gets sad (the FAQ would not load). Absence of evidence in screens + reviewer reports only.

**Where it still hurts**

- Streak resets are the main emotional injury in reviews: a 3-star iOS review titled "sad, just sad" (Mar 2026) describes a 234-day streak reset after two missed days with no repair; a 1-star titled "Finch broke my heart I cried for days" (Jul 2026) describes losing bird and two-year streak after a logout ([Appbot analysis](https://appbot.co/blog/finch-app-reviews-emotional-attachment-user-retention-product-loyalty/)).
- Engadget writer broke a 32-day streak, was disappointed, said it "only made me want to do better" ([Engadget](https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html)).
- Inference: repair covers 1 missed day; a 2+ day lapse (the likeliest pattern in a depressive dip) is exactly where protection runs out.

---

## 6. Softened versus Duolingo

| Mechanic | Finch (observed) | Source |
|---|---|---|
| Streak unit | App open, not task completion | [Help](https://help.finchcare.com/hc/en-us/articles/37780736136205-Understanding-Streaks), F-START |
| Streak loss copy | "It's okay to miss a day. The important thing is you're here today, cheep!" | [S](https://mobbin.com/screens/d6e7a7b1-4b61-40b1-8ff7-1c602badec85?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Streak repair | First one free; then stones (2,000 listed); earned savers every 3 adventures, max 2 | same + Help |
| Streak off switch | "Don't find Streaks motivating? You can turn them off if you want." | [S](https://mobbin.com/screens/dc8d14c8-3908-497e-9ec4-82a26ef4eb15?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Planned break | Pause Mode, user-chosen days, streak frozen | [Help](https://help.finchcare.com/hc/en-us/articles/37936144770701-Pause-Mode) |
| Day boundary | 4:00am default, adjustable | same screen |
| Skip | Named action with its own icon; reflection on skip earns energy | [S](https://mobbin.com/screens/ad73f73e-009d-4651-823d-5a64327f97cd?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Penalties | None seen: no hearts/lives, no energy loss, no pet decay | all screens viewed |
| Leaderboards | None seen. Friends tab = visits, hugs, "good vibes", goal buddy. Friends "cannot see any data about self-care" in events | [Finch event FAQ via search](https://befinch.notion.site/Seasonal-Event-with-Friends-FAQ-17d578a0b48e80eea189d522ef43a1fc), [S](https://mobbin.com/screens/978a5333-71dc-4c54-98e2-453bc041c5b8?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |
| Notification voice | From the bird, helpful content: "From Lee — Remember to drink water!"; permission ask "Get reminders from Lee" | F-ONB |
| Notification default | Per-goal "Notify me" toggle, off on the goal seen | F-EDIT |
| Events | Can be disabled in settings | [Help](https://help.finchcare.com/hc/en-us/articles/37780438941965-Seasonal-Event-Overview) |
| Suggestions | Any exercise can be muted ("Mute exercise", "Muted Suggestion — This will not be suggested anymore.") | F-LINKED, [S](https://mobbin.com/screens/12428435-397c-4fb9-8cb8-8325857c23e5?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp) |

Kept from the Duolingo playbook (Inference): streak counter with weekly row, full-screen streak celebration, quests tab, shop with timed refresh ("Items refresh: 10:26:04"), premium preview then upsell, referral rewards ("Invite 2 friends to get a Plushie").

Unverified: actual lapsed-user push copy (no captured examples; one secondary site flags "notification volume" as a complaint — [Unstar](https://unstar.app/blog/day-one-journey-reflectly-stoic-finch-journaling-apps-ranked-2026), not opened).

---

## 7. Customization and investment (onboarding order)

Order seen in F-ONB and related screens:

1. Splash: "Finch — Your new self-care best friend." Buttons "Hatch a new pet", "Have an invite?". Screen: [S](https://mobbin.com/screens/d57f16e6-eb3b-4562-810c-0c6be6eaf239?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
2. Hatch: "You hatched a birb!".
3. Pronouns: "Your birb's pronouns" — he/him, she/her, they/them. Screen: [S](https://mobbin.com/screens/ee7c33e0-5297-47f4-87ad-f2bd92522e9d?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
4. Name: "What do you want to name your baby birb? You can change this later." Field + "Shuffle" + "Next". Screen: [S](https://mobbin.com/screens/0b3973cb-4909-47e5-a90f-aa289957b6d4?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
5. Bird asks user's name in first person: "Cheep cheep, thanks for hatching me. If my name is Lee, what's your name?" placeholder "Name for Lee's human...", "Skip" available. Screen: [S](https://mobbin.com/screens/c23448ad-8352-480e-a283-b75872525307?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
6. "Let's learn a bit about you! Lee is curious about how she can grow with you." → support areas → starter plan.
7. Notification ask framed as the bird: "Get reminders from Lee".
8. Day 1 home. Outfits/furniture are not in onboarding; they arrive via Shop and quests ("Collect 5 pieces of clothing 3/5", "Obtain 5 decorations 1/5"). Screen: F-MILESTONEQ.
9. Day 1–2: micropet egg from "Professor Oat" ("You can tap on your Micropet egg any time to see how it's doing!"). Screen: F-ONB.
10. Day 2: 3-day Finch Plus preview ("3 exciting days of extra magic with Lee start right now!"). Screen: F-PLUS.

Colour and a trait are also picked according to a 2022 review ([Substack](https://dishabhatia.substack.com/p/the-self-care-bird-app-finch)); not seen in the 2025 screens. Unverified for current version.

Later investment surfaces:

- Wardrobe with slots (top, bottom, full, hat, glasses, ...), saved outfits ("SUMMER OUTFIT"), room furniture, colour dyes. Screens: [S](https://mobbin.com/screens/3123f162-ba4c-4d20-836d-267e864f7d32?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/68c8ddb0-5cd8-4f62-a076-665f2d17aa34?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Three shopkeepers with names: Mr. Prickles (clothes), Robin at "Finkea Furnishings", "The Color Studio". Screens: [S](https://mobbin.com/screens/58e901f0-3f98-4766-a46e-4b70b38babfb?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/7966062b-2480-48b7-abce-d868ca9eb345?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/92a0bac8-6cbb-44de-bfbe-22e8b56f3db4?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Identity items in the always-available catalogue: pride flags, mobility canes, glasses, hearing-device-like items at 300 stones. Screen: [S](https://mobbin.com/screens/e040e400-af06-4a66-a57e-35f80b927253?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Bird "passport" profile: age, friendship, human name, friend code, weight/height/wingspan, streak. Screen: [S](https://mobbin.com/screens/ef6def48-4a50-4003-84c7-df80f8e8f0a3?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Evidence the investment lands: 88 of 400 sampled positive reviews mention the bird as cute, named, or emotionally significant; ~96 reviews name their bird ([Appbot](https://appbot.co/blog/finch-app-reviews-emotional-attachment-user-retention-product-loyalty/)).

---

## 8. Rhythm and novelty

- **Daily:** new discovery each adventure; shop restock on a countdown ("Items refresh: 10:26:04"; pay stones or use a free shuffle to restock now); rotating home bubble ("Chat with her!", "You've got a special gift!", "Minty is visiting!"); daily quote on the history page. Screens: [S](https://mobbin.com/screens/58e901f0-3f98-4766-a46e-4b70b38babfb?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/c6b15a99-dcc3-4adb-a28b-b5dc2e4c1b6e?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/6e24c2f2-42f4-42da-9450-5c021b7d3678?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/0f6b8e74-9e69-400c-a4ed-02bd0d087320?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Every few goals:** micropet egg progress. "3RD GOAL COMPLETED! Woohoo! Your Micropet egg just got one step closer to hatching! — 4 goal completions until hatch!" (so 7 completions for the first egg — Inference). Hatched example: "Pumpkin the Piglet", "#25", "Gentle Nature", own 0/15 energy bar, "Growable to adult" toggle. Screens: F-COMPLETE, [S](https://mobbin.com/screens/9c762cfe-a65e-4ef8-beec-568ce9259d3e?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/4d5172c0-de2f-44d7-a7a4-7a8121522df0?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Weekly:** "Weekly Milestones — Earn stars with self-care areas!" e.g. "Calm — Do a goal for 2 days — Claim"; reset timer "3 days". Reward screen "A Shiny Star for You! 2 days of Calm goals done this week!". Three stars per area per week on a track. Screens: F-MILESTONEQ, F-MILESTONE.
  - Thresholds are days-per-week (2 of 7 for the first star), not daily perfection. Inference: weekly cadence forgives gaps.
- **Weekly:** "Lee's Newsletters — Personalized for you." item "The Weekly Feels — Mon, Aug 25". Screen: [S](https://mobbin.com/screens/bf974afa-862c-46c1-8c28-2258df7b52b4?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Milestone quests (one-off):** "Evolve Lee to a Toddler 3/7", "Collect 5 pieces of clothing", "Obtain 5 decorations", "Meet your first Micropet", "Visit 2 locations", each with a "Hint" button. Screen: F-MILESTONEQ.
- **Monthly / seasonal:** limited-time events with a banner on Quests; rewards furniture, clothes, exclusive micropet; progress = days you energized, not calendar days; micropet on day 25 (free) or day 20 (Plus); special editions "a few times a year"; can be disabled ([Seasonal Event Overview](https://help.finchcare.com/hc/en-us/articles/37780438941965-Seasonal-Event-Overview), [Event Calendar](https://help.finchcare.com/hc/en-us/articles/38508917050893-Understanding-the-Seasonal-Event-Calendar)).
  - Monthly goal challenges also exist (help-centre pages for Apr/May 2026 listed; content not read). Unverified detail.
- **Long arc:** growth stages (7 → 67 adventure days), map areas ("Travel" tab locked with "?" in shop). Screen: [S](https://mobbin.com/screens/58e901f0-3f98-4766-a46e-4b70b38babfb?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).

---

## 9. Data reflected back

- **Insights page:** "Mood calendar" heat grid (Jun–Aug, rows Mon–Sun), legend Positive / Neutral / Negative, filter "Overall"; buttons "See mood breakdown", "Explore your tags"; "Goals — 21 completed" (2 Weeks), "Most completed: Get out of bed — Completed 100% • 3/3 ...", "Most missed: Choose a healthy snack — Completed 50% • 1/2". Screen: [S](https://mobbin.com/screens/add954e6-9be5-4773-89bc-954f00f01f76?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Mood Breakdown:** "ALL MOODS — Your average mood throughout each day.", "MOTIVATION — Your outlook on each day.", "SATISFACTION — Your satisfaction at the end of each day."; each a Mon–Sun chart with three overlaid series: PAST MONTH / LAST WEEK / THIS WEEK. Screens: [S](https://mobbin.com/screens/df366c52-0929-41b5-a2bc-33d48d837f30?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/e7860cc1-d1db-48a5-9d0a-c389ba42fa16?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Tags:** words in goals/reflections auto-become tags (#Water). Tag page: "0 Positive Days, 0 Negative Days", own mood calendar, "Insights": Impact ("Add more reflections to see trends."), Goals, Positive Reflections, Negative Reflections, with time filter (2 Weeks / All Time). Screens: [S](https://mobbin.com/screens/ef99c39e-e903-490a-82b0-3fa3f2bbf38b?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/c95887d3-f041-4282-904c-f8207d99e833?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Weekly newsletter "The Weekly Feels":** sections CHECK INS, FEELINGS (morning motivation vs moods), "LIFTED YOU UP", "WEIGHED YOU DOWN" (tags correlated with good/bad moods; empty state "No tags found. Add more reflections to see what lifts you up."). Ends with a 1-tap poll "Which section was most interesting?". Screens: [S](https://mobbin.com/screens/682146ab-38c6-4c80-b76a-62783c164f95?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/7fb50710-fe8d-438c-a9d4-5e38a04cff20?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), F-REPORT.
  - Empty states sell the logging: every blank chart says "Add more reflections to see...". Inference: insight is the stated payoff for writing.
- **Per-goal:** calendar + "this month" / "all time" counts; run labels "Completed 3x in a row!". Screens: F-GOALSTATS, [S](https://mobbin.com/screens/54ca4df7-2bb5-4997-9452-f61270145ba2?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- **Plus gate:** more newsletters ("The Lee Times, Resolve Tribune, and Progress Post. See all history.") are paid. Screen: [S](https://mobbin.com/screens/204d7a28-0338-4929-b8ad-9144235e14e2?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).

---

## 10. Motion and reaction on completion

Seen in stills (motion direction inferred from static frames):

- Row tick → energy bar fills (0/15 → 5/15) → dark toast at the bottom with bird avatar: "You're amazing! First time completion!". Screen: [S](https://mobbin.com/screens/a36bbc85-679f-4396-b907-739d2bba480e?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Mood logged → toast "Your mood is logged!" + confetti over the list. Screen: F-MOOD.
- Energy max → full-screen takeover: bar "MAX" with a glowing bolt, "Woohoo!", confetti falling, bird eyes closed/happy; second frame adds reward lines and "Continue". Screen: F-COMPLETE.
- Milestone → full-screen, confetti, star with face, bird in a themed pose with a speech bubble. Screen: F-MILESTONE.
- Bird poses observed: sitting in nest (start of day), standing/waving, heart-hugging, walking with backpack, sleeping with "z", cleaning with duster (Productivity area), lying in flowers (Calm area), "?" confused, sparks around body when sped up.
- Tapping the bird makes it whistle ([Android Authority](https://www.androidauthority.com/finch-habit-tracker-app-hands-on-3537434/)).
- Home background changes with time of day (teal room; forest at dawn, sunset, night with moon). Screens: [S](https://mobbin.com/screens/7c5b20e8-19e5-42c2-a800-65f3bef5b958?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp), [S](https://mobbin.com/screens/1111b645-1b13-4849-b9e4-e642b37b4954?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).

Unknown (no video teardown found): animation durations, easing, sound effects on tick, haptics. Do not cite timings from this doc.

Pattern (Inference): three reward tiers by size — row-level toast for every tick, full-screen for daily threshold, full-screen + collectible for weekly milestone. Small acts never get a blocking modal.

---

## 11. What users love, ignore, complain about

**Aggregate** ([Appbot, 12 months to Aug 6 2026](https://appbot.co/blog/finch-app-reviews-emotional-attachment-user-retention-product-loyalty/))

- 40,294 reviews, 4.59 average; 82.0% five-star, 5.0% one-star.
- iOS 4.63 (16,942); Google Play 4.56 (23,352).
- Negative/mixed sample (1,200): bugs 32% iOS / 21% Play; pricing 27% / 21%; payment 16% / 11%; support 16% / 10%.
- Subscription cost complaints 13.8% iOS / 10% Play of the negative sample. Trial auto-charge surprise ~6.7%.
- Lost progress/bird/account: 28 reviews. Developer replies: 2 of 1,200.
- Positive sample (400): 88 mention the bird; 74 habits/routine; 34 mention depression, anxiety, ADHD, PTSD or grief; 24 mention self-care/journaling.
  - Inference: users praise the bird and habits ~3x more often than journaling. Reflection is the less-loved half.
- Bustle (Dec 2024): "over 500,000 reviews" across stores ([Bustle](https://www.bustle.com/wellness/finch-app-review-features-price)).

**Love**

- "Finch doesn't take the guilt approach to goal-tracking, so you won't be scolded or shamed." — Cheyenne MacDonald ([Engadget](https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html)).
- "I'm sticking with my goals better than with other apps I've tried." — Joe Maring ([Android Authority](https://www.androidauthority.com/finch-habit-tracker-app-hands-on-3537434/)).
- "The free version really feels like a gift for me" — Jeske Lange ([Trustpilot](https://au.trustpilot.com/review/finchcare.com)).
- "actively motivates you to engage in self care & develop healthy habits." — Charlotte Sturley ([Trustpilot](https://au.trustpilot.com/review/finchcare.com)).
- Review title "I love my lil bird" (5-star iOS, Jul 2023) ([Appbot](https://appbot.co/blog/finch-app-reviews-emotional-attachment-user-retention-product-loyalty/)).

**Complain**

- Billing: "instantly charged 79,99€ for a 12-months subscription." — Franziska; "somehow was upgraded to Plus." — lizzie York; "Never got one and got charged 80 euros for the yearly subscription." — Kelsey (trial-end reminder) ([Trustpilot](https://au.trustpilot.com/review/finchcare.com); 2.8/5 from only 14 reviews — small, skewed sample).
- Streak/data loss: "sad, just sad"; "Finch broke my heart I cried for days" ([Appbot](https://appbot.co/blog/finch-app-reviews-emotional-attachment-user-retention-product-loyalty/)).
- Reflection prompts as a burden: "I was becoming sadder and sadder as I struggled to answer these." ([Trustpilot](https://au.trustpilot.com/review/finchcare.com)).
  - Directly relevant to CBT: forced-feeling introspective questions can worsen mood for some users.
- Stability: "it has now become a daily source of stress with crash after crash" — Diana ([Trustpilot](https://au.trustpilot.com/review/finchcare.com)).
- Tone: "Some people may find the app too cutesy, the habit-building tools not extensive enough" — Joe Maring ([Android Authority](https://www.androidauthority.com/finch-habit-tracker-app-hands-on-3537434/)).
- Discoverability: a PM reviewer said after onboarding users don't know what to do next, energy/stones are unexplained, and "My Journeys" is hard to find ([Substack](https://dishabhatia.substack.com/p/the-self-care-bird-app-finch)); YourStory (2022) made the same point about unexplained energy/adventure/stones ([YourStory](https://yourstory.com/2022/06/app-review-self-care-pet-finch-gamifies-mental-wellbeing/amp)).
- UI friction: an r/finch post (~1.2k upvotes per search snippet) complains a shop-button change added an extra click ([mirror link](https://lr.in.psf.lt/r/finch/comments/1ks0y29/why_are_the_finch_team_obsessed_with_making_us)). Not opened; snippet only.

**Paywall facts (screens, Singapore pricing)**

- Trial offer: "Start your 7-day FREE trial", "~~S$99.98~~ S$ 59.98 per year (save 40%)", "Offer expires when you exit this screen!". Screen: [S](https://mobbin.com/screens/f58ab869-a56d-4d44-bba4-9c41158451b3?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Standard: "12 Months ~~S$179.76~~ S$ 99.98 ($8.33/month) BEST DEAL"; "Monthly S$ 14.98". Screen: [S](https://mobbin.com/screens/981c04ab-3348-492a-b506-7e456db8b1ae?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- Plus benefits listed: "Unlock all 150+ exercises", "More insights in Lee's mailbox", "Customize the app", "Daily shop deals — 50% off deals and more item slots", "Support our mission — Your subscription helps keep self-care free and accessible for thousands!". Screen: [S](https://mobbin.com/screens/204d7a28-0338-4929-b8ad-9144235e14e2?utm_source=claude-code&utm_medium=ai-assistant&utm_source_platform=mcp).
- "Become a Guardian — Sponsor Finch Plus for others" in the menu. Screen: F-ACTIVITIES (menu screen).
- US price reported: $9.99 for Plus ([Bustle](https://www.bustle.com/wellness/finch-app-review-features-price)); ~$40/yr in Jan 2023 ([Paste](https://www.pastemagazine.com/tech/finch/finch-app-mental-health-virtual-pet-self-care)).
- The trial-expiring-on-exit pressure line is the least on-brand screen in the set. Inference: it is the likely root of "charged without realising" reviews.

**Ignore**

- No usage data found on which features go unused. Unverified. Indirect signals: journaling is mentioned in only 24 of 400 positive reviews; every exercise has a "Mute" control, implying suggestion fatigue is expected.

**Could not verify (Reddit blocked):** guilt about neglecting the bird, event fatigue, notification complaints on r/finch. A [Vocal critique](https://vocal.media/critique/the-criousity-of-the-finch-app) reportedly argues users learn to value the check-mark over the activity and may still feel guilt; page returned 403, so second-hand only.

---

## 12. Outcomes versus engagement

- **No published trial of Finch found.** One search pass turned up no RCT or peer-reviewed outcome study on the app. Treat efficacy as unestablished.
- **Company framing.** Finch Care is a Public Benefit Corporation ([Paste](https://www.pastemagazine.com/tech/finch/finch-app-mental-health-virtual-pet-self-care)); paywall copy says subscriptions keep self-care "free and accessible for thousands".
- **Founder evidence is personal.** Yuan: "while building the early versions of Finch, we learned how powerful expressive writing could be for mental health"; "Even if we couldn't retain any users with Finch at the time ... I was mentally benefiting from using our prototypes to reflect on the ups and downs of my days." ([Humans of Finch, May 23 2022](https://medium.com/finchcare/humans-of-finch-vol-1-527caaa0bced)).
  - Reading: journaling was the original product and did not retain; the pet was added to carry it. Supported by search-snippet summary that the pet version was the first one new users came back to the next day (primary source not opened — unverified).
- **Scale claims (weak sources).** ~80,000 users in Jan 2023 ([Paste](https://www.pastemagazine.com/tech/finch/finch-app-mental-health-virtual-pet-self-care)). "$1 million monthly revenue and 5 million downloads", "$12 million annual" in a 2025 Medium post with no sourcing ([Medium](https://medium.com/@jashsak/the-12m-mental-health-app-that-broke-every-silicon-valley-rule-bd9d06e725f8)) — treat as unverified. The same post's neuroscience claims ("90% less resistance") cite nothing; do not reuse.
- **In-app measurement.** The app contains screening-style quizzes (anxiety, functional impairment) and weekly effort-satisfaction ratings (section 3). No evidence the company publishes these. Inference: they could measure outcomes; nothing public says they do.
- **Engagement evidence.** 4.6 stars over 40k reviews in 12 months; reviewers report multiple opens per day and 20+ goals/day (sections 1, 2, 11).

Bottom line: strong engagement and affection evidence; zero clinical outcome evidence located.

---

## Takeaways for a CBT thought-record app (all Inference)

1. Set the daily "win" at ~40% of the list. Finch: 15 of 35 available energy.
2. Reward writing by length, visibly, while typing (live ⚡ counter). Deep work pays 6x a tick (30 vs 5).
3. Never open on a blank field. Order: bucket → specific label chips → context chips → optional text. Maps onto mood → distortion → trigger → reframe.
4. One question per screen, with a concrete example under it, and a summary card at the end.
5. Generate prompts from what the user just did (goal reflection, skip reflection, "Reflect on story").
6. Make skip a named, rewarded action.
7. Give the companion somewhere to go for hours; the return is the second session.
8. Streak = showing up, not finishing. Offer repair in the bird's voice, plus an off switch and a pause mode.
9. Known failure modes to design against: multi-day lapses beyond repair, reflective prompts that make low-mood users feel worse, feature sprawl with unexplained currencies, pressure-style trial paywalls.
