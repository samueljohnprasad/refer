export type LessonPhase =
  | 'playing'
  | 'evaluating'
  | 'success_feedback'
  | 'celebrating'
  | 'completed';

export interface CelebrationContext {
  type: 'lesson' | 'lesson_streak' | 'unit' | 'course';
  eyebrowText?: string;
  primaryText: string;
  secondaryText: string;
  pandaAnimationKey: 'anxiety_relax' | 'thought_reframe' | 'sleep_calm' | 'generic_success';
  backgroundColor: string;
}

export interface CelebrationOverlayProps {
  isVisible: boolean;
  context: CelebrationContext;
  onContinue: () => void;
  onInteractionAvailable?: () => void;
}
