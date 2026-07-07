---
target: course catalog
total_score: 25
p0_count: 0
p1_count: 3
timestamp: 2026-07-07T13-09-02Z
slug: course-catalog
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Clear button states and loading indicators |
| 2 | Match System / Real World | 3 | Standard educational terminology |
| 3 | User Control and Freedom | 3 | Easy to close the sheet or collapse accordions |
| 4 | Consistency and Standards | 2 | Inconsistent animation libraries; unused variables |
| 5 | Error Prevention | 3 | Prevents re-enrolling |
| 6 | Recognition Rather Than Recall | 3 | Course details inline |
| 7 | Flexibility and Efficiency | 2 | Basic flat list, no advanced navigation |
| 8 | Aesthetic and Minimalist Design | 3 | Clean layout, but risky hex string manipulations |
| 9 | Error Recovery | 1 | Jarring native Alert.alert with no in-UI recovery |
| 10 | Help and Documentation | 2 | Minimal subtitle text, no deep help |
| **Total** | | **25/40** | **Acceptable** |

#### Anti-Patterns Verdict

**LLM assessment**: Moderate Slop. While the holistic design aims for a premium, minimalist vertical accordion list, the implementation has clear hallmarks of AI generation oversights. The code mixes animation paradigms (Reanimated for chevrons, LayoutAnimation for the accordion body) which often leads to jank. It also hallucinates layout logic: computing variables for UI elements (unit segments) and completely forgetting to render them. Additionally, the "Sheet" doesn't actually slide in; it just instantly mounts a FullWindowOverlay without any entry/exit transitions, belying the "premium" ambition.

**Deterministic scan**: The CLI scan returned 0 issues. Previous typeset passes successfully resolved the `border-accent-on-rounded` anti-pattern and hardcoded typography slops.

**Visual overlays**: Skipped. The React Native environment lacks a live server to inject HTML overlays.

#### Overall Impression
A solid foundational accordion layout, completely undermined by a lack of entry animations and a missing visual representation of course density. It feels like a prototype, not a premium product.

#### What's Working
1. **Clean Architecture**: Shifting to an exclusive-state accordion model keeps the UI tidy and focused on one journey at a time.
2. **State Feedback**: The enrollment button handles its lifecycle states ("Enroll", "Enrolling...", "Open") well, reassuring the user.
3. **Typography & Tokens**: Good use of custom brand typography (happy-font-heading) and token-based coloring.

#### Priority Issues
- **[P1] Missing UI (Hallucination)**
  - **Why it matters**: `visibleUnitSegments` and `hiddenUnitCount` are calculated but never actually rendered. The user is forced to rely on text labels, increasing cognitive load.
  - **Fix**: Render the computed unit segments to provide a visual density map.
  - **Suggested command**: `$impeccable layout`
- **[P1] No Sheet Animation**
  - **Why it matters**: The `CourseCatalogSheet` overlay instantly pops onto the screen, breaking the physical metaphor and feeling abrupt.
  - **Fix**: Add a proper slide-up entry and slide-down exit animation to the sheet.
  - **Suggested command**: `$impeccable animate`
- **[P1] Harsh Error Handling**
  - **Why it matters**: A native `Alert.alert` for failed enrollments rips the user out of the immersive app environment.
  - **Fix**: Replace the native alert with an in-UI error state (e.g., toast or inline error text).
  - **Suggested command**: `$impeccable clarify`
- **[P2] Animation Inconsistency**
  - **Why it matters**: Mixing `react-native-reanimated` (`withSpring`) and `LayoutAnimation` leads to mismatched physics and Android UI jank.
  - **Fix**: Standardize on Reanimated for both the chevron and accordion expansion.
  - **Suggested command**: `$impeccable optimize`

#### Persona Red Flags

**Alex (Power User)**:
- No fast-scroll or search for when the catalog scales.
- Forced to click into each accordion to see what's inside instead of skimming a high-level visual density map (which was calculated but not rendered).

**Jordan (First-Timer)**:
- A failed enrollment yields a jarring OS-level alert box without clear steps on how to retry or recover natively in the UI.

#### Minor Observations
- The empty state relies purely on plain text. It could use a playful empty state illustration or SVG art.
- The close button header uses an empty `<View className="h-11 w-11" />` to push the close button to the right. Using `justify-end` on the container would achieve the same without the dummy view.

#### Questions to Consider
- Where did the visual unit segments go? You spent CPU cycles calculating `visibleUnitSegments` and `hiddenUnitCount` but forgot to paint them on the screen!
- Why use `LayoutAnimation` for the accordion body when you're already importing and using `react-native-reanimated` for the chevron? Doesn't this lead to mismatched spring physics and Android UI jank?
- Is an instant-appearing `FullWindowOverlay` without a slide-up animation really a "sheet", or just a modal that abruptly pops into existence?
