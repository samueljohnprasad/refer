---
title: 'The Home resolver as a pure rule'
type: 'feature'
ticket: '10'
created: '2026-11-16'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Home's bubble, button and tone card are decided in three places (`useHomeScene`, `HomeContainer` local state, the button code), so they can disagree, show two bubbles, or use two night windows.

**Approach:** One pure `resolveHomeAsk(inputs, now)` in the home domain encodes the base precedence, modifiers M1–M6, the silence rules, the paused-versus-saved rule and the tone-card condition, over a typed input object. A home preferences adapter holds the first-open date. Nothing is rendered or wired yet.

## Boundaries & Constraints

**Always:** AD-17. Returns `{ variant, modifier, bubble, button, catchAnother, toneCard }`. Base variant, first match wins: `distressed` when `distress24h` or the band is `notOkay`; `resume` when `practiceCount === 0`; `lapsed` when `gapDays >= 3`; `postReturn` when `returnedWithin7Days`; else `lifecycle`. Modifiers apply only to `postReturn` and `lifecycle`, and to `lapsed` for M5; for `distressed` and `resume` the modifier is null, the bubble null and the button `base`. First modifier wins: M1 hour 22–4 → button `windDown`, no bubble; M2 a paused draft that is today's newest saved entry (`paused.entryId === newestSavedTodayId`) or dated before today → button `continue`, no bubble; M3 a thought saved today → button `none`, `catchAnother` true, no bubble; M4 band `low` → button `base`, no bubble; M5 `lapsed` or `postReturn` → button `base`, bubble `return` only for `lapsed` and when no welcome-back was shown in 24 h; M6 otherwise → button `catch`, bubble `ask` for `installDay >= 1` only. Ask bubble also needs: band unanswered, `good` or `okay`; hour 5–21 (window `morning` 5–11, `afternoon` 12–16, `evening` 17–21); `askShownDate` not today. Every bubble is suppressed when `helpOpenedThisSession`, `sessionBubbleCount >= 3`, `stepUpDeclined` or `showHappi` is false; the button is unchanged. `toneCard` is true when `practiceCount >= 3`, not `toneCardSeen`, the band is not `low` or `notOkay`, and the variant is not `lapsed`, `distressed` or `resume`. Inputs are a typed object assembled by the caller (`installDay`, `gapDays`, `practiceCount`, `returnedWithin7Days`, `distress24h`, `bandToday`, `newestSavedTodayId`, `paused: PausedEntry | null`, `sessionBubbleCount`, `stepUpDeclined`, `helpOpenedThisSession`, `showHappi`, `toneCardSeen`, `askShownDate`, `welcomeBackShown24h`); `now` supplies the hour and local day; the rule reads no clock. `PausedEntry` and `MoodBand` are reused. The preferences adapter follows AD-22: one key `@happy/home_prefs_v1`, a try/catch adapter like `introSeen.ts`, holding `firstOpenDate` (set once, local `YYYY-MM-DD`), `askShownDate` and `toneCardSeen`; a pure `installDayOf(firstOpenDate, today)` gives whole days since first open, 0 when missing.

**Never:** No rendering, no hook, no wiring into `HomeContainer` or `useHomeScene`, no removal of their bubbles (story 11). No ask-line rotation or copy, no i18n keys, no recall, no tone card UI, no events. No change to onboarding, the wizard or counts. No tests, dependency or commit; the ticket's table-test clause is dropped by the standing no-tests rule.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Plain morning, D3 | Unanswered chip, 09:00, nothing saved | M6, `ask` morning, button `catch` | None |
| Night | 23:30, anything but distressed | M1, no bubble, `windDown` | None |
| Paused and newest | Draft id equals newest saved today | M2, `continue` | None |
| Paused, not newest | Draft is today, a later entry saved | M3, saved today wins | None |
| Paused earlier day | Draft dated yesterday | M2, `continue` | None |
| Low with saved today | Band low, thought saved | M3 | None |
| Low only | Band low, nothing saved | M4, no bubble, `base` | None |
| Lapsed | `gapDays` 8 | M5, `return` bubble unless shown in 24 h | None |
| Distressed | Band notOkay | Variant `distressed`, no modifier, no bubble | None |
| Silence | 3 bubbles shown, or help opened, or step up declined, or Show Happi off | No bubble, button unchanged | None |
| Tone card | 3 practices, unseen, band okay, lifecycle | `toneCard` true | None |

</frozen-after-approval>

## Code Map

- `src/domains/home/domain/resolveHomeAsk.ts` (new) -- types and `resolveHomeAsk`; `src/domains/home/domain/` is empty today.
- `src/domains/home/data/homePrefs.ts` (new) -- `readHomePrefs`, `ensureFirstOpen(today)`, `markAskShown(day)`, `markToneCardSeen()`, `installDayOf`; copy the adapter pattern of `src/domains/thoughtCatcher/data/introSeen.ts`; `reflectionsStorage.ts` is the neighbour.
- Reuse: `PausedEntry` (`src/domains/thoughtCatcher/data/pausedEntry.ts`), `MoodBand` (`src/domains/exercises/domain/mood.ts`), `ymd` shape from `practice.ts`.
- Do not touch: `HomeContainer.tsx`, `useHomeScene.ts`, `reflectionsStorage.ts`, any locale file.

## Tasks & Acceptance

**Execution:**
- [ ] `resolveHomeAsk.ts` -- input and output types, base variant, modifiers M1–M6, silence rules, tone-card condition
- [ ] `homePrefs.ts` -- prefs adapter and `installDayOf`

**Acceptance Criteria:**
- Given a paused draft that is today's newest saved entry, when resolved, then the modifier is M2 and the button is `continue`; given a later saved entry, then M3 applies.
- Given night, or a Low chip, or a lapsed gap, when resolved, then no ask bubble is returned and at most one bubble is ever returned.
- Given a distressed band or no practices, when resolved, then no modifier applies.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 3 medium (2 patched, 1 open), 1 low patched, 5 low rejected. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| M6 returns a filled `catch` button at install day 0, while the UX spine says M6 is D1 or later and onboarding says D0 has no CTA | medium | intent_gap | The code follows the frozen M6 text; settling D0 needs the human. Open. |
| A live draft dated today is ignored when no entry is saved today (cache lag) | medium | patch | M2 now also applies when `newestSavedTodayId` is null. |
| `homePrefs` read-modify-write could lose a field, and a failed read could overwrite stored values with defaults | medium | patch | Writes run through one promise chain and a failed read writes nothing. |
| A malformed stored first-open date gives NaN install day | low | patch | `installDayOf` returns 0 when the difference is not finite. |
| Tone card ignores night, silence rules and "just completed" | low | rejected | Matches the plan's condition; the caller decides when to show it. |
| Tone card allowed on `postReturn` | low | rejected | The plan and the UX spine exclude only lapsed, distressed and resume. |
| M5 greeting skipped on a Low chip | low | rejected | Plan order puts M4 before M5. |
| Redundant band check in the ask condition | low | rejected | Harmless dead logic. |
| Third copy of `ymd`; keyboard, page and praise-only silence rules not inputs | low | rejected | Plan reuses the `practice.ts` shape; those rules are presentation-side and not in the plan. |

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'resolveHomeAsk|homePrefs'` -- expected: no output for touched files

**Manual checks (no device available):** read the rule against each row of the matrix; nothing renders.
