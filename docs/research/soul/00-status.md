# Soul design — phase status

| Phase | Artifact | Passes | Machine check | Research-quality | Emotional | Anti-pattern | Access+ethics | Result |
|---|---|---|---|---|---|---|---|---|
| 1 Psychology | 01-psychology.md | 2 | exit 0 | PASS | N/A | N/A | PASS (§Ethics; AE1.2 + AE2.x N/A) | PASS |
| 2 Teardown | 02-teardown.md | 2 | exit 0 | PASS | N/A | PASS (lens) | N/A | PASS |
| 3 Character | 03-character.md | 2 | exit 0 | PASS | PASS | PASS | PASS (AE2.1/2.2/2.7 N/A, Phase 5) | PASS |
| 4 Connection systems | 04-connection-systems.md | 2 | exit 0 | PASS | PASS | PASS | PASS (AE2.1, AE1.8 N/A) | PASS |
| 5 Tokens | 05-tokens.md | 2 | exit 0 | PASS | PASS | N/A | PASS (AE1.2, AE1.6 N/A) | PASS |
| 6 Implementation spec | 06-implementation-spec.md | 2 | exit 0 | PASS | PASS | PASS | PASS | PASS |

## Phase 1 notes
- Pass-1 FAILs fixed in pass 2: RQ1.5, RQ1.6, RQ2.3, RQ2.4, RQ3.3, RQ3.4, AE1.1, AE1.3, AE1.4, AE1.5, AE1.8.
- 24 verified peer sources; Brooks et al. 2016 (retracted 2024) cited only as an exclusion.
- Open risks: thin mental-health-specific evidence (3 sources); 18+ audience is an assumption for product owner; no source on mascot reception in ar/zh locales.

## Phase 2 notes
- 13 apps, 9–20 Mobbin URLs each; Rootd/Daylio not on Mobbin (Tolan/Opal substituted).
- Fixed: RQ1.5, RQ1.6 (x3), RQ3.3, RQ3.4, RQ2.3. Duolingo sound/haptic unverified (blog 503).
- Weak: motion/sound/haptic evidence (Mobbin stills only); Tolan + Gentler Streak thinnest.

## Phase 3 notes
- Decision: keep Happi as sole character; role shifts from emotional mirror to quiet companion.
- Caps: ≤12 words/≤60 chars per bubble; ≤1 bubble/screen; ≤3 bubbles + ≤36 words/session; ≤1 celebration + ≤1 unscheduled moment/7 days; welcome-back ≤1/24h. 9 absence zones. 'Show Happi' toggle.
- Retires poses: pleading, proud_tears, pancake, transcend, flex, cheer, side_eye, celebrating_jump; overrides panda-mascot-design Rule 6.
- Weak: motion numbers unmeasured; word caps reasoned not studied; ar/zh reception untested; 18+ assumed.

## Phase 4 notes
- Reconciled with Phase 3 presence/voice/absence rules (ED5.3).
- Current-app gaps found: no crisis surface in src; sound on by default (soundMutedAtom=false); streak modal after every mood log + requestReview; 'AI-chosen notification timing' copy; '3x more consistent' claim; +10 XP, level-up modal, coin shop.
- Weak: haptic/sound choices not user-tested; ar/zh copy unreviewed; crisis keyword list deferred to Phase 6.

## Phase 5 notes
- 13 current color pairings failed WCAG; replacements specified with ratios (independently re-verified: #FFF on #5F7F58 = 4.503:1, thinnest margin).
- 'Saved. It's yours.' = app copy; Happi says it only when present and ≤2 bubbles used.
- Nunito kept; ar/zh fall back to system font.
- Weak: mood-color emotional reading untested across locales; Nunito glyph width estimated; no automated contrast check in repo.

## Phase 6 notes
- 30 screen sections / 38 inventoried; 8 explicitly folded or out of scope.
- Code facts: DiscountInterceptModal absent; WeeklyStreakWidget never rendered; requestReview in 5 call sites; floating 'Hi, I'm Happy' assistant over every screen (retired); onboarding loader is timer-only; no crisis surface.
- Weak: crisis phrase list unvalidated (needs clinician per locale); no metric baselines; 51 course lessons reviewed via shared shell only.
