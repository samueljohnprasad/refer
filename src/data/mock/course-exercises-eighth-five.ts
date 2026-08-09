import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const EIGHTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "anxiety-science-in-one-breath",
    nodeId: NODE_ID,
    orderIndex: 35,
    type: CourseExerciseCategoryEnum.EvidenceBite,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.EvidenceBite,
      format: CourseExerciseCategoryEnum.EvidenceBite,
      completionMode: "direct",
      primaryLabel: "Continue",
      title: "The science, in one breath",
      instruction: "One finding, and how sure we are.",
      finding:
        "In lab studies, the adrenaline surge peaks within a couple of minutes, then falls on its own, no technique required.",
      confidence: "Strong",
      confidenceWhy:
        "“Strong” means measured directly and replicated for decades across stress-physiology research. Findings at this level almost never get overturned, you can build on it.",
      note: "One finding, honestly labelled, no overclaiming.",
    },
  },
  {
    id: "anxiety-surge-timer",
    nodeId: NODE_ID,
    orderIndex: 36,
    type: CourseExerciseCategoryEnum.SurgeTimer,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.SurgeTimer,
      format: CourseExerciseCategoryEnum.SurgeTimer,
      completionMode: "direct",
      primaryLabel: "Continue",
      title: "The surge has a timer",
      instruction:
        "Slide “minutes since the peak” and watch the chemistry clear itself.",
      numberToKeep:
        "the peak holds a couple of minutes at most, and about half the surge clears every three.",
    },
  },
  {
    id: "anxiety-why-the-wave-matters",
    nodeId: NODE_ID,
    orderIndex: 37,
    type: CourseExerciseCategoryEnum.WhyItMatters,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.WhyItMatters,
      format: CourseExerciseCategoryEnum.WhyItMatters,
      completionMode: "direct",
      primaryLabel: "Got it, continue",
      title: "Why it matters to you",
      instruction: "Just read, nothing to answer.",
      message:
        "Because the wave fades on its own, your only job at the peak is to wait it out.",
      explanation:
        "Roughly ninety seconds of riding it, feet on the floor, slow exhale, and the chemistry is already turning. You don’t have to win. You have to wait.",
    },
  },
  {
    id: "anxiety-four-eight-exhale",
    nodeId: NODE_ID,
    orderIndex: 38,
    type: CourseExerciseCategoryEnum.BreathingRound,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.BreathingRound,
      format: CourseExerciseCategoryEnum.BreathingRound,
      completionMode: "direct",
      primaryLabel: "Continue",
      title: "The 4–8 exhale",
      instruction:
        "The alarm’s volume knob, as a recipe. Try one round right here.",
      useFor: "For: turning the alarm down, in the moment",
      notFor: "Not for: arguing with the thought",
      steps: [
        { number: "4", label: "IN · NOSE" },
        { number: "8", label: "OUT · SLOW" },
        { number: "×3", label: "ROUNDS · ~40S" },
      ],
      mechanism:
        "The long exhale is the key, extended out-breaths fire the vagus nerve’s “we’re safe” signal harder than any hold. It talks to the alarm in its own language: body first.",
      variation:
        "If this one doesn’t click for you, that’s normal, not failure. Different nervous systems favor different tools; a later screen compares three.",
    },
  },
  {
    id: "anxiety-wave-retrigger-faq",
    nodeId: NODE_ID,
    orderIndex: 39,
    type: CourseExerciseCategoryEnum.WaveFaq,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.WaveFaq,
      format: CourseExerciseCategoryEnum.WaveFaq,
      completionMode: "direct",
      primaryLabel: "Got it, continue",
      title: "The question everyone asks",
      instruction: "Just read, nothing to answer.",
      question: "“What if I wait, and the wave doesn’t fade?”",
      answer:
        "Then it’s usually being re-triggered, a fresh worry throwing fuel on the alarm mid-fade. The wave still works the same way; it’s just restarting. Noticing the re-trigger is a skill, and a later unit trains it.",
    },
  },
];
