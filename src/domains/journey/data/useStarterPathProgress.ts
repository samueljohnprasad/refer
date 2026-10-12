import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/src/context/AuthContext";
import type { StarterPathNextAction } from "../model/starterPath";
import type { StarterPathProgressV1 } from "../model/starterPathProgress";
import {
  loadActiveStarterPathId,
  loadStarterPathProgress,
  switchStarterPath,
} from "./starterPathProgress.repo";

export interface UseStarterPathProgressResult {
  progress: StarterPathProgressV1 | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  switchPath: (
    pathId: string,
    pathVersion: number,
    nextAction: StarterPathNextAction,
  ) => Promise<StarterPathProgressV1>;
}

export function useStarterPathProgress(
  pathId: string,
  pathVersion: number,
): UseStarterPathProgressResult {
  const { user } = useAuth();
  const [progress, setProgress] = useState<StarterPathProgressV1 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (): Promise<void> => {
    if (!user) {
      setProgress(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const activePathId = await loadActiveStarterPathId(user.id);
      if (activePathId && activePathId !== pathId) {
        setProgress(null);
        return;
      }
      setProgress(await loadStarterPathProgress(user.id, pathId, pathVersion));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [pathId, pathVersion, user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const switchPath = useCallback(
    async (
      nextPathId: string,
      nextPathVersion: number,
      nextAction: StarterPathNextAction,
    ): Promise<StarterPathProgressV1> => {
      if (!user) throw new Error("Anonymous session is not ready");
      const result = await switchStarterPath(
        user.id,
        nextPathId,
        nextPathVersion,
        nextAction,
      );
      setProgress(result.progress);
      return result.progress;
    },
    [user],
  );

  return { progress, isLoading, error, reload, switchPath };
}
