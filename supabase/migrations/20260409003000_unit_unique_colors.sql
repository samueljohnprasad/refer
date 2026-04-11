-- ============================================================================
-- Anxiety Toolkit unit color normalization
-- Each unit gets its own muted color theme.
-- Each section keeps the color of the first unit in that section.
-- ============================================================================

DO $$
DECLARE
  v_journey_id UUID := 'b1000000-aaaa-4000-8000-000000000001';
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM journey_templates
    WHERE id = v_journey_id
  ) THEN
    RETURN;
  END IF;

  -- Section 1
  UPDATE journey_template_units
  SET color_scheme = 'blue'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000001';

  UPDATE journey_template_units
  SET color_scheme = 'green'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000101';

  UPDATE journey_template_units
  SET color_scheme = 'purple'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000102';

  UPDATE journey_template_sections
  SET color_scheme = 'blue'
  WHERE journey_id = v_journey_id AND section_number = 1;

  -- Section 2
  UPDATE journey_template_units
  SET color_scheme = 'purple'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000002';

  UPDATE journey_template_units
  SET color_scheme = 'blue'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000201';

  UPDATE journey_template_units
  SET color_scheme = 'orange'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000202';

  UPDATE journey_template_sections
  SET color_scheme = 'purple'
  WHERE journey_id = v_journey_id AND section_number = 2;

  -- Section 3
  UPDATE journey_template_units
  SET color_scheme = 'green'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000003';

  UPDATE journey_template_units
  SET color_scheme = 'blue'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000301';

  UPDATE journey_template_units
  SET color_scheme = 'purple'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000302';

  UPDATE journey_template_sections
  SET color_scheme = 'green'
  WHERE journey_id = v_journey_id AND section_number = 3;

  -- Section 4
  UPDATE journey_template_units
  SET color_scheme = 'orange'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000004';

  UPDATE journey_template_units
  SET color_scheme = 'blue'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000401';

  UPDATE journey_template_units
  SET color_scheme = 'purple'
  WHERE id = 'b1100000-aaaa-4000-8000-000000000402';

  UPDATE journey_template_sections
  SET color_scheme = 'orange'
  WHERE journey_id = v_journey_id AND section_number = 4;
END $$;

NOTIFY pgrst, 'reload schema';
