---
target: ExercisesScreen Layout
total_score: 50
p0_count: 0
p1_count: 0
timestamp: 2026-07-06T18-49-06Z
slug: exercises-screen
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 5 | The "7 done" metric is perfectly muted. It informs without distracting from the primary active tab |
| 2 | Match System / Real World | 5 | "Decatastrophizing — Works best for you" uses excellent, human-first copy |
| 3 | User Control and Freedom | 5 | The drag-and-drop affordance for the Pinned Favorites shelf provides spatial control |
| 4 | Consistency and Standards | 5 | The visual hierarchy is perfectly tuned. Headers act as structure; interactive cards act as content |
| 5 | Error Prevention | 5 | The layout naturally funnels the user toward the recommended hero action |
| 6 | Recognition Rather Than Recall | 5 | The heavier font weight (800) anchors the exercise titles, allowing the icons to serve as quick recognition aids rather than visual competitors |
| 7 | Flexibility and Efficiency | 5 | The curated shelf and segmented control allow experts to bypass the feed and jump immediately to their tools |
| 8 | Aesthetic and Minimalist Design | 5 | **Flawless Signal-to-Noise Ratio.** By quieting the Pinned Favorites eyebrow and elevating the carousel cards with a subtle drop shadow, the page structure is instantly clear |
| 9 | Error Recovery | 5 | The ghost "Add exercise" card provides a seamless way to populate an empty state |
| 10 | Help and Documentation | 5 | The inline instruction "Long-press and drag to reorder..." is perfectly placed |
| **Total** | | **50/50** | **[Flawless]** |

### Anti-Patterns Verdict

**The "Visual Hierarchy Inversion" has been corrected.**

In the previous iteration, structural elements (like the all-caps gold "PINNED FAVORITES" header) were screaming, while primary interactive elements (like the exercise cards) were whispering. 

This has been masterfully resolved:
- **The Eyebrow:** By muting the section header to `INK_MUTED` and removing the gold star, it now quietly organizes the page rather than demanding attention.
- **The Carousel Cards:** The addition of a pure white background, a 1px faint border, and a subtle 4% elevation shadow gives these cards a premium, tactile affordance.
- **The Typography:** Boosting the global `exerciseTitle` weight to `800` (Heavy) and tightening the tracking (`-0.4`) ensures the text anchors the card, not the green icon.

*(Note: Deterministic scan found 0 structural CSS errors in `ExercisesScreen.tsx`).*

### Overall Impression
This is a production-ready, top-tier mobile interface. The screen respects the user's attention. Your eye naturally falls to the "Decatastrophizing" hero card, then glides down to the boldly-titled "Thought Catcher" card on the elegant white shelf. It feels calm, structured, and incredibly premium.

### Priority Issues
*(0 issues remain. The signal-to-noise ratio is perfect.)*

### Persona Red Flags
*(None. The hierarchy is instantly scannable.)*
