# Recommendation

Use one shared evidence loop for all v1 categories.

`Cue -> unaided answer -> Check -> rule-specific feedback -> changed-example retry -> faded support -> later mixed review`.

Keep three existing categories. Upgrade shell, config, state, and item variants. Do not add course-specific game mechanics.

# Evidence

- Retrieval practice improves durable retention more than repeat study. Repeated testing also improves transfer to new inference questions and new knowledge domains. [Karpicke & Roediger, 2008](https://doi.org/10.1126/science.1152408); [Butler, 2010](https://pubmed.ncbi.nlm.nih.gov/20804289/)
- Practice with different examples improves transfer more than repeating one example. Changed retry is learning design, not cosmetic variation. [Butler et al., 2017](https://pubmed.ncbi.nlm.nih.gov/29265856/)
- Corrective feedback reduces later lure/misinformation errors. Feedback following a missed choice must state correct rule and answer. [Butler & Roediger, 2008](https://pubmed.ncbi.nlm.nih.gov/18491500/)
- Spaced re-exposure supports delayed retention; repeated retrieval with feedback matters more than a special expanding schedule. [IES WWC guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/1); [Karpicke & Roediger, 2010](https://pubmed.ncbi.nlm.nih.gov/19966244/)
- Worked examples help novices. Fade support toward independent problem solving. [Renkl et al., 2004](https://eric.ed.gov/?id=EJ732331)

# V1 mechanics to implement

## Shared NodeEngine shell

- Show short goal cue above prompt: `Practice: spot thought pattern.`
- Show calm progress: `1 of 3`. No score, XP, timer, hearts, streak risk, or rank.
- Disable `Check` until bounded answer exists. Use selection haptic only.
- On check, keep learner answer visible. Show inline `That fits because...` or `Try another way: ...`; never generic wrong label.
- Correct path: one-sentence rule + continue. Add small check transition, no confetti/variable reward.

## Config contract

- Add per-item `variants` in mock v1 config. Same `skillId`, same category/format, changed situation/options/correct answer.
- Add `support` levels per item: `clue`, `easier`, `worked`. `easier` must change interaction: reduce distractors or pre-highlight cue; not only change text.
- Add `review` metadata: `skillId`, `scenarioFamily`, `dueAfterDays`, `requiresUnaided`. Keep data bounded IDs only.
- Keep support, attempt count, displayed variant ID, outcome, and resolved mode in RTK state and AsyncStorage draft. No prose/personal situation/mood data.

## Retry state machine

- First miss: show corrective rule, clear response, load next changed variant, mark `support=clue`. Do not advance.
- Second miss: show one worked example (`cue -> reasoning -> answer`), reduce one difficulty, load changed variant, mark `support=worked`.
- Third miss or explicit skip: offer `See example and continue` or `Skip for now`. Record `assisted`/`skipped`, never `mastered`.
- Correct unaided: record `independent_correct`. Correct after support: record `supported_correct`; resolve node but schedule earlier review.
- Later review: use same skill with different scenario family and no support first. Treat only unaided changed-case success as transfer evidence.

## Category mapping

- `recall`: hide word bank first when config permits; clue reveals one cue/partial bank. Retry uses different cue wording.
- `scenario`: choose situation then reason; miss routes to changed situation, then worked `situation -> cue -> reason` example.
- `discrimination`: select closest pattern; `easier` removes two low-value distractors and highlights discriminating cue. Retry swaps scenario and distractor order.

## Local review loop

- V1 mock-only: create bounded local review queue from resolved evidence. Due rules: next-session after supported/assisted result; `+1d`, `+3d`, `+10d` after independent success. Pilot-tunable, not clinical truth.
- Do not claim mastery from completion, time, mood, reflection, or supported answer. Use `introduced -> practising -> ready_to_use -> kept_fresh`; `ready_to_use` needs two unaided correct answers on separate days, including one changed scenario.

# Risks / don't do

- Do not repeat exact missed item. It tests recognition of prior answer, not transfer.
- Do not award mastery after clue, worked example, skip, or completion.
- Do not persist free response, journals, voice, personal context, diagnosis, symptom score, or mood explanation.
- Do not imply answers diagnose user or explain their mental health. Teach a named concept; say `This is one pattern to notice`, not `You have this distortion`.
- Do not force disclosure. Every exercise works with authored fictional situations.
- Do not turn review intervals or thresholds into clinical claims. Measure delayed unaided success and adjust in pilot.

# Sources

1. Karpicke JD, Roediger HL. [The critical importance of retrieval for learning](https://doi.org/10.1126/science.1152408). *Science*. 2008.
2. Butler AC. [Repeated testing produces superior transfer of learning relative to repeated studying](https://pubmed.ncbi.nlm.nih.gov/20804289/). *J Exp Psychol Learn Mem Cogn*. 2010.
3. Butler AC, Black-Maier AC, Raley ND, Marsh EJ. [Retrieving and applying knowledge to different examples promotes transfer](https://pubmed.ncbi.nlm.nih.gov/29265856/). *J Exp Psychol Appl*. 2017.
4. Butler AC, Roediger HL. [Feedback enhances positive effects and reduces negative effects of multiple-choice testing](https://pubmed.ncbi.nlm.nih.gov/18491500/). *Mem Cognit*. 2008.
5. U.S. Institute of Education Sciences. [Organizing instruction and study to improve student learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1). What Works Clearinghouse.
6. Renkl A, Atkinson RK, Maier UH, Staley R. [How fading worked solution steps works](https://eric.ed.gov/?id=EJ732331). *Instructional Science*. 2004.
