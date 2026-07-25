-- Migration: Unique Timeline RPCs
-- Date: 2026-07-24
-- Description: Adds RPCs to efficiently fetch unique journal dates and weeks for timeline pagination

-- 1. Daily Timeline RPC (Timezone aware)
CREATE OR REPLACE FUNCTION get_unique_journal_dates(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (selected_date DATE) AS $$
DECLARE
  v_tz TEXT := 'UTC';
BEGIN
  SELECT COALESCE(timezone, 'UTC') INTO v_tz FROM user_preferences WHERE user_id = p_user_id LIMIT 1;

  RETURN QUERY
  SELECT DISTINCT (jr.selected_date AT TIME ZONE v_tz)::DATE AS selected_date
  FROM journal_records jr
  WHERE jr.user_id = p_user_id
  ORDER BY selected_date DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;


-- 2. Weekly Timeline RPC (Timezone aware)
-- Extracts the ISO Year and ISO Week in user's local timezone, then groups by them
CREATE OR REPLACE FUNCTION get_unique_journal_weeks(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (iso_year INT, iso_week INT) AS $$
DECLARE
  v_tz TEXT := 'UTC';
BEGIN
  SELECT COALESCE(timezone, 'UTC') INTO v_tz FROM user_preferences WHERE user_id = p_user_id LIMIT 1;

  RETURN QUERY
  SELECT DISTINCT 
    CAST(EXTRACT(isoyear FROM (jr.selected_date AT TIME ZONE v_tz)) AS INT) AS iso_year, 
    CAST(EXTRACT(week FROM (jr.selected_date AT TIME ZONE v_tz)) AS INT) AS iso_week
  FROM journal_records jr
  WHERE jr.user_id = p_user_id
  ORDER BY iso_year DESC, iso_week DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 3. Monthly Timeline RPC (Timezone aware)
-- Extracts the Year and Month in user's local timezone, then groups by them
CREATE OR REPLACE FUNCTION get_unique_journal_months(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (year_num INT, month_num INT) AS $$
DECLARE
  v_tz TEXT := 'UTC';
BEGIN
  SELECT COALESCE(timezone, 'UTC') INTO v_tz FROM user_preferences WHERE user_id = p_user_id LIMIT 1;

  RETURN QUERY
  SELECT DISTINCT 
    CAST(EXTRACT(year FROM (jr.selected_date AT TIME ZONE v_tz)) AS INT) AS year_num, 
    CAST(EXTRACT(month FROM (jr.selected_date AT TIME ZONE v_tz)) AS INT) AS month_num
  FROM journal_records jr
  WHERE jr.user_id = p_user_id
  ORDER BY year_num DESC, month_num DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
