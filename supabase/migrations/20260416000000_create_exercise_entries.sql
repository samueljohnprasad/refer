-- =============================================================================
-- Unified exercise_entries table
-- Replaces: thought_catcher_entries, thought_reframing_entries, gratitude_entries
-- =============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.exercise_entries (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_type   TEXT        NOT NULL,
    schema_version  INT         NOT NULL DEFAULT 1,
    status          TEXT        NOT NULL DEFAULT 'draft',
    current_step    TEXT        NOT NULL,
    completed_steps JSONB       NOT NULL DEFAULT '[]',
    step_index      INT         NOT NULL DEFAULT 0,
    response        JSONB       NOT NULL DEFAULT '{}',
    step_timings    JSONB       NOT NULL DEFAULT '{}',
    selected_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

-- 2. Enable RLS
ALTER TABLE public.exercise_entries ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy — users can only touch their own rows
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'Users can manage their own exercise entries'
    ) THEN
        CREATE POLICY "Users can manage their own exercise entries"
            ON public.exercise_entries
            FOR ALL
            USING  (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 4. updated_at trigger (reuses existing function from fix_all_cbt_tables migration)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_exercise_entries_updated_at'
    ) THEN
        CREATE TRIGGER set_exercise_entries_updated_at
            BEFORE UPDATE ON public.exercise_entries
            FOR EACH ROW
            EXECUTE FUNCTION public.set_current_timestamp_updated_at();
    END IF;
END $$;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS exercise_entries_user_id_idx
    ON public.exercise_entries(user_id);

CREATE INDEX IF NOT EXISTS exercise_entries_exercise_type_idx
    ON public.exercise_entries(exercise_type);

CREATE INDEX IF NOT EXISTS exercise_entries_status_idx
    ON public.exercise_entries(status);

-- Composite: history queries (user + type + status)
CREATE INDEX IF NOT EXISTS exercise_entries_user_type_status_idx
    ON public.exercise_entries(user_id, exercise_type, status);

-- Composite: calendar view (user + date)
CREATE INDEX IF NOT EXISTS exercise_entries_user_date_idx
    ON public.exercise_entries(user_id, selected_date);

-- Composite: sorted history (user + created_at desc)
CREATE INDEX IF NOT EXISTS exercise_entries_user_created_idx
    ON public.exercise_entries(user_id, created_at DESC);

-- =============================================================================
-- 6. Data migration — copy existing entries from old per-exercise tables
-- =============================================================================

DO $$
BEGIN
    -- ── Thought Catcher entries ──────────────────────────────────────────
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'thought_catcher_entries'
    ) THEN
        INSERT INTO public.exercise_entries (
            id, user_id, exercise_type, schema_version, status,
            current_step, completed_steps, step_index,
            response, step_timings, selected_date,
            created_at, updated_at, completed_at
        )
        SELECT
            id,
            user_id,
            'thought_catcher',
            1,
            CASE
                WHEN status = 'completed' THEN 'completed'
                WHEN status = 'intro' THEN 'draft'
                ELSE 'in_progress'
            END,
            COALESCE(status, 'intro'),
            '[]'::jsonb,
            0,
            jsonb_build_object(
                'situation',        COALESCE(situation, ''),
                'automaticThought', COALESCE(automatic_thought, ''),
                'intensity',        COALESCE(intensity, 50),
                'isTrue',           is_true,
                'balancedThought',  balanced_thought
            ),
            '{}'::jsonb,
            COALESCE(selected_date, CURRENT_DATE),
            created_at,
            updated_at,
            CASE WHEN status = 'completed' THEN updated_at ELSE NULL END
        FROM public.thought_catcher_entries
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- ── Thought Reframing entries ────────────────────────────────────────
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'thought_reframing_entries'
    ) THEN
        INSERT INTO public.exercise_entries (
            id, user_id, exercise_type, schema_version, status,
            current_step, completed_steps, step_index,
            response, step_timings, selected_date,
            created_at, updated_at, completed_at
        )
        SELECT
            id,
            user_id,
            'thought_reframing',
            1,
            CASE
                WHEN completed = TRUE THEN 'completed'
                WHEN status = 'intro' THEN 'draft'
                ELSE 'in_progress'
            END,
            COALESCE(status, 'intro'),
            '[]'::jsonb,
            0,
            jsonb_build_object(
                'situation',            COALESCE(situation, ''),
                'automaticThought',     COALESCE(automatic_thought, ''),
                'selectedEmotions',     COALESCE(emotions, '[]'::jsonb),
                'selectedDistortions',  COALESCE(cognitive_distortions, '[]'::jsonb),
                'evidenceFor',          COALESCE(evidence_for, '[]'::jsonb),
                'evidenceAgainst',      COALESCE(evidence_against, '[]'::jsonb),
                'balancedThought',      COALESCE(balanced_thought, '')
            ),
            '{}'::jsonb,
            COALESCE(selected_date, CURRENT_DATE),
            created_at,
            updated_at,
            CASE WHEN completed = TRUE THEN updated_at ELSE NULL END
        FROM public.thought_reframing_entries
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- ── Gratitude entries ────────────────────────────────────────────────
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'gratitude_entries'
    ) THEN
        INSERT INTO public.exercise_entries (
            id, user_id, exercise_type, schema_version, status,
            current_step, completed_steps, step_index,
            response, step_timings, selected_date,
            created_at, updated_at, completed_at
        )
        SELECT
            id,
            user_id,
            'gratitude_reframe',
            1,
            CASE
                WHEN status = 'completed' THEN 'completed'
                WHEN status = 'intro' THEN 'draft'
                ELSE 'in_progress'
            END,
            COALESCE(status, 'intro'),
            '[]'::jsonb,
            0,
            jsonb_build_object(
                'currentMood',         current_mood,
                'moodIntensity',       COALESCE(mood_intensity, 50),
                'selectedPrompt',      COALESCE(selected_prompt, ''),
                'gratitudeEntries',    COALESCE(gratitude_entries, '[]'::jsonb),
                'finalMoodIntensity',  COALESCE(final_mood_intensity, 50)
            ),
            '{}'::jsonb,
            COALESCE(selected_date, CURRENT_DATE),
            created_at,
            COALESCE(updated_at, created_at),
            CASE WHEN status = 'completed' THEN COALESCE(updated_at, created_at) ELSE NULL END
        FROM public.gratitude_entries
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
