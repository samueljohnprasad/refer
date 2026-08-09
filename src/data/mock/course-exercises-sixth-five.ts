import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const SIXTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "avoidance-relief-riddle",
    nodeId: NODE_ID,
    orderIndex: 25,
    type: CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
      format: CourseExerciseCategoryEnum.GuidedDiscoveryTrail,
      completionMode: "direct",
      title: "The relief riddle",
      instruction:
        "If avoiding brings relief… why does the fear keep growing? Solve it, you have the pieces.",
      questions: [
        {
          coach:
            "You skip the thing and relief lands instantly. Quick check, what does a brain do with anything that brings fast relief?",
          options: [
            {
              label: "Nothing, relief is neutral",
              reply:
                "It feels neutral, but fast relief is the strongest reward the brain has. It quietly files “skip” as a move worth repeating.",
            },
            {
              label: "Files it as a move worth repeating",
              reply:
                "Exactly, the brain grades moves on how fast they feel better, not on wisdom. “Skip” just earned a gold star.",
            },
          ],
        },
        {
          coach:
            "So skipping gets repeated. Second piece, while you keep skipping, what never gets to happen?",
          options: [
            {
              label: "The alarm never gets proof the thing is safe",
              reply:
                "That’s the engine. Safety is learned by surviving the thing, and skipping cancels the class where the proof is shown.",
            },
            {
              label: "Nothing important, rest is rest",
              reply:
                "Rest is real, but the alarm only updates on evidence, and skipping cancels the class where the evidence is shown.",
            },
          ],
        },
        {
          coach: "Put it together. The fear keeps growing because…",
          options: [
            {
              label: "…the thing itself keeps getting more dangerous",
              reply:
                "The party never changed, only the alarm’s file on it did. Relief fed the file; absence starved the correction.",
            },
            {
              label:
                "…relief rewards the skipping, and skipping starves the proof of safety",
              reply:
                "You solved it. Two gears, one loop, and the door out is the smallest version of showing up.",
            },
          ],
        },
      ],
      stamp:
        "“Relief teaches the alarm. Show up small, teach it something better.”",
    },
  },
  {
    id: "avoidance-pip-teach-back",
    nodeId: NODE_ID,
    orderIndex: 26,
    type: CourseExerciseCategoryEnum.TeachBackChain,
    concept: "avoidance_loop",
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.TeachBackChain,
      format: CourseExerciseCategoryEnum.TeachBackChain,
      completionMode: "direct",
      title: "Pip needs your help",
      instruction:
        "Pip’s stuck on something you just worked out. Build the explanation, tap the steps in order.",
      message:
        "Hey! I keep hearing that dodging the scary thing makes the alarm louder next time?? That makes no sense to me. Can you explain it? You know this stuff.",
      slotHints: ["first…", "then…", "so the brain…", "which means…"],
      steps: [
        {
          id: "brain-files",
          label:
            "brain files: “good thing we dodged, must’ve been real danger”",
          order: 3,
        },
        { id: "dodge", label: "you dodge the party", order: 1 },
        {
          id: "alarm-louder",
          label: "alarm gets set louder for next time",
          order: 4,
        },
        { id: "relief", label: "relief hits, fast", order: 2 },
      ],
      followUp: "Ohh… wait. But dodging feels better. So isn’t it… working?",
      followUpOptions: [
        {
          label: "It works for an hour, and teaches the alarm for a year",
          reply:
            "Ohhhh. It works for an hour and teaches the alarm for a year. That’s sneaky!! You’re really good at this.",
          takeaway:
            "Fast relief rewards avoidance, so the alarm returns louder next time.",
        },
        {
          label: "No, the relief is fake, you imagined it",
          reply:
            "Hmm, but the relief is real, right? It genuinely feels better… for a bit. So maybe: real relief now, bigger alarm later?",
          takeaway:
            "Pip helped you sharpen it: the relief is real AND it’s the payment that trains the alarm. Both true.",
        },
      ],
    },
  },
  {
    id: "stress-thirty-second-warmup",
    nodeId: NODE_ID,
    orderIndex: 27,
    type: CourseExerciseCategoryEnum.RecallWarmup,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.RecallWarmup,
      format: CourseExerciseCategoryEnum.RecallWarmup,
      title: "A 30-second warm-up",
      instruction: "Answer in your head, then reveal each card.",
      cards: [
        {
          question: "A racing heart under pressure is…",
          answer:
            "The alarm system doing its job, automatic, physical, and reversible.",
        },
        {
          question: "Between an event and a feeling sits…",
          answer:
            "An interpretation, fast, automatic, and worth a gentle check.",
        },
        {
          question: "Avoiding the scary thing feels like safety, but…",
          answer:
            "The relief teaches fear to grow. Small approach is what shrinks it.",
        },
      ],
      successPrimaryLabel: "Continue",
    },
  },
  {
    id: "body-signals-surge-diagram",
    nodeId: NODE_ID,
    orderIndex: 28,
    type: CourseExerciseCategoryEnum.SurgeDiagram,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.SurgeDiagram,
      format: CourseExerciseCategoryEnum.SurgeDiagram,
      completionMode: "direct",
      primaryLabel: "Got it, continue",
      title: "The surge, drawn",
      instruction: "Just read, nothing to answer.",
      diagramTitle: "The surge chemical in your body",
      peakLabel: "peaks fast",
      fadeLabel: "burns off on its own",
      axisLabel: "minutes →",
      explanation:
        "The spike feels enormous and clears in minutes. Nothing to fix, it’s a tide.",
      note: "You’ll name this chemical next.",
    },
  },
  {
    id: "body-signals-adrenaline-fill-blank",
    nodeId: NODE_ID,
    orderIndex: 29,
    type: CourseExerciseCategoryEnum.FillBlank,
    concept: "body_signals",
    isScored: true,
    content: {
      category: CourseExerciseCategoryEnum.FillBlank,
      format: CourseExerciseCategoryEnum.FillBlank,
      completionMode: "direct",
      title: "Complete the sentence",
      instruction: "Type the missing word. Close spellings count.",
      capability: "You can name the surge and trust it to pass.",
      variants: [
        {
          pre: "When the alarm fires, the body releases",
          post: ", the surge chemical behind a racing heart and cold hands.",
          answers: [
            "adrenaline",
            "adrenalin",
            "adrenline",
            "epinephrine",
            "adreneline",
          ],
          exampleWords: ["adrenaline", "serotonin", "melatonin"],
          correctFeedback:
            "Adrenaline powers the alarm: heart up, muscles primed, senses sharp. It burns off in minutes once the signal passes, which is why waves pass.",
          incorrectFeedback:
            "Not this one, it’s the surge chemical the alarm releases.",
          workedExample:
            "Adrenaline is the alarm’s fuel. It feels enormous and clears fast, the wave passes without you having to do anything perfectly.",
        },
        {
          pre: "The shaky, keyed-up feeling after a near-miss in traffic is",
          post: "still washing out of your system.",
          answers: [
            "adrenaline",
            "adrenalin",
            "adrenline",
            "epinephrine",
            "adreneline",
          ],
          exampleWords: ["adrenaline", "serotonin", "melatonin"],
          correctFeedback:
            "Yes, the shakes after a scare are leftover adrenaline clearing. Uncomfortable, harmless, and already on its way out.",
          incorrectFeedback: "Close, it’s the alarm’s surge chemical.",
          workedExample:
            "Adrenaline keeps working for minutes after the danger is gone. The trembling is the tide going out, not a new problem.",
        },
      ],
    },
  },
];
