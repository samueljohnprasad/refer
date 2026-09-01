<!--
SYNC IMPACT REPORT
==================
Version change:  unversioned (all-placeholder template) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles (I–VII)
  - Exercise & Learning Design Constraints
  - Engineering Workflow
  - Governance
Removed sections: N/A (template stubs replaced)
Deferred TODOs: none
-->

# Happy Journals Constitution

## Core Principles

### I. One Learning Job Per Exercise (NON-NEGOTIABLE)

Each exercise MUST teach one clear concept or practise one discrete skill.
Multiple learning goals MUST NOT be combined in a single interaction.
An exercise that mixes concept introduction with assessment or that requires
two unrelated cognitive tasks is non-compliant and MUST be refactored before
shipping.

**Rationale:** Learners in a therapeutic context carry cognitive load; mixing
goals increases confusion, reduces retention, and undermines the calm,
trustworthy brand.

### II. One Active Decision or Control at a Time (NON-NEGOTIABLE)

At any moment the learner MUST face exactly one choice, field, slider, step,
or action. Multiple competing controls MUST NOT be rendered simultaneously in
the active region. Completed steps collapse to compact summaries; future steps
MUST NOT be interactive until their turn arrives.

**Rationale:** Single-decision flow removes overwhelm, matches CBT guided-
discovery pacing, and ensures progress feels intentional rather than chaotic.

### III. Resumable, Deterministic State

Every exercise MUST restore to the exact stage from saved state.
`createXxxResponse(content, saved)` MUST be the sole state-reconstruction
path and MUST repair any malformed or forged saved data to a safe in-progress
stage before rendering or allowing completion.

Completion MUST only be restored when saved data is well-formed (all expected
keys present, no unexpected keys) AND all required answers are present and
supported.

**Rationale:** Users return to interrupted exercises on lossy mobile
connections; a broken resume breaks trust.

### IV. Internal Buttons Update; Only Final Continue Advances

Taps on choices, field options, sliders, and inline buttons MUST update the
current exercise workspace in place. Navigation to the next course exercise
MUST occur only when the learner presses the footer Continue button after the
exercise reaches `phase: "complete"`.

Skip for now MUST be visible on every exercise while the exercise is active
and no feedback is showing.

**Rationale:** Accidental navigation is a top mobile UX failure mode; the
spec requires exactly one route-advance action.

### V. Private Data — Store IDs and State, Never Therapeutic Text

Response objects persisted to the session store or analytics MUST contain
only stable IDs, enum phases, counts, booleans, and elapsed times.
Option labels, feedback text, user-typed content, and therapeutic copy
MUST NOT appear in stored responses or analytics payloads.

**Rationale:** Mental-health content is sensitive. Therapeutic text in logs or
analytics would be a privacy and trust violation.

### VI. Premium, Editorial, Calm Design (NON-NEGOTIABLE)

All UI MUST follow `DESIGN.md` and `PRODUCT.md`. Sage/white/dark-green ink
palette only (tokens from `lib/tokens.ts`). Cormorant for reflective titles
and completion moments; Geist for labels, controls, and body copy.

MUST NOT use: generic gradients, ghost cards (border + drop-shadow together),
corner radii ≥ 32 px on cards, all-caps eyebrow tropes on every section,
monotonous unvaried card stacks, AI-generated UI slop, or decorative borders
without physical justification.

**Rationale:** Calm and Headspace-tier polish is a brand non-negotiable and
directly affects whether users trust the app with their mental health.

### VII. Minimal, Ponytail-Mode Code (YAGNI)

Every implementation MUST start with the smallest usable version. Abstractions
MUST be justified by a concrete, present need. No component, hook, or helper
file may exceed 300 lines; files that grow past this limit MUST be split before
adding behavior. `// ponytail:` comments MUST annotate intentional
simplifications.

Dependencies MUST NOT be added for capabilities that existing dependencies or
the standard library already provide.

**Rationale:** Smaller surface area = fewer bugs, faster onboarding, cheaper
maintenance.

## Exercise & Learning Design Constraints

- iOS 26+ only. No Android support or fallbacks for iOS < 26.
- All exercise engines MUST be microlearning-category-registered so content
  validation runs before render.
- Do not make UI components specific to a single exercise. Always extract and use generic, highly reusable shared components (e.g., standard cards, option buttons) across all exercises so UI updates propagate system-wide.
- Strict content validators MUST reject malformed content at the
  `NodeExerciseDataError` boundary — never render a broken exercise silently.
- Feedback MUST be immediate, non-punitive, and replace the active choice
  region (choices disappear when feedback appears).
- Accessible 48-point tap targets MUST be maintained on all interactive
  elements.
- VoiceOver live regions MUST announce stage transitions.
- Haptics (selection and success) MUST be intentional — only on meaningful
  state changes, never decorative.
- No automated test cases. Verification via iOS simulator, TypeScript
  (`npx tsc --noEmit`), and dev test screen fixtures.

## Engineering Workflow

- **Routing:** Expo Router under `app/`. Global providers in `app/_layout.tsx`.
- **Aliases:** Use `@/` for all root-relative imports.
- **Styling:** NativeWind/Tailwind classes only. No inline styles except for
  dynamic values. No `StyleSheet.create` in new microlearning engines.
- **TypeScript:** Strict. No `any`. All function params, return types, and
  variable assignments MUST be explicitly typed.
- **State:** Redux Toolkit for global; React hooks for local.
- **Commits:** One task = one commit, immediately after verification.
  Commit message format: `type(scope): description`.
- **Scope:** Keep changes scoped to the requested behavior. Broad refactors
  require explicit permission.
- **Comments:** Only durable reasoning. No comments about bug fixes,
  migrations, or minor events.

## Governance

This constitution supersedes all other engineering and design practices in this
repository. Any practice that conflicts with these principles is non-compliant.

**Amendment procedure:**
1. Author proposes a change with rationale in a pull request description or
   design doc.
2. Amendment is applied via `/speckit-constitution` with explicit justification.
3. Version is bumped according to semantic versioning (MAJOR for removals or
   redefinitions; MINOR for additions; PATCH for clarifications).
4. The commit message MUST reference the new version.

**Compliance review:** Every code review MUST verify that touched files comply
with Principles I–VII. Non-compliant code MUST NOT be merged.

**Versioning policy:** `CONSTITUTION_VERSION` follows semver. The
`LAST_AMENDED_DATE` is updated on every merge that touches this file.

Refer to `AGENTS.md` and `.agents/rules/` for runtime agent guidance that
derives from this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-08-24 | **Last Amended**: 2026-08-24
