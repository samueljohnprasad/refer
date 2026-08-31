import sys

with open('supabase/seed/sleep_reset_section_1.sql', 'r') as f:
    content = f.read()

with open('temp_search.txt', 'r') as f:
    search_str = f.read().strip()

replace_str = '"category":"breathing_round","format":"breathing_round","completionMode":"direct","primaryLabel":"Continue","title":"One longer exhale","instruction":"One gentle round to ease alertness.","hideFooterUntilReady":true,"variation":"The goal is less struggling, not instant sleep."'

if search_str in content:
    content = content.replace(search_str, replace_str)
    with open('supabase/seed/sleep_reset_section_1.sql', 'w') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Search string not found")

