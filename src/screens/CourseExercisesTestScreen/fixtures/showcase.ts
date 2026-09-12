import type { Exercise } from "@/src/types/journeyV5";
import { priorityMicrolearningFixtures } from "./priority";

// ponytail: fixture definitions for showcase exercises
const teachBackChainFixture = priorityMicrolearningFixtures.find(
  (fixture) => fixture.id === "fixture-teach-back-chain",
);

export const showcaseMicrolearningFixtures: readonly Exercise[] = [
  ...(teachBackChainFixture ? [teachBackChainFixture] : []),
  {
    id: "fixture-symptom-decoder",
    nodeId: "fixture-showcase-node",
    orderIndex: 4,
    type: "symptom_decoder",
    isScored: false,
    content: {
      title: "Decoding body alarms",
      instruction: "Tap the symptom that feels most familiar.",
      options: [
        {
          id: "heart-racing",
          label: "Heart racing or pounding",
          detail: "YOUR BODY’S ALARM RESPONSE",
          body: "A racing pulse can happen when your body’s alarm system switches on.\n\nA strong body sensation can feel scary without telling you, by itself, how dangerous the situation is.",
        },
        {
          id: "tight-chest",
          label: "Tight chest or shallow breathing",
          detail: "YOUR BODY’S ALARM RESPONSE",
          body: "Chest muscles often tighten and breathing shifts shallow as your body gears up to react.\n\nBreathing changes can feel alarming even when your body is simply trying to bring in more air.",
        },
        {
          id: "stomach-knot",
          label: "Stomach drop or nausea",
          detail: "YOUR BODY’S ALARM RESPONSE",
          body: "Blood flow moves away from digestion toward major muscles so you can respond quickly.\n\nThat sudden sinking feeling is your system reallocating energy, not a sign of physical illness.",
        },
        {
          id: "tingling",
          label: "Dizziness or tingling fingers",
          detail: "YOUR BODY’S ALARM RESPONSE",
          body: "Rapid or shallow breathing shifts oxygen and carbon dioxide levels in your bloodstream.\n\nLightheaded sensations can feel intense without meaning that you are losing control.",
        },
      ],
    },
  },
  {
    id: "fixture-term-chip",
    nodeId: "fixture-showcase-node",
    orderIndex: 5,
    type: "term_chip",
    isScored: false,
    content: {
      title: "Key alarm concepts",
      instruction: "Tap each term to reveal its meaning.",
      chips: [
        {
          id: "chip-false-alarm",
          label: "False alarm",
          details:
            "A protective survival response triggered when no actual physical danger exists.",
        },
        {
          id: "chip-catastrophizing",
          label: "Catastrophizing",
          details:
            "Assuming the absolute worst possible outcome is both guaranteed and unmanageable.",
        },
        {
          id: "chip-safety-behavior",
          label: "Safety behavior",
          details:
            "Actions taken to feel safe (like checking or fleeing) that accidentally keep the fear alive.",
        },
        {
          id: "chip-habituation",
          label: "Habituation",
          details:
            "The natural biological process where the nervous system calms down when you stay put.",
        },
      ],
    },
  },
  {
    id: "fixture-two-dial-sandbox",
    nodeId: "fixture-showcase-node",
    orderIndex: 6,
    type: "two_dial_sandbox",
    isScored: false,
    content: {
      title: "Two dials shape your week",
      instruction: "Adjust demand and recovery to see how the system reacts.",
      primaryLabel: "Continue",
      successPrimaryLabel: "Continue",
      rule: "THE PATTERN",
      takeaway:
        "Demand alone doesn’t decide how the week feels.\n\nRecovery changes what the same demand costs you.",
    },
  },
  {
    id: "fixture-wave-faq",
    nodeId: "fixture-showcase-node",
    orderIndex: 7,
    type: "wave_faq",
    isScored: false,
    content: {
      title: "Why did the alarm return?",
      instruction: "A common question after a panic wave.",
      question: "Why did the anxiety come back just when I started to relax?",
      answer:
        "After a surge peaks, your nervous system remains alert for second waves. A small normal body sensation (like taking a deep breath) can re-trigger a mini-spike. It is an echo, not starting from zero.",
      message: "Surges often come with echoes.",
      explanation: "Expecting minor echoes keeps you from reacting with fresh alarm.",
    },
  },
  {
    id: "fixture-wave-ordering",
    nodeId: "fixture-showcase-node",
    orderIndex: 8,
    type: "wave_ordering",
    isScored: false,
    content: {
      title: "Order the panic wave",
      instruction: "Put the phases of a surge in chronological order.",
      variants: [
        {
          prompt: "Arrange what happens as an anxiety surge runs its course:",
          clue: "Adrenaline spikes quickly, but the parasympathetic system inevitably activates.",
          correctFeedback:
            "Spot on! The body triggers, peaks rapidly, then metabolizes adrenaline back to baseline.",
          workedExample:
            "First comes the initial surge trigger, then the rapid peak, followed by gradual dissipation.",
          answer: [
            "Initial trigger senses threat",
            "Adrenaline surge peaks",
            "Parasympathetic brakes kick in",
            "Body returns to baseline",
          ],
          pool: [
            "Adrenaline surge peaks",
            "Body returns to baseline",
            "Initial trigger senses threat",
            "Parasympathetic brakes kick in",
          ],
        },
      ],
    },
  },
  {
    id: "fixture-wave-scrubber",
    nodeId: "fixture-showcase-node",
    orderIndex: 9,
    type: "wave_scrubber",
    isScored: false,
    content: {
      title: "One wave, up close",
      instruction: "Drag through the wave to see how it shifts.",
      phases: [
        {
          label: "The Trigger & Climb",
          body: "Adrenaline dumps into the bloodstream. Heart accelerates and breathing quickens.",
          tone: "orange",
          until: 2.5,
        },
        {
          label: "The Peak",
          body: "Intensity reaches its physiological ceiling. The body cannot sustain higher adrenaline.",
          tone: "orange",
          until: 4.5,
        },
        {
          label: "The Fade",
          body: "Liver begins clearing adrenaline. Muscles unclench and pulse slows down.",
          tone: "olive",
          until: 7.5,
        },
        {
          label: "The Echo & Baseline",
          body: "Parasympathetic system restores balance. You feel tired but safe.",
          tone: "olive",
          until: 10,
        },
      ],
    },
  },
] as unknown as Exercise[];
