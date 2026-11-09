# Phase 5 — Synthesis and tokens

## Objective
Turn Phases 1–4 into non-negotiable, numeric design tokens with the emotional intent of each recorded, so implementation cannot drift into generic wellness defaults.

## Required inputs
- Phases 1–4 artifacts — all PASS
- Current tokens: `src/theme/{colors,palette,typography,radius,elevation,spacing}.ts`, `tailwind.config.*`, `global.css` if present
- Motion engine: `src/components/ui/motion/engine.ts`, `.agents/skills/rossark-motion-skill/templates/react-native/motion.ts`

## Required tools
- Read/Grep on theme files. WebSearch/WebFetch for WCAG 2.2 contrast (SC 1.4.3, 1.4.11), target size (SC 2.5.8), Apple HIG Dynamic Type sizes, `prefers-reduced-motion`/`AccessibilityInfo.isReduceMotionEnabled`.
- Compute contrast ratios (write the ratio; a script in `$TMPDIR` is fine — never in repo).

## Method — each section is a table with real numbers and an "Intent / driven by F#" column
1. **Type scale**: role, family (keep Nunito unless evidence says otherwise), size/line-height in pt, weight, Dynamic Type behavior, max line length (characters).
2. **Spacing scale**: base unit and steps (e.g. 4-pt grid), screen gutters, section gaps.
3. **Color roles**: role → hex light/dark → emotional intent → contrast ratio vs its background (≥4.5:1 text, ≥3:1 UI). One accent, one role. Mood colors separate from brand.
4. **Radii** and **elevation**: values and where each is allowed.
5. **Motion**: durations (ms), curves (cubic-bezier numbers), springs (damping/stiffness) per category: press, enter, exit, mascot idle, mascot one-shot, celebration. Reduced-motion fallback per row. Exits faster than entrances; UI ≤300 ms.
6. **Illustration style spec**: line weight, palette subset, shading rule, framing, max size per screen type.
7. **Haptic map**: event → generator → style/intensity → max frequency.
8. **Copy rules**: numeric caps (words per bubble, sentence length, exclamation marks per screen = 0 or 1), tone per screen type.
9. **Diff vs current**: table of current token → new token → reason. Unchanged tokens stated as unchanged.
10. Contradictions, Rejected ideas (≥3 token directions rejected, e.g. cream+serif "calm wellness" default, dark+lime fintech), critique → revise → check → self-critique.

## Output
`docs/research/soul/05-tokens.md`

## Exit criteria
- `check_phase.py 5` exits 0: ≥5 non-internal sources, all nine sections present (`## Type`, `## Spacing`, `## Color`, `## Radii and elevation`, `## Motion`, `## Illustration`, `## Haptics`, `## Copy rules`, `## Diff vs current`), every color row has a contrast ratio, every motion row has ms.
- `research-quality`, `emotional-design`, `accessibility-and-ethics` all PASS.
