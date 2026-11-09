# Deepen — progress-format evidence — Round 1 digest

Decision: weekly forgiving progress vs daily repairable streak, mental-health CBT app, no shame/pressure.
Accessed 2026-10-31. One round run (~19 tool calls); round 2 not run (budget).

## Method & coverage
- WebSearch (short queries) + WebFetch on primary Duolingo blog posts. Search-engine summaries used only to locate papers; numbers below are labeled by whether I read the primary text.
- Academic: streaks (JCR), emergency reserves / slack (JMR, OBHDP), flexible vs routinized incentives (Mgmt Sci), habit formation missed days (EJSP), fresh start (Mgmt Sci), what-the-hell / goal violation (Cochran & Tesser 1996 chapter).
- Competitive: Duolingo primary blog (2 posts read); Headspace help-center + Built for Mars; Finch only via user-voice aggregators.
- NOT COVERED: Mobbin MCP (`mcp__mobbin__search_screens`) is not available in this session's tool set — zero screens examined; no screen-level claims made. Calm, Daylio, How We Feel not researched. Goal-gradient (Kivetz 2006) not retrieved this run.
- Firewall respected: no project files read. One tool-result PDF (Wharton emergency-reserves field study) was downloaded but could not be rendered (no poppler) — its numbers are NOT used.

## Academic findings
1. **Broken streaks demotivate (representation effect).** Silverman & Barasch, "On or Off Track: How (Broken) Streaks Affect Consumer Decisions," *Journal of Consumer Research* 49(6):1095–1117, 2023. Peer-reviewed. 7 studies: highlighting an intact streak raises next engagement vs highlighting a broken one; effect is independent of actual past behavior — it depends on how the log represents it. Effect sizes not retrieved this run (abstract-level only). Authors' practical note: don't foreground broken streaks; offer ways to keep streaks going. Single lab → strong lead; corroborated directionally by Sharif & Shu (different lab) below. https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb
   - Implication: the harm is the *visible break*, not missing a day. Any format whose display can show "broken" carries this cost; weekly windows make a "break" structurally rarer and less salient.
2. **Built-in slack ("emergency reserves") improves persistence after failure.** Sharif & Shu, "The benefits of emergency reserves: greater preference and persistence for goals that have slack with a cost," *Journal of Marketing Research* 54:495–509, 2017 (peer-reviewed); follow-up "Nudging persistence after failure through emergency reserves," *OBHDP* 163:17–29, 2021 (peer-reviewed). Includes a step-tracking field study: goals with emergency skip days → higher goal attainment and more steps than equivalent goals without slack; after a subgoal failure, reserves raised perceived progress → commitment → persistence. Exact effect sizes NOT verified (PDF unreadable). Note: reserves had a *small cost* — design detail matters (cost-free slack performed differently per their framing; not verified). https://econpapers.repec.org/RePEc:eee:jobhdp:v:163:y:2021:i:c:p:17-29 ; https://anderson-review.ucla.edu/emergency-reserves/
   - Implication: supports grace built into the goal (either "3 of 7 days" or freezes). Supports pre-allocated slack over after-the-fact repair.
3. **Flexible beats routinized for habit building.** Beshears, Lee, Milkman, Mislavsky, Wisdom, "Creating Exercise Habits Using Incentives: The Trade-off Between Flexibility and Routinization," *Management Science* 67(7):4139–4171, 2021. Peer-reviewed, preregistered (AEA RCT registry 3471). N=2,508 Google employees; routine (fixed daily time) incentives produced fewer gym visits than flexible (any time) incentives during and after the 4-week intervention. https://ideas.repec.org/a/inm/ormnsc/v67y2021i7p4139-4171.html
   - Caveat: flexibility here is *time-of-day*, not daily vs weekly cadence. Analogous, not direct.
4. **Missing one day doesn't materially harm habit formation.** Lally et al., "How are habits formed," *European Journal of Social Psychology*, 2010. Peer-reviewed. N=96, 12 weeks. Missing a single opportunity did not materially affect automaticity growth; authors note few missed-day data points. https://core.ac.uk/download/70653523.pdf
   - Implication: a rigid daily streak penalizes something the habit process itself barely notices — the penalty is motivational/representational (cf. #1), not functional.
5. **Fresh-start effect.** Dai, Milkman & Riis, *Management Science* 60(10):2563–2582, 2014. Peer-reviewed. Archival: goal commitments, gym visits, "diet" searches rise after temporal landmarks incl. start of week/month. Replication not checked this run. https://econpapers.repec.org/RePEc:inm:ormnsc:v:60:y:2014:i:10:p:2563-2582
   - Implication: a weekly reset (e.g., Monday) gives a built-in fresh start; a lost daily streak gives a "restart from zero," which is a fresh start only if framed as one.
6. **What-the-hell / goal-violation effect.** Cochran & Tesser (1996), in Martin & Tesser (eds), *Striving and Feeling* (book chapter, peer-reviewed press, not journal). Violating a proximal goal coded as failure can worsen later performance vs having no goal; longer-horizon framing reduces it. Primary text not read — summary via secondary sources. Lead, medium confidence.
   - Implication: daily goals are maximally proximal → more violation events; weekly framing is the mitigation the literature suggests.

**Direct head-to-head (weekly-goal vs daily-streak) in health/mental-health apps: NOT FOUND.** Every academic finding above is analogous evidence.

## Competitive observations
- **Duolingo (first-party, blog):**
  - 2017 post (May 10, 2017 — old, >3 months): Weekend Amulet A/B → +4% weekly return, −5% streak losses; Streak Wager → +14% D7 retention. Binge learners more likely to abandon than steady ones. https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals
  - 2020 post (Nov 19, 2020 — old): decoupling streak from daily goal (one lesson extends streak) → +40% learners on 7+ day streaks, +3.3% D14 retention, +1% DAU (relative). https://blog.duolingo.com/improving-the-streak
  - Lowering the daily bar (= making the streak more forgiving) moved metrics; neither post reports a weekly-goal-instead-of-streak test.
  - Widely circulated "streak freeze → +5% D14 retention, −21% churn for at-risk users, +600% IAP revenue": found ONLY on aggregator (lazyweb/econsultancy), NOT in the Duolingo primary posts I read. Treat as unverified.
  - June 2026 (fresh, ≤6 months, press): limited-time "streak restore" event for users who broke 30+ day streaks — complete 3 lessons to restore. Signals Duolingo treats lost streaks as a lapsed-user win-back lever. https://www.pocketgamer.biz/duolingo-is-restoring-lost-streaks-for-a-limited-time-aiming-to-recover-lapsed-users/
  - deceptive.design catalogs paid streak repair as a dark pattern. https://www.deceptive.design/articles/when-a-user-uses-duolingo-on-a-series-of-consecutive-days-this-is-called-a-streak-if-users-miss-a-day-they-can-pay-to-repair-it
- **Headspace:** keeps a "run streak" but lets users hide it via eye toggle in Profile (help center; date unknown). Built for Mars frames hiding as anxiety-reduction. https://help.headspace.com/hc/en-us/articles/215730567-How-does-the-run-streak-feature-work ; https://builtformars.com/ux-bites/hiding-your-headspace-streaks
- **Finch:** user-voice sources say streaks can be paused; not verified from Finch primary source.
- Calm, Daylio, How We Feel: not researched. No Mobbin screens (tool unavailable; Mobbin has no capture dates regardless).

## User voice
- Krasteva (2023), University of Twente bachelor thesis (not peer-reviewed), qualitative interviews on self-care app gamification: streak/statistics drew mostly negative comments. https://purl.utwente.nl/essays/96506
- Reddit (via snapshot aggregator, not first-hand Reddit fetch): Finch user lost 400+ day streak then stopped using app ~3 months; Headspace users report streak-related anxiety. https://reddit.sentinel-team.org/posts/1sb7u5c/snapshots/2026-04-03T16%3A51%3A00.928384Z
- ReachOut forums (AU youth mental-health community) surfaced in search; content not read.
- Prevalence: NOT claimable — only one community verifiable-ish (Reddit via aggregator) + one thesis. Answer-engine claim that "a JMIR study found gamified features trigger guilt" could not be traced to a specific paper → excluded.

## Claims list
| # | claim | source URL | publisher | pub_date | accessed | confidence | class |
|---|---|---|---|---|---|---|---|
| 1 | Highlighting a broken (vs intact) logged streak reduces subsequent engagement, independent of actual behavior (7 studies) | https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb | Journal of Consumer Research (OUP) | 2023-04 | 2026-10-31 | high (direction); effect size unverified | academic-evidence |
| 2 | Goals with pre-set slack ("emergency reserves") increase persistence after subgoal failure and goal attainment (incl. step field study) | https://econpapers.repec.org/RePEc:eee:jobhdp:v:163:y:2021:i:c:p:17-29 | J. Marketing Research 2017; OBHDP 2021 | 2017-06; 2021 | 2026-10-31 | medium-high (numbers not read) | academic-evidence |
| 3 | Flexible-timing incentives beat routinized-timing incentives for gym habit, during and after intervention (N=2,508) | https://ideas.repec.org/a/inm/ormnsc/v67y2021i7p4139-4171.html | Management Science | 2021 | 2026-10-31 | high | academic-evidence |
| 4 | Missing one opportunity did not materially affect habit formation (N=96, few missed points) | https://core.ac.uk/download/70653523.pdf | Eur. J. Social Psychology | 2010 | 2026-10-31 | medium | academic-evidence |
| 5 | Start-of-week/month landmarks increase aspirational goal behavior | https://econpapers.repec.org/RePEc:inm:ormnsc:v:60:y:2014:i:10:p:2563-2582 | Management Science | 2014 | 2026-10-31 | high (replication unchecked) | academic-evidence |
| 6 | Perceived goal violation can worsen later performance vs no goal; longer-horizon framing mitigates | https://www.routledge.com/Striving-and-Feeling-Interactions-Among-Goals-Affect-and-Self-regulation/Martin-Tesser/p/book/9780805820393 | Erlbaum/Routledge (chapter) | 1996 | 2026-10-31 | medium-low (secondary) | academic-evidence |
| 7 | Weekend Amulet (skip-day grace) A/B: +4% weekly return, −5% streak losses | https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals | Duolingo | 2017-05-10 | 2026-10-31 | medium (first-party, old) | first-party-metric |
| 8 | Lowering streak bar to one lesson/day: +40% learners on 7+ day streaks, +3.3% D14 retention | https://blog.duolingo.com/improving-the-streak | Duolingo | 2020-11-19 | 2026-10-31 | medium (first-party, old) | first-party-metric |
| 9 | Streak freeze: +5% D14 retention, −21% at-risk churn | https://www.lazyweb.com/research/duolingo-retention-experiments.md | aggregator | unknown | 2026-10-31 | low (no primary found) | first-party-metric |
| 10 | Duolingo ran June 2026 limited "restore lost 30+ day streak" event | https://www.pocketgamer.biz/duolingo-is-restoring-lost-streaks-for-a-limited-time-aiming-to-recover-lapsed-users/ | PocketGamer.biz | 2026-06 | 2026-10-31 | medium | competitor-feature |
| 11 | Headspace lets users hide run streak | https://help.headspace.com/hc/en-us/articles/215730567-How-does-the-run-streak-feature-work | Headspace | unknown | 2026-10-31 | medium | competitor-feature |
| 12 | Self-care app users comment mostly negatively on streaks/statistics | https://purl.utwente.nl/essays/96506 | Univ. Twente (thesis) | 2023 | 2026-10-31 | low | sentiment |
| 13 | Streak loss in Finch/Headspace linked to anxiety and app abandonment (anecdote) | https://reddit.sentinel-team.org/posts/1sb7u5c/snapshots/2026-04-03T16%3A51%3A00.928384Z | Reddit via aggregator | 2026-04 | 2026-10-31 | low | sentiment |

## Synthesis (for the decision)
- Evidence leans toward **weekly forgiving progress**, moderately: (a) visible breaks are the demotivating element (#1); (b) pre-allocated slack sustains persistence after a miss (#2); (c) flexibility beats rigidity for habit (#3); (d) a single miss is functionally harmless to habit (#4); (e) weekly windows carry a built-in fresh start (#5) and longer horizon blunts what-the-hell (#6).
- But Duolingo's data show daily streaks *with forgiveness* lift retention (#7, #8). A "daily repairable streak" captures much of the same mechanism IF breaks are never displayed as failure. Repair-after-break (vs pre-allocated grace) has the weakest support and dark-pattern associations when paid.
- No direct comparison exists in what I found; and none of the academic evidence is from mental-health populations.

## Leads (round 2 if run)
- Pull Silverman & Barasch effect sizes + any follow-up on "streak restoration" framing.
- Read Sharif & Shu JMR 2017 numbers; check whether *cost-free* slack underperforms costly slack (relevant: a free freeze may behave differently).
- Kivetz, Urminsky & Zheng 2006 goal-gradient (JMR) — implications for "3 of 3 this week" progress bars and post-reward slowdown.
- Search JMIR / JMIR Mental Health for gamification + engagement in mHealth (e.g., Cheng et al. 2019 gamification in mental health apps review; Six et al. 2021 meta-analysis of gamification in mental health apps).
- Polivy & Herman abstinence-violation original; Marlatt AVE in relapse prevention — check for app studies.
- Mobbin screens for Duolingo/Finch/Headspace/Daylio/How We Feel once tool is available.
- Duolingo 2024–2026 earnings letters for any streak-freeze/repair or weekly "Friends Quest" metrics.

## Looked for, not found
- Any RCT or field experiment comparing weekly-count goals vs daily streaks (any domain, especially health/mental health).
- Primary-source Duolingo streak-freeze / streak-repair metrics.
- Peer-reviewed study specifically measuring streak-induced anxiety/guilt in mental-health apps (claimed by answer engine; untraceable).
- Data from Finch, Calm, Daylio, How We Feel on progress mechanics.
