import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

export type MascotState =
  | 'hi'
  | 'excite'
  | 'happy'
  // the new panda folder states
  | 'panda-confused-thinking'
  | 'panda-happy'
  | 'panda-love-hug-2'
  | 'panda-love-hug'
  | 'panda-notes'
  | 'panda-pillow-hug'
  | 'panda-plant'
  | 'panda-super-excite'
  | 'panda-yet-sleep-pillow'
  | 'panda-flex'
  | 'panda-transcend'
  | 'panda-pleading'
  | 'panda-self-hug'
  | 'panda-high-five'
  | 'panda-pondering'
  | 'panda-shield'
  | 'panda-sprout'
  | 'panda-journaling'
  | 'panda-umbrella'
  | 'panda-heart-bandage'
  | 'panda-lantern'
  | 'panda-bubble'
  | 'panda-tea'
  | 'panda-cheer'
  | 'panda-coping-card'
  | 'panda-habit'
  | 'panda-analyst'
  | 'panda-explorer'
  | 'panda-flag-milestone'
  | 'panda-milestone'
  | 'panda-breathing'
  | 'panda-celebration'
  | 'panda-comfort'
  | 'panda-detective'
  | 'panda-insight'
  | 'panda-pancake'
  | 'panda-proud-tears'
  | 'panda-side-eye'
  | 'panda-sleep'
  | 'panda-sage'
  | 'panda-target'
  | 'panda-bell'
  | 'panda-headset'
  | 'panda-nametag'
  | 'panda-toolkit'
  // ponytail: round 3 additions
  | 'panda-stopwatch'
  | 'panda-paper-plane'
  | 'panda-caution';

const MASCOT_IMAGES: Record<MascotState, any> = {
  hi: require('@/assets/images/panda-hi.png'),
  excite: require('@/assets/images/excite.png'),
  happy: require('@/assets/images/happy.png'),
  'panda-confused-thinking': require('@/assets/images/panda/panda-confused-thinking.png'),
  'panda-happy': require('@/assets/images/panda/panda-happy.png'),
  'panda-love-hug-2': require('@/assets/images/panda/panda-love-hug-2.png'),
  'panda-love-hug': require('@/assets/images/panda/panda-love-hug.png'),
  // ponytail: legacy aliases upgrade to high-res situational vectors
  'panda-notes': require('@/assets/images/panda/panda-journaling.png'),
  'panda-pillow-hug': require('@/assets/images/panda/panda-pillow-hug.png'),
  'panda-plant': require('@/assets/images/panda/panda-sprout.png'),
  'panda-super-excite': require('@/assets/images/panda/panda-super-excite.png'),
  'panda-yet-sleep-pillow': require('@/assets/images/panda/panda-yet-sleep-pillow.png'),
  'panda-flex': require('@/assets/images/panda/panda-flex.png'),
  'panda-transcend': require('@/assets/images/panda/panda-transcend.png'),
  'panda-pleading': require('@/assets/images/panda/panda-pleading.png'),
  'panda-self-hug': require('@/assets/images/panda/panda-self-hug.png'),
  'panda-high-five': require('@/assets/images/panda/panda-high-five.png'),
  'panda-pondering': require('@/assets/images/panda/panda-pondering.png'),
  'panda-shield': require('@/assets/images/panda/panda-shield.png'),
  'panda-sprout': require('@/assets/images/panda/panda-sprout.png'),
  'panda-journaling': require('@/assets/images/panda/panda-journaling.png'),
  'panda-umbrella': require('@/assets/images/panda/panda-umbrella.png'),
  'panda-heart-bandage': require('@/assets/images/panda/panda-heart-bandage.png'),
  'panda-lantern': require('@/assets/images/panda/panda-lantern.png'),
  'panda-bubble': require('@/assets/images/panda/panda-bubble.png'),
  'panda-tea': require('@/assets/images/panda/panda-tea.png'),
  'panda-cheer': require('@/assets/images/panda/panda-cheer.png'),
  'panda-coping-card': require('@/assets/images/panda/panda-coping-card.png'),
  'panda-habit': require('@/assets/images/panda/panda-habit.png'),
  'panda-analyst': require('@/assets/images/panda/panda-analyst.png'),
  'panda-explorer': require('@/assets/images/panda/panda-explorer.png'),
  'panda-flag-milestone': require('@/assets/images/panda/panda-flag-milestone.png'),
  'panda-milestone': require('@/assets/images/panda/panda-milestone.png'),
  'panda-breathing': require('@/assets/images/panda/panda-breathing.png'),
  'panda-celebration': require('@/assets/images/panda/panda-celebration.png'),
  'panda-comfort': require('@/assets/images/panda/panda-comfort.png'),
  'panda-detective': require('@/assets/images/panda/panda-detective.png'),
  'panda-insight': require('@/assets/images/panda/panda-insight.png'),
  'panda-pancake': require('@/assets/images/panda/panda-pancake.png'),
  'panda-proud-tears': require('@/assets/images/panda/panda-proud-tears.png'),
  'panda-side-eye': require('@/assets/images/panda/panda-side-eye.png'),
  'panda-sleep': require('@/assets/images/panda/panda-sleep.png'),
  'panda-sage': require('@/assets/images/panda/panda-sage.png'),
  'panda-target': require('@/assets/images/panda/panda-target.png'),
  'panda-bell': require('@/assets/images/panda/panda-bell.png'),
  'panda-headset': require('@/assets/images/panda/panda-headset.png'),
  'panda-nametag': require('@/assets/images/panda/panda-nametag.png'),
  'panda-toolkit': require('@/assets/images/panda/panda-toolkit.png'),
  'panda-stopwatch': require('@/assets/images/panda/panda-stopwatch.png'),
  'panda-paper-plane': require('@/assets/images/panda/panda-paper-plane.png'),
  'panda-caution': require('@/assets/images/panda/panda-caution.png'),
};

interface MascotProps {
  /** The state/expression of the mascot to show */
  state: MascotState;
  /** Size in dp (square) */
  size?: number;
  /** Tailwind classes for wrapper */
  className?: string;
  /** Optional inline styles for wrapper */
  style?: ViewStyle;
}

/**
 * Universal Mascot component. 
 * Renders the chosen mascot state as an exact-fit square image.
 */
export function Mascot({ state, size = 64, className, style }: MascotProps) {
  // Fallback to 'hi' if an unrecognized state is somehow passed
  const source = MASCOT_IMAGES[state] ?? MASCOT_IMAGES['hi'];

  return (
    <View className={className} style={style}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
        accessibilityLabel={`Mascot looking ${state}`}
      />
    </View>
  );
}
