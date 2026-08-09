import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const THIRD_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "thoughts-sticky-myth",
    nodeId: NODE_ID,
    orderIndex: 10,
    type: CourseExerciseCategoryEnum.ConceptCard,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.ConceptCard,
      format: CourseExerciseCategoryEnum.ConceptCard,
      completionMode: "direct",
      variant: "myth",
      title: "A sticky myth",
      instruction: "Just read, nothing to answer.",
      primaryLabel: "Got it, continue",
      myth: "Strong feelings prove the thought behind them is true.",
      reality:
        "Intensity measures the alarm, not the facts. A thought can feel certain at 2am and be wrong by breakfast.",
      note: "You’ll meet this one again in a moment.",
    },
  },
  {
    id: "thoughts-true-or-false",
    nodeId: NODE_ID,
    orderIndex: 11,
    type: CourseExerciseCategoryEnum.CourseChoice,
    concept: "thought_feeling_link",
    isScored: true,
    content: {
      category: CourseExerciseCategoryEnum.CourseChoice,
      format: CourseExerciseCategoryEnum.CourseChoice,
      title: "True or false?",
      instruction: "Read the statement, then choose.",
      prompt:
        "Feelings usually come from our interpretation of a situation, not the situation alone.",
      primaryLabel: "Check answer",
      retryPhase: "choice",
      feedbackTitle: "Why it fits",
      feedbackTakeaway:
        "You can spot the interpretation between event and feeling.",
      workedExample:
        "Event → interpretation → feeling. The middle step is fast and automatic, but it can be noticed, and gently questioned.",
      options: [
        {
          id: "true",
          label: "True",
          isCorrect: true,
          feedback:
            "Right, between event and emotion sits an interpretation, usually automatic. Same situation, different reading, different feeling. That gap is where you get leverage.",
        },
        {
          id: "false",
          label: "False",
          feedback:
            "It feels like situations hit us directly, but two people in the same moment can feel completely differently. The interpretation in between is what differs.",
        },
      ],
    },
  },
  {
    id: "low-mood-ana-tuesday",
    nodeId: NODE_ID,
    orderIndex: 12,
    type: CourseExerciseCategoryEnum.StoryWalkthrough,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.StoryWalkthrough,
      format: CourseExerciseCategoryEnum.StoryWalkthrough,
      completionMode: "direct",
      title: "Ana’s Tuesday",
      instruction: "A short story, tap through at your pace.",
      primaryLabel: "Next",
      beats: [
        {
          id: "morning",
          kicker: "ANA · 7AM",
          title: "The grey start",
          body:
            "Ana wakes up flat. Getting up feels pointless, so she stays under the covers another hour.",
          icon: "moon",
        },
        {
          id: "afternoon",
          kicker: "ANA · 2PM",
          title: "The quiet cancel",
          body:
            "She texts “can’t make it today”. Relief, for a minute, then the afternoon feels even emptier.",
          icon: "activity",
        },
        {
          id: "night",
          kicker: "ANA · 9PM",
          title: "The verdict",
          body:
            "By night her mind has a verdict ready: “see, you wasted the day.” The dip digs in a little deeper.",
          icon: "zap",
        },
      ],
      insight: {
        title: "People who relate to Ana often find…",
        body:
          "…it was never laziness. Low mood shrinks energy, skipping empties the day, and the empty day lowers mood again. It’s a loop, and loops have doors. Ana’s door: the five-minute version of one skipped thing.",
      },
    },
  },
  {
    id: "low-mood-withdrawal-trap",
    nodeId: NODE_ID,
    orderIndex: 13,
    type: CourseExerciseCategoryEnum.CommonTrap,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.CommonTrap,
      format: CourseExerciseCategoryEnum.CommonTrap,
      completionMode: "direct",
      title: "The trap that makes sense",
      instruction: "Everyone runs this one. Tap through.",
      primaryLabel: "And then what happens?",
      trapTitle: "Withdrawing to “recharge”",
      trapBody:
        "Of course you cancel. People are draining when you’re flat, and the couch asks nothing of you. It works, for about an hour.",
      relief:
        "Quiet, no demands, real relief. That’s why the trap is intelligent, not weak.",
      rebound:
        "An emptier day for the mood to feed on. By evening the dip has more room, not less.",
      counterMove:
        "Shrink the plan instead of cancelling it, ten minutes of the walk still counts as a door.",
    },
  },
  {
    id: "low-mood-action-first-rule",
    nodeId: NODE_ID,
    orderIndex: 14,
    type: CourseExerciseCategoryEnum.ConceptCard,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.ConceptCard,
      format: CourseExerciseCategoryEnum.ConceptCard,
      completionMode: "direct",
      variant: "rule",
      title: "One rule to keep",
      instruction: "Just read, nothing to answer.",
      primaryLabel: "Got it, continue",
      rule: "Action first. Motivation follows.",
      explanation:
        "Low mood says wait until you feel like it. The wiring runs the other way: a five-minute start is what generates the feeling-like-it.",
      note: "Watch it at work in the next screen.",
    },
  },
];
