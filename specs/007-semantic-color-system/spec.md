# Specification: Happy App Semantic Color System

## 1. Context & Scope

**Background**: As the application grows to include more states (selection, correctness, progress, hints, checkpoints, streaks), ad-hoc component-based color choices are creating visual inconsistency. Relying on arbitrary, slightly different greens for each screen and state weakens visual hierarchy, complicates maintenance, and makes dark mode and accessibility (high-contrast) support extremely difficult.

**Goal**: Establish a unified semantic color system where colors are assigned by their semantic role (e.g., `brand.primary`, `success.soft`, `text.secondary`) rather than their component or raw appearance (e.g., `quizButtonGreen`, `darkGreen`).

**Scope**:
- Definition of the semantic color token architecture (palette layer vs. semantic layer).
- Rules for semantic mapping across all UI elements, specifically applied to the Exercise Screen.
- Governance for visual strength hierarchy (Strong to Quiet).
- Constraints for accessibility, light/dark mode support, and state differentiation (e.g., separating "Selection" from "Success").

## 2. User Scenarios & Flow

- **Scenario 1 (Interacting with Core Actions)**: A user looks at an exercise screen. The primary action (Continue) draws the eye immediately because it uniquely holds the strongest `brand.primary` color. Secondary actions (Skip) use `text.secondary` and do not compete for attention.
- **Scenario 2 (Making a Selection)**: A user taps an answer. The answer adopts a `brand.soft` surface with a `border.selected` outline. Because the brand color isn't overused elsewhere on text or headings, the selection is unambiguous.
- **Scenario 3 (Receiving Feedback)**: A user submits an answer. If correct, the UI responds with `success.primary` icons and `success.soft` surfaces. If incorrect, it uses `error` tokens. Crucially, success and error states are distinct from the neutral "selected" state, ensuring the user does not confuse selection for correctness.
- **Scenario 4 (Switching to Dark Mode)**: A user switches their OS to Dark Mode. The application responds seamlessly because components request semantic tokens (e.g., `brand.primary`) which automatically resolve to the appropriate dark-palette equivalent, preserving contrast and hierarchy.

## 3. Functional Requirements

- **FR-1: Two-Layer Architecture**: The color system must consist of a Primitive Palette layer (e.g., `green50`, `gray900`) and a Semantic layer (e.g., `brand.primary`, `text.secondary`). Components must strictly consume the Semantic layer.
- **FR-2: Strict Semantic Token Constraints**: No new tokens may be created based purely on appearance (e.g., `lighterGreen`) or specific components (e.g., `sleepCardGreen`). All tokens must describe intent (e.g., `text`, `brand`, `surface`, `border`, `success`, `error`, `warning`).
- **FR-3: Separation of Selection and Success**: The visual language must enforce a clear distinction between selection ("This is the option I chose", using brand/neutral markers) and evaluation ("This is correct/incorrect", using success/error markers).
- **FR-4: Hierarchy of Brand Color Usage**: The strongest brand color (`brand.primary`) is reserved for primary actions, progress indicators, and selected interactive states. Headings and body text must default to neutral/green-black tokens (`text.primary`, `text.secondary`).
- **FR-5: Multi-Appearance Resolution**: Every semantic token must safely resolve appropriate values for both Light Mode and Dark Mode contexts without component-level overrides.
- **FR-6: Accessibility Non-Reliance**: The UI must not rely solely on color to communicate essential states (e.g., disabled states must reduce emphasis and ignore interaction; success/error must include distinct icons like ✓ and ✕ alongside color).

## 4. Success Criteria

- **SC-1 (Consistency)**: 100% of the UI components in the exercise engine consume semantic tokens rather than raw hex codes or component-specific colors.
- **SC-2 (Visual Hierarchy)**: Usability testing or visual audits confirm that the primary CTA is consistently the strongest element on the screen, with secondary actions explicitly lower in visual weight.
- **SC-3 (Maintainability)**: The entire app's color theme can be inverted for Dark Mode or adjusted for a rebrand strictly by modifying the semantic mapping layer, requiring zero changes to individual component files.
- **SC-4 (Clarity)**: Users can distinguish an unevaluated selected state from a evaluated correct/incorrect state instantly.

## 5. Assumptions & Dependencies

- **Assumptions**: The design system relies on a minimal underlying palette capable of supporting light, dark, and potentially high-contrast appearance variants.
- **Dependencies**: The React Native / Expo environment utilizes a theme provider capable of context-aware token resolution (e.g., NativeWind, styled-components, or a custom context).
