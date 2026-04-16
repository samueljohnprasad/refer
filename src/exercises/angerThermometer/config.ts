
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";
import { ChoiceStep } from "@/src/components/exercise/steps/ChoiceStep";
import { CountdownTimerStep } from "@/src/components/exercise/steps/CountdownTimerStep";
import { AngerThermometerResponse, ExerciseConfig } from "@/src/types/exerciseFlow";
import { createStep, TextInputStep } from "@/src/components/exercise/steps";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";

const INITIAL: AngerThermometerResponse = {
  angerRating: 5,
  trigger: "",
  thoughts: "",
  matchedCopingSkill: "",
  techniqueCompleted: false,
  postAngerRating: 5,
};

export const angerThermometerConfig: ExerciseConfig<AngerThermometerResponse> =
  {
    type: "anger_thermometer",
    category: "anger",
    title: "Anger Thermometer",
    subtitle: "Measure and cool down your anger",
    icon: "anger_thermometer",
    duration: "5-7 min",
    xp: 10,
    backgroundColor: "#FFEBEE",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Anger Thermometer",
          subtitle: "Measure your anger, understand it, and cool it down.",
          exerciseType: "anger_thermometer",
          duration: "5-7 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "anger_rating",
        component: createStep(SliderStep, {
          title: "Anger Level",
          subtitle: "How angry do you feel right now?",
          fieldKey: "angerRating",
          min: 0,
          max: 10,
          minLabel: "Calm",
          maxLabel: "Furious",
        }),
        label: "Rate your anger (0-10)",
        validate: () => true,
      },
      {
        id: "trigger",
        component: createStep(TextInputStep, {
          title: "The Trigger",
          subtitle: "What set off your anger?",
          fieldKey: "trigger",
          placeholder: "What happened was...",
        }),
        label: "What triggered this?",
        validate: (r) => r.trigger.trim().length >= 1,
      },
      {
        id: "thoughts",
        component: createStep(TextInputStep, {
          title: "Fuelling Thoughts",
          subtitle: "What thoughts are keeping the anger going?",
          fieldKey: "thoughts",
          placeholder: "I keep thinking...",
        }),
        label: "What thoughts are fuelling it?",
        validate: (r) => r.thoughts.trim().length >= 1,
      },
      {
        id: "coping_skill",
        component: createStep(ChoiceStep, {
          title: "Coping Skill",
          subtitle: "Choose a technique to cool down.",
          fieldKey: "matchedCopingSkill",
          options: [
            {
              value: "deep_breathing",
              label: "Deep breathing",
              iconKey: "deep_breathing",
            },
            {
              value: "count_to_10",
              label: "Count to 10",
              iconKey: "count_to_10",
            },
            {
              value: "walk_away",
              label: "Walk away briefly",
              iconKey: "walk_away",
            },
            {
              value: "cold_water",
              label: "Cold water on face",
              iconKey: "cold_water",
            },
          ],
        }),
        label: "Match a coping skill",
        validate: (r) => r.matchedCopingSkill.length > 0,
      },
      {
        id: "do_technique",
        component: createStep(CountdownTimerStep, {
          title: "Cool Down",
          subtitle: "Practice your chosen technique for 60 seconds.",
          timerConfig: {
            type: "countdown" as const,
            durationMs: 60_000,
            skippable: true,
          },
          completedFieldKey: "techniqueCompleted",
        }),
        label: "Do the technique (60s)",
        validate: (r) => r.techniqueCompleted,
        timerConfig: { type: "countdown", durationMs: 60_000, skippable: true },
      },
      {
        id: "post_anger_rating",
        component: createStep(SliderStep, {
          title: "Anger Now",
          subtitle: "How angry do you feel after the technique?",
          fieldKey: "postAngerRating",
          min: 0,
          max: 10,
          minLabel: "Calm",
          maxLabel: "Furious",
        }),
        label: "Anger now? (0-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<AngerThermometerResponse>(
          [
            { label: "Anger Before", key: "angerRating" },
            { label: "Trigger", key: "trigger" },
            { label: "Technique", key: "matchedCopingSkill" },
            { label: "Anger After", key: "postAngerRating" },
          ],
          { title: "Cooled down!", exerciseType: "anger_thermometer" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };
