-- Ensure each content table has at most one row per node so seed upserts work.
CREATE UNIQUE INDEX IF NOT EXISTS lesson_contents_node_id_key
  ON lesson_contents (node_id);

CREATE UNIQUE INDEX IF NOT EXISTS quiz_contents_node_id_key
  ON quiz_contents (node_id);

CREATE UNIQUE INDEX IF NOT EXISTS exercise_contents_node_id_key
  ON exercise_contents (node_id);

CREATE UNIQUE INDEX IF NOT EXISTS practice_contents_node_id_key
  ON practice_contents (node_id);

CREATE UNIQUE INDEX IF NOT EXISTS story_contents_node_id_key
  ON story_contents (node_id);
