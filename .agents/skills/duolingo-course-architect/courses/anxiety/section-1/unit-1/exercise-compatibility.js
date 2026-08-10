export const EXERCISE_COMPATIBILITY = {
  inventoryCount: 58,
  selectedForUnit: [
    "intuition_check",
    "concept_card",
    "twin_case",
    "course_choice",
    "story_walkthrough",
    "layer_zoom",
    "surge_diagram",
    "lever_scenario",
    "lens_replay",
    "dialogue",
    "guided_discovery_trail",
    "invent_first",
    "what_if_machine",
    "learn_cards",
    "guided_recall_chips",
    "lever_match",
    "toolkit_shelf",
    "private_check",
    "recall_warmup",
    "same_but_different",
    "fill_blank",
    "curiosity_bet",
    "common_trap",
    "annotated_diary",
    "association_meter",
    "story_serial",
    "teach_back_chain",
    "course_checkpoint",
  ],
  laterCourseFit: {
    noticingAndNaming: [
      "guess_reveal",
      "name_it",
      "one_line_reveal",
    ],
    worryAndAttention: [
      "white_bear_experiment",
      "paradox_card",
    ],
    panicLearning: [
      "panic_wave_commit",
      "wave_sequence",
      "wave_ordering",
      "wave_scrubber",
      "evidence_bite",
      "surge_timer",
      "why_it_matters",
      "breathing_round",
      "wave_faq",
    ],
    behaviorAndAvoidance: [
      "two_dial_sandbox",
      "evening_comparison",
      "lever_check",
      "socratic_dialogue",
    ],
    thoughtSkillsAndPlanning: [
      "worked_rewrite",
      "faded_thought_record",
      "reframe_builder",
      "situation_language",
      "if_then_plan",
      "section_milestone",
    ],
  },
  incompatibleWithoutEngineChanges: [
    {
      category: "explorable_model",
      reason:
        "The current engine hardcodes Maya, sleep load, walks, replay, and coffee.",
    },
    {
      category: "symptom_decoder",
      reason:
        "The current engine claims the choice changes lesson order; this unit does not implement that adaptation.",
    },
  ],
  legacyNotSelected: ["recall", "scenario", "discrimination"],
};

export const UNIT_1_CATEGORY_PLACEMENT = [
  {
    lesson: 1,
    categories: [
      "intuition_check",
      "concept_card",
      "twin_case",
      "course_choice",
    ],
  },
  {
    lesson: 2,
    categories: [
      "story_walkthrough",
      "layer_zoom",
      "surge_diagram",
      "lever_scenario",
    ],
  },
  {
    lesson: 3,
    categories: [
      "lens_replay",
      "dialogue",
      "guided_discovery_trail",
      "invent_first",
      "what_if_machine",
    ],
  },
  {
    lesson: 4,
    categories: [
      "learn_cards",
      "guided_recall_chips",
      "lever_match",
      "toolkit_shelf",
      "private_check",
      "lever_scenario",
    ],
  },
  {
    lesson: 5,
    categories: [
      "recall_warmup",
      "same_but_different",
      "lever_scenario",
      "fill_blank",
    ],
  },
  {
    lesson: 6,
    categories: [
      "curiosity_bet",
      "common_trap",
      "annotated_diary",
      "twin_case",
      "association_meter",
    ],
  },
  {
    lesson: 7,
    categories: [
      "recall_warmup",
      "teach_back_chain",
      "story_serial",
      "course_checkpoint",
    ],
  },
];
