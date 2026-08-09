import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const NEXT_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "stress-name-it",
    nodeId: NODE_ID,
    orderIndex: 5,
    type: CourseExerciseCategoryEnum.NameIt,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.NameIt,
      format: CourseExerciseCategoryEnum.NameIt,
      title: "Name the feeling",
      instruction:
        "Whatever is around right now, or the last strong feeling you remember.",
      primaryLabel: "Tap the closest family",
      teach:
        "Naming turns the volume down, the same lever from the gut check, used on a real feeling. One precise word hands the alarm to the thinking brain.",
      families: [
        {
          name: "Scared",
          words: [
            { word: "Worried", description: "Mind rehearsing bad outcomes" },
            { word: "On edge", description: "Body braced, scanning for trouble" },
            { word: "Dread", description: "A looming thing, getting closer" },
            { word: "Panicky", description: "Alarm at full volume, right now" },
            { word: "Self-conscious", description: "Feeling watched and judged" },
          ],
        },
        {
          name: "Mad",
          words: [
            { word: "Irritated", description: "Small things grating on you" },
            { word: "Frustrated", description: "Blocked from what you want" },
            { word: "Resentful", description: "An unfairness you keep re-feeling" },
            { word: "Snappy", description: "Short fuse, quick sparks" },
            { word: "Steaming", description: "Anger with real heat behind it" },
          ],
        },
        {
          name: "Sad",
          words: [
            { word: "Flat", description: "The color drained out of things" },
            { word: "Disappointed", description: "A hoped-for thing fell through" },
            { word: "Lonely", description: "Wanting company that is not there" },
            { word: "Heavy", description: "Carrying weight through the day" },
            { word: "Hurt", description: "Someone’s words landed hard" },
          ],
        },
        {
          name: "Calm",
          words: [
            { word: "Settled", description: "Nothing tugging at you" },
            { word: "Relieved", description: "A weight just lifted" },
            { word: "Clear", description: "Quiet enough to think" },
            { word: "Cozy", description: "Safe, warm, unhurried" },
            { word: "Steady", description: "Grounded, even with noise around" },
          ],
        },
        {
          name: "Glad",
          words: [
            { word: "Content", description: "Quietly enough, just as is" },
            { word: "Excited", description: "Energy leaning toward something" },
            { word: "Proud", description: "You did the hard thing" },
            { word: "Grateful", description: "Warm toward what is here" },
            { word: "Playful", description: "Light, ready to laugh" },
          ],
        },
      ],
    },
  },
  {
    id: "stress-sunday-headache",
    nodeId: NODE_ID,
    orderIndex: 6,
    type: CourseExerciseCategoryEnum.CourseChoice,
    concept: "stress_response",
    isScored: true,
    content: {
      category: CourseExerciseCategoryEnum.CourseChoice,
      format: CourseExerciseCategoryEnum.CourseChoice,
      title: "Quick check",
      instruction: "Choose the best explanation.",
      context:
        "Every Sunday evening, Ravi gets a dull headache and a tight jaw as the work week approaches.",
      prompt: "What is the most likely reason?",
      primaryLabel: "Check answer",
      retryPhase: "choice",
      feedbackTitle: "Why it fits",
      feedbackTakeaway: "You can trace a body symptom back to the alarm.",
      workedExample:
        "The alarm fires on expected pressure too. Sunday evening means bracing for Monday, which holds the muscles tight and can create a tension headache.",
      options: [
        {
          id: "bracing",
          label: "His alarm system is already bracing for Monday",
          isCorrect: true,
          feedback:
            "Yes, expecting pressure fires the same alarm as pressure itself. Muscles brace, and held tension often becomes a headache.",
        },
        {
          id: "head-problem",
          label: "Something is wrong with his head",
          feedback:
            "A headache that keeps a weekly appointment often tracks stress. The Sunday-evening timing is the clue. New or unusual headaches are still worth a doctor’s check.",
        },
        {
          id: "personality",
          label: "He is not a relaxed enough person",
          feedback:
            "Relaxation is not a personality grade. His body is responding to a real signal, the approaching week.",
        },
        {
          id: "random",
          label: "Tension headaches strike at random",
          feedback:
            "This one keeps an appointment, Sunday, every week. The pattern points to the alarm system.",
        },
      ],
    },
  },
  {
    id: "stress-three-inboxes",
    nodeId: NODE_ID,
    orderIndex: 7,
    type: CourseExerciseCategoryEnum.InventFirst,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.InventFirst,
      format: CourseExerciseCategoryEnum.InventFirst,
      completionMode: "direct",
      title: "Three people. One email.",
      instruction:
        "Friday, 5pm. The same boss sends all three: “Can we talk Monday?” Choose the rule that fits.",
      primaryLabel: "Continue",
      waitingPrimaryLabel: "Tap the rule that fits best",
      cases: [
        { id: "sam", name: "Sam", reading: "· reads it as “I’m in trouble”", outcome: "chest tight, up till 1am" },
        { id: "priya", name: "Priya", reading: "· reads it as “scheduling for the offsite”", outcome: "forgets it by dinner", isCalm: true },
        { id: "ana", name: "Ana", reading: "· reads it as “the reorg news, finally”", outcome: "curious, sleeps fine", isCalm: true },
      ],
      options: [
        {
          id: "reading",
          label: "The body reacts to the reading of the message, not the message itself",
          isCorrect: true,
          feedback:
            "That is the one, three identical emails, three different stories, three different nights.",
        },
        {
          id: "job",
          label: "It comes down to how stressful the job is",
          feedback:
            "Reasonable theory, but same boss, same job, same email. Look at the one thing that differs: the reading.",
        },
        {
          id: "wired",
          label: "Some people are just wired to worry",
          feedback:
            "Tempting story, but Sam shrugged off the same kind of email last month. Same person, different reading, different night.",
        },
      ],
      rule: "You just invented the thought-feeling link.",
      body:
        "Psychologists call it appraisal: the alarm answers your interpretation of an event, not the event. Sam’s chest was reacting to “I’m in trouble”, a story written on no evidence.",
      next: "Next, see how this pattern appears in other situations.",
    },
  },
  {
    id: "stress-three-layers",
    nodeId: NODE_ID,
    orderIndex: 8,
    type: CourseExerciseCategoryEnum.LayerZoom,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.LayerZoom,
      format: CourseExerciseCategoryEnum.LayerZoom,
      completionMode: "direct",
      title: "One moment, three layers",
      instruction: "Tap to zoom in.",
      primaryLabel: "Zoom in",
      layers: [
        { kicker: "LAYER 1 · WHAT HAPPENED", title: "The event", body: "A friend leaves Mia’s message on read overnight." },
        { kicker: "LAYER 2 · WHAT THE BODY DID", title: "The alarm", body: "Chest tightens, stomach drops, the alarm fires within seconds." },
        { kicker: "LAYER 3 · WHAT THE STORY SAID", title: "The interpretation", body: "“She’s upset with me.” Written by the alarm, on no new evidence." },
      ],
      insight:
        "Every hard moment has these three layers: event, body, story. The event took one second, the story kept the alarm running. Seeing the layers apart is the skill this unit trains.",
    },
  },
  {
    id: "stress-same-email-dialogue",
    nodeId: NODE_ID,
    orderIndex: 9,
    type: CourseExerciseCategoryEnum.Dialogue,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.Dialogue,
      format: CourseExerciseCategoryEnum.Dialogue,
      completionMode: "direct",
      title: "Same email, two minds",
      instruction: "Tap through the conversation.",
      primaryLabel: "Next",
      messages: [
        { id: "sam-1", side: "left", name: "Sam", text: "Boss just emailed: “Can we talk Monday?” I can’t stop thinking about it." },
        { id: "priya-1", side: "right", name: "Priya", text: "I got the same email. Honestly assumed it is about the new project." },
        { id: "sam-2", side: "left", name: "Sam", text: "See, my brain went straight to “I’m in trouble.” Now my chest is tight." },
        { id: "priya-2", side: "right", name: "Priya", text: "Same words, though. Your body is not reacting to the email, it is reacting to your reading of it." },
      ],
      insight:
        "Same event, two readings, two different feelings. The email did not cause the tight chest, the interpretation did. That gap is where this unit works.",
    },
  },
];
