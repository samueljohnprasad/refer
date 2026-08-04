# Learning science report — bite-size-learning-flow

## Recommendation

Ship one calm loop:

`Answer -> one inline feedback surface -> rule/clue -> supported retry on changed or editable attempt -> continue only after resolved`

Make wrong answer feel like practice, not failure. Keep low stakes. No red error footer. No duplicate feedback. No score/lives/timer. Use short task/process feedback: “Not quite. Look for the thought that makes the feeling bigger.” Then give one clue and let user try again.

## Confidence

High, 86%.

Strong evidence supports retrieval practice + corrective feedback + low extraneous load. Medium evidence supports exact mental-health tone because app-specific CBT exercise UI trials are thinner.

## Strong sources

- Roediger/Karpicke testing-effect line, via IES bibliography: repeated retrieval and retrieval practice improve long-term retention; equal spacing helps long-term retention. Source: https://ies.ed.gov/use-work/awards/test-enhanced-learning
- Butler & Roediger 2008, *Memory & Cognition*: multiple-choice testing can teach lures; immediate or delayed feedback increased later correct recall and reduced lure intrusions versus no feedback. Source: https://link.springer.com/article/10.3758/MC.36.3.604
- Metcalfe 2017, *Annual Review of Psychology*: errors followed by corrective feedback are useful; analysis of reasoning behind the error matters; error practice should be low stakes. Source: https://www.columbia.edu/cu/psychology/metcalfe/PDFs/Learning%20from%20errorsAnnual%20ReviewMetcalfe2016.pdf
- Wisniewski/Zierer/Hattie 2020 meta-analysis: feedback must carry information value; specific comments beat grade-like signals; self/praise feedback is weak; corrective feedback is useful for new skills/tasks. Source: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.03087/full

## Medium sources

- Paas & van Merrienboer 2020, cognitive-load theory: design should replace unproductive load with productive load. Source: https://journals.sagepub.com/doi/10.1177/0963721420922183
- Martin et al. 2024, motivation + cognitive load: load-reducing instruction plus autonomy support/structure relates to lower load and better motivation/engagement. Source: https://link.springer.com/article/10.1007/s10648-023-09841-2
- Gan et al. 2021 systematic review/meta-analysis of digital mental-health engagement: more module/content engagement modestly associates with better mental-health outcomes; engagement evidence is heterogeneous, so remove avoidable friction. Source: https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2021.764079/full
- APA App Evaluation Model: mental-health apps should be usable, accessible, evidence-informed, privacy-aware, and should consider reading level and user feedback. Source: https://www.psychiatry.org/psychiatrists/practice/mental-health-apps/the-app-evaluation-model

## Key findings

1. Retrieval beats reread for durable learning. V1 should make user actively pick/recall/apply, not only read lesson cards.
2. Wrong answers are valuable only if corrected fast enough and clearly. If user sees red footer + vague copy + no retry, app trains shame or exits, not skill.
3. Multiple-choice can create false learning from lures. So after wrong selection, show why that choice misses the rule, then require another attempt or a changed supported case.
4. Feedback should be task/process/self-regulation, not self-judgment. Good: “This answer names a feeling, not the thought.” Bad: “Incorrect” / “Try harder” / big red failure state.
5. Cognitive load says one thing at a time. One feedback surface. Hide support row during feedback. Keep CTA simple: `Try with clue`, then `Continue`.
6. Mental-health-safe tone needs autonomy. Keep `Skip for now`, avoid streak/lives/timer pressure, and make retry supportive.
7. Bite-size standard is not “shorter screen.” It is short teach + retrieval + correction + supported retry + advance after resolution.

## Contradictions

- Immediate vs delayed feedback is mixed in education research. For this app, choose immediate inline feedback because v1 is mobile, bite-size, anxiety-sensitive, and session memory is short. Delayed feedback may help some lab retention tasks, but it adds friction and lets misconceptions sit.
- Errorful learning helps, but mental-health context punishes easily. Resolve by keeping the error, removing punitive visual language, and adding calm correction + retry.
- Engagement in DMHI outcomes is only modest/heterogeneous. Still relevant: avoidable friction and shame likely reduce completion, and completion is one measurable path to benefit.

## Open questions

- What is the minimum retry rule for v1: must correct once, or can skip after one supported attempt?
- Should changed-example retry ship now, or first ship editable same-example retry and add changed-example next?
- Which telemetry is allowed: answer correctness/support use only, with no private reflection text?

## Rejected alternatives

- Keep wrong answer advance: reject. It breaks retrieval-feedback loop and can teach wrong rules.
- Add Duolingo pressure: reject. Lives, red failure, timers, score pressure are bad fit for mental-health skill learning.
- Show two feedback surfaces: reject. Duplicate negative signal raises cognitive load and shame.
- Modal quiz result screen: reject. Adds interruption and turns learning into test event.
- Hide support until user fails many times: reject. Support should be visible but calm during idle attempts; hidden during feedback.

## Product rule

For v1, wrong answer should never be a dead end and never be a scold. It should become a tiny teaching moment:

`Not quite -> why -> clue -> try again -> continue`
