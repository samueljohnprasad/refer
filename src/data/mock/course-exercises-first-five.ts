import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const FIRST_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "stress-guess-normal",
    nodeId: NODE_ID,
    orderIndex: 0,
    type: CourseExerciseCategoryEnum.GuessReveal,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.GuessReveal,
      format: CourseExerciseCategoryEnum.GuessReveal,
      title: "Take a guess",
      instruction: "No wrong answers — just your gut.",
      prompt:
        "Out of 10 adults, how many get tension headaches in a stressful month?",
      actual: 7,
      feedbackTitle: "The real number",
      primaryLabel: "See the answer",
      successPrimaryLabel: "Continue",
      feedback_correct:
        "About 7 in 10. Headaches, tight shoulders, and shallow sleep are common ways stress lives in the body. You are not the exception.",
      feedback_incorrect: "There is no wrong guess here.",
    },
  },
  {
    id: "stress-symptom-decoder",
    nodeId: NODE_ID,
    orderIndex: 1,
    type: CourseExerciseCategoryEnum.SymptomDecoder,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.SymptomDecoder,
      format: CourseExerciseCategoryEnum.SymptomDecoder,
      completionMode: "direct",
      primaryLabel: "Continue",
      waitingPrimaryLabel: "Tap the one that fits",
      title: "Which of these do you know?",
      instruction: "Tap the one that sounds most like you.",
      options: [
        {
          id: "early-bracing",
          label: "Sunday-evening dread, tight jaw by dinner",
          detail: "That is the alarm bracing early.",
          body: "Expected pressure can fire the same alarm as pressure itself. The timing is the clue: it keeps a weekly appointment.",
          next: "The next exercise shows how that alarm works.",
        },
        {
          id: "meeting-surge",
          label: "Heart racing in meetings, hands gone cold",
          detail: "That is a surge, not a malfunction.",
          body: "Adrenaline sends blood to the big muscles. Old wiring for physical threat can fire at a conference table.",
          next: "A later exercise shows the whole shape of the surge.",
        },
        {
          id: "night-processing",
          label: "Cannot switch my brain off at night",
          detail: "A timing problem, not a you problem.",
          body: "A day with no quiet moment can leave the mind to process everything when you finally reach bed.",
          next: "This unit later shows a parking brake for rumination.",
        },
        {
          id: "evening-snap",
          label: "Snapping at small things by evening",
          detail: "A full tank of alarm, with thin walls.",
          body: "When the alarm stays on all day, it sits close to the surface. Small sparks reach it quickly.",
          next: "A later exercise shows why recovery time matters.",
        },
      ],
    },
  },
  {
    id: "stress-alarm-cards",
    nodeId: NODE_ID,
    orderIndex: 2,
    type: CourseExerciseCategoryEnum.LearnCards,
    concept: "stress_response",
    isScored: true,
    content: {
      category: CourseExerciseCategoryEnum.LearnCards,
      format: CourseExerciseCategoryEnum.LearnCards,
      title: "Your alarm system",
      instruction: "Three short cards, then one quick recall.",
      primaryLabel: "Check answer",
      retryPhase: "recall",
      feedbackTitle: "Why it fits",
      feedbackTakeaway: "You can name what stress actually is.",
      cards: [
        {
          id: "alarm-not-flaw",
          kicker: "Card 1 of 3",
          title: "An alarm, not a flaw",
          body: "When your brain senses pressure, it turns on a built-in alarm. A racing heart, tight shoulders, and shallow breath mean the alarm is working — not that you are failing.",
        },
        {
          id: "body-signal",
          kicker: "Card 2 of 3",
          title: "The body carries the signal",
          body: "The alarm is physical. When it stays on, it can appear as headaches, a tight jaw, tiredness, or low mood. These are signals, not weakness.",
        },
        {
          id: "off-switch",
          kicker: "Card 3 of 3",
          title: "It has an off-switch",
          body: "The alarm is designed to settle when the signal passes. A slow exhale, naming the feeling, or one small action can tell the body the emergency is over.",
        },
      ],
      recall: {
        prompt: "Without looking back, what is a racing heart under pressure?",
        correctOptionId: "alarm",
        options: [
          { id: "alarm", label: "The alarm system doing its job" },
          { id: "medical", label: "A sign something is medically wrong" },
          { id: "failure", label: "Proof you cannot handle stress" },
        ],
      },
      feedback_correct:
        "Right — the surge is built-in equipment, the same in every body. It says nothing about your character.",
      feedback_incorrect:
        "Under pressure, a racing heart can be the alarm response: automatic, physical, and able to settle.",
      workedExample:
        "Stress symptoms are the body's alarm system. The response is automatic, physical, and designed to switch off when the signal passes.",
    },
  },
  {
    id: "stress-twin-case",
    nodeId: NODE_ID,
    orderIndex: 3,
    type: CourseExerciseCategoryEnum.TwinCase,
    concept: "stress_response",
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.TwinCase,
      format: CourseExerciseCategoryEnum.TwinCase,
      completionMode: "direct",
      primaryLabel: "Continue",
      waitingPrimaryLabel: "Match all four pairs",
      title: "Match the two machines",
      instruction:
        "A smoke alarm and your stress alarm work in similar ways. Tap left, then its partner on the right.",
      leftTitle: "Smoke alarm",
      rightTitle: "Your alarm",
      rightOrderIds: ["same-signal", "detector", "false-alarm", "real-threat"],
      pairs: [
        {
          id: "detector",
          left: "The detector on the ceiling",
          right: "Your threat system",
        },
        { id: "real-threat", left: "A real fire", right: "Real danger" },
        {
          id: "false-alarm",
          left: "Burnt toast sets it off",
          right: "A short email sets it off",
        },
        {
          id: "same-signal",
          left: "The same loud ring either way",
          right: "The same racing heart either way",
        },
      ],
      rule: "Your alarm is an oversensitive smoke detector.",
      body: "A loud ring doesn’t mean the fire is real — and a racing heart doesn’t mean the danger is. The alarm is doing its job; it’s just tuned too hot.",
      next: "Where the analogy breaks: a smoke alarm can’t learn. Yours can be retrained — that’s this whole course.",
    },
  },
  {
    id: "stress-intuition-check",
    nodeId: NODE_ID,
    orderIndex: 4,
    type: CourseExerciseCategoryEnum.IntuitionCheck,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.IntuitionCheck,
      format: CourseExerciseCategoryEnum.IntuitionCheck,
      completionMode: "direct",
      primaryLabel: "Continue",
      waitingPrimaryLabel: "Tap an answer above",
      title: "What does your gut say?",
      instruction: "Tap the one that feels true.",
      prompt:
        "Which fades faster — a feeling you fight, or a feeling you name?",
      options: [
        { id: "fight", label: "The one you fight" },
        { id: "name", label: "The one you name" },
      ],
      bestOptionId: "name",
      revealTitle: "What the research finds",
      reveal:
        "Your gut was right. Putting a feeling into words — “this is worry” — measurably turns the alarm down. Fighting it keeps the alarm’s full attention on it.",
      alternateReveal:
        "Most people guess this — the surprise is the lesson. Putting a feeling into words — “this is worry” — measurably turns the alarm down. Fighting it keeps the alarm’s full attention on it.",
    },
  },
];
