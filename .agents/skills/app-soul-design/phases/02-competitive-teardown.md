# Phase 2 — Competitive teardown

## Objective
Find where "soul" actually lives in the best mascot-driven and non-mascot apps, with specific screens as proof, and map each observation back to a Phase 1 mechanism.

## Required inputs
- `docs/research/soul/01-psychology.md` — PASS in `00-status.md`
- Optional context (internal): `_bmad-output/initiative-happy-product-direction/research-onboarding-competitive-teardown/digests/2026-10-30-mobbin-flows.md`, `.agents/skills/panda-mascot-design/02-duolingo-design-standards.md`

## Required tools
- Mobbin MCP: `search_screens`, `search_flows` (platform `ios`; `web` only if an app is absent on iOS). Use `mode: deep` for screens.
- `WebSearch` only for facts Mobbin cannot show (sound design, haptics, App Store review quotes) — cite them as sources.

## App set (minimum 10 with ≥4 screens each; all 12 attempted)
Duolingo, Bitepal, Finch, Ahead, Headspace, Calm, How We Feel, Stoic, Rootd, Daylio, Balance, Wysa. Add ≥1 standout found on Mobbin while searching (e.g. Bearable, Clue, Structured, Gentler Streak, Opal). If an app is not on Mobbin, record "not on Mobbin" with the queries tried and substitute; never invent screens.

## Method
1. For each app run queries targeting soul surfaces, e.g. `"<App> mascot"`, `"<App> streak"`, `"<App> empty state"`, `"<App> check-in"`, `"<App> completion"`, `"<App> welcome back"`, `"<App> onboarding"`. Look at the returned images; never describe a screen from metadata alone.
2. Section per app: `### App: <Name>` with:
   - **Soul inventory** table: channel (character, copy, motion, sound/haptic, memory, ritual, surprise, progress) × what it does × screen URL.
   - **Mascot mechanisms** vs **Non-mascot soul mechanisms** as two separate bullet lists. Apps with no mascot still fill the non-mascot list.
   - **Phase 1 link**: which `F#` mechanisms each observation exercises.
   - **Harm check**: guilt, loss aversion, fake urgency, nagging, infantilizing copy — observed or not, with screen.
   - ≥4 distinct `mobbin.com/screens/` or `mobbin.com/flows/` URLs.
3. Then cross-app findings `### F#` (≥8), e.g. "Every app that reads as warm reflects a user-entered word back within 1 screen", each with Evidence = ≥2 screens from different apps.
4. **Pattern matrix**: apps × channels, cells = strong/weak/absent.
5. **Steal / Adapt-down / Never** list: each borrowed pattern tagged with the adaptation required for a mental-health context.
6. Contradictions (≥2), Rejected ideas (≥3), critique → revise → check → self-critique.

## Splitting work
Phase 2 may be split across up to three workers writing `docs/research/soul/_work/02-part-<a|b|c>.md` (4 apps each). The phase owner merges into `02-teardown.md`, renumbers sources, writes cross-app findings, and runs the gate on the merged file only.

## Output
`docs/research/soul/02-teardown.md`

## Exit criteria
- `check_phase.py 2` exits 0: ≥10 `### App:` sections each with ≥4 distinct Mobbin URLs, ≥8 cross-app findings, every app section has both mechanism lists, ≥2 contradictions, ≥3 rejected ideas, critique/revisions/self-critique present.
- `checklists/research-quality.md` and `checklists/anti-pattern-audit.md` (as observation lens) all PASS.
