import type {
  ExerciseConfig,
  ProcrastinationBusterResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { AITextInputStep } from "@/src/components/exercise/steps/AITextInputStep";
import { AcknowledgeStep } from "@/src/components/exercise/steps/AcknowledgeStep";

const INITIAL: ProcrastinationBusterResponse = {
  avoidedTask: "",
  avoidanceReason: "",
  microTasks: [],
  scheduledFirst: "",
  cognitiveRestructure: "",
  commitmentConfirmed: false,
};

export const procrastinationBusterConfig: ExerciseConfig<ProcrastinationBusterResponse> =
  {
    type: "procrastination_buster",
    category: "procrastination",
    title: "Procrastination Buster",
    subtitle: "Break tasks down and start small",
    icon: "procrastination_buster",
    duration: "5-7 min",
    xp: 12,
    backgroundColor: "#FFF8E1",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Procrastination Buster",
          subtitle: "The hardest part is starting. Let's make it tiny.",
          exerciseType: "procrastination_buster",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "avoided_task",
        component: createStep(TextInputStep, {
          title: "The Task",
          subtitle: "What have you been avoiding?",
          fieldKey: "avoidedTask",
          placeholder: "I've been putting off...",
        }),
        label: "What are you avoiding?",
        validate: (r) => r.avoidedTask.trim().length >= 1,
      },
      {
        id: "avoidance_reason",
        component: createStep(TextInputStep, {
          title: "Why?",
          subtitle: "What makes you avoid it?",
          fieldKey: "avoidanceReason",
          placeholder: "I avoid it because...",
        }),
        label: "Why are you avoiding it?",
        validate: (r) => r.avoidanceReason.trim().length >= 1,
      },
      {
        id: "micro_tasks",
        component: createStep(MultiTextInputStep, {
          title: "Micro-Tasks",
          subtitle: "Break it into the tiniest possible steps.",
          fieldKey: "microTasks",
          placeholder: "One tiny step...",
          minItems: 1,
        }),
        label: "Break it into tiny tasks",
        validate: (r) => r.microTasks.length >= 1,
      },
      {
        id: "schedule_first",
        component: createStep(TextInputStep, {
          title: "Schedule It",
          subtitle: "When will you do the first micro-task?",
          fieldKey: "scheduledFirst",
          placeholder: "I'll do it at...",
        }),
        label: "Schedule the first micro-task",
        validate: (r) => r.scheduledFirst.length > 0,
      },
      {
        id: "cognitive_restructure",
        component: createStep(AITextInputStep, {
          title: "Reframe",
          subtitle: "Reframe the thought that makes you avoid.",
          fieldKey: "cognitiveRestructure",
          placeholder: "Instead of thinking that, I can think...",
        }),
        label: "Reframe the avoidance thought",
        validate: (r) => r.cognitiveRestructure.trim().length >= 1,
        ai: {
          promptBuilder: (r) =>
            `The user is avoiding: "${r.avoidedTask}" because: "${r.avoidanceReason}"\n\nSuggest 2 cognitive reframes that make starting feel easier. Each should be realistic and motivating.`,
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: { text: { type: "string" } },
              required: ["text"],
            },
          },
          maxResults: 2,
        },
      },
      {
        id: "commit",
        component: createStep(AcknowledgeStep, {
          title: "Commit",
          subtitle: "Ready to start?",
          fieldKey: "commitmentConfirmed",
          body: "I commit to doing the first micro-task at the scheduled time.",
          buttonLabel: "I commit!",
        }),
        label: "Commit to starting",
        validate: (r) => r.commitmentConfirmed,
      },
      {
        id: "summary",
        component: createSummaryStep<ProcrastinationBusterResponse>(
          [
            { label: "Task", key: "avoidedTask" },
            { label: "First Step", key: "scheduledFirst" },
            { label: "Reframe", key: "cognitiveRestructure" },
          ],
          { title: "Ready to start!", exerciseType: "procrastination_buster" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };
