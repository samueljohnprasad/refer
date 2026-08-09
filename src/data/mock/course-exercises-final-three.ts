import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const FINAL_THREE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "plan-build-if-then",
    nodeId: NODE_ID,
    orderIndex: 55,
    type: CourseExerciseCategoryEnum.IfThenPlan,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.IfThenPlan,
      format: CourseExerciseCategoryEnum.IfThenPlan,
      completionMode: "direct",
      title: "Build this week’s plan",
      instruction:
        "Plans that name the exact moment fire far more often than intentions. One cue, one move.",
      feedbackTitle: "Saved — now the rehearsal",
      cues: [
        "my chest tightens before a meeting",
        "I catch myself rereading a message for “evidence”",
        "the urge to cancel shows up",
      ],
      actions: [
        "name it — “this is the alarm; it fades on its own”",
        "take ten slow exhales, feet on the floor",
        "counter-offer the five-minute version",
      ],
      privacy: "Saved privately — no reminders unless you ask.",
      feedback:
        "Close your eyes for ten seconds: picture the moment actually happening — then picture yourself doing the move. One mental run-through measurably raises the odds the plan fires for real. The cues came from this unit’s traps, the moves from its levers — the same two-slot engine follows every lesson, in every course.",
    },
  },
  {
    id: "stress-basics-checkpoint",
    nodeId: NODE_ID,
    orderIndex: 56,
    type: CourseExerciseCategoryEnum.CourseCheckpoint,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.CourseCheckpoint,
      format: CourseExerciseCategoryEnum.CourseCheckpoint,
      completionMode: "direct",
      title: "Checkpoint",
      instruction: "A calm mixed review — nothing here resets your progress.",
      introTitle: "A short review",
      intro:
        "Two quick questions mixing what you’ve met — the alarm system and the loops. A wobble here doesn’t reset anything; it just shows what’s worth a revisit.",
      items: [
        {
          concept: "Low mood",
          context:
            "Flat Tuesday: Sam feels grey and cancels his evening walk — “what’s the point”.",
          prompt: "The most useful reading?",
          clue: "What would shrink the action instead of cancelling it?",
          worked:
            "Low mood argues against the exact things that lift it, and waits for motivation that follows action. Shrink the action — five minutes still counts as a door out of the loop.",
          options: [
            {
              label:
                "The dip is talking — a five-minute version of the walk still counts",
              isCorrect: true,
              feedback:
                "Yes — low mood argues against the exact things that lift it. Shrinking the action beats cancelling it.",
            },
            {
              label: "He should wait for motivation to come back first",
              feedback:
                "Motivation usually follows action, not the other way round — waiting feeds the loop.",
            },
            {
              label: "He’s failed his routine",
              feedback:
                "One grey Tuesday is a data point, not a failure. The kind move is smaller, not harder.",
            },
          ],
        },
        {
          concept: "The anxiety wave",
          prompt:
            "A racing heart during an anxiety wave means real danger is present.",
          clue: "Alarm volume, or actual threat?",
          worked:
            "The alarm is wired to overestimate — that’s its job. A racing heart measures adrenaline, not danger; the wave peaks and fades on its own.",
          options: [
            {
              label: "True",
              feedback:
                "That’s exactly what the alarm wants you to conclude — it’s wired to overestimate. A racing heart measures adrenaline, not danger.",
            },
            {
              label: "False",
              isCorrect: true,
              feedback:
                "Right — it’s the surge, not the situation. Waves peak and fade on their own, danger or not.",
            },
          ],
        },
      ],
      revisitMessage:
        "A two-minute revisit of the marked idea will make the next unit easier. It stays on your Journey path — no penalty either way.",
      solidMessage:
        "Everything you met is holding. The next unit is ready whenever you are.",
    },
  },
  {
    id: "stress-basics-milestone",
    nodeId: NODE_ID,
    orderIndex: 57,
    type: CourseExerciseCategoryEnum.SectionMilestone,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.SectionMilestone,
      format: CourseExerciseCategoryEnum.SectionMilestone,
      completionMode: "direct",
      title: "Milestone",
      closedTitle: "Section milestone",
      closedBody: "You’ve finished the exercises in How Stress Actually Works.",
      badge: "How Stress Actually Works · complete",
      openTitle: "You can read your own alarm system",
      openBody:
        "An alarm that surges and fades, thoughts that tint feelings, two loops that keep struggle alive — and the levers you can now name.",
      nextLabel: "Next, whenever you like:",
      nextTitle: "Working With Worried Thoughts",
      nextBody: "catching the spiral early, and one gentle experiment to try.",
    },
  },
];
