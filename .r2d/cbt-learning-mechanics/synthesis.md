# Synthesis — cbt-learning-mechanics

## Converged direction

All three reports pick same loop:

`teach -> retrieve -> explain/correct -> changed case -> delayed retrieval`

Use one primary `skill_id` per scored item. Count bounded evidence. Keep completion, activity, symptom change, and learning separate.

## Contradictions resolved

- Typed recall vs scenario transfer: use both in sequence. Recall proves access; changed case proves use.
- Examples visible vs answer hidden: show 2 visible examples on open personal-generation steps. On scored retrieval, show structure-only examples; reveal answer-bearing examples after support request or miss.
- Interleaving vs novice load: block one new skill first. Mix close concepts only after initial correct practice.
- Immediate vs delayed feedback: correct immediately. Delay next test, not explanation.
- Spacing schedules varied across reports: start `same session, +1d, +3d, +10d, +30d, +90d`. Tune against retention, not engagement.
- Seven internal states vs simple UI: expose 4 stages: `introduced`, `practising`, `ready`, `retained`. Keep `needs_review` as flag, not demotion.
- Hard gates vs autonomy: never hard-lock normal course flow. Use supported path and optional review. Gate only future safety-critical skills after clinical/product decision.
- BKT/IRT vs explicit rules: choose deterministic Evidence Ladder v1. Reconsider models only after clean item-level evidence exists.
- Free text vs objective proof: keep private reflection. Never auto-score it or count it as mastery.
- CBT treatment evidence vs wellness product: borrow practice structure. Claim skill performance only. No diagnosis, treatment, prevention, recovery, or safety inference.

## Operational mastery rule

- `introduced`: taught example opened.
- `practising`: aided correct or first unaided correct.
- `ready`: 2 unaided correct attempts on separate days; 1 changed scenario.
- `retained`: unaided due review at least 10 days after `ready`.
- Delayed miss: retain highest earned stage; set `needs_review=true`; teach and reschedule.

Threshold is product default, not universal scientific constant. Recalibrate after 8 weeks or 500 retained-review attempts.

## Evidence boundaries

- Strong general-learning evidence: retrieval, generation, explanatory feedback, spacing, varied transfer.
- Strong digital-health safety guidance: evidence standards, data choice/minimisation, adjunct framing, non-dangerous goals.
- Missing direct proof: exact Happy loop for general-adult mobile CBT. Pilot needed.
