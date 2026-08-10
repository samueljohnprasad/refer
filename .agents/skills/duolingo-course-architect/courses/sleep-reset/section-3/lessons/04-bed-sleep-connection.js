import { defineLesson, exercise } from "../exercise.js";

export const bedSleepConnection = defineLesson({
  sourceId: "u3_2_pre_sleep_practices-n1",
  title: "The Bed-Sleep Connection",
  objective:
    "Apply stimulus control and recognize when sleep-window treatment needs trained support.",
  concepts: [
    "stimulus_control",
    "sleep_window_clinician_guidance",
    "sleep_pressure",
  ],
  durationMinutes: 11,
  exercises: [
    exercise({
      sourceId: "stay-or-reset-intuition",
      category: "intuition_check",
      phase: "warmup",
      concept: "stimulus_control",
      durationSeconds: 30,
      scaffoldLevel: 1,
      difficulty: 0.14,
      content: {
        completionMode: "direct",
        title: "What does your gut say?",
        instruction: "Choose what feels more useful. This is not scored.",
        prompt:
          "When frustration keeps rising in bed, what protects the bed-sleep link?",
        options: [
          { id: "force", label: "Stay and try harder until sleep happens" },
          { id: "reset", label: "Pause the struggle and return when sleepy" },
        ],
        bestOptionId: "reset",
        revealTitle: "Bed should cue sleep, not effort",
        reveal:
          "A quiet reset can stop bed from becoming a place for prolonged struggle.",
        alternateReveal:
          "Trying harder is understandable. Repeating the struggle can teach alertness instead of sleepiness.",
        primaryLabel: "Continue",
        waitingPrimaryLabel: "Choose above",
      },
    }),
    exercise({
      sourceId: "bed-association-rule",
      category: "concept_card",
      phase: "teach",
      concept: "stimulus_control",
      durationSeconds: 50,
      scaffoldLevel: 1,
      difficulty: 0.18,
      content: {
        completionMode: "direct",
        variant: "myth",
        title: "More effort is not more sleep",
        instruction: "Keep the association rule.",
        primaryLabel: "Continue",
        myth: "More time awake in bed gives sleep more chances to happen.",
        reality:
          "Go to bed when sleepy. If sleep is not coming and frustration builds, use a quiet reset and return when sleepy.",
        note: "Sleep-window restriction is different: it is tailored treatment with trained support, not a generic self-help rule.",
      },
    }),
    exercise({
      sourceId: "quiet-reset-story",
      category: "story_walkthrough",
      phase: "model",
      concept: "stimulus_control",
      durationSeconds: 60,
      scaffoldLevel: 1,
      difficulty: 0.18,
      content: {
        completionMode: "direct",
        title: "Follow a quiet reset",
        instruction: "Notice the cues, not the clock.",
        beats: [
          {
            id: "notice",
            kicker: "NOTICE",
            title: "Effort is rising",
            body: "Ari notices repeated clock-checking, frustration, and trying to force sleep.",
            icon: "activity",
          },
          {
            id: "reset",
            kicker: "RESET",
            title: "The struggle pauses",
            body: "Ari leaves the bed for a safe dim chair and listens to quiet audio without starting work.",
            icon: "activity",
          },
          {
            id: "return",
            kicker: "RETURN",
            title: "Sleepiness returns",
            body: "Heavy eyes and drifting attention—not a fixed minute count—become the cue to return to bed.",
            icon: "activity",
          },
        ],
        insight: {
          title: "Safety changes the form, not the goal",
          body: "If leaving bed is unsafe or inaccessible, use the safest available way to pause sleep effort. A clinician can adapt the method.",
        },
      },
    }),
    exercise({
      sourceId: "stimulus-control-transfer",
      category: "lever_scenario",
      phase: "transfer",
      concept: "stimulus_control",
      durationSeconds: 80,
      scaffoldLevel: 3,
      difficulty: 0.3,
      isScored: true,
      content: {
        completionMode: "direct",
        title: "Protect the association safely",
        instruction: "Choose the closest fit for the person.",
        capability:
          "You can use stimulus-control cues without rigid timing or unsafe movement.",
        variants: [
          {
            sceneLabel: "SAFE TO MOVE",
            scene:
              "Lena is awake in bed, checking the time and becoming more frustrated. A safe dim chair is nearby.",
            prompt: "What fits stimulus control?",
            clue: "Use frustration and sleepiness cues rather than a clock test.",
            worked:
              "Lena can pause the struggle in the safe chair and return when sleepiness reappears.",
            options: [
              {
                id: "reset",
                label:
                  "Move to the dim chair for a quiet activity, then return when sleepy",
                isCorrect: true,
                feedback:
                  "Right. This protects the bed-sleep association without clock-watching.",
              },
              {
                id: "force",
                label: "Remain in bed and increase the effort to sleep",
                feedback: "More effort can strengthen the bed-struggle link.",
              },
              {
                id: "work",
                label: "Start bright, demanding work until exhausted",
                feedback:
                  "A quiet reset should lower stimulation rather than restart the day.",
              },
            ],
          },
          {
            sceneLabel: "FALL RISK",
            scene:
              "Omar has a nighttime fall risk and cannot safely move to another room alone.",
            prompt: "What is the safest reading?",
            clue: "The method must adapt to safety and mobility.",
            worked:
              "Omar should not follow a generic get-up rule that creates fall risk. A clinician can tailor a safe alternative.",
            options: [
              {
                id: "adapt",
                label:
                  "Keep movement safe and ask a clinician to adapt the reset",
                isCorrect: true,
                feedback:
                  "Exactly. Safety comes before a standard instruction.",
              },
              {
                id: "risk",
                label: "Walk around in darkness because the rule is universal",
                feedback: "A sleep method should never increase fall risk.",
              },
              {
                id: "failure",
                label:
                  "Assume stimulus control cannot help anyone with mobility limits",
                feedback:
                  "The goal can remain useful while the action is adapted to the person.",
              },
            ],
          },
        ],
      },
    }),
    exercise({
      sourceId: "quiet-reset-plan",
      category: "if_then_plan",
      phase: "plan",
      concept: "stimulus_control",
      durationSeconds: 70,
      scaffoldLevel: 4,
      difficulty: 0.24,
      content: {
        title: "Plan a safe quiet reset",
        instruction: "Choose a cue and a low-stimulation move.",
        cues: [
          "I notice frustration and clock-checking rising",
          "I feel alert rather than sleepy in bed",
          "leaving bed would be unsafe or inaccessible",
        ],
        actions: [
          "use a safe dim place and return when sleepy",
          "choose quiet audio or reading without restarting work",
          "keep movement safe and ask for a tailored alternative",
        ],
        privacy: "Private. This plan is not scored or shared.",
        feedbackTitle: "A reset should reduce struggle",
        feedback:
          "Do not prescribe your own restricted sleep window. Seek trained support for that treatment, especially when health or safety factors apply.",
      },
    }),
  ],
});
