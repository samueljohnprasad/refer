UPDATE exercises
SET
  type = 'timeline_rewind'
WHERE content->>'title' ILIKE '%Arun%'
RETURNING id, type;
