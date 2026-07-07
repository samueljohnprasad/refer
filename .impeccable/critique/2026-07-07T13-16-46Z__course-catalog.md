---
target: course catalog
total_score: 37
p0_count: 0
p1_count: 1
timestamp: 2026-07-07T13-16-46Z
slug: course-catalog
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Inline errors, loading spinners, and clear Enrolled chips |
| 2 | Match System / Real World | 4 | "Units", "Lessons", and "Journeys" are clear mental models |
| 3 | User Control and Freedom | 4 | Easy closure via overlay or button, freely toggle accordions |
| 4 | Consistency and Standards | 4 | Follows OS sheet norms and project brand tokens |
| 5 | Error Prevention | 4 | Disables duplicate enrollment ("Open Journey" label) |
| 6 | Recognition Rather Than Recall | 3 | Course length requires recalling which course was shortest |
| 7 | Flexibility and Efficiency | 3 | Mutually exclusive accordion prevents side-by-side comparison |
| 8 | Aesthetic and Minimalist Design | 4 | Tinted backgrounds, clean lines, and smooth iconography |
| 9 | Error Recovery | 4 | Smooth inline error states capture and display backend errors |
| 10 | Help and Documentation | 3 | Brief header sets the stage perfectly |
| **Total** | | **37/40** | **Excellent** |

#### Anti-Patterns Verdict

**LLM assessment**: Not Slop (Highly Polished). The previous passes for animation, layout, and clarification have paid off tremendously. The use of `LinearTransition.springify` in the accordion, combined with custom semantic accent colors, feels bespoke and distinctly non-default. The typography hierarchy is clear. The inclusion of the visual density map (unit segments) and the localized inline error states rather than native alerts elevate this component well beyond a templated UI into a premium, crafted experience.

**Deterministic scan**: The CLI scan returned 0 findings. All previous structural and typographic anti-patterns have been successfully mitigated.

**Visual overlays**: Skipped. The React Native environment lacks a live server to inject HTML overlays.

#### Overall Impression
A sophisticated, highly tactile mobile component. The entrance choreography, layout animations, and visual density maps work together to create an immersive experience. The primary remaining friction point is information architecture: crucial decision-making data is hidden inside the accordions.

#### What's Working
1. **Exceptional Animation Choreography**: The `LinearTransition.springify` combined with rotational interpolation on the chevron and `FadeIn/Out` for error banners creates a buttery-smooth experience.
2. **Contextual Color Usage**: Generating monogram backgrounds and segment pills using the specific course accent colors ensures the UI feels alive and visually varied without being chaotic.
3. **Smart Defaults**: Pre-selecting the first non-enrolled course so the user isn't staring at a wall of closed accordions minimizes initial clicks.

#### Priority Issues
- **[P1] Hidden Decision Metadata**
  - **Why it matters**: Estimated duration and lesson counts are invisible until a course is tapped. Browsing by time commitment (e.g., "I only have 10 minutes") requires tapping every single course.
  - **Fix**: Elevate the estimated duration (e.g., "45 min") to the closed state of the accordion card, perhaps aligned to the right or below the title.
  - **Suggested command**: `$impeccable layout`
- **[P2] Unmounting Timing Mismatch**
  - **Why it matters**: The component sets `shouldRender` to false after `350ms`, but the `SlideOutDown` exit animation runs for `250ms`. This 100ms gap could cause an awkward "hanging" empty view before unmount.
  - **Fix**: Align the timer in the `useEffect` exactly with the longest exit animation duration, or use an `onAnimationFinished` callback.
  - **Suggested command**: `$impeccable polish`
- **[P2] Preview Loading Layout Jump**
  - **Why it matters**: If `useGetCourseTreeQuery` takes time, the accordion expands to show just a small spinner, then violently jumps to full size once data loads.
  - **Fix**: Since `LinearTransition` is active, it should smooth this out naturally, but adding a skeleton state matching the rough height of the unit list would make the transition even smoother.
  - **Suggested command**: `$impeccable delight`

#### Persona Red Flags

**Alex (Power User)**:
- Wants to know "How long will this take?" but is forced to tap 5 different courses to find the shortest one.
- Because opening one course closes the others, they can't easily compare two course syllabi side-by-side.

**Jordan (First-Timer)**:
- No major red flags. The smart defaults (auto-opening the first course) heavily benefit Jordan by immediately showing them what a course contains.

#### Minor Observations
- The visual density map logic caps the pills at 5. If a course has 20 small units, showing just 5 pills might underrepresent the scope.
- The `bg-red-50/50` and `text-red-700` colors in the error banner are standard Tailwind but don't strictly pull from a defined brand token in `tokens.ts`.

#### Questions to Consider
- Why force the user to open a drawer to see if a course is a 5-minute read or a 3-hour deep dive? What if we brought the total duration up into the closed card state?
- Is it necessary to force the accordion to be mutually exclusive? If someone wants to expand two courses to compare them, should we let them?
