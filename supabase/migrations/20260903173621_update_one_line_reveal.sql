UPDATE exercises
SET content = jsonb_set(
  jsonb_set(
    content - 'secondLine' - 'completionNote' - 'whyTitle' - 'why',
    '{instruction}', '"What should you do next?"'::jsonb
  ),
  '{options}',
  '[{"id": "opt1", "label": "Let the breath out for 6.", "isCorrect": true, "feedback": "The slightly longer exhale gives you a simple, general-purpose calming cue. Next comes Box Breathing for sharper daytime stress."}, {"id": "opt2", "label": "Hold your breath for 4.", "isCorrect": false, "feedback": "Holding comes later in Box Breathing. For basic calming, just focus on a longer exhale."}]'::jsonb
)
WHERE type = 'one_line_reveal' AND content->>'title' = 'Keep one rhythm';

UPDATE exercises
SET content = jsonb_set(
  jsonb_set(
    content - 'secondLine' - 'why',
    '{instruction}', '"What does the next tool do?"'::jsonb
  ),
  '{options}',
  '[{"id": "opt1", "label": "The next tool actively releases it.", "isCorrect": true, "feedback": "Body scan is awareness. Progressive Muscle Relaxation adds deliberate tension and release."}, {"id": "opt2", "label": "The next tool ignores it.", "isCorrect": false, "feedback": "Not quite. We don''t ignore tension; we use Progressive Muscle Relaxation to actively release it."}]'::jsonb
)
WHERE type = 'one_line_reveal' AND content->>'title' = 'Keep the difference clear';
