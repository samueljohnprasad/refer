# PostHog Event Catalog & Query Reference

> **Timeline Date**: 2026-10-16  
> **PostHog Project ID**: 236166  
> **API Base**: `https://us.posthog.com/api/projects/236166/query/`

---

## 1. Verified Event Catalog

| Event Name | Category | Properties | Purpose |
|---|---|---|---|
| `onboarding_started` | Onboarding | `copy_variant` | User reaches Step 0 |
| `onboarding_step_viewed` | Onboarding | `step_name`, `step_index` | Granular step exposure |
| `onboarding_step_completed` | Onboarding | `step_name`, `step_index` | Step completion |
| `onboarding_completed` | Onboarding | `total_steps` | User reaches Home from onboarding |
| `onboarding_skipped` | Onboarding | `step_name` | User tapped skip / maybe later |
| `signup_sheet_viewed` | Authentication | `source`, `copy_variant` | Account sheet mounted |
| `signup_provider_tapped` | Authentication | `provider` (`apple`/`google`), `source` | CTA clicked |
| `signup_auth_succeeded` | Authentication | `provider`, `source` | User signed in / linked |
| `signup_auth_cancelled` | Authentication | `provider`, `source` | User cancelled auth sheet *(New)* |
| `signup_auth_failed` | Authentication | `provider`, `source`, `error_message` | Auth failure detail *(New)* |
| `signup_account_conflict_detected` | Authentication | `provider`, `source` | Existing profile found *(New)* |
| `journal_entry_saved` | Core Product | `main_mood`, `has_audio`, `text_length` | Journal save telemetry *(Updated)* |

---

## 2. Benchmark HogQL Queries (Exclude Simulators)

### Query 1: Real Device Country Distribution
```sql
SELECT 
  properties.$geoip_country_name as country, 
  count(DISTINCT distinct_id) as real_users
FROM events 
WHERE timestamp >= now() - INTERVAL 20 DAY
  AND properties.$is_emulator != true
  AND properties.$os != 'Mac OS X'
GROUP BY country
ORDER BY real_users DESC
```

### Query 2: Onboarding Drop-Off by Step
```sql
SELECT 
  properties.step_name as step, 
  count(DISTINCT distinct_id) as users_reached
FROM events 
WHERE event = 'onboarding_step_viewed'
  AND timestamp >= now() - INTERVAL 20 DAY
  AND properties.$is_emulator != true
GROUP BY step
ORDER BY users_reached DESC
```

### Query 3: Apple Sign-In Conversion & Failure
```sql
SELECT 
  event, 
  count() as event_count,
  count(DISTINCT distinct_id) as unique_users
FROM events 
WHERE event IN ('signup_provider_tapped', 'signup_auth_succeeded', 'signup_auth_cancelled', 'signup_auth_failed')
  AND properties.provider = 'apple'
  AND timestamp >= now() - INTERVAL 20 DAY
  AND properties.$is_emulator != true
GROUP BY event
```

---

## 3. How to Execute Future Audits

Use local `.posthog.json` credentials to query PostHog API via `curl` (IPv4 flag required):

```bash
curl -4 -s -X POST "https://us.posthog.com/api/projects/236166/query/" \
  -H "Authorization: Bearer $(jq -r .personal_api_key .posthog.json)" \
  -H "Content-Type: application/json" \
  -d '{"query": {"kind": "HogQLQuery", "query": "SELECT event, count() FROM events WHERE timestamp >= now() - INTERVAL 20 DAY AND properties.$is_emulator != true GROUP BY event ORDER BY count() DESC"}}'
```
