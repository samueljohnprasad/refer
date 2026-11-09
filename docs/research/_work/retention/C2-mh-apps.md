# C2 — Mental-health app teardown: Home, check-in, streaks, win-back

Run date: 2026-11-09. ~25 tool calls. All claims below come from sources retrieved in this run.
Legend: **[SEEN]** = observed in a Mobbin screen image; **[READ]** = text source; **[SNIPPET]** = from a web-search result summary, primary page not opened (lower confidence); **[INFERENCE]** = my reasoning, not sourced.

Mobbin coverage: of the 8 target apps, **only Wysa** is in the Mobbin iOS catalog. Searches "Youper", "Balance meditation home", "Reflectly", "Sanvello mood check in", "Intellect app home", "CBT thought record" returned other apps (pillowtalk, Tolan, Insight Timer, How We Feel, Ahead, Stardust, WHOOP, Bevel, Noom) or nothing. Those are noted at the end as adjacent references only.

---

## 1. Wysa (AI CBT/DBT chatbot, penguin character)

- **First session** — [SEEN] Bot opens in chat: "Hi, JS. 😊 / Thanks for sharing a little bit about yourself." (Mobbin https://mobbin.com/screens/d01b5847-36ec-454c-b8d9-4777f88a0c65). Intent-routing early: "To start, let's build a routine by understanding what brings you here. What are you looking for?" → user "I'm just curious" → "Sometimes, all we need is someone who can be there for us, right? 😇 / Let's start with a few questions to see how you've been doing lately." + single "Let's begin" chip (https://mobbin.com/screens/6eb03ca6-a5da-44e8-a2d0-fe3a33db7dca). Emotional payoff = being met conversationally, then a short assessment.
- **Daily check-in** — [SEEN] Return greeting: "Glad you're back, JS! 👋 How are you today?" over a big emoji-face slider with label "As good as it gets" (https://mobbin.com/screens/31047b03-c2a4-43b8-9acd-75847f7575aa). Follow-up when user says "Okay I guess...": "Most days we are somewhere in the middle of our emotional range. If you were to try and describe your current mood, what kind of an 'okay' are you feeling right now?" with chips Meh / Optimistic / Calm / Numb / Bored / Confused (https://mobbin.com/screens/f75c2739-0a09-447a-8c6f-881b0509ec9b). Normalises "okay" rather than forcing a valence. Then pivots to context: "Well, how about we talk about your day? 😊 Tell me something that you did or are planning to do." (https://mobbin.com/screens/9aedd24d-6b78-4e6a-a1bd-481277d50698).
- **Mood reflected back** — no evidence seen this run (no mood-history screen surfaced).
- **Distress / crisis** — [SEEN] In-chat de-escalation: "It sounds like you are experiencing a lot of distressing feelings and thoughts. / Do remember that it will pass. / Shall I suggest you some exercises to calm down?" → breathing (https://mobbin.com/screens/bf3abb0b-db5e-47f7-ac09-ec8818498b22). [SEEN] Persistent red-outlined **"SOS"** pill top-right of Home (https://mobbin.com/flows/6cbc2052-6bac-4f2a-b3ba-3cedc54121a4). SOS screen: "Are you in crisis? You are not alone. Help is just a call away." → two helpline buttons, disclaimer "Wysa is not enough…", then "Can't make a call? Access these" → "Create Safety Plan", "Grounding for panic" (https://mobbin.com/flows/ea7ba581-a50e-4a6d-8f68-e3216d578e80). Safety plan built conversationally then shown as a card with tap-to-call helplines (https://mobbin.com/flows/9d2582aa-faf8-485e-877b-ee9d7dd4c26d). Chat header also carries "Add a therapist"/"Talk to a Counsellor" pill (all chat screens above).
- **Streaks** — no evidence.
- **Companion & return** — [SEEN] Home (mindline.sg/Singapore white-label build) headline "MY 4 AM FRIEND — Hi, I am Wysa! Your AI friend — Start a chat", plus a sticky **"Continue conversation — from a few seconds ago"** resume bar above the tab bar (https://mobbin.com/flows/6cbc2052-6bac-4f2a-b3ba-3cedc54121a4). Home also has "MY PACKS": My Favorites, Recently Used, Beat Stress, Essential Wellness Pack; and social proof "6,002,452 people talk to Wysa to feel relaxed" + testimonial. Return session opens with name + "Glad you're back" (above). What it remembers across sessions: name [SEEN]; deeper memory — no evidence.
- **Journaling** — [SEEN] "Journal" is a bottom tab (Home / Counsellor / Self-care / Journal). Content not seen.
- **Notification copy** — no evidence (searched; no exact copy found).
- **Program structure** — open-ended chat + "packs" of exercises [SEEN]; App Store lists CBT/DBT tools, confidence, anger, anxiety [READ: Apple App Store, retrieved 2026-11-09, https://apps.apple.com/app/id1166585565].
- **Paywall** — [READ] App Store: free basic chatbot; "Wysa Premium - $99.99 per year (Tools)", "Wysa Premium Plus - $99.99 per month (Coach + Tools)" (same URL). Timing — no evidence.
- **Win-back** — "Glad you're back, JS! 👋" [SEEN]; push copy — no evidence.
- **Published numbers** — [SNIPPET] JMIR Formative Research, May 2022 (Wysa for Chronic Pain): mean 33.3 sessions over 8 weeks, **median retention 51 days**, and **morning check-in use significantly associated with longer retention** (https://formative.jmir.org/2022/5/e37302/ ; PMC https://pmc.ncbi.nlm.nih.gov/articles/PMC9171603). [SNIPPET] Frontiers in Digital Health, Dec 2024 (Singapore mindline.sg): users who went from brief web intervention into the app version had higher engagement/retention (https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2024.1443598/epub).

## 2. Woebot (AI CBT chatbot) — consumer app SHUT DOWN

- **Status / why** — [SNIPPET] STAT News, 2025-07-02: Woebot shut its direct-to-consumer app (as of 30 Jun 2025); founder Alison Darcy attributed it largely to cost/challenge of FDA marketing-authorization requirements; "AI moving faster than regulators" (https://www.statnews.com/2025/07/02/woebot-mental-health-chatbot-shuts-down-founder-says-ai-moving-faster-than-regulators/). [SNIPPET] HLTH, 2025-04-28, announcement of the shutdown (https://hlth.com/insights/news/woebot-health-is-shutting-down-its-app-2025-04-28). Pivot to enterprise/payer partnerships. (Secondary aggregators also claim 1.5M users affected and rising inference cost — not verified at primary source.)
- **First session / check-in** — [READ] Fitzpatrick et al., JMIR Mental Health 2017 (https://pmc.ncbi.nlm.nih.gov/articles/PMC5478797): each conversation starts with context then mood — "What's going on in your world right now?" then "How are you feeling?" answered by word or emoji. Bot "sent one personalized message every day or every other day to initiate a conversation."
- **Mood reflected back** — [READ] same paper: "weekly charts depicting each participant's mood over time" with interpretive summary, e.g. "Overall, your mood has been fairly steady, though you tend to become tired after periods of anxiety. It looks like Tuesday was your best day."
- **Crisis** — [READ] same paper: users endorsing suicidality/self-harm "were automatically provided with helpline numbers and a crisis text line number, and were encouraged to call 911."
- **Companion memory / return** — [READ] same paper: bot "set expectations of regular check-ins and followed up on earlier activities, for example, on the status of the stated goal." Participant: "I actually feel super good and happy when I see that it 'remembered' to check in with me!" Complaints (10 participants): bot not understanding responses.
- **Streaks, journaling, paywall, win-back copy** — no evidence.
- **Published numbers** — [READ] same paper: 12.14 (SD 2.23) interactions over 2 weeks (~6/wk); 83% retained at 2-week follow-up; significant depression reduction vs e-book control.

## 3. Youper (AI emotional-health assistant)

- Mobbin: not in catalog.
- **Published numbers** — [SNIPPET] Mehta et al., JMIR 2021 (https://www.jmir.org/2021/6/e26771): rating 4.36/5; **43% retained at week 4**; anxiety d=.57, depression d=.46 in first 2 weeks; higher proportion of successful emotion-regulation attempts predicted greater symptom reduction.
- First session, check-in UI, streaks, crisis placement, memory, notifications, paywall, win-back — no evidence this run.

## 4. Balance (Elevate Labs, personalized meditation)

- Mobbin: not in catalog.
- **Daily check-in / personalization** — [READ via App Store snippet] "Each day, you'll answer questions about your meditation experience, goals, and preferences… Balance assembles a daily meditation that's perfect for you. The more you share over time, the more personalized…" — check-in's payoff is that it *changes today's content* (Apple App Store listing id1361356590, retrieved 2026-11-09, e.g. https://apps.apple.com/si/app/id1361356590?l=en-gb). 10-day Plans.
- **Paywall** — [SNIPPET, same listing] "Your first year on Balance is free"; then $11.99/mo or $69.99/yr. (Free year offer may be geography/time limited — unverified.)
- Streaks, crisis, notifications, win-back, retention numbers — no evidence.

## 5. Sanvello (CBT mood + tools, now Optum/UHC)

- Mobbin: not in catalog. App Store page fetch returned 404.
- **Mood tracking** — [SNIPPET] Common Sense Media / ChoosingTherapy (https://www.commonsensemedia.org/app-reviews/sanvello ; https://choosingtherapy.com/sanvello-app-review): track mood daily and get activity suggestions in "tools" based on mood and goals; goal setting, habit tracking, thought analysis, community.
- **Crisis** — [SNIPPET] same: no live people in crisis unless paying for therapy; app says not for urgent care, call 911.
- **Paywall** — [SNIPPET] most functionality free; premium unlocks more; widely distributed free via insurers/employers (UHC/county brochures in results).
- Streaks, notifications, win-back, numbers — no evidence.

## 6. Happify (positive-psych "tracks" & games) — STILL LIVE under Twill/DarioHealth

- **Status** — [SNIPPET] Company renamed Twill (Aug 2022), acquired by DarioHealth Feb 2024; Happify remains a Twill product (PitchBook https://www.pitchbook.com/profiles/company/60028-21 ; Twill FAQ https://care.twill.health/feed/articles/faq-about-our-new-name-twill-care-and-what-it-means-for-you/). App still listed on App Store (JP listing id730601963).
- **Program structure** — [SNIPPET] HelpGuide review (https://helpguide.org/handbook/online-therapy/happify-review): "tracks" = mini-courses of activities, games, meditations, articles.
- **Paywall** — [SNIPPET] same: Happify Plus unlocks 20-page character assessment, more tracks, progress tracking.
- **Notifications** — [SNIPPET] same review claims Happify "doesn't include the option for reminders or notifications" (surprising; treat as reviewer's observation).
- Streaks, crisis, win-back, numbers — no evidence.

## 7. Reflectly (AI journal / mood)

- Mobbin: not in catalog.
- **First session** — [READ] ScreensDesign teardown (https://screensdesign.com/showcase/reflectly-journal-ai-diary): onboarding walks user through their first mood check-in (guided first action, not explanation).
- **Check-in** — [READ] same: slider-based mood check-in; "Daily Challenges" gamification; completion micro-animation (flag on mountain).
- **Paywall** — [READ] same: $79.99 lifetime offer shown during onboarding (anchor), later "Just For You" $19.99 offer with countdown timer; "No Free Trial - Soft Paywall".
- **Notifications** — [READ] reminders customizable; exact copy not available.
- Streaks (explicit), crisis, win-back, numbers — no evidence.

## 8. Intellect (Asia-based CBT-informed EAP/consumer app)

- Mobbin: no results.
- **Program structure** — [SNIPPET] Intellect site / NUS guide (https://intellect.co/read/intellect-psychological-resilience/ ; https://www.nus.edu.sg/hwb/wp-content/uploads/2024/09/2024-Intellect-App-Navigation-Guide-NUS-Students.pdf): "Learning paths" (bite-sized psychoeducation) and "Rescue sessions" (Procrastination, Sleep, Burnout) — i.e. course + on-demand rescue.
- **Published numbers** — [SNIPPET] intensive longitudinal study, PMC (https://pmc.ncbi.nlm.nih.gov/articles/PMC10236254): among 150 active users (≥3 consecutive days), daily engagement predicted higher next-day resilience / lower stress; company claims 5.4% resilience-score rise in 5 weeks.
- Everything else — no evidence.

---

## Patterns

1. **Chat-first apps make the check-in the session opener, not a form.** Woebot: context ("What's going on in your world?") → mood (word/emoji) [READ]. Wysa: "Glad you're back, JS! How are you today?" → slider → chips → "talk about your day" [SEEN]. Meditation/mood apps (Balance, Reflectly) use a standalone slider/questionnaire whose payoff is personalization or a log entry [READ].
2. **The "okay" normaliser** (Wysa) — rather than binary good/bad, it validates the middle ("Most days we are somewhere in the middle…") and refines with granular chips. Low-cost way to make a 30-second check-in feel heard. [SEEN]
3. **Remembering = retention lever with evidence behind it.** Woebot follows up on stated goals; users report feeling good when it "remembered" [READ, 2017]. Wysa's morning check-in usage is associated with longer retention (median 51 days) [SNIPPET, 2022]. A meditation app cannot "follow up on your goal from Tuesday"; a CBT bot can. [INFERENCE]
4. **Mood reflected back as narrative, not just a chart.** Woebot's weekly summary sentence ("Tuesday was your best day") [READ].
5. **Resume over restart.** Wysa Home pins "Continue conversation — from a few seconds ago" [SEEN]; return greeting uses name + "Glad you're back" with no guilt [SEEN].
6. **Crisis surface = persistent, always one tap, separate from the chat.** Wysa red "SOS" pill on Home, plus in-chat escalation to calming exercise, plus "Create Safety Plan" / "Grounding for panic" for people who can't call [SEEN]. Woebot auto-surfaced helplines on keyword detection [READ].
7. **No streaks observed in any CBT/chatbot app this run.** Streak-like gamification only appeared in Reflectly ("Daily Challenges") [READ]. [INFERENCE] Chatbot apps lean on relationship continuity rather than counters.
8. **Paywall split:** chatbot apps keep the conversation free and charge for tools/coach (Wysa) [READ]; journaling app hard-anchors price in onboarding (Reflectly) [READ]; Balance gives a free year [SNIPPET]; Sanvello mostly free via insurers [SNIPPET].
9. **Retention benchmarks found:** Woebot 83% at 2 wk (RCT); Youper 43% at wk 4 (real-world); Wysa median 51 days (chronic-pain cohort). Not comparable populations.
10. **Business caution:** Woebot's consumer shutdown was attributed to regulatory (FDA) cost and economics, not to engagement failure [SNIPPET, STAT 2025].

## Looked for but not found

- Exact push-notification copy for any of the 8 apps (searched Wysa explicitly; Reddit not surfaced).
- Any win-back push/email copy after absence (only Wysa's in-app "Glad you're back, JS!").
- Any streak mechanic, or a documented decision to soften/remove streaks, in these apps.
- Mobbin screens for Youper, Balance, Sanvello, Reflectly, Intellect, Happify, Woebot.
- Program/course completion rates for any app.
- Youper first-session/check-in design; Sanvello App Store page (404).
- What Wysa remembers beyond the user's name.

Adjacent (non-target) Mobbin screens surfaced, possibly useful: Ahead grief triage "Are you carrying pain from something recent?" with "I'm okay right now" exit (https://mobbin.com/screens/a9b39d76-76a5-46db-8d12-cd39f6919086); Insight Timer check-in "I'm feeling Good → What best describes this feeling? → What's having the biggest impact?" with "Complete Check in" / "Start Journal Entry" (https://mobbin.com/screens/1e87a4d1-d014-4d85-b43f-e80ee410579e); Tolan companion "Your path" milestone after intentions (https://mobbin.com/screens/c5f20b13-5ffe-4c52-987a-62e10ad35ae3); Bevel "How are you feeling, Alex?" + "Check-in with me — Schedule regular check-ins" (https://mobbin.com/screens/1deba47a-72a0-4380-8204-4629820eb3a4).
