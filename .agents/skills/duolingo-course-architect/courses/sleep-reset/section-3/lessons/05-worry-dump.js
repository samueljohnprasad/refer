import { defineLesson, exercise } from "../exercise.js";

export const worryDump = defineLesson({
  sourceId: "u3_2_pre_sleep_practices-n2",
  title: "The Worry Dump",
  objective:
    "Externalize unfinished thoughts before bed without solving or scoring them.",
  concepts: ["worry_dump", "stimulus_control"],
  durationMinutes: 12,
  exercises: [
    exercise({
      sourceId: "bed-link-recall",
      category: "recall_warmup",
      phase: "retrieve",
      concept: "stimulus_control",
      durationSeconds: 45,
      scaffoldLevel: 2,
      difficulty: 0.2,
      content: {
        completionMode: "direct",
        title: "Bring back the bed rule",
        instruction: "Recall each answer, then reveal.",
        cards: [
          {
            question: "What cue should lead you into bed?",
            answer: "Sleepiness, not only the clock.",
          },
          {
            question: "What if frustration keeps rising in bed?",
            answer: "Pause the struggle safely and return when sleepy.",
          },
          {
            question: "Is a restricted sleep window a generic self-help rule?",
            answer: "No. It is tailored treatment that needs trained guidance.",
          },
        ],
        successPrimaryLabel: "Continue",
      },
    }),
    exercise({
      sourceId: "solve-everything-trap",
      category: "common_trap",
      phase: "teach",
      concept: "worry_dump",
      durationSeconds: 50,
      scaffoldLevel: 2,
      difficulty: 0.2,
      content: {
        title: "The midnight planning trap",
        instruction: "See what keeps the loop open.",
        trapTitle: "I must solve every thought before I can sleep.",
        trapBody:
          "The mind treats bedtime as the final chance to remember, plan, and prevent mistakes.",
        relief:
          "Mental rehearsal briefly feels responsible because nothing is being forgotten.",
        rebound:
          "Each new solution creates another detail to hold, while bed becomes linked with planning.",
        counterMove:
          "Capture short notes earlier, close the page, and choose one next action only when useful.",
      },
    }),
    exercise({
      sourceId: "capture-close-return",
      category: "learn_cards",
      phase: "model",
      concept: "worry_dump",
      durationSeconds: 60,
      scaffoldLevel: 1,
      difficulty: 0.18,
      content: {
        completionMode: "direct",
        title: "Capture, close, return",
        instruction: "Use three short steps.",
        cards: [
          {
            id: "capture",
            kicker: "1 · CAPTURE",
            title: "Write short fragments",
            body: "List tasks, concerns, or reminders as they are. No polished sentences are needed.",
          },
          {
            id: "next",
            kicker: "2 · NEXT",
            title: "Add one next step when clear",
            body: "A simple action such as “email tomorrow” is enough. Do not solve every uncertainty.",
          },
          {
            id: "close",
            kicker: "3 · CLOSE",
            title: "End the capture",
            body: "Close the page or app and return to the wind-down. The list can wait until its chosen time.",
          },
        ],
        recall: {
          prompt: "What comes after capture?",
          correctOptionId: "close",
          options: [
            { id: "close", label: "Close the page and return to wind-down" },
            { id: "solve", label: "Solve every item before stopping" },
          ],
        },
        feedback_correct:
          "Right. The tool externalizes thoughts; it does not require full resolution.",
        feedback_incorrect:
          "Capture what matters, add a next step when useful, then close the page.",
        workedExample:
          "Meeting slides — check at 9am. Grocery list — add tomorrow. Money worry — review Saturday. Close.",
      },
    }),
    exercise({
      sourceId: "private-worry-capture",
      category: "private_check",
      phase: "practice",
      concept: "worry_dump",
      durationSeconds: 150,
      scaffoldLevel: 4,
      difficulty: 0.24,
      content: {
        title: "Try a private two-minute capture",
        instruction:
          "Write somewhere private. Tick only the steps completed here.",
        items: [
          "I captured tasks or reminders",
          "I captured concerns without judging them",
          "I added one next step where it was obvious",
          "I closed the page without solving everything",
          "I chose not to write today",
        ],
        feedbackTitle: "The content stays yours",
        feedback:
          "Nothing you wrote is requested or scored here. The skill is moving thoughts out of working memory, then ending the exercise.",
      },
    }),
    exercise({
      sourceId: "worry-dump-transfer",
      category: "course_choice",
      phase: "transfer",
      concept: "worry_dump",
      durationSeconds: 50,
      scaffoldLevel: 3,
      difficulty: 0.28,
      isScored: true,
      content: {
        title: "Choose the clearing tool",
        instruction: "Pick what protects the evening.",
        context:
          "At 10pm, Dev keeps rehearsing tomorrow's tasks so none are forgotten.",
        prompt: "What best fits a worry dump?",
        options: [
          {
            id: "capture",
            label:
              "Write short reminders and next steps, close the list, then return to wind-down",
            isCorrect: true,
            feedback:
              "Right. The task is externalizing and closing, not perfect planning.",
          },
          {
            id: "solve",
            label: "Stay in bed and solve every task mentally",
            feedback:
              "That keeps planning active in the place meant to cue sleep.",
          },
          {
            id: "erase",
            label: "Force every worry out of mind",
            feedback:
              "Thought suppression can add struggle. Capture gives the thoughts somewhere to wait.",
          },
        ],
        feedbackTitle: "Capture, then close",
        feedbackTakeaway:
          "A worry dump makes a holding place; it does not promise an empty mind.",
        workedExample:
          "One line per item, one next step when clear, then close the page.",
        primaryLabel: "Check answer",
      },
    }),
  ],
});
