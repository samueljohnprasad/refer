-- ============================================================================
-- P1.1.1 — Mental Health Journey: Extend Content Tables
-- Adds mental health node types, content JSONB, and metadata columns
-- to the existing journey_system.sql tables
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. Expand journey_templates with mental health fields
-- --------------------------------------------------------------------------
ALTER TABLE journey_templates
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('general', 'anxiety', 'mood', 'stress', 'growth', 'sleep', 'anger', 'grief', 'relationships', 'self_compassion')),
  ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'beginner'
    CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS estimated_days INTEGER,
  ADD COLUMN IF NOT EXISTS total_nodes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS color_theme_key TEXT,
  ADD COLUMN IF NOT EXISTS icon_key TEXT;

-- Index for catalog browsing by category
CREATE INDEX IF NOT EXISTS idx_templates_category
  ON journey_templates(category)
  WHERE is_active = true;

-- --------------------------------------------------------------------------
-- 2. Expand journey_template_units with unlock rules
-- --------------------------------------------------------------------------
ALTER TABLE journey_template_units
  ADD COLUMN IF NOT EXISTS unlock_rule TEXT NOT NULL DEFAULT 'sequential'
    CHECK (unlock_rule IN ('sequential', 'placement_test', 'immediate'));

-- --------------------------------------------------------------------------
-- 3. Expand journey_template_nodes with mental health content
-- --------------------------------------------------------------------------

-- First drop the old node_type CHECK constraint so we can add new types
ALTER TABLE journey_template_nodes
  DROP CONSTRAINT IF EXISTS journey_template_nodes_node_type_check;

-- Re-add with expanded types
ALTER TABLE journey_template_nodes
  ADD CONSTRAINT journey_template_nodes_node_type_check
    CHECK (node_type IN (
      'lesson', 'checkpoint', 'chest',                          -- existing
      'learn', 'exercise', 'journal', 'quiz',                   -- core mental health
      'mood_check', 'practice', 'ai_insight'                    -- mental health extended
    ));

-- Add content JSONB column for rich node content
ALTER TABLE journey_template_nodes
  ADD COLUMN IF NOT EXISTS content JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS xp_reward INTEGER NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS icon_key TEXT,
  ADD COLUMN IF NOT EXISTS variant_key TEXT NOT NULL DEFAULT 'lesson';

-- Index on node_type for filtering
CREATE INDEX IF NOT EXISTS idx_template_nodes_type
  ON journey_template_nodes(node_type);

-- --------------------------------------------------------------------------
-- 4. COMMENT documentation
-- --------------------------------------------------------------------------
COMMENT ON COLUMN journey_template_nodes.content IS 'JSONB payload specific to node_type. See TypeScript NodeContent union type for shape per type.';
COMMENT ON COLUMN journey_template_nodes.xp_reward IS 'Base Insight Points awarded on completion. Bonuses (perfect quiz, streak) calculated in app.';
COMMENT ON COLUMN journey_template_nodes.variant_key IS 'Maps to ConfigDrivenNode visual variant (learn, exercise, journal, quiz, mood_check, etc.)';
COMMENT ON COLUMN journey_templates.category IS 'Content category for catalog filtering.';
COMMENT ON COLUMN journey_templates.difficulty IS 'Beginner/Intermediate/Advanced — used for placement and filtering.';

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
