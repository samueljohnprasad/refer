import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const TENTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "worry-two-am-conversation",
    nodeId: NODE_ID,
    orderIndex: 45,
    type: CourseExerciseCategoryEnum.SocraticDialogue,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.SocraticDialogue,
      format: CourseExerciseCategoryEnum.SocraticDialogue,
      completionMode: "direct",
      title: "A 2am conversation",
      instruction: "Choose the answer closest to your usual night.",
      supportTitle: "You matter more than any lesson.",
      supportBody:
        "If this heaviness has stayed with you or you feel unsafe, pause here and contact local crisis support or someone you trust.",
      terminalNote: "This reflection is private and is not a diagnosis.",
      nodes: {
        start: {
          message:
            "It’s 2am and your mind is running laps. No judgment, honest answer, what’s your usual move?",
          options: [
            { label: "grab my phone", next: "phone" },
            {
              label: "lie there, trying harder to stop thinking",
              next: "fight",
            },
            { label: "get up and jot the worries down", next: "pro" },
            {
              label: "honestly? lately it all feels kind of pointless",
              next: "guard",
            },
          ],
        },
        phone: {
          message:
            "Extremely common, 2am scrolling is basically a national sport. Quick check: after 20 minutes of it, is the worry usually quieter, or louder?",
          options: [
            {
              label: "louder, honestly",
              next: "notes",
              lead: "Right, and here’s the sneaky part: your brain was taking notes the whole time.",
            },
            {
              label: "quieter… I think?",
              next: "notes",
              lead: "Sometimes it does drown the worry out for a bit, but your brain was taking notes either way.",
            },
            {
              label: "honestly, can’t tell",
              next: "notes",
              lead: "Fair, it’s hard to see from inside. The notes got taken either way.",
            },
          ],
        },
        notes: {
          message:
            "If 2am keeps hosting the scroll-and-worry, night after night… what’s your brain learning 2am is for?",
          options: [
            {
              label: "worrying and scrolling, I guess",
              next: "land",
              lead: "Exactly. Brains file what happens, not what’s supposed to happen. Which points straight at the counter-move:",
            },
            {
              label: "sleep, obviously, it’s night",
              next: "land",
              lead: "You’d think! But brains file what happens, and lately 2am hosts the scroll. Which points at the counter-move:",
            },
          ],
        },
        fight: {
          message:
            "The classic, and you’ve met the white bear: the harder you push a thought away, the harder the mind monitors for it. Effort reads as threat. So while you’re lying there battling… what’s your brain learning 2am is for?",
          options: [
            {
              label: "…battling, I guess",
              next: "land",
              lead: "Exactly, it files 2am as the battling hour. Which is why the counter-move is the opposite of trying:",
            },
            {
              label: "winding down? it’s bedtime",
              next: "land",
              lead: "You’d think! But brains file what happens, not what’s supposed to, and lately 2am hosts the battle. So:",
            },
          ],
        },
        pro: {
          message:
            "You’ve already found the pro move, maybe without knowing why it works. Two things happen when a worry goes on paper: the fight stops (no more threat signal), and the worry gets a parking spot your brain trusts. Which surprises you more?",
          options: [
            {
              label: "the “parking spot it trusts” part",
              next: "land",
              lead: "That’s the deep one, a written worry with a slot tomorrow stops circling, because the brain knows it won’t be lost:",
            },
            {
              label: "the “fight = threat signal” part",
              next: "land",
              lead: "That one surprises most people, the effort itself keeps the alarm up. The paper does the rest:",
            },
          ],
        },
        land: {
          done: true,
          supportive: true,
          message:
            "Park it: write one line per worry in a notebook by the bed and give each one a time tomorrow. Then let the bed become a place for rest again.",
        },
        guard: {
          supportive: true,
          message:
            "Thank you for telling me that, it matters more than any lesson. Can I check: is that a passing 2am heaviness, or has it been sitting with you a while?",
          options: [
            { label: "it passes, I’m mostly just tired", next: "guardOk" },
            { label: "it’s been sitting a while", next: "guardCare" },
          ],
        },
        guardOk: {
          supportive: true,
          message:
            "Okay. Be extra gentle with yourself tonight, and the support door above is always there, no reason needed. Keep going, or stop here for tonight?",
          options: [
            { label: "keep going", next: "start" },
            { label: "stop here for tonight", next: "stop" },
          ],
        },
        stop: {
          done: true,
          supportive: true,
          message:
            "Good call. Rest well, the lesson will be right here tomorrow.",
        },
        guardCare: {
          support: true,
          supportive: true,
          message:
            "Then that deserves real support, not a worry lesson. Here’s what I can offer right now:",
          options: [
            {
              label: "I’m okay to continue the lesson",
              next: "start",
              lead: "Alright, and the door stays open the whole time.",
            },
          ],
        },
      },
    },
  },
  {
    id: "worry-phone-association",
    nodeId: NODE_ID,
    orderIndex: 46,
    type: CourseExerciseCategoryEnum.AssociationMeter,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.AssociationMeter,
      format: CourseExerciseCategoryEnum.AssociationMeter,
      completionMode: "direct",
      title: "What is the phone for at 11pm?",
      instruction:
        "Your brain keeps count, like Pavlov’s dog. Run a few evenings and watch the link move.",
      leftLabel: "phone = threat check",
      rightLabel: "phone = just a phone",
      initialCaption:
        "Right now the link is drifting left, every worry spike answered with a reread has been teaching it.",
      choices: [
        {
          label: "3 evenings: reread the message at every spike",
          delta: -18,
          caption:
            "Three more spike→check pairings filed. Pavlov doesn’t judge, he just counts. The phone is becoming a threat detector.",
        },
        {
          label: "3 evenings: note the urge, one exhale, let the spike pass",
          delta: 18,
          caption:
            "Urge noticed, not obeyed, and the spike passed anyway. Each round teaches the alarm: no check was needed.",
        },
      ],
      rule: "Your brain learns what the phone is for by what you do with it.",
      takeaway:
        "That’s the reconditioning behind every checking habit. Skipping the check isn’t willpower theater, it’s protecting the association that gives your evenings back.",
      waitingPrimaryLabel: "Run evenings until the link flips",
    },
  },
  {
    id: "worry-read-it-again",
    nodeId: NODE_ID,
    orderIndex: 47,
    type: CourseExerciseCategoryEnum.LensReplay,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.LensReplay,
      format: CourseExerciseCategoryEnum.LensReplay,
      completionMode: "direct",
      title: "The same three lines",
      instruction:
        "You read this moment at the start of the unit. Tap the highlights.",
      diaryLabel: "FROM THE START OF THIS UNIT",
      segments: [
        { text: "A friend leaves Mia’s message " },
        {
          text: "on read overnight",
          key: "THE EVENT",
          response:
            "One second of fact, and the only actual evidence in the whole moment.",
        },
        { text: ". Her " },
        {
          text: "chest tightens",
          key: "THE ALARM",
          response:
            "That’s the surge, adrenaline, step 2 of the wave. It peaks, then fades on its own.",
        },
        { text: " and sleep goes thin. " },
        {
          text: "“She’s upset with me.”",
          key: "THE STORY",
          response:
            "Written by the alarm on no new evidence, a draft worth checking, not a verdict.",
        },
      ],
      insight:
        "The event, alarm, and story are separate parts of the same moment. Naming each part makes the story easier to check.",
      waitingPrimaryLabel: "Tap the highlights above",
    },
  },
  {
    id: "worry-toolkit-shelf",
    nodeId: NODE_ID,
    orderIndex: 48,
    type: CourseExerciseCategoryEnum.ToolkitShelf,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.ToolkitShelf,
      format: CourseExerciseCategoryEnum.ToolkitShelf,
      completionMode: "direct",
      title: "Right tool, right moment",
      instruction:
        "The three levers you’ve met aren’t interchangeable. Tap a moment, the right one lights up.",
      tools: [
        { label: "Name it", use: "fog · anytime" },
        { label: "4–8 exhale", use: "body alarm · acute" },
        { label: "Five-minute version", use: "low mood · plans" },
      ],
      moments: [
        {
          label: "Chest banging ten minutes before the review",
          toolIndex: 1,
          key: "THE 4–8 EXHALE",
          response:
            "A body alarm needs a body lever. The exhale turns the volume down in seconds, naming can come after.",
        },
        {
          label: "A vague bad mood that’s followed you all afternoon",
          toolIndex: 0,
          key: "NAME IT",
          response:
            "Fog needs a label before anything else works. One precise word, “resentful”, “dread”, hands it to the thinking brain.",
        },
        {
          label: "Flat Sunday, thumb hovering over “sorry, can’t make it”",
          toolIndex: 2,
          key: "THE FIVE-MINUTE VERSION",
          response:
            "Low mood argues against the whole plan, so shrink the plan, not the day. Ten minutes of the walk still counts as a door.",
        },
      ],
      note: "These aren’t interchangeable, that’s the lesson.",
      waitingPrimaryLabel: "Tap a moment above",
    },
  },
  {
    id: "worry-match-levers",
    nodeId: NODE_ID,
    orderIndex: 49,
    type: CourseExerciseCategoryEnum.LeverMatch,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.LeverMatch,
      format: CourseExerciseCategoryEnum.LeverMatch,
      completionMode: "direct",
      title: "Match the levers",
      instruction:
        "Tap an item, then its real effect. Pairs settle when they match.",
      pairs: [
        { id: "avoidance", left: "Avoidance", right: "Grows the fear" },
        {
          id: "rumination",
          left: "Rumination",
          right: "Replays without solving",
        },
        {
          id: "small-action",
          left: "One small action",
          right: "Lifts mood a notch",
        },
        {
          id: "slow-exhale",
          left: "A slow exhale",
          right: "Turns the alarm down",
        },
      ],
      rightOrder: ["slow-exhale", "avoidance", "small-action", "rumination"],
      clue: "Start with the slow exhale, the body’s volume knob.",
      feedbackTitle: "Why it fits",
      feedback:
        "Avoidance grows fear, the relief trap. Rumination is the close wrong pairing: it feels like problem-solving but replays without solving. One small action lifts mood a notch. A slow exhale turns the alarm down directly, the one lever that works in seconds.",
      capability: "You can name what each habit really does.",
      waitingPrimaryLabel: "Match all pairs",
    },
  },
];
