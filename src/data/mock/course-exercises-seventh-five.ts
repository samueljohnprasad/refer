import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const SEVENTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "anxiety-place-a-bet",
    nodeId: NODE_ID,
    orderIndex: 30,
    type: CourseExerciseCategoryEnum.CuriosityBet,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.CuriosityBet,
      format: CourseExerciseCategoryEnum.CuriosityBet,
      title: "Place a bet",
      instruction: "Commit to a guess before the answer — that’s the trick.",
      question:
        "At its absolute peak, how long can a panic surge physically hold its highest intensity?",
      options: [
        "A few minutes at most",
        "About an hour",
        "As long as the worry lasts",
      ],
      bestAnswerIndex: 0,
      answer: "A few minutes.",
      feedbackTitle: "Why the peak can’t hold",
      feedback_correct:
        "The body can’t sustain the peak — adrenaline burns off on a built-in timer, whatever the worry is doing. The next card draws the whole shape.",
      successPrimaryLabel: "Continue",
    },
  },
  {
    id: "anxiety-panic-wave-commit",
    nodeId: NODE_ID,
    orderIndex: 31,
    type: CourseExerciseCategoryEnum.PanicWaveCommit,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.PanicWaveCommit,
      format: CourseExerciseCategoryEnum.PanicWaveCommit,
      completionMode: "direct",
      title: "The panic wave: commit your guess",
      instruction:
        "A panic wave hits and you do nothing — no fighting, no fleeing. How long until it mostly comes down? Commit before we run it.",
      rule: "The wave falls on its own.",
      shortGuess:
        "Close on the peak — it crests around 90 seconds. The tail takes longer: mostly down by ~10 minutes. Knowing both numbers is the skill: survive the 90, trust the 10.",
      closeGuess:
        "Good instinct. The peak is shorter than it feels — about 90 seconds — and the wave is mostly down by ~10 minutes, on its own.",
      longGuess:
        "Longer than reality — which is exactly how it feels from inside. The peak holds ~90 seconds; the wave is mostly down by ~10 minutes with zero effort from you.",
      neverGuess:
        "You committed to never — the belief most anxious brains hold at the peak. Now look at the curve: your body cannot hold that peak. Adrenaline crests around 90 seconds, and the wave is mostly down by ~10 minutes — with you doing nothing at all.",
      safetyNote:
        "Everyone’s wave is a bit different — and if yours feel unbearable, that’s a reason for support, never shame or a failed prediction.",
    },
  },
  {
    id: "anxiety-wave-sequence",
    nodeId: NODE_ID,
    orderIndex: 32,
    type: CourseExerciseCategoryEnum.WaveSequence,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.WaveSequence,
      format: CourseExerciseCategoryEnum.WaveSequence,
      completionMode: "direct",
      primaryLabel: "Got it — continue",
      title: "The anxiety wave",
      instruction: "Just read — nothing to answer.",
      steps: [
        "Trigger appears",
        "Alarm surges",
        "Peak — feels endless",
        "Fades on its own",
      ],
      rule: "The fade is built in.",
      explanation:
        "Adrenaline burns off whether or not you “handle it well”. The peak usually lasts minutes — your only job there is to wait it out.",
      note: "Next, you’ll rebuild this from memory.",
    },
  },
  {
    id: "anxiety-order-the-wave",
    nodeId: NODE_ID,
    orderIndex: 33,
    type: CourseExerciseCategoryEnum.WaveOrdering,
    concept: "anxiety_wave",
    isScored: true,
    content: {
      category: CourseExerciseCategoryEnum.WaveOrdering,
      format: CourseExerciseCategoryEnum.WaveOrdering,
      completionMode: "direct",
      title: "Order the wave",
      instruction:
        "Arrange the stages from the first flicker. Tap a chip to place it; tap a row to clear it.",
      capability: "You can ride a wave knowing where it’s going.",
      variants: [
        {
          prompt: "A wave of anxiety, if you don’t fight it:",
          answer: [
            "Trigger appears",
            "Alarm surges",
            "Peak — feels endless",
            "Fades on its own",
          ],
          pool: [
            "Fades on its own",
            "Alarm surges",
            "Trigger appears",
            "Peak — feels endless",
          ],
          clue: "It starts with a trigger.",
          correctFeedback:
            "That’s the whole wave — including the part where it fades by itself. Peaks feel endless; they’re usually minutes.",
          workedExample:
            "Trigger → surge → peak → fade. Fighting the peak feeds it; riding it teaches the body the alarm can stand down on its own.",
        },
        {
          prompt: "Same wave, fresh arrangement — from the first flicker:",
          answer: [
            "Trigger appears",
            "Alarm surges",
            "Peak — feels endless",
            "Fades on its own",
          ],
          pool: [
            "Peak — feels endless",
            "Trigger appears",
            "Fades on its own",
            "Alarm surges",
          ],
          clue: "Surge before peak; the fade needs no help.",
          correctFeedback:
            "Every wave has this shape. Knowing the fade is coming is what makes the peak survivable.",
          workedExample:
            "Trigger → surge → peak → fade. The fade is built in — adrenaline burns off whether or not you “handle it well”.",
        },
      ],
    },
  },
  {
    id: "anxiety-wave-scrubber",
    nodeId: NODE_ID,
    orderIndex: 34,
    type: CourseExerciseCategoryEnum.WaveScrubber,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.WaveScrubber,
      format: CourseExerciseCategoryEnum.WaveScrubber,
      completionMode: "direct",
      primaryLabel: "Continue",
      title: "One wave, up close",
      instruction:
        "Drag through ten minutes of a real wave — find the peak, and what the body does after it.",
      phases: [
        {
          until: 1,
          label: "Baseline",
          tone: "neutral",
          body: "An ordinary minute. Then a trigger — a message, a thought, a memory — and the alarm decides.",
        },
        {
          until: 2.5,
          label: "The climb",
          tone: "orange",
          body: "Adrenaline releasing — heart up, chest tight, thoughts speeding. From inside, it feels like it will rise forever. It won’t.",
        },
        {
          until: 3.2,
          label: "The peak",
          tone: "orange",
          body: "The worst of it. Physically, the body can hold this for only a couple of minutes — your one job here is to wait.",
        },
        {
          until: 6,
          label: "The fade — built in",
          tone: "olive",
          body: "Adrenaline burning off on its own timer, whether or not you “handle it well”.",
        },
        {
          until: 7.2,
          label: "An aftershock",
          tone: "orange",
          body: "A fresh worry throws fuel on mid-fade. A smaller wave — same shape, same ending.",
        },
        {
          until: 10.01,
          label: "The tide going out",
          tone: "olive",
          body: "Shaky, tired, harmless. The wave is over — and the body ended it without your help.",
        },
      ],
    },
  },
];
