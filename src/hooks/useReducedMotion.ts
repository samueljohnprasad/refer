/**
 * useReducedMotion
 *
 * Returns `true` when the user has enabled "Reduce Motion" in iOS/Android
 * accessibility settings. All animated components must check this and either
 * skip or instant-complete their animations.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState<boolean>(false);

  useEffect(() => {
    let subscription: ReturnType<typeof AccessibilityInfo.addEventListener> | undefined;

    // Read initial value
    AccessibilityInfo.isReduceMotionEnabled().then((enabled: boolean) => {
      setIsReduced(enabled);
    });

    // Subscribe to changes
    subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setIsReduced(enabled);
      },
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return isReduced;
}
