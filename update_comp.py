import sys

with open('supabase/seed/sleep_reset_section_1.sql', 'r') as f:
    content = f.read()

with open('old_comp.txt', 'r') as f:
    old_text = f.read().strip()

new_text = '"category":"evening_comparison","format":"evening_comparison","completionMode":"direct","primaryLabel":"Continue","title":"Two weeks, one body clock","columns":[{"heading":"Week A","rows":["Wake time shifts 3 hours","Workday light only","Groggy Monday"],"outcome":"Mixed timing cues"},{"heading":"Week B","rows":["Wake time stays within 1 hour","Morning light daily","Stable Monday"],"outcome":"Clearer timing cues"}],"explanation":"Consistent cues help your body clock stay predictable."'

if old_text in content:
    content = content.replace(old_text, new_text)
    with open('supabase/seed/sleep_reset_section_1.sql', 'w') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Old text not found")

