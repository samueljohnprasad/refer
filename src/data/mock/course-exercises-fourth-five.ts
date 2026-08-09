import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const FOURTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "low-mood-sams-week-episode-one",
    nodeId: NODE_ID,
    orderIndex: 15,
    type: CourseExerciseCategoryEnum.StorySerial,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.StorySerial,
      format: CourseExerciseCategoryEnum.StorySerial,
      completionMode: "direct",
      title: "Saturday, 11:04am",
      instruction:
        "A story in episodes — you choose for Sam. Both paths are honest; neither is the dumb one.",
      episodeLabel: "EPISODE 1 OF 7 · SAM’S WEEK",
      opening:
        "Sam’s been awake an hour. Curtains shut. Phone lights up: Jo — “brunch? no pressure”. Everything feels like sand.",
      branches: [
        {
          id: "stay",
          choice: "Stay in — recharge first, people later",
          label: "SAM STAYS IN",
          beats: [
            "Sam stays. And honestly? The duvet is genuinely kind for a while. Rest is real.",
            "4pm. The nap didn’t refill anything. Jo’s message is still open, heavier now. The day feels… sanded down.",
            "No villain here — Sam’s body did need rest this week. But as the only move, rest flattens instead of refills.",
          ],
        },
        {
          id: "walk",
          choice: "Ten-minute walk, then decide about Jo",
          label: "SAM WALKS",
          beats: [
            "Sam does not feel like it. Sam goes anyway — shoes, door, cold air. Ten minutes, that’s the whole deal.",
            "Minute 6: still meh. Minute 9: one degree lighter. Not fixed — lighter. The bar was never “fixed”.",
            "Back home, Sam replies to Jo: “brunch yes, 1pm?” The reply took no willpower. Weird how that works.",
          ],
        },
      ],
      reflectionPrompt: "One question before Sam’s Sunday: what moved first?",
      reflectionOptions: [
        {
          id: "feet-first",
          label: "Sam’s feet — the mood followed",
          feedback:
            "That’s the whole idea. Sam went while still meh — the mood caught up on the road.",
        },
        {
          id: "mood-first",
          label: "Sam’s mood lifted — then the feet moved",
          feedback:
            "It genuinely feels that way — but rewind the beats: Sam left the house at full meh. The feet moved first.",
        },
      ],
      stamp: "“Action first. Motivation follows.”",
      hook: "Episode 2 — Sunday, the hard morning — unlocks tomorrow. Sam will wait for you; no streaks, no catch-up.",
    },
  },
  {
    id: "stress-two-dials",
    nodeId: NODE_ID,
    orderIndex: 16,
    type: CourseExerciseCategoryEnum.TwoDialSandbox,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.TwoDialSandbox,
      format: CourseExerciseCategoryEnum.TwoDialSandbox,
      completionMode: "direct",
      title: "Two dials decide your week",
      instruction: "Twist both. Find all four states — one of them is a trap.",
      primaryLabel: "Continue",
      presets: [
        {
          id: "deadline",
          label: "Deadline week, skipped lunches",
          load: 88,
          recovery: 12,
        },
        {
          id: "protected",
          label: "Big week, protected evenings",
          load: 80,
          recovery: 72,
        },
        {
          id: "empty",
          label: "Empty weekend on the couch",
          load: 15,
          recovery: 22,
        },
        { id: "rested", label: "After a real day off", load: 25, recovery: 85 },
      ],
    },
  },
  {
    id: "stress-maya-alarm-model",
    nodeId: NODE_ID,
    orderIndex: 17,
    type: CourseExerciseCategoryEnum.ExplorableModel,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.ExplorableModel,
      format: CourseExerciseCategoryEnum.ExplorableModel,
      completionMode: "direct",
      title: "Put Maya’s alarm to rest",
      instruction:
        "A working model of one stressful day — open the hood, one lever at a time.",
      stories: [
        "It’s 11pm and Maya is wired. Nothing is wrong with her — so what happened? Open the hood of her day. Lever 1: the load. Drag it and watch the alarm tank fill.",
        "Lever 2 — the real break. A 20-minute walk at lunch spends alarm mid-day instead of banking it for tonight. Toggle it and watch 11pm change.",
        "Lever 3 — the 10pm replay. Rerunning the day throws fuel on the fade. The dashed line is the switch-off point: her mind lets go once the alarm drops under it. The verdict is live now.",
        "Sandbox — every lever open. Can you get her switched off by 11? Strand her past 1am? Recreate your last wired night — then fix it?",
      ],
      goals: [
        "Switched off by 11:15",
        "Now strand her past 1am",
        "Recreate YOUR last wired night — then fix it",
      ],
    },
  },
  {
    id: "low-mood-empty-couch-day",
    nodeId: NODE_ID,
    orderIndex: 18,
    type: CourseExerciseCategoryEnum.CourseChoice,
    concept: "low_mood_withdrawal_loop",
    isScored: true,
    content: {
      category: CourseExerciseCategoryEnum.CourseChoice,
      format: CourseExerciseCategoryEnum.CourseChoice,
      title: "Which explanation fits?",
      instruction:
        "Two are tempting. Choose the most accurate, least blaming one.",
      context:
        "It’s Saturday. Maya cancelled plans and has been on the couch all day, feeling flat and heavy.",
      prompt: "What’s the most accurate way to read this?",
      primaryLabel: "Check answer",
      retryPhase: "choice",
      feedbackTitle: "Why it fits",
      feedbackTakeaway: "You can separate a symptom from a character verdict.",
      workedExample:
        "Useful model: low mood → less energy → less doing → fewer good moments → lower mood. The lever is the smallest kind action, not self-criticism.",
      options: [
        {
          id: "symptom",
          label:
            "Low mood shrinks energy and appetite for things — the couch is a symptom, not a choice",
          isCorrect: true,
          feedback:
            "Yes. Low mood biologically dampens drive and pleasure, so everything costs more. Reading it as a symptom opens a lever: one small activity, chosen kindly.",
        },
        {
          id: "lazy",
          label: "She’s being lazy and letting people down",
          feedback:
            "That’s the character-flaw model. Laziness enjoys the couch; low mood doesn’t enjoy anything. Blame deepens the exact loop it blames her for.",
        },
        {
          id: "identity",
          label: "This is just who she is now",
          feedback:
            "The permanence model. Mood states move — especially when tiny, doable actions re-enter the day. A flat Saturday is a state, not an identity.",
        },
      ],
    },
  },
  {
    id: "thoughts-white-bear-experiment",
    nodeId: NODE_ID,
    orderIndex: 19,
    type: CourseExerciseCategoryEnum.WhiteBearExperiment,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.WhiteBearExperiment,
      format: CourseExerciseCategoryEnum.WhiteBearExperiment,
      completionMode: "direct",
      title: "A 10-second experiment",
      instruction:
        "Before any explanation — for the next ten seconds, whatever you do, do not think about a white bear.",
      options: [
        { id: "immediate", label: "I thought about the bear. Immediately." },
        {
          id: "monitoring",
          label: "I managed not to — by thinking about not thinking about it",
        },
      ],
      rule: "You just met the white bear effect.",
      body: "Suppressing a thought means monitoring for it — which rehearses it. This is exactly why “just stop worrying” fails at 2am: fighting thoughts manufactures more of them.",
      fix: "The counter-move is ahead: watching thoughts like clouds — without the fight.",
    },
  },
];
