/**
 * migrateGuestProgress
 *
 * One-shot migration called immediately after a guest signs in.
 * Reads locally stored guest progress from AsyncStorage.
 *
 * Current behaviour (MVP — before P1.1 DB tables exist):
 * - Reads progress from AsyncStorage.
 * - If the P1.1 tables (user_journey_enrollments, user_node_completions)
 *   are present, inserts the rows. If they don't exist yet, it's a no-op.
 * - Always clears local guest data after running so the next session starts clean.
 *
 * Once P1.1 ships, uncomment the Supabase inserts below.
 */

import {
  loadGuestProgress,
  clearGuestProgress,
  GuestProgress,
} from '@/hooks/data/useGuestProgress';

// ---------------------------------------------------------------------------
// Main migration entry point
// ---------------------------------------------------------------------------

export async function migrateGuestProgress(_userId: string): Promise<void> {
  try {
    const progress: GuestProgress = await loadGuestProgress();

    // Nothing to migrate
    if (progress.completedNodeIds.length === 0 || !progress.journeySlug) {
      return;
    }

    // ── TODO (P1.1): Uncomment when user_journey_enrollments & user_node_completions tables exist ──
    //
    // await supabase.from('user_journey_enrollments').upsert({ ... });
    //
    // const completionRows = progress.completedNodeIds.map(nodeId => ({
    //   user_id: userId, node_id: nodeId, journey_id: ..., ...
    // }));
    // await supabase.from('user_node_completions').upsert(completionRows, { onConflict: 'user_id,node_id', ignoreDuplicates: true });

    console.info(
      '[migrateGuestProgress] Guest had',
      progress.completedNodeIds.length,
      'completed nodes in',
      progress.journeySlug,
      '— DB migration pending P1.1 tables.',
    );
  } catch (err) {
    console.warn('[migrateGuestProgress] Unexpected error during migration:', err);
  } finally {
    // Always clear local guest data
    await clearGuestProgress();
  }
}
