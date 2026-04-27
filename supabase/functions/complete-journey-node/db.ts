/**
 * db.ts — Supabase DB query helpers for complete-journey-node.
 *
 * Every function:
 *  - Accepts only the data it needs (no god-object anti-pattern)
 *  - Throws on DB errors so callers stay free of error-checking boilerplate
 *  - Returns null when a row is optional (maybeSingle) and not found
 */

//@ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type {
  EnrollmentRow,
  NodeRow,
  UnitRow,
  SectionRow,
  NodeProgressRow,
} from "./types.ts";

// ---------------------------------------------------------------------------
// Shared admin client — initialised once per function invocation
// ---------------------------------------------------------------------------

const SUPABASE_URL = "https://xaqeueshxpehijtxwklo.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NjY4MywiZXhwIjoyMDY4MTcyNjgzfQ.V5jpUlbJsNQAOH4jFjwfjSG4MK4SA2vVnAKLI99mPlE";

export const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// Enrollment
// ---------------------------------------------------------------------------

/**
 * Fetch and validate an enrollment row.
 * Returns null if no matching row exists (caller decides the HTTP status).
 */
export async function fetchEnrollment(
  enrollmentId: string,
  userId: string,
): Promise<EnrollmentRow | null> {
  const { data, error } = await adminSupabase
    .from("user_journey_enrollments")
    .select("*")
    .eq("id", enrollmentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as EnrollmentRow | null;
}

/**
 * Update mutable fields on an enrollment (e.g. current section/unit pointers).
 */
export async function updateEnrollmentProgress(
  enrollmentId: string,
  patch: Partial<EnrollmentRow>,
): Promise<void> {
  const { error } = await adminSupabase
    .from("user_journey_enrollments")
    .update(patch)
    .eq("id", enrollmentId);

  if (error) throw new Error(error.message);
}

/**
 * Mark an enrollment as completed.
 */
export async function completeEnrollment(enrollmentId: string): Promise<void> {
  const { error } = await adminSupabase
    .from("user_journey_enrollments")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", enrollmentId);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Node progress
// ---------------------------------------------------------------------------

/**
 * Fetch the active progress row for a specific node.
 * Returns null when no active row exists.
 */
export async function fetchActiveProgress(
  enrollmentId: string,
  nodeId: string,
  userId: string,
): Promise<NodeProgressRow | null> {
  const { data, error } = await adminSupabase
    .from("user_node_progress")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .eq("node_id", nodeId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as NodeProgressRow | null;
}

/**
 * Mark an existing progress row as completed (100 % progress, timestamp set).
 */
export async function completeProgressRow(progressId: string): Promise<void> {
  const { error } = await adminSupabase
    .from("user_node_progress")
    .update({
      status: "completed",
      progress: 1.0,
      completed_at: new Date().toISOString(),
    })
    .eq("id", progressId);

  if (error) throw new Error(error.message);
}

/**
 * Upsert an active progress row for a node.
 * Used to "unlock" the next node after completing the current one.
 */
export async function ensureActiveProgress(
  userId: string,
  enrollmentId: string,
  nodeId: string,
): Promise<void> {
  const { error } = await adminSupabase
    .from("user_node_progress")
    .upsert(
      {
        user_id: userId,
        enrollment_id: enrollmentId,
        node_id: nodeId,
        status: "active",
        progress: 0.0,
        completed_at: null,
      },
      { onConflict: "enrollment_id,node_id" },
    );

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Node / Unit / Section lookups
// ---------------------------------------------------------------------------

/** Fetch a journey template node by its primary key. */
export async function fetchNode(nodeId: string): Promise<NodeRow> {
  const { data, error } = await adminSupabase
    .from("journey_template_nodes")
    .select("*")
    .eq("id", nodeId)
    .single();

  if (error || !data) throw new Error(error?.message ?? "Node not found");
  return data as NodeRow;
}

/** Fetch a journey template unit by its primary key. */
export async function fetchUnit(unitId: string): Promise<UnitRow> {
  const { data, error } = await adminSupabase
    .from("journey_template_units")
    .select("*")
    .eq("id", unitId)
    .single();

  if (error || !data) throw new Error(error?.message ?? "Unit not found");
  return data as UnitRow;
}

/** Fetch a journey template section by its primary key. */
export async function fetchSection(sectionId: string): Promise<SectionRow> {
  const { data, error } = await adminSupabase
    .from("journey_template_sections")
    .select("*")
    .eq("id", sectionId)
    .single();

  if (error || !data) throw new Error(error?.message ?? "Section not found");
  return data as SectionRow;
}

// ---------------------------------------------------------------------------
// Next-node navigation helpers
// ---------------------------------------------------------------------------

/** Return the first node (lowest node_index) in a unit, or null if empty. */
export async function getFirstNodeForUnit(unitId: string): Promise<NodeRow | null> {
  const { data, error } = await adminSupabase
    .from("journey_template_nodes")
    .select("*")
    .eq("unit_id", unitId)
    .order("node_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as NodeRow | null;
}

/** Return the next node after `currentNodeIndex` in the same unit, or null. */
export async function getNextNodeInUnit(
  unitId: string,
  currentNodeIndex: number,
): Promise<NodeRow | null> {
  const { data, error } = await adminSupabase
    .from("journey_template_nodes")
    .select("*")
    .eq("unit_id", unitId)
    .gt("node_index", currentNodeIndex)
    .order("node_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as NodeRow | null;
}

/**
 * Find the next unit after `currentSectionUnitNumber` in the same section
 * that has at least one node. Returns unit + its first node, or null.
 */
export async function findNextUnitInSection(
  sectionId: string,
  currentSectionUnitNumber: number | null,
): Promise<{ unit: UnitRow; firstNode: NodeRow } | null> {
  const { data: units, error } = await adminSupabase
    .from("journey_template_units")
    .select("*")
    .eq("section_id", sectionId)
    .gt("section_unit_number", currentSectionUnitNumber ?? 0)
    .order("section_unit_number", { ascending: true });

  if (error) throw new Error(error.message);

  for (const unit of units ?? []) {
    const firstNode = await getFirstNodeForUnit(unit.id);
    if (firstNode) return { unit: unit as UnitRow, firstNode };
  }

  return null;
}

/**
 * Find the next section after `currentSectionNumber` in the same journey
 * that has at least one unit with at least one node.
 * Returns section + first unit + first node, or null.
 */
export async function findNextSectionWithUnit(
  journeyId: string,
  currentSectionNumber: number,
): Promise<{ section: SectionRow; unit: UnitRow; firstNode: NodeRow } | null> {
  const { data: sections, error } = await adminSupabase
    .from("journey_template_sections")
    .select("*")
    .eq("journey_id", journeyId)
    .gt("section_number", currentSectionNumber)
    .order("section_number", { ascending: true });

  if (error) throw new Error(error.message);

  for (const section of sections ?? []) {
    const next = await findNextUnitInSection(section.id, 0);
    if (next) {
      return { section: section as SectionRow, unit: next.unit, firstNode: next.firstNode };
    }
  }

  return null;
}
