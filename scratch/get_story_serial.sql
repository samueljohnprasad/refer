SELECT id, node_id, content->>'title' as title FROM exercises WHERE type = 'story_serial';
