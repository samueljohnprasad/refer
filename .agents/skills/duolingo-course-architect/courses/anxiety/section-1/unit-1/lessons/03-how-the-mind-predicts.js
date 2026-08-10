import { defineLesson, exercise } from "../exercise.js";

export const howTheMindPredicts = defineLesson({
  sourceId: "anxiety-s1-u1-n3-how-the-mind-predicts",
  title: "How the Mind Predicts",
  objective: "Separate an uncertain event from the threat prediction anxiety adds.",
  concepts: ["body_alarm", "threat_prediction"],
  durationMinutes: 8,
  exercises: [
    exercise({
      sourceId: "prediction-lens",
      category: "lens_replay",
      phase: "notice",
      concept: "threat_prediction",
      durationSeconds: 50,
      scaffoldLevel: 2,
      difficulty: 0.14,
      content: {
        title: "Find what the mind added",
        instruction: "Tap the highlighted lines.",
        diaryLabel: "MONDAY · 4:20PM",
        segments: [
          { text: "My manager wrote, “Can we talk tomorrow?” " },
          { text: "My stomach dropped. ", key: "BODY ALARM", response: "The protection system switched on quickly." },
          { text: "I knew I was getting fired. ", key: "PREDICTION", response: "This is one possible outcome presented as certainty." },
          { text: "The message did not say what the meeting was about.", key: "KNOWN FACT", response: "The meaning is still open." },
        ],
        insight: "Anxiety often closes an information gap with the most threatening prediction. A prediction can feel certain before it is tested.",
      },
    }),
    exercise({
      sourceId: "two-minds-dialogue",
      category: "dialogue",
      phase: "teach",
      concept: "threat_prediction",
      durationSeconds: 50,
      scaffoldLevel: 2,
      difficulty: 0.15,
      content: {
        title: "Same message, two readings",
        instruction: "Follow both minds.",
        messages: [
          { id: "event", name: "MESSAGE", side: "left", text: "Can we talk tomorrow?" },
          { id: "alarm", name: "ALARM MIND", side: "right", text: "This must be bad. Prepare for the worst." },
          { id: "checking", name: "CHECKING MIND", side: "left", text: "I notice the alarm. The reason for the meeting is still unknown." },
          { id: "response", name: "CHECKING MIND", side: "left", text: "I can prepare for the conversation without treating one prediction as fact." },
        ],
        insight: "The goal is not forced positivity. It is moving from one untested conclusion to a more accurate range of possibilities.",
      },
    }),
    exercise({
      sourceId: "prediction-discovery",
      category: "guided_discovery_trail",
      phase: "reason",
      concept: "threat_prediction",
      durationSeconds: 70,
      scaffoldLevel: 2,
      difficulty: 0.17,
      content: {
        completionMode: "direct",
        title: "Follow the evidence gap",
        instruction: "Answer each question and read what it changes.",
        questions: [
          {
            coach: "A friend has not replied since morning. What is known?",
            options: [
              {
                label: "There is no reply yet",
                reply: "Yes. This describes the event without deciding what it means.",
              },
              {
                label: "The friend is upset",
                reply: "That could be true, but it is a prediction because the reason is unknown.",
              },
            ],
          },
          {
            coach: "The mind says, “I must have done something wrong.” What changed?",
            options: [
              {
                label: "New evidence arrived",
                reply: "No new evidence arrived. The mind supplied one possible explanation.",
              },
              {
                label: "One prediction filled the gap",
                reply: "Right. Uncertainty became one threatening conclusion.",
              },
            ],
          },
          {
            coach: "What keeps the reading accurate while the reason is unknown?",
            options: [
              {
                label: "Treat the worst possibility as preparation",
                reply: "Preparation can be useful, but a possibility still does not become a fact.",
              },
              {
                label: "Name the event and prediction separately",
                reply: "Yes. The concern stays visible without closing the evidence gap.",
              },
            ],
          },
        ],
        stamp: "EVENT AND PREDICTION SEPARATED",
      },
    }),
    exercise({
      sourceId: "prediction-rule",
      category: "invent_first",
      phase: "infer",
      concept: "threat_prediction",
      durationSeconds: 60,
      scaffoldLevel: 3,
      difficulty: 0.2,
      isScored: true,
      content: {
        title: "Invent the rule",
        instruction: "Find what separates the readings.",
        cases: [
          { id: "certain", name: "Nia", reading: "says, “No reply means I offended her.”", outcome: "one meaning", isCalm: false },
          { id: "positive", name: "Omar", reading: "says, “No reply means everything is fine.”", outcome: "one meaning", isCalm: false },
          { id: "open", name: "Tara", reading: "says, “There is no reply yet. I do not know why.”", outcome: "facts stay open", isCalm: true },
        ],
        options: [
          { id: "certainty", label: "Choose the most comforting explanation", feedback: "Comfort can help, but a comforting guess is still a guess." },
          { id: "separate", label: "Separate what happened from what it might mean", isCorrect: true, feedback: "Yes. This keeps observation and prediction distinct." },
          { id: "worst", label: "Prepare by accepting the worst explanation", feedback: "Treating the worst possibility as settled closes the evidence gap too early." },
        ],
        rule: "Name what happened before naming what it means.",
        body: "The event may be clear while its meaning remains uncertain. Accuracy keeps that gap open.",
        next: "Now watch how a prediction can change the next part of the alarm cycle.",
      },
    }),
    exercise({
      sourceId: "prediction-machine",
      category: "what_if_machine",
      phase: "simulate",
      concept: "threat_prediction",
      durationSeconds: 60,
      scaffoldLevel: 2,
      difficulty: 0.18,
      content: {
        completionMode: "direct",
        title: "What if one guess becomes a fact?",
        instruction: "Predict, then run the chain.",
        options: [
          { id: "settles", label: "The alarm settles because the mind found an answer" },
          { id: "grows", label: "The alarm grows around the untested answer" },
          { id: "proves", label: "The answer becomes more accurate" },
        ],
        steps: [
          "A friend has not replied for six hours.",
          "Nia predicts, “I offended her.”",
          "Her body responds as if rejection is already happening.",
          "She checks the phone repeatedly and notices every minute of silence.",
        ],
        rule: "An untested prediction can become fuel for the alarm that produced it.",
        takeaway: "Opening the meaning does not remove uncertainty. It stops one possibility from pretending to be the result.",
      },
    }),
  ],
});
