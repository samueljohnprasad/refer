import type { EmotionName } from '../types';

export interface EmotionOption {
  name: EmotionName;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const EMOTION_OPTIONS: EmotionOption[] = [
  { name: 'anxious', label: 'Anxious', emoji: '😰', color: '#E85D04', bgColor: '#FFF3E0' },
  { name: 'sad', label: 'Sad', emoji: '😢', color: '#5C6BC0', bgColor: '#E8EAF6' },
  { name: 'angry', label: 'Angry', emoji: '😠', color: '#E53935', bgColor: '#FFEBEE' },
  { name: 'ashamed', label: 'Ashamed', emoji: '😳', color: '#AB47BC', bgColor: '#F3E5F5' },
  { name: 'hopeless', label: 'Hopeless', emoji: '😔', color: '#455A64', bgColor: '#ECEFF1' },
  { name: 'guilty', label: 'Guilty', emoji: '😞', color: '#6D4C41', bgColor: '#EFEBE9' },
  { name: 'frustrated', label: 'Frustrated', emoji: '😤', color: '#F4511E', bgColor: '#FBE9E7' },
  { name: 'fearful', label: 'Fearful', emoji: '😨', color: '#7B1FA2', bgColor: '#F3E5F5' },
  { name: 'overwhelmed', label: 'Overwhelmed', emoji: '🤯', color: '#00838F', bgColor: '#E0F7FA' },
  { name: 'lonely', label: 'Lonely', emoji: '🥺', color: '#37474F', bgColor: '#ECEFF1' },
];
