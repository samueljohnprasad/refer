import { defineLesson, exercise } from "../exercise.js";

export const testOneChangeAtATime = defineLesson({
  sourceId: "u3_2_pre_sleep_practices-n4",
  title: "Test One Change at a Time",
  objective:
    "Choose one safe evening change and judge it from a pattern across several comparable nights.",
  concepts: [
    "evening_experiment",
    "light_and_sleep",
    "sleep_environment",
    "pre_sleep_journaling",
  ],
  durationMinutes: 10,
  exercises: [
    exercise({
      sourceId: "one-change-recall",
      category: "recall_warmup",
      phase: "retrieve",
      concept: "sleep_environment",
      durationSeconds: 50,
      scaffoldLevel: 2,
      difficulty: 0.2,
      content: {
        completionMode: "direct",
        title: "Bring back the experiment rule",
        instruction: "Recall each answer, then reveal.",
        cards: [
          {
            question: "What makes a useful first room change?",
            answer:
              "It targets one repeatable disturbance and is safe and practical.",
          },
          {
            question: "Does one better night prove what caused it?",
            answer:
              "No. Sleep varies, so look for a pattern across several comparable nights.",
          },
          {
            question: "What if the change does not fit your life?",
            answer:
              "Change it or drop it. The experiment is not a test of you.",
          },
        ],
        successPrimaryLabel: "Continue",
      },
    }),
    exercise({
      sourceId: "everything-at-once-trap",
      category: "common_trap",
      phase: "teach",
      concept: "evening_experiment",
      durationSeconds: 50,
      scaffoldLevel: 2,
      difficulty: 0.2,
      content: {
        title: "The everything-at-once trap",
        instruction: "See why a crowded reset hides the signal.",
        trapTitle:
          "I will change the lights, tea, music, bedding, and bedtime tonight.",
        trapBody:
          "Changing many things can feel thorough when you want a quick answer.",
        relief:
          "A large reset creates a strong feeling that you are doing everything possible.",
        rebound:
          "If the night changes, you cannot tell which lever mattered. If it does not, you may discard useful changes together.",
        counterMove:
          "Change one safe lever, keep the rest roughly stable when practical, and observe without demanding a result.",
      },
    }),
    exercise({
      sourceId: "evening-experiment-loop",
      category: "learn_cards",
      phase: "model",
      concept: "evening_experiment",
      durationSeconds: 70,
      scaffoldLevel: 1,
      difficulty: 0.18,
      content: {
        completionMode: "direct",
        title: "Choose, observe, compare, decide",
        instruction: "Keep the experiment small enough to read.",
        cards: [
          {
            id: "choose",
            kicker: "1 · CHOOSE",
            title: "Change one safe lever",
            body: "Pick one repeated blocker you can reasonably change: light, sound, comfort, open tasks, or an optional ritual.",
          },
          {
            id: "steady",
            kicker: "2 · STEADY",
            title: "Keep the rest roughly similar",
            body: "Use comparable nights when possible. Real life will vary, so note major differences without chasing perfect control.",
          },
          {
            id: "observe",
            kicker: "3 · OBSERVE",
            title: "Notice a simple pattern",
            body: "Across several nights, notice whether settling, disruption, and effort feel meaningfully different.",
          },
          {
            id: "decide",
            kicker: "4 · DECIDE",
            title: "Keep, change, or drop it",
            body: "A change must be useful and practical. No result is a personal failure or a diagnosis.",
          },
        ],
        recall: {
          prompt: "What comes after one promising night?",
          correctOptionId: "observe",
          options: [
            {
              id: "observe",
              label: "Keep observing across comparable nights",
            },
            {
              id: "prove",
              label: "Declare the change proven for every night",
            },
          ],
        },
        feedback_correct:
          "Right. A pattern is more useful than one unusually good or bad night.",
        feedback_incorrect:
          "One night can be encouraging, but it cannot show what caused the result.",
        workedExample:
          "Hallway light repeats. Dim only that light for several work nights, notice the pattern, then keep or change the plan.",
      },
    }),
    exercise({
      sourceId: "one-night-conclusion",
      category: "course_choice",
      phase: "transfer",
      concept: "evening_experiment",
      durationSeconds: 55,
      scaffoldLevel: 4,
      difficulty: 0.3,
      isScored: true,
      content: {
        title: "Read the pattern carefully",
        instruction: "Choose the most accurate conclusion.",
        context:
          "Maya dimmed the hallway light for one night and settled more easily. The next night included a stressful late call and sleep felt harder.",
        prompt: "What can Maya reasonably conclude?",
        options: [
          {
            id: "continue",
            label:
              "Two different nights are not proof; repeat the small light change on comparable nights and judge the pattern",
            isCorrect: true,
            feedback:
              "Right. Keep the change small and let several comparable nights provide the useful signal.",
          },
          {
            id: "always",
            label: "The first night proves dim light will always improve sleep",
            feedback:
              "One night cannot separate the light change from normal sleep variation.",
          },
          {
            id: "never",
            label: "The second night proves the light change never helps",
            feedback:
              "The late stressful call changed the context, so this is not a clean comparison.",
          },
        ],
        feedbackTitle: "Look for a pattern, not a verdict",
        feedbackTakeaway:
          "Small experiments guide personal choices; they do not prove a diagnosis or guarantee sleep.",
        workedExample:
          "Compare several similar work nights with the same light change before deciding whether it earns a place in the routine.",
        primaryLabel: "Check answer",
      },
    }),
    exercise({
      sourceId: "private-evening-experiment",
      category: "if_then_plan",
      phase: "plan",
      concept: "evening_experiment",
      durationSeconds: 70,
      scaffoldLevel: 4,
      difficulty: 0.24,
      content: {
        title: "Choose one evening experiment",
        instruction: "One repeated cue, one low-risk change.",
        cues: [
          "unwanted light is my clearest repeated blocker",
          "sound or physical comfort is my clearest repeated blocker",
          "open tasks or an optional ritual is my clearest repeated blocker",
        ],
        actions: [
          "test one dimming, blocking, or positioning change across comparable nights",
          "test one safe sound, bedding, airflow, or support change across comparable nights",
          "test one brief capture or optional ritual without changing the rest of my routine",
        ],
        privacy:
          "Private. Your observation is not scored, stored, or diagnosed.",
        feedbackTitle: "One lever is enough",
        feedback:
          "Observe for several comparable nights when practical. Keep, change, or drop the experiment based on fit and pattern—not perfection.",
      },
    }),
  ],
});
