# Phase 1 — Psychology of connection

## Objective
Establish, from primary and secondary literature, which psychological mechanisms make a user feel emotionally bonded to an app — and translate each one into a concrete rule for a CBT mental-health app where guilt, dependence and manipulation are harms, not growth levers.

## Required inputs
- `references/psychology-primer.md` (starting map — NOT a source; every claim must be re-sourced)
- `references/source-list.md` (seed bibliography; verify each before citing)
- Optional context: `_bmad-output/initiative-happy-product-direction/research-onboarding-competitive-teardown/digests/2026-10-30-academic-evidence.md` (internal, does not count toward minimum)

## Required tools
- `WebSearch` (standard first; extended for thin results) and `WebFetch` to confirm each source exists and says what you claim. Prefer DOI pages, PubMed, publisher pages, Google Scholar landing pages.
- No Mobbin in this phase.

## Method
1. **Coverage list.** Create one `### F#` finding (at least one, often two) for each of the ten topics:
   1. Parasocial relationships and anthropomorphism (Horton & Wohl; Epley, Waytz & Cacioppo's three-factor theory; CASA paradigm — Reeves & Nass)
   2. Attachment theory applied to digital companions (Bowlby/Ainsworth origins; chatbot/companion bonding studies, e.g. Woebot working-alliance studies; Replika dependence risks)
   3. Self-determination theory — relatedness axis especially (Deci & Ryan; Ryan, Rigby & Przybylski on games; Peters, Calvo & Ryan METUX)
   4. Reciprocity, perceived effort, IKEA effect (Cialdini; Norton, Mochon & Ariely; Buell & Norton "labor illusion")
   5. Emotional labeling and validation (Lieberman et al. affect labeling fMRI; Linehan validation levels; Torre & Lieberman review)
   6. Variable reward vs steady reassurance (Skinner schedules; Eyal "Hooked" as the model to reject; dopamine prediction error — Schultz; streak/loss-aversion evidence)
   7. Rituals, consistency, returning without guilt (Lally habit formation; Hobson/Norton ritual research; self-compassion — Neff; guilt vs shame — Tangney)
   8. Warmth vs competence (Fiske, Cuddy & Glick stereotype content model; Aaker, Vohs & Mogilner brand warmth; voice/tone and chatbot persona studies)
   9. Memory and continuity (episodic continuity in relationships; personalization + perceived understanding; "being known" literature; recommender transparency)
   10. Cultural and individual differences in warmth vs cloying (Hofstede/high-low context; Kitayama on emotion norms; uncanny valley/"cute" aggression; age and gender variance in mascot acceptance)
2. **Per finding**, fill Claim / Evidence / Mechanism / So what for Happy. "So what" must name a screen, a copy rule, a token, a cadence or a forbidden pattern.
3. **Dose section.** Add `### F-dose` findings stating, per mechanism, the harmful extreme for a depressed or anxious user (e.g. variable reward → compulsive checking; attachment → dependence; anthropomorphism → false clinical authority).
4. **Contradictions.** At least 2. Examples to probe: streaks help habit formation vs streak-break demotivation; anthropomorphism increases trust vs increases over-disclosure risk; personalization increases engagement vs perceived surveillance.
5. **Rejected ideas.** At least 3 mechanisms deliberately not used, with reasons (e.g. loss-framed streaks, intermittent reward chests, mascot guilt-tripping on absence).
6. Critique → revise → machine check → self-critique per `SKILL.md`.

## Output
`docs/research/soul/01-psychology.md`

## Exit criteria
- `check_phase.py 1` exits 0: ≥12 distinct non-internal sources, ≥10 findings, all ten topics covered via exact tags in finding titles — `[PARASOCIAL]`, `[ATTACHMENT]`, `[SDT]`, `[RECIPROCITY]`, `[VALIDATION]`, `[REWARD]`, `[RITUAL]`, `[WARMTH]`, `[MEMORY]`, `[CULTURE]` (topics 1–10 in order), e.g. `### F3. [SDT] ...`; dose findings are titled `### F-dose1. [REWARD] ...` (the dot after the id is required), every finding has Evidence + So what, ≥2 contradictions, ≥3 rejected ideas, critique + revisions + self-critique present, inference ≤30%.
- At least 8 sources are peer-reviewed or academic books (mark with `(peer)` at end of the source line).
- `checklists/research-quality.md` all PASS.
- `checklists/accessibility-and-ethics.md` §Ethics all PASS.
