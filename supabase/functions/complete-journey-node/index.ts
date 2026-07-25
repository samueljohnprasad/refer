// npx supabase functions deploy complete-journey-node --no-verify-jwt
/**
 * complete-journey-node — Deno Edge Function
 *
 * Thin HTTP handler. All business logic lives in dedicated modules:
 *  - types.ts          → shared TypeScript types
 *  - db.ts             → Supabase DB query helpers
 *  - rewards.ts        → reward parsing and application
 *  - nextNodeResolver.ts → post-completion navigation decision tree
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
//@ts-ignore
import { auth } from "../save-journal-ai-insights/auth.ts";

import {
  fetchEnrollment,
  fetchActiveProgress,
  fetchNode,
  fetchUnit,
  fetchSection,
  completeProgressRow,
} from "./db.ts";
import { applyRewards } from "./rewards.ts";
import { resolveNextProgress } from "./nextNodeResolver.ts";
import type { CompleteJourneyNodePayload, NodeCompletionResponse, ErrorResponse } from "./types.ts";

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const JSON_HEADERS = { "Content-Type": "application/json" } as const;

function jsonResponse(body: NodeCompletionResponse | ErrorResponse, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ success: false, error: message }, status);
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

//@ts-ignore
Deno.serve(async (req: Request) => {
  try {
    // ── 1. Auth ─────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("Missing or invalid Authorization header", 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const userSupabase = auth(token);
    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser(token);

    if (userError || !user) {
      console.error("User verification failed:", userError);
      return errorResponse("Invalid token or user not found", 401);
    }

    // ── 2. Parse & validate payload ─────────────────────────────────────────
    const body = (await req.json()) as CompleteJourneyNodePayload;
    const enrollmentId = body.enrollmentId?.trim();
    const nodeId = body.nodeId?.trim();

    if (!enrollmentId || !nodeId) {
      return errorResponse("enrollmentId and nodeId are required", 400);
    }

    // ── 3. Fetch & validate enrollment ──────────────────────────────────────
    const enrollment = await fetchEnrollment(enrollmentId, user.id);
    if (!enrollment) return errorResponse("Enrollment not found for user", 404);
    if (enrollment.status !== "active") return errorResponse("Enrollment is not active", 400);

    // ── 4. Validate that the node is currently active for this user ─────────
    const activeProgress = await fetchActiveProgress(enrollmentId, nodeId, user.id);
    if (!activeProgress) return errorResponse("Node is not active or not found", 400);

    // ── 5. Fetch node / unit / section (for resolver and rewards) ───────────
    const node = await fetchNode(nodeId);
    const unit = await fetchUnit(node.unit_id);
    const section = await fetchSection(unit.section_id);

    // ── 6. Mark the current node as completed ───────────────────────────────
    await completeProgressRow(activeProgress.id);

    // ── 7. Resolve next progress state (advance position or complete journey) ─
    const nextProgress = await resolveNextProgress(
      user.id,
      enrollmentId,
      node,
      unit,
      section,
      enrollment,
    );

    // ── 8. Apply rewards (XP + gems) ────────────────────────────────────────
    const rewards = await applyRewards(user.id, nodeId, node.rewards);

    // ── 9. Respond ──────────────────────────────────────────────────────────
    return jsonResponse({
      success: true,
      currentSectionNumber: nextProgress.currentSectionNumber,
      currentUnitNumber: nextProgress.currentUnitNumber,
      currentNodeId: nextProgress.currentNodeId,
      enrollmentStatus: nextProgress.enrollmentStatus,
      journeyCompleted: nextProgress.enrollmentStatus === "completed",
      rewards,
    });
  } catch (error) {
    console.error("Unhandled error in complete-journey-node:", error);
    return errorResponse(
      error instanceof Error ? error.message : String(error),
      500,
    );
  }
});
