# Mastery + telemetry research

## Recommendation

Use **Evidence Ladder**. One small, authored skill map. One `skill_id` per scored item.

Count evidence. Do not infer mastery from node finish, XP, time, or mood change.

- `seen`: learner opened taught example.
- `supported`: correct after hint/example. Useful. Not mastery proof.
- `practising`: one unaided correct, same session.
- `ready`: two unaided correct attempts, on separate calendar days, at least one changed scenario.
- `retained`: `ready` plus unaided delayed correct after 7+ days.
- `needs_review`: prior `ready`/`retained` then unaided delayed miss. Keep dignity. Re-teach, do not erase history.

Use fixed, explainable rules. No BKT, IRT, half-life model, or ML in v1.

Reason: current corpus and user count cannot calibrate item difficulty, guess/slip, or forgetting. Evidence Ladder fits `node_attempts` + answers, exposes why state changed, and can later feed BKT after enough clean item-level data. Classic BKT estimates a changing skill state, but its binary, no-forgetting baseline is a poor v1 fit for changed-situation CBT use ([Corbett & Anderson](https://doi.org/10.1007/BF01099821); [KT survey](https://doi.org/10.1145/3569576)).

## Confidence

**85%.** Retrieval + feedback + spacing + varied application strong.
Exact intervals and thresholds are product defaults. Instrument. Revisit after 8 weeks or 500 retained-review attempts.

## Evidence

- Retrieval practice improves long-term retention, flexible retrieval, and transfer; feedback increases benefit ([Roediger & Butler, 2011](https://pubmed.ncbi.nlm.nih.gov/20951630/); [Butler & Roediger, 2008](https://pubmed.ncbi.nlm.nih.gov/18491500/)).
- Spacing improves retention; best gap depends on intended retention interval ([Cepeda et al., 2006](https://pubmed.ncbi.nlm.nih.gov/16719566/); [classroom meta-analysis](https://pubmed.ncbi.nlm.nih.gov/40564553/)).
- Varied retrieval/application examples improve transfer to new examples ([Butler et al., 2017](https://pubmed.ncbi.nlm.nih.gov/29265856/); [Roediger & Butler, 2011](https://pubmed.ncbi.nlm.nih.gov/20951630/)).
- Autonomy-supporting choice, optimal challenge, and effectance feedback support motivation; controlling rewards weaken it ([Niemiec & Ryan, 2009](https://selfdeterminationtheory.org/SDT/documents/2009_NiemiecRyan_TRE.pdf); [Ryan & Deci, 2000](https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_IntExtDefs.pdf)).
- PostHog React Native supports explicit custom events and a `before_send` drop/filter. Its touch autocapture may capture text by default. Disable touch autocapture on courses and protect input parents with `ph-no-capture` ([PostHog RN docs](https://posthog.com/docs/libraries/react-native)).

## Key findings

| Format | Value / CBT fit | Build | Proof | Support rule |
|---|---|---:|---|---|
| Cued recall | Name thought trap, next CBT step | P0 | unaided correct | hint -> supported only |
| Changed-situation scenario | Pick/apply skill when details change | P0 | transfer correct | simpler scenario after miss |
| Guided reconstruction | Order thought record steps | P1 | procedural correct | partial feedback; retry wrong part |
| Recognition MCQ | fast misconception check | P1 | diagnostic only | explain every option |
| Open free text | personal reflection | P2 | never auto-score/mastery | save locally/private path; no analytics |

Current `NodeEngine` checks one response then allows `Continue`, and `complete-node` stores null scores. Fix answer lifecycle before content expansion. Completion says "visited." Evidence says "showed skill."

## Mastery state model and update rules

### Content contract

Each authored scored item has:

`item_id`, `skill_id`, `evidence_type` (`recall|apply|transfer`), `support_level` (`none|hint_1|hint_2|example`), `answer_key_version`, `difficulty` (`core|stretch`), `scenario_family`.

One item maps to one primary skill in v1. Item may list prerequisite skill IDs for selection only. Do not multi-credit an answer.

### Minimal Supabase data

Keep existing `node_attempts`. Add migration only. Do not rewrite journey v5 migration.

`learning_skill_state`

| column | use |
|---|---|
| `user_id, skill_id` PK | ownership + skill |
| `state` | `unseen|seen|supported|practising|ready|retained|needs_review` |
| `unaided_correct_count` | cumulative only; never reset |
| `best_evidence` | `none|recall|apply|transfer|retained_transfer` |
| `last_evidenced_at, next_review_at` | scheduler |
| `last_outcome` | `correct|incorrect|abandoned` |
| `state_version, updated_at` | explainability + safe migrations |

`learning_item_attempts`

| column | use |
|---|---|
| `id, user_id, attempt_id, node_id, item_id, skill_id` | joins existing attempt |
| `outcome` | `correct|incorrect|partial|abandoned` |
| `evidence_type, scenario_family, support_level` | validity of proof |
| `response_ms, retry_index` | aggregate process measure |
| `answer_key_version, occurred_at` | scoring audit |

No response body here. Existing `user_node_responses.responses` must exclude free text for course learning, or store it in private user-owned exercise storage with separate retention policy. Never copy it into analytics.

### Deterministic reducer

Run server-side with scored submission. Client may preview feedback; server decides state.

1. Persist every scored submit before feedback/advance. `attempt_id` starts on node open; one item submit equals one `learning_item_attempts` row.
2. Compute `unaided = support_level === 'none'`.
3. Correct + aided: state at least `supported`; schedule short practice. Never increment unaided proof.
4. Correct + unaided: increment proof. First -> `practising`.
5. Promote `ready` only when two unaided correct proofs are on different local dates, >=24h apart, and one is `apply` or `transfer` from a different `scenario_family`.
6. Promote `retained` only for unaided correct review due >=7 days after `ready`; prefer transfer item. Do not promote from a reread.
7. Incorrect/abandon: set `last_outcome`; if `ready|retained` and review was due, set `needs_review`; otherwise retain highest honest state. Schedule relearn. No punishment.
8. Score node from scored items: percent correct first submit and final submit, both stored. Node completion stays separate. Progression uses state, not `best_score` alone.

This guards guess, retry-after-answer, and same-scenario recognition. It is conservative by design. It measures course skill evidence, not clinical improvement or treatment outcome.

## Adaptive support policy

One screen. Attempt -> specific teaching feedback -> same skill retry/new micro-item.

- First miss: say why choice fails; show one rule and one worked example. Offer `Try a simpler one` or `Skip for now`.
- Second miss / 2 hints: show two visible adaptive examples; reduce choices or ask one sub-step. Mark supported, not failed.
- Correct after support: calm feedback: "You used the clue. Try once without it later." Queue 1-day recall.
- Unaided correct: brief mechanism feedback. Next item changes surface details. No praise inflation.
- Transfer miss: treat as useful boundary. Compare old/new situation; return core application. Do not lock course.
- Free text: validate effort, never declare cognition "correct" from text. Offer an authored mapping choice if proof needed.

Hints change evidence validity, not worth. Store `support_level`; do not use arbitrary point penalties. This is more interpretable and less gameable than hint-minus-X scoring.

## Spacing scheduler

Use due queue. Maximum one new review prompt per session; user may choose `Now`, `Later today`, `Tomorrow`, `Not now`. Quiet hours and notification opt-in respected.

| result | next due |
|---|---|
| taught / aided correct | +1 day |
| first unaided correct | +2 days |
| ready | +7 days |
| retained | +30 days, then +90 days |
| miss / abandon | +1 day; if skipped twice, +7 days |

Select due skill, then item: lowest state first; due date; missing transfer proof; varied scenario family; no same item twice in a row. Cap review queue at three. Missed review is neutral; no streak loss, debt, or push escalation.

Intervals are starting defaults, not clinical prescription. Spacing evidence supports intervals tied to desired retention, not one magic schedule ([Cepeda et al.](https://pubmed.ncbi.nlm.nih.gov/16719566/)).

## Event taxonomy with properties/privacy

PostHog: product funnel only. Supabase: source of truth for state/attempts. Use lowercase `course learning_*` names. Send IDs and bounded enums only.

| Event | Properties |
|---|---|
| `course learning_item_shown` | `course_id, node_id, item_id, skill_id, evidence_type, difficulty, is_review` |
| `course learning_support_used` | above + `support_level, trigger` |
| `course learning_item_submitted` | above + `outcome, support_level, retry_index, response_ms_bucket, scenario_family, answer_key_version` |
| `course learning_feedback_shown` | `item_id, skill_id, outcome, feedback_kind` |
| `course learning_state_changed` | `skill_id, from_state, to_state, reason, next_review_days` |
| `course learning_review_prompted` | `skill_id, due_days, prompt_surface` |
| `course learning_review_actioned` | `skill_id, action=now|later|skip` |
| `course learning_node_completed` | `node_id, completion_kind=content|practice|review, first_submit_score_bucket, final_score_bucket, skills_ready_count` |

Privacy rules:

- Never send raw/free-text response, journal content, AI prompt/answer, option wording, scenario prose, mood, diagnosis, notification body, route params, or exact timestamps to PostHog.
- Bucket `response_ms` (`0-5s|6-20s|21-60s|60s+`); IDs must be opaque content IDs, not user words.
- Disable `captureTouches`; docs say default captured props include identifiers and text. Set `captureScreens: false` for exercise routes or allowlist safe route names. Mark every input ancestor `ph-no-capture`. Add `before_send` allowlist that drops all events except taxonomy.
- Use authenticated Supabase RLS; state writes go through one edge function/RPC. PostHog distinct ID must not be email/phone. Honor analytics opt-out; learning persistence remains functional.
- Retain event detail 90 days then aggregate. Keep user learning state until account deletion; delete linked attempt data on account delete.

## Progression UX

Show three honest tracks, not XP:

- **Learned today**: content nodes completed.
- **Ready to use**: skills with two spaced unaided proofs.
- **Keep fresh**: due reviews / retained skills.

Course path unlocks on content completion plus a gentle `ready` checkpoint before boss/challenge. Allow `Continue course` even when review due; gate only a safety-critical skill, with `Learn with support` escape. Finish page: "You practised X. One short check later helps it stick." Never claim therapy outcome, cure, or emotional improvement.

Keep XP cosmetic/activity-only. Rename UI label to `course activity` or award it only for a `ready`/`retained` state transition once. Never put XP, streaks, leaderboards, random chests, countdowns, or variable rewards in mastery loop. Finite goals: one unit, up to three reviews, then clear stop.

## Metrics that separate learning from completion

Track cohort rates by skill/item/version, never a single vanity total:

- content completion rate;
- first-submit unaided accuracy;
- supported-to-unaided conversion within 7 days;
- `ready` rate among content completers;
- delayed retention accuracy at 7/30 days;
- changed-situation transfer accuracy;
- hint rate and second-attempt recovery;
- review uptake / voluntary deferral;
- calibration: `ready` prediction vs next unaided review result;
- safety friction: abandon after error, repeated miss, and opt-out rate.

Success requires retention and transfer rise without higher abandon/pressure. XP earned and nodes finished are engagement diagnostics only. Never call them learning.

## Contradictions

- **Immediate feedback vs delayed feedback:** both can help MC learning. Use immediate, explanatory feedback because Happy needs safe correction and retries; reserve delayed test as spaced review. Evidence does not justify withholding help from distressed users ([Butler & Roediger](https://pubmed.ncbi.nlm.nih.gov/18491500/); [Roediger & Butler](https://pubmed.ncbi.nlm.nih.gov/20951630/)).
- **Strict gate vs autonomy:** evidence needs a standard, but hard locks make failure punitive. Use readiness for evidence/display; content remains passable with support. Gate only safety-critical skills, with support escape.
- **BKT/half-life vs explicit ladder:** models can personalize at scale, but current runtime loses item history and CBT transfer items have sparse data. Start explainable; evaluate later from clean events.

## Open questions

1. Which CBT skills are safety-critical enough for a soft readiness checkpoint?
2. Can authored course data carry stable `skill_id`, `scenario_family`, answer key, and feedback copy now?
3. Is private free-text storage required for courses, and what retention/deletion promise applies?
4. What local-time/quiet-hour and notification consent policy exists?
5. What sample size and human review rule triggers recalibration of thresholds/intervals?

## Rejected alternatives

- Completion/XP as mastery: false proof. Current system does this.
- Score-only gate: hides hints, retries, transfer, and delay.
- BKT/IRT/half-life v1: calibration debt, opaque learner explanation, not enough valid attempts.
- Deep knowledge tracing: black box; no need; cannot audit safety or content errors.
- Hint point penalties: turns help into a cost. Track support type instead.
- Streaks/leaderboards/variable rewards: pressure and activity gaming; conflicts with calm autonomy.
- Auto-score free text/LLM judgment: privacy and validity risk. Do not use for mastery proof.

## Dispatch handoff

Implement Evidence Ladder first. Touch NodeEngine, exercise contracts, one server-side scoring/state endpoint, new migration, and focused analytics wrapper. Preserve raw text boundary. Add reducer tests for aided correct, two-day readiness, transfer requirement, delayed retention, and review miss. Do not change XP/rewards except remove any mastery label.
