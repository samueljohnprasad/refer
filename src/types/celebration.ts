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
  pandaAnimationKey:
    | 'anxiety_relax'
    | 'thought_reframe'
    | 'sleep_calm'
    | 'generic_success'
    | 'boundary_protect'
    | 'growth_nurture'
    | 'journal_entry'
    | 'weather_storm'
    | 'healing_tender'
    | 'guiding_light'
    | 'defusion_bubble'
    | 'mindful_tea'
    | 'cheer_activation'
    | 'coping_anchor'
    | 'habit_momentum'
    | 'insight_analyst'
    | 'journey_explore'
    | 'badge_milestone';
  backgroundColor: string;
}

export interface CelebrationOverlayProps {
  isVisible: boolean;
  context: CelebrationContext;
  onContinue: () => void;
  onInteractionAvailable?: () => void;
}
