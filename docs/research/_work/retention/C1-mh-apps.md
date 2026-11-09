# C1 — Mental-health app teardown: Home, check-ins, streaks, win-back

Run date: 2026-11-09. Budget-limited (~25 tool calls). Legend:
- **[SAW]** = observed in a Mobbin screenshot this run (Mobbin URL cited). Mobbin returns screens without capture dates; screen-to-ID mapping assumes result order matches image order.
- **[READ]** = text source retrieved this run (publisher, date if shown, URL).
- **[INFER]** = my inference, not a sourced fact.
- "No evidence" = not found within this run's budget; not proof of absence.

Mobbin coverage: Headspace, Calm, How We Feel, stoic. present. **Finch, Daylio, Bearable, Rootd returned no screens** ("Finch home screen" → empty; "Daylio mood entry streak" → only other apps).

---

## 1. Headspace

- **First session / payoff** — [SAW] Onboarding carousel: "Mindfulness for any moment. Stress less. Move more. Sleep soundly. There's something for everyone." https://mobbin.com/screens/7dba3826-1195-4066-a96d-a894870048ec . [SAW] New-user Today shows "How to Headspace" 2-min video as first timeline item, plus a dismissable program card "Finding Your Best Sleep — 18 sessions, <10 min a day, Learn more" https://mobbin.com/screens/1820617e-1ba9-42c1-b5e4-0c70bd614823 . Emotional payoff after session: no evidence beyond post-session screen below.
- **Daily check-in** — [SAW] Stress self-assessment result: score "23 / Moderate stress" with reframing copy "Think of this score as a way to get to know yourself a little better. Each time your score changes, it's an opportunity to notice what's been working, or maybe try something new." + "Suggested for you" content (e.g. "Feeling Overwhelmed") https://mobbin.com/screens/355cde92-0dab-4d97-9b6a-242160d7b95e . Non-judgmental framing of a negative score is notable.
- **Home structure** — [SAW] Today tab = time-of-day timeline ("Good Evening, Alex / Start your day" → … "At night") with completion dots (green check done, orange current, grey upcoming); items mix video, mindful activity ("Grounding Exercise to Ease Anxiety, 2 min"), "Today's Meditation" with live social proof "457 meditating" https://mobbin.com/screens/1cba404f-413c-4a8b-be36-d791e9ca4fed , https://mobbin.com/screens/efc82d96-660f-4e91-bff9-1f3d083c34eb . [READ] Headspace help center lists "Refreshed Today Tab Experience June 2026" (search snippet: rollout "starting in early June 2026… based on feedback from members"); article itself 404'd on fetch — content unverified. https://help.headspace.com/hc/en-us/articles/51443842967195
- **Streaks** — [SAW] Post-session screen: "Run Streak 1" + quote "It's normal for your thoughts to wander. Simply try to take a step back and appreciate having a little Headspace." https://mobbin.com/screens/4317df7c-ee78-4696-bbd9-e88af979b904 . [READ] Help center: run streak = sessions completed within 24h of previous; "Simply select your Profile tab and under the Run Streak section, click on the eye toggle to disable or enable your run streak." (Headspace Help, undated) https://help.headspace.com/hc/en-us/articles/215730567-How-does-the-run-streak-feature-work . [READ] Headspace's own article (search snippet, not fetched): if streak motivates, embrace it; "if you find it off-putting and scary, don't pay it any attention." https://www.headspace.com/articles/building-a-meditation-practice . Built for Mars "Hiding your Headspace streaks" (loss-aversion bite) is paywalled — rationale not retrieved. https://builtformars.com/ux-bites/hiding-your-headspace-streaks . Public statement of *why* they added hide: no evidence beyond the above.
- **Companion** — [READ] Ebb, AI companion using motivational interviewing; US Oct 2024, UK Apr 2025; long-term vision of Ebb greeting each user on open and routing to support (search summaries of Headspace/BusinessWire/MedCity/Figma blog) https://www.headspace.com/articles/headspace-brings-empathetic-ai-companion-ebb-to-uk-members , https://www.figma.com/blog/headspace-ebb-ai-companion/ . Dec 2025: Voice Mode + enhanced memory (HLTH, 2025-12-09) https://hlth.com/insights/news/headspace-updates-ebb-ai-with-voice-mode-and-enhanced-memory-to-deepen-mental-health-support-2025-12-09 . Not a mascot; the orange sun character appears in illustration only [SAW].
- **Program structure** — Hybrid: open-ended daily timeline + optional multi-session programs (18-session sleep) [SAW].
- **Low mood, crisis, notifications copy, win-back, paywall timing, new vs lapsed Home** — no evidence this run.

## 2. Calm

- **Home** — [SAW] Home hero = weekly-goal ring "3 Days" with M–S check row; copy "You've reached your goal with 3 days of Calm this week. Keep going!"; directly below, promo card "Special Holiday Offer — Gift Calm… 20% off" https://mobbin.com/screens/82e555db-347c-4690-95fe-fb1d395b9c7e . Note: weekly goal (days/week), not strict daily.
- **Streak celebration** — [SAW] "Day 4, score!" / "Four seems to be your lucky number. Great job using Calm 4 days this week." https://mobbin.com/screens/f2dbc8b8-cd62-4853-b6bc-b2c34e1ae7ae
- **Streak history** — [SAW] Profile > Dashboard: "My Streaks" Total / Longest / Current, calendar, "Share My Streaks", "My Streak History" list of past runs (3 days Dec 17–19; 1 day Dec 21) https://mobbin.com/screens/efbc1e20-0fdd-4b59-ab04-423a9e0982a3 , https://mobbin.com/screens/4c6b2e01-ce63-4119-9fc2-9493b7592f95 , https://mobbin.com/screens/08c3812e-748c-4c6b-bb84-9fa22e7a6001 . Profile also has a "Check-Ins" tab [SAW]; contents not seen.
- **Streak softening** — [READ] Calm Support "How to Restore a Broken Streak (Manual History)": "You can manually add a 'missed' session to yesterday (or any past date) to repair the gap and restore your streak… Your streak count will automatically recalculate." Only Meditations and Sleep Stories count; music/soundscapes do not. https://support.calm.com/hc/en-us/articles/360008704893 . [READ] Third-party guide claims streaks can be hidden (Technobezz, undated) https://www.technobezz.com/how-to-hide-streaks-in-calm-app-on-android — not confirmed in Calm's own docs this run.
- **Reminders** — [READ] Profile > Settings > Mindful Reminders toggle (Calm Support) https://support.calm.com/hc/en-us/articles/115005140873 . Copy: no evidence.
- **Paywall** — [SAW] promo on Home in-line [above]. Timing in first session: no evidence.
- **Low mood, crisis, win-back copy, journaling memory** — no evidence.

## 3. Finch

- No Mobbin screens. All text-sourced.
- **Core loop** — [READ] Raise a bird by completing real-world tasks; energy → adventures → rainbow stones for cosmetics (search summaries of Deconstructor of Fun, Engadget, Headway). 
- **Retention / companion role** — [READ] Deconstructor of Fun (Vinayak Sathyamoorthy, "March 31", year not shown): D1/D7 54%/37% (est.), ~10M MAU (est.); widget "your pet experiences a life even while you're away. They have adventures during the day, sleep at night"; return to collect adventure rewards; widget mechanics = living pet, timer-based adventuring, daily task progress bar, morning check-ins & random friend visits. https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl . [INFER] The pet's off-screen life is the win-back hook: return framed as "see what happened to your friend" rather than "you broke something".
- **Low mood** — [READ] Engadget (2025-03-11): app asks mood multiple times daily; when struggling, Finch presents a "First Aid Kit" of optional activities, also reachable via menu. https://www.engadget.com/apps/this-self-care-virtual-pet-is-helping-me-get-my-act-together-160027169.html
- **Streaks / shame avoidance** — [READ] Engadget: "you won't be scolded or shamed if you don't finish everything on your list… It's more about highlighting what you _did_ accomplish"; reviewer broke a 32-day streak and felt "more impressed at how many days in a row I'd committed to showing up for myself." [READ] Search summaries (various reviews) state missed day doesn't make the pet die or get sad. Official Finch statement on streak philosophy: no evidence.
- **Crisis** — [READ] Engadget: links to external helpline websites. Placement: no evidence.
- **Social / paywall** — [READ] Engadget: friends exchange gifts/messages; can gift Finch Plus. Paywall timing: no evidence (Headway review fetch failed).
- **Journaling memory, notification copy, Home variants** — no evidence.

## 4. How We Feel

- **Home / daily check-in** — [SAW] Home = "How are you feeling this evening?" (time-of-day aware), gradient ring with central "+ Check in", week strip showing that day's mood shape, and "⚡ 9 DAY STREAK" pill beneath https://mobbin.com/screens/020dc6d5-ee3a-4871-a0ea-260cdaa88009 . So: streak exists but small and secondary [SAW].
- **Check-in flow** — [SAW] Step 1 "Tap the color that best describes how you feel right now" — 4 quadrants (High/Low Energy × Pleasant/Unpleasant) https://mobbin.com/screens/ef93be6c-567e-4b33-8c04-059cbe7aca58 ; context tags "What are you doing? / Who are you with? / Where are you?" + "Add physical sensations" → "Complete check-in" https://mobbin.com/screens/ffd410a5-ea2c-498a-8536-0dc5fda49ef8 . [READ] 144-word mood meter (Yale/Brackett) https://medicine.yale.edu/news-article/the-how-we-feel-app-helping-emotions-work-for-us-not-against-us/
- **30-sec payoff** — [SAW] Saved entry rendered as a collectible card: "I'm feeling proud & good" with abstract shape art, photo, note, tags, voice-note waveform https://mobbin.com/screens/fc9ca637-75e3-4215-965d-1fd45e79ae75 . [INFER] The payoff is the beautiful, precise *naming* artifact.
- **Reflection back** — [SAW] Calendar view filtered "LOW ENERGY — PLEASANT (6)" with % breakdown and per-entry cards, "Export 6 Check-ins" https://mobbin.com/screens/ef70a2d1-ead8-4252-b58d-b76989c15ba1 . [READ] App Store: patterns vs sleep, exercise, weather, time of day via HealthKit; strategies grouped "Change Your Thinking," "Move Your Body," "Be Mindful," "Reach Out," some 1 min; friends share feelings in real time; data on device unless opted in; fully free. https://apps.apple.com/us/app/-/id1562706384
- **Assessment** — [SAW] periodic survey "How often have you felt *annoyed* in the past few weeks?" (All of the time … Not at all), with "Leave" exit https://mobbin.com/screens/ef4b12db-6566-4287-837c-381f0ad6ab5b
- **Paywall** — none; app is free [READ App Store].
- **Low mood handling, crisis surface, notification copy, win-back** — no evidence this run.

## 5. Daylio

- No Mobbin screens.
- [READ] Wikipedia: entry = 5-point mood → optional activities, note, up to 3 photos; "Year in Pixels" mosaic, monthly mood graphs, CSV export; daily streak, push notifications, achievement badges; premium adds advanced stats/backups/PIN. Notre Dame research cited: "simplistic interface design" lets users record "even when they are at their worst." https://en.wikipedia.org/wiki/Daylio
- [READ] Daylio FAQ: goals have Current Streak and Longest Streak; streak interrupted when required repetitions missed; reminders ON by default for goals; "people using reminders are statistically 87% more successful"; custom reminder text per goal. https://daylio.net/faq/docs/daylio-faq/tutorials/setting-up-goals/
- Streak softening, low mood, crisis, win-back, notification copy defaults, Home variants — no evidence.

## 6. Bearable

- No Mobbin screens.
- [READ] App Store / Play: symptom + mood tracker; automatic correlations between habits and outcomes; optional reminders and goals, recommends tracking morning and evening; premium unlocks additional reports, correlations, notes, historic data. https://apps.apple.com/app/bearable/id1482581097 , https://play.google.com/store/apps/details?id=com.bearable
- [INFER] Return hook = correlation insights that improve with more data; premium gates the deeper reflection.
- Streaks, low mood, crisis, copy, win-back — no evidence.

## 7. stoic.

- **Home** — [SAW] Today tab: lowercase greeting "good afternoon." / "good morning.", flame streak counter top-left (🔥1, 🔥6), week strip with checks, two cards: "Morning Preparation — Ready to take on the day? Begin" and "Evening complete." showing captured mood tags (Satisfied, Happy, +3 more); below, weekly theme card "on glowing reviews. Day 5 of 7" with prompt + "Reflect" https://mobbin.com/screens/f97f3994-4a60-4b79-96b5-ecb944e23697 . Done state: "All set for the morning." with tags (Restful Sleep, Family) https://mobbin.com/screens/f01552db-f4b2-40a7-8577-5adc84812501
- **Quick actions** — [SAW] "+" sheet: Mood Check-In, Journaling Suggestions, Get Inspired (quotes & affirmations), custom templates ("Movie Review Journal"), New Empty Journal https://mobbin.com/screens/fe9d0245-915d-448a-9cc8-2610e7e2c6b1
- **Program structure** — [SAW] Library of weekly 7-day themes: "already 1,394 and counting" (On Impostor Syndrome, On Emotional Maturity…) https://mobbin.com/screens/f8c003b2-a12d-48ef-895d-1b5deab1d995 . Open-ended daily ritual + light weekly mini-courses.
- **Journaling memory** — [SAW] Journey tab: chronological timeline of reflections (morning reflection text, tags, photo, meditation "Kōans walk" with timestamps) https://mobbin.com/screens/ef8f5c26-2e4b-4baa-876e-20d1ab4c3f55
- **Streaks** — [READ] App Store (search summary): smart reminders, streak trackers, badges; "Users can restore their streak if they miss a day or two, or even more." [READ] "Each time you open stoic, you start with a quick mood check-in"; new lighter "Daily Check-In… once per day". https://apps.apple.com/us/app/id1312926037 (help page fetch 404'd)
- Low mood, crisis, notification copy, win-back, paywall timing — no evidence.

## 8. Rootd

- No Mobbin screens.
- [READ] App Store: "The Rootr" panic button using CBT methods; Breathe; Journal (mood + trigger tracking); Visualize; Sleep; Lessons (education on anxiety); Emergency Contact direct-calling; freemium subscription incl. lifetime; testimonial "Rootd makes it feel like someone is with me, even when I'm alone." https://apps.apple.com/ai/app/id1289018369?l=en-gb
- [READ] Pulse (VIVE 2026 interview summary): "large, red 'Rootr' button" replaces intake forms and instantly launches panic exercises; friendly monster mascot to reduce stigma. https://www.pulse.bot/wellness/news/ania-wysocka-on-democratizing-immediate-panic-attack-relief-rootd-vive-2026-546dc5ff-f86b-46b8-a65d-1dfbaf661ab6/
- [INFER] Distress handling is the Home: an always-visible acute-help button is the primary affordance; crisis surface = Emergency Contact in-app.
- Streaks, win-back, notification copy, paywall timing — no evidence.

---

## Patterns

**What most do**
1. **Time-of-day Home.** Headspace ("Good Evening… Start your day… At night"), HWF ("How are you feeling this evening?"), stoic. ("good morning." + Morning/Evening cards) all key Home to clock time [SAW]. Daylio/Bearable recommend morning+evening logging [READ].
2. **Streaks kept but softened, not removed.** Headspace: hide toggle [READ]; Calm: manual backfill to repair + weekly-goal framing on Home [READ/SAW]; stoic.: restore missed days [READ]; HWF: small pill under the check-in button [SAW]; Finch: missed day carries no pet penalty [READ reviews]. **None found publicly removing streaks.**
3. **One dominant Home CTA** that is a check-in or next session (HWF "+ Check in", stoic. "Begin", Headspace current timeline dot) [SAW].
4. **Mood data reflected back as calendar/history + correlations** (HWF filtered calendar & HealthKit patterns, Daylio Year in Pixels, Bearable correlations, stoic. Journey) [SAW/READ].
5. **Negative states framed non-judgmentally** — Headspace stress score copy; Finch "won't be scolded or shamed" [SAW/READ].

**Distinctive**
- **Finch:** companion with an off-screen life (adventures, sleep) surfaced via widget — return is curiosity, not debt [READ DoF].
- **HWF:** 30-second check-in pays off as an aesthetic artifact (shape + named feeling) and is entirely free [SAW/READ].
- **Rootd:** acute-distress button *is* the Home [READ].
- **Calm:** weekly-days goal ("3 days this week") over consecutive-day pressure; but places promo directly under the streak hero [SAW].
- **stoic.:** a "done" state on Home ("All set for the morning.") that shows what you logged — closure instead of more asks [SAW].
- **Headspace:** live social proof ("457 meditating") and an AI companion planned to greet users on open [SAW/READ].

**Comparators surfaced incidentally (not in scope, [SAW])**: Cal AI punitive "1 Day streak lost — Don't give up." https://mobbin.com/screens/f48da1ad-4de3-4900-9abd-6978316b5bb7 ; BitePal mascot "2 day streak! / I'm commited" https://mobbin.com/screens/b04e4b6c-9383-498a-b2d0-6541427e3cc6 ; Insight Timer "1st daily check in — How are you today?" 5-face sheet https://mobbin.com/screens/736eab05-f5f7-4077-ba75-698f069a25e2

## Looked for but not found
- Any app's **win-back / "welcome back" copy after absence** — none retrieved (no Mobbin "welcome back" search run; budget).
- **Exact push-notification copy** for any of the 8 apps (only Daylio's custom-text capability [READ]).
- **Public statements explaining why** Headspace added streak hiding (Built for Mars paywalled) or why Calm allows backfill.
- **Home differences for new vs returning vs lapsed** — only new-user Headspace Today seen; no lapsed-state screens for any app.
- **Paywall timing in first session** for Headspace, Calm, Finch, stoic., Rootd.
- **Crisis/safety surface placement** in screens (only text: Finch external links, Rootd Emergency Contact).
- **Finch, Daylio, Bearable, Rootd screens** — not in Mobbin results.
- Headspace June 2026 Today-tab refresh details and stoic. help pages (both 404 on fetch).
