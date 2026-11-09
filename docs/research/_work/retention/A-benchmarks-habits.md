# Digest A — Retention benchmarks, activation, habits, streaks, notifications, gamification

Run: 2026-11-09. ~23 tool calls. Method caveat: several primary pages (Adjust, Business of Apps, Duolingo blog) returned 403/429/503 on fetch; claims marked "via search snippet" were read from search-engine extracts of the named page, not the full page. Treat those as medium/low until the primary is opened.

## Q1. D1/D7/D30 retention benchmarks

- Health & Fitness D30 retention ~3.7% (one 2025 benchmark report); split elsewhere as 3.9% iOS / 3.4% Android. Origin report not confirmed (likely AppsFlyer 2025 App Retention Benchmarks, appsflyer.com/?p=453529, or Adjust). — Search-snippet aggregation of uxcam.com/blog/mobile-app-retention-benchmarks, businessofapps.com/data/health-fitness-app-benchmarks, plotline.so (2025-11) (accessed 2026-11) [low] [class: benchmark]
- Health D1 retention "averages 20–30%"; D30 "6–8% across full calendar year" — conflicts with 3–4% above; likely different denominators/data sets. — Sahha (vendor blog, 2026-01, https://resources.sahha.ai/news/health-app-churn-retention) via snippet [low] [class: vendor-claim]
- "Average mobile app loses 57% of users within first 24 hours" (i.e., ~43% all-app D1 is NOT implied; snippet ambiguous). — Adjust (adjust.com blog, mobile-app-trends-2025) via snippet [low] [class: benchmark]
- Mental-health apps (93 apps, panel data): median D30 retention 3.3% (IQR 6.2%). By type at D30: peer support 8.9%, trackers 6.1%, mindfulness/meditation 4.7%, breathing 0.0%. — Baumel, Muench, Edan, Kane, "Objective User Engagement With Mental Health Apps", J Med Internet Res 21(9):e14567 (2019-09, https://www.jmir.org/2019/9/E14567/) [high] [class: empirical]
  - Inference: older (2019) but the only primary, category-specific mental-health number found. A CBT app hitting ~5–9% D30 would be above median for its category.
- Amplitude 2025 Product Benchmark Report (2,600+ companies, cross-industry): ≥7% D7 retention = top quartile; 69% of top-D7 performers were also top 3-month performers. — Amplitude blog "7% retention rule" (amplitude.com/blog/7-percent-retention-rule, 2025) [med] [class: benchmark]
  - Note: Amplitude counts product-level retention across web+mobile; not directly comparable to app-store-install cohorts.
- RevenueCat State of Subscription Apps 2025: H&F median trial-to-paid 39.9%, top-decile 68.3%; H&F median 60-day revenue per install $0.63; only 5% of H&F apps reach $10k revenue in 2 years; H&F "struggles to reactivate" vs benchmark. No D1/D7/D30 install retention found in snippet. — RevenueCat (2025-03, https://www.revenuecat.com/blog/company/the-state-of-subscription-apps-2025-launch) via secondary coverage [med] [class: benchmark]
- Education D1/D7/D30 and meditation-specific Sensor Tower numbers: not retrieved this run (see "not found").

## Q2. Top quartile vs median

- Amplitude: early (D7) retention is the strongest predictor of 3-month retention in top performers (69% overlap). Prescription in report = speed users to core value in week 1. — Amplitude 2025 (above) [med] [class: benchmark]
- Inference (labelled): top-quartile mental-health subcategories in Baumel 2019 were ones with a recurring, socially or self-referential reason to return (peer support, tracking), not one-off tools (breathing) — suggests Home should foreground a returning artifact (mood log, journal, thread) not just a tool menu.
- Mixpanel/Reforge differentiators: not retrieved.

## Q3. Aha moment / activation

- Facebook "7 friends in 10 days" is widely attributed to Chamath Palihapitiya's growth team; sources found are retellings (podcast digests, blog case studies), none primary/internal data. Treat as folklore-grade: real heuristic, no published analysis. — recapio.com digest of Palihapitiya talk; carolinefrost.github.io "7 friends metric is dead" (2021-11) [low] [class: folklore]
- Slack 2,000 messages, Twitter follows: not verified this run → folklore until sourced.
- Amplitude's operational definition (D7 ≥7% as activation proxy) is the only quantified method found. [med] [class: benchmark]

## Q4. Habit formation

- Lally et al. 2010 (Eur J Soc Psychol): 96 participants, one daily cue-linked behavior for 84 days; median ~66 days to plateau automaticity, range 18 to 254 (extrapolated). A single missed opportunity did not materially disrupt automaticity growth. — BPS Research Digest; Univ. of Surrey interview with Lally (surrey.ac.uk news) ; thebehavioralscientist.com summary [high] [class: empirical]
  - Lally herself: "66 days" true for some people/habits, not most. — Surrey news [high]
  - Decision relevance: missed days are not catastrophic for habit formation → design should not punish a missed day.
- Gollwitzer & Sheeran 2006 meta-analysis (Adv Exp Soc Psychol 38:69–119): 94 independent tests, 63 reports; implementation intentions (if-then plans) d = 0.65 on goal attainment. — socmot.uni-konstanz.de publication page [high] [class: empirical]
- Wood & Neal 2007 (Psychological Review): habits = learned context-cue → response associations; cue perception automatically activates the response. Supports anchoring practice to a stable daily cue. — dornsife.usc.edu PDF [high] [class: empirical/theory]
- BJ Fogg Tiny Habits peer-review status, Hook model (Eyal) empirical status: not checked this run. Hook model = practitioner framework, no peer-reviewed validation found (absence of evidence, not evidence of absence).

## Q5. Streaks

- Silverman & Barasch, "On or Off Track: How (Broken) Streaks Affect Consumer Decisions", J Consumer Research 49(6):1095–1117 (2023-04, doi 10.1093/jcr/ucac029): 7 studies; intact logged streaks increase subsequent engagement vs broken ones, independent of actual past behavior — depends only on how the log represents it. Effect amplified when break attributed to self; attenuated when the streak can be "repaired". — UDSpace / CU Boulder pages [high] [class: empirical]
  - Decision relevance: streak display is a double-edged lever; after a miss, showing a broken streak demotivates; offering repair/framing as external buffers it.
- Duolingo: Streak Freeze reduced churn 21% for users at risk of breaking a streak; separating daily goal from streak raised % of new learners on a streak by 19%. — Duolingo blog "improving-the-streak" / "how-duolingo-streak-builds-habit" via search snippet (fetch 503) [med] [class: vendor-claim]
- Duolingo has run 600+ streak experiments; copy tests cheap and high impact. No numbers on page. — Lenny's Newsletter "Behind the product: Duolingo streaks" (Jackson Shuttleworth) [med] [class: vendor-claim]
- Duolingo iOS widget: widget users retain better "even when controlling for" self-selection; no percentage found. — blog.duolingo.com/widget-feature via snippet [low] [class: vendor-claim]
- Fresh-start effect: Dai, Milkman, Riis 2014 (Management Science): gym visits (11,912 members, 442 days), "diet" searches and goal commitments rise after temporal landmarks (new week/month/semester, birthdays, holidays). — APS "Why Monday is the best day…"; thebehavioralscientist.com [high] [class: empirical]
  - Decision relevance: Monday/1st-of-month re-entry messaging and "new week" Home framing are evidence-backed for lapsed users.
- "What-the-hell effect" specific streak papers, Mehr et al.: not retrieved.

## Q6. Notifications

- Bidargaddi et al. 2018, JMIR mHealth uHealth 6(11):e10123, microrandomized trial, 1,255 users, 89 days, workplace well-being app: tailored push → +3.9% relative likelihood of engagement within 24h (RR 1.039, 95% CI 1.01–1.08). Best slot 12:30 pm (+8.8%); weekend 12:30 pm +11.8%; weekend overall +8.7% vs weekday +2.5% (difference NS, p=.18). Effect attenuated over study but NS (p=.84). No increase in attrition. — PMC6293241 (2018-11) [high] [class: empirical]
  - Decision relevance: effect is small; timing matters more than sending at all; midday/weekend windows beat evenings in this population.
- HeartSteps MRT (Klasnja et al., 37 participants, 42 days, 5 randomizations/day): any suggestion vs none → +66% (167 steps) in 30 min window, but +107% at start, decaying over time. — PMC6401341; arXiv 2410.15049 [high] [class: empirical]
  - Decision relevance: habituation to prompts is real; prompt value is front-loaded → D0–D7 prompts likely worth more than D30.
- Airship 2025/2026 benchmarks: median push opt-in 53.3% Android / 48.85% iOS (Android dropped from 71.3% 2023 after Android 13 runtime permission). Health & Fitness opt-in 43.2% Android / 33.5% iOS; open rate 11.9% Android / 14.2% iOS. — Airship "Mobile App Push Notification Benchmarks for 2026" + 2025 PDF (growth.airship.com) via snippet [med] [class: benchmark]
- Frequency vs disable/uninstall: 43% disable at 2–5 pushes/week; 30% stop using app at 6–10/week; 13% disable at even 1/week; "80% disable or uninstall if unhappy with number". — Survey stats aggregated by businessofapps / mobilemarketingmagazine / Localytics/Upland (2018–2021 surveys) via snippet [low] [class: vendor-claim; self-reported intent, not behavior]
- Permission-priming opt-in lift, Pielot et al.: not retrieved.

## Q7. Gentle vs aggressive gamification

- Sailer & Homner 2020 (Educ Psychol Rev 32:77–112): gamification effects cognitive g=.49, motivational g=.36, behavioral small-significant; cognitive stable under rigorous designs, motivational/behavioral NOT stable. Game fiction (narrative) and competition+collaboration / social interaction moderated behavioral gains. — uni-augsburg OPUS record [high] [class: empirical]
  - Inference: narrative/companion framing (e.g. mascot story) has better evidence than points/leaderboards alone; motivational effects are fragile.
- Silverman & Barasch (above) is the strongest evidence on the backfire side: broken-streak representation reduces engagement, buffered by repair.
- Finch/Headspace documented removal of streak pressure: not found.

## Leads
- AppsFlyer 2025 App Retention Benchmarks report (appsflyer.com/?p=453529) — likely primary for H&F 3.7% D30 and Education numbers.
- Adjust "US app retention by vertical" and "mobile-app-retention-benchmarks-2023" (429 this run) — retry.
- Amplitude healthcare product benchmarks (amplitude.com/blog/healthcare-product-benchmarks).
- Sensor Tower "State of Mobile Health & Fitness 2025" (sensortower.com/blog/state-of-mobile-health-and-fitness-in-2025).
- Duolingo blog full text (widget-feature, improving-the-streak) for exact numbers; lazyweb.com "Duolingo retention experiments" aggregation.
- Klasnja et al. 2019 Ann Behav Med (HeartSteps efficacy) for primary decay numbers.

## Looked for but not found (this run)
- Education app D1/D7/D30 from a named primary report.
- Meditation-specific benchmarks from Sensor Tower / Headspace / Calm.
- Primary data for Slack 2,000 messages / Twitter follow thresholds.
- BJ Fogg peer-review status; Hook model empirical validation.
- Mehr et al. streak paper; "what-the-hell" effect applied to app streaks.
- Pielot et al. notification studies; permission-priming opt-in lift data.
- Finch / Headspace public statements on removing streak pressure.
- Mixpanel / Reforge top-quartile differentiators.
