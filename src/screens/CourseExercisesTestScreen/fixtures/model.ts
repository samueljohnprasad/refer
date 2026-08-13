import type { Exercise } from "@/src/types/journeyV5";

export const modelMicrolearningFixtures: readonly Exercise[] = [
  {
    id: "fixture-explorable-model",
    nodeId: "fixture-explorable-model-node",
    orderIndex: 0,
    type: "explorable_model",
    isScored: false,
    content: {
      title: "Help Maya’s alarm settle",
      instruction: "Test one lever, then notice the bedtime change.",
      setup: "Maya carries a demanding workday into bedtime, where her alarm is still trying to protect her.",
      model: "maya_alarm",
      chartAccessibilityLabel: "Line chart of Maya’s alarm level from 7am to 1am",
      initialValues: {
        load: 75,
        walk: false,
        replay: true,
        coffee: false,
      },
      stages: [
        {
          id: "maya-load",
          prompt: "Bring Maya’s daytime load down.",
          summaryLabel: "Day load",
          control: {
            type: "slider",
            input: "load",
            label: "Daytime load",
            accessibilityLabel: "Maya’s daytime demand load",
            min: 20,
            max: 90,
            step: 5,
          },
        },
        {
          id: "maya-walk",
          prompt: "Add a genuine lunch break.",
          summaryLabel: "Lunch walk",
          control: {
            type: "toggle",
            input: "walk",
            label: "20-minute lunch walk",
            accessibilityLabel: "Maya takes a 20-minute lunch walk",
            onLabel: "Walk on",
            offLabel: "Walk off",
          },
        },
        {
          id: "maya-replay",
          prompt: "Turn off the late-night replay.",
          summaryLabel: "Evening replay",
          control: {
            type: "toggle",
            input: "replay",
            label: "10pm replay",
            accessibilityLabel: "Maya replays the day at 10pm",
            onLabel: "Replay on",
            offLabel: "Replay off",
          },
        },
      ],
      sandboxPrompt: "Try the learned levers together.",
    },
  },
];
