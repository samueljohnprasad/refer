# D — Beyond-category retention teardown (Duolingo, BitePal, Ahead, Fabulous, Noom, Elevate)

Run date: 2026-11-09. Every claim cites a source retrieved this run. Tags:
- **[P]** company primary source (blog, paper, SEC filing, ex-exec essay)
- **[S]** secondary (newsletter, teardown, aggregator) — number not re-verified at primary
- **[M]** Mobbin screen/flow observed this run
- **[INF]** my inference, not sourced

Access note: blog.duolingo.com, making.duolingo.com and research.duolingo.com returned HTTP 503 this run; Duolingo experiment numbers below therefore come via search snippets / secondary relays unless marked [P].

---

## 1. Duolingo

### Scale / growth model
- DAU >50M, +36% YoY in Q3 2025; no quarter below 40% DAU growth from Q2 2022 to Q2 2025. [P] Duolingo Q3 FY25 press release / shareholder letter, SEC 8-K (Nov 2025) — https://www.sec.gov/Archives/edgar/data/1562088/000162828025049514/q3fy25duolingo9-30x25share.htm ; https://duolingo.gcs-web.com/news-releases/news-release-details/duolingo-surpasses-50-million-daily-active-users-grows-dau-36
- Growth model segments users: new (first day), current (active today + ≥1 prior day in 6-day window), reactivated (back after 7–29 days away), resurrected (back after 30+ days). Metrics CURR / NURR / RURR. [P] Jorge Mazal (ex-CPO), "How Duolingo reignited user growth", Lenny's Newsletter, 2023-02-28 — https://lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- CURR +21% = "a reduction in the daily churn of our best users by over 40%"; DAU 4.5x over four years; share of DAU on 7+ day streak "increased almost 3 times to more than half of our DAU". [P] same.
- Key insight: CURR had not moved in years; shifting focus from new-user to current-user retention had the largest DAU impact. [P] same.

### Streak & commitment devices (published results)
- **Leaderboards:** learning time +17%; highly engaged learners (1h+/day, 5 days/wk) tripled; D1/D7 significant lift. [P] Mazal 2023.
- **Push notifications:** "dozens of small- and medium-size wins" via timing/template/copy/localization — without increasing notification volume. [P] Mazal 2023.
- **Streak-saver notification** was the first big streak win, followed by calendar view, animations, freeze changes. [P] Mazal 2023.
- **Streak Freeze:** reduced churn 21% for users at risk of breaking a streak. [S] Marisha Lakhiani, "Breaking Down Duolingo's Growth Model" (Substack) — https://marishalakhiani.substack.com/p/breaking-down-duolingos-growth-model
- **Separating daily goal from streak** (streak = 1 lesson/day): +3.3% D14 retention, +1% DAL, +10.5% share of daily learners on a streak (+19% for new learners). A year later just over half of daily learners held a 7+ day streak vs ~a third before. [S] search snippets relaying Duolingo blog "improving the streak" / making.duolingo.com "how streaks keep Duolingo learners committed" (primary 503) — https://blog.duolingo.com/improving-the-streak ; https://making.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals
- **Streak Wager:** significant lift D1/D7/D14; D7 +14% the largest. [S] same snippet relay.
- **Active streak-goal choice** ("I'm committed"): users who actively chose a goal retained better in following weeks. [S] lazyweb, https://lazyweb.com/research/duolingo-streak-goals-retention
- Over 600 streak experiments run. [S] Lenny's Podcast page, Jackson Shuttleworth (Group PM Retention), 2024-12-15 — https://lennysnewsletter.com/p/behind-the-product-duolingo-streaks
- 2022 retention-important experiments named: widget with mood-changing Duo, special streak app icons, goal-commitment copy, Perfect Streak Week — no numbers published in that source. [S] https://experiments.lazyweb.com/research/duolingo-retention-experiments.md
- iOS widget: Duo visible outside the app as a live reminder; no lift figure retrieved. [S] same.

### Screens [M]
- Day-6 streak screen: Duo bubble "Tomorrow makes 7 days, let's gooooooo!", week dots, CTA "I'M COMMITTED" — https://mobbin.com/screens/f6675d16-c6b5-4847-aa9f-fb66a2d61e88
- Streak page: calendar, Streak Goal track (1→3→5), locked "Reach a 7 day streak to join the Streak Society and earn exclusive rewards." — https://mobbin.com/screens/fbef2d10-7767-41e4-8a9f-825e022ead13
- Friend Streaks tab + invite (4 invites remaining) + "Friend Streak with Sam Lee" celebration — https://mobbin.com/screens/f82d5526-e18b-4117-87ba-b4300f6ca500 ; https://mobbin.com/screens/efb53ab3-b3f1-45a0-84bf-3821c45a286a ; https://mobbin.com/screens/eebf51b7-7358-477b-ba2b-e2ed8aedbef2
- Welcome: "Learn for free. Forever." — https://mobbin.com/screens/fb4eda98-538d-4bc0-9ef6-bf06ed401c12

### Notifications
- KDD 2020 paper "A Sleeping, Recovering Bandit Algorithm for Optimizing Recurring Notifications" (Yancey & Settles): Recovering Difference Softmax; "sleeping" = some templates ineligible some rounds; replication data = 200M practice-reminder pushes over 35 days, with conversion within 2h as outcome. [P] paper listing, https://research.duolingo.com/papers/yancey.kdd20.pdf (PDF 503 this run; details via paperswithcode/search snippet https://paperswithcode.com/paper/a-sleeping-recovering-bandit-algorithm-for). Online-lift numbers NOT retrieved.
- Last-resort copy (quote): "These reminders don't seem to be working. We'll stop sending them for now." — sent after reminders are ignored for a long period. [S] Taplytics blog — https://taplytics.com/blog/duolingo-sends-push-notifications-to-let-users-know-they-know-theyre-not-engaging-with-their-reminders ; UniversityXP 2025-07-25 — https://www.universityxp.com/news/2025/7/25/we-havent-seen-you-in-a-while-duolingos-passive-aggressive-strategy-for-keeping-users-hooked
- [INF] The "we'll stop" message works as loss-framed reactance AND as respect for absence — the gentler half is adaptable for CBT.

### Home by day / win-back / paywall / memory
- Day-0/2/7/lapsed Home variants: not retrieved. Reactivation is measured at 7–29d and 30+d buckets [P Mazal], but win-back screen copy at 3/7/14d not retrieved.
- Onboarding length, paywall placement: not retrieved this run.

---

## 2. BitePal (AI food tracker, raccoon mascot)
- **Onboarding:** 19-screen and 18-screen onboarding flows on Mobbin. [M] https://mobbin.com/flows/280827a4-34c7-4915-9dde-5d4de3005186 ; https://mobbin.com/flows/3aca70bc-a1e3-4895-9a72-24dc68de3bf9
- Steps observed [M]: multi-select "Any additional goals?" (incl. "Build healthy relationship with food", "Feel better about myself"); "Now let's talk about your eating habits"; "Let's meet your virtual pet!" with stat "Gamification makes habits stick for up 5x longer"; reveal "Open to see who is there" (pet hatched from a trash can); **coach-tone picker** — mascot says "You showed up again today. That's the whole thing." with options Cheerleader / Gentle & kind / Straight talker / Mindful guide; in-onboarding rating ask "Give us rating" 4.8, 2M+ people.
- **Streak:** "2 day streak!" screen, week dots, CTA "I'm commited" + share — Duolingo-clone pattern. [M] https://mobbin.com/screens/b04e4b6c-9383-498a-b2d0-6541427e3cc6
- Paywall, Home variants, notifications, win-back: not retrieved.
- [INF] Tone-picker is the most transferable piece for CBT: user chooses how the companion speaks before any lapse happens.

## 3. Ahead (emotional intelligence)
- **Onboarding:** 36-screen account-creation onboarding + 6-screen drawing flow. [M] https://mobbin.com/flows/57e41d19-30db-4443-ab36-b19c8c20dfe4 ; https://mobbin.com/flows/97103053-f137-4dcd-85af-31f82e7c1e66
- Observed [M]: "Take a deep breath" opener; 10-question scenario quiz with slider (e.g., "You feel stuck at work… escape, e.g., into the world of cat videos ↔ figure it out then and there"); recommended journeys with match % and learner counts (Procrastination 88% match, Anxiety 79%…); **commitment device: "Commit to yourself by drawing a checkmark" → "I promise myself"**; "Sign up to save progress" after investment; paywall "Become a better manager with Ahead Pro!" ("5 min daily activities", "200k+ lives…changed") at end of onboarding.
- **Streak:** day-1 "First step done! Congrats, you're on a… 1 day streak", introduces "Streaky the caterpillar" who hatches, CTA "Let's evolve together!" [M] https://mobbin.com/screens/fb781054-c6ab-4f88-ace0-939af8dd14ca
- Home variants / notifications / win-back: Home screen search returned nothing on Mobbin.

## 4. Fabulous (Duke Center for Advanced Hindsight origin)
- Origin: incubated at Duke's Center for Advanced Hindsight (Dan Ariely). [S] designli — https://designli.co/blog/the-fabulous-app-uses-behavioral-design/
- **Onboarding:** commit to a morning routine by checking boxes for three habits (water, breakfast, exercise). Co-founder Taylor Ling: "asking the user to check boxes committing to their routine makes them think, 'Yeah. I can do that.'" [P-ish] Google Design, "Fabulous: Motivating App Engagement" (undated) — https://design.google/library/fabulous-motivating-app-engagement
- **Letters:** short personalized letters of encouragement; personal, conversational letter right after signup. [P-ish] Google Design; [S] designli.
- **Journeys** framed as story chapters: "A Fabulous Night: In which [your name] learns how to manufacture a great night's sleep." [P-ish] Google Design.
- **Notifications:** song + illustration + countdown; chime expands to dialog with pulsing FAB. Ling: "we tried to make notifications as immersive and contextual as possible…" [P-ish] Google Design.
- Results: downloads 300→5,000/day after 2015 redesign. [P-ish] Google Design. Retention 2x by customizing onboarding (Firebase). [S] casestudies.com — https://www.casestudies.com/company/firebase/case-study/fabulous-app-improved-user-retention-2x-by-customizing-its-onboarding-process-via-firebase
- Mobbin "Fabulous home screen": 0 results. Win-back, paywall: not retrieved.

## 5. Noom
- **Onboarding:** web-to-app funnel up to 113 screens, 10–15 min, before paywall; another source counts 96+. Builds commitment + education before paywall. [S] RevenueCat — https://www.revenuecat.com/blog/growth/web-to-app-onboarding-funnel.md (via plushcap mirror); lazyweb.
- **Home ("Today") [M]:** Today/Health/Success kit tabs; Log meals list with educational card "The power of meal logging…"; "Finish day" CTA; Today's nutrition with "1,217 calories left", Weight Loss Zone bar, color breakdown, AI "Insights from Welli (BETA)" — https://mobbin.com/screens/fe70fe50-afbe-452b-92a5-31b6ba6151ad (and siblings fd944ded…, f8e308a2…, f8248c6c…, f3bcb945…)
- **Self-set daily effort:** lesson asks "Select how much time you want to spend on Noom lessons every day" (1–4 / 5–8 / 9–12 min), recommends 5–8, CTA "I'VE GOT THIS", copy "You've got this." [M]
- **Challenges:** "Drink water first thing in the morning" with 5-dot progress + "Did it today"; seeds currency (150 seeds, 7 days). [M]
- Research claim in-app: "Research involving more than 35,000 Noomers shows that those who log their meals are more likely to lose weight…" [M]
- Win-back, notification copy: not retrieved.

## 6. Elevate
- Soft paywall at end of long value-rich onboarding; workout calendar tracks streaks. [S] screensdesign / marlvel intel report (2026-05-22) — https://screensdesign.com/apps/elevate-brain-training-games/ ; https://marlvel.ai/intel-report/education/elevate-brain-training-games
- Streak-tracking bugs are top technical complaint; a user asked for a 3-day break allowance after losing a 97-day streak on one miss. [S] marlvel report (review-derived).
- Mobbin "Elevate streak": no Elevate screens returned.

---

## Patterns
1. **Optimize current-user churn, not just new-user.** Duolingo's biggest DAU driver was CURR (+21%, daily churn of best users −40%). [P] → Home should protect the 2–7-day user most.
2. **Decouple "showed up" from "did enough".** Streak = minimum action; separate goal. +3.3% D14 [S]. BitePal copy "You showed up again today. That's the whole thing." [M]
3. **Active commitment rituals** at a threshold: Duolingo "I'm committed" at day 6, BitePal "I'm commited", Ahead draw-a-checkmark "I promise myself", Fabulous check-the-boxes, Noom "I'VE GOT THIS" self-chosen minutes. [M][P-ish]
4. **Forgiveness devices beat pure loss aversion:** freeze (−21% at-risk churn [S]), wager, earn-back; Elevate users complain about having none. [S]
5. **Mascot that evolves with streak** (Ahead's Streaky caterpillar, BitePal pet, Duolingo widget mood). [M][S]
6. **Notification restraint as a feature:** Duolingo grew via template/timing optimization without more volume [P], and stops after ignored reminders. [S]
7. **Long onboarding = investment before paywall** for health apps (Noom 96–113 screens, Ahead 36, BitePal 18–19); Duolingo shows value first ("Learn for free. Forever."). [S][M] [INF] For CBT, BitePal-length plus a coach-tone choice seems the sweet spot.
8. **Social streaks** (Friend Streaks, Streak Society at 7 days). [M] [INF] risky for CBT privacy; opt-in only.

## Looked for but not found (this run)
- KDD 2020 bandit online-lift numbers (PDF 503).
- Primary Duolingo blog text for freeze/earn-back/widget numbers (503); streak-freeze −21% only secondary.
- Duolingo onboarding screen count, paywall placement, day-2/7/lapsed Home variants, 3/7/14-day win-back copy.
- BitePal, Ahead, Fabulous Home screens (Mobbin returned 0), paywall placement for BitePal/Fabulous, any notification copy for BitePal/Ahead/Fabulous/Noom/Elevate.
- Any published retention numbers for BitePal, Ahead, Elevate, Noom.
- Elevate screens on Mobbin.
