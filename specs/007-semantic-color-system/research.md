# Phase 0: Research & Clarifications

Based on the highly detailed architectural spec provided, there are zero unknowns. The token hierarchy, required layers, state separations, accessibility rules, and file structures have been explicitly mandated.

## Decisions

- **Decision**: Adopt a strict 3-tier architecture: Primitive Palette -> Semantic Brand Tokens -> Components.
  - **Rationale**: Eliminates developer confusion regarding which layer to import (`THEME` vs `LIGHT_TOKENS` vs `BRAND_*`).
- **Decision**: Neutralize primitive naming (e.g., `TERRACOTTA` -> `RED`, `OTTER_BLUE` -> `BLUE`) and remove semantic intent from primitives (e.g., remove `SAGE.selected`).
  - **Rationale**: Primitives should describe color, not usage or external brand inspiration.
- **Decision**: Promote `selection` and `disabled` to first-class semantic objects.
  - **Rationale**: Prevents overloading the `brand` or `success` tokens, solving the "green means four different things" problem.
- **Decision**: Upgrade contrast for `muted` and `warning` text to pass WCAG AA (4.5:1 for normal text).
  - **Rationale**: Ensures readability for critical metadata and labels in all lighting conditions.
- **Decision**: Implement `highContrastLight` and `highContrastDark` variants using `DynamicColorIOS`.
  - **Rationale**: Aligns with Apple HIG recommendations for accessibility.
- **Decision**: Shift `shadow` from a raw color to an `ELEVATION` token system.
  - **Rationale**: Shadows require multiple parameters (offset, blur, opacity, color). An elevation system standardizes the physical depth of components.

## Explicit Removals (The Legacy)

- **Decision**: Completely delete `THEME`, `LIGHT_TOKENS`, `DARK_TOKENS`, `BRAND_CANVAS`, `BRAND_SURFACE`, `CREAM`, `WARM_WHITE`.
  - **Rationale**: The user specifically mandated removing the legacy. Keeping them around as aliases creates competing APIs and technical debt.
- **Decision**: Delete external brand primitives (e.g., `TERRACOTTA`, `GOLD`, `OTTER_BLUE`, `MACAW_PURPLE`, `PARROT_ORANGE`).
  - **Rationale**: The source inspiration does not belong in the runtime token API. They will be renamed neutrally to `RED`, `ORANGE`, `YELLOW`, `BLUE`, `PURPLE`.
- **Decision**: Remove semantic usage from the primitive `SAGE` palette (e.g., delete `SAGE.selected`, `SAGE.pill`).
  - **Rationale**: Primitives must only describe color values, not their intent or usage.
- **Decision**: Remove opacity primitives masquerading as intent (`faint`, `soft`, `mist`, `whisper`).
  - **Rationale**: Map opacity directly through semantic roles like `pressedOverlay`, `disabledOverlay`.
