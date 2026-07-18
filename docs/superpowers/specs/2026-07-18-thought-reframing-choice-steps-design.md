# Thought Reframing Choice Steps Redesign

## Goal

Reduce scanning effort and visual competition in the emotion and thought-pattern steps while preserving the existing exercise shell, selection limits, validation, and CBT sequence.

Reference direction: Superdesign draft `a4fd0edd-668b-4130-abec-de9e3a168dd0`.

## Shared Rules

- Keep the existing close control, progress bar, scrolling body, sticky Continue button, and Back action.
- Keep Cormorant for the screen title and Geist for instructions, choices, and controls.
- Use sage only for selection, progress, and actionable disclosure states.
- Keep every choice target at least 44 points high.
- Use check icons plus tonal and border changes for selected states.
- Do not add gradients, shadows, nested cards, assistant decoration, or explanatory modals.

## Emotion Step

- Keep all ten emotions visible in a two-column grid so the learner can compare choices without opening another control.
- Replace full pill styling with restrained 48-point rounded fields using an 8-point radius.
- Unselected choices use a white surface, quiet border, emoji, and medium-weight label.
- Selected choices use the existing soft sage surface, stronger sage border, dark sage label, and trailing check.
- Add a compact `n/3 selected` count beside the instruction. It is status text, not a badge or interactive control.
- Keep the canonical emotion order. Hidden AI results must not reorder or mark choices.
- At three selections, unselected choices become disabled while selected choices remain removable.

## Thought-Pattern Step

- Remove the default AI suggestion card, AI chips, blur backdrop, and summary modal.
- Show up to four patterns initially, with selected patterns pinned into the visible set.
- Render patterns as a flat list with hairline dividers, not individual cards.
- Each row contains the existing emoji, pattern name, one concise description, and a trailing selection control.
- Selected rows use a subtle sage wash and filled check control. Unselected rows remain white.
- Keep `More patterns` as a quiet disclosure below the initial list. Expanded state shows the remaining patterns and changes the action to `Fewer patterns`.

## Optional Pattern Help

- AI assistance is completely absent from the default visual state.
- Show one text disclosure after the pattern list: `Need help spotting a pattern?`.
- Opening the disclosure reveals up to two possible matches as flat inline rows. Do not use the words `AI read`, `AI summary`, confidence scores, or an assistant icon.
- A possible match may be selected directly and has a separate `Why?` disclosure.
- `Why?` reveals one short user-addressed explanation directly under that match. Only one explanation is expanded at a time.
- Explanations must be concise, non-diagnostic, and grounded in the learner's automatic thought. No modal is used.
- Closing the help disclosure removes all suggestions and explanations from view without changing existing selections.

## State And Data

- Preserve the existing `selectedEmotions` and `selectedDistortions` response shapes.
- Preserve maximums of three emotions and two thought patterns.
- AI results may load in the background, but loading and error UI remain hidden until the learner opens optional help.
- If help is opened while results are loading, show one quiet inline loading row.
- If generation fails, show a short inline note and leave the manual pattern list fully usable.
- Selecting a suggested match updates `selectedDistortions` through the same toggle path as a manual selection.

## Accessibility

- Choice rows use checkbox semantics with selected and disabled states.
- Disclosure controls expose expanded state and descriptive accessibility labels.
- Help remains optional; no required information is available only through generated suggestions.
- Dynamic selection counts remain readable by screen readers.

## Verification

- Verify empty, partially selected, limit reached, expanded list, help loading, help error, suggested match, and expanded rationale states.
- Check compact and standard iPhone widths for wrapping, footer overlap, and scroll reachability.
- Confirm Continue remains disabled until the current validation requirement is met.
- Run `git diff --check` and the narrowest available TypeScript check for touched files.
