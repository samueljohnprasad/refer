import type { Exercise } from "@/src/types/journeyV5";

export const draftMicrolearningFixtures: readonly Exercise[] = [
  {
    id: "fixture-common-trap-v2",
    nodeId: "fixture-draft-node",
    orderIndex: 0,
    type: "common_trap",
    isScored: false,
    content: {
      title: "Recognizing Common Traps",
      instruction: "See why the trap feels helpful — then learn the counter move.",
      trapTitle: "The Perfection Trap",
      trapBody: "If it isn’t perfect, it feels like failure.",
      shortTermPayoff: "High standards can feel protective.",
      hiddenCost: [
        "More checking.",
        "More pressure.",
        "Small details start to feel high-stakes."
      ],
      counterMove: {
        title: "Try This Instead",
        body: [
          "Set a time limit.",
          "When it ends, stop — even if it isn’t perfect."
        ]
      }
    }
  },
  {
    id: "fixture-curiosity-bet",
    nodeId: "fixture-draft-node",
    orderIndex: 1,
    type: "curiosity_bet",
    isScored: false,
    content: {
      title: "Place Your Bet",
      instruction: "Guess the outcome.",
      question: "How many people experience insomnia at some point?",
      options: [
        { id: "bet-10", label: "10%" },
        { id: "bet-30", label: "30%" },
        { id: "bet-50", label: "50%" }
      ],
      answer: "Studies show that about 30% of adults experience insomnia symptoms.",
      bestAnswerIndex: 1
    }
  },
  {
    id: "fixture-explorable-model",
    nodeId: "fixture-draft-node",
    orderIndex: 2,
    type: "explorable_model",
    isScored: false,
    content: {
      title: "Help Maya’s alarm settle",
      instruction: "Test one lever, then notice the bedtime change.",
      setup: "Maya carries a demanding workday into bedtime, where her alarm is still trying to protect her.",
      model: "maya_alarm",
      chartAccessibilityLabel: "Line chart of Maya’s alarm level from 7am to 1am",
      initialValues: {
        stress: 80,
        relaxation: 20
      }
    }
  },
  {
    id: "fixture-guess-reveal",
    nodeId: "fixture-draft-node",
    orderIndex: 3,
    type: "guess_reveal",
    isScored: false,
    content: {
      title: "Guess the Stat",
      instruction: "Make your best guess.",
      prompt: "Out of 10 people, how many will experience a panic attack?",
      actual: 3
    }
  },
  {
    id: "fixture-faded-thought-record",
    nodeId: "fixture-draft-node",
    orderIndex: 4,
    type: "faded_thought_record",
    isScored: false,
    content: {
      title: "Build a balanced record",
      instruction: "Choose one field at a time.",
      fields: [
        { id: "record-situation", label: "Situation" },
        { id: "record-hot-thought", label: "Hot thought" },
        { id: "record-evidence", label: "Evidence" },
        { id: "record-balanced-thought", label: "Balanced thought" }
      ],
      examples: [
        {
          id: "record-worked-example",
          label: "Watch one field",
          context: "A manager asks Jordan to revisit one slide.",
          prefills: [
            { fieldId: "record-situation", value: "A manager asks to revisit one slide." },
            { fieldId: "record-hot-thought", value: "I ruined the whole presentation." },
            { fieldId: "record-evidence", value: "Only one slide needs changes." }
          ],
          tasks: [
            {
              fieldId: "record-balanced-thought",
              prompt: "Which balanced thought fits this record?",
              clue: "Keep the concern and evidence together.",
              options: [
                {
                  id: "record-worked-supported",
                  label: "One slide needs work, not everything",
                  isSupported: true,
                  feedback: "That keeps the concern in proportion to the evidence."
                },
                {
                  id: "record-worked-unsupported",
                  label: "I will get fired",
                  isSupported: false,
                  feedback: "This is a catastrophic leap."
                }
              ]
            }
          ]
        }
      ]
    }
  }
];
