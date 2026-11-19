// ponytail: Happi acting-pose data, ported verbatim from the finalized .agents/happi.js (the single source
// of truth — already visually approved this session). aR/eR are stored pre-negated, matching happi.js; the
// sign flip happens once, at matrix-build time in happiMotionEngine.ts, not here.
import { GoalId } from '../../domain/enums';
import type { PropKind, GroundKind } from '@/src/components/ui/happy-scene/HappiProps';

export type { PropKind, GroundKind };

export enum ActingPose {
  Rest = 'rest',
  Heavy = 'heavy',
  Listen = 'listen',
  Gentle = 'gentle',
  Relieved = 'relieved',
  Pride = 'pride',
  // Home screen poses (.agents/happi.js); hop/breath/palm fields are still dropped — this engine doesn't render them.
  Wave = 'wave',
  Welcome = 'welcome',
  Content = 'content',
  Evening = 'evening',
  Catch = 'catch',
  Cheer = 'cheer',
  Proud = 'proud',
  // Exercise poses (.agents/happi.js): each holds the exercise's own prop.
  Reframe = 'reframe',
  Abc = 'abc',
  Act = 'act',
  Ladder = 'ladder',
}

export type PoseKey = ActingPose | GoalId;

export interface PoseChannels {
  aL: number; eL: number; aR: number; eR: number;
  head: number; lean: number; shift: number; gx: number; gy: number;
  lid: number; cheek: number; mouth: number;
  sink: number; sy: number; pup: number;
  f: number;
  /** vertical lift of the whole figure + shadow (Fear Ladder stands on a step) */
  stage: number;
}

// lean/shift always resolve to 0 (no onboarding pose sets them) but stay in the channel set so the idle
// sway terms that reference them (head counter-rotation) still run, matching happi.js's generic pose system.
export const NEUTRAL: PoseChannels = {
  aL: 12, eL: 6, aR: 16, eR: -8, head: 0, lean: 0, shift: 0, gx: 0, gy: 0,
  lid: 0, cheek: 0, mouth: 0, sink: 0, sy: 1, pup: 1, f: .35, stage: 0,
};

/** what Happi holds in each paw and stands on; geometry lives in happy-scene/HappiProps.tsx */
export interface HappiScene { propL?: PropKind; propR?: PropKind; ground?: GroundKind }

export type PoseRow = Partial<PoseChannels> & HappiScene & { hold: number };

export const POSES: Record<PoseKey, PoseRow> = {
  [ActingPose.Rest]: { aL: 12, eL: 6, aR: 16, eR: -8, head: 0, hold: 600 },
  [GoalId.Worry]: { aL: -6, eL: -78, aR: -6, eR: -78, head: 7, gx: 3.5, gy: -1.5, sink: 1, pup: .9, hold: 600 },
  [GoalId.Mood]: { aL: 2, eL: 0, aR: 2, eR: 0, head: -6, gy: 3, lid: .15, sink: 2, sy: .99, hold: 600 },
  [GoalId.Stress]: { aL: 26, eL: 34, aR: 26, eR: 34, head: -2, gx: -2.5, gy: -.5, sink: 1, sy: .95, pup: .9, hold: 600 },
  [GoalId.Self]: { aL: -8, eL: -82, aR: 6, eR: -2, head: -8, gx: -2.5, gy: 3, lid: .2, sink: 1, sy: .985, pup: .9, hold: 600 },
  [GoalId.Sleep]: { aL: 10, eL: 4, aR: -4, eR: -96, head: 8, gy: 1.5, lid: .65, sink: 3, sy: .985, hold: 600 },
  [ActingPose.Heavy]: { aL: 4, eL: 0, aR: 4, eR: 0, head: -4, gy: 2.5, lid: .25, sink: 2, sy: .97, pup: .9, hold: 600 },
  [ActingPose.Listen]: { aL: 12, eL: 6, aR: -8, eR: -92, head: -6, gx: -2, gy: 2.5, pup: 1.05, hold: 600 },
  [ActingPose.Gentle]: { aL: 34, eL: 30, aR: 34, eR: 30, head: 8, gy: .5, lid: .15, pup: 1.08, hold: 600 },
  [ActingPose.Relieved]: { aL: 24, eL: 20, aR: 24, eR: 20, head: -2, gx: 3, gy: -3, cheek: .6, sy: 1.01, hold: 1600 },
  [ActingPose.Pride]: { aL: -4, eL: -70, aR: 16, eR: -8, head: 5, cheek: .6, sy: 1.02, hold: 1300 },

  [ActingPose.Wave]: { aL: 50, eL: 125, head: 3, gx: 1, hold: 1150 },
  [ActingPose.Welcome]: { aL: 62, eL: 34, aR: 58, eR: 26, head: -3, cheek: .7, mouth: .6, hold: 1300 },
  [ActingPose.Content]: { aL: -32, eL: -38, aR: -30, eR: -40, head: 5, cheek: 1, gy: -1, hold: 1200 },
  [ActingPose.Evening]: { aL: 30, eL: 20, aR: 12, eR: -6, head: 4, gx: -3.5, gy: 3, lid: .38, propL: 'lantern', hold: 1400 },
  [ActingPose.Catch]: { aL: 46, eL: 90, head: 5, gx: -3, gy: -1.5, propL: 'jar', hold: 1250 },
  [ActingPose.Reframe]: { aL: 50, eL: 92, aR: 22, eR: -10, head: 6, gx: -3.5, gy: -2, cheek: .3, propL: 'frame', hold: 1250 },
  [ActingPose.Abc]: { aL: 60, eL: 82, head: 4, gx: -2.5, gy: -1, propL: 'lens', hold: 1250 },
  [ActingPose.Act]: { aL: 48, eL: 42, head: 7, gx: -4, gy: 3, lean: -2, propL: 'can', ground: 'sprout', hold: 1100 },
  [ActingPose.Ladder]: { aL: 82, eL: 92, aR: 22, eR: -12, head: -3, gx: 1.5, gy: -1.5, cheek: .4, stage: -18, propL: 'flag', ground: 'step', hold: 1300 },
  [ActingPose.Cheer]: { aL: 58, eL: -24, aR: 60, eR: -26, head: -2, cheek: 1, mouth: 1, hold: 1100 },
  [ActingPose.Proud]: { aL: 18, eL: 4, aR: -50, eR: 24, head: 7, cheek: 1, gy: -1, hold: 1300 },
};
