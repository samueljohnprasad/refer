---
target: src/components/charts/EmotionRadarChart.tsx
total_score: 39
p0_count: 0
p1_count: 0
timestamp: 2026-07-15T08-39-09Z
slug: omponents-charts-emotionradarchart-tsx
---
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Clear that there's no data |
| 2 | Match System / Real World | 4 | Used refined typography instead of cheap emojis |
| 3 | User Control and Freedom | 4 | N/A |
| 4 | Consistency and Standards | 4 | Empty states are now consistently quiet and inline |
| 5 | Error Prevention | 4 | N/A |
| 6 | Recognition Rather Than Recall | 4 | Explains how to get data |
| 7 | Flexibility and Efficiency | 4 | N/A |
| 8 | Aesthetic and Minimalist Design | 4 | Removed ghost cards and oversized emojis |
| 9 | Error Recovery | 4 | N/A |
| 10 | Help and Documentation | 4 | Explains what to do |
| **Total** | | **39/40** | **[Excellent]** |

#### Fixes Applied
- **Removed giant emojis**: Stripped the massive `📊` and activity icons from all three chart empty states (Emotion Radar, Volatility Index, Life Domain Wheel).
- **Distilled the ghost cards**: The empty states are no longer wrapped in heavy bordered cards that draw attention to the lack of content. They are now subtle, inline text prompts using `caption-muted`.

The empty states now feel refined and out of the way, fitting a premium app aesthetic.
