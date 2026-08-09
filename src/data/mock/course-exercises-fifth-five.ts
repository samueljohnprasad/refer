import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const FIFTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "stress-try-harder-paradox",
    nodeId: NODE_ID,
    orderIndex: 20,
    type: CourseExerciseCategoryEnum.ParadoxCard,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.ParadoxCard,
      format: CourseExerciseCategoryEnum.ParadoxCard,
      completionMode: "direct",
      title: "Try harder. See what happens.",
      instruction: "A strategy that backfires — push the button and watch it.",
      expectation:
        "More effort → calmer. That’s how effort works everywhere else.",
      reality:
        "“CALM DOWN NOW” reads as a threat. Adrenaline answers. You get more wired.",
      openingCaption: "Heart thudding before the review. What’s your move?",
      captions: [
        "“I must calm down RIGHT NOW.” Your brain hears: emergency. A little adrenaline arrives.",
        "Now you’re monitoring your heartbeat. Is it slowing? Checking is more alarm.",
        "Jaw tight, breath high. Trying is doing the opposite of its job.",
        "Fully wired. The door spins as fast as you push it.",
      ],
      stopCaption:
        "You stop fighting it — feet on the floor, one long exhale, let the wave be a wave. Unpushed, the system stands down on its own.",
      rule: "“Calm is a revolving door. The harder you push, the faster it spins.”",
      takeaway:
        "Stopping the push isn’t giving up — it’s the mechanism. The wave fades by itself; effort is the one thing that keeps it fed.",
    },
  },
  {
    id: "avoidance-one-idea",
    nodeId: NODE_ID,
    orderIndex: 21,
    type: CourseExerciseCategoryEnum.OneLineReveal,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.OneLineReveal,
      format: CourseExerciseCategoryEnum.OneLineReveal,
      completionMode: "direct",
      title: "One idea",
      instruction: "Tap to complete the thought.",
      firstLine: "Avoiding the scary thing feels like safety…",
      secondLine: "…but the relief teaches fear to grow.",
      why: "Every avoided thing hands the alarm a receipt: “that really was dangerous”. Small approach — not bravery — is what shrinks it. The next exercise shows the loop.",
    },
  },
  {
    id: "avoidance-skip-party-experiment",
    nodeId: NODE_ID,
    orderIndex: 22,
    type: CourseExerciseCategoryEnum.WhatIfMachine,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.WhatIfMachine,
      format: CourseExerciseCategoryEnum.WhatIfMachine,
      completionMode: "direct",
      title: "What if you skip the party?",
      instruction:
        "You’re dreading it, and you skip it. Predict first — then run it.",
      options: [
        { id: "shrinks", label: "The fear of the next one shrinks" },
        { id: "same", label: "It stays about the same" },
        { id: "grows", label: "It grows" },
      ],
      steps: [
        "8:00pm — you send “so sorry, can’t make it”. Relief lands in seconds. Real relief.",
        "The brain files the receipt: skipping = safety. Fast relief is the strongest teacher it has.",
        "Next invite — the alarm fires earlier and louder. The party grew scarier while you weren’t looking.",
        "A month on — the “safe” circle has quietly shrunk by one more room.",
      ],
      rule: "Avoidance trades one evening of relief for a louder alarm.",
      takeaway:
        "This one fools almost everyone, because the relief is genuine — that’s exactly why it teaches so well. The counter-move is unchanged: the smallest version of showing up.",
    },
  },
  {
    id: "avoidance-rebuild-worry-loop",
    nodeId: NODE_ID,
    orderIndex: 23,
    type: CourseExerciseCategoryEnum.GuidedRecallChips,
    concept: "avoidance_loop",
    isScored: true,
    content: {
      category: CourseExerciseCategoryEnum.GuidedRecallChips,
      format: CourseExerciseCategoryEnum.GuidedRecallChips,
      title: "Rebuild the loop",
      instruction: "Tap the chips in order. Tap a placed chip to remove it.",
      prompt: "How avoidance feeds worry, from the first spike:",
      answer: [
        "Worry spikes",
        "Avoid the thing",
        "Quick relief",
        "Worry grows stronger",
      ],
      chips: [
        "Quick relief",
        "Think positive",
        "Worry spikes",
        "Just relax",
        "Avoid the thing",
        "Worry grows stronger",
      ],
      primaryLabel: "Check answer",
      successPrimaryLabel: "Continue",
      waitingPrimaryLabel: "Build all four steps",
      retryPhase: "order",
      feedbackTitle: "Why it fits",
      feedbackTakeaway: "You can draw the loop that keeps worry alive.",
      feedback_correct:
        "Relief is the trap — it rewards avoiding, so next time the worry is louder. The leftover chips are the point: “just relax” and “think positive” aren’t in the loop, and they don’t break it. Small approach does.",
      feedback_incorrect:
        "Some steps are out of place. Look at where the chain starts and ends.",
      workedExample:
        "Worry spikes → avoid the thing → quick relief → worry grows stronger. Relief teaches the brain the thing really was dangerous.",
    },
  },
  {
    id: "avoidance-safety-behavior-term",
    nodeId: NODE_ID,
    orderIndex: 24,
    type: CourseExerciseCategoryEnum.TermChip,
    concept: "avoidance_loop",
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.TermChip,
      format: CourseExerciseCategoryEnum.TermChip,
      completionMode: "direct",
      primaryLabel: "Got it — continue",
      title: "Safety behavior",
      instruction: "One term — tap the example and the non-example.",
      word: "Safety behavior",
      definition:
        "A just-in-case move that makes you feel safe when you already are safe.",
      panels: [
        {
          id: "example",
          label: "EXAMPLE · TAP TO SEE WHY",
          revealLabel: "WHY IT COUNTS",
          example:
            "Only going to the party if a friend stays glued to your side.",
          explanation:
            "It works tonight — and quietly teaches the alarm the party was survivable only because of the escort.",
        },
        {
          id: "non-example",
          label: "NOT AN EXAMPLE · TAP TO SEE WHY",
          revealLabel: "WHY IT DOESN’T",
          example: "Taking one slow breath before you walk in.",
          explanation:
            "Calming the body dodges nothing — you still fully show up, so the alarm learns the room itself is fine.",
        },
      ],
      note: "This chip comes back in later exercises — same words, same shape.",
    },
  },
];
