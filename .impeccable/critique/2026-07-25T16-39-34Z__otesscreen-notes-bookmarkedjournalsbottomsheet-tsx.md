---
target: src/screens/DailyNotesScreen/notes/BookmarkedJournalsBottomSheet.tsx
total_score: 34
p0_count: 0
p1_count: 1
timestamp: 2026-07-25T16-39-34Z
slug: otesscreen-notes-bookmarkedjournalsbottomsheet-tsx
---
Method: dual-agent (A: 39608337-209a-4bb9-b7ec-35136dd986aa · B: 06a64faf-6b4d-4674-91b0-3edddc8a76d5)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Excellent skeleton, pagination, empty states |
| 2 | Match System / Real World | 3 | "Bookmarked" feels digital vs notebook metaphor |
| 3 | User Control and Freedom | 4 | Native sheet drag-to-dismiss |
| 4 | Consistency and Standards | 1 | Violates DESIGN.md typography and radii rules |
| 5 | Error Prevention | 4 | No destructive actions available |
| 6 | Recognition Rather Than Recall | 4 | Shows previously saved entries |
| 7 | Flexibility and Efficiency | 4 | Automatic pagination on scroll |
| 8 | Aesthetic and Minimalist Design | 2 | Generic SaaS icon-in-circle detracts from editorial feel |
| 9 | Error Recovery | 4 | Empty state clearly explains what to do |
| 10 | Help and Documentation | 4 | Inline instruction on bookmarking |
| **Total** | | **34/40** | **[Good]** |

#### Anti-Patterns Verdict

**Moderate Slop.** The code exhibits AI-generated UI symptoms, specifically arbitrary hardcoded values (`text-[30px]`, `rounded-[30px]`, `text-[20px]`) that ignore established design tokens from `DESIGN.md`. 

**Deterministic scan**: The automated detector found 1 issue: an arbitrary large radius (`rounded-[30px]`) at line 122. The detector noted this might be a technical false positive for the "cards or inputs" rule (it is applied to a decorative squircle behind an empty state icon rather than a structural card), but it still contributes to a less editorial feel.

**Visual overlays**: No reliable user-visible overlay is available because this is a React Native component (browser automation skipped). CLI detector output was used as the fallback signal.

#### Overall Impression
The component elegantly handles the native mechanics of a bottom sheet but aesthetically defaults to a generic B2B/SaaS vibe instead of the calm, private therapy notebook requested. The biggest opportunity is ditching the decorative icons and hardcoded values for pure, structured typography.

#### What's Working
- **State Handling**: Excellent technical implementation of state handling, including loading skeletons, incremental loading, and fully-loaded empty states.
- **Native Feel**: Uses `@expo/ui/swift-ui` for a premium, tactile, native bottom-sheet presentation.
- **Accessibility**: Good accessibility contrast and clear semantic use of color.

#### Priority Issues

- **[P1] Inconsistent Typography**
  - **What**: Hardcoded text sizes (`text-[30px]`, `text-[15px]`, `text-[20px]`) ignore the design system.
  - **Why it matters**: Breaks the consistent, calm editorial feeling of the notebook and makes it look unpolished.
  - **Fix**: Switch to `DESIGN.md` scale tokens (e.g., `text-headline`, `text-title`, `text-body`).
  - **Suggested command**: `$impeccable typeset`

- **[P2] Generic SaaS Aesthetics (Header/Icons)**
  - **What**: Over-reliance on icon-in-a-circle patterns in the header and empty states.
  - **Why it matters**: Makes the screen feel like a generic task app rather than an intentional, premium therapy journal.
  - **Fix**: Remove the decorative circles and rely on strong typography and negative space.
  - **Suggested command**: `$impeccable distill`

#### Persona Red Flags

**Alex (Power User)**: The generic SaaS template feel might make the app seem less premium or trustworthy as a therapy tool.

**Jordan (First-Timer)**: The terms ("Bookmarked Journals") feel a bit digital and detached rather than emotionally resonant for a CBT context, which might distance a vulnerable user.

#### Minor Observations
- Safe fallback for `totalCount || 0` ensures the UI won't render `undefined`.
- The "All {totalCount} bookmarked journals loaded" footer is a nice, comforting touch that provides psychological closure.
- The modal uses `animationType="none"` properly to let the native SwiftUI component handle the transition smoothly.

#### Questions to Consider
- Does the header need an icon at all? Could it just rely on a strong Cormorant typographic heading to establish the editorial feel?
- Is "Bookmarked Journals" the most emotionally resonant term for a CBT app? Would "Saved Insights", "Key Reflections", or "Pinned Notes" feel more aligned with a therapy context?
