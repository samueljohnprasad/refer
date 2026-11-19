// AD-17: the one rule for Home's bubble, button and tone card. Pure: no React, no I/O, no clock read.
import type { MoodBand } from '../../exercises/domain/mood';
import type { PausedEntry } from '../../thoughtCatcher/data/pausedEntry';

export interface HomeAskInputs {
  installDay: number; // whole days since first open
  gapDays: number; // days since the last practice
  practiceCount: number; // lifetime
  returnedWithin7Days: boolean;
  distress24h: boolean;
  bandToday: MoodBand | null; // null until today's chip is answered
  newestSavedTodayId: string | null; // null when no thought is saved today
  paused: PausedEntry | null;
  sessionBubbleCount: number;
  stepUpDeclined: boolean;
  helpOpenedThisSession: boolean;
  showHappi: boolean;
  toneCardSeen: boolean;
  askShownDate: string | null; // local YYYY-MM-DD
  welcomeBackShown24h: boolean;
}

export type HomeVariant = 'distressed' | 'resume' | 'lapsed' | 'postReturn' | 'lifecycle';
export type HomeModifier = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';
export type AskWindow = 'morning' | 'afternoon' | 'evening';
/** `base` = the base variant's own button decides; `none` = no filled button (M3). */
export type HomeButton = 'catch' | 'windDown' | 'continue' | 'base' | 'none';
export type HomeBubble = { kind: 'ask'; window: AskWindow } | { kind: 'return' } | null;

export interface HomeAsk {
  variant: HomeVariant;
  modifier: HomeModifier | null;
  bubble: HomeBubble;
  button: HomeButton;
  catchAnother: boolean;
  toneCard: boolean;
}

const ymd = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function baseVariant(i: HomeAskInputs): HomeVariant {
  if (i.distress24h || i.bandToday === 'notOkay') return 'distressed';
  if (i.practiceCount === 0) return 'resume';
  if (i.gapDays >= 3) return 'lapsed';
  if (i.returnedWithin7Days) return 'postReturn';
  return 'lifecycle';
}

const askWindow = (hour: number): AskWindow | null =>
  hour >= 5 && hour <= 11 ? 'morning' : hour >= 12 && hour <= 16 ? 'afternoon' : hour >= 17 && hour <= 21 ? 'evening' : null;

export function resolveHomeAsk(i: HomeAskInputs, now: Date): HomeAsk {
  const variant = baseVariant(i);
  const hour = now.getHours();
  const today = ymd(now);
  const toneCard = i.practiceCount >= 3 && !i.toneCardSeen && i.bandToday !== 'low' && i.bandToday !== 'notOkay'
    && variant !== 'lapsed' && variant !== 'distressed' && variant !== 'resume';

  if (variant === 'distressed' || variant === 'resume') {
    return { variant, modifier: null, bubble: null, button: 'base', catchAnother: false, toneCard };
  }

  // silence rules 4, 7, 9, 10: any one removes the bubble, never the button
  const silenced = i.helpOpenedThisSession || i.sessionBubbleCount >= 3 || i.stepUpDeclined || !i.showHappi;
  const bubble = (b: HomeBubble): HomeBubble => (silenced ? null : b);
  const out = (modifier: HomeModifier, button: HomeButton, b: HomeBubble = null, catchAnother = false): HomeAsk =>
    ({ variant, modifier, bubble: bubble(b), button, catchAnother, toneCard });

  if (hour >= 22 || hour <= 4) return out('M1', 'windDown');
  // a draft wins over "saved today" unless a different entry was saved after it today
  if (i.paused && (i.newestSavedTodayId === null || i.paused.entryId === i.newestSavedTodayId || i.paused.selectedDate < today)) return out('M2', 'continue');
  if (i.newestSavedTodayId !== null) return out('M3', 'none', null, true);
  if (i.bandToday === 'low') return out('M4', 'base');
  if (variant === 'lapsed' || variant === 'postReturn') {
    return out('M5', 'base', variant === 'lapsed' && !i.welcomeBackShown24h ? { kind: 'return' } : null);
  }
  const window = askWindow(hour);
  const askDue = i.installDay >= 1 && window !== null && i.askShownDate !== today && (i.bandToday === null || i.bandToday === 'good' || i.bandToday === 'okay');
  return out('M6', 'catch', askDue && window ? { kind: 'ask', window } : null);
}
