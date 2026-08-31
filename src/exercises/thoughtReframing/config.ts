import type {
  ExerciseConfig,
  ThoughtReframingResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { ThoughtReframingSummary } from "./ThoughtReframingSummary";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import {
  TRSituationStep,
  TRAutomaticThoughtStep,
  TREmotionsStep,
  TRDistortionsStep,
  TREvidenceForStep,
  TREvidenceAgainstStep,
  TRBalancedThoughtStep,
} from "./customSteps";

export const THOUGHT_REFRAMING_INITIAL: ThoughtReframingResponse = {
  situation: "",
  automaticThought: "",
  selectedEmotions: [],
  selectedDistortions: [],
  evidenceFor: [],
  evidenceAgainst: [],
  balancedThought: "",
  intensity: 5,
  postIntensity: undefined,
};

function scaleBeliefScore(value: number): number {
  if (value > 10) return Math.round(value / 10);
  return Math.round(value);
}

function normalizeBeliefScore(value: number | undefined): number | undefined {
  if (typeof value !== "number") return null;
  return Math.min(Math.max(scaleBeliefScore(value), 0), 10);
}

function applyV2Migration(migrated: any, fromVersion: number) {
  if (fromVersion < 2) migrated.postIntensity = undefined;
}

function extractSeed(context: any): number | undefined {
  if (!context) return null;
  return context.seed;
}

function getSeed(context: any): number {
  const seed = extractSeed(context);
  if (seed === undefined) return Math.random();
  return seed;
}

function formatEvidenceFor(evidence: string[]): string {
  if (evidence.length > 0) return evidence.map((e, i) => `${i + 1}. ${e}`).join("\n");
  return "None provided";
}

function formatEvidenceAgainst(evidence: string[]): string {
  if (evidence.length > 0) return evidence.map((e, i) => `${i + 1}. ${e}`).join("\n");
  return "None provided";
}

function getDefaultIntensity(intensity: number | undefined): number {
  if (intensity === undefined) return THOUGHT_REFRAMING_INITIAL.intensity;
  return intensity;
}

function applyV4Migration(migrated: any, fromVersion: number) {
  if (fromVersion < 4) {
    migrated.intensity = getDefaultIntensity(normalizeBeliefScore(migrated.intensity));
    migrated.postIntensity = normalizeBeliefScore(migrated.postIntensity);
  }
}

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
    schemaVersion: 4,
    initialResponse: THOUGHT_REFRAMING_INITIAL,
    migrate: (old, fromVersion) => {
      const migrated = { ...THOUGHT_REFRAMING_INITIAL, ...old };
      applyV2Migration(migrated, fromVersion);
      applyV4Migration(migrated, fromVersion);
      return migrated;
    },

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Thought Reframing",
          subtitle:
            "Challenge negative thinking and find a more balanced perspective on your situation.",
          exerciseType: "thought_reframing",
          duration: "10-15 min",
          mascotState: "panda-happy" as const,
          bulletPoints: [
            "Describe the triggering situation",
            "Catch your automatic thought",
            "Notice thought patterns",
            "Weigh the evidence for and against",
            "Create a balanced thought",
          ],
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
        hideHeader: true,
        nextLabel: "Begin Exercise",
      },
      {
        id: "situation",
        component: TRSituationStep,
        label: "Describe the situation",
        validate: (r) => r.situation.trim().length >= 5,
        ai: {
          promptBuilder: (r, context) =>
            `You are a CBT therapist assistant. Generate 3 common, relatable everyday situations for the first step of a CBT thought record. Each item must be an observable fact a camera could capture or a calendar/message log could verify. Do NOT include emotions, interpretations, predictions, or phrases like "I feel", "I'm scared", "bad day", "they dislike me", or "this will go wrong". Keep each item brief, realistic, and in the first person.\n\nGood examples:\n- "I have a doctor appointment at 3 PM."\n- "I sent a message and have not received a reply yet."\n- "My manager gave me feedback this morning."\n\nRandom seed: ${getSeed(context)}`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
          aiLoadingMessage: "Finding factual examples...",
        },
      },
      {
        id: "automatic_thought",
        component: TRAutomaticThoughtStep,
        label: "What was the automatic thought?",
        validate: (r) => r.automaticThought.trim().length >= 5,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Based on this situation:\n"${r.situation}"\n\nGenerate 3 likely automatic negative thoughts the user might have had. Keep them in the first person ("I...", "They..."), brief (1 sentence), and realistic.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
          aiLoadingMessage: "Finding possible thoughts...",
        },
      },
      {
        id: "intensity",
        component: createStep(SliderStep, (props) => ({
          title: "How believable does it feel?",
          subtitle: "",
          fieldKey: "intensity",
          contextText: props.response?.automaticThought,
          min: 0,
          max: 10,
          minLabel: "Not true",
          midLabel: "Partly",
          maxLabel: "Completely",
          unit: "/10",
          showStepCount: false,
        })),
        label: "Rate how true the thought feels",
        validate: () => true,
        nextLabel: "Use this for now",
      },
      {
        id: "emotions",
        component: TREmotionsStep,
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
          aiLoadingMessage: "Noticing possible emotions...",
        },
      },
      {
        id: "distortions",
        component: TRDistortionsStep,
        label: "Notice thought patterns (max 2)",
        validate: (r) => r.selectedDistortions.length >= 1,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify which cognitive distortions are present.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nIdentify up to 2 cognitive distortions from this list ONLY:\nall_or_nothing, catastrophizing, mind_reading, overgeneralizing, personalizing, filtering, should_statements, fortune_telling, emotional_reasoning, labeling\n\nFor each, provide the key, a confidence score (0-1), and one explanation sentence of no more than 28 words. Address the user directly in the second person (e.g., "You might be assuming..."). Do NOT use clinical third-person language like "The individual is...".`,
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
          aiLoadingMessage: "Looking for possible patterns...",
        },
      },
      {
        id: "evidence_for",
        component: TREvidenceForStep,
        label: "Evidence supporting this thought",
        validate: () => true,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify objective facts that could genuinely support why the thought feels believable. Do not invent motives, predictions, or mind-reading. Keep each item concrete, brief, and grounded in something the user could actually point to.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nProvide 3 short factual fragments, each no more than 10 words, that could support the thought. No explanations.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
          aiLoadingMessage: "Finding possible evidence...",
        },
      },
      {
        id: "evidence_against",
        component: TREvidenceAgainstStep,
        label: "Evidence against this thought",
        validate: () => true,
        ai: {
          promptBuilder: (r) =>
            `You are a CBT therapist assistant. Given the situation and automatic thought below, identify objective evidence AGAINST this thought. What facts contradict it?\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nProvide 3 short factual fragments, each no more than 10 words, that could weaken the thought. No explanations.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 3,
          aiLoadingMessage: "Finding counter-evidence...",
        },
      },
      {
        id: "balanced_thought",
        component: TRBalancedThoughtStep,
        label: "Write a balanced thought",
        validate: (r) => r.balancedThought.trim().length >= 5,
        ai: {
          promptBuilder: (r) => {
            const ef = formatEvidenceFor(r.evidenceFor);
            const ea = formatEvidenceAgainst(r.evidenceAgainst);
            return `You are a CBT therapist assistant. Help the user reframe their automatic thought into a more balanced perspective.\n\nSituation: "${r.situation}"\nAutomatic thought: "${r.automaticThought}"\n\nEvidence supporting the thought:\n${ef}\n\nEvidence against the thought:\n${ea}\n\nGenerate 3 alternative balanced thoughts. Each must be meaningfully different from the automatic thought, realistic, based on the evidence, written in first person, and concise (1-2 sentences). Do not repeat, lightly paraphrase, validate, or intensify the automatic thought. Each option must acknowledge uncertainty or include at least one concrete counterpoint from the evidence against it. For each, provide a brief rationale. CRITICAL: Write the rationale addressing the user directly in the second person (e.g., "This reminds you that..."). Do NOT use third-person language.`;
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
          aiLoadingMessage: "Building balanced options...",
        },
      },
      {
        id: "re_evaluate",
        component: createStep(SliderStep, (props) => ({
          title: "How believable does it feel now?",
          subtitle: "",
          fieldKey: "postIntensity",
          contextText: props.response?.automaticThought,
          min: 0,
          max: 10,
          minLabel: "Not true",
          midLabel: "Partly",
          maxLabel: "Completely",
          unit: "/10",
          showStepCount: false,
        })),
        label: "Re-evaluate your belief",
        validate: () => true,
        nextLabel: "Use this for now",
      },
      {
        id: "summary",
        component: ThoughtReframingSummary,
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
        hideHeader: true,
        nextLabel: "Complete",
        secondaryLabel: "Edit answers",
      },
    ],
  };
