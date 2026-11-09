---
name: app-soul-design
description: Multi-pass, evidence-gated research and specification method for giving Happy (CBT mental-health app) a "soul" — the emotional pull of Duolingo, Bitepal, Finch — without guilt mechanics. Six phases (psychology, competitive teardown, mascot/character, non-mascot connection systems, tokens, per-screen spec), each writing an artifact to docs/research/soul/ and blocked by a checklist plus a machine check. Use when asked to "give the app a soul", design emotional connection, mascot behavior, voice/tone, rituals, delight, or warmth. Run ONLY through the soul-design-researcher agent. Research and specification only — never modifies app code.
---

# app-soul-design

Router. Depth lives in `phases/`, gates in `checklists/`, shared knowledge in `references/`.

## When to trigger
- "Give the app a soul / personality / warmth", "make it feel like Duolingo/Finch/Bitepal"
- Mascot decisions, voice and tone, rituals, absence/return handling, delight frequency
- Any redesign whose stated goal is emotional connection rather than a single bug or screen

Do NOT use for: shipping code, one-off copy edits, a single animation (use `rossark-motion-skill` directly).

## Who runs it
Only the `soul-design-researcher` agent (`.claude/agents/soul-design-researcher.md`) runs this skill end to end. A main thread that wants the work dispatches that agent; it does not run phases inline.

## Phase map

| # | Phase file | Artifact | Gate |
|---|---|---|---|
| 1 | `phases/01-psychology-research.md` | `docs/research/soul/01-psychology.md` | research-quality, accessibility-and-ethics |
| 2 | `phases/02-competitive-teardown.md` | `docs/research/soul/02-teardown.md` | research-quality, anti-pattern-audit |
| 3 | `phases/03-mascot-and-character.md` | `docs/research/soul/03-character.md` | research-quality, emotional-design, anti-pattern-audit, accessibility-and-ethics |
| 4 | `phases/04-connection-systems.md` | `docs/research/soul/04-connection-systems.md` | all four |
| 5 | `phases/05-synthesis-and-tokens.md` | `docs/research/soul/05-tokens.md` | research-quality, emotional-design, accessibility-and-ethics |
| 6 | `phases/06-implementation-spec.md` | `docs/research/soul/06-implementation-spec.md` | all four |

Status ledger: `docs/research/soul/00-status.md` (per-phase pass/fail, pass count, failing items). Scratch work: `docs/research/soul/_work/`.

## Execution loop (every phase)
1. Read the phase file fully. Confirm its required inputs exist and the prior phase is PASS in `00-status.md`. If not, stop.
2. **Draft** (pass 1) using `references/evidence-template.md` structure.
3. **Critique**: run every gating checklist line by line against the draft. Write the critique into the artifact under `## Critique (pass 1)` — failures named, not softened.
4. **Revise** (pass 2+): fix every failure. Record what changed under `## Revisions`.
5. **Machine check**: `python3 .agents/skills/app-soul-design/scripts/check_phase.py <N> docs/research/soul/<file>`. Exit 0 required.
6. **Self-critique**: `## Self-critique` — weakest part and what a further pass should fix.
7. Update `00-status.md`. FAIL → repeat from step 3 (max 3 passes; still failing = report FAIL, never fake PASS).

## Hard rules
1. **Research and specification only.** No file under `src/`, `app/`, `assets/`, `remotion/` is modified. Output goes only to `docs/research/soul/`.
2. **Evidence or label.** Every claim cites `[S#]` from the artifact's Sources, a Mobbin screen/flow URL, or is labelled `inference`. "I already know this" is not evidence. Inference ≤ 30% of evidence lines.
3. **Decide.** Never offer the user options. Pick one direction, justify it, list the losers under `## Rejected ideas`.
4. **Mental health overrides energy.** Calm, warm, trustworthy, encouraging. Every borrowed Duolingo/game mechanic must state how it is turned down and why (`references/psychology-primer.md` §Dose).
5. **Ethics and accessibility gate.** A phase with any failing line in `checklists/accessibility-and-ethics.md` FAILS regardless of research quality.
6. **No smoothing.** Contradictions between sources go in `## Contradictions` with the decision taken.
7. **Multi-pass is visible.** Critique and revisions stay in the file. A file without them fails.
8. **Respect existing assets.** Happi the panda (`assets/images/panda/`, `.agents/skills/panda-mascot-design/`), the motion engine (`src/components/ui/motion/engine.ts`) and current theme (`src/theme/*`) are inputs. Deviate only with evidence.
9. **Motion** specs follow `.agents/skills/rossark-motion-skill/SKILL.md` and `assets/images/panda/MOTION.md` (calm curves, never teleport, reduced motion = still).
10. **Prototype learnings** in `references/prototype-learnings.md` (L1–L16) are binding for Phases 3, 5, 6; Phase 6 specs cite them as `L#` next to a `P#-F#` or `T:` ref.
11. **Prior research** in `_bmad-output/initiative-happy-product-direction/**` may be read and cited as `[S#] internal: <path>`, but internal sources never count toward a phase's minimum.

## Final report (agent must output)
```
| Phase | Artifact | Passes | Machine check | Checklists | Result |
```
Any FAIL row = the run is not complete; say so plainly.
