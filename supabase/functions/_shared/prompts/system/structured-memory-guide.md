# Structured Memory Field Guide

For each reflection, populate the `structured_memory` object with evidence-based observations.

## themes

Recurring discussion topics across the reflection period.

- **Daily:** Draw from journal summaries and habit names.
- **Weekly:** Draw from themes that appeared on 3+ days.
- **Monthly:** Draw from themes that persisted or evolved across weeks.

Example: `["work", "family", "sleep"]`

## emotions

Emotions explicitly expressed by the user. Do not infer emotions from behavior alone.

- Only include emotions the user actually named or clearly described.
- Return empty array if no explicit emotional language is present.

Example: `["frustrated", "relieved", "anxious"]`

## routines

Recurring behaviors or habits mentioned.

- Include both positive routines (walking, journaling) and neutral ones (commuting, cooking).
- Do not assume routines occurred on days they were not logged.

Example: `["morning walk", "evening journaling"]`

## challenges

Situations or difficulties the user described.

- Include only challenges the user explicitly mentioned.
- Do not label neutral events as challenges.

Example: `["tight deadline", "difficult conversation"]`

## positive_experiences

Moments the user described as positive or rewarding.

- Include small wins and everyday joys, not only major achievements.
- Return empty array if the user did not mention anything positive.

Example: `["finished a book", "good conversation with friend"]`

## life_events

Important events that may influence future reflections.

- Include only significant, discrete events (starting a job, moving, illness, travel).
- Do not include routine activities here.
- Return empty array if no notable events occurred.

Example: `["started new job", "traveled to visit family"]`

## Rules for all fields

- Return an empty array when evidence is absent.
- Never fabricate items to fill fields.
- Prefer fewer, accurate items over many speculative ones.
