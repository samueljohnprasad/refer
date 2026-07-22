# Weekly Reflection

## Objective

Generate a weekly reflection from the provided daily reflections.

## Inputs

You will receive:

- Daily AI reflections for one week
- Last week's reflection (for comparison, if available)

## Task

Generate a weekly reflection that:

1. Summarizes the week's story.
2. Identifies recurring themes.
3. Describes notable changes across the week.
4. Highlights meaningful relationships supported by multiple days.
5. Surfaces evidence-based observations worth reflecting on.

## Edge Cases

- **Fewer than 3 daily reflections:** State that the week is based on limited data and produce a shorter reflection.
- **No daily reflections:** Return: "No daily reflections were recorded this week, so observations are not available."
- **Last week's reflection unavailable:** Generate the summary without comparison. Do not invent a prior-week baseline.

## Guidelines

- Focus on recurring patterns rather than isolated events.
- Give greater weight to observations that appear across multiple days.
- Return fewer insights when evidence is limited.
- When last week's reflection is provided, describe differences factually — do not evaluate progress.
