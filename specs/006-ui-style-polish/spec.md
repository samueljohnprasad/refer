# Specification: UI Style Polish & Color Tokens

## 1. Context & Scope

**Background**: The journey map exercises have undergone significant UI styling refinements to achieve a balanced, high-end editorial look. The typography, hierarchy, and component weights have been significantly improved. However, a few minor visual details require a final pass of adjustments to reach maximum polish.

**Goal**: Execute the final 10% of UI refinements to soften the secondary actions, reduce visual clutter on feedback, and ensure consistent usage of the global color token system.

**Scope**:
- Checkmark icon size in feedback components.
- CTA button elevation/shadow depth.
- Secondary "Skip" button prominence and typography.
- Audit of color tokens for consistency (avoiding arbitrary shade definitions).

## 2. User Scenarios & Flow

- **Scenario 1 (Receiving Feedback)**: A user submits an answer and the feedback card appears. The eye is naturally drawn to the text of the feedback rather than the checkmark icon, creating a calmer visual flow.
- **Scenario 2 (Choosing an Action)**: The user is presented with a primary CTA and a secondary "Skip for now" button. The primary CTA is visually grounded without feeling heavy or game-like, while the Skip button sits clearly in a subordinate visual role (smaller, softer color, lighter weight).

## 3. Functional Requirements

- **FR-1: Feedback Icon Reduction**: The success/check icon within feedback panels must be reduced in size by an additional 10% to ensure it does not compete with the feedback text.
- **FR-2: CTA Elevation Reduction**: The primary Call to Action (CTA) button's bottom "ledge" (shadow depth) must be reduced by an additional 10-15% to lean into a premium, non-game-like aesthetic.
- **FR-3: Skip Button Softening**: The "Skip for now" button must be styled with a slightly smaller font size, a weight of 500-600 (Nunito), and a muted green/foreground token to clearly establish a secondary hierarchy.
- **FR-4: Color Token Consistency**: All UI elements (title, selected border, feedback check, progress, CTA) must reference a unified, pre-existing brand color token set (e.g., `SAGE`, `INK`, `COURSE_EXERCISE_COLORS`) rather than declaring standalone arbitrary hex values.

## 4. Success Criteria

- **SC-1 (Visual Hierarchy)**: The Skip button is visually subordinate to the primary CTA in weight, size, and contrast.
- **SC-2 (Component Sizing)**: The feedback check icon size is roughly 10% smaller than its previous baseline (which was 19x19).
- **SC-3 (Token Usage)**: 100% of color styles in the reviewed components map to centralized theme tokens. No rogue hex colors exist for greens in the exercise engine files.

## 5. Assumptions & Dependencies

- **Assumptions**: The global `courseExerciseTheme.ts` or `tokens.ts` already contains the necessary muted greens and core palette needed to unify the color choices.
- **Dependencies**: React Native SVG button component (`SvgAppButton`) supports further fractional or minimal reductions in `pressDepth`.
