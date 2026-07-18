# Thought Reframing Flow Redesign

## Goal

Make the complete Thought Reframing flow feel calm, editorial, and easy to process while preserving the full CBT sequence, existing response data, validation, navigation, and completion behavior.

## Approved References

- Intro timeline: Superdesign draft `d3e3bd16-9cad-44c3-b434-cb08e2e139ad`
- Automatic thought: Superdesign draft `64b907af-fbf2-49f7-8359-e7f35a83e3a7`
- Believability rating: Superdesign draft `57391969-a518-499e-bba2-a9b1bfca8717`
- Evidence for: Superdesign draft `a6ece704-1db5-4adf-87e7-99bb27807b72`
- Evidence against: Superdesign draft `5672a529-ec70-4d23-b09c-9139856756b9`
- Thought record summary: Superdesign draft `66af1be6-8f93-46d5-8081-bf36faf2e1b4`

## Shared Rules

- Preserve the shared close control, progress bar, scroll behavior, sticky primary action, and Back action.
- Do not render a second visible `Step X of Y` label inside content. The progress header is the only progress indicator.
- Use Cormorant for reflective screen titles and outcome thoughts. Use Geist for instructions, evidence, labels, and controls.
- Keep the current sage, white, dark-green ink, and quiet grey token system.
- Inputs and learner-authored content are primary. Examples and generated help stay collapsed until explicitly requested.
- Do not introduce card stacks, nested cards, gradients, blur overlays, assistant decoration, or AI labels.
- Preserve touch targets of at least 44 points and selected states that do not depend on color alone.

## Intro Timeline

- Preserve the panda mascot, `Thought Reframing` title, description, duration, and sticky Begin action.
- Preserve all five stages as a connected vertical timeline:
  1. Describe the triggering situation
  2. Catch your automatic thought
  3. Notice thought patterns
  4. Weigh the evidence for and against
  5. Create a balanced thought
- A stage contains only its numbered node and full label. Do not add a description paragraph under each stage.
- Keep node size, line alignment, and row height stable across one-line and wrapped labels.
- Use the existing `Begin` button label. Do not add secondary footer copy.

## Automatic Thought

- Keep the title `Automatic thought` and the existing shared progress header.
- Show the prior situation as an unframed left-rule context reference labelled `What happened`.
- Keep one concise teaching cue: the thought should remain raw because it will be tested next.
- The text input remains the largest and highest-priority object.
- `Need an example?` is closed by default. Opening it reveals no more than two flat example rows.
- Choosing an example fills the input and closes the disclosure. Manual typing does not remove the disclosure.
- Keep examples clearly framed as editable starting structures, not answers.

## Believability Rating

- Remove the content-level `Step 3 of 9` label.
- Keep the title `How believable does it feel?`.
- Show the automatic thought as an unframed context quote above the value.
- Show one large current value in the form `5/10`; avoid decorative meters and cards.
- Keep the slider and the three semantic anchors `Not true`, `Partly`, and `Completely`.
- Preserve the existing value range, response field, haptics, validation, and `Use this for now` action.
- Prevent the slider thumb, labels, and value from shifting layout as the value changes.

## Evidence Steps

### Shared Structure

- Evidence For and Evidence Against use the same layout and interaction structure.
- Render saved evidence as flat rows separated by hairlines. Do not wrap each item in a rounded container.
- Each saved row includes a quiet bullet, wrapping evidence text, and an icon-only remove control with an accessibility label.
- Keep the input as the primary object. Voice and add controls remain grouped with the input.
- Long evidence wraps without colliding with remove controls or the sticky footer.
- Examples are closed by default behind `Need an example?` and render as flat rows only when opened.
- Choosing an example adds or selects it through the existing update path and closes the disclosure where appropriate.
- Loading and generation failures remain hidden until optional help is requested.

### Evidence For

- Keep the title `Evidence for this thought`.
- Keep the subtitle `Add only what actually happened.`.
- Examples must demonstrate observable facts and must not validate assumptions or feelings as evidence.

### Evidence Against

- Keep a parallel title and use the prompt `What facts do not fit the prediction?`.
- Show the automatic thought as an unframed context reference so the learner knows what is being tested.
- Examples should demonstrate facts that weaken or complicate the prediction.

## Thought Record Summary

- Keep one continuous scroll surface rather than cards or accordions.
- Present sections in this order:
  1. Completion heading and short reflection
  2. Balanced thought outcome
  3. Save for a difficult moment action
  4. What happened
  5. First thought
  6. Emotions and noticed patterns
  7. Belief shift
  8. Evidence that supported the thought
  9. Evidence that challenged the thought
- Separate sections with whitespace and hairlines. Do not place page sections in cards.
- Use concise counts for evidence groups and selected emotions where useful.
- The first thought may use reflective italic typography, but must wrap fully without clipping.
- Keep the balanced thought as the strongest content after the completion heading.
- Keep Complete sticky above `Edit answers`, with enough scroll and bottom inset for every summary section to remain reachable.
- Preserve coping-card save behavior and completion behavior.

## Data And Behavior

- Preserve `ThoughtReframingResponse` and all existing field names.
- Preserve the current step order, validators, analytics labels, AI request contracts, and save payload.
- Do not add dependencies or change package-manager state.
- Keep generated examples and explanations optional; the exercise must remain fully usable when generation is loading, unavailable, or empty.
- Read-only mode renders saved content without editable or destructive controls.

## Accessibility

- Timeline stages remain readable in source order.
- Inputs retain descriptive labels and character limits.
- Slider exposes its current numeric value and semantic range.
- Remove controls identify the evidence item they remove.
- Disclosure controls expose expanded state.
- Sticky actions do not cover focused input content or the final summary rows.

## Verification

- Verify compact and standard iPhone widths.
- Verify empty, filled, long-text, read-only, loading, error, expanded-example, and keyboard-visible states.
- Verify the slider at 0, 5, and 10.
- Verify evidence add, remove, wrapping, example selection, and maximum-length behavior.
- Verify the summary with empty optional groups and with long content in every group.
- Run `git diff --check` and TypeScript validation, separating existing repository failures from touched-file regressions.
- Defer simulator or agent-device verification until explicitly requested.

