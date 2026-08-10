import { defineLesson, exercise } from "../exercise.js";

export const theNinetyMinuteSwitch = defineLesson({
  sourceId: "u3_1_wind_down-n1",
  title: "The 90-Minute Switch",
  objective:
    "Build a flexible wind-down range with one repeatable transition cue.",
  concepts: ["wind_down_window", "stress_response_basics"],
  durationMinutes: 9,
  exercises: [
    exercise({
      sourceId: "body-downshift-recall",
      category: "recall_warmup",
      phase: "retrieve",
      concept: "stress_response_basics",
      durationSeconds: 45,
      scaffoldLevel: 2,
      difficulty: 0.16,
      content: {
        completionMode: "direct",
        title: "Bring back the body switch",
        instruction: "Recall each answer, then reveal.",
        cards: [
          {
            question: "Which nervous-system direction supports settling?",
            answer: "Rest-and-digest, the calmer direction.",
          },
          {
            question: "Can a calming tool force sleep?",
            answer: "No. It supports settling; sleep arrives on its own.",
          },
          {
            question: "What makes a routine useful?",
            answer: "It is safe, repeatable, and realistic enough to use.",
          },
        ],
        successPrimaryLabel: "Continue",
      },
    }),
    exercise({
      sourceId: "two-evenings",
      category: "evening_comparison",
      phase: "model",
      concept: "wind_down_window",
      durationSeconds: 50,
      scaffoldLevel: 1,
      difficulty: 0.14,
      content: {
        completionMode: "direct",
        title: "Two ways to reach bed",
        instruction: "Compare the transition, not the person.",
        columns: [
          {
            heading: "ABRUPT",
            rows: [
              "Work ends at 10:50",
              "Bright room and messages",
              "Bed at 11:00",
            ],
            outcome: "The body gets almost no transition cue.",
          },
          {
            heading: "BUFFERED",
            rows: [
              "Work has a stopping cue",
              "Lights and pace soften",
              "Bed when sleepy",
            ],
            outcome: "The body receives a gradual change in conditions.",
          },
        ],
        explanation:
          "A wind-down is a transition between modes. It prepares conditions; it does not guarantee sleep.",
        note: "A shorter buffer still counts on a crowded evening.",
      },
    }),
    exercise({
      sourceId: "ninety-minute-myth",
      category: "concept_card",
      phase: "teach",
      concept: "wind_down_window",
      durationSeconds: 40,
      scaffoldLevel: 1,
      difficulty: 0.15,
      content: {
        completionMode: "direct",
        variant: "myth",
        title: "A range, not a rule",
        instruction: "Keep the flexible version.",
        primaryLabel: "Continue",
        myth: "Wind-down must begin at one exact time and last ninety minutes.",
        reality:
          "Use a workable range before bed. Some nights allow more time; a shorter transition is still useful.",
        note: "The routine should reduce pressure, not create a new clock test.",
      },
    }),
    exercise({
      sourceId: "flexible-window-transfer",
      category: "lever_scenario",
      phase: "transfer",
      concept: "wind_down_window",
      durationSeconds: 75,
      scaffoldLevel: 3,
      difficulty: 0.25,
      isScored: true,
      content: {
        completionMode: "direct",
        title: "Make the window fit real life",
        instruction: "Choose the plan that lowers pressure.",
        capability:
          "You can shape a flexible transition instead of chasing a perfect clock time.",
        variants: [
          {
            sceneLabel: "LATE SHIFT",
            scene:
              "Noah reaches home at different times each night. A fixed 9:30 routine is impossible.",
            prompt: "Which plan fits the wind-down idea?",
            clue: "Use a cue that can move with the evening.",
            worked:
              "A repeatable sequence can begin after the shift ends, even when the clock time changes.",
            options: [
              {
                id: "sequence",
                label:
                  "After arriving: dim lights, wash, then read quietly before bed",
                isCorrect: true,
                feedback:
                  "Right. The sequence stays stable while the time stays flexible.",
              },
              {
                id: "rigid",
                label: "Keep a 9:30 start even while still working",
                feedback:
                  "A plan that cannot be followed adds pressure instead of a useful cue.",
              },
              {
                id: "none",
                label:
                  "Skip every transition because ninety minutes is impossible",
                feedback:
                  "A shorter transition can still mark the move from work to rest.",
              },
            ],
          },
          {
            sceneLabel: "FAMILY EVENING",
            scene:
              "Mira's evening changes with caregiving. She usually has twenty to forty quiet minutes before bed.",
            prompt: "Which plan is most realistic?",
            clue: "Choose repeatability over perfection.",
            worked:
              "A flexible twenty-to-forty-minute range can hold one or two reliable cues without becoming another demand.",
            options: [
              {
                id: "range",
                label:
                  "Use the available range for dimmer light and one calm activity",
                isCorrect: true,
                feedback:
                  "Yes. The plan fits her actual evening and can expand when time allows.",
              },
              {
                id: "fail",
                label: "Treat nights under ninety minutes as failed nights",
                feedback:
                  "Wind-down supports sleep; it is not a pass-or-fail requirement.",
              },
              {
                id: "delay",
                label:
                  "Stay up later until a full ninety minutes becomes available",
                feedback:
                  "Extending the night to complete a ritual can work against the reason for the ritual.",
              },
            ],
          },
        ],
      },
    }),
    exercise({
      sourceId: "transition-plan",
      category: "if_then_plan",
      phase: "plan",
      concept: "wind_down_window",
      durationSeconds: 65,
      scaffoldLevel: 4,
      difficulty: 0.22,
      content: {
        title: "Choose one transition cue",
        instruction: "One cue, one realistic move.",
        cues: [
          "I finish my last necessary task",
          "the household becomes quieter",
          "I notice I am inside my bedtime range",
        ],
        actions: [
          "dim the lights and lower the pace",
          "put tomorrow's tasks in one place and stop work",
          "choose one calm activity until I feel sleepy",
        ],
        privacy: "Private. This plan is not scored or shared.",
        feedbackTitle: "A cue makes the range usable",
        feedback:
          "Keep the plan flexible. A shorter version still counts when the evening changes.",
      },
    }),
  ],
});
