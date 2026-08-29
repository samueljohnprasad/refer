# Phase 0: Outline & Research

## Known Structure and Refactor Strategy

The `exercises` array inside `supabase/seed/sleep_reset_section_1.sql` contains nodes mapped by `node_source_id`.

### Unit 1: Sleep Mechanics
- `u1_1_sleep_mechanics-n1`: Already fixed (3 screens).
- `u1_1_sleep_mechanics-n2`: 6 screens.
  - **Decision:** Keep `concept_card`, `learn_cards`. Delete `fill_blank`, `course_choice`, `intuition_check`. Add `course_choice` back if necessary for interaction, but heavily prune.
  - **Rationale:** Eliminate "Quiz the explanation" anti-pattern.
- `u1_1_sleep_mechanics-n3`: 5 screens.
  - **Decision:** Keep `evening_comparison`, `annotated_diary`. Delete `same_but_different`, `private_check`, `intuition_check`.
  - **Rationale:** Remove redundant comparisons and forced personal application.
- `u1_1_sleep_mechanics-n4`: 5 screens.
  - **Decision:** Keep all (dialogue, paradox_card, white_bear_experiment, surge_timer, breathing_round).
  - **Rationale:** These interactions physically demonstrate arousal and reduce cognitive load. Compliant with "Interaction only when it improves learning."

### Unit 2: Sleep Disruptors
- `u1_2_sleep_disruptors-n1`: 5 screens.
  - **Decision:** Trim to `layer_zoom`, `story_walkthrough`, and one choice/reveal.
- `u1_2_sleep_disruptors-n2` (Caffeine): 5 screens.
  - **Decision:** Delete `if_then_plan` and consolidate.
- `u1_2_sleep_disruptors-n3` (Alcohol): 5 screens.
  - **Decision:** Delete `private_check` and `twin_case`.
- `u1_2_sleep_disruptors-n4` (Light/Stress): 7 screens.
  - **Decision:** Prune heavily. Remove `annotated_diary`, `what_if_machine`, `if_then_plan`. Keep `layer_zoom`, `evidence_bite`, `course_choice`.
- `u1_2_sleep_disruptors-n6_experiment`: 6 screens.
  - **Decision:** This is the concluding experiment. Retain the `if_then_plan` here, but ensure distractors are plausible and not shaming.

All modifications will be done by parsing the JSON array, mapping by `node_source_id`, filtering out specific `order_index` items, and shifting remaining `order_index` fields to be strictly sequential (0, 1, 2, ...).
