---
target: src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx
total_score: 33
p0_count: 1
p1_count: 1
timestamp: 2026-08-11T05-24-09Z
slug: ns-journalcalendarscreen-journalcalendarscreen-tsx
---
#### Report header provenance
Method: single-context (visual inspection + local CLI detector)

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Mood logging is clearly visible, though layout obscures it. |
| 2 | Match System / Real World | 4 | Standard calendar metaphor is clear. |
| 3 | User Control and Freedom | 4 | Easy to navigate months and jump to Today. |
| 4 | Consistency and Standards | 2 | The overflowing elements break visual standards. |
| 5 | Error Prevention | 4 | Future dates are disabled appropriately. |
| 6 | Recognition Rather Than Recall | 4 | Mood legend at bottom aids recognition. |
| 7 | Flexibility and Efficiency | 3 | Solid navigation, but no swipe gestures between months. |
| 8 | Aesthetic and Minimalist Design | 1 | The severe vertical overlap creates visual chaos and clutter. |
| 9 | Error Recovery | 4 | N/A |
| 10 | Help and Documentation | 4 | Legend at the bottom acts as contextual help. |
| **Total** | | **33/40** | **Good** |

#### Anti-Patterns Verdict

**LLM assessment**: The calendar grid is suffering from a critical layout failure. The fixed aspect ratio on the day cells is too short to contain both the date number and the new mood badge below it. As a result, the emojis and `(+)` placeholders are spilling out of their containers and severely overlapping the dates on the next row. This breaks the grid illusion and feels broken rather than intentional.

**Deterministic scan**: The CLI detector found 0 issues.

#### Overall Impression
The calendar has a clean editorial foundation, but the addition of the mood badges broke the grid layout. Fixing the vertical constraints will immediately restore the premium feel.

#### What's Working
- **Typography & Color**: The Cormorant month header and the subtle sage accents match the brand's calm, editorial personality beautifully.
- **Mood Legend**: Placing the mood scale legend directly below the calendar is a smart way to teach the system without modal tutorials.

#### Priority Issues

- **[P0] Cell Height & Overflow**: The calendar cells use a strict `aspectRatio` (0.86 or 1.05) that isn't tall enough to fit both the text and the mood badge. The badges overflow and overlap the row below, and the green active background gets abruptly clipped.
  - **Fix**: Remove `aspectRatio` from `cellStyle` and allow the cells to size their height to their content, or adjust the ratio (e.g., `0.7`) so the cells are tall enough to comfortably house both elements.
  - **Suggested command**: `$impeccable layout src/screens/DailyNotesScreen/CalendarPicker.tsx`

- **[P1] Selected State Background Structure**: The active green background is applied to the entire cell container rather than just the date number. Because the cell is a rectangle containing both text and a badge, the highlight becomes a distorted squircle that looks accidental.
  - **Fix**: Move the `backgroundColor` to a dedicated `w-9 h-9 rounded-full` wrapper immediately surrounding the `Text` component, so the highlight remains a perfect circle around the date, leaving the mood badge outside of it.
  - **Suggested command**: `$impeccable polish src/screens/DailyNotesScreen/CalendarPicker.tsx`

- **[P2] Legend Clipping at Screen Bottom**: The mood legend at the very bottom of the screen is sliced in half by the edge of the viewport.
  - **Fix**: Increase the `paddingBottom` on the `ScrollView` `contentContainerStyle` or add a `SafeAreaView` spacer to ensure the legend fully clears the device's bottom edge or home indicator.
  - **Suggested command**: `$impeccable layout src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`

#### Persona Red Flags

**Riley (Deliberate Stress Tester)**: The layout break makes the UI feel fragile. If Riley sees that adding a mood badge breaks the calendar grid, they will lose trust in the app's overall quality and polish.

**Casey (Distracted Mobile User)**: With the `(+)` icons overlapping the date numbers of the next week, Casey is highly likely to mis-tap when trying to select a specific day.

#### Minor Observations
- The `(+)` dashed placeholders for empty days are quite prominent and add visual noise to the entire grid. Consider hiding them for past days, or making them much lighter (`opacity-40`) so logged moods stand out more.

#### Questions to Consider
- Does every past day without a log need a dashed `(+)` ring, or could they remain blank to let the logged days shine?
- Should the active date highlight encompass the mood badge, or just the date number?
