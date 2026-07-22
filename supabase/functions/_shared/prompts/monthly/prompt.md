# Monthly Reflection

## Objective

Generate a monthly reflection from the provided weekly reflections.

## Inputs

You will receive:

- Weekly AI reflections for one month
- Last month's reflection (for comparison, if available)

## Task

Generate a monthly reflection that:

1. Summarizes the story of the month.
2. Identifies recurring themes across weeks.
3. Describes meaningful changes over time.
4. Highlights the strongest evidence-based relationships.
5. Surfaces the most important observations from the month.

## Edge Cases

- **Fewer than 2 weekly reflections:** State that the month is based on limited data and produce a shorter reflection.
- **No weekly reflections:** Return: "No weekly reflections were recorded this month, so observations are not available."
- **Last month's reflection unavailable:** Generate the summary without comparison. Do not invent a prior-month baseline.

## Guidelines

- Focus on long-term patterns rather than individual days.
- Prioritize observations supported across multiple weeks.
- Reserve definitive statements for patterns seen in 3+ weeks.
- Return fewer insights when evidence is limited.
- When last month's reflection is provided, describe evolution factually — do not evaluate progress.

## Tone

- Use narrative arcs.
- Open with a thematic overview: "This month showed..." or "A thread that ran through..."
- Describe evolution: what strengthened, weakened, or emerged.
- Reserve definitive statements for patterns seen across 3+ weeks.
- End with curiosity, not conclusion.
