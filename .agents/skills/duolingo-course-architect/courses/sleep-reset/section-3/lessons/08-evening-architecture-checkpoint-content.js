export const EVENING_CHECKPOINT_ITEMS = [
  {
    concept: "Flexible wind-down",
    context:
      "Tara's work ends at different times. She cannot keep one exact wind-down start.",
    prompt: "Which plan best keeps the skill?",
    clue: "Keep the transition stable, not necessarily the clock time.",
    worked:
      "A repeatable sequence can begin after work ends and expand or shrink with the evening.",
    options: [
      {
        label: "Use a flexible range with the same first transition cue",
        isCorrect: true,
        feedback:
          "Right. A movable range can still provide a reliable downshift cue.",
      },
      {
        label: "Treat every changed start time as a failed routine",
        feedback: "Rigidity adds pressure and makes the plan less usable.",
      },
    ],
  },
  {
    concept: "Evening light",
    context:
      "Eli must use a phone briefly at night and has enabled a warmer color setting.",
    prompt: "What additional move best fits the light lesson?",
    clue: "Color is only one part of exposure.",
    worked:
      "Lower brightness, keep the necessary task brief, and put the phone away when finished.",
    options: [
      {
        label: "Reduce brightness and duration too",
        isCorrect: true,
        feedback:
          "Right. Brightness and exposure still matter with a warmer display.",
      },
      {
        label: "Keep full brightness because color shift removes every effect",
        feedback: "Color shift alone is not a complete shield.",
      },
    ],
  },
  {
    concept: "Sleep environment",
    context:
      "Rae sleeps comfortably in a warmer room but wakes whenever hallway light reaches the bed.",
    prompt: "Which first experiment is most targeted?",
    clue: "Use the repeated blocker, not a universal room rule.",
    worked:
      "The repeated disturbance is hallway light, so blocking or repositioning that light is the closest experiment.",
    options: [
      {
        label: "Block or reposition the hallway light",
        isCorrect: true,
        feedback: "Exactly. The experiment matches the repeated disturbance.",
      },
      {
        label: "Force the room to a universal temperature",
        feedback:
          "Rae already finds the temperature comfortable; the recurring blocker is light.",
      },
    ],
  },
  {
    concept: "Stimulus control and safety",
    context:
      "Mika is frustrated and alert in bed, but has a nighttime fall risk.",
    prompt: "Which response respects both the skill and safety?",
    clue: "A treatment rule must adapt when movement creates risk.",
    worked:
      "Mika should not create fall risk to follow a generic instruction. A clinician can tailor a safe way to pause sleep effort.",
    options: [
      {
        label:
          "Keep movement safe and seek a tailored stimulus-control alternative",
        isCorrect: true,
        feedback: "Right. Safety comes before a standard get-up instruction.",
      },
      {
        label:
          "Walk in darkness because every person must follow the same rule",
        feedback: "A sleep strategy should never increase fall risk.",
      },
    ],
  },
  {
    concept: "Worry dump versus reflection",
    context:
      "Nia has unfinished tasks in mind and finds gratitude writing irritating tonight.",
    prompt: "Which choice best fits both lessons?",
    clue: "Use clearing for open loops; keep reflection optional.",
    worked:
      "Nia can capture tasks briefly, close the list, and skip gratitude reflection without losing progress.",
    options: [
      {
        label:
          "Capture the tasks, close the page, and skip optional reflection",
        isCorrect: true,
        feedback:
          "Right. The tools have different jobs, and reflection remains optional.",
      },
      {
        label: "Force gratitude writing before handling the open tasks",
        feedback:
          "A forced optional ritual can add pressure and leaves the open loops active.",
      },
    ],
  },
  {
    concept: "One-change experiment",
    context:
      "Noah changed the room temperature, bedtime, music, tea, and phone use on the same night. Sleep felt different.",
    prompt: "What should Noah do to learn which change fits?",
    clue: "A crowded reset hides the useful signal.",
    worked:
      "Return to a safe usual routine, choose one practical lever, and observe it across several comparable nights.",
    options: [
      {
        label: "Test one safe change at a time and judge the pattern",
        isCorrect: true,
        feedback:
          "Right. One lever and several comparable nights make the result easier to interpret.",
      },
      {
        label: "Treat that one night as proof that every change worked",
        feedback:
          "One night cannot identify which change mattered or separate it from normal variation.",
      },
    ],
  },
];
