// ponytail: trap display mapping without runtime helpers
import { TrapType } from './enums';

export const TRAP_LABELS: Record<TrapType, string> = {
  [TrapType.MindReading]: 'Mind reading',
  [TrapType.Overgeneralizing]: 'Overgeneralizing',
  [TrapType.Catastrophizing]: 'Catastrophizing',
  [TrapType.Labeling]: 'Labeling',
  [TrapType.FortuneTelling]: 'Fortune telling',
  [TrapType.AllOrNothing]: 'All-or-nothing',
  [TrapType.Should]: 'Should statements',
};
