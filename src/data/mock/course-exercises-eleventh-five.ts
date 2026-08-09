import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import type { Exercise } from "@/src/types/journeyV5";

const NODE_ID = "steady-mind-stress-basics";

export const ELEVENTH_FIVE_COURSE_EXERCISES: Exercise[] = [
  {
    id: "levers-put-it-to-work",
    nodeId: NODE_ID,
    orderIndex: 50,
    type: CourseExerciseCategoryEnum.LeverScenario,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.LeverScenario,
      format: CourseExerciseCategoryEnum.LeverScenario,
      completionMode: "direct",
      title: "Put it to work",
      instruction: "A real moment, pick what would actually help.",
      capability: "You can pick the right lever in a live moment.",
      variants: [
        {
          sceneLabel: "THURSDAY · 11PM",
          scene:
            "Tomorrow is Noor’s performance review. She’s in bed, heart thudding, rereading old emails for “evidence”, and considering calling in sick.",
          prompt: "Which move would genuinely help tonight?",
          clue: "One option feeds a loop you’ve seen. One is a lever that works in seconds.",
          worked:
            "Calling in sick is the avoidance loop, relief now, louder alarm later. Rereading is rumination, replays without solving. The lever that works at 11pm is the body one: slow exhales turn the alarm down, and the wave fades on its own.",
          options: [
            {
              id: "exhale",
              label: "Put the phone down and take ten slow exhales",
              isCorrect: true,
              feedback:
                "Yes, that’s the alarm’s volume knob. The wave peaks and fades on its own; her job tonight is to stop feeding it and wait it out.",
            },
            {
              id: "avoid",
              label: "Call in sick to skip the review",
              feedback:
                "Relief tonight, louder alarm next time, that’s the avoidance loop you rebuilt with the chips.",
            },
            {
              id: "reread",
              label: "Keep rereading the emails until she feels certain",
              feedback:
                "Rumination, it feels like preparing, but it replays without solving, and keeps the alarm fed.",
            },
          ],
        },
        {
          sceneLabel: "SUNDAY · 4PM",
          scene:
            "Jon has been flat all weekend. A friend texts about a short walk. He starts typing “sorry, not up for it today”.",
          prompt: "What’s the most useful move?",
          clue: "Which option shrinks the action instead of cancelling it?",
          worked:
            "Cancelling feeds the low-mood loop: skip → emptier day → lower mood. The lever is the smallest version of the thing, action first, motivation follows.",
          options: [
            {
              id: "five-minute",
              label: "Counter-offer the five-minute version of the walk",
              isCorrect: true,
              feedback:
                "Right, the smallest action is the door out of the loop. Motivation usually shows up after he’s moving, not before.",
            },
            {
              id: "wait",
              label: "Wait until he genuinely feels like going",
              feedback:
                "Low mood argues against the exact things that lift it, waiting for motivation feeds the loop.",
            },
            {
              id: "full-day",
              label: "Push himself to commit to a full afternoon out",
              feedback:
                "Too big a jump usually fails and adds a self-verdict on top. The kind move is smaller, not harder.",
            },
          ],
        },
      ],
      waitingPrimaryLabel: "Check answer",
    },
  },
  {
    id: "thought-autopsy-worked-rewrite",
    nodeId: NODE_ID,
    orderIndex: 51,
    type: CourseExerciseCategoryEnum.WorkedRewrite,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.WorkedRewrite,
      format: CourseExerciseCategoryEnum.WorkedRewrite,
      completionMode: "direct",
      title: "Autopsy of a 2am thought",
      instruction:
        "Watch the four moves of a thought record on a thought everyone has. Next screen, you build one yourself.",
      rows: [
        {
          tone: "orange",
          label: "THE THOUGHT · 2:14AM",
          text: "“If I mess up the review, that’s it, they’ll finally see I can’t do this.”",
          coach: "Move 1: catch it and write it down exactly. No editing yet.",
        },
        {
          tone: "neutral",
          label: "MOVE 2 · EVIDENCE FOR",
          text: "“Reviews matter. Feedback can sting. My brain isn’t inventing the stakes.”",
          coach: "Respect the thought, your brain has reasons. No strawmen.",
        },
        {
          tone: "neutral",
          label: "MOVE 3 · EVIDENCE AGAINST",
          text: "“Every past review: fine or better. Nobody’s watching for my downfall, they’re busy with their own.”",
          coach:
            "Check the record, not the feeling. History beats 2am predictions.",
        },
        {
          tone: "olive",
          label: "MOVE 4 · THE REALISTIC THOUGHT",
          text: "“I’ll be nervous and prepared. Some parts will go well; one might not. Nothing ends.”",
          coach:
            "Calibrated, not cheerful, “nervous and prepared” is believable at 2am; “it’ll be great!” is not.",
        },
      ],
      finalNote:
        "Next: the same record with training wheels, then you build one solo.",
    },
  },
  {
    id: "thought-record-training-wheels",
    nodeId: NODE_ID,
    orderIndex: 52,
    type: CourseExerciseCategoryEnum.FadedThoughtRecord,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.FadedThoughtRecord,
      format: CourseExerciseCategoryEnum.FadedThoughtRecord,
      completionMode: "direct",
      title: "Training wheels off, slowly",
      instruction: "Watch → fill one → do most of it. Nothing here is scored.",
      screens: [
        {
          title: "Watch one, fully done",
          label: "SCREEN 1 OF 3 · WATCH",
          coach:
            "Four moves. Watch how each works, next screen, one becomes yours.",
          rows: [
            {
              kind: "thought",
              label: "THE THOUGHT",
              text: "“I completely failed that presentation. I’m a failure.”",
            },
            {
              kind: "for",
              label: "EVIDENCE FOR",
              text: "“I stumbled in the middle. A few people looked bored.”",
            },
            {
              kind: "against",
              label: "EVIDENCE AGAINST",
              text: "“I finished it. Two people asked follow-ups. Last month’s went fine.”",
            },
            {
              kind: "realistic",
              label: "THE REALISTIC THOUGHT",
              text: "“Rough middle, not a failed talk. I’ll tighten the demo next time.”",
            },
          ],
        },
        {
          title: "Your turn: one step",
          label: "SCREEN 2 OF 3 · FILL ONE",
          coach:
            "Pick the real evidence-against. Careful, two of these are the thought talking, not evidence.",
          rows: [
            {
              kind: "thought",
              label: "THE THOUGHT",
              text: "“I let the whole team down.”",
            },
            {
              kind: "for",
              label: "EVIDENCE FOR",
              text: "“The deadline did slip, and it affected others.”",
            },
            {
              kind: "against",
              label: "EVIDENCE AGAINST",
              text: "your move, pick below",
              slot: "evidence",
            },
            {
              kind: "realistic",
              label: "THE REALISTIC THOUGHT",
              text: "(unlocks when you pick)",
              slot: "realistic",
            },
          ],
          evidenceOptions: [
            {
              text: "“The slip had three causes, I was one part, not the whole story.”",
              isCorrect: true,
              feedback:
                "Yes, that counts. It’s checkable: you can list the three causes. The realistic thought unlocks…",
            },
            {
              text: "“Everyone secretly agrees I ruined it.”",
              feedback:
                "That’s the thought talking, “secretly” can’t be checked. Evidence must be checkable to count.",
            },
            {
              text: "“Deadlines don’t matter anyway.”",
              feedback:
                "Comforting, but not true, and evidence has to be true to hold up at 2am. Try again.",
            },
          ],
          realisticAfter:
            "“I contributed to a slip with several causes. I’ll flag risks earlier next time.”",
        },
        {
          title: "Almost solo: skeleton only",
          label: "SCREEN 3 OF 3 · DO MOST OF IT",
          coach: "Just the frame now. Two moves are yours.",
          rows: [
            {
              kind: "thought",
              label: "THE THOUGHT",
              text: "“Nothing I do works.”",
            },
            {
              kind: "for",
              label: "EVIDENCE FOR",
              text: "“The last two things I tried didn’t pan out.”",
            },
            {
              kind: "against",
              label: "EVIDENCE AGAINST",
              text: "pick below",
              slot: "evidence",
            },
            {
              kind: "realistic",
              label: "THE REALISTIC THOUGHT",
              text: "(then this one)",
              slot: "realistic",
            },
          ],
          evidenceOptions: [
            {
              text: "“Two things failing ≠ everything failing, the walk last week helped, checkably.”",
              isCorrect: true,
              feedback:
                "Counts, specific and checkable. Now the realistic thought: calibrated, not cheerful.",
            },
            {
              text: "“I’m sure it’ll all magically work out.”",
              feedback:
                "That’s cheerfulness, not evidence, it won’t hold up when tested. Pick the checkable one.",
            },
          ],
          realisticOptions: [
            {
              text: "“A rough patch, with two data points, not a verdict on me.”",
              isCorrect: true,
              feedback:
                "That’s the skill. Believable beats sunny, you just ran a thought record nearly solo.",
            },
            {
              text: "“Everything is actually amazing!”",
              feedback:
                "Too sunny to believe at 2am, realistic thoughts must be calibrated. Try the other.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "thought-build-fairer-thought",
    nodeId: NODE_ID,
    orderIndex: 53,
    type: CourseExerciseCategoryEnum.ReframeBuilder,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.ReframeBuilder,
      format: CourseExerciseCategoryEnum.ReframeBuilder,
      completionMode: "direct",
      title: "Build a fairer thought",
      instruction:
        "Not a nicer thought, one with more of the picture in it. Take one line from each tray.",
      sceneLabel: "BACK TO THURSDAY · 11PM",
      scene:
        "Noor again, night before the review, phone finally down. One thought is still up at full size:",
      hotThought: "“I’ll blow the review and everyone will see it.”",
      trays: [
        {
          label: "EVIDENCE · WHAT THE RECORD SAYS",
          options: [
            "my past reviews have gone fine",
            "one anxious night isn’t a verdict",
          ],
        },
        {
          label: "PERSPECTIVE · THE WIDER SHOT",
          options: [
            "everyone’s busy with their own review",
            "nerves show far less than they feel",
          ],
        },
        {
          label: "KIND COACH · WHAT YOU’D TELL A FRIEND",
          options: [
            "I can be shaky and still show up",
            "I don’t need to feel ready to start",
          ],
        },
      ],
      feedbackTitle: "More of the picture",
      feedback:
        "The hot thought didn’t get deleted, it got company, and it shrank on its own. That’s the whole move: never “your thought was wrong”, just a fairer one with more of the picture, sitting alongside. As mastery grows, the trays offer fewer chips, until it’s your own words.",
      waitingPrimaryLabel: "Pick one line from each tray",
    },
  },
  {
    id: "thought-same-day-two-sentences",
    nodeId: NODE_ID,
    orderIndex: 54,
    type: CourseExerciseCategoryEnum.SituationLanguage,
    isScored: false,
    content: {
      category: CourseExerciseCategoryEnum.SituationLanguage,
      format: CourseExerciseCategoryEnum.SituationLanguage,
      completionMode: "direct",
      title: "Same day. Two sentences.",
      instruction:
        "Flip the switch and watch what each phrasing quietly trains.",
      cards: [
        {
          identityText: "“I’m an anxious person.”",
          situationText: "“I’m feeling anxious right now.”",
          identityWhy:
            "Identity language. Every wave becomes evidence: “proof this is who I am.” The story hardens each time it’s repeated.",
          situationWhy:
            "Situation language. A wave becomes a data point with a fix attached, same facts, room to move.",
        },
        {
          identityText: "“I’m just lazy.”",
          situationText:
            "“I’m in a low-energy week, and I know one of the reasons.”",
          identityWhy: "Fixed trait → nothing to do but suffer it.",
          situationWhy:
            "A situation with causes → causes have fixes. You just did the flip yourself.",
        },
      ],
      rule: "You’re not aiming to be a person without waves.",
      takeaway:
        "You’re becoming someone who has hard days, everyone does, and knows the first move. Resilience survives bad weeks; perfection doesn’t.",
      waitingPrimaryLabel: "Flip the second one yourself",
    },
  },
];
