import type { Exercise } from "@/src/types/journeyV5";

export const draftMicrolearningFixtures: readonly Exercise[] = [
  {
    id: "fixture-common-trap-v2",
    nodeId: "fixture-draft-node",
    orderIndex: 0,
    type: "common_trap",
    isScored: false,
    content: {
      title: "Recognizing Common Traps",
      instruction:
        "See why the trap feels helpful — then learn the counter move.",
      trapTitle: "The Perfection Trap",
      trapBody: "If it isn’t perfect, it feels like failure.",
      shortTermPayoff: "High standards can feel protective.",
      hiddenCost: [
        "more checking",
        "more pressure",
        "small details feel high-stakes",
      ],
      counterMove: {
        body: [
          "Set a stopping point before you start.",
          "When the timer ends, stop checking — even if it still feels unfinished.",
        ],
      },
    },
  },
  {
    id: "fixture-curiosity-bet",
    nodeId: "fixture-draft-node",
    orderIndex: 1,
    type: "curiosity_bet",
    isScored: false,
    content: {
      title: "Place Your Bet",
      instruction: "Guess the outcome.",
      question: "How many people experience insomnia at some point?",
      options: [
        { id: "bet-10", label: "10%" },
        { id: "bet-30", label: "30%" },
        { id: "bet-50", label: "50%" },
      ],
      answer:
        "Studies show that about 30% of adults experience insomnia symptoms.",
      bestAnswerIndex: 1,
    },
  },
  {
    id: "fixture-explorable-model",
    nodeId: "fixture-draft-node",
    orderIndex: 2,
    type: "explorable_model",
    isScored: false,
    content: {
      title: "Help Maya’s alarm settle",
      instruction: "Test one lever, then notice the bedtime change.",
      setup:
        "Maya carries a demanding workday into bedtime, where her alarm is still trying to protect her.",
      model: "maya_alarm",
      chartAccessibilityLabel:
        "Line chart of Maya’s alarm level from 7am to 1am",
      initialValues: {
        stress: 80,
        relaxation: 20,
      },
    },
  },
  {
    id: "fixture-guess-reveal",
    nodeId: "fixture-draft-node",
    orderIndex: 3,
    type: "guess_reveal",
    isScored: false,
    content: {
      title: "Guess the Stat",
      instruction: "Make your best guess.",
      prompt: "Out of 10 people, how many will experience a panic attack?",
      actual: 3,
    },
  },
  {
    id: "fixture-faded-thought-record",
    nodeId: "fixture-draft-node",
    orderIndex: 4,
    type: "faded_thought_record",
    isScored: false,
    content: {
      title: "Build a balanced record",
      instruction: "Choose one field at a time.",
      fields: [
        { id: "record-situation", label: "Situation" },
        { id: "record-hot-thought", label: "Hot thought" },
        { id: "record-evidence", label: "Evidence" },
        { id: "record-balanced-thought", label: "Balanced thought" },
      ],
      examples: [
        {
          id: "record-worked-example",
          label: "Watch one field",
          context: "A manager asks Jordan to revisit one slide.",
          prefills: [
            {
              fieldId: "record-situation",
              value: "A manager asks to revisit one slide.",
            },
            {
              fieldId: "record-hot-thought",
              value: "I ruined the whole presentation.",
            },
            {
              fieldId: "record-evidence",
              value: "Only one slide needs changes.",
            },
          ],
          tasks: [
            {
              fieldId: "record-balanced-thought",
              prompt: "Which balanced thought fits this record?",
              clue: "Keep the concern and evidence together.",
              options: [
                {
                  id: "record-worked-supported",
                  label: "One slide needs work, not everything",
                  isSupported: true,
                  feedback:
                    "That keeps the concern in proportion to the evidence.",
                },
                {
                  id: "record-worked-unsupported",
                  label: "I will get fired",
                  isSupported: false,
                  feedback: "This is a catastrophic leap.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "fixture-association-meter",
    nodeId: "fixture-draft-node",
    orderIndex: 5,
    type: "association_meter",
    isScored: false,
    content: {
      title: "What gets the final vote?",
      instruction: "Try different ways of reading the alarm.",
      leftLabel: "FEELING AS PROOF",
      rightLabel: "CHECK THE WHOLE PICTURE",
      initialPosition: 50,
      initialCaption: "The alarm is loud. The conclusion is still open.",
      choices: [
        {
          id: "feeling_as_proof",
          label: "Treat 9 out of 10 anxiety as 9 out of 10 danger",
          targetPosition: 12,
          caption: "The feeling has become the evidence.",
          completesExercise: false,
        },
        {
          id: "confirmation_bias",
          label: "Look only for facts that support the alarm",
          targetPosition: 38,
          caption:
            "You’re checking evidence, but only the evidence that agrees with the alarm.",
          completesExercise: false,
        },
        {
          id: "balanced_evidence",
          label: "Check what supports the alarm — and what doesn’t",
          targetPosition: 88,
          caption:
            "Now the conclusion comes from the whole situation, not the feeling alone.",
          completesExercise: true,
        },
      ],
      rule: "Alarm intensity ≠ danger probability.",
      takeaway:
        "A strong feeling deserves support. A conclusion about danger needs evidence from the whole situation.",
    },
  },
  {
    id: "fixture-invent-first",
    nodeId: "fixture-draft-node",
    orderIndex: 6,
    type: "invent_first",
    isScored: false,
    content: {
      title: "Invent the Outcome",
      instruction: "Review the case and predict what happens next.",
      cases: [
        {
          id: "nia",
          name: "Nia",
          text: "says, “No reply means I offended her.”",
          label: "one meaning",
        },
        {
          id: "sam",
          name: "Sam",
          text: "says, “Maybe she is busy, or maybe I offended her.”",
          label: "multiple meanings",
        },
      ],
      question: "What is Nia more likely to do next?",
      options: [
        {
          id: "avoid",
          label: "Avoid the situation",
        },
        {
          id: "check_reality",
          label: "Check what actually happened",
        },
      ],
      feedbackMap: {
        avoid: {
          title: "Why that fits",
          body: "If Nia treats one interpretation as certain, the situation feels more threatening.",
          chain: [
            "one meaning",
            "threat feels certain",
            "avoidance feels safer",
            "short-term relief",
            "fear stays strong",
          ],
          counterTitle: "Try this instead",
          counterBody:
            "Leave room for more than one explanation, then check what actually happened.",
        },
        check_reality: {
          title: "That breaks the loop",
          body: "Checking reality gives Nia a chance to learn whether the feared interpretation is actually true.",
          chain: [
            "multiple meanings",
            "room to check reality",
            "new evidence can update the story",
          ],
        },
      },
    },
  },
  ,
  {
    id: "fixture-lens-replay",
    nodeId: "fixture-draft-node",
    orderIndex: 7,
    type: "lens_replay",
    isScored: false,
    content: {
      title: "Replay the Scene",
      instruction:
        "Tap the highlighted parts to see what you noticed — and what your mind added.",
      segments: [
        {
          text: "When I walked into the room,\n",
        },
        {
          text: "everyone stopped talking.",
          label: "WHAT YOU NOTICED",
          response:
            "Everyone stopped talking when you entered.\n\nThat is the observable part of the scene.",
        },
        {
          text: "\nI knew immediately that ",
        },
        {
          text: "they were talking about me.",
          label: "WHAT YOUR MIND ADDED",
          response:
            "You interpreted the silence as being about you.\n\nThat may be possible — but the scene does not prove it.",
        },
        {
          text: "\nI quickly sat down and pretended to look at my phone.",
        },
      ],
      insight:
        "An anxious mind can turn an ambiguous moment into certainty.\n\nPause at what you know, then leave room for other explanations.",
    },
  },
  {
    id: "fixture-lever-check",
    nodeId: "fixture-draft-node",
    orderIndex: 8,
    type: "lever_check",
    isScored: false,
    content: {
      title: "Identify the Levers",
      instruction: "Pull each lever to see which way it shifts alertness.",
      levers: [
        {
          id: "l1",
          label: "Preparation",
          remainingPercent: 30,
          explanation:
            "Less uncertainty can make the situation easier to enter.",
          tone: "olive",
        },
        {
          id: "l2",
          label: "Slower Breathing",
          remainingPercent: 50,
          explanation: "A slower breath can help the body settle.",
          tone: "olive",
        },
        {
          id: "l3",
          label: "Caffeine",
          remainingPercent: 90,
          explanation: "Caffeine can keep the body more activated.",
          tone: "orange",
        },
      ],
      rule: "THE IDEA",
      takeaway:
        "Different choices can shift alertness in different directions.\n\nPreparation and slower breathing may help it settle.\nCaffeine can keep it more activated.",
    },
  },
  {
    id: "fixture-lever-match",
    nodeId: "fixture-draft-node",
    orderIndex: 9,
    type: "lever_match",
    isScored: false,
    content: {
      title: "Match the Levers",
      instruction: "Match each action to its consequence.",
      pairs: [
        {
          id: "p1",
          left: "Avoidance",
          right: "Relief now,\nanxiety stays stronger later",
        },
        {
          id: "p2",
          left: "Exposure",
          right: "Anxiety now,\nfear can weaken later",
        },
        {
          id: "p3",
          left: "Reappraisal",
          right: "A new interpretation\ncan shift the response",
        },
      ],
      rightOrder: ["p2", "p3", "p1"],
      clue: "Hint: Look at what happens now — and what happens later.",
      feedbackTitle: "THE PATTERN",
      feedback:
        "What helps now is not always what helps later.\n\nAvoidance can bring quick relief while keeping fear strong.\nExposure can feel harder now while creating new learning.\nReappraisal can change how you interpret the situation.",
      capability: "Long-term thinking",
    },
  },

  {
    id: "fixture-name-it",
    nodeId: "fixture-draft-node",
    orderIndex: 10,
    type: "name_it",
    isScored: false,
    content: {
      families: [
        {
          name: "Fear",
          words: [
            { word: "Anxious", description: "Worried about what might happen" },
            { word: "Afraid", description: "Feeling threatened or unsafe" },
            {
              word: "Terrified",
              description: "Overwhelming, intense fear",
            },
          ],
        },
        {
          name: "Anger",
          words: [
            { word: "Frustrated", description: "Feeling blocked from a goal" },
            {
              word: "Resentful",
              description: "Bitter about being treated unfairly",
            },
          ],
        },
      ],
    },
  },
  {
    id: "fixture-panic-wave",
    nodeId: "fixture-draft-node",
    orderIndex: 11,
    type: "panic_wave_commit",
    isScored: false,
    content: {
      title: "The panic wave: commit your guess",
      instruction: "How long does a panic attack typically peak?",
      rule: "The wave breaks faster than you think.",
      safetyNote: "If it feels longer, it's often a series of smaller waves.",
      neverGuess: "No panic wave lasts that long. Your body can't sustain it.",
      shortGuess:
        "A bit too short. The adrenaline takes a bit more time to cycle.",
      closeGuess: "Exactly. The peak is usually under 10 minutes.",
      longGuess:
        "It feels like forever, but the biological peak is much faster.",
    },
  },
  {
    id: "fixture-situation-language",
    nodeId: "fixture-draft-node",
    orderIndex: 12,
    type: "situation_language",
    isScored: false,
    content: {
      title: "Change the frame",
      instruction: "Flip each sentence from identity to experience.",
      primaryLabel: "Continue",
      successPrimaryLabel: "Continue",
      rule: "THE SHIFT",
      takeaway:
        "A setback or feeling can describe a moment without defining who you are.\n\nDescribe what’s happening without turning it into who you are.",
      cards: [
        {
          identityText: "I am a failure.",
          situationText: "I failed at this task.",
          identityWhy: "Turns one setback into a statement about who you are.",
          situationWhy: "Describes what happened without defining the whole person.",
        },
        {
          identityText: "I am an anxious person.",
          situationText: "I am feeling anxious right now.",
          identityWhy: "Turns a passing feeling into an identity.",
          situationWhy:
            "Names what you’re feeling without turning it into who you are.",
        },
      ],
    },
  },
  {
    id: "fixture-socratic-dialogue",
    nodeId: "fixture-draft-node",
    orderIndex: 13,
    type: "socratic_dialogue",
    isScored: false,
    content: {
      category: "socratic_dialogue",
      format: "socratic_dialogue",
      title: "A 2am conversation",
      instruction: "Choose the honest answer.",
      supportTitle: "Why test your thoughts?",
      supportBody:
        "Socratic dialogue isn’t positive thinking or reassurance. It’s checking whether a catastrophic prediction has actual evidence behind it, or if it’s just the brain running a familiar alarm script.",
      terminalNote:
        "You tested the thought instead of obeying it. When you separate prediction from evidence, the alarm loses its grip.",
      nodes: {
        start: {
          message:
            "I woke up at 2am convinced tomorrow’s presentation will be a total disaster. My mind says everyone will see I’m incompetent.",
          done: false,
          support: false,
          supportive: false,
          options: [
            {
              label: "What specific evidence makes you certain?",
              next: "evidence",
              lead: "Let’s look at the facts.",
            },
            {
              label: "Has a presentation ever gone okay before?",
              next: "past_evidence",
              lead: "Let’s check your track record.",
            },
          ],
        },
        evidence: {
          message:
            "Well, I haven’t memorized slide 14, and I stumbled once during rehearsal this afternoon.",
          done: false,
          support: false,
          supportive: false,
          options: [
            {
              label: "Does stumbling in rehearsal guarantee disaster on stage?",
              next: "rehearsal_link",
              lead: "Consider the link between rehearsal and reality.",
            },
            {
              label: "What actually happens if you need to glance at notes?",
              next: "worst_case",
              lead: "Let’s look at the real stakes.",
            },
          ],
        },
        past_evidence: {
          message:
            "The last two went fine after the first few minutes. But this one feels way more dangerous.",
          done: false,
          support: false,
          supportive: false,
          options: [
            {
              label: "Does the feeling of danger prove actual danger?",
              next: "feelings_signal",
              lead: "Feelings are signals, not facts.",
            },
            {
              label: "Did the previous ones also feel terrifying beforehand?",
              next: "previous_patterns",
              lead: "Check how you felt then vs how it went.",
            },
          ],
        },
        previous_patterns: {
          message:
            "Actually, yes. I lost sleep before both and expected the exact same humiliation.",
          done: false,
          support: false,
          supportive: true,
          options: [
            {
              label: "So the 2am alarm is a familiar script, not a new fact.",
              next: "conclusion",
              lead: "Notice the pattern.",
            },
          ],
        },
        feelings_signal: {
          message:
            "No... my alarm always fires when stakes feel high, whether there’s real danger or not.",
          done: false,
          support: false,
          supportive: true,
          options: [
            {
              label: "So the alarm is doing its job, but the prophecy is untested.",
              next: "conclusion",
              lead: "Separate signal from prophecy.",
            },
          ],
        },
        rehearsal_link: {
          message:
            "No. Almost everyone stumbles in rehearsal. It’s where you catch the rough spots.",
          done: false,
          support: false,
          supportive: true,
          options: [
            {
              label: "Stumbling is part of preparing, not proof of failure.",
              next: "conclusion",
              lead: "Reframe rehearsal.",
            },
          ],
        },
        worst_case: {
          message:
            "I’d pause for three seconds, check the slide, and keep talking. Nobody would judge that.",
          done: false,
          support: false,
          supportive: true,
          options: [
            {
              label: "A brief pause is normal human delivery, not incompetence.",
              next: "conclusion",
              lead: "Perspective resets the alarm.",
            },
          ],
        },
        conclusion: {
          message:
            "Looking at the actual evidence: the danger isn’t tomorrow. It’s treating my 2am panic as proof. I can park this worry until the morning.",
          done: true,
          support: false,
          supportive: true,
          options: [],
        },
      },
    },
  },
  {
    id: "fixture-story-serial",
    nodeId: "fixture-draft-node",
    orderIndex: 14,
    type: "story_serial",
    isScored: false,
    content: {
      category: "story_serial",
      format: "story_serial",
      title: "Walk both alarm paths",
      instruction: "Choose one path, then rewind.",
      episodeLabel: "ONE INVITE · TWO READINGS",
      opening:
        "Sam receives an unexpected 1-on-1 meeting invite from his manager with no agenda. His chest tightens and his immediate impulse is to call in sick.",
      branches: [
        {
          choice: "Treat the alarm as proof",
          label: "PROOF PATH",
          beats: [
            "Sam decides the meeting must mean bad news or criticism.",
            "His body prepares as if the worst-case scenario is already taking place.",
            "Cancelling brings immediate relief, but leaves the fear unchallenged and stronger for next time.",
          ],
        },
        {
          choice: "Separate alarm from evidence",
          label: "MAP PATH",
          beats: [
            "Sam acknowledges the tight chest as natural body arousal.",
            "He labels “I must be in trouble” as an unverified prediction, not a settled fact.",
            "He shows up with curiosity, discovering the meeting was just a routine quarterly check-in.",
          ],
        },
      ],
      reflectionPrompt:
        "What was the real turning point between the two paths?",
      reflectionOptions: [
        {
          id: "alarm",
          label: "The first path had much stronger anxiety sensations",
          feedback:
            "Both paths started with the exact same tight chest and adrenaline surge. The difference was what Sam did with the signal.",
        },
        {
          id: "reading",
          label: "The second path separated bodily alarm from assumed facts",
          feedback:
            "Exactly. The sensations were real, but Sam recognized that physical alarm does not equal real-world danger.",
        },
        {
          id: "guarantee",
          label: "The second path proved that managers never share bad news",
          feedback:
            "No outcome is ever guaranteed. The second path simply kept him grounded in what was actually known.",
        },
      ],
      stamp: "ALARM MAP MASTERED",
      hook: "Next: Recognize the alarm signal before avoidance takes the wheel.",
    },
  },
  {
    id: "fixture-surge-diagram",
    nodeId: "fixture-draft-node",
    orderIndex: 15,
    type: "surge_diagram",
    isScored: false,
    content: {
      category: "surge_diagram",
      format: "surge_diagram",
      title: "An alarm changes over time",
      instruction: "Read the shape of a surge.",
      diagramTitle: "Activation rises, peaks, and naturally falls",
      peakLabel: "Strongest point (~10 min)",
      fadeLabel: "Body resets naturally",
      axisLabel: "Time passing",
      explanation:
        "An adrenaline surge feels endless in the moment, but the human body cannot sustain maximum arousal indefinitely. Without added catastrophic thoughts, the wave crests and subsides on its own.",
      note: "The exact peak and duration vary, but every biological surge has a natural ceiling and descent.",
    },
  },
] as unknown as Exercise[];

