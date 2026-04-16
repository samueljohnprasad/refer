import type {
  ExerciseConfig,
  ThoughtReframingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { AITextInputStep } from "@/src/components/exercise/steps/AITextInputStep";
import { MultiChoiceStep } from "@/src/components/exercise/steps/MultiChoiceStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

export const THOUGHT_REFRAMING_INITIAL: ThoughtReframingResponse = {
  situation: "",
  automaticThought: "",
  selectedEmotions: [],
  selectedDistortions: [],
  evidenceFor: [],
  evidenceAgainst: [],
  balancedThought: "",
};

export const thoughtReframingConfig: ExerciseConfig<ThoughtReframingResponse> =
  {
    type: "thought_reframing",
    category: "cbt_core",
    title: "Thought Reframing",
    subtitle: "Challenge and reframe negative thoughts",
    icon: "thought_reframing",
    duration: "10-15 min",
    xp: 15,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: THOUGHT_REFRAMING_INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Thought Reframing",
          subtitle:
            "Challenge negative thinking patterns and build healthier perspectives.",
          exerciseType: "thought_reframing",
          duration: "10-15 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "situation",
        component: createStep(TextInputStep, {
          title: "The Situation",
          subtitle: "What happened that triggered this thought?",
          fieldKey: "situation",
          placeholder: "Describe the event or situation...",
        }),
        label: "Describe the situation",
        validate: (r) => r.situation.trim().length >= 5,
      },
      {
        id: "automatic_thought",
        component: createStep(TextInputStep, {
          title: "Automatic Thought",
          subtitle: "What thought popped into your head?",
          fieldKey: "automaticThought",
          placeholder: "Write the exact thought...",
        }),
        label: "What was the automatic thought?",
        validate: (r) => r.automaticThought.trim().length >= 5,
      },
      {
        id: "emotions",
        component: createStep(MultiChoiceStep, {
          title: "Emotions",
          subtitle: "What emotions did you feel? (select up to 3)",
          fieldKey: "selectedEmotions",
          options: [
            { value: "anxious", label: "Anxious", iconKey: "anxious" },
            { value: "sad", label: "Sad", iconKey: "sad" },
            { value: "angry", label: "Angry", iconKey: "angry" },
            { value: "fearful", label: "Fearful", iconKey: "fearful" },
            { value: "guilty", label: "Guilty", iconKey: "guilty" },
            { value: "ashamed", label: "Ashamed", iconKey: "ashamed" },
            { value: "frustrated", label: "Frustrated", iconKey: "frustrated" },
            { value: "hopeless", label: "Hopeless", iconKey: "hopeless" },
            {
              value: "overwhelmed",
              label: "Overwhelmed",
              iconKey: "overwhelmed",
            },
            { value: "lonely", label: "Lonely", iconKey: "lonely" },
          ],
          maxSelections: 3,
        }),
        label: "Select emotions (max 3)",
        validate: (r) => r.selectedEmotions.length >= 1,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify the likely emotions the person is feeling.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nPick up to 3 emotions from this list ONLY: anxious, sad, angry, fearful, guilty, ashamed, frustrated, hopeless, overwhelmed, lonely\n\nFor each, estimate an intensity from 0-10.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  enum: [
                    "anxious",
                    "sad",
                    "angry",
                    "fearful",
                    "guilty",
                    "ashamed",
                    "frustrated",
                    "hopeless",
                    "overwhelmed",
                    "lonely",
                  ],
                },
                suggestedIntensity: { type: "number" },
              },
              required: ["name", "suggestedIntensity"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "distortions",
        component: createStep(MultiChoiceStep, {
          title: "Cognitive Distortions",
          subtitle: "Which thinking traps do you notice?",
          fieldKey: "selectedDistortions",
          options: [
            {
              value: "all_or_nothing",
              label: "All-or-Nothing",
              iconKey: "all_or_nothing",
            },
            {
              value: "catastrophizing",
              label: "Catastrophizing",
              iconKey: "catastrophizing",
            },
            {
              value: "mind_reading",
              label: "Mind Reading",
              iconKey: "mind_reading",
            },
            {
              value: "overgeneralizing",
              label: "Overgeneralizing",
              iconKey: "magnification",
            },
            {
              value: "personalizing",
              label: "Personalizing",
              iconKey: "personalization",
            },
            {
              value: "filtering",
              label: "Filtering",
              iconKey: "disqualifying_positive",
            },
            {
              value: "should_statements",
              label: "Should Statements",
              iconKey: "should_statements",
            },
            {
              value: "fortune_telling",
              label: "Fortune Telling",
              iconKey: "fortune_telling",
            },
            {
              value: "emotional_reasoning",
              label: "Emotional Reasoning",
              iconKey: "emotional_reasoning",
            },
            { value: "labeling", label: "Labeling", iconKey: "labeling" },
          ],
          maxSelections: 2,
        }),
        label: "Identify cognitive distortions (max 2)",
        validate: (r) => r.selectedDistortions.length >= 1,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify which cognitive distortions are present.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nIdentify up to 2 cognitive distortions from this list ONLY:\nall_or_nothing, catastrophizing, mind_reading, overgeneralizing, personalizing, filtering, should_statements, fortune_telling, emotional_reasoning, labeling\n\nFor each, provide the key, a confidence score (0-1), and a brief explanation.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                  enum: [
                    "all_or_nothing",
                    "catastrophizing",
                    "mind_reading",
                    "overgeneralizing",
                    "personalizing",
                    "filtering",
                    "should_statements",
                    "fortune_telling",
                    "emotional_reasoning",
                    "labeling",
                  ],
                },
                confidence: { type: "number" },
                explanation: { type: "string" },
              },
              required: ["key", "confidence", "explanation"],
            },
          },
          maxResults: 2,
        },
      },
      {
        id: "evidence_for",
        component: createStep(MultiTextInputStep, {
          title: "Evidence For",
          subtitle: "What evidence supports this thought?",
          fieldKey: "evidenceFor",
          placeholder: "Add evidence...",
          minItems: 0,
        }),
        label: "Evidence supporting this thought",
        validate: () => true, // optional
      },
      {
        id: "evidence_against",
        component: createStep(MultiTextInputStep, {
          title: "Evidence Against",
          subtitle: "What evidence contradicts this thought?",
          fieldKey: "evidenceAgainst",
          placeholder: "Add counter-evidence...",
          minItems: 0,
        }),
        label: "Evidence against this thought",
        validate: () => true, // optional
      },
      {
        id: "balanced_thought",
        component: createStep(AITextInputStep, {
          title: "Balanced Thought",
          subtitle: "Rewrite the thought in a more balanced way.",
          fieldKey: "balancedThought",
          placeholder: "A more balanced perspective...",
        }),
        label: "Write a balanced thought",
        validate: (r) => r.balancedThought.trim().length >= 5,
        ai: {
          promptBuilder: (r) => {
            const ef =
              r.evidenceFor.length > 0
                ? r.evidenceFor.map((e, i) => `${i + 1}. ${e}`).join("\n")
                : "None provided";
            const ea =
              r.evidenceAgainst.length > 0
                ? r.evidenceAgainst.map((e, i) => `${i + 1}. ${e}`).join("\n")
                : "None provided";
            return `You are a CBT therapist assistant. Help the user reframe their automatic thought into a more balanced perspective.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nEvidence supporting the thought:\n${ef}\n\nEvidence against the thought:\n${ea}\n\nGenerate 3 alternative balanced thoughts. Each should be realistic, based on evidence, written in first person, and concise (1-2 sentences). For each, provide a brief rationale.`;
          },
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                rationale: { type: "string" },
              },
              required: ["text", "rationale"],
            },
          },
          maxResults: 3,
        },
      },
      {
        id: "re_evaluate",
        component: createStep(SliderStep, {
          title: "Re-evaluate",
          subtitle:
            "After reframing, how much do you believe the original thought?",
          fieldKey: "intensity",
          min: 0,
          max: 100,
          minLabel: "Not at all",
          maxLabel: "Completely",
          unit: "%",
        }),
        label: "Re-evaluate your emotions",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<ThoughtReframingResponse>(
          [
            { label: "Situation", key: "situation" },
            { label: "Automatic Thought", key: "automaticThought" },
            { label: "Balanced Thought", key: "balancedThought" },
          ],
          { title: "Great work!", exerciseType: "thought_reframing" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };
