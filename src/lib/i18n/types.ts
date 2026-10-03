// ponytail: declaration merging for typed translation keys
import type common from '../../locales/en/common.json';
import type home from '../../locales/en/home.json';
import type exercises from '../../locales/en/exercises.json';
import type journal from '../../locales/en/journal.json';
import type habits from '../../locales/en/habits.json';
import type settings from '../../locales/en/settings.json';
import type onboarding from '../../locales/en/onboarding.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      home: typeof home;
      exercises: typeof exercises;
      journal: typeof journal;
      habits: typeof habits;
      settings: typeof settings;
      onboarding: typeof onboarding;
    };
  }
}
