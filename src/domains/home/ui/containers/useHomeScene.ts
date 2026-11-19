// ponytail: day/night read once per mount (home.html computes NIGHT once at page load, not a live clock)
// + Happi pose/line selection, mirroring home.html's `pose`/`say` logic. ONB/DONE/MINE/CALM map onto the
// real reflections/crisis state instead of URL query params.
import { useMemo } from 'react';
import type { ReflectionData } from '@/src/domains/onboarding/domain/types';
import { ActingPose } from '@/src/domains/onboarding/ui/containers/happiPoses';

export interface HomeSceneState {
  night: boolean;
  pose: ActingPose;
  say: string;
}

export interface UseHomeSceneArgs {
  mostRecent: ReflectionData | null;
  isFirstHomeVisit: boolean;
  crisisActive: boolean;
}

export function useHomeScene({ mostRecent, isFirstHomeVisit, crisisActive }: UseHomeSceneArgs): HomeSceneState {
  return useMemo(() => {
    const hr = new Date().getHours();
    const night = hr >= 19 || hr < 6;
    const hasOnboarded = !!mostRecent;
    const isPersonal = mostRecent?.source === 'personal';

    const pose = night
      ? ActingPose.Evening
      : hasOnboarded
        ? (isFirstHomeVisit && !crisisActive ? ActingPose.Cheer : ActingPose.Content)
        : ActingPose.Wave;

    const say = night
      ? 'Long day? I kept the lamp on.'
      : hasOnboarded
        ? (isFirstHomeVisit && !crisisActive
          ? (isPersonal ? 'You caught your first one!' : 'You finished your first one.')
          : 'Good to see you.')
        : 'Hi, I’m Happi.';

    return { night, pose, say };
  }, [mostRecent, isFirstHomeVisit, crisisActive]);
}
