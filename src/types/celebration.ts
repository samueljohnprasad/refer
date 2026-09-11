export type LessonPhase =
  | 'playing'
  | 'evaluating'
  | 'success_feedback'
  | 'celebrating'
  | 'completed';

export interface CelebrationContext {
  level: 1 | 2;
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
