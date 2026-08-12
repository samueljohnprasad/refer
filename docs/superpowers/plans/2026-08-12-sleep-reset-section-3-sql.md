# Sleep Reset Section 3 SQL Seed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the approved Section 3 YAML into a rerunnable Supabase SQL Editor seed and publish the curriculum directly to `origin/journals`.

**Architecture:** Follow the deterministic UUID and JSONB upsert structure already used by `supabase/seed/sleep_reset_section_2.sql`. The YAML remains the curriculum source of truth; the SQL contains four JSON recordsets for the section, units, nodes, and exercises, followed by upserts and a count query.

**Tech Stack:** PostgreSQL/Supabase SQL, JSONB, PyYAML for verification, Git.

## Global Constraints

- Source curriculum: `docs/sleep-reset-section-3.yaml`.
- SQL deliverable: `supabase/seed/sleep_reset_section_3.sql`.
- Insert exactly 1 section, 3 units, 14 lesson nodes, and 66 exercises.
- Use only the tables and columns established by `sleep_reset_section_1.sql`.
- Do not add schema changes, dependencies, test files, deletion statements, or progress mutations.
- Use deterministic `pg_temp.seed_uuid` values and `ON CONFLICT (id) DO UPDATE` for safe reruns.
- Preserve each exercise `content` object exactly as authored JSON, including camelCase renderer fields.
- Set every node to `type = 'lesson'`, `content_type = 'lesson'`, and `pass_threshold = 80`.
- Use zero-based node and exercise `order_index` values inside their parent.
- Set all unit `icon_key` values to `unit-icon`.
- Update the existing `sleep-reset` course to `total_lessons = 32`; do not create or replace the course.
- Wrap writes in `BEGIN` and `COMMIT`, then return a Section 3 count query.
- Push directly to `origin/journals`; do not open a pull request.
- Repository instruction forbids adding test cases. Verification must use read-only parsing and consistency commands.

---

### Task 1: Create and verify the Section 3 SQL seed

**Files:**
- Create: `supabase/seed/sleep_reset_section_3.sql`
- Include in commit: `docs/sleep-reset-section-3.yaml`

**Interfaces:**
- Consumes: the `section`, `section.units`, lesson metadata, and exercise arrays from `docs/sleep-reset-section-3.yaml`.
- Produces: a standalone SQL Editor script that upserts Section 3 records into `sections`, `units`, `nodes`, and `exercises`.

- [ ] **Step 1: Verify the source before conversion**

Run:

```bash
python - <<'PY'
import yaml
d = yaml.safe_load(open('docs/sleep-reset-section-3.yaml'))
units = d['section']['units']
lessons = [lesson for unit in units for lesson in unit['lessons']]
exercises = [exercise for lesson in lessons for exercise in lesson['exercises']]
assert len(units) == 3
assert len(lessons) == 14
assert len(exercises) == 66
print('source: 3 units, 14 lessons, 66 exercises')
PY
```

Expected: `source: 3 units, 14 lessons, 66 exercises`.

- [ ] **Step 2: Create the SQL transaction and helpers**

Create `supabase/seed/sleep_reset_section_3.sql` with:

```sql
-- Sleep Reset, Section 3: Design Your Evening
-- Run after sleep_reset_section_1.sql. Stable UUIDs and upserts make reruns safe.

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.seed_uuid(seed_value TEXT)
RETURNS UUID
LANGUAGE SQL
IMMUTABLE
STRICT
AS $function$
  SELECT (
    substr(md5(seed_value), 1, 8) || '-' ||
    substr(md5(seed_value), 9, 4) || '-' ||
    substr(md5(seed_value), 13, 4) || '-' ||
    substr(md5(seed_value), 17, 4) || '-' ||
    substr(md5(seed_value), 21, 12)
  )::uuid;
$function$;

CREATE OR REPLACE FUNCTION pg_temp.text_array(input_json JSONB)
RETURNS TEXT[]
LANGUAGE SQL
IMMUTABLE
AS $function$
  SELECT COALESCE(
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(input_json, '[]'::jsonb))),
    '{}'::text[]
  );
$function$;
```

- [ ] **Step 3: Add the section and units recordsets**

Embed JSON using `$json$...$json$::jsonb` and `jsonb_to_recordset`.

Section mapping:

- `section.id` → source ID
- `course_id` source → `sleep-reset`
- `title`, `position`, `narrative_hook`, `badge_on_complete`, `difficulty_range`, `objectives`, and `concepts_introduced` → matching section columns

Unit mapping:

- `unit.id` → source ID
- section source → `s3_evening_architecture`
- `title`, `position` → `title`, `order_index`
- `icon_key` → `unit-icon`

Use the same `INSERT ... SELECT ... ON CONFLICT (id) DO UPDATE` column lists as Section 2.

- [ ] **Step 4: Add the 14 node records**

For each lesson, create one JSON object using these exact transformations:

- `source_id = lesson.source_id`
- `unit_source_id = parent unit.id`
- `title = lesson.title`
- `type = "lesson"`
- `content_type = "lesson"`
- `pass_threshold = 80`
- `order_index = zero-based lesson position inside the unit`
- `estimated_mins = lesson.duration_minutes`
- `icon = "book"`
- `new_concepts = lesson.new_concepts`
- `review_concepts = lesson.review_concepts` when present, otherwise `[]`
- `prerequisites = []`

Upsert all node columns used by the Section 2 seed.

- [ ] **Step 5: Add the 66 exercise records**

For each exercise, create one JSON object using these exact transformations:

- `source_id = exercise.sourceId`
- `node_source_id = parent lesson.source_id`
- `order_index = zero-based exercise position inside the lesson`
- `type = exercise.category`
- `phase = exercise.phase`
- `duration_seconds = exercise.durationSeconds`
- `scaffold_level = exercise.scaffoldLevel`
- `difficulty = exercise.difficulty`
- `is_scored = exercise.isScored` when present, otherwise `false`
- `concept = exercise.concept`
- `content = exercise.content`, preserved as a JSON object without renamed or removed fields

Upsert all exercise columns used by the Section 2 seed.

- [ ] **Step 6: Finish the SQL script**

Before `COMMIT`, add:

```sql
UPDATE courses
SET total_lessons = 32
WHERE id = pg_temp.seed_uuid('sleep-reset');

COMMIT;
```

After `COMMIT`, add the same joined count query pattern as Section 2, filtered to `s3_evening_architecture`. It must return course, section, unit, node, and exercise counts.

- [ ] **Step 7: Verify SQL payloads against YAML**

Run a Python validation command that:

- extracts the four `$json$` payloads from the SQL;
- parses each with `json.loads`;
- asserts record counts `1`, `3`, `14`, and `66`;
- compares section, unit, node, and exercise source-ID sets with those derived from YAML;
- compares every SQL exercise record field and `content` object with its YAML-derived expected value;
- asserts `BEGIN`, `COMMIT`, four `ON CONFLICT (id) DO UPDATE` clauses, no `DELETE`, `total_lessons = 32`, and the final count query.

Expected: `SQL matches YAML: 1 section, 3 units, 14 nodes, 66 exercises`.

- [ ] **Step 8: Run repository checks**

Run:

```bash
git diff --check -- docs/sleep-reset-section-3.yaml supabase/seed/sleep_reset_section_3.sql
git status --short
```

Expected: no whitespace errors; only intended curriculum files plus already committed planning documentation.

- [ ] **Step 9: Commit the curriculum and seed**

Run:

```bash
git add docs/sleep-reset-section-3.yaml supabase/seed/sleep_reset_section_3.sql
git diff --cached --stat
git commit -m "feat: add Sleep Reset section 3 curriculum"
```

Expected: one commit containing only the YAML curriculum and SQL seed.

---

### Task 2: Publish directly to journals

**Files:** No file changes.

**Interfaces:**
- Consumes: verified local commits on `codex/sleep-reset-section-3-yaml`.
- Produces: those commits on `origin/journals`.

- [ ] **Step 1: Verify GitHub authentication and push scope**

Run:

```bash
gh --version
gh auth status
git status -sb
git log --oneline origin/journals..HEAD
git diff --stat origin/journals...HEAD
```

Expected: GitHub CLI authenticated; clean worktree; only the design, plan, YAML, and SQL changes are ahead of `origin/journals`.

- [ ] **Step 2: Push the exact branch head to journals**

Run:

```bash
git push origin HEAD:journals
```

Expected: remote `journals` advances to the verified local head.

- [ ] **Step 3: Verify the remote commit**

Run:

```bash
git fetch origin journals
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/journals)"
git status -sb
```

Expected: local `HEAD` equals `origin/journals`; no uncommitted changes.
