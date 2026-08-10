import { defineLesson, exercise } from "../exercise.js";

export const sleepEnvironmentAudit = defineLesson({
  sourceId: "u3_1_wind_down-n3",
  title: "Your Sleep Environment Audit",
  objective:
    "Identify one repeatable bedroom disturbance and choose one practical experiment.",
  concepts: ["sleep_environment", "light_and_sleep", "wind_down_window"],
  durationMinutes: 11,
  exercises: [
    exercise({
      sourceId: "evening-cues-recall",
      category: "recall_warmup",
      phase: "retrieve",
      concept: "light_and_sleep",
      durationSeconds: 45,
      scaffoldLevel: 2,
      difficulty: 0.18,
      content: {
        completionMode: "direct",
        title: "Bring back two evening rules",
        instruction: "Recall each answer, then reveal.",
        cards: [
          {
            question: "Is wind-down an exact clock time?",
            answer: "No. It is a flexible transition range.",
          },
          {
            question: "Does warm screen color remove every light effect?",
            answer:
              "No. Brightness, timing, duration, and distance still matter.",
          },
          {
            question: "What makes a change useful?",
            answer:
              "It targets a repeatable disturbance and is realistic to test.",
          },
        ],
        successPrimaryLabel: "Continue",
      },
    }),
    exercise({
      sourceId: "environment-map",
      category: "learn_cards",
      phase: "model",
      concept: "sleep_environment",
      durationSeconds: 60,
      scaffoldLevel: 1,
      difficulty: 0.16,
      content: {
        completionMode: "direct",
        title: "Read the room, not a perfect checklist",
        instruction: "Find the disturbance that repeats for you.",
        cards: [
          {
            id: "temperature",
            kicker: "TEMPERATURE",
            title: "Comfort varies",
            body: "Heat or cold can disturb sleep. Aim for a personally comfortable setup rather than one universal number.",
          },
          {
            id: "light",
            kicker: "LIGHT",
            title: "Notice unwanted exposure",
            body: "Hallway glow, streetlight, or a bright display may be adjustable with dimming, position, or a sleep mask.",
          },
          {
            id: "sound",
            kicker: "SOUND",
            title: "Reduce or steady it",
            body: "Intermittent sound may be more disruptive than steady sound. Earplugs or neutral background sound must remain safe for alarms and caregiving.",
          },
          {
            id: "air-comfort",
            kicker: "AIR + COMFORT",
            title: "Check the physical setup",
            body: "Ventilation, bedding, pillows, pain, and mobility needs can matter. Choose changes that remain safe and affordable.",
          },
        ],
        recall: {
          prompt: "What should decide the first change?",
          correctOptionId: "repeatable",
          options: [
            {
              id: "repeatable",
              label: "The largest repeatable disturbance I can change",
            },
            { id: "universal", label: "A universal bedroom rule" },
          ],
        },
        feedback_correct:
          "Right. Start with the clearest repeatable blocker that is practical to change.",
        feedback_incorrect:
          "There is no single setup for every person. Use your repeated pattern and practical options.",
        workedExample:
          "Traffic wakes you most nights: first test a safe sound change, not a random bedding upgrade.",
      },
    }),
    exercise({
      sourceId: "disturbance-response-match",
      category: "lever_match",
      phase: "distinguish",
      concept: "sleep_environment",
      durationSeconds: 75,
      scaffoldLevel: 3,
      difficulty: 0.26,
      isScored: true,
      content: {
        title: "Match the disturbance",
        instruction: "Tap one item from each side.",
        pairs: [
          {
            id: "hallway",
            left: "Hallway light reaches the bed",
            right: "Block, reposition, or dim the source",
          },
          {
            id: "traffic",
            left: "Traffic changes through the night",
            right: "Test safe sound masking or ear protection",
          },
          {
            id: "warm",
            left: "Bedding feels too warm",
            right: "Test lighter bedding or airflow",
          },
          {
            id: "pain",
            left: "One position increases pain",
            right: "Adjust support and seek care when needed",
          },
        ],
        rightOrder: ["pain", "hallway", "warm", "traffic"],
        clue: "Match the response to the actual repeated disturbance.",
        feedbackTitle: "Specific blocker, specific test",
        feedback:
          "Environment changes work best as small experiments tied to a repeated problem.",
        capability:
          "You can choose a fitting environment experiment without chasing a perfect room.",
      },
    }),
    exercise({
      sourceId: "private-room-audit",
      category: "private_check",
      phase: "reflect",
      concept: "sleep_environment",
      durationSeconds: 70,
      scaffoldLevel: 1,
      difficulty: 0.16,
      content: {
        title: "What repeats in your room?",
        instruction:
          "Tick any recurring disturbance. Choose none if they do not fit.",
        items: [
          "Temperature or airflow feels uncomfortable",
          "Unwanted light reaches the bed",
          "Sound interrupts settling or sleep",
          "Bedding, pain, or position affects comfort",
          "I have not noticed a repeatable room issue",
        ],
        feedbackTitle: "One pattern is enough",
        feedback:
          "This audit is private and unscored. Test one safe, practical change before adding more.",
      },
    }),
    exercise({
      sourceId: "environment-plan",
      category: "if_then_plan",
      phase: "plan",
      concept: "sleep_environment",
      durationSeconds: 65,
      scaffoldLevel: 4,
      difficulty: 0.24,
      content: {
        title: "Choose one room experiment",
        instruction: "One cue, one safe adjustment.",
        cues: [
          "unwanted light is the clearest blocker",
          "sound is the clearest blocker",
          "temperature or physical comfort is the clearest blocker",
        ],
        actions: [
          "test one dimming, blocking, or repositioning change",
          "test one safe sound or notification change",
          "adjust bedding, airflow, or support for comfort",
        ],
        privacy: "Private. This room audit is not scored or shared.",
        feedbackTitle: "Run one small experiment",
        feedback:
          "Try the change for several nights when possible. Keep safety, access, and cost ahead of perfection.",
      },
    }),
  ],
});
