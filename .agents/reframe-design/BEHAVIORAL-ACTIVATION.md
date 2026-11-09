# Behavioral Activation: research and decisions

Module: CBT Core (PRD `docs/prd-cbt-exercises-v2.md`, P1). Self-authored brief. Happy tokens, same shell as `thought-reframing.html`.

## Mobbin research (iOS)

| Pattern | Seen in | Used for |
|---|---|---|
| Icon cards, 2-up, selected state inverted | Strava, Ten Percent Happier, Slopes | Activity picker with pictograms |
| Day strip plus time-of-day groups | Fresha, Preply, Future Pro, Outlook | Day pills (M to S) and Morning / Afternoon / Evening per activity |
| Week of seven dots, done ones filled | Noom, Finch, Duolingo, pushr, Numo | Summary week strip: planned activity per day, the one done today checked |
| 0 to 10 slider with a reacting face | Liven, Apple Health, Noom | Mood before and after. Reuses the cloud/sun, inverted (low mood = heavy sky) |
| Before / after two-up | Ahead, Opal | Summary mood pair |

## Flow (9 counted steps)

Mood, pick 3 activities, shrink (10/20/30 min), place in week, choose one to do now, predict pleasure and mastery, do it, rate actual, mood after, summary.

## Decisions

- Predict then rate: the core learning is that low mood underestimates enjoyment. Summary compares expected with got and says so only when true.
- Pleasure and mastery are the two standard BA ratings; tags on each card show which a pick leans toward.
- Small by default (10 min). No streak pressure, no failure state.
- No custom activity input yet (YAGNI). Add a composer like the Fear Ladder rungs if wanted.
- Conversation layer (see `DIRECTION.md`): the cloud asks in bubbles, the chosen activity comes back as your bubble, the "do it" screen is the cloud saying it will wait.

## Not verified

No render in this sandbox. Unchecked: 7-pill day row width at 390px, icon geometry, tray, summary week strip, dark mode.
