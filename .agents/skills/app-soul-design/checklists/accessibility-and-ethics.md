# Accessibility and ethics checklist (gating)

Any FAIL here fails the phase regardless of research quality. Record each as `[PASS]`/`[FAIL] AE#.#` in the critique; mark `[N/A] AE#.# — reason` only where the phase genuinely does not touch the item (e.g. contrast in Phase 1).

## Ethics
- **AE1.1 Do no harm.** For every mechanism adopted, the spec names its harmful extreme for a depressed/anxious user and the guard against it.
- **AE1.2 Crisis path.** Any phase touching flows (3, 4, 6) specifies that crisis language triggers plain, non-mascot, non-gamified resources with locale-appropriate hotlines and no paywall.
- **AE1.3 Not therapy.** The app and mascot never claim to replace professional care; scope language is specified.
- **AE1.4 Autonomy.** Reminders, memory recall, personalization and sound are opt-in or one-tap off; turning them off has no penalty copy.
- **AE1.5 Dependence.** A guard exists against the app becoming the user's only support (outward pointers, no "I'm always here for you, only me" language).
- **AE1.6 Data dignity.** Remembered content is viewable, editable, deletable; sensitive recall is never shown in notifications or to other people.
- **AE1.7 Honest claims.** Efficacy statements match evidence strength; no "clinically proven" without a cited trial of this app.
- **AE1.8 Vulnerable users.** Age-appropriateness stated; mascot cuteness does not target minors unless the product does.

## Accessibility (WCAG 2.2 AA minimum)
- **AE2.1** Text contrast ≥4.5:1 (≥3:1 for ≥18 pt or ≥14 pt bold); non-text UI ≥3:1 (SC 1.4.3, 1.4.11). Ratios written next to every color pairing in Phase 5.
- **AE2.2** Touch targets ≥44×44 pt (Apple HIG; exceeds SC 2.5.8 24×24 px).
- **AE2.3** Dynamic Type: layouts specified up to accessibility sizes (AX1–AX5) without truncating instructions.
- **AE2.4** Reduced motion: every animation has a still fallback (loops freeze at frame 0; one-shots show final frame); no parallax or auto-play when enabled.
- **AE2.5** No flashing >3 per second (SC 2.3.1).
- **AE2.6** Screen readers: mascot art is decorative (`accessibilityElementsHidden`/`importantForAccessibility="no"`) unless it conveys information, in which case it has a label; mascot speech bubbles are read as plain text.
- **AE2.7** Color is never the only carrier of meaning (mood scales have labels/icons).
- **AE2.8** Haptics and sound are never the only carrier of meaning and respect system settings (silent mode, haptics off).
- **AE2.9** Reading level for instructional and crisis copy ≤ grade 8; everyday copy ≤ grade 6.
