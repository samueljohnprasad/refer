-- Migration: Unique Timeline RPCs
-- Date: 2026-07-24
-- Description: Adds RPCs to efficiently fetch unique journal dates and weeks for timeline pagination

-- 1. Daily Timeline RPC
CREATE OR REPLACE FUNCTION get_unique_journal_dates(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (selected_date DATE) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT (jr.selected_date::DATE) AS selected_date
  FROM journal_records jr
  WHERE jr.user_id = p_user_id
  ORDER BY (jr.selected_date::DATE) DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;


-- 2. Weekly Timeline RPC
-- Extracts the ISO Year and ISO Week, then groups by them to return unique weeks
CREATE OR REPLACE FUNCTION get_unique_journal_weeks(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (iso_year INT, iso_week INT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    CAST(EXTRACT(isoyear FROM jr.selected_date) AS INT) AS iso_year, 
    CAST(EXTRACT(week FROM jr.selected_date) AS INT) AS iso_week
  FROM journal_records jr
  WHERE jr.user_id = p_user_id
  ORDER BY 
    CAST(EXTRACT(isoyear FROM jr.selected_date) AS INT) DESC, 
    CAST(EXTRACT(week FROM jr.selected_date) AS INT) DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 3. Monthly Timeline RPC
-- Extracts the Year and Month, then groups by them to return unique months
CREATE OR REPLACE FUNCTION get_unique_journal_months(p_user_id UUID, p_limit INT, p_offset INT)
RETURNS TABLE (year_num INT, month_num INT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    CAST(EXTRACT(year FROM jr.selected_date) AS INT) AS year_num, 
    CAST(EXTRACT(month FROM jr.selected_date) AS INT) AS month_num
  FROM journal_records jr
  WHERE jr.user_id = p_user_id
  ORDER BY 
    CAST(EXTRACT(year FROM jr.selected_date) AS INT) DESC, 
    CAST(EXTRACT(month FROM jr.selected_date) AS INT) DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
