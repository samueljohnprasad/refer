const SHARED_MASTERY = {
  requiredEvidence: [
    "Two successful retrievals across different lessons",
    "One successful changed-context decision",
    "One workable private plan chosen without scoring disclosure",
  ],
  recovery: {
    isolatedError: "Explain the misconception and continue",
    repeatedError: "Restore a model or contrast before another scenario",
    checkpointMiss: "Revisit only the missed evening lever",
  },
};

export const SECTION_3_LEARNING_PLAN = {
  mastery: SHARED_MASTERY,
  safetyBoundary: {
    selfGuided:
      "Flexible wind-down, light reduction, environment audit, stimulus-control education, worry capture, optional reflection, and one-change evening experiments.",
    clinicianGuided:
      "Sleep-window restriction or compression based on sleep-diary data.",
  },
  concepts: {
    wind_down_window: {
      objective:
        "Build a flexible pre-sleep range with one repeatable transition cue.",
      prerequisites: ["circadian_rhythm", "stress_response_basics"],
      misconception:
        "A wind-down works only when it starts at one exact time and lasts ninety minutes.",
      masteryEvidence: [
        "Select a realistic range in changed schedules",
        "Create one cue-and-action plan",
      ],
      reviewLinks: ["l20", "l21", "l26"],
    },
    light_and_sleep: {
      objective: "Choose a practical reduction in evening light exposure.",
      prerequisites: ["circadian_rhythm", "wind_down_window"],
      misconception:
        "A warmer screen color makes any bright late-night screen use neutral.",
      masteryEvidence: [
        "Distinguish brightness reduction from spectrum change",
        "Apply the rule when late screen use is necessary",
      ],
      reviewLinks: ["l21", "l25", "l26"],
    },
    sleep_environment: {
      objective:
        "Identify one repeatable bedroom disturbance and test one accessible change.",
      prerequisites: ["light_and_sleep"],
      misconception:
        "One temperature or bedroom setup is correct for everyone.",
      masteryEvidence: [
        "Match varied disturbances with fitting responses",
        "Choose one feasible experiment without ranking personal disclosures",
      ],
      reviewLinks: ["l22", "l25", "l26"],
    },
    stimulus_control: {
      objective:
        "Use sleepiness and rising frustration as cues to protect the bed-sleep association.",
      prerequisites: ["sleep_pressure", "sleep_environment"],
      misconception:
        "Staying in bed and trying harder teaches the body to sleep.",
      masteryEvidence: [
        "Choose a safe quiet activity outside bed when frustration builds",
        "Return to bed when sleepy rather than after a rigid clock interval",
      ],
      reviewLinks: ["l23", "l24", "l26"],
    },
    sleep_window_clinician_guidance: {
      objective:
        "Recognize sleep-window compression as tailored treatment, not a self-help rule.",
      prerequisites: ["sleep_pressure", "stimulus_control"],
      misconception:
        "Anyone can safely cut time in bed using a generic formula.",
      masteryEvidence: [
        "Choose trained support over a generic self-prescription",
        "Recognize that health, safety, and life context can require adaptation",
      ],
      reviewLinks: ["l26"],
    },
    worry_dump: {
      objective:
        "Externalize unfinished thoughts before bed without solving each one.",
      prerequisites: ["stimulus_control"],
      misconception:
        "A worry dump must solve, organize, or permanently store every worry.",
      masteryEvidence: [
        "Order capture, close, and return to the evening",
        "Choose an earlier private capture instead of mental rehearsal in bed",
      ],
      reviewLinks: ["l24", "l26"],
    },
    pre_sleep_journaling: {
      objective:
        "Distinguish optional reflection from the core worry-capture tool.",
      prerequisites: ["worry_dump"],
      misconception: "Gratitude journaling is required or guarantees sleep.",
      masteryEvidence: [
        "Explain the difference between clearing and reflection",
        "Choose or decline the ritual without losing progress",
      ],
      reviewLinks: ["l25", "l26"],
    },
    evening_experiment: {
      objective:
        "Test one safe evening change and judge it from a pattern across several comparable nights.",
      prerequisites: ["sleep_environment", "light_and_sleep"],
      misconception:
        "One unusually good or bad night proves whether an evening change works.",
      masteryEvidence: [
        "Reject a one-night causal conclusion in a changed context",
        "Choose one low-risk experiment without scoring personal results",
      ],
      reviewLinks: ["l26", "l32"],
    },
  },
};
