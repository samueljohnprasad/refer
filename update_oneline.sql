UPDATE exercises
SET content = jsonb_set(
    jsonb_set(
        content,
        '{instruction}',
        '"Try the next breath."'::jsonb
    ),
    '{options}',
    '[{"id": "opt1", "label": "Let the breath out for 6.", "isCorrect": true, "feedback": "A slightly longer exhale can help your body settle."}, {"id": "opt2", "label": "Hold your breath for 4.", "isCorrect": false, "feedback": "For this rhythm: 4 in -> 6 out.\n\nHolding comes later."}]'::jsonb
)
WHERE type = 'one_line_reveal' AND content->>'title' = 'Keep one rhythm';

UPDATE exercises
SET content = jsonb_set(
    jsonb_set(
        content,
        '{instruction}',
        '"Which rhythm comes next?"'::jsonb
    ),
    '{options}',
    '[{"id": "opt1", "label": "Breathe out for 6.", "isCorrect": false, "feedback": "Wait until you finish your inhale!"}, {"id": "opt2", "label": "Hold for 4.", "isCorrect": true, "feedback": "The hold adds slight challenge, building up your nervous system''s tolerance."}]'::jsonb
)
WHERE type = 'one_line_reveal' AND content->>'title' = 'Keep the difference clear';
