import type { Exercise } from "@/src/types/journeyV5";

export const priorityMicrolearningFixtures: readonly Exercise[] = [
  {
    id: "fixture-guided-discovery-trail",
    nodeId: "fixture-guided-discovery-node",
    orderIndex: 0,
    type: "guided_discovery_trail",
    isScored: false,
    content: {
      title: "Follow a worry clue",
      instruction: "Choose one clue at a time.",
      stamp: "A worry can be noticed without becoming a verdict.",
      questions: [
        {
          id: "trail-notice",
          prompt: "A delayed reply catches your attention. What is certain?",
          summary: "The reply is delayed; the reason is unknown.",
          options: [
            {
              id: "trail-notice-fact",
              label: "The reply has not arrived yet",
              response: "That names the event without deciding what it means.",
            },
            {
              id: "trail-notice-rejected",
              label: "Assume the silence proves I caused harm and repair everything",
              response: "That is an understandable prediction, not evidence about the reason.",
            },
          ],
        },
        {
          id: "trail-name",
          prompt: "What did the worried thought add to the known event?",
          summary: "A prediction was added to the missing information.",
          options: [
            {
              id: "trail-name-gap",
              label: "One possible explanation",
              response: "A possibility can stay open while more information is missing.",
            },
            {
              id: "trail-name-rejected",
              label: "A fact that needs urgent action before any evidence arrives",
              response: "Urgency can be felt without making the prediction certain.",
            },
          ],
        },
        {
          id: "trail-respond",
          prompt: "What keeps the next step grounded while you wait?",
          summary: "The event and prediction can remain separate.",
          options: [
            {
              id: "trail-respond-separate",
              label: "Name the event and prediction separately",
              response: "This leaves room for care without closing the evidence gap.",
            },
            {
              id: "trail-respond-rejected",
              label: "Treat the worst possibility as the safest complete answer",
              response: "Preparation may help, but it does not turn a possibility into fact.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "fixture-reframe-builder-template",
    nodeId: "fixture-reframe-builder-node",
    orderIndex: 1,
    type: "reframe_builder",
    isScored: false,
    content: {
      title: "Build a fairer thought",
      instruction: "Choose one phrase at a time.",
      hotThought: "One mistake will prove that I am incapable.",
      trays: [
        {
          id: "evidence",
          slotLabel: "What is known",
          options: [
            { id: "evidence-learn", label: "I can learn from one mistake" },
            { id: "evidence-handled", label: "I have handled hard tasks before" },
          ],
        },
        {
          id: "perspective",
          slotLabel: "A balanced view",
          options: [
            { id: "perspective-define", label: "one mistake does not define my ability" },
            { id: "perspective-next", label: "I can focus on the next useful step" },
          ],
        },
      ],
      joinStrategy: {
        type: "template",
        template: "I can remember that {evidence}, and {perspective}.",
      },
      comparisonFeedback: "This thought keeps the mistake in proportion.",
    },
  },
  {
    id: "fixture-reframe-builder-space",
    nodeId: "fixture-reframe-builder-space-node",
    orderIndex: 2,
    type: "reframe_builder",
    isScored: false,
    content: {
      title: "Build a fairer thought",
      instruction: "Choose one phrase at a time.",
      hotThought: "If I feel anxious, I will fail today.",
      trays: [
        {
          id: "start",
          slotLabel: "A starting phrase",
          options: [
            { id: "start-can", label: "I can" },
            { id: "start-may", label: "I may" },
          ],
        },
        {
          id: "action",
          slotLabel: "One next step",
          options: [
            { id: "action-breathe", label: "take one steady breath" },
            { id: "action-begin", label: "begin with one small task" },
          ],
        },
        {
          id: "meaning",
          slotLabel: "A wider meaning",
          options: [
            { id: "meaning-before", label: "before deciding what this means" },
            { id: "meaning-while", label: "while making room for uncertainty" },
          ],
        },
      ],
      joinStrategy: { type: "space" },
      comparisonFeedback: "This leaves room for anxiety without predicting failure.",
    },
  },
  {
    id: "fixture-teach-back-chain",
    nodeId: "fixture-teach-back-chain-node",
    orderIndex: 3,
    type: "teach_back_chain",
    isScored: false,
    content: {
      title: "Teach the worry loop",
      instruction: "Put each step in order, then apply it.",
      message: "A worry can feel urgent before the facts are fully known.",
      steps: [
        { id: "chain-check", label: "Check the evidence", order: 4 },
        { id: "chain-cue", label: "Notice uncertainty", order: 1 },
        { id: "chain-body", label: "Body prepares to protect", order: 3 },
        { id: "chain-predict", label: "Mind predicts danger", order: 2 },
      ],
      transfer: {
        prompt: "Which response keeps the facts open?",
        options: [
          {
            id: "transfer-supported",
            label: "Name alarm and evidence",
            isSupported: true,
            response: "That respects the alarm without treating it as proof.",
            takeaway: "A feeling can matter without confirming the feared outcome.",
          },
          {
            id: "transfer-proof",
            label: "Treat alarm as proof",
            isSupported: false,
            response: "The alarm is a signal, not final evidence about the outcome.",
            takeaway: "Keep the signal and the facts separate.",
          },
          {
            id: "transfer-dismiss",
            label: "Dismiss the alarm",
            isSupported: false,
            response: "The alarm deserves care even while the facts remain open.",
            takeaway: "Notice the signal before choosing a next step.",
          },
        ],
      },
    },
  },
  {
    id: "fixture-private-check-wired",
    nodeId: "fixture-private-check-node",
    orderIndex: 0,
    type: "private_check",
    isScored: false,
    content: {
      category: "private_check",
      format: "private_check",
      title: "When bedtime feels wired",
      instruction: "Which of these have you noticed at bedtime?\nSelect any that fit.",
      items: [
        "Work or tomorrow keeps replaying in my mind",
        "My heart feels like it's beating faster",
        "My jaw or shoulders feel tight",
        "I feel tired and alert at the same time",
      ],
      revealItems: [
        "Work thoughts",
        "Faster heartbeat",
        "Tight jaw or shoulders",
        "Tired + alert",
      ],
      noneOptionLabel: "None of these",
      privacyLabel: "Private to you · Not scored",
      revealTitle: "Your alert clues",
      revealBody:
        "These can show up when your system is leaning toward ALERT rather than SETTLED.",
      noneRevealTitle: "None of these fit right now",
      noneRevealBody:
        "These are only examples — your signals may look different.",
      primaryLabel: "Continue",
      feedbackTitle: "Clues, not failures",
      feedback: "These signals can show that the body is still on guard.",
    },
  },
];
