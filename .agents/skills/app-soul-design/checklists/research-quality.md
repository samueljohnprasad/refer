# Research-quality checklist

A phase FAILS if any line fails. Items marked **[M]** are enforced by `scripts/check_phase.py`; items marked **[J]** need the agent's judgment and must be recorded as `[PASS]`/`[FAIL] <id>` in the artifact's `## Critique (pass 1)`.

## RQ1 Sourcing
- **RQ1.1 [M]** Every `- Claim:` line is followed (within its finding) by `- Evidence:` containing `[S#]`, a `mobbin.com` URL, or `inference:`.
- **RQ1.2 [M]** Every `[S#]` cited exists in `## Sources`; no source is listed but never cited.
- **RQ1.3 [M]** Inference-only evidence lines ≤ 30% of all evidence lines.
- **RQ1.4 [M]** Minimum distinct non-internal sources: P1 ≥12 (≥8 tagged `(peer)`), P2 ≥10 apps × ≥4 Mobbin URLs each, P3 ≥6, P4 ≥8, P5 ≥5, P6 ≥3 (plus phase cross-references).
- **RQ1.5 [J]** Each cited source was actually opened (WebFetch/Mobbin image viewed) in this run; a source recalled from memory but not verified is marked `(unverified)` and does not count toward RQ1.4.
- **RQ1.6 [J]** No source is cited for a claim it does not make. Spot-check 3 random citations per phase and record which.

## RQ2 Specificity
- **RQ2.1 [M]** Banned vague words (clean, modern, engaging, delightful, intuitive, seamless, sleek, beautiful, fun, nice, friendly, playful, premium) appear outside quotes only on lines that also contain a number.
- **RQ2.2 [M]** Every finding has `- Mechanism:` (the causal link) and `- So what for Happy:`.
- **RQ2.3 [J]** Every "So what" names a concrete target: a screen, a string, a token, a cadence, or a forbidden pattern. "Consider warmth" fails.
- **RQ2.4 [J]** Numbers have units (ms, pt, px, %, days, per-session).

## RQ3 Honesty
- **RQ3.1 [M]** `## Contradictions` has ≥2 entries (P5, P6: ≥1), each ending with a `Decision:`.
- **RQ3.2 [M]** `## Rejected ideas` has ≥3 entries.
- **RQ3.3 [J]** Effect sizes or study limits are stated where known (sample size, population, lab vs field). A single-study claim is labelled as such.
- **RQ3.4 [J]** Evidence from non-clinical contexts (games, ed-tech, consumer apps) applied to mental health is flagged as a transfer and dose-adjusted.

## RQ4 Multi-pass
- **RQ4.1 [M]** `Pass:` header ≥ 2.
- **RQ4.2 [M]** `## Critique (pass 1)` present with ≥5 checklist lines, at least one `[FAIL]` or an explicit statement `No FAIL found; spot-checked: …` listing the spot-checks.
- **RQ4.3 [M]** `## Revisions` present and references each `[FAIL]` id from the critique.
- **RQ4.4 [M]** `## Self-critique` present with `Weakest part:` and `A further pass should:`.

## RQ5 Decision-making
- **RQ5.1 [J]** The artifact makes decisions. Phrases like "you could", "options include", "it depends", "consider either" in the Summary fail.
- **RQ5.2 [J]** Every decision traces to ≥1 finding id.
