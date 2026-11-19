import { describe, expect, it } from '@jest/globals';
import { countsAsPractice, entryRung, practiceCounts, weekBoundsYmd } from './practice';

describe('countsAsPractice', () => {
  it.each([
    ['completed', true],
    ['summary', true],
    ['checker_completed', true],
    ['in_progress', false],
    ['draft', false],
  ])('%s -> %s', (status, expected) => {
    expect(countsAsPractice({ status })).toBe(expected);
  });
});

describe('entryRung', () => {
  it.each([
    ['catch only', { exercise_type: 'thought_catcher', status: 'completed', response: {} }, 2],
    ['blank balanced', { exercise_type: 'thought_catcher', status: 'completed', response: { balancedThought: '  ' } }, 2],
    ['balanced', { exercise_type: 'thought_catcher', status: 'completed', response: { balancedThought: 'x' } }, 3],
    ['reframing', { exercise_type: 'thought_reframing', status: 'completed' }, 4],
    ['other type', { exercise_type: 'box_breathing', status: 'completed' }, null],
    ['in progress', { exercise_type: 'thought_catcher', status: 'in_progress' }, null],
  ])('%s', (_n, entry, expected) => {
    expect(entryRung(entry)).toBe(expected);
  });
});

describe('practiceCounts', () => {
  const monday = new Date(2026, 10, 16, 9); // Mon 2026-11-16

  it('computes Monday-Sunday bounds', () => {
    expect(weekBoundsYmd(monday)).toEqual({ start: '2026-11-16', end: '2026-11-22' });
    expect(weekBoundsYmd(new Date(2026, 10, 22))).toEqual({ start: '2026-11-16', end: '2026-11-22' });
  });

  it('counts mixed statuses', () => {
    const rows = [
      { status: 'completed', selected_date: '2026-11-16' },
      { status: 'summary', selected_date: '2026-11-17' },
      { status: 'in_progress', selected_date: '2026-11-16' },
    ];
    expect(practiceCounts(rows, monday)).toEqual({ lifetime: 2, thisWeek: 2 });
  });

  it('Sunday row is last week on Monday; null date is lifetime only', () => {
    const rows = [
      { status: 'completed', selected_date: '2026-11-15' },
      { status: 'completed', selected_date: null },
    ];
    expect(practiceCounts(rows, monday)).toEqual({ lifetime: 2, thisWeek: 0 });
  });
});
