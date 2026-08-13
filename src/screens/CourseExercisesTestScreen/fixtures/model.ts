import type { Exercise } from "@/src/types/journeyV5";

export const modelMicrolearningFixtures: readonly Exercise[] = [
  {
    id: "fixture-explorable-model",
    nodeId: "fixture-explorable-model-node",
    orderIndex: 0,
    type: "explorable_model",
    isScored: false,
    content: {
      title: "Help Maya’s alarm settle",
      instruction: "Test one lever, then notice the bedtime change.",
      setup: "Maya carries a demanding workday into bedtime, where her alarm is still trying to protect her.",
      model: "maya_alarm",
      chartAccessibilityLabel: "Line chart of Maya’s alarm level from 7am to 1am",
      initialValues: {
        load: 75,
        walk: false,
        replay: true,
        coffee: false,
      },
      stages: [
        {
          id: "maya-load",
          prompt: "Bring Maya’s daytime load down.",
          summaryLabel: "Day load",
          control: {
            type: "slider",
            input: "load",
            label: "Daytime load",
            accessibilityLabel: "Maya’s daytime demand load",
            min: 20,
            max: 90,
            step: 5,
          },
        },
        {
          id: "maya-walk",
          prompt: "Add a genuine lunch break.",
          summaryLabel: "Lunch walk",
          control: {
            type: "toggle",
            input: "walk",
            label: "20-minute lunch walk",
            accessibilityLabel: "Maya takes a 20-minute lunch walk",
            onLabel: "Walk on",
            offLabel: "Walk off",
          },
        },
        {
          id: "maya-replay",
          prompt: "Turn off the late-night replay.",
          summaryLabel: "Evening replay",
          control: {
            type: "toggle",
            input: "replay",
            label: "10pm replay",
            accessibilityLabel: "Maya replays the day at 10pm",
            onLabel: "Replay on",
            offLabel: "Replay off",
          },
        },
      ],
      sandboxPrompt: "Try the learned levers together.",
    },
  },
  {
    id: "fixture-faded-thought-record",
    nodeId: "fixture-faded-thought-record-node",
    orderIndex: 1,
    type: "faded_thought_record",
    isScored: false,
    content: {
      title: "Build a balanced record",
      instruction: "Choose one field at a time.",
      fields: [
        { id: "record-situation", label: "Situation" },
        { id: "record-hot-thought", label: "Hot thought" },
        { id: "record-evidence", label: "Evidence" },
        { id: "record-balanced-thought", label: "Balanced thought" },
      ],
      examples: [
        {
          id: "record-worked-example",
          label: "Watch one field",
          context: "A manager asks Jordan to revisit one slide.",
          prefills: [
            { fieldId: "record-situation", value: "A manager asks to revisit one slide." },
            { fieldId: "record-hot-thought", value: "I ruined the whole presentation." },
            { fieldId: "record-evidence", value: "Only one slide needs changes." },
          ],
          tasks: [{
            fieldId: "record-balanced-thought",
            prompt: "Which balanced thought fits this record?",
            clue: "Keep the concern and evidence together.",
            options: [
              {
                id: "record-worked-supported",
                label: "One slide needs work, not everything",
                isSupported: true,
                feedback: "That keeps the concern in proportion to the evidence.",
              },
              {
                id: "record-worked-dismiss",
                label: "Nothing went wrong at all",
                isSupported: false,
                feedback: "That dismisses the concern instead of balancing it.",
              },
            ],
          }],
          activeFieldOrder: ["record-balanced-thought"],
        },
        {
          id: "record-faded-example",
          label: "Now two fields",
          context: "A friend cancels dinner because they feel unwell.",
          prefills: [
            { fieldId: "record-situation", value: "A friend cancels dinner at short notice." },
            { fieldId: "record-hot-thought", value: "They are tired of spending time with me." },
          ],
          tasks: [
            {
              fieldId: "record-evidence",
              prompt: "What evidence belongs in this record?",
              clue: "Stay with what the message actually confirms.",
              options: [
                {
                  id: "record-evidence-supported",
                  label: "They said they feel unwell",
                  isSupported: true,
                  feedback: "That records the available evidence without guessing beyond it.",
                },
                {
                  id: "record-evidence-guess",
                  label: "They chose someone else instead",
                  isSupported: false,
                  feedback: "That is one possible story, not confirmed evidence.",
                },
              ],
            },
            {
              fieldId: "record-balanced-thought",
              prompt: "Which thought holds both facts and feelings?",
              clue: "Make room for disappointment without deciding their intent.",
              options: [
                {
                  id: "record-balanced-supported",
                  label: "I feel disappointed, and their reason may be genuine",
                  isSupported: true,
                  feedback: "That respects the feeling while leaving their intent open.",
                },
                {
                  id: "record-balanced-certain",
                  label: "They definitely never want to see me",
                  isSupported: false,
                  feedback: "That turns uncertainty into a painful certainty.",
                },
              ],
            },
          ],
          activeFieldOrder: ["record-evidence", "record-balanced-thought"],
        },
      ],
      completionInsight: "A balanced record separates events, predictions, and available evidence.",
    },
  },
  {
    id: "fixture-worked-rewrite",
    nodeId: "fixture-worked-rewrite-node",
    orderIndex: 2,
    type: "worked_rewrite",
    isScored: false,
    content: {
      title: "Rewrite a mind-reading thought",
      instruction: "Change one phrase at a time.",
      original: "They did not reply, so they must be upset with me.",
      moves: [
        {
          id: "rewrite-separate-fact",
          stepLabel: "Separate the fact",
          result: "They did not reply, and I do not know why.",
          changedPhrase: "I do not know why",
          rationale: "This replaces certainty with what is actually known.",
        },
        {
          id: "rewrite-name-feeling",
          stepLabel: "Name the feeling",
          result: "They did not reply; I feel worried, and I do not know why.",
          changedPhrase: "I feel worried",
          rationale: "Naming the feeling keeps it from becoming evidence.",
        },
        {
          id: "rewrite-open-alternative",
          stepLabel: "Leave room",
          result: "They did not reply; I feel worried, and there may be many reasons.",
          changedPhrase: "there may be many reasons",
          rationale: "A balanced thought makes room for uncertainty without dismissing concern.",
        },
      ],
      recognition: {
        prompt: "Which phrase keeps the rewrite balanced?",
        options: [
          {
            id: "rewrite-recognize-open",
            label: "There may be many reasons",
            isSupported: true,
            feedback: "This leaves room for uncertainty without forcing reassurance.",
          },
          {
            id: "rewrite-recognize-certain",
            label: "They are definitely upset",
            isSupported: false,
            feedback: "That turns an unknown into certainty again.",
          },
        ],
      },
    },
  },
];
