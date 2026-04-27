/**
 * nextNodeResolver.ts — Pure business logic for post-completion navigation.
 *
 * Given the node/unit/section that was just completed, determines:
 *  1. Is there a next node in the same unit?
 *  2. Is there a next unit in the same section?
 *  3. Is there a next section in the journey?
 *  4. If none of the above — the journey is complete.
 *
 * All DB mutations (ensureActiveProgress, updateEnrollmentProgress,
 * completeEnrollment) are delegated to db.ts helpers.
 */

import {
  ensureActiveProgress,
  updateEnrollmentProgress,
  completeEnrollment,
  getNextNodeInUnit,
  findNextUnitInSection,
  findNextSectionWithUnit,
} from "./db.ts";
import type {
  NodeRow,
  UnitRow,
  SectionRow,
  EnrollmentRow,
  NextProgressResult,
} from "./types.ts";

// ---------------------------------------------------------------------------
// Main resolver
// ---------------------------------------------------------------------------

/**
 * Resolve and apply the next progress state after a node is completed.
 *
 * Side-effects (upserts, updates) are committed inside this function so
 * the index.ts handler stays declarative.
 */
export async function resolveNextProgress(
  userId: string,
  enrollmentId: string,
  node: NodeRow,
  unit: UnitRow,
  section: SectionRow,
  enrollment: EnrollmentRow,
): Promise<NextProgressResult> {
  // ── Case 1: Another node exists in the same unit ──────────────────────────
  const nextNode = await getNextNodeInUnit(node.unit_id, node.node_index);
  if (nextNode) {
    await ensureActiveProgress(userId, enrollmentId, nextNode.id);
    return {
      currentNodeId: nextNode.id,
      currentSectionNumber: enrollment.current_section_number ?? section.section_number,
      currentUnitNumber: enrollment.current_unit_number ?? unit.unit_number,
      enrollmentStatus: "active",
    };
  }

  // ── Case 2: Another unit exists in the same section ───────────────────────
  const nextUnitInSection = await findNextUnitInSection(
    unit.section_id,
    unit.section_unit_number,
  );
  if (nextUnitInSection) {
    await updateEnrollmentProgress(enrollmentId, {
      current_section_id: section.id,
      current_unit_id: nextUnitInSection.unit.id,
      current_section_number: section.section_number,
      current_section_unit_number: nextUnitInSection.unit.section_unit_number,
      current_unit_number: nextUnitInSection.unit.unit_number,
    });
    await ensureActiveProgress(userId, enrollmentId, nextUnitInSection.firstNode.id);
    return {
      currentNodeId: nextUnitInSection.firstNode.id,
      currentSectionNumber: section.section_number,
      currentUnitNumber: nextUnitInSection.unit.unit_number,
      enrollmentStatus: "active",
    };
  }

  // ── Case 3: Another section exists in the journey ─────────────────────────
  const nextSection = await findNextSectionWithUnit(
    section.journey_id,
    section.section_number,
  );
  if (nextSection) {
    await updateEnrollmentProgress(enrollmentId, {
      current_section_id: nextSection.section.id,
      current_unit_id: nextSection.unit.id,
      current_section_number: nextSection.section.section_number,
      current_section_unit_number: nextSection.unit.section_unit_number,
      current_unit_number: nextSection.unit.unit_number,
    });
    await ensureActiveProgress(userId, enrollmentId, nextSection.firstNode.id);
    return {
      currentNodeId: nextSection.firstNode.id,
      currentSectionNumber: nextSection.section.section_number,
      currentUnitNumber: nextSection.unit.unit_number,
      enrollmentStatus: "active",
    };
  }

  // ── Case 4: Journey complete ───────────────────────────────────────────────
  await completeEnrollment(enrollmentId);
  return {
    currentNodeId: null,
    currentSectionNumber: enrollment.current_section_number ?? section.section_number,
    currentUnitNumber: enrollment.current_unit_number ?? unit.unit_number,
    enrollmentStatus: "completed",
  };
}
