# Phase 3 — Mascot and character system

## Objective
Decide whether Happy has a mascot and specify it completely: form, personality, backstory, expression set, presence rules, voice, and behavior when the user struggles or is absent. One direction, justified; rejected directions documented.

## Required inputs
- `01-psychology.md`, `02-teardown.md` — both PASS
- Existing character: `assets/images/panda/MOTION.md`, `.agents/skills/panda-mascot-design/SKILL.md` and its numbered files, `src/components/ui/happy-scene/{art,pose,choreo}.ts`
- Motion method: `.agents/skills/rossark-motion-skill/SKILL.md` §1, §3, §4, §5

## Required tools
- Read/Grep for existing assets. Mobbin `search_screens` for any additional character evidence (≥4 new screens, e.g. mascot in distress states, absence states). WebSearch for character-design or companion-app evidence not already in Phase 1.

## Method
1. **Decision**: mascot yes/no and which one. Happi exists; the burden of proof is on replacing it. Score the decision against Phase 1 findings (anthropomorphism, attachment risk, warmth/competence) and Phase 2 patterns (Finch, Duolingo, Bitepal). State the decision in one sentence at the top of `## Summary`.
2. **Character bible** (each a `### F#` with evidence):
   - Species/form and silhouette rules (32px squint test, head:body ratio, color economy)
   - Personality: 3 traits + 3 anti-traits (e.g. "steady, curious, honest" / never "hyper, needy, preachy")
   - Backstory in ≤80 words; why it is here; what it is NOT (not a therapist, not a judge)
   - Relationship stance: companion beside the user, not coach above them (cite SDT relatedness + autonomy)
3. **Expression set**: table of ≥8 expressions × trigger × pose/face tracks (gaze, lid, cheek, mouth, tilt — the `Choreo` tracks) × motion recipe in ms and degrees per rossark §3–4 × where used. Must include: neutral idle, listening, gentle concern, quiet pride, resting/asleep, welcome back, celebrating (low amplitude), thinking.
4. **Presence rules**: where the character appears, where it is absent (e.g. never during a user's free-text distress entry, never over crisis resources, never inside CBT instruction steps where clinical accuracy is the job), max appearances per session, max words per bubble.
5. **Voice**: how it speaks (person, sentence length, reading level), 10 do / 10 don't lines. The character speaks less than the app's own copy.
6. **Struggle and absence behavior**: script for low mood logged, 3+ days absent, returning after 30 days, crisis-keyword path (character steps aside, plain resources shown). No guilt, no sadness performed at the user.
7. **Rejected directions**: ≥3 (e.g. replace panda with abstract blob; pet that decays/dies on absence (Tamagotchi/Finch-style energy loss turned to guilt); chatty therapist avatar) each with evidence.
8. Critique → revise → check → self-critique.

## Output
`docs/research/soul/03-character.md`

## Exit criteria
- `check_phase.py 3` exits 0: ≥6 non-internal sources, ≥8 findings, expression table ≥8 rows with numeric motion values, `## Presence rules`, `## Voice`, `## Struggle and absence` and `## Rejected ideas` (≥3) sections present.
- All four checklists PASS; `emotional-design.md` §Character and `anti-pattern-audit.md` §Mascot are mandatory.
