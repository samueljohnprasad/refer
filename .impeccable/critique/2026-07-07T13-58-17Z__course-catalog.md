---
target: course catalog
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-07-07T13-58-17Z
slug: course-catalog
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Skeletons are completely static, feeling broken rather than loading. |
| 2 | Match System / Real World | 4 | Excellent use of "Journey", "Unit", and "Lesson" terminology. |
| 3 | User Control and Freedom | 3 | Can open/close and dismiss easily, but no way to cancel a pending enrollment. |
| 4 | Consistency and Standards | 3 | Accordion is standard, but keeping multiple open creates unusual list length. |
| 5 | Error Prevention | 3 | "Enrolled" chip and disabled duplicate enrollments work well. |
| 6 | Recognition Rather Than Recall | 3 | Previewing units helps recognition nicely. |
| 7 | Flexibility and Efficiency | 2 | No search or filtering for power users as the catalog grows. |
| 8 | Aesthetic and Minimalist Design | 2 | Rainbow section colors inside a colored course container creates visual chaos. |
| 9 | Error Recovery | 3 | Error banner is clear, but "Something went wrong" fallback is generic. |
| 10 | Help and Documentation | 2 | The empty state is dry and offers no guidance. |
| **Total** | | **28/40** | **Good** |

### Anti-Patterns Verdict

**LLM Assessment**: The UI leans into a few AI slop tendencies. The background (`#F8FAF7` "Sage canvas") falls into the classic 2026 AI default warm-neutral/cream bucket. More egregiously, the section previews apply a hardcoded rainbow of accents (`#5F7F58`, `#1F7A70`, `#C56A3A`, `#7A6754`) to list items. This "rainbow list" is a common AI reflex for adding "delight," but since the parent course container is already tinted with its own `courseAccentColor`, you end up with a chaotic "clown car" effect (e.g., a purple course containing green, teal, orange, and brown sections). The fallback copy "A guided journey you can start today." is also generic filler.

**Deterministic scan**: CLI scan returned 0 findings.

**Visual overlays**: Skipped (no browser injection capability in this environment).

### Overall Impression

The bespoke unit density map (`visibleUnitSegments`) is a fantastic piece of craft, but the overall experience is undermined by overwhelming color clashes and static loading states. The decision to allow multiple courses to expand simultaneously makes sense for comparison, but without auto-scrolling, it creates a massive, unwieldy wall of content.

### What's Working

- **The Unit Density Map**: Rendering tiny pill segments (`visibleUnitSegments`) to visually represent the size of a section is a beautiful, glanceable data visualization.
- **Micro-Interactions**: The expanding chevron rotation and the spring-based layout transitions (`LinearTransition.springify()`) make the interactions feel premium and native.
- **Monogram Fallbacks**: Resolving to a customized monogram with matching text color when an icon is missing is a great touch that preserves the aesthetic.

### Priority Issues

**[P1] Rainbow Section Colors Clash with Course Theme**
- **Why it matters**: Section rows cycle through 4 fixed accent colors regardless of the parent course's `courseAccentColor`. Layering green/teal/orange sections inside a purple or red course container creates an unbranded, chaotic mess.
- **Fix**: Use a monochromatic scale derived from the parent `courseAccentColor` for all section previews within that course. 
- **Suggested command**: `$impeccable colorize`

**[P1] Static Skeleton Loading States**
- **Why it matters**: The loading skeleton added in the recent `$impeccable delight` pass uses static `bg-slate-200/50` views. Without a pulse or shimmer, they look like broken UI blocks rather than a loading state, causing users to think the app is frozen.
- **Fix**: Add a pulsing animation using Reanimated or standard Tailwind `animate-pulse` to the skeleton wrappers.
- **Suggested command**: `$impeccable animate`

**[P2] Comparison Shopper Overload (Unbounded Expansion)**
- **Why it matters**: Allowing multiple courses to expand simultaneously pushes the viewport down exponentially. Users lose their context and have to scroll endlessly to compare. 
- **Fix**: Retain the multi-open ability, but auto-scroll the `FlatList` to the top of the newly expanded course so the user stays anchored to their current action.
- **Suggested command**: `$impeccable layout`

**[P3] No Search or Filtering**
- **Why it matters**: As the catalog grows beyond a handful of courses, scrolling through a linear list becomes tedious for users who know what they want.
- **Fix**: Add a sticky search/filter bar below the header.
- **Suggested command**: `$impeccable shape`

### Persona Red Flags

**Alex (Power User)**: 
- Forced to scroll a long list to find a specific course; no search available.
- Expanding multiple courses for comparison creates a massive scroll burden; will get frustrated navigating back to the top.

**Jordan (First-Timer)**:
- Might accidentally click multiple accordions and become overwhelmed by the sheer length and colorful visual noise of the page. 
- "No published courses are available yet" in the empty state offers zero guidance on what to do next.

### Minor Observations
- The error message fallback "Something went wrong while opening this course." is a bit generic. 
- The description fallback "A guided journey you can start today." reads as AI filler.

### Questions to Consider
- What if the section preview didn't use colors at all, but rather relied on subtle opacity variations of the ink color, letting the course icon carry the brand?
- Does the Comparison Shopper actually want to see all lessons for both courses, or do they just want to see a high-level summary comparison?
