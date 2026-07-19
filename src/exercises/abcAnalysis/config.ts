import type {
  ExerciseConfig,
  ABCAnalysisResponse,
} from "@/src/types/exerciseFlow";
import {
  ABCActivatingEventStep,
  ABCAlternativeBeliefStep,
  ABCBeliefStep,
  ABCConsequenceBehaviorStep,
  ABCConsequenceEmotionStep,
  ABCNewConsequenceStep,
  hasSelectedABCEmotion,
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
  subtitle: "See how a moment, a thought, and a reaction connect.",
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
        subtitle: "See how a moment, a thought, and a reaction connect.",
        exerciseType: "abc_analysis",
        duration: "7-10 min",
        bulletPoints: [
          "Name what happened",
          "Catch the automatic thought",
          "Notice the feeling and reaction",
          "Try a more balanced thought",
          "See what might change",
        ],
      }),
      label: "Welcome",
      validate: () => true,
      excludeFromProgress: true,
    },
    {
      id: "pre_emotional_intensity",
      component: createStep(SliderStep, {
        title: "How intense does it feel?",
        subtitle: "Before you unpack it, where is it right now?",
        fieldKey: "preEmotionalIntensity",
        min: 0,
        max: 10,
        minLabel: "Mild",
        maxLabel: "Very intense",
        showStepCount: false,
      }),
      label: "How intense does it feel? (0-10)",
      validate: () => true,
    },
    {
      id: "activating_event",
      component: ABCActivatingEventStep,
      label: "What happened?",
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
      label: "Automatic thought",
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
        aiLoadingMessage: "Finding possible thoughts...",
      },
    },
    {
      id: "consequence_emotion",
      component: ABCConsequenceEmotionStep,
      label: "How did you feel?",
      validate: (r) => hasSelectedABCEmotion(r.consequenceEmotion),
    },
    {
      id: "consequence_behavior",
      component: ABCConsequenceBehaviorStep,
      label: "What did you do next?",
      validate: (r) => r.consequenceBehavior.trim().length >= 1,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist assistant. Based on this belief:\n"${r.belief}"\n\nGenerate 3 likely reactions or behaviors the user might have had. Return reactions or behaviors only. Keep them brief.`,
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: { text: { type: "string" } },
            required: ["text"],
          },
        },
        maxResults: 3,
        aiLoadingMessage: "Considering likely reactions...",
      },
    },
    {
      id: "alternative_belief",
      component: ABCAlternativeBeliefStep,
      label: "More balanced thought",
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
      label: "What might change now?",
      validate: (r) => r.newConsequence.trim().length >= 1,
      ai: {
        promptBuilder: (r) =>
          `You are a CBT therapist assistant. Based on this alternative belief:\n"${r.alternativeBelief}"\n\nGenerate 3 grounded ways the user's feelings or actions might change. Keep them in the first person ("I might..."), brief (1 sentence).`,
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: { text: { type: "string" } },
            required: ["text"],
          },
        },
        maxResults: 3,
        aiLoadingMessage: "Considering what might change...",
      },
    },
    {
      id: "post_emotional_intensity",
      component: createStep(SliderStep, {
        title: "How intense does it feel now?",
        subtitle: "After looking at the chain, where is it now?",
        fieldKey: "postEmotionalIntensity",
        min: 0,
        max: 10,
        minLabel: "Mild",
        maxLabel: "Very intense",
        showStepCount: false,
      }),
      label: "How intense does it feel now? (0-10)",
      validate: () => true,
    },
    {
      id: "summary",
      component: ABCSummaryStep,
      label: "Summary",
      nextLabel: "Complete",
      validate: () => true,
      excludeFromProgress: true,
    },
  ],
};
