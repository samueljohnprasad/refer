# Spine Pair Review — Happy Onboarding & Day-0

Line refs are EXPERIENCE.md (EX) or DESIGN.md (DS) in the staged copies. Strategy = `docs/research/retention-strategy.md`.

## Overall verdict
The pair is a usable contract for Day 0 and for the *decisions* of Parts 13–19 (precedence table, banned words, helplines, conflict register are strong). It is not yet a clean contract for the new surfaces: component and state coverage for the after-Day-0 material is thin, several rules are stated twice with different wording (paywall suppression, N8, ProgressPair, reminder asks), and the safety-critical branches (risk item, free text in S2, "Better" clearing distress) are under-specified. All 11 `sources` links resolve except five that use one `../` too many.

Verdicts: Flow **thin** · Token **adequate** · Component **thin** · State **thin** · Visual refs **adequate** · Bloat **adequate** · Inheritance **adequate** · Shape **adequate**.

## 1. Flow coverage — thin
Checked: Key Flows (EX §11: Priya, Dev, Mara, Tomas) against every state and journey the sources name (strategy §5–§7, soul/06, RG report). Mara and Tomas are well formed (named protagonist, numbered steps, climax). The PRD's UJ-1 "Maya" is not inherited (the PRD is the superseded 7-step one and is not in `sources`; acceptable).
### Findings
- **high** No journey for the PHQ-4 check with the risk item: offer, Skip, abandon, positive risk answer to Distressed plus Get help sheet, decline, result sentences. It is the most safety-relevant branch and exists only as prose (EX §17). *Fix:* add a protagonist flow with a failure path (skipped risk item, positive answer).
- **medium** States with no journey: graduation (three choices, ignoring the card, Back to daily), trial-ending (N8 push plus banner), D1 first return (recall bubble, Good/Low chip), D7 look-back, guest signing in to an account that already exists. *Fix:* one short flow each, or fold into Mara and Tomas as branches.
- **medium** Priya step 10 ("Lesson 2 below") contradicts EX §2 Home item 3 and C6 (no Starter card on D0) (EX L274 vs L93/L447). *Fix:* delete "Lesson 2 below" or rewrite as D1.
- **medium** Mara depends on two things §14 never states: that the CTA "Start with a 30-second check-in" expands the chips (strategy §5.8 says so; EX §14 does not), and that the first open after N4 shows "Keep reminders?" (EX §9) — Mara step 6 shows only the link, so either §9 or the flow is wrong (EX L284–288, L246, L359).
- **low** Day-0 flows have no failure path (offline, push denied, session failure); Tomas has none for "Can't call right now?", unknown region, or **Still not okay**. *Fix:* one branch line each.
- **low** Mara step 1 quotes the push as "Happi's here whenever you are"; N5 table says "Happy's here" and pushes are "never voiced by Happi" (see §7).

## 2. Token completeness — adequate
Checked: every YAML token has hex or units; every `{path}` in DS prose resolves (all do, including the new `help-pill`, `checkin-chip`, `outline-button`, `distress-option`, `hotline-row`, `crisis-call-button`, `recall-line`, `scope-card`, `trial-banner`, `wellbeing-card`, `graduation-card`, `crisis-action`); contrast table recomputed from the hex values — every stated ratio is correct. EX uses no `{token}` paths (only names like "sage tokens", "error color").
### Findings
- **medium** Rim colour conflict: Colors prose says `sage-500` with `{colors.sage-700}` rim; `tactile-button.rimColor` and Elevation say `sage-600` (DS L281 vs L122/L343). *Fix:* pick one (token says 600).
- **medium** "Delete account in error color" (EX §4 Account) names no token. The only candidate, `terracotta` `#FF4B4B`, is 3.30:1 on white and fails 4.5:1 for a 17px label. *Fix:* name the token and state contrast, or set the label in `ink` with a red icon.
- **medium** Count typography disagrees: ProgressPair says count in `title` weight 500 (DS L382); Typography says Numeral (34/40, 600) is the lifetime count; Do's say "numerals regular". Weight 500 is not a defined `title` weight. *Fix:* one rule.
- **low** Tokens never referenced or declared unused: `otter-blue`, `macaw-purple`, `flame`, `flame-surface`; `gold` has no component. Mark legacy in YAML or delete.
- **low** `body-bold` used in prose (DS L361, L367); the token is `body-strong`.
- **low** No dark-mode statement; contrast table omits `sage-500` border on `sage-50`/`surface-soft` (4.31/4.20, passes 3:1) and `ink-soft` on `sage-100` (3.79, fails; currently avoided). No token for the crisis-sheet container, Account hero band/cards, or banner dismiss.

## 3. Component coverage — thin
Checked every component named in either file against DS Components and EX §4. EX Parts 13–19 describe behaviour in prose and tables: acceptable for decisions, but a consumer extracting from §4 misses all of it. Add a short §4 index mapping each new DS component to its Part plus the missing rules below.

| Component | DS visual | EX behaviour |
|---|---|---|
| GetHelpPill, CheckInChips, DistressedVariant, GraduationCard (offer logic) | yes | yes (Parts 13, 16, 18) |
| HotlineRow | yes | helpline table only; no Call/Text handling, no unknown-region fallback; "Change country" exists only in DS |
| CrisisSheet | yes | trigger and 0 ms only; dismiss, reopen, focus missing |
| RecallLine | yes | wording only; what **Why am I seeing this?** opens and where recall is turned off are undefined |
| ScopeCard | yes | text only; **Show Happi** persistence and **Got it** outcome undefined |
| TrialBanner | yes | text only; placement, dismiss, Distressed/lapsed interplay undefined |
| WellbeingCheckCard | yes | §17 prose; form (card, sheet, full flow) undefined |
| ChoiceRow, outline-button | yes | none (used by wellbeing and graduation) |
| Account, SignupNudgeCard, SignupSheet, BeliefScale, Header, Last-reflection card, Pattern line | none (nudge: one line in Home) | yes |
| Look-back card | none | none |
| TimelineCard, SegmentedControl | yes | none |

### Findings
- **high** Look-back card (D7, Mondays, monthly; N7; `lookback_*` analytics; "opt-in in Account") has no spec in either spine and no opt-in surface. *Fix:* add a Component Pattern and a DS entry, or mark it out of this spine's scope in §13.
- **high** Account promises behaviours that have no control on the Account screen: **Hide progress** (EX L156), **Show Happi**, recall on/off (EX §14, C2), Look-back opt-in (N7), a Pro entry (strategy §6.5). The Account list (EX L181–188) has none of them. *Fix:* add to the Account list.
- **medium** Account has no DS entry. EX says "two white cards"; DS says one white, cards are fills, no border or shadow, so white cards on white cannot separate. *Fix:* DS Account spec (hero band, card fill, switch row, destructive row).
- **medium** WellbeingCheckCard is described as "card" in IA/DS name and as a one-question-per-screen flow with progress and Skip in DS L405. *Fix:* state the container and entry point.
- **medium** **Talk to someone now**: DS says it "opens the crisis sheet or expands to hotline-rows"; Tomas step 2 says nothing animates; EX §16 says helplines show "first, then Can't call right now?". Sheet and inline are different builds. *Fix:* choose one.
- **medium** `TimelineCard (Paywall)` in DS is stale: PremiumSheet is remote and "not styled here", yet the card hard-codes Day 5/Day 7 and "annual renewal" (DS L439–444). *Fix:* delete or move to the dashboard checklist.
- **medium** Header lists a **help icon** beside the Get help pill (EX L95, strategy §5.0) with no defined function. *Fix:* define, or remove if it duplicates the pill.
- **low** Name variants: Text field vs ChatTextInput; SavedReflectionCard (EX §2) vs SavedCard vs `saved-card` vs "Last-reflection card"; "Wellbeing check" vs "WellbeingCheckCard".

## 4. State coverage — thin
Walked every IA surface. Covered: session failure, offline S1–S2, app killed (both points), paywall slow/fail, OS notification denial on the saved card, guest completion flag.
### Findings
- **high** S2's personal branch is a free-text screen, yet S2 and §5 have no Get help button and no crisis-phrase handling, while §16 requires both on "every free-text screen" and in "any session". Also unspecified: precedence rule 1 then shows Distressed to a user with `n = 0` and no completion flag, and whether the once-only Premium sheet is consumed (EX L394–404, L324–333). *Fix:* add S2 rows.
- **high** Wellbeing check: risk item skipped or unanswered (DS gives **Skip** on every screen, including the risk question), abandoned mid-way, partial scores, offline, declined. Positive answer opens "the Distressed variant and the Get help sheet": both, or one (EX §17, DS L405). *Fix:* decide skip-risk-item behaviour with the clinician protocol and list each state.
- **high** Signing in from a guest session when the Apple/Google/email identity already has data (the "new phone" case the card promises). Only "link, not replace" is specified (EX L190). *Fix:* merge/choose state, with a no-data-loss rule.
- **medium** Distressed "Better": does it clear a positive risk item or a crisis phrase, not just a chip? Where do the **How are you now?** chips render, inside the Distressed variant (which lists three options only) or on normal Home? Tomas step 4 assumes the latter (EX L397, L293).
- **medium** Trial banner and N8: dismissed or not, trial cancelled or expired, shown in the Distressed variant and on 30+ returns (both hide paywall surfaces), banner when push permission is denied is covered but the push slot when no slot was chosen is not.
- **medium** Account **Daily reminder** switch when OS permission is denied or undetermined has no behaviour or copy; the post-N4 **Keep reminders?** ask has no surface.
- **medium** Home cold-load, offline, or reflection-read failure; reinstall as signed-in user before sync (where does `n` come from); clock/timezone change effects on `gap` and `d_install`; notification tap destination per N-type.
- **low** Helpline table unknown region or stale (>90 days); graduation card ignored or dismissed; no saved reflection for recall (fallback exists) or deleted reflections.

## 5. Visual reference coverage — adequate
Files: `mockups/` key-s1-goal-pick, key-s2-chat, key-s2-saved-card, key-home-premium-sheet (all linked inline in both spines, with what each shows); `mockups/legacy-2026-10-20/` (4 older mocks); `imports/mobbin-refs.md` (linked in EX §10 and frontmatter). Spines-win-on-conflict stated in both intros. DS L339 states the new surfaces have no mocks, as required.
### Findings
- **medium** `key-home-premium-sheet.html` still shows "Lesson 2" and no Get help pill or new header, which contradicts C6 and §2 Home item 5. It is linked as the Home reference with no staleness note. *Fix:* annotate at both links.
- **medium** Current visual truth lives in prototypes (`.agents/home.html`, `onboarding.html`, `journeys.html`), cited by bare name (EX L189, memlog) and not linked; `home.html` contains none of the after-Day-0 states. *Fix:* link with path and say which parts are current.
- **low** Legacy mocks are unlinked orphans; add one line saying superseded.
- **low** No mock for the Distressed variant, crisis sheet or wellbeing card: stated, but these are the highest-stakes surfaces; consider mocking before build.

## 6. Bloat & overspecification — adequate
Parts 13–19 mostly keep to decisions and defer composition to strategy §5, as claimed. Defects are duplication, not volume.
### Findings
- **medium** Copy is stored in several places and has already drifted: N1 rotation in §3 table and §15; N0 sample twice; check-in questions copied from strategy §5.0; N5/N6 variants copied from `winback-copy.md` (which says "Happi's", EX says "Happy's"). *Fix:* keep one table per string, link `winback-copy.md` for variants.
- **low** PremiumSheet checklist carries funnel and price anchors ([RG6]–[RG9]); price is a PRD decision and the text says §6.5 holds it.
- **low** Account paragraph retells the Mobbin pass (apps listed, "first prototype read as unfinished"): belongs in memlog.

## 7. Inheritance discipline — adequate
Checked: sources, citations, names, cross-refs, conflicts register.
- `[RG n]`: every cited number resolves in the report appendix and supports the claim, except RG37 (below). Section cross-refs (§3 to §16, §4 to §14/§15/§17/§18, §12 to §19 C4, IA to §13–§18, DS to EX §13–§18) all resolve. Register: C1, C2, C5, C7, C8, C9, C10, C11 match the text in Parts 1–12; C3 shipped (pill and Settings row); C4 correctly open.
### Findings
- **high** Source paths: `../../../../PRODUCT.md`, `../../../../DESIGN.md`, `../../../../docs/research/retention-strategy.md`, `.../winback-copy.md`, `.../soul/06-implementation-spec.md` (EX L12–16, DS L8–12) do not resolve; from this folder the repo root is `../../../`. All five targets exist there.
- **high** N8 contradicts itself: "mandatory, never skipped for any reason" (EX L250, L247, L386) vs the push-wide rule "skipped if the user already practised, and on any day the Distressed variant was shown" (EX L372). Strategy §7.4 also gates N8 behind practised-today, distress-today and graduated-as-needed. For a charge notice, "mandatory" has to win. *Fix:* state which skip rules N8 is exempt from; reconcile strategy §7.4.
- **medium** Paywall/premium suppression is stated four ways: "Lapsed 30+" (EX §4, §9), "always hidden on 14+" (§14), strategy §5.9 hides at 14–29, nothing for 7–13. And the trial banner is not listed as hidden or shown in Distressed or lapsed states.
- **medium** Reminder: §9 says **Never** "on app open", while the same row has N4's "next open asks **Keep reminders?**".
- **medium** ProgressPair: header placement (EX §2 Home item 2, DS Home) vs a body block (§13, strategy §5); §14 L363 says hidden "until two practices" but §4 and L367 say it returns after the first; DS Lapsed layout says "7–29 days only" while strategy §5.7 also shows it at 3–6; strategy's "ring hidden when w = 0" is not carried.
- **medium** Who speaks: §13 says the check-in question is voiced by Happi "only in the bubble", but check-in is not in the bubble-allowed list (L337), and DS has no question label. Also §3 "No 'we'; Happi speaks" vs §15 "never voiced by Happi" vs N4 copy "We'll pause" vs Mara/winback "Happi's here" (pushes are signed Happy).
- **medium** `[RG37]` is a smartphone **PHQ-9** result (+3 points); EX §17 applies it to PHQ-4 (range 0–12). *Fix:* "in-app scores can read higher than paper".
- **medium** Stale statements: EX open item L313 ("DESIGN.md has no visuals yet for…") is now false; `.memlog.md` line 36 says the same and records no entry for the new DS tokens; DS SavedCard button is "Continue to Happy" while EX and the mock say **Go to Home**.
- **low** `[UV2 R2.6]` cited (EX L166) but research-user-voice is not in `sources`; PRD and `research-premium-consumer-craft` (cited in DS prose) also absent.
- **low** N3 (skip rule, no send) is omitted without note, leaving N0, N1, N2, N4.
- **low** Glossary: "Scope card" and "scope-card line" are two different strings (CBT line vs "Your reflections are saved…"); "practise" vs "practice"; **Welcome back** is both an expression and a greeting.
- **low** D0 sub "Come back when another thought sticks around." contains a banned word (ban is scoped to return copy, but the list is absolute in §3); D0 Quiet pride (strategy §5.1) is missing from the DS expression table.

## 8. Shape fit — adequate
DS sections are in canonical order. EX has Foundation, IA, Voice, Component Patterns, State Patterns, Interaction Primitives, Accessibility Floor, Key Flows, plus Inspiration (triggered). Responsive omitted: defensible (iPhone portrait, Dynamic Type covered). Invented sections Analytics, Asks and Conflicts register earn their place.
### Findings
- **high** Accessibility Floor (§7) was not extended to the crisis surfaces: focus order and announcement for the 0 ms crisis sheet, Call/Text button labels, hotline rows at AX3, PHQ question and risk-item announcement, check-in chip "Today: Okay", banner dismiss. This is the surface where it matters most. *Fix:* add rows to §7.
- **medium** Analytics (§8) lists health-derived events (`phq4_*`, `risk_item_answered {positive}`, `mood_today`) under a "no free text" rule only; §17 says "analytics carry scores only". No consent, vendor or first-party rule. *Fix:* add one.
- **medium** IA table (§2) omits surfaces consumers must build: crisis sheet as its own row, trial banner, scope card, recall line, Look-back. Interaction Primitives (§6) has no row for the new motion (Welcome back, chip collapse, Distressed fade, banner).
- **low** Parts 13–19 are appended after Open items (§12); move Open items last, or merge. "Parts" and "§" terms are mixed.
- **low** Distressed, wellbeing and graduation use equal-option groups not listed in §13's exceptions to "one filled CTA" (graduation and wellbeing are not CTAs, but say so).

## Mechanical notes
- **Names that differ across files:** "Continue to Happy" (DS SavedCard) vs "Go to Home" (EX, mock); "Happy's here" (EX N5) vs "Happi's here" (Mara, `winback-copy.md`); ChatTextInput vs Text field; SavedReflectionCard/SavedCard/`saved-card`/Last-reflection card; WellbeingCheckCard vs Wellbeing check; "Change country" (DS only).
- **Broken or stale refs:** five `../../../../` source paths; open item L313; memlog line 36; `home.html` and other prototype names are unlinked.
- **Frontmatter:** both files have `name`, `description`, `status`, `sources`, `updated`. DS `components` use only defined tokens. `rounded.2xl` is a digit-leading key (valid YAML; confirm the consumer parses it).
- **Counts:** severity totals are in the returned summary. No Mermaid in either file.
