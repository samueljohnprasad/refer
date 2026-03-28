import type { CognitiveDistortion } from '../types';

export const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    key: 'all_or_nothing',
    label: 'All-or-Nothing',
    description: 'Seeing things as black or white with no middle ground',
    example: '"If I\'m not perfect, I\'m a failure"',
    icon: '⚫',
  },
  {
    key: 'catastrophizing',
    label: 'Catastrophizing',
    description: 'Expecting the worst possible outcome',
    example: '"This mistake will ruin everything"',
    icon: '🌪️',
  },
  {
    key: 'mind_reading',
    label: 'Mind Reading',
    description: 'Assuming you know what others think',
    example: '"They must think I\'m incompetent"',
    icon: '🔮',
  },
  {
    key: 'overgeneralizing',
    label: 'Overgeneralizing',
    description: 'Using one event to make a broad rule',
    example: '"I always mess things up"',
    icon: '🔄',
  },
  {
    key: 'personalizing',
    label: 'Personalizing',
    description: 'Blaming yourself for things outside your control',
    example: '"It\'s all my fault"',
    icon: '👤',
  },
  {
    key: 'filtering',
    label: 'Mental Filtering',
    description: 'Focusing only on negatives, ignoring positives',
    example: '"Nothing went well today"',
    icon: '🔍',
  },
  {
    key: 'should_statements',
    label: 'Should Statements',
    description: 'Rigid rules about how things must be',
    example: '"I should be able to handle this"',
    icon: '📏',
  },
  {
    key: 'fortune_telling',
    label: 'Fortune Telling',
    description: 'Predicting negative outcomes without evidence',
    example: '"This will definitely go wrong"',
    icon: '🎱',
  },
  {
    key: 'emotional_reasoning',
    label: 'Emotional Reasoning',
    description: 'Believing something is true because you feel it',
    example: '"I feel stupid, so I must be stupid"',
    icon: '💭',
  },
  {
    key: 'labeling',
    label: 'Labeling',
    description: 'Attaching a global label to yourself or others',
    example: '"I\'m such a loser"',
    icon: '🏷️',
  },
];

export const SOCRATIC_PROMPTS: string[] = [
  'What would you tell a friend in this situation?',
  'Have you handled something similar before?',
  'Is there another way to look at this?',
  'What are you overlooking?',
  'Will this matter in 5 years?',
  'What\'s the best possible outcome?',
  'Is this thought based on facts or feelings?',
];

/**
 * Returns a random Socratic prompt for the evidence-against step.
 */
export const getRandomSocraticPrompt = (): string => {
  const index: number = Math.floor(Math.random() * SOCRATIC_PROMPTS.length);
  return SOCRATIC_PROMPTS[index];
};
