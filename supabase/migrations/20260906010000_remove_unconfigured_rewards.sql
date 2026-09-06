-- Remove generated reward nodes from units without authored reward content.
BEGIN;

DELETE FROM nodes AS node
USING units AS unit, sections AS section
WHERE node.unit_id = unit.id
  AND unit.section_id = section.id
  AND section.title IN ('Calm the Body', 'Design Your Evening')
  AND node.type IN ('chest', 'trophy')
  AND node.title IN ('Insight chest', 'Unit trophy');

UPDATE units AS unit
SET reward_content = NULL
FROM sections AS section
WHERE unit.section_id = section.id
  AND section.title IN ('Calm the Body', 'Design Your Evening');

COMMIT;
