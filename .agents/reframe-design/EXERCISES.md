# Exercises tab: clone of the app, plus the cloud

`exercises.html` mirrors the real tab (`src/screens/ExercisesScreen`, `app/tabs/(tabs)/exercises`) feature for feature, in the Happy tokens and the conversation layer from `DIRECTION.md`.

## Feature map (real app, then prototype)

| Real app | Prototype |
|---|---|
| Header: title, completed-count pill, coping-cards bookmark | Same. Count is the number of completed log entries. Bookmark opens a sheet of saved balanced thoughts |
| Segmented control: Lessons / My Log / Practice (Practice is a pushed screen) | Same three, as one tablist with arrow keys. `#log`, `#practice` open a view directly |
| Lessons: Jump Back In carousel, 2 snap cards (icon, duration, title, subtitle, +XP) | Same. Paused Fear Ladder first, then Thought Reframing; paused card shows "Paused at rung 2 of 5" |
| Lessons: four categories, rows with icon, title, duration • +XP, PRO badge.  Jump Back In items hidden from the list unless that empties it | Same 15 exercises as shelf tiles (13 registry exercises plus Fear Ladder and Behavioral Activation, tagged New). PRO row opens a Pro sheet |
| My Log: day-grouped timeline, cards with title, category pill, quoted preview, before to after shift, timestamp. Expands to emotions bars, distortion tags, gratitude entries, reframe, "Open entry". Resume on unfinished. Empty state "A space for your thoughts" | Same, accessible accordion buttons. `?empty` shows the empty state |
| Practice: time range 7d / 30d / All, pattern, AI narrative, nudge, mood trends, deep dives per category. Under three exercises: baseline "Notice what changes", 1 2 3 marks, "Choose an exercise" | Same. Baseline marks fill with completed count. The AI narrative is the cloud's bubble and carries the not-a-clinical-assessment line |
| Five bottom tabs: Home, Journal, Timeline, Journeys, Exercises | Same five, Exercises current |
| Pro gating, `requirePro` | Pro sheet, with "Preview this exercise" so the prototype flows stay reachable |

## Added on top of the app

- **Need to talk to someone**: header icon on every view, plus a quiet link at the foot of every view. Opens a sheet: call or text 988, text HOME to 741741, 911. US numbers, stated in the sheet. The real app has none of this today, so it needs a real regional source and copy review.
- **The cloud's question** at the top of Lessons: four feeling-words route to Thought Reframing, ABC Analysis, Fear Ladder, Behavioral Activation, plus "I am not sure, you choose". Tap: buzz, nod, your reply lands, "Try this one." and a pick card.
- **Length filter** (Any, 10 min or less, Not tried yet).
- Focus moves to Start after a pick, the chat region is `aria-live`, sheets trap focus and close on Escape.

## Mobbin research (iOS)

| Pattern | Seen in | Used for |
|---|---|---|
| A character asks one question on the hub | Wysa, Liven, Tolan | The lead cloud and first bubble |
| "What's on your mind" as stacked single-choice answers | Headspace, stoic, Bloom, pillowtalk | The feeling replies |
| Recommendation above the full catalogue | Me+ "For you" then "All", Headspace Explore | The pick card, then Jump Back In and categories |
| Resume inline | Headspace "Continue", Bloom | Jump Back In, Resume in the log |
| Day-grouped history with expandable entries | Finch, Daylio, How We Feel | My Log |

## Decisions

- Same structure as the app, different look. Categories are horizontal shelves of illustrated tiles, not rows: a column of identical icon, title, subtitle and chevron reads as Settings. Each tile shows the weather the exercise is for (raining cloud for heavy thoughts, sun for calm), so tiles differ at a glance. Cards stay only for pressable objects: the pick, Jump Back In, tiles.
- XP stays because the real app shows it. Not a streak and nothing is locked by it.
- The weather marks carry each exercise. The category icon is gone from rows; the category is the shelf heading plus one line of what it is for.
- Five bottom tabs follow the app, not the skill's 2 to 4 rule. The app decides.
- Only the four prototype flows link out. Other rows are inert placeholders, deep-dive rows and Home, Journal, Timeline, Journeys tabs too.
- Practice and log data are hard-coded demo values.

## Not verified

No render in this sandbox. JS passes `node --check` and a stubbed-DOM run in both default and `?empty` states. Light only, like the app. Unchecked: tile widths and shelf scroll at 390 px; header height with title, count, two icons and the segmented control at 390 px; Jump Back In card widths and snap; chat plus carousel plus fifteen rows scroll length; log timeline stem and dots; mood chart legibility; sheet animation.
