import { defineLesson, exercise } from "../exercise.js";
import { EVENING_CHECKPOINT_ITEMS } from "./08-evening-architecture-checkpoint-content.js";

export const eveningArchitectureCheckpoint = defineLesson({
  sourceId: "u3_2_pre_sleep_practices-n5",
  title: "Evening Architecture Checkpoint",
  objective:
    "Explain the evening system, build a flexible plan, and name one change to test.",
  concepts: [
    "wind_down_window",
    "light_and_sleep",
    "sleep_environment",
    "stimulus_control",
    "sleep_window_clinician_guidance",
    "worry_dump",
    "pre_sleep_journaling",
    "evening_experiment",
  ],
  durationMinutes: 10,
  exercises: [
    exercise({
      sourceId: "evening-map-recall",
      category: "recall_warmup",
      phase: "retrieve",
      concept: "wind_down_window",
      durationSeconds: 65,
      scaffoldLevel: 2,
      difficulty: 0.24,
      content: {
        completionMode: "direct",
        title: "Bring back the evening map",
        instruction: "Recall each answer, then reveal.",
        cards: [
          {
            question: "What shape should a wind-down window have?",
            answer:
              "A flexible range with repeatable cues, not an exact nightly test.",
          },
          {
            question: "What is the practical evening-light rule?",
            answer:
              "Reduce unnecessary brightness and exposure; color shift alone is not a complete shield.",
          },
          {
            question: "How do you choose a room change?",
            answer:
              "Target the largest repeatable disturbance you can safely change.",
          },
          {
            question: "What protects the bed-sleep association?",
            answer:
              "Enter when sleepy; pause rising struggle safely; return when sleepy.",
          },
          {
            question: "What is a worry dump for?",
            answer:
              "Capture unfinished thoughts, then close the page without solving everything.",
          },
          {
            question: "Is pre-sleep reflection required?",
            answer:
              "No. It is optional and should be skipped when it adds pressure.",
          },
          {
            question: "How should you test an evening change?",
            answer:
              "Change one safe lever and look for a pattern across several comparable nights.",
          },
        ],
        successPrimaryLabel: "Continue",
      },
    }),
    exercise({
      sourceId: "evening-sequence-teach-back",
      category: "teach_back_chain",
      phase: "explain",
      concept: "wind_down_window",
      durationSeconds: 85,
      scaffoldLevel: 4,
      difficulty: 0.3,
      isScored: true,
      content: {
        title: "Build the evening explanation",
        instruction: "Put the causal steps in order.",
        message:
          "How does evening design reduce sleep effort without promising sleep?",
        slotHints: [
          "Start with the transition",
          "Change the cues",
          "Protect the bed link",
          "Finish with agency",
        ],
        steps: [
          {
            id: "agency",
            label:
              "Use or skip optional tools without treating the night as failed",
            order: 4,
          },
          {
            id: "transition",
            label: "Move from daytime tasks into a flexible wind-down range",
            order: 1,
          },
          {
            id: "cues",
            label: "Reduce repeatable light, room, and open-loop disturbances",
            order: 2,
          },
          {
            id: "bed",
            label: "Enter bed when sleepy and pause prolonged struggle safely",
            order: 3,
          },
        ],
        followUp: "What makes this a useful system?",
        followUpOptions: [
          {
            label:
              "Each step changes a cue while leaving sleep itself unforced",
            reply:
              "Yes. Evening design prepares conditions and protects associations; it does not command sleep.",
            takeaway:
              "Build conditions, respond to cues, and leave room for variation.",
          },
        ],
      },
    }),
    exercise({
      sourceId: "evening-system-checkpoint",
      category: "course_checkpoint",
      phase: "checkpoint",
      concept: "stimulus_control",
      durationSeconds: 240,
      scaffoldLevel: 3,
      difficulty: 0.36,
      isScored: true,
      content: {
        completionMode: "direct",
        title: "Evening architecture checkpoint",
        instruction: "Use the system in six changed situations.",
        introTitle: "Choose the fitting lever",
        intro:
          "Apply flexible timing, light, environment, bed association, mind-clearing, and one-change experiments without chasing perfection.",
        items: EVENING_CHECKPOINT_ITEMS,
        revisitMessage:
          "Revisit only the marked lever, then try the changed situation again.",
        solidMessage:
          "You can choose evening tools by purpose while keeping timing, access, and personal fit flexible.",
      },
    }),
    exercise({
      sourceId: "personal-evening-plan",
      category: "if_then_plan",
      phase: "plan",
      concept: "wind_down_window",
      durationSeconds: 80,
      scaffoldLevel: 4,
      difficulty: 0.26,
      content: {
        title: "Build your first evening architecture",
        instruction: "Choose a start cue and one three-part template.",
        cues: [
          "my last necessary task ends",
          "I enter my flexible bedtime range",
          "the household reaches its quietest workable point",
        ],
        actions: [
          "dim unnecessary light, capture open tasks, then choose one calm activity",
          "adjust my biggest room blocker, use a body-calm tool, then enter bed when sleepy",
          "close work, lower stimulation, and use a safe quiet reset if struggle builds",
        ],
        privacy: "Private. Your plan is not scored or shared.",
        feedbackTitle: "Three tools, one flexible sequence",
        feedback:
          "Use the smallest version that fits the night. Test one change at a time, and change or skip optional pieces when they add pressure.",
      },
    }),
    exercise({
      sourceId: "evening-architect-milestone",
      category: "section_milestone",
      phase: "completion",
      concept: "wind_down_window",
      durationSeconds: 35,
      scaffoldLevel: 1,
      difficulty: 0.1,
      content: {
        completionMode: "direct",
        closedTitle: "Your evening system is ready",
        closedBody: "Open the milestone to finish Design Your Evening.",
        badge: "EVENING ARCHITECT",
        openTitle: "You can shape conditions without forcing sleep",
        openBody:
          "You built a flexible system for light, environment, open loops, the bed-sleep association, and one-change experiments.",
        nextLabel: "Next:",
        nextTitle: "The Mind That Won't Quiet.",
        nextBody:
          "Learn how sleep effort and thought struggle can keep the mind alert.",
      },
    }),
  ],
});
