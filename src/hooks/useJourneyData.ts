/**
 * useJourneyData
 * Orchestrates the full data pipeline for a journey:
 * 1. Fetch template from Supabase (with local cache fallback)
 * 2. Fetch user progress (auto-enrolls if template exists but user isn't enrolled)
 * 3. Merge into JourneyState via mergeJourneyState()
 * 4. Set Jotai atoms for the UI
 *
 * Graceful fallback chain:
 *   Supabase → AsyncStorage cache → Mock data
 * The UI always renders — loading/error states are only shown when truly needed.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';

import type { JourneyState, JourneyStats } from '@/src/types/journey';
import type { JourneyTemplate } from '@/src/types/journey/template';
import type { UserJourneyProgress } from '@/src/types/journey/progress';
import { MOCK_JOURNEY_STATE } from '@/src/data/journey';
import { mergeJourneyState, createInitialProgress } from '@/src/utils/journey/mergeJourneyState';
import {
  journeyStateAtom,
  journeyTemplateAtom,
  journeyProgressAtom,
  activeJourneySlugAtom,
  loadJourneyState,
  saveJourneyState,
  cacheTemplate,
  loadCachedTemplate,
  saveActiveSlug,
} from '@/src/store/journeyStore';
import {
  fetchJourneyTemplate,
  fetchUserProgress,
  enrollInJourney,
} from '@/src/lib/api/journeyApi';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseJourneyDataReturn {
  /** Whether the initial data is still loading */
  isLoading: boolean;
  /** Non-null only for hard errors that should show the error screen */
  error: string | null;
  /** Whether we fell back to offline/cached data */
  isOfflineFallback: boolean;
  /** Re-fetch template + progress and re-merge */
  refresh: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Default stats (will come from user_xp / user_wallet in production)
// ---------------------------------------------------------------------------

const DEFAULT_STATS: JourneyStats = {
  streakDays: 0,
  wallet: { coins: 0, gems: 0 },
  hearts: 5,
  totalXP: 0,
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useJourneyData(slug: string | null): UseJourneyDataReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);

  const setJourneyState = useSetAtom(journeyStateAtom);
  const setTemplate = useSetAtom(journeyTemplateAtom);
  const setProgress = useSetAtom(journeyProgressAtom);
  const setActiveSlug = useSetAtom(activeJourneySlugAtom);

  const { isOnline } = useNetworkStatus();

  // ── Helper: apply state and finish ──
  const applyState = useCallback(
    async (state: JourneyState): Promise<void> => {
      setJourneyState(state);
      await saveJourneyState(state);
    },
    [setJourneyState],
  );

  // ── Core fetch + merge pipeline ──
  const loadJourneyData = useCallback(
    async (journeySlug: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setIsOfflineFallback(false);

      try {
        // ── Step 1: Get the journey template ──────────────────────────────
        let template: JourneyTemplate | null = null;

        if (isOnline) {
          const res = await fetchJourneyTemplate(journeySlug);
          if (res.success && res.data) {
            template = res.data;
            await cacheTemplate(journeySlug, template);
          }
        }

        // Offline or fetch failed → try local template cache
        if (!template) {
          template = await loadCachedTemplate(journeySlug);
          if (template) setIsOfflineFallback(true);
        }

        // ── Step 2: No template at all → fall back to mock data to keep UI working ──
        if (!template) {
          console.warn('[useJourneyData] No template found, using mock data');
          const cachedState = await loadJourneyState();
          // Use cached state if available, otherwise default mock
          await applyState(cachedState ?? MOCK_JOURNEY_STATE);
          setIsOfflineFallback(true);
          setIsLoading(false);
          return;
        }

        // ── Step 3: Get user progress ─────────────────────────────────────
        let progress: UserJourneyProgress | null = null;

        if (isOnline) {
          const progressRes = await fetchUserProgress(template.id);
          if (progressRes.success && progressRes.data) {
            progress = progressRes.data;
          }
        }

        // ── Step 4: No enrollment → auto-enroll the user ─────────────────
        if (!progress && isOnline) {
          console.info('[useJourneyData] No enrollment found, auto-enrolling...');
          const firstNodeId = template.units[0]?.nodes[0]?.id;

          if (firstNodeId) {
            const enrollRes = await enrollInJourney({
              journeyId: template.id,
              templateVersion: template.version,
              firstNodeId,
            });

            if (enrollRes.success && enrollRes.data) {
              progress = enrollRes.data;
              console.info('[useJourneyData] Auto-enrollment successful');
            } else {
              console.warn('[useJourneyData] Auto-enrollment failed:', enrollRes.error);
            }
          }
        }

        // ── Step 5: Still no progress → use cached merged state or mock ──
        if (!progress) {
          const cachedState = await loadJourneyState();
          if (cachedState) {
            setTemplate(template);
            await applyState(cachedState);
            setIsOfflineFallback(true);
            setIsLoading(false);
            return;
          }

          // Build a local initial-progress view from the template
          // (shows all nodes locked except the first one — correct UX)
          const localProgress = createInitialProgress(template, 'local', template.id);
          const initialState = mergeJourneyState(template, localProgress, DEFAULT_STATS);
          setTemplate(template);
          await applyState(initialState);
          setIsLoading(false);
          return;
        }

        // ── Step 6: Merge template + progress → JourneyState ─────────────
        const mergedState = mergeJourneyState(template, progress, DEFAULT_STATS);

        setTemplate(template);
        setProgress(progress);
        setActiveSlug(journeySlug);
        await saveActiveSlug(journeySlug);
        await applyState(mergedState);

      } catch (err) {
        console.error('[useJourneyData] Unexpected error:', err);

        // Last resort — never show a blank screen
        const cachedState = await loadJourneyState();
        await applyState(cachedState ?? MOCK_JOURNEY_STATE);
        setIsOfflineFallback(true);
        // Don't set error — the UI can still render with fallback data
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline, applyState, setTemplate, setProgress, setActiveSlug],
  );

  useEffect(() => {
    if (slug) {
      loadJourneyData(slug);
    }
  }, [slug, loadJourneyData]);

  const refresh = useCallback(async (): Promise<void> => {
    if (slug) await loadJourneyData(slug);
  }, [slug, loadJourneyData]);

  return { isLoading, error, isOfflineFallback, refresh };
}
