const SHARED_MASTERY_REQUIREMENTS = {
  requiredEvidence: [
    "Two successful retrievals on separate attempts",
    "One delayed retrieval",
    "One successful changed-context transfer",
  ],
  recovery: {
    isolatedError: "Explain the misconception and continue with support available",
    repeatedError: "Restore one scaffold level and schedule review in the next lesson",
    checkpointMiss: "Assign targeted concept review before checkpoint retry",
  },
};

export const UNIT_1_LEARNING_PLAN = {
  mastery: SHARED_MASTERY_REQUIREMENTS,
  concepts: {
    protective_alarm: {
      objective: "Distinguish an alarm signal from proof of danger.",
      prerequisites: [],
      misconception: "Strong anxiety proves that something bad is happening.",
      masteryEvidence: [
        "Classify varied alarm-versus-danger cases",
        "Reconstruct why alarm activation does not confirm an outcome",
      ],
      reviewLinks: [
        { gap: "short", target: "Unit 1.1 · How the Body Prepares" },
        { gap: "unit", target: "Unit 1.1 · Alarm-System Checkpoint" },
        { gap: "next-unit", target: "Unit 1.2 · The Meaning Added" },
        { gap: "section", target: "Section 1 Checkpoint · Explain the Pattern" },
      ],
    },
    body_alarm: {
      objective: "Explain common body changes as short-term preparation.",
      prerequisites: ["protective_alarm"],
      misconception: "An uncomfortable body sensation predicts what will happen next.",
      masteryEvidence: [
        "Identify the function of body changes in varied situations",
        "Separate body preparation from evidence about the outcome",
      ],
      reviewLinks: [
        { gap: "short", target: "Unit 1.1 · How Urges Protect" },
        { gap: "unit", target: "Unit 1.1 · Alarm-System Checkpoint" },
        { gap: "next-unit", target: "Unit 1.2 · The Body Feedback Loop" },
        { gap: "section", target: "Section 1 Checkpoint · Explain the Pattern" },
      ],
    },
    threat_prediction: {
      objective: "Separate an event from the threat meaning added to it.",
      prerequisites: ["protective_alarm", "body_alarm"],
      misconception: "A vivid or repeated prediction is a fact.",
      masteryEvidence: [
        "Mark event and prediction separately",
        "Apply the distinction to an unfamiliar uncertain situation",
      ],
      reviewLinks: [
        { gap: "short", target: "Unit 1.1 · How Urges Protect" },
        { gap: "unit", target: "Unit 1.1 · Alarm-System Checkpoint" },
        { gap: "next-unit", target: "Unit 1.2 · The Meaning Added" },
        { gap: "section", target: "Section 1 Checkpoint · Explain the Pattern" },
      ],
    },
    protective_urges: {
      objective: "Identify the protective function of fight, flight, freeze, and safety seeking.",
      prerequisites: ["threat_prediction"],
      misconception: "A protective urge is a command or proof that the situation is unsafe.",
      masteryEvidence: [
        "Match varied urges to their protective function",
        "Name an urge in a changed situation without treating it as a command",
      ],
      reviewLinks: [
        { gap: "short", target: "Unit 1.1 · Fear and Anxiety" },
        { gap: "unit", target: "Unit 1.1 · Alarm-System Checkpoint" },
        { gap: "next-unit", target: "Unit 1.2 · The Action Urge" },
        { gap: "section", target: "Section 1 Checkpoint · Explain the Pattern" },
      ],
    },
    fear_and_anxiety: {
      objective: "Distinguish a present threat from anticipation of a possible future threat.",
      prerequisites: ["protective_alarm", "body_alarm"],
      misconception: "Fear and anxiety are different only because one feels stronger.",
      masteryEvidence: [
        "Classify fear and anxiety across changed situations",
        "Explain the distinction using when the threat is located",
      ],
      reviewLinks: [
        { gap: "short", target: "Unit 1.1 · Alarm-System Checkpoint" },
        { gap: "next-unit", target: "Unit 1.3 · Normal Anxiety and Persistent Difficulty" },
        { gap: "section", target: "Section 1 Checkpoint · Explain the Pattern" },
      ],
    },
    intensity_not_probability: {
      objective: "Judge danger from current evidence rather than anxiety intensity alone.",
      prerequisites: ["protective_alarm", "body_alarm", "threat_prediction"],
      misconception: "Anxiety rated eight out of ten means danger is eight out of ten.",
      masteryEvidence: [
        "Rate alarm intensity and danger evidence separately",
        "Apply both measures to an unfamiliar situation",
      ],
      reviewLinks: [
        { gap: "short", target: "Unit 1.1 · Alarm-System Checkpoint" },
        { gap: "next-unit", target: "Unit 1.2 · The Body Feedback Loop" },
        { gap: "section", target: "Unit 1.3 · Real Danger Comes First" },
        { gap: "section-checkpoint", target: "Section 1 Checkpoint · Explain the Pattern" },
      ],
    },
  },
};
