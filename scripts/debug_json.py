with open("supabase/seed/sleep_reset_section_1.sql", "r") as f:
    content = f.read()

start_str = "FROM jsonb_to_recordset('["
end_str = "]'::jsonb) AS row("
idx = content.find(start_str)
while idx != -1:
    end_idx = content.find(end_str, idx)
    json_part = content[idx+len("FROM jsonb_to_recordset('"):end_idx+1]
    if '"node_source_id":"u1_1_sleep_mechanics-n1"' in json_part:
        print(json_part[-100:])
        break
    idx = content.find(start_str, idx + 1)
