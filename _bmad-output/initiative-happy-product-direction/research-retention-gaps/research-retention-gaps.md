---
title: 'market + competitive + domain research: retention-strategy gaps'
type: 'market+competitive+domain'
topic: 'Retention benchmarks, competitor push/win-back copy and pricing, clinical outcome measures, graduation thresholds, crisis messaging'
decision: 'Close the gaps named in docs/research/retention-strategy.md Self-critique 1–3 (targets, observed copy, outcome measures/graduation) plus crisis surfacing'
source: 'native run — 6 dimensions, 9 researcher digests (digests/)'
status: complete
preset: 'standard'
validation: 'normal'
created: '2026-11-09'
updated: '2026-11-09'
claims: {verified: 12, unverified: 5, overturned: 0}
---

# Research: retention-strategy gaps

**Decision this research serves:** close the three weakest sections of `docs/research/retention-strategy.md` (Self-critique 1–3) plus its crisis-surfacing note, so the targets, copy and measures rest on retrieved sources.

## Executive summary

**What to do**

1. **Targets (§8.3):**
   - **Keep D30 ≥ 8%.** Two independent primary panels put the median D30 for mental-health apps at ~3% [1][2], so 8% is about 2.5× median. That is still inference, not a benchmark.
   - **Drop every claim of a vendor D1/D7 figure.** No AppsFlyer, Adjust or Sensor Tower primary was readable. The quoted Health & Fitness D1 ranges from 20% to 34% across aggregators [3][4][5].
   - **Make Happy's first four cohorts the baseline**, and say so in the doc.
2. **Paywall (§6.5):**
   - Re-anchor on Adapty 2026: Health & Fitness install→trial 9.5% and trial→paid 42.2% [6]. RevenueCat 2025/2026 gives trial→paid 37.7–39.9% [7][8], consistent with Adapty.
   - Price into the $69.99–$79.99/yr cluster (Headspace, Calm, Wysa) [9]. A $0 Yale-backed rival (How We Feel) owns free emotion logging [9].
   - Two consumer CBT exits (Woebot, Sanvello) leave the self-guided CBT shelf thinner [10][11].
3. **Notification copy (§6.1–6.2):**
   - Real wellness pushes are content-first with no guilt (Headspace "Mindful Moment:" lines, Flo "A little time for yourself today?") [12][13]. Happy's principle-designed copy matches this; keep it.
   - Duolingo's hard stop after about 8 ignored pushes ("These reminders don't seem to be working") is the only observed stop rule [14]. Happy's stop after 3 (N4) is stricter, which is correct for this audience.
   - **No day-7/14/30 win-back copy was found for any wellness app.** It remains unobserved.
4. **Outcome measures (§8.5):**
   - **Keep PHQ-4 and run it every 14 days, not daily.** It is validated (2,149 primary-care patients; 5,030 general population), free to use, scored 0–12, with each two-item subscale flagged at ≥3 [15][16][17]. Its two-week recall window means it should not be given more often than every two weeks.
   - **Add a separate risk question.** PHQ-4 has no suicide item [17].
   - **Demote the 0–100% belief slider** to a process signal. No validation as an outcome measure exists [18].
5. **Graduation (§4.6):**
   - Anchor eligibility to the clinical dose: guided self-help is 6–8 sessions over 9–12 weeks, then a relapse-prevention plan [19][20].
   - The 12-practice / 3-week thresholds remain inference. No guideline sets a daily-to-weekly step-down [19].
   - First prevalence figure for stopping because "no longer needed": 13% of Headspace abandoners [21].
6. **Crisis (§6.6):**
   - Use FDA's January 2026 General Wellness wording: "manage stress" is fine; "helps treat an anxiety disorder" is out of scope [22].
   - Apply the Action Alliance's seven messaging don'ts [23].
   - Ship the two-source helplines: 988, 741741, 116 123, 85258, NHS 111/999 [24]–[28]. Tele-MANAS 14416 needs a primary check. **Never list KIRAN**; it was merged into Tele-MANAS [29].

**Biggest caveat:** every Health & Fitness D1/D7 figure is still aggregator-only, and none of the competitor win-back copy was observed. Both gaps need Happy's own data or a hands-on capture, not more desk research.

---

## MR1 — Retention benchmarks

- **Mental-health D30 converges on ~3%.**
  - Kaveladze et al. (2022, Apptopia data, 54 apps): about 4% still use a mental-health app at day 15 and about 3% at day 30. The top 10 apps hold 90% of monthly active users [1].
  - Baumel et al. (2019, 93 apps, panel data): median D15 3.9%, D30 3.3%. By type: peer support 8.9%, tracker 6.1%, mindfulness 4.7% [2].
  - Two independent panels agree. No 2022–2026 peer-reviewed install-cohort curve supersedes them.
- **Health & Fitness vendor numbers are unverified.** All of these come via aggregators; none was confirmed on a vendor page:
  - attributed to AppsFlyer: D1 34 / D7 19 / D30 6.4, or organic 28.7 / 17.3 / 7.9 vs paid 19.2 / 10.0 / 3.9 [3];
  - UXCam medians: 25 / 10 / 5 [4];
  - Plotline: D1 ~20, D30 3–4 [5];
  - attributed to Adjust (2023): D1 27 → D30 8 [3].
  - The vendor pages returned 404/429/403 (low confidence). Coverage of the AppsFlyer 2025 report confirms its method (1,100 apps, 10.6B installs) but publishes no Health & Fitness D1/D7/D30 [30].
- **Sensor Tower's 2025 Health & Fitness report has no mental-health retention.** It gives only fitness-rewards apps: Sweatcoin 20%, CashWalk 31% at D30 [31].
- **Research cohorts are ceilings, not benchmarks.** Wysa for Chronic Pain (n=51, clinic-recruited) kept 70% at D30 [32].
- **Subscriptions (primary):**
  - Adapty 2026, Health & Fitness: install→trial 9.5%, trial→paid 42.2%, first weekly renewal 67.7% [6].
  - RevenueCat 2026: trial→paid median 37.7%, download→paid by day 35 2.9% [7].
  - RevenueCat 2025: trial→paid 39.9%; more than 80% of trials start on day 0 [8].
- **Stopped because:** coverage (the questions were answered at the level the evidence allows) and novelty exhaustion (round 2 found no vendor primary).

## CR1 — Push and win-back copy (observed)

| App | Channel | Trigger | Verbatim copy | Src | Conf |
|---|---|---|---|---|---|
| Headspace | push | recurring series | "Mindful Moment: How you're breathing is often how you are feeling." · "Mindful Moment: What's your positive intention for the day?" · "Mindful Moment: The way we love, support, and reassure a friend in need is the way we need to speak to ourselves." | [12] | med |
| Flo | lock screen / Live Activity | daily check-in | "A little time for yourself today?" CTA "Check in" | [13] | high |
| Duolingo | return screen | first open after lapse | "Am I dreaming? Rosie, you came back!", then a choice: refresher or new course | [14] | high |
| Duolingo | push | day 3, 30 min before the user's usual time | "Rosie, you're scaring me…" | [14] | high |
| Duolingo | push (stop) | after about 8 ignored | "These reminders don't seem to be working" | [14] | high |
| Finch | settings | push categories | "Morning check in", "Sleep wind down", "Messages from Lee", "Good vibes", "Streak reminders" (labels only, no message bodies) | [33] | high |
| Insight Timer | permission prompt | onboarding | "When would you like to practice?" | [34] | high |
| Insight Timer | stats at zero | no practice | "0 consecutive days" / "Practice now to make progress towards your consecutive day goal." | [34] | high |
| Oura | in-app | user-set Rest Mode | "You don't need to reach any goals today, just concentrate on recovery." | [35] | high |

**Patterns:**
- Wellness pushes carry content, not guilt, and many have no CTA [12][13].
- Reminder timing follows the user's own habit; Duolingo fires 30 min before the usual session [14].
- Duolingo's day-3 guilt line drew user complaints [14].
- The return moment is a welcome plus a choice, not a recap [14].
- Finch makes streak reminders one category among several, each separately toggleable [33].

**Not found:** push text for Calm, Wysa, Youper, How We Feel, Daylio and Bearable; any day-7/14/30 win-back copy; any win-back email (milled.com returned 403; Reteno galleries blocked). **Stopped because:** round cap (2) reached with the gap still open.

## CR2 — Pricing and positioning (US App Store, seen 2026-11-09)

| App | Monthly | Annual | Trial | Free tier | Positioning | Src |
|---|---|---|---|---|---|---|
| Headspace | $12.99 | $69.99; Plus $94.99 | 14 days | limited | "expert-led guide to mental health"; efficacy claims, no FDA claim | [9] |
| Calm | $14.99–16.99* | $69.99–79.99* | unknown | unknown | "#1 app for sleep, meditation, and relaxation" | [9] |
| Wysa | $19.99 | $74.99–99.99 | not stated | free AI chat | "Mental Wellbeing AI"; human coaching up to $144.99/quarter | [9] |
| Finch | $5.99–9.99* | $34.99–69.99* | not stated | free core (pet, goals) | "Self-care pet app" | [9] |
| Daylio | $4.99* | $17.99–35.99* | — | logging free | "journal without typing a single line" | [9] |
| Bearable | $4.49–6.99* | $27.99–49.99* | — | basic free | symptom tracker | [9] |
| How We Feel | free | free | — | everything | Yale Center for Emotional Intelligence | [9] |
| Youper | — | $69.99 | 7 days | — | "AI Mental Health" (secondary, low) | [9] |
| Woebot | — | — | — | access code only | consumer app shut down 2025-06-30; founder cited the cost of FDA authorization | [10] |
| Sanvello | — | — | — | members only | now AbleTo SelfCare+; US listing 404 | [11] |

\* Several same-named in-app purchases exist, so which price is monthly vs annual is inferred (medium confidence). These are signs of active price testing.

## DR1 — Outcome measures

- **PHQ-4** = PHQ-2 + GAD-2.
  - Validation: 2,149 primary-care patients, two factors explaining 84% of variance [15]; general-population norms from N=5,030 [16].
  - Scoring: four items rated 0–3, two-week recall, total 0–12; each subscale is positive at ≥3. Total-score bands: 0–2 none, 3–5 mild, 6–8 moderate, 9–12 severe [17].
  - Licence: "no permission is required to reproduce", per secondary pages. Verify on phqscreeners.com before launch (medium).
- **No suicide item.** An app using PHQ-4 alone cannot detect suicidal ideation [17]. The only examples of handling PHQ-9 item 9 are trial protocols (crisis screen on any non-zero answer), not guidelines [36].
- **Digital administration:**
  - Smartphone PHQ-9 correlated r=.84 with paper but scored about 3 points higher, and more users disclosed suicidal ideation in-app [37].
  - Daily mobile PHQ-2 (N=547) is a reasonable stand-in for PHQ-9 [38].
  - PHQ-2/GAD-2 pick up change during iCBT (n≈2,400) [39].
- **Belief rating (0–100%):** standard in thought-record practice [40]. Research uses it as a process measure: behavioural experiments are rated stronger than thought records [41]. **No psychometric validation as an outcome measure was found.**

## DR2 — Graduation and healthy disengagement

- **Dose:**
  - NICE guided self-help: up to 6–8 sessions, normally over 9–12 weeks [19].
  - NHS Talking Therapies step 2: up to 6 sessions, ending with a relapse-prevention plan [20].
  - Two sources agree; medium confidence, because nice.org.uk returned 403 and its text was read from search snippets.
- **Relapse is common.** 65.8% relapsed within a year after low-intensity care (single source, low–medium) [20]. Maintenance mode therefore needs a one-tap way back to daily practice.
- **Healthy disengagement:**
  - "Effective engagement" means enough use to reach the outcome, not more use [42].
  - In myCompass (n=43,631), the moderate, tracker and super-user groups gained equally ("e-attainment") [43].
  - Of Headspace abandoners, 13% said they no longer needed it (self-selected survey) [21].
- **Dose quality beats volume.** Only activities completed per log-in predicted clinically significant change [44].
- **Boosters:** an optional booster is taken by ~31%. Preferred timing ranges from 1–2 weeks to 3–6 months, and ~60% prefer doing it on their own [45]. Evidence that boosters help is mixed [46].
- **No guideline or app publishes a daily→weekly step-down rule.** Meru runs a year-long alumni programme, which is an extended program, not a rule [47].

## DR3 — Crisis, safe messaging and regulatory boundaries

- **Platforms:**
  - Apple 1.4.1: medical apps get greater scrutiny, and apps should remind users to check with a doctor.
  - Apple 5.1.3: no health data for advertising; no personal health information in iCloud [48].
  - Google Play: the Health apps declaration is mandatory, and misleading health claims are banned [49].
  - Neither policy has a crisis or self-harm section.
- **FDA:**
  - General Wellness, reissued 2026-01-06: "relaxation or stress management" and "self-esteem" are wellness; "a claim that a product helps treat an anxiety disorder" is not [22].
  - The 2022 device-software guidance puts coping-skills apps for diagnosed conditions under *enforcement discretion*, not outside device rules [50].
  - So Happy's copy must say "manage stress / feel calmer", never "treats anxiety/depression".
- **UK MHRA:** "general wellbeing is not usually considered to be a medical purpose" (snippet, medium) [51].
- **Safe messaging (Action Alliance)** [23]:
  - don't show methods or locations;
  - don't glorify;
  - don't portray suicide as common or inevitable;
  - don't oversimplify causes;
  - never say "committed" or "successful" suicide; say "died by suicide" [23][52];
  - include help resources and hopeful, recovery framing (WHO 2023; #chatsafe 2.0) [53][54].
- **Helplines:**

  | Country | Line | Sources |
  |---|---|---|
  | US | 988, call or text (two sources); Crisis Text Line, text HOME to 741741 | [24][25][26] |
  | UK | Samaritans 116 123; NHS 111 mental-health option; 999 if life is at risk; Shout, text 85258 | [27][28][26] |
  | India | Tele-MANAS 14416 / 1-800-891-4416 (secondary only, medium) | [55] |

  KIRAN (1800-599-0019) was merged into Tele-MANAS and phased out (trade press) [29].

## Cross-dimension insights

1. **The benchmark gap is structural, not a search failure.** No vendor publishes mental-health retention; only research panels do [1][2][31]. Further desk research will not fix §8.3. Happy's own cohort data will.
2. **Regulation shapes retention copy.** The FDA line between "manage stress" and "treats anxiety" [22] binds every push, win-back and graduation string. "You've improved" framing near graduation must avoid treatment claims.
3. **PHQ-4 every 14 days lines up with graduation.** Measurement every two weeks [17] plus a 9–12-week course [19] gives 5–6 PHQ-4 points before maintenance is offered. That turns the inference-only "mood Okay+" criterion into a measured trend. The fit is an inference; the clinician should confirm it.
4. **The two exits plus the price cluster define a gap.** Self-guided consumer CBT lost Woebot and Sanvello [10][11]. The remaining players sell meditation (Headspace, Calm), chat (Wysa) or tracking (Daylio, Bearable). A free core of thought records with a paid tier priced below $69.99 sits in open space (INFERENCE).

## Recommendations

| # | Change to retention-strategy.md | Basis | Confidence |
|---|---|---|---|
| 1 | §1.1 / §8.3: cite [1][2] for MH D30 ≈3%; mark every H&F D1/D7 figure "aggregator, unverified"; keep D30 ≥8% as 2.5× median; add "re-baseline on cohorts 1–4" as a hard step | [1][2][3]–[5] | high for D30 median; low for H&F D1/D7 |
| 2 | §6.5: replace the RevenueCat-only line with Adapty install→trial 9.5% / trial→paid 42.2% plus RevenueCat 37.7–39.9%; feeds the pricing decision with the $69.99–79.99 anchor | [6][7][8][9] | high |
| 3 | §6.1: cite Headspace/Flo as observed precedent for content-first pushes; cite Duolingo's stop rule as precedent for N4 (Happy stops sooner) | [12][13][14] | medium–high |
| 4 | §8.5: PHQ-4 every 14 days, not more often; add a separate risk item that routes any non-zero answer to the Distressed variant; demote the belief slider to a process metric | [15]–[18][36] | high (PHQ-4), medium (risk routing) |
| 5 | §4.6: eligibility = ≥8 weeks since activation, ~6–8 completed sessions, and PHQ-4 trend down; always offer the one-tap return to daily; still needs clinician sign-off | [19][20][43][45] | medium; thresholds remain inference |
| 6 | §6.6 / copy rules: adopt the FDA wellness wording rule, the 7 Action Alliance don'ts, and the helpline table; never list KIRAN | [22][23][24]–[29] | high (US/UK), medium (India) |

Feeds:
- `EXPERIENCE.md`: copy rules and crisis.
- PRD: measures, pricing.
- Architecture: PHQ-4 schedule, risk routing, region-based helplines.

## Open questions

1. **Vendor Health & Fitness D1/D7/D30.** Fix: download the AppsFlyer and Adjust report PDFs by hand (they are gated). Better still, measure Happy's own cohorts.
2. **Day-7/14/30 win-back copy.** Fix: a hands-on 14-day capture of Finch, Daylio, Wysa and How We Feel with deliberate lapses. Alternatively, open gallery.reteno.com (Calm, Finch) in a browser.
3. **PHQ licence wording.** Fix: read phqscreeners.com directly.
4. **Graduation thresholds.** Fix: clinician review. No guideline exists.
5. **Tele-MANAS official confirmation.** Fix: a PIB/MoHFW primary page, read in a browser.
6. **App-specific crisis guidance** (NICE Evidence Standards Framework, ORCHA, Wysa SOS). Not retrieved; search budget was exhausted.

## Source appendix

| n | Supports | Publisher | Pub | Accessed | Conf |
|---|---|---|---|---|---|
| [1] | MH apps ~4% D15, ~3% D30; top 10 = 90% MAU | [JMIR Hum Factors — Kaveladze et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8844980/) | 2022-01 | 2026-11 | high |
| [2] | MH median D15 3.9%, D30 3.3%; by type | [JMIR — Baumel et al.](https://www.jmir.org/2019/9/e14567/) | 2019-09 | 2026-11 | high (history) |
| [3] | AppsFlyer/Adjust-attributed H&F splits (unverified) | [Business of Apps / search snippets](https://businessofapps.com/data/health-fitness-app-benchmarks) | n/d | 2026-11 | low |
| [4] | H&F medians 25/10/5 | [UXCam](https://uxcam.com/blog/mobile-app-retention-benchmarks) | 2026-10 | 2026-11 | low |
| [5] | H&F D1 ~20, D30 3–4 | [Plotline](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry) | 2025-11 | 2026-11 | low |
| [6] | H&F install→trial 9.5%, trial→paid 42.2% | [Adapty](https://adapty.io/blog/health-fitness-app-subscription-benchmarks/) | 2026-03 | 2026-11 | high |
| [7] | H&F trial→paid 37.7%; download→paid D35 2.9% | [RevenueCat SOSA 2026](https://www.revenuecat.com/state-of-subscription-apps/) | 2026 | 2026-11 | high |
| [8] | H&F trial→paid 39.9%; >80% trials day 0 | [RevenueCat SOSA 2025](https://www.revenuecat.com/state-of-subscription-apps-2025/) | 2025-03 | 2026-11 | high |
| [9] | Competitor prices, trials, positioning | [Apple App Store US listings](https://apps.apple.com/us/app/headspace-meditation-sleep/id493145008) (Headspace, Calm, Wysa, Finch, Daylio, Bearable, How We Feel, Woebot) | seen 2026-11-09 | 2026-11 | med–high |
| [10] | Woebot consumer app shut 2025-06-30 | [MobiHealthNews](https://www.mobihealthnews.com/news/woebot-health-shutting-down-its-app); STAT 2025-07-02 | 2025-07 | 2026-11 | high |
| [11] | Sanvello → AbleTo SelfCare+, members only | [AbleTo](https://www.ableto.com/self-care/introducing-ableto-self-care-for-everyday-wellness/); Ithaca College notice | 2024 | 2026-11 | med |
| [12] | Headspace "Mindful Moment" pushes | [ngrow.ai](https://www.ngrow.ai/blog/8-push-notifications-from-headspace-that-will-help-you-cultivate-mindfulness) | 2024-02 | 2026-11 | med |
| [13] | Flo check-in copy | [Mobbin](https://mobbin.com/screens/c04adbc7-f15d-4b84-9f92-2a7b34a4b833) | seen 2026-11 | 2026-11 | high |
| [14] | Duolingo return screen, day-3 push, stop rule, timing | [Growth Dives](https://growth-dives.kit.com/posts/growth-dives-duolingo-s-6-step-reactivation-experience) | ~2025 | 2026-11 | high |
| [15] | PHQ-4 validation, N=2,149 | [Psychosomatics — Kroenke et al.](https://read.qxmd.com/read/19996233) | 2009 | 2026-11 | high |
| [16] | PHQ-4 general population, N=5,030 | [J Affect Disord — Löwe et al.](https://fis.uke.de/portal/en/publications/a-4item-measure-of-depression-and-anxiety(ac9f9de2-a8c6-4391-a93a-cd38573b2a13).html) | 2010 | 2026-11 | high |
| [17] | PHQ-4 items, scoring, bands, no suicide item | [SOEP docs](https://companion.soep.de/Survey%20Design/Patient%20Health%20Questionnaire%20%E2%80%93%204%20%28PHQ-4%29.html); [SRAlab](https://www.sralab.org/rehabilitation-measures/four-item-patient-health-questionnaire-anxiety-and-depression) | n/d | 2026-11 | med–high |
| [18] | No outcome validation of belief rating found | DR1 digest (absence finding) | — | 2026-11 | med |
| [19] | NICE guided self-help 6–8 sessions / 9–12 wk; no step-down rule | [NICE CG123 via NCBI](https://ncbi.nlm.nih.gov/books/n/nicecg123/glossary.gl1/def-item/glossary.gl1-d13/) | 2011 | 2026-11 | med |
| [20] | Step 2 up to 6 sessions + relapse plan; 65.8% relapse | [RDaSH NHS Talking Therapies](https://talkingtherapies.rdash.nhs.uk/?p=228); [Cogn Ther Res 2024](https://link.springer.com/article/10.1007/s10608-024-10520-x) | 2024 | 2026-11 | med / low–med |
| [21] | 13% Headspace abandoners "no longer needed" | [JMIR Form Res — Borghouts et al.](https://formative.jmir.org/2025/1/e73457) | 2025-08 | 2026-11 | med |
| [22] | FDA General Wellness 2026 scope and anxiety exclusion | [FDA](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices) | 2026-01-06 | 2026-11 | high |
| [23] | 7 messaging don'ts | [Action Alliance](https://suicidepreventionmessaging.org/safety/messaging-donts) | n/d | 2026-11 | high |
| [24] | 988 call/text/chat, 24/7 | [988 Lifeline](https://988lifeline.org/) | live | 2026-11 | high |
| [25] | 988 launched 2022-07-16 | [SAMHSA](https://www.samhsa.gov/mental-health/988/lifeline-timeline) | n/a | 2026-11 | med–high |
| [26] | Text HOME to 741741 (US), 85258 (UK) | [Crisis Text Line](https://www.crisistextline.org/) | live | 2026-11 | high |
| [27] | Samaritans 116 123 | [Samaritans](https://www.samaritans.org/how-we-can-help/contact-samaritan/) | live | 2026-11 | high |
| [28] | NHS urgent help: 116 123, 111, 999; Shout 85258 | [NHS](https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/); [Shout](https://giveusashout.org/get-help/) | 2026-10 | 2026-11 | high |
| [29] | KIRAN merged into Tele-MANAS | [BioSpectrum India](https://biospectrumindia.com/news/98/24217/govt-merges-kiran-mental-health-rehabilitation-helpline-with-telemanas.html) | ~2024 | 2026-11 | med |
| [30] | AppsFlyer 2025 method, no H&F figures | [Baijing](https://www.baijing.cn/article/52385) | 2025-04 | 2026-11 | med |
| [31] | Sensor Tower H&F 2025: no MH retention | [Sensor Tower](https://sensortower.com/blog/state-of-mobile-health-and-fitness-in-2025) | 2025-02 | 2026-11 | high |
| [32] | Wysa chronic pain 70% D30 (clinic cohort) | [JMIR Form Res](https://pmc.ncbi.nlm.nih.gov/articles/PMC9171603/) | 2022 | 2026-11 | high (low external validity) |
| [33] | Finch notification categories | [Mobbin](https://mobbin.com/screens/fe843928-3466-49b8-ac6b-b4a11f841dc1) | seen 2026-11 | 2026-11 | high |
| [34] | Insight Timer permission and zero-streak copy | [Mobbin](https://mobbin.com/screens/f7f2d2f9-85f2-43fa-9b9b-fd9a03a36804) | seen 2026-11 | 2026-11 | high |
| [35] | Oura Rest Mode copy | [Mobbin](https://mobbin.com/flows/14f5b61d-287a-4fa9-aafe-7e88c480ce10) | seen 2026-11 | 2026-11 | high |
| [36] | PHQ-9 item-9 trial protocol handling | [ClinicalTrials.gov NCT04891224](https://cdn.clinicaltrials.gov/large-docs/24/NCT04891224/Prot_SAP_000.pdf) | 2021 | 2026-11 | med |
| [37] | Smartphone PHQ-9 r=.84, +3 points | [JMIR Ment Health — Torous et al.](https://mental.jmir.org/2015/1/e8) | 2015 | 2026-11 | high |
| [38] | Daily PHQ-2 proxy for PHQ-9 | [JMIR — Bauer et al.](https://jmir.org/2018/6/e10001) | 2018 | 2026-11 | high |
| [39] | PHQ-2/GAD-2 change-sensitive in iCBT | [Gen Hosp Psychiatry — Staples et al.](https://www.qxmd.com/pubmed/30508772) | 2019 | 2026-11 | high |
| [40] | Thought-record belief 0–100% practice | [Psychology Tools](https://www.psychologytools.com/articles/thought-records-in-cbt-10-things-therapists-need-to-know) | n/d | 2026-11 | med |
| [41] | Belief ratings as process measure | [Behav Cogn Psychother — Bennett-Levy](https://www.cambridge.org/core/journals/behavioural-and-cognitive-psychotherapy/article/abs/mechanisms-of-change-in-cognitive-therapy-the-case-of-automatic-thought-records-and-behavioural-experiments/3C86569BAE5E5B84D7E4195C2C4661A0) | 2003 | 2026-11 | med |
| [42] | Effective engagement | [Am J Prev Med — Yardley et al.](https://ueaeprints.uea.ac.uk/id/eprint/62088/) | 2016-11 | 2026-11 | high |
| [43] | e-attainment, myCompass n=43,631 | [JMIR — Sanatkar et al.](https://research.monash.edu/en/publications/using-cluster-analysis-to-explore-engagement-and-e-attainment-as-/) | 2019-11 | 2026-11 | high |
| [44] | Activities per log-in predicts change | [JMIR — Donkin et al.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3806549/) | 2013-10 | 2026-11 | high |
| [45] | Booster uptake ~31%, timing, independence | [DOAJ / JMIR 2022](https://doaj.org/article/271add7f9a33402fb7a89fbf8929cab2) | 2022-09 | 2026-11 | med |
| [46] | Booster efficacy mixed | [J Clin Child Adolesc Psychol](https://informahealthcare.com/doi/abs/10.1080/15374416.2018.1443459) | 2018 | 2026-11 | low–med |
| [47] | Meru alumni program | [GlobeNewswire](https://globenewswire.com/news-release/2021/12/20/2355336/0/en/Meru-Health-Launches-A-New-Program-to-Enhance-and-Sustain-Long-Term-Mental-Health.html) | 2021-12 | 2026-11 | med |
| [48] | Apple 1.4.1, 5.1.3 | [Apple](https://developer.apple.com/app-store/review/guidelines/) | n/d | 2026-11 | high |
| [49] | Google Play Health apps declaration | [Google](https://support.google.com/googleplay/android-developer/answer/16679511) | ©2026 | 2026-11 | high |
| [50] | FDA device software: enforcement discretion | [FDA](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/policy-device-software-functions-and-mobile-medical-applications) | 2022-09-28 | 2026-11 | high |
| [51] | MHRA wellbeing not medical purpose | [gov.uk](https://www.gov.uk/government/publications/medical-devices-software-applications-apps) | n/d | 2026-11 | med |
| [52] | "died by suicide" not "committed" | [SPRC](https://sprc.org/online-library/recommendations-for-reporting-on-suicide/) | n/d | 2026-11 | med |
| [53] | WHO media resource 2023: hope/recovery framing | [WHO](https://www.who.int/publications/i/item/9789240076846) | 2023-09-12 | 2026-11 | med |
| [54] | #chatsafe 2.0 | [PLOS ONE / Orygen](https://www.suicideinfo.ca/wp-content/uploads/2023/09/chatsafe-2.0.-updated-guidelines-to-support-young-people-to-communicate-safely-online-about-self-harm-and-suicide.pdf) | 2023 | 2026-11 | med |
| [55] | Tele-MANAS 14416 / 1-800-891-4416 | [Vikaspedia](https://en.vikaspedia.in/viewcontent/health/mental-health/tele-manas); PIB digest | n/a | 2026-11 | med–high |

## Staleness map

| Re-check by | Claims |
|---|---|
| 2027-02 | Competitor pricing [9] (3-month window) |
| 2027-05 | Woebot/Sanvello status [10][11]; push copy [12]–[14][33]–[35] |
| 2027-11 | Subscription benchmarks [6]–[8]; helplines [24]–[29][55] |
| On every load-bearing use | Regulatory text [22][48]–[51] |

Earliest re-check: **2027-02** (pricing). Run Refresh then.
