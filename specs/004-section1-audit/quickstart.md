# Quickstart & Validation Guide

## 1. Apply Changes
Execute the generated Python script (from Phase 2) to rewrite the `supabase/seed/sleep_reset_section_1.sql` file in place.

```bash
python3 scripts/audit_section1.py
```

## 2. Verify JSON Syntax
Ensure the resulting SQL file is still valid.

```bash
# A simple check to ensure no obvious string termination errors
git diff supabase/seed/sleep_reset_section_1.sql
```

## 3. Apply to Database
Since this is a Supabase project and the user executes seeds directly in their remote SQL editor, the user must:
1. Copy the contents of `supabase/seed/sleep_reset_section_1.sql`.
2. Paste it into their Supabase SQL Editor.
3. Run the query.

## 4. End-to-End Test
1. Launch the Expo app.
2. Navigate to Unit 2, Lesson 4 (Light/Stress).
3. Confirm the lesson successfully completes after 3 screens instead of 7.
