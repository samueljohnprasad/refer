import { useEffect, useRef, useState } from 'react';
import { readGardenSeen, writeGardenSeen, type GardenSeen } from '../../data/gardenSeen';
import type { TopicCounts } from '../../domain/practice';

/** The snapshot from the previous visit (null on a first visit); `ready` once it is read. Writes the current counts once per visit. */
export function useGardenSeen(counts?: { lifetime: number; byTopic: TopicCounts }): { ready: boolean; prev: GardenSeen | null } {
  const [state, setState] = useState<{ ready: boolean; prev: GardenSeen | null }>({ ready: false, prev: null });
  const written = useRef(false);

  useEffect(() => {
    let live = true;
    void readGardenSeen().then((prev) => { if (live) setState({ ready: true, prev }); });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!state.ready || !counts || written.current) return;
    written.current = true;
    void writeGardenSeen({ topics: counts.byTopic, lifetime: counts.lifetime });
  }, [state.ready, counts]);

  return state;
}
