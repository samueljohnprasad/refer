import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const NINTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "low-mood-two-evenings",
    nodeId: NODE_ID,
    orderIndex: 40,
    type: CourseExerciseCategoryEnum.EveningComparison,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.EveningComparison,
      format: CourseExerciseCategoryEnum.EveningComparison,
      completionMode: "direct",
      primaryLabel: "Got it — continue",
      title: "Two evenings, one dip",
      instruction: "Same person, same low Tuesday — two paths.",
      columns: [
        {
          heading: "Evening A",
          rows: ["Cancels the walk", "Scrolls in bed", "Replays the day"],
          outcome: "Dip digs in — “wasted another day”.",
        },
        {
          heading: "Evening B",
          rows: ["Five-minute walk", "One text to a friend", "Same tired body"],
          outcome: "Dip loosens a notch — small lift, real.",
        },
      ],
      explanation:
        "Neither evening fixes anything. One feeds the loop, one opens a door.",
      note: "The matching exercise ahead names these levers.",
    },
  },
  {
    id: "low-mood-big-small-lever",
    nodeId: NODE_ID,
    orderIndex: 41,
    type: CourseExerciseCategoryEnum.LeverCheck,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.LeverCheck,
      format: CourseExerciseCategoryEnum.LeverCheck,
      completionMode: "direct",
      title: "Big lever, small lever",
      instruction:
        "Two popular moves for a heavy week. Pull each — the bar shows how much of the load is still there tomorrow.",
      levers: [
        {
          id: "vent",
          label: "Vent about it for an hour",
          remainingPercent: 78,
          explanation:
            "Feels lighter tonight — the load itself barely moved, and rehearsing it can even feed the loop.",
          tone: "orange",
        },
        {
          id: "next-step",
          label: "Ten minutes: worry list, one next step each",
          remainingPercent: 35,
          explanation:
            "Less satisfying in the moment — but each worry with a next step stops circling. The load actually shrinks.",
          tone: "olive",
        },
      ],
      rule: "Feeling better ≠ having less to carry.",
      takeaway:
        "Venting is real relief and fine company — it’s just a small lever. Spend the effort where the load shrinks: name the worries, give each a next step. The small lever isn’t wasted; it’s just not the one that moves the week.",
      note: "Proportions illustrative — the point is the order of magnitude.",
    },
  },
  {
    id: "low-mood-diary-annotated",
    nodeId: NODE_ID,
    orderIndex: 42,
    type: CourseExerciseCategoryEnum.AnnotatedDiary,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.AnnotatedDiary,
      format: CourseExerciseCategoryEnum.AnnotatedDiary,
      completionMode: "direct",
      primaryLabel: "Got it — continue",
      title: "A diary line, annotated",
      instruction: "Just read — nothing to answer.",
      diary:
        "“Cancelled on everyone again. I always do this. What is wrong with me?”",
      annotation:
        "Three sentences, three moves: a fact, a story (“always”), and a verdict. Only the first is evidence. “I cancelled today because the dip was heavy” keeps the fact — and drops the sentence.",
      note: "The next screen is private — see if any of these ring true.",
    },
  },
  {
    id: "low-mood-sounds-familiar",
    nodeId: NODE_ID,
    orderIndex: 43,
    type: CourseExerciseCategoryEnum.PrivateCheck,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.PrivateCheck,
      format: CourseExerciseCategoryEnum.PrivateCheck,
      completionMode: "direct",
      primaryLabel: "Continue",
      title: "Sounds familiar?",
      instruction: "Tick any that ring true — or none.",
      items: [
        "Replaying a conversation long after it ended",
        "Cancelling something, then feeling worse",
        "A tight jaw or a headache by evening",
        "“I’ll do it when I feel more up to it”",
      ],
      feedbackTitle: "Loops, not flaws",
      feedback:
        "Whatever you ticked — or didn’t — these are loops, not character flaws. They run on wiring you’ve now seen, and the rest of the unit is about the levers.",
    },
  },
  {
    id: "worry-not-anxiety",
    nodeId: NODE_ID,
    orderIndex: 44,
    type: CourseExerciseCategoryEnum.SameButDifferent,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.SameButDifferent,
      format: CourseExerciseCategoryEnum.SameButDifferent,
      completionMode: "direct",
      title: "Worry ≠ anxiety",
      instruction:
        "Most people use the words interchangeably. They’re teammates, not twins — tap each row.",
      leftHeading: "Worry",
      rightHeading: "Anxiety",
      rows: [
        {
          question: "Where does it live?",
          left: "In sentences — the what-ifs your mind keeps writing",
          right: "In the body — chest, heart, gut",
        },
        {
          question: "What is it doing?",
          left: "Rehearsing bad outcomes, on a loop",
          right: "Sounding the full-body alarm — adrenaline, right now",
        },
        {
          question: "What helps first?",
          left: "Park it — write it down, give it a slot tomorrow",
          right: "Body levers — slow exhale, ride the wave out",
        },
      ],
      tell: "Mind writing paragraphs at 2am? That’s worry — a thinking habit with a parking brake. Chest banging before the meeting? That’s anxiety — the alarm, and it answers to the body levers. Same family, different first move.",
    },
  },
];
