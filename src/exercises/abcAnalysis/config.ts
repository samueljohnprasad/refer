import type {
  ExerciseConfig,
  ABCAnalysisResponse,
} from "@/src/types/exerciseFlow";
import {
  ABCActivatingEventStep,
  ABCAlternativeBeliefStep,
  ABCBeliefStep,
  ABCConsequenceStep,
  ABCNewConsequenceStep,
} from "./customSteps";
import { ABCSummaryStep } from "./ABCSummaryStep";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: ABCAnalysisResponse = {
  activatingEvent: "",
  belief: "",
  consequenceEmotion: "",
  consequenceBehavior: "",
  alternativeBelief: "",
  newConsequence: "",
  preEmotionalIntensity: 5,
  postEmotionalIntensity: 5,
};

export const abcAnalysisConfig: ExerciseConfig<ABCAnalysisResponse> = {
  type: "abc_analysis",
  category: "cbt_core",
  title: "ABC Analysis",
  subtitle: "Understand the link between events, beliefs, and consequences",
  icon: "abc_analysis",
  duration: "7-10 min",
  xp: 15,
  backgroundColor: "#fff",
  schemaVersion: 2,
  initialResponse: INITIAL,

  steps: [
    {
      id: "intro",
      component: createStep(IntroStep, {
        title: "ABC Analysis",
        subtitle:
          "Understand the link between events, beliefs, and consequences.",
        exerciseType: "abc_analysis",
        duration: "7-10 min",
        bulletPoints: [
          "Describe an activating event",
          "Identify your automatic beliefs",
          "Recognize emotional consequences",
          "Challenge and replace negative beliefs",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "pre_emotional_intensity",
      component: createStep(SliderStep, {
        title: "Before We Start",
        subtitle: "How intense are your emotions about this event?",
        fieldKey: "preEmotionalIntensity",
        min: 1,
        max: 10,
        minLabel: "Mild",
        maxLabel: "Very intense",
      }),
      label: "How intense are your emotions? (1-10)",
      validate: () => true,
    },
    {
      id: "activating_event",
      component: ABCActivatingEventStep,
      label: "Activating Event",
      validate: (r) => r.activatingEvent.trim().length >= 1,
      ai: {
        promptBuilder: (r, context) => {
          const seed = context?.seed ?? Math.random();
          const themes = ["work/career", "romantic relationships", "friendships", "health and fitness", "daily chores/errands", "finances", "family dynamics", "hobbies/projects", "driving/commuting", "social media/internet", "home maintenance"];
          const shuffledThemes = [...themes].sort((a, b) => {
             const hashA = (a.charCodeAt(0) * seed) % 1;
             const hashB = (b.charCodeAt(0) * seed) % 1;
             return hashA - hashB;
          });
          const theme1 = shuffledThemes[0];
          const theme2 = shuffledThemes[1];
          const theme3 = shuffledThemes[2];
          return `You are a CBT therapist assistant. Generate 3 extremely brief, objective daily situations (activating events). Do NOT generate the negative thought. Just the concrete event. e.g. 'I received a critical email from my boss' or 'My friend didn't text me back.'\n\nCRITICAL: Be highly creative and diverse. Generate one event related to "${theme1}", one related to "${theme2}", and one related to "${theme3}". Do NOT use generic examples like 'meetings', 'presentations', or 'groceries'.\n\nRandom seed: ${seed}`;
        },
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: { text: { type: "string" } },
            required: ["text"],
          },
        },
        maxResults: 3,
        aiLoadingMessage: "Finding relatable situations...",
      },
    },
    {
      id: "belief",
      component: ABCBeliefStep,
      label: "What did you tell yourself?",
      validate: (r) => r.belief.trim().length >= 1,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist assistant. Based on this situation:\n"${r.activatingEvent}"\n\nGenerate 3 likely negative automatic thoughts or beliefs the user might have had. Keep them in the first person ("I...", "They..."), brief (1 sentence), and realistic.`,
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: { text: { type: "string" } },
            required: ["text"],
          },
        },
        maxResults: 3,
        aiLoadingMessage: "Identifying core beliefs...",
      },
    },
    {
      id: "consequence",
      component: ABCConsequenceStep,
      label: "Consequence (emotion + behavior)",
      validate: (r) =>
        r.consequenceEmotion.trim().length >= 1 &&
        r.consequenceBehavior.trim().length >= 1,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist assistant. Based on this belief:\n"${r.belief}"\n\nGenerate 3 likely emotional and behavioral consequences the user might have experienced. Keep them brief.`,
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: { emotion: { type: "string" }, behavior: { type: "string" } },
            required: ["emotion", "behavior"],
          },
        },
        maxResults: 3,
        aiLoadingMessage: "Analyzing emotional impact...",
      },
    },
    {
      id: "alternative_belief",
      component: ABCAlternativeBeliefStep,
      label: "Alternative belief",
      validate: (r) => r.alternativeBelief.trim().length >= 1,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist. The user experienced:\nEvent: "${r.activatingEvent}"\nBelief: "${r.belief}"\nConsequence: Emotion: "${r.consequenceEmotion}", Behavior: "${r.consequenceBehavior}"\n\nSuggest 3 alternative, more balanced beliefs. Each should be realistic and written in first person. For each, provide a brief rationale. CRITICAL: Write the rationale addressing the user directly in the second person (e.g., "This reminds you that..."). Do NOT use third-person language.`,
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
        aiLoadingMessage: "Challenging the thought...",
      },
    },
    {
      id: "new_consequence",
      component: ABCNewConsequenceStep,
      label: "Predicted new consequence",
      validate: (r) => r.newConsequence.trim().length >= 1,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist assistant. Based on this alternative belief:\n"${r.alternativeBelief}"\n\nGenerate 3 likely new positive emotional or behavioral consequences the user might experience. Keep them in the first person ("I would..."), brief (1 sentence).`,
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: { text: { type: "string" } },
            required: ["text"],
          },
        },
        maxResults: 3,
        aiLoadingMessage: "Visualizing new outcomes...",
      },
    },
    {
      id: "post_emotional_intensity",
      component: createStep(SliderStep, {
        title: "After Reframing",
        subtitle: "How intense are your emotions now?",
        fieldKey: "postEmotionalIntensity",
        min: 1,
        max: 10,
        minLabel: "Mild",
        maxLabel: "Very intense",
      }),
      label: "How intense are your emotions now? (1-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: ABCSummaryStep,
      label: "Summary",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};
