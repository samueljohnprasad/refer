import { useCallback } from 'react';
import { useSharedValue, withTiming, Easing, type SharedValue } from 'react-native-reanimated';
import { GoalId } from '../../domain/enums';

export enum ActingPose {
  Rest = 'rest',
  Worry = 'worry',
  Mood = 'mood',
  Relieved = 'relieved',
  Pride = 'pride',
}

export interface HappiGuideMotion {
  weatherF: SharedValue<number>;
  setWeather: (f: number, slow?: boolean) => void;
  actPose: (pose: ActingPose | GoalId) => void;
}

// ponytail: motion hook managing weather shared value and character pose state
export function useHappiGuideMotion(): HappiGuideMotion {
  const weatherF: SharedValue<number> = useSharedValue<number>(0.35);

  const setWeather = useCallback((f: number, slow: boolean = false): void => {
    weatherF.value = withTiming(f, {
      duration: slow ? 1600 : 600,
      easing: Easing.bezier(0.77, 0, 0.175, 1),
    });
  }, [weatherF]);

  const actPose = useCallback((_pose: ActingPose | GoalId): void => {
    // ponytail: simplified pose tracking
  }, []);

  return {
    weatherF,
    setWeather,
    actPose,
  };
}
