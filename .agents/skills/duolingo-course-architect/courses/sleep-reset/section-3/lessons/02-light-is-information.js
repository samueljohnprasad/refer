import { defineLesson, exercise } from "../exercise.js";

export const lightIsInformation = defineLesson({
  sourceId: "u3_1_wind_down-n2",
  title: "Light Is Information",
  objective: "Choose a practical reduction in evening light exposure.",
  concepts: ["light_and_sleep", "wind_down_window", "circadian_rhythm"],
  durationMinutes: 10,
  exercises: [
    exercise({
      sourceId: "light-bet",
      category: "curiosity_bet",
      phase: "predict",
      concept: "light_and_sleep",
      durationSeconds: 35,
      scaffoldLevel: 1,
      difficulty: 0.14,
      content: {
        completionMode: "direct",
        title: "What still matters?",
        instruction: "Choose before seeing the rule.",
        question:
          "A screen becomes warmer in color but stays bright. What can still affect the body's night signal?",
        options: [
          "Nothing; warm color removes the effect",
          "Brightness, duration, timing, and distance",
          "Only the app being used",
        ],
        bestAnswerIndex: 1,
        answer: "Brightness, duration, timing, and distance",
      },
    }),
    exercise({
      sourceId: "light-rule",
      category: "concept_card",
      phase: "teach",
      concept: "light_and_sleep",
      durationSeconds: 45,
      scaffoldLevel: 1,
      difficulty: 0.16,
      content: {
        completionMode: "direct",
        variant: "myth",
        title: "Color is one part of exposure",
        instruction: "Keep the practical rule.",
        primaryLabel: "Continue",
        myth: "Night mode makes any bright late screen harmless to sleep.",
        reality:
          "Color shift alone may be insufficient. Reduce unnecessary brightness and exposure when you can.",
        note: "Response varies by timing, duration, intensity, distance, and the person.",
      },
    }),
    exercise({
      sourceId: "brightness-spectrum-compare",
      category: "same_but_different",
      phase: "distinguish",
      concept: "light_and_sleep",
      durationSeconds: 55,
      scaffoldLevel: 2,
      difficulty: 0.2,
      content: {
        title: "Brightness and spectrum",
        instruction: "Open each difference.",
        leftHeading: "DIMMER",
        rightHeading: "WARMER",
        rows: [
          {
            question: "What changes?",
            left: "The amount of light reaching the eyes",
            right: "The mix of wavelengths",
          },
          {
            question: "What stays possible?",
            left: "Some light exposure remains",
            right: "A bright display can remain bright",
          },
          {
            question: "Best practical use?",
            left: "Reduce unnecessary intensity",
            right: "Add comfort after brightness is addressed",
          },
        ],
        tell: "Brightness and spectrum both matter. A warmer color setting is an extra adjustment, not a complete shield.",
      },
    }),
    exercise({
      sourceId: "necessary-screen-choice",
      category: "course_choice",
      phase: "transfer",
      concept: "light_and_sleep",
      durationSeconds: 50,
      scaffoldLevel: 3,
      difficulty: 0.26,
      isScored: true,
      content: {
        title: "One necessary message",
        instruction: "Choose the practical first move.",
        context:
          "At 9:45pm, Jo needs to send one necessary message from a phone.",
        prompt: "Which choice best applies the light rule?",
        options: [
          {
            id: "reduce",
            label:
              "Lower brightness, keep the task brief, then put the phone away",
            isCorrect: true,
            feedback:
              "Right. This reduces controllable exposure without demanding perfect avoidance.",
          },
          {
            id: "filter",
            label:
              "Use a warm filter at full brightness for the rest of the evening",
            feedback:
              "A color shift alone does not address brightness or duration.",
          },
          {
            id: "panic",
            label: "Treat any screen glance as a ruined night",
            feedback:
              "Light guidance should support choices, not create sleep anxiety.",
          },
        ],
        feedbackTitle: "Reduce what is changeable",
        feedbackTakeaway:
          "Lower intensity and duration when late screen use is necessary.",
        workedExample:
          "Dim, finish the necessary task, and return to the evening without treating the night as damaged.",
        primaryLabel: "Check answer",
      },
    }),
    exercise({
      sourceId: "light-plan",
      category: "if_then_plan",
      phase: "plan",
      concept: "light_and_sleep",
      durationSeconds: 60,
      scaffoldLevel: 4,
      difficulty: 0.22,
      content: {
        title: "Choose one light cue",
        instruction: "Pick one change you can repeat.",
        cues: [
          "my wind-down range begins",
          "I finish the last necessary screen task",
          "I notice the room feels brighter than I need",
        ],
        actions: [
          "lower the room and screen brightness",
          "switch off one unnecessary light",
          "move the screen farther away and keep the task brief",
        ],
        privacy: "Private. This plan is not scored or shared.",
        feedbackTitle: "One lever is enough to start",
        feedback:
          "Choose the change that fits your home, vision, mobility, and safety needs.",
      },
    }),
  ],
});
