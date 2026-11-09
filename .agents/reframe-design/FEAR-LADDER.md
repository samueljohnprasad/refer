# Fear Ladder: research and decisions

Exercise: graded exposure (CBT). Name a fear, build a ladder of smaller versions, rate each rung, predict the outcome, stay with the first rung, compare prediction with reality.
Brief self-authored. Design system: Happy (Nunito, sage on white, rim buttons), same tokens as `thought-reframing.html`.

## Mobbin research (iOS)

| Pattern | Seen in | Used for |
|---|---|---|
| Vertical roadmap, one current node, rest dimmed, dashed connector | Life Reset, Liven, Noom, Duolingo, Alan | The ladder route: rows joined by a line, hardest on top, "Start here" pill on the chosen rung |
| 0 to 10 slider with a big numeral and a reacting face | Liven, Apple Health, Noom, Gentler Streak | Peak fear and post-attempt rating. Reuses the cloud and sun from thought reframing (storm = scary) |
| Calm breathing ring before a task, with exit | Life Reset, Oura, TIDE, Alan, stoic | "Get ready" breathing circle, then the countdown ring while staying with the fear |
| Goal cards, custom option, recommended chips | Runna, Equinox+, Finch | "Suggested" pill on the rung nearest 3 of 10; example chips for starter rungs |
| Before / after two-up | Ahead, Opal, Bloom | Summary pair of weather icons, plus the anxiety shift scoreboard |
| Post-task check "better / same / worse" | Bloom | Honest outcome copy keyed to the rating change, not a forced win |

## Decisions

- Illustration: a ladder with a small cloud at its foot and the sun at the top. One rung lights per step added (same idea as the balance scale stones).
- Ladder order is computed from ratings, so the user adds steps in any order.
- No escape CTA during the hold. The timer ring and one button ("I stayed with it").
- Outcome copy never claims success. Higher anxiety than predicted gets "you stayed, repeat this rung".
- Prediction vs reality is the learning step (inhibitory learning), so it sits before and after the hold.
- Conversation layer (see `DIRECTION.md`): the cloud asks in bubbles, your fear and rung come back as your bubbles, starter rungs are quick replies. The ladder and the gauge keep the bubble without an avatar.

## Not verified

No render in this sandbox. Unchecked: ladder SVG geometry, ring dash length (r 95, circumference 597), breathing text swap, summary rung connectors, dark mode.
