import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useExerciseMutation } from '@/src/hooks/useExerciseMutation';
import { dropQueued, readOutbox } from '../../data/outbox';

// AD-26: replay queued writes on start and every foreground with a signed-in user, in order; a failure stops the run.
export function useOutboxReplay(): void {
  const { user } = useAuth();
  const { save } = useExerciseMutation();
  const running = useRef(false);
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    if (!user?.id) return;
    const flush = async () => {
      if (running.current) return;
      running.current = true;
      try {
        for (const { id, payload } of await readOutbox()) {
          await saveRef.current(payload, id);
          await dropQueued(id, payload);
        }
      } catch { /* ponytail: still offline, the next foreground retries */ }
      running.current = false;
    };
    void flush();
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') void flush(); });
    return () => sub.remove();
  }, [user?.id]);
}
