---
target: src/screens/JourneyMapScreen
total_score: 36
p0_count: 0
p1_count: 1
timestamp: 2026-07-07T08-46-58Z
slug: src-screens-journeymapscreen
---
#### Report header provenance
Method: dual-agent (A: 0756ba4e-5e14-4dcd-91ea-576a0915bc1c · B: self-execution)

#### Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Haptics, toasts, skeletons, and scroll hints effectively communicate state. |
| 2 | Match System / Real World | 4 | Uses gamified progression metaphors (nodes, paths) naturally. |
| 3 | User Control and Freedom | 3 | Easy course switching and section sheet navigation. |
| 4 | Consistency and Standards | 4 | UI elements match expected mobile gaming/learning conventions. |
| 5 | Error Prevention | 4 | Routing lock prevents double-routing; locked nodes provide immediate feedback. |
| 6 | Recognition Rather Than Recall | 4 | Map visually represents progression; "scroll to active" assists recall. |
| 7 | Flexibility and Efficiency | 3 | Scroll-to-active button acts as a great accelerator. |
| 8 | Aesthetic and Minimalist Design | 4 | Clean header integration and well-structured lists without clutter. |
| 9 | Error Recovery | 3 | Empty states and locked nodes explain exactly what is happening. |
| 10 | Help and Documentation | 3 | Self-explanatory interface. |
| **Total** | | **36/40** | **Excellent** |

#### Anti-Patterns Verdict

**LLM assessment**: Pass. The interface feels intentional, highly polished, and emotionally intelligent. The routing race conditions have been successfully mitigated, and the toast copy is genuinely supportive rather than robotic.
**Deterministic scan**: Clean. The automated detector found 0 anti-patterns in the source files.
**Visual overlays**: Skipped (no live server).

#### Overall Impression
The Journey Map feels robust and delightful. The recent hardening (routing locks, GlassView fix) and clarification (supportive toast) have elevated it from a solid implementation to a production-ready, resilient feature.

#### What's Working
- **Resilient Routing**: The `isRoutingRef` lock creates a smooth, race-condition-free navigation experience.
- **Emotional Intelligence**: "Keep going! This will unlock soon" is vastly superior to a generic error.
- **Performance Polish**: Leveraging `@legendapp/list` for the flash list ensures smooth scrolling performance alongside `AmbientTapDust` for micro-interaction polish.

#### Priority Issues
- **[P1] Hardcoded Stats**: `STUB_STATS` is still hardcoded in `JourneyMapContainer.tsx`. This needs to be wired up to actual user data hooks before release.
  - **Suggested command**: `$impeccable harden`
- **[P2] Transition Timeout Fragility**: The 200ms `setTimeout` in `useJourneyMapController` could fire unexpectedly if the component unmounts mid-transition.
  - **Suggested command**: `$impeccable optimize`
- **[P3] Screen Reader Context**: While visual state is clear, ensure `JourneyNodeCell` explicitly passes `accessibilityState={{ disabled: true }}`.
  - **Suggested command**: `$impeccable audit`

#### Persona Red Flags
- **Alex (Power User)**: Might slightly notice the 200ms forced delay before routing. If the JS thread is busy, the timeout might drift, causing a noticeable stutter.
- **Sam (Accessibility-Dependent User)**: If the DuolingoHeader stats (Gems, Streak, Hearts) are icon-only without explicit `accessibilityLabel`s, Sam will not know what the numbers represent.

#### Minor Observations
- The `GlassView` inline style removes the border bottom and shadow cleanly, keeping the transparent header looking native.
- Empty state text uses `adjustsFontSizeToFit` with `numberOfLines={2}`, which scales nicely across devices.

#### Questions to Consider
- What if the transition delay was dynamically tied to the actual Reanimated/Moti animation completion callback rather than a fixed 200ms timeout?
- Is there a satisfying "journey complete" celebration state if a user finishes the final node in the course?
