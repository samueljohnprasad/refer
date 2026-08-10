import { defineLesson, exercise } from "../exercise.js";

export const optionalPreSleepJournaling = defineLesson({
  sourceId: "u3_2_pre_sleep_practices-n3",
  title: "Pre-Sleep Journaling (Optional)",
  objective:
    "Distinguish optional reflection from worry capture and choose freely.",
  concepts: ["pre_sleep_journaling", "worry_dump"],
  durationMinutes: 10,
  exercises: [
    exercise({
      sourceId: "clearing-reflection-compare",
      category: "same_but_different",
      phase: "distinguish",
      concept: "pre_sleep_journaling",
      durationSeconds: 55,
      scaffoldLevel: 2,
      difficulty: 0.2,
      content: {
        title: "Clearing and reflection",
        instruction: "Open each difference.",
        leftHeading: "WORRY DUMP",
        rightHeading: "REFLECTION",
        rows: [
          {
            question: "Main job?",
            left: "Externalize unfinished thoughts",
            right: "Notice meaning, gratitude, or intention",
          },
          {
            question: "Core or optional?",
            left: "A practical clearing tool",
            right: "Optional ritual if it feels useful",
          },
          {
            question: "Needs polished writing?",
            left: "No; fragments are enough",
            right: "No; short honest notes are enough",
          },
        ],
        tell: "A worry dump clears open loops. Reflection changes the tone of attention. Neither must produce sleep.",
      },
    }),
    exercise({
      sourceId: "two-minute-ritual",
      category: "learn_cards",
      phase: "model",
      concept: "pre_sleep_journaling",
      durationSeconds: 55,
      scaffoldLevel: 1,
      difficulty: 0.16,
      content: {
        completionMode: "direct",
        title: "A small optional ritual",
        instruction: "Keep it brief and honest.",
        cards: [
          {
            id: "notice",
            kicker: "NOTICE",
            title: "Name one small good thing",
            body: "It can be ordinary: warm food, a message, finishing a task, or a quiet moment.",
          },
          {
            id: "intend",
            kicker: "INTEND",
            title: "Choose one quality for tonight",
            body: "Examples: rest, patience, gentleness, or simply letting the day end.",
          },
          {
            id: "stop",
            kicker: "STOP",
            title: "Close after two minutes",
            body: "Do not turn reflection into homework. Skip it when writing feels activating or unwanted.",
          },
        ],
        recall: {
          prompt: "What makes this ritual optional?",
          correctOptionId: "choice",
          options: [
            {
              id: "choice",
              label:
                "It can be used, changed, or skipped without losing progress",
            },
            { id: "required", label: "It must be completed to sleep well" },
          ],
        },
        feedback_correct:
          "Right. Personal fit decides whether this ritual belongs in the evening.",
        feedback_incorrect:
          "Reflection is an option, not a requirement or sleep guarantee.",
        workedExample:
          "Good thing: tea with a friend. Intention: let the day end. Close.",
      },
    }),
    exercise({
      sourceId: "journaling-fit",
      category: "intuition_check",
      phase: "reflect",
      concept: "pre_sleep_journaling",
      durationSeconds: 30,
      scaffoldLevel: 1,
      difficulty: 0.12,
      content: {
        completionMode: "direct",
        title: "Does writing fit tonight?",
        instruction: "Choose honestly. This is not scored.",
        prompt: "How does a two-minute reflection ritual feel to you?",
        options: [
          { id: "useful", label: "Useful and calming" },
          { id: "maybe", label: "Maybe, on some nights" },
          { id: "activating", label: "Too activating before bed" },
          { id: "not-me", label: "Not for me" },
        ],
        bestOptionId: "maybe",
        revealTitle: "Choice protects the ritual",
        reveal:
          "Use reflection only when it makes the evening gentler. It does not need to happen nightly.",
        alternateReveal:
          "Skipping is a valid choice. Use a different wind-down tool or no tool at all.",
        primaryLabel: "Continue",
        waitingPrimaryLabel: "Choose above",
      },
    }),
    exercise({
      sourceId: "private-reflection",
      category: "private_check",
      phase: "practice",
      concept: "pre_sleep_journaling",
      durationSeconds: 120,
      scaffoldLevel: 3,
      difficulty: 0.18,
      content: {
        title: "Try it—or skip it",
        instruction: "Write privately if you want. Tick only what you chose.",
        items: [
          "I noted one small good thing",
          "I chose one gentle intention",
          "I stopped after a short reflection",
          "I skipped because writing did not fit tonight",
        ],
        feedbackTitle: "No answer is graded",
        feedback:
          "The writing stays private. Choosing a different evening tool does not reduce your progress.",
      },
    }),
    exercise({
      sourceId: "optional-rule-check",
      category: "course_choice",
      phase: "consolidate",
      concept: "pre_sleep_journaling",
      durationSeconds: 45,
      scaffoldLevel: 3,
      difficulty: 0.24,
      isScored: true,
      content: {
        title: "Keep the ritual optional",
        instruction: "Choose the accurate rule.",
        prompt:
          "What if gratitude journaling feels forced or makes you more alert?",
        options: [
          {
            id: "skip",
            label:
              "Skip or change it and use a better-fitting wind-down option",
            isCorrect: true,
            feedback: "Right. Fit matters more than completing a ritual.",
          },
          {
            id: "force",
            label: "Keep writing because it is required for sleep",
            feedback: "It is optional and does not guarantee sleep.",
          },
          {
            id: "fail",
            label: "Treat the night as failed",
            feedback:
              "A skipped ritual does not erase any learning or ruin the night.",
          },
        ],
        feedbackTitle: "Optional means optional",
        feedbackTakeaway:
          "A ritual should reduce pressure, not become another demand.",
        workedExample:
          "If writing wakes you up, choose quiet audio, a body scan, or simply end the routine.",
        primaryLabel: "Check answer",
      },
    }),
  ],
});
