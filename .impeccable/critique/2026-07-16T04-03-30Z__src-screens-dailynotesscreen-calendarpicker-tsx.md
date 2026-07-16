---
target: CalendarPicker / mood calendar screen
total_score: 24
p0_count: 0
p1_count: 2
timestamp: 2026-07-16T04-03-30Z
slug: src-screens-dailynotesscreen-calendarpicker-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Today highlighted with circle, next-month button grays out correctly. No loading skeleton for mood data load. |
| 2 | Match System / Real World | 4 | Calendar metaphor is universal. Month/year in large type is clear. Arrow nav is natural. |
| 3 | User Control and Freedom | 2 | No way to jump to current month instantly; only arrow-by-arrow navigation. X dismiss is at top-left — low reachability. |
| 4 | Consistency and Standards | 3 | Day cells are consistent. Header alignment breaks convention: title centered but nav buttons bunched right, not split left/right. |
| 5 | Error Prevention | 3 | Future dates disabled. Mood badge size (16px) is critically small — accidental taps on adjacent cells very likely. |
| 6 | Recognition Rather Than Recall | 3 | Emoji communicate mood score without legend. A first-timer can't decode the scale 1–5 without prior knowledge. |
| 7 | Flexibility and Efficiency | 1 | No swipe-to-navigate months, no long-press to jump to a date, no "Today" button. Power users are tap-only. |
| 8 | Aesthetic and Minimalist Design | 2 | Month header is structurally lopsided (empty View spacer on the left). Cells at `size=16` are visually too dense. The "+" icon for empty days doesn't read as a tap affordance. |
| 9 | Error Recovery | 2 | If mood data fails to load, nothing tells the user — all cells simply show the "+" add state, indistinguishable from never-logged. |
| 10 | Help and Documentation | 1 | No legend for mood scale, no tooltip on the emoji, no indication what tapping a day does. |
| **Total** | | **24/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment**: This is not AI slop — the calendar is structurally clean, uses real brand tokens, and avoids every absolute ban (no gradient text, no ghost-card, no eyebrows). However, it has the subtler product-UI failure: it looks like a first draft that solved the data problem but never returned to solve the UX problem.

The density issues are the primary tell: 16px emoji cells sitting inside 40px touch targets that also contain the date number means the user's tap is aimed at a 16px target. The header layout is asymmetric but not intentionally so — an empty `<View />` spacer on the left holding nothing, the month title in the center drifting slightly right, the arrows clumped right. There's no "Today" affordance. The "+" icon in empty cells reads as "add" but doesn't feel inviting.

**Deterministic scan**: Exit code 0 — no pattern violations detected across `CalendarPicker.tsx`, `DailyNotesScreen.tsx`, and `MoodBadge.tsx`. Clean on all absolute bans. No false positives.

**Browser visualization**: Not available (native React Native, not a web surface). Skipped appropriately.

## Overall Impression

The calendar works and is technically clean. The single biggest opportunity is **touch ergonomics and empty-state clarity** — right now a user with un-logged days sees a wall of `+` icons with no sense of which day they're on or what tapping does, and the mood emoji are too small to confidently tap or read at a glance.

## What's Working

1. **Disabled-future-date handling** is done correctly and accessibly — `accessibilityState.disabled` is set, the icon grays with `opacity-30`, and the logic in `daysData` is memoized cleanly.
2. **Mood emoji as a data-visualization layer** is a strong product decision — five emoji at a glance gives a month's emotional pattern faster than a dot/heat-map. The concept is right even if the execution needs polish.
3. **Performance-conscious memoization** throughout — custom `React.memo` comparison in `DayCell`, `useMemo` for press handlers, `useCallback` in parent — this calendar will not cause unnecessary re-renders at scale.

## Priority Issues

### [P1] Tap target on mood emoji is 16px — fails mobile minimum
**What**: `MoodBadge` is rendered at `size={16}` inside `CalendarPicker`. The actual tappable image and icon are 16×16px.
**Why it matters**: Apple HIG and WCAG 2.5.5 both require 44×44pt minimum touch targets. A 16px target inside a ~40px cell that also contains a date number means frequent misfires, especially under fatigue or stress — exactly when this app's users are most likely to be logging.
**Fix**: The `MoodBadge` size prop should stay at 20–22px for calendar use. The `Pressable` in `DayCell` should cover the full cell; the mood interaction should be handled there, not inside a nested `PressableOpacity` inside the cell. Alternatively, decouple the badge rendering (image/icon only) from the press behaviour when used inside a cell.
**Suggested command**: `$impeccable polish`

### [P1] Month header is structurally lopsided — empty spacer, off-center title
**What**: In `CalendarPicker` lines 247–251, the header flex-row has `<View />` on the left (an empty spacer) and both arrows on the right. This makes the month title appear to drift right, and the navigation is bunched rather than split.
**Why it matters**: Users expect calendar navigation to mirror the direction of travel: back-arrow left, title center, forward-arrow right. The current layout makes the affordance less obvious and puts both arrows in the same corner.
**Fix**: Replace `<View />` with the back arrow, keep the title `flex-1 text-center`, put the forward arrow on the right. This is a 6-line change.
**Suggested command**: `$impeccable layout`

### [P2] No "Today" jump affordance
**What**: The only navigation is previous/next month via arrows. There is no way to return to the current month without tapping repeatedly.
**Why it matters**: If a user is browsing February to see old entries and wants to log today's mood, they must tap forward 4+ times. Under any emotional duress this creates friction at exactly the wrong moment.
**Fix**: Add a "Today" text button or a dot indicator on the month title when viewing a past month. Tapping it calls `goToDate(new Date())`. Costs 8 lines.
**Suggested command**: `$impeccable polish`

### [P2] Mood scale has no legend — first-timers cannot decode it
**What**: The 5 emoji (terrible → great) are rendered without any label or legend anywhere in the visible UI.
**Why it matters**: For a new user on day 1, seeing an orange sad emoji on a past date gives no information. The scale is learned through the mood-logging flow, but it's not visible on the calendar. A user who forgot what each emoji means gets no help.
**Fix**: Add a static 5-emoji micro-legend at the bottom of the calendar, one row, no tapping needed. Labels: "Terrible · Bad · Okay · Good · Great" at `text-[10px]` with `color=ink-muted`. Or surface it as a tooltip on long-press of any emoji.
**Suggested command**: `$impeccable clarify`

### [P3] Dismissed-state "+" icon doesn't read as inviting on future-disabled cells
**What**: Future dates render the `+` icon at 30% opacity (disabled). But current-month, never-logged past dates also show a small grey `+` at full opacity — this reads as "no entry here" not "tap to add."
**Why it matters**: The `+` is an action affordance. It's small (16px), grey (`#64748B`), and framed inside a 40px transparent cell with no background. It doesn't trigger the "I can tap that" pattern.
**Fix**: For past, never-logged days: replace the bare `+` with a subtle dotted circle at 24px, colour `SAGE[200]`, which communicates "empty slot, taggable" more explicitly. The `+` within the dotted ring remains at 14px. This is a `MoodBadge` variant: `variant="empty-past"`.
**Suggested command**: `$impeccable delight`

## Persona Red Flags

**Jordan (First-Timer)**: Lands on the calendar after logging their first mood. Sees a grid of smiley faces for the past two weeks, and grey `+` icons everywhere else. Doesn't know whether to tap a date, doesn't know what the emoji mean, doesn't know if the calendar is read-only or interactive. Zero contextual guidance. Will not discover that tapping a past date opens its entry.

**Casey (Distracted Mobile User, one-handed)**: Tries to navigate back to last month to check a date. Taps the left arrow — it's in the top-right corner of the component. With the phone in their right hand, that's a stretch from the bottom of the screen to the top-right. Tapping the 16px mood emoji requires pinpoint precision. No "Today" button means recovering current-month requires multiple taps. High abandonment likelihood for the navigation flow.

**Sam (Accessibility-Dependent)**: The `WeekDayHeader` has `accessibilityElementsHidden={true}` — correct. But `MoodBadge` has an `accessibilityLabel` that concatenates the mood score number (e.g. `"Mood is 2."`) without the human-readable name. A screen reader user hears "Mood is 2" rather than "Mood is Bad." Should map score to label.

## Minor Observations

- `containerStyle` prop on `MoodBadge` is accepted but never passed anywhere in `CalendarPicker` — dead API surface, remove or use.
- `GlassView` from `expo-glass-effect` is imported in `JournalCalendarScreen.tsx` but not rendered — dead import.
- The `aspectRatio` calculation (0.86 or 1.05) for 5-row vs 4-row months is smart but undocumented. Add a one-line comment.
- `textColorVariant` in `DayCell` returns `"muted"` for in-month, non-today days. This means every regular day is `ink-muted`, not `ink`. The design treats today as the only "active" day — past days are all muted. This is probably intentional, but it means only today gets full-contrast date text.

## Questions to Consider

- "What does tapping a date cell do? Does it navigate to that day's journal entry, or does it open a mood-log flow, or both? The tap affordance currently signals nothing."
- "Could the calendar benefit from a week-strip view at the top of the journal screen that expands to full-month only on demand? This would solve the touch-target density problem structurally rather than cosmetically."
- "The mood emoji are a 5-point scale rendered as images. Is there a world where this surface becomes a heat-map strip instead — colour saturation instead of emoji — giving a denser, faster-to-read month view?"
