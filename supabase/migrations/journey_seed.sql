-- ============================================================================
-- Journey System Seed Data
-- Seeds the first journey ("default") with 3 units mirroring mockUnits.ts
-- Run this in your Supabase SQL Editor AFTER journey_system.sql migration
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Insert the default journey template
-- ---------------------------------------------------------------------------
INSERT INTO journey_templates (id, slug, title, description, icon_url, color_scheme, sort_order, is_active, version)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'default',
  'Mindfulness Foundations',
  'Build a daily mindfulness practice with guided exercises',
  NULL,
  'green',
  1,
  true,
  1
);

-- ---------------------------------------------------------------------------
-- 2. Insert units
-- ---------------------------------------------------------------------------

-- Unit 1: Basics (green)
INSERT INTO journey_template_units (id, journey_id, unit_number, title, description, color_scheme, mascot_placements)
VALUES (
  '11000000-0000-0000-0000-000000000001',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  'Unit 1',
  'Use basic phrases, greet people',
  'green',
  '[
    {"afterNodeIndex": 3, "position": "right", "message": "Great job! Keep going! 🎉"},
    {"afterNodeIndex": 5, "position": "left", "message": "You''re on fire! 🔥"}
  ]'::jsonb
);

-- Unit 2: Intermediate (blue)
INSERT INTO journey_template_units (id, journey_id, unit_number, title, description, color_scheme, mascot_placements)
VALUES (
  '22000000-0000-0000-0000-000000000002',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2,
  'Unit 2',
  'Order food and drink, describe your family',
  'blue',
  '[
    {"afterNodeIndex": 3, "position": "right", "message": "Incredible progress! ⭐"}
  ]'::jsonb
);

-- Unit 3: Advanced (purple)
INSERT INTO journey_template_units (id, journey_id, unit_number, title, description, color_scheme, mascot_placements)
VALUES (
  '33000000-0000-0000-0000-000000000003',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3,
  'Unit 3',
  'Use the past tense, talk about travel',
  'purple',
  '[
    {"afterNodeIndex": 2, "position": "left", "message": "You''re a star learner! 🌟"}
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- 3. Insert nodes for each unit
-- ---------------------------------------------------------------------------

-- === Unit 1 nodes (8 nodes) ===
INSERT INTO journey_template_nodes (id, unit_id, node_index, node_type, task_id, rewards) VALUES
  ('11100000-0000-0000-0000-000000000000', '11000000-0000-0000-0000-000000000001', 0, 'lesson',     'task_0', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('11100000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 1, 'lesson',     'task_1', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('11100000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000001', 2, 'checkpoint', 'task_2', '[{"type": "xp", "amount": 25, "icon": "⚡"}, {"type": "gems", "amount": 5, "icon": "💎"}]'::jsonb),
  ('11100000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000001', 3, 'lesson',     'task_3', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('11100000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000001', 4, 'lesson',     'task_4', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('11100000-0000-0000-0000-000000000005', '11000000-0000-0000-0000-000000000001', 5, 'chest',      'task_5', '[{"type": "xp", "amount": 50, "icon": "⚡"}, {"type": "gems", "amount": 15, "icon": "💎"}, {"type": "hearts", "amount": 2, "icon": "❤️"}]'::jsonb),
  ('11100000-0000-0000-0000-000000000006', '11000000-0000-0000-0000-000000000001', 6, 'lesson',     'task_6', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('11100000-0000-0000-0000-000000000007', '11000000-0000-0000-0000-000000000001', 7, 'checkpoint', 'task_7', '[{"type": "xp", "amount": 25, "icon": "⚡"}, {"type": "gems", "amount": 5, "icon": "💎"}]'::jsonb);

-- === Unit 2 nodes (7 nodes) ===
INSERT INTO journey_template_nodes (id, unit_id, node_index, node_type, task_id, rewards) VALUES
  ('22200000-0000-0000-0000-000000000000', '22000000-0000-0000-0000-000000000002', 0, 'lesson',     'task_0', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('22200000-0000-0000-0000-000000000001', '22000000-0000-0000-0000-000000000002', 1, 'lesson',     'task_1', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('22200000-0000-0000-0000-000000000002', '22000000-0000-0000-0000-000000000002', 2, 'lesson',     'task_2', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('22200000-0000-0000-0000-000000000003', '22000000-0000-0000-0000-000000000002', 3, 'checkpoint', 'task_3', '[{"type": "xp", "amount": 25, "icon": "⚡"}, {"type": "gems", "amount": 5, "icon": "💎"}]'::jsonb),
  ('22200000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000002', 4, 'lesson',     'task_4', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('22200000-0000-0000-0000-000000000005', '22000000-0000-0000-0000-000000000002', 5, 'chest',      'task_5', '[{"type": "xp", "amount": 50, "icon": "⚡"}, {"type": "gems", "amount": 15, "icon": "💎"}, {"type": "hearts", "amount": 2, "icon": "❤️"}]'::jsonb),
  ('22200000-0000-0000-0000-000000000006', '22000000-0000-0000-0000-000000000002', 6, 'lesson',     'task_6', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb);

-- === Unit 3 nodes (6 nodes) ===
INSERT INTO journey_template_nodes (id, unit_id, node_index, node_type, task_id, rewards) VALUES
  ('33300000-0000-0000-0000-000000000000', '33000000-0000-0000-0000-000000000003', 0, 'lesson',     'task_0', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('33300000-0000-0000-0000-000000000001', '33000000-0000-0000-0000-000000000003', 1, 'lesson',     'task_1', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('33300000-0000-0000-0000-000000000002', '33000000-0000-0000-0000-000000000003', 2, 'checkpoint', 'task_2', '[{"type": "xp", "amount": 25, "icon": "⚡"}, {"type": "gems", "amount": 5, "icon": "💎"}]'::jsonb),
  ('33300000-0000-0000-0000-000000000003', '33000000-0000-0000-0000-000000000003', 3, 'lesson',     'task_3', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb),
  ('33300000-0000-0000-0000-000000000004', '33000000-0000-0000-0000-000000000003', 4, 'chest',      'task_4', '[{"type": "xp", "amount": 50, "icon": "⚡"}, {"type": "gems", "amount": 15, "icon": "💎"}, {"type": "hearts", "amount": 2, "icon": "❤️"}]'::jsonb),
  ('33300000-0000-0000-0000-000000000005', '33000000-0000-0000-0000-000000000003', 5, 'lesson',     'task_5', '[{"type": "xp", "amount": 10, "icon": "⚡"}]'::jsonb);

-- ---------------------------------------------------------------------------
-- 4. Reload PostgREST schema cache so new RPC functions are visible
-- ---------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
