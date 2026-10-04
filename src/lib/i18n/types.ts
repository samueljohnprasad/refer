// ponytail: declaration merging for typed translation keys
import type common from '../../locales/en/common.json';
import type home from '../../locales/en/home.json';
import type exercises from '../../locales/en/exercises.json';
import type exerciseFlowCourseCopy from '../../locales/en/exerciseFlowCourseContent.json';
import type exerciseFlowModuleCopy from '../../locales/en/exerciseFlowModuleContent.json';
import type exerciseFlowRendererCopy from '../../locales/en/exerciseFlowRendererCopy.json';
import type exerciseFlowSharedCopy from '../../locales/en/exerciseFlowSharedCopy.json';
import type journal from '../../locales/en/journal.json';
import type habits from '../../locales/en/habits.json';
import type settings from '../../locales/en/settings.json';
import type onboarding from '../../locales/en/onboarding.json';
import type journeys from '../../locales/en/journeys.json';
import type insights from '../../locales/en/insights.json';
import type tracking from '../../locales/en/tracking.json';
import type timelineSamples from '../../locales/en/timelineSamples.json';

type ExerciseFlowCopy = typeof exerciseFlowCourseCopy &
  typeof exerciseFlowModuleCopy &
  typeof exerciseFlowRendererCopy &
  typeof exerciseFlowSharedCopy;

type ExercisesResource = Omit<typeof exercises, 'flow'> & {
  flow: Omit<typeof exercises.flow, 'ui'> & {
    ui: typeof exercises.flow.ui & { copy: ExerciseFlowCopy };
  };
};

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      home: typeof home;
      exercises: ExercisesResource;
      journal: typeof journal;
      habits: typeof habits;
      settings: typeof settings;
      onboarding: typeof onboarding;
      journeys: typeof journeys;
      insights: typeof insights;
      tracking: typeof tracking;
      timelineSamples: typeof timelineSamples;
    };
  }
}
