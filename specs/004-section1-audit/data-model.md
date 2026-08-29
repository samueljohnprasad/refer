# Phase 1: Data Model

## Entities

### `Exercise`
Represents a single screen in a lesson.
- **Fields**:
  - `source_id`: Unique string ID.
  - `node_source_id`: The ID of the lesson (node) it belongs to.
  - `order_index`: Integer representing its position in the lesson (0-indexed).
  - `type`: String representing the component type (e.g., `learn_cards`, `course_choice`).
  - `content`: JSONB payload containing the UI text, options, and logic.

**Validation Rules**:
- `order_index` must be strictly sequential (0, 1, 2, ...) per `node_source_id`.
- The database schema relies on `order_index` to route the user through the node.

### `Deleted Exercises` (SQL)
- Any `source_id` removed from the JSON array MUST be explicitly deleted from the database using a trailing `DELETE FROM exercises WHERE id IN (...)` statement to prevent orphan records.
