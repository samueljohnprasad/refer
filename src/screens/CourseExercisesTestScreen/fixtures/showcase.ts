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
      instruction: "A second wave can feel like you're back at the beginning.",
      scenario: "“I was finally calming down.\nWhy is the anxiety coming back?”",
      prompt: "WHAT MIGHT EXPLAIN IT?",
      options: [
        {
          id: "danger-present",
          label: "The returning anxiety means the danger is still there",
          isCorrect: false,
        },
        {
          id: "body-sensation",
          label: "A body sensation may have been read as danger again",
          isCorrect: true,
        },
      ],
      mechanism: [
        "The first wave eases",
        "A body sensation appears",
        "“Is it happening again?”",
        "The sensation gets read as danger",
        "The alarm rises again",
      ],
      insight: {
        eyebrow: "THE IDEA",
        title: "Another wave doesn't mean you're back at the beginning.",
        body: "A body sensation can set off another alarm when it gets read as danger.\n\nThe returning alarm isn't, by itself, proof that danger returned.",
      },
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
          clue: "The alarm rises, reaches a peak, and then begins to settle.",
          correctFeedback:
            "A panic surge changes over time. The alarm rises, reaches a peak, and then begins to settle.",
          workedExample:
            "First something feels threatening, then alarm response rises, reaches a peak, and begins to settle.",
          answer: [
            "Something feels threatening",
            "The body's alarm response rises",
            "The surge reaches a peak",
            "The body begins to settle",
          ],
          pool: [
            "The surge reaches a peak",
            "The body begins to settle",
            "The body's alarm response rises",
            "Something feels threatening",
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
      instruction: "Drag through the wave to see how it changes.",
      phases: [
        {
          label: "EARLY RISE",
          body: "The alarm is switching on.\nThe sensations can build quickly.",
          tone: "olive",
          until: 2.0,
        },
        {
          label: "PEAK",
          body: "The alarm is at its strongest.\n\nStrong sensations can feel convincing, even when they aren't proof of danger.",
          tone: "olive",
          until: 3.8,
        },
        {
          label: "SETTLING",
          body: "The surge is beginning to ease.\n\nYour body may still feel activated while the alarm comes down.",
          tone: "olive",
          until: 6.0,
        },
        {
          label: "ANOTHER RISE",
          body: "A sensation or worried thought can push the alarm upward again.\n\nAnother rise doesn't mean you're back at the beginning.",
          tone: "olive",
          until: 7.5,
        },
        {
          label: "SETTLING AGAIN",
          body: "The alarm is easing again.\n\nWaves can rise and fall more than once.",
          tone: "olive",
          until: 10,
        },
      ],
    },
  },
  {
    id: "fixture-wave-sequence",
    nodeId: "fixture-showcase-node",
    orderIndex: 10,
    type: "wave_sequence",
    isScored: false,
    content: {
      title: "The anxiety wave",
      instruction: "How an anxiety surge moves through your body.",
      steps: [
        "Uncertainty triggers an alarm signal",
        "Adrenaline surges into your bloodstream",
        "Body sensations peak in intensity",
        "Your system metabolises the chemical burst",
        "Sensations settle back to baseline",
      ],
      rule: "THE NATURAL ARC",
      explanation:
        "No surge stays at peak indefinitely. Every wave has a chemical half-life and begins to settle on its own.",
    },
  },
  {
    id: "fixture-why-it-matters",
    nodeId: "fixture-showcase-node",
    orderIndex: 11,
    type: "why_it_matters",
    isScored: false,
    content: {
      title: "Why it matters",
      instruction: "Turn the wave model into one usable rule.",
      message: "You do not need to fight the surge.",
      explanation:
        "When you realise adrenaline has a natural half-life, you stop trying to force the feeling to stop immediately. Giving the wave permission to crest takes away the fear that feeds it.",
    },
  },
  {
    id: "fixture-recall-warmup",
    nodeId: "fixture-showcase-node",
    orderIndex: 12,
    type: "recall_warmup",
    isScored: false,
    content: {
      category: "recall_warmup",
      format: "recall_warmup",
      title: "Recall Warmup",
      instruction: "Try to remember the answer, then reveal it.",
      cards: [
        {
          id: "card-1",
          conceptId: "stimulus-control",
          question:
            "What guides a stimulus-control response: elapsed minutes or the experience of wakefulness and frustration?",
          answer:
            "The experience of wakefulness and frustration. There is no fixed clock threshold.",
        },
        {
          id: "card-2",
          conceptId: "clock-threshold",
          question:
            "Why is waiting for a specific elapsed minute count counterproductive during bedtime wakefulness?",
          answer:
            "Clock-watching fuels frustration and cognitive effort, keeping the body in an alert state.",
        },
      ],
    },
  },
] as unknown as Exercise[];
