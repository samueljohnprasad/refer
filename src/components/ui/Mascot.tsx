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
  | 'panda-yet-sleep-pillow';

const MASCOT_IMAGES: Record<MascotState, any> = {
  hi: require('@/assets/images/panda-hi.png'),
  excite: require('@/assets/images/excite.png'),
  happy: require('@/assets/images/happy.png'),
  'panda-confused-thinking': require('@/assets/images/panda/panda-confused-thinking.png'),
  'panda-happy': require('@/assets/images/panda/panda-happy.png'),
  'panda-love-hug-2': require('@/assets/images/panda/panda-love-hug-2.png'),
  'panda-love-hug': require('@/assets/images/panda/panda-love-hug.png'),
  'panda-notes': require('@/assets/images/panda/panda-notes.png'),
  'panda-pillow-hug': require('@/assets/images/panda/panda-pillow-hug.png'),
  'panda-plant': require('@/assets/images/panda/panda-plant.png'),
  'panda-super-excite': require('@/assets/images/panda/panda-super-excite.png'),
  'panda-yet-sleep-pillow': require('@/assets/images/panda/panda-yet-sleep-pillow.png'),
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
