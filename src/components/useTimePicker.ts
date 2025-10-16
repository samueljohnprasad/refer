import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export type AmPm = 'AM' | 'PM';

export type TimeState = {
  hour: number; // 1..12
  minute: number; // 0..59
  ampm: AmPm;
};

export type UseTimePicker = {
  hour: number;
  minute: number;
  ampm: AmPm;
  hours: number[];
  minutes: number[];
  setHour: (h: number) => void;
  setMinute: (m: number) => void;
  setAmPm: (ap: AmPm) => void;
  setFromInitial: (initial?: string) => void;
  formatOut: () => string; // 'hh:mm A'
  value24: () => { hour24: number; minute: number };
};

const clamp = (n: number, min: number, max: number): number => Math.max(min, Math.min(max, n));

const parseInitial = (initial?: string): TimeState => {
  if (initial) {
    const d = dayjs(initial, 'hh:mm A', true);
    if (d.isValid()) {
      const hr = d.hour(); // 0..23
      const minute = d.minute();
      const isPM = hr >= 12;
      const h12 = hr % 12 === 0 ? 12 : hr % 12;
      return { hour: h12, minute, ampm: isPM ? 'PM' : 'AM' };
    }
  }
  return { hour: 9, minute: 0, ampm: 'AM' };
};

export function useTimePicker(initial: string | undefined, minuteStep: number = 5): UseTimePicker {
  const [state, setState] = useState<TimeState>(parseInitial(initial));

  const hours: number[] = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const minutes: number[] = useMemo(() => {
    const step = Math.max(1, Math.min(30, Math.floor(minuteStep)));
    const arr: number[] = [];
    for (let m = 0; m < 60; m += step) arr.push(m);
    return arr;
  }, [minuteStep]);

  // Keep state synced with initial when it changes (opt-in by caller)
  useEffect(() => {
    // no-op: let caller decide when to reset via setFromInitial for better control
  }, [initial]);

  const setHour = useCallback((h: number) => setState((s) => ({ ...s, hour: clamp(h, 1, 12) })), []);
  const setMinute = useCallback((m: number) => setState((s) => ({ ...s, minute: clamp(m, 0, 59) })), []);
  const setAmPm = useCallback((ap: AmPm) => setState((s) => ({ ...s, ampm: ap })), []);

  const setFromInitial = useCallback((init?: string) => setState(parseInitial(init)), []);

  const formatOut = useCallback((): string => {
    let hr24 = state.hour % 12;
    if (state.ampm === 'PM') hr24 += 12;
    const d = dayjs().hour(hr24).minute(state.minute).second(0).millisecond(0);
    return d.format('hh:mm A');
  }, [state.hour, state.minute, state.ampm]);

  const value24 = useCallback((): { hour24: number; minute: number } => {
    let hr24 = state.hour % 12;
    if (state.ampm === 'PM') hr24 += 12;
    return { hour24: hr24, minute: state.minute };
  }, [state.hour, state.minute, state.ampm]);

  return {
    hour: state.hour,
    minute: state.minute,
    ampm: state.ampm,
    hours,
    minutes,
    setHour,
    setMinute,
    setAmPm,
    setFromInitial,
    formatOut,
    value24,
  };
}
