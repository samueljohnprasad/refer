import type { CognitiveDistortion } from '../types';

export const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    key: 'all_or_nothing',
    label: 'All-or-nothing',
    description: 'Black or white, no middle ground.',
    example: '“If it isn’t perfect, I failed.”',
    icon: '⚫',
  },
  {
    key: 'catastrophizing',
    label: 'Catastrophizing',
    description: 'Jumping to the worst outcome.',
    example: '“This mistake will ruin everything.”',
    icon: '🌪️',
  },
  {
    key: 'mind_reading',
    label: 'Mind reading',
    description: 'Assuming you know what they think.',
    example: '“They must think I’m useless.”',
    icon: '🔮',
  },
  {
    key: 'overgeneralizing',
    label: 'Overgeneralizing',
    description: 'One event becomes a rule.',
    example: '“I always mess things up.”',
    icon: '🔄',
  },
  {
    key: 'personalizing',
    label: 'Personalizing',
    description: 'Taking the blame for what you don’t control.',
    example: '“It’s all my fault.”',
    icon: '👤',
  },
  {
    key: 'filtering',
    label: 'Mental filter',
    description: 'Only the bad parts get through.',
    example: '“Nothing went well today.”',
    icon: '🔍',
  },
  {
    key: 'should_statements',
    label: 'Should statements',
    description: 'Strict rules about how things must be.',
    example: '“I should be able to handle this.”',
    icon: '📏',
  },
  {
    key: 'fortune_telling',
    label: 'Fortune telling',
    description: 'Predicting it will go wrong.',
    example: '“This will definitely go badly.”',
    icon: '🎱',
  },
  {
    key: 'emotional_reasoning',
    label: 'Emotional reasoning',
    description: 'It feels true, so it must be.',
    example: '“I feel stupid, so I am.”',
    icon: '💭',
  },
  {
    key: 'labeling',
    label: 'Labeling',
    description: 'One word for a whole person.',
    example: '“I’m such a loser.”',
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
