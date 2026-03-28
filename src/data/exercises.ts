import { CBTExercise } from '../types/exercises';

export const CBT_EXERCISES: CBTExercise[] = [
  {
    id: 'thought-reframing',
    title: 'Thought Reframing',
    subtitle: 'Identify and challenge unhelpful thoughts',
    duration: '2 minutes',
    step: 1,
    icon: '🧠',
    badgeIcon: '🔎',
    backgroundColor: '#E8F0FE',
    badgeColor: 'bg-blue-100',
    badgeTextColor: 'text-blue-700',
  },
  {
    id: 'behavioral-activation',
    title: 'Behavioral Activation',
    subtitle: 'Schedule activities to boost your energy',
    duration: '3 minutes',
    step: 2,
    icon: '🧠',
    badgeIcon: '✅',
    backgroundColor: '#E6F4EA',
    badgeColor: 'bg-green-100',
    badgeTextColor: 'text-green-700',
  },
];
