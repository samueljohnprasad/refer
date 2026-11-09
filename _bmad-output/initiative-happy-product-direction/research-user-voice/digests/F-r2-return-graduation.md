# F-r2 — Return after a break (Q5) & stopping because better / episodic use (Q6)

Run date: 2026-11-09. ~24 tool calls.
**Access caveat (read first):** reddit.com is blocked for this agent's user agent (WebSearch returned HTTP 400 for domain filter). Reddit voices below come only from a third-party mirror (reddit.sentinel-team.org snapshots). Two libreddit/MetaFilter fetches failed (ECONNRESET); JMIR 2024 and JMIR mHealth 2026 fetches returned 503/empty; two PDFs could not be text-extracted (no pdftotext/poppler in sandbox). Evidence base is therefore THIN. Treat every theme as low-to-medium confidence.

---

## Q5 — Coming back after a break

### Theme 5.1 — Streak/progress is the tether; losing it is felt as loss, and reset-to-day-one is a pain point
- "the only thing keeping me tethered to this app is a 400+ day streak" — r/finch, Apr 23 2026, https://reddit.sentinel-team.org/posts/1ssotmz/snapshots/2026-04-23T12%3A08%3A30.490679Z [distinct voices: 1]
- "234-day streak held since 2025 being reset to day one" — Finch review quoted in Appbot article, Aug 24 2026, https://appbot.co/blog/finch-app-reviews-emotional-attachment-user-retention-product-loyalty/ [1] (note: article paraphrase-quote, not raw review)
- "my birb jelly" (user's two-year streak lost after sudden logout) — same Appbot article [1]

Confidence: LOW-MEDIUM. 2 sources (Reddit mirror + review aggregator article), same app (Finch). Shows attachment to accumulated progress; does NOT directly show the re-entry moment.

### Theme 5.2 — Product response: "pause without losing streak" (Finch App Pause)
- Search-result snippet (not fetched; libreddit mirror ECONNRESET) describes Finch "App Pause" that lets users pause without losing the streak, picking up "with no guilt or pressure" — r/finch Finch Team post, ~2025, https://lr.in.psf.lt/r/finch/comments/1k1ik78/app_pause/mnmosca/?context=3 [0 user voices verified]
- Same search summary mentioned users "getting back into finch (again)" and re-downloading for accountability — UNVERIFIED (search engine summary, source pages not opened).

Confidence: LOW (company-side, unverified fetch). Inference: the existence of a pause feature implies the team saw guilt/streak loss as a churn driver on return.

### Not established for Q5
What triggers return (crisis, notification, new year, friend, old entries), shame vs relief on re-entry, reactions to "welcome back" screens — **no verified user quotes retrieved this run.**

---

## Q6 — Stopping because better / episodic use

### Theme 6.1 — Published construct: "e-attainment" (stopping once goals met is not failure)
- Definition: "e-attainment, the discontinuation of eMH engagement after personal goals have been met" — Chong et al.-type cluster analysis of myCompass, JMIR, Nov 28 2019 (older), https://pmc.ncbi.nlm.nih.gov/articles/PMC6908978/
- "users engage with an eMH tool as much and for as long as they need to reach their mental health goals" — same
- Finding: users who stopped after two self-assessments had slightly but significantly lower depression/anxiety at sign-up than those who continued; "trial attrition reported as non-adherence or dropout may reflect e-attainment."

Confidence: MEDIUM as a research framing (peer-reviewed, dated 2019); not user voice.

### Theme 6.2 — "No longer needed" is a reported but minority reason for quitting
- Scoping review of lifestyle + mental-health app abandonment (18 studies, 6 on reasons) codes "Evolving user needs and goals" with phrases "No need to track anymore" and "I achieved my fitness goal"; no mental-health-specific percentage — JMIR, Dec 18 2024, https://pmc.ncbi.nlm.nih.gov/articles/PMC11694054/
- Search-result summary (PDF not extractable) of City of Berkeley Help@Hand evaluation: Headspace abandoned because already using other strategies (35%), no longer needed it (13%), not useful (8%) — https://berkeleyca.gov/sites/default/files/documents/City%20of%20Berkeley%20Help%40Hand%20Evaluation.pdf — UNVERIFIED numbers; confirm before citing.

Confidence: LOW-MEDIUM. Two published sources point the same way (graduation is real but minority); the percentage is unverified.

### Theme 6.3 — Value fades / app becomes chore after a while (adjacent to graduation)
- "it's not really helping me anymore and is just one more thing to do before bed" — r/finch, Apr 23 2026, sentinel URL above [1]
- "I stopped using it a while back and just haven't left the group yet." — same thread [1]
- "just a birb friend I check in with once a day now" — same thread [1]

Confidence: LOW. One thread, one community, 3 voices. Ambiguous whether "not helping anymore" = improved vs. app stale. Inference only.

### Theme 6.4 — Episodic / reactive use is a recognised pattern and can still work
- Search-engine summary of a 2026 qualitative study ("How People Integrate Mental Health Apps Into Everyday Self-Care", JMIR mHealth 2026, https://mhealth.jmir.org/2026/1/e95414/PDF) reports three patterns: regular preventive use; "reactive use during periods of acute distress"; temporary problem-focused use. PDF/preprint fetch returned empty — UNVERIFIED; no participant quotes obtained.
- Search summary of 2020 Calm intermittent-use study: intermittent engagement associated with wellbeing gains; "regular use is not essential" — https://ifp.nyu.edu/?p=1455492 (older; not fetched).
- Annoying notifications appear as an abandonment code in the 2024 scoping review (one study) — PMC11694054.

Confidence: LOW (high-relevance leads, not verified this run).

### Not established for Q6
First-person "I don't need it anymore / I learned the skills" quotes; first-person reactions to apps pushing after recovery. None retrieved.

---

## Leads (next run)
- Get Reddit access (or another mirror) for r/finch, r/Anxiety, r/CBT, r/Meditation: queries "came back to finch", "deleted headspace don't need", "only open it when".
- Fetch https://mhealth.jmir.org/2026/1/e95414 HTML (not PDF) — likely best source for episodic/reactive use quotes.
- Install poppler (or ask user) to extract Berkeley Help@Hand PDF (Headspace discontinuation %s) and UCL pdig.0000185 (young adults' daily anxiety-app use, Jan 2023).
- Finch Team "App Pause" post and comments — direct evidence for return-without-guilt reactions.
- Appbot Finch article (Aug 2026) cites more reviews; App Store review pages for Finch/Headspace/Calm filtered for "back".
- JMIR 2024 e56897 (503 this run) — retry.

## Looked for but not found
- Verified user quotes on return triggers (crisis, notification, Monday/new year, friend, re-reading old entries).
- User reactions to "welcome back" screens.
- Shame vs relief on re-entry, first-person.
- First-person graduation quotes ("learned the skills", "don't need it").
- Reactions to apps pushing after the user has improved.
