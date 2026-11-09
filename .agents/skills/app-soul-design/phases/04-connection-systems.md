# Phase 4 — Non-mascot connection systems

## Objective
Specify the soul that is not a character: voice, memory, ritual, growth-framed progress, micro-interactions, surprise, empty/error/absence states and caring personalization. These carry the experience on every screen where the mascot is deliberately absent.

## Required inputs
- `01-psychology.md`, `02-teardown.md`, `03-character.md` — all PASS
- Current copy samples: `locales/` or i18n JSON in repo (grep for `home.json`, `onboarding.json`), current home screen `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`
- `.agents/skills/rossark-motion-skill/SKILL.md` §1 principle 13 (interface rules), `microinteractions` and `mental-health-psychoeducation` skills if present

## Required tools
- Mobbin `search_screens`/`search_flows` for ≥8 additional screens focused on empty states, error states, welcome-back, completion, settings-for-reminders.
- WebSearch for haptic/sound guidance (Apple HIG haptics, Material motion) and voice/tone guides (Mailchimp, Headspace, NHS content style).

## Method — one `## System:` section each, each containing ≥1 `### F#`
1. **Voice and tone**: 4 tone modes (everyday, struggling, celebrating, instructional-clinical) with sentence-length caps, reading level target (e.g. ≤ grade 6, Flesch-Kincaid), banned words, phrase bank table ≥15 Do / ≥15 Don't rows with the reason.
2. **Memory and continuity**: what the app recalls (last mood word, last reframe, a recurring theme, the user's own phrasing), when it reflects back, retention window, and user controls (view, edit, forget). Every recall has a visible "why am I seeing this" path.
3. **Ritual design**: opening (≤10 s), closing (≤20 s), daily rhythm; a ritual must be completable in 60 s on a bad day.
4. **Progress as growth**: replace score/streak framing; specify forgiving continuity (e.g. "days practiced this month", rest days that don't break anything), and the exact UI for return after a gap.
5. **Micro-interactions, haptics, sound, motion personality**: map of interaction → haptic (UIImpactFeedbackGenerator style/intensity) → sound (on/off default, length ms) → motion (duration ms, curve). Default sound OFF. Reduced-motion mapping per item.
6. **Surprise and delight**: catalogue ≤8 moments, each with frequency cap (e.g. ≤1 per 7 days per user), trigger, and decay plan.
7. **Empty, error, absence/return states**: copy + visual + action for each, including first-launch empty journal, offline, sync failure, 3-day absence, 30-day absence, crisis keyword detected.
8. **Personalization that feels like care**: consent ladder, what is inferred vs asked, red lines (no location, no notification content revealing mood on lock screen, no "we noticed you were sad at 2am").
9. Contradictions (≥2), Rejected ideas (≥3), critique → revise → check → self-critique.

## Output
`docs/research/soul/04-connection-systems.md`

## Exit criteria
- `check_phase.py 4` exits 0: ≥8 non-internal sources, all eight `## System:` sections, ≥12 findings, phrase bank ≥15 Do and ≥15 Don't rows, haptic map table present, delight frequency caps numeric.
- All four checklists PASS.
