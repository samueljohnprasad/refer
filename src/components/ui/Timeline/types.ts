/**
 * Generic Timeline Types
 *
 * Data-agnostic interfaces for the reusable Timeline primitive.
 * Any screen can use these by extending `TimelineItemData` with
 * domain-specific fields and providing a custom `renderItem`.
 */

import type React from "react";

// ─── Item ───────────────────────────────────────────────────────────────

/** Minimum shape every timeline item must satisfy. */
export interface TimelineItemData {
  /** Unique identifier for keying */
  readonly id: string;
  /** Epoch-ms timestamp used for sorting & grouping */
  readonly date: number;
  /** Visual status — drives the dot indicator on the stem */
  readonly status: "completed" | "in_progress" | "draft";
}

// ─── Section ────────────────────────────────────────────────────────────

/** A day-group rendered as a SectionList section. */
export interface TimelineSection<T extends TimelineItemData> {
  /** Human-readable day label ("Today", "Yesterday", "27 Sat") */
  readonly title: string;
  /** Day-start epoch-ms — used as the section key */
  readonly date: number;
  /** Items within this day, sorted newest-first */
  readonly data: T[];
}

// ─── Component Props ────────────────────────────────────────────────────

export interface TimelineProps<T extends TimelineItemData> {
  /** Grouped sections to render */
  readonly sections: TimelineSection<T>[];
  /** Render callback for each item — the consumer owns the card UI */
  readonly renderItem: (item: T, index: number) => React.ReactElement;
  /** Fired when the list scrolls near the bottom */
  readonly onEndReached?: () => void;
  /** Shows a spinner at the bottom when true */
  readonly isLoadingMore?: boolean;
  /** Optional header above all sections */
  readonly ListHeaderComponent?: React.ReactElement;
  /** Shown when `sections` is empty */
  readonly ListEmptyComponent?: React.ReactElement;
  /** Extra top padding (e.g. for transparent headers) */
  readonly contentPaddingTop?: number;
  /** Background color used to mask the stem line behind date headers (default: #F7F7F8) */
  readonly backgroundColor?: string;
}
