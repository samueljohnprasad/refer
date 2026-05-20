-- ============================================================================
-- Journey Map v5 — PRD §3 Schema
-- Migration: 20260428000000_journey_map_v5.sql
--
-- Creates the normalized hierarchy:
--   courses → sections → units → nodes
--   + 6 content type tables (one per node type)
--   + 4 progress/attempt tables (user-specific)
--
-- These are NEW tables alongside the legacy journey_templates system.
-- Legacy tables are untouched; both systems coexist during the transition.
-- ============================================================================

-- ── 1. Content hierarchy tables (read-only at runtime) ──────────────────────

CREATE TABLE IF NOT EXISTS courses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  description  TEXT,
  icon_url     TEXT,
  color_hex    TEXT        NOT NULL DEFAULT '4A90D9',
  order_index  INT         NOT NULL DEFAULT 0,
  is_published BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES courses(id)  ON DELETE CASCADE,
  title       TEXT NOT NULL,
  order_index INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS units (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id  UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  icon_key    TEXT NOT NULL DEFAULT 'default',
  order_index INT  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nodes (
  id             UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id        UUID    NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title          TEXT    NOT NULL,
  type           TEXT    NOT NULL
                 CHECK (type IN ('lesson','story','quiz',
                                 'exercise','practice','challenge','boss')),
  content_id     UUID,
  content_type   TEXT,
  pass_threshold INT     CHECK (pass_threshold BETWEEN 0 AND 100),
  order_index    INT     NOT NULL DEFAULT 0,
  estimated_mins INT     NOT NULL DEFAULT 5
);

-- ── 2. Content tables (one per node type) ─────────────────────────────────

-- screens: [{ order, type:'text'|'image', body?, url?, caption? }]
CREATE TABLE IF NOT EXISTS lesson_contents (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id    UUID        NOT NULL UNIQUE REFERENCES nodes(id) ON DELETE CASCADE,
  screens    JSONB       NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- questions: [{ id, order, text, type:'single_choice'|'multi_choice'|'true_false',
--               options:[{id,text,isCorrect}], explanation }]
CREATE TABLE IF NOT EXISTS quiz_contents (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id    UUID        NOT NULL UNIQUE REFERENCES nodes(id) ON DELETE CASCADE,
  questions  JSONB       NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- steps: [{ order, type:'text'|'prompt', body, responseType?:'free_text'|'scale'|'multi_choice' }]
CREATE TABLE IF NOT EXISTS exercise_contents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id     UUID        NOT NULL UNIQUE REFERENCES nodes(id) ON DELETE CASCADE,
  instruction TEXT        NOT NULL,
  steps       JSONB       NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- steps: [{ order, type:'timed'|'instruction', instruction, durationSecs? }]
CREATE TABLE IF NOT EXISTS practice_contents (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id      UUID        NOT NULL UNIQUE REFERENCES nodes(id) ON DELETE CASCADE,
  instruction  TEXT        NOT NULL,
  steps        JSONB       NOT NULL DEFAULT '[]',
  repeat_count INT         NOT NULL DEFAULT 4,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- dialogues: [{ order, type:'dialogue'|'choice', speaker?, text?, options?:[{text,next}] }]
CREATE TABLE IF NOT EXISTS story_contents (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id    UUID        NOT NULL UNIQUE REFERENCES nodes(id) ON DELETE CASCADE,
  dialogues  JSONB       NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. Progress tables (user-specific) ────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_course_progress (
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id    UUID        NOT NULL REFERENCES courses(id)    ON DELETE CASCADE,
  status       TEXT        NOT NULL DEFAULT 'in_progress'
               CHECK (status IN ('in_progress','completed')),
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY  (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS user_node_progress (
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id           UUID        NOT NULL REFERENCES nodes(id)      ON DELETE CASCADE,
  status            TEXT        NOT NULL
                    CHECK (status IN ('in_progress','attempted','completed')),
  attempts          INT         NOT NULL DEFAULT 0,
  best_score        INT,
  last_score        INT,
  last_attempted_at TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  PRIMARY KEY  (user_id, node_id)
);

-- submitted_at = NULL  → pending (opened, not yet submitted)
-- submitted_at = SET   → closed  (attempt submitted)
CREATE TABLE IF NOT EXISTS node_attempts (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id        UUID        NOT NULL REFERENCES nodes(id)      ON DELETE CASCADE,
  score          INT         CHECK (score BETWEEN 0 AND 100),
  attempt_number INT         NOT NULL,
  started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_node_responses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id)   ON DELETE CASCADE,
  node_id      UUID        NOT NULL REFERENCES nodes(id)         ON DELETE CASCADE,
  attempt_id   UUID        NOT NULL REFERENCES node_attempts(id) ON DELETE CASCADE,
  responses    JSONB       NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. Performance indexes ─────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_sections_course_id   ON sections(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_units_section_id     ON units(section_id, order_index);
CREATE INDEX IF NOT EXISTS idx_nodes_unit_id        ON nodes(unit_id, order_index);
CREATE INDEX IF NOT EXISTS idx_node_attempts_user   ON node_attempts(user_id, node_id);
CREATE INDEX IF NOT EXISTS idx_node_attempts_pending
  ON node_attempts(user_id, node_id, submitted_at)
  WHERE submitted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_user_node_progress_course
  ON user_node_progress(user_id, node_id);

-- ── 5. Row-Level Security ─────────────────────────────────────────────────

ALTER TABLE user_course_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_node_progress    ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_attempts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_node_responses   ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_course_progress' AND policyname='own_course_progress') THEN
    CREATE POLICY "own_course_progress" ON user_course_progress FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_node_progress' AND policyname='own_node_progress') THEN
    CREATE POLICY "own_node_progress" ON user_node_progress FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='node_attempts' AND policyname='own_attempts') THEN
    CREATE POLICY "own_attempts" ON node_attempts FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_node_responses' AND policyname='own_responses') THEN
    CREATE POLICY "own_responses" ON user_node_responses FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='courses' AND policyname='read_courses') THEN
    CREATE POLICY "read_courses" ON courses FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sections' AND policyname='read_sections') THEN
    CREATE POLICY "read_sections" ON sections FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='units' AND policyname='read_units') THEN
    CREATE POLICY "read_units" ON units FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='nodes' AND policyname='read_nodes') THEN
    CREATE POLICY "read_nodes" ON nodes FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='lesson_contents' AND policyname='read_lesson') THEN
    CREATE POLICY "read_lesson" ON lesson_contents FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='quiz_contents' AND policyname='read_quiz') THEN
    CREATE POLICY "read_quiz" ON quiz_contents FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='exercise_contents' AND policyname='read_exercise') THEN
    CREATE POLICY "read_exercise" ON exercise_contents FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='practice_contents' AND policyname='read_practice') THEN
    CREATE POLICY "read_practice" ON practice_contents FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='story_contents' AND policyname='read_story') THEN
    CREATE POLICY "read_story" ON story_contents FOR SELECT USING (auth.role()='authenticated');
  END IF;
END $$;

-- Enable RLS on content tables
ALTER TABLE courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE units            ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_contents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_contents    ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_contents   ENABLE ROW LEVEL SECURITY;
