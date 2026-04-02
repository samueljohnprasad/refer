-- ============================================
-- PUSH NOTIFICATION CRON JOBS
-- Run these in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Main notification dispatcher - runs every 15 minutes
SELECT cron.schedule(
  'notification-dispatcher',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://xaqeueshxpehijtxwklo.supabase.co/functions/v1/notification-dispatcher',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NjY4MywiZXhwIjoyMDY4MTcyNjgzfQ.V5jpUlbJsNQAOH4jFjwfjSG4MK4SA2vVnAKLI99mPlE"}'::jsonb,
    body := jsonb_build_object('sweep_time', now()),
    timeout_milliseconds := 300000
  ) AS request_id;
  $$
);

-- 2. Nightly send-time optimizer - runs at 3 AM UTC
SELECT cron.schedule(
  'compute-send-times',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://xaqeueshxpehijtxwklo.supabase.co/functions/v1/compute-send-times',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NjY4MywiZXhwIjoyMDY4MTcyNjgzfQ.V5jpUlbJsNQAOH4jFjwfjSG4MK4SA2vVnAKLI99mPlE"}'::jsonb,
    body := jsonb_build_object('run_time', now()),
    timeout_milliseconds := 60000
  ) AS request_id;
  $$
);

-- 3. Nightly bandit stats updater - runs at 4 AM UTC
SELECT cron.schedule(
  'update-bandit-stats',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://xaqeueshxpehijtxwklo.supabase.co/functions/v1/update-bandit-stats',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NjY4MywiZXhwIjoyMDY4MTcyNjgzfQ.V5jpUlbJsNQAOH4jFjwfjSG4MK4SA2vVnAKLI99mPlE"}'::jsonb,
    body := jsonb_build_object('run_time', now()),
    timeout_milliseconds := 300000
  ) AS request_id;
  $$
);

-- 4. Optional: Receipt checker - runs every 30 minutes
SELECT cron.schedule(
  'check-push-receipts',
  '15,45 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://xaqeueshxpehijtxwklo.supabase.co/functions/v1/check-push-receipts',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcWV1ZXNoeHBlaGlqdHh3a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NjY4MywiZXhwIjoyMDY4MTcyNjgzfQ.V5jpUlbJsNQAOH4jFjwfjSG4MK4SA2vVnAKLI99mPlE"}'::jsonb,
    body := jsonb_build_object('check_time', now()),
    timeout_milliseconds := 60000
  ) AS request_id;
  $$
);

-- ============================================
-- VERIFY CRON JOBS
-- ============================================

-- List all scheduled jobs
SELECT * FROM cron.job;

-- Check next run times
SELECT jobname, schedule, next_run, active 
FROM cron.job 
ORDER BY next_run;
