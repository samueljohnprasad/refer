# Sleep Reset Section 3 SQL Seed Design

## Goal

Create one SQL script that Samuel can paste into the Supabase SQL Editor to add the approved Sleep Reset Section 3 curriculum.

## Deliverables

- Keep the authored curriculum at `docs/sleep-reset-section-3.yaml`.
- Add the executable seed at `supabase/seed/sleep_reset_section_3.sql`.
- Publish both files directly to the remote `journals` branch.

## Data written

The seed inserts or updates:

- Section 3: `Design Your Evening`
- 3 units
- 14 lesson nodes (`l19` through `l32`)
- 66 exercises using only existing renderer categories
- Sleep Reset course metadata with `total_lessons = 32`

## SQL architecture

The script follows `sleep_reset_section_2.sql`:

1. Start a transaction.
2. Define a transaction-local deterministic UUID helper.
3. Convert embedded JSON records with `jsonb_to_recordset`.
4. Upsert the section, units, nodes, and exercises using stable IDs.
5. Update the existing Sleep Reset course lesson count.
6. Commit the transaction.
7. Return a Section 3 count summary for manual verification in Supabase.

The script assumes `sleep_reset_section_1.sql` has already created the Sleep Reset course, required columns, `exercises` table, policies, and constraints. It does not alter the schema.

## Rerun and data safety

- Every record has a deterministic UUID derived from its source ID.
- `ON CONFLICT (id) DO UPDATE` makes repeat execution safe.
- The script does not delete units, nodes, exercises, progress, or user data.
- The entire write is atomic: an error rolls back the transaction.

## Mapping rules

- YAML section position becomes `sections.order_index`.
- Unit position becomes `units.order_index`.
- Lessons use zero-based `nodes.order_index` inside each unit, matching existing Sleep Reset seeds.
- Lesson duration becomes `nodes.estimated_mins`.
- Lesson type maps to `nodes.type = 'lesson'` and `content_type = 'lesson'`.
- Exercise `sourceId` becomes the deterministic exercise ID seed.
- Exercise camelCase properties map to snake_case database columns.
- Exercise `content` is preserved as JSONB without rewriting renderer fields.
- `pass_threshold` remains 80, matching the existing course seeds.
- Unit `icon_key` remains `unit-icon`, matching Section 2.

## Verification

Before pushing:

- Parse the source YAML.
- Parse every embedded SQL JSON payload.
- Compare SQL record counts and source IDs against the YAML.
- Confirm 3 units, 14 nodes, and 66 exercises.
- Confirm every exercise category is registered.
- Check transaction, upsert, and verification-query structure.
- Run `git diff --check`.
- Inspect the exact staged diff before committing.

No automated test files are added because repository instructions explicitly say not to write test cases.

## Git delivery

Commit only the design, YAML curriculum, and SQL seed. Push the resulting commit directly to `origin/journals`. Do not open a pull request.
